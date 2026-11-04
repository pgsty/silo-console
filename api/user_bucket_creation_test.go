// Copyright (c) 2026 PGSTY
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/go-openapi/runtime"
	"github.com/minio/console/api/operations"
	bucketAPI "github.com/minio/console/api/operations/bucket"
	"github.com/minio/console/models"
	"github.com/stretchr/testify/require"
)

// Exercise the registered handler and real S3/admin HTTP clients. Backend state
// is separate from the response assertions so false success cannot pass.
func TestBucketCreationConfiguration(t *testing.T) {
	const name = "creation-contract"
	for _, tc := range []struct {
		name, config, fail string
		rollbackDenied     bool
		wantStatus         int
		wantCreated        bool
	}{
		{"plain", "", "", false, 200, true},
		{"quota", `,"quota":{"enabled":true,"quota_type":"hard","amount":1024}`, "", false, 200, true},
		{"retention without versioning", `,"retention":{"mode":"governance","unit":"days","validity":1}`, "", false, 200, true},
		{"negative quota", `,"quota":{"enabled":true,"quota_type":"hard","amount":-1}`, "", false, 400, false},
		{"missing quota type", `,"quota":{"enabled":true,"amount":1024}`, "", false, 400, false},
		{"missing quota enabled", `,"quota":{"amount":1024}`, "", false, 400, false},
		{"zero retention", `,"retention":{"mode":"governance","unit":"days","validity":0}`, "", false, 400, false},
		{"missing retention unit", `,"retention":{"mode":"governance","validity":1}`, "", false, 400, false},
		{"invalid retention mode", `,"retention":{"mode":"unknown","unit":"days","validity":1}`, "", false, 400, false},
		{"creation denied", "", "create", false, 403, false},
		{"quota denied with rollback", `,"quota":{"enabled":true,"quota_type":"hard","amount":1024}`, "quota", false, 403, false},
		{"quota denied without delete permission", `,"quota":{"enabled":true,"quota_type":"hard","amount":1024}`, "quota", true, 403, true},
		{"versioning denied", `,"versioning":{"enabled":true}`, "versioning", false, 403, false},
		{"retention denied", `,"retention":{"mode":"governance","unit":"days","validity":1}`, "retention", false, 403, false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var mu sync.Mutex
			created, locked := false, false
			var calls []string
			var retention, versioning, quota string
			backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				mu.Lock()
				defer mu.Unlock()
				w.Header().Set("Content-Type", "application/xml")
				if r.Method == http.MethodGet && r.URL.Query().Has("location") {
					_, _ = fmt.Fprint(w, `<LocationConstraint xmlns="http://s3.amazonaws.com/doc/2006-03-01/">us-east-1</LocationConstraint>`)
					return
				}
				operation := ""
				switch {
				case r.Method == http.MethodDelete:
					operation = "rollback"
				case r.URL.Path == "/minio/admin/v3/set-bucket-quota":
					operation = "quota"
				case r.Method == http.MethodPut && r.URL.Query().Has("versioning"):
					operation = "versioning"
				case r.Method == http.MethodPut && r.URL.Query().Has("object-lock"):
					operation = "retention"
				case r.Method == http.MethodPut && strings.Trim(r.URL.Path, "/") == name:
					operation = "create"
				default:
					t.Errorf("unexpected backend request: %s %s", r.Method, r.URL)
					w.WriteHeader(http.StatusBadRequest)
					return
				}
				calls = append(calls, operation)
				if operation == tc.fail || operation == "rollback" && tc.rollbackDenied {
					if operation == "quota" {
						w.Header().Set("Content-Type", "application/json")
						w.WriteHeader(http.StatusForbidden)
						_, _ = fmt.Fprint(w, `{"Code":"AccessDenied","Message":"Access Denied."}`)
					} else {
						w.WriteHeader(http.StatusForbidden)
						_, _ = fmt.Fprint(w, `<Error><Code>AccessDenied</Code><Message>Access Denied.</Message></Error>`)
					}
					return
				}
				body, err := io.ReadAll(r.Body)
				if err != nil {
					t.Errorf("read request: %v", err)
				}
				switch operation {
				case "create":
					created = true
					locked = r.Header.Get("X-Amz-Bucket-Object-Lock-Enabled") == "true"
				case "quota":
					quota = string(body)
				case "versioning":
					versioning = string(body)
				case "retention":
					retention = string(body)
				case "rollback":
					created = false
					w.WriteHeader(http.StatusNoContent)
					return
				}
				w.WriteHeader(http.StatusOK)
			}))
			defer backend.Close()
			t.Setenv(ConsoleMinIOServer, backend.URL)
			var body models.MakeBucketRequest
			require.NoError(t, json.Unmarshal([]byte(`{"name":"`+name+`"`+tc.config+`}`), &body))
			api := &operations.ConsoleAPI{}
			registerBucketsHandlers(api)
			response := api.BucketMakeBucketHandler.Handle(bucketAPI.MakeBucketParams{
				HTTPRequest: httptest.NewRequest(http.MethodPost, "/api/v1/buckets", nil), Body: &body,
			}, &models.Principal{STSAccessKeyID: "test-access", STSSecretAccessKey: "test-secret"})
			rec := httptest.NewRecorder()
			response.WriteResponse(rec, runtime.JSONProducer())
			require.Equal(t, tc.wantStatus, rec.Code, rec.Body.String())
			mu.Lock()
			defer mu.Unlock()
			require.Equal(t, tc.wantCreated, created, "backend state; calls: %v", calls)
			if tc.wantStatus == 400 {
				require.Empty(t, calls, "invalid input must not create a bucket")
			}
			if tc.fail != "" && tc.fail != "create" {
				require.Equal(t, "rollback", calls[len(calls)-1])
				if tc.rollbackDenied {
					require.Contains(t, rec.Body.String(), "may still exist")
					require.Contains(t, rec.Body.String(), "rollback failed")
				} else {
					require.Contains(t, rec.Body.String(), "was removed")
				}
			}
			if tc.fail == "create" {
				require.Equal(t, []string{"create"}, calls, "never delete a bucket we did not create")
			}
			if tc.wantStatus == 200 && body.Retention != nil {
				require.True(t, locked)
				require.Contains(t, versioning, "<Status>Enabled</Status>")
				require.NotContains(t, versioning, "<Exclude")
				require.Contains(t, retention, "<Mode>GOVERNANCE</Mode>")
				require.Contains(t, retention, "<Days>1</Days>")
			}
			if tc.wantStatus == 200 && body.Quota != nil {
				require.JSONEq(t, `{"size":1024,"quota":0,"rate":0,"requests":0,"quotatype":"hard"}`, quota)
			}
		})
	}
}

