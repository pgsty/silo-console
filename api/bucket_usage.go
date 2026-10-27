// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"errors"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	"github.com/jackc/pgx/v5"
	bucketAPI "github.com/minio/console/api/operations/bucket"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/usage"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/s3utils"
)

type bucketUsageStore interface {
	Ping(context.Context) error
	Coverage(context.Context) (usage.Coverage, error)
	Queue(context.Context, string, bool, time.Duration, time.Duration, *time.Time) error
	Get(context.Context, string) (usage.Record, error)
}

var bucketUsageConnection struct {
	sync.Mutex
	store *usage.Store
}
var bucketUsageActive atomic.Int64
var newBucketUsageAuthorizationClient = func(session *models.Principal, request *http.Request) (usage.ListingClient, error) {
	return newMinioClient(session, getClientIP(request))
}
var openBucketUsageStore = func(ctx context.Context, c usage.Config) (bucketUsageStore, error) {
	bucketUsageConnection.Lock()
	defer bucketUsageConnection.Unlock()
	if bucketUsageConnection.store != nil {
		return bucketUsageConnection.store, nil
	}
	store, err := usage.OpenStore(ctx, c.DatabaseURL, c.Endpoint, c.PoolConnections)
	if err != nil {
		return nil, err
	}
	bucketUsageConnection.store = store
	return store, nil
}

func bucketUsageDate(value *time.Time) *strfmt.DateTime {
	if value == nil {
		return nil
	}
	stamp := strfmt.DateTime(*value)
	return &stamp
}
func bucketUsageSnapshot(value *usage.Snapshot, versions bool) *models.BucketUsageSnapshot {
	if value == nil {
		return nil
	}
	totals := &models.BucketUsageTotals{CurrentBytes: swag.String(value.Totals.CurrentBytes), CurrentObjects: swag.Int64(value.Totals.CurrentObjects)}
	entries := value.Totals.CurrentObjects
	if versions {
		totals.RetainedBytes = swag.String(value.Totals.RetainedBytes)
		totals.RetainedVersions = swag.Int64(value.Totals.RetainedVersions)
		totals.DeleteMarkers = swag.Int64(value.Totals.DeleteMarkers)
		entries = value.ScannedEntries
	}
	return &models.BucketUsageSnapshot{Totals: totals, ScannedEntries: swag.Int64(entries), StartedAt: bucketUsageDate(&value.StartedAt), UpdatedAt: bucketUsageDate(&value.UpdatedAt)}
}
func bucketUsageRecord(record usage.Record, versions bool) *models.BucketUsageRecord {
	response := &models.BucketUsageRecord{Bucket: swag.String(record.Bucket), State: swag.String(record.State), VersionsVisible: swag.Bool(versions), RequestedAt: bucketUsageDate(&record.RequestedAt), LastCompletedAt: bucketUsageDate(record.LastCompletedAt), LastGood: bucketUsageSnapshot(record.LastGood, versions), Progress: bucketUsageSnapshot(record.Progress, versions), ErrorCode: record.ErrorCode}
	if versions {
		response.LastEventAt = bucketUsageDate(record.LastEventAt)
	}
	return response
}
func bucketUsageState(bucket, state, message string) *models.BucketUsageRecord {
	return &models.BucketUsageRecord{Bucket: swag.String(bucket), State: swag.String(state), VersionsVisible: swag.Bool(false), Message: message}
}

