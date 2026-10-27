//go:build integration && storageintegration

// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
	madmin "github.com/minio/madmin-go/v3"
	"github.com/minio/minio-go/v7"
)

func nativeStorage(t *testing.T) (Config, *minio.Client, *madmin.AdminClient) {
	t.Helper()
	endpoint, access, secret := os.Getenv("TEST_USAGE_S3_ENDPOINT"), os.Getenv("TEST_USAGE_S3_ACCESS_KEY"), os.Getenv("TEST_USAGE_S3_SECRET_KEY")
	if endpoint == "" || access == "" || secret == "" {
		t.Fatal("storage integration requires TEST_USAGE_S3_ENDPOINT, TEST_USAGE_S3_ACCESS_KEY and TEST_USAGE_S3_SECRET_KEY for a disposable SILO instance")
	}
	config, err := ParseConfig(map[string]string{"CONSOLE_USAGE_DATABASE_URL": os.Getenv("TEST_USAGE_DATABASE_URL"), "CONSOLE_MINIO_SERVER": endpoint, "CONSOLE_USAGE_S3_ACCESS_KEY": access, "CONSOLE_USAGE_S3_SECRET_KEY": secret}, true)
	if err != nil {
		t.Fatal(err)
	}
	root, err := config.NewS3Client()
	if err != nil {
		t.Fatal(err)
	}
	u, _ := url.Parse(endpoint)
	admin, err := madmin.New(u.Host, access, secret, u.Scheme == "https")
	if err != nil {
		t.Fatal(err)
	}
	return config, root, admin
}
func nativeBucket(t *testing.T, root *minio.Client, versioned bool) string {
	t.Helper()
	bucket := "usage-fixture-" + strings.ReplaceAll(uuid.NewString(), "-", "")[:12]
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	if err := root.MakeBucket(ctx, bucket, minio.MakeBucketOptions{}); err != nil {
		t.Fatal(err)
	}
	if versioned {
		if err := root.SetBucketVersioning(ctx, bucket, minio.BucketVersioningConfiguration{Status: "Enabled"}); err != nil {
			t.Fatal(err)
		}
	}
	t.Cleanup(func() {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
		defer cancel()
		var objects []minio.ObjectInfo
		for object := range root.ListObjects(ctx, bucket, minio.ListObjectsOptions{Recursive: true, WithVersions: true}) {
			if object.Err != nil {
				t.Error("fixture version listing failed")
				return
			}
			objects = append(objects, object)
		}
		for _, object := range objects {
			if err := root.RemoveObject(ctx, bucket, object.Key, minio.RemoveObjectOptions{VersionID: object.VersionID}); err != nil {
				t.Error("fixture version cleanup failed")
				return
			}
		}
		if err := root.RemoveBucket(ctx, bucket); err != nil {
			t.Error("fixture bucket cleanup failed")
		}
	})
	return bucket
}
func metadataIdentity(t *testing.T, c Config, admin *madmin.AdminClient) Config {
	t.Helper()
	key := "usage-" + strings.ReplaceAll(uuid.NewString(), "-", "")[:12]
	secret := strings.ReplaceAll(uuid.NewString()+uuid.NewString(), "-", "")[:40]
	policy := key + "-metadata"
	document := []byte(`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:ListAllMyBuckets","s3:ListenNotification"],"Resource":["*"]},{"Effect":"Allow","Action":["s3:GetBucketLocation","s3:ListBucket","s3:ListBucketVersions","s3:ListenBucketNotification"],"Resource":["arn:aws:s3:::*"]}]}`)
	ctx := context.Background()
	if err := admin.AddCannedPolicy(ctx, policy, document); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		if err := admin.RemoveCannedPolicy(context.Background(), policy); err != nil {
			t.Error("fixture metadata policy cleanup failed")
		}
	})
	if err := admin.AddUser(ctx, key, secret); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		if err := admin.RemoveUser(context.Background(), key); err != nil {
			t.Error("fixture metadata identity cleanup failed")
		}
	})
	if _, err := admin.AttachPolicy(ctx, madmin.PolicyAssociationReq{Policies: []string{policy}, User: key}); err != nil {
		t.Fatal(err)
	}
	c.AccessKey = key
	c.SecretKey = secret
	c.SessionToken = ""
	return c
}
func awaitNative(t *testing.T, description string, check func() bool) {
	t.Helper()
	deadline := time.Now().Add(40 * time.Second)
	for time.Now().Before(deadline) {
		if check() {
			return
		}
		time.Sleep(50 * time.Millisecond)
	}
	t.Fatal("timed out waiting for " + description)
}
func putNative(t *testing.T, root *minio.Client, bucket, key string, size int) minio.UploadInfo {
	t.Helper()
	info, err := root.PutObject(context.Background(), bucket, key, bytes.NewReader(make([]byte, size)), int64(size), minio.PutObjectOptions{})
	if err != nil {
		t.Fatal(err)
	}
	return info
}
func TestNativeWorkerObservesChangesAndRecoversMissedEventsWithMetadataOnlyCredentials(t *testing.T) {
	c, root, admin := nativeStorage(t)
	bucket := nativeBucket(t, root, true)
	empty := nativeBucket(t, root, false)
	first := putNative(t, root, bucket, "parcel-metadata", 5)
	c = metadataIdentity(t, c, admin)
	c.HTTPAddress = "127.0.0.1:0"
	c.Heartbeat = 100 * time.Millisecond
	c.Lease = 2 * time.Second
	c.ProgressInterval = 100 * time.Millisecond
	c.PollInterval = 100 * time.Millisecond
	c.EventDebounce = 0
	c.MinScanInterval = 0
	c.RetryInterval = 100 * time.Millisecond
	c.ReconcileInterval = time.Minute
	store, err := OpenStore(context.Background(), c.DatabaseURL, c.Endpoint, 4)
	if err != nil {
		t.Fatal(err)
	}
	if err = store.Migrate(context.Background()); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		store.pool.Exec(context.Background(), `DELETE FROM console_usage_buckets WHERE scope=$1`, store.scope)
		store.pool.Exec(context.Background(), `DELETE FROM console_usage_coverage WHERE scope=$1`, store.scope)
		store.Close()
	})
	start := func() func() {
		ctx, cancel := context.WithCancel(context.Background())
		done := make(chan error, 1)
		go func() { done <- RunWorker(ctx, c) }()
		var once sync.Once
		stop := func() {
			once.Do(func() {
				cancel()
				select {
				case err := <-done:
					if err != nil {
						t.Error(err)
					}
				case <-time.After(35 * time.Second):
					t.Error("worker did not release its change stream and leases")
				}
			})
		}
		t.Cleanup(stop)
		return stop
	}
	stop := start()
	awaitNative(t, "live reconciled event coverage", func() bool { h, err := store.WorkerHealth(context.Background()); return err == nil && h.Ready })
	expect := func(current, retained string, objects, versions, markers int64) {
		t.Helper()
		awaitNative(t, "fresh usage observation", func() bool {
			r, err := store.Get(context.Background(), bucket)
			return err == nil && r.State == "complete" && r.LastGood != nil && r.LastGood.Totals == (Stats{CurrentBytes: current, RetainedBytes: retained, CurrentObjects: objects, RetainedVersions: versions, DeleteMarkers: markers})
		})
	}
	expect("5", "0", 1, 0, 0)
	awaitNative(t, "known empty bucket", func() bool {
		r, err := store.Get(context.Background(), empty)
		return err == nil && r.State == "complete" && r.LastGood != nil && r.LastGood.ScannedEntries == 0 && r.LastGood.Totals.CurrentBytes == "0"
	})
	putNative(t, root, bucket, "parcel-metadata", 7)
	expect("7", "5", 1, 1, 0)
	if err = root.RemoveObject(context.Background(), bucket, "parcel-metadata", minio.RemoveObjectOptions{}); err != nil {
		t.Fatal(err)
	}
	expect("0", "12", 0, 2, 1)
	if err = root.RemoveObject(context.Background(), bucket, "parcel-metadata", minio.RemoveObjectOptions{VersionID: first.VersionID}); err != nil {
		t.Fatal(err)
	}
	expect("0", "7", 0, 1, 1)
	readonly, err := c.NewS3Client()
	if err != nil {
		t.Fatal(err)
	}
	if _, err = readonly.PutObject(context.Background(), bucket, "must-not-write", bytes.NewReader([]byte("blocked")), 7, minio.PutObjectOptions{}); minio.ToErrorResponse(err).Code != "AccessDenied" {
		t.Fatalf("metadata worker can write content: %v", err)
	}
	// A current object makes the content-read denial independent of a 404.
	putNative(t, root, bucket, "content-denial", 3)
	reader, err := readonly.GetObject(context.Background(), bucket, "content-denial", minio.GetObjectOptions{})
	if err == nil {
		_, err = reader.Read(make([]byte, 1))
		reader.Close()
	}
	if minio.ToErrorResponse(err).Code != "AccessDenied" {
		t.Fatalf("metadata worker can read content: %v", err)
	}
	stop()
	coverage, err := store.Coverage(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if coverage.ObserverAlive || coverage.Connected {
		t.Fatal("stopped worker leaves false event coverage")
	}
	// This write occurs with no event subscriber. Startup reconciliation must
	// recover it without a preserved live event or the slow server scanner.
	putNative(t, root, bucket, "parcel-metadata", 9)
	start()
	expect("12", "7", 2, 1, 1)
}
func TestNativeVersionPaginationCanResumeAfterAWholeKey(t *testing.T) {
	c, root, _ := nativeStorage(t)
	bucket := nativeBucket(t, root, true)
	const versions = 1003
	for offset := 0; offset < versions; offset += 20 {
		var group sync.WaitGroup
		failures := make(chan error, 20)
		for i := 0; i < min(20, versions-offset); i++ {
			group.Add(1)
			go func() {
				defer group.Done()
				_, err := root.PutObject(context.Background(), bucket, "a-many-versions", bytes.NewReader([]byte("x")), 1, minio.PutObjectOptions{})
				if err != nil {
					failures <- err
				}
			}()
		}
		group.Wait()
		close(failures)
		for err := range failures {
			t.Fatal(err)
		}
	}
	putNative(t, root, bucket, "b-next", 7)
	store, err := OpenStore(context.Background(), c.DatabaseURL, c.Endpoint, 4)
	if err != nil {
		t.Fatal(err)
	}
	if err = store.Migrate(context.Background()); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() {
		store.pool.Exec(context.Background(), `DELETE FROM console_usage_buckets WHERE scope=$1 AND bucket=$2`, store.scope, bucket)
		store.Close()
	})
	ctx := context.Background()
	if err = store.Queue(ctx, bucket, true, 0, 0, nil); err != nil {
		t.Fatal(err)
	}
	job, err := store.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	c.ScanSlice = time.Nanosecond
	if err = store.RunSlice(ctx, root, job, c); err != nil {
		t.Fatal(err)
	}
	next, err := store.Claim(ctx, time.Minute)
	if err != nil {
		t.Fatal(err)
	}
	if next.Checkpoint == nil || next.Checkpoint.LastKey != "a-many-versions" || next.Checkpoint.Snapshot.ScannedEntries != versions {
		t.Fatalf("paginated version group was split: %+v", next.Checkpoint)
	}
	if err = store.RunSlice(ctx, root, next, c); err != nil {
		t.Fatal(err)
	}
	saved, err := store.Get(ctx, bucket)
	if err != nil {
		t.Fatal(err)
	}
	if saved.State != "complete" || saved.LastGood == nil || saved.LastGood.Totals.CurrentBytes != "8" || saved.LastGood.Totals.RetainedBytes != fmt.Sprint(versions-1) || saved.LastGood.ScannedEntries != versions+1 {
		body, _ := json.Marshal(saved)
		t.Fatalf("native cursor skipped versions: %s", body)
	}
}
