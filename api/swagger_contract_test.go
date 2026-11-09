// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-openapi/loads"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	"github.com/minio/console/api/operations"
	"github.com/minio/console/api/operations/bucket"
	"github.com/stretchr/testify/require"
)

func TestSwaggerDocumentationRoutes(t *testing.T) {
	spec, err := loads.Embedded(SwaggerJSON, FlatSwaggerJSON)
	require.NoError(t, err)
	consoleAPI := operations.NewConsoleAPI(spec)
	handler := setupGlobalMiddleware(consoleAPI.Serve(nil))
	docs := httptest.NewRecorder()
	handler.ServeHTTP(docs, httptest.NewRequest(http.MethodGet, "/api/v1/docs", nil))
	require.Equal(t, http.StatusOK, docs.Code)
	require.Contains(t, docs.Header().Get("Content-Type"), "text/html")
	require.Contains(t, docs.Body.String(), "<redoc spec-url='/swagger.json'>")
	require.Contains(t, docs.Body.String(), `<script type="module" src="https://cdn.jsdelivr.net/npm/redoc@3/bundles/redoc.standalone.js">`)

	document := httptest.NewRecorder()
	handler.ServeHTTP(document, httptest.NewRequest(http.MethodGet, "/swagger.json", nil))
	require.Equal(t, http.StatusOK, document.Code)
	var decoded struct {
		Swagger  string                     `json:"swagger"`
		BasePath string                     `json:"basePath"`
		Paths    map[string]json.RawMessage `json:"paths"`
	}
	require.NoError(t, json.Unmarshal(document.Body.Bytes(), &decoded))
	require.Equal(t, "2.0", decoded.Swagger)
	require.Equal(t, "/api/v1", decoded.BasePath)
	require.Contains(t, decoded.Paths, "/configs/import")
}

// Exercise a real generated request binder: validation must reject a bad later
// array item and required fields while preserving supported notification events.
func TestSwaggerRequestValidationContract(t *testing.T) {
	for _, tc := range []struct {
		name, body, errorPath string
	}{
		{"valid", `{"events":["put","delete","ilm"],"prefix":"","suffix":""}`, ""},
		{"bad later event", `{"events":["put","invalid"],"prefix":"","suffix":""}`, "events.1"},
		{"zero event", `{"events":["","delete"],"prefix":"","suffix":""}`, "events.0"},
		{"required field", `{"events":["put"],"suffix":""}`, "prefix"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			request := httptest.NewRequest(http.MethodDelete, "/api/v1/buckets/test/events/arn", strings.NewReader(tc.body))
			request.Header.Set("Content-Type", "application/json")
			params := bucket.NewDeleteBucketEventParams()
			err := params.BindRequest(request, &middleware.MatchedRoute{
				Consumer: runtime.JSONConsumer(), Formats: strfmt.Default,
				Params: middleware.RouteParams{{Name: "bucket_name", Value: "test"}, {Name: "arn", Value: "arn"}},
			})
			if tc.errorPath == "" {
				require.NoError(t, err)
				require.Len(t, params.Body.Events, 3)
				return
			}
			require.ErrorContains(t, err, tc.errorPath)
			require.Nil(t, params.Body, "invalid payload must not reach the handler")
		})
	}
}
