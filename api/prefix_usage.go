// Copyright (c) 2026 Urbanize
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
	"unicode/utf8"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
	objectAPI "github.com/minio/console/api/operations/object"
	"github.com/minio/console/models"
	"github.com/minio/console/pkg/usage"
	"github.com/minio/minio-go/v7"
)

type prefixUsageLimits struct {
	duration time.Duration
	interval time.Duration
	entries  int64
	folders  int64
	parallel int64
}

func readPrefixUsageLimits() (prefixUsageLimits, error) {
	limits := prefixUsageLimits{duration: 10 * time.Minute, interval: time.Second, entries: 10_000_000, folders: 1000, parallel: 2}
	for _, setting := range []struct {
		name    string
		value   *int64
		ceiling int64
	}{
		{"CONSOLE_PREFIX_USAGE_MAX_ENTRIES", &limits.entries, 1_000_000_000_000},
		{"CONSOLE_PREFIX_USAGE_MAX_FOLDERS", &limits.folders, 10_000},
		{"CONSOLE_PREFIX_USAGE_MAX_CONCURRENT", &limits.parallel, 64},
	} {
		if raw, present := os.LookupEnv(setting.name); present {
			value, err := strconv.ParseInt(raw, 10, 64)
			if err != nil || value < 1 || value > setting.ceiling {
				return limits, fmt.Errorf("invalid %s", setting.name)
			}
			*setting.value = value
		}
	}
	for _, setting := range []struct {
		name             string
		value            *time.Duration
		minimum, maximum time.Duration
	}{
		{"CONSOLE_PREFIX_USAGE_TIMEOUT", &limits.duration, time.Second, time.Hour},
		{"CONSOLE_PREFIX_USAGE_PROGRESS_INTERVAL", &limits.interval, 100 * time.Millisecond, 30 * time.Second},
	} {
		if raw, present := os.LookupEnv(setting.name); present {
			value, err := time.ParseDuration(raw)
			if err != nil || value < setting.minimum || value > setting.maximum {
				return limits, fmt.Errorf("invalid %s", setting.name)
			}
			*setting.value = value
		}
	}
	return limits, nil
}

type prefixUsageCounts = usage.Counts

func prefixUsageStats(counts usage.Counts) *models.PrefixUsageStats {
	return &models.PrefixUsageStats{
		CurrentBytes:     swag.String(strconv.FormatUint(counts.CurrentBytes, 10)),
		RetainedBytes:    swag.String(strconv.FormatUint(counts.RetainedBytes, 10)),
		CurrentObjects:   swag.Int64(counts.CurrentObjects),
		RetainedVersions: swag.Int64(counts.RetainedVersions),
		DeleteMarkers:    swag.Int64(counts.DeleteMarkers),
	}
}

type prefixUsageScan struct {
	bucket, prefix           string
	versions, includeFolders bool
	started                  time.Time
	entries                  int64
	totals                   prefixUsageCounts
	folders                  map[string]prefixUsageCounts
}

func (scan *prefixUsageScan) append(object minio.ObjectInfo, limits prefixUsageLimits) (string, error) {
	if !strings.HasPrefix(object.Key, scan.prefix) || object.Key == "" {
		return "", errors.New("listing returned an object outside the requested prefix")
	}
	if scan.entries >= limits.entries {
		return "entries", nil
	}
	folder := ""
	if scan.includeFolders {
		relative := strings.TrimPrefix(object.Key, scan.prefix)
		if slash := strings.IndexByte(relative, '/'); slash >= 0 {
			folder = scan.prefix + relative[:slash+1]
			if _, exists := scan.folders[folder]; !exists && int64(len(scan.folders)) >= limits.folders {
				return "folders", nil
			}
		}
	}
	totals, err := scan.totals.Add(object, scan.versions)
	if err != nil {
		return "", err
	}
	if folder != "" {
		counts, err := scan.folders[folder].Add(object, scan.versions)
		if err != nil {
			return "", err
		}
		scan.folders[folder] = counts
	}
	scan.totals = totals
	scan.entries++
	return "", nil
}

func (scan *prefixUsageScan) frame(status, reason, message string) *models.PrefixUsageFrame {
	mode := "current"
	if scan.versions {
		mode = "versions"
	}
	started, updated := strfmt.DateTime(scan.started), strfmt.DateTime(time.Now().UTC())
	folders := make([]*models.PrefixUsageFolder, 0, len(scan.folders))
	for _, key := range sortedPrefixUsageFolders(scan.folders) {
		folders = append(folders, &models.PrefixUsageFolder{Prefix: swag.String(key), Usage: prefixUsageStats(scan.folders[key])})
	}
	return &models.PrefixUsageFrame{
		Bucket: swag.String(scan.bucket), Prefix: swag.String(scan.prefix), Mode: swag.String(mode),
		Status: swag.String(status), Reason: reason, Message: message,
		StartedAt: &started, UpdatedAt: &updated, ScannedEntries: swag.Int64(scan.entries),
		Totals: prefixUsageStats(scan.totals), Folders: folders,
	}
}

