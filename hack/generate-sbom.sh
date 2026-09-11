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
# Syft can assign different internal IDs to the same emitted npm package
# between scans. Derive IDs from all published package fields, update their
# references, and order the graph without dropping any distinct package data.
canonical = lambda value: json.dumps(value, sort_keys=True, separators=(',', ':'))
identifiers, packages = {}, {}
for package in data.get('packages', []):
    record = {key: value for key, value in package.items() if key != 'SPDXID'}
    identifier = 'SPDXRef-Package-' + hashlib.sha256(canonical(record).encode()).hexdigest()
    identifiers[package['SPDXID']] = identifier
    packages[identifier] = {**record, 'SPDXID': identifier}
data['packages'] = [packages[key] for key in sorted(packages)]
relationships = {}
for relationship in data.get('relationships', []):
    for key in ('spdxElementId', 'relatedSpdxElement'):
        relationship[key] = identifiers.get(relationship[key], relationship[key])
    relationships[canonical(relationship)] = relationship
data['relationships'] = [relationships[key] for key in sorted(relationships)]
if 'documentDescribes' in data:
    data['documentDescribes'] = sorted({identifiers.get(value, value) for value in data['documentDescribes']})
path.write_text(json.dumps(data, sort_keys=True, separators=(',', ':')) + '\n')
PY
