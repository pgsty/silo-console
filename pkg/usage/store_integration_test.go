//go:build integration

// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/minio/minio-go/v7"
)

// Run explicitly with -tags=integration and TEST_USAGE_DATABASE_URL pointing to
// a disposable PostgreSQL instance. Missing setup is a failure, never a skip.
func integrationStore(t *testing.T) *Store {
	t.Helper()
	dsn := os.Getenv("TEST_USAGE_DATABASE_URL")
	if dsn == "" {
		t.Fatal("TEST_USAGE_DATABASE_URL is required for the PostgreSQL integration suite")
	}
	store, err := OpenStore(context.Background(), dsn, fmt.Sprintf("http://test.invalid/%s/%d", t.Name(), time.Now().UnixNano()), 4)
	if err != nil {
		t.Fatal(err)
	}
	if err = store.Migrate(context.Background()); err != nil {
		store.Close()
		t.Fatal(err)
	}
	t.Cleanup(func() {
		_, err := store.pool.Exec(context.Background(), `DELETE FROM console_usage_buckets WHERE scope=$1`, store.scope)
		if err != nil {
			t.Error(err)
		}
		store.Close()
	})
	return store
}
func observation(bytes uint64) Snapshot {
	now := time.Now().UTC()
	return Snapshot{Totals: Counts{CurrentBytes: bytes, CurrentObjects: 1}.Stats(), ScannedEntries: 1, StartedAt: now, UpdatedAt: now}
}
func TestQueueCoalescesAndRequeuesChangesDuringScan(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	now := time.Now().UTC()
	for i := 0; i < 10; i++ {
		if err := s.Queue(ctx, "test-bucket", false, 0, 0, &now); err != nil {
			t.Fatal(err)
		}
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if first.Generation != 1 {
		t.Fatalf("duplicate queued invalidations created %d generations", first.Generation)
	}
	for i := 0; i < 10; i++ {
		if err = s.Queue(ctx, "test-bucket", false, 0, 0, &now); err != nil {
			t.Fatal(err)
		}
	}
	if err = s.Complete(ctx, first, observation(11)); err != nil {
		t.Fatal(err)
	}
	saved, err := s.Get(ctx, "test-bucket")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "queued" || saved.Generation != 2 || saved.LastGood == nil || saved.LastGood.Totals.CurrentBytes != "11" {
		t.Fatalf("changed bucket was falsely fresh: %+v", saved)
	}
	second, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if second.Generation != 2 {
		t.Fatal("follow-up did not claim latest generation")
	}
	if err = s.Complete(ctx, second, observation(13)); err != nil {
		t.Fatal(err)
	}
	saved, err = s.Get(ctx, "test-bucket")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "complete" || saved.LastGood.Totals.CurrentBytes != "13" {
		t.Fatalf("wrong follow-up result: %+v", saved)
	}
	if _, err = s.Claim(ctx, time.Minute); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("duplicate events left extra jobs: %v", err)
	}
}
func TestManualRequestsJoinActiveWorkAndTakePriority(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "background", false, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	for i := 0; i < 5; i++ {
		if err := s.Queue(ctx, "operator", true, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if job.Bucket != "operator" || job.Generation != 1 {
		t.Fatalf("operator refresh did not join and take priority: %+v", job)
	}
	if err = s.Queue(ctx, "operator", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, job, observation(7)); err != nil {
		t.Fatal(err)
	}
	saved, err := s.Get(ctx, "operator")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "complete" {
		t.Fatal("repeated clicks caused an unnecessary second scan")
	}
	job, err = s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if job.Bucket != "background" {
		t.Fatal("background work was lost")
	}
}
func TestOnlyOneWorkerCanClaimEachBucket(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	const count = 12
	for i := 0; i < count; i++ {
		if err := s.Queue(ctx, fmt.Sprintf("bucket-%02d", i), true, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
	}
	var workers sync.WaitGroup
	results := make(chan Record, count)
	failures := make(chan error, count)
	for i := 0; i < count; i++ {
		workers.Add(1)
		go func() {
			defer workers.Done()
			job, err := s.Claim(ctx, time.Minute)
			if err != nil {
				failures <- err
				return
			}
			results <- job
		}()
	}
	workers.Wait()
	close(results)
	close(failures)
	for err := range failures {
		t.Error(err)
	}
	seen := map[string]bool{}
	for job := range results {
		if seen[job.Bucket] {
			t.Errorf("duplicate concurrent claim for %s", job.Bucket)
		}
		seen[job.Bucket] = true
	}
	if len(seen) != count {
		t.Fatalf("claimed %d of %d buckets", len(seen), count)
	}
}
func TestExpiredWorkerCannotPublishOrRenew(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "lease-test", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	old, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if _, err = s.pool.Exec(ctx, `UPDATE console_usage_buckets SET lease_until=clock_timestamp()-interval '1 second' WHERE scope=$1`, s.scope); err != nil {
		t.Fatal(err)
	}
	snapshot := observation(10)
	if err = s.Complete(ctx, old, snapshot); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("expired worker published a total: %v", err)
	}
	next, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if next.LeaseToken == old.LeaseToken {
		t.Fatal("lease token was reused")
	}
	if err = s.Progress(ctx, old, &snapshot, time.Minute); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("old worker renewed replacement lease: %v", err)
	}
	if err = s.Complete(ctx, next, snapshot); err != nil {
		t.Fatal(err)
	}
}
func TestFailurePreservesLastCompleteObservationAndPartialProgress(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "failure-test", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, first, observation(20)); err != nil {
		t.Fatal(err)
	}
	if err = s.Queue(ctx, "failure-test", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	next, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	partial := observation(8)
	if err = s.Progress(ctx, next, &partial, time.Minute); err != nil {
		t.Fatal(err)
	}
	if err = s.Fail(ctx, next, "entries", true, time.Hour); err != nil {
		t.Fatal(err)
	}
	saved, err := s.Get(ctx, "failure-test")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "limited" || saved.LastGood == nil || saved.LastGood.Totals.CurrentBytes != "20" || saved.Progress == nil || saved.Progress.Totals.CurrentBytes != "8" {
		t.Fatalf("partial replaced complete or lost progress: %+v", saved)
	}
	if _, err = s.Claim(ctx, time.Minute); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("retry delay was ignored: %v", err)
	}
	for i := 0; i < 5; i++ {
		if err = s.Queue(ctx, "failure-test", false, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
	}
	if _, err = s.Claim(ctx, time.Minute); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("background events bypassed failure backoff: %v", err)
	}
	if err = s.Queue(ctx, "failure-test", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	if _, err = s.Claim(ctx, time.Minute); err != nil {
		t.Fatalf("explicit refresh could not retry: %v", err)
	}
}
func TestDebounceScopeIsolationAndInvalidObservations(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "delayed", false, time.Hour, 0, nil); err != nil {
		t.Fatal(err)
	}
	if _, err := s.Claim(ctx, time.Minute); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("debounce ignored: %v", err)
	}
	other := *s
	other.scope = "unrelated-storage-endpoint"
	if _, err := other.Get(ctx, "delayed"); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatalf("cross-endpoint cache disclosure: %v", err)
	}
	if err := s.Queue(ctx, "delayed", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	invalid := observation(5)
	invalid.Totals.CurrentBytes = "-1"
	if err = s.Complete(ctx, job, invalid); err == nil {
		t.Fatal("invalid byte totals were published")
	}
	saved, err := s.Get(ctx, "delayed")
	if err != nil {
		t.Fatal(err)
	}
	if saved.LastGood != nil {
		t.Fatal("unknown was replaced by an invalid/zero result")
	}
}

