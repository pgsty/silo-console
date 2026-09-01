// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"testing"
)

func mustSourceIPTrustPolicy(t *testing.T, value string) sourceIPTrustPolicy {
	t.Helper()
	policy, err := parseSourceIPTrust(value, "test trusted proxies")
	if err != nil {
		t.Fatalf("parseSourceIPTrust(%q): %v", value, err)
	}
	return policy
}

func sourceIPRequest(peer string, header http.Header) *http.Request {
	return &http.Request{RemoteAddr: peer, Header: header}
}

func TestParseSourceIPTrust(t *testing.T) {
	tests := []struct {
		name      string
		value     string
		contains  []string
		rejects   []string
		wantError bool
	}{
		{
			name:     "bare IPv4 is widened to one host",
			value:    "192.0.2.10",
			contains: []string{"192.0.2.10"},
			rejects:  []string{"192.0.2.11"},
		},
		{
			name:     "bare IPv6 is widened to one host",
			value:    "2001:db8::10",
			contains: []string{"2001:db8::10"},
			rejects:  []string{"2001:db8::11"},
		},
		{
			name:     "mixed separators and masked CIDRs",
			value:    "192.0.2.99/24; 198.51.100.7\n2001:db8::8/126",
			contains: []string{"192.0.2.1", "198.51.100.7", "2001:db8::9"},
			rejects:  []string{"198.51.100.8", "2001:db8::c"},
		},
		{
			name:     "IPv4-mapped host entry matches the IPv4 peer",
			value:    "::ffff:192.0.2.7",
			contains: []string{"192.0.2.7", "::ffff:192.0.2.7"},
			rejects:  []string{"192.0.2.8"},
		},
		{
			name:     "IPv4-mapped prefix entry matches the IPv4 range",
			value:    "::ffff:192.0.2.0/120",
			contains: []string{"192.0.2.7", "192.0.2.255"},
			rejects:  []string{"192.0.3.1"},
		},
		{name: "blank trusts none", value: " \t\n"},
		{name: "none trusts none", value: " NoNe "},
		{name: "off trusts none", value: "OFF"},
		{name: "separator-only is an error", value: " , ;\t,", wantError: true},
		{name: "invalid address is an error", value: "192.0.2.1,proxy.internal", wantError: true},
		{name: "zoned allow-list entry is an error", value: "fe80::1%en0", wantError: true},
		{name: "IPv4 catch-all is an error", value: "0.0.0.0/0", wantError: true},
		{name: "IPv6 catch-all is an error", value: "::/0", wantError: true},
		{name: "IPv4-mapped catch-all is an error", value: "::ffff:0.0.0.0/96", wantError: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			policy, err := parseSourceIPTrust(tt.value, EnvConsoleTrustedProxies)
			if (err != nil) != tt.wantError {
				t.Fatalf("error = %v, wantError = %v", err, tt.wantError)
			}
			if err != nil && len(policy.prefixes) != 0 {
				t.Fatalf("error returned a non-empty policy: %#v", policy.prefixes)
			}
			for _, ip := range tt.contains {
				if !policy.contains(ip) {
					t.Errorf("policy does not contain %s", ip)
				}
			}
			for _, ip := range tt.rejects {
				if policy.contains(ip) {
					t.Errorf("policy unexpectedly contains %s", ip)
				}
			}
		})
	}
}

