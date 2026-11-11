//go:build integration

// Copyright (c) 2026 PGSTY (Ruohang Feng) and the SILO contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func TestStorePoolCancellationAndReset(t *testing.T) {
	store := integrationStore(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Exhaust the application's pool so Ping has to wait for a connection.
	var borrowed []*pgxpool.Conn
	defer func() {
		for _, conn := range borrowed {
			conn.Release()
		}
	}()
	pids := make(map[uint32]bool)
	for range store.pool.Config().MaxConns {
		conn, err := store.pool.Acquire(ctx)
		if err != nil {
			t.Fatal(err)
		}
		borrowed = append(borrowed, conn)
		pids[conn.Conn().PgConn().PID()] = true
	}
	waitCtx, waitCancel := context.WithTimeout(ctx, 50*time.Millisecond)
	defer waitCancel()
	if err := store.Ping(waitCtx); !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("Ping waiting for an exhausted pool: got %v, want deadline exceeded", err)
	}

	// Reset must retire even connections that were borrowed during the reset.
	store.pool.Reset()
	for _, conn := range borrowed {
		conn.Release()
	}
	borrowed = nil
	conn, err := store.pool.Acquire(ctx)
	if err != nil {
		t.Fatal(err)
	}
	pid := conn.Conn().PgConn().PID()
	conn.Release()
	if pids[pid] {
		t.Fatal("Reset reused a connection borrowed before the reset")
	}
	if err := store.Ping(ctx); err != nil {
		t.Fatalf("store did not recover after cancellation and reset: %v", err)
	}
	if err := store.Queue(ctx, "pool-recovery", true, 0, 0, nil); err != nil {
		t.Fatalf("usage writes failed after pool recovery: %v", err)
	}
}

func TestStoreCloseWaitsForBorrowedConnection(t *testing.T) {
	// Use a separate store because integrationStore cleans up through its pool.
	base := integrationStore(t)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	store, err := OpenStore(ctx, base.pool.Config().ConnString(), "http://close-test.invalid", 1)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(store.Close)
	conn, err := store.pool.Acquire(ctx)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Release()
	closing, closed := make(chan struct{}), make(chan struct{})
	go func() {
		close(closing)
		store.Close()
		close(closed)
	}()
	<-closing
	select {
	case <-closed:
		t.Fatal("Close returned while a connection was still borrowed")
	case <-time.After(50 * time.Millisecond):
	}
	conn.Release()
	select {
	case <-closed:
	case <-ctx.Done():
		t.Fatal("Close did not finish after the connection was released")
	}
	if err := store.Ping(ctx); err == nil {
		t.Fatal("closed store accepted a new database operation")
	}
}
