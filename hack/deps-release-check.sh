#!/usr/bin/env bash
# Verify that Console's maintained direct dependency and source replacement
# point at released versions, as recorded in hack/deps-release.json.
#
#   hack/deps-release-check.sh structural   # offline: go.mod agrees with the record
#   hack/deps-release-check.sh online       # + tags dereference to the recorded
#                                           #   commits, release shape, proxy and
#                                           #   checksum database (needs GH_TOKEN)
#
# structural accepts a record marked release_pending (the tag does not exist
# yet) as long as go.mod pins the recorded current_pin, and prints a warning;
# online never does. The release-candidate gate and the tag preflight run
# online, so Console cannot be tagged while a maintained release is missing.
set -euo pipefail

mode="${1:-structural}"
root="$(cd "$(dirname "$0")/.." && pwd)"
record="$root/hack/deps-release.json"
cd "$root"

case "$mode" in
  structural|online) ;;
  *) echo "usage: $0 [structural|online]" >&2; exit 2 ;;
esac

command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }

fail() { echo "deps-release-check ($mode): $*" >&2; exit 1; }
warn() { echo "deps-release-check ($mode): warning: $*" >&2; }

test "$(go mod edit -json | jq -r '.Module.Path')" = "github.com/minio/console" || fail "run from the Console repository"

is_pseudo() { [[ "$1" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.]+)?-?[0-9]{14}-[0-9a-f]{12}$ ]] || [[ "$1" =~ -[0-9]{14}-[0-9a-f]{12}$ ]]; }
is_semver() { [[ "$1" =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$ ]]; }

# Fresh, isolated module cache and toolchain settings so proxy and checksum
# database records are consulted, never a local cache or go.sum.
isolated_env() {
  local cache
  cache="$(mktemp -d)"
  echo "GOMODCACHE=$cache GOFLAGS=-mod=mod GOPROXY=https://proxy.golang.org GOSUMDB=sum.golang.org GONOPROXY= GONOSUMDB= GOPRIVATE= GOENV=off GOWORK=off GOTOOLCHAIN=local"
}

problems=0
count=$(jq '.modules | length' "$record")
test "$count" -eq 2 || fail "record must describe exactly two maintained modules, has $count"

