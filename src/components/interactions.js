// Доступные действия: этапы обработки, реальные экраны, тарифы и навигация.
import {icon} from './icons';
import {steps} from './content';
// Инициализирует состояния презентации, не меняя данные внешнего сервиса.
export function initInteractions(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-nav');
 // Синхронизирует видимость меню и доступное название кнопки.
 function setMenu(open){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menuButton.innerHTML=icon(open?'close':'menu');menu.hidden=!open;}
 menuButton.addEventListener('click',()=>setMenu(menu.hidden));
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',event=>{if(event.key==='Escape')setMenu(false);});
 document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-step]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  document.querySelector('#demo-status').textContent=steps[Number(button.dataset.step)][3];
 }));
 const tabs=[...document.querySelectorAll('[data-screen]')];
 // Меняет настоящий скриншот и обеспечивает управление вкладками с клавиатуры.
 function selectScreen(button){tabs.forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.querySelector(`#screen-${tab.dataset.screen}`).hidden=!active;});}
 tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>selectScreen(button));
  button.addEventListener('keydown',event=>{const move={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[event.key];if(move||event.key==='Home'||event.key==='End'){event.preventDefault();const next=tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+move+tabs.length)%tabs.length];selectScreen(next);next.focus();}});
 });
 document.querySelectorAll('[data-volume]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-volume]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  document.querySelector('#selected-price').textContent=button.dataset.price;
  document.querySelector('#selected-volume').textContent=Number(button.dataset.volume).toLocaleString('ru-RU');
  document.querySelector('#tariff-link').setAttribute('aria-label',`Подключить тариф до ${button.dataset.volume} отправлений`);
 }));
 // Содержимое видно до анимации и при reduced motion; появления запускаются однократно.
 if(!reduced.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:.4,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.23,1,.32,1)'});observer.unobserve(entry.target);}}),{threshold:.13});document.querySelectorAll('.section h2,.workspace-visual,.capability-blue,.capability-list article,.requirements li,.pricing-console,.faq-items,.closing h2').forEach(item=>observer.observe(item));}
}
