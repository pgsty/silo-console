//go:build integration

// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"
)

func TestScanBudgetSurvivesCheckpoint(t *testing.T) {
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
	checkpoint := Checkpoint{Generation: job.Generation, LastKey: "a", ListingTime: time.Hour, Snapshot: snapshot}
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
		t.Fatalf("an exhausted listing budget must remain limited after resume; err=%v state=%s", err, record.State)
	}
	if listed {
		t.Fatal("an expired checkpoint must not start another S3 listing")
	}
}

// A limited scan keeps an expired checkpoint so automatic retries stay cheap.
// An explicit refresh must not resume that checkpoint (it can only end limited
// again); it must start a complete listing with a fresh deadline.
func TestManualRefreshRestartsLimitedScanWithFreshBudget(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.ScanTimeout = time.Minute
	if err = s.Queue(ctx, "limited-bucket", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, first, observation(5)); err != nil {
		t.Fatal(err)
	}
	if err = s.Queue(ctx, "limited-bucket", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	stale := observation(10)
	stale.StartedAt = time.Now().Add(-time.Hour)
	if err = s.Yield(ctx, job, Checkpoint{Generation: job.Generation, LastKey: "a", ListingTime: time.Hour, Snapshot: stale}, stale); err != nil {
		t.Fatal(err)
	}
	var starts []string
	source := listingFunc(func(ctx context.Context, _ string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		starts = append(starts, opts.StartAfter)
		objects := make(chan minio.ObjectInfo)
		go func() {
			defer close(objects)
			for _, object := range []minio.ObjectInfo{{Key: "a", Size: 3, IsLatest: true}, {Key: "b", Size: 4, IsLatest: true}} {
				select {
				case <-ctx.Done():
					return
				case objects <- object:
				}
			}
		}()
		return objects
	})
	limit := func(job Record) {
		t.Helper()
		err := s.RunSlice(ctx, source, job, c)
		var failure *ScanFailure
		if !errors.As(err, &failure) || failure.Code != "duration" || !failure.Limited {
			t.Fatalf("expired checkpoint must end limited: %v", err)
		}
		if err = s.Fail(ctx, job, failure.Code, true, 0); err != nil {
			t.Fatal(err)
		}
	}
	resumed, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	limit(resumed)
	// Automatic retries and change events keep the limited checkpoint.
	at := time.Now().UTC()
	if err = s.Queue(ctx, "limited-bucket", false, 0, 0, &at); err != nil {
		t.Fatal(err)
	}
	retry, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if retry.Checkpoint == nil {
		t.Fatal("an automatic retry discarded the limited checkpoint")
	}
	limit(retry)
	if len(starts) != 0 {
		t.Fatalf("an expired checkpoint started S3 listings: %q", starts)
	}
	if err = s.Queue(ctx, "limited-bucket", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	queued, err := s.Get(ctx, "limited-bucket")
	if err != nil {
		t.Fatal(err)
	}
	if queued.State != "queued" || queued.Checkpoint != nil || queued.Progress != nil || queued.LastGood == nil || queued.LastGood.Totals.CurrentBytes != "5" {
		t.Fatalf("explicit refresh must discard limited scan state and keep the last total: %+v", queued)
	}
	fresh, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if fresh.Checkpoint != nil || fresh.Progress != nil {
		t.Fatalf("explicit refresh resumed the limited checkpoint: %+v", fresh)
	}
	if err = s.RunSlice(ctx, source, fresh, c); err != nil {
		t.Fatalf("fresh scan did not complete: %v", err)
	}
	saved, err := s.Get(ctx, "limited-bucket")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "complete" || saved.LastGood == nil || saved.LastGood.Totals.CurrentBytes != "7" || saved.LastGood.Totals.CurrentObjects != 2 {
		t.Fatalf("fresh scan did not publish its complete listing: %+v", saved)
	}
	if len(starts) != 1 || starts[0] != "" {
		t.Fatalf("fresh scan must list from the start once: %q", starts)
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
	inventoryStarted := make(chan struct{}, 1)
	releaseInventory := make(chan struct{})
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Has("events") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.(http.Flusher).Flush()
			<-r.Context().Done()
			return
		}
		select {
		case inventoryStarted <- struct{}{}:
		default:
		}
		select {
		case <-r.Context().Done():
			return
		case <-releaseInventory:
		}
		w.Header().Set("Content-Type", "application/xml")
		_, _ = w.Write([]byte(`<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Owner><ID>test</ID></Owner><Buckets><Bucket><Name>inventory-bucket</Name><CreationDate>2026-10-26T00:00:00.000Z</CreationDate></Bucket></Buckets></ListAllMyBucketsResult>`))
	}))
	defer server.Close()
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	// Keep the production lease, heartbeat and scan timeout defaults.
	// Hold inventory past the database's original deadline and verify renewal
	// before allowing reconciliation, instead of racing a short fixed sleep.
	c.Endpoint = server.URL
	acquired, err := s.AcquireObserver(context.Background(), "review-observer", c.Lease)
	if err != nil || !acquired {
		t.Fatalf("acquire=%v err=%v", acquired, err)
	}
	var initialDeadline time.Time
	if err := s.pool.QueryRow(context.Background(), `SELECT observer_until FROM console_usage_coverage WHERE scope=$1`, s.scope).Scan(&initialDeadline); err != nil {
		t.Fatal(err)
	}
	ctx, cancel := context.WithCancel(t.Context())
	done := make(chan struct{})
	go func() { defer close(done); observeLease(ctx, s, c, "review-observer") }()
	defer func() { cancel(); <-done }()
	select {
	case <-inventoryStarted:
	case <-done:
		t.Fatal("observer stopped before requesting inventory")
	case <-ctx.Done():
		t.Fatal("observer did not request inventory: ", ctx.Err())
	}
	poll := time.NewTicker(100 * time.Millisecond)
	defer poll.Stop()
	for {
		var originalExpired, alive bool
		err := s.pool.QueryRow(ctx, `SELECT clock_timestamp()>$2, observer_until>clock_timestamp() AND observer_id=$3
 FROM console_usage_coverage WHERE scope=$1`, s.scope, initialDeadline, "review-observer").Scan(&originalExpired, &alive)
		if err != nil {
			t.Fatal(err)
		}
		if originalExpired {
			if !alive {
				t.Fatal("observer lease expired while inventory was blocked")
			}
			break
		}
		select {
		case <-done:
			t.Fatal("observer stopped before renewing its lease during blocked inventory")
		case <-ctx.Done():
			t.Fatal("lease was not renewed during blocked inventory: ", ctx.Err())
		case <-poll.C:
		}
	}
	close(releaseInventory)
	for {
		coverage, err := s.Coverage(ctx)
		if err != nil {
			t.Fatal(err)
		}
		if coverage.LastReconciledAt != nil {
			if _, err := s.Get(ctx, "inventory-bucket"); err != nil {
				t.Fatal("reconciliation did not persist the inventory bucket: ", err)
			}
			return
		}
		select {
		case <-done:
			t.Fatal("observer stopped before recording its successful inventory reconciliation")
		case <-ctx.Done():
			t.Fatal("inventory reconciliation was not recorded: ", ctx.Err())
		case <-poll.C:
		}
	}
}