for i in $(seq 0 $((count - 1))); do
  m() { jq -r ".modules[$i].$1 // empty" "$record"; }
  selection=$(m selection); import=$(m import); replacement=$(m replacement); version=$(m version)
  kind=$(m kind); tag=$(m tag); commit=$(m commit); repository=$(m repository)
  pending=$(m release_pending); current_pin=$(m current_pin)

  [[ "$commit" =~ ^[0-9a-f]{40}$ ]] || { echo "$import: commit must be 40 hex characters" >&2; problems=$((problems + 1)); continue; }
  [[ -n "$tag" && -n "$repository" && -n "$version" ]] || { echo "$import: tag, repository and version are required" >&2; problems=$((problems + 1)); continue; }

  case "$kind" in
    module_tag)
      is_semver "$version" || { echo "$import: module_tag version $version is not SemVer" >&2; problems=$((problems + 1)); }
      is_pseudo "$version" && { echo "$import: module_tag version $version is a pseudo-version" >&2; problems=$((problems + 1)); }
      test "$version" = "$tag" || { echo "$import: module_tag requires version == tag ($version != $tag)" >&2; problems=$((problems + 1)); }
      ;;
    calendar_release)
      is_pseudo "$version" || { echo "$import: calendar_release version $version must be a pseudo-version" >&2; problems=$((problems + 1)); }
      [[ "$version" == *"${commit:0:12}" ]] || { echo "$import: pseudo-version $version does not end in commit ${commit:0:12}" >&2; problems=$((problems + 1)); }
      ;;
    *) echo "$import: unknown kind $kind" >&2; problems=$((problems + 1)); continue ;;
  esac

  case "$selection" in
    direct)
      [ -z "$replacement" ] || { echo "$import: a direct selection must not declare replacement=$replacement" >&2; problems=$((problems + 1)); continue; }
      module_path="$import"
      actual=$(go list -mod=readonly -m -f '{{.Path}} {{.Version}}' "$import" 2>/dev/null || true)
      ;;
    replace)
      [ -n "$replacement" ] || { echo "$import: a replacement selection requires a replacement module" >&2; problems=$((problems + 1)); continue; }
      module_path="$replacement"
      actual=$(go list -mod=readonly -m -f '{{if .Replace}}{{.Replace.Path}} {{.Replace.Version}}{{end}}' "$import" 2>/dev/null || true)
      ;;
    *) echo "$import: unknown selection $selection" >&2; problems=$((problems + 1)); continue ;;
  esac
  if [ "$pending" = "true" ] && [ "$mode" = "structural" ]; then
    [ -n "$current_pin" ] || { echo "$import: release_pending requires current_pin" >&2; problems=$((problems + 1)); continue; }
    [[ "$current_pin" == *"${commit:0:12}" ]] || { echo "$import: current_pin $current_pin does not end in commit ${commit:0:12}" >&2; problems=$((problems + 1)); }
    test "$actual" = "$module_path $current_pin" || { echo "$import: go.mod selects '$actual', record expects pending pin '$module_path $current_pin'" >&2; problems=$((problems + 1)); }
    warn "$import still pins $current_pin; the maintained release $repository@$tag at $commit has not been published (release blocked until it is)"
    continue
  fi
  if [ "$pending" = "true" ]; then
    echo "$import: maintained release $repository@$tag is recorded as pending; Console cannot be released until it exists and go.mod pins $version" >&2
    problems=$((problems + 1)); continue
  fi
  test "$actual" = "$module_path $version" || { echo "$import: go.mod selects '$actual', record expects '$module_path $version'" >&2; problems=$((problems + 1)); continue; }

  [ "$mode" = "online" ] || continue
  command -v gh >/dev/null || fail "gh is required for online mode"
  [ -n "${GH_TOKEN:-}" ] || fail "GH_TOKEN is required for online mode"

  ref=$(gh api "repos/$repository/git/ref/tags/$tag" 2>/dev/null) || { echo "$import: tag $tag does not exist in $repository" >&2; problems=$((problems + 1)); continue; }
  sha=$(jq -r '.object.sha' <<<"$ref"); type=$(jq -r '.object.type' <<<"$ref")
  if [ "$type" = "tag" ]; then
    sha=$(gh api "repos/$repository/git/tags/$sha" --jq '.object.sha')
  fi
  test "$sha" = "$commit" || { echo "$import: $repository@$tag dereferences to $sha, record says $commit" >&2; problems=$((problems + 1)); continue; }

  release=$(gh api "repos/$repository/releases/tags/$tag" 2>/dev/null || true)
  case "$kind" in
    module_tag)
      # A module tag needs no GitHub release. If one exists it must be a
      # published, source-only release: no binary is ever distributed from it.
      if [ -n "$release" ]; then
        jq -e '.draft == false and (.assets | length) == 0' <<<"$release" >/dev/null \
          || { echo "$import: the GitHub release for module tag $tag must be published and carry no assets" >&2; problems=$((problems + 1)); }
      fi
      ;;
    calendar_release)
      [ -n "$release" ] || { echo "$import: calendar_release $tag must be a published GitHub release" >&2; problems=$((problems + 1)); continue; }
      jq -e '.draft == false and .prerelease == false and .immutable == true and (.assets | length) > 0' <<<"$release" >/dev/null \
        || { echo "$import: $tag must be published, immutable, non-prerelease and carry release assets" >&2; problems=$((problems + 1)); }
      latest=$(gh api "repos/$repository/releases/latest" --jq '.tag_name' 2>/dev/null || true)
      test "$latest" = "$tag" || { echo "$import: $tag must be the latest release of $repository (latest is $latest)" >&2; problems=$((problems + 1)); }
      ;;
  esac

  # Isolated proxy + checksum database verification.
  work=$(mktemp -d)
  ( cd "$work" && go mod init example.com/verify >/dev/null 2>&1 )
  # shellcheck disable=SC2046
  info=$(cd "$work" && env $(isolated_env) go mod download -json "$module_path@$version") \
    || { echo "$import: proxy.golang.org cannot serve $module_path@$version" >&2; problems=$((problems + 1)); continue; }
  sum=$(jq -r '.Sum' <<<"$info"); gomodsum=$(jq -r '.GoModSum' <<<"$info")
  [ -n "$sum" ] && [ -n "$gomodsum" ] || { echo "$import: download reported no checksums" >&2; problems=$((problems + 1)); continue; }
  escaped=$(printf '%s' "$module_path" | sed 's/[A-Z]/!\L&/g')
  for suffix in info mod zip; do
    curl -fsS -o "$work/module.$suffix" "https://proxy.golang.org/$escaped/@v/$version.$suffix" \
      || { echo "$import: proxy.golang.org/$escaped/@v/$version.$suffix is not served" >&2; problems=$((problems + 1)); }
  done
  lookup=$(curl -fsS "https://sum.golang.org/lookup/$escaped@$version") \
    || { echo "$import: sum.golang.org has no record for $module_path@$version" >&2; problems=$((problems + 1)); continue; }
  grep -qF "$module_path $version $sum" <<<"$lookup" || { echo "$import: checksum database module hash differs from the downloaded module" >&2; problems=$((problems + 1)); }
  grep -qF "$module_path $version/go.mod $gomodsum" <<<"$lookup" || { echo "$import: checksum database go.mod hash differs from the downloaded module" >&2; problems=$((problems + 1)); }
  grep -qF "$module_path $version $sum" go.sum || { echo "$import: go.sum lacks '$module_path $version $sum'" >&2; problems=$((problems + 1)); }
  grep -qF "$module_path $version/go.mod $gomodsum" go.sum || { echo "$import: go.sum lacks the go.mod hash for $module_path $version" >&2; problems=$((problems + 1)); }
  echo "$import: $module_path@$version verified ($selection/$kind, $repository@$tag = $commit, proxy + sum.golang.org + go.sum agree)"
done

if [ "$problems" -gt 0 ]; then
  fail "$problems problem(s)"
fi
echo "deps-release-check ($mode): ok"
