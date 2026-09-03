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

// Command replacements keeps the downstream replacement contract in sync.
//
// go.mod is the single source of truth for the one maintained fork replacement
// a server embedding Console must copy. The README carries a generated copy of
// that block between marker comments, and go.mod carries the supported-graph
// contract as a comment. This command generates the block, verifies README
// and go.mod against it, and rewrites README when asked.
//
// Usage:
//
//	go run ./hack/replacements check         # verify (default; used by make verifiers)
//	go run ./hack/replacements block         # print the canonical block from go.mod
//	go run ./hack/replacements readme-block  # print the block currently in README.md
//	go run ./hack/replacements update        # rewrite the README block from go.mod
package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"sort"
	"strings"
)

// canonicalReplacements is the downstream contract: exactly this import path,
// replaced by exactly this fork. Adding or removing an entry is
// a deliberate contract change that must update this list, the go.mod
// contract comment, README and docs/Embedding.md together.
var canonicalReplacements = []struct{ Old, New string }{
	{Old: "github.com/minio/mc", New: "github.com/pgsty/mc"},
}

const (
	forkPrefix  = "github.com/pgsty/"
	beginMarker = "<!-- silo-replacements:begin -->"
	endMarker   = "<!-- silo-replacements:end -->"
	readmePath  = "README.md"
	goModPath   = "go.mod"
)

// contractLines must appear verbatim in go.mod so the supported-graph
// statement cannot drift from README and CHANGELOG.
var contractLines = []string{
	"// Supported module policy (see README.md and docs/Embedding.md):",
	"//   - the maintained SILO graph directly requires pgsty/silo-pkg and copies the single pgsty/mc replacement into the SILO embedder;",
	"//   - omitting that replacement is tested by upstream-pkg-compat only as a best-effort compatibility signal, never as a release dependency floor;",
	"//   - minio-go resolves upstream by policy; the retired silo-go and minio/pkg replacement graph is unsupported.",
}

// readmeContractPhrases must appear in README.md prose, next to the generated block.
var readmeContractPhrases = []string{
	"single maintained replacement",
	"upstream-pkg-compat",
	"downstream-embedder-compat",
	"directly requires",
}

type modVersion struct {
	Path    string `json:"Path"`
	Version string `json:"Version"`
}

type replacement struct {
	Old modVersion `json:"Old"`
	New modVersion `json:"New"`
}

type goModJSON struct {
	Module  struct{ Path string } `json:"Module"`
	Require []modVersion          `json:"Require"`
	Replace []replacement         `json:"Replace"`
}

var canonicalDirectModules = []string{
	"github.com/minio/minio-go/v7",
	"github.com/pgsty/silo-pkg/v3",
}

var forbiddenModules = []string{
	"github.com/pgsty/silo-go/v7",
}

func main() {
	mode := "check"
	if len(os.Args) > 1 {
		mode = os.Args[1]
	}
	if err := run(mode); err != nil {
		fmt.Fprintf(os.Stderr, "replacements %s: %v\n", mode, err)
		os.Exit(1)
	}
}

func run(mode string) error {
	set, err := loadCanonicalSet()
	if err != nil {
		return err
	}
	block := renderBlock(set)

	switch mode {
	case "block":
		fmt.Print(block)
		return nil
	case "readme-block":
		readme, err := os.ReadFile(readmePath)
		if err != nil {
			return err
		}
		current, _, _, err := extractReadmeBlock(string(readme))
		if err != nil {
			return err
		}
		fmt.Print(current)
		return nil
	case "update":
		readme, err := os.ReadFile(readmePath)
		if err != nil {
			return err
		}
		_, before, after, err := extractReadmeBlock(string(readme))
		if err != nil {
			return err
		}
		return os.WriteFile(readmePath, []byte(before+block+after), 0o644)
	case "check":
		return check(block)
	default:
		return fmt.Errorf("unknown mode %q (want check, block, readme-block or update)", mode)
	}
}

