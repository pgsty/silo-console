# Embedding Console in a SILO server

The current development tree requires Go 1.27.4. Release version metadata and
the published component pins below remain unchanged until the next release
candidate is finalized.

Console 2.7.0 source uses silo-pkg v3.16.0 and the published
mcli 20261109 source, recorded in `hack/deps-release.json`, with Go 1.27.3 and upstream
minio-go `v7.4.2-0.20261025165926-320af050c445`. This SDK revision includes
post-v7.4.1 fixes; it is not a tagged v7.4.2 release.
It retains the fixed `golang.org/x/net v0.62.0` and
`golang.org/x/crypto v0.58.1-0.20261009181718-2f1f834330b2` revisions already used
by Console v2.6.0. Use the README replacement block from the Console revision
being embedded in a SILO server.

MC resolves to `v0.0.0-20261109021353-e1d4cc5abfe0`, the source commit
`e1d4cc5abfe00b674eb36347399e7398990be467` tagged
`RELEASE.2026-11-09T00-00-00Z`. The calendar tag is not Go SemVer.
silo-pkg v3.16.0 resolves to `b7aeea85e84e8888d6ab424c7123a1297711bc3f`.
These are released dependencies; see GitHub Releases for Console's own
publication status.
Published Console v2.6.0 used silo-pkg v3.15.2 and mcli 20261026; its
[dependency record](https://github.com/pgsty/silo-console/blob/v2.6.0/hack/deps-release.json)
remains attached to that release.

The generator is go-swagger v0.36.7; its linked runtime and
server-middleware are v0.33.4. Generated array context validators now continue
past zero elements. The current schema has no `readOnly` constraints, so this
does not introduce new contextual request restrictions. The default generated
API documentation at `/api/v1/docs` loads Redoc 3 as an ES module from
`cdn.jsdelivr.net`; its specification is served at `/swagger.json`.
This concerns the API documentation middleware, not the bundled Console UI.
Embedders with a custom documentation template or a Redoc 2 asset override
should review the runtime's `RedocV2` / `WithRedocV2` option.

SILO embeds this module (`github.com/minio/console`) as a Go dependency.
Console directly requires `github.com/pgsty/silo-pkg/v3`; that requirement is
inherited normally and needs no downstream replacement. Console has one
maintained replacement for the exact `pgsty/mc` source commit. Go ignores
replacements declared by dependency modules, so an embedding server must copy
that one directive from the authoritative README block between the
`silo-replacements` markers.

## Supported module graphs

| Module graph | Status |
| :-- | :-- |
| The single `pgsty/mc` replacement from the README | Supported. `downstream-embedder-compat` builds a minimal embedder from the published block and checks both the replacement and the inherited `pgsty/silo-pkg` v3.16.0 requirement |
| No mc replacement | Best-effort compatibility probe, tested by the non-blocking `upstream-pkg-compat` job; this is not the released SILO graph and does not constrain maintained dependency versions |
| The retired `minio/pkg => silo-pkg` or `minio-go => silo-go` replacements | Unsupported. silo-pkg v3.13.0 and later own `github.com/pgsty/silo-pkg/v3`, and minio-go now resolves upstream |

SILO keeps inexpensive source and wire compatibility where practical, but the
supported release graph is the coordinated PGSTY stack. A failure found only in
an unmodified upstream MinIO or mc graph is advisory: investigate and document
it, but do not downgrade `silo-pkg` or duplicate its APIs to make that graph
compile. `minio-go` is the explicit exception and resolves upstream by policy.

## Keeping the block in sync

- `go run ./hack/replacements check` (part of `make verifiers`) fails when the
  README block, the one `go.mod` directive, or the contract comment disagree.
- `go run ./hack/replacements update` regenerates the README block after a
  dependency bump.
- `go run ./hack/replacements readme-block` prints the published block; the CI
  embedder job feeds exactly that text into a scratch module.

## Own-module-path migration

This Console line has completed the migration described by silo-pkg v3.13.0:
its source imports `github.com/pgsty/silo-pkg/v3`, and `go.mod` requires the
current v3.16.0 release directly. A SILO server adopting this Console revision must make the same source
import migration. Keeping old `github.com/minio/pkg/v3`
imports while replacing that path with silo-pkg v3.13.0 or later produces
`used for two different module paths`. Update the embedding server's imports
and module graph when it adopts this Console revision.

The indirect `github.com/minio/pkg/v3` remains only because
`github.com/minio/colorjson` imports it. It is separate from the maintained
shared implementation; do not add a `minio/pkg => silo-pkg` replacement.

The single maintained-component replacement is separate from compatibility
pins: go-systemd remains v22.6.0 for NetBSD, Console retains tablewriter
v0.0.5 for the MC API it imports, and go-runewidth remains v0.0.29 to preserve
the terminal widths of existing Latin and Indic text. Inspect the root module's
full effective graph; Go does not inherit these other replacements either.
