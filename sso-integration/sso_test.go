//go:build testrunmain

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

package ssointegration

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/minio/console/models"

	"github.com/go-openapi/loads"
	"github.com/minio/console/api"
	"github.com/minio/console/api/operations"
	consoleoauth2 "github.com/minio/console/pkg/auth/idp/oauth2"
	"github.com/stretchr/testify/require"
)

func startConsoleServer(t *testing.T, initialize func() (*api.Server, error)) string {
	t.Helper()

	previousTransport := api.GlobalTransport
	previousConfig := api.GlobalMinIOConfig
	previousPort := api.Port
	previousHostname := api.Hostname
	previousLogInfo := api.LogInfo
	previousLogError := api.LogError

	transport := previousTransport.Clone()
	dialer := &net.Dialer{Timeout: 10 * time.Second, KeepAlive: 15 * time.Second}
	transport.DialContext = func(ctx context.Context, network, address string) (net.Conn, error) {
		host, port, err := net.SplitHostPort(address)
		if err == nil && host == "dex" {
			address = net.JoinHostPort("127.0.0.1", port)
		}
		return dialer.DialContext(ctx, network, address)
	}
	api.GlobalTransport = transport

	server, err := initialize()
	require.NoError(t, err)
	server.Port = consoleTestPort(t)
	require.NoError(t, server.Listen())
	port := server.Port
	baseURL := "http://" + net.JoinHostPort("127.0.0.1", strconv.Itoa(port))

	require.NotEmpty(t, api.GlobalMinIOConfig.OpenIDProviders)
	for name, provider := range api.GlobalMinIOConfig.OpenIDProviders {
		provider.RedirectCallback = baseURL + "/oauth_callback"
		api.GlobalMinIOConfig.OpenIDProviders[name] = provider
	}
	api.Port = strconv.Itoa(port)
	api.Hostname = "127.0.0.1"

	done := make(chan error, 1)
	go func() {
		done <- server.Serve()
	}()

	require.Eventually(t, func() bool {
		client := &http.Client{Timeout: 250 * time.Millisecond}
		response, err := client.Get(baseURL + "/api/v1/login")
		if err != nil {
			return false
		}
		response.Body.Close()
		return true
	}, 5*time.Second, 50*time.Millisecond)

	t.Cleanup(func() {
		require.NoError(t, server.Shutdown())
		select {
		case err := <-done:
			require.NoError(t, err)
		case <-time.After(5 * time.Second):
			t.Errorf("console test server did not shut down")
		}

		api.GlobalTransport = previousTransport
		transport.CloseIdleConnections()
		api.GlobalMinIOConfig = previousConfig
		api.Port = previousPort
		api.Hostname = previousHostname
		api.LogInfo = previousLogInfo
		api.LogError = previousLogError
	})

	return baseURL
}

func consoleTestPort(t *testing.T) int {
	t.Helper()
	value := os.Getenv("SSO_TEST_CONSOLE_PORT")
	if value == "" {
		return 9090
	}
	port, err := strconv.Atoi(value)
	require.NoError(t, err)
	require.Greater(t, port, 0)
	require.LessOrEqual(t, port, 65535)
	return port
}

