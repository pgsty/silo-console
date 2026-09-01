// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
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

// Package redact is the single place that decides which parts of an HTTP
// request or response carry credentials or session material, and how they are
// rewritten before they reach any log. Audit logging and detailed debug
// logging both consume it, so a header, query parameter or path segment that
// is sensitive for one is sensitive for the other.
//
// Every rule fails closed: when a value cannot be parsed well enough to keep
// its non-secret parts, the whole value is replaced.
package redact

import (
	"net/http"
	"net/url"
	"strings"
)

// Placeholder replaces every redacted value.
const Placeholder = "[REDACTED]"

// sensitiveHeaders lists, in lower case, the headers whose values carry
// credentials or session material. The comment on each entry names the
// producer so the list can be audited.
var sensitiveHeaders = map[string]struct{}{
	"authorization":        {}, // Console's injected session bearer, Basic/Digest credentials
	"proxy-authorization":  {}, // proxy credentials
	"cookie":               {}, // encrypted session cookie
	"set-cookie":           {}, // session cookie issued by login
	"x-amz-security-token": {}, // STS session token on S3-style requests
	"x-amz-credential":     {}, // SigV4 credential scope (access key)
	"x-amz-signature":      {}, // SigV4 signature
	"x-amz-server-side-encryption-customer-key":                 {}, // raw SSE-C key
	"x-amz-server-side-encryption-customer-key-md5":             {}, // digest of the SSE-C key
	"x-amz-copy-source-server-side-encryption-customer-key":     {}, // raw SSE-C key for the copy source
	"x-amz-copy-source-server-side-encryption-customer-key-md5": {}, // digest of that key
	"x-api-key":    {}, // generic API keys
	"x-auth-token": {}, // generic auth tokens
	"x-token":      {}, // legacy Console header
	"x-csrf-token": {}, // anti-forgery tokens
}

// sensitiveQueryParameters lists, in lower case, the query parameters whose
// values carry credentials. Console consumes sts/sts_a/sts_s to bootstrap a
// session, the OpenID callback carries code, presigned URLs carry the x-amz-*
// and legacy AWSAccessKeyId/Signature parameters.
var sensitiveQueryParameters = map[string]struct{}{
	"sts":                  {},
	"sts_a":                {},
	"sts_s":                {},
	"code":                 {},
	"token":                {},
	"access_token":         {},
	"id_token":             {},
	"refresh_token":        {},
	"session_token":        {},
	"x-amz-security-token": {},
	"x-amz-signature":      {},
	"x-amz-credential":     {},
	"awsaccesskeyid":       {},
	"signature":            {},
}

// secretPathPrefixes lists path prefixes whose next segment is a credential.
// Console encodes the complete presigned URL of a shared object into that
// segment, so the path alone replays the share.
var secretPathPrefixes = []string{
	"/api/v1/download-shared-object/",
}

// knownAuthorizationSchemes lists the schemes whose name may survive
// redaction of an Authorization value.
var knownAuthorizationSchemes = map[string]struct{}{
	"basic":            {},
	"bearer":           {},
	"digest":           {},
	"negotiate":        {},
	"ntlm":             {},
	"aws":              {},
	"aws4-hmac-sha256": {},
}

// allowedCookieAttributes lists Set-Cookie attributes that carry no secret.
var allowedCookieAttributes = map[string]struct{}{
	"path":        {},
	"domain":      {},
	"expires":     {},
	"max-age":     {},
	"secure":      {},
	"httponly":    {},
	"samesite":    {},
	"partitioned": {},
	"priority":    {},
}

// Header reports whether the named header carries credentials or session
// material. The comparison is case-insensitive.
func Header(name string) bool {
	_, ok := sensitiveHeaders[strings.ToLower(name)]
	return ok
}

// HeaderValue returns the value to log for one header line. Values of
// non-sensitive headers are returned unchanged. Sensitive values keep only the
// parts that help diagnosis and carry no secret: the scheme of a recognized
// Authorization value, cookie names, and allow-listed Set-Cookie attributes.
// Anything that does not parse is replaced entirely.
func HeaderValue(name, value string) string {
	switch strings.ToLower(name) {
	case "authorization", "proxy-authorization":
		return authorizationValue(value)
	case "cookie":
		return cookieValue(value)
	case "set-cookie":
		return setCookieValue(value)
	}
	if Header(name) {
		return Placeholder
	}
	return value
}

// Headers returns a copy of h with every sensitive value redacted. The input
// is never modified.
func Headers(h http.Header) http.Header {
	if h == nil {
		return nil
	}
	out := make(http.Header, len(h))
	for name, values := range h {
		copied := make([]string, len(values))
		for i, value := range values {
			copied[i] = HeaderValue(name, value)
		}
		out[name] = copied
	}
	return out
}

// HeaderMap redacts a flattened name → value header map, such as the maps an
// audit entry carries. Joined multi-value strings are treated as one value.
func HeaderMap(m map[string]string) map[string]string {
	if m == nil {
		return nil
	}
	out := make(map[string]string, len(m))
	for name, value := range m {
		out[name] = HeaderValue(name, value)
	}
	return out
}

