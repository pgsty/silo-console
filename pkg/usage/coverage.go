// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"time"
)

type Coverage struct {
	ObserverAlive    bool       `json:"observer_alive"`
	Connected        bool       `json:"connected"`
	LastConnectedAt  *time.Time `json:"last_connected_at,omitempty"`
	LastDisconnectAt *time.Time `json:"last_disconnect_at,omitempty"`
	LastReconciledAt *time.Time `json:"last_reconciled_at,omitempty"`
}

// A single leased observer subscribes to the storage change stream. Scan
// workers can scale independently; a replacement observer reconciles gaps.
func (s *Store) AcquireObserver(ctx context.Context, id string, lease time.Duration) (bool, error) {
	if id == "" || lease <= 0 {
		return false, errors.New("invalid usage observer lease")
	}
	command, err := s.pool.Exec(ctx, `INSERT INTO console_usage_coverage(scope,observer_id,observer_until)
 VALUES($1,$2,clock_timestamp()+$3::bigint*interval '1 millisecond')
 ON CONFLICT(scope) DO UPDATE SET observer_id=$2,observer_until=EXCLUDED.observer_until,
 connected=CASE WHEN console_usage_coverage.observer_id=$2 THEN console_usage_coverage.connected ELSE false END
 WHERE console_usage_coverage.observer_until<=clock_timestamp() OR console_usage_coverage.observer_id=$2`, s.scope, id, lease.Milliseconds())
	if err != nil {
		return false, err
	}
	return command.RowsAffected() == 1, nil
}
func (s *Store) Observe(ctx context.Context, id string, connected bool, lease time.Duration) error {
	if lease <= 0 {
		return errors.New("invalid usage observer lease")
	}
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_coverage SET observer_until=clock_timestamp()+$4::bigint*interval '1 millisecond',
 last_connected_at=CASE WHEN $3 AND NOT connected THEN clock_timestamp() ELSE last_connected_at END,
 last_disconnect_at=CASE WHEN NOT $3 AND connected THEN clock_timestamp() ELSE last_disconnect_at END,
 connected=$3
 WHERE scope=$1 AND observer_id=$2 AND observer_until>clock_timestamp()`, s.scope, id, connected, lease.Milliseconds())
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}
func (s *Store) Reconciled(ctx context.Context, id string) error {
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_coverage SET last_reconciled_at=clock_timestamp()
 WHERE scope=$1 AND observer_id=$2 AND observer_until>clock_timestamp()`, s.scope, id)
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}
func (s *Store) Coverage(ctx context.Context) (Coverage, error) {
	var c Coverage
	err := s.pool.QueryRow(ctx, `SELECT observer_until>clock_timestamp(),connected AND observer_until>clock_timestamp(),last_connected_at,last_disconnect_at,last_reconciled_at
 FROM console_usage_coverage WHERE scope=$1`, s.scope).Scan(&c.ObserverAlive, &c.Connected, &c.LastConnectedAt, &c.LastDisconnectAt, &c.LastReconciledAt)
	return c, err
}

func (s *Store) ReleaseObserver(ctx context.Context, id string) error {
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_coverage SET connected=false,observer_until=clock_timestamp(),
 last_disconnect_at=CASE WHEN connected THEN clock_timestamp() ELSE last_disconnect_at END
 WHERE scope=$1 AND observer_id=$2`, s.scope, id)
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}
