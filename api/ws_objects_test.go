// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	mc "github.com/minio/mc/cmd"
	minio "github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/minio/websocket"

	"github.com/minio/console/models"
	"github.com/minio/console/pkg/auth"
)

// ---- shared helpers ------------------------------------------------------

func shrinkWSTimers(t *testing.T, pong, ping, write time.Duration) {
	t.Helper()
	previousPong, previousPing, previousWrite := wsPongWait.get(), wsPingPeriod.get(), wsWriteWait.get()
	wsPongWait.set(pong)
	wsPingPeriod.set(ping)
	wsWriteWait.set(write)
	t.Cleanup(func() {
		wsPongWait.set(previousPong)
		wsPingPeriod.set(previousPing)
		wsWriteWait.set(previousWrite)
	})
}

func useListObjectsMock(t *testing.T, fn func(ctx context.Context, bucket string, opts minio.ListObjectsOptions) <-chan minio.ObjectInfo) {
	t.Helper()
	previous := minioListObjectsMock
	minioListObjectsMock = fn
	t.Cleanup(func() { minioListObjectsMock = previous })
}

// objectSessionServer serves one Object Manager session per connection on a
// mock client and exposes the session objects and their completion.
type objectSessionServer struct {
	url       string
	sessions  chan *wsObjectSession
	finished  chan *wsObjectSession
	started   atomic.Int32
	completed atomic.Int32
}

func startObjectSessionServer(t *testing.T, client MinioClient, session *models.Principal) *objectSessionServer {
	t.Helper()
	srv := &objectSessionServer{sessions: make(chan *wsObjectSession, 16), finished: make(chan *wsObjectSession, 16)}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		conn.SetReadLimit(wsMaxMessageSize)
		s := newWSObjectSession(wsConn{conn: conn}, client, session, "203.0.113.9")
		srv.started.Add(1)
		srv.sessions <- s
		s.run()
		srv.finished <- s
	}))
	t.Cleanup(server.Close)
	// Client connections registered later close first (LIFO); then wait for
	// every session started here to finish so no session outlives the test.
	t.Cleanup(func() {
		deadline := time.After(5 * time.Second)
		for started := srv.started.Load(); srv.completed.Load() < started; {
			select {
			case <-srv.finished:
				srv.completed.Add(1)
			case <-deadline:
				t.Errorf("%d session(s) did not finish", started-srv.completed.Load())
				return
			}
		}
	})
	srv.url = "ws" + strings.TrimPrefix(server.URL, "http")
	return srv
}

func (srv *objectSessionServer) session(t *testing.T) *wsObjectSession {
	t.Helper()
	select {
	case s := <-srv.sessions:
		return s
	case <-time.After(5 * time.Second):
		t.Fatal("no session started")
		return nil
	}
}

func (srv *objectSessionServer) waitFinished(t *testing.T, timeout time.Duration) *wsObjectSession {
	t.Helper()
	select {
	case s := <-srv.finished:
		srv.completed.Add(1)
		return s
	case <-time.After(timeout):
		t.Fatal("session did not finish")
		return nil
	}
}

func dialWS(t *testing.T, rawURL string, header http.Header) *websocket.Conn {
	t.Helper()
	conn, resp, err := websocket.DefaultDialer.Dial(rawURL, header)
	if err != nil {
		status := 0
		if resp != nil {
			status = resp.StatusCode
		}
		t.Fatalf("dial %s: %v (status %d)", rawURL, err, status)
	}
	t.Cleanup(func() { conn.Close() })
	return conn
}

func sendJSON(t *testing.T, conn *websocket.Conn, v interface{}) {
	t.Helper()
	payload, err := json.Marshal(v)
	if err != nil {
		t.Fatal(err)
	}
	if err := conn.WriteMessage(websocket.TextMessage, payload); err != nil {
		t.Fatal(err)
	}
}

func objectsRequest(id int64, bucket string) ObjectsRequest {
	return ObjectsRequest{Mode: "objects", BucketName: bucket, Prefix: "", RequestID: id}
}

