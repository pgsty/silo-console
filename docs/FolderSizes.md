# Folder sizes

The object browser lists S3 prefixes as folders. S3 does not attach a size to a
prefix. **Calculate folder sizes** performs one recursive metadata scan of the
current directory and fills its immediate folder rows with current-object
sizes. It never downloads object contents. Opening a folder does not start a scan; the folder Refresh button starts one explicitly.
Use a folder's actions menu → **Calculate size** to narrow a large scan.

**Include retained versions** additionally lists older object versions and delete
markers. The Size column continues to show current bytes; retained bytes appear
separately. A latest delete marker contributes no current bytes, while older
versions behind it still contribute retained bytes. Zero-byte directory-marker
objects count as objects. Logical object bytes do not measure physical disk
allocation, compression, erasure coding, filesystem snapshots or replicas.

The panel shows progress, entry counts and calculation time. **Cancel** stops the
request and S3 pagination. Results are local to the current view and session;
navigation clears them. Recalculate after changing objects. Listings are live,
not an atomic snapshot: objects can change while a scan is running.

Only **Completed** means the listing finished. While running, canceled, limited
or failed, values carry a ≥ / Partial label and must not be used as complete
capacity totals. A permission failure, broken connection or interrupted response
never becomes a zero-sized folder. Scan a narrower prefix when limits are hit.
Size sorting uses calculated bytes for folders already included in the scan and
ordinary object metadata for files; as elsewhere, sorting covers loaded rows.

## Permissions and limits

Scanning requires a signed-in Console session with `s3:ListBucket` access to the
requested prefix. Version scans require `s3:ListBucketVersions`. The API always
uses that session's S3 credentials, including STS session tokens. It does not
use server administrator credentials, change objects or expose anonymous scans.

Operators can configure each Console process using these environment variables:

| Variable | Default | Accepted range |
| --- | --- | --- |
| `CONSOLE_PREFIX_USAGE_TIMEOUT` | `10m` | `1s`–`1h` |
| `CONSOLE_PREFIX_USAGE_MAX_ENTRIES` | `10000000` | 1–1000000000000 |
| `CONSOLE_PREFIX_USAGE_MAX_FOLDERS` | `1000` | 1–10000 |
| `CONSOLE_PREFIX_USAGE_MAX_CONCURRENT` | `2` | 1–64 |
| `CONSOLE_PREFIX_USAGE_PROGRESS_INTERVAL` | `1s` | `100ms`–`30s` |

Concurrency is per process. A busy process returns HTTP 429; the UI permits one
active scan per browser view. A time, entry or child-folder limit returns a
terminal partial result and cancels further listing requests. Invalid operator
configuration refuses scans rather than removing their limits.

## API

`GET /api/v1/buckets/{bucket}/prefix-usage?prefix=&versions=false&folders=true`
uses the normal authenticated Console API. Supply `prefix=` for the bucket root,
or a prefix ending in `/`. Set `folders=false` to calculate only this prefix.

The response is `application/x-ndjson`. Each line is a `prefixUsageFrame` defined
in `swagger.yml`: bucket/prefix/mode identity, start/update times, scanned entry
count, aggregate usage and child-folder usage. Byte values are decimal strings
so JavaScript does not round totals larger than 2^53. Frames end in `complete`,
`limited` or `failed`; missing or invalid terminal data is an incomplete result.
Initial listing failures preserve permission/not-found status before streaming.
Consumers should cancel the request when they stop reading.

Run `go test ./api -run TestPrefixUsage`, frontend `yarn typecheck`, and
`yarn exec playwright test --project=unit e2e/prefix-usage.unit.ts` for focused
checks. `e2e/prefix-usage.spec.ts` also runs against a real SILO backend and
Console: it owns a generated fixture bucket, checks pagination and version
accounting, exercises the folder UI, and removes every fixture version/marker.
Use the existing `CONSOLE_TEST_ENDPOINT`, `CONSOLE_TEST_ACCESS_KEY` and
`CONSOLE_TEST_SECRET_KEY` settings, plus `SILO_TEST_ENDPOINT` for the S3 endpoint.
Never point fixture tests at a bucket owned by an operator.


## Bucket refresh and automatic updates

On **Buckets**, **Refresh** requests a new metadata scan for every listed bucket,
including those hidden by the search filter. The table and cards show **Current
size**, retained-version bytes, per-bucket completion time, queued/running state,
and scan progress. Last completed totals stay visible while new work runs. A
queue acceptance is not a completed scan. Unknown totals remain unknown; partial
progress never replaces a completed total. Sorting uses exact integer bytes.

Inside a bucket, **Refresh** refreshes the object listing and calculates the
current directory's immediate folder sizes. **Calculate size** in a folder's
menu narrows that scan. These foreground scans are cancellable and end on
navigation; no background folder scan starts merely by browsing.

### Optional persistent worker

For durable bucket refresh and automatic updates, provide
`CONSOLE_USAGE_DATABASE_URL` to the Console and run **the same build** as
`console usage-worker`. PostgreSQL is required only for this optional mode. The
worker owns schema migrations and needs CREATE in its dedicated database's
public schema. Browser processes never migrate in response to a request. Use a
verified TLS database URI and a bounded connection pool. Keep worker credentials
out of browser processes.

Both processes use the identical `CONSOLE_MINIO_SERVER` endpoint and database.
Set `CONSOLE_USAGE_S3_ACCESS_KEY`, `CONSOLE_USAGE_S3_SECRET_KEY` and optionally
`CONSOLE_USAGE_S3_SESSION_TOKEN` only on the worker. Its dedicated S3 policy is:

```json
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:ListAllMyBuckets","s3:ListenNotification"],"Resource":["*"]},{"Effect":"Allow","Action":["s3:GetBucketLocation","s3:ListBucket","s3:ListBucketVersions","s3:ListenBucketNotification"],"Resource":["arn:aws:s3:::*"]}]}
```

