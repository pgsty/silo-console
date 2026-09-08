// Copyright (c) 2026 Pigsty
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	mc "github.com/minio/mc/cmd"
	minio "github.com/minio/minio-go/v7"
	"github.com/minio/websocket"

	"github.com/minio/console/models"
)

// numberedKeys returns n sorted keys k000000 .. k(n-1).
func numberedKeys(n int) []string {
	keys := make([]string, n)
	for i := range keys {
		keys[i] = fmt.Sprintf("k%06d", i)
	}
	return keys
}

func pageNames(page []ObjectResponse) []string {
	names := make([]string, 0, len(page))
	for _, item := range page {
		names = append(names, item.Name)
	}
	return names
}

func joined(names []string) string { return strings.Join(names, ",") }

// collectPage reads frames for id until request_end and returns the names
// with the end frame.
func collectPage(t *testing.T, conn *websocket.Conn, id int64) ([]string, WSResponse) {
	t.Helper()
	var names []string
	for {
		response, err := readFrame(t, conn, 10*time.Second)
		if err != nil {
			t.Fatalf("page %d: %v", id, err)
		}
		if response.RequestID != id {
			continue
		}
		if response.Error != nil {
			t.Fatalf("page %d failed: %+v", id, response.Error)
		}
		for _, item := range response.Data {
			names = append(names, item.Name)
		}
		if response.RequestEnd {
			return names, response
		}
	}
}

func setTunable[T any](t *testing.T, target *T, value T) {
	t.Helper()
	previous := *target
	*target = value
	t.Cleanup(func() { *target = previous })
}