// readFrame returns the next text frame decoded as a WSResponse, or the read
// error (typically a *websocket.CloseError).
func readFrame(t *testing.T, conn *websocket.Conn, timeout time.Duration) (WSResponse, error) {
	t.Helper()
	_ = conn.SetReadDeadline(time.Now().Add(timeout))
	for {
		messageType, payload, err := conn.ReadMessage()
		if err != nil {
			return WSResponse{}, err
		}
		if messageType != websocket.TextMessage {
			continue
		}
		var response WSResponse
		if err := json.Unmarshal(payload, &response); err != nil {
			t.Fatalf("frame is not a WSResponse: %v: %s", err, payload)
		}
		return response, nil
	}
}

func expectErrorFrame(t *testing.T, conn *websocket.Conn, id int64, code int) WSResponse {
	t.Helper()
	response, err := readFrame(t, conn, 5*time.Second)
	if err != nil {
		t.Fatalf("expected an error frame, got %v", err)
	}
	if response.RequestID != id || response.Error == nil || response.Error.Code != code {
		t.Fatalf("expected error %d for request %d, got %+v", code, id, response)
	}
	return response
}

func expectClose(t *testing.T, conn *websocket.Conn, code int, timeout time.Duration) {
	t.Helper()
	for {
		_, err := readFrame(t, conn, timeout)
		if err == nil {
			continue // drain pending error frames
		}
		var closeErr *websocket.CloseError
		if !errors.As(err, &closeErr) || closeErr.Code != code {
			t.Fatalf("expected close %d, got %v", code, err)
		}
		return
	}
}

// collectListing reads data frames until request_end for id and returns the names.
func collectListing(t *testing.T, conn *websocket.Conn, id int64) []string {
	t.Helper()
	var names []string
	for {
		response, err := readFrame(t, conn, 10*time.Second)
		if err != nil {
			t.Fatalf("listing %d: %v", id, err)
		}
		if response.RequestID != id {
			continue
		}
		if response.Error != nil {
			t.Fatalf("listing %d failed: %+v", id, response.Error)
		}
		for _, item := range response.Data {
			names = append(names, item.Name)
		}
		if response.RequestEnd {
			return names
		}
	}
}

// listingRecorder is a listObjects mock that records the contexts it was
// called with and can hold listings open until released.
type listingRecorder struct {
	mu       sync.Mutex
	contexts []context.Context
	release  chan struct{} // nil: return immediately
	ignore   bool          // ignore ctx cancellation while blocked
	items    []string
}

func (r *listingRecorder) install(t *testing.T) {
	t.Helper()
	useListObjectsMock(t, func(ctx context.Context, _ string, _ minio.ListObjectsOptions) <-chan minio.ObjectInfo {
		r.mu.Lock()
		r.contexts = append(r.contexts, ctx)
		release, ignore, items := r.release, r.ignore, r.items
		r.mu.Unlock()
		out := make(chan minio.ObjectInfo)
		go func() {
			defer close(out)
			if release != nil {
				if ignore {
					<-release
				} else {
					select {
					case <-release:
					case <-ctx.Done():
						out <- minio.ObjectInfo{Err: ctx.Err()}
						return
					}
				}
			}
			for _, name := range items {
				select {
				case out <- minio.ObjectInfo{Key: name, Size: 1, LastModified: time.Unix(0, 0)}:
				case <-ctx.Done():
					out <- minio.ObjectInfo{Err: ctx.Err()}
					return
				}
			}
		}()
		return out
	})
}

func (r *listingRecorder) setRelease(release chan struct{}) {
	r.mu.Lock()
	r.release = release
	r.mu.Unlock()
}

func (r *listingRecorder) canceled() (n int) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, ctx := range r.contexts {
		if ctx.Err() != nil {
			n++
		}
	}
	return n
}

func (r *listingRecorder) calls() int {
	r.mu.Lock()
	defer r.mu.Unlock()
	return len(r.contexts)
}

