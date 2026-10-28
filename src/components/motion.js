import {animate, spring} from 'motion';

// Touch and mouse share the same interruptible press feedback.
export function initMotion(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const controls=new Map();
 const pressables=document.querySelectorAll('.button,.volume-option,.screen-tab,.menu-toggle,.closing-arrow');
 function settle(element,pressed){
  controls.get(element)?.stop();
  if(reduced.matches){element.style.transform='';return;}
  controls.set(element,animate(element,{transform:pressed?'scaleX(1.025) scaleY(.94)':'scaleX(1) scaleY(1)'},pressed?{duration:.12,ease:[.23,1,.32,1]}:{type:spring,duration:.5,bounce:.2}));
 }
 pressables.forEach(element=>{
  element.addEventListener('pointerdown',()=>settle(element,true));
  ['pointerup','pointercancel','pointerleave','blur'].forEach(event=>element.addEventListener(event,()=>settle(element,false)));
 });
 reduced.addEventListener('change',()=>{if(reduced.matches){controls.forEach(control=>control.stop());pressables.forEach(element=>element.style.transform='');}});
}
