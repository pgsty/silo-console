# Changelog

## Release v2.7.2

- Sync embedded release metadata (`2.7.2`), `docs/Embedding.md`, `docs/README.md`,
  `README.md`, `README_ZH.md`, and `CHANGELOG.md` for coordinated SILO Server
  `20261112` embedding: record Go 1.27.4, `silo-pkg v3.16.1`, and `mcli 20261112`
  (`v0.0.0-20261111180825-a37a9f054fba`), and document wildcard/interface
  HTTP-to-HTTPS redirect host preservation (`--host 0.0.0.0` /
  `CONSOLE_SECURE_TLS_HOST` with `github.com/unrolled/secure` v1.18.0) and
  in-modal service-account save error reporting.

## Release v2.7.1

- Preserve dynamic parent-policy inheritance when editing service-account
  metadata, use an explicit empty policy document only when clearing an
  existing inline restriction, and render save errors directly inside the
  service-account edit modal instead of behind the open dialog (#88, #89).
- Omit preloaded user-policy JSON when the inline restriction toggle is turned
  off on service-account creation forms, block empty inline submissions
  (including null statements, case-insensitive or Unicode-folded JSON field
  names, and duplicate keys), and surface policy-lookup errors in the UI.
  Preserve unchanged historical empty inline policies during metadata-only
  edits.
- Reject unknown JSON fields, trailing tokens, empty principal objects,
  unsupported `NotPrincipal` blocks, and non-object inputs during IAM,
  service-account, and custom bucket policy write validation so misspelled keys
  cannot silently strip conditions or reset a service account to inherited
  permissions.
- Preserve the incoming request hostname on HTTP-to-HTTPS redirects when
  listening on wildcard or interface addresses such as `--host 0.0.0.0` unless
  `CONSOLE_SECURE_TLS_HOST` is explicitly set, and upgrade
  `github.com/unrolled/secure` to v1.18.0.
- Require Go 1.27.4 across source, CI, and container builds, upgrade GoReleaser
  to v2.20.1, refresh pinned container bases, and adopt released silo-pkg
  v3.16.1 and mcli 20261112 (`v0.0.0-20261111180825-a37a9f054fba`).

## Release v2.7.0

- Add a shared ten-language UI and locale-aware formatting, with Arabic RTL
  layouts and original direction retained for paths, identifiers, policy JSON
  and logs. Preserve unsaved inputs during language changes. Credit the
  Brazilian Portuguese contribution in PR #83.
- Split the nine translated catalogs into independently compressed assets,
  load them eagerly for offline language switching, and cache content-hashed
  assets for one year. Keep HTML revalidated and verify compact labels across
  ten languages at phone, tablet and desktop widths.
- Include system CA roots and a writable `/tmp` in scratch container images
  for HTTPS requests and large multipart uploads, while retaining the non-root
  runtime and explicit private-CA configuration (PR #84).
- Upgrade the Swagger generator to v0.36.7 and runtime/server-middleware to
  v0.33.4. Regenerate array context validators so zero elements do not stop
  validation of later elements. Preserve the customized server and configuration
  import binder; the default API documentation page now loads Redoc 3 as an ES
  module. Route its `/swagger.json` request to the API instead of the frontend
  SPA fallback. Preserve the generated TypeScript API contract.
- Adopt released silo-pkg v3.16.0 and mcli 20261109, pinning MC's calendar
  release to `v0.0.0-20261109021353-e1d4cc5abfe0`. Record the release tags and
  full source commits in `hack/deps-release.json` for downstream embedders.
- Resolve cpuid/v2 v2.4.2, YAML v3.0.6 and gjson v1.20.1 through those
  maintained components, retaining pretty v1.2.2 and its output formatting.
  The module graph also advances go-jose/v4 to v4.1.9; JOSE is absent from the
  standalone Console package dependency set, so this is not a claim of a
  reachable JOSE vulnerability fix in that binary.
- Retain Go 1.27.3, the verified upstream minio-go commit, x/net v0.62.0,
  the existing x/crypto fix, and the tablewriter, runewidth and go-systemd
  compatibility replacements. Console v2.6.0's dependency history is unchanged.
- Simplify CI into explicit permission and platform matrices, use the project
  toolchain version files, and remove automatic test retries and redundant
  settings. Keep the maintained SILO, PostgreSQL, browser, artifact and
  reproducibility checks. Exercise observer renewal with production lease
  defaults and synchronization against the database deadline.
- Start folder-size calculations and decryption-key copying when Console is
  opened over plain HTTP, where browsers omit `crypto.randomUUID` and the async
  Clipboard API. Previously both buttons silently did nothing.
- Let `console usage-worker` trust the same roots as `console server`: it
  accepts `--certs-dir`, trusts `certs/CAs` and Console's public certificate,
  and applies `CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY` to the SILO endpoint only.
  The worker only reads that directory; it neither creates it nor loads
  `private.key`.
- Charge `CONSOLE_USAGE_SCAN_TIMEOUT` for listing time summed across scan
  slices, not for time a bucket spends queued behind others. Many large buckets
  no longer all end `limited` together. Buckets left limited by the earlier
  accounting resume with a full budget on their next retry; stop older usage
  workers before starting 2.7.0 workers so the budget is accumulated
  consistently.
- Return scans interrupted by worker shutdown, including during a database
  write, to the queue with their checkpoint instead of showing them as failed.
- Forget a deleted bucket's saved totals on `s3:BucketRemoved`, including after
  a force delete that emits no object events, so a bucket re-created under the
  same name never shows them. Deletions that cannot be persisted at once are
  retried.
- Without the usage database, retry a busy scanner (HTTP 429) with backoff for
  about 30 seconds before reporting a bucket as failed.
- Reject malformed or truncated multipart uploads with an error instead of a
  request-handler panic.
- Persist bucket changes received by the usage worker's observer when the
  worker stops, so a deletion received during reconciliation is not lost.
- Keep the reveal button and unit selectors of password, URL, e-mail and number
  fields beside the text in Arabic, and restore the task-count badge position.
- Never treat a canceled bucket-usage authorization probe as authorized, and
  build the share-link expiry from Luxon's locale-independent ISO output.

## Release v2.6.0

- Add optional folder and bucket usage scans, retained-version totals, live
  freshness metadata, on-demand refresh, and a durable PostgreSQL-backed usage
  worker. The worker keeps bounded scans resumable, renews observer leases
  independently, and preserves unknown or unavailable measurements instead of
  presenting them as zero.
- Make usage refreshes reliable across reloads and change events, and expand the
  Console integration and browser regression coverage for the maintained SILO
  stack. The optional worker and the matching server APIs require coordinated
  SILO support.
- Validate bucket retention, quota, and replication values before numeric
  conversion; preserve exact JSON integer boundaries and fractional rate labels;
  reject versioning exclusions on locked buckets; and report when a requested
  bucket configuration was not applied.
- Keep quota values and usage totals visible in bucket lists, and improve table,
  card, toolbar, and retained-column layout across narrow widths and fallback
  fonts. Rebuild the embedded frontend assets after the acceptance fixes.
- Hide and disable object details and version controls while a new route is
  rendering, so navigation never leaves the previous object's panel actionable
  under the new URL, including on slow CPUs.
- Apply the three-minute keep-alive default to embedded Console servers as well
  as the CLI, allowing HTTP/2 assets to reuse one connection. Explicitly setting
  `--keep-alive=0` continues to disable reuse.
- Upgrade `golang.org/x/net` to v0.62.0 for GO-2026-6860 and GO-2026-6866, and
  select the `golang.org/x/crypto` revision containing the GO-2026-5932 fix.
  Retain the go-systemd v22.6.0 NetBSD portability pin and the existing
  coordinated SILO dependency selections.

## Release v2.5.1

- Preserve group membership when changing group status. Explicit member arrays
  retain their replacement contract; status-only updates do not replace members.
- Preserve OIDC string-array group permissions and keep session cookies secure
  behind TLS termination when the external HTTPS URL or a trusted proxy identifies
  the secure transport. Do not trust arbitrary forwarded headers.
- Preserve credential exports as exact UTF-8 JSON bytes. ZIP failures before the
  first response byte keep their S3 error status without exposing backend details.
- Restore table and control focus, accessible names and progress values, and keep
  the focused tab visible when its list is resized.
- Adopt silo-pkg v3.15.2, the published mcli 20261026 source, and upstream
  minio-go `v7.4.2-0.20261025165926-320af050c445`. Bucket replication removal accepts
  HTTP 204 while preserving other response errors.
- Use GoReleaser 2.19.0; retain Go 1.27.3 and existing output/platform compatibility
  selections. Rebuild the embedded frontend with version 2.5.1.

Standalone Console and the Console embedded in SILO are separate artifacts.
SILO must select this source and the matching maintained mcli replacement to
include these fixes. Publication status is recorded in GitHub Releases.

## Release v2.5.0

Release date: **2026-10-25**.

### Dependencies and diagnostics

- Use Go 1.27.3, silo-pkg v3.15.1 and the published mcli 20261025 source
  (`dcc78d506f94`). Select upstream minio-go
  `v7.4.2-0.20261020194015-ab93db7ba435` for short multipart stream rejection,
  correct `ReadAt` EOF/negative-offset handling, read/seek bounds after `Stat`,
  and deduplicated batch-delete error results. Upstream v7.4.2 is not yet tagged.
- Retain the tablewriter v0.0.5 API, humanize v1.0.1 formatting, runewidth v0.0.29
  terminal widths and go-systemd v22.6.0 NetBSD compatibility selections.
- Complete the WebSocket closing handshake for Health, Trace, Logs, Watch,
  Speedtest and Profile. Reuse the existing sole reader and bound the Close
  write and peer response to five seconds, without limiting active streams.
  Preserve valid UTF-8 and the protocol's close-reason size limit. This fixes
  high-RTT health-report truncation reported and analyzed by
  [Azat (@azataiot)](https://github.com/azataiot) in
  [#63](https://github.com/pgsty/silo-console/issues/63).
- Preserve the existing timeout close code (1008) when a diagnostic error wraps
  a network or context deadline error, without exposing the internal reason.
- Read health reports with one JSON decoder so the version probe cannot drop
  buffered report frames. Close the response body and reject truncated,
  canceled or failed streams instead of reporting partial data as success.
  Keep madmin v3's signed request, retry and transport settings; the upstream
  [buffer-preservation fix](https://github.com/minio/madmin-go/commit/a6ab0bcca33f72cfe8448eaff9836fb1d54acc32)
  is available in v4 but has not been backported to v3.

### Navigation and overview

- Add a permission-aware Overview landing page with server/drive health, raw
  capacity, data freshness, alerts, quick actions and expandable drive details.
  Group links to Tools, Settings, Monitoring and Identity in four navigation panels.
  Capacity uses server-reported measurements, without an EC usable-capacity
  estimate; missing statistics remain unknown. Metrics remains under Monitoring.
- Group Identity, Monitoring, Settings and Tools, retain one Buckets entry with
  recent buckets, and share Objects/settings navigation. Preserve remembered
  post-login destinations and existing object deep links. Redirect `/browser`
  to `/buckets` and bare bucket administration links to Summary.

### Buckets and objects

- Add sortable, filterable bucket tables with URL query persistence, table/card
  views, large-list virtualization and explicit unknown usage. Show reasons for
  unavailable actions and retain bucket identities through sorting and filtering.
- Discard pending bucket-search updates after navigation so a slow-loading
  object workspace cannot be replaced by the previous list's search URL.
- Coordinate with the Server account-info fix so a refresh immediately reflects
  successful bucket creation and deletion instead of retaining its cached list.
- Preserve wildcard bucket-root grants in workspace entry and list controls,
  including prefix-scoped deletion policies; object permissions remain scoped.
- Preserve JSON error details from API methods with no success body, so rejected
  actions such as changing object tags show the server's error instead of silence.
- Keep the object workspace reachable for write-only users so they can upload;
  object listing and reading retain their own permission checks.
- Add bounded text, Markdown and CSV/TSV previews, source views, safe HTML handling
  and a visible 1 MiB truncation notice. Show secret-free mcli equivalents for
  supported bucket, lifecycle, event and IAM forms.
- Extend Tasks to transfers, ZIP downloads, bulk deletion, non-current cleanup
  and version restoration, with bounded mutation concurrency and safe retries
  limited to failed targets. Cancellation does not undo completed mutations;
  native browser handoff does not prove a download was saved to disk. Singular
  file deletion from object details retains its existing direct request.
- Add keyboard navigation, range selection, current-page Select All, shortcut
  help and context menus that share object-detail permissions and action reasons.

### Identity

- Show user status, direct policies and groups, inherited policy sources and
  access-key counts. Distinguish built-in, modified built-in and custom policies
  with direct user/group assignment counts and impact-aware confirmations.
- Keep default built-ins read-only until explicitly overridden, and offer Reset
  to default for modified built-ins. Preserve drafts across language changes;
  failed policy reloads clear stale editable content and expose Refresh.
- Require Reset to restore the native policy on its first subsequent read,
  with the matching SILO IAM cache fix. Fix OpenID field-label associations,
  defer identity-form errors until interaction and mask remote storage secrets.

### Responsive and accessibility

- Apply neutral light/dark surfaces, system UI fonts, consistent density and
  focus states, reduced-motion behavior and compact Help/Language/Theme controls.
  Use Lucide-based interface icons with retained license notices; preserve
  product artwork, the login hero and temporary-credential sign-in.
- Keep Documentation, Video and Blog/RSS available in Help on every page, with
  hover previews and clickable resource cards. Align the fixed sidebar emblem,
  smaller wordmark, animated collapse control and quieter footer links.
- Place list actions in body toolbars, align configuration tabs and Watch fields,
  and show disabled webhooks with a neutral badge that respects environment overrides.
  Refine responsive login typography, PGSTY links and the four-link footer.
- Add a mobile navigation drawer, automatic tablet rail with saved preference
  precedence, responsive table columns and retained toolbar actions. Object
  details use a mobile sheet with keyboard focus restoration; dialogs and forms
  fit narrow screens. Hide the login hero only below 768px.
- Refine page headings, short-table heights, Metrics, Logs, Health and License
  hierarchy. Keep full guidance in Help; Inspect validation appears after field
  interaction or submission instead of marking untouched fields as invalid.
- Stack phone form labels above full-width controls, wrap Profile actions and
  Trace filters, and organize replication fields by site. Keep Trace name and
  status visible with the remaining request data in accessible details. Unify
  help targets, refresh controls, theme contrast and page landmarks.

### Under the hood

- Vendor MDS as a source workspace with retained provenance and license notices;
  share UI primitives and registry-driven navigation without adding a UI or
  animation framework. Keep charts, PDF, Markdown and editor code behind lazy
  boundaries and enforce gzip budgets of 259,000 bytes for initial Login
  JavaScript and 350,000 bytes per chunk.
- Add AST-based Chinese translation coverage and an opt-in standalone GUI
  regression, accessibility and external visual-baseline workflow. Keep the
  Console-screen dictionary deferred while public and shared labels stay eager.
- Add backward-compatible optional `usageUpdatedAt` metadata to bucket-list and
  admin-info responses, and `builtin`, `modified`, `userCount` and `groupCount`
  to policy responses. Older clients can ignore these fields; unavailable
  timestamps and counts remain omitted rather than being reported as zero.

## Release v2.4.2

- Select the published mcli 20261018 source (`fa3b8bf72458`), silo-pkg v3.14.2 and upstream minio-go v7.4.1. This includes failed multipart-upload cleanup after cancellation, UTC retention timestamps and preserved STS durations; parallel GET and ComposeObject remain opt-in.
- Build with Go 1.27.2 and refresh Go x/* dependencies, compress v1.20.3, msgp v1.6.5, etcd v3.7.2, fwd v1.2.1 and cpuid v2.4.1. Retain the go-systemd v22.6.0 portability pin and tablewriter v0.0.5 API.
- Inherit the patched go-jose v4.1.6 and LDAP v3.4.15 module selections from silo-pkg. These packages are not linked into the standalone Console binary; the go-jose 4096-bit RSA JWK limit applies to the Server OIDC integration that uses it.
- Preserve wrapped S3 error responses when reporting bucket versioning failures and return InvalidBucketState explicitly, including when Object Lock prevents versioning suspension.
- Build the frontend with Node 24.22.0 LTS.
- Use GoReleaser v2.18.3 for secret-redaction and release-correctness fixes, golangci-lint v2.15.0 and govulncheck v1.9.0. Rebuild the embedded frontend as version 2.4.2.

## Release v2.4.1

- Restricts the anonymous share proxy to object-content GETs at the configured S3 origin and rejects all redirects. Normal public, signed and versioned object downloads remain available without a new setting. Thanks to [Jiri Pejchal (@jiri-pejchal)](https://github.com/jiri-pejchal) for reporting the internal-metrics exposure in [#52](https://github.com/pgsty/silo-console/issues/52).

- **Breaking authorization change:** uses `admin:ChangeMyPassword` for the Change Password button and session capability; user creation remains governed by `admin:CreateUser`. With the matching Server, a saved CreateUser deny no longer locks the caller's password, and a ChangeMyPassword deny now locks it. Preserve the old combined restriction by denying both actions before upgrading. The updated built-in `readonly` also permits self-service password changes and no longer overrides a separate CreateUser Allow; saved policy overrides retain their old statements. Deploy Server, silo-pkg and Console together. See the [migration guide](https://silo.pgsty.com/compatibility/password-permissions/) for affected policies, mixed-version behavior and rollback limits. This change is independent of the SDK update.
- Uses silo-pkg v3.14.1 and mcli 20260916. Updates upstream minio-go to `v7.3.1-0.20260915093545-32e1f32cb176`, including correct error handling for HTTP 200 CopyObject responses carrying an S3 error; retains streaming Content-Type signing, RDMA TLS trust, listing checksum and restore-status fixes.
- Updates JWX to v3.3.0 for custom JSON field-name escaping, strfmt to v0.27.2 for Go 1.27 hostname validation, and React Router to v7.18.4. Declares playwright-core v1.59.1 explicitly for the accessibility test peer dependency. Rebuilds the embedded frontend and third-party credits.
- Updates knip's indirect smol-toml dependency to 1.8.0, retaining the fix for CVE-2026-85730.
- Stream multi-selection ZIP downloads with cancellation, duplicate protection,
  and native browser downloads when a file writer is unavailable.
- Recover from invalid routes and rendering errors without clearing preferences.
- Finish remaining screen labels and localize icon controls, sign-out and keyboard tooltips.
- Lock CI Actions and test tools; make release timestamps and package metadata deterministic.
- Generate signed checksums, SBOMs and provenance; promote `latest` only after a
  published release passes signature, provenance and anonymous-access checks.
- Bound systemd shutdown and define service state, certificate ownership and hardening.
- Warn before the packaged certificate-directory transition; preserve old keys
  and document retaining the previous path through `CONSOLE_OPTS` before restart.

## Release v2.4.0

Correctness and usability:

- Restores local-proxy source addresses in embedded SILO Console when Server explicitly enables the embedded trust policy. Loopback TCP peers are trusted unless the policy is `none`/`off`; forwarded-chain hops still require explicit list membership. Standalone defaults and rejection of untrusted remote headers are unchanged ([silo#147](https://github.com/pgsty/silo/issues/147)).
- Loads object-browser directories in bounded cursor pages, with explicit page-scoped sorting, filtering and selection; rewind results disclose their row and time limits
- Restricts object-version deletion to the selected key, keeps directory deletion within its trailing-slash prefix, reports listing failures, and isolates each batch item's version ID
- Preserves independent current/noncurrent lifecycle actions, date-based rules and unexposed settings during edits; reads legacy prefixes and removes stale filter representations when saving
- Saves replication-rule deletions as one configuration update, retains shared targets, and uses SILO's delete-configuration operation for the last rule
- Offers an explicit, default-off Governance bypass to authorized users even when retention is set on individual objects rather than as a bucket default
- Aligns create-bucket menus, command actions and forms with session capabilities, retaining resource-scoped and wildcard action grants
- Encodes Watch filters correctly, handles Inspect errors without reading the response twice, and supplies a fallback download filename
- Preserves login after network failures, timeouts and cancelled requests. The legacy API client now rejects transport errors to its caller instead of treating a missing HTTP status as session expiry. Browser regressions cover failed requests and real invalid-session responses; PDF preview tests now require the page to render before passing
- Recovers from malformed sidebar preferences and tolerates cleared versioning state while leaving object details
- Fixes shared dropdowns selecting a stale hovered item on quick clicks or touch; disabled items no longer select a different option, and keyboard selection is preserved

Security and build maintenance:

- Builds with Go 1.27.1 and GitHub Actions `setup-go` v7
- Updates the maintained dependency chain to released `silo-pkg` v3.13.3 and `pgsty/mc` source commit `c8aa5d25`, while keeping `minio-go` on upstream master commit `0e78d3f18efe`
- Preserves distinct Deny/NotResource policy clauses and string-condition values through silo-pkg v3.13.3, fixes Deny detection before indexing, and bounds wildcard matching. Previously lost clauses must be restored from the original policy source; the upgrade cannot recover missing stored statements
- Accepts an unpublished MC source revision only after all four required main-push workflows succeed, while retaining public Go proxy and checksum verification; this Console release does not create a standalone mcli release
- Refreshes the compiled Go dependency closure, including `golang.org/x/crypto` v0.56.0 for the SSH channel denial-of-service fixes, gRPC-Go v1.83.2 for CVE-2026-84304, Protobuf v1.36.12, `klauspost/compress` v1.20.0, Prometheus libraries, JWX v3.2.0 and the current go-openapi line
- Uses `silo-pkg` v3.13.3's strict policy API directly instead of duplicating it around an upstream compatibility floor. Any remaining `minio/pkg` package is transitive legacy code, not the maintained implementation; upstream MinIO/mc builds remain best-effort, non-blocking compatibility signals
- Runs release-gating integration, permissions, replication, SSO, subpath and browser tests against the pinned SILO server and the exact `pgsty/mc` source selected by `go.mod`; upstream server and client probes remain visible but advisory
- Refreshes the embedded frontend dependency closure to remove the fixable Browserslist, fast-uri, qs, decode-uri-component, uuid, structured-clone, and fflate advisories; fflate 0.8.3 is selected throughout the runtime and test dependency graph
- Updates the development SDK's stream-json dependency to 3.5.0 with a small MinIO JavaScript SDK compatibility patch and notification parser tests for its CommonJS and ESM builds
- Updates TestCafe to 3.7.6 locally and in CI, removing its vulnerable `replicator` dependency
- Excludes PDF.js's Node-only native canvas dependency from browser credits so regeneration is consistent across build platforms
- Regenerates the embedded frontend and third-party notices from the final dependency graph; no Console route, API, configuration, or deployment migration is required
- Marks verifier targets as phony so case-insensitive filesystems cannot mistake `CREDITS` for an already-completed `credits` check

## Release v2.3.0

Security:

- Stopped trusting client-controlled `X-Forwarded-For`, `X-Real-IP`, and RFC 7239 `Forwarded` values from arbitrary peers. Standalone Console now accepts an explicit `CONSOLE_TRUSTED_PROXIES` IP/CIDR allow-list, embedded Console follows `MINIO_API_TRUSTED_PROXIES`, and the default is intentionally trust-none
- Walked repeated proxy chains from right to left with bounded work, canonicalized literal IPv4/IPv6 addresses, and failed closed on malformed, catch-all, separators-only, or unreadable remote configuration
- Sanitized Console-to-SILO requests by cloning them, removing every inbound source-address header, and emitting exactly one canonical `X-Forwarded-For` value derived from Console's trust decision
- Restored certificate-chain and host-name verification for every outbound HTTPS connection. The shared transport no longer sets `InsecureSkipVerify`; it trusts the system roots plus `~/.console/certs/CAs` (or the embedding server's CA pool, which includes the server's own certificates), and the pool is attached before the audit and log webhook transports are cloned
- Separated the general client used for identity providers, Prometheus, release checks and the Log Search API from the client used for the SILO endpoint, including a separate STS client inside the OpenID provider; the general client can never be exempted from verification. Existing single-client OpenID constructors remain and use one client for both roles
- Added `CONSOLE_MINIO_SERVER_TLS_SKIP_VERIFY` as an explicit, standalone-only compatibility switch that exempts exactly the configured `https://` SILO origin (host compared case-insensitively with the default port filled in); other hosts and redirects away from that origin stay verified. Deployments that relied on the previous global bypass must add the server's CA or self-signed certificate to the CA directory, ensure the certificate covers the name Console dials, or set the switch deliberately
- Redacted credential-bearing request data from detailed debug logging and audit logging through one shared rule set: `Authorization`/`Proxy-Authorization` keep only a recognized scheme, cookie values and non-standard `Set-Cookie` attributes are removed, STS, SigV4 and SSE-C headers, the `sts`/`sts_a`/`sts_s` session-bootstrap parameters, OpenID `code` and token parameters, presigned-URL parameters (with percent-decoded names) and the encoded shared-object path segment are replaced; unparseable values are replaced whole. Detailed logging previously wrote the decrypted session bearer, which carries live STS credentials
- Stopped storing the STS session token as the request's session identifier. Audit entries and error logs now carry a stable, non-reversible fingerprint (`s-` plus 32 hex characters) derived from the token; records of one session still correlate, and `requestID` remains the per-request key. Migration: tooling that joined audit records on the raw token must join on the fingerprint. With `CONSOLE_LOGGER_ANONYMOUS_ENABLE=on` the emitted `sessionID` and `remoteHost` are additionally hashed, so they do not have the `s-` form
- Removed the decrypted session token from the log line written when a bearer token fails validation
- Bounded Object Manager WebSocket sessions: a 32 KiB frame limit on every `/ws` endpoint, ping/pong keepalive with a 60-second read deadline and 10-second write deadline, validation of mode, request id, bucket name, prefix length and rewind date before anything is allocated, bounded error frames for invalid requests, a cap of four concurrent listings per connection, request ids reserved until their worker exits, one shutdown coordinator that cancels and drains every listing before the socket closes, and a policy close after ten consecutive invalid frames. Cancelled listings no longer surface as 500 errors and rewind listings are attributed to the trust-resolved client address
- Restricted anonymous Object Manager access to handshakes that carry no session cookie at all; an empty, malformed or unreadable cookie is rejected instead of being downgraded to anonymous, and every other WebSocket endpoint rejects a missing cookie before upgrading
- Capped the number of WebSocket connections: `CONSOLE_WS_MAX_CONNECTIONS` (1024) for the process, `CONSOLE_WS_MAX_CONNECTIONS_PER_CLIENT` (256) per client address (IPv4 address or IPv6 /64, trust-resolved), and a separate anonymous budget of `CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS` (64) and `CONSOLE_WS_MAX_ANONYMOUS_CONNECTIONS_PER_CLIENT` (8). A slot is reserved before the upgrade and released when the socket closes, a handshake over a cap is refused with 429 (client cap) or 503 (process total or anonymous budget) and `Retry-After`, and anonymous connections can never exhaust the budget of signed-in users (the anonymous caps must be strictly below the shared caps; equal values are rejected). Previously a peer without credentials could hold an unbounded number of connections, each costing a descriptor and session memory
- Replaced the subpath allow-all WebSocket origin policy with an explicit one: same authority, the `CONSOLE_BROWSER_REDIRECT_URL` authority, a single host asserted by a trusted proxy through `CONSOLE_SECURE_HOSTS_PROXY_HEADERS`, or `CONSOLE_SECURE_ALLOWED_HOSTS`. Subpath deployments whose proxy does not preserve the `Host` header must configure one of these; see docs/Environment.md

Object browser:

- Bound every object-scoped request in the object browser to the bucket, key and version it was issued for: responses that arrive after the user moved to another object, version or bucket are discarded, in-flight requests are aborted, and the detail panel, versions navigator and bucket status never show or act on data from a previous identity
- Made every object action (download, share, preview, tags, retention, legal hold, inspect, rename, restore, delete) use one validated identity resolved from the current listing; actions are unavailable during a version transition, current-object delete semantics are unchanged (no version id, so a delete marker is created in versioned buckets), and an explicitly selected version deletes only that version
- Made the share dialog resolve the exact version it shares before requesting a link, fail closed on delete markers and missing versions, and close together with the preview dialog when the object or bucket changes underneath it
- Added deterministic unit coverage for the identity rules and request ordering, a source-scan guard, and a live browser regression for late responses, version transitions, row actions, history navigation and anonymous browsing; documented the behaviour in docs/ObjectBrowser.md (no configuration or operator migration required)
- Gave the share dialog's copy button (`copy-share-url`) and the credential prompt's copy buttons (`copy-access-key`, `copy-secret-key`, `copy-console-access-key[-n]`, `copy-console-secret-key[-n]`) their own element ids; they duplicated the breadcrumb's `copy-path` id in one document. The live browser regression now gives each mutating test its own object so it passes in any order
- Released upload references on every terminal path: success, HTTP failure, network failure on the request or the upload stream, timeout, abort and setup exceptions now run one idempotent cleanup that drops the transfer-manager trace (the `XMLHttpRequest` and its `FormData`/`Blob`) before reporting the outcome, and each upload promise settles exactly once. Cancelling is explicit: the transfer manager settles the upload itself, so a queued upload that was never sent (the browser fires no `abort` event for it) releases its file too, and a synchronous `send()` failure settles the same way without occupying a concurrency slot (the scheduler counts an upload as running only after its request was handed to the network). Cancelled uploads no longer leave the batch pending: they settle as cancelled, are excluded from the failure summary, and the listing reload after a batch runs even when a file was cancelled. Previously an aborted or failed upload kept the whole file reachable for the lifetime of the tab

Diagnostic tools:

- Made the Logs, Profile and Health pages own their WebSocket: the socket and its heartbeat live in a component-held session that is closed on Stop, on completion or error, and when the page unmounts (route change, logout), so leaving a page stops the server-side log stream, profiling run or health report instead of leaving it running. Callbacks are detached on close, so an unmounted page is never updated, and Start/Stop stay idempotent under React Strict Mode. Previously the cleanup was returned from a click handler, which React never runs
- Bounded the client-side log buffer to the newest 10000 entries and reset the shared "started"/"in progress" flags when their page unmounts, so returning to a page does not show a stream or report that no longer exists

Permission-aware UI:

- Replaced the regular expressions built from policy resources in the session permission check with literal, anchored `*`/`?` wildcard matching that mirrors silo-pkg's resource matcher byte for byte (multiple wildcards, `?` as exactly one byte, `path.Clean` equality, S3 ARN prefix stripped, every other key exact). Resources such as `bucket/foo[bar*`, `data.?` or `a+b*` no longer throw or match the wrong paths, and a grant such as `data*` no longer applies to `mydata/`; SILO remains the authority for every request

Sessions:

- Unified session expiry across the generated API client, the legacy API client and the Object Manager WebSocket: an invalid-session response (401/403 `invalid session`, never a login call or another 401 such as a wrong current password) remembers the router-relative route, clears the local session state and loads the login page, which runs the configured login method (form or identity provider) and returns to the remembered route. The generated client applies the check to rejected responses (its transport rejects every non-2xx response, so the previous fulfilled-only check never ran), reading the JSON body of methods declared without a response format from a clone so the caller's response stays intact, and the legacy client no longer depends on a `localStorage` marker that identity-provider logins never set, so an expired SSO session returns to login instead of surfacing a 401; the WebSocket no longer reloads the page; subpath deployments no longer store the full document path as the return route. The unauthenticated session probe (`GET /api/v1/session`) is never an expiry, and anonymous public-bucket browsing never redirects to login: it has no session to end
- Validated the remembered return route (in-app path only, never a full or protocol-relative URL, never an auth page) and applied the same rule to credential login, the OAuth callback and the protected-route redirect
- Added `accountAccessKey` to the session response (the access key entered at credential or STS login, empty for identity-provider sessions) and made the current-user checks in user details, user deletion and change-password read it instead of `localStorage.userLoggedIn`, which is no longer written; an empty identity never matches. SILO keeps enforcing the self-deletion restriction itself
- Pointed the go-swagger generator at `hack/swagger-header.txt` (the previous NOTICE text) so regenerating the server does not stamp the rewritten NOTICE into every generated file; the `swagger-codegen` gate regenerates byte-identical code again

Release artifacts and attribution:

- Embedded `LICENSE`, `NOTICE` and `CREDITS` in the binary (`console license|notice|credits`), served them at `/legal/LICENSE|NOTICE|CREDITS`, shipped them in new `.tar.gz`/`.zip` bundles next to the unchanged bare executables, in DEB/RPM/APK packages (`/usr/share/licenses/silo-console`, `/usr/share/doc/silo-console`, plus a DEP-5 `copyright` file with the full AGPL text for DEB) and in the container image, and attached them to the GitHub release
- Added `console version` and exact corresponding-source reporting: a release build names its tag, a clean standalone build its commit, an embedded Console the immutable module version the server compiled in, and any other build says that no exact source is available instead of guessing; operators of custom builds can set `CONSOLE_CORRESPONDING_SOURCE_URL` (public https URL without credentials, query or fragment; an invalid value is rejected without suppressing built-in provenance). The License, Login and anonymous pages read the injected page metadata and link the exact source; the image carries it as `io.pgsty.silo-console.source`
- Regenerated `CREDITS` from the union of the Go modules linked on every release target (including the released `pgsty/mc` source replacement, direct `pgsty/silo-pkg` module and upstream minio-go), the production frontend dependency closure and the bundled Inter and Chakra Petch fonts; `go run ./hack/credits check` fails on a stale inventory, a module without a legal file or a stale exception. Rewrote `NOTICE` with the MinIO, Alevsk and Georg Mangold provenance chain and the PGSTY-authored modification statement
- Added `hack/verify-release-artifacts.sh` (matrix, file lists, byte-identical legal files, package license metadata, DEP-5, image labels, embedded texts) and the `release-artifacts` CI job. The tag workflow publishes versioned and `latest` images directly, creates a draft GitHub release, and leaves reviewing and publishing that draft to the maintainer
Release and CI gates:

- Recorded the maintained dependency release chain in `hack/deps-release.json` and added `hack/deps-release-check.sh`: `structural` runs in `make verifiers`; `online` runs before a tagged release, requires every tag to dereference to the recorded commit, and verifies each module through `proxy.golang.org` and `sum.golang.org` from an empty module cache against `go.sum`. The coordinated line directly requires released `silo-pkg` v3.13.0 and selects immutable `pgsty/mc` `RELEASE.2026-09-01T00-00-00Z` by its Go pseudo-version
- Added `e2e/version-metadata.unit.ts` (package version, generated version module and newest CHANGELOG heading must agree; final at release time) and `e2e/license-page.spec.ts` (the License page renders the embedded version); the tag preflight runs the metadata check with `RELEASE_METADATA_MUST_BE_FINAL=1`
- Made tagged releases fail closed: the release preflight now requires, for the exact tagged commit, a completed successful `jobs.yaml` run whose new `Required matrix` summary job succeeded and a `vulncheck.yaml` run whose `Required vulnerability checks` summary succeeded; the summary jobs list every job explicitly and fail on any skipped, cancelled or failed job, API errors block the release, and the accepted run ids and attempts are written to the job summary. A manually dispatched release cannot bypass the gate
- Stabilized the Permissions A and B browser suites: navigation now waits in two observable stages (the routed page rendered, then the control exists and is enabled) with failure messages that name the stage, instead of clicking an enabled-only selector immediately after a full navigation; removed the permanently skipped React test job
- Every TestCafe job now captures a screenshot of each failed test and uploads it as a per-job, per-attempt artifact; docs/Release.md documents the dispatch, tagging, rerun and audit procedure
Dependency and compatibility gates:

- Generated the README's downstream replacement block from `go.mod` between `silo-replacements` markers and added `go run ./hack/replacements check` to `make verifiers`, which now enforces the single maintained `pgsty/mc` source replacement
- Completed the silo-pkg own-module-path migration: all Console source imports now use `github.com/pgsty/silo-pkg/v3`, `go.mod` directly requires released v3.13.0, and the retired `minio/pkg => silo-pkg` and `minio-go => silo-go` replacements are gone
- Added the `downstream-embedder-compat` CI job, which builds a minimal embedder from the published README text, asserts the effective mc replacement and verifies that silo-pkg v3.13.0 is inherited directly
- Updated the upstream floor job to remove only the mc replacement; Console continues to build, vet, test and cross-compile with upstream mc while retaining the direct silo-pkg requirement and upstream minio-go graph
- Updated the CLI selection to the immutable `pgsty/mc` `RELEASE.2026-09-01T00-00-00Z` source commit

## Release v2.2.1

Dependency alignment:

- Routed the compatibility import `github.com/minio/minio-go/v7` to the released `github.com/pgsty/silo-go/v7` v7.3.1 SDK
- Updated the shared package replacement to `github.com/pgsty/silo-pkg/v3` v3.12.2 and the CLI replacement to the corrected `pgsty/mc` release commit for `RELEASE.2026-08-26T17-15-27Z`
- Kept Console's public module requirements on resolvable upstream versions because dependency-module replacements are not inherited; embedders must retain the documented top-level SILO replacements
- Retained the tested upstream `minio/pkg` compatibility floor at v3.6.1 so embedding Console does not unnecessarily raise a server's module graph, and made the log-search permission comparison compile against typed IAM action constants in newer package releases

## Release v2.2.0

Object previews and version history:

- Added a bounded, literal text preview for `.log`, `.txt`, `.json`, and `.xml` objects, with strict UTF-8 validation, a 1 MiB limit, cancellation, retry, anonymous access, and no active-document rendering
- Corrected empty-object previews, stale list-size handling, appended-log previews, and metadata races when switching quickly between objects
- Preserved zero-byte object sizes across REST and WebSocket responses and display them as `0 B`
- Kept S3's valid `null` version ID visible, filtered prefix matches to the exact object before counting versions, and retained history after bucket versioning is suspended or disabled

Downloads and API behavior:

- Made single-folder downloads use the browser's streaming download path instead of retaining the complete ZIP in JavaScript memory
- Made ZIP creation fail fast on list, stat, object-read, entry, close, or copy failures; a partial archive now aborts the HTTP response instead of appearing successful
- Fixed empty and partial byte-range responses, returned `416` with the representation length for malformed or unsatisfiable non-empty ranges, and preserved S3 status codes from lazy object `Stat` failures
- Made download requests settle and clean up exactly once, parse JSON error blobs safely, and revoke generated object URLs
- Multi-selection still uses the existing POST response and therefore remains a browser-memory `Blob`; changing that contract requires a separate API decision

Notifications and configuration:

- Made PostgreSQL and MySQL destination forms emit only their canonical DSN, propagate cleared values, preserve manually entered strings across mode switches, and require both a DSN and table before saving
- Added IPv6-aware MySQL and quote-aware PostgreSQL structured DSN handling, while masking credentials in generated previews
- Rejected database DSNs that SILO's current configuration grammar would split or mutate, before sending them to the Admin API and without returning the submitted secret
- Rendered generic passwords and authentication tokens as password fields, including environment-overridden values
- Honored the server's restart result for configuration add, update, delete, and reset operations, while retaining any earlier pending restart requirement until a restart completes
- Added a non-blocking warning that browser uploads larger than 5 GiB use one non-resumable request and recommends `mcli` for multipart uploads

Dependencies and source builds:

- Updated `minio-go` to v7.3.0 and the shared `silo-pkg` fork to v3.12.1, including the upstream INI import-path migration, lifecycle-filter XML compatibility coverage, and legacy AccountInfo tag decoding for older servers
- Lowered Console's upstream `minio/pkg` source-compatibility floor from v3.11.0 to v3.6.1 and kept strict IAM write checks local to Console's write path instead of importing fork-only policy APIs; SILO embedders should retain the matching top-level `silo-pkg` replacement for full server policy semantics

Reliability, localization, and security:

- Replaced unsafe translated placeholder substitutions with one-pass literal formatting, including values containing `$&`, `$1`, `$'`, backticks, braces, or repeated placeholders
- Applied Prometheus Basic authentication to health checks and root fallback requests, retained Bearer-token precedence, and drained every response so HTTP connections can be reused
- Made anonymous/empty sessions fail fast instead of hanging on an empty-credential Admin request, accepted canonical `401` and legacy `403` invalid-session responses, and fixed redirects below a URL subpath
- Separated user status changes from group membership updates, validated status values, kept failed status toggles in sync, blocked enabling or disabling the signed-in user, and removed the unrelated `admin:EnableUser` requirement from group editing
- Preserved the deprecated combined `PUT /user/{name}` endpoint for compatibility while directing new clients to the independent status and group routes, and reported an unknown status there as a client error instead of a server failure
- Restored permission-based disabling of table row actions, which every screen had been requesting through a prop name the table component no longer reads, so view, edit, and delete buttons stayed clickable without the matching permission
- Kept request-scoped Access Key expiry conditions, including wildcard admin actions, available in the UI while leaving final authorization to SILO; preserved read-only Access Key details across self and managed-user screens with independent List/Create/Update/Remove gates; and added an OIDC create/list/get/delete integration regression through the UI's explicit-credential endpoint with the expected self-update denial
- Added language and dark-mode controls to anonymous object-browser pages
- Stopped anonymous pages from issuing protected Object Lock and retention requests that could only produce noisy `Access Denied` errors
- Rejected malformed policies and bare S3 ARNs on named-policy and service-account write paths with a client error before sending an Admin API request; historical reads remain permissive, but an incompatible stored policy must be corrected before it can be saved again
- Removed dead frontend exports and dependencies, refreshed vulnerable transitive dependency resolutions, and expanded vulnerability checks to pushes, manual runs, development dependencies, and immutable installs
- Made Swagger and frontend asset generation fail immediately instead of masking a missing or failed Yarn command
- Replaced the ARN handler test's live localhost dependency with deterministic registration coverage
- Made the SSO gate hermetic: it no longer edits `/etc/hosts` through `sudo` or installs BeautifulSoup, picks its own console port, restores global client state, tears down its containers, and runs against a pinned SILO release instead of the latest upstream image
- Aligned the integration gate with the `416` range responses it was still asserting as server errors, and stopped it publishing its PostgreSQL fixture on the host port so the suite runs on machines that already serve 5432
- Made the browser gates runnable away from Linux by publishing the subpath fixture ports instead of relying on host networking, corrected a permissions selector still matching the pre-fork `MinIO administrator` wording, and gave the CI matrix a manual dispatch trigger
- Made Playwright CI install the committed dependency graph immutably and run it once, and serialized the two TestCafe suites that mutate shared browser or identity state
- Restored the intended `testrunmain` build-tag boundary for the Docker-backed integration, replication, and SSO suites, so ordinary `go test ./...` runs no longer start an incomplete external environment

## Release v2.1.1

- Fixed the metrics legend builder so a `{{label}}` placeholder it cannot resolve is removed instead of leaking literal braces into the Traffic legends
- Escape-proofed the remaining legend substitution branch, so label values containing `$&` or `$1` no longer corrupt legend text
- Corrected the version reported on the License page, which still read 2.0.0

## Release v2.1.0

Internationalization:

- Added a zero-dependency English/Chinese interface covering every console screen, with a 文/A toggle on every page
- Kept English source strings as the dictionary keys, so an untranslated string falls back to English instead of breaking
- Localized help topics, documentation deep links, and the blog feed per language; the command palette matches both languages
- Unified timestamps on `yyyy-MM-dd HH:mm[:ss] (ZZZZ)` in both languages, replacing a 12-hour clock without AM/PM
- Persisted the language preference in `localStorage` with no browser-locale detection and English as the default

Metrics:

- Migrated all 26 dashboard widgets from Metrics V2 to Metrics V3 query names
- Aggregated per-node duplicated cluster gauges with `max()`/`min()` instead of summing them
- Added explicit zero-guards so the server's zero-value skip reads as 0 or "no data" rather than a missing panel
- Replaced the V2-only heal/scan activity rows with Erasure Health and Usage Data Age cards
- Removed the unused Prometheus label-values prefetch that delayed every widget request by up to a second
- Added a regression suite pinning widget queries to the V3 catalog, plus a V2 to V3 mapping document

Additional Changes:

- Fixed a redirect loop when an expired session opened a deep link
- Escape-proofed all placeholder substitutions, so bucket and object names containing `$&` or `$'` no longer corrupt rendered text
- Replaced the untranslatable vendor "Select" header with a select-all checkbox that preserves filter-hidden selections
- Named collapsed sidebar controls for screen readers and declared autocomplete intent on Access Key fields
- Made mobile metrics and bucket panels scroll instead of clipping, and reflowed the dense Traffic and Resources panels
- Fixed the speedtest control row overflow and accepted seconds or minutes for the test duration
- Removed the last SUBNET remnants from health reporting; no health or diagnostic data leaves the deployment
- Regenerated the embedded frontend payload, which had still carried the v2.0.0 build
- Closed every issue filed against v2.0.0: #1 through #8

## Release v2.0.0

Distribution Changes:

- Rebranded the project and user interface as SILO Console
- Moved the public source and release project to `pgsty/silo-console`
- Renamed release binaries, packages, checksums, and container images to `silo-console`

Compatibility:

- Retained the `github.com/minio/console` Go module and existing `CONSOLE_*` environment variables
- Retained `minio-console.service`, `console-user`, and `/etc/default/console` for package upgrades
- Disabled automatic self-update while preserving explicit release and package upgrades
- Added `SILO_RELEASE_SERVICE_HOST` with `RELEASE_SERVICE_HOST` as a compatibility fallback

Additional Changes:

- Added SILO branding across login, navigation, help, metadata, and responsive layouts
- Routed product documentation and blog content to `silo.pgsty.com`
- Expanded the in-product license, source, attribution, and trademark disclosures
- Displayed the connected server and Console versions without issuing protected admin requests for unauthorized users
- Deferred the optional SILO Blog feed request until the Blog tab is opened
- Fixed narrow-screen dashboard and help-menu layouts
- Rebuilt and deterministically precompressed the embedded frontend with the current Vite production pipeline
- Corrected precompressed asset negotiation for HTTP methods and `Accept-Encoding` quality values
- Updated Go to 1.26.5 and remediated applicable runtime and build-tool dependency advisories, including the React Router 7 migration
- Removed ineffective lazy imports so the production build preserves the intended route-level code splitting
- Added APK packaging and hardened the tag-driven release workflow with reproducible asset verification

## Release v1.9.1

Bug Fix:

- Updated project dependencies
- Updated go version from 1.24.10 to 1.24.11 to fix Security vulnerability

## Release v1.9.0

Breaking Change:

- ODIC: `CONSOLE_IDP_CALLBACK` and `MINIO_BROWSER_REDIRECT_URL` now expect the Console URL without `/oauth_callback` at the end

Features:

- Supports Prometheus basic auth
- ReadOnly and disabled feature for CodeEditor, SpeedtestResult Json
- Adds View to see Health Info Report Results as JSON Preview
- New SSO URL `/sso` for auto redirect to OIDC Provider
- Shows and option to load more than 20 versions
- Login page shows an indicator that LDAP is enabled
- Use Quota Size field instead of the deprecated Quota field
- Console container now runs rootless as user 1000:1000
- Show console package version on license page

Bug Fix:

- Some OIDC confussion around ROLE_POLICY vs. ROLE_ARN
- Fix download option in file preview
- Set goreleaser bindir for linux packages to /usr/local/bin
- Fix tag retrieval in ObjectDetailPanel component
- Fix metrics display for objects sizes between 1024B and 1MB

Additional Changes:

- Alot of dependencies updates

## Release v1.8.1

Release focuses on debranding by dropping **MinIO®** from names and logos

Features:
- OIDC SSO Login support see [docs](./docs/OIDC.md)
- Self-Update of binarys over Github Releases with `./console update`

Deprecations:
- Deprecates CONSOLE_ANIMATED_LOGIN animated Login video background 
- Deprecates Inclusion of sourcemaps in Prod Releases of Web-App

Build:
- web-app frontend build size 28 MB down to 9 MB
- reduced binary size ~60 MB to ~45 MB

Pictures see releases 

## Release v1.8.0

This release is bringing back long-deprecated features:

- Undeprecated Lifecyle and Tierung UI (minio#3470)
- Undeprecated Site Replication in UI (minio#3469)
- Unremoved Tools support (minio#3467)
    - Health Info
    - Speedtest
    - Profiling
    - Inspect
    - Trace
    - Watch
- Removed Subnet, Registration, Call Home Support again after Revert
- Small License and Login Page updated

## Release v1.7.8

Bug Fix:

- Fixed Dependencies vulnerabilities + updated Dependencies
- Allow console to recognize s3.Delete*
- Fix regex pattern in webhook management
- Fix golangci-lint issues 
- Decreased Browser direct download threshold to 5GiB

## Release v1.7.7

There are actually no changes compared to v1.7.6; I'm just getting the release and builds ready.
- Binary Releases
- Packages
- Container Builds

See Releases

## Release v1.7.6

Bug Fix:

- Fix null pointer exception in Admin Info
- Ignore leading or trailing spaces in login request
- Fix file path on drag and drop
- Fix typo in User DN Search Filter example

## Release v1.7.5

Bug Fix:

- Fixed leaks during ZIP multiobject downloads
- Allow spaces in Policy names

## Release v1.7.4

Deprecations:

- Deprecated support tools User Interface in favor of mc admin commands. Please refer to the [SILO Client documentation page](https://silo.pgsty.com/reference/minio-mc/) for more information.
- Deprecated Site replication User Interface in favor of mc admin commands. Please refer to the [SILO Site Replication page](https://silo.pgsty.com/reference/minio-mc-admin/mc-admin-replicate/) for more information.
- Deprecated Lifecycle & Tiers User Interface in favor of mc admin commands. Please refer to the [SILO Tiers page](https://silo.pgsty.com/reference/minio-mc/mc-ilm-tier/) for more information.

Bug Fix:

- Avoid loading unpkg.com call when login animation is off

## Release v1.7.3

Bug Fix:

- Use a fixed public license verification key
- Show non-expiring access keys as `no-expiry` instead of Jan 1, 1970
- Use "join Slack" button for non-commercial edition instead of "Signup"
- Fix setting policies on groups that have spaces

## Release v1.7.2

Bug Fix:

- Fixed issue in Server Health Info
- Fixed Security vulnerability in dependencies
- Fixed client string in trace message

Additional Changes:

- Remove live logs in Call Home Page
- Update License page

## Release v1.7.1

Bug Fix:

- Fixed issue that could cause a failure when attempting to view deleted files in the object browser
- Return network error when logging in and the network connection fails

Additional Changes:

- Added debug logging for console HTTP request (see [PR #3440](https://github.com/minio/console/pull/3440) for more detailed information)

## Release v1.7.0

Bug Fix:

- Fixed directory listing
- Fix MinIO videos link

Additional Changes:

- Removed deprecated KES functionality

## Release v1.6.3

Additional Changes:

- Updated go.mod version

## Release v1.6.2

Bug Fix:

- Fixed minor user session issues
- Updated project dependencies

Additional Changes:

- Improved Drives List visualization
- Improved WS request logic
- Updated License page with current MinIO plans.

## Release v1.6.1

Bug Fix:

- Fixed objectManager issues under certain conditions
- Fixed Security vulnerability in dependencies

Additional Changes:

- Improved Share Link behavior

## Release v1.6.0

Bug Fix:

- Fixed share link encoding
- Fixed Edit Lifecycle Storage Class
- Added Tiers Improvements for Bucket Lifecycle management

Additional Changes:

- Vulnerability updates
- Update Logo logic

## Release v1.5.0

Features:

- Added remove Tier functionality

Bug Fix:

- Fixed ILM rule tags not being shown
- Fixed race condition Object Browser websocket
- Fixed Encryption page crashing on empty response
- Fixed Replication Delete Marker comparisons

Additional Changes:

- Use automatic URI encoding for APIs
- Vulnerability updates

## Release v1.4.0

Features:

- Added VersionID support to metadata details
- Improved Websockets handlers

Bug Fix:

- Fixed vulnerabilities and updated dependencies
- Fixed an issue with Download URL decoding
- Fixed leak in Object Browser Websocket
- Minor UX fixes

## Release v1.3.0

Features:

- Adds ExpireDeleteMarker status to BucketLifecycleRule UI

Bug Fix:

- Fixed vulnerability
- Used URL-safe base64 enconding for Share API
- Made Prefix field optional when Adding Tier
- Added Console user agent in MinIO Admin Client

## Release v1.2.0

Features:

- Updated file share logic to work as Proxy

Bug Fix:

- Updated project dependencies
- Fixed Key Permissions UX
- Added permissions validation to rewind button
- Fixed Health report upload to SUBNET
- Misc Cosmetic fixes

## Release v1.1.1

Bug Fix:

- Fixed folder download issue

## Release v1.1.0

Features:

- Added Set Expired object all versions selector

Bug Fix:

- Updated Go Dependencies

## Release v1.0.0

Features:

- Updated Preview message alert

Bug Fix:

- Updated Websocket API
- Fixed issues with download manager
- Fixed policies issues

## Release v0.46.0

Features:

- Added latest help content to forms

Bug Fix:

- Disabled Create User button in certain policy cases
- Fixed an issue with Logout request
- Upgraded project dependencies

## Release v0.45.0

Deprecated:

- Deprecated Heal / Drives page

Features:

- Updated tines on menus & pages

Bug Fix:

- Upgraded project dependencies

## Release v0.44.0

Bug Fix:

- Upgraded project dependencies
- Fixed events icons not loading in subpaths

## Release v0.43.1

Bug Fix:

- Update Share Object UI to reflect maximum expiration time in UI

## Release v0.43.0

Features:

- Updated PDF preview method

Bug Fix:

- Fixed vulnerabilities
- Prevented non-necessary metadata calls in object browser

## Release v0.42.2

Bug Fix:

- Hidden Prometheus metrics if URL is empty

## Release v0.42.1

Bug Fix:

- Reset go version to 1.19

## Release v0.42.0

Features:

- Introducing Dark Mode

Bug Fix:

- Fixed vulnerabilities
- Changes on Upload and Delete object urls
- Fixed blocking subpath creation if not enough permissions
- Removed share object option at prefix level
- Updated allowed actions for a deleted object

## Release v0.41.0

Features:

- Updated pages to use mds components
- support for resolving IPv4/IPv6

Bug Fix:

- Remove cache for ClientIP
- Fixed override environment variables display in settings page
- Fixed daylight savings time support in share modal

## Release v0.40.0

Features:

- Updated OpenID page
- Added New bucket event types support

Bug Fix:

- Fixed crash in access keys page
- Fixed AuditLog filters issue
- Fixed multiple issues with Object Browser

## Release v0.39.0

Features:

- Migrated metrics page to mds
- Migrated Register page to mds

Bug Fix:

- Fixed LDAP configuration page issues
- Load available certificates in logout
- Updated dependencies & go version
- Fixed delete objects functionality

## Release v0.38.0

Features:

- Added extra information to Service Accounts page
- Updated Tiers, Site Replication, Speedtest, Heal & Watch pages components

Bug Fix:

- Fixed IDP expiry time errors
- Updated project Dependencies

## Release v0.37.0

Features:

- Updated Trace and Logs page components
- Updated Prometheus metrics

Bug Fix:

- Disabled input fields for Subscription features if MinIO is not registered

## Release v0.36.0

Features:

- Updated Settings page components

Bug Fix:

- Show LDAP Enabled value LDAP configuration
- Download multiple objects in same path as they were selected

## Release v0.35.1

Bug Fix:

- Change timestamp format for zip creation

## Release v0.35.0

Features:

- Add Exclude Folders and Exclude Prefixes during bucket creation
- Download multiple selected objects as zip and ignore deleted objects
- Updated Call Home, Inspet, Profile and Health components

Bug Fix:

- Remove extra white spaces for configuration strings
- Allow Create New Path in bucket view when having right permissions

## Release v0.34.0

Features:

- Updated Buckets components

Bug Fix:

- Fixed SUBNET Health report upload
- Updated Download Handler
- Fixes issue with rewind
- Avoid 1 hour expiration for IDP credentials

---

## Release v0.33.0

Features:

- Updated OpenID, LDAP components

Bug Fix:

- Fixed security issues
- Fixed navigation issues in Object Browser
- Fixed Dashboard metrics

---

## Release v0.32.0

Features:

- Updated Users and Groups components
- Added placeholder image for Help Menu

Bug Fix:

- Fixed memory leak in WebSocket API for Object Browser

---

## Release v0.31.0

**Breaking Changes:**

- **Removed support for Standalone Deployments**

Features:

- Updated way files are displayed in uploading component
- Updated Audit Logs and Policies components

Bug Fix:

- Fixed Download folders issue in Object Browser
- Added missing Notification Events (ILM & REPLICA) in Events Notification Page
- Fixed Security Vulnerability for `semver` dependency

---

## Release v0.30.0

Features:

- Added MinIO Console Help Menu
- Updated UI Menu components

Bug Fix:

- Disable the Upload button on Object Browser if the user is not allowed
- Fixed security vulnerability for `lestrrat-go/jwx` and `fast-xml-parser`
- Fixed bug on sub-paths for Object Browser
- Reduce the number of calls to `/session` API endpoint to improve performance
- Rolled back the previous change for the Share File feature to no longer ask for Service Account access keys
