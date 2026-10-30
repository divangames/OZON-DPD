const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const target=process.env.CHECK_URL||'http://127.0.0.1:4173';
const ids=['dpd','ozon','tariffs','products'];
async function swipe(page,from,to,y){
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from,y}]});
 for(let step=1;step<=6;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from+(to-from)*step/6,y}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:process.env.PW_HEADLESS!=='false'});
 try{
  for(const width of [1440,768,390,320]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',hasTouch:width<=390,isMobile:width<=390});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(target,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const gallery=page.getByRole('dialog');
   for(const id of ids){
    await page.locator(`[data-screen="${id}"]`).click();await page.locator(`#screen-${id} a`).click();
    assert.equal(await gallery.isVisible(),true);assert((await gallery.locator('img').getAttribute('src')).endsWith(`${id}.webp`));
    await gallery.locator('img').evaluate(img=>img.decode());
    const geometry=await gallery.evaluate(e=>{const b=e.getBoundingClientRect(),img=e.querySelector('img').getBoundingClientRect(),info=e.querySelector('.gallery-footer').getBoundingClientRect();return{fits:b.left>=0&&b.right<=innerWidth+1&&b.top>=0&&b.bottom<=innerHeight+1,infoBelow:info.top>=img.bottom-1};});
    assert.equal(geometry.fits,true,`Диалог должен помещаться ${width}`);assert.equal(geometry.infoBelow,true,'Информация под изображением');
    await page.keyboard.press('Escape');assert.equal(await gallery.isVisible(),false);assert.equal(await page.locator(`#screen-${id} a`).evaluate(e=>e===document.activeElement),true);
   }
   await page.locator('[data-screen="dpd"]').click();await page.locator('#screen-dpd a').click();
   await gallery.getByRole('button',{name:'Следующий экран'}).click();assert.match(await gallery.locator('.gallery-counter').innerText(),/2 \/ 4/);
   await page.keyboard.press('ArrowRight');assert.match(await gallery.locator('.gallery-counter').innerText(),/3 \/ 4/);
   await page.keyboard.press('ArrowLeft');await gallery.getByRole('button',{name:'Предыдущий экран'}).click();assert.match(await gallery.locator('.gallery-counter').innerText(),/1 \/ 4/);
   await gallery.getByRole('button',{name:'Предыдущий экран'}).click();assert.match(await gallery.locator('.gallery-counter').innerText(),/4 \/ 4/);
   await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.querySelector('.screen-gallery').contains(document.activeElement)),true,'Фокус остаётся в модальном окне');
   if(width<=390){
    const box=await gallery.locator('.gallery-stage').boundingBox();const y=box.y+box.height/2;
    await swipe(page,box.x+box.width*.8,box.x+box.width*.2,y);assert.match(await gallery.locator('.gallery-counter').innerText(),/1 \/ 4/);
    await swipe(page,box.x+box.width*.2,box.x+box.width*.8,y);assert.match(await gallery.locator('.gallery-counter').innerText(),/4 \/ 4/);
   }
   await gallery.getByRole('button',{name:'Увеличить изображение',exact:true}).click();assert.equal(await gallery.locator('.gallery-stage').evaluate(e=>e.scrollWidth>e.clientWidth||e.scrollHeight>e.clientHeight),true);
   await gallery.getByRole('button',{name:'Уменьшить изображение',exact:true}).click();
   await gallery.screenshot({path:`artifacts/gallery-${width}.png`});
   await gallery.getByRole('button',{name:'Закрыть просмотр'}).click();assert.equal(await gallery.isVisible(),false);
   const questions=page.locator('.faq-question');
   for(const question of await questions.all()){
    const open=await question.getAttribute('aria-expanded')==='true';await question.click();assert.equal(await question.getAttribute('aria-expanded'),String(!open));assert.equal(await page.locator('.faq-question[aria-expanded="true"]').count(),open?0:1);
   }
   await questions.nth(1).focus();await page.keyboard.press('Enter');assert.equal(await questions.nth(1).getAttribute('aria-expanded'),'true');
   const card=page.locator('.order-receipt');await page.locator('[data-demo-step="2"]').click();const before=await card.boundingBox();await page.locator('[data-demo-step="3"]').click();const after=await card.boundingBox();assert(Math.abs(before.height-after.height)<2,'Высота карточки стабильна между 03 и 04');assert.equal(await page.locator('.demo-status-card').isVisible(),true);assert.equal(await page.locator('[data-demo-panel="3"] .demo-return').count(),0);
   await card.screenshot({path:`artifacts/demo-status-${width}.png`});
   assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   console.log(`Галерея, фокус, клавиши, FAQ и статус: ${width}px OK`);await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:900}});await page.goto(target,{waitUntil:'networkidle'});await page.locator('.faq-question').nth(1).click();
  assert.equal(await page.locator('#faq-answer-1').evaluate(e=>parseFloat(getComputedStyle(e).transitionDuration)>0),true,'Раскрытие FAQ анимировано');await page.locator('.faq-question').nth(2).click();await page.locator('.faq-question').nth(1).click();await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));assert.equal(await page.locator('.faq-question[aria-expanded="true"]').count(),1);
  console.log('Плавное раскрытие и быстрое переключение FAQ: OK');await page.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
