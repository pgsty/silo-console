// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	console "github.com/minio/console"
	"github.com/minio/console/pkg"
)

func TestLegalDocumentsAreServedPubliclyAtAnyDepth(t *testing.T) {
	handler := FileServerMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusTeapot)
	}))
	tests := []struct {
		path string
		want string
	}{
		{"/legal/LICENSE", console.License()},
		{"/legal/NOTICE", console.Notice()},
		{"/legal/CREDITS", console.Credits()},
		{"/console/subpath/legal/LICENSE", console.License()},
	}
	for _, tt := range tests {
		t.Run(tt.path, func(t *testing.T) {
			rec := httptest.NewRecorder()
			handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, tt.path, nil))
			if rec.Code != http.StatusOK {
				t.Fatalf("status = %d", rec.Code)
			}
			if got := rec.Header().Get("Content-Type"); got != "text/plain; charset=utf-8" {
				t.Fatalf("content type = %q", got)
			}
			if body, _ := io.ReadAll(rec.Body); string(body) != tt.want {
				t.Fatalf("body differs from the embedded document (%d vs %d bytes)", len(body), len(tt.want))
			}
			head := httptest.NewRecorder()
			handler.ServeHTTP(head, httptest.NewRequest(http.MethodHead, tt.path, nil))
			if head.Code != http.StatusOK || head.Body.Len() != 0 {
				t.Fatalf("HEAD status = %d, body %d bytes", head.Code, head.Body.Len())
			}
		})
	}

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/legal/LICENSE", nil))
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("POST status = %d", rec.Code)
	}
	if isLegalDocumentPath("/legal/OTHER") || isLegalDocumentPath("/LICENSE") || isLegalDocumentPath("/legal/") {
		t.Fatal("unknown documents must not be treated as legal documents")
	}
	if strings.Contains(console.Notice(), "MinIO, Inc.") == false {
		t.Fatal("NOTICE must retain the upstream copyright holder")
	}
}

func TestInjectBuildMeta(t *testing.T) {
	previousVersion, previousTag, previousCommit := pkg.Version, pkg.ReleaseTag, pkg.CommitID
	t.Cleanup(func() { pkg.Version, pkg.ReleaseTag, pkg.CommitID = previousVersion, previousTag, previousCommit })
	pkg.Version, pkg.ReleaseTag, pkg.CommitID = "2.3.0", "v2.3.0", "0123456789abcdef0123456789abcdef01234567"

	page := []byte(`<head><meta name="license" content="agpl" />` + "\n    " + buildMetaSentinel + "\n</head>")
	out, ok := injectBuildMeta(page)
	if !ok {
		t.Fatal("sentinel was not found")
	}
	for _, want := range []string{
		`<meta name="silo-console-source" content="https://github.com/pgsty/silo-console/tree/v2.3.0" />`,
		`<meta name="silo-console-source-status" content="available" />`,
		`<meta name="silo-console-build" content="2.3.0 0123456789abcdef0123456789abcdef01234567" />`,
	} {
		if !strings.Contains(string(out), want) {
			t.Fatalf("injected page lacks %q:\n%s", want, out)
		}
	}
	if strings.Contains(string(out), buildMetaSentinel) {
		t.Fatal("sentinel survived injection")
	}

	// A tag value that needs escaping never breaks out of the attribute.
	pkg.Version, pkg.ReleaseTag = `"><script>alert(1)</script>`, "v9.9.9"
	out, _ = injectBuildMeta(page)
	if strings.Contains(string(out), "<script>") {
		t.Fatalf("metadata was not escaped:\n%s", out)
	}

	unchanged, ok := injectBuildMeta([]byte("<head></head>"))
	if ok || string(unchanged) != "<head></head>" {
		t.Fatal("a page without the sentinel must be returned unchanged")
	}
}

func TestEmbeddedIndexCarriesTheBuildMetaSentinel(t *testing.T) {
	rec := httptest.NewRecorder()
	FileServerMiddleware(http.NotFoundHandler()).ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("index status = %d", rec.Code)
	}
	body := rec.Body.String()
	if !strings.Contains(body, `name="silo-console-source-status"`) {
		t.Fatal("the served index.html carries no injected build metadata; rebuild web-app/build from an index.html with the sentinel")
	}
}
