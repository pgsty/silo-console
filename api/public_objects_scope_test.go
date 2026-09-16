// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/go-openapi/loads"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/public"
	"github.com/stretchr/testify/require"
)

func sharedURL(target string) string {
	return "/api/v1/download-shared-object/" + base64.RawURLEncoding.EncodeToString([]byte(target))
}

func TestSharedObjectURLScope(t *testing.T) {
	const endpoint = "http://localhost:9000"
	for _, tc := range []struct {
		name, endpoint, target string
		allowed                bool
	}{
		{"public object", endpoint, endpoint + "/photos/a.jpg", true},
		{"signed version", endpoint, endpoint + "/photos/a.jpg?versionId=null&X-Amz-Signature=test&X-Amz-Security-Token=a%2Bb", true},
		{"encoded key", endpoint, endpoint + "/photos/%E4%B8%AD%E6%96%87%20%2B%25%3F%23.txt", true},
		{"encoded slash", endpoint, endpoint + "/photos/folder%2Ffile.txt", true},
		{"literal percent escapes", endpoint, endpoint + "/photos/%252e%252e/%252F.txt", true},
		{"system name inside key", endpoint, endpoint + "/photos/minio/.minio.sys/report.txt", true},
		{"routing name inside key", endpoint, endpoint + "/photos/tagging%3Fretention", true},
		{"download parameters", endpoint, endpoint + "/photos/a.jpg?partNumber=1&response-content-disposition=attachment&versionId=123", true},
		{"unknown parameters", endpoint, endpoint + "/photos/a.jpg?custom=a%20b&custom=a+b&list-type=2", true},
		{"HTTP default port", "http://silo.example", "http://SILO.example:80/photos/a.jpg", true},
		{"HTTPS default port", "https://silo.example:443", "https://SILO.example/photos/a.jpg", true},
		{"IPv6", "http://[::1]:9000", "http://[::1]:9000/photos/a.jpg", true},
		{"other host", endpoint, "http://other:9000/photos/a.jpg", false},
		{"other port", endpoint, "http://localhost:9001/photos/a.jpg", false},
		{"other scheme", endpoint, "https://localhost:9000/photos/a.jpg", false},
		{"userinfo", endpoint, "http://user:password@localhost:9000/photos/a.jpg", false},
		{"fragment", endpoint, endpoint + "/photos/a.jpg#fragment", false},
		{"root", endpoint, endpoint + "/", false},
		{"bucket listing", endpoint, endpoint + "/photos?list-type=2", false},
		{"bucket config", endpoint, endpoint + "/photos/?policy", false},
		{"invalid bucket", endpoint, endpoint + "/invalid_bucket/a.jpg", false},
		{"metrics", endpoint, endpoint + "/minio/v2/metrics/cluster", false},
		{"bucket usage metrics", endpoint, endpoint + "/minio/metrics/v3/cluster/usage/buckets", false},
		{"metrics with fake signature", endpoint, endpoint + "/minio/v2/metrics/cluster?X-Amz-Signature=fake", false},
		{"health", endpoint, endpoint + "/minio/health/live", false},
		{"admin", endpoint, endpoint + "/minio/admin/v3/info", false},
		{"metadata", endpoint, endpoint + "/.minio.sys/config/config.json", false},
		{"encoded system bucket", endpoint, endpoint + "/%6dinio/v2/metrics/cluster", false},
		{"encoded leading slash", endpoint, endpoint + "/%2fminio/v2/metrics/cluster", false},
		{"dot component", endpoint, endpoint + "/photos/../minio/v2/metrics/cluster", false},
		{"encoded dot component", endpoint, endpoint + "/photos/%2e%2e/minio/v2/metrics/cluster", false},
		{"whitespace dot component", endpoint, endpoint + "/photos/%20..%20/minio/v2/metrics/cluster", false},
		{"backslash dot component", endpoint, endpoint + "/photos/dir%5c..%5cfile", false},
		{"encoded operation", endpoint, endpoint + "/photos/a.jpg?tag%67ing", false},
		{"duplicate operation", endpoint, endpoint + "/photos/a.jpg?tagging=x&tagging=", false},
		{"bad query escape", endpoint, endpoint + "/photos/a.jpg?custom=%zz", false},
		{"query semicolon", endpoint, endpoint + "/photos/a.jpg?custom=1;tagging", false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv(ConsoleMinIOServer, tc.endpoint)
			got, err := decodeMinIOStringURL(base64.RawURLEncoding.EncodeToString([]byte(tc.target)))
			if !tc.allowed {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)
			require.Equal(t, tc.target, *got, "the signed URL must not be rewritten")
		})
	}
	for _, key := range []string{"acl", "tagging", "retention", "legal-hold", "attributes", "uploadId", "lambdaArn", "torrent"} {
		t.Run(key, func(t *testing.T) {
			t.Setenv(ConsoleMinIOServer, endpoint)
			_, err := decodeMinIOStringURL(base64.RawURLEncoding.EncodeToString([]byte(endpoint + "/photos/a.jpg?" + key)))
			require.ErrorIs(t, err, ErrForbidden)
		})
	}
}

