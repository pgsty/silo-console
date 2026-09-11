// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later
package api

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"reflect"
	"strings"
	"testing"
)

func TestDownloadForm(t *testing.T) {
	path := "/api/v1/buckets/test/objects/download-multiple"
	names := []string{"a%2Fb", "a+b", "中文目录/", "a&b"}
	encoded, _ := json.Marshal(names)
	for _, anonymous := range []string{"0", "1"} {
		t.Run("anonymous="+anonymous, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodPost, path, strings.NewReader(url.Values{"objects": {string(encoded)}, "anonymous": {anonymous}}.Encode()))
			request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			request.Header.Set("Origin", "http://example.com")
			next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				var got []string
				if err := json.NewDecoder(r.Body).Decode(&got); err != nil || !reflect.DeepEqual(got, names) {
					t.Fatalf("body = %v, err = %v", got, err)
				}
				if r.Header.Get("Content-Type") != "application/json" {
					t.Fatal("missing JSON content type")
				}
				if (r.Header.Get("X-Anonymous") == "1") != (anonymous == "1") {
					t.Fatal("wrong anonymous mode")
				}
				w.WriteHeader(http.StatusNoContent)
			})
			response := httptest.NewRecorder()
			downloadFormMiddleware(next).ServeHTTP(response, request)
			if response.Code != http.StatusNoContent {
				t.Fatalf("status=%d: %s", response.Code, response.Body.String())
			}
			if response.Header().Get("X-Frame-Options") != "SAMEORIGIN" {
				t.Fatal("native form responses must be readable by the same-origin frame")
			}
		})
	}
	for _, body := range []string{"objects=null", "objects=%7B", "objects=%5B%5D", "objects=%5B1%5D", url.Values{"objects": {`[""]`}}.Encode()} {
		request := httptest.NewRequest(http.MethodPost, path, strings.NewReader(body))
		request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		response := httptest.NewRecorder()
		downloadFormMiddleware(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { t.Fatal("invalid selection reached handler") })).ServeHTTP(response, request)
		if response.Code != http.StatusBadRequest {
			t.Fatalf("%s: %d", body, response.Code)
		}
	}
}

func TestDownloadFormBoundaries(t *testing.T) {
	const path = "/api/v1/buckets/test/objects/download-multiple"
	for _, tc := range []struct {
		name, body, origin string
		status             int
	}{
		{"cross origin", "objects=%5B%22a%22%5D", "https://untrusted.invalid", 403},
		{"oversized", strings.Repeat("x", (2<<20)+1), "", 413},
	} {
		t.Run(tc.name, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodPost, path, strings.NewReader(tc.body))
			request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			if tc.origin != "" {
				request.Header.Set("Origin", tc.origin)
			}
			response := httptest.NewRecorder()
			downloadFormMiddleware(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { t.Fatal("rejected form reached handler") })).ServeHTTP(response, request)
			if response.Code != tc.status {
				t.Fatalf("status=%d", response.Code)
			}
			if response.Header().Get("X-Frame-Options") != "SAMEORIGIN" {
				t.Fatal("native form error responses must remain readable")
			}
		})
	}
	t.Run("JSON clients unchanged", func(t *testing.T) {
		request := httptest.NewRequest(http.MethodPost, path, strings.NewReader(`["a"]`))
		request.Header.Set("Content-Type", "application/json")
		downloadFormMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			b, _ := io.ReadAll(r.Body)
			if string(b) != `["a"]` {
				t.Fatal(string(b))
			}
			if w.Header().Get("X-Frame-Options") != "" {
				t.Fatal("JSON clients must retain the configured framing policy")
			}
		})).ServeHTTP(httptest.NewRecorder(), request)
	})
}
