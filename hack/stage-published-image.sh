#!/usr/bin/env bash
# Stage an OCI build from signed, already-published release binaries.
set -euo pipefail

tag="${1:?usage: stage-published-image.sh <tag> <empty-context-dir>}"
context="${2:?usage: stage-published-image.sh <tag> <empty-context-dir>}"
[[ "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]
repository="pgsty/silo-console"
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
commit="$(git rev-parse "refs/tags/$tag^{commit}")"
epoch="$(git show -s --format=%ct "$commit")"
created="$(TZ=UTC git show -s --format=%cd --date=format-local:%Y-%m-%dT%H:%M:%SZ "$commit")"
identity="https://github.com/$repository/.github/workflows/release.yaml@refs/tags/$tag"
issuer="https://token.actions.githubusercontent.com"
checksum="silo-console_${tag#v}_checksums.txt"

gh api "repos/$repository/releases/tags/$tag" \
  --jq '.draft == false and .prerelease == false' | grep -qx true
mkdir -p "$context"
test -z "$(ls -A "$context")"
context="$(cd "$context" && pwd)"
gh release download "$tag" --repo "$repository" --dir "$context" \
  --pattern "$checksum" --pattern "$checksum.sigstore.json" \
  --pattern silo-console-linux-amd64 --pattern silo-console-linux-arm64 \
  --pattern LICENSE --pattern NOTICE --pattern CREDITS
cosign verify-blob --bundle "$context/$checksum.sigstore.json" \
  --certificate-identity "$identity" --certificate-oidc-issuer "$issuer" \
  "$context/$checksum"
gh attestation verify "$context/$checksum" --repo "$repository" \
  --signer-workflow "$repository/.github/workflows/release.yaml" \
  --source-ref "refs/tags/$tag" --source-digest "$commit"

for arch in amd64 arm64; do
  binary="silo-console-linux-$arch"
  # Require exactly one signed entry per input, not merely any matching file.
  expected="$(awk -v name="$binary" '$2 == name {print $1}' "$context/$checksum")"
  [[ "$expected" =~ ^[0-9a-f]{64}$ ]]
  actual="$(shasum -a 256 "$context/$binary" | cut -d' ' -f1)"
  test "$actual" = "$expected"
  mkdir -p "$context/linux/$arch"
  mv "$context/$binary" "$context/linux/$arch/silo-console"
  chmod 0755 "$context/linux/$arch/silo-console"
done
for legal in LICENSE NOTICE CREDITS; do
  git show "$commit:$legal" | cmp - "$context/$legal"
done
git show "$commit:Dockerfile.goreleaser" > "$context/Dockerfile"
checksum_digest="$(shasum -a 256 "$context/$checksum" | cut -d' ' -f1)"
jq -n --arg tag "$tag" --arg commit "$commit" --arg epoch "$epoch" \
  --arg created "$created" --arg checksum "$checksum" --arg digest "$checksum_digest" \
  '{tag:$tag, commit:$commit, epoch:$epoch, created:$created, checksum:$checksum, checksum_digest:$digest}' \
  > "$context/release-inputs.json"
echo "Verified $tag ($commit); OCI context: $context"
