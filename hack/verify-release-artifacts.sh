#!/usr/bin/env bash
# Verify that every release artifact carries the legal material, exact
# provenance metadata and the expected matrix.
#
#   hack/verify-release-artifacts.sh snapshot
#       Build a GoReleaser snapshot (binaries, bundles, packages and local
#       images) and verify dist/ from dist/artifacts.json. Used by CI on every
#       change (release-artifacts) and locally as a rehearsal.
#
#   hack/verify-release-artifacts.sh release <tag> <assets-dir> <metadata-dir>
#       Verify the final artifacts of a tagged release before publication:
#       <assets-dir> holds the draft release's downloaded assets, <metadata-dir>
#       holds dist/artifacts.json and dist/metadata.json from the GoReleaser run,
#       and the multi-platform image is inspected in the private staging package
#       by tag. Writes release-verification.json for the publish job.
#
# Every check fails closed. Requirements: goreleaser (snapshot mode), docker
# with buildx, jq, tar, unzip, dpkg-deb, rpm, rpm2cpio, cpio, sha256sum.
set -euo pipefail

mode="${1:-}"
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

log() { echo "verify-release-artifacts: $*"; }
fail() { echo "verify-release-artifacts: FAIL: $*" >&2; exit 1; }
sha() { sha256sum "$1" | cut -d' ' -f1; }
have() { command -v "$1" >/dev/null 2>&1 || fail "$1 is required"; }
for tool in jq tar unzip dpkg-deb rpm rpm2cpio cpio sha256sum docker go; do have "$tool"; done
cpio_extract_args=(-idm --quiet)
if cpio --help 2>&1 | grep -q -- '--no-absolute-filenames'; then
  cpio_extract_args+=(--no-absolute-filenames)
fi

repository_url="https://github.com/pgsty/silo-console"
staging_image="ghcr.io/pgsty/silo-console-staging"
expected_binaries=6 expected_bundles=6 expected_packages=9 expected_platforms=2

license_sha="$(sha LICENSE)"; notice_sha="$(sha NOTICE)"; credits_sha="$(sha CREDITS)"
head_commit="$(git rev-parse HEAD)"
# A binary built from a modified tree correctly refuses to claim an exact
# source; provenance assertions therefore only run on a clean checkout (CI).
tree_dirty=0
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  tree_dirty=1
  log "WARNING: the working tree is modified; exact-source assertions are skipped (they run on the clean CI checkout)"
fi
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

case "$mode" in
  snapshot)
    if [ "${VERIFY_SKIP_BUILD:-}" = "1" ] && [ -s dist/artifacts.json ]; then
      log "reusing the existing dist/ (VERIFY_SKIP_BUILD=1)"
    else
      have goreleaser
      log "building a snapshot"
      goreleaser release --snapshot --clean >"$work/goreleaser.log" 2>&1 || { tail -50 "$work/goreleaser.log" >&2; fail "goreleaser snapshot failed"; }
    fi
    assets_dir="dist"; metadata_dir="dist"; tag=""
    ;;
  release)
    tag="${2:-}"; assets_dir="${3:-}"; metadata_dir="${4:-}"
    [ -n "$tag" ] && [ -d "$assets_dir" ] && [ -d "$metadata_dir" ] || fail "usage: $0 release <tag> <assets-dir> <metadata-dir>"
    ;;
  *) fail "usage: $0 snapshot | release <tag> <assets-dir> <metadata-dir>" ;;
esac

artifacts="$metadata_dir/artifacts.json"; metadata="$metadata_dir/metadata.json"
[ -s "$artifacts" ] && [ -s "$metadata" ] || fail "missing $artifacts or $metadata"
version="$(jq -r '.version' "$metadata")"
built_commit="$(jq -r '.commit' "$metadata")"
test "$built_commit" = "$head_commit" || fail "metadata commit $built_commit differs from checkout $head_commit"
if [ "$mode" = release ]; then
  test "$(jq -r '.tag' "$metadata")" = "$tag" || fail "metadata tag $(jq -r '.tag' "$metadata") differs from $tag"
  expected_source="$repository_url/tree/$tag"; expected_version="$tag"
