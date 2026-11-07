import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const root=new URL('../',import.meta.url);
const seed=JSON.parse(readFileSync(new URL('demo/application-data.json',root),'utf8'));
const template=readFileSync(new URL('prototype/index.template.html',root),'utf8');
const ui=template.slice(template.indexOf('<script>')+8,template.indexOf("document.addEventListener('click'" )).replace('__DATA__','globalThis.seed');
const sandbox=readFileSync(new URL('showcase/sandbox.js',root),'utf8');
function app(){
 const storage=new Map();
 const context=vm.createContext({seed:structuredClone(seed),structuredClone,URLSearchParams,crypto:{randomUUID},
  location:{search:'',hash:''},sessionStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  document:{getElementById:()=>({insertAdjacentHTML(){},textContent:''}),createElement:()=>({}),body:{prepend(){}},addEventListener(){}},
  window:{scrollTo(){}},setTimeout,clearTimeout,confirm:()=>true});
 vm.runInContext(ui+'\nrender=()=>{};',context);vm.runInContext(sandbox,context);
 return {get:()=>vm.runInContext('D',context),run:code=>vm.runInContext(code,context),command:(action,body={})=>context.command(action,body)};
}
const target=d=>d.vehicles.find(v=>v.zone==='C-EV-3'&&v.soc<20&&v.twelveV==='OK');
test('invalid inspection rolls back every state change',async()=>{
 const a=app(),vin=target(a.get()).vin,before=JSON.stringify(a.get());
 await assert.rejects(a.command('inspect',{vin,soc:-1,twelveV:'OK'}),/SOC/);assert.equal(JSON.stringify(a.get()),before);
});
test('inspection is append-only, versioned and audited',async()=>{
 const a=app(),v=target(a.get()),n=v.history.length;await a.command('inspect',{vin:v.vin,soc:18,twelveV:'Weak',confirm:true});
 const after=a.get().vehicles.find(x=>x.vin===v.vin);assert.equal(after.history.length,n+1);assert.equal(after.history.at(-1).profileVersion,1);assert.equal(a.get().audit.at(-1).action,'inspect');
});
test('charging requires approval and a real arrival observation',async()=>{
 const a=app(),v=target(a.get());await assert.rejects(a.command('charge-start',{vin:v.vin}),/Approve/);
 a.get().vehicles.find(x=>x.vin===v.vin).history=[];await assert.rejects(a.command('charge-approve',{vin:v.vin}),/arrival inspection/);
});
test('charging reserves equipment, rejects duplicate transitions and records metered energy',async()=>{
 const a=app(),vin=target(a.get()).vin;await a.command('charge-approve',{vin});await a.command('charge-start',{vin});
 assert.equal(a.get().chargers.filter(l=>l.occupiedBy===vin).length,1);await assert.rejects(a.command('charge-start',{vin}),/Approve/);
 await assert.rejects(a.command('move',{vin,zone:'B-EV-1'}),/Stop charging/);
 await a.command('charge-stop',{vin,soc:45,kwh:14.2});assert.equal(a.get().chargingSessions.at(-1).kwh,14.2);assert.equal(a.get().chargingSessions.at(-1).estimatedKwh,false);
 assert.equal(a.get().chargers.filter(l=>l.occupiedBy===vin).length,0);await assert.rejects(a.command('charge-stop',{vin,soc:45}),/No running/);
});
test('quarantine blocks charging and requires a justified release',async()=>{
 const a=app(),vin=target(a.get()).vin;await a.command('quarantine',{vin,reason:'Fictional battery concern'});
 await assert.rejects(a.command('charge-approve',{vin}),/HSE review/);await a.command('move',{vin,zone:'Q-QUAR'});
 await assert.rejects(a.command('move',{vin,zone:'B-EV-1'}),/HSE must release/);
 const before=JSON.stringify(a.get());await assert.rejects(a.command('decide',{vin,decision:'Released',justification:'short'}),/justification/);assert.equal(JSON.stringify(a.get()),before);
 await a.command('decide',{vin,decision:'Released',justification:'Fictional issue reviewed and cleared'});assert.equal(a.get().vehicles.find(v=>v.vin===vin).zone,'B-EV-1');
});
test('direct quarantine movement creates an open review case',async()=>{
 const a=app(),vin=target(a.get()).vin;await a.command('move',{vin,zone:'Q-QUAR'});assert.equal(a.get().vehicles.find(v=>v.vin===vin).dossier.decision,'Open');
});
test('profile edit retains the prior version and rejects inverted thresholds',async()=>{
 const a=app(),p=structuredClone(a.get().profiles.find(p=>p.id==='VLT-BEV'));p.minStorageSoc=90;
 await assert.rejects(a.command('profile',{profile:p}),/critical/);p.minStorageSoc=31;await a.command('profile',{profile:p});
 assert.equal(a.get().profiles.find(p=>p.id==='VLT-BEV').version,2);assert.equal(a.get().profileHistory.at(-1).version,1);
});
test('quoted CSV fields, invalid VINs and duplicate imports are handled',async()=>{
 const a=app(),header='vin,brand,model,powertrain,kwh,manufacturerCode\n';
 const csv=header+'LVXEV0018TH200000,"Voltara, Demo",Voltara V5,BEV,60,VLT\nINVALID,Voltara,V5,BEV,60,VLT\n';
 // Use the generated manifest VIN to keep its valid check digit authoritative.
 const vin=readFileSync(new URL('demo/vessel-voltara-400.csv',root),'utf8').split('\n')[1].split(',')[0];
 const valid=csv.replace('LVXEV0018TH200000',vin),result=await a.command('import',{csv:valid});
 assert.equal(result.accepted,1);assert.equal(result.rejected,1);assert.equal(a.get().vehicles.at(-1).brand,'Voltara, Demo');
 const again=await a.command('import',{csv:valid});assert.equal(again.accepted,0);assert.equal(again.rejected,2);
});
test('malformed quoting is rejected without a partial import',async()=>{
 const a=app(),before=JSON.stringify(a.get());await assert.rejects(a.command('import',{csv:'vin,brand,model,powertrain,kwh,manufacturerCode\n"unfinished'}),/Unclosed/);assert.equal(JSON.stringify(a.get()),before);
});
test('manifest preserves invalid line numbers and respects arrival capacity',async()=>{
 const a=app(),csv=readFileSync(new URL('demo/vessel-voltara-400.csv',root),'utf8'),r=await a.command('import',{csv});
 assert.equal(r.accepted,40);assert.equal(r.rejected,360);assert.match(r.errors.find(e=>e.line===139).error,/VIN/);assert.match(r.errors.find(e=>e.line===290).error,/VIN/);
 assert.equal(a.get().zones.find(z=>z.code==='B-EV-1').count,520);
});
test('a second quarantine requires a new release decision',async()=>{
 const a=app(),vin=target(a.get()).vin;
 await a.command('move',{vin,zone:'Q-QUAR'});
 await a.command('decide',{vin,decision:'Released',justification:'Initial fictional concern reviewed'});
 await a.command('move',{vin,zone:'Q-QUAR'});
 assert.equal(a.get().vehicles.find(v=>v.vin===vin).dossier.decision,'Open');
 await assert.rejects(a.command('move',{vin,zone:'B-EV-1'}),/HSE must release/);
});
test('forecast uses the SOC observation date rather than the last manual inspection',()=>{
 const a=app(),codes=a.run(`(()=>{const v=structuredClone(D.vehicles.find(v=>v.profile==='VLT-BEV'));v.soc=32;v.lastInspection='2026-09-01';v.departure=null;v.zone='B-EV-1';v.history=[{t:'2026-09-01',soc:10,source:'Manual'},{t:'2026-09-28',soc:32,source:'Charging'}];return evaluate(v).map(a=>a.code);})()`);
 assert.equal(codes.includes('SOC_PREDICTED_LOW'),false);assert.equal(codes.includes('INSPECTION_OVERDUE'),true);
});
test('unobserved arrival creates an inspection requirement, not a false zero-SOC measurement',()=>{
 const a=app(),codes=a.run(`(()=>{const v=structuredClone(D.vehicles.find(v=>v.zone==='C-EV-3'));v.soc=0;v.history=[];return evaluate(v).map(a=>a.code);})()`);
 assert.equal(codes.length,1);assert.equal(codes[0],'INSPECTION_REQUIRED');
});
test('spreadsheet exports escape formula prefixes and quoted fields',()=>{
 const a=app();assert.equal(a.run(`csvCell('=1+1')`),`"'=1+1"`);assert.equal(a.run(`csvCell('@SUM(1)')`),`"'@SUM(1)"`);
 assert.equal(a.run(`csvCell('Voltara "Demo"')`),'"Voltara ""Demo"""');assert.equal(a.run(`csvCell(42)`),'"42"');assert.equal(a.run(`csvCell('  =1+1')`),`"'  =1+1"`);
});