func waitUntil(t *testing.T, timeout time.Duration, condition func() bool, what string) {
	t.Helper()
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if condition() {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("timed out waiting for %s", what)
}

// ---- production path: serveWS + a fake S3 endpoint ------------------------

const fakeS3AccessKey = "AKIAFAKEACCESSKEY0001"

// fakeS3 answers bucket-location and ListObjectsV2 requests. Bucket "public"
// lists for everyone; bucket "private" lists only for requests signed with
// fakeS3AccessKey.
func fakeS3(t *testing.T) *httptest.Server {
	t.Helper()
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/xml")
		if _, isLocation := r.URL.Query()["location"]; isLocation {
			_, _ = fmt.Fprint(w, `<?xml version="1.0" encoding="UTF-8"?><LocationConstraint xmlns="http://s3.amazonaws.com/doc/2006-03-01/"></LocationConstraint>`)
			return
		}
		bucket := strings.Trim(r.URL.Path, "/")
		signed := strings.HasPrefix(r.Header.Get("Authorization"), "AWS4-HMAC-SHA256 Credential="+fakeS3AccessKey+"/")
		if bucket == "private" && !signed {
			w.WriteHeader(http.StatusForbidden)
			_, _ = fmt.Fprint(w, `<?xml version="1.0" encoding="UTF-8"?><Error><Code>AccessDenied</Code><Message>Access Denied.</Message><Resource>/private</Resource><RequestId>1</RequestId></Error>`)
			return
		}
		if bucket != "public" && bucket != "private" {
			w.WriteHeader(http.StatusNotFound)
			_, _ = fmt.Fprint(w, `<?xml version="1.0" encoding="UTF-8"?><Error><Code>NoSuchBucket</Code><Message>The specified bucket does not exist</Message></Error>`)
			return
		}
		_, _ = fmt.Fprintf(w, `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>%s</Name><Prefix></Prefix><KeyCount>2</KeyCount><MaxKeys>1000</MaxKeys><IsTruncated>false</IsTruncated><Contents><Key>a.txt</Key><LastModified>2026-01-01T00:00:00.000Z</LastModified><ETag>"a"</ETag><Size>1</Size><StorageClass>STANDARD</StorageClass></Contents><Contents><Key>docs/b.txt</Key><LastModified>2026-01-01T00:00:00.000Z</LastModified><ETag>"b"</ETag><Size>2</Size><StorageClass>STANDARD</StorageClass></Contents></ListBucketResult>`, bucket)
	}))
	t.Cleanup(server.Close)
	return server
}

func consoleSessionCookie(t *testing.T, accessKey string) string {
	t.Helper()
	token, err := auth.NewEncryptedTokenForClient(&credentials.Value{AccessKeyID: accessKey, SecretAccessKey: "fake-secret-key-0123456789"}, accessKey, nil)
	if err != nil {
		t.Fatal(err)
	}
	return token
}

func serveWSServer(t *testing.T) string {
	t.Helper()
	server := httptest.NewServer(http.HandlerFunc(serveWS))
	t.Cleanup(server.Close)
	return "ws" + strings.TrimPrefix(server.URL, "http")
}

func TestObjectManagerAnonymousAndAuthenticatedListing(t *testing.T) {
	s3 := fakeS3(t)
	t.Setenv(ConsoleMinIOServer, s3.URL)
	base := serveWSServer(t)

	t.Run("anonymous public bucket lists", func(t *testing.T) {
		conn := dialWS(t, base+"/ws/objectManager", nil)
		sendJSON(t, conn, objectsRequest(1, "public"))
		if names := collectListing(t, conn, 1); strings.Join(names, ",") != "a.txt,docs/b.txt" {
			t.Fatalf("names = %v", names)
		}
	})

	t.Run("anonymous private bucket is denied but the session survives", func(t *testing.T) {
		conn := dialWS(t, base+"/ws/objectManager", nil)
		sendJSON(t, conn, objectsRequest(1, "private"))
		expectErrorFrame(t, conn, 1, http.StatusForbidden)
		sendJSON(t, conn, objectsRequest(2, "public"))
		if names := collectListing(t, conn, 2); len(names) != 2 {
			t.Fatalf("session did not survive: %v", names)
		}
	})

	t.Run("authenticated private bucket lists", func(t *testing.T) {
		header := http.Header{"Cookie": {"token=" + consoleSessionCookie(t, fakeS3AccessKey)}}
		conn := dialWS(t, base+"/ws/objectManager", header)
		sendJSON(t, conn, objectsRequest(1, "private"))
		if names := collectListing(t, conn, 1); len(names) != 2 {
			t.Fatalf("names = %v", names)
		}
	})
}

