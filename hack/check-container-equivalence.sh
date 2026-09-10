#!/usr/bin/env bash
# Run after the snapshot artifact verifier with an amd64-capable Docker builder.
set -euo pipefail
work="$(mktemp -d)"
image="silo-console-equivalence:$(git rev-parse --short HEAD)"
container=""
cleanup() {
  if [ -n "$container" ]; then docker rm -f "$container" >/dev/null; fi
  docker image rm "$image" >/dev/null 2>&1 || true
  rm -rf "$work"
}
trap cleanup EXIT
commit="$(git rev-parse HEAD)"
tag="$(jq -r .tag dist/metadata.json)"
version="$(jq -r .version dist/metadata.json)"
short="$(git show --format=%h HEAD --quiet)"
time="$(TZ=UTC git show -s --format=%cd --date=format-local:%Y-%m-%dT%H:%M:%SZ HEAD)"
epoch="$(git show -s --format=%ct HEAD)"
docker buildx build --load --platform linux/amd64 -t "$image" \
  --build-arg "build_version=$tag" --build-arg "build_release_version=$version" \
  --build-arg "build_commit=$commit" --build-arg "build_short_commit=$short" \
  --build-arg "build_time=$time" --build-arg "SOURCE_DATE_EPOCH=$epoch" .
container="$(docker create "$image")"
docker cp "$container:/console" "$work/console"
chmod +x "$work/console"
release_binary="$(jq -r 'first(.[] | select(.type == "Binary" and .goos == "linux" and .goarch == "amd64") | .path)' dist/artifacts.json)"
[ -n "$release_binary" ]
diff -u <(docker run --rm --platform linux/amd64 --entrypoint /release-console \
  -v "$PWD/$release_binary:/release-console:ro" "$image" --version) \
  <(docker run --rm --platform linux/amd64 "$image" --version)
docker buildx build --platform linux/amd64 --target web-assets --output "type=local,dest=$work/assets" .
diff -r web-app/build "$work/assets/build"
echo "Source image and release binary/assets agree for $commit"
