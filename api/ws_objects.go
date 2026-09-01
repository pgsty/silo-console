// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"errors"
	"fmt"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7/pkg/s3utils"
	"github.com/minio/websocket"
)

// Object Manager session limits. They are variables so tests can shrink the
// timers; production never changes them after start-up.
var (
	// wsMaxMessageSize bounds one inbound frame on every /ws endpoint. An
	// Object Manager request is a few hundred bytes even with a 1024-byte
	// prefix; the other endpoints read nothing but close frames.
	wsMaxMessageSize int64 = 32 << 10
	// wsWriteWait bounds every write, so a stalled peer cannot hold the
	// writer, and with it the session, forever.
	wsWriteWait = newWSDuration(10 * time.Second)
	// wsPongWait is how long the reader waits for any frame before the peer
	// is considered gone; pings are sent every wsPingPeriod so a live browser
	// answers well inside the window.
	wsPongWait   = newWSDuration(60 * time.Second)
	wsPingPeriod = newWSDuration(30 * time.Second)
	// wsMaxInFlightListings caps concurrent listings per connection. The UI
	// keeps one current request and cancels older ones, so the cap only binds
	// a misbehaving client.
	wsMaxInFlightListings = 4
	// wsMaxProtocolErrors closes a session that keeps sending frames Console
	// cannot act on.
	wsMaxProtocolErrors = 10
	// wsMaxPrefixLength matches the S3 object key limit.
	wsMaxPrefixLength = 1024
)

const objectManagerItemsPerBatch = 1000

// wsDuration is a tunable duration that tests may shrink while sessions from
// earlier tests are still draining; atomic access keeps that race-free.
type wsDuration struct{ nanos atomic.Int64 }

func newWSDuration(d time.Duration) *wsDuration {
	w := &wsDuration{}
	w.set(d)
	return w
}

func (w *wsDuration) get() time.Duration  { return time.Duration(w.nanos.Load()) }
func (w *wsDuration) set(d time.Duration) { w.nanos.Store(int64(d)) }

// newRewindClient builds the S3 client used for rewind listings. It is a
// variable so tests can observe the identity a listing is attributed to
// without reaching the network.
var newRewindClient = func(session *models.Principal, bucketName, prefix, clientIP string) (MCClient, error) {
	s3Client, err := newS3BucketClient(session, bucketName, prefix, clientIP)
	if err != nil {
		return nil, err
	}
	return mcClient{client: s3Client}, nil
}

// errWSProtocol carries a bounded, payload-free description of an invalid
// request; it is echoed to the client and never contains client input.
type errWSProtocol string

func (e errWSProtocol) Error() string { return string(e) }

const (
	errWSBinaryFrame      errWSProtocol = "binary frames are not accepted"
	errWSMalformedJSON    errWSProtocol = "request is not valid JSON"
	errWSUnknownMode      errWSProtocol = "unknown mode"
	errWSRequestID        errWSProtocol = "request_id must be a positive integer"
	errWSBucketName       errWSProtocol = "invalid bucket_name"
	errWSPrefixTooLong    errWSProtocol = "prefix exceeds the object key limit"
	errWSRewindDate       errWSProtocol = "date must be an RFC 3339 timestamp"
	errWSSessionClosing   errWSProtocol = "session is closing"
	errWSDuplicateRequest errWSProtocol = "request_id is already in flight"
	errWSTooManyRequests  errWSProtocol = "too many in-flight requests"
	errWSListingOptions   errWSProtocol = "invalid listing options"
)

