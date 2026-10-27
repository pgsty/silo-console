// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrLeaseLost = errors.New("usage scan lease lost")

// Stats is the lossless wire and database representation of an observation.
// A nil snapshot means unknown; an observed empty bucket has explicit zeroes.
type Stats struct {
	CurrentBytes     string `json:"current_bytes"`
	CurrentObjects   int64  `json:"current_objects"`
	RetainedBytes    string `json:"retained_bytes"`
	RetainedVersions int64  `json:"retained_versions"`
	DeleteMarkers    int64  `json:"delete_markers"`
}

func (c Counts) Stats() Stats {
	return Stats{strconv.FormatUint(c.CurrentBytes, 10), c.CurrentObjects, strconv.FormatUint(c.RetainedBytes, 10), c.RetainedVersions, c.DeleteMarkers}
}
func (s Stats) Validate() error {
	for _, value := range []string{s.CurrentBytes, s.RetainedBytes} {
		number, err := strconv.ParseUint(value, 10, 64)
		if err != nil || strconv.FormatUint(number, 10) != value {
			return errors.New("invalid usage bytes")
		}
	}
	for _, value := range []int64{s.CurrentObjects, s.RetainedVersions, s.DeleteMarkers} {
		if value < 0 || value > 1_000_000_000_000 {
			return errors.New("invalid usage count")
		}
	}
	return nil
}

type Snapshot struct {
	Totals         Stats     `json:"totals"`
	ScannedEntries int64     `json:"scanned_entries"`
	StartedAt      time.Time `json:"started_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func (s Snapshot) Validate() error {
	if err := s.Totals.Validate(); err != nil {
		return err
	}
	if s.ScannedEntries != s.Totals.CurrentObjects+s.Totals.RetainedVersions+s.Totals.DeleteMarkers || s.StartedAt.IsZero() || s.UpdatedAt.Before(s.StartedAt) {
		return errors.New("invalid usage observation")
	}
	return nil
}

type Record struct {
	Bucket          string      `json:"bucket"`
	State           string      `json:"state"`
	Generation      int64       `json:"generation"`
	RequestedAt     time.Time   `json:"requested_at"`
	LastEventAt     *time.Time  `json:"last_event_at,omitempty"`
	LastCompletedAt *time.Time  `json:"last_completed_at,omitempty"`
	LastGood        *Snapshot   `json:"last_good,omitempty"`
	Progress        *Snapshot   `json:"progress,omitempty"`
	ErrorCode       string      `json:"error_code,omitempty"`
	Attempts        int         `json:"attempts"`
	LeaseToken      string      `json:"-"`
	Checkpoint      *Checkpoint `json:"-"`
}

type Store struct {
	pool  *pgxpool.Pool
	scope string
}

func OpenStore(ctx context.Context, dsn, endpoint string, maxConnections int32) (*Store, error) {
	if dsn == "" || endpoint == "" {
		return nil, errors.New("usage database and storage endpoint are required")
	}
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, errors.New("invalid usage database configuration")
	}
	if maxConnections < 1 || maxConnections > 64 {
		return nil, errors.New("usage connection limit must be between 1 and 64")
	}
	config.MaxConns = maxConnections
	config.MinConns = 0
	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, errors.New("usage database connection failed")
	}
	scope := sha256.Sum256([]byte(endpoint))
	return &Store{pool: pool, scope: hex.EncodeToString(scope[:])}, nil
}
func (s *Store) Close()                         { s.pool.Close() }
func (s *Store) Ping(ctx context.Context) error { return s.pool.Ping(ctx) }

// Only the worker migrates. Web replicas use the same durable store without
// doing schema administration in response to an operator request.
func (s *Store) Migrate(ctx context.Context) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if _, err = tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtext('silo-console-usage-schema-v1'))`); err != nil {
		return err
	}
	_, err = tx.Exec(ctx, `CREATE TABLE IF NOT EXISTS console_usage_buckets (
 scope text NOT NULL, bucket text NOT NULL,
 state text NOT NULL CHECK(state IN ('queued','running','complete','error','limited')),
 generation bigint NOT NULL DEFAULT 1, running_generation bigint,
 requested_at timestamptz NOT NULL DEFAULT clock_timestamp(), last_event_at timestamptz,
 last_completed_at timestamptz, next_run_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 priority integer NOT NULL DEFAULT 0, attempts integer NOT NULL DEFAULT 0,
 lease_token text, lease_until timestamptz,
 last_good jsonb, progress jsonb, error_code text NOT NULL DEFAULT '',
 PRIMARY KEY(scope,bucket)
 );
 CREATE INDEX IF NOT EXISTS console_usage_queue ON console_usage_buckets(scope,priority DESC,next_run_at) WHERE state IN ('queued','running','error','limited');
 ALTER TABLE console_usage_buckets ADD COLUMN IF NOT EXISTS checkpoint jsonb;
 CREATE TABLE IF NOT EXISTS console_usage_coverage (
 scope text PRIMARY KEY, observer_id text NOT NULL, observer_until timestamptz NOT NULL,
 connected boolean NOT NULL DEFAULT false, last_connected_at timestamptz,
 last_disconnect_at timestamptz, last_reconciled_at timestamptz
 )`)
	if err != nil {
		return err
	}
	return tx.Commit(ctx)
}

