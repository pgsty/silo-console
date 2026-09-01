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
	"fmt"
	"net"
	"net/http"
	"net/netip"
	"strings"
	"sync"
	"sync/atomic"
	"unicode"

	"github.com/pgsty/silo-pkg/v3/env"
)

const (
	// EnvConsoleTrustedProxies configures the trusted proxy peers for a
	// standalone Console process. Embedded SILO currently removes CONSOLE_*
	// variables before configuring Console, so it uses EnvMinIOTrustedProxies.
	EnvConsoleTrustedProxies = "CONSOLE_TRUSTED_PROXIES"

	// EnvMinIOTrustedProxies is the fallback trusted proxy policy. It is also
	// the only policy visible to Console when it is embedded in SILO.
	EnvMinIOTrustedProxies = "MINIO_API_TRUSTED_PROXIES"

	trustNoProxies = "none"

	// maxForwardedHops bounds how many chain elements Console examines per
	// request. Real chains are a handful of hops; a longer chain is padding
	// authored by whoever sent it and fails closed to the TCP peer.
	maxForwardedHops = 100
)

var (
	xForwardedFor = http.CanonicalHeaderKey("X-Forwarded-For")
	xRealIP       = http.CanonicalHeaderKey("X-Real-IP")
	forwarded     = http.CanonicalHeaderKey("Forwarded")
)

// sourceIPTrustPolicy is an allow-list of peers whose source-address headers
// may be believed. The zero value trusts nobody.
type sourceIPTrustPolicy struct {
	prefixes []netip.Prefix
}

func (p sourceIPTrustPolicy) contains(ip string) bool {
	addr, err := netip.ParseAddr(ip)
	if err != nil {
		return false
	}
	addr = addr.Unmap()
	for _, prefix := range p.prefixes {
		if prefix.Contains(addr) {
			return true
		}
	}
	return false
}

type sourceIPEnvLookup func(string) (string, string, string, error)

var (
	configuredSourceIPTrust atomic.Pointer[sourceIPTrustPolicy]
	sourceIPTrustConfigured atomic.Bool
	sourceIPTrustConfigMu   sync.Mutex
)

// ConfigureSourceIPTrust reads and installs the process-wide trusted proxy
// policy. Proxy trust is startup configuration and must not be changed while
// requests are being served. Repeated explicit calls re-read the environment so
// startup validation and tests are deterministic.
//
// A malformed or unreadable setting installs the safe trust-none policy before
// returning its error. When CONSOLE_TRUSTED_PROXIES is absent or blank, the
// MINIO_API_TRUSTED_PROXIES policy is used as a compatibility fallback.
func ConfigureSourceIPTrust() error {
	sourceIPTrustConfigMu.Lock()
	defer sourceIPTrustConfigMu.Unlock()
	return configureSourceIPTrustLocked()
}

func configureSourceIPTrustLocked() error {
	policy, err := sourceIPTrustFromEnvironment(env.LookupEnv)
	if err != nil {
		policy = sourceIPTrustPolicy{}
	}
	configuredSourceIPTrust.Store(&policy)
	sourceIPTrustConfigured.Store(true)
	return err
}

// ensureSourceIPTrustConfigured supplies the embedded ConfigureAPI path without
// replacing a policy already validated by the standalone startup path.
func ensureSourceIPTrustConfigured() error {
	if sourceIPTrustConfigured.Load() {
		return nil
	}
	sourceIPTrustConfigMu.Lock()
	defer sourceIPTrustConfigMu.Unlock()
	if sourceIPTrustConfigured.Load() {
		return nil
	}
	return configureSourceIPTrustLocked()
}

func currentSourceIPTrust() sourceIPTrustPolicy {
	if policy := configuredSourceIPTrust.Load(); policy != nil {
		return *policy
	}
	return sourceIPTrustPolicy{}
}

// sourceIPTrustFromEnvironment implements the configuration precedence as a
// pure helper so it can be tested without reconfiguring process-wide state.
func sourceIPTrustFromEnvironment(lookup sourceIPEnvLookup) (sourceIPTrustPolicy, error) {
	value, _, _, err := lookup(EnvConsoleTrustedProxies)
	if err != nil {
		return sourceIPTrustPolicy{}, fmt.Errorf("%s could not be read: %w", EnvConsoleTrustedProxies, err)
	}
	if strings.TrimSpace(value) != "" {
		return parseSourceIPTrust(value, EnvConsoleTrustedProxies)
	}

	value, _, _, err = lookup(EnvMinIOTrustedProxies)
	if err != nil {
		return sourceIPTrustPolicy{}, fmt.Errorf("%s could not be read: %w", EnvMinIOTrustedProxies, err)
	}
	return parseSourceIPTrust(value, EnvMinIOTrustedProxies)
}

