//go:build integration && storageintegration

// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/minio/console/models"
	mc "github.com/minio/mc/cmd"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/stretchr/testify/require"
)

// Exercise Console's actual MC adapter against the same disposable SILO fixture
// as the required usage-integration job. CLI-only MC tests cannot cover this path.
func TestMCClientLiveSILO(t *testing.T) {
	endpoint, access, secret := os.Getenv("TEST_USAGE_S3_ENDPOINT"), os.Getenv("TEST_USAGE_S3_ACCESS_KEY"), os.Getenv("TEST_USAGE_S3_SECRET_KEY")
	require.NotEmpty(t, endpoint, "disposable SILO fixture is required")
	require.NotEmpty(t, access)
	require.NotEmpty(t, secret)
	t.Setenv("CONSOLE_MINIO_SERVER", endpoint)
	u, err := url.Parse(endpoint)
	require.NoError(t, err)
	root, err := minio.New(u.Host, &minio.Options{Secure: u.Scheme == "https", Creds: credentials.NewStaticV4(access, secret, "")})
	require.NoError(t, err)
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	bucket := fmt.Sprintf("console-mc-%d", time.Now().UnixNano())
	require.NoError(t, root.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}))
	t.Cleanup(func() {
		cleanup, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		for object := range root.ListObjects(cleanup, bucket, minio.ListObjectsOptions{Recursive: true, WithVersions: true}) {
			require.NoError(t, object.Err)
			require.NoError(t, root.RemoveObject(cleanup, bucket, object.Key, minio.RemoveObjectOptions{VersionID: object.VersionID}))
		}
		require.NoError(t, root.RemoveBucket(cleanup, bucket))
	})
	principal := &models.Principal{STSAccessKeyID: access, STSSecretAccessKey: secret}
	clientFor := func(key string, p *models.Principal) mcClient {
		t.Helper()
		client, err := newS3BucketClient(p, bucket, key, "127.0.0.1")
		require.NoError(t, err)
		return mcClient{client: client}
	}
	put := func(key, body string) minio.UploadInfo {
		t.Helper()
		info, err := root.PutObject(ctx, bucket, key, strings.NewReader(body), int64(len(body)), minio.PutObjectOptions{})
		require.NoError(t, err)
		return info
	}
	list := func(client mcClient) []*mc.ClientContent {
		t.Helper()
		var objects []*mc.ClientContent
		for object := range client.list(ctx, mc.ListOptions{Recursive: true, WithOlderVersions: true, WithDeleteMarkers: true}) {
			require.Nil(t, object.Err)
			objects = append(objects, object)
		}
		return objects
	}
	client := clientFor("", principal)
	require.Nil(t, client.setVersioning(ctx, "enable", nil, false))
	key := "folder/中文 +%?#.txt"
	old := put(key, "old body")
	put(key, "current body")
	put(key+"-neighbor", "keep me")
	objectClient := clientFor(key, principal)
	reader, perr := objectClient.get(ctx, mc.GetOptions{VersionID: old.VersionID})
	require.Nil(t, perr)
	body, err := io.ReadAll(reader)
	require.NoError(t, err)
	require.NoError(t, reader.Close())
	require.Equal(t, "old body", string(body))
	require.Len(t, list(client), 3)

	// A normal deletion creates a marker. Purging this exact key must then
	// remove its historical versions and marker without touching a prefix peer.
	require.NoError(t, deleteObjects(ctx, objectClient, bucket, key, "", false, false, false, false))
	versions := list(client)
	require.Len(t, versions, 4)
	var markers int
	for _, version := range versions {
		if version.IsDeleteMarker {
			markers++
			require.True(t, version.IsLatest)
		}
	}
	require.Equal(t, 1, markers)
	require.NoError(t, deleteObjects(ctx, objectClient, bucket, key, "", true, true, false, false))
	remaining := list(client)
	require.Len(t, remaining, 1)
	require.Equal(t, "/"+bucket+"/"+key+"-neighbor", remaining[0].URL.Path)

	denied := clientFor(key+"-neighbor", &models.Principal{STSAccessKeyID: "invalid-mc-test-user", STSSecretAccessKey: "invalid-mc-test-secret"})
	_, perr = denied.get(ctx, mc.GetOptions{})
	require.NotNil(t, perr, "S3 authentication errors must reach Console")
	require.Error(t, deleteObjects(ctx, denied, bucket, key+"-neighbor", "", true, true, false, false))
	require.Len(t, list(client), 1, "a failed listing must not become a deletion")

	t.Run("watch", func(t *testing.T) {
		watchCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		watcher, perr := client.watch(watchCtx, mc.WatchOptions{Events: []string{"put"}, Prefix: "watch/"})
		require.Nil(t, perr)
		defer func() {
			close(watcher.DoneChan)
			cancel()
			// Drain both outputs so cancellation also releases an in-flight send.
			events, errors := watcher.EventInfoChan, watcher.ErrorChan
			timer := time.NewTimer(5 * time.Second)
			defer timer.Stop()
			for events != nil || errors != nil {
				select {
				case _, ok := <-events:
					if !ok {
						events = nil
					}
				case _, ok := <-errors:
					if !ok {
						errors = nil
					}
				case <-timer.C:
					t.Fatal("MC watch did not stop after cancellation")
				}
			}
		}()
		// Watch opens its stream asynchronously; repeat a disposable write until
		// the server acknowledges it through the real MC notification channel.
		ticker := time.NewTicker(100 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				_, err := root.PutObject(watchCtx, bucket, "watch/event", strings.NewReader("event body"), 10, minio.PutObjectOptions{})
				require.NoError(t, err)
			case events, ok := <-watcher.EventInfoChan:
				require.True(t, ok, "watch closed before delivering an event")
				for _, event := range events {
					if strings.HasSuffix(event.Path, "/watch/event") {
						return
					}
				}
			case perr := <-watcher.ErrorChan:
				t.Fatalf("watch failed: %v", perr)
			case <-watchCtx.Done():
				t.Fatal("watch did not deliver the fixture event")
			}
		}
	})
}