func TestListObjectPageIsBounded(t *testing.T) {
	ctx := context.Background()

	t.Run("the default page costs one call of 100 keys", func(t *testing.T) {
		recorder := &listingRecorder{items: numberedKeys(100000)}
		page, next, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b"})
		if err != nil || len(page) != 100 || next != "k000099" {
			t.Fatalf("page=%d next=%q err=%v", len(page), next, err)
		}
		if calls := recorder.pageCalls(); len(calls) != 1 || calls[0] != (pageCall{maxKeys: 100}) {
			t.Fatalf("calls = %+v", calls)
		}
	})

	t.Run("the largest page is one call of 1000 keys", func(t *testing.T) {
		recorder := &listingRecorder{items: numberedKeys(1500)}
		page, next, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b", PageSize: 1000})
		if err != nil || len(page) != 1000 || next != "k000999" {
			t.Fatalf("page=%d next=%q err=%v", len(page), next, err)
		}
		if calls := recorder.pageCalls(); len(calls) != 1 || calls[0].maxKeys != 1000 {
			t.Fatalf("calls = %+v", calls)
		}
		if page[0].Name != "k000000" || page[999].Name != "k000999" {
			t.Fatalf("page spans %s..%s", page[0].Name, page[999].Name)
		}

		// The remainder of the directory is the next page, in one more call
		// that continues from the native token, never from a displayed name.
		page, next, err = listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b", PageSize: 1000, ContinuationToken: next})
		if err != nil || len(page) != 500 || next != "" {
			t.Fatalf("second page=%d next=%q err=%v", len(page), next, err)
		}
		if calls := recorder.pageCalls(); len(calls) != 2 || calls[1].token != "k000999" || calls[1].startAfter != "" || calls[1].maxKeys != 1000 {
			t.Fatalf("calls = %+v", calls)
		}
	})

	t.Run("a page size outside the protocol range still costs one call", func(t *testing.T) {
		// The protocol rejects such sizes before a listing starts; the helper
		// clamps them so that no caller can turn one page into several calls.
		for size, want := range map[int]int{5000: objectPageMaxSize, 0: objectPageDefaultSize, -3: objectPageDefaultSize} {
			recorder := &listingRecorder{items: numberedKeys(6000)}
			page, _, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b", PageSize: size})
			if err != nil || len(page) != want || recorder.calls() != 1 || recorder.pageCalls()[0].maxKeys != want {
				t.Fatalf("size %d: page=%d calls=%+v err=%v", size, len(page), recorder.pageCalls(), err)
			}
		}
	})

	t.Run("a short response yields a short page, not an extra call", func(t *testing.T) {
		// The server answers the first call with two entries although three
		// were asked for; the page is shown short and the next page resumes
		// from the server's token. Files and prefixes interleave in key
		// order and no entry is skipped or repeated.
		directory := []string{"a/1", "b", "c/1", "d", "e", "f/1", "g"}
		recorder := &listingRecorder{items: directory, caps: []int{2}}
		opts := &objectsListOpts{BucketName: "b", PageSize: 3}

		page, next, err := listObjectPage(ctx, recorder, opts)
		if err != nil || joined(pageNames(page)) != "a/,b" || next != "b" || recorder.calls() != 1 {
			t.Fatalf("page 1 = %v next=%q calls=%d err=%v", pageNames(page), next, recorder.calls(), err)
		}
		opts.ContinuationToken = next
		page, next, err = listObjectPage(ctx, recorder, opts)
		if err != nil || joined(pageNames(page)) != "c/,d,e" || next != "e" {
			t.Fatalf("page 2 = %v next=%q err=%v", pageNames(page), next, err)
		}
		opts.ContinuationToken = next
		page, next, err = listObjectPage(ctx, recorder, opts)
		if err != nil || joined(pageNames(page)) != "f/,g" || next != "" {
			t.Fatalf("page 3 = %v next=%q err=%v", pageNames(page), next, err)
		}
		calls := recorder.pageCalls()
		if len(calls) != 3 || calls[1].startAfter != "" || calls[1].token != "b" || calls[2].token != "e" {
			t.Fatalf("calls = %+v", calls)
		}
		for _, call := range calls {
			if call.maxKeys != 3 {
				t.Fatalf("call asked for %d keys, want the page size", call.maxKeys)
			}
		}
	})

	t.Run("prefixes carry no size and the zero time", func(t *testing.T) {
		recorder := &listingRecorder{items: []string{"a/x", "b", "c/y", "d"}}
		page, _, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b"})
		if err != nil || joined(pageNames(page)) != "a/,b,c/,d" {
			t.Fatalf("page = %v err=%v", pageNames(page), err)
		}
		if page[0].Size != 0 || page[0].LastModified != "0001-01-01T00:00:00Z" || page[1].Size != 1 {
			t.Fatalf("entries = %+v", page[:2])
		}
	})

	t.Run("the prefix's own marker is never listed", func(t *testing.T) {
		directory := []string{"docs/", "docs/a", "docs/b/c", "other"}
		recorder := &listingRecorder{items: directory}
		page, next, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b", Prefix: "docs/"})
		if err != nil || joined(pageNames(page)) != "docs/a,docs/b/" || next != "" {
			t.Fatalf("page = %v next=%q err=%v", pageNames(page), next, err)
		}
		if calls := recorder.pageCalls(); calls[0].startAfter != "docs/" || calls[0].prefix != "docs/" {
			t.Fatalf("first call = %+v, want StartAfter set to the prefix", calls[0])
		}

		// A server that ignores StartAfter returns the marker; it is dropped.
		ignoring := &listingRecorder{items: directory, ignoreStartAfter: true}
		page, _, err = listObjectPage(ctx, ignoring, &objectsListOpts{BucketName: "b", Prefix: "docs/"})
		if err != nil || joined(pageNames(page)) != "docs/a,docs/b/" {
			t.Fatalf("page = %v err=%v", pageNames(page), err)
		}
	})

	t.Run("an empty directory completes in one call", func(t *testing.T) {
		recorder := &listingRecorder{}
		page, next, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b", Prefix: "empty/"})
		if err != nil || len(page) != 0 || next != "" || recorder.calls() != 1 {
			t.Fatalf("page=%d next=%q calls=%d err=%v", len(page), next, recorder.calls(), err)
		}
	})

	t.Run("a failing call fails the page without partial data", func(t *testing.T) {
		recorder := &listingRecorder{items: numberedKeys(2000), err: errors.New("boom")}
		page, next, err := listObjectPage(ctx, recorder, &objectsListOpts{BucketName: "b", PageSize: 1000})
		if err == nil || page != nil || next != "" || recorder.calls() != 1 {
			t.Fatalf("page=%d next=%q calls=%d err=%v", len(page), next, recorder.calls(), err)
		}
	})

	t.Run("a truncated response without a token is an error", func(t *testing.T) {
		lister := listerFunc(func(context.Context, string, string, string, string, int) (minio.ListBucketV2Result, error) {
			return minio.ListBucketV2Result{IsTruncated: true, Contents: []minio.ObjectInfo{{Key: "a"}}}, nil
		})
		if _, _, err := listObjectPage(ctx, lister, &objectsListOpts{BucketName: "b"}); err == nil {
			t.Fatal("expected an error")
		}
	})
}