// loadCanonicalSet reads go.mod through the go command and enforces the
// contract invariant: exactly one replacement for each canonical import path,
// targeting the canonical fork, with no Old version and a non-empty New
// version, and no other replacement that points at a github.com/pgsty module.
func loadCanonicalSet() (map[string]replacement, error) {
	out, err := exec.Command("go", "mod", "edit", "-json").Output()
	if err != nil {
		return nil, fmt.Errorf("go mod edit -json: %w", err)
	}
	var mod goModJSON
	if err := json.Unmarshal(out, &mod); err != nil {
		return nil, fmt.Errorf("parse go mod edit -json: %w", err)
	}
	if mod.Module.Path != "github.com/minio/console" {
		return nil, fmt.Errorf("run from the Console repository root (module %q)", mod.Module.Path)
	}

	set := make(map[string]replacement, len(canonicalReplacements))
	var problems []string
	requirements := make(map[string]string, len(mod.Require))
	for _, requirement := range mod.Require {
		requirements[requirement.Path] = requirement.Version
	}
	for _, expected := range canonicalDirectModules {
		if requirements[expected] == "" {
			problems = append(problems, fmt.Sprintf("%s must be required directly", expected))
		}
	}
	for _, forbidden := range forbiddenModules {
		if version := requirements[forbidden]; version != "" {
			problems = append(problems, fmt.Sprintf("%s@%s is forbidden; Console resolves minio-go upstream", forbidden, version))
		}
	}
	for _, rep := range mod.Replace {
		canonicalNew, canonical := canonicalTarget(rep.Old.Path)
		switch {
		case isCanonicalDirectModule(rep.Old.Path):
			problems = append(problems, fmt.Sprintf("%s must resolve directly and cannot be replaced by %s", rep.Old.Path, rep.New.Path))
		case canonical && rep.New.Path == canonicalNew:
			if _, duplicate := set[rep.Old.Path]; duplicate {
				problems = append(problems, fmt.Sprintf("%s is replaced more than once", rep.Old.Path))
			}
			if rep.Old.Version != "" {
				problems = append(problems, fmt.Sprintf("%s replacement is version-specific (%s); the contract replaces every version", rep.Old.Path, rep.Old.Version))
			}
			if rep.New.Version == "" {
				problems = append(problems, fmt.Sprintf("%s is replaced by a directory, not a released module version", rep.Old.Path))
			}
			set[rep.Old.Path] = rep
		case canonical:
			problems = append(problems, fmt.Sprintf("%s is replaced by %s, the contract requires %s", rep.Old.Path, rep.New.Path, canonicalNew))
		case strings.HasPrefix(rep.New.Path, forkPrefix):
			problems = append(problems, fmt.Sprintf("%s => %s is a SILO fork replacement outside the contract; extend hack/replacements deliberately", rep.Old.Path, rep.New.Path))
		}
	}
	for _, canonical := range canonicalReplacements {
		if _, ok := set[canonical.Old]; !ok {
			problems = append(problems, fmt.Sprintf("%s => %s is missing; the contract requires this replacement", canonical.Old, canonical.New))
		}
	}
	if len(problems) > 0 {
		return nil, errors.New("go.mod violates the replacement contract:\n  - " + strings.Join(problems, "\n  - "))
	}
	return set, nil
}

func isCanonicalDirectModule(path string) bool {
	for _, direct := range canonicalDirectModules {
		if direct == path {
			return true
		}
	}
	return false
}

func canonicalTarget(oldPath string) (string, bool) {
	for _, canonical := range canonicalReplacements {
		if canonical.Old == oldPath {
			return canonical.New, true
		}
	}
	return "", false
}

// renderBlock formats the contract exactly as README shows it: a fenced Go
// block with one replace directive per line, sorted by import path.
func renderBlock(set map[string]replacement) string {
	paths := make([]string, 0, len(set))
	for path := range set {
		paths = append(paths, path)
	}
	sort.Strings(paths)
	var sb strings.Builder
	sb.WriteString("```go\nreplace (\n")
	for _, path := range paths {
		rep := set[path]
		fmt.Fprintf(&sb, "\t%s => %s %s\n", rep.Old.Path, rep.New.Path, rep.New.Version)
	}
	sb.WriteString(")\n```\n")
	return sb.String()
}

// extractReadmeBlock returns the fenced block between the markers and the
// text before and after it. It fails closed on missing, duplicate, misordered
// or malformed markers and on a block that is not a single replace directive.
func extractReadmeBlock(readme string) (block, before, after string, err error) {
	if strings.Count(readme, beginMarker) != 1 || strings.Count(readme, endMarker) != 1 {
		return "", "", "", fmt.Errorf("README.md must contain exactly one %s and one %s", beginMarker, endMarker)
	}
	begin := strings.Index(readme, beginMarker)
	end := strings.Index(readme, endMarker)
	if end < begin {
		return "", "", "", errors.New("README.md replacement markers are out of order")
	}
	before = readme[:begin+len(beginMarker)] + "\n"
	after = readme[end:]
	block = readme[begin+len(beginMarker) : end]
	block = strings.TrimLeft(block, "\n")
	lines := strings.Split(strings.TrimRight(block, "\n"), "\n")
	if len(lines) < 4 || lines[0] != "```go" || lines[1] != "replace (" || lines[len(lines)-2] != ")" || lines[len(lines)-1] != "```" {
		return "", "", "", errors.New("README.md replacement block must be one ```go fenced `replace ( ... )` directive")
	}
	for _, line := range lines[2 : len(lines)-2] {
		if !strings.HasPrefix(line, "\t") || !strings.Contains(line, " => ") {
			return "", "", "", fmt.Errorf("README.md replacement block has a malformed line %q", line)
		}
	}
	return strings.Join(lines, "\n") + "\n", before, after, nil
}

func check(block string) error {
	var problems []string

	readme, err := os.ReadFile(readmePath)
	if err != nil {
		return err
	}
	current, _, _, err := extractReadmeBlock(string(readme))
	if err != nil {
		problems = append(problems, err.Error())
	} else if current != block {
		problems = append(problems, "README.md replacement block differs from go.mod; run `go run ./hack/replacements update`:\n--- README.md\n"+current+"+++ go.mod\n"+block)
	}
	lowerReadme := strings.ToLower(string(readme))
	for _, phrase := range readmeContractPhrases {
		if !strings.Contains(lowerReadme, strings.ToLower(phrase)) {
			problems = append(problems, fmt.Sprintf("README.md no longer states the supported-graph contract (missing %q)", phrase))
		}
	}

	goMod, err := os.ReadFile(goModPath)
	if err != nil {
		return err
	}
	for _, line := range contractLines {
		if !bytes.Contains(goMod, []byte(line+"\n")) {
			problems = append(problems, fmt.Sprintf("go.mod is missing the contract line %q", line))
		}
	}

	if len(problems) > 0 {
		return errors.New(strings.Join(problems, "\n"))
	}
	fmt.Println("replacement contract: go.mod, README.md and the contract comment agree")
	return nil
}
