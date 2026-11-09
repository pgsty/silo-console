// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package main

import (
	"context"
	"crypto/x509"
	"errors"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/minio/console/api"
	"github.com/minio/console/pkg/certs"
	"github.com/minio/console/pkg/usage"
)

func storageServer(t *testing.T) *httptest.Server {
	t.Helper()
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/xml")
		_, _ = w.Write([]byte(`<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Buckets></Buckets></ListAllMyBucketsResult>`))
	}))
	t.Cleanup(server.Close)
	return server
}

// listBuckets makes one request with the worker's S3 client, built exactly as
// RunWorker builds it from the loaded configuration.
func listBuckets(t *testing.T, endpoint string, args ...string) error {
	t.Helper()
	// A pooled connection keeps the trust it was verified with.
	api.GlobalTransport.CloseIdleConnections()
	config := usage.Config{Endpoint: endpoint, AccessKey: "worker", SecretKey: "worker-secret"}
	if err := loadUsageWorkerTLS(serverCLIContext(t, args...), &config); err != nil {
		t.Fatalf("loadUsageWorkerTLS: %v", err)
	}
	client, err := config.NewS3Client()
	if err != nil {
		t.Fatalf("NewS3Client: %v", err)
	}
	_, err = client.ListBuckets(context.Background())
	return err
}

func isUnknownAuthority(err error) bool {
	var unknownAuthority x509.UnknownAuthorityError
	return errors.As(err, &unknownAuthority)
}

func TestUsageWorkerTrustsConsoleCAsAndEndpointPolicy(t *testing.T) {
	preserveStartupTLSGlobals(t)
	// Tests dial their own servers; a proxy would turn TLS into CONNECT.
	api.GlobalTransport.Proxy = nil
	silo, other := storageServer(t), storageServer(t)

	t.Run("CAs directory", func(t *testing.T) {
		certsDir := t.TempDir()
		writeCertificatePEM(t, filepath.Join(certsDir, certs.CertsCADir, "silo.crt"), silo.Certificate())
		if err := listBuckets(t, silo.URL, "--certs-dir", certsDir); err != nil {
			t.Fatalf("worker did not trust the configured CA: %v", err)
		}
	})

	t.Run("without the CA", func(t *testing.T) {
		if err := listBuckets(t, silo.URL, "--certs-dir", t.TempDir()); !isUnknownAuthority(err) {
			t.Fatalf("expected x509.UnknownAuthorityError, got %v", err)
		}
	})

	t.Run("missing certs directory is not created", func(t *testing.T) {
		certsDir := filepath.Join(t.TempDir(), "absent")
		if err := listBuckets(t, other.URL, "--certs-dir", certsDir); !isUnknownAuthority(err) {
			t.Fatalf("expected x509.UnknownAuthorityError, got %v", err)
		}
		if _, err := os.Stat(certsDir); !errors.Is(err, os.ErrNotExist) {
			t.Fatalf("the worker created its certs directory: %v", err)
		}
	})

	t.Run("an unreadable server key does not block the worker", func(t *testing.T) {
		certsDir := t.TempDir()
		writeCertificatePEM(t, filepath.Join(certsDir, certs.CertsCADir, "silo.crt"), silo.Certificate())
		writeCertificatePEM(t, filepath.Join(certsDir, certs.PublicCertFile), other.Certificate())
		key := filepath.Join(certsDir, certs.PrivateKeyFile)
		if err := os.WriteFile(key, []byte("not readable"), 0o000); err != nil {
			t.Fatal(err)
		}
		if err := listBuckets(t, silo.URL, "--certs-dir", certsDir); err != nil {
			t.Fatalf("worker failed with a key it does not need: %v", err)
		}
	})

	t.Run("skip-verify exempts only the configured endpoint", func(t *testing.T) {
		t.Setenv(api.ConsoleMinIOServer, silo.URL)
		t.Setenv(api.ConsoleMinIOServerTLSSkipVerify, "on")
		if err := listBuckets(t, silo.URL, "--certs-dir", t.TempDir()); err != nil {
			t.Fatalf("skip-verify was not applied to the SILO endpoint: %v", err)
		}
		if err := listBuckets(t, other.URL, "--certs-dir", t.TempDir()); !isUnknownAuthority(err) {
			t.Fatalf("skip-verify leaked to another origin: %v", err)
		}
	})
}
