// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"bytes"
	"encoding/json"
	"io"
	"mime"
	"net/http"
	"net/url"
	"strings"
)

// Native browser downloads cannot send JSON or custom headers. Normalize only
// this read-only operation, then retain its normal authentication and ZIP error
// handling. JSON clients and every other API operation are unchanged.
func downloadFormMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mediaType, _, _ := mime.ParseMediaType(r.Header.Get("Content-Type"))
		parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/v1/"), "/")
		if r.Method != http.MethodPost || !strings.HasPrefix(r.URL.Path, "/api/v1/") || len(parts) != 4 || parts[0] != "buckets" || parts[2] != "objects" || parts[3] != "download-multiple" || mediaType != "application/x-www-form-urlencoded" {
			next.ServeHTTP(w, r)
			return
		}
		// Reuse the Console origin policy, including configured external origins
		// and explicitly trusted proxies for embedded/subpath installations.
		if !wsCheckOrigin(r) {
			http.Error(w, "download origin is not allowed", http.StatusForbidden)
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, 2<<20)
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "download selection is too large", http.StatusRequestEntityTooLarge)
			return
		}
		values, err := url.ParseQuery(string(body))
		var objects []string
		if err != nil || len(values["objects"]) != 1 || json.Unmarshal([]byte(values.Get("objects")), &objects) != nil || len(objects) == 0 || len(objects) > 1000 {
			http.Error(w, "invalid download selection", http.StatusBadRequest)
			return
		}
		for _, object := range objects {
			if object == "" || len(object) > 1024 {
				http.Error(w, "invalid object name", http.StatusBadRequest)
				return
			}
		}
		if values.Get("anonymous") == "1" {
			r.Header.Set("X-Anonymous", "1")
		}
		payload := []byte(values.Get("objects"))
		r.Body = io.NopCloser(bytes.NewReader(payload))
		r.ContentLength = int64(len(payload))
		r.Header.Set("Content-Type", "application/json")
		r.Header.Del("Content-Length")
		next.ServeHTTP(w, r)
	})
}
