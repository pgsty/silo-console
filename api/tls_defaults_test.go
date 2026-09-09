// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"crypto/tls"
	"net/http"
	"net/http/httptest"
	"slices"
	"testing"
)

func TestOutboundTLSKeyExchangeDefaults(t *testing.T) {
	preserveOutboundTLSState(t)
	for _, debug := range []string{"tlsmlkem=0", "tlsmlkem=1"} {
		t.Run(debug, func(t *testing.T) {
			t.Setenv("GODEBUG", debug)
			hellos := make(chan []tls.CurveID, 1)
			server := httptest.NewUnstartedServer(okHandler())
			server.TLS = &tls.Config{GetConfigForClient: func(hello *tls.ClientHelloInfo) (*tls.Config, error) {
				select {
				case hellos <- slices.Clone(hello.SupportedCurves):
				default:
				}
				return nil, nil
			}}
			server.StartTLS()
			defer server.Close()
			GlobalRootCAs = poolWithServerCertificate(t, server)
			ApplyGlobalRootCAs()
			t.Setenv(ConsoleMinIOServer, server.URL)
			t.Setenv(ConsoleMinIOServerTLSSkipVerify, "off")
			for name, client := range map[string]*http.Client{
				"identity-provider": GetConsoleHTTPClient(""),
				"SILO-and-STS":      GetMinIOHTTPClient(""),
			} {
				t.Run(name, func(t *testing.T) {
					GlobalTransport.CloseIdleConnections()
					status, err := fetch(t, client, server.URL)
					if err != nil || status != http.StatusOK {
						t.Fatalf("status %d, error %v", status, err)
					}
					curves := <-hellos
					if got, want := slices.Contains(curves, tls.X25519MLKEM768), debug == "tlsmlkem=1"; got != want {
						t.Errorf("ML-KEM offered = %v, want %v; curves %v", got, want, curves)
					}
				})
			}
		})
	}
}
