//go:build integration

// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"
)

func TestScanDeadlineSurvivesCheckpoint(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "deadline-bucket", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	snapshot := observation(10)
	snapshot.StartedAt = time.Now().Add(-time.Hour)
	checkpoint := Checkpoint{Generation: job.Generation, LastKey: "a", Snapshot: snapshot}
	if err := s.Yield(ctx, job, checkpoint, snapshot); err != nil {
		t.Fatal(err)
	}
	resumed, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.ScanTimeout = time.Second
	listed := false
	source := listingFunc(func(ctx context.Context, _ string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		listed = true
		objects := make(chan minio.ObjectInfo)
		go func() {
			defer close(objects)
			select {
			case <-ctx.Done():
				return
			case <-time.After(20 * time.Millisecond):
			}
			select {
			case <-ctx.Done():
			case objects <- minio.ObjectInfo{Key: "b", Size: 12, IsLatest: true}:
			}
		}()
		return objects
	})
	err = s.RunSlice(ctx, source, resumed, c)
	var failure *ScanFailure
	if !errors.As(err, &failure) || failure.Code != "duration" || !failure.Limited {
		record, _ := s.Get(ctx, "deadline-bucket")
		t.Fatalf("expired full-scan deadline must remain limited after resume; err=%v state=%s", err, record.State)
	}
	if listed {
		t.Fatal("an expired checkpoint must not start another S3 listing")
	}
}

func TestObserverRenewalCannotResurrectOrStealLease(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	ok, err := s.AcquireObserver(ctx, "first", time.Minute)
	if err != nil || !ok {
		t.Fatalf("acquire: %v %v", ok, err)
	}
	if err := s.Observe(ctx, "first", true, time.Minute); err != nil {
		t.Fatal(err)
	}
	before, err := s.Coverage(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if err := s.RenewObserver(ctx, "first", time.Minute); err != nil {
		t.Fatal(err)
	}
	after, err := s.Coverage(ctx)
	if err != nil || !after.Connected || !after.LastConnectedAt.Equal(*before.LastConnectedAt) {
		t.Fatalf("renewal must not alter connection transitions: %+v, %v", after, err)
	}
	if err := s.RenewObserver(ctx, "second", time.Minute); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("foreign renewal: %v", err)
	}
	if _, err := s.pool.Exec(ctx, `UPDATE console_usage_coverage SET observer_until=clock_timestamp()-interval '1 second' WHERE scope=$1`, s.scope); err != nil {
		t.Fatal(err)
	}
	if err := s.RenewObserver(ctx, "first", time.Minute); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("expired renewal: %v", err)
	}
	ok, err = s.AcquireObserver(ctx, "second", time.Minute)
	if err != nil || !ok {
		t.Fatalf("takeover: %v %v", ok, err)
	}
	if err := s.RenewObserver(ctx, "first", time.Minute); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("stale renewal: %v", err)
	}
}

func TestObserverRenewsLeaseDuringInventory(t *testing.T) {
	s := integrationStore(t)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Has("events") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.(http.Flusher).Flush()
			<-r.Context().Done()
			return
		}
		select {
		case <-r.Context().Done():
			return
		case <-time.After(500 * time.Millisecond):
		}
		w.Header().Set("Content-Type", "application/xml")
		_, _ = w.Write([]byte(`<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Owner><ID>test</ID></Owner><Buckets><Bucket><Name>inventory-bucket</Name><CreationDate>2026-10-26T00:00:00.000Z</CreationDate></Bucket></Buckets></ListAllMyBucketsResult>`))
	}))
	defer server.Close()
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.Endpoint, c.Lease, c.Heartbeat = server.URL, 300*time.Millisecond, 50*time.Millisecond
	c.ScanTimeout = 3 * time.Second
	acquired, err := s.AcquireObserver(context.Background(), "review-observer", c.Lease)
	if err != nil || !acquired {
		t.Fatalf("acquire=%v err=%v", acquired, err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	observeLease(ctx, s, c, "review-observer")
	coverage, err := s.Coverage(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if coverage.LastReconciledAt == nil {
		t.Fatal("observer lost its lease during a successful inventory listing; no reconciliation was recorded")
	}
}