// Queue invalidates a bucket, not an arithmetic total. Duplicate and reordered
// events coalesce. A change during a scan requests exactly one subsequent scan.
// Repeated manual clicks join an existing job rather than creating a backlog.
func (s *Store) Queue(ctx context.Context, bucket string, manual bool, debounce, spacing time.Duration, eventAt *time.Time) error {
	if debounce < 0 || spacing < 0 {
		return errors.New("usage queue delays must not be negative")
	}
	if bucket == "" || len(bucket) > 63 {
		return errors.New("invalid usage bucket")
	}
	priority := 10
	if manual {
		priority = 100
		debounce = 0
		spacing = 0
	}
	_, err := s.pool.Exec(ctx, `INSERT INTO console_usage_buckets(scope,bucket,state,priority,next_run_at,last_event_at)
 VALUES($1,$2,'queued',$3,clock_timestamp()+$4::bigint*interval '1 millisecond',$6)
 ON CONFLICT(scope,bucket) DO UPDATE SET
 generation=CASE
  WHEN $7 AND console_usage_buckets.state IN ('queued','running') THEN console_usage_buckets.generation
  WHEN console_usage_buckets.state='queued' AND console_usage_buckets.checkpoint IS NULL THEN console_usage_buckets.generation
  WHEN console_usage_buckets.state IN ('queued','running','error','limited') AND console_usage_buckets.generation>console_usage_buckets.running_generation THEN console_usage_buckets.generation
  ELSE console_usage_buckets.generation+1 END,
 state=CASE WHEN console_usage_buckets.state='running' AND console_usage_buckets.lease_until>clock_timestamp() THEN 'running'
  WHEN NOT $7 AND console_usage_buckets.state IN ('error','limited') THEN console_usage_buckets.state ELSE 'queued' END,
 requested_at=CASE WHEN console_usage_buckets.state IN ('queued','running') THEN console_usage_buckets.requested_at ELSE clock_timestamp() END,
 next_run_at=CASE WHEN NOT $7 AND console_usage_buckets.state IN ('error','limited') THEN console_usage_buckets.next_run_at
  WHEN console_usage_buckets.state IN ('queued','running') THEN LEAST(console_usage_buckets.next_run_at,EXCLUDED.next_run_at)
  ELSE GREATEST(EXCLUDED.next_run_at,COALESCE(console_usage_buckets.last_completed_at,'epoch'::timestamptz)+$5::bigint*interval '1 millisecond') END,
 last_event_at=GREATEST(console_usage_buckets.last_event_at,EXCLUDED.last_event_at),
 priority=GREATEST(console_usage_buckets.priority,EXCLUDED.priority),error_code=CASE WHEN NOT $7 AND console_usage_buckets.state IN ('error','limited') THEN console_usage_buckets.error_code ELSE '' END`, s.scope, bucket, priority, debounce.Milliseconds(), spacing.Milliseconds(), eventAt, manual)
	return err
}

const recordColumns = `bucket,state,generation,requested_at,last_event_at,last_completed_at,last_good,progress,error_code,attempts,COALESCE(lease_token,''),checkpoint`

