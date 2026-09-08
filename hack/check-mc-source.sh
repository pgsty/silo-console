#!/usr/bin/env bash
# Copyright (c) 2026 PGSTY
# SPDX-License-Identifier: AGPL-3.0-or-later
# Accept an immutable MC source revision after it landed on main and passed
# the same four push workflows required by MC's own release-commit check.
set -euo pipefail

commit="${1:-}"
[[ "$commit" =~ ^[0-9a-f]{40}$ ]] || { echo "expected a full MC commit" >&2; exit 1; }
repository="pgsty/mc"

comparison=$(gh api "repos/$repository/compare/$commit...main")
jq -e --arg sha "$commit" '
  (.status == "ahead" or .status == "identical") and .merge_base_commit.sha == $sha
' <<<"$comparison" >/dev/null || { echo "MC $commit has not landed on main" >&2; exit 1; }

runs=$(gh api --paginate --slurp "repos/$repository/actions/runs?head_sha=$commit&per_page=100")
for workflow in go.yml go-cross.yml vulncheck.yml test-release.yml; do
  latest=$(jq -c --arg path ".github/workflows/$workflow" --arg sha "$commit" '
    [.[].workflow_runs[]
      | select(.path == $path and .head_sha == $sha)
      | select(.event == "push" and .head_branch == "main")]
    | sort_by([.run_number // 0, .run_attempt // 0]) | last // null
  ' <<<"$runs")
  jq -e '.status == "completed" and .conclusion == "success"' <<<"$latest" >/dev/null \
    || { echo "MC $commit: latest main push of $workflow is not successful" >&2; exit 1; }
done
echo "MC $commit: accepted main source with all four push workflows successful"
