# Console frontend

The React/TypeScript frontend uses Vite, Redux Toolkit, styled-components and
MDS source from this repository. It talks to the Go Console API, which
administers the maintained SILO server. See [DEVELOPMENT.md](../DEVELOPMENT.md)
for the server workflow and [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution
and DCO requirements. Upstream MinIO compatibility is best effort; the supported
integration target is the coordinated SILO stack.

Use the Node.js version in [`.nvmrc`](../.nvmrc) and the Yarn version in
[`package.json`](package.json). Run the following commands from `web-app`.

## Development and builds

Install the locked dependencies with `yarn install --immutable`. Start the Go
Console on port 9090 with `CONSOLE_DEV_MODE=on` as described in the development
guide, then run `yarn start`. Vite serves <http://localhost:5005>, proxies `/api`
to the local Console and reloads edited source.

| Command              | Purpose                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| `yarn start`         | Start the Vite development server.                                           |
| `yarn typecheck`     | Check the application and MDS source with TypeScript.                        |
| `yarn tscwatch`      | Keep TypeScript checking in watch mode.                                      |
| `yarn build`         | Type-check and build production assets into `build/`.                        |
| `yarn vitebuild`     | Build without type-checking for local iteration.                             |
| `yarn preview`       | Serve the existing frontend build locally. This still needs the Console API. |
| `make build-static`  | Build and run `optimize-embed.sh` for Go embedding.                          |
| `make test-warnings` | Run `check-warnings.sh`, including a fresh build.                            |
| `make test-prettier` | Run the repository Prettier script.                                          |
| `make find-deadcode` | Run the configured dead-code check.                                          |
| `make pretty`        | Format files with Prettier. Review the resulting scope.                      |

`build/` is tracked and embedded in the Go server. Development builds rewrite
it; keep generated assets out of source, test and documentation commits. After
those changes are final, regenerate optimized assets and review them in a
separate DCO-signed commit, `web: rebuild embedded GUI assets`. A static preview
or local build is not a release, deployment or standalone integration result.

## Source layout

- [`packages/mds/src`](packages/mds/src) is the private `mds` Yarn workspace.
  `mds: workspace:*` exports TypeScript source directly and compiles with the
  app; no separate MDS `dist` build is needed. Edit the owning component here,
  preserve its license/copyright notices and record local changes in
  [`packages/mds/UPSTREAM.md`](packages/mds/UPSTREAM.md). Format touched vendored
  files explicitly because the normal formatter excludes upstream source.
- [`src/common/ui`](src/common/ui) contains shared status, empty/loading,
  permission, freshness, overflow and keyboard interaction primitives. Reuse
  its tokens and the MDS density, surface and control APIs. The `/components`
  page provides a local component showcase. Keep the existing icon glyphs and
  system UI font stack; Chakra Petch is reserved for the login hero.
- [`src/navigation/registry.tsx`](src/navigation/registry.tsx) owns page patterns,
  titles, permissions, feature gates and menu metadata. `ConsoleRoutes.tsx`
  renders explicit forbidden, unavailable and not-found states; `landing.ts`
  chooses Overview or Buckets. Preserve route encoding and compatibility
  redirects when changing navigation.
- [`src/MainRouter.tsx`](src/MainRouter.tsx) provides the public data-router host
  and bridges route errors to the existing error boundary. Task departure
  blocking uses the router's public API. Keep Login eager and Console, help,
  previews and heavy vendor groups lazy.

Do not introduce a second UI or animation framework for a shared control.

## Checks and bundle budgets

```sh
yarn install --immutable
yarn typecheck
yarn exec playwright test --project=unit --reporter=line
yarn build
yarn check:bundle
./check-warnings.sh
./check-prettier.sh
./check-deadcode.sh
```

[`hack/check-bundle-size.mjs`](hack/check-bundle-size.mjs) reads the Vite
manifest, sums the unique entry and static-import JavaScript files required by
Login, and checks every emitted JavaScript chunk. Fixed gzip gates are
**259,000 bytes** for the initial Login graph and **350,000 bytes** per chunk
(decimal bytes, not KiB). It rejects charts, PDF, Markdown or editor vendors in
the eager graph. The separate 200,000-byte Login aspiration is not the enforced
gate. Measure after a fresh build; do not raise the gates to accommodate a
regression.

`check-warnings.sh` performs another build. It writes to `yarn.log` by default;
set `CHECK_WARNINGS_LOG` to an absolute external file path to keep the log
outside the checkout. Its parent directory must already exist and the file is
replaced. Build failures retain exit code 111 and detected warnings exit 1.
`check-prettier.sh` checks the frontend directory, including this Markdown file;
root documentation needs its own scoped formatting check. API or dependency
changes also require the applicable Go and credits checks in the contribution
and release guides.

## Console GUI acceptance

[`hack/run-gui-e2e.sh`](hack/run-gui-e2e.sh) runs the opt-in
[`playwright.gui.config.ts`](playwright.gui.config.ts) against a running
standalone Console connected to SILO. It covers navigation, bucket tables,
previews, IAM, Overview, keyboard interactions, responsive layouts and
accessibility. Some cases use controlled read/error responses; resource and
policy round trips use the real backend. Pure and mounted component regressions
remain in the ordinary `unit` project and need no server or credentials.

Use an isolated test deployment with the existing demo fixture expected by
[`guiResources.ts`](e2e/fixtures/guiResources.ts) and
[`guiScreens.ts`](e2e/fixtures/guiScreens.ts): versioned `demo-data`, its `docs/`
and `conf/` prefixes, nine objects under `docs/` including a 17,792-byte
`docs/README.md`, enabled `alice` and `bob` accounts, the `analysts` group and
custom `demo-reader` policy. Alice uses the unchanged `readwrite` policy; Bob is
a limited user in `analysts`. The baseline built-in `readwrite` policy is
read-only test input. The real override/reset case requires an unmodified
`writeonly` built-in with known zero user and group attachments. The runner
uses preflight and test assertions for these prerequisites; it does not
provision the existing demo data or reset those accounts' passwords. Put the
maintained `mcli` executable on `PATH` and install Chromium in the normal
Playwright browser cache.

Supply credentials through the environment, without storing them in source:

| Variable                                         | Contract                                                                                                                                                 |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONSOLE_URL`                                    | Console HTTP(S) origin, without credentials, path, query or fragment.                                                                                    |
| `GUI_E2E_S3_ENDPOINT`                            | The same deployment's SILO S3 HTTP(S) origin.                                                                                                            |
| `GUI_E2E_USERNAME`, `GUI_E2E_PASSWORD`           | Administrator account for this isolated test deployment.                                                                                                 |
| `GUI_E2E_ALICE_PASSWORD`, `GUI_E2E_BOB_PASSWORD` | Existing passwords for the two limited accounts.                                                                                                         |
| `GUI_E2E_ARTIFACTS`                              | Fresh absolute external directory for one invocation's auth, reports, traces and fixture journal.                                                        |
| `GUI_E2E_SCREENSHOTS`                            | Separate absolute external screenshot directory.                                                                                                         |
| `GUI_E2E_LOCK_DIR`                               | Required for runtime invocations, including baseline generation: one shared absolute external lock directory for this backend. Not required by `--list`. |
| `GUI_E2E_RUN_ID`                                 | Optional resource namespace: 1–28 lowercase letters, digits or hyphens, starting with a letter or digit. The runner generates one if omitted.            |
| `VISUAL`                                         | Set to `1` to include visual comparisons.                                                                                                                |
| `GUI_E2E_BASELINES`                              | Required with `VISUAL=1`: separate absolute external baseline directory.                                                                                 |

All output, lock and baseline directories must be outside every Git checkout,
including symlink targets, and may not overlap. Keep the shared lock directory
separate from per-run directories. Authentication state and resource journals
live outside Playwright's cleaned `results/` child directory. Protect these
artifacts as credentials. Each runtime invocation performs fresh UI logins and
verifies exact session identities before using its newly saved account states.

After setting the environment, discover or run the suite:

```sh
./hack/run-gui-e2e.sh --list
./hack/run-gui-e2e.sh
```

`--list` performs discovery without authentication, fixture setup or a backend
lock. It still validates `CONSOLE_URL` and the external artifact/screenshot
paths, plus `GUI_E2E_BASELINES` when `VISUAL=1`.

The runner accepts only these optional arguments for scoped investigation:

- Exact spec paths: `e2e/navigation.spec.ts`, `e2e/buckets-table.spec.ts`,
  `e2e/preview.spec.ts`, `e2e/iam.spec.ts`, `e2e/overview.spec.ts`,
  `e2e/a11y.spec.ts`, `e2e/responsive.spec.ts`, `e2e/object-keyboard.spec.ts`,
  and `e2e/visual.spec.ts` with `VISUAL=1`.
- `--list` for discovery.
- `--grep PATTERN`, `--grep=PATTERN`, `-g PATTERN` or `-gPATTERN` for a test-name
  filter.
- `--max-failures N` or `--max-failures=N`, with a positive integer.

Snapshot creation uses only the separate exact command below. Other options,
including config, project, workers, retries, repetition, output, reporter and
snapshot-ignore overrides or their short aliases, are rejected. The runner
fixes the GUI config, one worker, zero retries and one repetition. It maps the
legacy `CONSOLE_TEST_*` endpoint/account values to the same deployment and
rejects conflicting values.

For acceptance, use the complete invocation without spec selectors, grep
filters or a maximum-failure shortcut. Run it three times with separate fresh
artifact and screenshot directories, fresh authentication, and the same frozen
source, standalone binary and browser. Do not count discovery, focused runs or
automatic retries as those three runs. Review every run's report, summary,
cleanup result and unexpected skips/errors.

Temporary resources use the suite's owned namespace and a private mcli
configuration. The separately coordinated built-in policy case is described
below. Cleanup removes exact object versions and delete markers,
including a literal `null` version, and verifies resource restoration. On
interruption the runner stops its worker process group before cleanup. It
retains the backend lock and journal if shutdown or cleanup cannot be proven;
inspect that evidence before any subsequent run.

The built-in policy case requires an exclusive coordinated window for
`writeonly` and a SILO server that immediately restores a built-in policy in
its IAM cache after deleting the stored override. Reset must return HTTP 204,
and the first detail GET must return HTTP 200 with the original raw policy and
native metadata. The test permits no Refresh clicks, policy-list navigation,
polling or retry writes to recover that read. It then verifies attachments and
the full policy inventory and requires the read-only UI to return. Servers
without the matching cache fix fail this acceptance check; Console does not
synthesize defaults or warm the cache to conceal that failure.
Cleanup reconciliation cannot convert a failed test into a pass. An
unconfirmed Save retains an uncertain result and the backend lock, even when a
subsequent read shows the default. A confirmed override interrupted before
Reset can be compensated once only after its current draft matches the journal;
an attempted Reset is never repeated.

### Visual baselines

Baselines stay outside Git. Generate them in a separate invocation with fresh
artifact and screenshot directories and the configured baseline directory:

```sh
VISUAL=1 ./hack/run-gui-e2e.sh e2e/visual.spec.ts --update-snapshots=all
```

That exact visual-only selection is the supported snapshot-creation mode. It
must not be mixed with business specs. Inspect the resulting images manually,
then use the approved baselines for each complete acceptance run:

```sh
VISUAL=1 ./hack/run-gui-e2e.sh
```

Acceptance never creates or updates missing baselines automatically. Baselines
are separated by platform and project; keep the browser and rendering
environment fixed. The screen descriptors cover desktop light/dark and phone
light views. `maxDiffPixels: 0` uses the installed Playwright image comparator;
it does not require PNG files to be byte-identical.

Visual captures use a controlled clock and narrowly normalized measurement
fields. They freeze JavaScript Date while keeping timers active, require
successful real GET responses, and normalize only `usageUpdatedAt` in the
bucket-list/admin-info responses and each drive's `usedSpace`/`availableSpace`.
Original values must be valid, and original drive usage must stay below the
capacity-alert threshold. Identities, totals, counts, health, metadata and grants
remain real. The visual evidence records each original and normalized field.
This screenshot-specific normalization is not applied to behavior, Overview
API-numeric or whole-page axe checks.

During Login capture, a temporary visibility rule suppresses only the random
canvas pixels, preserving hero copy, background, logo, form and layout. Narrow
Overview raw-byte and uptime masks remain documented in the screen descriptors;
relative-time text stays visible under the controlled clock. Whole-page
accessibility checks use no rule exclusions and reject moderate, serious or
critical violations. The responsive suite also visits deep identity, event,
tier, configuration, Trace, Profile and replication forms in English and
Chinese at 390, 768 and 1440 pixels, including the expanded tablet sidebar.
It checks phone field widths, label associations, password visibility and
local draft interactions without submitting configuration changes, and audits
each deep state in phone dark and desktop light views. OpenID edit behavior
and Trace event details additionally use mounted component regressions;
external identity login and remote service integration need their own configured
environments. This is not a claim of full accessibility certification.

The new GUI-only specs are excluded from legacy Chromium discovery. Existing
bucket-table coverage also remains runnable there. This opt-in suite is not
enabled by the existing CI command; keep its fixture/auth requirements separate
from the legacy projects.

## Translations

Run `yarn exec playwright test --project=unit e2e/i18n-coverage.unit.ts --reporter=line`
after changing UI copy. The TypeScript AST guard collects literal keys from
`t(...)`, `translate(language, ...)`, `translateLegend(language, ...)`, and
bindings returned by `useT()` / `useLegendT()` (including import aliases).
It excludes `src/i18n`, tests, and the generated API client from key collection.

For strings translated later, mark the definition with `i18nKey("English key")`
from `i18n/lang`: menu names/groups, tab arrays, column labels, form metadata,
and props passed to translating wrappers. This identity function preserves the
English value until rendering. The explicit JSON paths in
`src/i18n/indirectKeys.ts` collect help headers, titles, and bodies at test time;
there is no second copy of the help prose to maintain. Live API/RSS values and
technical examples such as URLs and LDAP filters are not static UI copy.

The registry in `src/i18n/locales.ts` supports English, Chinese, French, German,
Russian, Spanish, Brazilian Portuguese, Japanese, Arabic and Turkish. All
catalogs are bundled statically from `src/i18n/locales/<id>/`. Put shared labels in
`chrome.ts`, help copy in `help.ts`, and feature-screen copy in `screens.ts`.
Use `tn(count, one, other)` for quantities and locale-specific plural forms.

Chinese coverage remains a hard gate; missing maintained translations fall back
to English. Run `yarn i18n:report` for coverage and contextual missing-key exports.
The seven new catalogs are AI-assisted, with curated terminology and destructive
operation copy; native-speaker corrections are welcome. See the [translation
workflow](src/i18n/README.md) and [glossary](src/i18n/GLOSSARY.md) for validation,
key migration, language ownership, RTL and development-only pseudo-locales.
`untranslatable.ts` lists exact brand/protocol names kept in every language.

All catalog parts are available at startup. Mounted-copy and browser regressions
cover menu selection, offline switching, saved preferences and unsaved form data.
Keep these alongside the coverage guard when changing the registry or catalog
mapping.

The orphan report searches all JS/TS/JSX/TSX/JSON string literals under `src`, including
tests and generated code, excluding `src/i18n` so dictionaries and baselines
cannot keep their own keys alive. Only new orphans fail: remove unused dictionary
entries and shrink `orphanBaseline.ts` as old ones are reviewed. Some existing
entries arrive from the server or constructed keys, so review before deleting.
Do not expand the baseline to hide regressions. Different values for the same
key are also checked against an exact-value baseline in that file; precedence is
`chrome > screens > help`. Resolve new conflicts in the winning dictionary or
remove the redundant entry. Identical duplicate values are allowed.

## Learn More

You can learn more in
the [Vite documentation](https://vite.dev/guide/).

To learn React, check out the [React documentation](https://react.dev/).