func TestSourceIPTrustFromEnvironment(t *testing.T) {
	lookupError := errors.New("remote env lookup failed")
	tests := []struct {
		name        string
		values      map[string]string
		errors      map[string]error
		wantCalls   []string
		wantTrusted bool
		wantError   bool
	}{
		{
			name:        "absent Console setting falls back to MINIO",
			values:      map[string]string{EnvMinIOTrustedProxies: "192.0.2.10"},
			wantCalls:   []string{EnvConsoleTrustedProxies, EnvMinIOTrustedProxies},
			wantTrusted: true,
		},
		{
			name:        "blank Console setting falls back to MINIO",
			values:      map[string]string{EnvConsoleTrustedProxies: "  ", EnvMinIOTrustedProxies: "192.0.2.10"},
			wantCalls:   []string{EnvConsoleTrustedProxies, EnvMinIOTrustedProxies},
			wantTrusted: true,
		},
		{
			name:        "Console setting overrides MINIO",
			values:      map[string]string{EnvConsoleTrustedProxies: "192.0.2.10", EnvMinIOTrustedProxies: "bad-value"},
			wantCalls:   []string{EnvConsoleTrustedProxies},
			wantTrusted: true,
		},
		{
			name:      "none suppresses fallback",
			values:    map[string]string{EnvConsoleTrustedProxies: "none", EnvMinIOTrustedProxies: "192.0.2.10"},
			wantCalls: []string{EnvConsoleTrustedProxies},
		},
		{
			name:      "off suppresses fallback",
			values:    map[string]string{EnvConsoleTrustedProxies: "OFF", EnvMinIOTrustedProxies: "192.0.2.10"},
			wantCalls: []string{EnvConsoleTrustedProxies},
		},
		{
			name:      "malformed Console setting fails without fallback",
			values:    map[string]string{EnvConsoleTrustedProxies: "proxy.internal", EnvMinIOTrustedProxies: "192.0.2.10"},
			wantCalls: []string{EnvConsoleTrustedProxies},
			wantError: true,
		},
		{
			name:      "separator-only Console setting fails without fallback",
			values:    map[string]string{EnvConsoleTrustedProxies: ", ; ,", EnvMinIOTrustedProxies: "192.0.2.10"},
			wantCalls: []string{EnvConsoleTrustedProxies},
			wantError: true,
		},
		{
			name:      "Console lookup error fails without fallback",
			errors:    map[string]error{EnvConsoleTrustedProxies: lookupError},
			wantCalls: []string{EnvConsoleTrustedProxies},
			wantError: true,
		},
		{
			name:      "MINIO lookup error fails closed",
			errors:    map[string]error{EnvMinIOTrustedProxies: lookupError},
			wantCalls: []string{EnvConsoleTrustedProxies, EnvMinIOTrustedProxies},
			wantError: true,
		},
		{
			name:      "malformed MINIO fallback fails closed",
			values:    map[string]string{EnvMinIOTrustedProxies: "bad-value"},
			wantCalls: []string{EnvConsoleTrustedProxies, EnvMinIOTrustedProxies},
			wantError: true,
		},
		{
			name:      "both absent trust none",
			wantCalls: []string{EnvConsoleTrustedProxies, EnvMinIOTrustedProxies},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var calls []string
			lookup := func(key string) (string, string, string, error) {
				calls = append(calls, key)
				return tt.values[key], "", "", tt.errors[key]
			}
			policy, err := sourceIPTrustFromEnvironment(lookup)
			if (err != nil) != tt.wantError {
				t.Fatalf("error = %v, wantError = %v", err, tt.wantError)
			}
			if got := strings.Join(calls, ","); got != strings.Join(tt.wantCalls, ",") {
				t.Fatalf("lookup calls = %v, want %v", calls, tt.wantCalls)
			}
			if got := policy.contains("192.0.2.10"); got != tt.wantTrusted {
				t.Errorf("policy.contains(192.0.2.10) = %v, want %v", got, tt.wantTrusted)
			}
			if err != nil && len(policy.prefixes) != 0 {
				t.Errorf("error did not fail closed: %#v", policy.prefixes)
			}
		})
	}
}

func TestConfigureSourceIPTrustRereadsAndFailsClosed(t *testing.T) {
	preserveSourceIPTrustState(t)

	if err := setSourceIPTrustForTest(t, "192.0.2.10"); err != nil {
		t.Fatalf("valid startup configuration failed: %v", err)
	}
	if !currentSourceIPTrust().contains("192.0.2.10") {
		t.Fatal("explicit startup configuration was not installed")
	}

	if err := setSourceIPTrustForTest(t, trustNoProxies); err != nil {
		t.Fatalf("explicit trust-none reconfiguration failed: %v", err)
	}
	if currentSourceIPTrust().contains("192.0.2.10") {
		t.Fatal("explicit ConfigureSourceIPTrust call did not re-read the environment")
	}

	if err := setSourceIPTrustForTest(t, "not-an-address"); err == nil {
		t.Fatal("malformed startup configuration was accepted")
	}
	if len(currentSourceIPTrust().prefixes) != 0 {
		t.Fatal("malformed startup configuration did not install trust-none")
	}
}

