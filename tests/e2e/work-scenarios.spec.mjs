import {test,expect} from '@playwright/test';
async function start(page,index){
 page.on('dialog',dialog=>dialog.accept());
 if(index===0){await page.goto('./demo/?tour=1');await page.locator('#nav [data-action="scenarios"]').click();}else await page.goto('./demo/#scenarios');
 await page.locator('[data-action="scenario-start"]').nth(index).click();
 await expect(page.getByLabel('Scenario progress')).toBeVisible();await expect(page.getByLabel('Guided walkthrough')).toHaveCount(0);
 const vin=await page.evaluate(()=>D.scenario.vin);
 await page.locator('.work-card [data-action="task-edit"]').first().click();
 const kind=await page.locator('#task-form').getAttribute('data-kind');
 await page.locator('#task-form [name="owner"]').selectOption(kind==='safety'?'hse':'operator');
 const date=await page.evaluate(()=>D.referenceDate);
 await page.locator('#task-form [name="dueAt"]').fill(date+'T11:00');
 await page.locator('#task-form button[type="submit"]').click();return {vin,date};
}
test('departure scenario reaches its goal through observed workflows and survives refresh',async({page})=>{
 const {vin,date}=await start(page,0);
 await page.locator('[data-action="scenario-next"]').click();await page.locator('#inspection-form [name="soc"]').fill('18');
 await page.locator('#inspection-form [name="twelveV"]').selectOption('OK');await page.locator('#inspection-form button[type="submit"]').click();
 await page.locator('[data-action="scenario-next"]').click();await page.locator('#departure').fill(date);await page.locator('#destination').selectOption('Truck');await page.locator('[data-action="plan"]').click();
 await page.locator('[data-action="scenario-next"]').click();await page.locator('[data-action="charge-approve"]').click();await page.locator('[data-action="charge-start"]').click();await page.locator('[data-action="charge-stop"]').click();
 const target=await page.evaluate(vin=>target(vehicle(vin)),vin);await page.locator('#stop-form [name="soc"]').fill(String(target));await page.locator('#stop-form [name="kwh"]').fill('14.2');await page.locator('#stop-form button').click();
 await page.locator('[data-action="scenario-next"]').click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('[data-action="scenario-next"]').click();await page.locator('[data-action="depart"]').click();
 await expect(page.getByLabel('Scenario progress')).toContainText('Goal achieved');await page.reload();await expect(page.getByLabel('Scenario progress')).toContainText('Goal achieved');
 await page.locator('#nav [data-action="shift"]').click();await page.locator('#task-view').selectOption('completed');expect(await page.locator('.work-card').count()).toBeGreaterThan(0);
});
test('quarantine scenario completes only after justified release and report review',async({page})=>{
 const {vin}=await start(page,1);await page.locator('[data-action="scenario-next"]').click();
 const isolate=page.locator('[data-action="isolate"][data-vin="'+vin+'"]');if(await isolate.count())await isolate.click();
 const row=page.locator('tr').filter({has:page.locator('[data-action="decide"][data-vin="'+vin+'"]')});
 await row.locator('select').selectOption('Released');await row.locator('textarea').fill('short');await row.locator('[data-action="decide"]').click();
 await expect(page.getByLabel('Scenario progress')).not.toContainText('Goal achieved');
 await row.locator('textarea').fill('Fictional HSE review completed for training only');await row.locator('[data-action="decide"]').click();
 await page.locator('[data-action="scenario-next"]').click();await page.keyboard.press('Escape');await expect(page.getByLabel('Scenario progress')).toContainText('Goal achieved');
});
test('personal shift retains owner and deadline, supports rescheduling and unassignment',async({page})=>{
 const {vin,date}=await start(page,0);
 await page.locator('[data-action="scenario-end"]').click();await page.locator('#task-account').selectOption('operator');await page.locator('#task-view').selectOption('mine');
 const card=page.locator('.work-card').first();await expect(card).toContainText(vin);await expect(card).toContainText('Overdue');await expect(card).toContainText('(+50)');
 await page.reload();await page.locator('#task-query').fill(vin);await expect(page.locator('.work-card').first()).toContainText('operator');
 await page.locator('.work-card [data-action="task-edit"]').first().click();await page.locator('#task-form [name="dueAt"]').fill(date+'T17:00');await page.locator('#task-form button[type="submit"]').click();
 await expect(page.locator('.work-card').first()).not.toContainText('Overdue');
 await page.locator('.work-card [data-action="task-edit"]').first().click();await page.locator('[data-action="task-unassign"]').click();
 await expect(page.getByRole('heading',{name:'No tasks in this view'})).toBeVisible();
 await page.locator('[data-action="task-unassigned"]').click();await expect(page.locator('.work-card').first()).toContainText('Unassigned');
});
