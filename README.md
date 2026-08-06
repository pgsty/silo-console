<p align="center">
  <img src="web-app/public/silo-word.svg" alt="SILO" height="88">
</p>

<h1 align="center">SILO Console</h1>

<p align="center">
  <strong>Web administration console for SILO object storage</strong><br>
  Keep the interface. Own the objects.
</p>
<p align="center">
  <a href="https://silo.pgsty.com/">Website</a> ·
  <a href="https://silo.pgsty.com/docs/">Documentation</a> ·
  <a href="https://github.com/pgsty/silo-console">Source</a> ·
  <a href="https://github.com/pgsty/silo-console/issues">Issues</a> ·
  <a href="SECURITY.md">Security</a>
</p>

<p align="center">
  <a href="https://github.com/pgsty/silo-console/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/pgsty/silo-console?logo=github&label=release&color=007FA8"></a>
  <a href="https://github.com/pgsty/silo-console/actions/workflows/jobs.yaml"><img alt="Build status" src="https://github.com/pgsty/silo-console/actions/workflows/jobs.yaml/badge.svg"></a>
  <a href="go.mod"><img alt="Go version" src="https://img.shields.io/github/go-mod/go-version/pgsty/silo-console?logo=go"></a>
  <a href="https://github.com/pgsty/silo-console/pkgs/container/silo-console"><img alt="Container image" src="https://img.shields.io/badge/ghcr.io-pgsty%2Fsilo--console-2496ED?logo=docker&logoColor=white"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-AGPLv3-blue"></a>
  <a href="#a-bilingual-console"><img alt="Languages" src="https://img.shields.io/badge/i18n-English%20%7C%20%E4%B8%AD%E6%96%87-007FA8"></a>
</p>

