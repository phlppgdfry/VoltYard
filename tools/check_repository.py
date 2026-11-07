#!/usr/bin/env python3
"""Check local documentation, fixture integrity and generated preview consistency."""
import csv
import json
import re
import sys
from pathlib import Path
from generate_demo_data import check_digit
ROOT=Path(__file__).resolve().parent.parent
errors=[]
def check(condition,message):
    if not condition:errors.append(message)
def valid(vin):
    return len(vin)==17 and bool(re.fullmatch('[A-HJ-NPR-Z0-9]+',vin)) and check_digit(vin)==vin[8]
for path in ROOT.rglob('*.md'):
    if any(part in {'.git','obj','bin','node_modules'} for part in path.parts):continue
    text=path.read_text()
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',text):
        target=target.split('#')[0].strip('<>')
        if not target or re.match(r'[a-zA-Z]+:',target):continue
        check((path.parent/target).exists(),f'{path.relative_to(ROOT)}: missing link {target}')
    check(not re.search(r'\b(Nederlands|laadtoestand|voertuigen|fabrikanten|regelprofielen|Uitvoer|afspraken)\b',text,re.I),f'{path.relative_to(ROOT)}: untranslated language marker')
for directory in ('demo','prototype'):
    for path in (ROOT/directory).glob('*.json'):
        try:json.loads(path.read_text())
        except ValueError as error:errors.append(f'{path.name}: {error}')
data=json.loads((ROOT/'demo/application-data.json').read_text())
vehicles=data['vehicles'];profiles={p['id']:p for p in data['profiles']}
check(len(vehicles)==2000,'Expected 2,000 seed vehicles')
check(len({v['vin'] for v in vehicles})==len(vehicles),'Duplicate seed VIN')
check(all(valid(v['vin']) for v in vehicles),'Invalid seed VIN')
check(sum(len(v['history']) for v in vehicles)==11714,'Inspection count drift')
check(len(data['chargingSessions'])==667,'Charging session count drift')
for v in vehicles:
    p=profiles[v['profile']]
    check(p['manufacturerCode']==v['fab'] and p['powertrain']==v['powertrain'],f'Profile mismatch: {v["vin"]}')
    check(v['history'][-1]['soc']==v['soc'],f'Latest observation mismatch: {v["vin"]}')
    if v['model']=='Voltara V7 Long Range':check(p['id']=='VLT-V7','Model precedence mismatch')
for z in data['zones']:check(z['count']==sum(v['zone']==z['code'] for v in vehicles),f'Zone count mismatch: {z["code"]}')
check(next(z['count'] for z in data['zones'] if z['code']=='C-EV-3')==516,'Missing density scenario')
with (ROOT/'demo/vessel-voltara-400.csv').open() as f:
    rows=list(csv.DictReader(f))
check(len(rows)==400,'Vessel row count')
check([i+2 for i,row in enumerate(rows) if not valid(row['vin'])]==[139,290],'Invalid manifest line numbers drift')
preview=json.loads((ROOT/'prototype/sample-data.json').read_text())
check(len(preview['vehicles'])==60,'Preview vehicle count')
template=(ROOT/'prototype/index.template.html').read_text()
expected=template.replace('__DATA__',json.dumps(preview,separators=(',',':')))
check((ROOT/'prototype/index.html').read_text()==expected,'Generated preview is stale; regenerate fixtures')
check('<html lang="en">' in template,'UI language must be English')
check(template.count('__DATA__')==1,'Expected one data injection placeholder')
if errors:
    print('\n'.join(errors),file=sys.stderr);sys.exit(1)
print('PASS: documentation links, English markers, JSON, VINs, fixture counts, profiles, zones and generated preview.')
