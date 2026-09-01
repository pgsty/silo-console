# Embedding Console in a SILO server

SILO embeds this module (`github.com/minio/console`) as a Go dependency.
Console directly requires `github.com/pgsty/silo-pkg/v3`; that requirement is
inherited normally and needs no downstream replacement. Console has one
maintained replacement for the calendar-tagged `pgsty/mc` source. Go ignores
replacements declared by dependency modules, so an embedding server must copy
that one directive from the authoritative README block between the
`silo-replacements` markers.

## Supported module graphs

| Module graph | Status |
| :-- | :-- |
| The single `pgsty/mc` replacement from the README | Supported. `downstream-embedder-compat` builds a minimal embedder from the published block and checks both the replacement and the inherited `pgsty/silo-pkg` version |
| No mc replacement | Build-compatible upstream mc floor, tested by `upstream-pkg-compat`; this does not claim released SILO CLI behavior |
| The retired `minio/pkg => silo-pkg` or `minio-go => silo-go` replacements | Unsupported. silo-pkg v3.13.0 and later own `github.com/pgsty/silo-pkg/v3`, and minio-go now resolves upstream |

## Keeping the block in sync

- `go run ./hack/replacements check` (part of `make verifiers`) fails when the
  README block, the one `go.mod` directive, or the contract comment disagree.
- `go run ./hack/replacements update` regenerates the README block after a
  dependency bump.
- `go run ./hack/replacements readme-block` prints the published block; the CI
  embedder job feeds exactly that text into a scratch module.

## Own-module-path migration

This Console line has completed the migration described by silo-pkg v3.13.0:
its source imports `github.com/pgsty/silo-pkg/v3`, and `go.mod` requires v3.13.0
directly. A SILO server adopting this Console release must make the same source
import migration. Keeping old `github.com/minio/pkg/v3`
imports while replacing that path with silo-pkg v3.13.0 produces
`used for two different module paths`. Update the embedding server's imports
and module graph when it adopts this Console release.
