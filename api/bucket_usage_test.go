// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg/usage"
	"github.com/minio/minio-go/v7"
)

type bucketUsageStoreMock struct {
	sync.Mutex
	record        usage.Record
	reads, queued []string
	err           error
}

func (s *bucketUsageStoreMock) Ping(context.Context) error { return s.err }
func (s *bucketUsageStoreMock) Coverage(context.Context) (usage.Coverage, error) {
	return usage.Coverage{}, nil
}
func (s *bucketUsageStoreMock) Get(_ context.Context, bucket string) (usage.Record, error) {
	s.Lock()
	defer s.Unlock()
	s.reads = append(s.reads, bucket)
	record := s.record
	record.Bucket = bucket
	return record, s.err
}
func (s *bucketUsageStoreMock) Queue(_ context.Context, bucket string, _ bool, _, _ time.Duration, _ *time.Time) error {
	s.Lock()
	defer s.Unlock()
	s.queued = append(s.queued, bucket)
	return s.err
}

type usageListingMock func(context.Context, string, minio.ListObjectsOptions) <-chan minio.ObjectInfo

func (f usageListingMock) ListObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	return f(ctx, bucket, opts)
}
func usageAPIFixture(t *testing.T, deniedRoot, deniedVersions bool) *bucketUsageStoreMock {
	t.Helper()
	t.Setenv("CONSOLE_USAGE_DATABASE_URL", "postgres://fixture-unused")
	now := time.Now().UTC()
	snapshot := &usage.Snapshot{Totals: usage.Stats{CurrentBytes: "9007199254740993", CurrentObjects: 2, RetainedBytes: "123", RetainedVersions: 7, DeleteMarkers: 3}, ScannedEntries: 12, StartedAt: now, UpdatedAt: now}
	store := &bucketUsageStoreMock{record: usage.Record{State: "complete", LastGood: snapshot, Progress: snapshot, LeaseToken: "private-lease", Checkpoint: &usage.Checkpoint{Generation: 1, LastKey: "private-object-key", Snapshot: *snapshot}}}
	originalStore, originalClient := openBucketUsageStore, newBucketUsageAuthorizationClient
	t.Cleanup(func() { openBucketUsageStore = originalStore; newBucketUsageAuthorizationClient = originalClient })
	openBucketUsageStore = func(context.Context, usage.Config) (bucketUsageStore, error) { return store, nil }
	newBucketUsageAuthorizationClient = func(*models.Principal, *http.Request) (usage.ListingClient, error) {
		return usageListingMock(func(_ context.Context, _ string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
			out := make(chan minio.ObjectInfo, 1)
			if opts.MaxKeys != 1 || !opts.Recursive {
				t.Error("authorization probe is not bounded to root metadata")
			}
			if (!opts.WithVersions && deniedRoot) || (opts.WithVersions && deniedVersions) {
				out <- minio.ObjectInfo{Err: minio.ErrorResponse{Code: "AccessDenied"}}
			}
			close(out)
			return out
		}), nil
	}
	return store
}
func TestBucketUsageNeverDisclosesOrQueuesForAnUnprivilegedCaller(t *testing.T) {
	store := usageAPIFixture(t, true, true)
	response, err := getBucketUsageResponse(httptest.NewRequest("POST", "/bucket-usage/refresh", nil), &models.BucketUsageRequest{Buckets: []string{"private-bucket"}}, prefixUsagePrincipal(), true)
	if err != nil {
		t.Fatal(err)
	}
	if len(response.Buckets) != 1 || *response.Buckets[0].State != "forbidden" || response.Buckets[0].LastGood != nil {
		t.Fatal("forbidden aggregate was disclosed")
	}
	if len(store.reads) != 0 || len(store.queued) != 0 {
		t.Fatal("worker credentials bypassed caller authorization")
	}
}
func TestBucketUsageRedactsRetainedMetadataAndPrivateJobState(t *testing.T) {
	usageAPIFixture(t, false, true)
	response, err := getBucketUsageResponse(httptest.NewRequest("POST", "/bucket-usage/status", nil), &models.BucketUsageRequest{Buckets: []string{"visible-bucket"}}, prefixUsagePrincipal(), false)
	if err != nil {
		t.Fatal(err)
	}
	row := response.Buckets[0]
	if *row.VersionsVisible || row.LastGood.Totals.RetainedBytes != nil || row.LastGood.Totals.RetainedVersions != nil || row.LastGood.Totals.DeleteMarkers != nil || *row.LastGood.ScannedEntries != 2 {
		t.Fatal("version-only information was disclosed through current usage")
	}
	if *row.LastGood.Totals.CurrentBytes != "9007199254740993" {
		t.Fatal("current bytes lost integer precision")
	}
	public, marshalErr := json.Marshal(response)
	if marshalErr != nil {
		t.Fatal(marshalErr)
	}
	for _, secret := range []string{"private-lease", "private-object-key", "retained_bytes", "retained_versions", "delete_markers", "last_key"} {
		if strings.Contains(string(public), secret) {
			t.Fatalf("response disclosed %s", secret)
		}
	}
}
func TestBucketUsageRefreshReturnsPrioritizedPendingWorkAndDeduplicatesNames(t *testing.T) {
	store := usageAPIFixture(t, false, false)
	store.record.State = "queued"
	response, err := getBucketUsageResponse(httptest.NewRequest("POST", "/bucket-usage/refresh", nil), &models.BucketUsageRequest{Buckets: []string{"visible-bucket", "visible-bucket"}}, prefixUsagePrincipal(), true)
	if err != nil {
		t.Fatal(err)
	}
	if len(store.queued) != 1 || len(response.Buckets) != 1 || *response.Buckets[0].State != "queued" || !*response.Buckets[0].VersionsVisible || response.Buckets[0].LastGood.Totals.RetainedBytes == nil {
		t.Fatal("refresh was duplicated or falsely reported complete")
	}
	if err := response.Validate(nil); err != nil {
		t.Fatal(err)
	}
}
func TestBucketUsageDisabledModeIsExplicitAndDoesNotOpenDatabase(t *testing.T) {
	t.Setenv("CONSOLE_USAGE_DATABASE_URL", "")
	original := openBucketUsageStore
	t.Cleanup(func() { openBucketUsageStore = original })
	openBucketUsageStore = func(context.Context, usage.Config) (bucketUsageStore, error) {
		t.Fatal("disabled mode opened a database")
		return nil, nil
	}
	response, err := getBucketUsageResponse(httptest.NewRequest("POST", "/bucket-usage/status", nil), &models.BucketUsageRequest{Buckets: []string{"visible-bucket"}}, prefixUsagePrincipal(), false)
	if err != nil || response == nil || *response.Enabled {
		t.Fatal("optional persistent mode is not explicit")
	}
}
func TestBucketUsageFailuresDoNotExposeDatabaseCredentials(t *testing.T) {
	store := usageAPIFixture(t, false, false)
	store.err = errors.New("postgres://private-password@internal-database")
	response, err := getBucketUsageResponse(httptest.NewRequest("POST", "/bucket-usage/status", nil), &models.BucketUsageRequest{Buckets: []string{"visible-bucket"}}, prefixUsagePrincipal(), false)
	if response != nil || err == nil || err.Code != 503 || strings.Contains(err.APIError.Message, "private") {
		t.Fatal("state store failure was hidden or exposed credentials")
	}
}
func TestBucketUsageRequiresSignedInSession(t *testing.T) {
	response, err := getBucketUsageResponse(httptest.NewRequest("POST", "/bucket-usage/refresh", nil), &models.BucketUsageRequest{Buckets: []string{"visible-bucket"}}, nil, true)
	if response != nil || err == nil || err.Code != 401 {
		t.Fatal("anonymous usage request accepted")
	}
	// Keep zero-valued required booleans explicit, not omitted from API results.
	body, _ := json.Marshal(bucketUsageState("visible-bucket", "forbidden", "Not permitted"))
	if !strings.Contains(string(body), `"versions_visible":false`) {
		t.Fatal("unknown visibility is being misrepresented")
	}
}
