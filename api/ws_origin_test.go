// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"net/http"
	"testing"
)

func originRequest(origin, host, peer string, extra http.Header) *http.Request {
	req := &http.Request{Host: host, RemoteAddr: peer, Header: http.Header{}}
	if origin != "" {
		req.Header.Set("Origin", origin)
	}
	for name, values := range extra {
		req.Header[name] = values
	}
	return req
}

func TestWSCheckOrigin(t *testing.T) {
	preserveSourceIPTrustState(t)
	if err := setSourceIPTrustForTest(t, "10.0.0.1"); err != nil {
		t.Fatal(err)
	}
	t.Setenv(ConsoleDevMode, "off")
	t.Setenv(ConsoleBrowserRedirectURL, "")
	t.Setenv(ConsoleSecureHostsProxyHeaders, "")
	t.Setenv(ConsoleSecureAllowedHosts, "")
	t.Setenv(ConsoleSecureAllowedHostsAreRegex, "off")

	tests := []struct {
		name  string
		env   map[string]string
		req   *http.Request
		allow bool
	}{
		{name: "no Origin is a non-browser client", req: originRequest("", "console.example", "203.0.113.9:1", nil), allow: true},
		{name: "same authority", req: originRequest("https://console.example", "console.example", "203.0.113.9:1", nil), allow: true},
		{name: "same authority case-insensitive", req: originRequest("https://Console.Example:8443", "console.example:8443", "203.0.113.9:1", nil), allow: true},
		{name: "different host", req: originRequest("https://evil.example", "console.example", "203.0.113.9:1", nil), allow: false},
		{name: "non-default port must match", req: originRequest("https://console.example:8443", "console.example", "203.0.113.9:1", nil), allow: false},
		{name: "malformed Origin", req: originRequest("::not a url", "console.example", "203.0.113.9:1", nil), allow: false},
		{name: "null Origin", req: originRequest("null", "console.example", "203.0.113.9:1", nil), allow: false},
		{name: "dev mode allows all", env: map[string]string{ConsoleDevMode: "on"}, req: originRequest("https://evil.example", "console.example", "203.0.113.9:1", nil), allow: true},
		{name: "redirect URL authority", env: map[string]string{ConsoleBrowserRedirectURL: "https://public.example:8443/console/subpath/"}, req: originRequest("https://public.example:8443", "backend:9090", "203.0.113.9:1", nil), allow: true},
		{name: "redirect URL port mismatch", env: map[string]string{ConsoleBrowserRedirectURL: "https://public.example/console/"}, req: originRequest("https://public.example:8443", "backend:9090", "203.0.113.9:1", nil), allow: false},
		{
			name:  "trusted proxy with configured single forwarded host",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://public.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"public.example"}}),
			allow: true,
		},
		{
			name:  "trusted proxy forwarded host with port",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://public.example:8443", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"public.example:8443"}}),
			allow: true,
		},
		{
			name:  "untrusted peer forwarded host is ignored",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://public.example", "backend:9090", "203.0.113.9:5000", http.Header{"X-Forwarded-Host": {"public.example"}}),
			allow: false,
		},
		{
			name:  "forwarded host header not configured is ignored",
			req:   originRequest("https://public.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"public.example"}}),
			allow: false,
		},
		{
			name:  "two forwarded host lines are ambiguous",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://public.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"public.example", "public.example"}}),
			allow: false,
		},
		{
			name:  "comma list forwarded host is ambiguous",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://public.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"evil.example, public.example"}}),
			allow: false,
		},
		{
			name:  "forwarded host with scheme or path is malformed",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://public.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"https://public.example/"}}),
			allow: false,
		},
		{
			name:  "first configured header present decides",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host,X-Original-Host"},
			req:   originRequest("https://public.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Original-Host": {"public.example"}}),
			allow: true,
		},
		{
			name:  "forwarded host mismatch is rejected",
			env:   map[string]string{ConsoleSecureHostsProxyHeaders: "X-Forwarded-Host"},
			req:   originRequest("https://evil.example", "backend:9090", "10.0.0.1:5000", http.Header{"X-Forwarded-Host": {"public.example"}}),
			allow: false,
		},
		{name: "allowed hosts exact", env: map[string]string{ConsoleSecureAllowedHosts: "a.example,Public.Example"}, req: originRequest("https://public.example", "backend:9090", "203.0.113.9:1", nil), allow: true},
		{name: "allowed hosts exact rejects others", env: map[string]string{ConsoleSecureAllowedHosts: "a.example"}, req: originRequest("https://public.example", "backend:9090", "203.0.113.9:1", nil), allow: false},
		{name: "allowed hosts regex anchored", env: map[string]string{ConsoleSecureAllowedHosts: `.*\.example`, ConsoleSecureAllowedHostsAreRegex: "on"}, req: originRequest("https://public.example", "backend:9090", "203.0.113.9:1", nil), allow: true},
		{name: "allowed hosts regex anchored rejects superstring", env: map[string]string{ConsoleSecureAllowedHosts: `public\.example`, ConsoleSecureAllowedHostsAreRegex: "on"}, req: originRequest("https://public.example.evil", "backend:9090", "203.0.113.9:1", nil), allow: false},
		{name: "allowed hosts invalid regex never matches", env: map[string]string{ConsoleSecureAllowedHosts: `(`, ConsoleSecureAllowedHostsAreRegex: "on"}, req: originRequest("https://public.example", "backend:9090", "203.0.113.9:1", nil), allow: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			for key, value := range tt.env {
				t.Setenv(key, value)
			}
			if got := wsCheckOrigin(tt.req); got != tt.allow {
				t.Fatalf("wsCheckOrigin() = %v, want %v", got, tt.allow)
			}
		})
	}
}

func TestValidAuthority(t *testing.T) {
	tests := map[string]bool{
		"public.example":         true,
		"public.example:8443":    true,
		"[2001:db8::1]":          true,
		"[2001:db8::1]:8443":     true,
		"10.0.0.7":               true,
		"":                       false,
		"public.example/":        false,
		"https://public.example": false,
		"a.example, b.example":   false,
		"public.example:port":    false,
		"public.example:99999":   false,
		"user@public.example":    false,
		"public.example?x":       false,
		"public example":         false,
	}
	for input, want := range tests {
		if _, got := validAuthority(input); got != want {
			t.Errorf("validAuthority(%q) = %v, want %v", input, got, want)
		}
	}
}
