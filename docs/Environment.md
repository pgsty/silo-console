# Environment Variable

| Env | |
| --- | -- |
| `CONSOLE_MINIO_SERVER` | "http://localhost:9000" |
| `CONSOLE_MINIO_REGION` | "us-east-1" |
| `CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY` | "off"; standalone only, exempts exactly the `CONSOLE_MINIO_SERVER` HTTPS origin from certificate verification, see [TLS.md](TLS.md) |
| `CONSOLE_HOSTNAME` | "" |
| `CONSOLE_PORT` | 9090 |
| `CONSOLE_TLS_PORT` | 9443 |
| `CONSOLE_SUBPATH` | i.e. /console |
| `CONSOLE_DEBUG_LOGLEVEL` | 0 - 6; credential-bearing headers, query parameters and path segments are redacted at every level, see [Debug.md](Debug.md) |
| `CONSOLE_TRUSTED_PROXIES` | Standalone only: trusted proxy IP/CIDR list; blank falls back to `MINIO_API_TRUSTED_PROXIES` |
| `CONSOLE_SHARE_MINIO_URL` | "off"
| `CONSOLE_SECURE_ALLOWED_HOSTS` | "" |
| `CONSOLE_SECURE_ALLOWED_HOSTS_ARE_REGEX` | "off" |
| `CONSOLE_SECURE_FRAME_DENY` | "on" |
| `CONSOLE_SECURE_CONTENT_TYPE_NO_SNIFF` | "on" |
| `CONSOLE_SECURE_BROWSER_XSS_FILTER` | "on" |
| `CONSOLE_SECURE_CONTENT_SECURITY_POLICY` | "" |
| `CONSOLE_SECURE_CONTENT_SECURITY_POLICY_REPORT_ONLY` | "" |
| `CONSOLE_SECURE_HOSTS_PROXY_HEADERS` | "" |
| `CONSOLE_SECURE_STS_SECONDS` | 0 |
| `CONSOLE_SECURE_STS_INCLUDE_SUB_DOMAINS` | "off" |
| `CONSOLE_SECURE_STS_PRELOAD` | "off" |
| `CONSOLE_SECURE_TLS_REDIRECT` | "off" |
| `CONSOLE_SECURE_TLS_HOST` | "" |
| `CONSOLE_SECURE_TLS_TEMPORARY_REDIRECT` | "off" |
| `CONSOLE_SECURE_FORCE_STS_HEADER` | "off" |
| `CONSOLE_SECURE_PUBLIC_KEY` | |
| `CONSOLE_SECURE_REFERRER_POLICY` | "" |
| `CONSOLE_SECURE_FEATURE_POLICY` | "" |
| `CONSOLE_SECURE_EXPECT_CT_HEADER` | |
| `CONSOLE_PROMETHEUS_URL` | |
| `CONSOLE_PROMETHEUS_AUTH_TOKEN` | |
| `CONSOLE_PROMETHEUS_AUTH_USERNAME` | |
| `CONSOLE_PROMETHEUS_AUTH_PASSWORD` | |
| `CONSOLE_PROMETHEUS_JOB_ID` | "minio-job" |
| `CONSOLE_PROMETHEUS_EXTRA_LABELS` | |
| `CONSOLE_LOG_QUERY_URL` | |
| `CONSOLE_LOG_QUERY_AUTH_TOKEN` | "" |
| `CONSOLE_MAX_CONCURRENT_UPLOADS` | "10" |
| `CONSOLE_MAX_CONCURRENT_DOWNLOADS` | "20" |
| `CONSOLE_DEV_MODE` | "off" |
| `CONSOLE_BROWSER_REDIRECT_URL` | |
| `LOGSEARCH_QUERY_AUTH_TOKEN` | |
| `CONSOLE_IDP_DISPLAY_NAME` | `MINIO_IDENTITY_OPENID_DISPLAY_NAME` |
| `CONSOLE_IDP_URL` | `MINIO_IDENTITY_OPENID_CONFIG_URL` |
| `CONSOLE_IDP_CLIENT_ID` | `MINIO_IDENTITY_OPENID_CLIENT_ID` | 
| `CONSOLE_IDP_SECRET` | `MINIO_IDENTITY_OPENID_CLIENT_SECRET` | 
| `CONSOLE_IDP_CALLBACK` | `MINIO_BROWSER_REDIRECT_URL` | 
| `CONSOLE_IDP_CALLBACK_DYNAMIC` | `MINIO_IDENTITY_OPENID_REDIRECT_URI_DYNAMIC` |
| `CONSOLE_IDP_SCOPES` | `MINIO_IDENTITY_OPENID_SCOPES` | 
| `CONSOLE_IDP_USERINFO` | `MINIO_IDENTITY_OPENID_CLAIM_USERINFO` | 
| `CONSOLE_IDP_ROLE_ARN` | | 
| `CONSOLE_IDP_END_SESSION_ENDPOINT` | |
| `CONSOLE_LDAP_ENABLED` | |
| `CONSOLE_STS_DURATION` | time.Duration format, ie: 3600s, 2h45m, 1h, etc
| `CONSOLE_PBKDF_PASSPHRASE` | |
| `CONSOLE_PBKDF_SALT` | |
| `CONSOLE_LOGGER_JSON_ENABLE` | 
| `CONSOLE_LOGGER_ANONYMOUS_ENABLE` |
| `CONSOLE_LOGGER_QUIET_ENABLE` |
| `CONSOLE_GLOBAL_DEPLOYMENT_ID` |
| `CONSOLE_LOGGER_WEBHOOK_ENABLE` |
| `CONSOLE_LOGGER_WEBHOOK_ENDPOINT` |
| `CONSOLE_LOGGER_WEBHOOK_AUTH_TOKEN` |
| `CONSOLE_LOGGER_WEBHOOK_CLIENT_CERT` |
| `CONSOLE_LOGGER_WEBHOOK_CLIENT_KEY` |
| `CONSOLE_LOGGER_WEBHOOK_QUEUE_SIZE` |
| `CONSOLE_AUDIT_WEBHOOK_ENABLE` |
| `CONSOLE_AUDIT_WEBHOOK_ENDPOINT` |
| `CONSOLE_AUDIT_WEBHOOK_AUTH_TOKEN` |
| `CONSOLE_AUDIT_WEBHOOK_CLIENT_CERT` |
| `CONSOLE_AUDIT_WEBHOOK_CLIENT_KEY` |
| `CONSOLE_AUDIT_WEBHOOK_QUEUE_SIZE` |

