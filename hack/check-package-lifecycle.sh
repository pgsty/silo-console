#!/usr/bin/env bash
# Linux CI driver. All installation and forced-stop tests run in disposable
# containers; only package files and the test script are copied into them.
set -euo pipefail
repo="$(git rev-parse --show-toplevel)"
work="$(mktemp -d)"
container=""
cleanup() {
  if [ -n "$container" ]; then docker rm -f "$container" >/dev/null; fi
  rm -rf "$work"
}
trap cleanup EXIT
architecture="${PACKAGE_TEST_ARCH:-amd64}"
baseline=v2.4.0
gh release download "$baseline" --repo pgsty/silo-console --dir "$work" \
  --pattern "*_linux_${architecture}.deb" --pattern "*_linux_${architecture}.rpm" \
  --pattern "*_linux_${architecture}.apk" --pattern '*_checksums.txt'
(cd "$work" && sha256sum --check --ignore-missing ./*_checksums.txt)
for family in deb rpm apk; do
  image="console-package-test:$family"
  docker build -t "$image" -f ".github/packaging/Dockerfile.$family" .github/packaging
  container="$(docker run -d --privileged --cgroupns=host --tmpfs /run --tmpfs /tmp "$image")"
  package="$(jq -r --arg family "$family" --arg arch "$architecture" '.[] | select(.type == "Linux Package" and .goarch == $arch and (.path | endswith("." + $family))) | .path' dist/artifacts.json)"
  test -n "$package"
  docker exec "$container" mkdir -p /opt/package-test
  docker cp "$package" "$container:/opt/package-test/current.$family"
  docker cp "$work/silo-console_2.4.0_linux_${architecture}.$family" "$container:/opt/package-test/previous.$family"
  docker cp "$repo/hack/test-package-lifecycle.sh" "$container:/opt/package-test/check-package.sh"
  if [ "$family" != apk ]; then
    for _ in $(seq 1 30); do
      if docker exec "$container" systemctl show-environment >/dev/null 2>&1; then break; fi
      sleep 1
    done
  fi
  docker exec "$container" bash /opt/package-test/check-package.sh "/opt/package-test/current.$family" "/opt/package-test/previous.$family"
  docker rm -f "$container" >/dev/null
  container=""
done