func TestServeWSAuthenticationPredicate(t *testing.T) {
	s3 := fakeS3(t)
	t.Setenv(ConsoleMinIOServer, s3.URL)
	base := serveWSServer(t)
	valid := consoleSessionCookie(t, fakeS3AccessKey)

	tests := []struct {
		name    string
		path    string
		cookie  string // "" = no cookie header
		upgrade bool
	}{
		{name: "missing cookie on trace is rejected", path: "/ws/trace", upgrade: false},
		{name: "missing cookie on objectManager is anonymous", path: "/ws/objectManager", upgrade: true},
		{name: "missing cookie on an objectManager sub-path is rejected", path: "/ws/objectManager/extra", upgrade: false},
		{name: "empty cookie on objectManager is rejected", path: "/ws/objectManager", cookie: "token=", upgrade: false},
		{name: "malformed cookie on objectManager is rejected", path: "/ws/objectManager", cookie: "token=not-a-session", upgrade: false},
		{name: "valid cookie on objectManager upgrades", path: "/ws/objectManager", cookie: "token=" + valid, upgrade: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			header := http.Header{}
			if tt.cookie != "" {
				header.Set("Cookie", tt.cookie)
			}
			conn, resp, err := websocket.DefaultDialer.Dial(base+tt.path, header)
			if tt.upgrade {
				if err != nil {
					t.Fatalf("expected upgrade, got %v", err)
				}
				conn.Close()
				return
			}
			if err == nil {
				conn.Close()
				t.Fatal("expected the handshake to be rejected")
			}
			if resp == nil || resp.StatusCode != http.StatusUnauthorized {
				t.Fatalf("expected 401, got %v (%v)", resp, err)
			}
		})
	}
}

func TestServeWSRejectsOversizedFrames(t *testing.T) {
	s3 := fakeS3(t)
	t.Setenv(ConsoleMinIOServer, s3.URL)
	conn := dialWS(t, serveWSServer(t)+"/ws/objectManager", nil)
	if err := conn.WriteMessage(websocket.TextMessage, []byte(strings.Repeat("x", int(wsMaxMessageSize)+1))); err != nil {
		t.Fatal(err)
	}
	expectClose(t, conn, websocket.CloseMessageTooBig, 5*time.Second)
}

// ---- session semantics on a mock client -----------------------------------

func TestObjectManagerRejectsInvalidRequestsWithoutAllocating(t *testing.T) {
	recorder := &listingRecorder{items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)
	session := srv.session(t)

	if err := conn.WriteMessage(websocket.TextMessage, []byte(`{not json`)); err != nil {
		t.Fatal(err)
	}
	expectErrorFrame(t, conn, 0, http.StatusBadRequest)
	sendJSON(t, conn, map[string]interface{}{"mode": "explode", "request_id": 5})
	if response := expectErrorFrame(t, conn, 5, http.StatusBadRequest); response.Error.APIError.DetailedMessage != string(errWSUnknownMode) {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}
	sendJSON(t, conn, map[string]interface{}{"mode": "objects", "bucket_name": "public"})
	expectErrorFrame(t, conn, 0, http.StatusBadRequest)
	sendJSON(t, conn, map[string]interface{}{"mode": "objects", "bucket_name": "Not A Bucket", "request_id": 6})
	expectErrorFrame(t, conn, 6, http.StatusBadRequest)
	sendJSON(t, conn, map[string]interface{}{"mode": "objects", "bucket_name": "public", "prefix": strings.Repeat("p", wsMaxPrefixLength+1), "request_id": 7})
	expectErrorFrame(t, conn, 7, http.StatusBadRequest)
	sendJSON(t, conn, map[string]interface{}{"mode": "rewind", "bucket_name": "public", "date": "yesterday", "request_id": 8})
	expectErrorFrame(t, conn, 8, http.StatusBadRequest)
	sendJSON(t, conn, map[string]interface{}{"mode": "cancel"})
	expectErrorFrame(t, conn, 0, http.StatusBadRequest)

	if session.inflight() != 0 || recorder.calls() != 0 {
		t.Fatalf("invalid requests allocated state: inflight=%d calls=%d", session.inflight(), recorder.calls())
	}
	sendJSON(t, conn, objectsRequest(9, "public"))
	if names := collectListing(t, conn, 9); strings.Join(names, ",") != "a.txt" {
		t.Fatalf("session no longer serves valid requests: %v", names)
	}
}