func initConsoleServer(consoleIDPURL string) (*api.Server, error) {
	// Configure Console Server with vars to get the idp config from the container
	pcfg := map[string]consoleoauth2.ProviderConfig{
		"_": {
			URL:              consoleIDPURL,
			ClientID:         "minio-client-app",
			ClientSecret:     "minio-client-app-secret",
			RedirectCallback: "http://127.0.0.1/oauth_callback",
		},
	}

	swaggerSpec, err := loads.Embedded(api.SwaggerJSON, api.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	noLog := func(string, ...interface{}) {
		// nothing to log
	}

	// Initialize MinIO loggers
	api.LogInfo = noLog
	api.LogError = noLog

	consoleAPI := operations.NewConsoleAPI(swaggerSpec)
	consoleAPI.Logger = noLog

	api.GlobalMinIOConfig = api.MinIOConfig{
		OpenIDProviders: pcfg,
	}

	server := api.NewServer(consoleAPI)
	// register all APIs
	server.ConfigureAPI()

	server.Host = "127.0.0.1"
	server.Port = 0

	return server, nil
}

func authenticateOIDC(t *testing.T, client *http.Client, baseURL string) string {
	t.Helper()

	request, err := http.NewRequest(http.MethodGet, baseURL+"/api/v1/login", nil)
	require.NoError(t, err)
	request.Header.Set("Content-Type", "application/json")
	response, err := client.Do(request)
	require.NoError(t, err)
	body, err := io.ReadAll(response.Body)
	require.NoError(t, err)
	require.NoError(t, response.Body.Close())
	require.LessOrEqual(t, response.StatusCode, http.StatusMultipleChoices, string(body))

	var loginDetails models.LoginDetails
	require.NoError(t, json.Unmarshal(body, &loginDetails))
	require.NotEmpty(t, loginDetails.RedirectRules)
	redirectURL := fmt.Sprint(loginDetails.RedirectRules[0].Redirect)

	cmd := exec.Command("python3", "dex-requests.py", redirectURL)
	cmd.Env = append(os.Environ(), "DEX_EXTERNAL_URL=http://127.0.0.1:5556")
	cmdOutput, err := cmd.Output()
	require.NoError(t, err)
	loginURL := strings.TrimSpace(string(cmdOutput))
	_, err = url.ParseRequestURI(loginURL)
	require.NoError(t, err)

	request, err = http.NewRequest(
		http.MethodPost,
		loginURL,
		bytes.NewBufferString("login=dillon%40example.io&password=dillon"),
	)
	require.NoError(t, err)
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	response, err = client.Do(request)
	require.NoError(t, err)
	require.NoError(t, response.Body.Close())

	query := response.Request.URL.Query()
	code := query.Get("code")
	state := query.Get("state")
	require.NotEmpty(t, code)
	require.NotEmpty(t, state)

	payload, err := json.Marshal(map[string]string{"code": code, "state": state})
	require.NoError(t, err)
	request, err = http.NewRequest(
		http.MethodPost,
		baseURL+"/api/v1/login/oauth2/auth",
		bytes.NewReader(payload),
	)
	require.NoError(t, err)
	request.Header.Set("Content-Type", "application/json")
	response, err = client.Do(request)
	require.NoError(t, err)
	defer response.Body.Close()

	for _, cookie := range response.Cookies() {
		if cookie.Name == "token" {
			require.NotEmpty(t, cookie.Value)
			return cookie.Value
		}
	}

	t.Fatal("authentication token not found in cookies response")
	return ""
}

func TestMain(t *testing.T) {
	baseURL := startConsoleServer(t, func() (*api.Server, error) {
		return initConsoleServer("http://dex:5556/dex/.well-known/openid-configuration")
	})
	client := &http.Client{Timeout: 10 * time.Second}
	sessionToken := authenticateOIDC(t, client, baseURL)
	testOIDCAccessKeyLifecycle(t, client, baseURL, sessionToken)
}

func doSessionRequest(t *testing.T, client *http.Client, baseURL, sessionToken, method, path string, body any) (*http.Response, []byte) {
	t.Helper()

	var requestBody io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		require.NoError(t, err)
		requestBody = bytes.NewReader(data)
	}

	request, err := http.NewRequest(method, baseURL+"/api/v1"+path, requestBody)
	require.NoError(t, err)
	request.Header.Set("Cookie", "token="+sessionToken)
	if body != nil {
		request.Header.Set("Content-Type", "application/json")
	}

	response, err := client.Do(request)
	require.NoError(t, err)
	responseBody, err := io.ReadAll(response.Body)
	require.NoError(t, err)
	require.NoError(t, response.Body.Close())
	return response, responseBody
}

