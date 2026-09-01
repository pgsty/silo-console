# Release procedure

This is the checklist for publishing a SILO Console release. Pushing an
annotated `v*` tag starts `.github/workflows/release.yaml`; the workflow creates
a draft GitHub release and publishes the versioned and `latest` container tags.
The maintainer reviews and publishes the draft manually.

## 1. Prepare one candidate commit

1. Land the release changes on `main`.
2. Make the metadata change the last release-scope change: finalize the
   CHANGELOG heading, set `web-app/package.json`, and regenerate the embedded
   assets.
3. Require a clean worktree and record the exact candidate SHA.

## 2. Validate that exact SHA

The candidate must have successful runs of:

- `jobs.yaml`, including its `Required matrix` summary job; and
- `vulncheck.yaml`, including its `Required vulnerability checks` summary job.

The release workflow looks up those two successful summary jobs by exact SHA.
It does not accept a run from a parent commit. If the candidate has no runs,
dispatch both workflows from a temporary branch that points at it:

```sh
git switch -c release/vX.Y.Z <candidate-sha>
git push origin release/vX.Y.Z
gh workflow run jobs.yaml --ref release/vX.Y.Z
gh workflow run vulncheck.yaml --ref release/vX.Y.Z
```

Record and watch the run IDs. Rerun a failed job only for an infrastructure
failure; fix a product failure in a new commit and validate the new SHA.

The tag preflight also runs `hack/deps-release-check.sh online`. It verifies the
maintained `silo-pkg` and `mc` releases recorded in
`hack/deps-release.json` against their tags, the public Go proxy, the checksum
database, and `go.sum`.

## 3. Tag and build

Tag the validated commit, not merely the current checkout:

```sh
git tag -a vX.Y.Z <candidate-sha> -m "vX.Y.Z"
git push origin vX.Y.Z
```

Before GoReleaser runs, the tag workflow checks:

- the exact-SHA matrix and vulnerability summaries;
- that the tag resolves to the checked-out commit;
- that the CHANGELOG and generated frontend version match the tag;
- that the maintained dependency releases remain available; and
- that rebuilding `web-app/build` and `src/version.tsx` produces no diff.

GoReleaser then uploads binaries, archives, packages, checksums, legal files,
and a **draft** GitHub release. It publishes the multi-platform image directly
to `ghcr.io/pgsty/silo-console` under the release tag and `latest`.

## 4. Review and publish the draft

Review the generated notes and asset list, then publish the draft in GitHub.
The draft is the manual approval boundary; no separate environment or staging
package is required.

If GoReleaser fails while uploading assets, the release remains an unpublished
draft. Delete that partial draft and rerun the tag workflow. The container tags
may already point at the correctly labelled release image; rerunning with the
same tag replaces them with the completed build.

## 5. Version metadata

The release version has no `v` prefix in `web-app/package.json` or
`web-app/src/version.tsx`. The newest CHANGELOG heading uses the tag form:

```text
## Release vX.Y.Z
```

Regenerate the frontend with the release commands:

```sh
cd web-app
corepack enable
yarn install --immutable
yarn build
./optimize-embed.sh
git diff --exit-code -- build src/version.tsx
```

`web-app/e2e/version-metadata.unit.ts` enforces the three-way version match.

## 6. Release contents

Every release artifact carries `LICENSE`, `NOTICE`, and `CREDITS`:

- bare executables embed them for `console license|notice|credits`;
- archives place them next to the executable;
- DEB, RPM, and APK packages install them under `/usr/share`; and
- container images include them under `/usr/share/licenses/silo-console` and
  carry the exact version, revision, license, and source labels.

`hack/verify-release-artifacts.sh snapshot` exercises the GoReleaser matrix in
CI. The tag workflow relies on the exact-SHA result rather than rebuilding the
same snapshot a second time.
