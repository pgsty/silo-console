// Copyright 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync"
	"testing"
	"time"

	"github.com/go-openapi/runtime/flagext"
	flags "github.com/jessevdk/go-flags"
	"github.com/minio/console/api/operations"
	"golang.org/x/net/http2"
)

type keepAliveTestCertManager struct{ cert *tls.Certificate }

func (m keepAliveTestCertManager) AddCertificate(string, string) error { return nil }
func (m keepAliveTestCertManager) GetCertificate(*tls.ClientHelloInfo) (*tls.Certificate, error) {
	return m.cert, nil
}
func (keepAliveTestCertManager) ReloadOnSignal(...os.Signal) {}

func TestEmbeddedServerTLSKeepAlive(t *testing.T) {
	for _, explicitZero := range []bool{false, true} {
		t.Run(fmt.Sprintf("explicitCLIzero=%t", explicitZero), func(t *testing.T) {
			api := &operations.ConsoleAPI{PreServerShutdown: func() {}, ServerShutdown: func() {}, Logger: t.Logf}
			server := NewServer(api)
			if explicitZero {
				if _, err := flags.NewParser(server, flags.Default).ParseArgs([]string{"--keep-alive=0"}); err != nil {
					t.Fatal(err)
				}
			}
			// Trust only this test certificate; exercise the production TLS listener.
			seed := httptest.NewTLSServer(http.NotFoundHandler())
			cert := seed.TLS.Certificates[0]
			previousManager := GlobalTLSCertsManager
			GlobalTLSCertsManager = keepAliveTestCertManager{cert: &cert}
			t.Cleanup(func() { GlobalTLSCertsManager = previousManager })
			seed.Close()
			certPath, keyPath := filepath.Join(t.TempDir(), "server.pem"), filepath.Join(t.TempDir(), "server.key")
			key, err := x509.MarshalPKCS8PrivateKey(cert.PrivateKey)
			if err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(certPath, pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: cert.Certificate[0]}), 0o600); err != nil {
				t.Fatal(err)
			}
			if err := os.WriteFile(keyPath, pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: key}), 0o600); err != nil {
				t.Fatal(err)
			}
			roots := x509.NewCertPool()
			roots.AddCert(seed.Certificate())
			server.EnabledListeners = []string{"https"}
			server.TLSHost, server.TLSPort = "127.0.0.1", 0
			server.TLSCertificate, server.TLSCertificateKey = flags.Filename(certPath), flags.Filename(keyPath)
			server.MaxHeaderSize = flagext.ByteSize(1 << 20)
			server.GracefulTimeout = time.Second
			var mu sync.Mutex
			addresses := map[string]bool{}
			server.SetHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				mu.Lock()
				addresses[r.RemoteAddr] = true
				mu.Unlock()
				if r.ProtoMajor != 2 {
					t.Errorf("protocol = %s, want HTTP/2", r.Proto)
				}
				_, _ = io.WriteString(w, "asset:"+r.URL.Path)
			}))
			listeners, err := server.TLSListener()
			if err != nil {
				t.Fatal(err)
			}
			done := make(chan error, 1)
			go func() { done <- server.Serve() }()
			transport := &http2.Transport{TLSClientConfig: &tls.Config{RootCAs: roots, MinVersion: tls.VersionTLS12}}
			client := &http.Client{Transport: transport, Timeout: 3 * time.Second}
			t.Cleanup(func() {
				transport.CloseIdleConnections()
				if err := server.Shutdown(); err != nil {
					t.Error(err)
				}
				select {
				case err := <-done:
					if err != nil {
						t.Error(err)
					}
				case <-time.After(3 * time.Second):
					t.Error("server shutdown timeout")
				}
			})
			for i := 0; i < 16; i++ {
				ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
				path := fmt.Sprintf("/assets/%d.js", i)
				request, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://"+listeners[0].Addr().String()+path, nil)
				if err != nil {
					cancel()
					t.Fatal(err)
				}
				response, err := client.Do(request)
				if err != nil {
					cancel()
					t.Fatal(err)
				}
				body, err := io.ReadAll(response.Body)
				response.Body.Close()
				cancel()
				if err != nil {
					t.Fatal(err)
				}
				if response.ProtoMajor != 2 || response.StatusCode != 200 || string(body) != "asset:"+path {
					t.Fatalf("invalid resource response: proto=%s status=%d body=%q", response.Proto, response.StatusCode, body)
				}
				if explicitZero {
					time.Sleep(20 * time.Millisecond)
				}
			}
			mu.Lock()
			connections := len(addresses)
			mu.Unlock()
			if explicitZero {
				if server.KeepAlive != 0 || server.TLSKeepAlive != 0 || connections < 2 {
					t.Fatalf("explicit CLI disable ignored: KeepAlive=%s TLSKeepAlive=%s connections=%d", server.KeepAlive, server.TLSKeepAlive, connections)
				}
			} else if connections != 1 {
				t.Fatalf("embedded TLS resources used %d connections, want one persistent HTTP/2 connection", connections)
			}
		})
	}
}