// QueryParameter reports whether the named query parameter carries a
// credential. The comparison is case-insensitive on the decoded name.
func QueryParameter(name string) bool {
	_, ok := sensitiveQueryParameters[strings.ToLower(name)]
	return ok
}

// Values returns a copy of decoded query values with every sensitive
// parameter's values redacted.
func Values(q url.Values) url.Values {
	if q == nil {
		return nil
	}
	out := make(url.Values, len(q))
	for name, values := range q {
		if QueryParameter(name) {
			out[name] = []string{Placeholder}
			continue
		}
		out[name] = append([]string(nil), values...)
	}
	return out
}

// QueryMap redacts a flattened name → value query map.
func QueryMap(m map[string]string) map[string]string {
	if m == nil {
		return nil
	}
	out := make(map[string]string, len(m))
	for name, value := range m {
		if QueryParameter(name) {
			out[name] = Placeholder
			continue
		}
		out[name] = value
	}
	return out
}

// RawQuery redacts a raw (still percent-encoded) query string. Names are
// percent-decoded before classification, so st%73_s is recognized as sts_s.
// The whole query is replaced when it cannot be parsed the way Console's own
// handlers parse it: an unescaped semicolon (rejected by net/url), or a name or
// value with invalid percent-encoding.
func RawQuery(rawQuery string) string {
	if rawQuery == "" {
		return ""
	}
	if strings.Contains(rawQuery, ";") {
		return Placeholder
	}
	parts := strings.Split(rawQuery, "&")
	for i, part := range parts {
		name, value, hasValue := strings.Cut(part, "=")
		decodedName, err := url.QueryUnescape(name)
		if err != nil {
			return Placeholder
		}
		if _, err := url.QueryUnescape(value); err != nil {
			return Placeholder
		}
		if QueryParameter(decodedName) {
			if hasValue {
				parts[i] = name + "=" + Placeholder
			} else {
				parts[i] = name
			}
		}
	}
	return strings.Join(parts, "&")
}

// Path redacts credential-bearing path segments.
func Path(p string) string {
	for _, prefix := range secretPathPrefixes {
		index := strings.Index(p, prefix)
		if index < 0 {
			continue
		}
		start := index + len(prefix)
		end := strings.IndexByte(p[start:], '/')
		if end < 0 {
			end = len(p)
		} else {
			end += start
		}
		if end > start {
			return p[:start] + Placeholder + p[end:]
		}
	}
	return p
}

// URL renders a request URL for a log line with its path and query redacted.
// The original URL is not modified.
func URL(u *url.URL) string {
	if u == nil {
		return ""
	}
	var sb strings.Builder
	if u.Scheme != "" {
		sb.WriteString(u.Scheme)
		sb.WriteString("://")
	}
	sb.WriteString(u.Host) // userinfo is never rendered
	sb.WriteString(Path(u.EscapedPath()))
	if query := RawQuery(u.RawQuery); query != "" {
		sb.WriteByte('?')
		sb.WriteString(query)
	}
	return sb.String()
}

func authorizationValue(value string) string {
	value = strings.TrimSpace(value)
	scheme, _, ok := strings.Cut(value, " ")
	if !ok || scheme == "" {
		return Placeholder
	}
	if _, known := knownAuthorizationSchemes[strings.ToLower(scheme)]; !known {
		return Placeholder
	}
	return scheme + " " + Placeholder
}

func cookieValue(value string) string {
	pairs := strings.Split(value, ";")
	out := make([]string, 0, len(pairs))
	for _, pair := range pairs {
		pair = strings.TrimSpace(pair)
		if pair == "" && len(pairs) > 1 {
			// A trailing separator is harmless; an empty pair elsewhere is not.
			continue
		}
		name, _, ok := strings.Cut(pair, "=")
		if !ok || !isCookieName(name) {
			return Placeholder
		}
		out = append(out, name+"="+Placeholder)
	}
	if len(out) == 0 {
		return Placeholder
	}
	return strings.Join(out, "; ")
}

func setCookieValue(value string) string {
	parts := strings.Split(value, ";")
	name, _, ok := strings.Cut(strings.TrimSpace(parts[0]), "=")
	if !ok || !isCookieName(name) {
		return Placeholder
	}
	out := []string{name + "=" + Placeholder}
	for _, attribute := range parts[1:] {
		attribute = strings.TrimSpace(attribute)
		if attribute == "" {
			continue
		}
		attributeName, _, _ := strings.Cut(attribute, "=")
		if _, allowed := allowedCookieAttributes[strings.ToLower(strings.TrimSpace(attributeName))]; !allowed {
			return Placeholder
		}
		out = append(out, attribute)
	}
	return strings.Join(out, "; ")
}

// isCookieName accepts an RFC 6265 cookie-name: a non-empty HTTP token.
func isCookieName(name string) bool {
	if name == "" {
		return false
	}
	for i := 0; i < len(name); i++ {
		c := name[i]
		switch {
		case c >= 'a' && c <= 'z', c >= 'A' && c <= 'Z', c >= '0' && c <= '9':
		case strings.IndexByte("!#$%&'*+-.^_`|~", c) >= 0:
		default:
			return false
		}
	}
	return true
}