type listerFunc func(ctx context.Context, bucket, prefix, startAfter, token string, maxKeys int) (minio.ListBucketV2Result, error)

func (f listerFunc) listPage(ctx context.Context, bucket, prefix, startAfter, token string, maxKeys int) (minio.ListBucketV2Result, error) {
	return f(ctx, bucket, prefix, startAfter, token, maxKeys)
}

func TestValidContinuationToken(t *testing.T) {
	for token, want := range map[string]bool{
		"":                          true,
		"YS50eHQ=":                  true,
		"docs/some key+with%20odd&": true,
		"中文":                        true,
		"a\nb":                      false,
		"a\x7fb":                    false,
		"\xff":                      false,
		strings.Repeat("t", wsMaxContinuationTokenLength):   true,
		strings.Repeat("t", wsMaxContinuationTokenLength+1): false,
	} {
		if got := validContinuationToken(token); got != want {
			t.Errorf("validContinuationToken(%q) = %v, want %v", token, got, want)
		}
	}
}

// ---- the production lister against a fake S3 endpoint ----------------------

func TestObjectPageListerRunsOnTheListingContext(t *testing.T) {
	s3 := fakeS3(t)
	t.Setenv(ConsoleMinIOServer, s3.URL)
	s3.keys = []string{"100%.txt", "a.txt", "amp&ersand.txt", "docs/b.txt", "docs/c.txt", "plus+sign.txt", "sp ace.txt", "z/", "中文.txt"}
	newLister := func(ctx context.Context) objectPageLister {
		t.Helper()
		lister, err := newObjectPageLister(ctx, nil, "203.0.113.9", "us-east-1")
		if err != nil {
			t.Fatal(err)
		}
		return lister
	}

	t.Run("pages, tokens and names travel intact", func(t *testing.T) {
		ctx := context.Background()
		lister := newLister(ctx)
		opts := &objectsListOpts{BucketName: "public", PageSize: 3}
		var pages []string
		for {
			page, next, err := listObjectPage(ctx, lister, opts)
			if err != nil {
				t.Fatal(err)
			}
			pages = append(pages, joined(pageNames(page)))
			if next == "" {
				break
			}
			opts.ContinuationToken = next
		}
		if want := []string{"100%.txt,a.txt,amp&ersand.txt", "docs/,plus+sign.txt,sp ace.txt", "z/,中文.txt"}; fmt.Sprint(pages) != fmt.Sprint(want) {
			t.Fatalf("pages = %q, want %q", pages, want)
		}
		calls := s3.listCalls()
		if len(calls) != 3 || calls[0].maxKeys != 3 || calls[1].token != "amp&ersand.txt" || calls[2].token != "sp ace.txt" || calls[1].startAfter != "" {
			t.Fatalf("calls = %+v", calls)
		}
		// The region is injected, so the page client asks for no location.
		if s3.locations.Load() != 0 {
			t.Fatalf("page client issued %d location requests", s3.locations.Load())
		}
		for _, agent := range s3.userAgents() {
			if !strings.Contains(agent, "MinIO Console") {
				t.Fatalf("user agent %q lacks the Console App Info", agent)
			}
		}
	})

	t.Run("a sub-prefix page starts after its own marker", func(t *testing.T) {
		ctx := context.Background()
		page, next, err := listObjectPage(ctx, newLister(ctx), &objectsListOpts{BucketName: "public", Prefix: "docs/", PageSize: 100})
		if err != nil || joined(pageNames(page)) != "docs/b.txt,docs/c.txt" || next != "" {
			t.Fatalf("page = %v next=%q err=%v", pageNames(page), next, err)
		}
		calls := s3.listCalls()
		if last := calls[len(calls)-1]; last.prefix != "docs/" || last.startAfter != "docs/" || last.maxKeys != 100 {
			t.Fatalf("last call = %+v", last)
		}
	})

	t.Run("a canceled context returns before any request", func(t *testing.T) {
		ctx, cancel := context.WithCancel(context.Background())
		cancel()
		before := len(s3.listCalls())
		_, err := newLister(ctx).listPage(ctx, "public", "", "", "", 100)
		if !errors.Is(err, context.Canceled) || len(s3.listCalls()) != before {
			t.Fatalf("err=%v calls=%d (before %d)", err, len(s3.listCalls()), before)
		}
	})

	t.Run("cancellation interrupts a request in flight", func(t *testing.T) {
		s3.mu.Lock()
		s3.block = make(chan struct{})
		s3.mu.Unlock()
		t.Cleanup(func() {
			s3.mu.Lock()
			s3.block = nil
			s3.mu.Unlock()
		})
		ctx, cancel := context.WithCancel(context.Background())
		lister := newLister(ctx)
		time.AfterFunc(50*time.Millisecond, cancel)
		started := time.Now()
		_, err := lister.listPage(ctx, "public", "", "", "", 100)
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("err = %v, want a canceled context", err)
		}
		if elapsed := time.Since(started); elapsed > 3*time.Second {
			t.Fatalf("cancellation took %v", elapsed)
		}
	})

	t.Run("the deadline interrupts a request in flight", func(t *testing.T) {
		s3.mu.Lock()
		s3.block = make(chan struct{})
		s3.mu.Unlock()
		t.Cleanup(func() {
			s3.mu.Lock()
			s3.block = nil
			s3.mu.Unlock()
		})
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
		defer cancel()
		started := time.Now()
		_, err := newLister(ctx).listPage(ctx, "public", "", "", "", 100)
		if !errors.Is(err, context.DeadlineExceeded) {
			t.Fatalf("err = %v, want an exceeded deadline", err)
		}
		if elapsed := time.Since(started); elapsed > 3*time.Second {
			t.Fatalf("deadline took %v", elapsed)
		}
	})
}

