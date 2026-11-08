#!/usr/bin/env python3
"""Build the isolated public showcase; publish only _site/, never the checkout."""
import json
import shutil
import subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / '_site'

def main():
    (OUT / 'assets').mkdir(parents=True, exist_ok=True)
    (OUT / 'demo').mkdir(parents=True, exist_ok=True)
    version = (ROOT / 'VERSION').read_text().strip()
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    metadata = f'<meta name="voltyard-version" content="{version}"><meta name="voltyard-source" content="{commit}">'
    home = (ROOT / 'showcase/index.html').read_text().replace('</head>', metadata + '</head>')
    (OUT / 'index.html').write_text(home)
    for path in (ROOT / 'showcase/assets').iterdir():
        if path.is_file():
            shutil.copy2(path, OUT / 'assets' / path.name)
    for name in ('app.js', 'app.css'):
        shutil.copy2(ROOT / 'prototype' / name, OUT / 'demo' / name)
    shutil.copy2(ROOT / 'showcase/sandbox.js', OUT / 'demo/sandbox.js')
    data = json.loads((ROOT / 'demo/application-data.json').read_text())
    data.update(orders={}, audit=[], profileHistory=[], revision=0)
    template = (ROOT / 'prototype/index.template.html').read_text()
    template = template.replace('<html lang="en">', '<html lang="en" data-edition="public">')
    template = template.replace('VoltYard · EV Yard Operations', 'VoltYard · Interactive public demo')
    template = template.replace('Development edition', 'Public sandbox')
    template = template.replace('</head>', metadata + '<meta name="robots" content="noindex"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/sandbox.css"></head>')
    template = template.replace('__DATA__', json.dumps(data, separators=(',', ':')).replace('<', '\\u003c'))
    template = template.replace('</body>', '<script src="sandbox.js" defer></script></body>')
    # Asset URLs change with the exact source revision, avoiding mixed-version browser caches.
    for name in ('app.js', 'app.css', 'sandbox.js'):
        template = template.replace(f'"{name}"', f'"{name}?v={commit}"')
    (OUT / 'demo/index.html').write_text(template)
    shutil.copy2(ROOT / 'demo/vessel-voltara-400.csv', OUT / 'demo/sample-manifest.csv')
    (OUT / 'build-info.json').write_text(json.dumps({'version': version, 'commit': commit}, indent=2) + '\n')
    (OUT / '.nojekyll').write_text('')
    (OUT / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://phlppgdfry.github.io/VoltYard/sitemap.xml\n')
    (OUT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://phlppgdfry.github.io/VoltYard/</loc></url></urlset>\n')
    (OUT / '404.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · VoltYard</title><style>body{font:18px/1.6 system-ui;max-width:620px;margin:15vh auto;padding:24px;color:#142f3a}a{color:#164e63}</style><h1>This page is outside the yard.</h1><p>Return to the case study or open the interactive demo.</p><a href="/VoltYard/">VoltYard case study</a> · <a href="/VoltYard/demo/">Open demo</a></html>''')
    print(f'Built VoltYard {version}, source {commit[:7]}, {len(data["vehicles"]):,} fictional vehicles.')

if __name__ == '__main__':
    main()
