/* Public, fictional-data adapter. No HTTP writes or external services. */
(() => {
  'use strict';
  const key='voltyard-public-v1';
  const initial=structuredClone(EMBEDDED);
  const requestedZone=new URLSearchParams(location.search).get('zone');
  if(initial.zones.some(z=>z.code===requestedZone))zoneId=requestedZone;
  let tourIndex=new URLSearchParams(location.search).has('tour')?0:null;
  const tourVin=initial.vehicles.find(v=>v.zone==='C-EV-3'&&v.soc<20&&v.twelveV==='OK').vin;
  const steps=[
    ['Read the yard','Start with the exceptions. The dashboard brings battery alerts, overdue inspections and zone capacity into one view. All 2,000 vehicles are fictional.','dashboard'],
    ['Record an observation','This vehicle needs attention. Enter a new SOC and 12V observation, then save. Its profile immediately determines the next action.','field'],
    ['Coordinate charging','Approve a task, start a session on an available charger, then stop with observed SOC and metered or estimated kWh.','charging'],
    ['Make the rules visible','Change a storage threshold to see its impact before saving a new profile version. Earlier inspections retain their original version.','rules'],
    ['Keep safety decisions explicit','A concern requires isolation and a reasoned HSE decision. Try releasing a case with a short justification to see validation.','safety'],
    ['Leave an evidence trail','Open the handover report to review inspections, charging records, current alerts and audit events. Print or save the report as PDF.','detail']
  ];
  try {const saved=JSON.parse(sessionStorage.getItem(key));if(saved?.vehicles?.length&&saved.sandboxVersion===1)D=saved;}catch{}
  D.orders??={};D.audit??=[];D.profileHistory??=[];D.chargingSessions??=[];
  const originalRender=render;
  render=()=>{
    originalRender();
    document.getElementById('session').textContent='Public sandbox. Changes stay in this browser tab.';
    if(tourIndex!==null){const [title,body]=steps[tourIndex];document.getElementById('app').insertAdjacentHTML('afterbegin',`<section class="tour-card" aria-label="Guided walkthrough"><div><span class="tour-step">Walkthrough ${tourIndex+1} / ${steps.length}</span><h2>${title}</h2><p>${body}</p></div><div class="tour-actions"><button class="btn" data-sandbox="tour-close">Explore freely</button>${tourIndex?'<button class="btn" data-sandbox="tour-back">Back</button>':''}<button class="btn primary" data-sandbox="tour-next">${tourIndex===steps.length-1?'Finish tour':'Next step'}</button></div></section>`);}
  };
  function viewStep(){
    page=steps[tourIndex][2];
    if(page==='field')mobileVin=tourVin;
    if(page==='detail')selected=tourVin;
    location.hash=page;render();window.scrollTo(0,0);
  }
  function save(){try{D.sandboxVersion=1;sessionStorage.setItem(key,JSON.stringify(D));}catch{toast('Your browser could not save this tab. You can keep exploring; reloading will reset changes.');}}
  const fail=message=>{throw new Error(message);};
  const allowed12=['OK','Weak','Dead'];
  function safe(v){if(!v.history.length)fail('Record an arrival inspection first.');if(v.zone==='Q-QUAR'||v.quarantineRequired)fail('This vehicle requires HSE review before charging or departure.');}
  function validateProfile(p){
    if(!p||![p.criticalSoc,p.minStorageSoc,p.targetStorageSoc,p.maxChargeSoc,p.defaultDischargePerDay].every(Number.isFinite)||
      !(0<=p.criticalSoc&&p.criticalSoc<=p.minStorageSoc&&p.minStorageSoc<=p.targetStorageSoc&&p.targetStorageSoc<=p.maxChargeSoc&&p.maxChargeSoc<=100)||
      !Number.isInteger(p.inspectionIntervalDays)||p.inspectionIntervalDays<1||p.inspectionIntervalDays>365)fail('Use 0 ≤ critical ≤ minimum ≤ target ≤ maximum ≤ 100 and an inspection interval of 1–365 days.');
  }
  function validVin(vin){
    if(!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin))return false;
    const chars='0123456789ABCDEFGHJKLMNPRSTUVWXYZ',values=[0,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,1,2,3,4,5,7,9,2,3,4,5,6,7,8,9],weights=[8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
    const n=[...vin].reduce((sum,c,i)=>sum+values[chars.indexOf(c)]*weights[i],0)%11;
    return vin[8]===(n===10?'X':String(n));
  }
  function parseCsv(text){
    const rows=[];let row=[],field='',quoted=false,closed=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
      if(c==='"'){if(field||closed)fail('Malformed CSV quoting.');quoted=true;}
      else if(c===','||c==='\n'||c==='\r'){row.push(field);field='';closed=false;if(c!==','){if(c==='\r'&&text[i+1]==='\n')i++;if(row.some(x=>x.length))rows.push(row);row=[];}}
      else{if(closed&&!/\s/.test(c))fail('Malformed CSV quoting.');if(!closed)field+=c;}
    }
    if(quoted)fail('Unclosed quoted CSV field.');if(field||row.length){row.push(field);rows.push(row);}return rows;
  }
  function importCsv(text){
    if(typeof text!=='string'||text.length>2000000)fail('Use a CSV smaller than 2 MB.');
    const rows=parseCsv(text.replace(/^\uFEFF/,'')),header=rows.shift()||[],required=['vin','brand','model','powertrain','kwh','manufacturerCode'];
    if(required.some(k=>!header.includes(k))||new Set(header).size!==header.length)fail('Required unique columns: '+required.join(', '));
    if(rows.length>10000)fail('Maximum 10,000 rows per import.');
    let accepted=0;const errors=[],known=new Set(D.vehicles.map(v=>v.vin));
    rows.forEach((cells,i)=>{
      const r=Object.fromEntries(header.map((k,j)=>[k,(cells[j]||'').trim()])),vin=r.vin.toUpperCase(),zone=D.zones.find(z=>z.code==='B-EV-1');let error='';
      if(cells.length!==header.length)error='Column count does not match the header.';
      else if(!validVin(vin))error='Invalid VIN format or check digit.';
      else if(known.has(vin))error='VIN already exists.';
      else if(!['BEV','PHEV'].includes(r.powertrain))error='Powertrain must be BEV or PHEV.';
      else if(!r.brand||!r.model||r.brand.length>100||r.model.length>100)error='Brand and model are required, at most 100 characters.';
      else if(!Number.isFinite(+r.kwh)||+r.kwh<=0||+r.kwh>300)error='Invalid battery capacity.';
      else if(!D.manufacturers.some(f=>f.code===r.manufacturerCode))error='Unknown manufacturer code.';
      else if(count(zone.code)>=Math.min(zone.capacity,zone.maxEvs))error='Arrival zone is full.';
      else if(r.departure&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.departure)||!Number.isFinite(day(r.departure))||!['Shipping','Ferry','Truck','Rail','Dealer'].includes(r.destination)))error='Invalid departure date or destination.';
      if(error){errors.push({line:i+2,vin,error});return;}
      const candidates=D.profiles.filter(p=>p.manufacturerCode===r.manufacturerCode&&p.powertrain===r.powertrain);
      const p=candidates.filter(p=>p.modelPattern&&r.model.startsWith(p.modelPattern.replace(/\*$/,''))).sort((a,b)=>b.modelPattern.length-a.modelPattern.length)[0]||candidates.find(p=>!p.modelPattern)||D.profiles.find(p=>p.id==='TERMINAL-DEFAULT');
      D.vehicles.push({vin,fab:r.manufacturerCode,brand:r.brand,model:r.model,powertrain:r.powertrain,kwh:+r.kwh,zone:zone.code,profile:p.id,arrival:today(),departure:r.departure||null,destination:r.destination||null,driveable:true,soc:0,twelveV:'OK',lastInspection:'2020-01-01',history:[],quarantineRequired:false,dossier:null});
      zone.count++;known.add(vin);accepted++;
    });D.totalVehicles=D.vehicles.length;return {accepted,rejected:errors.length,errors};
  }
  function apply(action,c){
    if(action==='import')return importCsv(c.csv);
    if(action==='profile'){
      validateProfile(c.profile);const i=D.profiles.findIndex(p=>p.id===c.profile.id);if(i<0)fail('Profile not found.');const old=D.profiles[i];
      D.profileHistory.push(structuredClone(old));D.profiles[i]={...old,...c.profile,version:old.version+1,effectiveFrom:today()};return {message:'New profile version saved.'};
    }
    const v=vehicle(c.vin);if(!v)fail('Vehicle not found.');if(v.departed)fail('This vehicle has already departed.');const p=profile(v),order=D.orders[v.vin];
    function record(soc,source){v.history.push({t:today(),soc,twelveV:c.twelveV||v.twelveV,damage:!!c.damage,suspected:!!c.suspected,note:c.note||'',source,actor:'Demo visitor',profileId:p.id,profileVersion:p.version,recordedAt:new Date().toISOString()});v.soc=soc;}
    function move(code){
      const z=D.zones.find(z=>z.code===code);if(!z)fail('Unknown destination zone.');if(order?.status==='Running')fail('Stop charging before moving the vehicle.');if(v.zone===code)return;
      if(z.type==='Standard')fail('EVs require an EV-compatible zone.');
      if((v.quarantineRequired||v.zone==='Q-QUAR')&&z.type!=='Quarantine'&&v.dossier?.decision!=='Released')fail('HSE must release this vehicle before it leaves quarantine.');
      if(count(code)>=Math.min(z.capacity,z.maxEvs))fail('Destination zone is at its EV capacity.');
      D.zones.find(z=>z.code===v.zone).count--;z.count++;v.zone=code;
      if(z.type==='Quarantine'){v.quarantineRequired=false;if(!v.dossier||v.dossier.decision==='Released')v.dossier={reason:'Moved into quarantine for HSE review',opened:today(),decision:'Open'};}
    }
    function chargeTarget(){const t=target(v),r=p.departureRules.find(r=>r.destinationType===v.destination);if(r&&within(v)&&t<r.minSoc)fail('Profile and departure limits conflict. Review the profile.');return t;}
    if(action==='inspect'){
      if(!Number.isFinite(c.soc)||c.soc<0||c.soc>100||!allowed12.includes(c.twelveV))fail('Enter SOC between 0 and 100 and a valid 12V status.');
      if(order?.status==='Running')fail('Stop charging before recording a manual inspection.');
      if(!c.confirm&&(c.soc<5||v.soc-c.soc>20))fail('Confirm this unusually low reading.');
      record(c.soc,'Manual');v.twelveV=c.twelveV;v.driveable=c.twelveV!=='Dead';v.lastInspection=today();
      if(c.damage||c.suspected){v.quarantineRequired=true;v.dossier={reason:c.suspected?'Suspected battery issue reported':'Damage reported during inspection',opened:today(),decision:'Open'};delete D.orders[v.vin];}
    }else if(action==='quarantine'){
      if((c.reason||'').trim().length<10)fail('Explain the concern in at least 10 characters.');if(order?.status==='Running')fail('Stop the charging session before opening quarantine.');
      v.quarantineRequired=true;v.dossier={reason:c.reason.trim(),opened:today(),decision:'Open'};delete D.orders[v.vin];
    }else if(action==='move')move(c.zone);
    else if(action==='decide'){
      if(v.zone!=='Q-QUAR'||!v.dossier)fail('Move the vehicle to quarantine first.');
      if(!['Released','Repair required','Awaiting manufacturer'].includes(c.decision)||(c.justification||'').trim().length<10)fail('Choose a decision and give a justification of at least 10 characters.');
      Object.assign(v.dossier,{decision:c.decision,justification:c.justification.trim(),decidedBy:'Demo visitor'});
      if(c.decision==='Released'){v.quarantineRequired=false;move('B-EV-1');}
    }else if(action==='charge-approve'){
      safe(v);if(order)fail('A charging order already exists.');if(chargeTarget()<=v.soc)fail('No charging is needed for this target.');D.orders[v.vin]={status:'Approved'};
    }else if(action==='charge-start'){
      safe(v);if(order?.status!=='Approved')fail('Approve this order before starting.');if(chargeTarget()<=v.soc)fail('The target has already been reached.');
      const l=D.chargers.find(l=>l.status==='Available'&&!l.occupiedBy);if(!l)fail('No charger is available.');
      l.occupiedBy=v.vin;Object.assign(order,{status:'Running',charger:l.code,startSoc:v.soc,startedAt:new Date().toISOString()});
    }else if(action==='charge-stop'){
      if(order?.status!=='Running')fail('No running session for this vehicle.');
      if(!Number.isFinite(c.soc)||c.soc<order.startSoc||c.soc>100||(c.kwh!==null&&c.kwh!==undefined&&(!Number.isFinite(c.kwh)||c.kwh<0||c.kwh>1000)))fail('Provide a valid final SOC and non-negative energy reading.');
      const energy=c.kwh??Math.round((c.soc-order.startSoc)/100*v.kwh/.9*100)/100;
      D.chargingSessions.push({vin:v.vin,manufacturerCode:v.fab,charger:order.charger,start:order.startedAt,end:new Date().toISOString(),startSoc:order.startSoc,endSoc:c.soc,kwh:energy,estimatedKwh:c.kwh==null});
      D.chargers.find(l=>l.code===order.charger).occupiedBy=null;D.billing[v.fab].sessions++;D.billing[v.fab].kwh+=energy;record(c.soc,'Charging');delete D.orders[v.vin];
    }else if(action==='plan'){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(c.departure)||!Number.isFinite(day(c.departure))||c.departure<today()||!p.departureRules.some(r=>r.destinationType===c.destination))fail('Choose a valid destination and date from today onwards.');
      if(order?.status==='Running')fail('Stop charging before changing departure limits.');v.departure=c.departure;v.destination=c.destination;
    }else if(action==='depart'){
      safe(v);if(!v.departure)fail('Plan a departure first.');const r=p.departureRules.find(r=>r.destinationType===v.destination);
      if(order||evaluate(v).length||!r||v.soc<r.minSoc||v.soc>r.maxSoc)fail('Resolve all vehicle alerts and charging orders before departure.');v.departed=true;D.zones.find(z=>z.code===v.zone).count--;
    }else fail('Unknown demo action.');
    return {message:'Changes saved in this browser tab.'};
  }
  command=async(action,body={})=>{
    if(busy)fail('A request is already in progress.');busy=true;const before=structuredClone(D);
    try{
      const result=apply(action,body);D.revision=(D.revision||0)+1;
      D.audit.push({id:crypto.randomUUID(),at:new Date().toISOString(),actor:'Demo visitor',action,subject:body.vin||body.profile?.id||'CSV import',detail:'Browser-only sandbox command'});
      save();render();return result;
    }catch(error){D=before;render();throw error;}finally{busy=false;}
  };
  const bar=document.createElement('div');bar.className='public-bar';bar.innerHTML='<a href="../" class="public-back">VoltYard <span> / Case study</span></a><span class="public-note">Interactive sandbox · fictional data · no account needed</span><div><button class="btn sm" data-sandbox="tour">Guided tour</button><button class="btn sm" data-sandbox="reset">Reset demo</button></div>';
  document.body.prepend(bar);
  document.addEventListener('click',e=>{
    const action=e.target.closest('[data-sandbox]')?.dataset.sandbox;if(!action)return;
    if(action==='reset'){if(!confirm('Reset all changes in this demo tab?'))return;D=structuredClone(initial);D.orders={};D.audit=[];D.profileHistory=[];draft=null;importResult=null;filter={q:'',fab:'',zone:'',status:''};offset=0;selected=null;mobileVin=null;tourIndex=null;save();go('dashboard');toast('Demo reset. You have a fresh yard to explore.');}
    if(action==='tour'){tourIndex=0;viewStep();}
    if(action==='tour-close'){tourIndex=null;render();}
    if(action==='tour-back'){tourIndex=Math.max(0,tourIndex-1);viewStep();}
    if(action==='tour-next'){if(tourIndex===steps.length-1){tourIndex=null;render();toast('Tour complete. Explore any workflow or open the case study.');}else{tourIndex++;viewStep();}}
  });
  if(tourIndex!==null)viewStep();else render();
})();
