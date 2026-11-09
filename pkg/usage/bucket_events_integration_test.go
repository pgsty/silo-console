//go:build integration

// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package usage

import (
	"context"
	"errors"
	"os"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
)

func TestRemovedBucketForgetsTotalsAndFencesTheActiveScan(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "recreated", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	first, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, first, observation(5)); err != nil {
		t.Fatal(err)
	}
	if err = s.Queue(ctx, "recreated", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	active, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Removed(ctx, "recreated", 0); err != nil {
		t.Fatal(err)
	}
	record, err := s.Get(ctx, "recreated")
	if err != nil {
		t.Fatal(err)
	}
	if record.State != "queued" || record.LastGood != nil || record.LastCompletedAt != nil || record.Progress != nil || record.Checkpoint != nil {
		t.Fatalf("a deleted bucket kept its totals: %+v", record)
	}
	if err = s.Complete(ctx, active, observation(9)); !errors.Is(err, ErrLeaseLost) {
		t.Fatalf("a scan of the deleted bucket published its totals: %v", err)
	}
	// The re-created bucket is measured afresh.
	rescan, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	c := scanBudgetConfig(t)
	source := listingFunc(func(ctx context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		objects := make(chan minio.ObjectInfo, 1)
		objects <- minio.ObjectInfo{Key: "new", Size: 2, IsLatest: true}
		close(objects)
		return objects
	})
	if err = s.RunSlice(ctx, source, rescan, c); err != nil {
		t.Fatal(err)
	}
	record, err = s.Get(ctx, "recreated")
	if err != nil {
		t.Fatal(err)
	}
	if record.State != "complete" || record.LastGood == nil || record.LastGood.Totals.CurrentBytes != "2" {
		t.Fatalf("the re-created bucket was not measured afresh: %+v", record)
	}
	// Removing a bucket that was never seen is a no-op.
	if err = s.Removed(ctx, "never-seen", 0); err != nil {
		t.Fatal(err)
	}
	if _, err = s.Get(ctx, "never-seen"); err == nil {
		t.Fatal("removal created a row for an unknown bucket")
	}
}

// A bucket left limited keeps its totals and an exhausted checkpoint, and
// automatic re-queueing keeps both. If the deletion cannot be persisted at
// first, it must survive for a later flush instead of being dropped when the
// observer restarts.
func TestUnpersistedBucketRemovalIsRetried(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "removed-limited", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, job, observation(5)); err != nil {
		t.Fatal(err)
	}
	if err = s.Queue(ctx, "removed-limited", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	if job, err = s.Claim(ctx, time.Minute); err != nil {
		t.Fatal(err)
	}
	spent := observation(1)
	if err = s.SaveCheckpoint(ctx, job, Checkpoint{Generation: job.Generation, LastKey: "a", ListingTime: time.Hour, Snapshot: spent}, spent, time.Minute); err != nil {
		t.Fatal(err)
	}
	if err = s.Fail(ctx, job, "duration", true, time.Hour); err != nil {
		t.Fatal(err)
	}

	c := scanBudgetConfig(t)
	pending := &pendingChanges{buckets: map[string]pendingChange{}}
	pending.add("removed-limited", pendingChange{at: time.Now().UTC(), removed: true})
	unavailable, err := pgxpool.New(ctx, os.Getenv("TEST_USAGE_DATABASE_URL"))
	if err != nil {
		t.Fatal(err)
	}
	unavailable.Close()
	if flushPending(ctx, &Store{pool: unavailable, scope: s.scope}, pending, c) {
		t.Fatal("a closed database accepted the deletion")
	}
	// Reconnect reconciliation alone keeps the limited row and its totals.
	if err = s.Queue(ctx, "removed-limited", false, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	if !flushPending(ctx, s, pending, c) {
		t.Fatal("the retained deletion was not persisted")
	}
	record, err := s.Get(ctx, "removed-limited")
	if err != nil {
		t.Fatal(err)
	}
	if record.State != "queued" || record.LastGood != nil || record.Checkpoint != nil {
		t.Fatalf("the deleted bucket's results survived: %+v", record)
	}
}

// A shutdown can interrupt a reconciliation after the event consumer has
// received a deletion but before the event loop flushed it. The worker must
// persist it on the way out; reconnect reconciliation alone keeps a limited
// row's totals.
func TestShutdownPersistsPendingBucketRemoval(t *testing.T) {
	s := integrationStore(t)
	ctx := context.Background()
	if err := s.Queue(ctx, "removed-at-shutdown", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := s.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.Complete(ctx, job, observation(5)); err != nil {
		t.Fatal(err)
	}
	pending := &pendingChanges{buckets: map[string]pendingChange{}}
	pending.add("removed-at-shutdown", pendingChange{at: time.Now().UTC(), removed: true})
	stopped, stop := context.WithCancel(ctx)
	stop()
	observeChanges(stopped, s, scanBudgetConfig(t), "stopping-observer", pending)
	record, err := s.Get(ctx, "removed-at-shutdown")
	if err != nil {
		t.Fatal(err)
	}
	if record.LastGood != nil || record.State != "queued" {
		t.Fatalf("a deletion received before shutdown was lost: %+v", record)
	}
}
