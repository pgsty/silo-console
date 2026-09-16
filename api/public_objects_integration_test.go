// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/stretchr/testify/require"
)

// Run against disposable SILO + standalone or embedded Console, never production.
// The test creates and removes only its uniquely named, versioned bucket.
func TestSharedObjectLiveStack(t *testing.T) {
	endpoint, console := os.Getenv("SILO_SHARE_TEST_ENDPOINT"), os.Getenv("CONSOLE_SHARE_TEST_ENDPOINT")
	if endpoint == "" || console == "" {
		t.Skip("set SILO_SHARE_TEST_ENDPOINT and CONSOLE_SHARE_TEST_ENDPOINT for a disposable live stack")
	}
	accessKey, secretKey := os.Getenv("SILO_SHARE_TEST_ACCESS_KEY"), os.Getenv("SILO_SHARE_TEST_SECRET_KEY")
	require.NotEmpty(t, accessKey)
	require.NotEmpty(t, secretKey)
	u, err := url.Parse(endpoint)
	require.NoError(t, err)
	s3, err := minio.New(u.Host, &minio.Options{Secure: u.Scheme == "https", Creds: credentials.NewStaticV4(accessKey, secretKey, "")})
	require.NoError(t, err)
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	bucket := fmt.Sprintf("share-probe-%d", time.Now().UnixNano())
	require.NoError(t, s3.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}))
	t.Cleanup(func() {
		cleanupCtx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		defer cancel()
		for object := range s3.ListObjects(cleanupCtx, bucket, minio.ListObjectsOptions{Recursive: true, WithVersions: true}) {
			require.NoError(t, object.Err)
			require.NoError(t, s3.RemoveObject(cleanupCtx, bucket, object.Key, minio.RemoveObjectOptions{VersionID: object.VersionID}))
		}
		require.NoError(t, s3.RemoveBucket(cleanupCtx, bucket))
	})
	require.NoError(t, s3.SetBucketVersioning(ctx, bucket, minio.BucketVersioningConfiguration{Status: "Enabled"}))
	require.NoError(t, s3.SetBucketPolicy(ctx, bucket, fmt.Sprintf(`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::%s/public/*"]}]}`, bucket)))
	put := func(key, body string) minio.UploadInfo {
		t.Helper()
		info, err := s3.PutObject(ctx, bucket, key, strings.NewReader(body), int64(len(body)), minio.PutObjectOptions{ContentType: "text/plain"})
		require.NoError(t, err)
		return info
	}
	put("public/hello.txt", "public body")
	old := put("private.txt", "old version")
	put("private.txt", "current version")
	encodedKey := "folder/中文 +%?#.txt"
	put(encodedKey, "encoded body")
	sign := func(key string, query url.Values) *url.URL {
		t.Helper()
		u, err := s3.PresignedGetObject(ctx, bucket, key, 5*time.Minute, query)
		require.NoError(t, err)
		return u
	}
	anon := &http.Client{Timeout: 10 * time.Second}
	request := func(client *http.Client, method, target string, body []byte, status int) []byte {
		t.Helper()
		req, err := http.NewRequestWithContext(ctx, method, target, bytes.NewReader(body))
		require.NoError(t, err)
		if body != nil {
			req.Header.Set("Content-Type", "application/json")
		}
		resp, err := client.Do(req)
		require.NoError(t, err)
		defer resp.Body.Close()
		data, err := io.ReadAll(resp.Body)
		require.NoError(t, err)
		require.Equal(t, status, resp.StatusCode, "response: %s", data)
		return data
	}
	// Restricting the Console proxy does not change access to the S3 listener.
	publicURL := endpoint + "/" + bucket + "/public/hello.txt"
	require.Equal(t, "public body", string(request(anon, "GET", publicURL, nil, 200)))
	metrics := request(anon, "GET", endpoint+"/minio/v2/metrics/cluster", nil, 200)
	require.Contains(t, string(metrics), "minio_")
	for _, target := range []string{
		endpoint + "/minio/v2/metrics/cluster", endpoint + "/minio/v2/metrics/cluster?X-Amz-Signature=fake",
		endpoint + "/minio/metrics/v3/cluster/usage/buckets",
		endpoint + "/minio/health/live", endpoint + "/minio/admin/v3/info", endpoint + "/" + bucket + "?list-type=2",
		endpoint + "/" + bucket + "/public/hello.txt?tagging",
	} {
		request(anon, "GET", console+sharedURL(target), nil, 403)
	}
	t.Log("public metrics remain directly readable but all non-object proxy requests return 403")
	for _, tc := range []struct{ target, body string }{
		{publicURL, "public body"},
		{sign("private.txt", nil).String(), "current version"},
		{sign("private.txt", url.Values{"versionId": {old.VersionID}}).String(), "old version"},
		{sign(encodedKey, nil).String(), "encoded body"},
	} {
		require.Equal(t, tc.body, string(request(anon, "GET", console+sharedURL(tc.target), nil, 200)))
	}
	request(anon, "GET", console+sharedURL(endpoint+"/"+bucket+"/private.txt"), nil, 403)
	badSignature := sign("private.txt", nil)
	query := badSignature.Query()
	query.Set("X-Amz-Signature", strings.Repeat("0", 64))
	badSignature.RawQuery = query.Encode()
	request(anon, "GET", console+sharedURL(badSignature.String()), nil, 403)
	jar, err := cookiejar.New(nil)
	require.NoError(t, err)
	login := &http.Client{Jar: jar, Timeout: 10 * time.Second}
	loginBody, err := json.Marshal(map[string]string{"accessKey": accessKey, "secretKey": secretKey})
	require.NoError(t, err)
	request(login, "POST", console+"/api/v1/login", loginBody, 204)
	for _, toggle := range []string{"false", "true"} {
		query := url.Values{"prefix": {"private.txt"}, "version_id": {old.VersionID}, "expires": {"5m"}, "toggle_url": {toggle}}
		creation := console + "/api/v1/buckets/" + bucket + "/objects/share?" + query.Encode()
		response := request(login, "GET", creation, nil, 200)
		var link string
		require.NoError(t, json.Unmarshal(response, &link))
		require.Equal(t, "old version", string(request(anon, "GET", link, nil, 200)))
	}
	t.Log("public/private/versioned/encoded objects, S3 denials, login and both link formats verified without extra configuration")
}
