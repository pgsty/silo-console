// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

package api

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"os"
	"sync"
	"testing"
	"testing/fstest"

	"github.com/klauspost/compress/gzip"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAcceptsGzip(t *testing.T) {
	tests := []struct {
		name   string
		header string
		want   bool
	}{
		{name: "empty", header: "", want: false},
		{name: "gzip", header: "gzip", want: true},
		{name: "case insensitive", header: "GZip", want: true},
		{name: "positive quality", header: "br, gzip;q=0.5", want: true},
		{name: "zero quality", header: "br, gzip;q=0", want: false},
		{name: "wildcard", header: "br, *;q=0.5", want: true},
		{name: "explicit zero overrides wildcard", header: "gzip;q=0, *;q=1", want: false},
		{name: "invalid quality", header: "gzip;q=invalid", want: false},
		{name: "unrelated encoding", header: "br", want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, acceptsGzip(tt.header))
		})
	}
}

func TestPrecompressedAssetsHandler(t *testing.T) {
	raw := []byte("console.log('SILO');")
	var compressed bytes.Buffer
	zw := gzip.NewWriter(&compressed)
	_, err := zw.Write(raw)
	require.NoError(t, err)
	require.NoError(t, zw.Close())

	fsys := fstest.MapFS{
		"assets/app.js.gz": {Data: compressed.Bytes()},
	}
	fallback := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusTeapot)
	})
	handler := precompressedAssetsHandler(fsys, fallback)

	tests := []struct {
		name            string
		method          string
		acceptEncoding  string
		wantStatus      int
		wantEncoding    string
		wantBody        []byte
		wantContentSize int64
	}{
		{
			name:            "serves gzip when accepted",
			method:          http.MethodGet,
			acceptEncoding:  "br, gzip;q=0.8",
			wantStatus:      http.StatusOK,
			wantEncoding:    "gzip",
			wantBody:        compressed.Bytes(),
			wantContentSize: int64(compressed.Len()),
		},
		{
			name:            "decompresses for explicit gzip rejection",
			method:          http.MethodGet,
			acceptEncoding:  "gzip;q=0, *;q=1",
			wantStatus:      http.StatusOK,
			wantBody:        raw,
			wantContentSize: int64(len(raw)),
		},
		{
			name:            "head returns compressed headers without a body",
			method:          http.MethodHead,
			acceptEncoding:  "gzip",
			wantStatus:      http.StatusOK,
			wantEncoding:    "gzip",
			wantBody:        nil,
			wantContentSize: int64(compressed.Len()),
		},
		{
			name:       "other methods are rejected",
			method:     http.MethodPost,
			wantStatus: http.StatusMethodNotAllowed,
			wantBody:   []byte("Method Not Allowed\n"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(tt.method, "/assets/app.js", nil)
			req.Header.Set("Accept-Encoding", tt.acceptEncoding)
			recorder := httptest.NewRecorder()

			handler.ServeHTTP(recorder, req)

			assert.Equal(t, tt.wantStatus, recorder.Code)
			assert.Equal(t, tt.wantEncoding, recorder.Header().Get("Content-Encoding"))
			assert.Equal(t, tt.wantBody, recorder.Body.Bytes())
			if tt.wantContentSize > 0 {
				assert.Equal(t, tt.wantContentSize, recorder.Result().ContentLength)
			}
			if tt.method == http.MethodGet || tt.method == http.MethodHead {
				assert.Contains(t, recorder.Header().Values("Vary"), "Accept-Encoding")
			} else {
				assert.Equal(t, "GET, HEAD", recorder.Header().Get("Allow"))
			}
		})
	}
}

func TestFileServerMiddlewareMethods(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	handler := FileServerMiddleware(next)

	t.Run("rejects writes to SPA routes", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodPost, "/", nil))

		assert.Equal(t, http.StatusMethodNotAllowed, recorder.Code)
		assert.Equal(t, "GET, HEAD", recorder.Header().Get("Allow"))
	})

	t.Run("passes API methods to the API handler", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodPost, "/api/test", nil))

		assert.Equal(t, http.StatusNoContent, recorder.Code)
	})
}

