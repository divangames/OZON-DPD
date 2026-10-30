// Проверяет настоящую загрузку, воспроизведение, перемотку и переключение роликов.
const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const target=process.env.CHECK_URL||'http://127.0.0.1:4173';
const lessons=[['integration',128.384],['free-delivery',63.018],['paid-delivery',97.408]];
(async()=>{
 fs.mkdirSync('artifacts',{recursive:true});
 const browser=await chromium.launch({channel:'msedge',headless:process.env.PW_HEADLESS!=='false'});
 try{
  for(const width of [1440,1024,820,768,600,390,320]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   const errors=[];
   const mediaRequests=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
   page.on('request',request=>{if(request.url().includes('/tutorials/')&&request.url().endsWith('.mp4'))mediaRequests.push(request.url());});
   await page.goto(target,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(mediaRequests.length,0,'Видео не должно скачиваться при открытии страницы');
   assert.equal(await page.locator('[data-tutorial]').count(),3);
   assert.equal(await page.locator('a[href="#tutorials"]').count(),2);
   await page.locator('#tutorials').scrollIntoViewIfNeeded();
   const layout=await page.evaluate(()=>{
    const header=[...document.querySelector('.header').children].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.getBoundingClientRect());
    return{overflow:document.documentElement.scrollWidth>innerWidth,headerOverlap:header.some((a,i)=>header.slice(i+1).some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)),faqPadding:getComputedStyle(document.querySelector('.faq')).paddingTop};
   });
   assert.equal(layout.overflow,false,`Переполнение на ${width}px`);
   assert.equal(layout.headerOverlap,false,`Пересечение навигации на ${width}px`);
   assert.equal(layout.faqPadding,'0px');
   const video=page.locator('#tutorial-video');
   for(const [id,duration] of lessons){
    const button=page.locator(`[data-tutorial="${id}"]`);
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('[data-tutorial][aria-pressed="true"]').count(),1);
    assert.equal(await video.evaluate(v=>v.paused),true,'Смена инструкции не запускает звук автоматически');
    assert((await video.getAttribute('src')).endsWith(`/${id}.mp4`));
    if(width===1440||width===390){
     await video.focus();
     await page.keyboard.press('Space');
     await page.waitForFunction(()=>{const v=document.querySelector('#tutorial-video');return !v.paused&&v.currentTime>.2;},{},{timeout:15000});
     const metadata=await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,error:v.error?.message}));
     assert(Math.abs(metadata.duration-duration)<1,`Длительность ${id}`);
     assert.equal(metadata.width,1536);
     assert.equal(metadata.height,960);
     assert.equal(metadata.error,undefined);
     await video.evaluate(v=>{v.pause();v.currentTime=Math.floor(v.duration/2);});
     await page.waitForFunction(()=>{const v=document.querySelector('#tutorial-video');return !v.seeking&&v.readyState>=2;});
     assert.equal(await page.locator('.tutorial-error').isVisible(),false);
     console.log(`Воспроизведение и перемотка ${id}: ${width}px OK`);
    }
   }
   await page.locator('[data-tutorial="integration"]').click();
   await page.evaluate(()=>document.activeElement?.blur());
   const sectionHeight=await page.locator('#tutorials').evaluate(element=>Math.ceil(element.getBoundingClientRect().height));
   await page.setViewportSize({width,height:Math.max(900,sectionHeight+40)});
   await page.locator('#tutorials').scrollIntoViewIfNeeded();
   await page.locator('#tutorials').screenshot({path:`artifacts/tutorials-${width}.png`});
   await page.setViewportSize({width,height:900});
   if(width===390){
    await page.locator('[data-tutorial="free-delivery"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-tutorial="free-delivery"]').getAttribute('aria-pressed'),'true');
    await page.getByRole('button',{name:'Открыть меню',exact:true}).click();
    await page.locator('#mobile-nav').getByRole('link',{name:'Видеоинструкции'}).click();
    assert.equal(await page.locator('#mobile-nav').isVisible(),false);
    assert(new URL(page.url()).hash==='#tutorials');
   }
   assert.deepEqual(errors,[]);
   console.log(`Инструкции, навигация, отсутствие автозагрузки: ${width}px OK`);
   await page.close();
  }
  for(const [id] of lessons){
   const response=await fetch(new URL(`tutorials/${id}.mp4`,target.endsWith('/')?target:target+'/'),{headers:{Range:'bytes=0-1023'}});
   assert.equal(response.status,206,`Сервер должен поддерживать перемотку ${id}`);
   assert.match(response.headers.get('content-type'),/video\/mp4/);
   assert.match(response.headers.get('content-range'),/^bytes 0-1023\//);
   assert.equal((await response.arrayBuffer()).byteLength,1024);
  }
  console.log('Все видеоинструкции проверены; HTTP Range работает.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
