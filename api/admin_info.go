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
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/minio/console/pkg/utils"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations"
	systemApi "github.com/minio/console/api/operations/system"
	"github.com/minio/console/models"
)

func registerAdminInfoHandlers(api *operations.ConsoleAPI) {
	// return usage stats
	api.SystemAdminInfoHandler = systemApi.AdminInfoHandlerFunc(func(params systemApi.AdminInfoParams, session *models.Principal) middleware.Responder {
		infoResp, err := getAdminInfoResponse(session, params)
		if err != nil {
			return systemApi.NewAdminInfoDefault(err.Code).WithPayload(err.APIError)
		}
		return systemApi.NewAdminInfoOK().WithPayload(infoResp)
	})
	// return single widget results
	api.SystemDashboardWidgetDetailsHandler = systemApi.DashboardWidgetDetailsHandlerFunc(func(params systemApi.DashboardWidgetDetailsParams, _ *models.Principal) middleware.Responder {
		infoResp, err := getAdminInfoWidgetResponse(params)
		if err != nil {
			return systemApi.NewDashboardWidgetDetailsDefault(err.Code).WithPayload(err.APIError)
		}
		return systemApi.NewDashboardWidgetDetailsOK().WithPayload(infoResp)
	})
}

type UsageInfo struct {
	Buckets          int64
	Objects          int64
	Usage            int64
	DrivesUsage      int64
	Servers          []*models.ServerProperties
	EndpointNotReady bool
	Backend          *models.BackendProperties
}

// GetAdminInfo invokes admin info and returns a parsed `UsageInfo` structure
func GetAdminInfo(ctx context.Context, client MinioAdmin) (*UsageInfo, error) {
	serverInfo, err := client.serverInfo(ctx)
	if err != nil {
		return nil, err
	}
	// we are trimming uint64 to int64 this will report an incorrect measurement for numbers greater than
	// 9,223,372,036,854,775,807

	backendType := serverInfo.Backend.Type
	rrSCParity := serverInfo.Backend.RRSCParity
	standardSCParity := serverInfo.Backend.StandardSCParity
	onlineDrives := serverInfo.Backend.OnlineDisks
	offlineDrives := serverInfo.Backend.OfflineDisks

	var usedSpace int64
	// serverArray contains the serverProperties which describe the servers in the network
	var serverArray []*models.ServerProperties
	for _, serv := range serverInfo.Servers {
		drives := []*models.ServerDrives{}

		for _, drive := range serv.Disks {
			usedSpace += int64(drive.UsedSpace)
			drives = append(drives, &models.ServerDrives{
				State:          drive.State,
				UUID:           drive.UUID,
				Endpoint:       drive.Endpoint,
				RootDisk:       drive.RootDisk,
				DrivePath:      drive.DrivePath,
				Healing:        drive.Healing,
				Model:          drive.Model,
				TotalSpace:     int64(drive.TotalSpace),
				UsedSpace:      int64(drive.UsedSpace),
				AvailableSpace: int64(drive.AvailableSpace),
			})
		}

		newServer := &models.ServerProperties{
			State:      serv.State,
			Endpoint:   serv.Endpoint,
			Uptime:     serv.Uptime,
			Version:    serv.Version,
			CommitID:   serv.CommitID,
			PoolNumber: int64(serv.PoolNumber),
			Network:    serv.Network,
			Drives:     drives,
		}

		serverArray = append(serverArray, newServer)
	}

	backendData := &models.BackendProperties{
		BackendType:      string(backendType),
		RrSCParity:       int64(rrSCParity),
		StandardSCParity: int64(standardSCParity),
		OnlineDrives:     int64(onlineDrives),
		OfflineDrives:    int64(offlineDrives),
	}
	return &UsageInfo{
		Buckets:     int64(serverInfo.Buckets.Count),
		Objects:     int64(serverInfo.Objects.Count),
		Usage:       int64(serverInfo.Usage.Size),
		DrivesUsage: usedSpace,
		Servers:     serverArray,
		Backend:     backendData,
	}, nil
}