func TestPrecompressedAssetCachePolicy(t *testing.T) {
	var compressed bytes.Buffer
	zw := gzip.NewWriter(&compressed)
	_, err := zw.Write([]byte("translated UI"))
	require.NoError(t, err)
	require.NoError(t, zw.Close())

	fsys := fstest.MapFS{
		"assets/language-tr-A1b2_C3-.js.gz": {Data: compressed.Bytes()},
		"assets/style-Abcd1234.css.gz":      {Data: compressed.Bytes()},
		"assets/config.js.gz":               {Data: compressed.Bytes()},
		"manifest.json.gz":                  {Data: compressed.Bytes()},
		"assets/broken-Abcd1234.js.gz":      {Data: []byte("invalid gzip")},
	}
	handler := precompressedAssetsHandler(fsys, http.NotFoundHandler())
	for _, tc := range []struct {
		path      string
		immutable bool
		status    int
	}{
		{"/assets/language-tr-A1b2_C3-.js", true, http.StatusOK},
		{"/assets/style-Abcd1234.css", true, http.StatusOK},
		{"/assets/config.js", false, http.StatusOK},
		{"/assets/config.js?v=Abcd1234", false, http.StatusOK},
		{"/manifest.json", false, http.StatusOK},
		{"/assets/missing-Abcd1234.js", false, http.StatusNotFound},
	} {
		for _, encoding := range []string{"gzip", "identity"} {
			for _, method := range []string{http.MethodGet, http.MethodHead} {
				t.Run(method+" "+tc.path+" "+encoding, func(t *testing.T) {
					req := httptest.NewRequest(method, tc.path, nil)
					req.Header.Set("Accept-Encoding", encoding)
					recorder := httptest.NewRecorder()
					handler.ServeHTTP(recorder, req)
					assert.Equal(t, tc.status, recorder.Code)
					if tc.immutable {
						assert.Equal(t, "public, max-age=31536000, immutable", recorder.Header().Get("Cache-Control"))
						assert.Contains(t, recorder.Header().Values("Vary"), "Accept-Encoding")
					} else {
						assert.Empty(t, recorder.Header().Get("Cache-Control"))
					}
				})
			}
		}
	}
	t.Run("decompression errors are not immutable", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/assets/broken-Abcd1234.js", nil))
		assert.Equal(t, http.StatusInternalServerError, recorder.Code)
		assert.Empty(t, recorder.Header().Get("Cache-Control"))
	})
}

func TestFileServerMiddlewareCachePolicy(t *testing.T) {
	handler := FileServerMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.WriteHeader(http.StatusNoContent)
	}))
	for _, route := range []string{"/", "/login", "/assets/missing-Abcd1234.js"} {
		t.Run(route, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, route, nil))
			assert.Equal(t, http.StatusOK, recorder.Code)
			assert.Equal(t, "private, no-cache", recorder.Header().Get("Cache-Control"))
		})
	}
	t.Run("API cache policy stays under the API handler's control", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		handler.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/api/test", nil))
		assert.Equal(t, http.StatusNoContent, recorder.Code)
		assert.Equal(t, "no-store", recorder.Header().Get("Cache-Control"))
	})
}

func Test_parseSubPath(t *testing.T) {
	type args struct {
		v string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "Empty",
			args: args{
				v: "",
			},
			want: "/",
		},
		{
			name: "Slash",
			args: args{
				v: "/",
			},
			want: "/",
		},
		{
			name: "Double Slash",
			args: args{
				v: "//",
			},
			want: "/",
		},
		{
			name: "No slashes",
			args: args{
				v: "route",
			},
			want: "/route/",
		},
		{
			name: "No trailing slashes",
			args: args{
				v: "/route",
			},
			want: "/route/",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			assert.Equalf(t, tt.want, parseSubPath(tt.args.v), "parseSubPath(%v)", tt.args.v)
		})
	}
}

func Test_getSubPath(t *testing.T) {
	type args struct {
		envValue string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "Empty",
			args: args{
				envValue: "",
			},
			want: "/",
		},
		{
			name: "Slash",
			args: args{
				envValue: "/",
			},
			want: "/",
		},
		{
			name: "Valid Value",
			args: args{
				envValue: "/subpath/",
			},
			want: "/subpath/",
		},
		{
			name: "No starting slash",
			args: args{
				envValue: "subpath/",
			},
			want: "/subpath/",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			t.Setenv(SubPath, tt.args.envValue)
			defer os.Unsetenv(SubPath)
			subPathOnce = sync.Once{}
			assert.Equalf(t, tt.want, getSubPath(), "getSubPath()")
		})
	}
}
