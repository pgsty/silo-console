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
	"bufio"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/netip"
	"os"
	"strconv"
	"sync"
	"sync/atomic"
)

// WebSocket connection limits. Every per-connection bound (frame size, in-flight
// listings, keepalive deadlines) leaves the number of connections a peer may
// hold unbounded; these caps bound that number for the process, for one
// client, and, separately and much lower, for anonymous handshakes, which need
// no credentials at all.
const (
	// ConsoleWSMaxConnections caps the WebSocket connections the process holds
	// at once, authenticated and anonymous together.
	ConsoleWSMaxConnections = "CONSOLE_WS_MAX_CONNECTIONS"
	// ConsoleWSMaxConnectionsPerClient caps the connections one client
	// address (IPv4 address, or IPv6 /64) holds at once.
	ConsoleWSMaxConnectionsPerClient = "CONSOLE_WS_MAX_CONNECTIONS_PER_CLIENT"
	// ConsoleWSMaxAnonymousConnections caps anonymous connections for the
	// process. Anonymous connections also count against the total, so they can
	// never consume more of it than this budget.
	ConsoleWSMaxAnonymousConnections = "CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS"
	// ConsoleWSMaxAnonymousConnectionsPerClient caps anonymous connections
	// from one client address.
	ConsoleWSMaxAnonymousConnectionsPerClient = "CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS_PER_CLIENT"

	// wsConnectionLimitCeiling rejects values that could not be meant as a
	// limit; the process would exhaust descriptors long before reaching them.
	wsConnectionLimitCeiling = 1 << 20
	// wsRetryAfterSeconds is the Retry-After hint sent with a rejected handshake.
	wsRetryAfterSeconds = "5"
)

// wsConnectionLimits is one validated set of caps.
type wsConnectionLimits struct {
	total              int
	perClient          int
	anonymous          int
	anonymousPerClient int
}

// defaultWSConnectionLimits bounds an unconfigured process. The anonymous
// budget is deliberately small: public-bucket browsing needs one connection per
// tab, and nothing else may be opened without a session. The per-client cap is
// generous because clients behind one NAT share an address; deployments that
// need more raise it explicitly.
var defaultWSConnectionLimits = wsConnectionLimits{
	total:              1024,
	perClient:          256,
	anonymous:          64,
	anonymousPerClient: 8,
}

var (
	errWSTooManyConnections       = errors.New("too many WebSocket connections")
	errWSTooManyClientConnections = errors.New("too many WebSocket connections from this client")
)

// wsLimitError carries the HTTP status a rejected handshake answers with.
type wsLimitError struct {
	err    error
	status int
}

func (e *wsLimitError) Error() string { return e.err.Error() }
func (e *wsLimitError) Unwrap() error { return e.err }

// wsClientCount is the live connection count of one client key.
type wsClientCount struct {
	total     int
	anonymous int
}

// wsConnectionLimiter counts open WebSocket connections and admits a new one
// only while every applicable cap has room. A slot is taken before the upgrade
// and given back when the hijacked socket closes, so the count is the number of
// sockets the process actually holds.
type wsConnectionLimiter struct {
	mu        sync.Mutex
	limits    wsConnectionLimits
	total     int
	anonymous int
	perClient map[string]*wsClientCount
}

func newWSConnectionLimiter(limits wsConnectionLimits) *wsConnectionLimiter {
	return &wsConnectionLimiter{limits: limits, perClient: map[string]*wsClientCount{}}
}

// wsConnections is the process-wide limiter. It starts with the defaults and is
// replaced once by configuration; tests swap it for the duration of a test.
var wsConnections atomic.Pointer[wsConnectionLimiter]

func init() {
	wsConnections.Store(newWSConnectionLimiter(defaultWSConnectionLimits))
}

func currentWSConnectionLimiter() *wsConnectionLimiter {
	return wsConnections.Load()
}

// acquire reserves a slot for one connection. The returned release is
// idempotent. Per-client caps are checked first so that one abusive client is
// told it is the one over its limit even while the process is also full.
func (l *wsConnectionLimiter) acquire(clientKey string, anonymous bool) (func(), error) {
	l.mu.Lock()
	defer l.mu.Unlock()

	client := l.perClient[clientKey]
	if client == nil {
		client = &wsClientCount{}
	}
	if client.total >= l.limits.perClient || (anonymous && client.anonymous >= l.limits.anonymousPerClient) {
		return nil, &wsLimitError{err: errWSTooManyClientConnections, status: http.StatusTooManyRequests}
	}
	if l.total >= l.limits.total || (anonymous && l.anonymous >= l.limits.anonymous) {
		return nil, &wsLimitError{err: errWSTooManyConnections, status: http.StatusServiceUnavailable}
	}

	l.perClient[clientKey] = client
	client.total++
	l.total++
	if anonymous {
		client.anonymous++
		l.anonymous++
	}

	var once sync.Once
	return func() {
		once.Do(func() { l.release(clientKey, anonymous) })
	}, nil
}

