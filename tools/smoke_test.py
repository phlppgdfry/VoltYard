#!/usr/bin/env python3
"""Exercise real HTTP commands against a DISPOSABLE VoltYard store."""
import argparse
import http.cookiejar
import json
import os
import urllib.error
import urllib.request
from pathlib import Path
from generate_demo_data import make_vin
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--url',default='http://127.0.0.1:5080')
args=parser.parse_args();base=args.url.rstrip('/');checks=0

def client():return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
def request(opener,path,body=None,status=200):
    global checks
    headers={'X-VoltYard-Client':'web','Content-Type':'application/json'}
    req=urllib.request.Request(base+path,headers=headers,data=json.dumps(body).encode() if body is not None else None)
    try:
        with opener.open(req,timeout=20) as r:actual=r.status;raw=r.read()
    except urllib.error.HTTPError as r:actual=r.code;raw=r.read()
    assert actual==status,f'{path}: expected {status}, got {actual}: {raw[:300]}'
    checks+=1
    return json.loads(raw) if raw else None

def login(user):
    c=client();request(c,'/api/login',{'user':user,'password':os.environ.get('VOLTYARD_TEST_PASSWORD','VoltYard-demo-2026')});return c

def state(c):return request(c,'/api/state')['data']
def command(c,action,body=None,status=200):
    d=state(c);return request(c,'/api/commands/'+action,{'revision':d['revision'],**(body or {})},status)

anonymous=client();request(anonymous,'/api/state',status=401)
# Exercise the published UI assets and request-binding error boundary, not just domain commands.
for asset,mime in (('/','text/html'),('/app.js','text/javascript'),('/app.css','text/css')):
    with anonymous.open(base+asset) as response:
        assert mime in response.headers['Content-Type']
        assert "script-src 'self'" in response.headers['Content-Security-Policy']
        assert response.read()
    checks+=1
malformed=urllib.request.Request(base+'/api/login',data=b'{invalid',headers={'Content-Type':'application/json','X-VoltYard-Client':'web'})
try:anonymous.open(malformed);raise AssertionError('Malformed JSON accepted')
except urllib.error.HTTPError as response:
    problem=json.loads(response.read());assert response.code==400 and problem['title']=='Invalid HTTP request.'
    assert 'stack' not in json.dumps(problem).lower()
checks+=1
admin=login('admin');d=state(admin)
assert len(d['vehicles'])==2000,'Use a fresh disposable seed for this test.'
assert sum(z['count'] for z in d['zones'])==2000
v=next(v for v in d['vehicles'] if v['zone'] not in ('Q-QUAR','A-STD') and v['soc']<40 and v['twelveV']=='OK')
vin=v['vin'];initial=len(v['history']);revision=d['revision']
request(admin,'/api/commands/inspect',{'revision':revision,'vin':vin,'soc':-1},400)
request(admin,'/api/commands/inspect',{'revision':revision,'vin':vin,'twelveV':'OK','confirm':True},400)
request(admin,'/api/commands/inspect',{'revision':revision,'vin':vin,'soc':40},400)
assert state(admin)['revision']==revision
command(admin,'inspect',{'vin':vin,'soc':18,'twelveV':'Weak','confirm':True,'note':'HTTP smoke inspection'})
request(admin,'/api/commands/inspect',{'revision':revision,'vin':vin,'soc':40},409)
current=next(v for v in state(admin)['vehicles'] if v['vin']==vin)
assert len(current['history'])==initial+1 and current['history'][-1]['actor']=='admin'
command(admin,'charge-start',{'vin':vin},409)
command(admin,'charge-approve',{'vin':vin})
command(admin,'charge-start',{'vin':vin})
command(admin,'charge-start',{'vin':vin},409)
command(admin,'move',{'vin':vin,'zone':'B-EV-2'},409)
command(admin,'inspect',{'vin':vin,'soc':40,'twelveV':'OK'},409)
command(admin,'charge-stop',{'vin':vin,'soc':40,'kwh':15.3})
command(admin,'charge-stop',{'vin':vin,'soc':40},409)
after=state(admin);session=after['chargingSessions'][-1]
assert session['kwh']==15.3 and not session['estimatedKwh']
assert not any(l['occupiedBy']==vin for l in after['chargers'])
operator=login('operator')
command(operator,'profile',{'profile':d['profiles'][0]},403)
command(operator,'inspect',{'vin':vin,'soc':40,'twelveV':'OK','suspected':True})
command(admin,'charge-approve',{'vin':vin},409)
command(operator,'move',{'vin':vin,'zone':'Q-QUAR'})
command(operator,'move',{'vin':vin,'zone':'B-EV-1'},409)
command(operator,'decide',{'vin':vin,'decision':'Released','justification':'Reviewed by smoke test'},403)
hse=login('hse')
command(hse,'decide',{'vin':vin,'decision':'Released','justification':'short'},400)
# B-EV-1 has room in a fresh fixture for this release.
command(hse,'decide',{'vin':vin,'decision':'Released','justification':'Fictional test concern reviewed and cleared'})
command(operator,'move',{'vin':vin,'zone':'Q-QUAR'})
command(operator,'move',{'vin':vin,'zone':'B-EV-1'},409)
command(hse,'decide',{'vin':vin,'decision':'Released','justification':'Second fictional concern reviewed independently'})
profile=next(p for p in state(admin)['profiles'] if p['id']=='VLT-BEV');old=profile['version'];profile['minStorageSoc']=profile['targetStorageSoc']+1
command(admin,'profile',{'profile':profile},400)
profile['minStorageSoc']=30;command(admin,'profile',{'profile':profile})
after=state(admin);assert next(p for p in after['profiles'] if p['id']=='VLT-BEV')['version']==old+1
manifest='vin,brand,model,powertrain,kwh,manufacturerCode\n'+make_vin('LVX',900001)+',"Voltara, Demo",Voltara V5,BEV,60,VLT\nINVALID,Voltara,Voltara V5,BEV,60,VLT\n'
result=command(admin,'import',{'csv':manifest});assert result['accepted']==1 and result['rejected']==1 and result['errors'][0]['line']==3
result=command(admin,'import',{'csv':manifest});assert result['accepted']==0 and result['rejected']==2
arrival_vin=make_vin('LVX',900001)
snapshot=request(admin,'/api/state')
assert [a['code'] for a in snapshot['alerts'][arrival_vin]]==['INSPECTION_REQUIRED']
command(admin,'charge-approve',{'vin':arrival_vin},409)
report=request(admin,'/api/reports/'+vin);assert report['vehicle']['vin']==vin and report['audit'] and report['id']
# Origin rejection is independent of role and revision.
req=urllib.request.Request(base+'/api/commands/inspect',data=b'{}',headers={'Content-Type':'application/json','X-VoltYard-Client':'web','Origin':'https://untrusted.example'})
try:admin.open(req);raise AssertionError('Cross-origin write was allowed')
except urllib.error.HTTPError as e:assert e.code==403;checks+=1
account=login('account');command(account,'inspect',{'vin':vin,'soc':40},403)
print(f'PASS: {checks} HTTP assertions; auth, roles, validation, append-only observations, stale writes, charging, quarantine, profiles, CSV, reports and origin protection.')
