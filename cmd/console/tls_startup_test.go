// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package main

import (
	"crypto/x509"
	"encoding/pem"
	"errors"
	"flag"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/minio/cli"
	"github.com/minio/console/api"
	"github.com/minio/console/pkg/certs"
	"github.com/minio/console/pkg/logger"
)

// preserveStartupTLSGlobals snapshots every global loadAllCerts and
// ApplyGlobalRootCAs mutate and restores them afterwards. The shared transport
// is swapped for a clone so the real one never carries a test CA pool.
func preserveStartupTLSGlobals(t *testing.T) {
	t.Helper()
	previousCertsDir, previousCAsDir := certs.GlobalCertsDir, certs.GlobalCertsCADir
	previousRootCAs, previousPublicCerts, previousManager := api.GlobalRootCAs, api.GlobalPublicCerts, api.GlobalTLSCertsManager
	previousTransport := api.GlobalTransport
	api.GlobalTransport = previousTransport.Clone()
	t.Cleanup(func() {
		api.GlobalTransport.CloseIdleConnections()
		api.GlobalTransport = previousTransport
		api.GlobalRootCAs, api.GlobalPublicCerts, api.GlobalTLSCertsManager = previousRootCAs, previousPublicCerts, previousManager
		certs.GlobalCertsDir, certs.GlobalCertsCADir = previousCertsDir, previousCAsDir
	})
}

func serverCLIContext(t *testing.T, args ...string) *cli.Context {
	t.Helper()
	set := flag.NewFlagSet("server", flag.ContinueOnError)
	set.String("certs-dir", "", "")
	set.String("tls-certificate", "", "")
	set.String("tls-key", "", "")
	set.String("tls-ca", "", "")
	if err := set.Parse(args); err != nil {
		t.Fatal(err)
	}
	return cli.NewContext(cli.NewApp(), set, nil)
}

func writeCertificatePEM(t *testing.T, path string, cert *x509.Certificate) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: cert.Raw}), 0o644); err != nil {
		t.Fatal(err)
	}
}

// webhookClient builds the client exactly the way StartServer's logger
// initialisation does: a clone of the shared transport taken before
// ConfigureAPI runs.
func webhookClient() *http.Client {
	return &http.Client{Transport: logger.NewHTTPTransportWithClientCerts(api.GlobalTransport, "", "")}
}

func get(t *testing.T, client *http.Client, rawURL string) (int, error) {
	t.Helper()
	resp, err := client.Get(rawURL)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	_, _ = io.Copy(io.Discard, resp.Body)
	return resp.StatusCode, nil
}

func TestLoadAllCertsAttachesConfiguredCAsBeforeWebhookTransportClone(t *testing.T) {
	preserveStartupTLSGlobals(t)
	server := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) { w.WriteHeader(http.StatusOK) }))
	server.StartTLS()
	t.Cleanup(server.Close)

	t.Run("CAs directory", func(t *testing.T) {
		certsDir := t.TempDir()
		writeCertificatePEM(t, filepath.Join(certsDir, certs.CertsCADir, "silo.crt"), server.Certificate())
		if err := loadAllCerts(serverCLIContext(t, "--certs-dir", certsDir)); err != nil {
			t.Fatalf("loadAllCerts: %v", err)
		}
		status, err := get(t, webhookClient(), server.URL)
		if err != nil || status != http.StatusOK {
			t.Fatalf("webhook clone did not trust the configured CA: status %d, err %v", status, err)
		}
		status, err = get(t, api.GetConsoleHTTPClient(""), server.URL)
		if err != nil || status != http.StatusOK {
			t.Fatalf("general client did not trust the configured CA: status %d, err %v", status, err)
		}
	})

	t.Run("empty CAs directory fails closed", func(t *testing.T) {
		if err := loadAllCerts(serverCLIContext(t, "--certs-dir", t.TempDir())); err != nil {
			t.Fatalf("loadAllCerts: %v", err)
		}
		_, err := get(t, webhookClient(), server.URL)
		var unknownAuthority x509.UnknownAuthorityError
		if !errors.As(err, &unknownAuthority) {
			t.Fatalf("expected x509.UnknownAuthorityError, got %v", err)
		}
	})

	t.Run("tls-ca flag", func(t *testing.T) {
		caFile := filepath.Join(t.TempDir(), "ca.crt")
		writeCertificatePEM(t, caFile, server.Certificate())
		if err := loadAllCerts(serverCLIContext(t, "--certs-dir", t.TempDir(), "--tls-ca", caFile)); err != nil {
			t.Fatalf("loadAllCerts: %v", err)
		}
		status, err := get(t, webhookClient(), server.URL)
		if err != nil || status != http.StatusOK {
			t.Fatalf("--tls-ca certificate was not attached: status %d, err %v", status, err)
		}
	})
}
