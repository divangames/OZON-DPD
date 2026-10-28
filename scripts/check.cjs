// Проверка готовой сборки и основных взаимодействий в реальном браузере.
const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const target=process.env.CHECK_URL||'http://127.0.0.1:4173';
// Собирает ошибки загрузки, переполнения, изображений и управления на разных ширинах.
(async()=>{
 fs.mkdirSync(path.resolve('artifacts'),{recursive:true});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const errors=[];
 try{
  for(const width of [1440,1280,768,390,320]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',response=>{if(response.status()>=400)errors.push(`HTTP ${response.status()}: ${response.url()}`);});
   await page.goto(target,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('.scene-ready canvas').waitFor({timeout:15000});
   await page.evaluate(async()=>{for(const image of document.images){image.loading='eager';await image.decode().catch(()=>{});}});
   const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),h1:document.querySelectorAll('h1').length,deadLinks:[...document.querySelectorAll('a')].filter(a=>a.hash&&a.hash!=='#'&&!document.getElementById(a.hash.slice(1))).map(a=>a.hash)}));
   if(result.overflow||result.broken.length||result.deadLinks.length||result.h1!==1)errors.push(JSON.stringify({width,...result}));
   await page.getByRole('button',{name:'3 Трек-номер',exact:true}).click();
   if(await page.locator('#demo-status').textContent()!=='Заказ готов к отправке')errors.push(`Демонстрация: ${width}`);
   await page.getByRole('button',{name:'1 Заказ',exact:true}).click();
   for(const id of ['ozon','tariffs','products','dpd']){await page.locator(`[data-screen="${id}"]`).click();if(!await page.locator(`#screen-${id}`).isVisible())errors.push(`Экран ${id}: ${width}`);}
   for(const [volume,price] of [[300,'3 800'],[1000,'5 800'],[500,'4 800']]){await page.locator(`[data-volume="${volume}"]`).click();if(await page.locator('#selected-price').textContent()!==price)errors.push(`Тариф ${volume}: ${width}`);}
   await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
   const faq=page.locator('details').nth(1);await faq.locator('summary').click();
   if(!await faq.getAttribute('open')&&await faq.getAttribute('open')!== '')errors.push(`FAQ: ${width}`);
   if(width<=800){await page.getByRole('button',{name:'Открыть меню',exact:true}).click();if(!await page.locator('#mobile-nav').isVisible())errors.push(`Меню: ${width}`);await page.keyboard.press('Escape');if(await page.locator('#mobile-nav').isVisible())errors.push(`Закрытие меню: ${width}`);}
   await page.evaluate(()=>scrollTo(0,0));
   await page.evaluate(()=>document.activeElement?.blur());
   await page.screenshot({path:`artifacts/${width}.png`,fullPage:true});
   console.log(`Проверено ${width}px: ${JSON.stringify(result)}`);
   await page.close();
  }
 }finally{await browser.close();}
 if(errors.length){console.error(errors);process.exitCode=1;}else console.log('Все проверки пройдены.');
})();
