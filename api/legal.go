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

package api

import (
	"bytes"
	"fmt"
	"html"
	"net/http"
	"path"
	"strings"
	"sync"

	console "github.com/minio/console"
	"github.com/minio/console/pkg"
)

// buildMetaSentinel marks where handleSPA injects the build and source
// metadata into index.html. The UI reads the resulting <meta> tags so the
// License, Login and anonymous pages can offer the exact corresponding source
// of the running binary without an authenticated API call.
const buildMetaSentinel = "<!-- silo-console-build-meta -->"

var buildMetaSentinelMissing sync.Once

// injectBuildMeta replaces the sentinel with HTML-escaped metadata. It reports
// false, and leaves the page unchanged, when the sentinel is absent; the UI
// then reports the source as unavailable rather than guessing.
func injectBuildMeta(indexPage []byte) ([]byte, bool) {
	if !bytes.Contains(indexPage, []byte(buildMetaSentinel)) {
		return indexPage, false
	}
	source := pkg.GetSourceReference()
	status := "available"
	if !source.Claimed() {
		status = "unavailable"
	}
	tags := fmt.Sprintf(
		`<meta name="silo-console-source" content="%s" />`+"\n    "+
			`<meta name="silo-console-source-status" content="%s" />`+"\n    "+
			`<meta name="silo-console-source-reason" content="%s" />`+"\n    "+
			`<meta name="silo-console-build" content="%s" />`,
		html.EscapeString(source.URL), status, html.EscapeString(source.Reason),
		html.EscapeString(strings.TrimSpace(pkg.Version+" "+pkg.CommitID)))
	return bytes.Replace(indexPage, []byte(buildMetaSentinel), []byte(tags), 1), true
}

// noteBuildMetaSentinelMissing logs once when the embedded index.html has no
// sentinel, which means the payload predates the injection or was built from
// a modified index.html.
func noteBuildMetaSentinelMissing() {
	buildMetaSentinelMissing.Do(func() {
		LogError("embedded index.html has no %s sentinel; the UI cannot report the corresponding source of this build", buildMetaSentinel)
	})
}

// isLegalDocumentPath matches /legal/LICENSE, /legal/NOTICE and /legal/CREDITS
// at any depth, so the documents are reachable under a subpath deployment too.
func isLegalDocumentPath(requestPath string) bool {
	dir, name := path.Split(path.Clean("/" + requestPath))
	if !strings.HasSuffix(dir, "/legal/") {
		return false
	}
	_, known := console.LegalDocument(name)
	return known
}

// serveLegalDocument writes the embedded legal document as plain text. The
// documents are public: AGPL section 13 offers the corresponding source and
// license to every remote user, authenticated or not.
func serveLegalDocument(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		w.Header().Set("Allow", "GET, HEAD")
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}
	_, name := path.Split(path.Clean("/" + r.URL.Path))
	document, ok := console.LegalDocument(name)
	if !ok {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Cache-Control", "public, max-age=3600")
	if r.Method == http.MethodHead {
		w.Header().Set("Content-Length", fmt.Sprint(len(document)))
		w.WriteHeader(http.StatusOK)
		return
	}
	_, _ = w.Write([]byte(document))
}
