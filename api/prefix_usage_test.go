// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/go-openapi/runtime"
	objectAPI "github.com/minio/console/api/operations/object"
	"github.com/minio/console/models"
	"github.com/minio/minio-go/v7"
)

func TestPrefixUsageAggregation(t *testing.T) {
	scan := &prefixUsageScan{bucket: "test", prefix: "a/", versions: true, includeFolders: true, started: time.Now(), folders: map[string]prefixUsageCounts{}}
	objects := []minio.ObjectInfo{
		{Key: "a/root", Size: 3, IsLatest: true},
		{Key: "a/child/x", Size: 9007199254740993, IsLatest: true},
		{Key: "a/child/x", Size: 17, IsLatest: false},
		{Key: "a/child/deleted", IsLatest: true, IsDeleteMarker: true},
		{Key: "a/child/deleted", Size: 5, IsLatest: false},
		{Key: "a/empty/", Size: 0, IsLatest: true},
	}
	limits, _ := readPrefixUsageLimits()
	for _, object := range objects {
		if reason, err := scan.append(object, limits); err != nil || reason != "" {
			t.Fatalf("append: %s %v", reason, err)
		}
	}
	frame := scan.frame("complete", "", "")
	if *frame.Totals.CurrentBytes != "9007199254740996" || *frame.Totals.RetainedBytes != "22" || *frame.Totals.CurrentObjects != 3 || *frame.Totals.RetainedVersions != 2 || *frame.Totals.DeleteMarkers != 1 {
		t.Fatalf("wrong totals: %+v", scan.totals)
	}
	if len(frame.Folders) != 2 || *frame.Folders[0].Prefix != "a/child/" || *frame.Folders[0].Usage.CurrentBytes != "9007199254740993" {
		t.Fatalf("wrong child folders: %+v", frame.Folders)
	}
	if _, err := scan.append(minio.ObjectInfo{Key: "ab/leak", Size: 10}, limits); err == nil {
		t.Fatal("accepted out-of-scope key")
	}
	if _, err := scan.append(minio.ObjectInfo{Key: "a/bad", Size: -1}, limits); err == nil {
		t.Fatal("accepted negative size")
	}
	if scan.entries != 6 {
		t.Fatal("invalid entries changed totals")
	}
}

func TestPrefixUsageLimitsArePartial(t *testing.T) {
	for _, kind := range []string{"entries", "folders"} {
		t.Run(kind, func(t *testing.T) {
			limits, _ := readPrefixUsageLimits()
			if kind == "entries" {
				limits.entries = 1
			} else {
				limits.folders = 1
			}
			scan := &prefixUsageScan{includeFolders: true, folders: map[string]prefixUsageCounts{}}
			_, _ = scan.append(minio.ObjectInfo{Key: "a/one", Size: 5}, limits)
			reason, err := scan.append(minio.ObjectInfo{Key: "b/two", Size: 7}, limits)
			if err != nil || reason != kind || scan.entries != 1 || scan.totals.CurrentBytes != 5 {
				t.Fatalf("limit discarded or counted wrong data: %s %v %+v", reason, err, scan)
			}
		})
	}
}