func parseSourceIPTrust(value, setting string) (sourceIPTrustPolicy, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", trustNoProxies, "off":
		return sourceIPTrustPolicy{}, nil
	}

	fields := strings.FieldsFunc(value, func(r rune) bool {
		return r == ',' || r == ';' || unicode.IsSpace(r)
	})
	if len(fields) == 0 {
		return sourceIPTrustPolicy{}, fmt.Errorf("%s %q names no proxy", setting, value)
	}

	prefixes := make([]netip.Prefix, 0, len(fields))
	for _, field := range fields {
		if prefix, err := netip.ParsePrefix(field); err == nil {
			prefix, err = canonicalSourcePrefix(prefix)
			if err != nil {
				return sourceIPTrustPolicy{}, fmt.Errorf("%s %q: %w", setting, field, err)
			}
			prefixes = append(prefixes, prefix)
			continue
		}

		addr, err := netip.ParseAddr(field)
		if err != nil || addr.Zone() != "" {
			return sourceIPTrustPolicy{}, fmt.Errorf("invalid %s %q", setting, field)
		}
		addr = addr.Unmap()
		prefixes = append(prefixes, netip.PrefixFrom(addr, addr.BitLen()))
	}

	return sourceIPTrustPolicy{prefixes: prefixes}, nil
}

// canonicalSourcePrefix masks a prefix and rewrites IPv4-mapped IPv6 entries as
// IPv4 prefixes, so that an allow-list entry compares with the unmapped
// addresses the request path produces. Catch-all prefixes are rejected.
func canonicalSourcePrefix(prefix netip.Prefix) (netip.Prefix, error) {
	if prefix.Addr().Zone() != "" {
		return netip.Prefix{}, fmt.Errorf("zoned prefix is not allowed")
	}
	if prefix.Addr().Is4In6() {
		if prefix.Bits() < 96 {
			return netip.Prefix{}, fmt.Errorf("is too broad")
		}
		prefix = netip.PrefixFrom(prefix.Addr().Unmap(), prefix.Bits()-96)
	}
	prefix = prefix.Masked()
	if prefix.Bits() == 0 {
		return netip.Prefix{}, fmt.Errorf("is too broad")
	}
	return prefix, nil
}

// getSourceIPFromHeaders returns a canonical client IP only when the direct TCP
// peer is explicitly allow-listed. Otherwise callers must use RemoteAddr.
func getSourceIPFromHeaders(r *http.Request) string {
	return sourceIPFromHeaders(r, currentSourceIPTrust())
}

// sourceIPFromHeaders resolves the forwarded client address for a request whose
// TCP peer is a trusted proxy. Exactly one header family decides, chosen by
// presence in the order X-Forwarded-For, X-Real-IP, Forwarded: falling through
// to a second family after the first produced no answer would let a client pick
// which proxy-authored claim Console believes. An empty result means the request
// is attributed to the TCP peer.
func sourceIPFromHeaders(r *http.Request, policy sourceIPTrustPolicy) string {
	peer := canonicalSourceIP(r.RemoteAddr)
	if peer == "" || !policy.contains(peer) {
		return ""
	}

	if values := r.Header.Values(xForwardedFor); len(values) > 0 {
		return forwardingChainClient(values, commaElements, canonicalSourceIP, policy)
	}
	if values := r.Header.Values(xRealIP); len(values) > 0 {
		// X-Real-IP carries no chain. Where a client's line and a proxy's line
		// both survive, the last line is the one added closest to Console; an
		// invalid last line must not revive an earlier, client-authored one.
		return canonicalSourceIP(values[len(values)-1])
	}
	if values := r.Header.Values(forwarded); len(values) > 0 {
		return forwardingChainClient(values, forwardedElements, forwardedForAddr, policy)
	}
	return ""
}

