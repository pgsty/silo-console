// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/minio/console/pkg/utils"

	"github.com/minio/console/api/operations"
	systemApi "github.com/minio/console/api/operations/system"
	"github.com/minio/console/models"
	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type AdminInfoTestSuite struct {
	suite.Suite
	assert                      *assert.Assertions
	currentServer               string
	isServerSet                 bool
	isPrometheusRequest         bool
	server                      *httptest.Server
	adminClient                 AdminClientMock
	previousMinioServerInfoMock func(context.Context) (madmin.InfoMessage, error)
}

func (suite *AdminInfoTestSuite) SetupSuite() {
	suite.assert = assert.New(suite.T())
	suite.adminClient = AdminClientMock{}
	suite.previousMinioServerInfoMock = MinioServerInfoMock
	MinioServerInfoMock = func(_ context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{
			Servers: []madmin.ServerProperties{{
				Disks: []madmin.Disk{{}},
			}},
			Backend: madmin.ErasureBackend{Type: "mock"},
		}, nil
	}
}

func (suite *AdminInfoTestSuite) SetupTest() {
	suite.server = httptest.NewServer(http.HandlerFunc(suite.serverHandler))
	suite.currentServer, suite.isServerSet = os.LookupEnv(ConsoleMinIOServer)
	os.Setenv(ConsoleMinIOServer, suite.server.URL)
}

func (suite *AdminInfoTestSuite) serverHandler(w http.ResponseWriter, _ *http.Request) {
	if suite.isPrometheusRequest {
		w.WriteHeader(200)
	} else {
		w.WriteHeader(400)
	}
}

func (suite *AdminInfoTestSuite) TearDownSuite() {
	MinioServerInfoMock = suite.previousMinioServerInfoMock
}

func (suite *AdminInfoTestSuite) TearDownTest() {
	suite.server.Close()
	if suite.isServerSet {
		os.Setenv(ConsoleMinIOServer, suite.currentServer)
	} else {
		os.Unsetenv(ConsoleMinIOServer)
	}
}

func (suite *AdminInfoTestSuite) TestRegisterAdminInfoHandlers() {
	api := &operations.ConsoleAPI{}
	suite.assertHandlersAreNil(api)
	registerAdminInfoHandlers(api)
	suite.assertHandlersAreNotNil(api)
}

func (suite *AdminInfoTestSuite) assertHandlersAreNil(api *operations.ConsoleAPI) {
	suite.assert.Nil(api.SystemAdminInfoHandler)
	suite.assert.Nil(api.SystemDashboardWidgetDetailsHandler)
}

func (suite *AdminInfoTestSuite) assertHandlersAreNotNil(api *operations.ConsoleAPI) {
	suite.assert.NotNil(api.SystemAdminInfoHandler)
	suite.assert.NotNil(api.SystemDashboardWidgetDetailsHandler)
}

func (suite *AdminInfoTestSuite) TestSystemAdminInfoHandlerWithError() {
	params, api := suite.initSystemAdminInfoRequest()
	response := api.SystemAdminInfoHandler.Handle(params, &models.Principal{})
	_, ok := response.(*systemApi.AdminInfoDefault)
	suite.assert.True(ok)
}

func (suite *AdminInfoTestSuite) initSystemAdminInfoRequest() (params systemApi.AdminInfoParams, api operations.ConsoleAPI) {
	registerAdminInfoHandlers(&api)
	params.HTTPRequest = &http.Request{}
	defaultOnly := false
	params.DefaultOnly = &defaultOnly
	return params, api
}

func (suite *AdminInfoTestSuite) TestSystemDashboardWidgetDetailsHandlerWithError() {
	params, api := suite.initSystemDashboardWidgetDetailsRequest()
	response := api.SystemDashboardWidgetDetailsHandler.Handle(params, &models.Principal{})
	_, ok := response.(*systemApi.DashboardWidgetDetailsDefault)
	suite.assert.True(ok)
}

func (suite *AdminInfoTestSuite) initSystemDashboardWidgetDetailsRequest() (params systemApi.DashboardWidgetDetailsParams, api operations.ConsoleAPI) {
	registerAdminInfoHandlers(&api)
	params.HTTPRequest = &http.Request{}
	return params, api
}

func (suite *AdminInfoTestSuite) TestGetUsageWidgetsForDeploymentWithoutError() {
	ctx := context.WithValue(context.Background(), utils.ContextClientIP, "127.0.0.1")
	suite.isPrometheusRequest = true
	res, err := getUsageWidgetsForDeployment(ctx, suite.server.URL, suite.adminClient)
	suite.assert.Nil(err)
	suite.assert.NotNil(res)
	suite.isPrometheusRequest = false
}