// parseObjectsRequest decodes and validates one inbound frame. It returns the
// decoded request even on error so the response can name the request id, and
// it allocates nothing session-scoped: validation happens before admission.
func parseObjectsRequest(messageType int, message []byte) (ObjectsRequest, error) {
	var request ObjectsRequest
	if messageType != websocket.TextMessage {
		return request, errWSBinaryFrame
	}
	if err := json.Unmarshal(message, &request); err != nil {
		return request, errWSMalformedJSON
	}
	switch request.Mode {
	case "close":
		return request, nil
	case "cancel":
		if request.RequestID <= 0 {
			return request, errWSRequestID
		}
		return request, nil
	case "objects", "rewind":
	default:
		return request, errWSUnknownMode
	}
	if request.RequestID <= 0 {
		return request, errWSRequestID
	}
	if err := s3utils.CheckValidBucketName(request.BucketName); err != nil {
		return request, errWSBucketName
	}
	if len(request.Prefix) > wsMaxPrefixLength {
		return request, errWSPrefixTooLong
	}
	if request.Mode == "rewind" {
		if _, err := time.Parse(time.RFC3339, request.Date); err != nil {
			return request, errWSRewindDate
		}
	}
	return request, nil
}

// wsListing is one admitted listing. The entry stays in the session map until
// the worker exits, so a request id cannot be reused while its worker is still
// unwinding, and finish compares the pointer before deleting.
type wsListing struct {
	id     int64
	ctx    context.Context
	cancel context.CancelFunc
}

// wsObjectConn is the connection surface the Object Manager session uses.
// wsConn implements it; tests substitute a recording fake.
type wsObjectConn interface {
	WSConn
	setReadDeadline(t time.Time) error
	setWriteDeadline(t time.Time) error
	setPongHandler(handler func(appData string) error)
}

// wsObjectSession owns one Object Manager connection. Exactly one goroutine,
// the writer running in run(), writes to the socket; the reader admits work
// and requests shutdown; listing workers produce responses through send.
type wsObjectSession struct {
	conn     wsObjectConn
	client   MinioClient
	session  *models.Principal
	clientIP string

	mu       sync.Mutex
	closed   bool
	listings map[int64]*wsListing
	wg       sync.WaitGroup

	out       chan WSResponse
	done      chan struct{}
	closeOnce sync.Once
	closeCode int32
}

func newWSObjectSession(conn wsObjectConn, client MinioClient, session *models.Principal, clientIP string) *wsObjectSession {
	return &wsObjectSession{
		conn:     conn,
		client:   client,
		session:  session,
		clientIP: clientIP,
		listings: make(map[int64]*wsListing),
		out:      make(chan WSResponse),
		done:     make(chan struct{}),
	}
}

func (wsc *wsMinioClient) objectManager(session *models.Principal) {
	newWSObjectSession(wsc.conn, wsc.client, session, wsc.clientIP).run()
}

// run drives the session to completion: it starts the reader, serves the
// writer loop, and on shutdown sends the close frame (if any), waits for every
// worker, closes the socket and joins the reader.
func (s *wsObjectSession) run() {
	readerDone := make(chan struct{})
	go func() {
		defer close(readerDone)
		s.readLoop()
	}()

	s.writeLoop()

	if code := int(atomic.LoadInt32(&s.closeCode)); code != 0 {
		// Acknowledge the close before the socket goes away.
		_ = s.conn.setWriteDeadline(time.Now().Add(wsWriteWait.get()))
		_ = s.conn.writeMessage(websocket.CloseMessage, websocket.FormatCloseMessage(code, ""))
	}
	s.wg.Wait()
	_ = s.conn.close()
	<-readerDone
}

func (s *wsObjectSession) writeLoop() {
	ticker := time.NewTicker(wsPingPeriod.get())
	defer ticker.Stop()
	for {
		// Shutdown wins over any pending output or ping.
		select {
		case <-s.done:
			return
		default:
		}
		select {
		case <-s.done:
			return
		case response := <-s.out:
			payload, err := json.Marshal(response)
			if err != nil {
				LogInfo("Error while marshaling the response: %s", err)
				s.shutdown(0)
				return
			}
			if err := s.write(websocket.TextMessage, payload); err != nil {
				LogInfo("Error while writing the message: %s", err)
				s.shutdown(0)
				return
			}
		case <-ticker.C:
			if err := s.write(websocket.PingMessage, nil); err != nil {
				s.shutdown(0)
				return
			}
		}
	}
}

