// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/minio/minio-go/v7/pkg/credentials"

	"github.com/minio/console/pkg/auth"
	"github.com/minio/console/pkg/logger"
	"github.com/minio/console/pkg/logger/message/audit"
	xhttp "github.com/minio/console/pkg/logger/target/http"
)

const (
	testSTSAccessKey    = "AKIATESTACCESSKEY0001"
	testSTSSecretKey    = "TESTSECRET/wJalrXUtnFEMI+K7MDENGbPxRfiCY"
	testSTSSessionToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.TEST-SESSION-TOKEN-PAYLOAD.SIG"
	testSSECKey         = "U1NFQy1LRVktMDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODk="
	testIssuedCookie    = "ISSUED-COOKIE-VALUE-0123456789"
)

// auditCapture is an audit webhook endpoint that records every delivered entry.
type auditCapture struct {
	mu      sync.Mutex
	bodies  []string
	entries []audit.Entry
}

func (c *auditCapture) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)
	var entry audit.Entry
	_ = json.Unmarshal(body, &entry)
	c.mu.Lock()
	c.bodies = append(c.bodies, string(body))
	c.entries = append(c.entries, entry)
	c.mu.Unlock()
	w.WriteHeader(http.StatusOK)
}

// waitFor returns the delivered body and entry whose API path contains marker.
func (c *auditCapture) waitFor(t *testing.T, marker string) (string, audit.Entry) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		c.mu.Lock()
		for i, entry := range c.entries {
			if strings.Contains(entry.API.Path, marker) {
				body := c.bodies[i]
				c.mu.Unlock()
				return body, entry
			}
		}
		c.mu.Unlock()
		time.Sleep(10 * time.Millisecond)
	}
	t.Fatalf("no audit entry delivered for %q", marker)
	return "", audit.Entry{}
}

func installAuditCapture(t *testing.T) *auditCapture {
	t.Helper()
	capture := &auditCapture{}
	server := httptest.NewServer(capture)
	t.Cleanup(server.Close)
	cfg := logger.Config{AuditWebhook: map[string]xhttp.Config{
		"test": {Enabled: true, Name: "test", Endpoint: server.URL, QueueSize: 100, Transport: GlobalTransport},
	}}
	if err := logger.UpdateAuditWebhookTargets(cfg); err != nil {
		t.Fatalf("UpdateAuditWebhookTargets: %v", err)
	}
	t.Cleanup(func() { _ = logger.UpdateAuditWebhookTargets(logger.Config{}) })
	return capture
}

func captureDebugLog(t *testing.T) *[]string {
	t.Helper()
	previous := debugLogSink
	var mu sync.Mutex
	lines := &[]string{}
	debugLogSink = func(line string) {
		mu.Lock()
		*lines = append(*lines, line)
		mu.Unlock()
	}
	t.Cleanup(func() { debugLogSink = previous })
	return lines
}

func sessionCookie(t *testing.T) string {
	t.Helper()
	token, err := auth.NewEncryptedTokenForClient(&credentials.Value{
		AccessKeyID:     testSTSAccessKey,
		SecretAccessKey: testSTSSecretKey,
		SessionToken:    testSTSSessionToken,
	}, "console-account", nil)
	if err != nil {
		t.Fatal(err)
	}
	return token
}

// productionChain composes the middleware exactly as configureAPI does:
// setupGlobalMiddleware wraps the handler with audit, file server, context,
// authentication, debug and the security middlewares in production order.
func productionChain(t *testing.T, level int, status int) http.Handler {
	t.Helper()
	t.Setenv("CONSOLE_DEBUG_LOGLEVEL", strconv.Itoa(level))
	handler := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Add("Set-Cookie", "token="+testIssuedCookie+"; Path=/; HttpOnly; Secure")
		w.Header().Add("Set-Cookie", "idp_refresh_token="+testIssuedCookie+"; Path=/; HttpOnly")
		w.WriteHeader(status)
		_, _ = w.Write([]byte(`{}`))
	})
	return setupGlobalMiddleware(handler)
}