> [!IMPORTANT]
> SILO Console is an independent, community-maintained continuation of the
> former MinIO Console codebase, published by [Pigsty](https://pigsty.io/) for
> [SILO](https://silo.pgsty.com/). It is not affiliated with, endorsed by, or
> sponsored by MinIO, Inc. The MinIO name is used only to identify the upstream
> project and compatibility lineage.

## Overview

SILO Console is the browser-based administration interface for
[SILO](https://github.com/pgsty/minio). It combines a React and TypeScript web
application with a Go backend that connects to a SILO or compatible object
storage server.

The Console provides:

- dashboards, health information, logs, diagnostics, and speed tests;
- bucket, object, lifecycle, replication, notification, and tier management;
- users, groups, service accounts, policies, identity providers, and KMS setup;
- server configuration and day-to-day administrative workflows.

![SILO Console sign-in page](images/silo-console-home.webp)

> [!NOTE]
> SILO Console is not a generic S3 browser. Its administrative features require
> the MinIO-compatible administration APIs implemented by SILO in addition to
> the S3 API.

## Highlights

What this console adds on top of the inherited codebase.

### A bilingual console

The entire interface — every screen, help topic, confirmation dialog, and
documentation link — renders in **English or Chinese**, behind a 文/A toggle
present on every page including sign-in.

The implementation is hand-rolled and carries **zero new runtime dependencies**,
because everything here ships inside a Go binary. English source strings are the
dictionary keys, so an untranslated string falls back to English instead of
leaking a raw identifier, and coverage can grow incrementally. Documentation
links localize alongside the text, and the command palette matches in both
languages — searching either `桶` or `buckets` finds the same entry. The whole
feature costs about 61 KB of the embedded payload; with the default language,
rendering is byte-identical to before.

### A dashboard on Metrics V3

The dashboard queries the **MinIO Metrics V3** endpoint that modern deployments
actually scrape, with no V2 fallback. That migration is more than renaming
series: V3 skips zero-valued metrics entirely and exports cluster gauges
identically from every node, so a naive port silently shows blank panels and
multiplies cluster totals by the node count.

Every query therefore carries an explicit guard, and the panels distinguish
*zero* from *no data* from *not yet scanned* — a full cluster reads `0 free`
rather than vanishing, and a cluster that has not finished its first scan reads
no-data rather than a fabricated `0`. Two cards with defensible semantics,
**Erasure Health** and **Usage Data Age**, replace the old in-memory heal/scan
counters that reset on restart. The mapping is documented in
[`docs/metrics-v3.md`](docs/metrics-v3.md); point your scrape at
`/minio/metrics/v3`, since the V2 names are no longer queried.

![SILO Console metrics dashboard](images/silo-console-metrics.webp)

### A redesigned interface

The sign-in page, theme system, and console chrome were rebuilt under one design
language, in matched light and dark themes, down to the details: consistent
radii and transitions, keyboard focus rings, centered empty states, tabular
numerals in stat cards, and timestamps that carry their timezone instead of
using a 12-hour clock without AM/PM. Tables get a select-all that operates on
visible rows while preserving filter-hidden selections, so the header checkbox
can never imply a different set than a bulk action would touch.

![SILO Console object browser](images/silo-console-objects.webp)

### Lean, embedded, and quiet

The frontend ships inside the binary via `go:embed`, precompressed at build time
with a deterministic gzip pass — about **2.9 MB** embedded, reproducible byte
for byte, and enforced by a release gate. There is **no telemetry**: no
analytics, no beacons, no external scripts or fonts, and no call-home. Automatic
self-update is disabled, and the release catalog is contacted only when a host
is explicitly configured.

## Status and Compatibility

The public project and release name is `silo-console`. Compatibility-sensitive
names are retained where changing them would break existing integrations:

| Surface | Current contract |
| :-- | :-- |
| Repository | [`pgsty/silo-console`](https://github.com/pgsty/silo-console) |
| Release binary | `silo-console` |
| Development build | `./console` |
| Go module | `github.com/minio/console` |
| Server endpoint | `CONSOLE_MINIO_SERVER` |
| Server region | `CONSOLE_MINIO_REGION` |
| Container image | `ghcr.io/pgsty/silo-console` |

The retained Go module, import paths, environment variables, API fields, and
protocol identifiers are compatibility interfaces, not product branding. Any
future rename of those interfaces will require aliases and a migration period.

Release binaries and packages are published on the
[release page](https://github.com/pgsty/silo-console/releases). Official
multi-architecture container images are published as
`ghcr.io/pgsty/silo-console`. Automatic updates remain disabled until signed
release artifacts and a tested rollback path are available; upgrade explicitly
through a pinned binary, package, or container version.

## Quick Start

Install the Go version declared in [`go.mod`](go.mod), then build the standalone
Console server:

```bash
git clone https://github.com/pgsty/silo-console.git
cd silo-console
make console
```

Point it at a running SILO server and start the Console:

```bash
export CONSOLE_MINIO_SERVER=http://127.0.0.1:9000
./console server
```

Open <http://127.0.0.1:9090> and sign in with a user from the configured server.
For production, use TLS, configure stable random values for
`CONSOLE_PBKDF_PASSPHRASE` and `CONSOLE_PBKDF_SALT`, and grant users only the
permissions they need. Do not reuse the server root credentials for routine
administration.

If the server uses a region other than `us-east-1`, set the compatibility
variable as well:

```bash
export CONSOLE_MINIO_REGION=your-region
```

See the [environment variable reference](docs/Environment.md),
[systemd setup](systemd/README.md), and [FAQ](docs/README.md#faq) for additional
configuration.

### Frontend Development

The repository includes the generated frontend bundle used by the Go server.
When changing the web application, rebuild it with:

```bash
make assets
```

The required Node.js version is recorded in [`.nvmrc`](.nvmrc). See
[`DEVELOPMENT.md`](DEVELOPMENT.md) for the frontend development server and
embedded-server compatibility workflow.

## Maintenance Scope

SILO Console follows the conservative maintenance model of the SILO server. The
active line focuses on:

- compatibility with the maintained SILO server;
- applicable security and dependency updates;
- focused fixes for reproducible defects;
- release engineering, tests, documentation, and operational continuity.

Maintenance is best effort. No response time, remediation schedule, support
window, commercial support, or SLA is guaranteed. Pin versions, review changes,
keep a rollback path, and test upgrades before production use.

## Security and Contributing

Report security issues privately as described in [`SECURITY.md`](SECURITY.md).
For ordinary defects and feature work, open an
[issue](https://github.com/pgsty/silo-console/issues) or follow
[`CONTRIBUTING.md`](CONTRIBUTING.md). Useful contributions include security and
dependency updates, compatibility fixes, tests, release automation,
documentation, and accessibility improvements.

## License, Attribution, and Trademarks

SILO Console is free software distributed under the
[GNU Affero General Public License v3.0 or later](LICENSE). See [`NOTICE`](NOTICE)
and [`CREDITS`](CREDITS) for notices and third-party license information.

This repository contains code derived from the former MinIO Console and carried
forward through the [`Alevsk/console`](https://github.com/Alevsk/console) and
[`georgmangold/console`](https://github.com/georgmangold/console) community
maintenance lines. Copyright in inherited code remains with MinIO, Inc. and the
respective contributors; SILO-specific modifications remain copyright their
respective authors. Existing copyright, license, and attribution notices must
be kept intact.

MinIO® is a registered trademark of MinIO, Inc. SILO and SILO Console are
independent community projects and are not affiliated with, endorsed by, or
sponsored by MinIO, Inc. Amazon S3 is a trademark of Amazon.com, Inc. or its
affiliates; references to S3 describe protocol compatibility only. All other
trademarks are the property of their respective owners.
