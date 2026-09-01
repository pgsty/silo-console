# Debug logging

In some cases it may be convenient to log all HTTP requests. This can be enabled by setting
the `CONSOLE_DEBUG_LOGLEVEL` environment variable to one of the following values:

 - `0` (default) uses no logging.
 - `1` log single line per request for server-side errors (status-code 5xx).
 - `2` log single line per request for client-side and server-side errors (status-code 4xx/5xx).
 - `3` log single line per request for all requests.
 - `4` log details per request for server-side errors (status-code 5xx).
 - `5` log details per request for client-side and server-side errors (status-code 4xx/5xx).
 - `6` log details per request for all requests.

A single line has the following information:

 - Remote endpoint (IP + port) of the request. Note that reverse proxies may hide the actual remote endpoint of the client's browser.
 - HTTP method and URL
 - Status code of the response (websocket connections are hijacked, so no response is shown)
 - Duration of the request

The detailed record (levels 4–6) adds every request and response header, one per line.

## What the log may contain

Detailed logging is meant for troubleshooting and still records operational data: bucket names, object keys and
prefixes in URLs, user agents, client and proxy addresses, request identifiers, and header names. Treat the output
as sensitive.

Credential-bearing values are redacted at every level, with the same rules audit logging uses
(`pkg/logger/redact`):

 - `Authorization` and `Proxy-Authorization` keep only a recognized scheme (`Bearer [REDACTED]`); Console's own
   decrypted session bearer, which carries STS credentials, is therefore never written.
 - `Cookie` keeps cookie names and redacts every value; `Set-Cookie` keeps the cookie name and the standard
   attributes (`Path`, `Domain`, `Expires`, `Max-Age`, `Secure`, `HttpOnly`, `SameSite`, `Partitioned`, `Priority`).
 - `X-Amz-Security-Token`, `X-Amz-Credential`, `X-Amz-Signature`, the SSE-C customer key headers and their MD5
   headers, `X-Api-Key`, `X-Auth-Token`, `X-Token` and `X-Csrf-Token` are replaced entirely.
 - Query parameters `sts`, `sts_a`, `sts_s` (session bootstrap), `code`, `token`, `access_token`, `id_token`,
   `refresh_token`, `session_token`, `X-Amz-Security-Token`, `X-Amz-Signature`, `X-Amz-Credential`,
   `AWSAccessKeyId` and `Signature` are redacted; parameter names are percent-decoded before matching, and a query
   that cannot be parsed is replaced as a whole.
 - The encoded segment of `/api/v1/download-shared-object/<segment>`, which is a complete presigned URL, is
   redacted in debug lines and in the audit `api.path` field.
 - A value that does not parse (an `Authorization` value without a recognized scheme, a malformed cookie pair,
   an unknown `Set-Cookie` attribute) is replaced entirely rather than partially kept.

The session identifier attached to audit entries and error logs (`sessionID`) is a stable, non-reversible
fingerprint of the session (`s-` followed by 32 hex characters), not the STS session token. With
`CONSOLE_LOGGER_ANONYMOUS_ENABLE=on` that fingerprint and `remoteHost` are hashed once more before they are emitted.