type Target struct {
	Expr         string
	Interval     string
	LegendFormat string
	Step         int32
	InitialTime  int64
}

type ReduceOptions struct {
	Calcs []string
}

type MetricOptions struct {
	ReduceOptions ReduceOptions
}

type Metric struct {
	ID            int32
	Title         string
	Type          string
	Options       MetricOptions
	Targets       []Target
	GridPos       GridPos
	MaxDataPoints int32
}

type GridPos struct {
	H int32
	W int32
	X int32
	Y int32
}

// All widget queries target SILO/MinIO Metrics V3 (`/minio/metrics/v3`) names.
// See docs/metrics-v3.md for the full V2 -> V3 mapping and aggregation rules.
//
// Two server-side V3 semantics shape these expressions:
//
//  1. Cluster-scoped groups (`minio_cluster_*`) carry no `server` label and are
//     exported identically by every node, so scraping N nodes yields N duplicate
//     series. They must be deduplicated with `max()` (never summed).
//  2. Metrics with value <= 0 are skipped at export time, so a legitimate zero
//     (e.g. no offline drives) is indistinguishable from a missing series. Stat
//     widgets that can legitimately read zero append an
//     `or (max(<companion>{...}) * 0)` guard so that a live cluster renders an
//     explicit 0 while a dead scrape stays empty. The companion must share the
//     value's lifecycle: cluster-health counts and traffic totals guard on
//     nodes_online_count; usage counts guard on the usage group's own
//     since_last_update_seconds (the whole group is absent until the first
//     scanner cycle, and pre-scan buckets must read as no-data, not 0);
//     capacity free/used baseline on the always-present capacity total.
var widgets = []Metric{
	{
		ID:            1,
		Title:         "Uptime",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 6,
			W: 3,
			X: 0,
			Y: 0,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `min(minio_system_process_uptime_seconds{$__query})`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            65,
		Title:         "Total S3 Traffic Inbound",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 3,
			W: 3,
			X: 3,
			Y: 0,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"last",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `sum(minio_api_requests_traffic_received_bytes{$__query}) or (max(minio_cluster_health_nodes_online_count{$__query}) * 0)`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            50,
		Title:         "Current Usable Free Capacity",
		Type:          "gauge",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 6,
			W: 3,
			X: 6,
			Y: 0,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"lastNotNull",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_health_capacity_usable_total_bytes{$__query})`,
				LegendFormat: "Total Usable",
				Step:         300,
			},
			{
				// zero free bytes (full cluster) is zero-skipped by the server;
				// baseline on the always-present total so full reads as 0, not empty
				Expr:         `max(minio_cluster_health_capacity_usable_free_bytes{$__query}) or (max(minio_cluster_health_capacity_usable_total_bytes{$__query}) * 0)`,
				LegendFormat: "Usable Free",
				Step:         300,
			},
			{
				// when free is absent (full cluster), used equals total
				Expr:         `max(minio_cluster_health_capacity_usable_total_bytes{$__query}) - max(minio_cluster_health_capacity_usable_free_bytes{$__query}) or max(minio_cluster_health_capacity_usable_total_bytes{$__query})`,
				LegendFormat: "Used Space",
				Step:         300,
			},
		},
	},
	{
		ID:    68,
		Title: "Data Usage Growth",
		Type:  "graph",
		GridPos: GridPos{
			H: 6,
			W: 7,
			X: 9,
			Y: 0,
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_usage_objects_total_bytes{$__query})`,
				LegendFormat: "Used Capacity",
				InitialTime:  -180,
				Step:         10,
			},
		},
	},
	{
		ID:    52,
		Title: "Object size distribution",
		Type:  "bargauge",
		GridPos: GridPos{
			H: 6,
			W: 5,
			X: 16,
			Y: 0,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max by (range) (minio_cluster_usage_objects_size_distribution{$__query})`,
				LegendFormat: "{{range}}",
				Step:         300,
			},
		},
	},
	{
		ID:            64,
		Title:         "Total S3 Traffic Outbound",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 3,
			W: 3,
			X: 3,
			Y: 3,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"last",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `sum(minio_api_requests_traffic_sent_bytes{$__query}) or (max(minio_cluster_health_nodes_online_count{$__query}) * 0)`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            53,
		Title:         "Total Online Servers",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 2,
			W: 3,
			X: 0,
			Y: 6,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_health_nodes_online_count{$__query})`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            9,
		Title:         "Total Online Drives",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 2,
			W: 3,
			X: 3,
			Y: 6,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},
		Targets: []Target{
			{
				// all drives can be offline while a node still serves metrics;
				// the zero sample is skipped, so guard to render an explicit 0
				Expr:         `max(minio_cluster_health_drives_online_count{$__query}) or (max(minio_cluster_health_nodes_online_count{$__query}) * 0)`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            66,
		Title:         "Number of Buckets",
		Type:          "stat",
		MaxDataPoints: 5,
		GridPos: GridPos{
			H: 3,
			W: 3,
			X: 6,
			Y: 6,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"lastNotNull",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_usage_objects_buckets_count{$__query}) or (max(minio_cluster_usage_objects_since_last_update_seconds{$__query}) * 0)`,
				LegendFormat: "",
				Step:         100,
			},
		},
	},
	{
		ID:    63,
		Title: "S3 API Data Received Rate ",
		Type:  "graph",
		GridPos: GridPos{
			H: 6,
			W: 7,
			X: 9,
			Y: 6,
		},
		Targets: []Target{
			{
				Expr:         `sum by (server) (rate(minio_api_requests_traffic_received_bytes{$__query}[$__rate_interval]))`,
				LegendFormat: "Data Received [{{server}}]",
			},
		},
	},
	{
		ID:    70,
		Title: "S3 API Data Sent Rate ",
		Type:  "graph",
		GridPos: GridPos{
			H: 6,
			W: 8,
			X: 16,
			Y: 6,
		},
		Targets: []Target{
			{
				Expr:         `sum by (server) (rate(minio_api_requests_traffic_sent_bytes{$__query}[$__rate_interval]))`,
				LegendFormat: "Data Sent [{{server}}]",
			},
		},
	},
	{
		ID:            69,
		Title:         "Total Offline Servers",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 2,
			W: 3,
			X: 0,
			Y: 8,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_health_nodes_offline_count{$__query}) or (max(minio_cluster_health_nodes_online_count{$__query}) * 0)`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            78,
		Title:         "Total Offline Drives",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 2,
			W: 3,
			X: 3,
			Y: 8,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_health_drives_offline_count{$__query}) or (max(minio_cluster_health_nodes_online_count{$__query}) * 0)`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:            44,
		Title:         "Number of Objects",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 3,
			W: 3,
			X: 6,
			Y: 9,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"lastNotNull",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_usage_objects_count{$__query}) or (max(minio_cluster_usage_objects_since_last_update_seconds{$__query}) * 0)`,
				LegendFormat: "",
			},
		},
	},
	{
		// Replaces the V2-only "Time Since Last Heal Activity" widget: V3 has no
		// minio_heal_* namespace. `overall_health` is 1 when healthy and skipped
		// entirely when unhealthy (zero-value skip), so the always-positive
		// `overall_write_quorum` acts as the 0-baseline: 1 = healthy,
		// 0 = unhealthy, empty = metrics unavailable.
		ID:            80,
		Title:         "Erasure Health",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 2,
			W: 3,
			X: 0,
			Y: 10,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"last",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `min(minio_cluster_erasure_set_overall_health{$__query}) or (max(minio_cluster_erasure_set_overall_write_quorum{$__query}) * 0)`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		// Replaces the V2-only "Time Since Last Scan Activity" widget: reports
		// the age (seconds) of the usage data behind the Usage/Objects/Buckets
		// cards. Empty until the first scanner cycle completes.
		ID:            81,
		Title:         "Usage Data Age",
		Type:          "stat",
		MaxDataPoints: 100,
		GridPos: GridPos{
			H: 2,
			W: 3,
			X: 3,
			Y: 10,
		},
		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"last",
				},
			},
		},
		Targets: []Target{
			{
				Expr:         `max(minio_cluster_usage_objects_since_last_update_seconds{$__query})`,
				LegendFormat: "",
				Step:         60,
			},
		},
	},
	{
		ID:    60,
		Title: "S3 API Request Rate",
		Type:  "graph",
		GridPos: GridPos{
			H: 10,
			W: 12,
			X: 0,
			Y: 12,
		},
		Targets: []Target{
			{
				Expr:         `sum by (server,name) (increase(minio_api_requests_total{$__query}[$__rate_interval]))`,
				LegendFormat: "{{server}}, {{name}}",
			},
		},
	},
	{
		ID:    71,
		Title: "S3 API Request Error Rate",
		Type:  "graph",
		GridPos: GridPos{
			H: 10,
			W: 12,
			X: 12,
			Y: 12,
		},
		Targets: []Target{
			{
				Expr:         `sum by (server,name) (increase(minio_api_requests_errors_total{$__query}[$__rate_interval]))`,
				LegendFormat: "{{server}}, {{name}}",
			},
		},
	},
	{
		// Internode metrics are only exported by distributed deployments; a
		// single-node cluster legitimately renders this panel empty.
		ID:    17,
		Title: "Internode Data Transfer",
		Type:  "graph",
		GridPos: GridPos{
			H: 8,
			W: 24,
			X: 0,
			Y: 22,
		},
		Targets: []Target{
			{
				Expr:         `rate(minio_system_network_internode_recv_bytes_total{$__query}[$__rate_interval])`,
				LegendFormat: "Internode Bytes Received [{{server}}]",
				Step:         4,
			},

			{
				Expr:         `rate(minio_system_network_internode_sent_bytes_total{$__query}[$__rate_interval])`,
				LegendFormat: "Internode Bytes Sent [{{server}}]",
			},
		},
	},
	{
		ID:    77,
		Title: "Node CPU Usage",
		Type:  "graph",
		GridPos: GridPos{
			H: 9,
			W: 12,
			X: 0,
			Y: 30,
		},
		Targets: []Target{
			{
				Expr:         `rate(minio_system_process_cpu_total_seconds{$__query}[$__rate_interval])`,
				LegendFormat: "CPU Usage Rate [{{server}}]",
			},
		},
	},
	{
		ID:    76,
		Title: "Node Memory Usage",
		Type:  "graph",
		GridPos: GridPos{
			H: 9,
			W: 12,
			X: 12,
			Y: 30,
		},
		Targets: []Target{
			{
				Expr:         `minio_system_process_resident_memory_bytes{$__query}`,
				LegendFormat: "Memory Used [{{server}}]",
			},
		},
	},
	{
		ID:    74,
		Title: "Drive Used Capacity",
		Type:  "graph",
		GridPos: GridPos{
			H: 8,
			W: 12,
			X: 0,
			Y: 39,
		},
		Targets: []Target{
			{
				Expr:         `minio_system_drive_used_bytes{$__query}`,
				LegendFormat: "Used Capacity [{{server}}:{{drive}}]",
			},
		},
	},
	{
		ID:    82,
		Title: "Drives Free Inodes",
		Type:  "graph",
		GridPos: GridPos{
			H: 8,
			W: 12,
			X: 12,
			Y: 39,
		},
		Targets: []Target{
			{
				Expr:         `minio_system_drive_free_inodes{$__query}`,
				LegendFormat: "Free Inodes [{{server}}:{{drive}}]",
			},
		},
	},
	{
		ID:    11,
		Title: "Node Syscalls",
		Type:  "graph",
		GridPos: GridPos{
			H: 9,
			W: 12,
			X: 0,
			Y: 47,
		},
		Targets: []Target{
			{
				Expr:         `rate(minio_system_process_syscall_read_total{$__query}[$__rate_interval])`,
				LegendFormat: "Read Syscalls [{{server}}]",
				Step:         60,
			},

			{
				Expr:         `rate(minio_system_process_syscall_write_total{$__query}[$__rate_interval])`,
				LegendFormat: "Write Syscalls [{{server}}]",
			},
		},
	},
	{
		ID:    8,
		Title: "Node File Descriptors",
		Type:  "graph",
		GridPos: GridPos{
			H: 9,
			W: 12,
			X: 12,
			Y: 47,
		},
		Targets: []Target{
			{
				Expr:         `minio_system_process_file_descriptor_open_total{$__query}`,
				LegendFormat: "Open FDs [{{server}}]",
			},
		},
	},
	{
		ID:    73,
		Title: "Node IO",
		Type:  "graph",
		GridPos: GridPos{
			H: 8,
			W: 24,
			X: 0,
			Y: 56,
		},
		Targets: []Target{
			{
				Expr:         `rate(minio_system_process_io_rchar_bytes{$__query}[$__rate_interval])`,
				LegendFormat: "Node RChar [{{server}}]",
			},

			{
				Expr:         `rate(minio_system_process_io_wchar_bytes{$__query}[$__rate_interval])`,
				LegendFormat: "Node WChar [{{server}}]",
			},
		},
	},
}

