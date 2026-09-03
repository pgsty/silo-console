# Changelog

## Release v2.3.1

Security and build maintenance:

- Builds with Go 1.27.1 and GitHub Actions `setup-go` v7
- Updates the maintained dependency chain to released `silo-pkg` v3.13.2 and immutable `pgsty/mc` `RELEASE.2026-09-03T07-13-05Z` (`a2ef95c0`), while keeping `minio-go` on upstream master commit `0e78d3f18efe`
- Refreshes the compiled Go dependency closure, including `golang.org/x/crypto` v0.56.0 for the SSH channel denial-of-service fixes, gRPC-Go v1.83.2 for CVE-2026-84304, Protobuf v1.36.12, `klauspost/compress` v1.20.0, Prometheus libraries, JWX v3.2.0 and the current go-openapi line
- Uses `silo-pkg` v3.13.2's strict policy API directly instead of duplicating it around an upstream compatibility floor. Any remaining `minio/pkg` package is transitive legacy code, not the maintained implementation; upstream MinIO/mc builds remain best-effort, non-blocking compatibility signals
- Refreshes the embedded frontend dependency closure to remove the fixable Browserslist, fast-uri, qs, decode-uri-component, uuid, and structured-clone advisories; the remaining TestCafe `replicator` advisory is confined to the development-only browser test runner and has no patched release
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
