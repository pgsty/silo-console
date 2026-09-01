# Embedding Console in a SILO server

SILO embeds this module (`github.com/minio/console`) as a Go dependency. Go
ignores `replace` directives declared by dependency modules, so an embedding
server must copy Console's top-level SILO replacements into its own `go.mod`.
The authoritative block lives in the README between the
`silo-replacements` markers and is generated from Console's `go.mod`; copy it
from the Console commit you embed rather than from this page.

## Supported module graphs

| Module graph | Status |
| :-- | :-- |
| All three SILO replacements, adopted as one set | Supported. `downstream-embedder-compat` builds a minimal embedder from the README block on every change and asserts the three effective replacement tuples |
| None of them (upstream `minio/pkg/v3` v3.6.1, upstream `minio/mc`, upstream `minio-go`) | Build-compatible floor, tested by `upstream-pkg-compat`. SILO-specific IAM semantics are absent |
| Any partial set | Unsupported and untested. `pgsty/mc` compiles only against the SILO package's strict policy API, so pairing one project's CLI with the other's shared package fails or misbehaves |

Console's `go.mod` requirements stay on resolvable upstream versions because
they are part of Console's public module graph; the replacements select the
released SILO implementations.

## Keeping the block in sync

- `go run ./hack/replacements check` (part of `make verifiers`) fails when the
  README block, the three `go.mod` directives, or the contract comment in
  `go.mod` disagree.
- `go run ./hack/replacements update` regenerates the README block after a
  dependency bump.
- `go run ./hack/replacements readme-block` prints the published block; the CI
  embedder job feeds exactly that text into a scratch module.

## About silo-pkg v3.13.0 and later

`silo-pkg` v3.13.0 moved to the module path `github.com/pgsty/silo-pkg/v3` and
imports its own packages under that path. Go accepts a replacement whose
declared module path equals the replacement location, but pairing v3.13.0 with
Console's `github.com/minio/pkg/v3` imports fails with
`used for two different module paths`. It is therefore not a compatible drop-in
replacement for this Console line. Embedders stay on the v3.12.x
compatibility-path versions named in the README block until Console and the
SILO server migrate together: drop the replacement, require
`github.com/pgsty/silo-pkg/v3` directly, and rewrite imports in one coordinated
release.
