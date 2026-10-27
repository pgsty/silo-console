// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package usage

import (
	"strings"
	"testing"
	"time"
)

func TestConfigOptInAndOperatorOverrides(t *testing.T) {
	c, err := ParseConfig(nil, false)
	if err != nil {
		t.Fatal(err)
	}
	if c.DatabaseURL != "" {
		t.Fatal("persistent workers enabled without operator configuration")
	}
	values := map[string]string{"CONSOLE_USAGE_DATABASE_URL": "postgres://fixture", "CONSOLE_USAGE_S3_ACCESS_KEY": "reader", "CONSOLE_USAGE_S3_SECRET_KEY": "private-fixture", "CONSOLE_MINIO_SERVER": "http://S3.EXAMPLE:9000/", "CONSOLE_USAGE_CONCURRENT_SCANS": "3", "CONSOLE_USAGE_MAX_ENTRIES": "90000000", "CONSOLE_USAGE_EVENT_DEBOUNCE": "500ms", "CONSOLE_USAGE_RECONCILE_INTERVAL": "5m", "CONSOLE_USAGE_POOL_MAX_CONNECTIONS": "8"}
	c, err = ParseConfig(values, true)
	if err != nil {
		t.Fatal(err)
	}
	if c.Endpoint != "http://s3.example:9000" || c.ConcurrentScans != 3 || c.PoolConnections != 8 || c.EventDebounce != 500*time.Millisecond || c.ReconcileInterval != 5*time.Minute {
		t.Fatalf("operator settings ignored: %+v", c)
	}
}
func TestConfigRejectsUnsafeBudgetsAndNeverEchoesSecrets(t *testing.T) {
	for _, tc := range []struct{ key, value string }{
		{"CONSOLE_MINIO_SERVER", "https://user:private-fixture@storage/"}, {"CONSOLE_MINIO_SERVER", "https://storage/other"},
		{"CONSOLE_USAGE_CONCURRENT_SCANS", "0"}, {"CONSOLE_USAGE_POOL_MAX_CONNECTIONS", "100000"}, {"CONSOLE_USAGE_MAX_ENTRIES", "-1"},
		{"CONSOLE_USAGE_SCAN_TIMEOUT", "invalid-private-fixture"}, {"CONSOLE_USAGE_EVENT_DEBOUNCE", "-1s"},
		{"CONSOLE_USAGE_LEASE", "1s"}, {"CONSOLE_USAGE_MAX_RETRY_INTERVAL", "1ms"},
	} {
		t.Run(tc.key+tc.value, func(t *testing.T) {
			_, err := ParseConfig(map[string]string{tc.key: tc.value}, false)
			if err == nil {
				t.Fatal("unsafe configuration accepted")
			}
			if strings.Contains(err.Error(), "private-fixture") {
				t.Fatal("configuration error exposed its value")
			}
		})
	}
	if _, err := ParseConfig(nil, true); err == nil {
		t.Fatal("worker started without dedicated credentials")
	}
}