## Trusted proxy source addresses

Console uses the resolved client address when it requests STS credentials or
calls SILO on a user's behalf. This address can affect `aws:SourceIp` policy
conditions, so forwarded source headers are ignored unless the request's direct
TCP peer is explicitly trusted.

`CONSOLE_TRUSTED_PROXIES` accepts exact IPv4/IPv6 addresses and CIDR blocks
separated by commas, semicolons, or whitespace. Bare addresses trust one host.
Catch-all `0.0.0.0/0` and `::/0` entries are rejected. Configure proxy addresses,
not client networks, and configure the edge proxy to remove every inbound
`X-Forwarded-For`, `X-Real-IP`, and `Forwarded` header it does not author.

The secure default is to trust no proxy. If neither applicable variable names a
trusted peer, Console uses the TCP peer and ignores all three forwarded source
headers. This intentionally changes deployments that previously relied on
implicit trust. Set the appropriate variable before upgrading when source IP
policies or client attribution must pass through a reverse proxy.

| Deployment | Console inbound policy | SILO API policy | Required setting |
| --- | --- | --- | --- |
| Standalone Console, no reverse proxy | Trust no forwarded headers | Must trust Console's egress peer to preserve the browser client IP | Set `CONSOLE_TRUSTED_PROXIES=none` whenever `MINIO_API_TRUSTED_PROXIES` is present in Console's environment; leaving it unset is only equivalent when the SILO setting is absent too |
| Standalone Console behind a reverse proxy | Trust only the Console-facing proxy peers | Must trust Console's egress peer to preserve the browser client IP | Set `CONSOLE_TRUSTED_PROXIES` for Console ingress and configure the SILO setting separately |
| Standalone Console using one shared list | Fall back to the SILO setting when the Console setting is absent or blank | Trust only listed API peers | Set `MINIO_API_TRUSTED_PROXIES` to every required Console-ingress proxy and Console-egress peer; use this only when one list is correct for both listeners |
| Console embedded in SILO | Trust only peers from the SILO setting | Trust only peers from the SILO setting | Set `MINIO_API_TRUSTED_PROXIES` |

