#!/usr/bin/env python3
"""Fail validation when mutable Actions or unlocked test tools reappear."""
from pathlib import Path
import re
errors = []
for path in Path('.github/workflows').glob('*.yaml'):
    source = path.read_text()
    for line in source.splitlines():
        if re.search(r'\buses:', line) and not re.search(r'@[a-f0-9]{40}\s+#\s+v\d', line):
            errors.append(f'{path}: Action must use a full SHA with version comment: {line.strip()}')
    for pattern in (r'\byarn add\b', r'\bnpm install\b', r'\bnpx testcafe\b', r'pip3? install semgrep'):
        if re.search(pattern, source):
            errors.append(f'{path}: unlocked runtime dependency: {pattern}')
if errors:
    raise SystemExit('\n'.join(errors))
print('CI dependency contract passed')
