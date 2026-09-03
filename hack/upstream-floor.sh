#!/usr/bin/env bash
# Best-effort compatibility probe: model an embedder that inherits no
# replacement, drop the maintained pgsty/mc selection, and report whether the
# resulting upstream-mc graph still vets, tests and builds. This probe is not a
# supported SILO dependency floor and must not constrain maintained packages.
# Run in a scratch checkout: it edits go.mod and go.sum in place.
#
# Console requires pgsty/silo-pkg directly and uses upstream minio-go, so mc is
# now the only replacement an embedder has to copy.
set -euo pipefail

go mod edit -dropreplace=github.com/minio/mc
go mod tidy
test -z "$(go list -m -f '{{if .Replace}}{{.Replace.Path}}{{end}}' github.com/minio/mc)"
test "$(go list -m -f '{{.Version}}' github.com/pgsty/silo-pkg/v3)" = "v3.13.2"
test -z "$(go list -m -f '{{if .Replace}}{{.Replace.Path}}{{end}}' github.com/minio/minio-go/v7)"
go vet ./...
go vet -tags=testrunmain ./...
go test ./...
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build ./...
CGO_ENABLED=0 GOOS=netbsd GOARCH=amd64 go build ./...
echo "best-effort upstream mc graph: vet, test and cross-builds pass without the maintained mc replacement"