func prefixUsageFixture(t *testing.T, objects []minio.ObjectInfo) {
	t.Helper()
	original := newPrefixUsageObjects
	t.Cleanup(func() {
		newPrefixUsageObjects = original
		if got := prefixUsageActive.Load(); got != 0 {
			t.Errorf("leaked %d scan slots", got)
		}
	})
	newPrefixUsageObjects = func(ctx context.Context, _ *models.Principal, _, _, _ string, _ bool) (<-chan minio.ObjectInfo, error) {
		out := make(chan minio.ObjectInfo)
		go func() {
			defer close(out)
			for _, object := range objects {
				select {
				case out <- object:
				case <-ctx.Done():
					return
				}
			}
		}()
		return out, nil
	}
}
func prefixUsageRequest() objectAPI.PrefixUsageParams {
	params := objectAPI.NewPrefixUsageParams()
	params.BucketName = "test"
	params.Prefix = ""
	params.HTTPRequest = httptest.NewRequest("GET", "/", nil)
	return params
}
func prefixUsagePrincipal() *models.Principal {
	return &models.Principal{STSAccessKeyID: "caller", STSSecretAccessKey: "private"}
}
func prefixUsageFrames(t *testing.T, record *httptest.ResponseRecorder) []models.PrefixUsageFrame {
	t.Helper()
	decoder := json.NewDecoder(record.Body)
	var frames []models.PrefixUsageFrame
	for {
		var frame models.PrefixUsageFrame
		err := decoder.Decode(&frame)
		if err == io.EOF {
			break
		}
		if err != nil {
			t.Fatal(err)
		}
		frames = append(frames, frame)
	}
	if len(frames) < 2 {
		t.Fatalf("missing progress/terminal frames: %d", len(frames))
	}
	return frames
}

