// Real browser regression: animated mobile scenes, bounded drag, reduced motion and fallback.
const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const target=process.env.CHECK_URL||'http://127.0.0.1:4173';
const frames=page=>page.evaluate(()=>new Promise(resolve=>{let n=0;function frame(){if(++n===35)resolve();else requestAnimationFrame(frame);}frame();}));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const width of [1440,390]){
   const page=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(target,{waitUntil:'networkidle'});
   for(const selector of ['#connection-scene','.parcel-scene','.flow-scene']){
    const scene=page.locator(selector);await scene.scrollIntoViewIfNeeded();await scene.locator('canvas').waitFor();
    const before=await scene.screenshot();await frames(page);const after=await scene.screenshot();assert(!before.equals(after),`${selector} should animate at ${width}`);
   }
   const canvas=page.locator('#connection-scene canvas');await canvas.scrollIntoViewIfNeeded();
   const box=await canvas.boundingBox();const x=box.x+box.width/2,y=box.y+box.height/2;
   if(width===390){
    const cdp=await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+70,y:y+3}]});
    assert(await page.locator('.hero-art').evaluate(e=>e.classList.contains('dragging')),'Touch drag starts');
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await frames(page);
    assert(!await page.locator('.hero-art').evaluate(e=>e.classList.contains('dragging')),'Touch drag releases');
    const top=await page.evaluate(()=>scrollY);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
    for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*18}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await frames(page);
    assert(await page.evaluate(()=>scrollY)>top+40,'Vertical touch scroll stays native');
   }else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+90,y+15,{steps:10});await page.mouse.up();}
   await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,0));await frames(page);
   const staticA=await canvas.screenshot();await frames(page);const staticB=await canvas.screenshot();assert(staticA.equals(staticB),'Reduced motion freezes 3D');
   assert.deepEqual(errors,[]);console.log(`Motion, drag, reduced motion: ${width}px OK`);await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:900}});
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args);};});
  await page.goto(target,{waitUntil:'networkidle'});
  for(const selector of ['#connection-scene','.parcel-scene','.flow-scene']){await page.locator(selector).scrollIntoViewIfNeeded();assert(await page.locator(`${selector} .scene-fallback`).isVisible());}
  console.log('No-WebGL fallback: OK');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