func TestEnsureSourceIPTrustDoesNotReplaceExplicitConfiguration(t *testing.T) {
	preserveSourceIPTrustState(t)
	if err := setSourceIPTrustForTest(t, "192.0.2.10"); err != nil {
		t.Fatal(err)
	}
	t.Setenv(EnvConsoleTrustedProxies, "198.51.100.10")
	if err := ensureSourceIPTrustConfigured(); err != nil {
		t.Fatal(err)
	}
	policy := currentSourceIPTrust()
	if !policy.contains("192.0.2.10") || policy.contains("198.51.100.10") {
		t.Fatalf("embedded ensure replaced the explicitly installed policy: %#v", policy.prefixes)
	}
}

func TestEnsureSourceIPTrustReadsEnvironmentWhenUnconfigured(t *testing.T) {
	preserveSourceIPTrustState(t)
	resetSourceIPTrustForTest()

	t.Setenv(EnvConsoleTrustedProxies, "198.51.100.10")
	if err := ensureSourceIPTrustConfigured(); err != nil {
		t.Fatal(err)
	}
	if !currentSourceIPTrust().contains("198.51.100.10") {
		t.Fatal("embedded ensure did not read the environment on first use")
	}
	if !sourceIPTrustConfigured.Load() {
		t.Fatal("embedded ensure did not mark trust as configured")
	}
}

func setSourceIPTrustForTest(t *testing.T, value string) error {
	t.Helper()
	// These tests are intentionally serial: process-wide trust is startup state.
	// The pure helpers above carry the table-driven and error-path coverage.
	t.Setenv(EnvConsoleTrustedProxies, value)
	return ConfigureSourceIPTrust()
}

// resetSourceIPTrustForTest returns the process to the never-configured state
// so a test can observe the embedded first-use path.
func resetSourceIPTrustForTest() {
	sourceIPTrustConfigMu.Lock()
	defer sourceIPTrustConfigMu.Unlock()
	configuredSourceIPTrust.Store(nil)
	sourceIPTrustConfigured.Store(false)
}

// preserveSourceIPTrustState snapshots the environment variable and the exact
// process-wide trust state, and restores both when the test ends.
func preserveSourceIPTrustState(t *testing.T) {
	t.Helper()
	value, present := os.LookupEnv(EnvConsoleTrustedProxies)
	sourceIPTrustConfigMu.Lock()
	policy := configuredSourceIPTrust.Load()
	configured := sourceIPTrustConfigured.Load()
	sourceIPTrustConfigMu.Unlock()
	t.Cleanup(func() {
		if present {
			_ = os.Setenv(EnvConsoleTrustedProxies, value)
		} else {
			_ = os.Unsetenv(EnvConsoleTrustedProxies)
		}
		sourceIPTrustConfigMu.Lock()
		defer sourceIPTrustConfigMu.Unlock()
		configuredSourceIPTrust.Store(policy)
		sourceIPTrustConfigured.Store(configured)
	})
}