func TestPrefixUsageStream(t *testing.T) {
	for _, tc := range []struct {
		name    string
		objects []minio.ObjectInfo
		status  string
		count   int64
	}{
		{"empty", nil, "complete", 0},
		{"current", []minio.ObjectInfo{{Key: "folder/item", Size: 9}}, "complete", 1},
		{"late permission error", []minio.ObjectInfo{{Key: "folder/item", Size: 9}, {Err: minio.ErrorResponse{Code: "AccessDenied", StatusCode: 403}}}, "failed", 1},
	} {
		t.Run(tc.name, func(t *testing.T) {
			prefixUsageFixture(t, tc.objects)
			record := httptest.NewRecorder()
			getPrefixUsageResponse(prefixUsageRequest(), prefixUsagePrincipal()).WriteResponse(record, runtime.JSONProducer())
			frames := prefixUsageFrames(t, record)
			last := frames[len(frames)-1]
			if record.Code != 200 || *last.Status != tc.status || *last.ScannedEntries != tc.count || record.Header().Get("Cache-Control") != "no-store" {
				t.Fatalf("wrong result %d %+v", record.Code, last)
			}
		})
	}
}
func TestPrefixUsageRejectsUnsafeRequests(t *testing.T) {
	for _, tc := range []struct {
		name, prefix string
		session      *models.Principal
		code         int
	}{
		{"anonymous", "", nil, 401}, {"invalid session", "", &models.Principal{}, 401},
		{"ambiguous prefix", "abc", prefixUsagePrincipal(), 400}, {"oversized prefix", strings.Repeat("x", 1024) + "/", prefixUsagePrincipal(), 400},
	} {
		t.Run(tc.name, func(t *testing.T) {
			params := prefixUsageRequest()
			params.Prefix = tc.prefix
			record := httptest.NewRecorder()
			getPrefixUsageResponse(params, tc.session).WriteResponse(record, runtime.JSONProducer())
			if record.Code != tc.code {
				t.Fatalf("got %d, want %d", record.Code, tc.code)
			}
		})
	}
}
func TestPrefixUsageFirstPageFailureKeepsHTTPStatus(t *testing.T) {
	prefixUsageFixture(t, []minio.ObjectInfo{{Err: minio.ErrorResponse{Code: "AccessDenied", Message: "Denied", StatusCode: 403}}})
	record := httptest.NewRecorder()
	getPrefixUsageResponse(prefixUsageRequest(), prefixUsagePrincipal()).WriteResponse(record, runtime.JSONProducer())
	if record.Code != http.StatusForbidden {
		t.Fatalf("wrong permission status %d", record.Code)
	}
}
func TestPrefixUsageBoundedScanAndDisconnect(t *testing.T) {
	t.Run("entry budget", func(t *testing.T) {
		t.Setenv("CONSOLE_PREFIX_USAGE_MAX_ENTRIES", "1")
		prefixUsageFixture(t, []minio.ObjectInfo{{Key: "a", Size: 2}, {Key: "b", Size: 3}})
		record := httptest.NewRecorder()
		getPrefixUsageResponse(prefixUsageRequest(), prefixUsagePrincipal()).WriteResponse(record, runtime.JSONProducer())
		frames := prefixUsageFrames(t, record)
		last := frames[len(frames)-1]
		if *last.Status != "limited" || last.Reason != "entries" || *last.Totals.CurrentBytes != "2" {
			t.Fatalf("bad partial result: %+v", last)
		}
	})
	t.Run("disconnect cancels listing", func(t *testing.T) {
		prefixUsageFixture(t, nil)
		stopped := make(chan struct{})
		newPrefixUsageObjects = func(ctx context.Context, _ *models.Principal, _, _, _ string, _ bool) (<-chan minio.ObjectInfo, error) {
			out := make(chan minio.ObjectInfo)
			go func() {
				defer close(stopped)
				defer close(out)
				select {
				case out <- minio.ObjectInfo{Key: "a", Size: 1}:
				case <-ctx.Done():
					return
				}
				<-ctx.Done()
			}()
			return out, nil
		}
		ctx, cancel := context.WithCancel(context.Background())
		params := prefixUsageRequest()
		params.HTTPRequest = params.HTTPRequest.WithContext(ctx)
		responder := getPrefixUsageResponse(params, prefixUsagePrincipal())
		cancel()
		record := httptest.NewRecorder()
		responder.WriteResponse(record, runtime.JSONProducer())
		select {
		case <-stopped:
		case <-time.After(time.Second):
			t.Fatal("listing did not stop")
		}
		if strings.Contains(record.Body.String(), `"status":"complete"`) {
			t.Fatal("canceled scan was marked complete")
		}
	})
	t.Run("concurrency", func(t *testing.T) {
		t.Setenv("CONSOLE_PREFIX_USAGE_MAX_CONCURRENT", "1")
		prefixUsageFixture(t, nil)
		first := getPrefixUsageResponse(prefixUsageRequest(), prefixUsagePrincipal())
		second := httptest.NewRecorder()
		getPrefixUsageResponse(prefixUsageRequest(), prefixUsagePrincipal()).WriteResponse(second, runtime.JSONProducer())
		first.WriteResponse(httptest.NewRecorder(), runtime.JSONProducer())
		if second.Code != 429 {
			t.Fatalf("expected back pressure, got %d", second.Code)
		}
	})
}
func TestPrefixUsageConfiguration(t *testing.T) {
	for _, tc := range []struct{ key, value string }{{"CONSOLE_PREFIX_USAGE_MAX_ENTRIES", "-1"}, {"CONSOLE_PREFIX_USAGE_MAX_FOLDERS", "10001"}, {"CONSOLE_PREFIX_USAGE_MAX_CONCURRENT", "0"}, {"CONSOLE_PREFIX_USAGE_TIMEOUT", "1ms"}, {"CONSOLE_PREFIX_USAGE_PROGRESS_INTERVAL", "invalid"}} {
		t.Run(tc.key, func(t *testing.T) {
			t.Setenv(tc.key, tc.value)
			if _, err := readPrefixUsageLimits(); err == nil {
				t.Fatal("invalid configuration accepted")
			}
		})
	}
	t.Run("client initialization failure", func(t *testing.T) {
		prefixUsageFixture(t, nil)
		newPrefixUsageObjects = func(context.Context, *models.Principal, string, string, string, bool) (<-chan minio.ObjectInfo, error) {
			return nil, errors.New("client unavailable")
		}
		record := httptest.NewRecorder()
		getPrefixUsageResponse(prefixUsageRequest(), prefixUsagePrincipal()).WriteResponse(record, runtime.JSONProducer())
		if record.Code < 400 {
			t.Fatal("failed client reported success")
		}
	})
}
