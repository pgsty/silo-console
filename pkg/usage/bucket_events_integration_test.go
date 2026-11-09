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
	"testing"
	"time"

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
