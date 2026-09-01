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

package api

import (
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strings"
)

// wsCheckOrigin decides whether a browser may open a WebSocket to Console. It
// never mutates shared state and consults configuration per request. A
// handshake is accepted when one of these holds:
//
//   - no Origin header (non-browser client; cross-site WebSocket hijacking is
//     a browser attack), or development mode;
//   - the Origin authority equals the request Host (same-origin);
//   - the Origin authority equals the authority of CONSOLE_BROWSER_REDIRECT_URL,
//     the configured external origin;
//   - the TCP peer is a trusted proxy and the first configured
//     CONSOLE_SECURE_HOSTS_PROXY_HEADERS header present carries exactly one
//     syntactically valid authority equal to the Origin authority;
//   - the Origin authority matches CONSOLE_SECURE_ALLOWED_HOSTS, with the same
//     exact or anchored-regex semantics the secure middleware applies.
//
// Subpath deployments are no longer exempt; they satisfy one of the rules
// above (a proxy that preserves the Host header already does).
func wsCheckOrigin(r *http.Request) bool {
	origins := r.Header["Origin"]
	if len(origins) == 0 || getConsoleDevMode() {
		return true
	}
	origin, err := url.Parse(origins[0])
	if err != nil || origin.Host == "" {
		return false
	}
	if equalAuthority(origin.Host, r.Host) {
		return true
	}
	if redirect := getConsoleBrowserRedirectURL(); redirect != "" {
		if u, err := url.Parse(redirect); err == nil && u.Host != "" && equalAuthority(origin.Host, u.Host) {
			return true
		}
	}
	if host, ok := trustedProxiedHost(r); ok && equalAuthority(origin.Host, host) {
		return true
	}
	return allowedHostMatches(origin.Host)
}

// equalAuthority compares two host[:port] authorities case-insensitively and
// exactly: a non-default port must match.
func equalAuthority(a, b string) bool {
	return a != "" && strings.EqualFold(a, b)
}

// trustedProxiedHost returns the external authority asserted by a trusted
// proxy. It requires a trusted TCP peer, a configured proxy host header, and a
// single, unambiguous, syntactically valid value; anything else is no answer.
func trustedProxiedHost(r *http.Request) (string, bool) {
	peer := canonicalSourceIP(r.RemoteAddr)
	if peer == "" || !currentSourceIPTrust().contains(peer) {
		return "", false
	}
	for _, header := range GetSecureHostsProxyHeaders() {
		values := r.Header.Values(strings.TrimSpace(header))
		if len(values) == 0 {
			continue
		}
		if len(values) != 1 {
			return "", false
		}
		return validAuthority(values[0])
	}
	return "", false
}

// validAuthority accepts host or host:port (IPv6 bracketed) and nothing else:
// no scheme, path, userinfo, whitespace, or comma-separated list.
func validAuthority(value string) (string, bool) {
	if value == "" || strings.ContainsAny(value, " \t\r\n,/\\?#@") {
		return "", false
	}
	u, err := url.Parse("//" + value)
	if err != nil || u.Host != value || u.Hostname() == "" {
		return "", false
	}
	if port := u.Port(); port != "" && !validSourcePort(port) {
		return "", false
	}
	if strings.HasPrefix(value, "[") {
		if _, _, err := net.SplitHostPort(value); err != nil && !strings.HasSuffix(value, "]") {
			return "", false
		}
	}
	return value, true
}

// allowedHostMatches applies CONSOLE_SECURE_ALLOWED_HOSTS with the semantics of
// unrolled/secure: exact case-insensitive comparison, or, with
// CONSOLE_SECURE_ALLOWED_HOSTS_ARE_REGEX=on, anchored regular expressions.
func allowedHostMatches(host string) bool {
	allowed := GetSecureAllowedHosts()
	if len(allowed) == 0 {
		return false
	}
	if GetSecureAllowedHostsAreRegex() {
		for _, pattern := range allowed {
			re, err := regexp.Compile("^" + pattern + "$")
			if err == nil && re.MatchString(host) {
				return true
			}
		}
		return false
	}
	for _, candidate := range allowed {
		if strings.EqualFold(candidate, host) {
			return true
		}
	}
	return false
}