func secretFixtures() []string {
	return []string{
		testSTSAccessKey, testSTSSecretKey, testSTSSessionToken, testSSECKey, testIssuedCookie,
		base64.RawURLEncoding.EncodeToString([]byte("https://silo.example/bucket/object?X-Amz-Signature=deadbeef")),
	}
}

func assertNoSecrets(t *testing.T, where, text string) {
	t.Helper()
	for _, secret := range secretFixtures() {
		if strings.Contains(text, secret) {
			t.Fatalf("%s leaked %q:\n%s", where, secret, text)
		}
	}
}

func TestDebugAndAuditLoggingRedactCredentialsInProductionOrder(t *testing.T) {
	capture := installAuditCapture(t)
	cookie := sessionCookie(t)
	sharedSegment := base64.RawURLEncoding.EncodeToString([]byte("https://silo.example/bucket/object?X-Amz-Signature=deadbeef"))
	fingerprint := auth.SessionFingerprint(testSTSSessionToken)

	type wantLog int
	const (
		wantNone wantLog = iota
		wantSummary
		wantDetails
	)
	expected := map[int]map[int]wantLog{
		1: {200: wantNone, 400: wantNone, 500: wantSummary},
		2: {200: wantNone, 400: wantSummary, 500: wantSummary},
		3: {200: wantSummary, 400: wantSummary, 500: wantSummary},
		4: {200: wantNone, 400: wantNone, 500: wantDetails},
		5: {200: wantNone, 400: wantDetails, 500: wantDetails},
		6: {200: wantDetails, 400: wantDetails, 500: wantDetails},
	}

	for level := 1; level <= 6; level++ {
		for _, status := range []int{200, 400, 500} {
			t.Run(fmt.Sprintf("level%d/status%d", level, status), func(t *testing.T) {
				lines := captureDebugLog(t)
				chain := productionChain(t, level, status)

				marker := fmt.Sprintf("case-%d-%d", level, status)
				target := "/api/v1/download-shared-object/" + sharedSegment + "/" + marker +
					"?sts=" + url.QueryEscape(testSTSSessionToken) + "&st%73_a=" + testSTSAccessKey +
					"&sts_s=" + url.QueryEscape(testSTSSecretKey) + "&prefix=docs%2F"
				req := httptest.NewRequest(http.MethodGet, target, nil)
				req.RemoteAddr = "203.0.113.9:43000"
				req.Header.Set("Cookie", "token="+cookie+"; theme=dark")
				req.Header.Set("X-Amz-Security-Token", testSTSSessionToken)
				req.Header.Set("X-Amz-Server-Side-Encryption-Customer-Key", testSSECKey)
				req.Header.Set("Content-Type", "application/json")
				req.Header.Set("X-Request-Id", "req-"+marker)
				// AuthenticationMiddleware legitimately adds the session bearer;
				// everything else, and the URL, must be untouched by logging.
				cookieBefore := req.Header.Get("Cookie")
				tokenBefore := req.Header.Get("X-Amz-Security-Token")
				urlBefore := req.URL.String()

				rec := httptest.NewRecorder()
				chain.ServeHTTP(rec, req)
				if rec.Code != status {
					t.Fatalf("status = %d, want %d", rec.Code, status)
				}
				if req.Header.Get("Cookie") != cookieBefore || req.Header.Get("X-Amz-Security-Token") != tokenBefore || req.URL.String() != urlBefore {
					t.Fatal("logging mutated the request")
				}

				body, entry := capture.waitFor(t, marker)
				assertNoSecrets(t, "audit entry", body)
				if entry.SessionID != fingerprint {
					t.Fatalf("audit sessionID = %q, want fingerprint %q", entry.SessionID, fingerprint)
				}
				if !strings.HasPrefix(entry.API.Path, "/api/v1/download-shared-object/[REDACTED]/") {
					t.Fatalf("audit path = %q", entry.API.Path)
				}
				if entry.ReqHeader["Content-Type"] != "application/json" || entry.ReqHeader["X-Request-Id"] != "req-"+marker {
					t.Fatalf("audit dropped diagnostic headers: %v", entry.ReqHeader)
				}
				if entry.ReqQuery["prefix"] != "docs/" || entry.ReqQuery["sts_a"] != "[REDACTED]" {
					t.Fatalf("audit query = %v", entry.ReqQuery)
				}
				if _, present := entry.ReqHeader["Cookie"]; present {
					t.Fatal("the audit call site's Cookie filter no longer applies")
				}

				out := strings.Join(*lines, "\n")
				switch expected[level][status] {
				case wantNone:
					if out != "" {
						t.Fatalf("level %d logged a %d response: %s", level, status, out)
					}
					return
				case wantSummary:
					if len(*lines) != 1 || strings.Contains(out, "Request headers") {
						t.Fatalf("expected one summary line, got %q", out)
					}
				case wantDetails:
					if len(*lines) != 1 || !strings.Contains(out, "Request headers") {
						t.Fatalf("expected one detailed record, got %q", out)
					}
					for _, retained := range []string{
						"Authorization: Bearer [REDACTED]",
						"Cookie: token=[REDACTED]; theme=[REDACTED]",
						"Set-Cookie: token=[REDACTED]; Path=/; HttpOnly; Secure",
						"X-Amz-Security-Token: [REDACTED]",
						"X-Amz-Server-Side-Encryption-Customer-Key: [REDACTED]",
						"Content-Type: application/json",
						"X-Request-Id: req-" + marker,
						"Status code:      " + strconv.Itoa(status),
					} {
						if !strings.Contains(out, retained) {
							t.Fatalf("detailed record lacks %q:\n%s", retained, out)
						}
					}
				}
				assertNoSecrets(t, "debug log", out)
				for _, retained := range []string{
					http.MethodGet, "203.0.113.9:43000",
					"/api/v1/download-shared-object/[REDACTED]/" + marker,
					"sts=[REDACTED]", "st%73_a=[REDACTED]", "sts_s=[REDACTED]", "prefix=docs%2F",
				} {
					if !strings.Contains(out, retained) {
						t.Fatalf("log lacks %q:\n%s", retained, out)
					}
				}
			})
		}
	}
}

