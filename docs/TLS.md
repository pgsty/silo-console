## Start Console service with TLS:

Copy your `public.crt` and `private.key` to `~/.console/certs`, then:

```sh
./console server
2021-01-19 02:36:08.893735 I | 2021/01/19 02:36:08 server.go:129: Serving console at http://[::]:9090
2021-01-19 02:36:08.893735 I | 2021/01/19 02:36:08 server.go:129: Serving console at https://[::]:9443
```

For advanced users, `console` has support for multiple certificates to service clients through multiple domains.

Following tree structure is expected for supporting multiple domains:

```sh
 certs/
  │
  ├─ public.crt
  ├─ private.key
  │
  ├─ example.com/
  │   │
  │   ├─ public.crt
  │   └─ private.key
  └─ foobar.org/
     │
     ├─ public.crt
     └─ private.key
  ...

```

## Outbound TLS verification

Console verifies the certificate chain and host name of every HTTPS peer it
connects to: the SILO server and its STS endpoint, identity providers,
Prometheus, the Log Search API, release checks, and audit or log webhooks. The
trust store is the system root store plus every certificate under
`~/.console/certs/CAs` (or the directory given by `--certs-dir`), plus the
`--tls-ca` file when it is set. Console's own serving certificates are added to
that pool as well, so a Console that talks to itself trusts itself.

Embedded in SILO, Console uses the server's pool (`certs/CAs` plus the server's
own public certificates) and dials the address the server advertises to it:
`MINIO_SERVER_URL` when set, otherwise `https://127.0.0.1:<port>`. The server
certificate must cover that name or address, exactly as the server's own
internode transport already requires; set `MINIO_SERVER_URL` to a name the
certificate covers if it does not.

## Connect Console to a compatible server using TLS and a self-signed certificate

Copy the SILO/MinIO-compatible server's `ca.crt` (or, for a self-signed server
certificate, its `public.crt`) under `~/.console/certs/CAs`, then:

```sh
export CONSOLE_MINIO_SERVER=https://localhost:9000
./console server
```

The certificate must include the name Console dials in its Subject Alternative
Names: `localhost` and `127.0.0.1` for the example above. A certificate that
only names the machine's public host name must be addressed by that name.

You can verify that the apis work by doing the request on `localhost:9090/api/v1/...`

### Explicit, endpoint-scoped compatibility switch

When the server certificate cannot be fixed, standalone Console can be told to
skip verification for exactly one peer:

```sh
export CONSOLE_MINIO_SERVER=https://silo.internal:9000
export CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY=on
./console server
```

The exemption applies only to HTTPS requests whose authority equals the
configured `CONSOLE_MINIO_SERVER` origin (host name compared case-insensitively,
default port 443 filled in). Identity providers, Prometheus, webhooks, any
other host, and any redirect away from that origin remain verified. The switch
is ignored, with a logged warning, when `CONSOLE_MINIO_SERVER` is not an
`https://` URL. SILO removes `CONSOLE_*` variables before it configures the
embedded Console, so the switch is standalone-only.