// A shared worker's credential never authorizes a browser. Probe each caller's
// root prefix independently before returning any saved aggregate. Version-list
// permission is separate; absent permission omits retained data and work counts.
func authorizeBucketUsage(ctx context.Context, client usage.ListingClient, bucket string, versions bool) error {
	probe, cancel := context.WithCancel(ctx)
	objects := client.ListObjects(probe, bucket, minio.ListObjectsOptions{Recursive: true, WithVersions: versions, MaxKeys: 1})
	defer func() {
		cancel()
		for range objects {
		}
	}()
	select {
	case <-ctx.Done():
		return ctx.Err()
	case first, open := <-objects:
		if open {
			return first.Err
		}
		return nil
	}
}
func getBucketUsageResponse(request *http.Request, body *models.BucketUsageRequest, session *models.Principal, refresh bool) (*models.BucketUsageResponse, *CodedAPIError) {
	apiError := func(code int, message string) (*models.BucketUsageResponse, *CodedAPIError) {
		return nil, &CodedAPIError{Code: code, APIError: &models.APIError{Message: message}}
	}
	if session == nil || session.STSAccessKeyID == "" || session.STSSecretAccessKey == "" {
		return apiError(http.StatusUnauthorized, "A signed-in session is required.")
	}
	if body == nil || len(body.Buckets) > 1000 {
		return apiError(http.StatusBadRequest, "Choose at most 1000 buckets per refresh request.")
	}
	c, err := usage.LoadConfig(false)
	if err != nil {
		return apiError(http.StatusServiceUnavailable, "Usage refresh configuration needs operator attention.")
	}
	response := &models.BucketUsageResponse{Enabled: swag.Bool(c.DatabaseURL != ""), PollAfterMs: swag.Int64(c.UIPollInterval.Milliseconds()), Buckets: []*models.BucketUsageRecord{}}
	if c.DatabaseURL == "" {
		return response, nil
	}
	if bucketUsageActive.Add(1) > int64(c.APIRequests) {
		bucketUsageActive.Add(-1)
		return apiError(http.StatusTooManyRequests, "Other usage requests are running. Try again shortly.")
	}
	defer bucketUsageActive.Add(-1)
	ctx, cancel := context.WithTimeout(request.Context(), c.RequestTimeout)
	defer cancel()
	store, err := openBucketUsageStore(ctx, c)
	if err != nil || store.Ping(ctx) != nil {
		return apiError(http.StatusServiceUnavailable, "Usage updates are temporarily unavailable.")
	}
	coverage, err := store.Coverage(ctx)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return apiError(http.StatusServiceUnavailable, "Usage updates are temporarily unavailable.")
	}
	reconciled := coverage.LastReconciledAt != nil && coverage.LastConnectedAt != nil && !coverage.LastReconciledAt.Before(*coverage.LastConnectedAt)
	response.Coverage = &models.BucketUsageCoverage{ObserverAlive: swag.Bool(coverage.ObserverAlive), Connected: swag.Bool(coverage.Connected), Reconciled: swag.Bool(reconciled), LastConnectedAt: bucketUsageDate(coverage.LastConnectedAt), LastDisconnectAt: bucketUsageDate(coverage.LastDisconnectAt), LastReconciledAt: bucketUsageDate(coverage.LastReconciledAt)}
	client, err := newBucketUsageAuthorizationClient(session, request)
	if err != nil {
		return apiError(http.StatusServiceUnavailable, "Listing permissions could not be checked.")
	}
	seen := map[string]bool{}
	names := []string{}
	for _, bucket := range body.Buckets {
		if err = s3utils.CheckValidBucketName(bucket); err != nil {
			return apiError(http.StatusBadRequest, "Choose valid bucket names.")
		}
		if !seen[bucket] {
			seen[bucket] = true
			names = append(names, bucket)
		}
	}
	records := make([]*models.BucketUsageRecord, len(names))
	var tasks sync.WaitGroup
	slots := make(chan struct{}, c.AuthConcurrency)
	for index, bucket := range names {
		tasks.Add(1)
		go func(index int, bucket string) {
			defer tasks.Done()
			select {
			case slots <- struct{}{}:
				defer func() { <-slots }()
			case <-ctx.Done():
				records[index] = bucketUsageState(bucket, "unavailable", "Usage checks timed out.")
				return
			}
			if err := authorizeBucketUsage(ctx, client, bucket, false); err != nil {
				state, message := "unavailable", "Listing permissions could not be checked."
				switch minio.ToErrorResponse(err).Code {
				case "AccessDenied", "InvalidAccessKeyId", "SignatureDoesNotMatch", "ExpiredToken", "InvalidToken":
					state, message = "forbidden", "You cannot list this bucket's root."
				case "NoSuchBucket":
					state, message = "missing", "This bucket was not found."
				}
				if ctx.Err() != nil {
					state, message = "unavailable", "Usage checks timed out."
				}
				records[index] = bucketUsageState(bucket, state, message)
				return
			}
			versions := authorizeBucketUsage(ctx, client, bucket, true) == nil
			if refresh {
				if err := store.Queue(ctx, bucket, true, 0, 0, nil); err != nil {
					records[index] = bucketUsageState(bucket, "unavailable", "Usage refresh could not be queued.")
					return
				}
			}
			saved, err := store.Get(ctx, bucket)
			if errors.Is(err, pgx.ErrNoRows) {
				records[index] = bucketUsageState(bucket, "not_scanned", "No completed usage scan is available yet.")
				records[index].VersionsVisible = swag.Bool(versions)
				return
			}
			if err != nil {
				records[index] = bucketUsageState(bucket, "unavailable", "Usage updates are temporarily unavailable.")
				return
			}
			records[index] = bucketUsageRecord(saved, versions)
		}(index, bucket)
	}
	tasks.Wait()
	response.Buckets = records
	return response, nil
}

func privateBucketUsage(responder middleware.Responder) middleware.Responder {
	return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
		w.Header().Set("Cache-Control", "no-store")
		responder.WriteResponse(w, p)
	})
}
func bucketUsageStatus(params bucketAPI.BucketUsageStatusParams, session *models.Principal) middleware.Responder {
	response, err := getBucketUsageResponse(params.HTTPRequest, params.Body, session, false)
	if err != nil {
		return privateBucketUsage(bucketAPI.NewBucketUsageStatusDefault(err.Code).WithPayload(err.APIError))
	}
	return privateBucketUsage(bucketAPI.NewBucketUsageStatusOK().WithPayload(response))
}
func bucketUsageRefresh(params bucketAPI.BucketUsageRefreshParams, session *models.Principal) middleware.Responder {
	response, err := getBucketUsageResponse(params.HTTPRequest, params.Body, session, true)
	if err != nil {
		return privateBucketUsage(bucketAPI.NewBucketUsageRefreshDefault(err.Code).WithPayload(err.APIError))
	}
	return privateBucketUsage(bucketAPI.NewBucketUsageRefreshAccepted().WithPayload(response))
}