func (s *wsObjectSession) write(messageType int, payload []byte) error {
	if err := s.conn.setWriteDeadline(time.Now().Add(wsWriteWait.get())); err != nil {
		return err
	}
	return s.conn.writeMessage(messageType, payload)
}

func (s *wsObjectSession) readLoop() {
	_ = s.conn.setReadDeadline(time.Now().Add(wsPongWait.get()))
	s.conn.setPongHandler(func(string) error {
		return s.conn.setReadDeadline(time.Now().Add(wsPongWait.get()))
	})

	protocolErrors := 0
	for {
		messageType, message, err := s.conn.readMessage()
		if err != nil {
			// Read-limit overflow (gorilla already sent 1009), peer close,
			// deadline expiry, or the socket closed by run().
			if !errors.Is(err, websocket.ErrReadLimit) && !websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				LogInfo("Error while reading objectManager message: %s", err)
			}
			s.shutdown(0)
			return
		}
		_ = s.conn.setReadDeadline(time.Now().Add(wsPongWait.get()))

		request, err := parseObjectsRequest(messageType, message)
		if err != nil {
			protocolErrors++
			s.sendProtocolError(request.RequestID, err)
			if protocolErrors >= wsMaxProtocolErrors {
				s.shutdown(websocket.ClosePolicyViolation)
				return
			}
			continue
		}
		protocolErrors = 0

		switch request.Mode {
		case "close":
			s.shutdown(websocket.CloseNormalClosure)
			return
		case "cancel":
			s.cancelListing(request.RequestID)
		default:
			listing, err := s.admit(request.RequestID)
			if err != nil {
				s.sendProtocolError(request.RequestID, err)
				continue
			}
			go s.runListing(listing, request)
		}
	}
}

// admit reserves a listing slot. Every check runs before any side effect, so a
// rejected request cancels nothing and allocates nothing.
func (s *wsObjectSession) admit(id int64) (*wsListing, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.closed {
		return nil, errWSSessionClosing
	}
	if _, exists := s.listings[id]; exists {
		return nil, errWSDuplicateRequest
	}
	if len(s.listings) >= wsMaxInFlightListings {
		return nil, errWSTooManyRequests
	}
	// The UI only cares about its newest request; older listings are stale.
	for rid, listing := range s.listings {
		if rid < id {
			listing.cancel()
		}
	}
	ctx, cancel := context.WithCancel(context.Background())
	listing := &wsListing{id: id, ctx: ctx, cancel: cancel}
	s.listings[id] = listing
	s.wg.Add(1)
	return listing, nil
}

func (s *wsObjectSession) finish(listing *wsListing) {
	s.mu.Lock()
	if s.listings[listing.id] == listing {
		delete(s.listings, listing.id)
	}
	s.mu.Unlock()
	listing.cancel()
	s.wg.Done()
}

func (s *wsObjectSession) cancelListing(id int64) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if listing, ok := s.listings[id]; ok {
		listing.cancel()
	}
}

// inflight reports the number of reserved listing slots.
func (s *wsObjectSession) inflight() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.listings)
}

// shutdown is the single coordinator: it closes admission, cancels every
// listing, records the close frame to send, and wakes the writer and every
// blocked producer exactly once.
func (s *wsObjectSession) shutdown(code int) {
	s.closeOnce.Do(func() {
		s.mu.Lock()
		s.closed = true
		for _, listing := range s.listings {
			listing.cancel()
		}
		s.mu.Unlock()
		atomic.StoreInt32(&s.closeCode, int32(code))
		close(s.done)
	})
}

