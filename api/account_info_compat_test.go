// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/require"
)

func TestNormalizeLegacyAccountInfoTags(t *testing.T) {
	legacy := []byte(`{
		"AccountName":"minioadmin",
		"Buckets":[
			{"name":"legacy","details":{"tags":{"XMLName":{"Space":"","Local":"Tagging"},"TagSet":{}},"versioning":false}},
			{"name":"modern","details":{"tags":{"environment":"test"}}},
			{"name":"untagged","details":{"tags":null}}
		]
	}`)

	normalized, changed := normalizeLegacyAccountInfoTags(legacy)
	require.True(t, changed)

	var accountInfo madmin.AccountInfo
	require.NoError(t, json.Unmarshal(normalized, &accountInfo))
	require.Len(t, accountInfo.Buckets, 3)
	require.Empty(t, accountInfo.Buckets[0].Details.Tagging.ToMap())
	require.Equal(t, map[string]string{"environment": "test"}, accountInfo.Buckets[1].Details.Tagging.ToMap())
	require.Nil(t, accountInfo.Buckets[2].Details.Tagging)
}

func TestNormalizeLegacyAccountInfoTagsLeavesModernPayloadUnchanged(t *testing.T) {
	modern := []byte(`{"Buckets":[{"details":{"tags":{"XMLName":"literal-tag-value","TagSet":"another-tag"}}}]}`)

	normalized, changed := normalizeLegacyAccountInfoTags(modern)
	require.False(t, changed)
	require.Equal(t, modern, normalized)
}

func TestAccountInfoCompatibilityTransport(t *testing.T) {
	legacy := `{"Buckets":[{"details":{"tags":{"XMLName":{"Space":"","Local":"Tagging"},"TagSet":{}}}}]}`
	transport := &accountInfoCompatibilityTransport{
		transport: roundTripFunc(func(_ *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     make(http.Header),
				Body:       io.NopCloser(strings.NewReader(legacy)),
			}, nil
		}),
	}

	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "http://minio:9000"+accountInfoAdminPath, nil)
	require.NoError(t, err)
	resp, err := transport.RoundTrip(req)
	require.NoError(t, err)
	t.Cleanup(func() { _ = resp.Body.Close() })

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	require.Equal(t, int64(len(body)), resp.ContentLength)
	require.Equal(t, "{\"Buckets\":[{\"details\":{\"tags\":{}}}]}", string(body))
}

func TestAccountInfoCompatibilityTransportPassesThroughLargeBody(t *testing.T) {
	legacy := `{"Buckets":[{"details":{"tags":{"XMLName":{"Space":"","Local":"Tagging"},"TagSet":{}}}}]}`
	transport := &accountInfoCompatibilityTransport{
		bodyLimit: 8,
		transport: roundTripFunc(func(_ *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode:    http.StatusOK,
				Header:        make(http.Header),
				Body:          io.NopCloser(strings.NewReader(legacy)),
				ContentLength: int64(len(legacy)),
			}, nil
		}),
	}

	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "http://minio:9000"+accountInfoAdminPath, nil)
	require.NoError(t, err)
	resp, err := transport.RoundTrip(req)
	require.NoError(t, err)
	t.Cleanup(func() { _ = resp.Body.Close() })
	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	require.Equal(t, legacy, string(body))
	require.Equal(t, int64(len(legacy)), resp.ContentLength)
}

func TestAccountInfoCompatibilityTransportIgnoresOtherPaths(t *testing.T) {
	bodyText := `{"XMLName":{"Space":"","Local":"Tagging"},"TagSet":{}}`
	transport := &accountInfoCompatibilityTransport{
		transport: roundTripFunc(func(_ *http.Request) (*http.Response, error) {
			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     make(http.Header),
				Body:       io.NopCloser(strings.NewReader(bodyText)),
			}, nil
		}),
	}

	req, err := http.NewRequestWithContext(context.Background(), http.MethodGet, "http://minio:9000/minio/admin/v3/info", nil)
	require.NoError(t, err)
	resp, err := transport.RoundTrip(req)
	require.NoError(t, err)
	t.Cleanup(func() { _ = resp.Body.Close() })
	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)
	require.Equal(t, bodyText, string(body))
}

func TestNewAdminFromCredsAcceptsLegacyAccountInfo(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		require.Equal(t, accountInfoAdminPath, req.URL.Path)
		w.Header().Set("Content-Type", "application/json")
		_, err := io.WriteString(w, `{"AccountName":"legacy","Buckets":[{"name":"bucket","details":{"tags":{"XMLName":{"Space":"","Local":"Tagging"},"TagSet":{}}}}]}`)
		require.NoError(t, err)
	}))
	t.Cleanup(server.Close)

	client, err := newAdminFromCreds("access", "secret", strings.TrimPrefix(server.URL, "http://"), false)
	require.NoError(t, err)
	accountInfo, err := client.AccountInfo(t.Context(), madmin.AccountOpts{})
	require.NoError(t, err)
	require.Len(t, accountInfo.Buckets, 1)
	require.Empty(t, accountInfo.Buckets[0].Details.Tagging.ToMap())
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return fn(req)
}
