# Console Metrics: SILO/MinIO Metrics V3 mapping

The dashboard (`/tools/metrics`) queries **Metrics V3 names only** (the
`/minio/metrics/v3` families scraped by the monitoring pipeline). There is no
runtime V2 fallback, probing, or version configuration: SILO Console targets
SILO deployments, where the server, the scrape pipeline (Pigsty scrapes
`/minio/metrics/v3` with `job="minio"` plus `cls`/`ins` identity labels) and
the console ship together. The SILO server keeps serving the V2 endpoints for
external consumers; the console simply no longer uses them.

All widget queries live in `api/admin_info.go` (`widgets`), are guarded by
`api/admin_info_metrics_test.go`, and carry the `{$__query}` selector built
from `CONSOLE_PROMETHEUS_JOB_ID` (default `minio-job`) plus
`CONSOLE_PROMETHEUS_EXTRA_LABELS` (e.g. `cls="<cluster>"` for multi-cluster
isolation — embedded mode: `MINIO_PROMETHEUS_JOB_ID` /
`MINIO_PROMETHEUS_EXTRA_LABELS`).

## V3 semantics the queries must respect

1. **Per-node duplication of cluster groups.** `/cluster/*` metrics carry no
   `server` label and every node exports identical copies, so scraping N nodes
   yields N duplicate series. Cluster-scoped metrics are therefore always
   wrapped in `max()` / `min()` (never `sum()` across nodes).
2. **Zero-value skip.** The server never exports samples with value <= 0, so a
   legitimate zero (no offline drives, full capacity, unhealthy `..._health`
   booleans, empty traffic counters) is *absent*, not `0`. Stat widgets that
   can legitimately read zero append an `or (max(<companion>{...}) * 0)` guard
   whose companion shares the value's lifecycle: cluster-health counts and
   traffic totals guard on `nodes_online_count`; usage counts guard on the
   usage group's own `since_last_update_seconds` (the whole group is absent
   until the first scanner cycle — pre-scan buckets must read as no-data, not
   0); capacity free/used baseline on the always-present capacity total. A live
   cluster renders an explicit 0, while a broken scrape stays empty and the UI
   shows its no-data state ("—" / "No data available") instead of a fabricated
   zero.
3. **Label renames.** The V2 `api` label is `name` in V3 API metrics; per-node
   metrics carry a constant `server` label; drive metrics gain
   `pool_index`/`set_index`/`drive_index`.
4. **Units.** All V3 durations are seconds (V2 heal/scan activity was
   nanoseconds).

## Widget mapping (V2 → V3)

| Widget (ID) | V2 metric | V3 query |
|---|---|---|
| Uptime (1) | `minio_node_process_starttime_seconds` | `min(minio_system_process_uptime_seconds)` |
| S3 Traffic Inbound (65) | `minio_s3_traffic_received_bytes` | `sum(minio_api_requests_traffic_received_bytes)` + zero-guard |
| S3 Traffic Outbound (64) | `minio_s3_traffic_sent_bytes` | `sum(minio_api_requests_traffic_sent_bytes)` + zero-guard |
| Capacity (50) | `minio_cluster_capacity_usable_{total,free}_bytes` | `max(minio_cluster_health_capacity_usable_{total,free}_bytes)` + full-cluster baselines |
| Data Usage Growth (68) | `minio_cluster_usage_total_bytes` | `max(minio_cluster_usage_objects_total_bytes)` |
| Object size distribution (52) | `minio_cluster_objects_size_distribution` | `max by (range) (minio_cluster_usage_objects_size_distribution)` |
| Online Servers (53) | `minio_cluster_nodes_online_total` | `max(minio_cluster_health_nodes_online_count)` |
| Offline Servers (69) | `minio_cluster_nodes_offline_total` | `max(minio_cluster_health_nodes_offline_count)` + zero-guard |
| Online Drives (9) | `minio_cluster_drive_online_total` | `max(minio_cluster_health_drives_online_count)` + zero-guard |
| Offline Drives (78) | `minio_cluster_drive_offline_total` | `max(minio_cluster_health_drives_offline_count)` + zero-guard |
| Number of Buckets (66) | `minio_cluster_bucket_total` | `max(minio_cluster_usage_objects_buckets_count)` + usage-group guard |
| Number of Objects (44) | `minio_cluster_usage_object_total` | `max(minio_cluster_usage_objects_count)` + usage-group guard |
| **Erasure Health (80)** | ~~`minio_heal_time_last_activity_nano_seconds`~~ | `min(minio_cluster_erasure_set_overall_health) or (max(minio_cluster_erasure_set_overall_write_quorum) * 0)` |
| **Usage Data Age (81)** | ~~`minio_usage_last_activity_nano_seconds`~~ | `max(minio_cluster_usage_objects_since_last_update_seconds)` |
| S3 Data Received Rate (63) | `minio_s3_traffic_received_bytes` | `sum by (server) (rate(minio_api_requests_traffic_received_bytes[...]))` |
| S3 Data Sent Rate (70) | `minio_s3_traffic_sent_bytes` | `sum by (server) (rate(minio_api_requests_traffic_sent_bytes[...]))` |
| S3 Request Rate (60) | `minio_s3_requests_total` (`api` label) | `sum by (server,name) (increase(minio_api_requests_total[...]))` |
| S3 Error Rate (71) | `minio_s3_requests_errors_total` | `sum by (server,name) (increase(minio_api_requests_errors_total[...]))` |
| Internode Transfer (17) | `minio_inter_node_traffic_sent_bytes` (×2, bug) | `rate(minio_system_network_internode_{recv,sent}_bytes_total[...])` — distributed mode only; empty on single-node |
| Node CPU (77) | `minio_node_process_cpu_total_seconds` | `rate(minio_system_process_cpu_total_seconds[...])` |
| Node Memory (76) | `minio_node_process_resident_memory_bytes` | `minio_system_process_resident_memory_bytes` |
| Drive Used Capacity (74) | `minio_node_drive_used_bytes` | `minio_system_drive_used_bytes` |
| Drives Free Inodes (82) | `minio_node_drive_free_inodes` | `minio_system_drive_free_inodes` |
| Node Syscalls (11) | `minio_node_syscall_read_total` (×2, bug) | `rate(minio_system_process_syscall_{read,write}_total[...])` |
| Node File Descriptors (8) | `minio_node_file_descriptor_open_total` | `minio_system_process_file_descriptor_open_total` |
| Node IO (73) | `minio_node_io_{rchar,wchar}_bytes` | `rate(minio_system_process_io_{rchar,wchar}_bytes[...])` |

Removed widgets (dead config, referenced by no layout): 51 (Usable Capacity,
duplicate of 50), 61 (Total Open FDs, duplicate of 8), 62 (Total Goroutines).

## The two replaced Info cards

V3 has **no `minio_heal_*` namespace**, and the V2 heal-activity gauge was an
in-memory value that reset on restart and advanced on any heal scan — a weak
signal. Per pgsty/silo-console#8 the two cards are now:

- **Erasure Health** — `1` → Healthy, `0` → Unhealthy (produced by the
  write-quorum guard, because the unhealthy `overall_health` sample itself is
  never exported), empty → Unknown.
- **Usage Data Age** — age of the scanner-produced usage data feeding the
  Usage/Objects/Buckets cards (seconds, restart-safe). Thresholds: < 1 h ok,
  1–24 h warning, > 24 h danger; empty → Unknown.

`BasicDashboard` (Info tab) consumes the same widget results; when Prometheus
is not configured the two rows are hidden, when it is unreachable they render
Unknown.