// The whole production path: serveWS, the session, the request-local page
// client and a fake S3 endpoint, anonymously.
func TestObjectManagerPagesThroughTheProductionStack(t *testing.T) {
	s3 := fakeS3(t)
	t.Setenv(ConsoleMinIOServer, s3.URL)
	s3.keys = []string{"a.txt", "b.txt", "docs/c.txt", "docs/d.txt", "e.txt"}
	conn := dialWS(t, serveWSServer(t)+"/ws/objectManager", nil)

	sendJSON(t, conn, ObjectsRequest{Mode: "objects", BucketName: "public", RequestID: 1, PageSize: 2})
	names, end := collectPage(t, conn, 1)
	if joined(names) != "a.txt,b.txt" || end.NextContinuationToken == "" {
		t.Fatalf("page 1 = %v end=%+v", names, end)
	}
	sendJSON(t, conn, ObjectsRequest{Mode: "objects", BucketName: "public", RequestID: 2, PageSize: 2, ContinuationToken: end.NextContinuationToken})
	names, end = collectPage(t, conn, 2)
	if joined(names) != "docs/,e.txt" || end.NextContinuationToken != "" {
		t.Fatalf("page 2 = %v end=%+v", names, end)
	}
	calls := s3.listCalls()
	if len(calls) != 2 || calls[0].maxKeys != 2 || calls[1].maxKeys != 2 || calls[1].token != "b.txt" {
		t.Fatalf("calls = %+v", calls)
	}
	// The session client resolves the region once; page clients never do.
	if s3.locations.Load() != 1 {
		t.Fatalf("location requests = %d, want 1", s3.locations.Load())
	}
}

// ---- pages over a session ---------------------------------------------------

