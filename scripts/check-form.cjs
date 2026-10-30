// Browser-only API mocks: checks the whole form without sending test messages to Telegram.
const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const target=process.env.CHECK_URL||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:process.env.PW_HEADLESS!=='false'});
 try{
  for(const width of [1440,768,390,320]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const sent=[];let fail=false;
   await page.route('**/api/leads',async route=>{sent.push(route.request().postDataJSON());await route.fulfill({status:fail?502:200,contentType:'application/json',body:JSON.stringify({ok:!fail})});});
   await page.goto(target,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const form=page.locator('#lead-form');await form.scrollIntoViewIfNeeded();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await form.getByRole('button',{name:'Отправить заявку'}).click();assert.equal(sent.length,0);
   await form.getByLabel('Ваше имя').fill('Проверка интерфейса');
   await page.locator('#lead-contact').fill('+7 999 000-00-00');
   await form.getByRole('radio',{name:'Telegram',exact:true}).check();await page.locator('#lead-contact').fill('@example_user');
   await form.getByRole('radio',{name:'MAX',exact:true}).check();await page.locator('#lead-contact').fill('https://max.ru/u/example-user');
   await form.getByRole('radio',{name:'Телефон',exact:true}).check();assert.equal(await page.locator('#lead-contact').inputValue(),'+7 999 000-00-00');
   for(const [channel,label,value] of [['phone','Телефон','+7 999 000-00-00'],['telegram','Telegram','@example_user'],['max','MAX','https://max.ru/u/example-user']]){
    await form.getByLabel('Ваше имя').fill('Проверка интерфейса');await form.getByRole('radio',{name:label,exact:true}).check();await page.locator('#lead-contact').fill(value);await form.getByRole('checkbox').check();
    await form.getByRole('button',{name:'Отправить заявку'}).click();await page.waitForFunction(()=>!document.querySelector('#lead-form').hasAttribute('aria-busy'));
    assert.equal(sent.at(-1).contactType,channel);assert.equal(sent.at(-1).contact,value);assert.equal(sent.at(-1).consent,true);assert.equal(await form.locator('.lead-status.is-error').count(),0);assert.equal(await form.locator('.lead-success').isVisible(),true);assert.match(await form.locator('.lead-success').innerText(),/Заявка отправлена/);assert.match(await form.locator('.lead-success-contact').innerText(),new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    if(width===390&&channel==='telegram')await form.screenshot({path:'artifacts/form-success-mobile.png'});
    await form.getByRole('button',{name:'Отправить ещё заявку'}).click();
   }
   fail=true;await form.getByLabel('Ваше имя').fill('Повторная попытка');await page.locator('#lead-contact').fill('+7 999 000-00-00');await form.getByRole('checkbox').check();await form.getByRole('button',{name:'Отправить заявку'}).click();await page.waitForFunction(()=>!document.querySelector('#lead-form').hasAttribute('aria-busy'));
   assert.equal(await form.locator('.lead-status.is-error').isVisible(),true);assert.equal(await form.getByLabel('Ваше имя').inputValue(),'Повторная попытка');const requestId=sent.at(-1).submissionId;
   fail=false;await form.getByRole('button',{name:'Отправить заявку'}).click();await page.waitForFunction(()=>!document.querySelector('#lead-form').hasAttribute('aria-busy'));assert.equal(sent.at(-1).submissionId,requestId);
   await form.getByRole('button',{name:'Отправить ещё заявку'}).click();await form.getByLabel('Ваше имя').fill('');await form.locator('.lead-status').evaluate(e=>e.hidden=true);await page.evaluate(()=>document.activeElement?.blur());
   const height=await form.evaluate(e=>Math.ceil(e.getBoundingClientRect().height));await page.setViewportSize({width,height:Math.max(900,height+80)});await form.scrollIntoViewIfNeeded();
   await form.screenshot({path:`artifacts/form-${width}.png`});
   console.log(`Форма: три способа, валидация, ошибка и повтор: ${width}px OK`);await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:900}});
  await page.route('**/api/leads',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
  await page.goto(target,{waitUntil:'networkidle'});const form=page.locator('#lead-form');await form.getByLabel('Ваше имя').fill('Проверка анимации');await page.locator('#lead-contact').fill('+7 999 000-00-00');await form.getByRole('checkbox').check();await form.getByRole('button',{name:'Отправить заявку'}).click();await form.locator('.lead-success').waitFor({state:'visible'});
  assert.equal(await form.locator('.lead-success-symbol path').evaluate(e=>getComputedStyle(e).animationName),'lead-success-check');
  await form.locator('.lead-success-symbol').evaluate(e=>Promise.all(e.getAnimations({subtree:true}).map(a=>a.finished)));
  assert.equal(await form.locator('.lead-success-symbol path').evaluate(e=>parseFloat(getComputedStyle(e).strokeDashoffset)),0);
  await form.screenshot({path:'artifacts/form-success-animated.png'});console.log('Анимированная зелёная галочка и отдельный экран успеха: OK');await page.close();
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
