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
	"regexp"
	"strings"
	"testing"
)

var metricNameRe = regexp.MustCompile(`minio_[a-z0-9_]+`)

// v3WidgetMetrics is the set of SILO/MinIO Metrics V3 metric names the
// dashboard widgets are allowed to reference. It must stay a subset of the
// server's `/minio/metrics/v3?list` catalog; V2 names (minio_s3_*,
// minio_node_*, minio_cluster_capacity_*, ...) must never reappear here.
// See docs/metrics-v3.md for the mapping rationale.
var v3WidgetMetrics = map[string]bool{
	"minio_api_requests_errors_total":                       true,
	"minio_api_requests_total":                              true,
	"minio_api_requests_traffic_received_bytes":             true,
	"minio_api_requests_traffic_sent_bytes":                 true,
	"minio_cluster_erasure_set_overall_health":              true,
	"minio_cluster_erasure_set_overall_write_quorum":        true,
	"minio_cluster_health_capacity_usable_free_bytes":       true,
	"minio_cluster_health_capacity_usable_total_bytes":      true,
	"minio_cluster_health_drives_offline_count":             true,
	"minio_cluster_health_drives_online_count":              true,
	"minio_cluster_health_nodes_offline_count":              true,
	"minio_cluster_health_nodes_online_count":               true,
	"minio_cluster_usage_objects_buckets_count":             true,
	"minio_cluster_usage_objects_count":                     true,
	"minio_cluster_usage_objects_since_last_update_seconds": true,
	"minio_cluster_usage_objects_size_distribution":         true,
	"minio_cluster_usage_objects_total_bytes":               true,
	"minio_system_drive_free_inodes":                        true,
	"minio_system_drive_used_bytes":                         true,
	"minio_system_network_internode_recv_bytes_total":       true,
	"minio_system_network_internode_sent_bytes_total":       true,
	"minio_system_process_cpu_total_seconds":                true,
	"minio_system_process_file_descriptor_open_total":       true,
	"minio_system_process_io_rchar_bytes":                   true,
	"minio_system_process_io_wchar_bytes":                   true,
	"minio_system_process_resident_memory_bytes":            true,
	"minio_system_process_syscall_read_total":               true,
	"minio_system_process_syscall_write_total":              true,
	"minio_system_process_uptime_seconds":                   true,
}

func TestWidgetQueriesUseMetricsV3(t *testing.T) {
	for _, w := range widgets {
		if len(w.Targets) == 0 {
			t.Errorf("widget %d (%s): has no targets", w.ID, w.Title)
			continue
		}
		for _, target := range w.Targets {
			names := metricNameRe.FindAllString(target.Expr, -1)
			if len(names) == 0 {
				t.Errorf("widget %d (%s): no metric name in expr %q", w.ID, w.Title, target.Expr)
				continue
			}
			for _, name := range names {
				if !v3WidgetMetrics[name] {
					t.Errorf("widget %d (%s): %q is not an allowed Metrics V3 name", w.ID, w.Title, name)
				}
			}
			// every metric reference must carry the job/extra-labels selector
			if got := strings.Count(target.Expr, "{$__query}"); got != len(names) {
				t.Errorf("widget %d (%s): %d metric refs but %d selectors in %q", w.ID, w.Title, len(names), got, target.Expr)
			}
			// no stray substitution variables besides the two supported ones
			cleaned := strings.ReplaceAll(target.Expr, "$__query", "")
			cleaned = strings.ReplaceAll(cleaned, "$__rate_interval", "")
			if strings.Contains(cleaned, "$") {
				t.Errorf("widget %d (%s): unsupported $ placeholder in %q", w.ID, w.Title, target.Expr)
			}
		}
	}
}

func TestWidgetIDsUnique(t *testing.T) {
	seen := map[int32]string{}
	for _, w := range widgets {
		if prev, ok := seen[w.ID]; ok {
			t.Errorf("widget ID %d used by both %q and %q", w.ID, prev, w.Title)
		}
		seen[w.ID] = w.Title
	}
}