type Widget struct {
	Title string
	Type  string
}

type DataResult struct {
	Metric map[string]string `json:"metric"`
	Values []interface{}     `json:"values"`
}

type PromRespData struct {
	ResultType string       `json:"resultType"`
	Result     []DataResult `json:"result"`
}

type PromResp struct {
	Status string       `json:"status"`
	Data   PromRespData `json:"data"`
}

// getAdminInfoResponse returns the response containing total buckets, objects and usage.
func getAdminInfoResponse(session *models.Principal, params systemApi.AdminInfoParams) (*models.AdminInfoResponse, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	prometheusURL := ""

	if !*params.DefaultOnly {
		promURL := getPrometheusURL()
		if promURL != "" {
			prometheusURL = promURL
		}
	}

	mAdmin, err := NewMinioAdminClient(params.HTTPRequest.Context(), session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}

	sessionResp, err2 := getUsageWidgetsForDeployment(ctx, prometheusURL, AdminClient{Client: mAdmin})
	if err2 != nil {
		return nil, ErrorWithContext(ctx, err2)
	}

	return sessionResp, nil
}

func getUsageWidgetsForDeployment(ctx context.Context, prometheusURL string, adminClient MinioAdmin) (*models.AdminInfoResponse, error) {
	prometheusStatus := models.AdminInfoResponseAdvancedMetricsStatusAvailable
	if prometheusURL == "" {
		prometheusStatus = models.AdminInfoResponseAdvancedMetricsStatusNotConfigured
	}
	if prometheusURL != "" && !testPrometheusURL(ctx, prometheusURL) {
		prometheusStatus = models.AdminInfoResponseAdvancedMetricsStatusUnavailable
	}
	sessionResp := &models.AdminInfoResponse{
		AdvancedMetricsStatus: prometheusStatus,
	}
	doneCh := make(chan error)
	go func() {
		defer close(doneCh)
		// serialize output
		usage, err := GetAdminInfo(ctx, adminClient)
		if err != nil {
			doneCh <- err
		}
		if usage != nil {
			sessionResp.Buckets = usage.Buckets
			sessionResp.Objects = usage.Objects
			sessionResp.Usage = usage.Usage
			sessionResp.Servers = usage.Servers
			sessionResp.Backend = usage.Backend
		}
	}()

	var wdgts []*models.Widget
	if prometheusStatus == models.AdminInfoResponseAdvancedMetricsStatusAvailable {
		// We will tell the frontend about a list of widgets so it can fetch the ones it wants
		for _, m := range widgets {
			wdgtResult := models.Widget{
				ID:    m.ID,
				Title: m.Title,
				Type:  m.Type,
			}
			if len(m.Options.ReduceOptions.Calcs) > 0 {
				wdgtResult.Options = &models.WidgetOptions{
					ReduceOptions: &models.WidgetOptionsReduceOptions{
						Calcs: m.Options.ReduceOptions.Calcs,
					},
				}
			}

			wdgts = append(wdgts, &wdgtResult)
		}
		sessionResp.Widgets = wdgts
	}

	// wait for mc admin info
	err := <-doneCh
	if err != nil {
		return nil, err
	}

	return sessionResp, nil
}