func TestObjectManagerClosesAfterRepeatedProtocolErrors(t *testing.T) {
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)
	for i := 0; i < wsMaxProtocolErrors; i++ {
		if err := conn.WriteMessage(websocket.BinaryMessage, []byte{1, 2, 3}); err != nil {
			t.Fatal(err)
		}
	}
	expectClose(t, conn, websocket.ClosePolicyViolation, 5*time.Second)
	srv.waitFinished(t, 5*time.Second)
}

func TestObjectManagerIdleAndKeepalive(t *testing.T) {
	shrinkWSTimers(t, 300*time.Millisecond, 100*time.Millisecond, 200*time.Millisecond)
	recorder := &listingRecorder{items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)

	t.Run("a peer that never answers pings is closed", func(t *testing.T) {
		conn := dialWS(t, srv.url, nil)
		conn.SetPingHandler(func(string) error { return nil }) // swallow pings, send no pong
		_, err := readFrame(t, conn, 3*time.Second)
		if err == nil {
			t.Fatal("expected the server to close the idle connection")
		}
		srv.waitFinished(t, 3*time.Second)
	})

	t.Run("a live peer survives several pong windows", func(t *testing.T) {
		conn := dialWS(t, srv.url, nil)
		// A read pump is required for gorilla to process pings and answer pongs.
		frames := make(chan WSResponse, 8)
		readErr := make(chan error, 1)
		go func() {
			for {
				var response WSResponse
				if err := conn.ReadJSON(&response); err != nil {
					readErr <- err
					return
				}
				frames <- response
			}
		}()
		time.Sleep(3 * wsPongWait.get())
		select {
		case err := <-readErr:
			t.Fatalf("connection dropped while idle: %v", err)
		default:
		}
		sendJSON(t, conn, objectsRequest(1, "public"))
		deadline := time.After(3 * time.Second)
		for {
			select {
			case response := <-frames:
				if response.RequestEnd {
					return
				}
			case err := <-readErr:
				t.Fatalf("read error: %v", err)
			case <-deadline:
				t.Fatal("no request_end after idle period")
			}
		}
	})
}

func TestObjectManagerCleanupOnClientClose(t *testing.T) {
	recorder := &listingRecorder{release: make(chan struct{})}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)
	session := srv.session(t)

	// Descending ids so the second request does not cancel the first.
	sendJSON(t, conn, objectsRequest(20, "public"))
	sendJSON(t, conn, objectsRequest(10, "public"))
	waitUntil(t, 2*time.Second, func() bool { return recorder.calls() == 2 }, "two listings to start")
	if session.inflight() != 2 {
		t.Fatalf("inflight = %d", session.inflight())
	}
	conn.Close()
	srv.waitFinished(t, 2*time.Second)
	if recorder.canceled() != 2 {
		t.Fatalf("canceled = %d, want 2", recorder.canceled())
	}
	if session.inflight() != 0 {
		t.Fatalf("listings left after teardown: %d", session.inflight())
	}
}

