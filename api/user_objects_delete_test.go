// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"errors"
	"reflect"
	"testing"
	"time"

	mc "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
)

func TestDeleteVersionScope(t *testing.T) {
	for _, key := range []string{"a", "report", "dir/a", "中文 +#%2F?\\x", "/leading", "dot/../a", "folder/", ""} {
		for _, noncurrent := range []bool{false, true} {
			t.Run(key+map[bool]string{false: "/all", true: "/noncurrent"}[noncurrent], func(t *testing.T) {
				paths := []string{"/bucket/" + key, "/bucket/" + key + "a", "/bucket/" + key + "-child", "/bucket/other/" + key, "/other/" + key}
				var removed, want []string
				for i, path := range paths {
					matches := i == 0 || (key == "folder/" && i < 3) || (key == "" && i < 4)
					if matches {
						want = append(want, path+"@old", path+"@marker")
						if !noncurrent {
							want = append(want, path+"@latest")
						}
					}
				}
				client := s3ClientMock{
					listFunc: func(_ context.Context, opts mc.ListOptions) <-chan *mc.ClientContent {
						if !opts.WithOlderVersions || !opts.WithDeleteMarkers || !opts.Recursive {
							t.Errorf("incomplete version listing options: %+v", opts)
						}
						ch := make(chan *mc.ClientContent, len(paths)*3)
						for _, path := range paths {
							for _, version := range []string{"old", "marker", "latest"} {
								ch <- &mc.ClientContent{URL: mc.ClientURL{Path: path}, VersionID: version, IsLatest: version == "latest", IsDeleteMarker: version == "marker"}
							}
						}
						close(ch)
						return ch
					},
					removeFunc: func(_ context.Context, incomplete, bucket, bypass, force bool, items <-chan *mc.ClientContent) <-chan mc.RemoveResult {
						if incomplete || bucket || !bypass || force {
							t.Errorf("unexpected remove options")
						}
						ch := make(chan mc.RemoveResult)
						go func() {
							defer close(ch)
							for item := range items {
								removed = append(removed, item.URL.Path+"@"+item.VersionID)
							}
						}()
						return ch
					},
				}
				if err := deleteObjects(context.Background(), client, "bucket", key, "", true, !noncurrent, noncurrent, true); err != nil {
					t.Fatal(err)
				}
				if !reflect.DeepEqual(removed, want) {
					t.Fatalf("removed %q; want %q", removed, want)
				}
			})
		}
	}
}

func TestDeleteListingFailure(t *testing.T) {
	sentinel := errors.New("listing denied")
	for _, noncurrent := range []bool{false, true} {
		client := s3ClientMock{
			listFunc: func(context.Context, mc.ListOptions) <-chan *mc.ClientContent {
				ch := make(chan *mc.ClientContent, 1)
				ch <- &mc.ClientContent{Err: probe.NewError(sentinel)}
				close(ch)
				return ch
			},
			removeFunc: func(ctx context.Context, _, _, _, _ bool, items <-chan *mc.ClientContent) <-chan mc.RemoveResult {
				ch := make(chan mc.RemoveResult)
				go func() {
					defer close(ch)
					for range items {
						t.Error("listing failure must not become a removal")
					}
					ch <- mc.RemoveResult{Err: probe.NewError(ctx.Err())}
				}()
				return ch
			},
		}
		if err := deleteObjects(context.Background(), client, "bucket", "dir/", "", true, false, noncurrent, false); !errors.Is(err, sentinel) {
			t.Fatalf("want listing error, got %v", err)
		}
	}
}

func TestDeleteCancellationDrainsWorkers(t *testing.T) {
	for _, failRemoval := range []bool{false, true} {
		t.Run(map[bool]string{false: "caller canceled", true: "removal failed"}[failRemoval], func(t *testing.T) {
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			listStopped, removeStopped := make(chan struct{}), make(chan struct{})
			release := make(chan struct{})
			defer close(release) // Release the mock if the regression leaves it blocked.
			sentinel := errors.New("remove denied")
			client := s3ClientMock{
				listFunc: func(ctx context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
					ch := make(chan *mc.ClientContent)
					go func() {
						defer close(ch)
						defer close(listStopped)
						<-ctx.Done()
						// MC's non-versioned recursive lister may send pending
						// objects and its final error without checking ctx again.
						for _, item := range []*mc.ClientContent{
							{URL: mc.ClientURL{Path: "/bucket/dir/a"}},
							{URL: mc.ClientURL{Path: "/bucket/dir/b"}},
							{Err: probe.NewError(ctx.Err())},
						} {
							select {
							case ch <- item:
							case <-release:
								return
							}
						}
					}()
					return ch
				},
				removeFunc: func(ctx context.Context, _, _, _, _ bool, _ <-chan *mc.ClientContent) <-chan mc.RemoveResult {
					ch := make(chan mc.RemoveResult)
					go func() {
						defer close(ch)
						defer close(removeStopped)
						if failRemoval {
							ch <- mc.RemoveResult{Err: probe.NewError(sentinel)}
						} else {
							cancel()
						}
						<-ctx.Done()
						ch <- mc.RemoveResult{Err: probe.NewError(ctx.Err())}
					}()
					return ch
				},
			}
			done := make(chan error, 1)
			go func() { done <- deleteObjects(ctx, client, "bucket", "dir/", "", true, false, false, false) }()
			want := context.Canceled
			if failRemoval {
				want = sentinel
			}
			select {
			case err := <-done:
				if !errors.Is(err, want) {
					t.Fatalf("got %v; want %v", err, want)
				}
			case <-time.After(5 * time.Second):
				t.Fatal("deletion did not stop")
			}
			for _, stopped := range []chan struct{}{listStopped, removeStopped} {
				select {
				case <-stopped:
				case <-time.After(time.Second):
					t.Fatal("worker did not exit")
				}
			}
		})
	}
}
