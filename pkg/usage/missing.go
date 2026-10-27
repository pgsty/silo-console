// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
)

// A deleted bucket is not an endless retry incident. A mutation arriving after
// the missing response wins: retain its request, discard old scan state and
// verify the newly requested generation instead of deleting it.
func (s *Store) MissingBucket(ctx context.Context, job Record) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	var generation, running int64
	err = tx.QueryRow(ctx, `SELECT generation,running_generation FROM console_usage_buckets
 WHERE scope=$1 AND bucket=$2 AND lease_token=$3 AND state='running' AND lease_until>clock_timestamp() FOR UPDATE`, s.scope, job.Bucket, job.LeaseToken).Scan(&generation, &running)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrLeaseLost
		}
		return err
	}
	if generation == running {
		_, err = tx.Exec(ctx, `DELETE FROM console_usage_buckets WHERE scope=$1 AND bucket=$2`, s.scope, job.Bucket)
	} else {
		_, err = tx.Exec(ctx, `UPDATE console_usage_buckets SET state='queued',last_good=NULL,progress=NULL,checkpoint=NULL,
 last_completed_at=NULL,next_run_at=clock_timestamp(),lease_token=NULL,lease_until=NULL,attempts=0,error_code=''
 WHERE scope=$1 AND bucket=$2`, s.scope, job.Bucket)
	}
	if err != nil {
		return err
	}
	return tx.Commit(ctx)
}