else
  expected_source="$repository_url/commit/$head_commit"; expected_version="$version"
fi

# artifact lists ---------------------------------------------------------------
list() { jq -r --arg type "$1" '.[] | select(.type == $type) | .name' "$artifacts" | sort; }
# GoReleaser records the bare-binary archive (format "binary") as type Binary
# with the archive id; the raw build outputs share the type but not the id.
mapfile -t bare < <(jq -r '.[] | select(.type == "Binary" and .extra.ID == "binaries") | .name' "$artifacts" | sort)
mapfile -t bundles < <(jq -r '.[] | select(.type == "Archive" and .extra.ID == "bundles") | .name' "$artifacts" | sort)
mapfile -t packages < <(list "Linux Package")
mapfile -t checksums < <(list Checksum)
archives=("${bare[@]}" "${bundles[@]}")

log "matrix: ${#bare[@]} bare binaries, ${#bundles[@]} bundles, ${#packages[@]} packages, ${#checksums[@]} checksum file(s)"
test "${#bare[@]}" -eq "$expected_binaries" || fail "expected $expected_binaries bare binaries, artifacts.json lists ${#bare[@]}"
test "${#bundles[@]}" -eq "$expected_bundles" || fail "expected $expected_bundles bundles, artifacts.json lists ${#bundles[@]}"
test "${#packages[@]}" -eq "$expected_packages" || fail "expected $expected_packages packages, artifacts.json lists ${#packages[@]}"
test "${#checksums[@]}" -eq 1 || fail "expected exactly one checksum file"
for fmt in deb rpm apk; do
  n=$(printf '%s\n' "${packages[@]}" | grep -c "\.$fmt$" || true)
  test "$n" -eq 3 || fail "expected 3 .$fmt packages (amd64, arm64, arm), found $n"
done
for os_arch in linux_amd64 linux_arm64 linux_arm darwin_amd64 darwin_arm64 windows_amd64; do
  jq -e --arg goos "${os_arch%_*}" --arg goarch "${os_arch#*_}" '
    ([.[] | select(.type == "Binary" and .extra.ID == "binaries" and .goos == $goos and .goarch == $goarch)] | length == 1) and
    ([.[] | select(.type == "Archive" and .extra.ID == "bundles" and .goos == $goos and .goarch == $goarch)] | length == 1)' "$artifacts" >/dev/null \
    || fail "missing bare binary or bundle for $os_arch"
done

asset() { # path of a named asset
  local name="$1"
  if [ "$mode" = release ]; then
    [ -f "$assets_dir/$name" ] || fail "draft release lacks asset $name"
    echo "$assets_dir/$name"
  else
    local path; path="$(jq -r --arg name "$name" '.[] | select(.name == $name) | .path' "$artifacts" | head -1)"
    [ -f "$path" ] || fail "artifact $name not found at $path"
    echo "$path"
  fi
}

# checksums ----------------------------------------------------------------------
checksum_file="$(asset "${checksums[0]}")"
for name in "${archives[@]}" "${packages[@]}"; do
  expected="$(grep -E "  $name\$" "$checksum_file" | cut -d' ' -f1)"
  [ -n "$expected" ] || fail "$name is not listed in the checksum file"
  test "$(sha "$(asset "$name")")" = "$expected" || fail "checksum mismatch for $name"
done
log "checksum file covers every archive and package"

# release extra files --------------------------------------------------------------
if [ "$mode" = release ]; then
  for doc in LICENSE NOTICE CREDITS; do
    test "$(sha "$(asset "$doc")")" = "$(sha "$doc")" || fail "release asset $doc differs from the repository file"
  done
fi

