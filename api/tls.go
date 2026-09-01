// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
	"strings"
	"sync"

	"github.com/pgsty/silo-pkg/v3/env"
)

// ConsoleTransport decorates an outbound request with the client address
// Console resolved for the browser session. It never relays inbound source
// headers: the request is cloned, every X-Forwarded-For, X-Real-IP and
// Forwarded header is removed, and exactly one canonical X-Forwarded-For value
// is emitted when Console has a client address to attest to.
type ConsoleTransport struct {
	Transport http.RoundTripper
	ClientIP  string
}

func (t *ConsoleTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	forwardedReq := req.Clone(req.Context())
	forwardedReq.Header = req.Header.Clone()
	for header := range forwardedReq.Header {
		if strings.EqualFold(header, xForwardedFor) ||
			strings.EqualFold(header, xRealIP) ||
			strings.EqualFold(header, forwarded) {
			delete(forwardedReq.Header, header)
		}
	}

	if clientIP := canonicalSourceIP(t.ClientIP); clientIP != "" {
		if forwardedReq.Header == nil {
			forwardedReq.Header = make(http.Header)
		}
		forwardedReq.Header.Set(xForwardedFor, clientIP)
	}
	return t.Transport.RoundTrip(forwardedReq)
}

// GetConsoleHTTPClient returns the general-purpose outbound client. It always
// verifies its peers with GlobalTransport and is the client for identity
// providers, Prometheus, release checks, the Log Search API and any other
// service that is not the configured SILO endpoint. No compatibility switch
// can weaken it.
func GetConsoleHTTPClient(clientIP string) *http.Client {
	return &http.Client{
		Transport: &ConsoleTransport{
			Transport: GlobalTransport,
			ClientIP:  clientIP,
		},
	}
}

// PrepareSTSClientTransport returns the transport for requests addressed to
// the configured SILO endpoint: S3, Admin and STS calls made on a user's
// behalf. It verifies peers exactly like GlobalTransport unless the operator
// opted into CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY, in which case only the SILO
// HTTPS origin itself is exempt; every other destination, including a redirect
// away from that origin, stays verified.
func PrepareSTSClientTransport(clientIP string) *ConsoleTransport {
	return &ConsoleTransport{
		Transport: minioEndpointTransport(),
		ClientIP:  clientIP,
	}
}

// GetMinIOHTTPClient returns an http.Client built on PrepareSTSClientTransport
// for callers that talk to the configured SILO endpoint, such as
// credentials.STSAssumeRole and the shared-object download path.
func GetMinIOHTTPClient(clientIP string) *http.Client {
	return &http.Client{
		Transport: PrepareSTSClientTransport(clientIP),
	}
}

// PrepareConsoleHTTPClient is retained for compatibility with existing callers;
// it is GetMinIOHTTPClient under its historical name and therefore bound to the
// SILO endpoint policy. New code should name its intent with GetMinIOHTTPClient
// or GetConsoleHTTPClient.
func PrepareConsoleHTTPClient(clientIP string) *http.Client {
	return GetMinIOHTTPClient(clientIP)
}

// endpointScopedTransport routes requests for exactly one HTTPS origin to a
// transport that skips certificate verification and everything else to the
// verified transport. The decision is made per RoundTrip, so every redirect
// hop is evaluated on its own.
type endpointScopedTransport struct {
	origin   string
	verified http.RoundTripper
	insecure http.RoundTripper
}

func (t *endpointScopedTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	if req.URL != nil && strings.EqualFold(req.URL.Scheme, "https") && canonicalHTTPSHostPort(req.URL.Host) == t.origin {
		return t.insecure.RoundTrip(req)
	}
	return t.verified.RoundTrip(req)
}

var (
	insecureMinIOTransportOnce sync.Once
	insecureMinIOTransport     *http.Transport
)

// minioEndpointTransport returns GlobalTransport unless the operator explicitly
// enabled the SILO endpoint compatibility switch for an HTTPS endpoint.
func minioEndpointTransport() http.RoundTripper {
	origin, ok := minioTLSSkipVerifyOrigin()
	if !ok {
		return GlobalTransport
	}
	insecureMinIOTransportOnce.Do(func() {
		insecureMinIOTransport = newHTTPTransport()
		insecureMinIOTransport.TLSClientConfig.InsecureSkipVerify = true
	})
	return &endpointScopedTransport{
		origin:   origin,
		verified: GlobalTransport,
		insecure: insecureMinIOTransport,
	}
}

// getMinIOServerTLSSkipVerify reports whether the operator opted into the
// endpoint-scoped compatibility switch.
func getMinIOServerTLSSkipVerify() bool {
	return strings.ToLower(strings.TrimSpace(env.Get(ConsoleMinIOServerTLSSkipVerify, "off"))) == "on"
}

// minioTLSSkipVerifyOrigin returns the canonical host:port of the configured
// SILO endpoint when the compatibility switch is on and the endpoint is HTTPS.
// An HTTP endpoint never yields an exempt origin, so the switch cannot exempt
// an unrelated HTTPS service that happens to share the host name.
func minioTLSSkipVerifyOrigin() (string, bool) {
	if !getMinIOServerTLSSkipVerify() {
		return "", false
	}
	u, err := url.Parse(getMinIOServer())
	if err != nil || !strings.EqualFold(u.Scheme, "https") || u.Host == "" {
		return "", false
	}
	return canonicalHTTPSHostPort(u.Host), true
}

// canonicalHTTPSHostPort lower-cases the host, strips IPv6 brackets, and fills
// in the default HTTPS port so "silo.example:443", "silo.example" and
// "SILO.example" compare equal.
func canonicalHTTPSHostPort(hostport string) string {
	host, port, err := net.SplitHostPort(hostport)
	if err != nil {
		host, port = hostport, "443"
	}
	if port == "" {
		port = "443"
	}
	host = strings.ToLower(strings.TrimSuffix(strings.TrimPrefix(host, "["), "]"))
	return net.JoinHostPort(host, port)
}