func (l *wsConnectionLimiter) release(clientKey string, anonymous bool) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.total--
	if anonymous {
		l.anonymous--
	}
	client := l.perClient[clientKey]
	if client == nil {
		return
	}
	client.total--
	if anonymous {
		client.anonymous--
	}
	if client.total <= 0 {
		delete(l.perClient, clientKey)
	}
}

// counts reports the live totals; tests use it to observe release.
func (l *wsConnectionLimiter) counts() (total, anonymous, clients int) {
	l.mu.Lock()
	defer l.mu.Unlock()
	return l.total, l.anonymous, len(l.perClient)
}

// wsClientKey derives the per-client accounting key from the trust-resolved
// client address: the exact IPv4 address, or the /64 of an IPv6 address, since
// one IPv6 host commonly controls a whole /64. Anything unparseable shares one
// key, which is the conservative choice.
func wsClientKey(clientIP string) string {
	addr, err := netip.ParseAddr(clientIP)
	if err != nil {
		return clientIP
	}
	addr = addr.Unmap()
	if addr.Is4() {
		return addr.String()
	}
	prefix, err := addr.Prefix(64)
	if err != nil {
		return addr.String()
	}
	return prefix.Masked().String()
}

// wsConnectionLimitsFromEnvironment reads the four caps, keeping the default
// for each unset variable, and validates the set as a whole.
func wsConnectionLimitsFromEnvironment(lookup func(string) (string, bool)) (wsConnectionLimits, error) {
	limits := defaultWSConnectionLimits
	for _, setting := range []struct {
		name   string
		target *int
	}{
		{ConsoleWSMaxConnections, &limits.total},
		{ConsoleWSMaxConnectionsPerClient, &limits.perClient},
		{ConsoleWSMaxAnonymousConnections, &limits.anonymous},
		{ConsoleWSMaxAnonymousConnectionsPerClient, &limits.anonymousPerClient},
	} {
		raw, present := lookup(setting.name)
		if !present {
			continue
		}
		value, err := strconv.Atoi(raw)
		if err != nil || value < 1 || value > wsConnectionLimitCeiling {
			return wsConnectionLimits{}, fmt.Errorf("%s must be an integer between 1 and %d, got %q", setting.name, wsConnectionLimitCeiling, raw)
		}
		*setting.target = value
	}
	if limits.anonymous > limits.total {
		return wsConnectionLimits{}, fmt.Errorf("%s (%d) must not exceed %s (%d)", ConsoleWSMaxAnonymousConnections, limits.anonymous, ConsoleWSMaxConnections, limits.total)
	}
	if limits.anonymousPerClient > limits.perClient {
		return wsConnectionLimits{}, fmt.Errorf("%s (%d) must not exceed %s (%d)", ConsoleWSMaxAnonymousConnectionsPerClient, limits.anonymousPerClient, ConsoleWSMaxConnectionsPerClient, limits.perClient)
	}
	if limits.anonymousPerClient > limits.anonymous {
		return wsConnectionLimits{}, fmt.Errorf("%s (%d) must not exceed %s (%d)", ConsoleWSMaxAnonymousConnectionsPerClient, limits.anonymousPerClient, ConsoleWSMaxAnonymousConnections, limits.anonymous)
	}
	return limits, nil
}

// ConfigureWebSocketLimits reads the connection caps from the environment and
// installs them. Standalone Console calls it before serving and refuses to
// start on an invalid value; the embedded path logs and keeps the defaults,
// which are bounded.
func ConfigureWebSocketLimits() error {
	limits, err := wsConnectionLimitsFromEnvironment(os.LookupEnv)
	if err != nil {
		return err
	}
	wsConnections.Store(newWSConnectionLimiter(limits))
	return nil
}

// wsCountedWriter hands the upgrader a hijacked connection whose Close gives
// the reserved slot back. Whether the hijack happened decides who releases a
// slot when the upgrade fails: the connection if it was hijacked, the handler
// otherwise.
type wsCountedWriter struct {
	http.ResponseWriter
	release  func()
	hijacked bool
}

func (w *wsCountedWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	conn, rw, err := http.NewResponseController(w.ResponseWriter).Hijack()
	if err != nil {
		return nil, nil, err
	}
	w.hijacked = true
	return &wsCountedConn{Conn: conn, release: w.release}, rw, nil
}

// Unwrap keeps http.ResponseController features of the wrapped writer usable.
func (w *wsCountedWriter) Unwrap() http.ResponseWriter { return w.ResponseWriter }

type wsCountedConn struct {
	net.Conn
	release func()
}

func (c *wsCountedConn) Close() error {
	c.release()
	return c.Conn.Close()
}