func TestObjectManagerCapAndDuplicateHaveNoSideEffects(t *testing.T) {
	release := make(chan struct{})
	recorder := &listingRecorder{release: release, ignore: true, items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)
	session := srv.session(t)

	for _, id := range []int64{50, 40, 30, 20} {
		sendJSON(t, conn, objectsRequest(id, "public"))
	}
	waitUntil(t, 2*time.Second, func() bool { return recorder.calls() == wsMaxInFlightListings }, "four listings in flight")

	sendJSON(t, conn, objectsRequest(10, "public"))
	if response := expectErrorFrame(t, conn, 10, http.StatusBadRequest); response.Error.APIError.DetailedMessage != string(errWSTooManyRequests) {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}
	sendJSON(t, conn, objectsRequest(40, "public"))
	if response := expectErrorFrame(t, conn, 40, http.StatusBadRequest); response.Error.APIError.DetailedMessage != string(errWSDuplicateRequest) {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}
	if recorder.canceled() != 0 || recorder.calls() != wsMaxInFlightListings || session.inflight() != wsMaxInFlightListings {
		t.Fatalf("rejected admissions had side effects: canceled=%d calls=%d inflight=%d", recorder.canceled(), recorder.calls(), session.inflight())
	}

	close(release)
	ended := map[int64]bool{}
	for len(ended) < wsMaxInFlightListings {
		response, err := readFrame(t, conn, 5*time.Second)
		if err != nil {
			t.Fatal(err)
		}
		if response.RequestEnd {
			ended[response.RequestID] = true
		}
	}
	waitUntil(t, 2*time.Second, func() bool { return session.inflight() == 0 }, "slots to be released")

	// Once released, the id can be used again.
	recorder.setRelease(nil)
	sendJSON(t, conn, objectsRequest(40, "public"))
	if names := collectListing(t, conn, 40); strings.Join(names, ",") != "a.txt" {
		t.Fatalf("re-admitted request failed: %v", names)
	}
}

func TestObjectManagerCancelReservesTheRequestID(t *testing.T) {
	release := make(chan struct{})
	recorder := &listingRecorder{release: release, ignore: true, items: []string{"a.txt"}}
	recorder.install(t)
	srv := startObjectSessionServer(t, minioClientMock{}, nil)
	conn := dialWS(t, srv.url, nil)
	session := srv.session(t)

	sendJSON(t, conn, objectsRequest(7, "public"))
	waitUntil(t, 2*time.Second, func() bool { return recorder.calls() == 1 }, "listing 7 to start")
	sendJSON(t, conn, ObjectsRequest{Mode: "cancel", RequestID: 7})
	waitUntil(t, 2*time.Second, func() bool { return recorder.canceled() == 1 }, "listing 7 to be canceled")
	if session.inflight() != 1 {
		t.Fatalf("cancel released the slot early: inflight=%d", session.inflight())
	}

	// Immediate reuse while the worker is still unwinding is rejected.
	sendJSON(t, conn, objectsRequest(7, "public"))
	if response := expectErrorFrame(t, conn, 7, http.StatusBadRequest); response.Error.APIError.DetailedMessage != string(errWSDuplicateRequest) {
		t.Fatalf("detail = %q", response.Error.APIError.DetailedMessage)
	}

	close(release)
	waitUntil(t, 2*time.Second, func() bool { return session.inflight() == 0 }, "the canceled worker to exit")

	// A canceled listing emits nothing; the next admission of id 7 works.
	recorder.setRelease(nil)
	sendJSON(t, conn, objectsRequest(7, "public"))
	response, err := readFrame(t, conn, 5*time.Second)
	if err != nil {
		t.Fatal(err)
	}
	if response.RequestID != 7 || response.Error != nil || len(response.Data) != 1 {
		t.Fatalf("first frame after re-admission = %+v (a canceled listing must not emit frames)", response)
	}
	if response, err = readFrame(t, conn, 5*time.Second); err != nil || !response.RequestEnd {
		t.Fatalf("expected request_end, got %+v %v", response, err)
	}
}