func applyPrometheusAuth(req *http.Request) {
	if prometheusBearer := getPrometheusAuthToken(); prometheusBearer != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", prometheusBearer))
		return
	}

	if username, password, ok := getPrometheusAuthUserPass(); ok {
		req.SetBasicAuth(username, password)
	}
}

func drainAndCloseResponse(resp *http.Response) {
	if resp == nil || resp.Body == nil {
		return
	}

	_, _ = io.Copy(io.Discard, resp.Body)
	_ = resp.Body.Close()
}

func unmarshalPrometheus(ctx context.Context, httpClnt *http.Client, endpoint string, data interface{}) bool {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		ErrorWithContext(ctx, fmt.Errorf("unable to create the request to fetch labels from prometheus: %w", err))
		return true
	}

	applyPrometheusAuth(req)

	resp, err := httpClnt.Do(req)
	if err != nil {
		drainAndCloseResponse(resp)
		ErrorWithContext(ctx, fmt.Errorf("unable to fetch labels from prometheus: %w", err))
		return true
	}

	defer drainAndCloseResponse(resp)

	if resp.StatusCode != http.StatusOK {
		ErrorWithContext(ctx, fmt.Errorf("unexpected status code from prometheus (%s)", resp.Status))
		return true
	}

	if err = json.NewDecoder(resp.Body).Decode(data); err != nil {
		ErrorWithContext(ctx, fmt.Errorf("unexpected error from prometheus: %w", err))
		return true
	}

	return false
}