// Rollback is limited to the bucket this request created, and still runs when
// the browser disconnects. A bucket that is in use is reported, never forced.
func TestBucketCreationRollbackBoundaries(t *testing.T) {
	const name = "creation-boundary"
	errorXML := func(code string) string {
		return `<Error><Code>` + code + `</Code><Message>` + code + `</Message><BucketName>` + name + `</BucketName></Error>`
	}
	for _, tc := range []struct {
		name, config         string
		createStatus         int
		createCode           string
		deleteStatus         int
		deleteCode           string
		disconnectVersioning bool
		wantCalls            []string
		wantMessage          string
		wantCreated          bool
	}{
		{
			name: "existing bucket", config: `,"quota":{"enabled":true,"quota_type":"hard","amount":1024}`,
			createStatus: http.StatusConflict, createCode: "BucketAlreadyOwnedByYou",
			wantCalls: []string{"create"}, wantCreated: true,
		},
		{
			name: "rollback refused because the bucket is in use", config: `,"versioning":{"enabled":true}`,
			deleteStatus: http.StatusConflict, deleteCode: "BucketNotEmpty",
			wantCalls: []string{"create", "versioning", "rollback"}, wantMessage: "may still exist", wantCreated: true,
		},
		{
			name: "browser disconnects after creation", config: `,"versioning":{"enabled":true}`,
			disconnectVersioning: true,
			wantCalls:            []string{"create", "versioning", "rollback"}, wantMessage: "was removed",
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var mu sync.Mutex
			var calls []string
			created := tc.createStatus == http.StatusConflict
			request, disconnect := context.WithCancel(context.Background())
			defer disconnect()
			record := func(operation string) {
				mu.Lock()
				defer mu.Unlock()
				calls = append(calls, operation)
			}
			backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Header().Set("Content-Type", "application/xml")
				switch {
				case r.Method == http.MethodGet && r.URL.Query().Has("location"):
					_, _ = fmt.Fprint(w, `<LocationConstraint xmlns="http://s3.amazonaws.com/doc/2006-03-01/">us-east-1</LocationConstraint>`)
				case r.Method == http.MethodPut && r.URL.Query().Has("versioning"):
					record("versioning")
					if tc.disconnectVersioning {
						disconnect()
						// The client abandons this call; the server may not notice.
						select {
						case <-r.Context().Done():
						case <-time.After(time.Second):
						}
						return
					}
					w.WriteHeader(http.StatusForbidden)
					_, _ = fmt.Fprint(w, errorXML("AccessDenied"))
				case r.Method == http.MethodPut && strings.Trim(r.URL.Path, "/") == name:
					record("create")
					if tc.createStatus != 0 {
						w.WriteHeader(tc.createStatus)
						_, _ = fmt.Fprint(w, errorXML(tc.createCode))
						return
					}
					mu.Lock()
					created = true
					mu.Unlock()
				case r.Method == http.MethodDelete:
					record("rollback")
					if r.Context().Err() != nil {
						t.Error("rollback inherited the canceled browser request")
					}
					if tc.deleteStatus != 0 {
						w.WriteHeader(tc.deleteStatus)
						_, _ = fmt.Fprint(w, errorXML(tc.deleteCode))
						return
					}
					mu.Lock()
					created = false
					mu.Unlock()
					w.WriteHeader(http.StatusNoContent)
				default:
					t.Errorf("unexpected backend request: %s %s", r.Method, r.URL)
					w.WriteHeader(http.StatusBadRequest)
				}
			}))
			defer backend.Close()
			t.Setenv(ConsoleMinIOServer, backend.URL)
			var body models.MakeBucketRequest
			require.NoError(t, json.Unmarshal([]byte(`{"name":"`+name+`"`+tc.config+`}`), &body))
			api := &operations.ConsoleAPI{}
			registerBucketsHandlers(api)
			response := api.BucketMakeBucketHandler.Handle(bucketAPI.MakeBucketParams{
				HTTPRequest: httptest.NewRequest(http.MethodPost, "/api/v1/buckets", nil).WithContext(request), Body: &body,
			}, &models.Principal{STSAccessKeyID: "test-access", STSSecretAccessKey: "test-secret"})
			rec := httptest.NewRecorder()
			response.WriteResponse(rec, runtime.JSONProducer())
			require.NotEqual(t, http.StatusOK, rec.Code, rec.Body.String())
			mu.Lock()
			defer mu.Unlock()
			require.Equal(t, tc.wantCalls, calls)
			require.Equal(t, tc.wantCreated, created, "backend bucket state")
			if tc.wantMessage != "" {
				require.Contains(t, rec.Body.String(), tc.wantMessage)
			}
		})
	}
}

