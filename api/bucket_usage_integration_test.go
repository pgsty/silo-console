//go:build integration && storageintegration

// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later
package api

import (
	"context"
	"fmt"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/usage"
	madmin "github.com/minio/madmin-go/v3"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// This test uses real caller IAM checks and the PostgreSQL queue. Setup must be
// explicit; credentials and endpoint must refer to the disposable SILO fixture.
func TestNativeBucketUsageHonorsServerPermissionsAndRevocation(t *testing.T) {
	endpoint, access, secret, dsn := os.Getenv("TEST_USAGE_S3_ENDPOINT"), os.Getenv("TEST_USAGE_S3_ACCESS_KEY"), os.Getenv("TEST_USAGE_S3_SECRET_KEY"), os.Getenv("TEST_USAGE_DATABASE_URL")
	if endpoint == "" || access == "" || secret == "" || dsn == "" {
		t.Fatal("disposable SILO and PostgreSQL fixture environment is required")
	}
	t.Setenv("CONSOLE_MINIO_SERVER", endpoint)
	t.Setenv("CONSOLE_USAGE_DATABASE_URL", dsn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	u, err := url.Parse(endpoint)
	if err != nil {
		t.Fatal(err)
	}
	root, err := minio.New(u.Host, &minio.Options{Secure: u.Scheme == "https", Creds: credentials.NewStaticV4(access, secret, "")})
	if err != nil {
		t.Fatal(err)
	}
	admin, err := madmin.New(u.Host, access, secret, u.Scheme == "https")
	if err != nil {
		t.Fatal(err)
	}
	bucket := fmt.Sprintf("usage-api-%d", time.Now().UnixNano())
	if err = root.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
		t.Fatal(err)
	}
	if err = root.SetBucketVersioning(ctx, bucket, minio.BucketVersioningConfiguration{Status: "Enabled"}); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		if err := root.RemoveBucket(context.Background(), bucket); err != nil {
			t.Error("fixture bucket cleanup failed")
		}
	})
	store, err := usage.OpenStore(ctx, dsn, endpoint, 4)
	if err != nil {
		t.Fatal(err)
	}
	defer store.Close()
	if err = store.Migrate(ctx); err != nil {
		t.Fatal(err)
	}
	original := openBucketUsageStore
	openBucketUsageStore = func(context.Context, usage.Config) (bucketUsageStore, error) { return store, nil }
	defer func() { openBucketUsageStore = original }()
	if err = store.Queue(ctx, bucket, true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	// Inventory from other native tests has its own endpoint scope and is removed.
	job, err := store.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if job.Bucket != bucket {
		t.Fatal("disposable endpoint has unexpected pending work")
	}
	now := time.Now().UTC()
	snapshot := usage.Snapshot{Totals: usage.Stats{CurrentBytes: "1536", CurrentObjects: 2, RetainedBytes: "512", RetainedVersions: 1}, ScannedEntries: 3, StartedAt: now, UpdatedAt: now}
	if err = store.Complete(ctx, job, snapshot); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		conn, err := pgx.Connect(context.Background(), dsn)
		if err != nil {
			t.Error("fixture state cleanup connection failed")
			return
		}
		defer conn.Close(context.Background())
		if _, err = conn.Exec(context.Background(), "DELETE FROM console_usage_buckets WHERE bucket=$1", bucket); err != nil {
			t.Error("fixture state cleanup failed")
		}
	})
	user := fmt.Sprintf("usage-api-reader-%d", time.Now().UnixNano())
	password := strings.Repeat("fixture", 6)
	document := []byte(fmt.Sprintf(`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetBucketLocation","s3:ListBucket"],"Resource":["arn:aws:s3:::%s"]}]}`, bucket))
	if err = admin.AddCannedPolicy(ctx, user, document); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = admin.RemoveCannedPolicy(context.Background(), user) })
	if err = admin.AddUser(ctx, user, password); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = admin.RemoveUser(context.Background(), user) })
	if _, err = admin.AttachPolicy(ctx, madmin.PolicyAssociationReq{Policies: []string{user}, User: user}); err != nil {
		t.Fatal(err)
	}
	principal := &models.Principal{STSAccessKeyID: user, STSSecretAccessKey: password}
	request := httptest.NewRequest("POST", "/bucket-usage/status", nil)
	response, apiErr := getBucketUsageResponse(request, &models.BucketUsageRequest{Buckets: []string{bucket}}, principal, false)
	if apiErr != nil {
		t.Fatal(apiErr.APIError.Message)
	}
	row := response.Buckets[0]
	// SILO's auth handler intentionally permits ListBucket as a fallback for
	// ListBucketVersions. Honor actual request authorization. Mock tests also
	// exercise a backend denying the version-list request.
	if !*row.VersionsVisible || row.LastGood == nil || row.LastGood.Totals.RetainedBytes == nil || *row.LastGood.Totals.CurrentBytes != "1536" {
		t.Fatalf("native IAM permission failed: state=%s versions=%t saved=%t message=%q endpoint=%q", *row.State, *row.VersionsVisible, row.LastGood != nil, row.Message, getMinIOEndpoint())
	}
	forbidden, apiErr := getBucketUsageResponse(request, &models.BucketUsageRequest{Buckets: []string{"unauthorized-bucket"}}, principal, true)
	if apiErr != nil || *forbidden.Buckets[0].State != "forbidden" || forbidden.Buckets[0].LastGood != nil {
		t.Fatal("unauthorized aggregate or queue request accepted")
	}
	if err = admin.RemoveUser(ctx, user); err != nil {
		t.Fatal(err)
	}
	revoked, apiErr := getBucketUsageResponse(request, &models.BucketUsageRequest{Buckets: []string{bucket}}, principal, false)
	if apiErr != nil || *revoked.Buckets[0].State != "forbidden" || revoked.Buckets[0].LastGood != nil {
		t.Fatal("revoked identity retained cached aggregate access")
	}
}
