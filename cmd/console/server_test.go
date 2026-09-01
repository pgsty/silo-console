// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package main

import (
	"strings"
	"testing"

	"github.com/minio/console/api"
)

func TestBuildServerRejectsInvalidTrustedProxyConfiguration(t *testing.T) {
	t.Setenv(api.EnvConsoleTrustedProxies, "not-an-address")
	server, err := buildServer()
	if err == nil {
		t.Fatal("buildServer accepted an invalid trusted proxy configuration")
	}
	if server != nil {
		t.Fatal("buildServer returned a server after trusted proxy validation failed")
	}
	if !strings.Contains(err.Error(), api.EnvConsoleTrustedProxies) {
		t.Fatalf("buildServer error %q does not identify the invalid setting", err)
	}
}
