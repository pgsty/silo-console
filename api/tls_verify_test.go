// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"errors"
	"io"
	"net"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/minio/console/pkg/auth/idp/oauth2"
)

// preserveOutboundTLSState snapshots the globals the verification tests mutate
// and restores them when the test ends, so the shared transport never leaks a
// test CA pool or an exempt origin into later tests.
func preserveOutboundTLSState(t *testing.T) {
	t.Helper()
	previousRootCAs := GlobalRootCAs
	previousTransport := GlobalTransport
	GlobalTransport = previousTransport.Clone()
	// The tests dial their own servers; an HTTPS_PROXY in the environment would
	// otherwise turn the host-name case into a plaintext CONNECT.
	GlobalTransport.Proxy = nil
	t.Cleanup(func() {
		GlobalTransport.CloseIdleConnections()
		GlobalTransport = previousTransport
		GlobalRootCAs = previousRootCAs
	})
}

func newTLSTestServer(t *testing.T, handler http.Handler) *httptest.Server {
	t.Helper()
	server := httptest.NewUnstartedServer(handler)
	server.StartTLS()
	t.Cleanup(server.Close)
	return server
}

func poolWithServerCertificate(t *testing.T, server *httptest.Server) *x509.CertPool {
	t.Helper()
	pool := x509.NewCertPool()
	pool.AddCert(server.Certificate())
	return pool
}

func okHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
}

func fetch(t *testing.T, client *http.Client, rawURL string) (int, error) {
	t.Helper()
	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, rawURL, nil)
	if err != nil {
		t.Fatal(err)
	}
	resp, err := client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	_, _ = io.Copy(io.Discard, resp.Body)
	return resp.StatusCode, nil
}

func requireUnknownAuthority(t *testing.T, err error) {
	t.Helper()
	var unknownAuthority x509.UnknownAuthorityError
	if !errors.As(err, &unknownAuthority) {
		t.Fatalf("expected x509.UnknownAuthorityError, got %v", err)
	}
}

func TestNewHTTPTransportVerifiesByDefault(t *testing.T) {
	for name, transport := range map[string]*http.Transport{"constructor": newHTTPTransport(), "global": GlobalTransport} {
		t.Run(name, func(t *testing.T) {
			cfg := transport.TLSClientConfig
			if cfg == nil {
				t.Fatal("transport has no TLS configuration")
			}
			if cfg.InsecureSkipVerify {
				t.Fatal("transport skips certificate verification")
			}
			if cfg.MinVersion != tls.VersionTLS12 {
				t.Fatalf("MinVersion = %#x, want TLS 1.2", cfg.MinVersion)
			}
		})
	}
	if newHTTPTransport().TLSClientConfig.RootCAs != nil {
		t.Fatal("a fresh transport must start from the system roots (nil pool)")
	}
}

func TestApplyGlobalRootCAsInstallsConfiguredPool(t *testing.T) {
	preserveOutboundTLSState(t)

	pool := x509.NewCertPool()
	GlobalRootCAs = pool
	ApplyGlobalRootCAs()
	if GlobalTransport.TLSClientConfig.RootCAs != pool {
		t.Fatal("ApplyGlobalRootCAs did not install the configured pool")
	}

	GlobalRootCAs = nil
	ApplyGlobalRootCAs()
	if GlobalTransport.TLSClientConfig.RootCAs != nil {
		t.Fatal("a nil configured pool must fall back to the system roots")
	}
}