func TestBucketCreationRejectsVersioningExclusionsWithLocking(t *testing.T) {
	for _, config := range []string{
		`,"locking":true,"versioning":{"enabled":true,"excludePrefixes":["logs/"]}`,
		`,"locking":true,"versioning":{"enabled":true,"excludeFolders":true}`,
		`,"retention":{"mode":"governance","unit":"days","validity":1},"versioning":{"enabled":true,"excludeFolders":true}`,
	} {
		t.Run(config, func(t *testing.T) {
			backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				t.Errorf("invalid input reached the backend: %s %s", r.Method, r.URL)
				w.WriteHeader(http.StatusBadRequest)
			}))
			defer backend.Close()
			t.Setenv(ConsoleMinIOServer, backend.URL)
			var body models.MakeBucketRequest
			require.NoError(t, json.Unmarshal([]byte(`{"name":"creation-exclusions"`+config+`}`), &body))
			api := &operations.ConsoleAPI{}
			registerBucketsHandlers(api)
			response := api.BucketMakeBucketHandler.Handle(bucketAPI.MakeBucketParams{
				HTTPRequest: httptest.NewRequest(http.MethodPost, "/api/v1/buckets", nil), Body: &body,
			}, &models.Principal{STSAccessKeyID: "test-access", STSSecretAccessKey: "test-secret"})
			rec := httptest.NewRecorder()
			response.WriteResponse(rec, runtime.JSONProducer())
			require.Equal(t, http.StatusBadRequest, rec.Code, rec.Body.String())
			require.Contains(t, rec.Body.String(), "versioning exclusions")
		})
	}
}
