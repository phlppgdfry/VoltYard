#!/usr/bin/env python3
"""Small release guard for tracked secret files and recognised credential patterns.
This does not replace a full secret-history scan or penetration test.
"""
import re
import subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
paths=subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0')
errors=[]
pattern=re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,}|AKIA[A-Z0-9]{16}|sk-proj-[A-Za-z0-9_-]{40,}')
for name in filter(None,paths):
    path=root/name
    if not path.is_file():continue
    if path.name=='.env' or (path.name.startswith('.env.') and path.name!='.env.example') or name.startswith('var/'):
        errors.append(name+': runtime or environment file is tracked')
    if pattern.search(path.read_bytes()):errors.append(name+': recognised secret material')
if errors:raise SystemExit('\n'.join(errors))
print('PASS: tracked runtime/environment exclusions and recognised secret patterns (current tree only).')
