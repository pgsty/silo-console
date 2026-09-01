#!/usr/bin/env bash
# Model an embedder that inherits no SILO replacement: drop all three, require
# the advertised upstream minio/pkg floor, and prove the resulting upstream
# graph still vets, tests and builds. Run in a scratch checkout: it edits
# go.mod and go.sum in place.
#
# Replacements are not inherited, so an embedder that adds none of them
# resolves every dependency upstream; that is the graph this script describes.
# Dropping only the shared package would leave pgsty/mc, which compiles against
# silo-pkg's strict policy API, and would test a partial override Console does
# not support instead of the floor.
set -euo pipefail

floor="${UPSTREAM_PKG_FLOOR:-v3.6.1}"

go mod edit -dropreplace=github.com/minio/pkg/v3
go mod edit -dropreplace=github.com/minio/mc
go mod edit -dropreplace=github.com/minio/minio-go/v7
go mod edit -require="github.com/minio/pkg/v3@${floor}"
go mod tidy
test "$(go list -m -f '{{.Version}}' github.com/minio/pkg/v3)" = "${floor}"
for module in github.com/minio/pkg/v3 github.com/minio/mc github.com/minio/minio-go/v7; do
  test -z "$(go list -m -f '{{if .Replace}}{{.Replace.Path}}{{end}}' "$module")"
done
go vet ./...
go vet -tags=testrunmain ./...
go test ./...
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build ./...
CGO_ENABLED=0 GOOS=netbsd GOARCH=amd64 go build ./...
echo "upstream floor ${floor}: vet, test and cross-builds pass without any SILO replacement"