func testOIDCAccessKeyLifecycle(t *testing.T, client *http.Client, baseURL, sessionToken string) {
	t.Helper()

	accessKey := fmt.Sprintf("oidc%016x", uint64(time.Now().UnixNano()))
	response, body := doSessionRequest(t, client, baseURL, sessionToken, http.MethodPost, "/service-account-credentials", map[string]string{
		"accessKey":   accessKey,
		"secretKey":   "oidc-integration-secret-key",
		"name":        "oidc-integration",
		"description": "OIDC access key regression",
	})
	require.Equal(t, http.StatusCreated, response.StatusCode, string(body))

	var credentials models.ServiceAccountCreds
	require.NoError(t, json.Unmarshal(body, &credentials))
	require.Equal(t, accessKey, credentials.AccessKey)
	require.NotEmpty(t, credentials.SecretKey)

	accessKeyPath := "/service-accounts/" + url.PathEscape(credentials.AccessKey)
	deleted := false
	defer func() {
		if deleted {
			return
		}
		request, err := http.NewRequest(http.MethodDelete, baseURL+"/api/v1"+accessKeyPath, nil)
		if err == nil {
			request.Header.Set("Cookie", "token="+sessionToken)
			if cleanupResponse, cleanupErr := client.Do(request); cleanupErr == nil {
				cleanupResponse.Body.Close()
			}
		}
	}()

	response, body = doSessionRequest(t, client, baseURL, sessionToken, http.MethodGet, "/service-accounts", nil)
	require.Equal(t, http.StatusOK, response.StatusCode, string(body))
	var accounts models.ServiceAccounts
	require.NoError(t, json.Unmarshal(body, &accounts))
	require.Condition(t, func() bool {
		for _, account := range accounts {
			if account != nil && account.AccessKey == credentials.AccessKey {
				return true
			}
		}
		return false
	}, "created OIDC access key was not listed")

	response, body = doSessionRequest(t, client, baseURL, sessionToken, http.MethodGet, accessKeyPath, nil)
	require.Equal(t, http.StatusOK, response.StatusCode, string(body))
	var account models.ServiceAccount
	require.NoError(t, json.Unmarshal(body, &account))
	require.Equal(t, "oidc-integration", account.Name)

	response, body = doSessionRequest(t, client, baseURL, sessionToken, http.MethodPut, accessKeyPath, map[string]string{
		"policy": "",
		"name":   "must-not-update",
	})
	require.Equal(t, http.StatusForbidden, response.StatusCode, string(body))

	response, body = doSessionRequest(t, client, baseURL, sessionToken, http.MethodDelete, accessKeyPath, nil)
	require.Equal(t, http.StatusNoContent, response.StatusCode, string(body))
	deleted = true

	response, body = doSessionRequest(t, client, baseURL, sessionToken, http.MethodGet, "/service-accounts", nil)
	require.Equal(t, http.StatusOK, response.StatusCode, string(body))
	require.NoError(t, json.Unmarshal(body, &accounts))
	for _, listedAccount := range accounts {
		if listedAccount != nil {
			require.NotEqual(t, credentials.AccessKey, listedAccount.AccessKey)
		}
	}
}

func TestBadLogin(t *testing.T) {
	baseURL := startConsoleServer(t, func() (*api.Server, error) {
		return initConsoleServer("http://dex:5556")
	})

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	encodeItem := consoleoauth2.LoginURLParams{
		State:   "invalidState",
		IDPName: "_",
	}

	jsonState, err := json.Marshal(encodeItem)
	require.NoError(t, err)

	// get login credentials
	stateVarIable := base64.StdEncoding.EncodeToString(jsonState)

	codeVarIable := "invalidCode"

	requestData := map[string]string{
		"code":  codeVarIable,
		"state": stateVarIable,
	}
	requestDataJSON, err := json.Marshal(requestData)
	require.NoError(t, err)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, err := http.NewRequest(
		"POST",
		baseURL+"/api/v1/login/oauth2/auth",
		requestDataBody,
	)
	require.NoError(t, err)
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	require.NoError(t, err)
	require.NotNil(t, response)
	defer response.Body.Close()
	require.Equal(t, http.StatusBadRequest, response.StatusCode)
	bodyBytes, err := io.ReadAll(response.Body)
	require.NoError(t, err)
	result2 := models.APIError{}
	err = json.Unmarshal(bodyBytes, &result2)
	require.NoError(t, err)
}

func initConsoleServerEnv(t *testing.T, consoleIDPURL string) (*api.Server, error) {
	t.Helper()
	// Configure Console Server with vars to get the idp config from the container
	t.Setenv("CONSOLE_IDP_URL", consoleIDPURL)
	t.Setenv("CONSOLE_IDP_CLIENT_ID", "minio-client-app")
	t.Setenv("CONSOLE_IDP_SECRET", "minio-client-app-secret")
	t.Setenv("CONSOLE_IDP_CALLBACK", "http://127.0.0.1")

	swaggerSpec, err := loads.Embedded(api.SwaggerJSON, api.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	noLog := func(string, ...interface{}) {
		// nothing to log
	}

	// Initialize MinIO loggers
	api.LogInfo = noLog
	api.LogError = noLog

	consoleAPI := operations.NewConsoleAPI(swaggerSpec)
	consoleAPI.Logger = noLog

	api.GlobalMinIOConfig = api.MinIOConfig{
		OpenIDProviders: api.BuildOpenIDConsoleConfig(),
	}

	server := api.NewServer(consoleAPI)
	// register all APIs
	server.ConfigureAPI()

	server.Host = "127.0.0.1"
	server.Port = 0

	return server, nil
}

func TestEnv(t *testing.T) {
	baseURL := startConsoleServer(t, func() (*api.Server, error) {
		return initConsoleServerEnv(t, "http://dex:5556/dex/.well-known/openid-configuration")
	})
	client := &http.Client{Timeout: 10 * time.Second}
	require.NotEmpty(t, authenticateOIDC(t, client, baseURL))
}
