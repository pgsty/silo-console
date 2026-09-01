// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"io"
	"net/http"
	"strings"
	"testing"
)

type sourceHeaderRoundTripFunc func(*http.Request) (*http.Response, error)

func (f sourceHeaderRoundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}

func TestConsoleTransportClonesAndSanitizesSourceHeaders(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "https://silo.example.test/probe", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header[xForwardedFor] = []string{"203.0.113.66", "198.51.100.44"}
	req.Header[xRealIP] = []string{"203.0.113.67"}
	req.Header[forwarded] = []string{"for=203.0.113.68"}
	req.Header["x-forwarded-for"] = []string{"203.0.113.69"}
	req.Header["FORWARDED"] = []string{"for=203.0.113.70"}
	req.Header.Set("X-Keep-Me", "present")
	originalHeader := req.Header.Clone()

	var received *http.Request
	transport := &ConsoleTransport{
		ClientIP: "[2001:0db8::1]:4711",
		Transport: sourceHeaderRoundTripFunc(func(forwardedReq *http.Request) (*http.Response, error) {
			received = forwardedReq
			return &http.Response{
				StatusCode: http.StatusOK,
				Header:     make(http.Header),
				Body:       io.NopCloser(strings.NewReader("")),
				Request:    forwardedReq,
			}, nil
		}),
	}

	resp, err := transport.RoundTrip(req)
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	if received == req {
		t.Fatal("RoundTrip passed the caller's request to the underlying transport")
	}
	if received.Header == nil {
		t.Fatal("forwarded request has a nil header")
	}
	if got := received.Header.Values(xForwardedFor); len(got) != 1 || got[0] != "2001:db8::1" {
		t.Fatalf("forwarded XFF = %v, want one canonical client IP", got)
	}
	xffValues := 0
	for name, values := range received.Header {
		switch {
		case strings.EqualFold(name, xForwardedFor):
			xffValues += len(values)
		case strings.EqualFold(name, xRealIP), strings.EqualFold(name, forwarded):
			t.Fatalf("source header %q was relayed: %v", name, values)
		}
	}
	if xffValues != 1 {
		t.Fatalf("forwarded request contains %d case-insensitive XFF values, want 1", xffValues)
	}
	if got := received.Header.Get("X-Keep-Me"); got != "present" {
		t.Fatalf("unrelated header = %q", got)
	}

	if got := req.Header.Values(xForwardedFor); strings.Join(got, ",") != strings.Join(originalHeader.Values(xForwardedFor), ",") {
		t.Fatalf("caller XFF was mutated: got %v, want %v", got, originalHeader.Values(xForwardedFor))
	}
	if req.Header.Get(xRealIP) != originalHeader.Get(xRealIP) || req.Header.Get(forwarded) != originalHeader.Get(forwarded) {
		t.Fatal("caller source headers were mutated")
	}
	received.Header.Set("X-Keep-Me", "changed")
	if req.Header.Get("X-Keep-Me") != "present" {
		t.Fatal("forwarded request shares its Header map with the caller")
	}
}

func TestConsoleTransportDropsSourceHeadersForInvalidClientIP(t *testing.T) {
	tests := []string{"", "proxy.internal", "192.0.2.1:not-a-port", "[2001:db8::1]:65536"}
	for _, clientIP := range tests {
		t.Run(clientIP, func(t *testing.T) {
			req, err := http.NewRequest(http.MethodGet, "https://silo.example.test/probe", nil)
			if err != nil {
				t.Fatal(err)
			}
			req.Header[xForwardedFor] = []string{"203.0.113.66"}
			req.Header[xRealIP] = []string{"203.0.113.67"}
			req.Header[forwarded] = []string{"for=203.0.113.68"}

			transport := &ConsoleTransport{
				ClientIP: clientIP,
				Transport: sourceHeaderRoundTripFunc(func(forwardedReq *http.Request) (*http.Response, error) {
					for _, header := range []string{xForwardedFor, xRealIP, forwarded} {
						if got := forwardedReq.Header.Values(header); len(got) != 0 {
							t.Errorf("%s survived sanitization: %v", header, got)
						}
					}
					return &http.Response{
						StatusCode: http.StatusOK,
						Header:     make(http.Header),
						Body:       io.NopCloser(strings.NewReader("")),
						Request:    forwardedReq,
					}, nil
				}),
			}
			resp, err := transport.RoundTrip(req)
			if err != nil {
				t.Fatal(err)
			}
			resp.Body.Close()
		})
	}
}

func TestConsoleToSILOSourceIPBoundary(t *testing.T) {
	tests := []struct {
		name   string
		policy sourceIPTrustPolicy
		peer   string
		xff    string
		want   string
	}{
		{
			name: "direct request cannot forge an allowed source",
			peer: "203.0.113.9:43000",
			xff:  "10.10.10.10",
			want: "203.0.113.9",
		},
		{
			name:   "configured proxy can author the client source",
			policy: mustSourceIPTrustPolicy(t, "192.0.2.7"),
			peer:   "192.0.2.7:43000",
			xff:    "203.0.113.66, 10.10.10.10",
			want:   "10.10.10.10",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			incoming := sourceIPRequest(tt.peer, http.Header{xForwardedFor: {tt.xff}})
			clientIP := clientIPWithPolicy(incoming, tt.policy)

			var siloXFF []string
			transport := &ConsoleTransport{
				ClientIP: clientIP,
				Transport: sourceHeaderRoundTripFunc(func(req *http.Request) (*http.Response, error) {
					siloXFF = req.Header.Values(xForwardedFor)
					return &http.Response{
						StatusCode: http.StatusOK,
						Header:     make(http.Header),
						Body:       io.NopCloser(strings.NewReader("")),
						Request:    req,
					}, nil
				}),
			}
			outgoing, err := http.NewRequest(http.MethodGet, "https://silo.example.test/", nil)
			if err != nil {
				t.Fatal(err)
			}
			outgoing.Header.Set(xForwardedFor, "198.51.100.200")
			resp, err := transport.RoundTrip(outgoing)
			if err != nil {
				t.Fatal(err)
			}
			resp.Body.Close()
			if len(siloXFF) != 1 || siloXFF[0] != tt.want {
				t.Fatalf("SILO received XFF %v, want [%s]", siloXFF, tt.want)
			}
		})
	}
}