An absent or blank `CONSOLE_TRUSTED_PROXIES` falls back to
`MINIO_API_TRUSTED_PROXIES`; the two lists are only interchangeable when the same
peers front both listeners. `CONSOLE_TRUSTED_PROXIES=none` or `off` explicitly
suppresses the fallback. A malformed, separators-only, catch-all, or unreadable
remote value is an error and fails closed to trust-none. Standalone Console
refuses to start; embedded Console logs the error and retains trust-none.

Forwarded chains are read from the peer backwards. The first address outside
the trusted list is the client. The walk stops, and the request is attributed
to the TCP peer, at the first element that is not a literal IP address: a host
name, an RFC 7239 `unknown` or obfuscated identifier, malformed quoting, a
repeated parameter, or a chain longer than 100 elements. Only one header family
is consulted per request, chosen by presence in the order `X-Forwarded-For`,
`X-Real-IP`, `Forwarded`, so a client cannot choose which proxy-authored header
Console believes; the proxy must remove the families it does not author.

In the current embedded server, SILO removes `CONSOLE_*` variables before it
configures Console. `CONSOLE_TRUSTED_PROXIES` is therefore standalone-only;
embedded deployments must use `MINIO_API_TRUSTED_PROXIES`. That server setting
also governs direct S3 API source attribution, which remains a separate ingress
path from standalone Console.

When a reverse proxy is not listed, requests are attributed to the proxy itself.
This is safe against client spoofing, but a policy that already permits that
proxy address may consequently permit every client arriving through it. Review
IP allow-lists as well as the proxy setting during migration.

## WebSocket origin policy

Browser WebSocket handshakes to `/ws/*` are accepted only when the `Origin`
authority matches the request `Host`, matches the authority of
`CONSOLE_BROWSER_REDIRECT_URL`, is asserted by a trusted proxy (the TCP peer is
listed in `CONSOLE_TRUSTED_PROXIES` or, embedded, `MINIO_API_TRUSTED_PROXIES`,
**and** the first configured `CONSOLE_SECURE_HOSTS_PROXY_HEADERS` header present
carries exactly one host[:port] equal to the Origin authority), or matches
`CONSOLE_SECURE_ALLOWED_HOSTS` (exact, or anchored regular expressions with
`CONSOLE_SECURE_ALLOWED_HOSTS_ARE_REGEX=on`). Requests without an `Origin`
header (non-browser clients) and `CONSOLE_DEV_MODE=on` are accepted.

Subpath deployments are no longer exempt from this check. A reverse proxy that
preserves the full authority (`proxy_set_header Host $http_host;` for nginx;
`$host` drops a non-default port) needs nothing else; otherwise set
`CONSOLE_BROWSER_REDIRECT_URL`, or trust the proxy and have it overwrite
`X-Forwarded-Host` with `CONSOLE_SECURE_HOSTS_PROXY_HEADERS=X-Forwarded-Host`, or
list the public host in `CONSOLE_SECURE_ALLOWED_HOSTS`.

The Object Manager WebSocket (`/ws/objectManager`) allows anonymous connections
only when no session cookie is sent at all; an empty or malformed cookie is
rejected. Every WebSocket frame is limited to 32 KiB. Object Manager sessions
send a ping every 30 seconds and close peers that stay silent for 60 seconds,
bound each write to 10 seconds, accept at most 4 concurrent listings, validate
every request before allocating anything, and close the session after 10
consecutive invalid frames.

## Outbound TLS verification

Console verifies every outbound HTTPS peer against the system roots plus the
certificates in `~/.console/certs/CAs` (standalone) or the server's `certs/CAs`
(embedded). Private or self-signed server certificates belong in that directory.
`CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY=on` is an explicit opt-out that applies
only to the configured `CONSOLE_MINIO_SERVER` HTTPS origin; identity providers,
Prometheus, webhooks and every other destination stay verified. The full
behaviour, including the embedded-server certificate requirement, is described
in [TLS.md](TLS.md).