func sortedPrefixUsageFolders(folders map[string]prefixUsageCounts) []string {
	keys := make([]string, 0, len(folders))
	for key := range folders {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

var prefixUsageActive atomic.Int64

// The SDK lists only metadata with the caller's credentials. The request context
// cancels its pagination and transport when the browser stops or disconnects.
var newPrefixUsageObjects = func(ctx context.Context, session *models.Principal, clientIP, bucket, prefix string, versions bool) (<-chan minio.ObjectInfo, error) {
	client, err := newMinioClient(session, clientIP)
	if err != nil {
		return nil, err
	}
	return client.ListObjects(ctx, bucket, minio.ListObjectsOptions{
		Prefix: prefix, Recursive: true, WithVersions: versions, MaxKeys: objectPageMaxSize,
	}), nil
}

func prefixUsageError(code int, message string) middleware.Responder {
	return objectAPI.NewPrefixUsageDefault(code).WithPayload(&models.APIError{Message: message})
}

func prefixUsageUpstreamError(err error) middleware.Responder {
	response := minio.ToErrorResponse(err)
	switch response.Code {
	case "AccessDenied", "InvalidAccessKeyId", "SignatureDoesNotMatch", "ExpiredToken", "InvalidToken":
		return prefixUsageError(http.StatusForbidden, "Listing this folder is not permitted with the current session.")
	case "NoSuchBucket":
		return prefixUsageError(http.StatusNotFound, "The bucket was not found.")
	default:
		return prefixUsageError(http.StatusBadGateway, "The object listing is unavailable. Try again shortly.")
	}
}

func getPrefixUsageResponse(params objectAPI.PrefixUsageParams, session *models.Principal) middleware.Responder {
	if session == nil || session.STSAccessKeyID == "" || session.STSSecretAccessKey == "" {
		return prefixUsageError(http.StatusUnauthorized, "A signed-in session is required.")
	}
	if !utf8.ValidString(params.Prefix) || len(params.Prefix) > 1024 || (params.Prefix != "" && !strings.HasSuffix(params.Prefix, "/")) {
		return prefixUsageError(http.StatusBadRequest, "Choose a folder prefix ending in slash.")
	}
	limits, err := readPrefixUsageLimits()
	if err != nil {
		return prefixUsageError(http.StatusServiceUnavailable, "Folder usage configuration is invalid.")
	}
	if prefixUsageActive.Add(1) > limits.parallel {
		prefixUsageActive.Add(-1)
		return prefixUsageError(http.StatusTooManyRequests, "Other size calculations are running. Try again shortly.")
	}
	started := time.Now().UTC()
	ctx, cancel := context.WithTimeout(params.HTTPRequest.Context(), limits.duration)
	versions := params.Versions != nil && *params.Versions
	objects, err := newPrefixUsageObjects(ctx, session, getClientIP(params.HTTPRequest), params.BucketName, params.Prefix, versions)
	if err != nil {
		cancel()
		prefixUsageActive.Add(-1)
		return prefixUsageUpstreamError(err)
	}
	cleanup := func() {
		cancel()
		// ListObjects documents draining after cancellation to release its sender.
		for range objects {
		}
		prefixUsageActive.Add(-1)
	}
	var first minio.ObjectInfo
	var open bool
	select {
	case first, open = <-objects:
		if open && first.Err != nil {
			cleanup()
			return prefixUsageUpstreamError(first.Err)
		}
	case <-ctx.Done():
		cleanup()
		return prefixUsageError(http.StatusGatewayTimeout, "The folder listing did not respond in time.")
	}
	scan := &prefixUsageScan{bucket: params.BucketName, prefix: params.Prefix, versions: versions,
		includeFolders: params.Folders == nil || *params.Folders, started: started, folders: map[string]prefixUsageCounts{}}
	return middleware.ResponderFunc(func(writer http.ResponseWriter, _ runtime.Producer) {
		defer cleanup()
		writer.Header().Set("Content-Type", "application/x-ndjson")
		writer.Header().Set("Cache-Control", "no-store")
		writer.Header().Set("X-Accel-Buffering", "no")
		encoder := json.NewEncoder(writer)
		emit := func(status, reason, message string) bool {
			if encoder.Encode(scan.frame(status, reason, message)) != nil {
				return false
			}
			return http.NewResponseController(writer).Flush() == nil
		}
		if !emit("scanning", "", "") {
			return
		}
		if !open {
			emit("complete", "", "")
			return
		}
		ticker := time.NewTicker(limits.interval)
		defer ticker.Stop()
		for {
			if ctx.Err() != nil {
				if params.HTTPRequest.Context().Err() == nil {
					emit("limited", "duration", "The scan reached its time limit. These totals are incomplete.")
				}
				return
			}
			if first.Err != nil {
				emit("failed", "upstream", "The listing failed. These totals are incomplete.")
				return
			}
			reason, err := scan.append(first, limits)
			if err != nil {
				emit("failed", "upstream", "The listing returned invalid metadata. These totals are incomplete.")
				return
			}
			if reason != "" {
				emit("limited", reason, "The scan reached its limit. These totals are incomplete.")
				return
			}
			for {
				select {
				case first, open = <-objects:
					if !open {
						if ctx.Err() != nil {
							emit("limited", "duration", "The scan reached its time limit. These totals are incomplete.")
						} else {
							emit("complete", "", "")
						}
						return
					}
					goto nextObject
				case <-ticker.C:
					if !emit("scanning", "", "") {
						return
					}
				case <-ctx.Done():
					if params.HTTPRequest.Context().Err() == nil {
						emit("limited", "duration", "The scan reached its time limit. These totals are incomplete.")
					}
					return
				}
			}
		nextObject:
		}
	})
}