// forwardingChainClient walks repeated header lines and their elements from
// right to left, because every proxy appends the peer it observed. The first
// element naming an address outside the trusted allow-list is the attributable
// client. The walk stops at the first element a trust decision cannot be made
// about (malformed text, a host name, an RFC 7239 "unknown" or obfuscated
// identifier, invalid quoting): everything further left was authored by an
// unidentifiable party, so the request falls back to the TCP peer. A chain with
// more than maxForwardedHops elements, or one whose hops are all trusted, falls
// back the same way.
func forwardingChainClient(values []string, split func(string, int) ([]string, bool), addrOf func(string) string, policy sourceIPTrustPolicy) string {
	elements := make([]string, 0, 4)
	for _, value := range values {
		parts, ok := split(value, maxForwardedHops-len(elements))
		if !ok {
			return ""
		}
		elements = append(elements, parts...)
	}
	for i := len(elements) - 1; i >= 0; i-- {
		addr := addrOf(elements[i])
		if addr == "" {
			return ""
		}
		if !policy.contains(addr) {
			return addr
		}
	}
	return ""
}

// commaElements splits an X-Forwarded-For line on commas. A line with more than
// limit elements reports false so the caller fails closed without splitting the
// remainder.
func commaElements(value string, limit int) ([]string, bool) {
	var elements []string
	for {
		comma := strings.IndexByte(value, ',')
		if comma < 0 {
			elements = append(elements, value)
			if len(elements) > limit {
				return nil, false
			}
			return elements, true
		}
		elements = append(elements, value[:comma])
		if len(elements) > limit {
			return nil, false
		}
		value = value[comma+1:]
	}
}

// forwardedElements splits an RFC 7239 Forwarded line on commas that sit
// outside quoted-strings. Unbalanced quoting or more than limit elements
// reports false.
func forwardedElements(value string, limit int) ([]string, bool) {
	return splitOutsideQuotes(value, ',', limit)
}

func splitOutsideQuotes(value string, separator byte, limit int) ([]string, bool) {
	var parts []string
	start := 0
	quoted := false
	for i := 0; i < len(value); i++ {
		switch c := value[i]; {
		case quoted && c == '\\':
			// quoted-pair: the next octet is literal, whatever it is.
			i++
		case c == '"':
			quoted = !quoted
		case !quoted && c == separator:
			parts = append(parts, value[start:i])
			if len(parts) > limit {
				return nil, false
			}
			start = i + 1
		}
	}
	if quoted {
		return nil, false
	}
	parts = append(parts, value[start:])
	if len(parts) > limit {
		return nil, false
	}
	return parts, true
}

// forwardedForAddr returns the canonical IP named by the for= parameter of one
// RFC 7239 Forwarded element, or "" when the element does not identify a
// literal IP unambiguously: a parameter that is not token "=" value, a repeated
// parameter, a missing or empty for=, an "unknown" or obfuscated node, a host
// name, an unbracketed or zoned IPv6 address, or an invalid port.
func forwardedForAddr(element string) string {
	pairs, ok := splitOutsideQuotes(element, ';', maxForwardedHops)
	if !ok {
		return ""
	}
	var forNode string
	var seen []string
	for _, pair := range pairs {
		// Only RFC 7230 OWS (SP / HTAB) may surround a forwarded-pair. Go
		// accepts obs-text in header values, so a Unicode space such as NBSP
		// is network-reachable and must count as a malformed element rather
		// than be trimmed away.
		pair = strings.Trim(pair, " \t")
		name, value, ok := strings.Cut(pair, "=")
		if !ok || !isHTTPToken(name) {
			return ""
		}
		name = strings.ToLower(name)
		for _, previous := range seen {
			if previous == name {
				return ""
			}
		}
		seen = append(seen, name)
		value, ok = forwardedParameterValue(value)
		if !ok {
			return ""
		}
		if name == "for" {
			forNode = value
		}
	}
	if forNode == "" {
		return ""
	}
	return forwardedNodeIP(forNode)
}

// forwardedParameterValue validates value = token / quoted-string and returns
// the unquoted text.
func forwardedParameterValue(value string) (string, bool) {
	if !strings.HasPrefix(value, `"`) {
		return value, isHTTPToken(value)
	}
	if len(value) < 2 || !strings.HasSuffix(value, `"`) {
		return "", false
	}
	var sb strings.Builder
	body := value[1 : len(value)-1]
	for i := 0; i < len(body); i++ {
		c := body[i]
		switch {
		case c == '\\':
			i++
			if i >= len(body) || !isQuotedPairOctet(body[i]) {
				return "", false
			}
			sb.WriteByte(body[i])
		case c == '"' || !isQuotedTextOctet(c):
			return "", false
		default:
			sb.WriteByte(c)
		}
	}
	return sb.String(), true
}

func isHTTPToken(s string) bool {
	if s == "" {
		return false
	}
	for i := 0; i < len(s); i++ {
		if !isTokenChar(s[i]) {
			return false
		}
	}
	return true
}

