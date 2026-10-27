// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"errors"
	"fmt"
	"net"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	DatabaseURL                        string
	Endpoint                           string
	AccessKey, SecretKey, SessionToken string
	HTTPAddress                        string
	PoolConnections                    int32
	ConcurrentScans                    int
	MaxEntries                         int64
	AuthConcurrency                    int
	APIRequests                        int
	UIPollInterval                     time.Duration
	RequestTimeout                     time.Duration
	ScanTimeout                        time.Duration
	ScanSlice                          time.Duration
	Lease                              time.Duration
	Heartbeat                          time.Duration
	ProgressInterval                   time.Duration
	PollInterval                       time.Duration
	EventDebounce                      time.Duration
	MinScanInterval                    time.Duration
	ReconcileInterval                  time.Duration
	FullReconcileInterval              time.Duration
	RetryInterval                      time.Duration
	MaxRetryInterval                   time.Duration
}

func LoadConfig(worker bool) (Config, error) {
	values := map[string]string{}
	for _, entry := range os.Environ() {
		key, value, ok := strings.Cut(entry, "=")
		if ok && (strings.HasPrefix(key, "CONSOLE_USAGE_") || key == "CONSOLE_MINIO_SERVER") {
			values[key] = value
		}
	}
	return ParseConfig(values, worker)
}
func ParseConfig(values map[string]string, worker bool) (Config, error) {
	c := Config{DatabaseURL: values["CONSOLE_USAGE_DATABASE_URL"], Endpoint: values["CONSOLE_MINIO_SERVER"], AccessKey: values["CONSOLE_USAGE_S3_ACCESS_KEY"], SecretKey: values["CONSOLE_USAGE_S3_SECRET_KEY"], SessionToken: values["CONSOLE_USAGE_S3_SESSION_TOKEN"], HTTPAddress: values["CONSOLE_USAGE_HTTP_ADDRESS"]}
	if c.Endpoint == "" {
		c.Endpoint = "http://localhost:9000"
	}
	u, err := url.Parse(c.Endpoint)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Hostname() == "" || u.User != nil || u.RawQuery != "" || u.Fragment != "" || (u.Path != "" && u.Path != "/") {
		return c, errors.New("invalid usage storage endpoint")
	}
	c.Endpoint = strings.ToLower(u.Scheme + "://" + u.Host)
	if c.HTTPAddress == "" {
		c.HTTPAddress = ":9091"
	}
	if _, _, err = net.SplitHostPort(c.HTTPAddress); err != nil {
		return c, errors.New("invalid usage HTTP listen address")
	}
	numbers := map[string]int64{}
	for _, setting := range []struct {
		key                string
		fallback, min, max int64
	}{
		{"POOL_MAX_CONNECTIONS", 4, 1, 64}, {"CONCURRENT_SCANS", 1, 1, 16}, {"MAX_ENTRIES", 100_000_000, 1, 1_000_000_000_000},
		{"AUTH_CONCURRENCY", 4, 1, 32}, {"API_MAX_REQUESTS", 8, 1, 64},
	} {
		value := setting.fallback
		if raw, ok := values["CONSOLE_USAGE_"+setting.key]; ok {
			value, err = strconv.ParseInt(raw, 10, 64)
			if err != nil {
				return c, fmt.Errorf("invalid CONSOLE_USAGE_%s", setting.key)
			}
		}
		if value < setting.min || value > setting.max {
			return c, fmt.Errorf("CONSOLE_USAGE_%s is outside its supported range", setting.key)
		}
		numbers[setting.key] = value
	}
	c.PoolConnections = int32(numbers["POOL_MAX_CONNECTIONS"])
	c.ConcurrentScans = int(numbers["CONCURRENT_SCANS"])
	c.MaxEntries = numbers["MAX_ENTRIES"]
	c.AuthConcurrency = int(numbers["AUTH_CONCURRENCY"])
	c.APIRequests = int(numbers["API_MAX_REQUESTS"])
	for _, setting := range []struct {
		key                string
		target             *time.Duration
		fallback, min, max time.Duration
	}{
		{"UI_POLL_INTERVAL", &c.UIPollInterval, 2 * time.Second, 250 * time.Millisecond, time.Minute},
		{"REQUEST_TIMEOUT", &c.RequestTimeout, 15 * time.Second, time.Second, 2 * time.Minute},
		{"SCAN_TIMEOUT", &c.ScanTimeout, 30 * time.Minute, time.Second, 24 * time.Hour},
		{"SCAN_SLICE", &c.ScanSlice, 5 * time.Second, 100 * time.Millisecond, 5 * time.Minute},
		{"LEASE", &c.Lease, 2 * time.Minute, time.Second, 10 * time.Minute},
		{"HEARTBEAT", &c.Heartbeat, 15 * time.Second, 100 * time.Millisecond, time.Minute},
		{"PROGRESS_INTERVAL", &c.ProgressInterval, time.Second, 100 * time.Millisecond, time.Minute},
		{"POLL_INTERVAL", &c.PollInterval, time.Second, 100 * time.Millisecond, time.Minute},
		{"EVENT_DEBOUNCE", &c.EventDebounce, 5 * time.Second, 0, time.Hour},
		{"MIN_SCAN_INTERVAL", &c.MinScanInterval, time.Minute, 0, time.Hour},
		{"RECONCILE_INTERVAL", &c.ReconcileInterval, 15 * time.Minute, time.Second, 24 * time.Hour},
		{"FULL_RECONCILE_INTERVAL", &c.FullReconcileInterval, 24 * time.Hour, time.Second, 7 * 24 * time.Hour},
		{"RETRY_INTERVAL", &c.RetryInterval, 30 * time.Second, 100 * time.Millisecond, time.Hour},
		{"MAX_RETRY_INTERVAL", &c.MaxRetryInterval, 15 * time.Minute, 100 * time.Millisecond, 24 * time.Hour},
	} {
		value := setting.fallback
		if raw, ok := values["CONSOLE_USAGE_"+setting.key]; ok {
			value, err = time.ParseDuration(raw)
			if err != nil {
				return c, fmt.Errorf("invalid CONSOLE_USAGE_%s", setting.key)
			}
		}
		if value < setting.min || value > setting.max {
			return c, fmt.Errorf("CONSOLE_USAGE_%s is outside its supported range", setting.key)
		}
		*setting.target = value
	}
	if c.ScanSlice >= c.ScanTimeout {
		return c, errors.New("usage scan timeout must exceed its scheduling slice")
	}
	if c.Heartbeat*2 >= c.Lease || c.ProgressInterval >= c.Lease {
		return c, errors.New("usage lease must exceed twice the heartbeat and exceed the progress interval")
	}
	if c.MaxRetryInterval < c.RetryInterval {
		return c, errors.New("usage maximum retry interval is below the initial retry interval")
	}
	if worker && (c.DatabaseURL == "" || c.AccessKey == "" || c.SecretKey == "") {
		return c, errors.New("usage worker requires database and dedicated S3 metadata credentials")
	}
	return c, nil
}