func testPrometheusURL(ctx context.Context, url string) bool {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url+"/-/healthy", nil)
	if err != nil {
		ErrorWithContext(ctx, fmt.Errorf("error Building Request: (%v)", err))
		return false
	}

	applyPrometheusAuth(req)

	clientIP := utils.ClientIPFromContext(ctx)
	httpClnt := GetConsoleHTTPClient(clientIP)

	response, err := httpClnt.Do(req)
	if err != nil {
		drainAndCloseResponse(response)
		ErrorWithContext(ctx, fmt.Errorf("default Prometheus URL not reachable, trying root testing: (%v)", err))
		newTestURL := req.URL.Scheme + "://" + req.URL.Host + "/-/healthy"
		req2, err := http.NewRequestWithContext(ctx, http.MethodGet, newTestURL, nil)
		if err != nil {
			ErrorWithContext(ctx, fmt.Errorf("error Building Root Request: (%v)", err))
			return false
		}
		applyPrometheusAuth(req2)
		rootResponse, err := httpClnt.Do(req2)
		if err != nil {
			drainAndCloseResponse(rootResponse)
			// URL & Root tests didn't work. Prometheus not reachable
			ErrorWithContext(ctx, fmt.Errorf("root Prometheus URL not reachable: (%v)", err))
			return false
		}
		defer drainAndCloseResponse(rootResponse)
		return rootResponse.StatusCode == http.StatusOK
	}
	defer drainAndCloseResponse(response)
	return response.StatusCode == http.StatusOK
}

