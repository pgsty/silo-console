// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"io"
	"net/http"
	"sync"
	"sync/atomic"
)

// The SDK hides healthy pings and reconnects after clean EOF. Track the actual
// response lifetime so a quiet bucket is healthy and a lost stream triggers
// reconciliation, even when no application event reports the interruption.
type eventTransport struct {
	base      http.RoundTripper
	connected atomic.Bool
	epoch     atomic.Uint64
	wake      chan struct{}
}

func (t *eventTransport) changed() {
	select {
	case t.wake <- struct{}{}:
	default:
	}
}
func (t *eventTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	response, err := t.base.RoundTrip(request)
	if !request.URL.Query().Has("events") {
		return response, err
	}
	epoch := t.epoch.Add(1)
	if err != nil || response.StatusCode != http.StatusOK {
		t.connected.Store(false)
		t.changed()
		return response, err
	}
	t.connected.Store(true)
	t.changed()
	response.Body = &observedBody{ReadCloser: response.Body, closed: func() {
		if t.epoch.Load() == epoch {
			t.connected.Store(false)
			t.changed()
		}
	}}
	return response, nil
}

type observedBody struct {
	io.ReadCloser
	once   sync.Once
	closed func()
}

func (b *observedBody) Read(p []byte) (int, error) {
	n, err := b.ReadCloser.Read(p)
	if err != nil {
		b.once.Do(b.closed)
	}
	return n, err
}
func (b *observedBody) Close() error { err := b.ReadCloser.Close(); b.once.Do(b.closed); return err }