# bare binaries ------------------------------------------------------------------
native="$(go env GOOS)-$(go env GOARCH)"
credits_covered() { # $1 = binary; every linked module must have a CREDITS entry
  go version -m "$1" | awk '$1 == "dep" || $1 == "=>" { print $2 }' | sort -u | while read -r module; do
    grep -qE "^${module//./\\.}( \(provided by |$)" CREDITS || grep -qE "\(provided by ${module//./\\.} " CREDITS \
      || { echo "$1: module $module has no CREDITS entry" >&2; exit 1; }
  done
}
for name in "${bare[@]}"; do
  path="$(asset "$name")"
  credits_covered "$path"
  case "$name" in
    *"$native"*)
      chmod +x "$path"
      test "$("$path" license | sha256sum | cut -d' ' -f1)" = "$license_sha" || fail "$name: embedded LICENSE differs"
      test "$("$path" notice | sha256sum | cut -d' ' -f1)" = "$notice_sha" || fail "$name: embedded NOTICE differs"
      test "$("$path" credits | sha256sum | cut -d' ' -f1)" = "$credits_sha" || fail "$name: embedded CREDITS differs"
      if [ "$tree_dirty" -eq 0 ]; then
        "$path" version | grep -q "^source:  $expected_source" || fail "$name: 'version' does not report $expected_source: $("$path" version | grep '^source:')"
      else
        "$path" version | grep -q "^source:  not available for this build (the working tree was modified" || fail "$name: a dirty-tree build must not claim an exact source: $("$path" version | grep '^source:')"
      fi
      ;;
  esac
done
log "bare binaries: CREDITS covers every linked module; native binary embeds the legal texts and reports $expected_source"

# bundles ------------------------------------------------------------------------
for name in "${bundles[@]}"; do
  path="$(asset "$name")"; dir="$work/bundle-$name"; mkdir -p "$dir"
  case "$name" in
    *.zip) unzip -q "$path" -d "$dir" ;;
    *) tar -xzf "$path" -C "$dir" ;;
  esac
  for doc in LICENSE NOTICE CREDITS; do
    [ -f "$dir/$doc" ] || fail "$name lacks $doc"
    test "$(sha "$dir/$doc")" = "$(sha "$doc")" || fail "$name: $doc differs"
  done
  compgen -G "$dir/silo-console*" >/dev/null || fail "$name lacks the executable"
done
log "bundles carry the executable and byte-identical LICENSE, NOTICE and CREDITS"