func (suite *AdminInfoTestSuite) TestGetWidgetDetailsWithoutError() {
	ctx := context.WithValue(context.Background(), utils.ContextClientIP, "127.0.0.1")
	suite.isPrometheusRequest = true
	var step int32 = 1
	var start int64
	var end int64 = 1
	res, err := getWidgetDetails(ctx, suite.server.URL, "mock", 1, &step, &start, &end)
	suite.assert.Nil(err)
	suite.assert.NotNil(res)
	suite.isPrometheusRequest = false
}

func TestAdminInfo(t *testing.T) {
	suite.Run(t, new(AdminInfoTestSuite))
}

func setPrometheusAuthEnv(t *testing.T, token, username, password string) {
	t.Helper()
	t.Setenv(PrometheusAuthToken, token)
	t.Setenv(PrometheusAuthUsername, username)
	t.Setenv(PrometheusAuthPassword, password)
}

func useIsolatedPrometheusTransport(t *testing.T) {
	t.Helper()
	previousTransport := GlobalTransport
	transport := http.DefaultTransport.(*http.Transport).Clone()
	GlobalTransport = transport
	t.Cleanup(func() {
		transport.CloseIdleConnections()
		GlobalTransport = previousTransport
	})
}

func TestUnmarshalPrometheusUsesBasicAuth(t *testing.T) {
	setPrometheusAuthEnv(t, "", "prom-user", "prom-password")

	authorization := make(chan string, 1)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization <- r.Header.Get("Authorization")
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"success"}`))
	}))
	t.Cleanup(server.Close)

	var response map[string]string
	failed := unmarshalPrometheus(context.Background(), server.Client(), server.URL, &response)

	assert.False(t, failed)
	assert.Equal(t, "Basic cHJvbS11c2VyOnByb20tcGFzc3dvcmQ=", <-authorization)
	assert.Equal(t, "success", response["status"])
}

func TestPrometheusHealthAuthentication(t *testing.T) {
	tests := []struct {
		name                  string
		token                 string
		username              string
		password              string
		expectedAuthorization string
	}{
		{
			name:                  "basic authentication",
			username:              "prom-user",
			password:              "prom-password",
			expectedAuthorization: "Basic cHJvbS11c2VyOnByb20tcGFzc3dvcmQ=",
		},
		{
			name:                  "bearer token takes precedence",
			token:                 "prom-token",
			username:              "ignored-user",
			password:              "ignored-password",
			expectedAuthorization: "Bearer prom-token",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			setPrometheusAuthEnv(t, test.token, test.username, test.password)
			useIsolatedPrometheusTransport(t)

			authorization := make(chan string, 1)
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				authorization <- r.Header.Get("Authorization")
				w.WriteHeader(http.StatusOK)
			}))
			t.Cleanup(server.Close)

			assert.True(t, testPrometheusURL(context.Background(), server.URL))
			assert.Equal(t, test.expectedAuthorization, <-authorization)
		})
	}
}

func TestPrometheusRootFallbackUsesAuthentication(t *testing.T) {
	setPrometheusAuthEnv(t, "", "prom-user", "prom-password")
	useIsolatedPrometheusTransport(t)

	authorizations := make(chan string, 2)
	paths := make(chan string, 2)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorizations <- r.Header.Get("Authorization")
		paths <- r.URL.Path
		if r.URL.Path == "/prometheus/-/healthy" {
			connection, _, err := w.(http.Hijacker).Hijack()
			if err == nil {
				_ = connection.Close()
			}
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
	t.Cleanup(server.Close)

	assert.True(t, testPrometheusURL(context.Background(), server.URL+"/prometheus"))
	assert.Equal(t, "/prometheus/-/healthy", <-paths)
	assert.Equal(t, "/-/healthy", <-paths)
	assert.Equal(t, "Basic cHJvbS11c2VyOnByb20tcGFzc3dvcmQ=", <-authorizations)
	assert.Equal(t, "Basic cHJvbS11c2VyOnByb20tcGFzc3dvcmQ=", <-authorizations)
}

func TestPrometheusHealthCheckReusesConnection(t *testing.T) {
	setPrometheusAuthEnv(t, "", "", "")
	useIsolatedPrometheusTransport(t)

	remoteAddresses := make(chan string, 2)
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		remoteAddresses <- r.RemoteAddr
		w.Header().Set("Content-Length", "4096")
		_, _ = w.Write(make([]byte, 4096))
	}))
	t.Cleanup(server.Close)

	assert.True(t, testPrometheusURL(context.Background(), server.URL))
	assert.True(t, testPrometheusURL(context.Background(), server.URL))
	assert.Equal(t, <-remoteAddresses, <-remoteAddresses, "health responses should be drained so the connection can be reused")
}
