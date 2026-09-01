// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package api

import (
	"errors"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/minio/websocket"
)

// swapWSConnectionLimits installs a limiter with the given caps for the test
// and restores the previous one afterwards.
func swapWSConnectionLimits(t *testing.T, limits wsConnectionLimits) *wsConnectionLimiter {
	t.Helper()
	previous := wsConnections.Load()
	limiter := newWSConnectionLimiter(limits)
	wsConnections.Store(limiter)
	t.Cleanup(func() { wsConnections.Store(previous) })
	return limiter
}

func envLookup(values map[string]string) func(string) (string, bool) {
	return func(name string) (string, bool) {
		value, ok := values[name]
		return value, ok
	}
}

func TestWSConnectionLimitsFromEnvironment(t *testing.T) {
	tests := []struct {
		name    string
		env     map[string]string
		want    wsConnectionLimits
		wantErr string
	}{
		{name: "unset keeps the defaults", env: nil, want: defaultWSConnectionLimits},
		{
			name: "every cap can be raised",
			env: map[string]string{
				ConsoleWSMaxConnections:                   "4096",
				ConsoleWSMaxConnectionsPerClient:          "512",
				ConsoleWSMaxAnonymousConnections:          "128",
				ConsoleWSMaxAnonymousConnectionsPerClient: "16",
			},
			want: wsConnectionLimits{total: 4096, perClient: 512, anonymous: 128, anonymousPerClient: 16},
		},
		{
			name: "a single override keeps the other defaults",
			env:  map[string]string{ConsoleWSMaxAnonymousConnectionsPerClient: "2"},
			want: wsConnectionLimits{total: 1024, perClient: 256, anonymous: 64, anonymousPerClient: 2},
		},
		{name: "not a number", env: map[string]string{ConsoleWSMaxConnections: "many"}, wantErr: "must be an integer"},
		{name: "zero is not a limit", env: map[string]string{ConsoleWSMaxAnonymousConnections: "0"}, wantErr: "must be an integer"},
		{name: "negative", env: map[string]string{ConsoleWSMaxConnectionsPerClient: "-1"}, wantErr: "must be an integer"},
		{name: "empty", env: map[string]string{ConsoleWSMaxConnectionsPerClient: ""}, wantErr: "must be an integer"},
		{name: "above the ceiling", env: map[string]string{ConsoleWSMaxConnections: "1048577"}, wantErr: "must be an integer"},
		{
			name:    "anonymous budget above the total",
			env:     map[string]string{ConsoleWSMaxConnections: "10", ConsoleWSMaxAnonymousConnections: "11"},
			wantErr: "must not exceed CONSOLE_WS_MAX_CONNECTIONS",
		},
		{
			name:    "anonymous per-client cap above the per-client cap",
			env:     map[string]string{ConsoleWSMaxConnectionsPerClient: "4", ConsoleWSMaxAnonymousConnectionsPerClient: "5"},
			wantErr: "must not exceed CONSOLE_WS_MAX_CONNECTIONS_PER_CLIENT",
		},
		{
			name:    "anonymous per-client cap above the anonymous budget",
			env:     map[string]string{ConsoleWSMaxAnonymousConnections: "4", ConsoleWSMaxAnonymousConnectionsPerClient: "5"},
			wantErr: "must not exceed CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := wsConnectionLimitsFromEnvironment(envLookup(tt.env))
			if tt.wantErr != "" {
				if err == nil || !strings.Contains(err.Error(), tt.wantErr) {
					t.Fatalf("error = %v, want it to contain %q", err, tt.wantErr)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got != tt.want {
				t.Fatalf("limits = %+v, want %+v", got, tt.want)
			}
		})
	}
}

func TestWSClientKey(t *testing.T) {
	tests := map[string]string{
		"203.0.113.9":              "203.0.113.9",
		"::ffff:203.0.113.9":       "203.0.113.9",
		"2001:db8:1:2:3:4:5:6":     "2001:db8:1:2::/64",
		"2001:db8:1:2::1":          "2001:db8:1:2::/64",
		"2001:db8:1:3::1":          "2001:db8:1:3::/64",
		"[2001:db8::1]":            "[2001:db8::1]",
		"not-an-address":           "not-an-address",
		"":                         "",
		"203.0.113.9:1234":         "203.0.113.9:1234",
		"2001:db8:1:2:3:4:5:6%eth": "2001:db8:1:2::/64",
	}
	for in, want := range tests {
		if got := wsClientKey(in); got != want {
			t.Errorf("wsClientKey(%q) = %q, want %q", in, got, want)
		}
	}
}

func expectLimitStatus(t *testing.T, err error, status int) {
	t.Helper()
	var limitErr *wsLimitError
	if !errors.As(err, &limitErr) {
		t.Fatalf("error = %v, want a limit error with status %d", err, status)
	}
	if limitErr.status != status {
		t.Fatalf("status = %d, want %d (%v)", limitErr.status, status, err)
	}
}

func TestWSConnectionLimiterAccounting(t *testing.T) {
	limiter := newWSConnectionLimiter(wsConnectionLimits{total: 2, perClient: 1, anonymous: 1, anonymousPerClient: 1})

	releaseA, err := limiter.acquire("a", true)
	if err != nil {
		t.Fatalf("first anonymous connection: %v", err)
	}
	if _, err := limiter.acquire("a", false); err == nil {
		t.Fatal("second connection from a must hit the per-client cap")
	} else {
		expectLimitStatus(t, err, http.StatusTooManyRequests)
	}
	if _, err := limiter.acquire("b", true); err == nil {
		t.Fatal("second anonymous connection must hit the anonymous budget")
	} else {
		expectLimitStatus(t, err, http.StatusServiceUnavailable)
	}
	releaseB, err := limiter.acquire("b", false)
	if err != nil {
		t.Fatalf("authenticated connection from b: %v", err)
	}
	if _, err := limiter.acquire("c", false); err == nil {
		t.Fatal("third connection must hit the total")
	} else {
		expectLimitStatus(t, err, http.StatusServiceUnavailable)
	}
	if total, anonymous, clients := limiter.counts(); total != 2 || anonymous != 1 || clients != 2 {
		t.Fatalf("counts = %d/%d/%d, want 2/1/2", total, anonymous, clients)
	}

	releaseA()
	releaseA() // idempotent
	if total, anonymous, clients := limiter.counts(); total != 1 || anonymous != 0 || clients != 1 {
		t.Fatalf("counts after release = %d/%d/%d, want 1/0/1", total, anonymous, clients)
	}
	releaseC, err := limiter.acquire("c", false)
	if err != nil {
		t.Fatalf("slot was not given back: %v", err)
	}
	releaseB()
	releaseC()
	if total, anonymous, clients := limiter.counts(); total != 0 || anonymous != 0 || clients != 0 {
		t.Fatalf("counts after all releases = %d/%d/%d, want 0/0/0", total, anonymous, clients)
	}
}

// dialExpectingRejection performs a handshake that must be refused with the
// given status and a Retry-After hint.
func dialExpectingRejection(t *testing.T, rawURL string, header http.Header, status int) {
	t.Helper()
	conn, resp, err := websocket.DefaultDialer.Dial(rawURL, header)
	if err == nil {
		conn.Close()
		t.Fatalf("expected the handshake to be rejected with %d", status)
	}
	if resp == nil || resp.StatusCode != status {
		t.Fatalf("expected %d, got %v (%v)", status, resp, err)
	}
	if resp.Header.Get("Retry-After") != wsRetryAfterSeconds {
		t.Fatalf("Retry-After = %q, want %q", resp.Header.Get("Retry-After"), wsRetryAfterSeconds)
	}
}

func TestServeWSConnectionCaps(t *testing.T) {
	s3 := fakeS3(t)
	t.Setenv(ConsoleMinIOServer, s3.URL)
	base := serveWSServer(t)
	authenticated := http.Header{"Cookie": {"token=" + consoleSessionCookie(t, fakeS3AccessKey)}}
	objectManager := base + "/ws/objectManager"

	t.Run("anonymous budget and process total", func(t *testing.T) {
		limiter := swapWSConnectionLimits(t, wsConnectionLimits{total: 3, perClient: 5, anonymous: 1, anonymousPerClient: 2})

		first := dialWS(t, objectManager, nil)
		dialExpectingRejection(t, objectManager, nil, http.StatusServiceUnavailable)

		dialWS(t, objectManager, authenticated)
		dialWS(t, objectManager, authenticated)
		if total, anonymous, _ := limiter.counts(); total != 3 || anonymous != 1 {
			t.Fatalf("counts = %d/%d, want 3/1", total, anonymous)
		}
		dialExpectingRejection(t, objectManager, authenticated, http.StatusServiceUnavailable)

		// Closing a connection gives its slot back once the server has seen
		// the close, and the anonymous budget with it.
		first.Close()
		waitUntil(t, 5*time.Second, func() bool {
			total, anonymous, _ := limiter.counts()
			return total == 2 && anonymous == 0
		}, "slot released after the client closed")
		dialWS(t, objectManager, nil)
	})

	t.Run("per-client caps", func(t *testing.T) {
		limiter := swapWSConnectionLimits(t, wsConnectionLimits{total: 10, perClient: 2, anonymous: 5, anonymousPerClient: 1})

		dialWS(t, objectManager, nil)
		dialExpectingRejection(t, objectManager, nil, http.StatusTooManyRequests)
		dialWS(t, objectManager, authenticated)
		dialExpectingRejection(t, objectManager, authenticated, http.StatusTooManyRequests)
		if total, anonymous, clients := limiter.counts(); total != 2 || anonymous != 1 || clients != 1 {
			t.Fatalf("counts = %d/%d/%d, want 2/1/1", total, anonymous, clients)
		}
	})

	t.Run("a rejected origin releases the slot before any socket exists", func(t *testing.T) {
		limiter := swapWSConnectionLimits(t, wsConnectionLimits{total: 1, perClient: 1, anonymous: 1, anonymousPerClient: 1})

		conn, resp, err := websocket.DefaultDialer.Dial(objectManager, http.Header{"Origin": {"http://evil.example"}})
		if err == nil {
			conn.Close()
			t.Fatal("expected the origin to be rejected")
		}
		if resp == nil || resp.StatusCode != http.StatusForbidden {
			t.Fatalf("expected 403, got %v (%v)", resp, err)
		}
		waitUntil(t, 5*time.Second, func() bool {
			total, _, _ := limiter.counts()
			return total == 0
		}, "slot released after a failed upgrade")
		dialWS(t, objectManager, nil)
	})

	t.Run("authentication failures do not consume slots", func(t *testing.T) {
		limiter := swapWSConnectionLimits(t, wsConnectionLimits{total: 1, perClient: 1, anonymous: 1, anonymousPerClient: 1})
		for i := 0; i < 3; i++ {
			conn, resp, err := websocket.DefaultDialer.Dial(base+"/ws/trace", nil)
			if err == nil {
				conn.Close()
				t.Fatal("expected 401")
			}
			if resp == nil || resp.StatusCode != http.StatusUnauthorized {
				t.Fatalf("expected 401, got %v", resp)
			}
		}
		if total, _, _ := limiter.counts(); total != 0 {
			t.Fatalf("total = %d after rejected handshakes, want 0", total)
		}
	})
}
