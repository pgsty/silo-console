// Copyright (c) 2026 PGSTY (Ruohang Feng) and the SILO contributors.
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
	"github.com/unrolled/secure"
)

func TestSecurityMiddlewareHTTPSRedirect(t *testing.T) {
	previousCerts, previousHostname, previousPort := GlobalPublicCerts, Hostname, TLSPort
	t.Cleanup(func() {
		GlobalPublicCerts, Hostname, TLSPort = previousCerts, previousHostname, previousPort
	})
	GlobalPublicCerts, Hostname, TLSPort = []*x509.Certificate{{}}, "", "9443"
	t.Setenv(ConsoleSecureTLSRedirect, "on")
	t.Setenv(ConsoleSecureAllowedHosts, "")
	t.Setenv(ConsoleSecureHostsProxyHeaders, "")
	t.Setenv(ConsoleDevMode, "off")

	for _, tt := range []struct {
		name          string
		target        string
		listenHost    string
		tlsHost       string
		forwardedHost string
		forwardedTLS  bool
		tls           bool
		wantLocation  string
	}{
		{
			name:         "preserve escaped path and query",
			target:       "http://console.example:9090/api/v1/buckets/a%2Fb?prefix=a%2Fb&next=%2Flogin",
			wantLocation: "https://console.example:9443/api/v1/buckets/a%2Fb?prefix=a%2Fb&next=%2Flogin",
		},
		{
			name:         "wildcard listener does not become the redirect host",
			target:       "http://console.example/api/v1/login",
			listenHost:   "0.0.0.0",
			wantLocation: "https://console.example:9443/api/v1/login",
		},
		{
			name:         "IPv6 wildcard listener does not become the redirect host",
			target:       "http://[2001:db8::1]/api/v1/login",
			listenHost:   "::",
			wantLocation: "https://[2001:db8::1]:9443/api/v1/login",
		},
		{
			name:         "absolute HTTPS target over plaintext still redirects",
			target:       "https://console.example/api/v1/login",
			wantLocation: "https://console.example:9443/api/v1/login",
		},
		{
			name:         "unconfigured forwarding headers cannot bypass TLS",
			target:       "http://console.example/api/v1/login",
			forwardedTLS: true,
			wantLocation: "https://console.example:9443/api/v1/login",
		},
		{
			name:         "explicit redirect host",
			target:       "http://internal.example/api/v1/login?next=%2Fconsole",
			tlsHost:      "public.example:443",
			wantLocation: "https://public.example:443/api/v1/login?next=%2Fconsole",
		},
		{
			name:          "explicit redirect host wins over configured proxy host",
			target:        "http://internal.example/api/v1/login",
			tlsHost:       "public.example:443",
			forwardedHost: "proxy.example",
			wantLocation:  "https://public.example:443/api/v1/login",
		},
		{
			name:   "TLS reaches the API without another redirect",
			target: "https://console.example/api/v1/login",
			tls:    true,
		},
	} {
		t.Run(tt.name, func(t *testing.T) {
			Hostname = tt.listenHost
			t.Setenv(ConsoleSecureTLSHost, tt.tlsHost)
			if tt.forwardedHost != "" {
				t.Setenv(ConsoleSecureHostsProxyHeaders, "X-Forwarded-Host")
			}
			called := false
			handler := setupGlobalMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				called = true
				w.WriteHeader(http.StatusNoContent)
			}))
			req := httptest.NewRequest(http.MethodGet, tt.target, nil)
			req.TLS = nil // An absolute-form URL alone does not establish TLS.
			if tt.tls {
				req.TLS = &tls.ConnectionState{}
			}
			if tt.forwardedTLS {
				req.Header.Set("X-Forwarded-Proto", "https")
			}
			req.Header.Set("X-Forwarded-Host", tt.forwardedHost)
			originalURL := *req.URL
			res := httptest.NewRecorder()
			handler.ServeHTTP(res, req)
			if tt.wantLocation != "" {
				require.Equal(t, http.StatusMovedPermanently, res.Code)
				require.Equal(t, tt.wantLocation, res.Header().Get("Location"))
				require.False(t, called)
			} else {
				require.Equal(t, http.StatusNoContent, res.Code)
				require.Empty(t, res.Header().Get("Location"))
				require.True(t, called)
			}
			require.Equal(t, originalURL, *req.URL, "redirect must not mutate the caller's URL")
		})
	}
}

func TestSecurityMiddlewareCSPNonce(t *testing.T) {
	t.Setenv(ConsoleSecureTLSRedirect, "off")
	t.Setenv(ConsoleSecureAllowedHosts, "")
	t.Setenv(ConsoleSecureHostsProxyHeaders, "")
	t.Setenv(ConsoleSecureContentSecurityPolicy, "script-src $NONCE; style-src $NONCE")
	t.Setenv(ConsoleSecureContentSecurityPolicyReportOnly, "script-src $NONCE; style-src $NONCE")
	t.Setenv(ConsoleSecureFrameDeny, "on")
	t.Setenv(ConsoleSecureContentTypeNoSniff, "on")
	t.Setenv(ConsoleDevMode, "off")
	var nonce string
	handler := setupGlobalMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nonce = secure.CSPNonce(r.Context())
		w.WriteHeader(http.StatusNoContent)
	}))
	var previousNonce string
	for range 2 {
		res := httptest.NewRecorder()
		handler.ServeHTTP(res, httptest.NewRequest(http.MethodGet, "/api/v1/login", nil))
		require.Equal(t, http.StatusNoContent, res.Code)
		require.NotEmpty(t, nonce)
		require.NotEqual(t, previousNonce, nonce, "each request needs its own nonce")
		want := fmt.Sprintf("script-src 'nonce-%s'; style-src 'nonce-%s'", nonce, nonce)
		require.Equal(t, want, res.Header().Get("Content-Security-Policy"))
		require.Equal(t, want, res.Header().Get("Content-Security-Policy-Report-Only"))
		require.Equal(t, "DENY", res.Header().Get("X-Frame-Options"))
		require.Equal(t, "nosniff", res.Header().Get("X-Content-Type-Options"))
		previousNonce = nonce
	}
}
