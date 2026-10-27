// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"encoding/json"
	"errors"
	"time"
	"unicode/utf8"
)

// Checkpoint ends after a whole key and all its versions. minio-go supports a
// StartAfter key for version listings but no public version-ID resume marker.
// Saving an intermediate version as the cursor would silently skip its peers.
// This object is private worker state and never returned to a browser.
type Checkpoint struct {
	Generation int64    `json:"generation"`
	LastKey    string   `json:"last_key"`
	Snapshot   Snapshot `json:"snapshot"`
}

func (c Checkpoint) Validate() error {
	if c.Generation < 1 {
		return errors.New("invalid usage checkpoint generation")
	}
	if err := c.Snapshot.Validate(); err != nil {
		return err
	}
	if !utf8.ValidString(c.LastKey) || len(c.LastKey) > 1024 || (c.LastKey == "" && c.Snapshot.ScannedEntries != 0) {
		return errors.New("invalid usage checkpoint")
	}
	return nil
}
func validateCheckpointProgress(checkpoint Checkpoint, progress Snapshot) error {
	if err := checkpoint.Validate(); err != nil {
		return err
	}
	if err := progress.Validate(); err != nil {
		return err
	}
	if !checkpoint.Snapshot.StartedAt.Equal(progress.StartedAt) || checkpoint.Snapshot.ScannedEntries > progress.ScannedEntries {
		return errors.New("checkpoint and progress disagree")
	}
	return nil
}
func (s *Store) SaveCheckpoint(ctx context.Context, job Record, checkpoint Checkpoint, progress Snapshot, lease time.Duration) error {
	if err := validateCheckpointProgress(checkpoint, progress); err != nil {
		return err
	}
	if lease <= 0 {
		return errors.New("usage lease must be positive")
	}
	saved, err := json.Marshal(checkpoint)
	if err != nil {
		return err
	}
	visible, err := json.Marshal(progress)
	if err != nil {
		return err
	}
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_buckets SET checkpoint=$4::jsonb,progress=$5::jsonb,
 lease_until=clock_timestamp()+$6::bigint*interval '1 millisecond'
 WHERE scope=$1 AND bucket=$2 AND lease_token=$3 AND state='running' AND lease_until>clock_timestamp()`, s.scope, job.Bucket, job.LeaseToken, string(saved), string(visible), lease.Milliseconds())
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}

// Yield moves this bucket behind other jobs of its priority. A new worker can
// continue from the safe cursor without re-reading previously counted keys.
func (s *Store) Yield(ctx context.Context, job Record, checkpoint Checkpoint, progress Snapshot) error {
	if err := validateCheckpointProgress(checkpoint, progress); err != nil {
		return err
	}
	saved, err := json.Marshal(checkpoint)
	if err != nil {
		return err
	}
	visible, err := json.Marshal(progress)
	if err != nil {
		return err
	}
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_buckets SET checkpoint=$4::jsonb,progress=$5::jsonb,
 state='queued',lease_token=NULL,lease_until=NULL,next_run_at=clock_timestamp(),attempts=0
 WHERE scope=$1 AND bucket=$2 AND lease_token=$3 AND state='running' AND lease_until>clock_timestamp()`, s.scope, job.Bucket, job.LeaseToken, string(saved), string(visible))
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}
