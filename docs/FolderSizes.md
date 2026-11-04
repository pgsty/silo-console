# Folder and bucket usage scans

The operator guide lives on the SILO documentation site:

- [English: usage scans, permissions, limits and the optional worker](https://silo.pgsty.com/administration/console/managing-objects/#usage-scans)
- [中文：用量扫描、权限、限制与可选后台任务](https://silo.pgsty.com/zh/administration/console/managing-objects/#usage-scans)

This feature is under development and is not included in Console 2.5.1 or
Server 20261026. Merging source does not publish a Console release or update
the Console embedded in SILO Server. The implementation and original guide
were contributed by Urbanize in [PR #70](https://github.com/pgsty/silo-console/pull/70).

## Developer checks

Run `go test ./api -run TestPrefixUsage` for foreground scans. With disposable
PostgreSQL and maintained SILO fixtures configured through
`TEST_USAGE_DATABASE_URL`, `TEST_USAGE_S3_ENDPOINT`, `TEST_USAGE_S3_ACCESS_KEY`
and `TEST_USAGE_S3_SECRET_KEY`, run:

```sh
go test -race -tags=integration,storageintegration ./pkg/usage ./api -count=1
```

From `web-app`, run `yarn typecheck` and
`yarn exec playwright test --project=unit e2e/prefix-usage.unit.ts e2e/bucket-usage-refresh.unit.ts`.
The real-browser `e2e/prefix-usage.spec.ts` suite also needs Console, the usage
worker and PostgreSQL; configure `CONSOLE_TEST_ENDPOINT`,
`CONSOLE_TEST_ACCESS_KEY`, `CONSOLE_TEST_SECRET_KEY` and `SILO_TEST_ENDPOINT`.
It owns and cleans up its generated fixture bucket. Use disposable services,
not operator data.

<!-- Original usage-scan documentation: Copyright (c) 2026 Urbanize.
SPDX-License-Identifier: AGPL-3.0-or-later. -->