// Metrics V3 skips exporting any value <= 0, so stat widgets that can
// legitimately read zero must fall back to an explicit 0 while the cluster is
// reachable (guard on a companion metric that shares the value's lifecycle).
// Without the guard, "0 offline drives" and "scrape broken" are
// indistinguishable.
func TestZeroSkippedStatsHaveGuard(t *testing.T) {
	// cluster-health counts and traffic totals: alive == some node online
	const nodesGuard = `or (max(minio_cluster_health_nodes_online_count{$__query}) * 0)`
	for _, id := range []int32{9, 64, 65, 69, 78} {
		w := widgetByID(t, id)
		if !strings.Contains(w.Targets[0].Expr, nodesGuard) {
			t.Errorf("widget %d (%s): missing nodes-online guard in %q", w.ID, w.Title, w.Targets[0].Expr)
		}
	}

	// usage counts: the whole usage group is absent until the first scanner
	// cycle completes, so guarding on nodes_online would fabricate a 0 for
	// pre-scan buckets/objects; guard on the group's own freshness gauge.
	const usageGuard = `or (max(minio_cluster_usage_objects_since_last_update_seconds{$__query}) * 0)`
	for _, id := range []int32{44, 66} {
		w := widgetByID(t, id)
		if !strings.Contains(w.Targets[0].Expr, usageGuard) {
			t.Errorf("widget %d (%s): missing usage-group guard in %q", w.ID, w.Title, w.Targets[0].Expr)
		}
	}

	// capacity: zero free bytes (full cluster) is skipped too; free must
	// baseline on the always-present total, and used must fall back to total.
	capacity := widgetByID(t, 50)
	if len(capacity.Targets) != 3 {
		t.Fatalf("widget 50 (%s): expected 3 targets, got %d", capacity.Title, len(capacity.Targets))
	}
	const freeBaseline = `or (max(minio_cluster_health_capacity_usable_total_bytes{$__query}) * 0)`
	if !strings.Contains(capacity.Targets[1].Expr, freeBaseline) {
		t.Errorf("widget 50 free target: missing full-cluster baseline in %q", capacity.Targets[1].Expr)
	}
	const usedFallback = `or max(minio_cluster_health_capacity_usable_total_bytes{$__query})`
	if !strings.Contains(capacity.Targets[2].Expr, usedFallback) {
		t.Errorf("widget 50 used target: missing full-cluster fallback in %q", capacity.Targets[2].Expr)
	}

	// Erasure health is a bool gauge whose unhealthy (0) sample is skipped;
	// the always-positive overall write quorum provides the 0 baseline.
	const erasureGuard = `or (max(minio_cluster_erasure_set_overall_write_quorum{$__query}) * 0)`
	w := widgetByID(t, 80)
	if !strings.Contains(w.Targets[0].Expr, erasureGuard) {
		t.Errorf("widget 80 (%s): missing erasure-health guard in %q", w.Title, w.Targets[0].Expr)
	}
}

// Cluster-scoped V3 groups are exported identically by every node, so their
// widgets must deduplicate with max()/min() instead of summing across nodes:
// every reference must sit directly inside max(...), min(...) or
// max by (range) (...).
func TestClusterMetricsAreDeduplicated(t *testing.T) {
	allowedWrappers := []string{"max(", "min(", "max by (range) ("}
	for _, w := range widgets {
		for _, target := range w.Targets {
			expr := target.Expr
			for _, name := range metricNameRe.FindAllString(expr, -1) {
				if !strings.HasPrefix(name, "minio_cluster_") {
					continue
				}
				ref := name + "{$__query}"
				for idx := strings.Index(expr, ref); idx != -1; {
					wrapped := false
					for _, wrap := range allowedWrappers {
						if strings.HasSuffix(expr[:idx], wrap) {
							wrapped = true
							break
						}
					}
					if !wrapped {
						t.Errorf("widget %d (%s): cluster metric %s must be wrapped in max()/min() for node dedup: %q", w.ID, w.Title, name, expr)
					}
					next := strings.Index(expr[idx+len(ref):], ref)
					if next == -1 {
						break
					}
					idx = idx + len(ref) + next
				}
			}
		}
	}
}

func widgetByID(t *testing.T, id int32) Metric {
	t.Helper()
	for _, w := range widgets {
		if w.ID == id {
			return w
		}
	}
	t.Fatalf("widget %d not found", id)
	return Metric{}
}