func TestObjectManagerRewind(t *testing.T) {
	srv := startObjectSessionServer(t, minioClientMock{}, nil)

	t.Run("anonymous rewind is refused and the session survives", func(t *testing.T) {
		conn := dialWS(t, srv.url, nil)
		sendJSON(t, conn, ObjectsRequest{Mode: "rewind", BucketName: "public", Date: "2026-01-01T00:00:00Z", RequestID: 1})
		response, err := readFrame(t, conn, 5*time.Second)
		if err != nil || response.RequestID != 1 || response.Error == nil {
			t.Fatalf("expected an error frame, got %+v %v", response, err)
		}
		recorder := &listingRecorder{items: []string{"a.txt"}}
		recorder.install(t)
		sendJSON(t, conn, objectsRequest(2, "public"))
		if names := collectListing(t, conn, 2); len(names) != 1 {
			t.Fatalf("session did not survive: %v", names)
		}
	})

	t.Run("authenticated rewind uses the trust-resolved client IP", func(t *testing.T) {
		previous := newRewindClient
		t.Cleanup(func() { newRewindClient = previous })
		var capturedIP atomic.Value
		newRewindClient = func(_ *models.Principal, bucketName, _, clientIP string) (MCClient, error) {
			capturedIP.Store(clientIP)
			return s3ClientMock{listFunc: func(_ context.Context, _ mc.ListOptions) <-chan *mc.ClientContent {
				out := make(chan *mc.ClientContent, 1)
				out <- &mc.ClientContent{URL: *mustParseClientURL(t, "/"+bucketName+"/old.txt"), Size: 3, Time: time.Unix(0, 0), VersionID: "v1"}
				close(out)
				return out
			}}, nil
		}
		authenticated := startObjectSessionServer(t, minioClientMock{}, &models.Principal{STSAccessKeyID: "a", STSSecretAccessKey: "b"})
		conn := dialWS(t, authenticated.url, nil)
		sendJSON(t, conn, ObjectsRequest{Mode: "rewind", BucketName: "public", Date: "2026-01-01T00:00:00Z", RequestID: 3})
		if names := collectListing(t, conn, 3); strings.Join(names, ",") != "old.txt" {
			t.Fatalf("names = %v", names)
		}
		if got, _ := capturedIP.Load().(string); got != "203.0.113.9" {
			t.Fatalf("rewind client IP = %q, want the trust-resolved handshake address", got)
		}
	})
}

func mustParseClientURL(t *testing.T, path string) *mc.ClientURL {
	t.Helper()
	u, err := url.Parse("http://silo.example" + path)
	if err != nil {
		t.Fatal(err)
	}
	// The zero ClientURLType is object storage.
	return &mc.ClientURL{Scheme: u.Scheme, Host: u.Host, Path: u.Path, Separator: '/'}
}

// ---- writer discipline on a recording fake connection ----------------------

type fakeObjectConn struct {
	mu            sync.Mutex
	ops           []string
	deadlineArmed bool
	writeErr      error
	frames        chan []byte // scripted inbound text frames
	closed        chan struct{}
	closeOnce     sync.Once
}

func newFakeObjectConn() *fakeObjectConn {
	return &fakeObjectConn{frames: make(chan []byte, 8), closed: make(chan struct{})}
}

func (c *fakeObjectConn) record(op string) {
	c.mu.Lock()
	c.ops = append(c.ops, op)
	c.mu.Unlock()
}

func (c *fakeObjectConn) writeMessage(messageType int, _ []byte) error {
	c.mu.Lock()
	armed := c.deadlineArmed
	c.deadlineArmed = false
	err := c.writeErr
	c.mu.Unlock()
	if !armed {
		c.record("WRITE-WITHOUT-DEADLINE")
	}
	c.record(fmt.Sprintf("write:%d", messageType))
	return err
}

func (c *fakeObjectConn) readMessage() (int, []byte, error) {
	select {
	case frame := <-c.frames:
		return websocket.TextMessage, frame, nil
	case <-c.closed:
		return 0, nil, errors.New("use of closed connection")
	}
}

func (c *fakeObjectConn) close() error {
	c.closeOnce.Do(func() { c.record("close"); close(c.closed) })
	return nil
}

func (c *fakeObjectConn) remoteAddress() string { return "203.0.113.9" }

func (c *fakeObjectConn) setReadDeadline(time.Time) error { return nil }

func (c *fakeObjectConn) setWriteDeadline(time.Time) error {
	c.mu.Lock()
	c.deadlineArmed = true
	c.mu.Unlock()
	c.record("deadline")
	return nil
}

func (c *fakeObjectConn) setPongHandler(func(string) error) {}

func (c *fakeObjectConn) operations() []string {
	c.mu.Lock()
	defer c.mu.Unlock()
	return append([]string(nil), c.ops...)
}

