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
		settleScan(ctx, s, job, s.RunSlice(ctx, client, job, c), c)
	}
}

// settleScan records how a claimed slice ended. A stopping worker hands its
// job back with Release whatever interrupted it: the shutdown check inside
// RunSlice, or a database write canceled with the worker's context. The
// lease guard makes Release a no-op for a job that was already completed,
// yielded or taken over.
func settleScan(ctx context.Context, s *Store, job Record, err error, c Config) {
	if err == nil || errors.Is(err, ErrLeaseLost) {
		return
	}
	var failure *ScanFailure
	isFailure := errors.As(err, &failure)
	if ctx.Err() != nil || (isFailure && failure.Code == "worker_shutdown") {
		operation, cancel := context.WithTimeout(context.Background(), c.Heartbeat)
		releaseErr := s.Release(operation, job)
		cancel()
		if releaseErr != nil && !errors.Is(releaseErr, ErrLeaseLost) {
			log.Print("usage worker: state store unavailable while releasing an interrupted scan; lease recovery will resume it")
		}
		return
	}
	if !isFailure {
		log.Print("usage worker: scan interrupted by state store failure; lease recovery will resume it")
		return
	}
	if failure.Code == "not_found" {
		operation, stop := context.WithTimeout(ctx, c.Heartbeat)
		_ = s.MissingBucket(operation, job)
		stop()
		return
	}
	operation, cancel := context.WithTimeout(context.Background(), c.Heartbeat)
	persistErr := s.Fail(operation, job, failure.Code, failure.Limited, c.retry(job.Attempts))
	cancel()
	if persistErr != nil && !errors.Is(persistErr, ErrLeaseLost) {
		log.Print("usage worker: state store unavailable while recording scan failure")
	}
	log.Printf("usage worker: bucket=%q scan=%s", job.Bucket, failure.Code)
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
	ctx = streamCtx
	// Inventory may take longer than a lease. Renew independently of the event
	// loop, and cancel all of this observer's work as soon as renewal fails.
	renewed := make(chan struct{})
	go func() {
		defer close(renewed)
		ticker := time.NewTicker(c.Heartbeat)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				operation, stop := context.WithTimeout(ctx, c.Heartbeat)
				err := s.RenewObserver(operation, owner, c.Lease)
				stop()
				if err != nil {
					cancel()
					return
				}
			}
		}
	}()
	var events <-chan notification.Info
	var streamDone chan struct{}
	defer func() {
		cancel()
		<-renewed
		// Release first: the SDK's reconnect backoff sleeps without watching
		// the context, so waiting for the stream could hold the lease for up
		// to its maximum backoff and delay a replacement observer.
		operation, stop := context.WithTimeout(context.Background(), c.Heartbeat)
		_ = s.ReleaseObserver(operation, owner)
		stop()
		if events != nil {
			for range events {
			}
		}
		if streamDone != nil {
			<-streamDone
		}
	}()
	base := c.Transport
	if base == nil {
		defaultTransport, err := minio.DefaultTransport(strings.HasPrefix(c.Endpoint, "https://"))
		if err != nil {
			log.Print("usage observer: transport configuration invalid")
			return
		}
		base = defaultTransport
	}
	transport := &eventTransport{base: base, wake: make(chan struct{}, 1)}
	endpoint, _ := url.Parse(c.Endpoint)
	client, err := minio.New(endpoint.Host, &minio.Options{Secure: endpoint.Scheme == "https", Creds: credentials.NewStaticV4(c.AccessKey, c.SecretKey, c.SessionToken), Transport: transport})
	if err != nil {
		return
	}
	// Bucket events matter too: a force delete removes every object but
	// emits only s3:BucketRemoved.
	events = client.ListenNotification(streamCtx, "", "", []string{"s3:ObjectCreated:*", "s3:ObjectRemoved:*", "s3:BucketCreated:*", "s3:BucketRemoved:*"})
	// The storage server drops notifications for a subscriber that stops
	// reading, without closing the stream. Consume the stream continuously, so
	// reconciliation and database writes on the loop below cannot lose changes
	// while coverage still reports a reconciled connection. Pending work is one
	// entry per bucket, bounded by the inventory rather than the event rate.
	pending := &pendingChanges{buckets: map[string]pendingChange{}}
	streamDone = make(chan struct{})
	go func() {
		defer close(streamDone)
		for info := range events {
			if info.Err != nil {
				if ctx.Err() == nil {
					log.Print("usage observer: change stream failed; coverage unavailable until recovery")
				}
				return
			}
			for _, event := range info.Records {
				if bucket, at, ok := changedBucket(event); ok {
					pending.add(bucket, pendingChange{at: at, removed: strings.HasPrefix(event.EventName, "s3:BucketRemoved:")})
				}
			}
		}
	}()
	heartbeat := time.NewTicker(c.Heartbeat)
	defer heartbeat.Stop()
	periodic := time.NewTicker(c.ReconcileInterval)
	defer periodic.Stop()
	full := time.NewTicker(c.FullReconcileInterval)
	defer full.Stop()
	flush := time.NewTicker(c.PollInterval)
	defer flush.Stop()
	connected := false
	var observedEpoch uint64
	flushEvents := func() bool {
		batch := pending.take()
		for bucket, change := range batch {
			parent := ctx
			if ctx.Err() != nil {
				parent = context.Background()
			}
			operation, stop := context.WithTimeout(parent, c.Heartbeat)
			var err error
			if change.removed {
				err = s.Removed(operation, bucket, c.EventDebounce)
			}
			if err == nil {
				err = s.Queue(operation, bucket, false, c.EventDebounce, c.MinScanInterval, &change.at)
			}
			stop()
			if err != nil {
				pending.restore(batch)
				if ctx.Err() == nil {
					log.Print("usage observer: failed to persist changes; reconnect reconciliation required")
				}
				return false
			}
			delete(batch, bucket)
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
		case <-streamDone:
			// Persist what was received; the next observer reconciles the rest.
			flushEvents()
			return
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

// pendingChange is the newest event time for a bucket and whether the
// bucket was deleted since the last flush.
type pendingChange struct {
	at      time.Time
	removed bool
}

// pendingChanges coalesces received notifications into one invalidation per
// bucket until the observer loop persists them. A deletion is kept even when
// a later event, such as re-creating the bucket, arrives in the same batch.
type pendingChanges struct {
	sync.Mutex
	buckets map[string]pendingChange
}

func (p *pendingChanges) add(bucket string, change pendingChange) {
	p.Lock()
	defer p.Unlock()
	if previous, exists := p.buckets[bucket]; exists {
		if previous.at.After(change.at) {
			change.at = previous.at
		}
		change.removed = change.removed || previous.removed
	}
	p.buckets[bucket] = change
}

func (p *pendingChanges) take() map[string]pendingChange {
	p.Lock()
	defer p.Unlock()
	batch := p.buckets
	p.buckets = map[string]pendingChange{}
	return batch
}

// restore returns unpersisted changes without discarding newer arrivals.
func (p *pendingChanges) restore(batch map[string]pendingChange) {
	for bucket, change := range batch {
		p.add(bucket, change)
	}
}

func changedBucket(event notification.Event) (string, time.Time, bool) {
	if event.S3.Bucket.Name == "" {
		return "", time.Time{}, false
	}
	switch {
	case strings.HasPrefix(event.EventName, "s3:ObjectCreated:"):
	case strings.HasPrefix(event.EventName, "s3:ObjectRemoved:"):
	case strings.HasPrefix(event.EventName, "s3:BucketCreated:"):
	case strings.HasPrefix(event.EventName, "s3:BucketRemoved:"):
	default:
		return "", time.Time{}, false
	}
	at, err := time.Parse(time.RFC3339Nano, event.EventTime)
	if err != nil {
		at = time.Now().UTC()
	}
	return event.S3.Bucket.Name, at, true
}
