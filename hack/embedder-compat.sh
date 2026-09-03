#!/usr/bin/env bash
# Build a minimal downstream embedder from the README replacement block.
#
# A SILO server embedding Console must copy the pgsty/mc replacement from the
# README; replacements are not inherited. The shared silo-pkg module is a direct
# Console requirement. This feeds exactly the published README text into a
# scratch module and proves both selections.
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

# Turn the fenced block into an "old new version" tuple; exactly one is expected.
awk -F' => ' '/^\t/ { split($2, target, " "); print $1 " " target[1] " " target[2] }' readme-block.txt | sed 's/^\t//' > tuples.txt
test "$(wc -l < tuples.txt | tr -d ' ')" -eq 1 || { echo "README block must contain exactly one replacement" >&2; cat readme-block.txt >&2; exit 1; }
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
test "$(go list -m -f '{{.Version}}' github.com/pgsty/silo-pkg/v3)" = "v3.13.2" || { echo "embedder did not inherit silo-pkg v3.13.2" >&2; exit 1; }
echo "embedder graph matches the README block"
