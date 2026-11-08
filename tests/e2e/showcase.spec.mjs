import {test,expect} from '@playwright/test';
test('case study and demo load without script, asset or network failures',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('./');await expect(page).toHaveTitle(/VoltYard/);await expect(page.locator('h1')).toBeVisible();
 const anchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>h.length>1));
 for(const anchor of anchors)expect(await page.locator(anchor).count(),anchor).toBeGreaterThan(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('showcase.png'),fullPage:true});
 await page.goto('./demo/');await expect(page.locator('h1')).toHaveText('What needs attention today?');
 await expect(page.locator('#session')).toContainText('Public sandbox');
 expect(await page.evaluate(()=>D.vehicles.length)).toBe(2000);
 expect(await page.evaluate(()=>D.zones.reduce((n,z)=>n+z.count,0))).toBe(2000);
 expect(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.includes('/api/')))).toBe(false);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await info.attach('browser-measurements.json',{body:JSON.stringify(await page.evaluate(()=>({navigationMs:performance.getEntriesByType('navigation')[0].duration,resourceBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.decodedBodySize,0),vehicles:D.vehicles.length}))),contentType:'application/json'});
 await page.screenshot({path:info.outputPath('dashboard.png'),fullPage:true});expect(errors).toEqual([]);
});
test('inspection persists through reload and browser history, report opens and reset restores fixture',async({page})=>{
 await page.goto('./demo/');
 const vin=await page.evaluate(()=>D.vehicles.find(v=>v.zone==='C-EV-3'&&v.soc<20&&v.twelveV==='OK').vin);
 await page.locator('[data-action="vehicles"]').first().click();
 await page.locator('#search').fill(vin);await page.locator('[data-action="detail"][data-vin="'+vin+'"]').first().click();
 await expect(page).toHaveURL(new RegExp('detail/'+vin));
 await page.locator('[data-action="inspect"][data-vin="'+vin+'"]').first().click();
 await page.locator('[name="soc"]').fill('18');await page.locator('[name="twelveV"]').selectOption('Weak');
 page.on('dialog',d=>d.accept());await page.locator('#inspection-form button[type="submit"]').click();
 await expect(page.locator('h1')).toContainText(vin);await page.reload();await expect(page.locator('h1')).toContainText(vin);
 expect(await page.evaluate(vin=>D.vehicles.find(v=>v.vin===vin).history.at(-1).twelveV,vin)).toBe('Weak');
 await page.locator('[data-action="report"]').first().click();await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog')).toContainText('Manual');await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.locator('[data-action="dashboard"]').first().click();await page.goBack();await expect(page.locator('h1')).toContainText(vin);
 await page.locator('[data-sandbox="reset"]').click();await expect(page.locator('h1')).toHaveText('What needs attention today?');expect(await page.evaluate(()=>D.audit.length)).toBe(0);
});
test('walkthrough navigation, import and download are usable',async({page})=>{
 await page.goto('./demo/?tour=1');await expect(page.getByLabel('Guided walkthrough')).toBeVisible();
 await page.locator('[data-sandbox="tour-next"]').click();await expect(page.locator('#inspection-form')).toBeVisible();
 await page.locator('[data-sandbox="tour-close"]').click();await page.reload();await expect(page.getByLabel('Guided walkthrough')).toHaveCount(0);
 await page.locator('[data-action="import"]').click();
 const response=await page.request.get('./demo/sample-manifest.csv');expect(response.ok()).toBe(true);
 await page.locator('#csv-file').setInputFiles({name:'manifest.csv',mimeType:'text/csv',buffer:await response.body()});
 await page.locator('#import-form button').click();await expect(page.locator('[role="status"]')).toContainText('40 imported');
 expect(await page.evaluate(()=>D.vehicles.length)).toBe(2040);
 await page.locator('[data-action="charging"]').click();const download=page.waitForEvent('download');
 await page.locator('[data-action="billing-csv"]').click();expect((await download).suggestedFilename()).toBe('voltyard-energy.csv');
});

test('invalid saved tab state recovers to a usable clean sandbox',async({page})=>{
 await page.goto('./demo/');await page.evaluate(()=>sessionStorage.setItem('voltyard-public-v1',JSON.stringify({sandboxVersion:1,vehicles:[{}]})));
 await page.reload();await expect(page.locator('h1')).toHaveText('What needs attention today?');expect(await page.evaluate(()=>D.vehicles.length)).toBe(2000);
});

test('charging and quarantine complete through visible user controls',async({page})=>{
 await page.goto('./demo/#charging');
 const vin=await page.locator('[data-action="charge-approve"]').first().getAttribute('data-vin');
 await page.locator('#charging-search').fill(vin);await page.locator('[data-action="charge-approve"][data-vin="'+vin+'"]').click();
 await page.locator('[data-action="charge-start"][data-vin="'+vin+'"]').click();
 await page.locator('[data-action="charge-stop"][data-vin="'+vin+'"]').click();
 const targetSoc=await page.evaluate(vin=>target(vehicle(vin)),vin);
 await page.locator('#stop-form [name="soc"]').fill(String(targetSoc));await page.locator('#stop-form [name="kwh"]').fill('14.2');
 await page.locator('#stop-form button').click();await expect(page.getByRole('dialog')).toHaveCount(0);
 expect(await page.evaluate(vin=>D.chargingSessions.filter(s=>s.vin===vin).at(-1).kwh,vin)).toBe(14.2);
 await page.goto('./demo/#detail/'+vin);await expect(page.locator('h1')).toContainText(vin);
 page.once('dialog',d=>d.accept('Synthetic battery concern for workflow verification'));
 await page.locator('[data-action="quarantine"]').click();
 await page.locator('[data-action="safety"]').first().click();await page.locator('[data-action="isolate"][data-vin="'+vin+'"]').click();
 const row=page.locator('tr').filter({has:page.locator('[data-action="decide"][data-vin="'+vin+'"]')});
 await row.locator('textarea').fill('short');await row.locator('[data-action="decide"]').click();
 await expect(page.locator('.toast')).toContainText('at least 10');expect(await page.evaluate(vin=>vehicle(vin).zone,vin)).toBe('Q-QUAR');
 await row.locator('textarea').fill('Synthetic review completed for demo release test');await row.locator('[data-action="decide"]').click();
 await expect(page.locator('.toast')).toContainText('Changes saved');expect(await page.evaluate(vin=>vehicle(vin).zone,vin)).toBe('B-EV-1');
});
