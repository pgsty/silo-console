#!/usr/bin/env bash
# Install the reviewed browser in a runner-owned directory, never from "latest"
# or the runner image's unversioned system browser.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source-path=SCRIPTDIR
# shellcheck source=../.github/requirements/firefox.env
source "$root/.github/requirements/firefox.env"
: "${RUNNER_TEMP:?GitHub runner temporary directory is required}"
: "${GITHUB_PATH:?GitHub runner path file is required}"
install_dir="$(mktemp -d "$RUNNER_TEMP/firefox.XXXXXX")"
archive="$install_dir/firefox.tar.xz"
curl --fail --location --retry 3 --connect-timeout 20 --max-time 180 \
  "https://archive.mozilla.org/pub/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.xz" \
  --output "$archive"
printf '%s  %s\n' "$FIREFOX_SHA512" "$archive" | sha512sum --check --strict
tar -xf "$archive" -C "$install_dir"
rm "$archive"
"$install_dir/firefox/firefox" --version
echo "$install_dir/firefox" >> "$GITHUB_PATH"