type timeoutError struct{}

func (timeoutError) Error() string   { return "i/o timeout" }
func (timeoutError) Timeout() bool   { return true }
func (timeoutError) Temporary() bool { return false }

func TestObjectManagerWriterArmsDeadlinesAndStopsOnWriteTimeout(t *testing.T) {
	shrinkWSTimers(t, time.Second, 50*time.Millisecond, 200*time.Millisecond)
	recorder := &listingRecorder{items: []string{"a.txt"}}
	recorder.install(t)

	conn := newFakeObjectConn()
	payload, _ := json.Marshal(objectsRequest(1, "public"))
	conn.frames <- payload
	session := newWSObjectSession(conn, minioClientMock{}, nil, "203.0.113.9")
	finished := make(chan struct{})
	go func() { session.run(); close(finished) }()

	// Wait for the listing (data + end) and at least one ping to be written.
	waitUntil(t, 3*time.Second, func() bool {
		ops := conn.operations()
		texts, pings := 0, 0
		for _, op := range ops {
			switch op {
			case fmt.Sprintf("write:%d", websocket.TextMessage):
				texts++
			case fmt.Sprintf("write:%d", websocket.PingMessage):
				pings++
			}
		}
		return texts >= 2 && pings >= 1
	}, "data, end and ping writes")

	// Now every further write times out: the next ping must shut the session down.
	conn.mu.Lock()
	conn.writeErr = timeoutError{}
	conn.mu.Unlock()
	select {
	case <-finished:
	case <-time.After(3 * time.Second):
		t.Fatal("session did not stop after a write timeout")
	}

	ops := conn.operations()
	for _, op := range ops {
		if op == "WRITE-WITHOUT-DEADLINE" {
			t.Fatalf("a write was issued without arming the deadline: %v", ops)
		}
	}
	if ops[len(ops)-1] != "close" {
		t.Fatalf("socket was not closed last: %v", ops)
	}
}

func TestParseObjectsRequest(t *testing.T) {
	tests := []struct {
		name    string
		kind    int
		payload string
		wantErr error
	}{
		{"objects", websocket.TextMessage, `{"mode":"objects","bucket_name":"public","prefix":"docs/","request_id":1}`, nil},
		{"rewind", websocket.TextMessage, `{"mode":"rewind","bucket_name":"public","date":"2026-01-01T00:00:00Z","request_id":1}`, nil},
		{"cancel", websocket.TextMessage, `{"mode":"cancel","request_id":1}`, nil},
		{"close", websocket.TextMessage, `{"mode":"close"}`, nil},
		{"binary", websocket.BinaryMessage, `{"mode":"close"}`, errWSBinaryFrame},
		{"malformed", websocket.TextMessage, `{`, errWSMalformedJSON},
		{"unknown mode", websocket.TextMessage, `{"mode":"list","request_id":1}`, errWSUnknownMode},
		{"missing mode", websocket.TextMessage, `{"request_id":1}`, errWSUnknownMode},
		{"zero id", websocket.TextMessage, `{"mode":"objects","bucket_name":"public"}`, errWSRequestID},
		{"negative cancel id", websocket.TextMessage, `{"mode":"cancel","request_id":-1}`, errWSRequestID},
		{"bad bucket", websocket.TextMessage, `{"mode":"objects","bucket_name":"../x","request_id":1}`, errWSBucketName},
		{"empty bucket", websocket.TextMessage, `{"mode":"objects","request_id":1}`, errWSBucketName},
		{"long prefix", websocket.TextMessage, `{"mode":"objects","bucket_name":"public","prefix":"` + strings.Repeat("p", 1025) + `","request_id":1}`, errWSPrefixTooLong},
		{"bad date", websocket.TextMessage, `{"mode":"rewind","bucket_name":"public","date":"2026-01-01","request_id":1}`, errWSRewindDate},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := parseObjectsRequest(tt.kind, []byte(tt.payload))
			if !errors.Is(err, tt.wantErr) {
				t.Fatalf("err = %v, want %v", err, tt.wantErr)
			}
		})
	}
}
