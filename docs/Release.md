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
