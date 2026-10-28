const {chromium}=require('@playwright/test');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});
try{for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},hasTouch:width===390});
 await page.clock.install();await page.goto(process.env.CHECK_URL||'http://127.0.0.1:4173',{waitUntil:'networkidle'});
 const card=page.locator('.order-receipt');const state=()=>card.getAttribute('data-demo-state');
 await card.scrollIntoViewIfNeeded();await page.waitForTimeout(100);
 const initial=Number(await state()),initialHeight=(await card.boundingBox()).height;
 for(let i=1;i<=3;i++){await page.clock.fastForward(6100);assert.equal(await state(),String((initial+i)%3),'automatic sequence');assert.equal((await card.boundingBox()).height,initialHeight,'stable height');}
 for(const index of [2,0,2,1])await page.locator(`[data-demo-step="${index}"]`).click();
 await page.clock.fastForward(8000);assert.equal(await state(),'1','manual reading interval');await page.clock.fastForward(2200);assert.equal(await state(),'2','resume after manual');
 await page.getByRole('button',{name:'Приостановить автопоказ',exact:true}).click();const paused=await state();await page.clock.fastForward(12000);assert.equal(await state(),paused,'pause');
 await page.locator('[data-demo-step="0"]').click();await page.clock.fastForward(20000);assert.equal(await state(),'0','manual selection preserves pause');
 for(let i=0;i<3;i++){await page.getByRole('button',{name:'Продолжить автопоказ',exact:true}).click();await page.getByRole('button',{name:'Приостановить автопоказ',exact:true}).click();}
 await page.getByRole('button',{name:'Продолжить автопоказ',exact:true}).click();await page.clock.fastForward(6100);assert.equal(await state(),'1','resume once without duplicate timers');
 await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(100);const offscreen=await state();await page.clock.fastForward(12000);assert.equal(await state(),offscreen,'offscreen pause');
 await card.scrollIntoViewIfNeeded();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);const reduced=await state();await page.clock.fastForward(12000);assert.equal(await state(),reduced,'reduced motion');
 await page.locator('[data-demo-step="0"]').click();assert.equal(await state(),'0','manual with reduced motion');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-demo-step="0"]').focus();await page.keyboard.press('Tab');await page.waitForTimeout(100);await page.clock.fastForward(12000);assert.equal(await state(),'0','keyboard focus pause');
 console.log(width,'autoplay, manual, pause/resume, offscreen, reduced motion, keyboard OK');await page.close();
}}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