func isTokenChar(c byte) bool {
	switch {
	case c >= 'a' && c <= 'z', c >= 'A' && c <= 'Z', c >= '0' && c <= '9':
		return true
	}
	return strings.IndexByte("!#$%&'*+-.^_`|~", c) >= 0
}

// isQuotedTextOctet reports whether c may appear unescaped inside an RFC 7230
// quoted-string (qdtext).
func isQuotedTextOctet(c byte) bool {
	return c == '\t' || c == ' ' || c == 0x21 || (c >= 0x23 && c <= 0x5B) || (c >= 0x5D && c <= 0x7E) || c >= 0x80
}

// isQuotedPairOctet reports whether c may follow a backslash inside an RFC 7230
// quoted-string.
func isQuotedPairOctet(c byte) bool {
	return c == '\t' || c == ' ' || (c >= 0x21 && c <= 0x7E) || c >= 0x80
}

// forwardedNodeIP parses an RFC 7239 node value: an IPv4 literal or a bracketed
// IPv6 literal, optionally followed by ":" and a numeric or obfuscated port.
// "unknown", obfuscated node names, host names, zones and unbracketed IPv6
// addresses yield "".
func forwardedNodeIP(node string) string {
	if node == "" || strings.EqualFold(node, "unknown") || node[0] == '_' {
		return ""
	}
	if node[0] == '[' {
		closeBracket := strings.IndexByte(node, ']')
		if closeBracket < 0 {
			return ""
		}
		if rest := node[closeBracket+1:]; rest != "" {
			if rest[0] != ':' || !isForwardedPort(rest[1:]) {
				return ""
			}
		}
		addr, err := netip.ParseAddr(node[1:closeBracket])
		if err != nil || !addr.Is6() || addr.Zone() != "" {
			return ""
		}
		return canonicalNetIP(addr)
	}
	host := node
	if colon := strings.IndexByte(node, ':'); colon >= 0 {
		host = node[:colon]
		if !isForwardedPort(node[colon+1:]) {
			return ""
		}
	}
	addr, err := netip.ParseAddr(host)
	if err != nil || !addr.Is4() {
		return ""
	}
	return addr.String()
}

// isForwardedPort accepts RFC 7239 node-port = port / obfport.
func isForwardedPort(port string) bool {
	if port == "" {
		return false
	}
	if port[0] == '_' {
		for i := 1; i < len(port); i++ {
			c := port[i]
			switch {
			case c >= 'a' && c <= 'z', c >= 'A' && c <= 'Z', c >= '0' && c <= '9', c == '.', c == '_', c == '-':
			default:
				return false
			}
		}
		return len(port) > 1
	}
	return validSourcePort(port)
}

// canonicalSourceIP reduces a source-address value to a bare, canonical IP.
// It accepts the shapes TCP peers and X-Forwarded-For elements take: an IP,
// an IP with a port, or a bracketed IPv6 address with or without a port.
// Host names, unmatched brackets, obfuscated identifiers, and malformed ports
// are rejected. IPv6 zones are accepted but not retained.
func canonicalSourceIP(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}

	var host string
	if strings.HasPrefix(value, "[") {
		closeBracket := strings.IndexByte(value, ']')
		if closeBracket < 0 {
			return ""
		}
		host = value[1:closeBracket]
		remainder := value[closeBracket+1:]
		if remainder != "" {
			if !strings.HasPrefix(remainder, ":") || !validSourcePort(remainder[1:]) {
				return ""
			}
		}
	} else if addr, err := netip.ParseAddr(value); err == nil {
		return canonicalNetIP(addr)
	} else {
		var port string
		var splitErr error
		host, port, splitErr = net.SplitHostPort(value)
		if splitErr != nil || !validSourcePort(port) {
			return ""
		}
	}

	addr, err := netip.ParseAddr(host)
	if err != nil {
		return ""
	}
	return canonicalNetIP(addr)
}

func canonicalNetIP(addr netip.Addr) string {
	if addr.Zone() != "" {
		addr = addr.WithZone("")
	}
	return addr.Unmap().String()
}

// validSourcePort accepts one to five decimal digits denoting a TCP port.
func validSourcePort(port string) bool {
	if port == "" || len(port) > 5 {
		return false
	}
	n := 0
	for i := 0; i < len(port); i++ {
		digit := port[i]
		if digit < '0' || digit > '9' {
			return false
		}
		n = n*10 + int(digit-'0')
	}
	return n <= 65535
}
