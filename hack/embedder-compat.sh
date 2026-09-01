#!/usr/bin/env bash
# Build a minimal downstream embedder from the README replacement block.
#
# A SILO server embedding Console must copy the three SILO replacements from
# the README; replacements are not inherited. This feeds exactly the published
# README text into a scratch module that replaces github.com/minio/console with
# this checkout, and proves the graph resolves, compiles, and selects the three
# forks at the documented versions.
set -euo pipefail

console_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$console_root"

embedder="$(mktemp -d)"
go run ./hack/replacements readme-block > "$embedder/readme-block.txt"

cat > "$embedder/main.go" <<'EOF'
package main

import (
	"fmt"

	consoleapi "github.com/minio/console/api"
	consoleoauth2 "github.com/minio/console/pkg/auth/idp/oauth2"
)

func main() {
	consoleapi.GlobalMinIOConfig = consoleapi.MinIOConfig{OpenIDProviders: consoleoauth2.OpenIDPCfg{}}
	fmt.Println(consoleapi.Port)
}
EOF

cd "$embedder"
go mod init example.com/embedder >/dev/null
go mod edit -replace "github.com/minio/console=$console_root"

# Turn the fenced block into "old new version" tuples; exactly three are expected.
awk -F' => ' '/^\t/ { split($2, target, " "); print $1 " " target[1] " " target[2] }' readme-block.txt | sed 's/^\t//' > tuples.txt
test "$(wc -l < tuples.txt | tr -d ' ')" -eq 3 || { echo "README block must contain exactly three replacements" >&2; cat readme-block.txt >&2; exit 1; }
while read -r old new version; do
  go mod edit -replace "$old=$new@$version"
done < tuples.txt

go mod tidy
go build ./...
go vet ./...
while read -r old new version; do
  got="$(go list -m -f '{{if .Replace}}{{.Replace.Path}} {{.Replace.Version}}{{end}}' "$old")"
  test "$got" = "$new $version" || { echo "$old resolved to '$got', README says '$new $version'" >&2; exit 1; }
done < tuples.txt
echo "embedder graph matches the README block"
