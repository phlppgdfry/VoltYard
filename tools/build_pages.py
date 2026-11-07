#!/usr/bin/env python3
"""Build a self-contained, fictional-data GitHub Pages showcase in _site/."""
import json
import shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'_site'

def main():
    (OUT/'assets').mkdir(parents=True,exist_ok=True)
    (OUT/'demo').mkdir(parents=True,exist_ok=True)
    shutil.copy2(ROOT/'showcase/index.html',OUT/'index.html')
    for path in (ROOT/'showcase/assets').iterdir():
        if path.is_file():shutil.copy2(path,OUT/'assets'/path.name)
    data=json.loads((ROOT/'demo/application-data.json').read_text())
    data['orders']={};data['audit']=[];data['profileHistory']=[];data['revision']=0
    template=(ROOT/'prototype/index.template.html').read_text()
    template=template.replace('<html lang="en">','<html lang="en" data-edition="public">')
    template=template.replace('<title>VoltYard · EV Yard Operations</title>','<title>VoltYard · Interactive public demo</title><meta name="robots" content="noindex"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">')
    template=template.replace('Development edition','Public sandbox')
    template=template.replace("offline?'60-vehicle preview · ':'Live yard · '","offline?'Public sandbox · ':'Live yard · '")
    template=template.replace('offline?D.totalVehicles:active().length','active().length')
    template=template.replace("offline?' in the preview sample':''","offline?' in this zone':''")
    template=template.replace("if(offline)throw new Error('Start the .NET application to import a manifest.');",'')
    template=template.replace('chargingSessions:[],audit:[],alerts:evaluate(vehicle(vin))','chargingSessions:D.chargingSessions.filter(s=>s.vin===vin),audit:D.audit.filter(a=>a.subject===vin),alerts:evaluate(vehicle(vin))')
    public_css='''<style>
.panel code{overflow-wrap:anywhere}.public-bar{position:sticky;top:0;z-index:40;min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:10px 24px;background:var(--surface);border-bottom:1px solid var(--line);font-size:12px}.public-back{color:var(--accent);font-size:17px;font-weight:700;text-decoration:none;white-space:nowrap}.public-back span{font-size:12px;font-weight:500}.public-note{color:var(--muted)}.public-bar>div{display:flex;gap:8px}.rail{top:62px;height:calc(100vh - 62px)}.tour-card{display:flex;gap:24px;justify-content:space-between;align-items:center;border:1px solid var(--accent);border-left:5px solid var(--marking);padding:18px 20px;background:var(--accent-soft);border-radius:8px}.tour-card h2{margin:4px 0 7px}.tour-card p{font-size:13px;max-width:85ch;margin:0}.tour-step{font-size:11px;color:var(--muted)}.tour-actions{display:flex;flex-wrap:wrap;gap:8px;flex-shrink:0;max-width:330px}.public-bar .btn{min-height:38px}
@media(max-width:860px){.rail{top:62px;height:auto}.public-note{display:none}.tour-card{flex-direction:column;align-items:start}.tour-actions{max-width:none}}
@media(max-width:520px){.public-bar{padding:10px 12px;gap:10px}.public-back{font-size:15px}.public-back span{display:none}.public-bar .btn{font-size:11px;padding:7px 10px}.public-bar>div{gap:6px}.tour-card{padding:14px;gap:14px}}
@media print{.public-bar,.tour-card{display:none!important}}
</style>'''
    template=template.replace('</head>',public_css+'</head>')
    # Escape script delimiters even though seed content is controlled fictional data.
    embedded=json.dumps(data,separators=(',',':')).replace('</','<\\/')
    template=template.replace('__DATA__',embedded)
    template=template.replace('</body>','<script src="sandbox.js"></script></body>')
    (OUT/'demo/index.html').write_text(template)
    shutil.copy2(ROOT/'showcase/sandbox.js',OUT/'demo/sandbox.js')
    shutil.copy2(ROOT/'demo/vessel-voltara-400.csv',OUT/'demo/sample-manifest.csv')
    (OUT/'.nojekyll').write_text('')
    (OUT/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://phlppgdfry.github.io/VoltYard/sitemap.xml\n')
    (OUT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://phlppgdfry.github.io/VoltYard/</loc></url></urlset>\n')
    (OUT/'404.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · VoltYard</title><style>body{font:18px/1.6 system-ui;max-width:620px;margin:15vh auto;padding:24px;color:#142f3a}a{color:#164e63}</style><h1>This page is outside the yard.</h1><p>Return to the case study or open the interactive demo.</p><a href="/VoltYard/">VoltYard case study</a> · <a href="/VoltYard/demo/">Open demo</a></html>''')
    print(f'Built public showcase and {len(data["vehicles"]):,}-vehicle browser sandbox in {OUT}')
if __name__=='__main__':main()
