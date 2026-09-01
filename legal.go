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

// Package console carries the legal material that must travel with every
// artifact built from this module: the AGPL license text, the notice with the
// copyright and fork attribution chain, and the dependency credits. The files
// at the repository root are the single source of truth; they are embedded
// here so a bare binary can print them (`console license|notice|credits`) and
// the HTTP server can serve them (/legal/LICENSE, /legal/NOTICE,
// /legal/CREDITS) without any external file.
package console

import (
	_ "embed"
)

//go:embed LICENSE
var licenseText string

//go:embed NOTICE
var noticeText string

//go:embed CREDITS
var creditsText string

// License returns the full text of the GNU Affero General Public License v3.
func License() string { return licenseText }

// Notice returns the copyright, provenance and attribution notice.
func Notice() string { return noticeText }

// Credits returns the third-party license inventory of the shipped binary.
func Credits() string { return creditsText }

// LegalDocument returns the embedded document with the given file name
// (LICENSE, NOTICE or CREDITS) and reports whether the name is known.
func LegalDocument(name string) (string, bool) {
	switch name {
	case "LICENSE":
		return licenseText, true
	case "NOTICE":
		return noticeText, true
	case "CREDITS":
		return creditsText, true
	}
	return "", false
}