func TestSourceIPFromHeaders(t *testing.T) {
	policy := mustSourceIPTrustPolicy(t, "10.0.0.0/8,192.0.2.7,2001:db8:ffff::/48")
	tests := []struct {
		name   string
		peer   string
		header http.Header
		want   string
	}{
		{
			name: "direct peer cannot forge any source header",
			peer: "203.0.113.9:43000",
			header: http.Header{
				xForwardedFor: {"198.51.100.1"},
				xRealIP:       {"198.51.100.2"},
				forwarded:     {"for=198.51.100.3"},
			},
		},
		{
			name:   "loopback is not implicitly trusted",
			peer:   "127.0.0.1:43000",
			header: http.Header{xForwardedFor: {"198.51.100.1"}},
		},
		{
			name:   "trusted proxy overwrites XFF",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"198.51.100.1"}},
			want:   "198.51.100.1",
		},
		{
			name:   "right-to-left walk rejects an injected left-most claim",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"203.0.113.66, 198.51.100.1"}},
			want:   "198.51.100.1",
		},
		{
			name:   "right-to-left walk skips multiple trusted hops",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"203.0.113.66, 198.51.100.1, 10.0.0.8"}},
			want:   "198.51.100.1",
		},
		{
			name:   "repeated XFF lines are one chain",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"203.0.113.66", "198.51.100.1", "10.0.0.8"}},
			want:   "198.51.100.1",
		},
		{
			name:   "XFF elements with ports and brackets are canonicalized",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"[2001:0db8::1]:4711, 10.0.0.8:80"}},
			want:   "2001:db8::1",
		},
		{
			name:   "malformed XFF element behind the trusted hops stops the walk",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"203.0.113.66, proxy.internal, 10.0.0.8"}},
		},
		{
			name:   "obfuscated XFF element stops the walk",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"203.0.113.66, _hidden, 10.0.0.8"}},
		},
		{
			name:   "empty XFF element stops the walk",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"203.0.113.66,, 10.0.0.8"}},
		},
		{
			name:   "malformed XFF element left of the answer is irrelevant",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"_hidden, proxy.internal, 198.51.100.1"}},
			want:   "198.51.100.1",
		},
		{
			name:   "all trusted hops yield no header answer",
			peer:   "10.0.0.1:9000",
			header: http.Header{xForwardedFor: {"10.0.0.8, 10.0.0.9"}},
		},
		{
			name: "XFF present decides even when it yields nothing",
			peer: "10.0.0.1:9000",
			header: http.Header{
				xForwardedFor: {"10.0.0.8"},
				xRealIP:       {"198.51.100.2"},
				forwarded:     {"for=198.51.100.3"},
			},
		},
		{
			name: "malformed XFF does not fall through to X-Real-IP",
			peer: "10.0.0.1:9000",
			header: http.Header{
				xForwardedFor: {"garbage"},
				xRealIP:       {"198.51.100.2"},
			},
		},
		{
			name: "XFF takes precedence over X-Real-IP",
			peer: "10.0.0.1:9000",
			header: http.Header{
				xForwardedFor: {"198.51.100.1"},
				xRealIP:       {"203.0.113.2"},
			},
			want: "198.51.100.1",
		},
		{
			name:   "last X-Real-IP line is the proxy-authored one",
			peer:   "192.0.2.7:9000",
			header: http.Header{xRealIP: {"203.0.113.2", "198.51.100.1"}},
			want:   "198.51.100.1",
		},
		{
			name:   "invalid last X-Real-IP line does not revive an earlier line",
			peer:   "192.0.2.7:9000",
			header: http.Header{xRealIP: {"198.51.100.1", "not-an-address"}},
		},
		{
			name: "X-Real-IP present does not fall through to Forwarded",
			peer: "192.0.2.7:9000",
			header: http.Header{
				xRealIP:   {"not-an-address"},
				forwarded: {"for=198.51.100.3"},
			},
		},
		{
			name:   "repeated Forwarded lines are one chain",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=203.0.113.66", "for=198.51.100.1", "for=10.0.0.8"}},
			want:   "198.51.100.1",
		},
		{
			name:   "Forwarded accepts a quoted bracketed IPv6 with port",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`by=10.0.0.8; for="[2001:db8::1]:4711"; proto=https`}},
			want:   "2001:db8::1",
		},
		{
			name:   "Forwarded quoted commas do not split elements",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`for="203.0.113.66, 10.0.0.8";proto=https, for=198.51.100.1, for=10.0.0.8`}},
			want:   "198.51.100.1",
		},
		{
			name:   "Forwarded unknown node stops the walk",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=10.10.10.10, for=unknown, for=10.0.0.8"}},
		},
		{
			name:   "Forwarded obfuscated node stops the walk",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=10.10.10.10, for=_hidden, for=10.0.0.8"}},
		},
		{
			name:   "Forwarded element without for stops the walk",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=10.10.10.10, proto=https, for=10.0.0.8"}},
		},
		{
			name:   "Forwarded unterminated quote is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`by="unterminated, for=10.10.10.10`}},
		},
		{
			name:   "Forwarded duplicate parameter is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=10.10.10.10;for=203.0.113.8"}},
		},
		{
			name:   "Forwarded unbracketed IPv6 is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`for="2001:db8::1"`}},
		},
		{
			name:   "Forwarded zoned IPv6 is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`for="[fe80::1%en0]"`}},
		},
		{
			name:   "Forwarded host name is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=client.example"}},
		},
		{
			name:   "Forwarded unquoted port is not a token",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=198.51.100.1:4711"}},
		},
		{
			name:   "Forwarded quoted IPv4 with obfuscated port is accepted",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`for="198.51.100.1:_port1"`}},
			want:   "198.51.100.1",
		},
		{
			name:   "Forwarded six-digit port is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`for="198.51.100.1:000443"`}},
		},
		{
			name:   "Forwarded escaped quote inside value is malformed as a node",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {`for="198.51.100.1\""`}},
		},
		{
			name:   "Forwarded parameter names are case-insensitive",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"Proto=https;FOR=198.51.100.1"}},
			want:   "198.51.100.1",
		},
		{
			name:   "Forwarded parameter without value is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for"}},
		},
		{
			name:   "Forwarded pair wrapped in NBSP is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {" for=10.10.10.10"}},
		},
		{
			name:   "Forwarded pair with trailing NBSP is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"for=10.10.10.10 "}},
		},
		{
			name:   "Forwarded pair with NBSP between pairs is malformed",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"proto=https; for=10.10.10.10"}},
		},
		{
			name:   "Forwarded ASCII OWS around pairs is accepted",
			peer:   "10.0.0.1:9000",
			header: http.Header{forwarded: {"proto=https ;\t for=198.51.100.1 "}},
			want:   "198.51.100.1",
		},
		{
			name:   "zoned IPv6 peer matches a canonical allow-list entry",
			peer:   "[2001:db8:ffff::1%en0]:9000",
			header: http.Header{xForwardedFor: {"2001:0db8:0:0::2"}},
			want:   "2001:db8::2",
		},
		{
			name:   "IPv4-mapped peer matches the IPv4 allow-list entry",
			peer:   "[::ffff:192.0.2.7]:9000",
			header: http.Header{xForwardedFor: {"198.51.100.1"}},
			want:   "198.51.100.1",
		},
		{
			name:   "invalid peer cannot authorize headers",
			peer:   "not-a-socket-address",
			header: http.Header{xForwardedFor: {"198.51.100.1"}},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := sourceIPFromHeaders(sourceIPRequest(tt.peer, tt.header), policy); got != tt.want {
				t.Fatalf("sourceIPFromHeaders() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestSourceIPFromHeadersBoundsChainWork(t *testing.T) {
	policy := mustSourceIPTrustPolicy(t, "10.0.0.0/8")
	tooLong := []string{"198.51.100.1"}
	for range maxForwardedHops {
		tooLong = append(tooLong, "10.0.0.9")
	}
	req := sourceIPRequest("10.0.0.1:9000", http.Header{
		xForwardedFor: {strings.Join(tooLong, ",")},
		xRealIP:       {"203.0.113.8"},
	})
	if got := sourceIPFromHeaders(req, policy); got != "" {
		t.Fatalf("overlong XFF chain resolved to %q; want peer fallback", got)
	}

	withinBudget := []string{"198.51.100.1"}
	for range maxForwardedHops - 1 {
		withinBudget = append(withinBudget, "10.0.0.9")
	}
	req = sourceIPRequest("10.0.0.1:9000", http.Header{
		xForwardedFor: {strings.Join(withinBudget, ",")},
	})
	if got := sourceIPFromHeaders(req, policy); got != "198.51.100.1" {
		t.Fatalf("chain inside budget resolved to %q", got)
	}

	// Repeated lines count against the same budget.
	lines := make([]string, maxForwardedHops+1)
	for i := range lines {
		lines[i] = "10.0.0.9"
	}
	req = sourceIPRequest("10.0.0.1:9000", http.Header{xForwardedFor: lines})
	if got := sourceIPFromHeaders(req, policy); got != "" {
		t.Fatalf("overlong repeated XFF lines resolved to %q", got)
	}

	forwardedValues := make([]string, maxForwardedHops+1)
	for i := range forwardedValues {
		forwardedValues[i] = "for=10.0.0.9"
	}
	req = sourceIPRequest("10.0.0.1:9000", http.Header{forwarded: forwardedValues})
	if got := sourceIPFromHeaders(req, policy); got != "" {
		t.Fatalf("overlong repeated Forwarded chain resolved to %q", got)
	}

	// A long element of semicolons is bounded too: the split fails closed
	// instead of producing an unbounded slice of empty pairs.
	long := strings.Repeat(";", maxForwardedHops+1) + "for=198.51.100.1"
	if got := forwardedForAddr(long); got != "" {
		t.Fatalf("overlong Forwarded element resolved to %q", got)
	}
}

func TestSplitOutsideQuotes(t *testing.T) {
	tests := []struct {
		input string
		want  []string
		ok    bool
	}{
		{"a,b", []string{"a", "b"}, true},
		{`a="x,y",b`, []string{`a="x,y"`, "b"}, true},
		{`a="x\",y",b`, []string{`a="x\",y"`, "b"}, true},
		{`a="unterminated,b`, nil, false},
		{"", []string{""}, true},
		{"a,", []string{"a", ""}, true},
	}
	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			got, ok := splitOutsideQuotes(tt.input, ',', maxForwardedHops)
			if ok != tt.ok || strings.Join(got, "\x00") != strings.Join(tt.want, "\x00") {
				t.Fatalf("splitOutsideQuotes(%q) = %q, %v; want %q, %v", tt.input, got, ok, tt.want, tt.ok)
			}
		})
	}
	if _, ok := splitOutsideQuotes("a,b,c", ',', 2); ok {
		t.Fatal("limit was not enforced")
	}
}