func TestObjectManagerServesBoundedPages(t *testing.T) {
	recorder := &listingRecorder{items: []string{"a/1", "b", "c/1", "d", "e", "f/1", "g"}, caps: []int{2}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)

	page := func(id int64, token string) ([]string, WSResponse) {
		sendJSON(t, conn, ObjectsRequest{Mode: "objects", BucketName: "public", RequestID: id, PageSize: 3, ContinuationToken: token})
		return collectPage(t, conn, id)
	}
	names, end := page(1, "")
	if joined(names) != "a/,b" || end.NextContinuationToken != "b" || end.Truncated {
		t.Fatalf("page 1 = %v end=%+v", names, end)
	}
	names, end = page(2, end.NextContinuationToken)
	if joined(names) != "c/,d,e" || end.NextContinuationToken != "e" {
		t.Fatalf("page 2 = %v end=%+v", names, end)
	}
	names, end = page(3, end.NextContinuationToken)
	if joined(names) != "f/,g" || end.NextContinuationToken != "" {
		t.Fatalf("page 3 = %v end=%+v", names, end)
	}
	calls := recorder.pageCalls()
	if len(calls) != 3 || calls[0].maxKeys != 3 || calls[1].token != "b" || calls[2].token != "e" {
		t.Fatalf("calls = %+v", calls)
	}

	// An omitted page_size selects the default.
	sendJSON(t, conn, objectsRequest(4, "public"))
	if names, _ = collectPage(t, conn, 4); len(names) != 7 {
		t.Fatalf("default page = %v", names)
	}
	if calls = recorder.pageCalls(); calls[3].maxKeys != objectPageDefaultSize {
		t.Fatalf("default call = %+v", calls[3])
	}
}

func TestObjectManagerRejectsInvalidPageOptionsWithoutAllocating(t *testing.T) {
	recorder := &listingRecorder{items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)
	session := srv.session(t)

	for _, tt := range []struct {
		id      int64
		payload map[string]interface{}
		detail  errWSProtocol
	}{
		{1, map[string]interface{}{"page_size": -1}, errWSPageSize},
		{2, map[string]interface{}{"page_size": objectPageMaxSize + 1}, errWSPageSize},
		{3, map[string]interface{}{"continuation_token": "bad\ntoken"}, errWSContinuationTkn},
		{4, map[string]interface{}{"continuation_token": strings.Repeat("t", wsMaxContinuationTokenLength+1)}, errWSContinuationTkn},
		// The former 5000 limit is an oversized page like any other.
		{6, map[string]interface{}{"page_size": 5000}, errWSPageSize},
	} {
		tt.payload["mode"], tt.payload["bucket_name"], tt.payload["request_id"] = "objects", "public", tt.id
		sendJSON(t, conn, tt.payload)
		if response := expectErrorFrame(t, conn, tt.id, http.StatusBadRequest); response.Error.APIError.DetailedMessage != string(tt.detail) {
			t.Fatalf("request %d: detail = %q, want %q", tt.id, response.Error.APIError.DetailedMessage, tt.detail)
		}
	}
	if session.inflight() != 0 || recorder.calls() != 0 {
		t.Fatalf("invalid page options allocated state: inflight=%d calls=%d", session.inflight(), recorder.calls())
	}

	// The boundaries are accepted, and the largest page is still one call.
	sendJSON(t, conn, ObjectsRequest{Mode: "objects", BucketName: "public", RequestID: 5, PageSize: objectPageMaxSize, ContinuationToken: "YS50eHQ="})
	if names, _ := collectPage(t, conn, 5); joined(names) != "a.txt" {
		t.Fatalf("names = %v", names)
	}
	if calls := recorder.pageCalls(); len(calls) != 1 || calls[0].maxKeys != objectPageMaxSize || calls[0].token != "YS50eHQ=" {
		t.Fatalf("calls = %+v", calls)
	}
}

func TestObjectManagerPageTimeoutCoversRegionLookup(t *testing.T) {
	previous := wsObjectPageTimeout.get()
	wsObjectPageTimeout.set(100 * time.Millisecond)
	t.Cleanup(func() { wsObjectPageTimeout.set(previous) })
	// The region lookup waits for its context, as a stalled location request
	// does, until the test lets it answer.
	var answer atomic.Bool
	var lookups atomic.Int32
	previousLookup := minioGetBucketLocationMock
	minioGetBucketLocationMock = func(ctx context.Context, _ string) (string, error) {
		lookups.Add(1)
		if answer.Load() {
			return "us-east-1", nil
		}
		<-ctx.Done()
		return "", ctx.Err()
	}
	t.Cleanup(func() { minioGetBucketLocationMock = previousLookup })
	recorder := &listingRecorder{items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)

	started := time.Now()
	sendJSON(t, conn, objectsRequest(1, "public"))
	response := expectErrorFrame(t, conn, 1, http.StatusInternalServerError)
	if !strings.Contains(response.Error.APIError.DetailedMessage, "time limit") {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}
	if elapsed := time.Since(started); elapsed > 3*time.Second {
		t.Fatalf("the page deadline did not cover the region lookup: %v", elapsed)
	}
	if end, err := readFrame(t, conn, 5*time.Second); err != nil || !end.RequestEnd || end.NextContinuationToken != "" || len(end.Data) != 0 {
		t.Fatalf("expected an empty request_end after the error, got %+v %v", end, err)
	}
	if lookups.Load() != 1 || recorder.calls() != 0 {
		t.Fatalf("lookups=%d list calls=%d, want one lookup and no list call", lookups.Load(), recorder.calls())
	}

	// The session goes on serving pages once the lookup answers.
	answer.Store(true)
	sendJSON(t, conn, objectsRequest(2, "public"))
	if names, _ := collectPage(t, conn, 2); joined(names) != "a.txt" {
		t.Fatalf("names = %v", names)
	}
}