func TestOutboundTLSVerification(t *testing.T) {
	preserveOutboundTLSState(t)
	server := newTLSTestServer(t, okHandler())

	t.Run("unknown CA is rejected", func(t *testing.T) {
		GlobalRootCAs = x509.NewCertPool()
		ApplyGlobalRootCAs()
		_, err := fetch(t, GetConsoleHTTPClient(""), server.URL)
		requireUnknownAuthority(t, err)
		_, err = fetch(t, GetMinIOHTTPClient(""), server.URL)
		requireUnknownAuthority(t, err)
	})

	t.Run("configured private CA is accepted", func(t *testing.T) {
		GlobalRootCAs = poolWithServerCertificate(t, server)
		ApplyGlobalRootCAs()
		status, err := fetch(t, GetConsoleHTTPClient(""), server.URL)
		if err != nil || status != http.StatusOK {
			t.Fatalf("general client: status %d, err %v", status, err)
		}
		status, err = fetch(t, GetMinIOHTTPClient(""), server.URL)
		if err != nil || status != http.StatusOK {
			t.Fatalf("SILO client: status %d, err %v", status, err)
		}
	})

	t.Run("wrong host name is rejected even with the private CA", func(t *testing.T) {
		GlobalRootCAs = poolWithServerCertificate(t, server)
		ApplyGlobalRootCAs()
		// Dial the test server whatever name the URL carries; the certificate
		// covers example.com and the loopback addresses, not silo.example.
		GlobalTransport.DialContext = func(ctx context.Context, network, _ string) (net.Conn, error) {
			return (&net.Dialer{}).DialContext(ctx, network, server.Listener.Addr().String())
		}
		defer func() { GlobalTransport.DialContext = newHTTPTransport().DialContext }()
		_, err := fetch(t, GetConsoleHTTPClient(""), "https://silo.example/")
		var hostnameErr x509.HostnameError
		if !errors.As(err, &hostnameErr) {
			t.Fatalf("expected x509.HostnameError, got %v", err)
		}
	})
}

func TestMinIOEndpointCompatibilitySwitchIsScoped(t *testing.T) {
	preserveOutboundTLSState(t)
	GlobalRootCAs = x509.NewCertPool()
	ApplyGlobalRootCAs()

	other := newTLSTestServer(t, okHandler())
	endpoint := newTLSTestServer(t, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/redirect" {
			http.Redirect(w, r, other.URL+"/", http.StatusFound)
			return
		}
		w.WriteHeader(http.StatusOK)
	}))

	t.Setenv(ConsoleMinIOServer, endpoint.URL)

	t.Run("switch off keeps the endpoint verified", func(t *testing.T) {
		t.Setenv(ConsoleMinIOServerTLSSkipVerify, "off")
		if _, ok := minioTLSSkipVerifyOrigin(); ok {
			t.Fatal("switch off must not yield an exempt origin")
		}
		if PrepareSTSClientTransport("").Transport != http.RoundTripper(GlobalTransport) {
			t.Fatal("switch off must use GlobalTransport directly")
		}
		_, err := fetch(t, GetMinIOHTTPClient(""), endpoint.URL)
		requireUnknownAuthority(t, err)
	})

	t.Run("switch on exempts exactly the endpoint origin", func(t *testing.T) {
		t.Setenv(ConsoleMinIOServerTLSSkipVerify, "on")
		scoped, ok := PrepareSTSClientTransport("").Transport.(*endpointScopedTransport)
		if !ok {
			t.Fatalf("expected an endpoint-scoped transport, got %T", PrepareSTSClientTransport("").Transport)
		}
		if scoped.verified != http.RoundTripper(GlobalTransport) {
			t.Fatal("the scoped transport must verify with GlobalTransport")
		}

		status, err := fetch(t, GetMinIOHTTPClient(""), endpoint.URL)
		if err != nil || status != http.StatusOK {
			t.Fatalf("SILO client against the exempt endpoint: status %d, err %v", status, err)
		}
		// Same authority, different caller intent: the general client is never exempt.
		_, err = fetch(t, GetConsoleHTTPClient(""), endpoint.URL)
		requireUnknownAuthority(t, err)
		// Different authority through the SILO client: verified.
		_, err = fetch(t, GetMinIOHTTPClient(""), other.URL)
		requireUnknownAuthority(t, err)
		// A redirect away from the endpoint is evaluated per hop and verified.
		_, err = fetch(t, GetMinIOHTTPClient(""), endpoint.URL+"/redirect")
		requireUnknownAuthority(t, err)
	})

	t.Run("switch on is ignored for an http endpoint", func(t *testing.T) {
		t.Setenv(ConsoleMinIOServerTLSSkipVerify, "on")
		t.Setenv(ConsoleMinIOServer, "http://"+endpoint.Listener.Addr().String())
		if _, ok := minioTLSSkipVerifyOrigin(); ok {
			t.Fatal("an http endpoint must not yield an exempt origin")
		}
		_, err := fetch(t, GetMinIOHTTPClient(""), endpoint.URL)
		requireUnknownAuthority(t, err)
	})

	t.Run("identity provider discovery never uses the exemption", func(t *testing.T) {
		t.Setenv(ConsoleMinIOServerTLSSkipVerify, "on")
		t.Setenv(ConsoleMinIOServer, endpoint.URL)
		req := httptest.NewRequest(http.MethodGet, "http://console.example/login", nil)
		cfg := oauth2.ProviderConfig{URL: endpoint.URL + "/.well-known/openid-configuration"}
		_, err := cfg.GetOauth2ProviderWithClients("test", nil, req, GetConsoleHTTPClient(""), GetMinIOHTTPClient(""))
		requireUnknownAuthority(t, err)
	})
}

