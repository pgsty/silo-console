# Release procedure

This page is the operational checklist for tagging a Console release. Every
gate below is enforced by a workflow; the text explains what each one proves
and how to recover when it fails.

## 1. Candidate commit

1. Land every change through pull requests on `main`.
2. The last commit of a release prepares the metadata (see
   [Version metadata](#4-version-metadata)). Do not tag before that commit
   exists and has passed the gates.

## 2. Complete validation matrix on the exact commit

The release workflow (`.github/workflows/release.yaml`) refuses to build a tag
unless the **exact tagged SHA** has:

- a completed, successful run of `jobs.yaml` whose summary job
  `Required matrix` succeeded, and
- a completed, successful run of `vulncheck.yaml` whose summary job
  `Required vulnerability checks` succeeded.

The summary jobs list every job of their workflow explicitly and fail unless
each result is `success`; a skipped, cancelled or failed job fails the summary.
A run on a parent commit is never accepted: release-only commits are dispatched
too.

### Dispatching the matrix

`workflow_dispatch` takes a branch or tag ref, not a bare commit:

```sh
git switch -c release/vX.Y.Z <candidate-sha>
git push origin release/vX.Y.Z
gh workflow run jobs.yaml --ref release/vX.Y.Z
gh workflow run vulncheck.yaml --ref release/vX.Y.Z
# record the exact runs you started and watch those ids
gh run list --workflow jobs.yaml --branch release/vX.Y.Z --event workflow_dispatch --limit 1 \
  --json databaseId,headSha,status,conclusion
gh run list --workflow vulncheck.yaml --branch release/vX.Y.Z --event workflow_dispatch --limit 1 \
  --json databaseId,headSha,status,conclusion
gh run watch <databaseId>
```

Confirm `headSha` equals the candidate before tagging. If the branch moves, the
runs no longer describe the candidate and the gate fails by design.

### Reruns

An infrastructure failure (runner lost, registry outage, image pull timeout) is
rerun in place, which keeps the run id and produces a new attempt:

```sh
gh run rerun <databaseId> --failed
```

The summary job re-evaluates in the new attempt and the gate reads the latest
attempt. A product failure is never rerun into green: fix it with a new commit,
which restarts the gate. The release job prints the accepted run ids and
attempts into its job summary, so a release can be audited from the Actions UI.

### Evidence for browser-test failures

Every TestCafe job takes a screenshot of each failed test and uploads it as the
artifact `testcafe-<job>-attempt-<n>`. The Permissions A/B fixtures wait in two
observable stages (page rendered, then control enabled) and their failure
messages say which stage did not happen, so a slow first navigation is
distinguishable from a grants or fixture problem.

## 2b. Maintained dependency releases and the candidate gate

Console pins three maintained forks through `replace` directives. Every one of
them must be a **released** version before Console is tagged. The record is
`hack/deps-release.json`; `hack/deps-release-check.sh` verifies it:

- `structural` (part of `make verifiers`): `go.mod` agrees with the record. A
  record marked `release_pending` (the maintainer has not created the tag yet)
  only warns here, as long as `go.mod` pins the recorded `current_pin`.
- `online` (candidate gate and tag preflight): every tag dereferences to the
  recorded commit; a `module_tag` has at most a source-only GitHub release; a
  `calendar_prerelease` is a published pre-release with no assets that is not
  the repository's latest release; the module is served by
  `proxy.golang.org` from an empty module cache with no direct fallback, the
  `.info`/`.mod`/`.zip` records exist, and `sum.golang.org` and `go.sum` carry
  the same two hashes. A pending record fails.

### Maintainer steps for the current record

The compatibility line (Console, SILO server, `pgsty/mc` at `5ed037e` and
`pgsty/silo-pkg` at `748c94b`) stays on the upstream import paths; the
own-module-path migration (`silo-pkg` v3.13.0, `mc` `RELEASE.2026-09-01`) is
a separate coordinated release with the server.

1. `pgsty/silo-pkg`: tag `v3.12.3` at `748c94bf8ab7f972fb34ee2385cab421c7979574`
   (the last commit that declares `module github.com/minio/pkg/v3`) and push it.
   A GitHub release is optional; if created it must carry no assets.
   ```sh
   git -C silo-pkg tag -a v3.12.3 748c94bf8ab7f972fb34ee2385cab421c7979574 -m "v3.12.3: compatibility path"
   git -C silo-pkg push origin v3.12.3
   ```
2. `pgsty/mc`: choose one shape and record it in `hack/deps-release.json`:
   - **module tag (recommended)**: a SemVer pre-release tag with no GitHub
     release. It is a real Go version, is listed by the proxy, does not match
     the `RELEASE.*` workflow trigger, so no binaries are built, and cannot
     become "latest".
     ```sh
     git -C mc tag -a v1.0.0-compat.20260829 5ed037ef4ec17d9f321dee67d005fd3ba789b718 -m "Console compatibility source tag"
     git -C mc push origin v1.0.0-compat.20260829
     ```
     Console then pins `github.com/pgsty/mc v1.0.0-compat.20260829`.
   - **calendar pre-release**: a `RELEASE.*` tag published with
     `gh release create <tag> --prerelease --latest=false --notes "Console compatibility source"`
     and **no assets**; cancel the historical release workflow run for that
     tag and confirm `gh api repos/pgsty/mc/releases/latest --jq .tag_name`
     still names `RELEASE.2026-09-01T00-00-00Z`. Console keeps a pseudo-version
     pin whose suffix is the tag's commit.
   Publishing `5ed037e` as a normal binary release is not acceptable: it would
   redistribute a CLI that lacks the later credential-redaction fixes.
3. Console: bump the two `replace` lines to the released versions, run
   `go mod tidy`, `go run ./hack/replacements update`, set `release_pending`
   to `false` in `hack/deps-release.json`, and run `make verifiers` and
   `GH_TOKEN=$(gh auth token) hack/deps-release-check.sh online`.

### Certifying the candidate

Run the candidate gate **from `main`** on the exact commit:

```sh
gh workflow run release-candidate.yaml --ref main -f candidate=<candidate-sha> -f server_ref=main
gh run list --workflow release-candidate.yaml --event workflow_dispatch --limit 1 --json databaseId,status,conclusion
gh run watch <databaseId>
```

It checks the dependency releases (structural and online), Console's own
checks and reproducible assets, the upstream floor, the README-block
embedder, and builds and tests the SILO server (`go test ./cmd/`, the
server's own CI command) on the coherent graph with the candidate embedded.
On success it publishes the commit status `release-candidate/gate` on the
candidate and uploads `candidate-<sha>.json` (candidate, run id and attempt,
the three replacement tuples, the resolved server commit). The tag preflight
requires that status, verifies that its run is a successful
`release-candidate.yaml` dispatch on `main`, downloads the record from that
exact run and checks that it binds the run and attempt to the tagged SHA, then
reruns the online dependency check.

## 3. Tagging

Tag exactly the SHA that passed the gates:

```sh
git tag -a vX.Y.Z <candidate-sha> -m "vX.Y.Z"
git push origin vX.Y.Z
```

Pushing the tag starts `release.yaml`. Its `preflight` job runs the matrix gate
above, verifies that the tag resolves to the commit, that `CHANGELOG.md` has a
`## Release vX.Y.Z` section and `web-app/src/version.tsx` carries the version,
re-runs the Go checks, rebuilds the embedded assets and requires a clean tree.
GoReleaser then creates a **draft** release; publish it only after reviewing
the notes.

## 4. Version metadata

Select the version only after the dependency releases above are done or
explicitly deferred in writing; the metadata commit is the last change to
release scope. `web-app/e2e/version-metadata.unit.ts` checks that
`package.json`, `src/version.tsx` and the newest CHANGELOG heading agree; with
`RELEASE_METADATA_MUST_BE_FINAL=1` (set by the candidate gate and the tag
preflight) the heading must be `Release vX.Y.Z`, not `Unreleased`. The
Playwright spec `e2e/license-page.spec.ts` asserts that the License page's
"this Console" row renders `v` plus the package version.

The metadata commit renames `## Unreleased` to `## Release vX.Y.Z`, sets
`web-app/package.json`, and regenerates `web-app/src/version.tsx` and
`web-app/build` with exactly the release commands (Node from `.nvmrc`, Corepack,
Yarn 4):

```sh
cd web-app
corepack enable
yarn install --immutable
yarn build
./optimize-embed.sh
git status --porcelain   # must be empty apart from the intended files
```

Every bullet of the release section is checked against
`git diff v<previous>..<candidate>` and the tests that cover it; reverted or
superseded changes are removed. Commit subjects are not evidence.

## 5. Branch protection (maintainer setting)

Requiring the individual contexts is fragile; require the two summary jobs
instead:

```sh
gh api -X PUT repos/pgsty/silo-console/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Required matrix", "Required vulnerability checks"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

This is an administrative action outside the repository; the release gate in
section 2 blocks a tag regardless of the branch setting.

## 6. Release artifacts, legal material and publication

Every artifact carries `LICENSE`, `NOTICE` and `CREDITS`:

- bare executables embed them (`console license`, `console notice`,
  `console credits`; `console version` prints the exact corresponding source);
- `.tar.gz`/`.zip` bundles ship them as files next to the executable;
- DEB, RPM and APK packages install `/usr/share/licenses/silo-console/{LICENSE,NOTICE}`
  and `/usr/share/doc/silo-console/CREDITS` (DEB also a DEP-5
  `/usr/share/doc/silo-console/copyright` with the full AGPL text);
- the container image carries them under `/usr/share/licenses/silo-console/`
  and the labels `org.opencontainers.image.{revision,version,licenses,source}`
  and `io.pgsty.silo-console.source` (exact tag or commit URL);
- the running server serves them at `/legal/LICENSE`, `/legal/NOTICE`,
  `/legal/CREDITS` and injects the exact source into the page metadata used by
  the License, Login and anonymous pages.

`CREDITS` is generated (`go run ./hack/credits update`): the union of the Go
modules linked on every release target, with the fork that provides each
replaced import path, plus the production frontend dependency closure and the
bundled fonts. `make verifiers` checks the Go section; the frontend section is
checked where `web-app/node_modules` exists (`ui-assets`, the candidate gate,
the tag preflight).

`hack/verify-release-artifacts.sh snapshot` builds a GoReleaser snapshot and
verifies the full matrix (6 bare binaries, 6 bundles, 9 packages, 2 platform
images), file lists, byte-identical legal files, package license metadata, the
DEP-5 file, image labels and the embedded texts of the native binary and image.
CI runs it on every change (`release-artifacts`).

### Staging and publication (build once, verify, promote)

1. `goreleaser` builds the artifacts, uploads them to a **draft** GitHub
   release and pushes the multi-platform image to the **private** staging
   package `ghcr.io/pgsty/silo-console-staging:<tag>`. Before pushing, the job
   verifies through the Packages API that the staging package exists and is
   private; it never creates it.
2. `verify-release` verifies the environment protection of `release`, downloads
   the draft's assets and the GoReleaser metadata, runs
   `hack/verify-release-artifacts.sh release <tag> …` against the exact bytes
   and the staging index, and uploads `release-verification.json` (asset
   sha256s, index and per-platform digests).
3. `publish-release` runs in the protected `release` environment (required
   reviewers). After approval it re-checks the environment protection,
   re-downloads the assets and compares them to the record, records the
   previous `latest` image digest for rollback, copies the verified index **by
   digest** into `ghcr.io/pgsty/silo-console:<tag>` and `:latest`
   (`docker buildx imagetools create`, a carbon copy of the same digest),
   re-inspects the public tags, publishes the GitHub release
   (`draft=false`, latest), and finally deletes the staging package version.

If promotion fails after the public tags were created, the GitHub release is
still a draft; restore `latest` from the recorded previous digest
(`docker buildx imagetools create -t ghcr.io/pgsty/silo-console:latest ghcr.io/pgsty/silo-console@<previous-digest>`)
and re-run the job. The source digest was verified before the copy, so the
public tags are never wrong bytes — only possibly premature.

### One-time provisioning (maintainer)

- Create the private staging package once by copying the current public image
  into the new name, then confirm its visibility and grant the repository's
  Actions write access:
  ```sh
  docker buildx imagetools create -t ghcr.io/pgsty/silo-console-staging:bootstrap ghcr.io/pgsty/silo-console:latest
  gh api orgs/pgsty/packages/container/silo-console-staging --jq .visibility   # must print: private
  ```
  (GitHub → Packages → silo-console-staging → Package settings → Danger Zone →
  visibility private; Manage Actions access → add `pgsty/silo-console` with
  write.)
- Create the `release` environment with at least one required reviewer
  (Settings → Environments → release → Required reviewers). The workflow reads
  the protection rules through the API and refuses to verify or publish
  without one.
- Pin Buildx: `docker/setup-buildx-action` is pinned to a Buildx release that
  copies images across repositories recursively (v0.36.1 at the time of
  writing); the post-promotion digest assertion proves the copy on every
  release.