// send hands a response to the writer. It gives up when the session is
// shutting down or, for a listing's own output, when that listing has been
// canceled, so a worker blocked behind a slow writer is released promptly.
func (s *wsObjectSession) send(listing *wsListing, response WSResponse) bool {
	var canceled <-chan struct{}
	if listing != nil {
		canceled = listing.ctx.Done()
	}
	select {
	case s.out <- response:
		return true
	case <-canceled:
		return false
	case <-s.done:
		return false
	}
}

func (s *wsObjectSession) sendProtocolError(id int64, err error) {
	s.send(nil, WSResponse{
		RequestID: id,
		Error: &CodedAPIError{
			Code:     400,
			APIError: &models.APIError{Message: "invalid object manager request", DetailedMessage: err.Error()},
		},
	})
}

// wsBatcher groups listing items into bounded frames for one request.
type wsBatcher struct {
	session *wsObjectSession
	listing *wsListing
	buffer  []ObjectResponse
	stopped bool
}

func (b *wsBatcher) add(item ObjectResponse) {
	if b.stopped {
		return
	}
	b.buffer = append(b.buffer, item)
	if len(b.buffer) >= objectManagerItemsPerBatch {
		b.flush()
	}
}

func (b *wsBatcher) flush() {
	if b.stopped || len(b.buffer) == 0 {
		return
	}
	if !b.session.send(b.listing, WSResponse{RequestID: b.listing.id, Data: b.buffer}) {
		b.stopped = true
	}
	b.buffer = nil
}

func (b *wsBatcher) end() {
	b.flush()
	if !b.stopped {
		b.session.send(b.listing, WSResponse{RequestID: b.listing.id, RequestEnd: true})
	}
}

func (s *wsObjectSession) runListing(listing *wsListing, request ObjectsRequest) {
	defer s.finish(listing)

	options, err := getObjectsOptionsFromReq(request)
	if err != nil {
		s.sendProtocolError(request.RequestID, errWSListingOptions)
		return
	}
	batcher := &wsBatcher{session: s, listing: listing}
	failed := WSResponse{RequestID: request.RequestID, Prefix: request.Prefix, BucketName: request.BucketName}

	switch request.Mode {
	case "objects":
		// The listing channel must be drained to its close even after
		// cancellation, or the producer goroutine leaks; nothing is emitted
		// for a canceled listing.
		for object := range startObjectsListing(listing.ctx, s.client, options) {
			if listing.ctx.Err() != nil {
				continue
			}
			if object.Err != nil {
				failed.Error = ErrorWithContext(listing.ctx, object.Err)
				s.send(listing, failed)
				continue
			}
			// The prefix itself lists as a nested directory object; skip it and
			// show only the objects under it.
			if request.Prefix == object.Key {
				continue
			}
			batcher.add(ObjectResponse{
				Name:         object.Key,
				Size:         object.Size,
				LastModified: object.LastModified.Format(time.RFC3339),
				VersionID:    object.VersionID,
				IsLatest:     object.IsLatest,
				DeleteMarker: object.IsDeleteMarker,
			})
		}
	case "rewind":
		client, err := newRewindClient(s.session, options.BucketName, options.Prefix, s.clientIP)
		if err != nil {
			failed.Error = ErrorWithContext(listing.ctx, err)
			s.send(listing, failed)
			return
		}
		bucketPrefix := fmt.Sprintf("/%s/", options.BucketName)
		for content := range startRewindListing(listing.ctx, client, options) {
			if listing.ctx.Err() != nil {
				continue
			}
			if content.Err != nil {
				failed.Error = ErrorWithContext(listing.ctx, content.Err.ToGoError())
				s.send(listing, failed)
				continue
			}
			batcher.add(ObjectResponse{
				Name:         strings.Replace(content.URL.Path, bucketPrefix, "", 1),
				Size:         content.Size,
				LastModified: content.Time.Format(time.RFC3339),
				VersionID:    content.VersionID,
				IsLatest:     content.IsLatest,
				DeleteMarker: content.IsDeleteMarker,
			})
		}
	}
	if listing.ctx.Err() == nil {
		batcher.end()
	}
}
