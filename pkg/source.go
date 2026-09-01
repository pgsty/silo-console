// This file is part of MinIO Console Server
// Copyright (c) 2026 MinIO, Inc.
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

package pkg

import (
	"errors"
	"net/url"
	"os"
	"regexp"
	"runtime/debug"
	"strings"
	"sync/atomic"
)

const (
	// RepositoryURL is the public home of this fork's source.
	RepositoryURL = "https://github.com/pgsty/silo-console"
	// ModulePath is the retained compatibility module path.
	ModulePath = "github.com/minio/console"
	// ForkModulePath is the module path a SILO server replaces ModulePath with.
	ForkModulePath = "github.com/pgsty/silo-console"
	// EnvCorrespondingSourceURL lets an operator who ships a modified or custom
	// build point remote users at the exact corresponding source. It is read
	// once at process start (before an embedding server clears CONSOLE_*
	// variables) and can also be set through SetCorrespondingSourceURL.
	EnvCorrespondingSourceURL = "CONSOLE_CORRESPONDING_SOURCE_URL"
)

// Source kinds, from strongest to weakest evidence.
const (
	SourceOverride   = "override"   // operator-provided URL
	SourceRelease    = "release"    // verified release tag baked in by the release build
	SourceVCS        = "vcs"        // clean standalone build with VCS information
	SourceDependency = "dependency" // embedded as an immutable module version
	SourceNone       = "none"       // no exact source can be claimed
)

// SourceReference is the exact corresponding source of the running binary, or
// the reason none can be claimed. A claim is made only from verified evidence:
// a release tuple, clean VCS information of a standalone build, or the
// immutable module version an embedding server compiled in. Anything weaker
// yields no claim rather than a guess.
type SourceReference struct {
	URL    string
	Kind   string
	Reason string
}

// Claimed reports whether an exact source URL is known.
func (s SourceReference) Claimed() bool { return s.URL != "" }

// String renders the reference for logs and the CLI.
func (s SourceReference) String() string {
	if s.Claimed() {
		return s.URL + " (" + s.Kind + ")"
	}
	return "not available for this build (" + s.Reason + ")"
}

var (
	errInvalidSourceURL = errors.New("corresponding source URL must be an absolute https URL with a host name and without credentials, query or fragment")

	overrideSourceURL atomic.Pointer[string]
	// overrideRejected records, without the value, that the environment
	// override was rejected at start-up so the reason can be reported.
	overrideRejected atomic.Bool

	// readBuildInfo is swapped by tests.
	readBuildInfo = debug.ReadBuildInfo

	releaseTagPattern = regexp.MustCompile(`^v\d+\.\d+\.\d+$`)
	pseudoVersion     = regexp.MustCompile(`-\d{14}-([0-9a-f]{12})$`)
	semanticVersion   = regexp.MustCompile(`^v\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$`)
)

func init() {
	if value, ok := os.LookupEnv(EnvCorrespondingSourceURL); ok && strings.TrimSpace(value) != "" {
		if err := SetCorrespondingSourceURL(value); err != nil {
			overrideRejected.Store(true)
		}
	}
}

// SetCorrespondingSourceURL installs an operator-provided corresponding source
// URL. It validates first and leaves the previous value untouched on error;
// the rejected value is never part of the error. Safe to call at any time.
func SetCorrespondingSourceURL(raw string) error {
	u, err := url.Parse(strings.TrimSpace(raw))
	if err != nil || u.Scheme != "https" || u.Hostname() == "" || u.User != nil || u.RawQuery != "" || u.ForceQuery || u.Fragment != "" || u.Opaque != "" {
		return errInvalidSourceURL
	}
	normalized := u.String()
	overrideSourceURL.Store(&normalized)
	overrideRejected.Store(false)
	return nil
}

// OverrideRejected reports whether the start-up environment override was
// present but invalid, so callers can log a sanitized warning.
func OverrideRejected() bool { return overrideRejected.Load() }

// GetSourceReference resolves the corresponding source of this process with a
// fixed precedence: operator override, verified release tag, clean standalone
// VCS revision, immutable embedded dependency version, otherwise no claim. An
// invalid override never suppresses verified built-in evidence.
func GetSourceReference() SourceReference {
	if override := overrideSourceURL.Load(); override != nil {
		return SourceReference{URL: *override, Kind: SourceOverride}
	}
	if isReleaseBuild() {
		return SourceReference{URL: RepositoryURL + "/tree/" + ReleaseTag, Kind: SourceRelease}
	}
	info, ok := readBuildInfo()
	if !ok || info == nil {
		return noSource("no build information is compiled into this binary")
	}
	if info.Main.Path == ModulePath {
		return standaloneSource(info)
	}
	return embeddedSource(info)
}

func isReleaseBuild() bool {
	return releaseTagPattern.MatchString(ReleaseTag) && Version == strings.TrimPrefix(ReleaseTag, "v")
}

func standaloneSource(info *debug.BuildInfo) SourceReference {
	var revision, modified string
	for _, setting := range info.Settings {
		switch setting.Key {
		case "vcs.revision":
			revision = setting.Value
		case "vcs.modified":
			modified = setting.Value
		}
	}
	switch {
	case revision == "":
		return noSource("the build carries no version control information")
	case modified != "false":
		return noSource("the working tree was modified when this binary was built")
	}
	return SourceReference{URL: RepositoryURL + "/commit/" + revision, Kind: SourceVCS}
}

// embeddedSource derives the reference from the Console module an embedding
// server compiled in. Only the fork module path identifies this repository;
// the embedding server's own revision is never used.
func embeddedSource(info *debug.BuildInfo) SourceReference {
	for _, dep := range info.Deps {
		if dep.Path != ModulePath {
			continue
		}
		module := dep
		if dep.Replace != nil {
			module = dep.Replace
		}
		if module.Path != ForkModulePath {
			return noSource("the embedded Console module path does not identify this repository")
		}
		if module.Version == "" || module.Version == "(devel)" {
			return noSource("the embedded Console module is a local replacement without an immutable version")
		}
		if match := pseudoVersion.FindStringSubmatch(module.Version); match != nil {
			return SourceReference{URL: RepositoryURL + "/commit/" + match[1], Kind: SourceDependency}
		}
		if semanticVersion.MatchString(module.Version) {
			return SourceReference{URL: RepositoryURL + "/tree/" + module.Version, Kind: SourceDependency}
		}
		return noSource("the embedded Console module version is not an immutable tag or commit")
	}
	return noSource("the Console module is not present in the build information")
}

func noSource(reason string) SourceReference {
	return SourceReference{Kind: SourceNone, Reason: reason}
}
