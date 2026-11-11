// Copyright (c) 2026 Pigsty
// SPDX-License-Identifier: AGPL-3.0-or-later

package api

import (
	"context"
	"encoding/json"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/strfmt"
	saAPI "github.com/minio/console/api/operations/service_account"
	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/require"
)

type serviceAccountPolicyClient struct {
	MinioAdmin
	writes []madmin.UpdateServiceAccountReq
}

func (c *serviceAccountPolicyClient) updateServiceAccount(_ context.Context, _ string, request madmin.UpdateServiceAccountReq) error {
	c.writes = append(c.writes, request)
	return nil
}

// Exercise the generated Console binder and the actual SILO request payload.
// Empty strings must omit newPolicy on the wire, while explicit empty documents
// must survive validation and serialization so the server can remove a policy.
func TestServiceAccountPolicyUpdateContract(t *testing.T) {
	for _, tc := range []struct {
		name, policy, wantPolicy string
		invalidPolicy            bool
	}{
		{name: "metadata only"},
		{name: "legacy whitespace", policy: " \n\t"},
		{name: "explicit reset", policy: `{"Statement":[]}`, wantPolicy: `{"Statement":[]}`},
		{
			name:       "versioned reset",
			policy:     `{"Version":"2012-10-17","Statement":[]}`,
			wantPolicy: `{"Version":"2012-10-17","Statement":[]}`,
		},
		{
			name:       "new restriction",
			policy:     `{"Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`,
			wantPolicy: `{"Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`,
		},
		{name: "malformed JSON", policy: `{"Statement":`, invalidPolicy: true},
		{name: "json null string", policy: `null`, invalidPolicy: true},
		{name: "whitespace json null string", policy: " \nnull\t", invalidPolicy: true},
		{
			name:          "unknown top-level Statements field",
			policy:        `{"Version":"2012-10-17","Statements":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"]}]}`,
			invalidPolicy: true,
		},
		{
			name:          "unknown statement Conditions field",
			policy:        `{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::bucket/*"],"Conditions":{"IpAddress":{"aws:SourceIp":["10.0.0.0/8"]}}}]}`,
			invalidPolicy: true,
		},
		{
			name:          "invalid action",
			policy:        `{"Statement":[{"Effect":"Allow","Action":["s3:NotAnAction"],"Resource":["*"]}]}`,
			invalidPolicy: true,
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			body, err := json.Marshal(map[string]string{
				"policy": tc.policy, "name": "renamed", "description": "updated description", "status": "off",
			})
			require.NoError(t, err)
			request := httptest.NewRequest("PUT", "/api/v1/service-accounts/access", strings.NewReader(string(body)))
			request.Header.Set("Content-Type", "application/json")
			params := saAPI.NewUpdateServiceAccountParams()
			require.NoError(t, params.BindRequest(request, &middleware.MatchedRoute{
				Consumer: runtime.JSONConsumer(), Formats: strfmt.Default,
			}))
			require.NotNil(t, params.Body.Policy)
			client := &serviceAccountPolicyClient{}
			err = updateServiceAccountDetails(t.Context(), client, "access", *params.Body.Policy, nil, params.Body.Name, params.Body.Description, params.Body.Status, "")
			if tc.invalidPolicy {
				require.ErrorIs(t, err, ErrInvalidPolicyDocument)
				require.Empty(t, client.writes)
				return
			}
			require.NoError(t, err)
			require.Len(t, client.writes, 1)
			wire, err := json.Marshal(client.writes[0])
			require.NoError(t, err)
			var sent map[string]json.RawMessage
			require.NoError(t, json.Unmarshal(wire, &sent))
			require.JSONEq(t, `"renamed"`, string(sent["newName"]))
			require.JSONEq(t, `"updated description"`, string(sent["newDescription"]))
			require.JSONEq(t, `"off"`, string(sent["newStatus"]))
			if tc.wantPolicy == "" {
				require.NotContains(t, sent, "newPolicy")
			} else {
				require.JSONEq(t, tc.wantPolicy, string(sent["newPolicy"]))
			}
		})
	}
}

func TestServiceAccountPolicyUpdateRequiredFieldContract(t *testing.T) {
	for _, body := range []string{`{"name":"renamed"}`, `{"policy":null}`, `{"policy":{}}`} {
		t.Run(body, func(t *testing.T) {
			request := httptest.NewRequest("PUT", "/api/v1/service-accounts/access", strings.NewReader(body))
			request.Header.Set("Content-Type", "application/json")
			params := saAPI.NewUpdateServiceAccountParams()
			require.Error(t, params.BindRequest(request, &middleware.MatchedRoute{
				Consumer: runtime.JSONConsumer(), Formats: strfmt.Default,
			}))
			require.Nil(t, params.Body)
		})
	}
}