func getAdminInfoWidgetResponse(params systemApi.DashboardWidgetDetailsParams) (*models.WidgetDetails, *CodedAPIError) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	prometheusURL := getPrometheusURL()
	prometheusJobID := getPrometheusJobID()
	prometheusExtraLabels := getPrometheusExtraLabels()

	selector := fmt.Sprintf(`job="%s"`, prometheusJobID)
	if strings.TrimSpace(prometheusExtraLabels) != "" {
		selector = fmt.Sprintf(`job="%s",%s`, prometheusJobID, prometheusExtraLabels)
	}
	clientIP := getClientIP(params.HTTPRequest)
	ctx = context.WithValue(ctx, utils.ContextClientIP, clientIP)
	return getWidgetDetails(ctx, prometheusURL, selector, params.WidgetID, params.Step, params.Start, params.End)
}

func getWidgetDetails(ctx context.Context, prometheusURL string, selector string, widgetID int32, step *int32, start *int64, end *int64) (*models.WidgetDetails, *CodedAPIError) {
	// We test if prometheus URL is reachable. this is meant to avoid unuseful calls and application hang.
	if !testPrometheusURL(ctx, prometheusURL) {
		return nil, ErrorWithContext(ctx, errors.New("prometheus URL is unreachable"))
	}
	clientIP := utils.ClientIPFromContext(ctx)
	httpClnt := GetConsoleHTTPClient(clientIP)

	for _, m := range widgets {
		if m.ID != widgetID {
			continue
		}

		var (
			wg            sync.WaitGroup
			targetResults = make([]*models.ResultTarget, len(m.Targets))
		)

		// for each target we will launch another goroutine to fetch the values
		for idx, target := range m.Targets {
			wg.Add(1)
			go func(idx int, target Target, inStep *int32, inStart *int64, inEnd *int64) {
				defer wg.Done()

				apiType := "query_range"
				now := time.Now()

				var initTime int64 = -15

				if target.InitialTime != 0 {
					initTime = target.InitialTime
				}

				timeCalculated := time.Duration(initTime * int64(time.Minute))

				extraParamters := fmt.Sprintf("&start=%d&end=%d", now.Add(timeCalculated).Unix(), now.Unix())

				var step int32 = 60
				if target.Step > 0 {
					step = target.Step
				}
				if inStep != nil && *inStep > 0 {
					step = *inStep
				}

				if inStart != nil && inEnd != nil {
					extraParamters = fmt.Sprintf("&start=%d&end=%d", *inStart, *inEnd)
				}

				if step > 0 {
					extraParamters = fmt.Sprintf("%s&step=%d", extraParamters, step)
				}

				// replace the `$__rate_interval` global for step with unit (s for seconds)
				queryExpr := strings.ReplaceAll(target.Expr, "$__rate_interval", fmt.Sprintf("%ds", 240))
				queryExpr = strings.ReplaceAll(queryExpr, "$__query", selector)
				endpoint := fmt.Sprintf("%s/api/v1/%s?query=%s%s", prometheusURL, apiType, url.QueryEscape(queryExpr), extraParamters)

				var response PromResp
				if unmarshalPrometheus(ctx, httpClnt, endpoint, &response) {
					return
				}

				targetResult := models.ResultTarget{
					LegendFormat: target.LegendFormat,
					ResultType:   response.Data.ResultType,
				}

				for _, r := range response.Data.Result {
					targetResult.Result = append(targetResult.Result, &models.WidgetResult{
						Metric: r.Metric,
						Values: r.Values,
					})
				}

				targetResults[idx] = &targetResult
			}(idx, target, step, start, end)
		}

		wg.Wait()

		wdgtResult := models.WidgetDetails{
			ID:    m.ID,
			Title: m.Title,
			Type:  m.Type,
		}
		if len(m.Options.ReduceOptions.Calcs) > 0 {
			wdgtResult.Options = &models.WidgetDetailsOptions{
				ReduceOptions: &models.WidgetDetailsOptionsReduceOptions{
					Calcs: m.Options.ReduceOptions.Calcs,
				},
			}
		}

		for _, res := range targetResults {
			if res != nil {
				wdgtResult.Targets = append(wdgtResult.Targets, res)
			}
		}
		return &wdgtResult, nil
	}

	return nil, &CodedAPIError{Code: 404, APIError: &models.APIError{Message: "Widget not found"}}
}
