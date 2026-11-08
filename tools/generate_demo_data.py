#!/usr/bin/env python3
"""Generate deterministic fictional fixtures and the standalone HTML prototype."""
import csv
import json
import random
from datetime import date, timedelta
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
REFERENCE = date(2026, 9, 28)
WEIGHTS = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2]
TRANSLIT = dict(zip('0123456789ABCDEFGHJKLMNPRSTUVWXYZ', list(range(10))+[1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9]))
def check_digit(vin):
    r=sum(TRANSLIT[c]*w for c,w in zip(vin,WEIGHTS))%11
    return 'X' if r==10 else str(r)
def make_vin(wmi, serial):
    body=f'{wmi}EV0010TH{serial:06d}'
    return body[:8]+check_digit(body)+body[9:]
def write_json(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
def write_csv(name,fields,rows):
    with (ROOT/'demo'/name).open('w',newline='',encoding='utf-8') as output:
        w=csv.DictWriter(output,fieldnames=fields,extrasaction='ignore',lineterminator='\n');w.writeheader();w.writerows(rows)
def main():
    rng=random.Random(42)
    manufacturers=[
      {'code':'VLT','name':'Voltara','wmi':'LVX','models':[('Voltara V5','BEV',60),('Voltara V7 Long Range','BEV',82)]},
      {'code':'KST','name':'Kestrel Motors','wmi':'WKM','models':[('Kestrel K3','BEV',77),('Kestrel K5 Hybrid','PHEV',19.7)]},
      {'code':'NHV','name':'Nordhavn EV','wmi':'YNH','models':[('Nordhavn N2','BEV',69),('Nordhavn N4','BEV',107)]},
      {'code':'SNL','name':'Sunlei','wmi':'LSN','models':[('Sunlei S1','BEV',45),('Sunlei S3','BEV',72)]}]
    departures=[dict(destinationType=k,minSoc=a,maxSoc=b) for k,a,b in [('Shipping',20,50),('Ferry',20,40),('Truck',30,80),('Rail',30,80),('Dealer',50,80)]]
    profiles=[]
    for id_,fab,name,pt,lo,target,hi,critical,interval,rate,pattern in [
      ('TERMINAL-DEFAULT',None,'Terminal default','BEV',35,50,60,20,7,.15,None),
      ('VLT-BEV','VLT','Voltara BEV','BEV',30,50,60,15,14,.1,None),
      ('VLT-V7','VLT','Voltara V7 Long Range','BEV',30,50,60,15,10,.12,'Voltara V7*'),
      ('KST-BEV','KST','Kestrel BEV','BEV',25,50,70,12,21,.08,None),
      ('KST-PHEV','KST','Kestrel PHEV','PHEV',20,40,60,10,21,.2,None),
      ('NHV-BEV','NHV','Nordhavn BEV','BEV',30,55,60,15,14,.09,None),
      ('SNL-BEV','SNL','Sunlei BEV','BEV',35,50,55,20,7,.25,None)]:
        profiles.append(dict(id=id_,manufacturerCode=fab,name=name,powertrain=pt,minStorageSoc=lo,targetStorageSoc=target,maxChargeSoc=hi,
          criticalSoc=critical,inspectionIntervalDays=interval,twelveVoltIntervalDays=14,defaultDischargePerDay=rate,modelPattern=pattern,
          version=1,effectiveFrom='2026-06-01',departureRules=[{**d,'maxSoc':45} if id_=='NHV-BEV' and d['destinationType']=='Shipping' else dict(d) for d in departures]))
    zones=[dict(code=c,type=t,capacity=n,maxEvs=m) for c,t,n,m in [('A-STD','Standard',2500,0),('B-EV-1','EV',700,520),('B-EV-2','EV',700,520),('C-EV-3','EV',600,480),('D-EV-4','EV',600,500),('L-CHARGE','Charging',60,60),('Q-QUAR','Quarantine',20,20)]]
    chargers=[dict(code=f'L{i}',type='Fixed',powerKw=22,zone='L-CHARGE',connectors=1,status='Faulted' if i==17 else 'Available',occupiedBy=None) for i in range(1,21)]
    chargers += [dict(code=f'M{i}',type='Mobile',powerKw=50,zone=None,connectors=1,status='Available',occupiedBy=None) for i in (1,2)]
    vehicles,inspections,sessions=[],[],[]
    billing={f['code']:{'sessions':0,'kwh':0} for f in manufacturers}
    for i in range(2000):
        f=rng.choices(manufacturers,weights=[40,20,15,25])[0];model,pt,kwh=rng.choice(f['models'])
        candidates=[p for p in profiles if p['manufacturerCode']==f['code'] and p['powertrain']==pt]
        p=next((p for p in candidates if p['modelPattern'] and model.startswith(p['modelPattern'].rstrip('*'))),candidates[0])
        vin=make_vin(f['wmi'],100000+i);arrival=REFERENCE-timedelta(days=rng.randint(30,200));soc=rng.randint(10,70);history=[]
        for j in range(6):
            measured=arrival+(REFERENCE-arrival)*j/5;value=round(min(100,soc+(REFERENCE-measured).days*p['defaultDischargePerDay']),1)
            twelve='Dead' if i%37==0 else 'Weak' if i%19==0 else 'OK'
            measurement=dict(t=measured.isoformat(),soc=value,source='Manual',twelveV=twelve,damage=False,suspected=False,note='',profileId=p['id'],profileVersion=1,actor='seed')
            history.append(measurement);inspections.append({'vin':vin,**measurement})
        if i%7==0:history.pop();inspections.pop()
        last=history[-1];zone='Q-QUAR' if i<12 else 'A-STD' if i<37 else 'C-EV-3' if i<553 else rng.choice(['B-EV-1','B-EV-2','D-EV-4'])
        planned=i%2==0
        vehicles.append(dict(vin=vin,fab=f['code'],brand=f['name'],model=model,powertrain=pt,kwh=kwh,zone=zone,profile=p['id'],arrival=arrival.isoformat(),
          departure=(REFERENCE+timedelta(days=rng.randint(1,45))).isoformat() if planned else None,destination=rng.choice(['Shipping','Ferry','Truck','Rail','Dealer']) if planned else None,
          driveable=last['twelveV']!='Dead',soc=last['soc'],twelveV=last['twelveV'],lastInspection=last['t'],history=history,quarantineRequired=False,
          dossier=dict(reason='Damage reported on arrival',opened=arrival.isoformat(),decision='Open') if zone=='Q-QUAR' else None))
        if i%3==0:
            amount=round(rng.uniform(5,35),1);sessions.append(dict(vin=vin,manufacturerCode=f['code'],charger='L1',start='2026-09-01T08:00:00Z',end='2026-09-01T10:00:00Z',startSoc=20,endSoc=50,kwh=amount,estimatedKwh=True))
            billing[f['code']]['sessions']+=1;billing[f['code']]['kwh']=round(billing[f['code']]['kwh']+amount,1)
    for z in zones:z['count']=sum(v['zone']==z['code'] for v in vehicles)
    data=dict(referenceDate=REFERENCE.isoformat(),profiles=profiles,manufacturers=[dict(code=f['code'],name=f['name']) for f in manufacturers],zones=zones,chargers=chargers,billing=billing,vehicles=vehicles,totalVehicles=len(vehicles),chargingSessions=sessions)
    write_json(ROOT/'demo/application-data.json',data);write_json(ROOT/'demo/rule-profiles.json',dict(manufacturers=manufacturers,profiles=profiles));write_json(ROOT/'demo/zones.json',zones);write_json(ROOT/'demo/chargers.json',chargers)
    write_csv('seed-vehicles.csv',['vin','fab','brand','model','powertrain','kwh','zone','profile','arrival','departure','destination','driveable'],vehicles)
    write_csv('seed-inspections.csv',['vin','t','soc','twelveV','damage','suspected','source','note','profileId','profileVersion','actor'],inspections)
    write_csv('seed-charging-sessions.csv',list(sessions[0]),sessions)
    vessel=[dict(vin=make_vin('LVX',200000+i),brand='Voltara',model='Voltara V5',powertrain='BEV',kwh=60,manufacturerCode='VLT',destination='Truck',departure=(REFERENCE+timedelta(days=20)).isoformat()) for i in range(400)]
    vessel[137]['vin']=vessel[137]['vin'][:9]+'O'+vessel[137]['vin'][10:];vessel[288]['vin']=vessel[288]['vin'][:16]
    write_csv('vessel-voltara-400.csv',list(vessel[0]),vessel)
    preview={**data,'vehicles':vehicles[:37]+vehicles[553:576],'chargingSessions':[]}
    write_json(ROOT/'prototype/sample-data.json',preview)
    template=(ROOT/'prototype/index.template.html').read_text()
    template=template.replace('<link rel="stylesheet" href="app.css">','<style>'+(ROOT/'prototype/app.css').read_text()+'</style>')
    template=template.replace('<script src="app.js" defer></script>','<script>'+(ROOT/'prototype/app.js').read_text()+'</script>')
    (ROOT/'prototype/index.html').write_text(template.replace('__DATA__',json.dumps(preview,separators=(',',':'))))
    print(f'Generated {len(vehicles)} vehicles, {len(inspections)} inspections, {len(sessions)} charging sessions; prototype: {len(preview["vehicles"])} vehicles.')
if __name__=='__main__':main()