func TestForwardedNodeIP(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"198.51.100.1", "198.51.100.1"},
		{"198.51.100.1:4711", "198.51.100.1"},
		{"198.51.100.1:_obf-port.1", "198.51.100.1"},
		{"[2001:0db8::1]", "2001:db8::1"},
		{"[2001:0db8::1]:4711", "2001:db8::1"},
		{"[::ffff:198.51.100.1]", "198.51.100.1"},
		{"unknown", ""},
		{"UNKNOWN", ""},
		{"_hidden", ""},
		{"", ""},
		{"2001:db8::1", ""},
		{"[fe80::1%en0]", ""},
		{"[2001:db8::1", ""},
		{"[2001:db8::1]x", ""},
		{"[2001:db8::1]:", ""},
		{"[2001:db8::1]:65536", ""},
		{"[198.51.100.1]", ""},
		{"198.51.100.1:", ""},
		{"198.51.100.1:_", ""},
		{"198.51.100.1:4711x", ""},
		{"198.51.100.1:000443", ""},
		{"client.example", ""},
		{"198.51.100.1 ", ""},
	}
	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			if got := forwardedNodeIP(tt.input); got != tt.want {
				t.Fatalf("forwardedNodeIP(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestCanonicalSourceIP(t *testing.T) {
	tests := []struct {
		input string
		want  string
	}{
		{"192.0.2.1", "192.0.2.1"},
		{" 192.0.2.1 ", "192.0.2.1"},
		{"192.0.2.1:443", "192.0.2.1"},
		{"[192.0.2.1]:443", "192.0.2.1"},
		{"2001:0db8:0:0::1", "2001:db8::1"},
		{"[2001:0db8::1]", "2001:db8::1"},
		{"[2001:0db8::1]:443", "2001:db8::1"},
		{"fe80::1%en0", "fe80::1"},
		{"[fe80::1%en0]:443", "fe80::1"},
		{"::ffff:192.0.2.1", "192.0.2.1"},
		{"", ""},
		{"proxy.internal", ""},
		{"proxy.internal:443", ""},
		{"_hidden", ""},
		{"unknown", ""},
		{"[2001:db8::1", ""},
		{"2001:db8::1]", ""},
		{"[2001:db8::1]suffix", ""},
		{"192.0.2.1:http", ""},
		{"192.0.2.1:+443", ""},
		{"192.0.2.1:65536", ""},
		{"192.0.2.1:000443", ""},
		{"[2001:db8::1]:", ""},
		{"[2001:db8::1]:65536", ""},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			if got := canonicalSourceIP(tt.input); got != tt.want {
				t.Fatalf("canonicalSourceIP(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}

func TestClientIPBoundaryAndWebSocketCallSite(t *testing.T) {
	untrusted := sourceIPTrustPolicy{}
	trusted := mustSourceIPTrustPolicy(t, "10.0.0.1")
	req := sourceIPRequest("203.0.113.9:43000", http.Header{xForwardedFor: {"10.10.10.10"}})
	if got := clientIPWithPolicy(req, untrusted); got != "203.0.113.9" {
		t.Fatalf("direct spoof resolved to %q, want TCP peer", got)
	}

	req = sourceIPRequest("10.0.0.1:43000", http.Header{xForwardedFor: {"10.10.10.10"}})
	if got := clientIPWithPolicy(req, trusted); got != "10.10.10.10" {
		t.Fatalf("trusted proxy resolved to %q, want asserted client", got)
	}

	preserveSourceIPTrustState(t)
	if err := setSourceIPTrustForTest(t, trustNoProxies); err != nil {
		t.Fatal(err)
	}
	wsReq := sourceIPRequest("203.0.113.9:43000", http.Header{xForwardedFor: {"10.10.10.10"}})
	if got := getWebSocketClientIP(wsReq); got != "203.0.113.9" {
		t.Fatalf("WebSocket call site trusted direct spoof: got %q", got)
	}
}
