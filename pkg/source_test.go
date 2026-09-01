// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

package pkg

import (
	"runtime/debug"
	"strings"
	"testing"
)

func withBuildInfo(t *testing.T, info *debug.BuildInfo) {
	t.Helper()
	previous := readBuildInfo
	readBuildInfo = func() (*debug.BuildInfo, bool) { return info, info != nil }
	t.Cleanup(func() { readBuildInfo = previous })
}

func withRelease(t *testing.T, version, tag string) {
	t.Helper()
	previousVersion, previousTag := Version, ReleaseTag
	Version, ReleaseTag = version, tag
	t.Cleanup(func() { Version, ReleaseTag = previousVersion, previousTag })
}

func withoutOverride(t *testing.T) {
	t.Helper()
	previous := overrideSourceURL.Load()
	previousRejected := overrideRejected.Load()
	overrideSourceURL.Store(nil)
	overrideRejected.Store(false)
	t.Cleanup(func() {
		overrideSourceURL.Store(previous)
		overrideRejected.Store(previousRejected)
	})
}

func standaloneInfo(revision, modified string) *debug.BuildInfo {
	info := &debug.BuildInfo{Main: debug.Module{Path: ModulePath}}
	if revision != "" {
		info.Settings = append(info.Settings, debug.BuildSetting{Key: "vcs.revision", Value: revision})
	}
	if modified != "" {
		info.Settings = append(info.Settings, debug.BuildSetting{Key: "vcs.modified", Value: modified})
	}
	return info
}

func embeddedInfo(replace *debug.Module) *debug.BuildInfo {
	dep := &debug.Module{Path: ModulePath, Version: "v1.7.6", Replace: replace}
	return &debug.BuildInfo{
		Main:     debug.Module{Path: "github.com/minio/minio"},
		Settings: []debug.BuildSetting{{Key: "vcs.revision", Value: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeef"}, {Key: "vcs.modified", Value: "false"}},
		Deps:     []*debug.Module{dep},
	}
}

func TestGetSourceReferencePrecedence(t *testing.T) {
	withoutOverride(t)
	withRelease(t, "(dev)", "(no tag)")

	tests := []struct {
		name     string
		info     *debug.BuildInfo
		version  string
		tag      string
		override string
		wantURL  string
		wantKind string
	}{
		{name: "verified release tag", info: standaloneInfo("", ""), version: "2.3.0", tag: "v2.3.0", wantURL: RepositoryURL + "/tree/v2.3.0", wantKind: SourceRelease},
		{name: "snapshot never claims the previous tag", info: standaloneInfo("0123456789abcdef0123456789abcdef01234567", "false"), version: "SNAPSHOT@0123456", tag: "v2.2.1", wantURL: RepositoryURL + "/commit/0123456789abcdef0123456789abcdef01234567", wantKind: SourceVCS},
		{name: "clean standalone build", info: standaloneInfo("0123456789abcdef0123456789abcdef01234567", "false"), wantURL: RepositoryURL + "/commit/0123456789abcdef0123456789abcdef01234567", wantKind: SourceVCS},
		{name: "dirty standalone build", info: standaloneInfo("0123456789abcdef0123456789abcdef01234567", "true"), wantKind: SourceNone},
		{name: "standalone without VCS", info: standaloneInfo("", ""), wantKind: SourceNone},
		{name: "no build info", info: nil, wantKind: SourceNone},
		{name: "embedded pseudo-version of the fork", info: embeddedInfo(&debug.Module{Path: ForkModulePath, Version: "v0.0.0-20260829111139-e07ef01ab8bf"}), wantURL: RepositoryURL + "/commit/e07ef01ab8bf", wantKind: SourceDependency},
		{name: "embedded tagged fork", info: embeddedInfo(&debug.Module{Path: ForkModulePath, Version: "v2.3.0"}), wantURL: RepositoryURL + "/tree/v2.3.0", wantKind: SourceDependency},
		{name: "embedded local directory replacement", info: embeddedInfo(&debug.Module{Path: "../console", Version: ""}), wantKind: SourceNone},
		{name: "embedded devel replacement", info: embeddedInfo(&debug.Module{Path: ForkModulePath, Version: "(devel)"}), wantKind: SourceNone},
		{name: "embedded upstream path never identifies this repository", info: embeddedInfo(nil), wantKind: SourceNone},
		{name: "embedded server revision is never used", info: &debug.BuildInfo{Main: debug.Module{Path: "github.com/minio/minio"}, Settings: []debug.BuildSetting{{Key: "vcs.revision", Value: "deadbeef"}, {Key: "vcs.modified", Value: "false"}}}, wantKind: SourceNone},
		{name: "override wins over a release tag", info: standaloneInfo("", ""), version: "2.3.0", tag: "v2.3.0", override: "https://forge.example/console/tree/custom", wantURL: "https://forge.example/console/tree/custom", wantKind: SourceOverride},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			withoutOverride(t)
			withBuildInfo(t, tt.info)
			if tt.version != "" {
				withRelease(t, tt.version, tt.tag)
			}
			if tt.override != "" {
				if err := SetCorrespondingSourceURL(tt.override); err != nil {
					t.Fatal(err)
				}
			}
			ref := GetSourceReference()
			if ref.URL != tt.wantURL || ref.Kind != tt.wantKind {
				t.Fatalf("GetSourceReference() = %+v, want url %q kind %q", ref, tt.wantURL, tt.wantKind)
			}
			if ref.Kind == SourceNone && ref.Reason == "" {
				t.Fatal("a no-claim reference must carry a reason")
			}
			if strings.Contains(ref.Reason, "deadbeef") {
				t.Fatalf("reason leaks the embedding server revision: %q", ref.Reason)
			}
		})
	}
}

func TestSetCorrespondingSourceURL(t *testing.T) {
	withoutOverride(t)
	withBuildInfo(t, standaloneInfo("", ""))
	withRelease(t, "2.3.0", "v2.3.0")

	if err := SetCorrespondingSourceURL("https://forge.example/silo-console/tree/v2.3.0-site"); err != nil {
		t.Fatal(err)
	}
	if got := GetSourceReference().URL; got != "https://forge.example/silo-console/tree/v2.3.0-site" {
		t.Fatalf("valid override not installed: %q", got)
	}

	invalid := []string{
		"http://forge.example/console",             // not https
		"https://token@forge.example/console",      // credentials
		"https://forge.example/console?sig=secret", // query
		"https://forge.example/console#frag",       // fragment
		"https:///console",                         // no host
		"forge.example/console",                    // relative
		"",
		"https://forge.example/console?",
	}
	for _, raw := range invalid {
		err := SetCorrespondingSourceURL(raw)
		if err == nil {
			t.Fatalf("%q was accepted", raw)
		}
		if strings.Contains(err.Error(), "secret") || strings.Contains(err.Error(), "token") || strings.Contains(err.Error(), "forge.example") {
			t.Fatalf("error echoes the rejected value: %v", err)
		}
		if got := GetSourceReference().URL; got != "https://forge.example/silo-console/tree/v2.3.0-site" {
			t.Fatalf("a rejected override changed the state to %q", got)
		}
	}

	// A rejected override never suppresses verified built-in evidence.
	overrideSourceURL.Store(nil)
	if err := SetCorrespondingSourceURL("https://token@forge.example/x"); err == nil {
		t.Fatal("expected rejection")
	}
	if ref := GetSourceReference(); ref.Kind != SourceRelease || ref.URL != RepositoryURL+"/tree/v2.3.0" {
		t.Fatalf("verified release claim was suppressed: %+v", ref)
	}
}