func TestCheckpointYieldAndLeaseRecoveryPreserveSafeCursor(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "big-bucket", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	snapshot := observation(31)
	checkpoint := Checkpoint{Generation: first.Generation, LastKey: "key-with-all-versions-counted", Snapshot: snapshot}
	if err = s.Yield(ctx, first, checkpoint, snapshot); err != nil {
		t.Fatal(err)
	}
	second, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if second.Checkpoint == nil || second.Checkpoint.LastKey != checkpoint.LastKey || second.Checkpoint.Snapshot.Totals.CurrentBytes != "31" {
		t.Fatalf("resume state lost: %+v", second)
	}
	if second.Progress == nil || second.LastGood != nil {
		t.Fatal("partial checkpoint was falsely made a complete observation")
	}
	if err = s.Complete(ctx, first, snapshot); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("yielded lease could publish: %v", err)
	}
	if err = s.SaveCheckpoint(ctx, second, checkpoint, snapshot, time.Minute); err != nil {
		t.Fatal(err)
	}
	if _, err = s.pool.Exec(ctx, `UPDATE console_usage_buckets SET lease_until=clock_timestamp()-interval '1 second' WHERE scope=$1`, s.scope); err != nil {
		t.Fatal(err)
	}
	recovered, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if recovered.Checkpoint == nil || recovered.Checkpoint.LastKey != checkpoint.LastKey {
		t.Fatal("crashed worker checkpoint was discarded")
	}
	if err = s.Complete(ctx, recovered, snapshot); err != nil {
		t.Fatal(err)
	}
	complete, err := s.Get(ctx, "big-bucket")
	if err != nil {
		t.Fatal(err)
	}
	if complete.Checkpoint != nil || complete.Progress != nil || complete.LastGood == nil {
		t.Fatal("completed job retained a stale continuation")
	}
}
func TestYieldGivesOtherBucketsTheirTurn(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	for _, bucket := range []string{"a-big", "z-small"} {
		if err := s.Queue(ctx, bucket, true, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if first.Bucket != "a-big" {
		t.Fatal("unexpected initial order")
	}
	snapshot := observation(2)
	if err = s.Yield(ctx, first, Checkpoint{Generation: first.Generation, LastKey: "a", Snapshot: snapshot}, snapshot); err != nil {
		t.Fatal(err)
	}
	next, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if next.Bucket != "z-small" {
		t.Fatal("large resumable scan starved smaller bucket")
	}
}

func TestObserverFailoverReportsEventCoverageHonestly(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	defer s.pool.Exec(ctx, `DELETE FROM console_usage_coverage WHERE scope=$1`, s.scope)
	acquired, err := s.AcquireObserver(ctx, "first", time.Minute)
	if err != nil || !acquired {
		t.Fatalf("observer acquire: %t %v", acquired, err)
	}
	if err = s.Observe(ctx, "first", true, time.Minute); err != nil {
		t.Fatal(err)
	}
	other, err := s.AcquireObserver(ctx, "second", time.Minute)
	if err != nil || other {
		t.Fatal("two workers own the same change stream")
	}
	coverage, err := s.Coverage(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if !coverage.ObserverAlive || !coverage.Connected || coverage.LastConnectedAt == nil {
		t.Fatal("connected observer health missing")
	}
	if _, err = s.pool.Exec(ctx, `UPDATE console_usage_coverage SET observer_until=clock_timestamp()-interval '1 second' WHERE scope=$1`, s.scope); err != nil {
		t.Fatal(err)
	}
	coverage, err = s.Coverage(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if coverage.ObserverAlive || coverage.Connected {
		t.Fatal("expired worker falsely claims live event coverage")
	}
	other, err = s.AcquireObserver(ctx, "second", time.Minute)
	if err != nil || !other {
		t.Fatal("observer failover was blocked")
	}
	if err = s.Observe(ctx, "first", true, time.Minute); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("old observer restored false health: %v", err)
	}
	coverage, err = s.Coverage(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if coverage.Connected {
		t.Fatal("replacement observer claimed connected before subscribing")
	}
	if err = s.Observe(ctx, "second", true, time.Minute); err != nil {
		t.Fatal(err)
	}
	if err = s.Reconciled(ctx, "second"); err != nil {
		t.Fatal(err)
	}
	coverage, err = s.Coverage(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if !coverage.Connected || coverage.LastReconciledAt == nil {
		t.Fatal("recovery reconciliation missing")
	}
}

func TestChangesBetweenSlicesRemainDirtyAfterTheOldScanCompletes(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "paused", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	snapshot := observation(5)
	checkpoint := Checkpoint{Generation: first.Generation, LastKey: "already-counted-key", Snapshot: snapshot}
	if err = s.Yield(ctx, first, checkpoint, snapshot); err != nil {
		t.Fatal(err)
	}
	event := time.Now().UTC()
	if err = s.Queue(ctx, "paused", false, 0, 0, &event); err != nil {
		t.Fatal(err)
	}
	resumed, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if resumed.Generation != 2 || resumed.Checkpoint == nil || resumed.Checkpoint.Generation != 1 {
		t.Fatal("paused source generation was overwritten by the new request generation")
	}
	if err = s.Complete(ctx, resumed, snapshot); err != nil {
		t.Fatal(err)
	}
	saved, err := s.Get(ctx, "paused")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "queued" || saved.Checkpoint != nil {
		t.Fatal("a write to an already-counted key was falsely marked fresh")
	}
	fresh, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if fresh.Checkpoint != nil {
		t.Fatal("new generation resumed an old key cursor")
	}
	if err = s.Complete(ctx, fresh, observation(9)); err != nil {
		t.Fatal(err)
	}
	saved, err = s.Get(ctx, "paused")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "complete" || saved.LastGood.Totals.CurrentBytes != "9" {
		t.Fatal("fresh generation did not converge")
	}
}

type listingFunc func(context.Context, string, minio.ListObjectsOptions) <-chan minio.ObjectInfo

func (f listingFunc) ListObjects(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
	return f(ctx, bucket, opts)
}
func TestScanSlicesResumeAfterWholeVersionGroupsWithoutDoubleCounting(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "versioned", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.ScanSlice = 100 * time.Millisecond
	starts := make(chan string, 2)
	source := listingFunc(func(ctx context.Context, _ string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		starts <- opts.StartAfter
		if !opts.WithVersions || !opts.Recursive {
			t.Error("scan did not request retained versions")
		}
		out := make(chan minio.ObjectInfo)
		go func() {
			defer close(out)
			objects := []minio.ObjectInfo{{Key: "a", Size: 11, IsLatest: true}, {Key: "a", Size: 7}, {Key: "b", Size: 13, IsLatest: true}, {Key: "c", IsDeleteMarker: true, IsLatest: true}, {Key: "c", Size: 17}, {Key: "d", Size: 5, IsLatest: true}}
			for _, object := range objects {
				if object.Key <= opts.StartAfter {
					continue
				}
				if object.Key == "b" && opts.StartAfter == "" {
					timer := time.NewTimer(120 * time.Millisecond)
					select {
					case <-timer.C:
					case <-ctx.Done():
						timer.Stop()
						return
					}
				}
				select {
				case out <- object:
				case <-ctx.Done():
					return
				}
			}
		}()
		return out
	})
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.RunSlice(ctx, source, first, c); err != nil {
		t.Fatal(err)
	}
	next, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if next.Checkpoint == nil || next.Checkpoint.LastKey != "a" || next.Checkpoint.Snapshot.ScannedEntries != 2 {
		t.Fatal("checkpoint split a key's versions")
	}
	if err = s.RunSlice(ctx, source, next, c); err != nil {
		t.Fatal(err)
	}
	if firstStart, secondStart := <-starts, <-starts; firstStart != "" || secondStart != "a" {
		t.Fatalf("wrong resume markers %q %q", firstStart, secondStart)
	}
	saved, err := s.Get(ctx, "versioned")
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "complete" || saved.LastGood == nil {
		t.Fatal("resumed scan did not complete")
	}
	totals := saved.LastGood.Totals
	if totals.CurrentBytes != "29" || totals.RetainedBytes != "24" || totals.CurrentObjects != 3 || totals.RetainedVersions != 2 || totals.DeleteMarkers != 1 || saved.LastGood.ScannedEntries != 6 {
		t.Fatalf("resume skipped or double-counted versions: %+v", saved.LastGood)
	}
}
func TestScanErrorsAndBudgetsNeverPublishPartialAsComplete(t *testing.T) {
	for _, tc := range []struct {
		name, code string
		objects    []minio.ObjectInfo
		budget     int64
	}{
		{"permission after progress", "authorization", []minio.ObjectInfo{{Key: "a", Size: 11, IsLatest: true}, {Err: minio.ErrorResponse{Code: "AccessDenied"}}}, 100},
		{"entry budget", "entries", []minio.ObjectInfo{{Key: "a", Size: 11, IsLatest: true}, {Key: "b", Size: 7, IsLatest: true}}, 1},
	} {
		t.Run(tc.name, func(t *testing.T) {
			s := integrationStore(t)
			ctx := context.Background()
			if err := s.Queue(ctx, "bounded", true, 0, 0, nil); err != nil {
				t.Fatal(err)
			}
			job, err := s.Claim(ctx, time.Minute)
			if err != nil {
				t.Fatal(err)
			}
			c, err := ParseConfig(nil, false)
			if err != nil {
				t.Fatal(err)
			}
			c.MaxEntries = tc.budget
			source := listingFunc(func(ctx context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
				out := make(chan minio.ObjectInfo)
				go func() {
					defer close(out)
					for _, item := range tc.objects {
						select {
						case out <- item:
						case <-ctx.Done():
							return
						}
					}
				}()
				return out
			})
			err = s.RunSlice(ctx, source, job, c)
			var failure *ScanFailure
			if !errors.As(err, &failure) || failure.Code != tc.code {
				t.Fatalf("wrong partial failure: %v", err)
			}
			saved, err := s.Get(ctx, "bounded")
			if err != nil {
				t.Fatal(err)
			}
			if saved.LastGood != nil || saved.State == "complete" {
				t.Fatal("partial observation was published as a total")
			}
		})
	}
}

func TestMissingBucketRetiresOldWorkWithoutDiscardingANewerMutation(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	for _, changed := range []bool{false, true} {
		if err := s.Queue(ctx, "removed", true, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
		job, err := s.Claim(ctx, time.Minute)
		if err != nil {
			t.Fatal(err)
		}
		if changed {
			at := time.Now().UTC()
			if err = s.Queue(ctx, "removed", false, 0, 0, &at); err != nil {
				t.Fatal(err)
			}
		}
		if err = s.MissingBucket(ctx, job); err != nil {
			t.Fatal(err)
		}
		saved, err := s.Get(ctx, "removed")
		if changed {
			if err != nil || saved.State != "queued" || saved.LastGood != nil || saved.Checkpoint != nil {
				t.Fatal("new request was discarded with removed bucket")
			}
		} else if !errors.Is(err, pgx.ErrNoRows) {
			t.Fatal("deleted bucket remains in retry queue")
		}
	}
}
func TestDirtyCompletionUsesCooldownAndManualRefreshCanExpediteIt(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "busy", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	now := time.Now().UTC()
	if err = s.Queue(ctx, "busy", false, 0, 0, &now); err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, job, observation(3), time.Hour); err != nil {
		t.Fatal(err)
	}
	if _, err = s.Claim(ctx, time.Minute); !errors.Is(err, pgx.ErrNoRows) {
		t.Fatal("continuous writes bypassed configured scan cooldown")
	}
	if err = s.Queue(ctx, "busy", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	if _, err = s.Claim(ctx, time.Minute); err != nil {
		t.Fatal("operator cannot expedite pending refresh")
	}
}

func TestHealthRequiresReconciledLiveCoverageAndExposesUsefulQueueMetrics(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	defer s.pool.Exec(ctx, `DELETE FROM console_usage_coverage WHERE scope=$1`, s.scope)
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	handler := workerHTTP(s, c).Handler
	ready := func() *httptest.ResponseRecorder {
		t.Helper()
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, httptest.NewRequest("GET", "/ready", nil))
		return w
	}
	if w := ready(); w.Code != http.StatusServiceUnavailable {
		t.Fatal("unobserved storage falsely ready")
	}
	if ok, err := s.AcquireObserver(ctx, "observer", time.Minute); err != nil || !ok {
		t.Fatal("observer acquisition failed")
	}
	if err = s.Observe(ctx, "observer", true, time.Minute); err != nil {
		t.Fatal(err)
	}
	if w := ready(); w.Code != http.StatusServiceUnavailable {
		t.Fatal("connection without gap reconciliation falsely ready")
	}
	if err = s.Reconciled(ctx, "observer"); err != nil {
		t.Fatal(err)
	}
	if err = s.Queue(ctx, "visible", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	w := ready()
	if w.Code != 200 {
		t.Fatalf("reconciled worker not ready: %s", w.Body.String())
	}
	var health WorkerHealth
	if err = json.Unmarshal(w.Body.Bytes(), &health); err != nil {
		t.Fatal(err)
	}
	if health.Queued != 1 || !health.Ready {
		t.Fatal("operator queue status missing")
	}
	metrics := httptest.NewRecorder()
	handler.ServeHTTP(metrics, httptest.NewRequest("GET", "/metrics", nil))
	if metrics.Code != 200 || !strings.Contains(metrics.Body.String(), `silo_usage_buckets{state="queued"} 1`) || !strings.Contains(metrics.Body.String(), "silo_usage_event_stream_connected 1") {
		t.Fatalf("missing useful monitoring: %s", metrics.Body.String())
	}
	if err = s.ReleaseObserver(ctx, "observer"); err != nil {
		t.Fatal(err)
	}
	if w := ready(); w.Code != http.StatusServiceUnavailable {
		t.Fatal("stopped observer falsely ready")
	}
}

func TestSlowResumeStillMakesForwardProgress(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "forward", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.ScanSlice = time.Nanosecond
	source := listingFunc(func(ctx context.Context, _ string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		out := make(chan minio.ObjectInfo)
		go func() {
			defer close(out)
			for _, key := range []string{"a", "b"} {
				if key <= opts.StartAfter {
					continue
				}
				select {
				case out <- minio.ObjectInfo{Key: key, Size: 3, IsLatest: true}:
				case <-ctx.Done():
					return
				}
			}
		}()
		return out
	})
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.RunSlice(ctx, source, first, c); err != nil {
		t.Fatal(err)
	}
	resumed, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if resumed.Checkpoint == nil || resumed.Checkpoint.LastKey != "a" {
		t.Fatal("initial scan did not checkpoint first group")
	}
	if err = s.RunSlice(ctx, source, resumed, c); err != nil {
		t.Fatal(err)
	}
	complete, err := s.Get(ctx, "forward")
	if err != nil {
		t.Fatal(err)
	}
	if complete.State != "complete" || complete.LastGood == nil || complete.LastGood.Totals.CurrentBytes != "6" {
		t.Fatal("a slow first page starved the resume cursor")
	}
}

func TestInventoryDiscoversNewBucketsWithoutRescanningUnchangedOnes(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Discover(ctx, "known-bucket", 0); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, job, observation(321)); err != nil {
		t.Fatal(err)
	}
	for range 5 {
		if err = s.Discover(ctx, "known-bucket", 0); err != nil {
			t.Fatal(err)
		}
	}
	row, err := s.Get(ctx, "known-bucket")
	if err != nil || row.State != "complete" || row.Generation != 1 {
		t.Fatal("inventory invalidated an unchanged bucket")
	}
	if err = s.Discover(ctx, "new-bucket", 0); err != nil {
		t.Fatal(err)
	}
	next, err := s.Claim(ctx, time.Minute)
	if err != nil || next.Bucket != "new-bucket" {
		t.Fatal("new bucket was not scheduled")
	}
}
