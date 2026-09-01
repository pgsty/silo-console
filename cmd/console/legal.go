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

package main

import (
	"fmt"
	"io"
	"os"

	"github.com/minio/cli"
	console "github.com/minio/console"
	"github.com/minio/console/pkg"
)

// The legal material travels inside the executable so that a bare binary
// downloaded on its own still carries its license, notice and credits.
var (
	licenseCmd = cli.Command{
		Name:   "license",
		Usage:  "print the GNU Affero General Public License v3 text",
		Action: printLegal(console.License),
	}
	noticeCmd = cli.Command{
		Name:   "notice",
		Usage:  "print the copyright, provenance and attribution notice",
		Action: printLegal(console.Notice),
	}
	creditsCmd = cli.Command{
		Name:   "credits",
		Usage:  "print the third-party license inventory of this binary",
		Action: printLegal(console.Credits),
	}
	versionCmd = cli.Command{
		Name:  "version",
		Usage: "print the version, commit and corresponding source of this binary",
		Action: func(*cli.Context) error {
			return printVersion(os.Stdout)
		},
	}
)

func printLegal(text func() string) func(*cli.Context) error {
	return func(*cli.Context) error {
		_, err := io.WriteString(os.Stdout, text())
		return err
	}
}

func printVersion(w io.Writer) error {
	source := pkg.GetSourceReference()
	_, err := fmt.Fprintf(w, "silo-console %s\ntag:     %s\ncommit:  %s\nsource:  %s\n", pkg.Version, pkg.ReleaseTag, pkg.CommitID, source.String())
	if err != nil {
		return err
	}
	if pkg.OverrideRejected() {
		_, err = fmt.Fprintf(w, "warning: %s was set but rejected (it must be an absolute https URL without credentials, query or fragment); built-in provenance is reported instead\n", pkg.EnvCorrespondingSourceURL)
	}
	return err
}
