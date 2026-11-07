#!/usr/bin/env python3
"""Verify the Pages artifact contains the complete static experience."""
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent/'_site'
class Links(HTMLParser):
    def __init__(self):super().__init__();self.links=[]
    def handle_starttag(self,tag,attrs):
        for name,value in attrs:
            if name in ('src','href') and value:self.links.append(value)
for path in ROOT.rglob('*.html'):
    parser=Links();parser.feed(path.read_text())
    for url in parser.links:
        if url.startswith(('http:','https:','mailto:','data:','#','/')):continue
        target=url.split('#')[0].split('?')[0]
        if not target:continue
        assert (path.parent/target).exists(),f'{path.name}: missing {url}'
    assert '<html lang="en"' in path.read_text(),f'{path}: missing language'
page=(ROOT/'demo/index.html').read_text()
assert '__DATA__' not in page
assert 'data-edition="public"' in page
assert 'Start the .NET application to import a manifest.' not in page
assert '60-vehicle preview' not in page
assert '<script src="sandbox.js"></script>' in page
assert (ROOT/'assets/dashboard.png').stat().st_size>10000
assert not any((ROOT/p).exists() for p in ('var','.git','.env','src'))
print('PASS: Pages artifact, local links, public sandbox, screenshot, English metadata and deployment boundaries.')
