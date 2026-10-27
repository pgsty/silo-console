// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
)

type WorkerHealth struct {
	Ready                bool     `json:"ready"`
	Coverage             Coverage `json:"coverage"`
	Queued               int64    `json:"queued"`
	Running              int64    `json:"running"`
	Complete             int64    `json:"complete"`
	Failed               int64    `json:"failed"`
	Limited              int64    `json:"limited"`
	OldestPendingSeconds float64  `json:"oldest_pending_seconds"`
}

func (s *Store) WorkerHealth(ctx context.Context) (WorkerHealth, error) {
	var health WorkerHealth
	coverage, err := s.Coverage(ctx)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return health, err
	}
	health.Coverage = coverage
	err = s.pool.QueryRow(ctx, `SELECT count(*) FILTER(WHERE state='queued'),count(*) FILTER(WHERE state='running'),
 count(*) FILTER(WHERE state='complete'),count(*) FILTER(WHERE state='error'),count(*) FILTER(WHERE state='limited'),
 COALESCE(GREATEST(0,max(extract(epoch FROM clock_timestamp()-requested_at)) FILTER(WHERE state<>'complete')),0)
 FROM console_usage_buckets WHERE scope=$1`, s.scope).Scan(&health.Queued, &health.Running, &health.Complete, &health.Failed, &health.Limited, &health.OldestPendingSeconds)
	if err != nil {
		return health, err
	}
	health.Ready = coverage.ObserverAlive && coverage.Connected && coverage.LastConnectedAt != nil && coverage.LastReconciledAt != nil && !coverage.LastReconciledAt.Before(*coverage.LastConnectedAt)
	return health, nil
}
func workerHTTP(s *Store, c Config) *http.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		fmt.Fprintln(w, "alive")
	})
	mux.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), c.Heartbeat)
		defer cancel()
		health, err := s.WorkerHealth(ctx)
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store")
		if err != nil {
			http.Error(w, `{"ready":false,"reason":"usage store unavailable"}`, http.StatusServiceUnavailable)
			return
		}
		if !health.Ready {
			w.WriteHeader(http.StatusServiceUnavailable)
		}
		_ = json.NewEncoder(w).Encode(health)
	})
	mux.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), c.Heartbeat)
		defer cancel()
		health, err := s.WorkerHealth(ctx)
		if err != nil {
			http.Error(w, "usage state unavailable", http.StatusServiceUnavailable)
			return
		}
		w.Header().Set("Content-Type", "text/plain; version=0.0.4")
		flag := func(value bool) int {
			if value {
				return 1
			}
			return 0
		}
		fmt.Fprintf(w, "silo_usage_worker_ready %d\nsilo_usage_event_stream_connected %d\nsilo_usage_observer_alive %d\n", flag(health.Ready), flag(health.Coverage.Connected), flag(health.Coverage.ObserverAlive))
		for _, state := range []struct {
			name  string
			count int64
		}{{"queued", health.Queued}, {"running", health.Running}, {"complete", health.Complete}, {"error", health.Failed}, {"limited", health.Limited}} {
			fmt.Fprintf(w, "silo_usage_buckets{state=%q} %d\n", state.name, state.count)
		}
		fmt.Fprintf(w, "silo_usage_oldest_pending_seconds %g\n", health.OldestPendingSeconds)
		reconciled := float64(0)
		if health.Coverage.LastReconciledAt != nil {
			reconciled = float64(health.Coverage.LastReconciledAt.Unix())
		}
		fmt.Fprintf(w, "silo_usage_last_reconcile_timestamp_seconds %g\n", reconciled)
	})
	return &http.Server{Addr: c.HTTPAddress, Handler: mux, ReadHeaderTimeout: 5 * time.Second, IdleTimeout: 30 * time.Second}
}
