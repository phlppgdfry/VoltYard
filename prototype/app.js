const seedElement = document.getElementById('voltyard-seed');
const EMBEDDED = seedElement ? JSON.parse(seedElement.textContent) : null;
seedElement?.remove();
const publicDemo = document.documentElement.dataset.edition === 'public';
let D=EMBEDDED, alerts={}, user=null, role=null, page='dashboard', selected=null, filter={q:'',fab:'',zone:'',status:''}, offset=0;
let chargingQuery='', mobileVin=null, draft=null, profileId='VLT-BEV', zoneId='C-EV-3', importResult=null, busy=false;
const offline=!!EMBEDDED;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number(n).toLocaleString('en-GB',{maximumFractionDigits:1});
const date=s=>s?new Date(s.slice(0,10)+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}):'Not planned';
const day=s=>Math.floor(new Date(s+'T12:00:00Z').getTime()/864e5);
const today=()=>D.referenceDate;
const vehicle=vin=>D.vehicles.find(v=>v.vin===vin);
const profile=v=>D.profiles.find(p=>p.id===v.profile);
const active=()=>D.vehicles.filter(v=>!v.departed);
const severity={Critical:4,High:3,Medium:2,Low:1};
const pill=(text,kind='neutral')=>`<span class="pill p-${kind}">${esc(text)}</span>`;
const button=(text,action,vin='',kind='')=>`<button class="btn ${kind}" data-action="${action}" data-vin="${vin}">${text}</button>`;
const head=(title,sub,actions='')=>`<div class="pagehead"><div><div class="eyebrow">${esc(sub)}</div><h1>${esc(title)}</h1></div><div class="filters">${actions}</div></div>`;
const table=(headers,rows)=>`<div class="tablewrap"><table><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows||`<tr><td colspan="${headers.length}" class="muted">No matching records.</td></tr>`}</tbody></table></div>`;
function within(v){return v.departure&&day(v.departure)-day(today())<=7;}
function target(v,p=profile(v)){
  let result=Math.min(p.targetStorageSoc,p.maxChargeSoc),r=p.departureRules.find(r=>r.destinationType===v.destination);
  if(r&&within(v))result=Math.min(Math.max(result,r.minSoc),p.maxChargeSoc,r.maxSoc);
  return result;
}
function discharge(v,p=profile(v)){
  const h=v.history;if(h.length>=2){const a=h.at(-2),b=h.at(-1),n=day(b.t)-day(a.t);if(n>0&&a.soc>b.soc)return (a.soc-b.soc)/n;}
  return p.defaultDischargePerDay;
}
function evaluate(v,p=profile(v),simulate=false){
  if(!offline&&!simulate)return alerts[v.vin]||[];
  if(v.departed)return [];
  const out=[],add=(code,s,msg,action)=>out.push({code,severity:s,msg,action});
  if(!v.history.length){add('INSPECTION_REQUIRED','High','No battery observation has been recorded','Record an arrival inspection before charging or departure');if(v.quarantineRequired&&v.zone!=='Q-QUAR')add('QUARANTINE_REQUIRED','Critical','Unresolved concern without an inspection','Follow site HSE procedure');if(D.zones.find(z=>z.code===v.zone)?.type==='Standard')add('WRONG_ZONE','Medium','EV in standard storage zone','Move to approved EV zone');return out.sort((a,b)=>severity[b.severity]-severity[a.severity]);}
  const age=day(today())-day(v.lastInspection),socAge=day(today())-day(v.history.at(-1).t),horizon=v.departure?Math.min(14,Math.max(0,day(v.departure)-day(today()))):14;
  const pred=Math.max(0,v.soc-discharge(v,p)*(Math.max(0,socAge)+horizon));
  if(v.soc<p.criticalSoc)add('SOC_CRITICAL','Critical',`SOC ${v.soc}% below critical ${p.criticalSoc}%`,'Inspect and arrange urgent charging if safe');
  else if(v.soc<p.minStorageSoc)add('SOC_BELOW_MIN','High',`SOC ${v.soc}% below storage minimum ${p.minStorageSoc}%`,'Review charging task');
  else if(pred<p.minStorageSoc)add('SOC_PREDICTED_LOW','Medium',`Estimated SOC ${pred.toFixed(1)}% in ${horizon} days`,'Schedule an inspection or charging');
  if(age>p.inspectionIntervalDays)add('INSPECTION_OVERDUE','Medium',`Last inspection ${age} days ago`,'Inspect vehicle');
  if(v.twelveV==='Weak')add('TWELVE_VOLT_WEAK','Medium','12V battery weak','Inspect auxiliary battery');
  if(v.twelveV==='Dead'||!v.driveable)add('NOT_DRIVEABLE','High','Vehicle cannot drive','Arrange recovery; include in emergency inventory');
  const r=p.departureRules.find(r=>r.destinationType===v.destination);
  if(r&&within(v)){
    if(v.soc>r.maxSoc)add('DEPARTURE_SOC_HIGH','High',`SOC above departure maximum ${r.maxSoc}%`,'Hold departure and request review');
    if(v.soc<r.minSoc)add('DEPARTURE_SOC_LOW','High',`SOC below departure minimum ${r.minSoc}%`,'Arrange charging before departure');
  }
  if(v.quarantineRequired&&v.zone!=='Q-QUAR')add('QUARANTINE_REQUIRED','Critical','Unresolved damage or battery concern','Follow site HSE procedure and isolate vehicle');
  if(D.zones.find(z=>z.code===v.zone)?.type==='Standard')add('WRONG_ZONE','Medium','EV in standard storage zone','Move to approved EV zone');
  return out.sort((a,b)=>severity[b.severity]-severity[a.severity]);
}
function status(v){
  if(v.departed)return 'Departed';if(v.zone==='Q-QUAR')return 'In quarantine';if(v.quarantineRequired)return 'Quarantine required';
  if(D.orders?.[v.vin]?.status==='Running')return 'Charging';if(evaluate(v).some(a=>severity[a.severity]>=3))return 'Needs attention';
  return within(v)&&!evaluate(v).length?'Ready for departure':'Stored';
}
const statusKind=s=>s.includes('quarantine')?'Critical':s==='Needs attention'?'High':s==='Charging'?'info':s==='Ready for departure'?'ok':'neutral';
function count(code){return offline?D.zones.find(z=>z.code===code).count:active().filter(v=>v.zone===code).length;}
function zoneAlerts(){return D.zones.filter(z=>z.type==='EV'&&count(z.code)>z.maxEvs).map(z=>({code:'ZONE_DENSITY',severity:'High',msg:`${z.code}: ${count(z.code)} EVs, limit ${z.maxEvs}`,action:'Redistribute vehicles',vin:''}));}
const allAlerts=()=>[...zoneAlerts(),...active().flatMap(v=>evaluate(v).map(a=>({...a,vin:v.vin})))].sort((a,b)=>severity[b.severity]-severity[a.severity]);
function chargerGrid(){return `<div class="chargers">${D.chargers.map(l=>`<div class="ch ${l.status==='Faulted'?'defect':l.occupiedBy?'occupied':''}" title="${esc(l.type)} · ${l.powerKw} kW"><b>${l.code}</b>${l.status==='Faulted'?'Faulted':l.occupiedBy?'In use':l.powerKw+' kW'}</div>`).join('')}</div>`;}
function showAlerts(list){return `<div class="alerts">${list.map(a=>`<div class="alert"><span class="sev-${a.severity}"></span><div>${pill(a.severity,a.severity)}<strong>${esc(a.msg)}</strong><span class="act">${esc(a.action)}</span><span class="code">${a.code}</span></div></div>`).join('')||pill('No open alerts','ok')}</div>`;}
function dashboard(){
  const all=allAlerts(),orders=chargingOrders(),quarantine=active().filter(v=>v.quarantineRequired||v.zone==='Q-QUAR');
  return head('What needs attention today?',date(today()),`<span class="muted">${offline?(publicDemo?'Public sandbox · ':'60-vehicle preview · '):'Local application · '}revision ${D.revision||0}</span>`)+
  `<section class="kpis" aria-label="Key figures">${[
    [publicDemo?active().length:offline?D.totalVehicles:active().length,'Vehicles in yard',`${D.manufacturers.length} manufacturers`],
    [all.length,'Open alerts',`${all.filter(a=>a.severity==='Critical').length} critical`],
    [orders.length,'Charging tasks','Prioritised by severity'],[quarantine.length,'Quarantine cases','HSE review required'],
    [D.chargers.filter(l=>l.occupiedBy).length,'Chargers in use',`${D.chargers.filter(l=>l.status==='Available').length} operational`]
  ].map(([n,label,sub])=>`<div class="kpi"><span class="k">${label}</span><span class="v num">${number(n)}</span><span class="s muted">${sub}</span></div>`).join('')}</section>
  <div class="grid-2"><section class="panel"><div class="panel-head"><h2>Priority alerts</h2>${button('View vehicles','vehicles')}</div>${table(['Vehicle / zone','Rule','Action'],all.slice(0,12).map(a=>`<tr><td>${a.vin?`<button class="link mono" data-action="detail" data-vin="${a.vin}">${a.vin}</button>`:'Yard safety'}</td><td>${pill(a.severity,a.severity)}<div>${esc(a.msg)}</div></td><td>${esc(a.action)}</td></tr>`).join(''))}</section>
  <div class="stack"><section class="panel"><h2>Zone occupancy</h2><div class="zones">${D.zones.map(z=>`<div class="zone"><span class="zc">${z.code}</span><div class="bar"><i class="${count(z.code)>z.maxEvs?'over':''}" style="width:${Math.min(100,count(z.code)/z.capacity*100)}%"></i></div><span class="num">${count(z.code)} / ${z.maxEvs}</span></div>`).join('')}</div><span class="muted">Occupancy / configured EV limit. Standard storage permits no EVs.</span></section><section class="panel"><h2>Charging infrastructure</h2>${chargerGrid()}</section></div></div>`;
}
function vehicles(){
  const q=filter.q.toLowerCase(),list=D.vehicles.filter(v=>(!q||`${v.vin} ${v.model}`.toLowerCase().includes(q))&&(!filter.fab||v.fab===filter.fab)&&(!filter.zone||v.zone===filter.zone)&&(!filter.status||(filter.status==='alerts'?evaluate(v).length:status(v)===filter.status)));
  offset=Math.min(offset,Math.max(0,Math.floor((list.length-1)/50)*50));
  return head('Vehicles','Search, inspect and prepare for departure',button('Import vessel CSV','import'))+
  `<section class="panel"><div class="filters"><input class="input grow" id="search" type="search" placeholder="Search VIN or model" aria-label="Search VIN or model" value="${esc(filter.q)}">
  <select class="input" id="manufacturer" aria-label="Manufacturer"><option value="">All manufacturers</option>${D.manufacturers.map(f=>`<option value="${f.code}" ${filter.fab===f.code?'selected':''}>${esc(f.name)}</option>`).join('')}</select>
  <select class="input" id="zone" aria-label="Zone"><option value="">All zones</option>${D.zones.map(z=>`<option ${filter.zone===z.code?'selected':''}>${z.code}</option>`).join('')}</select>
  <select class="input" id="status" aria-label="Status"><option value="">All statuses</option>${['alerts','Stored','Needs attention','Charging','In quarantine','Quarantine required','Ready for departure','Departed'].map(s=>`<option value="${s}" ${filter.status===s?'selected':''}>${s==='alerts'?'With alerts':s}</option>`).join('')}</select></div>
  <div class="panel-head"><span class="muted">${number(list.length)} results · ${list.length?offset+1:0}–${Math.min(offset+50,list.length)}</span><div>${button('Previous','previous')}${button('Next','next')}</div></div>
  ${table(['VIN / model','Zone','SOC','12V','Status','Departure'],list.slice(offset,offset+50).map(v=>`<tr><td><button class="link mono" data-action="detail" data-vin="${v.vin}">${v.vin}</button><div class="muted">${esc(v.model)}</div></td><td>${v.zone}</td><td>${v.history.length?v.soc+'%':'Not measured'}</td><td>${v.history.length?v.twelveV:'Not recorded'}</td><td>${pill(status(v),statusKind(status(v)))}</td><td>${date(v.departure)}<div class="muted">${v.destination||''}</div></td></tr>`).join(''))}</section>`;
}
function chart(v){
  if(!v.history.length)return '<p class="muted">Record the arrival inspection to establish the first measurement.</p>';
  const h=v.history,p=profile(v),start=day(h[0].t),end=Math.max(day(today())+14,start+1),x=t=>40+(day(t)-start)/(end-start)*580,y=s=>190-s*1.6;
  const pred=Math.max(0,v.soc-discharge(v)*(end-day(v.history.at(-1).t)));
  return `<div class="chartwrap"><svg viewBox="0 0 640 230" role="img" aria-label="State of charge history and forecast">${[0,25,50,75,100].map(s=>`<line x1="40" x2="620" y1="${y(s)}" y2="${y(s)}" stroke="var(--line)"/><text x="5" y="${y(s)+4}" fill="var(--muted)" font-size="11">${s}%</text>`).join('')}
  <line x1="40" x2="620" y1="${y(p.minStorageSoc)}" y2="${y(p.minStorageSoc)}" stroke="var(--hoog)" stroke-dasharray="5 4"/>
  <polyline points="${h.map(a=>x(a.t)+','+y(a.soc)).join(' ')}" fill="none" stroke="var(--accent)" stroke-width="2"/>
  <line x1="${x(h.at(-1).t)}" y1="${y(v.soc)}" x2="620" y2="${y(pred)}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 4"/>
  <text x="40" y="215" fill="var(--muted)" font-size="11">${date(h[0].t)}</text><text x="620" y="215" text-anchor="end" fill="var(--muted)" font-size="11">14-day forecast: ${pred.toFixed(1)}%</text></svg></div><span class="muted">Dashed line: estimate, not telemetry. Storage minimum: ${p.minStorageSoc}%.</span>`;
}
function detail(){
  const v=vehicle(selected);if(!v)return vehicles();const p=profile(v);
  return button('← Vehicles','vehicles')+head(v.vin,`${v.brand} · ${v.model} · ${v.powertrain} · ${v.kwh} kWh`,button('Record inspection','inspect',v.vin,'primary')+button('Handover report','report',v.vin))+
  `<dl class="dl">${[['Status',status(v)],['SOC',v.history.length?v.soc+'%':'Not measured'],['12V',v.history.length?v.twelveV:'Not recorded'],['Zone',v.zone],['Rule profile',p.name+' · v'+p.version],['Last inspection',v.history.length?date(v.lastInspection):'Required']].map(([k,a])=>`<div><dt>${k}</dt><dd>${esc(a)}</dd></div>`).join('')}</dl>
  <div class="grid-2"><section class="panel"><h2>State of charge</h2>${chart(v)}</section><section class="panel"><h2>Current alerts</h2>${showAlerts(evaluate(v))}</section></div>
  ${v.departed?'':`<section class="panel"><h2>Yard operations</h2><div class="filters"><label class="f">Destination zone<select id="move-zone" class="input">${D.zones.filter(z=>z.type!=='Standard').map(z=>`<option ${v.zone===z.code?'selected':''}>${z.code}</option>`).join('')}</select></label>${button('Move vehicle','move',v.vin)}${button('Open quarantine case','quarantine',v.vin,'danger')}</div><div class="filters"><label class="f">Departure date<input class="input" id="departure" type="date" min="${today()}" value="${v.departure||''}"></label><label class="f">Destination<select class="input" id="destination">${p.departureRules.map(r=>`<option ${r.destinationType===v.destination?'selected':''}>${r.destinationType}</option>`).join('')}</select></label>${button('Save departure plan','plan',v.vin)}${button('Confirm departure','depart',v.vin)}</div></section>`}
  <section class="panel"><h2>Inspection history · append-only</h2>${table(['Date','SOC','12V','Source','Profile','Recorded by'],[...v.history].reverse().map(h=>`<tr><td>${date(h.t)}</td><td>${h.soc}%</td><td>${h.twelveV||'—'}</td><td>${h.source||'Manual'}</td><td>${esc(h.profileId||p.id)} v${h.profileVersion||1}</td><td>${esc(h.actor||'seed')}</td></tr>`).join(''))}</section>`;
}
function field(){
  const v=vehicle(mobileVin);
  const tasks=active().filter(v=>v.zone!=='Q-QUAR'&&evaluate(v).length).sort((a,b)=>severity[evaluate(b)[0].severity]-severity[evaluate(a)[0].severity]).slice(0,12);
  return head('Field inspections','Record observed values from the vehicle')+`<div class="phone-stage"><section class="panel"><h2>${v?'Inspect vehicle':'Find a vehicle'}</h2>${v?`
  <div class="vinbox">${v.vin}</div><p class="muted">${esc(v.model)} · ${v.zone} · previous SOC ${v.history.length?v.soc+'%':'not measured'}</p>
  <form id="inspection-form" class="stack"><label class="f">State of charge (%)<input class="input" name="soc" type="number" required min="0" max="100" step="0.1" value="${v.history.length?v.soc:''}"></label><label class="f">12V battery<select class="input" name="twelveV" required>${!v.history.length?'<option value="" selected disabled>Choose observed condition</option>':''}${['OK','Weak','Dead'].map(s=>`<option ${v.history.length&&v.twelveV===s?'selected':''}>${s}</option>`).join('')}</select></label>
  <label class="toggle"><span>Vehicle damage</span><input name="damage" type="checkbox"></label><label class="toggle"><span>Suspected battery issue<br><small class="muted">Heat, smell, smoke or a dashboard warning</small></span><input name="suspected" type="checkbox"></label>
  <label class="f">Notes<textarea class="input" name="note" maxlength="2000" rows="3"></textarea></label><button class="bigbtn" type="submit">Save inspection</button>${button('Back to tasks','field')}</form>`:`
  <form id="find-form" class="filters"><label class="f grow">VIN<input class="input mono" name="vin" required maxlength="17" placeholder="Enter 17-character VIN"></label><button class="btn primary" type="submit">Find vehicle</button></form>
  <h3>Priority tasks</h3>${tasks.map(v=>`<button class="task" data-action="inspect" data-vin="${v.vin}"><span class="mono">${v.vin}</span>${pill(evaluate(v)[0].severity,evaluate(v)[0].severity)}<span class="muted">${esc(v.model)} · ${v.zone}</span></button>`).join('')}`}</section>
  <section class="explain"><h2>Inspection procedure</h2><ol><li>Match the VIN to the vehicle and read the displayed SOC.</li><li>Record the auxiliary battery condition and any observed damage.</li><li>Save the measurement. The server evaluates the active manufacturer profile.</li><li>Follow site HSE procedures for any suspected battery issue.</li></ol><p class="muted">Camera scanning, photo uploads and offline synchronisation are on the roadmap. Enter a VIN or choose a task in this version.</p></section></div>`;
}
function chargingOrders(){return active().filter(v=>v.zone!=='Q-QUAR'&&!v.quarantineRequired).map(v=>({v,order:D.orders?.[v.vin],alert:evaluate(v).find(a=>['SOC_CRITICAL','SOC_BELOW_MIN','SOC_PREDICTED_LOW','DEPARTURE_SOC_LOW'].includes(a.code))})).filter(o=>o.order||(o.alert&&target(o.v)>o.v.soc)).sort((a,b)=>(severity[b.alert?.severity]||0)-(severity[a.alert?.severity]||0));}
function charging(){
  const orders=chargingOrders().filter(o=>(o.v.vin+' '+o.v.model).toLowerCase().includes(chargingQuery.toLowerCase()));return head('Charging','Manual charging workflow · no hardware connection')+`<div class="grid-2"><section class="panel"><h2>Charging orders · ${orders.length}</h2><label class="f">Find a charging task<input class="input" id="charging-search" type="search" placeholder="Search VIN or model" value="${esc(chargingQuery)}"></label>${table(['Vehicle','SOC → target','Status','Action'],orders.slice(0,50).map(({v,order,alert})=>`<tr><td><button class="link mono" data-action="detail" data-vin="${v.vin}">${v.vin}</button><div class="muted">${esc(v.model)}</div><small>${esc(alert?.msg||'Approved task')}</small></td><td>${v.soc}% → ${target(v)}%</td><td>${order?.status||'Proposed'} ${order?.charger||''}</td><td>${order?.status==='Running'?button('Stop session','charge-stop',v.vin):order?button('Start session','charge-start',v.vin,'primary'):button('Approve','charge-approve',v.vin)}</td></tr>`).join(''))}<span class="muted">Showing up to 50 matching tasks; search to find any vehicle. Targets include active departure limits. On stop, enter the actual SOC and optional metered kWh.</span></section><div class="stack"><section class="panel"><h2>Chargers</h2>${chargerGrid()}</section><section class="panel"><div class="panel-head"><h2>Recorded energy by manufacturer</h2>${button('Download CSV','billing-csv')}</div>${table(['Manufacturer','Sessions','kWh'],D.manufacturers.map(f=>`<tr><td>${esc(f.name)}</td><td>${D.billing[f.code]?.sessions||0}</td><td>${number(D.billing[f.code]?.kwh||0)}</td></tr>`).join(''))}<span class="muted">All recorded sessions. Estimates are marked in the handover report. This is an energy summary, not an invoice.</span></section></div></div>`;
}
function safety(){
  const cases=active().filter(v=>v.zone==='Q-QUAR'||v.quarantineRequired),rows=active().filter(v=>v.zone===zoneId);
  return head('Safety','Quarantine decisions and emergency inventory')+`<section class="panel"><h2>Quarantine cases · ${cases.length}</h2>${table(['Vehicle','Status / concern','Decision'],cases.map(v=>`<tr><td><button class="link mono" data-action="detail" data-vin="${v.vin}">${v.vin}</button><div>${esc(v.model)}</div></td><td>${pill(status(v),'Critical')}<p>${esc(v.dossier?.reason)}</p><small>${date(v.dossier?.opened)}</small></td><td>${v.quarantineRequired&&v.zone!=='Q-QUAR'?button('Move to Q-QUAR','isolate',v.vin,'danger'):`<label class="f">Decision<select class="input" id="decision-${v.vin}">${['Released','Repair required','Awaiting manufacturer'].map(s=>`<option ${v.dossier?.decision===s?'selected':''}>${s}</option>`).join('')}</select></label><label class="f">Justification<textarea class="input" id="reason-${v.vin}" minlength="10" maxlength="2000">${esc(v.dossier?.justification||'')}</textarea></label>${button('Record HSE decision','decide',v.vin)}`}</td></tr>`).join(''))}</section>
  <section class="panel"><div class="panel-head"><h2>Emergency inventory</h2><div class="filters"><select class="input" id="emergency-zone" aria-label="Emergency zone">${D.zones.map(z=>`<option ${zoneId===z.code?'selected':''}>${z.code}</option>`).join('')}</select>${button('Download zone CSV','emergency-csv')}</div></div><p>${count(zoneId)} vehicles in this zone · ${rows.filter(v=>v.history.length&&!v.driveable).length} flagged unable to drive · ${rows.filter(v=>!v.history.length).length} uninspected${offline&&!publicDemo?' in the preview sample':''}</p>${table(['VIN','Model','SOC','Movement indication'],rows.slice(0,100).map(v=>`<tr><td class="mono">${v.vin}</td><td>${esc(v.model)}</td><td>${v.history.length?v.soc+'%':'Not measured'}</td><td>${!v.history.length?'Unknown':v.driveable?'No 12V block recorded':'Flagged unable'}</td></tr>`).join(''))}<span class="muted">Table shows up to 100 records. CSV includes every loaded vehicle in the selected zone.</span></section>`;
}
function rules(){
  const p=D.profiles.find(p=>p.id===profileId),values=draft||p;
  const affected=active().filter(v=>v.profile===p.id);
  return head('Rule profiles','Illustrative values · approve real profiles with the OEM and HSE')+`<div class="grid-2"><section class="panel"><h2>${esc(p.name)} · version ${p.version}</h2><form id="profile-form" class="stack"><div class="editor">${[['criticalSoc','Critical SOC (%)'],['minStorageSoc','Storage minimum (%)'],['targetStorageSoc','Storage target (%)'],['maxChargeSoc','Charging maximum (%)'],['inspectionIntervalDays','Inspection interval (days)']].map(([k,label])=>`<label class="f">${label}<input class="input" name="${k}" data-profile-field="${k}" type="number" required min="${k.endsWith('Days')?1:0}" max="${k.endsWith('Days')?365:100}" step="1" value="${values[k]}"></label>`).join('')}</div><div id="simulation" class="notice">${affected.filter(v=>evaluate(v,p,true).length).length} vehicles with alerts now · ${affected.filter(v=>evaluate(v,values,true).length).length} with these settings</div><div class="filters"><button class="btn primary" type="submit">Save as version ${p.version+1}</button>${button('Reset draft','reset-profile')}</div></form><h3>Departure limits</h3>${table(['Destination','Minimum','Maximum'],p.departureRules.map(r=>`<tr><td>${r.destinationType}</td><td>${r.minSoc}%</td><td>${r.maxSoc}%</td></tr>`).join(''))}</section><section class="panel"><h2>Available profiles</h2>${table(['Profile','Storage range','Interval'],D.profiles.map(p=>`<tr><td><button class="link" data-action="select-profile" data-profile="${p.id}">${esc(p.name)}</button><div class="code">${p.id} · v${p.version}</div></td><td>${p.minStorageSoc}–${p.maxChargeSoc}%</td><td>${p.inspectionIntervalDays} days</td></tr>`).join(''))}<p class="muted">Model-specific profiles take precedence over manufacturer profiles, then the terminal default. Historical measurements retain their original profile version.</p></section></div>`;
}
function importPage(){return head('Import vehicles','Vessel manifest · per-row validation')+`<section class="panel"><h2>Upload a CSV manifest</h2><p>Required columns: <code>vin,brand,model,powertrain,kwh,manufacturerCode</code>. Optional: <code>destination,departure</code>. Use comma-separated UTF-8 with quoted fields where needed. Imported vehicles require an arrival inspection.</p><form id="import-form" class="stack"><label class="f">CSV file<input id="csv-file" class="input" type="file" accept=".csv,text/csv" required></label><button type="submit" class="btn primary">Validate and import</button></form><p class="muted">Maximum 2 MB / 10,000 rows. Existing VINs and invalid rows are skipped with a reason. Vehicles enter B-EV-1 while capacity permits.</p>${importResult?`<div class="notice" role="status">${importResult.accepted} imported · ${importResult.rejected} rejected</div>${table(['CSV line','VIN','Reason'],importResult.errors.map(e=>`<tr><td>${e.line}</td><td class="mono">${esc(e.vin)}</td><td>${esc(e.error)}</td></tr>`).join(''))}`:''}</section>`;}
function audit(){return head('Audit trail','Server-assigned actor and timestamp')+`<section class="panel"><h2>Latest 100 changes</h2>${table(['Time (UTC)','Actor','Action','Subject'],[...(D.audit||[])].reverse().slice(0,100).map(a=>`<tr><td>${esc(a.at)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td><td class="mono">${esc(a.subject)}</td></tr>`).join(''))}<p class="muted">The local file is not tamper-proof. Production audit storage and retention require a separate design.</p></section>`;}
const views={dashboard,vehicles,detail,field,charging,safety,rules,import:importPage,audit};
const nav=[['dashboard','Dashboard','Operations overview'],['vehicles','Vehicles','Search and departure'],['field','Field inspections','Mobile workflow'],['charging','Charging','Orders and energy'],['safety','Safety','Quarantine and emergency'],['rules','Rule profiles','Manufacturer thresholds'],['import','Import','Vessel manifests'],['audit','Audit trail','Recorded changes']];
function render(){
  document.getElementById('nav').innerHTML=nav.map(([key,label,sub])=>`<button data-action="${key}" ${page===key||(page==='detail'&&key==='vehicles')?'aria-current="page"':''}><span class="l1">${label}</span><span class="l2">${sub}</span></button>`).join('')+(!offline?'<button data-action="logout"><span class="l1">Sign out</span><span class="l2">'+esc(role)+'</span></button>':'');
  document.getElementById('session').innerHTML=offline?'Standalone preview · fictional data':`${esc(user)} · ${esc(role)}<br>${button('Sign out','logout')}`;
  document.getElementById('app').innerHTML=views[page]();
}
function route(){
  const [name,vin]=location.hash.slice(1).split('/');
  if((name==='detail'||name==='field')&&vin&&D&&vehicle(vin)){selected=vin;mobileVin=vin;page=name;}
  else page=views[name]&&name!=='detail'?name:'dashboard';
}
function go(next){
  if(next!=='rules')draft=null;
  if(next==='field')mobileVin=null;
  page=next;
  const hash=next==='detail'&&selected?'detail/'+selected:next;
  if(location.hash.slice(1)!==hash)history.pushState(null,'','#'+hash);
  render();document.getElementById('app').focus();window.scrollTo(0,0);
}
window.addEventListener('popstate',()=>{if(D){route();render();}});
window.addEventListener('hashchange',()=>{if(D){route();render();}});
let toastTimer;
function toast(message){clearTimeout(toastTimer);document.querySelector('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=message;document.body.append(t);toastTimer=setTimeout(()=>t.remove(),6000);}
async function api(path,body){
  const response=await fetch(path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json','X-VoltYard-Client':'web'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!response.ok){let message=response.status===403?'Your role cannot perform this action.':response.status===401?'Sign in to continue.':response.status===429?'Too many sign-in attempts. Try again in 15 minutes.':'Request failed.';try{const problem=await response.json();message=problem.title||message;}catch{}throw Object.assign(new Error(message),{status:response.status});}
  const text=await response.text();return text?JSON.parse(text):null;
}
async function load(){const snapshot=await api('/api/state');D=snapshot.data;alerts=snapshot.alerts;user=snapshot.user;role=snapshot.role;}
async function command(action,body={}){
  if(busy)throw new Error('A request is already in progress.');busy=true;
  try{
    if(offline){applyPreview(action,body);render();return {message:'Saved in this preview session.'};}
    const result=await api('/api/commands/'+action,{...body,revision:D.revision});await load();render();return result;
  }catch(error){if(error.status===409){await load();render();}else if(error.status===401){login();}throw error;}finally{busy=false;}
}
function applyPreview(action,c){
  const v=vehicle(c.vin);D.orders??={};
  if(action==='import')throw new Error('CSV import is available in the connected .NET application.');
  if(action==='profile'){const old=D.profiles.find(p=>p.id===c.profile.id);if(!(c.profile.criticalSoc<=c.profile.minStorageSoc&&c.profile.minStorageSoc<=c.profile.targetStorageSoc&&c.profile.targetStorageSoc<=c.profile.maxChargeSoc))throw new Error('Profile thresholds must be ordered.');Object.assign(old,c.profile,{version:old.version+1});return;}
  if(!v)throw new Error('Vehicle not found.');
  const move=zone=>{if(v.zone!==zone){D.zones.find(z=>z.code===v.zone).count--;D.zones.find(z=>z.code===zone).count++;v.zone=zone;}};
  if(action.startsWith('charge-')&&(v.zone==='Q-QUAR'||v.quarantineRequired))throw new Error('Vehicle requires HSE review.');
  if(action==='inspect'){v.soc=c.soc;v.twelveV=c.twelveV;v.driveable=c.twelveV!=='Dead';v.lastInspection=today();v.history.push({t:today(),...c,source:'Manual',actor:'preview',profileId:v.profile,profileVersion:profile(v).version});if(c.damage||c.suspected){v.quarantineRequired=true;v.dossier={reason:'Concern reported during inspection',opened:today(),decision:'Open'};}}
  if(action==='quarantine'){v.quarantineRequired=true;v.dossier={reason:c.reason,opened:today(),decision:'Open'};}
  if(action==='move'){if((v.quarantineRequired||v.zone==='Q-QUAR')&&c.zone!=='Q-QUAR')throw new Error('HSE release required.');move(c.zone);if(c.zone==='Q-QUAR')v.quarantineRequired=false;}
  if(action==='decide'){v.dossier={...v.dossier,decision:c.decision,justification:c.justification};if(c.decision==='Released'){v.quarantineRequired=false;move('B-EV-1');}}
  if(action==='charge-approve')D.orders[v.vin]={status:'Approved'};
  if(action==='charge-start'){const l=D.chargers.find(l=>l.status==='Available'&&!l.occupiedBy);if(!l)throw new Error('No charger available.');l.occupiedBy=v.vin;D.orders[v.vin]={status:'Running',charger:l.code,startSoc:v.soc};}
  if(action==='charge-stop'){const o=D.orders[v.vin];if(o?.status!=='Running')throw new Error('No running session.');const l=D.chargers.find(l=>l.code===o.charger);l.occupiedBy=null;const b=D.billing[v.fab];b.sessions++;b.kwh+=c.kwh??Math.max(0,c.soc-o.startSoc)/100*v.kwh/.9;v.soc=c.soc;v.history.push({t:today(),soc:c.soc,source:'Charging'});delete D.orders[v.vin];}
  if(action==='plan'){v.departure=c.departure;v.destination=c.destination;}
  if(action==='depart'){if(evaluate(v).length||v.zone==='Q-QUAR')throw new Error('Resolve all alerts before departure.');v.departed=true;D.zones.find(z=>z.code===v.zone).count--;}
  D.revision=(D.revision||0)+1;
}
function csvCell(value){let text=String(value??'');if(/^(?:\s*[=+@\-]|[\t\r\n])/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';}
function download(name,rows){const csv=rows.map(row=>row.map(csvCell).join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
let previousFocus=null;
function closeModal(){document.getElementById('overlay').innerHTML='';document.querySelector('.shell').inert=false;previousFocus?.focus();}
function modal(title,content){previousFocus=document.activeElement;document.querySelector('.shell').inert=true;document.getElementById('overlay').innerHTML=`<div class="modal"><section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="panel-head"><h2>${esc(title)}</h2>${button('Close','close')}</div>${content}</section></div>`;document.querySelector('.sheet button')?.focus();}
async function report(vin){
  const r=offline?{id:'PREVIEW-'+vin,generatedAt:new Date().toISOString(),vehicle:vehicle(vin),profile:profile(vehicle(vin)),chargingSessions:publicDemo?D.chargingSessions.filter(s=>s.vin===vin):[],audit:publicDemo?D.audit.filter(a=>a.subject===vin):[],alerts:evaluate(vehicle(vin))}:await api('/api/reports/'+vin),v=r.vehicle;
  modal('Handover report',`<div class="doc-head"><h2>VoltYard · Demo Terminal Zeebrugge</h2><div class="code">Report ${esc(r.id)}<br>Generated ${esc(r.generatedAt)}</div></div><dl class="dl">${[['VIN',vin],['Vehicle',v.model],['Profile',r.profile.id+' v'+r.profile.version],['Arrival',date(v.arrival)],['Departure',date(v.departure)],['Zone',v.zone]].map(([k,x])=>`<div><dt>${k}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl><h3>Inspections</h3>${table(['Date','SOC','12V','Source','Profile','Actor'],v.history.map(h=>`<tr><td>${date(h.t)}</td><td>${h.soc}%</td><td>${h.twelveV||'—'}</td><td>${esc(h.source)}</td><td>${esc(h.profileId)} v${h.profileVersion||1}</td><td>${esc(h.actor)}</td></tr>`).join(''))}<h3>Charging sessions</h3>${table(['Start','End SOC','kWh','Energy source'],r.chargingSessions.map(s=>`<tr><td>${esc(s.start)}</td><td>${s.endSoc}%</td><td>${number(s.kwh)}</td><td>${s.estimatedKwh?'Estimated':'Metered'}</td></tr>`).join(''))}<h3>Quarantine case</h3>${v.dossier?`<dl class="dl">${[['Reason',v.dossier.reason],['Opened',date(v.dossier.opened)],['Decision',v.dossier.decision],['Justification',v.dossier.justification||'Not recorded'],['Reviewed by',v.dossier.decidedBy||'Not recorded']].map(([key,value])=>`<div><dt>${key}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`:'<p>None</p>'}<h3>Current alerts</h3>${showAlerts(r.alerts)}<h3>Audit events</h3>${table(['At','Actor','Action'],r.audit.map(a=>`<tr><td>${esc(a.at)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td></tr>`).join(''))}<p class="muted">Snapshot of recorded terminal activity. This report does not certify battery condition or regulatory compliance.</p>${button('Print / Save as PDF','print','','primary')}`);
}
function login(error=''){
  document.getElementById('nav').innerHTML='';document.getElementById('session').textContent='Local development edition';
  document.getElementById('app').innerHTML=head('Sign in to VoltYard','EV battery care, charging and yard safety')+`<section class="panel" style="max-width:480px"><h2>Demo Terminal Zeebrugge</h2><p class="muted">Use a demo role to explore the application. All manufacturers and vehicle records are fictional.</p><form id="login-form" class="stack"><label class="f">Account<select class="input" name="user">${['admin','planner','operator','hse','account'].map(u=>`<option>${u}</option>`).join('')}</select></label><label class="f">Password<input class="input" type="password" name="password" required autocomplete="current-password"></label><button type="submit" class="btn primary">Sign in</button><p class="err" role="alert">${esc(error)}</p></form><span class="muted">Local development password: <code>VoltYard-demo-2026</code>. A configured environment password overrides this value.</span></section>`;
}
document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action,vin=el.dataset.vin,v=vehicle(vin);
  try{
    if(a==='close'){closeModal();return;}if(a==='print'){window.print();return;}
    if(a==='logout'){await api('/api/logout',{});user=null;D=null;alerts={};login();return;}
    if(a==='detail'){selected=vin;go('detail');return;}
    if(a==='inspect'){mobileVin=vin;page='field';history.pushState(null,'','#field/'+vin);render();return;}
    if(views[a]){go(a);return;}
    if(a==='previous'||a==='next'){offset=Math.max(0,offset+(a==='next'?50:-50));render();return;}
    if(a==='select-profile'){profileId=el.dataset.profile;draft=null;render();return;}
    if(a==='reset-profile'){draft=null;render();return;}
    if(a==='report'){await report(vin);return;}
    if(a==='billing-csv'){download('voltyard-energy.csv',[['manufacturer','sessions','kwh'],...D.manufacturers.map(f=>[f.name,D.billing[f.code]?.sessions||0,D.billing[f.code]?.kwh||0])]);return;}
    if(a==='emergency-csv'){download('voltyard-'+zoneId+'.csv',[['vin','model','soc','driveable','lastInspection'],...active().filter(v=>v.zone===zoneId).map(v=>[v.vin,v.model,v.history.length?v.soc:'unknown',v.history.length?v.driveable:'unknown',v.history.length?v.lastInspection:'unknown'])]);return;}
    let body={vin},action=a;
    if(a==='quarantine'){const reason=prompt('Describe the safety concern (at least 10 characters):');if(reason===null)return;body.reason=reason;}
    if(a==='isolate'){action='move';body.zone='Q-QUAR';}
    if(a==='move')body.zone=document.getElementById('move-zone').value;
    if(a==='decide'){body.decision=document.getElementById('decision-'+vin).value;body.justification=document.getElementById('reason-'+vin).value;}
    if(a==='plan'){body.departure=document.getElementById('departure').value;body.destination=document.getElementById('destination').value;}
    if(a==='depart'&&!confirm('Confirm departure? All vehicle alerts must be resolved.'))return;
    if(a==='charge-stop'){
      modal('Stop charging session',`<form id="stop-form" data-vin="${vin}" class="stack"><label class="f">Final observed SOC (%)<input class="input" name="soc" type="number" required min="${D.orders[vin].startSoc}" max="100" step="0.1" value="${target(v)}"></label><label class="f">Metered energy (kWh, optional)<input class="input" name="kwh" type="number" min="0" max="1000" step="0.01"></label><p class="muted">Leave energy blank to record an estimate using battery capacity and 90% efficiency. An over-target SOC remains visible as an alert.</p><button class="btn primary" type="submit">Complete session</button></form>`);return;
    }
    const result=await command(action,body);toast(result.message||'Changes saved.');
  }catch(error){toast(error.message);}
});
document.addEventListener('submit',async e=>{
  e.preventDefault();const f=e.target,values=new FormData(f);
  try{
    if(f.id==='login-form'){await api('/api/login',Object.fromEntries(values));await load();route();render();return;}
    if(f.id==='find-form'){const vin=String(values.get('vin')).trim().toUpperCase();if(!vehicle(vin))throw new Error('VIN not found in this yard.');mobileVin=vin;history.pushState(null,'','#field/'+vin);render();return;}
    if(f.id==='inspection-form'){
      const v=vehicle(mobileVin),soc=Number(values.get('soc'));let confirmed=false;
      if(soc<5||v.soc-soc>20){confirmed=confirm('Confirm this unusually low reading: '+soc+'%?');if(!confirmed)return;}
      await command('inspect',{vin:mobileVin,soc,twelveV:values.get('twelveV'),damage:values.has('damage'),suspected:values.has('suspected'),note:values.get('note'),confirm:confirmed});
      selected=mobileVin;go('detail');toast('Inspection saved. Alerts recalculated.');return;
    }
    if(f.id==='profile-form'){const p=D.profiles.find(p=>p.id===profileId),next={...p};for(const [key,val] of values)next[key]=Number(val);await command('profile',{profile:next});draft=null;render();toast('New profile version saved.');return;}
    if(f.id==='import-form'){if(offline&&!publicDemo)throw new Error('Start the .NET application to import a manifest.');const file=document.getElementById('csv-file').files[0];if(file.size>2000000)throw new Error('Maximum file size is 2 MB.');importResult=await command('import',{csv:await file.text()});render();return;}
    if(f.id==='stop-form'){await command('charge-stop',{vin:f.dataset.vin,soc:Number(values.get('soc')),kwh:values.get('kwh')===''?null:Number(values.get('kwh'))});closeModal();toast('Session completed and energy recorded.');}
  }catch(error){if(f.id==='login-form')login(error.message);else toast(error.message);}
});
document.addEventListener('input',e=>{
  if(e.target.id==='charging-search'){const value=e.target.value,pos=e.target.selectionStart;chargingQuery=value;render();const input=document.getElementById('charging-search');input.focus();input.setSelectionRange(pos,pos);}
  if(e.target.id==='search'){const value=e.target.value,pos=e.target.selectionStart;filter.q=value;offset=0;render();const input=document.getElementById('search');input.focus();input.setSelectionRange(pos,pos);}
  if(e.target.dataset.profileField){draft??={...D.profiles.find(p=>p.id===profileId)};draft[e.target.dataset.profileField]=Number(e.target.value);const affected=active().filter(v=>v.profile===profileId);document.getElementById('simulation').textContent=`${affected.filter(v=>evaluate(v,profile(v),true).length).length} vehicles with alerts now · ${affected.filter(v=>evaluate(v,draft,true).length).length} with these settings`;}
});
document.addEventListener('change',e=>{const id=e.target.id;if(id==='manufacturer')filter.fab=e.target.value;if(id==='zone')filter.zone=e.target.value;if(id==='status')filter.status=e.target.value;if(['manufacturer','zone','status'].includes(id)){offset=0;render();}if(id==='emergency-zone'){zoneId=e.target.value;render();}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeModal();const dialog=document.querySelector('.sheet');if(e.key==='Tab'&&dialog){const controls=[...dialog.querySelectorAll('button,input,select,textarea,a[href]')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
(async()=>{route();if(offline){D.orders={};D.audit=[];role='Admin';render();}else{try{await load();route();render();}catch{login();}}})();