func TestObjectManagerReportsAPageTimeout(t *testing.T) {
	previous := wsObjectPageTimeout.get()
	wsObjectPageTimeout.set(100 * time.Millisecond)
	t.Cleanup(func() { wsObjectPageTimeout.set(previous) })
	// The lister blocks until its context ends, as the real transport does.
	recorder := &listingRecorder{release: make(chan struct{}), items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)

	sendJSON(t, conn, objectsRequest(1, "public"))
	response := expectErrorFrame(t, conn, 1, http.StatusInternalServerError)
	if !strings.Contains(response.Error.APIError.DetailedMessage, "time limit") {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}
	if end, err := readFrame(t, conn, 5*time.Second); err != nil || !end.RequestEnd || end.NextContinuationToken != "" || len(end.Data) != 0 {
		t.Fatalf("expected an empty request_end after the error, got %+v %v", end, err)
	}

	// The session goes on serving pages.
	recorder.setRelease(nil)
	sendJSON(t, conn, objectsRequest(2, "public"))
	if names, _ := collectPage(t, conn, 2); joined(names) != "a.txt" {
		t.Fatalf("names = %v", names)
	}
}

func TestObjectManagerPageErrorsEndTheRequest(t *testing.T) {
	recorder := &listingRecorder{items: numberedKeys(10), err: errors.New("listing exploded")}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)

	sendJSON(t, conn, objectsRequest(1, "public"))
	if response := expectErrorFrame(t, conn, 1, http.StatusInternalServerError); response.Error.APIError.DetailedMessage != "listing exploded" {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}
	if end, err := readFrame(t, conn, 5*time.Second); err != nil || !end.RequestEnd || len(end.Data) != 0 {
		t.Fatalf("expected request_end after the error, got %+v %v", end, err)
	}
}

// ---- rewind guards ---------------------------------------------------------

// rewindProducer installs a rewind client that emits count versions, stalls
// afterwards when stall is set, and reports its progress: stalled closes once
// every item has been delivered and the producer waits on its context, done
// closes when its goroutine exits.
type rewindProducerState struct{ stalled, done chan struct{} }

func rewindProducer(t *testing.T, count int, stall bool) rewindProducerState {
	t.Helper()
	previous := newRewindClient
	t.Cleanup(func() { newRewindClient = previous })
	producer := rewindProducerState{stalled: make(chan struct{}), done: make(chan struct{})}
	newRewindClient = func(_ *models.Principal, bucketName, _, _ string) (MCClient, error) {
		return s3ClientMock{listFunc: func(ctx context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
			out := make(chan *mc.ClientContent)
			go func() {
				defer close(producer.done)
				defer close(out)
				for i := 0; i < count; i++ {
					content := &mc.ClientContent{URL: *mustParseClientURL(t, fmt.Sprintf("/%s/v%02d.txt", bucketName, i)), Size: 1, Time: time.Unix(0, 0), VersionID: fmt.Sprint(i)}
					select {
					case out <- content:
					case <-ctx.Done():
						return
					}
				}
				if stall {
					close(producer.stalled)
					<-ctx.Done()
				}
			}()
			return out
		}}, nil
	}
	return producer
}

func expectProducerStopped(t *testing.T, done <-chan struct{}) {
	t.Helper()
	select {
	case <-done:
	case <-time.After(3 * time.Second):
		t.Fatal("the rewind producer was not stopped")
	}
}

