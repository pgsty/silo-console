#!/usr/bin/env bash
# Copyright (c) 2026 PGSTY
# SPDX-License-Identifier: AGPL-3.0-or-later
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
mkdir "$work/bin"
cat >"$work/bin/gh" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
case "$*" in
  *compare/*) cat "$MC_SOURCE_FIXTURE/comparison.json" ;;
  *actions/runs*) cat "$MC_SOURCE_FIXTURE/runs.json" ;;
  *) exit 1 ;;
esac
SH
chmod +x "$work/bin/gh"
export PATH="$work/bin:$PATH" MC_SOURCE_FIXTURE="$work"
commit="1111111111111111111111111111111111111111"
jq -n --arg sha "$commit" '{status:"identical",merge_base_commit:{sha:$sha}}' >"$work/comparison-base.json"
jq -n --arg sha "$commit" '[{workflow_runs:[
  "go.yml","go-cross.yml","vulncheck.yml","test-release.yml"
  | {path:(".github/workflows/"+.),head_sha:$sha,event:"push",head_branch:"main",
     status:"completed",conclusion:"success",run_number:1,run_attempt:1}
]}]' >"$work/runs-base.json"
reset_fixture() {
  cp "$work/comparison-base.json" "$work/comparison.json"
  cp "$work/runs-base.json" "$work/runs.json"
}
expect_pass() {
  bash "$root/hack/check-mc-source.sh" "$commit" >"$work/output" 2>&1 \
    || { cat "$work/output" >&2; echo "FAIL: $1" >&2; exit 1; }
}
expect_fail() {
  if bash "$root/hack/check-mc-source.sh" "$commit" >"$work/output" 2>&1; then
    echo "FAIL: accepted $1" >&2; exit 1
  fi
}
reset_fixture
expect_pass "current main"
jq '.status="ahead"' "$work/comparison-base.json" >"$work/comparison.json"
expect_pass "accepted ancestor after main advances"
jq '.status="diverged"' "$work/comparison-base.json" >"$work/comparison.json"
expect_fail "unmerged branch"
reset_fixture
jq '.merge_base_commit.sha="2222222222222222222222222222222222222222"' "$work/comparison-base.json" >"$work/comparison.json"
expect_fail "wrong merge base"
for field in 'event="pull_request"' 'event="workflow_dispatch"' 'head_branch="feature"' 'head_sha="2222222222222222222222222222222222222222"' 'status="in_progress"' 'conclusion="failure"' 'conclusion="skipped"'; do
  reset_fixture
  jq ".[0].workflow_runs[0].$field" "$work/runs-base.json" >"$work/runs.json"
  expect_fail "$field"
done
reset_fixture
jq '.[0].workflow_runs |= .[1:]' "$work/runs-base.json" >"$work/runs.json"
expect_fail "missing workflow"
reset_fixture
jq '.[0].workflow_runs += [.[0].workflow_runs[0] | .run_attempt=2 | .conclusion="failure"]' "$work/runs-base.json" >"$work/runs.json"
expect_fail "newer failed attempt after success"
reset_fixture
jq '.[0].workflow_runs += [.[0].workflow_runs[0] | .run_number=2 | .conclusion="failure"]' "$work/runs-base.json" >"$work/runs.json"
expect_fail "newer failed run after success"
reset_fixture
printf 'not-json\n' >"$work/runs.json"
expect_fail "invalid API response"
echo "MC source checks: all acceptance and rejection cases passed"