func TestDebugLoggingAnonymousRequestAndMalformedBearer(t *testing.T) {
	capture := installAuditCapture(t)
	lines := captureDebugLog(t)
	chain := productionChain(t, 6, 200)

	req := httptest.NewRequest(http.MethodGet, "/api/v1/anonymous-case", nil)
	req.RemoteAddr = "203.0.113.9:43000"
	rec := httptest.NewRecorder()
	chain.ServeHTTP(rec, req)
	_, entry := capture.waitFor(t, "anonymous-case")
	if entry.SessionID != "" {
		t.Fatalf("anonymous request carried a session id %q", entry.SessionID)
	}
	if out := strings.Join(*lines, "\n"); !strings.Contains(out, "Authorization: Bearer [REDACTED]") {
		// The anonymous bearer is not secret, but the rule applies uniformly.
		t.Fatalf("anonymous record = %q", out)
	}

	var logged []string
	validate := keyAuth(func(format string, args ...interface{}) { logged = append(logged, fmt.Sprintf(format, args...)) })
	if _, err := validate("not-a-valid-jwt."+testSTSSessionToken, nil); err == nil {
		t.Fatal("malformed bearer was accepted")
	}
	if len(logged) != 1 {
		t.Fatalf("expected one log line, got %v", logged)
	}
	assertNoSecrets(t, "KeyAuth log", strings.Join(logged, "\n"))
}
