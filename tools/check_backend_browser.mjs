/** Exercise the published .NET UI against its own disposable store. */
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdtempSync,mkdirSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const dll=resolve(process.env.VOLTYARD_PUBLISH_PATH||'/tmp/voltyard-publish/VoltYard.Api.dll');
assert.ok(existsSync(dll),'Publish src/VoltYard.Api to /tmp/voltyard-publish first, or set VOLTYARD_PUBLISH_PATH.');
const runtime=mkdtempSync(join(tmpdir(),'voltyard-browser-'));
const server=spawn('dotnet',[dll],{env:{...process.env,ASPNETCORE_ENVIRONMENT:'Development',Data__Path:join(runtime,'yard.json'),ASPNETCORE_URLS:'http://127.0.0.1:0',Demo__Password:'VoltYard-browser-test-only-2026'},stdio:['ignore','pipe','pipe']});
let log='',browser,base;
server.stdout.on('data',b=>{log+=b;});server.stderr.on('data',b=>{log+=b;});
try{
 let ready=false;
 for(let attempt=0;attempt<100;attempt++){
  assert.ok(server.exitCode===null&&server.signalCode===null,'Backend exited before becoming healthy.');
  base=log.match(/Now listening on: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
  if(base){try{ready=(await fetch(base+'/health')).ok;}catch{}}
  if(ready)break;await new Promise(r=>setTimeout(r,200));
 }
 assert.ok(ready,'Backend health timeout.');browser=await chromium.launch();
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const context=await browser.newContext({viewport}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await page.goto(base+'/');
  await page.locator('[name="password"]').fill('VoltYard-browser-test-only-2026');await page.locator('#login-form button').click();
  await page.locator('[data-action="vehicles"]').first().click();const vin=await page.evaluate(()=>D.vehicles[0].vin);
  await page.locator('#search').fill(vin);await page.locator('[data-action="detail"][data-vin="'+vin+'"]').click();
  await page.locator('[data-action="inspect"]').first().click();await page.locator('[name="soc"]').fill('40');await page.locator('[name="twelveV"]').selectOption('OK');await page.locator('#inspection-form button[type="submit"]').click();
  await page.waitForURL('**/#detail/'+vin);await page.reload();await page.locator('[data-action="report"]').first().click();await page.getByRole('dialog').waitFor();
  assert.match(await page.getByRole('dialog').innerText(),/Manual/);await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  mkdirSync('test-results/backend',{recursive:true});await page.screenshot({path:`test-results/backend/${viewport.width}.png`,fullPage:true});
  await page.locator('[data-action="logout"]').first().click();await page.locator('#login-form').waitFor();
  assert.equal(await page.evaluate(()=>D),null);assert.equal((await context.request.get(base+'/api/state')).status(),401);
  assert.deepEqual(errors,[]);console.log(`PASS backend browser ${viewport.width}: login, inspection, deep-link reload, report, overflow, logout and denied session.`);
  await context.close();
 }
}catch(error){console.error(log);throw error;}
finally{
 await browser?.close();
 if(server.exitCode===null&&server.signalCode===null){const exited=once(server,'exit');server.kill('SIGTERM');await exited;}
 rmSync(runtime,{recursive:true,force:true});
}
