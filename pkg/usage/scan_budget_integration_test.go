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
	"fmt"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"
)

// slowListing returns 30 keys per bucket, each after delay, resuming after
// StartAfter like the SDK.
func slowListing(delay time.Duration) ListingClient {
	return listingFunc(func(ctx context.Context, _ string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		objects := make(chan minio.ObjectInfo)
		go func() {
			defer close(objects)
			for i := range 30 {
				key := fmt.Sprintf("k%03d", i)
				if key <= opts.StartAfter {
					continue
				}
				select {
				case <-ctx.Done():
					return
				case <-time.After(delay):
				}
				select {
				case <-ctx.Done():
					return
				case objects <- minio.ObjectInfo{Key: key, Size: 1, IsLatest: true}:
				}
			}
		}()
		return objects
	})
}

func scanBudgetConfig(t *testing.T) Config {
	t.Helper()
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	c.ScanTimeout = 3 * time.Second
	c.ScanSlice = 100 * time.Millisecond
	c.PollInterval = 20 * time.Millisecond
	c.MinScanInterval = 0
	return c
}

// Each bucket needs about 1–1.5 s of listing, well within its 3 s budget, but
// the four together need over 4 s of a single scan worker's time. Charging
// the wall clock since each scan started, as earlier releases did, ended all
// four limited because each bucket also waited for the others' slices.
func TestScanBudgetExcludesTimeQueuedBehindOtherBuckets(t *testing.T) {
	s := integrationStore(t)
	c := scanBudgetConfig(t)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	buckets := []string{"budget-a", "budget-b", "budget-c", "budget-d"}
	for _, bucket := range buckets {
		if err := s.Queue(ctx, bucket, true, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
	}
	done := make(chan struct{})
	go func() { defer close(done); runScanWorker(ctx, s, slowListing(30*time.Millisecond), c) }()
	defer func() { cancel(); <-done }()
	deadline := time.Now().Add(30 * time.Second)
	for {
		finished := 0
		for _, bucket := range buckets {
			record, err := s.Get(ctx, bucket)
			if err != nil {
				t.Fatal(err)
			}
			switch record.State {
			case "complete":
				if record.LastGood == nil || record.LastGood.Totals.CurrentObjects != 30 {
					t.Fatalf("%s completed with wrong totals: %+v", bucket, record.LastGood)
				}
				finished++
			case "limited", "error":
				t.Fatalf("%s ended %s/%s although its own listing fits the budget", bucket, record.State, record.ErrorCode)
			}
		}
		if finished == len(buckets) {
			return
		}
		if time.Now().After(deadline) {
			t.Fatal("scans did not finish")
		}
		time.Sleep(50 * time.Millisecond)
	}
}

// The budget still bounds a single bucket whose own listing is too long.
func TestScanBudgetLimitsABucketWhoseListingExceedsIt(t *testing.T) {
	s := integrationStore(t)
	c := scanBudgetConfig(t)
	c.ScanTimeout = 500 * time.Millisecond
	ctx := context.Background()
	if err := s.Queue(ctx, "budget-long", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	source := slowListing(50 * time.Millisecond) // 1.5 s of listing
	for slices := 0; ; slices++ {
		if slices > 50 {
			t.Fatal("scan neither completed nor reached its budget")
		}
		job, err := s.Claim(ctx, time.Minute)
		if err != nil {
			t.Fatal(err)
		}
		err = s.RunSlice(ctx, source, job, c)
		if err == nil {
			record, _ := s.Get(ctx, "budget-long")
			if record.State == "complete" {
				t.Fatal("a listing longer than the budget completed")
			}
			continue
		}
		var failure *ScanFailure
		if !errors.As(err, &failure) || failure.Code != "duration" || !failure.Limited {
			t.Fatalf("expected limited/duration, got %v", err)
		}
		if err = s.Fail(ctx, job, failure.Code, true, 0); err != nil {
			t.Fatal(err)
		}
		record, err := s.Get(ctx, "budget-long")
		if err != nil {
			t.Fatal(err)
		}
		if record.Checkpoint == nil || record.Checkpoint.ListingTime < c.ScanTimeout {
			t.Fatalf("limited checkpoint must record the exhausted budget: %+v", record.Checkpoint)
		}
		return
	}
}

// A worker stopping during a scan (a rolling restart) must not show the
// bucket as failed or delay it by a retry backoff.
func TestWorkerShutdownRequeuesScanWithItsCheckpoint(t *testing.T) {
	s := integrationStore(t)
	c := scanBudgetConfig(t)
	c.ProgressInterval = 50 * time.Millisecond
	c.ScanSlice = time.Minute
	c.RetryInterval = time.Hour
	c.MaxRetryInterval = time.Hour
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if err := s.Queue(ctx, "budget-restart", true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	done := make(chan struct{})
	go func() { defer close(done); runScanWorker(ctx, s, slowListing(100*time.Millisecond), c) }()
	deadline := time.Now().Add(10 * time.Second)
	for {
		record, err := s.Get(context.Background(), "budget-restart")
		if err != nil {
			t.Fatal(err)
		}
		if record.State == "running" && record.Checkpoint != nil && record.Checkpoint.LastKey != "" {
			break
		}
		if time.Now().After(deadline) {
			t.Fatalf("scan never saved a checkpoint: %+v", record)
		}
		time.Sleep(20 * time.Millisecond)
	}
	cancel()
	<-done
	record, err := s.Get(context.Background(), "budget-restart")
	if err != nil {
		t.Fatal(err)
	}
	if record.State != "queued" || record.ErrorCode != "" || record.Checkpoint == nil {
		t.Fatalf("shutdown must requeue the scan with its checkpoint: %+v", record)
	}
	resumed, err := s.Claim(context.Background(), time.Minute)
	if err != nil {
		t.Fatalf("the next worker cannot resume at once: %v", err)
	}
	if resumed.Bucket != "budget-restart" || resumed.Checkpoint == nil || resumed.Checkpoint.LastKey != record.Checkpoint.LastKey {
		t.Fatalf("resumed without the saved cursor: %+v", resumed)
	}
}

// When the budget runs out, the SDK closes the listing channel at the same
// time as the scan context expires, and select may take either. Both exits
// must record the exhausted budget, or a retry lists again.
func TestBudgetExhaustionIsRecordedOnEveryExit(t *testing.T) {
	s := integrationStore(t)
	c := scanBudgetConfig(t)
	c.ScanTimeout = 20 * time.Millisecond
	c.ScanSlice = time.Minute
	ctx := context.Background()
	// A steady stream keeps the scan loop busy until the budget expires; the
	// lister then closes its channel like the SDK does, so both the closed
	// channel and the expired context are ready. No progress tick persists
	// the budget earlier.
	busy := listingFunc(func(ctx context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		objects := make(chan minio.ObjectInfo)
		go func() {
			defer close(objects)
			for i := 0; ; i++ {
				select {
				case <-ctx.Done():
					return
				case objects <- minio.ObjectInfo{Key: fmt.Sprintf("k%09d", i), Size: 1, IsLatest: true}:
				}
			}
		}()
		return objects
	})
	for i := range 40 {
		bucket := fmt.Sprintf("budget-exit-%02d", i)
		if err := s.Queue(ctx, bucket, true, 0, 0, nil); err != nil {
			t.Fatal(err)
		}
		job, err := s.Claim(ctx, time.Minute)
		if err != nil {
			t.Fatal(err)
		}
		err = s.RunSlice(ctx, busy, job, c)
		var failure *ScanFailure
		if job.Bucket != bucket || !errors.As(err, &failure) || failure.Code != "duration" {
			t.Fatalf("expected limited/duration for %s, got %s: %v", bucket, job.Bucket, err)
		}
		// Keep earlier limited rows out of later claims.
		if err = s.Fail(ctx, job, failure.Code, true, time.Hour); err != nil {
			t.Fatal(err)
		}
		record, err := s.Get(ctx, bucket)
		if err != nil {
			t.Fatal(err)
		}
		if record.Checkpoint == nil || record.Checkpoint.ListingTime < c.ScanTimeout {
			t.Fatalf("attempt %d left the spent budget unrecorded: %+v", i, record.Checkpoint)
		}
	}
}
