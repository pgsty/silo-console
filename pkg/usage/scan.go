// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"net/url"
	"strconv"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type ListingClient interface {
	ListObjects(context.Context, string, minio.ListObjectsOptions) <-chan minio.ObjectInfo
}
type ScanFailure struct {
	Code    string
	Limited bool
}

func (e *ScanFailure) Error() string { return "usage scan: " + e.Code }
func (c Config) NewS3Client() (*minio.Client, error) {
	endpoint, err := url.Parse(c.Endpoint)
	if err != nil {
		return nil, errors.New("invalid usage storage endpoint")
	}
	return minio.New(endpoint.Host, &minio.Options{Secure: endpoint.Scheme == "https", Creds: credentials.NewStaticV4(c.AccessKey, c.SecretKey, c.SessionToken)})
}
func (s Stats) counts() (Counts, error) {
	if err := s.Validate(); err != nil {
		return Counts{}, err
	}
	current, _ := strconv.ParseUint(s.CurrentBytes, 10, 64)
	retained, _ := strconv.ParseUint(s.RetainedBytes, 10, 64)
	return Counts{CurrentBytes: current, RetainedBytes: retained, CurrentObjects: s.CurrentObjects, RetainedVersions: s.RetainedVersions, DeleteMarkers: s.DeleteMarkers}, nil
}
func scanFailure(err error) *ScanFailure {
	switch minio.ToErrorResponse(err).Code {
	case "NoSuchBucket":
		return &ScanFailure{Code: "not_found"}
	case "AccessDenied", "InvalidAccessKeyId", "SignatureDoesNotMatch", "ExpiredToken", "InvalidToken":
		return &ScanFailure{Code: "authorization"}
	}
	return &ScanFailure{Code: "upstream"}
}

// RunSlice counts one fair slice of a durable job. Only whole key/version
// groups advance the checkpoint. A complete snapshot is published only when
// the SDK reaches the end without a listing error or canceled context.
func (s *Store) RunSlice(ctx context.Context, client ListingClient, job Record, c Config) error {
	started := time.Now().UTC()
	counts := Counts{}
	lastKey := ""
	if job.Checkpoint != nil {
		var err error
		counts, err = job.Checkpoint.Snapshot.Totals.counts()
		if err != nil {
			return err
		}
		started = job.Checkpoint.Snapshot.StartedAt
		lastKey = job.Checkpoint.LastKey
	}
	snapshot := func() Snapshot {
		return Snapshot{Totals: counts.Stats(), ScannedEntries: counts.CurrentObjects + counts.RetainedVersions + counts.DeleteMarkers, StartedAt: started, UpdatedAt: time.Now().UTC()}
	}
	safeCounts, safeKey := counts, lastKey
	generation := job.Generation
	if job.Checkpoint != nil {
		generation = job.Checkpoint.Generation
	}
	safe := func() Checkpoint {
		return Checkpoint{Generation: generation, LastKey: safeKey, Snapshot: Snapshot{Totals: safeCounts.Stats(), ScannedEntries: safeCounts.CurrentObjects + safeCounts.RetainedVersions + safeCounts.DeleteMarkers, StartedAt: started, UpdatedAt: time.Now().UTC()}}
	}
	scanCtx, cancel := context.WithTimeout(ctx, c.ScanTimeout)
	objects := client.ListObjects(scanCtx, job.Bucket, minio.ListObjectsOptions{Recursive: true, WithVersions: true, StartAfter: lastKey, MaxKeys: 1000})
	defer func() {
		cancel()
		for range objects {
		}
	}()
	interval := c.ProgressInterval
	if c.Heartbeat < interval {
		interval = c.Heartbeat
	}
	ticker := time.NewTicker(interval)
	defer ticker.Stop()
	sliceStarted := time.Now()
	currentKey := ""
	persist := func() error {
		operation, cancel := context.WithTimeout(ctx, c.Heartbeat)
		defer cancel()
		return s.SaveCheckpoint(operation, job, safe(), snapshot(), c.Lease)
	}
	for {
		select {
		case <-scanCtx.Done():
			if ctx.Err() != nil {
				return &ScanFailure{Code: "worker_shutdown"}
			}
			if err := persist(); err != nil {
				return err
			}
			return &ScanFailure{Code: "duration", Limited: true}
		case <-ticker.C:
			if err := persist(); err != nil {
				return err
			}
		case object, open := <-objects:
			if !open {
				if scanCtx.Err() != nil {
					if ctx.Err() != nil {
						return &ScanFailure{Code: "worker_shutdown"}
					}
					return &ScanFailure{Code: "duration", Limited: true}
				}
				return s.Complete(ctx, job, snapshot(), c.MinScanInterval)
			}
			if object.Err != nil {
				if ctx.Err() != nil {
					return &ScanFailure{Code: "worker_shutdown"}
				}
				if scanCtx.Err() != nil {
					if err := persist(); err != nil {
						return err
					}
					return &ScanFailure{Code: "duration", Limited: true}
				}
				if err := persist(); err != nil {
					return err
				}
				return scanFailure(object.Err)
			}
			if object.Key == "" || (lastKey != "" && object.Key <= lastKey) || (currentKey != "" && object.Key < currentKey) {
				return &ScanFailure{Code: "upstream"}
			}
			if object.Key != currentKey {
				if currentKey != "" {
					safeCounts, safeKey = counts, currentKey
					// Always finish at least one key group in this slice. A
					// slow first page must not yield the same resume cursor
					// forever without counting any newly returned object.
					if time.Since(sliceStarted) >= c.ScanSlice {
						return s.Yield(ctx, job, safe(), snapshot())
					}
				}
				currentKey = object.Key
			}
			if counts.CurrentObjects+counts.RetainedVersions+counts.DeleteMarkers >= c.MaxEntries {
				if err := persist(); err != nil {
					return err
				}
				return &ScanFailure{Code: "entries", Limited: true}
			}
			next, err := counts.Add(object, true)
			if err != nil {
				return &ScanFailure{Code: "upstream"}
			}
			counts = next
		}
	}
}