func TestSharedObjectHTTPBoundary(t *testing.T) {
	var backendHits, redirectHits atomic.Int32
	redirect := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		redirectHits.Add(1)
		fmt.Fprint(w, "must not be reached")
	}))
	defer redirect.Close()
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		backendHits.Add(1)
		if r.URL.Path == "/photos/private" {
			http.Error(w, "AccessDenied", http.StatusForbidden)
			return
		}
		if strings.HasPrefix(r.URL.Path, "/photos/redirect/") {
			var status int
			_, _ = fmt.Sscanf(r.URL.Path, "/photos/redirect/%d", &status)
			location := redirect.URL + "/other"
			if r.URL.Query().Get("same-origin") == "yes" {
				location = "/minio/v2/metrics/cluster"
			}
			http.Redirect(w, r, location, status)
			return
		}
		fmt.Fprint(w, r.RequestURI)
	}))
	defer backend.Close()
	t.Setenv(ConsoleMinIOServer, backend.URL)
	doc, err := loads.Embedded(SwaggerJSON, FlatSwaggerJSON)
	require.NoError(t, err)
	api := operations.NewConsoleAPI(doc)
	registerPublicObjectsHandlers(api)
	console := httptest.NewServer(api.Serve(nil))
	defer console.Close()
	get := func(target string, wantStatus int) string {
		t.Helper()
		resp, err := http.Get(console.URL + sharedURL(target))
		require.NoError(t, err)
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		require.NoError(t, err)
		require.Equal(t, wantStatus, resp.StatusCode, "%s", body)
		require.Empty(t, resp.Header.Get("Location"))
		return string(body)
	}
	for _, path := range []string{
		"/photos/public", "/photos/folder%2F%E4%B8%AD%E6%96%87%20%252F.txt?versionId=null&custom=a+b&custom=a%20b&X-Amz-Signature=test",
	} {
		require.Equal(t, path, get(backend.URL+path, http.StatusOK))
	}
	get(backend.URL+"/photos/private", http.StatusForbidden)
	before := backendHits.Load()
	for _, path := range []string{"/minio/v2/metrics/cluster", "/minio/v2/metrics/cluster?X-Amz-Signature=fake", "/photos?list-type=2", "/photos/public?tagging", "/%6dinio/health/live"} {
		get(backend.URL+path, http.StatusForbidden)
	}
	require.Equal(t, before, backendHits.Load(), "blocked URLs must never reach the backend")
	for _, status := range []int{301, 302, 303, 307, 308} {
		for _, query := range []string{"", "?same-origin=yes"} {
			before := backendHits.Load()
			get(fmt.Sprintf("%s/photos/redirect/%d%s", backend.URL, status, query), http.StatusBadGateway)
			require.Equal(t, before+1, backendHits.Load(), "same-origin redirects must not be followed")
		}
	}
	require.Zero(t, redirectHits.Load(), "cross-origin redirects must not be followed")
	// Link-format configuration does not change the proxy's request boundary.
	t.Setenv(ConsoleShareMinIOURL, "on")
	get(backend.URL+"/photos/public", http.StatusOK)
	before = backendHits.Load()
	get(backend.URL+"/minio/v2/metrics/cluster", http.StatusForbidden)
	require.Equal(t, before, backendHits.Load(), "the scope restriction always applies")
}

func TestSharedObjectCancellation(t *testing.T) {
	started, stopped := make(chan struct{}), make(chan struct{})
	backend := httptest.NewServer(http.HandlerFunc(func(_ http.ResponseWriter, r *http.Request) {
		close(started)
		<-r.Context().Done()
		close(stopped)
	}))
	defer backend.Close()
	t.Setenv(ConsoleMinIOServer, backend.URL)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	finished := make(chan struct{})
	go func() {
		defer close(finished)
		_, _ = getDownloadPublicObjectResponse(public.DownloadSharedObjectParams{
			HTTPRequest: httptest.NewRequestWithContext(ctx, http.MethodGet, "/", nil),
			URL:         base64.RawURLEncoding.EncodeToString([]byte(backend.URL + "/photos/object")),
		})
	}()
	select {
	case <-started:
	case <-time.After(5 * time.Second):
		t.Fatal("backend request did not start")
	}
	cancel()
	for _, ch := range []chan struct{}{stopped, finished} {
		select {
		case <-ch:
		case <-time.After(5 * time.Second):
			t.Fatal("backend request did not cancel")
		}
	}
}