func readRecord(row pgx.Row) (Record, error) {
	var r Record
	var good, progress, checkpoint []byte
	err := row.Scan(&r.Bucket, &r.State, &r.Generation, &r.RequestedAt, &r.LastEventAt, &r.LastCompletedAt, &good, &progress, &r.ErrorCode, &r.Attempts, &r.LeaseToken, &checkpoint)
	if err != nil {
		return r, err
	}
	for _, value := range []struct {
		raw    []byte
		target **Snapshot
	}{{good, &r.LastGood}, {progress, &r.Progress}} {
		if len(value.raw) > 0 {
			var observation Snapshot
			if err := json.Unmarshal(value.raw, &observation); err != nil {
				return r, errors.New("invalid saved usage observation")
			}
			if err := observation.Validate(); err != nil {
				return r, err
			}
			*value.target = &observation
		}
	}
	if len(checkpoint) > 0 {
		var c Checkpoint
		if err := json.Unmarshal(checkpoint, &c); err != nil {
			return r, errors.New("invalid saved usage checkpoint")
		}
		if err := c.Validate(); err != nil {
			return r, err
		}
		r.Checkpoint = &c
	}
	return r, nil
}
func (s *Store) Get(ctx context.Context, bucket string) (Record, error) {
	return readRecord(s.pool.QueryRow(ctx, `SELECT `+recordColumns+` FROM console_usage_buckets WHERE scope=$1 AND bucket=$2`, s.scope, bucket))
}
func (s *Store) Claim(ctx context.Context, lease time.Duration) (Record, error) {
	if lease <= 0 {
		return Record{}, errors.New("usage lease must be positive")
	}
	token := make([]byte, 16)
	if _, err := rand.Read(token); err != nil {
		return Record{}, err
	}
	return readRecord(s.pool.QueryRow(ctx, `UPDATE console_usage_buckets SET state='running',running_generation=CASE WHEN checkpoint IS NULL THEN generation ELSE (checkpoint->>'generation')::bigint END,
 lease_token=$2,lease_until=clock_timestamp()+$3::bigint*interval '1 millisecond',attempts=attempts+1,progress=CASE WHEN checkpoint IS NULL THEN NULL ELSE progress END,error_code=''
 WHERE (scope,bucket)=(SELECT scope,bucket FROM console_usage_buckets WHERE scope=$1 AND
 ((state IN ('queued','error','limited') AND next_run_at<=clock_timestamp()) OR (state='running' AND lease_until<=clock_timestamp()))
 ORDER BY priority DESC,next_run_at,bucket FOR UPDATE SKIP LOCKED LIMIT 1)
 RETURNING `+recordColumns, s.scope, hex.EncodeToString(token), lease.Milliseconds()))
}
func (s *Store) Progress(ctx context.Context, job Record, observation *Snapshot, lease time.Duration) error {
	if lease <= 0 {
		return errors.New("usage lease must be positive")
	}
	var body any
	if observation != nil {
		if err := observation.Validate(); err != nil {
			return err
		}
		data, err := json.Marshal(observation)
		if err != nil {
			return err
		}
		body = string(data)
	}
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_buckets SET progress=COALESCE($4::jsonb,progress),lease_until=clock_timestamp()+$5::bigint*interval '1 millisecond'
 WHERE scope=$1 AND bucket=$2 AND lease_token=$3 AND state='running' AND lease_until>clock_timestamp()`, s.scope, job.Bucket, job.LeaseToken, body, lease.Milliseconds())
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}
func (s *Store) Complete(ctx context.Context, job Record, observation Snapshot, spacing ...time.Duration) error {
	delay := time.Duration(0)
	if len(spacing) > 0 {
		delay = spacing[0]
	}
	if delay < 0 {
		return errors.New("usage rescan delay must not be negative")
	}
	if err := observation.Validate(); err != nil {
		return err
	}
	body, err := json.Marshal(observation)
	if err != nil {
		return err
	}
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_buckets SET
 state=CASE WHEN generation=running_generation THEN 'complete' ELSE 'queued' END,
 last_good=$4::jsonb,progress=NULL,checkpoint=NULL,last_completed_at=clock_timestamp(),lease_token=NULL,lease_until=NULL,
 priority=CASE WHEN generation=running_generation THEN 0 ELSE priority END,attempts=0,error_code='',
 next_run_at=CASE WHEN generation=running_generation THEN next_run_at ELSE GREATEST(next_run_at,clock_timestamp()+$5::bigint*interval '1 millisecond') END
 WHERE scope=$1 AND bucket=$2 AND lease_token=$3 AND state='running' AND lease_until>clock_timestamp()`, s.scope, job.Bucket, job.LeaseToken, string(body), delay.Milliseconds())
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}
func (s *Store) Fail(ctx context.Context, job Record, code string, limited bool, retry time.Duration) error {
	if retry < 0 {
		return errors.New("usage retry delay must not be negative")
	}
	switch code {
	case "duration", "entries", "upstream", "authorization", "worker_shutdown":
	default:
		return errors.New("unsupported usage failure code")
	}
	state := "error"
	if limited {
		state = "limited"
	}
	command, err := s.pool.Exec(ctx, `UPDATE console_usage_buckets SET state=$4,error_code=$5,lease_token=NULL,lease_until=NULL,
 next_run_at=clock_timestamp()+$6::bigint*interval '1 millisecond'
 WHERE scope=$1 AND bucket=$2 AND lease_token=$3 AND state='running' AND lease_until>clock_timestamp()`, s.scope, job.Bucket, job.LeaseToken, state, code, retry.Milliseconds())
	if err != nil {
		return err
	}
	if command.RowsAffected() != 1 {
		return ErrLeaseLost
	}
	return nil
}

// Discover queues new buckets without invalidating healthy existing results.
// Frequent inventory checks are cheap; full safety-net scans are independent.
func (s *Store) Discover(ctx context.Context, bucket string, debounce time.Duration) error {
	if bucket == "" || len(bucket) > 63 || debounce < 0 {
		return errors.New("invalid usage inventory bucket")
	}
	_, err := s.pool.Exec(ctx, `INSERT INTO console_usage_buckets(scope,bucket,state,priority,next_run_at)
 VALUES($1,$2,'queued',10,clock_timestamp()+$3::bigint*interval '1 millisecond') ON CONFLICT(scope,bucket) DO NOTHING`, s.scope, bucket, debounce.Milliseconds())
	return err
}