# packages -------------------------------------------------------------------------
check_tree() { # $1 = extracted root, $2 = label
  for f in usr/share/licenses/silo-console/LICENSE usr/share/licenses/silo-console/NOTICE usr/share/doc/silo-console/CREDITS; do
    [ -f "$1/$f" ] || fail "$2 lacks /$f"
    test "$(sha "$1/$f")" = "$(sha "$(basename "$f")")" || fail "$2: /$f differs from the repository file"
  done
  [ -f "$1/usr/local/bin/silo-console" ] || fail "$2 lacks /usr/local/bin/silo-console"
  [ -f "$1/etc/systemd/system/minio-console.service" ] || fail "$2 lacks the systemd unit"
}
dep5_ok() { # $1 = copyright file
  grep -q '^Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/$' "$1" || fail "copyright: missing DEP-5 Format"
  grep -q '^Upstream-Name: silo-console$' "$1" || fail "copyright: missing Upstream-Name"
  grep -q "^Source: $repository_url\$" "$1" || fail "copyright: missing Source"
  grep -q '^Files: \*$' "$1" || fail "copyright: missing Files: *"
  grep -q '^Copyright: .*MinIO, Inc\.' "$1" || fail "copyright: missing MinIO copyright"
  grep -q '^License: AGPL-3.0-or-later$' "$1" || fail "copyright: missing license identifier"
  # the standalone License stanza must inline the full AGPL text (de-indented == LICENSE)
  awk 'found { print } /^License: AGPL-3.0-or-later$/ { count++; if (count == 2) found = 1 }' "$1" | sed 's/^ //; s/^\.$//' | diff -q - <(sed 's/[[:space:]]*$//' LICENSE) >/dev/null \
    || fail "copyright: the inlined AGPL text differs from LICENSE"
  iconv -f UTF-8 -t UTF-8 "$1" >/dev/null 2>&1 || fail "copyright: not valid UTF-8"
}
for name in "${packages[@]}"; do
  path="$(asset "$name")"; dir="$work/pkg-$name"; mkdir -p "$dir"
  case "$name" in
    *.deb)
      dpkg-deb -x "$path" "$dir"
      check_tree "$dir" "$name"
      test "$(dpkg-deb -f "$path" License)" = "AGPL-3.0-or-later" || fail "$name: License field is '$(dpkg-deb -f "$path" License)'"
      [ -f "$dir/usr/share/doc/silo-console/copyright" ] || fail "$name lacks /usr/share/doc/silo-console/copyright"
      dep5_ok "$dir/usr/share/doc/silo-console/copyright"
      ;;
    *.rpm)
      # RPM payloads use absolute paths. GNU cpio otherwise tries to write to
      # the runner's real /etc and /usr instead of the isolated package root.
      (cd "$dir" && rpm2cpio "$root/$path" | cpio "${cpio_extract_args[@]}")
      check_tree "$dir" "$name"
      test "$(rpm -qp --qf '%{LICENSE}' "$path" 2>/dev/null)" = "AGPL-3.0-or-later" || fail "$name: RPM License tag is '$(rpm -qp --qf '%{LICENSE}' "$path")'"
      ;;
    *.apk)
      tar -xzf "$path" -C "$dir" 2>/dev/null || tar -xf "$path" -C "$dir"
      check_tree "$dir" "$name"
      grep -q '^license = AGPL-3.0-or-later$' "$dir/.PKGINFO" || fail "$name: .PKGINFO license is '$(grep '^license' "$dir/.PKGINFO" || echo missing)'"
      ;;
  esac
done
log "packages: deb (License field, DEP-5 copyright), rpm (%{LICENSE}), apk (.PKGINFO) carry the legal material at the documented paths"

# container images -------------------------------------------------------------------
check_labels() { # $1 = json object of labels/annotations, $2 = label
  jq -e --arg rev "$head_commit" --arg ver "$expected_version" --arg src "$expected_source" --arg repo "$repository_url" '
    .["org.opencontainers.image.revision"] == $rev and
    .["org.opencontainers.image.version"] == $ver and
    .["org.opencontainers.image.licenses"] == "AGPL-3.0-or-later" and
    .["org.opencontainers.image.source"] == $repo and
    .["io.pgsty.silo-console.source"] == $src' <<<"$1" >/dev/null \
    || fail "$2: labels/annotations do not match (revision $head_commit, version $expected_version, source $expected_source): $1"
}
check_filesystem() { # $1 = image ref (pullable/local), $2 = platform, $3 = label
  local cid dir
  dir="$work/img-${3//[^a-zA-Z0-9]/_}"; mkdir -p "$dir"
  cid="$(docker create --platform "$2" "$1" 2>/dev/null)" || fail "$3: docker create failed"
  docker export "$cid" | tar -x -C "$dir" console usr/share/licenses/silo-console 2>/dev/null || { docker rm -f "$cid" >/dev/null; fail "$3: image lacks /console or /usr/share/licenses/silo-console"; }
  docker rm -f "$cid" >/dev/null
  for doc in LICENSE NOTICE CREDITS; do
    test "$(sha "$dir/usr/share/licenses/silo-console/$doc")" = "$(sha "$doc")" || fail "$3: /usr/share/licenses/silo-console/$doc differs"
  done
  if [ "$2" = "linux/$(go env GOARCH)" ] && [ "$(go env GOOS)" = linux ]; then
    test "$(docker run --rm --platform "$2" "$1" credits | sha256sum | cut -d' ' -f1)" = "$credits_sha" || fail "$3: 'credits' output differs"
    if [ "$tree_dirty" -eq 0 ]; then
      docker run --rm --platform "$2" "$1" version | grep -q "^source:  $expected_source" || fail "$3: 'version' does not report $expected_source"
    fi
  fi
}

