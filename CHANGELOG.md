# Changelog

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

Reliability, localization, and security:

- Replaced unsafe translated placeholder substitutions with one-pass literal formatting, including values containing `$&`, `$1`, `$'`, backticks, braces, or repeated placeholders
- Applied Prometheus Basic authentication to health checks and root fallback requests, retained Bearer-token precedence, and drained every response so HTTP connections can be reused
- Made anonymous/empty sessions fail fast instead of hanging on an empty-credential Admin request, accepted canonical `401` and legacy `403` invalid-session responses, and fixed redirects below a URL subpath
- Separated user status changes from group membership updates, validated status values, kept failed status toggles in sync, blocked enabling or disabling the signed-in user, and removed the unrelated `admin:EnableUser` requirement from group editing
- Preserved the deprecated combined `PUT /user/{name}` endpoint for compatibility while directing new clients to the independent status and group routes, and reported an unknown status there as a client error instead of a server failure
- Restored permission-based disabling of table row actions, which every screen had been requesting through a prop name the table component no longer reads, so view, edit, and delete buttons stayed clickable without the matching permission
- Kept request-scoped Access Key expiry conditions available in the UI while leaving final authorization to SILO, preserved read-only Access Key details without `admin:UpdateServiceAccount`, and added an OIDC create/list/get/delete integration regression through the UI's explicit-credential endpoint with the expected self-update denial
- Added language and dark-mode controls to anonymous object-browser pages
- Stopped anonymous pages from issuing protected Object Lock and retention requests that could only produce noisy `Access Denied` errors
- Removed dead frontend exports and dependencies, refreshed vulnerable transitive dependency resolutions, and expanded vulnerability checks to pushes, manual runs, development dependencies, and immutable installs
- Made Swagger and frontend asset generation fail immediately instead of masking a missing or failed Yarn command
- Replaced the ARN handler test's live localhost dependency with deterministic registration coverage
- Made the SSO gate hermetic: it no longer edits `/etc/hosts` through `sudo` or installs BeautifulSoup, picks its own console port, restores global client state, tears down its containers, and runs against a pinned SILO release instead of the latest upstream image
- Aligned the integration gate with the `416` range responses it was still asserting as server errors, and stopped it publishing its PostgreSQL fixture on the host port so the suite runs on machines that already serve 5432
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