func TestObjectManagerRewindGuards(t *testing.T) {
	principal := &models.Principal{STSAccessKeyID: "a", STSSecretAccessKey: "b"}
	rewind := func(id int64) ObjectsRequest {
		return ObjectsRequest{Mode: "rewind", BucketName: "public", Date: "2026-01-01T00:00:00Z", RequestID: id}
	}

	t.Run("the row cap truncates the listing and stops the producer", func(t *testing.T) {
		setTunable(t, &wsRewindMaxItems, 3)
		producer := rewindProducer(t, 10, false)
		conn := dialWS(t, startObjectSessionServer(t, minioClientMock{}, principal).url, nil)
		sendJSON(t, conn, rewind(1))
		names, end := collectPage(t, conn, 1)
		if joined(names) != "v00.txt,v01.txt,v02.txt" || !end.Truncated || end.NextContinuationToken != "" {
			t.Fatalf("names = %v end=%+v", names, end)
		}
		expectProducerStopped(t, producer.done)
	})

	t.Run("the time budget truncates a stalled listing", func(t *testing.T) {
		previous := wsRewindTimeout.get()
		wsRewindTimeout.set(100 * time.Millisecond)
		t.Cleanup(func() { wsRewindTimeout.set(previous) })
		producer := rewindProducer(t, 2, true)
		conn := dialWS(t, startObjectSessionServer(t, minioClientMock{}, principal).url, nil)
		sendJSON(t, conn, rewind(1))
		names, end := collectPage(t, conn, 1)
		if joined(names) != "v00.txt,v01.txt" || !end.Truncated {
			t.Fatalf("names = %v end=%+v", names, end)
		}
		expectProducerStopped(t, producer.done)
	})

	t.Run("a producer that closes silently on the budget yields an empty, truncated result", func(t *testing.T) {
		// Nothing is emitted before the budget expires and the producer
		// closes its channel without a final item; the expired budget alone
		// must label the empty result incomplete rather than complete.
		previous := wsRewindTimeout.get()
		wsRewindTimeout.set(100 * time.Millisecond)
		t.Cleanup(func() { wsRewindTimeout.set(previous) })
		producer := rewindProducer(t, 0, true)
		conn := dialWS(t, startObjectSessionServer(t, minioClientMock{}, principal).url, nil)
		sendJSON(t, conn, rewind(1))
		names, end := collectPage(t, conn, 1)
		if len(names) != 0 || !end.Truncated || end.NextContinuationToken != "" {
			t.Fatalf("names = %v end=%+v", names, end)
		}
		expectProducerStopped(t, producer.done)
	})

	t.Run("a listing within both budgets is complete", func(t *testing.T) {
		producer := rewindProducer(t, 5, false)
		conn := dialWS(t, startObjectSessionServer(t, minioClientMock{}, principal).url, nil)
		sendJSON(t, conn, rewind(1))
		names, end := collectPage(t, conn, 1)
		if len(names) != 5 || end.Truncated {
			t.Fatalf("names = %v end=%+v", names, end)
		}
		expectProducerStopped(t, producer.done)
	})

	t.Run("a canceled listing stops the producer and emits no completion", func(t *testing.T) {
		producer := rewindProducer(t, 1, true)
		srv := startObjectSessionServer(t, minioClientMock{}, principal)
		conn := dialWS(t, srv.url, nil)
		session := srv.session(t)
		sendJSON(t, conn, rewind(1))
		// The producer has delivered a row (held in the batch, as rows are
		// until the end) and stalls when the client cancels: the producer is
		// released, and neither an end frame nor a truncated marker is sent
		// for the canceled request.
		select {
		case <-producer.stalled:
		case <-time.After(3 * time.Second):
			t.Fatal("the rewind producer did not deliver its row")
		}
		sendJSON(t, conn, ObjectsRequest{Mode: "cancel", RequestID: 1})
		expectProducerStopped(t, producer.done)
		waitUntil(t, 3*time.Second, func() bool { return session.inflight() == 0 }, "the canceled worker to exit")
		if late, err := readFrame(t, conn, 300*time.Millisecond); err == nil {
			t.Fatalf("a canceled listing emitted %+v", late)
		}
	})
}