if [ "$mode" = snapshot ]; then
  mapfile -t images < <(list "Docker Image")
  test "${#images[@]}" -eq "$expected_platforms" || fail "expected $expected_platforms Docker Image records (one snapshot tag, two platforms), found ${#images[@]}: ${images[*]}"
  for ref in "${images[@]}"; do
    case "$ref" in *-amd64) platform="linux/amd64" ;; *-arm64) platform="linux/arm64" ;; *) fail "cannot derive the platform of image $ref" ;; esac
    labels="$(docker image inspect "$ref" --format '{{json .Config.Labels}}')"
    check_labels "$labels" "$ref"
    check_filesystem "$ref" "$platform" "$ref"
  done
  log "images: ${#images[@]} platform images carry exact labels and the legal files"
else
  index_ref="$staging_image:$tag"
  raw="$(docker buildx imagetools inspect "$index_ref" --raw)" || fail "cannot inspect $index_ref"
  index_digest="$(docker buildx imagetools inspect "$index_ref" --format '{{json .Manifest.Digest}}' | tr -d '"')"
  manifests="$(jq -c '[.manifests[] | select(.platform.os == "linux" and (.platform.architecture == "amd64" or .platform.architecture == "arm64"))]' <<<"$raw")"
  test "$(jq 'length' <<<"$manifests")" -eq "$expected_platforms" || fail "$index_ref: expected $expected_platforms platform manifests, got $(jq 'length' <<<"$manifests")"
  jq -e '.annotations? // {} | length > 0' <<<"$raw" >/dev/null && check_labels "$(jq -c '.annotations' <<<"$raw")" "$index_ref annotations" || true
  digests="{}"
  for arch in amd64 arm64; do
    digest="$(jq -r --arg a "$arch" '.[] | select(.platform.architecture == $a) | .digest' <<<"$manifests")"
    [ -n "$digest" ] || fail "$index_ref: no linux/$arch manifest"
    config="$(docker buildx imagetools inspect "$staging_image@$digest" --format '{{json .Image}}')"
    check_labels "$(jq -c '.config.Labels' <<<"$config")" "$index_ref linux/$arch labels"
    docker pull -q --platform "linux/$arch" "$staging_image@$digest" >/dev/null
    check_filesystem "$staging_image@$digest" "linux/$arch" "$index_ref linux/$arch"
    digests="$(jq -c --arg a "$arch" --arg d "$digest" '. + {($a): $d}' <<<"$digests")"
  done
  log "staging image $index_ref ($index_digest): index with 2 platform manifests, exact labels, legal files present"
  assets_json="$(for name in "${archives[@]}" "${packages[@]}" "${checksums[@]}" LICENSE NOTICE CREDITS; do p="$(asset "$name")"; jq -n --arg n "$name" --arg s "$(sha "$p")" --argjson b "$(stat -c %s "$p" 2>/dev/null || stat -f %z "$p")" '{name: $n, sha256: $s, size: $b}'; done | jq -s '.')"
  jq -n --arg tag "$tag" --arg commit "$head_commit" --arg index "$index_digest" --arg image "$staging_image" --argjson platforms "$digests" --argjson assets "$assets_json" \
    '{tag: $tag, commit: $commit, staging_image: $image, index_digest: $index, platform_digests: $platforms, assets: $assets}' > release-verification.json
  log "wrote release-verification.json"
fi

log "OK ($mode)"
