// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"log"
	"math"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/minio-go/v7/pkg/notification"
)

func wait(ctx context.Context, duration time.Duration) bool {
	timer := time.NewTimer(duration)
	defer timer.Stop()
	select {
	case <-timer.C:
		return true
	case <-ctx.Done():
		return false
	}
}
func (c Config) retry(attempts int) time.Duration {
	power := min(max(attempts-1, 0), 20)
	delay := float64(c.RetryInterval) * math.Pow(2, float64(power))
	if delay > float64(c.MaxRetryInterval) {
		return c.MaxRetryInterval
	}
	return time.Duration(delay)
}

// RunWorker owns no object contents. It needs dedicated list/version-list and
// notification permissions, plus this service's database. Every durable write
// is lease-fenced so process restarts cannot publish a stale worker's result.
func RunWorker(parent context.Context, c Config) error {
	ctx, cancel := context.WithCancel(parent)
	defer cancel()
	store, err := OpenStore(ctx, c.DatabaseURL, c.Endpoint, c.PoolConnections)
	if err != nil {
		return err
	}
	defer store.Close()
	if err = store.Migrate(ctx); err != nil {
		return errors.New("usage database initialization failed")
	}
	client, err := c.NewS3Client()
	if err != nil {
		return errors.New("usage S3 client initialization failed")
	}
	var workers sync.WaitGroup
	for range c.ConcurrentScans {
		workers.Add(1)
		go func() { defer workers.Done(); runScanWorker(ctx, store, client, c) }()
	}
	workers.Add(1)
	go func() { defer workers.Done(); runObserver(ctx, store, c) }()
	server := workerHTTP(store, c)
	serverErrors := make(chan error, 1)
	go func() { serverErrors <- server.ListenAndServe() }()
	var serveErr error
	select {
	case <-ctx.Done():
	case serveErr = <-serverErrors:
	}
	cancel()
	shutdown, stop := context.WithTimeout(context.Background(), c.Heartbeat)
	_ = server.Shutdown(shutdown)
	stop()
	workers.Wait()
	if serveErr != nil && !errors.Is(serveErr, http.ErrServerClosed) {
		return errors.New("usage health server failed")
	}
	return nil
}
func runScanWorker(ctx context.Context, s *Store, client ListingClient, c Config) {
	for ctx.Err() == nil {
		operation, cancel := context.WithTimeout(ctx, c.Heartbeat)
		job, err := s.Claim(operation, c.Lease)
		cancel()
		if err != nil {
			if !errors.Is(err, pgx.ErrNoRows) && ctx.Err() == nil {
				log.Print("usage worker: state store unavailable while claiming work")
			}
			if !wait(ctx, c.PollInterval) {
				return
			}
			continue
		}
		err = s.RunSlice(ctx, client, job, c)
		if err == nil {
			continue
		}
		if errors.Is(err, ErrLeaseLost) {
			continue
		}
		var failure *ScanFailure
		if errors.As(err, &failure) {
			if failure.Code == "not_found" {
				operation, stop := context.WithTimeout(ctx, c.Heartbeat)
				_ = s.MissingBucket(operation, job)
				stop()
				continue
			}
			operation, cancel := context.WithTimeout(context.Background(), c.Heartbeat)
			persistErr := s.Fail(operation, job, failure.Code, failure.Limited, c.retry(job.Attempts))
			cancel()
			if persistErr != nil && !errors.Is(persistErr, ErrLeaseLost) {
				log.Print("usage worker: state store unavailable while recording scan failure")
			}
			if failure.Code != "worker_shutdown" {
				log.Printf("usage worker: bucket=%q scan=%s", job.Bucket, failure.Code)
			}
		} else if ctx.Err() == nil {
			log.Print("usage worker: scan interrupted by state store failure; lease recovery will resume it")
		}
	}
}
func reconcile(ctx context.Context, s *Store, client *minio.Client, c Config, full bool) error {
	buckets, err := client.ListBuckets(ctx)
	if err != nil {
		return errors.New("storage inventory unavailable")
	}
	// Existing results remain visible. Reconciliation is also the safety net for
	// deletes, lifecycle activity and an interruption in the live event stream.
	for _, bucket := range buckets {
		if full {
			err = s.Queue(ctx, bucket.Name, false, c.EventDebounce, c.MinScanInterval, nil)
		} else {
			err = s.Discover(ctx, bucket.Name, c.EventDebounce)
		}
		if err != nil {
			return errors.New("usage reconciliation queue unavailable")
		}
	}
	return nil
}
func runObserver(ctx context.Context, s *Store, c Config) {
	owner := uuid.NewString()
	for ctx.Err() == nil {
		operation, cancel := context.WithTimeout(ctx, c.Heartbeat)
		acquired, err := s.AcquireObserver(operation, owner, c.Lease)
		cancel()
		if err != nil || !acquired {
			if !wait(ctx, c.PollInterval) {
				return
			}
			continue
		}
		observeLease(ctx, s, c, owner)
		if !wait(ctx, c.RetryInterval) {
			return
		}
	}
}
func observeLease(ctx context.Context, s *Store, c Config, owner string) {
	streamCtx, cancel := context.WithCancel(ctx)
	var events <-chan notification.Info
	defer func() {
		cancel()
		operation, stop := context.WithTimeout(context.Background(), c.Heartbeat)
		_ = s.ReleaseObserver(operation, owner)
		stop()
		if events != nil {
			for range events {
			}
		}
	}()
	base, err := minio.DefaultTransport(strings.HasPrefix(c.Endpoint, "https://"))
	if err != nil {
		log.Print("usage observer: transport configuration invalid")
		return
	}
	transport := &eventTransport{base: base, wake: make(chan struct{}, 1)}
	endpoint, _ := url.Parse(c.Endpoint)
	client, err := minio.New(endpoint.Host, &minio.Options{Secure: endpoint.Scheme == "https", Creds: credentials.NewStaticV4(c.AccessKey, c.SecretKey, c.SessionToken), Transport: transport})
	if err != nil {
		return
	}
	events = client.ListenNotification(streamCtx, "", "", []string{"s3:ObjectCreated:*", "s3:ObjectRemoved:*"})
	heartbeat := time.NewTicker(c.Heartbeat)
	defer heartbeat.Stop()
	periodic := time.NewTicker(c.ReconcileInterval)
	defer periodic.Stop()
	full := time.NewTicker(c.FullReconcileInterval)
	defer full.Stop()
	flush := time.NewTicker(c.PollInterval)
	defer flush.Stop()
	pending := map[string]time.Time{}
	connected := false
	var observedEpoch uint64
	flushEvents := func() bool {
		for bucket, at := range pending {
			parent := ctx
			if ctx.Err() != nil {
				parent = context.Background()
			}
			operation, stop := context.WithTimeout(parent, c.Heartbeat)
			err := s.Queue(operation, bucket, false, c.EventDebounce, c.MinScanInterval, &at)
			stop()
			if err != nil {
				if ctx.Err() == nil {
					log.Print("usage observer: failed to persist changes; reconnect reconciliation required")
				}
				return false
			}
			delete(pending, bucket)
		}
		return true
	}
	doReconcile := func(full bool) bool {
		operation, stop := context.WithTimeout(ctx, c.ScanTimeout)
		defer stop()
		if err := reconcile(operation, s, client, c, full); err != nil {
			if ctx.Err() == nil {
				log.Print("usage observer: inventory reconciliation failed")
			}
			return false
		}
		if err := s.Reconciled(operation, owner); err != nil {
			return false
		}
		return true
	}
	// Reconnect/startup always invalidates prior results, even if the event
	// connection later fails. Already persisted jobs survive observer restarts.
	if !doReconcile(true) {
		return
	}
	for {
		select {
		case <-ctx.Done():
			flushEvents()
			return
		case info, open := <-events:
			if !open {
				return
			}
			if info.Err != nil {
				if ctx.Err() == nil {
					log.Print("usage observer: change stream failed; coverage unavailable until recovery")
				}
				return
			}
			for _, event := range info.Records {
				bucket, at, ok := changedBucket(event)
				if !ok {
					continue
				}
				if previous, exists := pending[bucket]; !exists || at.After(previous) {
					pending[bucket] = at
				}
			}
		case <-flush.C:
			if !flushEvents() {
				return
			}
		case <-periodic.C:
			if !flushEvents() || !doReconcile(false) {
				return
			}
		case <-full.C:
			if !flushEvents() || !doReconcile(true) {
				return
			}
		case <-heartbeat.C:
			operation, stop := context.WithTimeout(ctx, c.Heartbeat)
			err := s.Observe(operation, owner, transport.connected.Load(), c.Lease)
			stop()
			if err != nil {
				return
			}
		case <-transport.wake:
			active := transport.connected.Load()
			epoch := transport.epoch.Load()
			if active && connected && epoch != observedEpoch {
				operation, stop := context.WithTimeout(ctx, c.Heartbeat)
				err := s.Observe(operation, owner, false, c.Lease)
				stop()
				if err != nil {
					return
				}
			}
			operation, stop := context.WithTimeout(ctx, c.Heartbeat)
			err := s.Observe(operation, owner, active, c.Lease)
			stop()
			if err != nil {
				return
			}
			if active && (!connected || epoch != observedEpoch) {
				if !doReconcile(true) {
					return
				}
			}
			connected = active
			observedEpoch = epoch
		}
	}
}
func changedBucket(event notification.Event) (string, time.Time, bool) {
	if event.S3.Bucket.Name == "" {
		return "", time.Time{}, false
	}
	switch {
	case strings.HasPrefix(event.EventName, "s3:ObjectCreated:"):
	case strings.HasPrefix(event.EventName, "s3:ObjectRemoved:"):
	default:
		return "", time.Time{}, false
	}
	at, err := time.Parse(time.RFC3339Nano, event.EventTime)
	if err != nil {
		at = time.Now().UTC()
	}
	return event.S3.Bucket.Name, at, true
}