// SILO drops notifications for a subscriber that stops reading, without ending
// the stream. The observer must keep reading while a slow inventory or database
// write is in progress, or coverage reports reconciled while changes are lost.
func TestObserverKeepsReadingEventsDuringSlowReconciliation(t *testing.T) {
	s := integrationStore(t)
	defer s.pool.Exec(context.Background(), `DELETE FROM console_usage_coverage WHERE scope=$1`, s.scope)
	written := make(chan struct{})
	record := func(bucket string) string {
		return `{"eventName":"s3:ObjectCreated:Put","eventTime":"2026-11-04T00:00:00Z","s3":{"bucket":{"name":"` + bucket + `"},"object":{"key":"k","size":1}}}`
	}
	line := `{"Records":[` + strings.Repeat(record("busy-bucket")+",", 999) + record("busy-bucket") + "]}\n"
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Has("events") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			// More than the client's 4 MiB line buffer plus kernel buffers.
			for sent := 0; sent < 24<<20; sent += len(line) {
				if _, err := io.WriteString(w, line); err != nil {
					return
				}
			}
			_, _ = io.WriteString(w, `{"Records":[`+record("late-bucket")+"]}\n")
			w.(http.Flusher).Flush()
			close(written)
			<-r.Context().Done()
			return
		}
		select {
		case <-written:
		case <-time.After(10 * time.Second):
			w.WriteHeader(http.StatusServiceUnavailable)
			return
		case <-r.Context().Done():
			return
		}
		w.Header().Set("Content-Type", "application/xml")
		_, _ = w.Write([]byte(`<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Owner><ID>test</ID></Owner><Buckets><Bucket><Name>inventory-bucket</Name><CreationDate>2026-10-26T00:00:00.000Z</CreationDate></Bucket></Buckets></ListAllMyBucketsResult>`))
	}))
	defer server.Close()
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.Endpoint, c.Lease, c.Heartbeat, c.PollInterval = server.URL, 2*time.Second, 200*time.Millisecond, 100*time.Millisecond
	c.ScanTimeout, c.EventDebounce = 30*time.Second, 0
	acquired, err := s.AcquireObserver(context.Background(), "draining-observer", c.Lease)
	if err != nil || !acquired {
		t.Fatalf("acquire=%v err=%v", acquired, err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() { defer close(done); observeLease(ctx, s, c, "draining-observer") }()
	defer func() { cancel(); <-done }()
	deadline := time.Now().Add(30 * time.Second)
	for {
		coverage, coverageErr := s.Coverage(context.Background())
		_, lateErr := s.Get(context.Background(), "late-bucket")
		_, busyErr := s.Get(context.Background(), "busy-bucket")
		if coverageErr == nil && coverage.LastReconciledAt != nil && lateErr == nil && busyErr == nil {
			return
		}
		select {
		case <-done:
			t.Fatalf("observer stopped before reconciling and persisting every received change: coverage=%+v late=%v busy=%v", coverage, lateErr, busyErr)
		case <-time.After(100 * time.Millisecond):
		}
		if time.Now().After(deadline) {
			t.Fatalf("observer did not reconcile and persist every received change: coverage=%+v late=%v busy=%v", coverage, lateErr, busyErr)
		}
	}
}