func TestEndpointScopedTransportRouting(t *testing.T) {
	type call struct{ insecure bool }
	var last call
	record := func(insecure bool) http.RoundTripper {
		return sourceHeaderRoundTripFunc(func(req *http.Request) (*http.Response, error) {
			last = call{insecure: insecure}
			return &http.Response{StatusCode: http.StatusOK, Header: make(http.Header), Body: io.NopCloser(strings.NewReader("")), Request: req}, nil
		})
	}
	transport := &endpointScopedTransport{
		origin:   canonicalHTTPSHostPort("SILO.example:443"),
		verified: record(false),
		insecure: record(true),
	}
	tests := []struct {
		rawURL   string
		insecure bool
	}{
		{"https://silo.example/probe", true},
		{"https://silo.example:443/probe", true},
		{"https://SILO.EXAMPLE/probe", true},
		{"http://silo.example/probe", false},
		{"https://silo.example:8443/probe", false},
		{"https://other.example/probe", false},
		{"https://silo.example.evil/probe", false},
	}
	for _, tt := range tests {
		t.Run(tt.rawURL, func(t *testing.T) {
			u, err := url.Parse(tt.rawURL)
			if err != nil {
				t.Fatal(err)
			}
			resp, err := transport.RoundTrip(&http.Request{Method: http.MethodGet, URL: u, Header: make(http.Header)})
			if err != nil {
				t.Fatal(err)
			}
			resp.Body.Close()
			if last.insecure != tt.insecure {
				t.Fatalf("insecure = %v, want %v", last.insecure, tt.insecure)
			}
		})
	}
}

func TestCanonicalHTTPSHostPort(t *testing.T) {
	tests := map[string]string{
		"silo.example":        "silo.example:443",
		"silo.example:443":    "silo.example:443",
		"SILO.Example:8443":   "silo.example:8443",
		"127.0.0.1:9000":      "127.0.0.1:9000",
		"[2001:db8::1]":       "[2001:db8::1]:443",
		"[2001:db8::1]:9000":  "[2001:db8::1]:9000",
		"[2001:DB8::1]:9000":  "[2001:db8::1]:9000",
		"silo.example:":       "silo.example:443",
		"":                    ":443",
		"silo.example:https!": "silo.example:https!",
	}
	for input, want := range tests {
		if got := canonicalHTTPSHostPort(input); got != want {
			t.Errorf("canonicalHTTPSHostPort(%q) = %q, want %q", input, got, want)
		}
	}
}
