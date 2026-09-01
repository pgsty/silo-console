// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package redact

import (
	"net/http"
	"net/url"
	"strings"
	"testing"
)

const (
	secretToken   = "eyJhbGciOiJIUzUxMiJ9.SECRET-SESSION-MATERIAL"
	secretCookie  = "c2VjcmV0LWNvb2tpZS12YWx1ZQ"
	secretSTS     = "AQoDYXdzEJr...STS-SESSION"
	secretAccess  = "AKIAEXAMPLEACCESS"
	secretKey     = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
	secretSSECKey = "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY="
)

func TestHeaderValue(t *testing.T) {
	tests := []struct {
		name  string
		value string
		want  string
	}{
		{"Authorization", "Bearer " + secretToken, "Bearer [REDACTED]"},
		{"Authorization", "Bearer  " + secretToken, "Bearer [REDACTED]"}, // Console's own double-space form
		{"authorization", "basic dXNlcjpwYXNz", "basic [REDACTED]"},
		{"Authorization", "AWS4-HMAC-SHA256 Credential=" + secretAccess + "/20260901/us-east-1/s3/aws4_request, Signature=abc", "AWS4-HMAC-SHA256 [REDACTED]"},
		{"Authorization", secretToken, "[REDACTED]"},             // opaque single token: no scheme survives
		{"Authorization", "Custom " + secretToken, "[REDACTED]"}, // unknown scheme: nothing survives
		{"Authorization", "", "[REDACTED]"},
		{"Proxy-Authorization", "Basic dXNlcjpwYXNz", "Basic [REDACTED]"},
		{"Cookie", "token=" + secretCookie + "; theme=dark", "token=[REDACTED]; theme=[REDACTED]"},
		{"Cookie", "token=" + secretCookie + ";", "token=[REDACTED]"},
		{"Cookie", "malformed cookie without equals", "[REDACTED]"},
		{"Cookie", "token=" + secretCookie + "; =orphan", "[REDACTED]"},
		{"Cookie", "bad name=" + secretCookie, "[REDACTED]"},
		{"Set-Cookie", "token=" + secretCookie + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600", "token=[REDACTED]; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600"},
		{"Set-Cookie", "token=" + secretCookie + "; Comment=" + secretKey, "[REDACTED]"},
		{"Set-Cookie", "no-equals-at-all", "[REDACTED]"},
		{"X-Amz-Security-Token", secretSTS, "[REDACTED]"},
		{"x-amz-credential", secretAccess + "/20260901/us-east-1/s3/aws4_request", "[REDACTED]"},
		{"X-Amz-Signature", "deadbeef", "[REDACTED]"},
		{"X-Amz-Server-Side-Encryption-Customer-Key", secretSSECKey, "[REDACTED]"},
		{"X-Amz-Server-Side-Encryption-Customer-Key-Md5", "abc=", "[REDACTED]"},
		{"X-Amz-Copy-Source-Server-Side-Encryption-Customer-Key", secretSSECKey, "[REDACTED]"},
		{"X-Amz-Copy-Source-Server-Side-Encryption-Customer-Key-Md5", "abc=", "[REDACTED]"},
		{"X-Api-Key", "k", "[REDACTED]"},
		{"X-Auth-Token", "k", "[REDACTED]"},
		{"X-Token", "k", "[REDACTED]"},
		{"X-Csrf-Token", "k", "[REDACTED]"},
		{"Content-Type", "application/json", "application/json"},
		{"X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD", "UNSIGNED-PAYLOAD"},
		{"X-Amz-Date", "20260901T000000Z", "20260901T000000Z"},
		{"User-Agent", "Mozilla/5.0", "Mozilla/5.0"},
		{"X-Request-Id", "req-1", "req-1"},
	}
	for _, tt := range tests {
		t.Run(tt.name+"/"+tt.value, func(t *testing.T) {
			got := HeaderValue(tt.name, tt.value)
			if got != tt.want {
				t.Fatalf("HeaderValue(%q, %q) = %q, want %q", tt.name, tt.value, got, tt.want)
			}
			if Header(tt.name) {
				for _, secret := range []string{secretToken, secretCookie, secretSTS, secretAccess, secretKey, secretSSECKey, "dXNlcjpwYXNz", "deadbeef"} {
					if secret != "" && strings.Contains(got, secret) {
						t.Fatalf("secret %q survived in %q", secret, got)
					}
				}
			}
		})
	}
}

func TestHeadersDoesNotMutateInput(t *testing.T) {
	in := http.Header{
		"Authorization": {"Bearer " + secretToken},
		"Cookie":        {"token=" + secretCookie, "theme=dark"},
		"Content-Type":  {"application/json"},
	}
	out := Headers(in)
	if in.Get("Authorization") != "Bearer "+secretToken || in.Values("Cookie")[0] != "token="+secretCookie {
		t.Fatal("input header was mutated")
	}
	if out.Get("Authorization") != "Bearer [REDACTED]" || out.Values("Cookie")[1] != "theme=[REDACTED]" || out.Get("Content-Type") != "application/json" {
		t.Fatalf("unexpected output: %v", out)
	}
	out.Set("Content-Type", "changed")
	if in.Get("Content-Type") != "application/json" {
		t.Fatal("output shares storage with input")
	}
	if Headers(nil) != nil {
		t.Fatal("nil in must be nil out")
	}
}

func TestHeaderMapAndQueryMap(t *testing.T) {
	// A flattened multi-value Cookie is one pair whose value swallows the rest;
	// nothing after the first "=" survives.
	headers := HeaderMap(map[string]string{"Cookie": "token=" + secretCookie + ",theme=dark", "Accept": "*/*", "Authorization": "Bearer " + secretToken})
	if headers["Cookie"] != "token=[REDACTED]" || headers["Accept"] != "*/*" || headers["Authorization"] != "Bearer [REDACTED]" {
		t.Fatalf("HeaderMap = %v", headers)
	}
	query := QueryMap(map[string]string{"sts_s": secretKey, "prefix": "docs/"})
	if query["sts_s"] != Placeholder || query["prefix"] != "docs/" {
		t.Fatalf("QueryMap = %v", query)
	}
}

func TestValues(t *testing.T) {
	in := url.Values{"sts": {secretSTS}, "STS_A": {secretAccess}, "prefix": {"a", "b"}}
	out := Values(in)
	if out.Get("sts") != Placeholder || out.Get("STS_A") != Placeholder {
		t.Fatalf("Values = %v", out)
	}
	if strings.Join(out["prefix"], ",") != "a,b" {
		t.Fatalf("non-sensitive values changed: %v", out["prefix"])
	}
	if in.Get("sts") != secretSTS {
		t.Fatal("input values were mutated")
	}
}

func TestRawQuery(t *testing.T) {
	tests := []struct {
		raw  string
		want string
	}{
		{"", ""},
		{"prefix=docs%2F&limit=10", "prefix=docs%2F&limit=10"},
		{"sts=" + secretSTS + "&sts_a=" + secretAccess + "&sts_s=" + url.QueryEscape(secretKey), "sts=[REDACTED]&sts_a=[REDACTED]&sts_s=[REDACTED]"},
		{"st%73=" + secretSTS + "&st%73_a=" + secretAccess + "&st%73_s=" + url.QueryEscape(secretKey), "st%73=[REDACTED]&st%73_a=[REDACTED]&st%73_s=[REDACTED]"},
		{"%53TS_S=" + url.QueryEscape(secretKey), "%53TS_S=[REDACTED]"},
		{"Sts_S=" + url.QueryEscape(secretKey) + "&sts_s=" + url.QueryEscape(secretKey), "Sts_S=[REDACTED]&sts_s=[REDACTED]"},
		{"code=AUTHCODE&state=opaque-state", "code=[REDACTED]&state=opaque-state"},
		{"X-Amz-Credential=" + secretAccess + "%2F20260901&X-Amz-Date=20260901T000000Z&X-Amz-Signature=deadbeef", "X-Amz-Credential=[REDACTED]&X-Amz-Date=20260901T000000Z&X-Amz-Signature=[REDACTED]"},
		{"AWSAccessKeyId=" + secretAccess + "&Signature=abc&Expires=1", "AWSAccessKeyId=[REDACTED]&Signature=[REDACTED]&Expires=1"},
		{"token", "token"},
		{"token=", "token=[REDACTED]"},
		{"prefix=a;sts_s=" + secretKey, "[REDACTED]"},   // unescaped semicolon: net/url rejects it, so does the redactor
		{"st%zz=" + secretKey, "[REDACTED]"},            // malformed key escape
		{"prefix=%zz&sts_s=" + secretKey, "[REDACTED]"}, // malformed value escape
	}
	for _, tt := range tests {
		t.Run(tt.raw, func(t *testing.T) {
			got := RawQuery(tt.raw)
			if got != tt.want {
				t.Fatalf("RawQuery(%q) = %q, want %q", tt.raw, got, tt.want)
			}
			for _, secret := range []string{secretSTS, secretAccess, url.QueryEscape(secretKey), "AUTHCODE", "deadbeef"} {
				if strings.Contains(got, secret) {
					t.Fatalf("secret %q survived in %q", secret, got)
				}
			}
		})
	}
}

func TestPathAndURL(t *testing.T) {
	encoded := "aHR0cHM6Ly9zaWxvL2J1Y2tldC9vYmo_WC1BbXotU2lnbmF0dXJlPXNlY3JldA"
	tests := map[string]string{
		"/api/v1/download-shared-object/" + encoded:               "/api/v1/download-shared-object/[REDACTED]",
		"/console/api/v1/download-shared-object/" + encoded + "/": "/console/api/v1/download-shared-object/[REDACTED]/",
		"/api/v1/download-shared-object/":                         "/api/v1/download-shared-object/",
		"/api/v1/buckets/b/objects/download":                      "/api/v1/buckets/b/objects/download",
		"/":                                                       "/",
	}
	for in, want := range tests {
		if got := Path(in); got != want {
			t.Errorf("Path(%q) = %q, want %q", in, got, want)
		}
	}

	u, err := url.Parse("https://user:pass@console.example/api/v1/download-shared-object/" + encoded + "?sts_s=" + url.QueryEscape(secretKey) + "&prefix=x")
	if err != nil {
		t.Fatal(err)
	}
	got := URL(u)
	want := "https://console.example/api/v1/download-shared-object/[REDACTED]?sts_s=[REDACTED]&prefix=x"
	if got != want {
		t.Fatalf("URL() = %q, want %q", got, want)
	}
	if u.Path != "/api/v1/download-shared-object/"+encoded || u.RawQuery == "" || u.User == nil {
		t.Fatal("URL() mutated its input")
	}
	if URL(nil) != "" {
		t.Fatal("URL(nil) must be empty")
	}
}