No object-read, object-write or administrative action is needed. Console API
requests independently probe the caller's root listing permissions before
returning or refreshing any saved aggregate. A denied version-list request omits
retained bytes/counts, delete markers and version scan progress. SILO currently
permits ListBucket as a compatibility fallback for ListBucketVersions; the API
honors the permissions the storage server actually grants. Prefix-restricted
callers cannot retrieve a whole-bucket aggregate. Revocation is checked again
on every status request. API responses are `Cache-Control: no-store`.

The worker subscribes to authenticated storage mutation notifications. Creates,
overwrites, completed multipart uploads and removals invalidate the affected
bucket. Repeated or reordered events coalesce into one queued scan, rather than
adding or subtracting potentially duplicated byte deltas. Changes during a scan
request a follow-up generation. Requests are durable in PostgreSQL, prioritized
for explicit refreshes and claimed with expiring, fenced leases. Workers yield
between bounded time slices; pagination resumes only after a whole object key
and all its versions, so a key spanning multiple version pages is not skipped.

The live notification subscription has **no durable replay guarantee**. Startup
and reconnect invalidate existing totals for reconciliation. Frequent bucket
inventory checks discover new buckets without rescanning unchanged buckets. A
separate full reconciliation covers gaps and changes not represented in the
stream. Coverage is visibly degraded until the connection and its reconciliation
recover. A completed scan is a live listing, not an atomic filesystem snapshot.

Without the database, Refresh performs bounded foreground metadata scans and the
UI explicitly says automatic updates are unconfigured. Navigating away stops
those scans; completed totals are not shared across replicas in this mode.

### Worker and API settings

All names below start with `CONSOLE_USAGE_`. Durations use Go duration syntax.
Invalid, missing required or incompatible settings fail closed.

| Suffix | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | unset | PostgreSQL URI; opts web processes into persistent mode |
| `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_SESSION_TOKEN` | unset | Dedicated worker identity; token optional |
| `HTTP_ADDRESS` | `:9091` | Internal worker health/metrics listener |
| `POOL_MAX_CONNECTIONS` | 4 | Connections per process |
| `CONCURRENT_SCANS` | 1 | Concurrent worker scan slices |
| `MAX_ENTRIES` | 100000000 | Maximum entries per full bucket scan |
| `SCAN_TIMEOUT` | `30m` | Maximum full-scan elapsed time across slices |
| `SCAN_SLICE` | `5s` | Fair scheduling slice, completed at a whole-key boundary |
| `LEASE` | `2m` | Scan and observer lease lifetime |
| `HEARTBEAT` | `15s` | Lease/coverage heartbeat and operation budget |
| `PROGRESS_INTERVAL` | `1s` | Progress persistence cadence |
| `POLL_INTERVAL` | `1s` | Queue and event flush cadence |
| `EVENT_DEBOUNCE` | `5s` | Combine bursts of mutation events |
| `MIN_SCAN_INTERVAL` | `1m` | Minimum spacing for automatic rescans; manual refresh bypasses it |
| `RECONCILE_INTERVAL` | `15m` | Cheap new-bucket inventory check |
| `FULL_RECONCILE_INTERVAL` | `24h` | Full safety-net scan, independent of immediate event/refresh work |
| `RETRY_INTERVAL`, `MAX_RETRY_INTERVAL` | `30s`, `15m` | Exponential retry bounds |
| `AUTH_CONCURRENCY` | 4 | Caller permission probes per API request |
| `API_MAX_REQUESTS` | 8 | Concurrent usage API requests per Console process |
| `REQUEST_TIMEOUT` | `15s` | Usage API deadline |
| `UI_POLL_INTERVAL` | `2s` | Pending-work status polling; idle views poll at ten times this interval, capped at one minute |

Entry counts, scan duration, concurrency and request budgets have validated
finite ranges; see `pkg/usage/config.go`. Scan limits preserve the last successful
observation and expose `limited`; operators can raise the configured budget or
use a smaller foreground prefix. An error, outage or scan limit is never a zero.

`POST /api/v1/bucket-usage/status` returns saved observations and coverage.
`POST /api/v1/bucket-usage/refresh` queues priority work and returns HTTP 202.
Both accept `{"buckets":["example-bucket"]}` with at most 1000 names. The frontend
batches larger inventories. They use the normal authenticated Console session,
not the worker identity. Exact byte values remain decimal strings.

The internal worker exposes `/health` for process liveness, `/ready` for the
leased event observer and reconciled connection, and `/metrics` for coverage,
queue counts, failures, limits and oldest pending age. These ports must remain
internal. A live process is not necessarily a healthy change observer.

Run the real PostgreSQL tests with `go test -tags=integration ./pkg/usage` and the
native SILO/authorization checks with
`go test -tags=integration,storageintegration ./pkg/usage ./api -run TestNative`.
Set `TEST_USAGE_DATABASE_URL`, `TEST_USAGE_S3_ENDPOINT`,
`TEST_USAGE_S3_ACCESS_KEY` and `TEST_USAGE_S3_SECRET_KEY` to disposable fixtures;
missing setup fails these explicit suites. Fixtures create and remove their own
buckets and IAM identities; never run them against operator data. Frontend
`e2e/bucket-usage-refresh.unit.ts` mounts the real hook and usage components in a
browser and covers queue/progress/completion, errors, navigation and precision.

The design follows [S3 event notification guidance](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html)
and [event ordering/duplicate handling](https://aws.amazon.com/blogs/storage/manage-event-ordering-and-duplicate-events-with-amazon-s3-event-notifications/):
notifications trigger idempotent work, while reconciliation repairs delivery gaps.
