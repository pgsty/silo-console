// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"testing"

	"github.com/minio/minio-go/v7/pkg/notification"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }
func TestEventTransportTracksActualStreamsAndIgnoresMetadataRequests(t *testing.T) {
	transport := &eventTransport{base: roundTripFunc(func(*http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: 200, Body: io.NopCloser(strings.NewReader("{}\n"))}, nil
	}), wake: make(chan struct{}, 1)}
	metadata, _ := http.NewRequest("GET", "http://storage/?location", nil)
	response, err := transport.RoundTrip(metadata)
	if err != nil {
		t.Fatal(err)
	}
	response.Body.Close()
	if transport.connected.Load() {
		t.Fatal("metadata response falsely established event coverage")
	}
	stream, _ := http.NewRequest("GET", "http://storage/?events=s3%3AObjectCreated%3A*", nil)
	first, err := transport.RoundTrip(stream)
	if err != nil {
		t.Fatal(err)
	}
	if !transport.connected.Load() {
		t.Fatal("quiet stream is not recognized as connected")
	}
	firstEpoch := transport.epoch.Load()
	second, err := transport.RoundTrip(stream)
	if err != nil {
		t.Fatal(err)
	}
	if transport.epoch.Load() <= firstEpoch {
		t.Fatal("fast reconnect did not change epoch")
	}
	first.Body.Close()
	if !transport.connected.Load() {
		t.Fatal("old stream closure invalidated a newer connection")
	}
	if _, err = io.ReadAll(second.Body); err != nil {
		t.Fatal(err)
	}
	if transport.connected.Load() {
		t.Fatal("clean EOF falsely preserves coverage")
	}
	second.Body.Close()
}
func TestChangeEventsQueueBucketsWithoutCollectingRequestOrObjectData(t *testing.T) {
	var event notification.Event
	if err := json.Unmarshal([]byte(`{"eventName":"s3:ObjectCreated:Put","eventTime":"2026-10-26T00:00:00Z","s3":{"bucket":{"name":"changed"},"object":{"key":"private-object-key"}},"requestParameters":{"authorization":"private-token"}}`), &event); err != nil {
		t.Fatal(err)
	}
	bucket, at, ok := changedBucket(event)
	if !ok || bucket != "changed" || at.IsZero() {
		t.Fatal("mutation did not identify dirty bucket")
	}
	event.EventName = "s3:ObjectAccessed:Get"
	if _, _, ok = changedBucket(event); ok {
		t.Fatal("read requests cause unnecessary rescans")
	}
	event.EventName = "s3:ObjectRemoved:DeleteMarkerCreated"
	event.EventTime = "invalid"
	if _, at, ok = changedBucket(event); !ok || at.IsZero() {
		t.Fatal("bad source timestamp silently dropped a real deletion")
	}
}
func TestRetryBackoffIsBounded(t *testing.T) {
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	last := c.retry(1)
	for _, attempt := range []int{2, 3, 10, 100, 1000000} {
		next := c.retry(attempt)
		if next < last || next > c.MaxRetryInterval {
			t.Fatal("retry budget overflowed or regressed")
		}
		last = next
	}
}
