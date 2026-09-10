#!/usr/bin/env bash
# GoReleaser calls this for each binary/package before constructing checksums.
set -euo pipefail
artifact="$1" output="$2"
syft scan "file:$artifact" -o "spdx-json=$output" --quiet
python3 - "$artifact" "$output" "$(git show -s --format=%ct HEAD)" <<'PY'
import datetime, hashlib, json, pathlib, sys
artifact, output, epoch = sys.argv[1:]
path = pathlib.Path(output)
data = json.loads(path.read_text())
digest = hashlib.sha256(pathlib.Path(artifact).read_bytes()).hexdigest()
data['creationInfo']['created'] = datetime.datetime.fromtimestamp(int(epoch), datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
data['documentNamespace'] = 'https://github.com/pgsty/silo-console/sbom/' + digest
path.write_text(json.dumps(data, sort_keys=True, separators=(',', ':')) + '\n')
PY
