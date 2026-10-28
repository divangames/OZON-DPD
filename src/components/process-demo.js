import {icon} from './icons';

// Illustrative workflow only: no real customer, order or tracking identifiers.
export const processDemo=`<div class="order-receipt" data-ui data-demo-state="0">
 <div class="receipt-top"><span>${icon('box')} Путь заказа</span><span>Демонстрация</span></div>
 <div class="demo-stage">
  <div class="demo-panel" data-demo-panel="0"><div class="demo-brand">OZON <span>Заказ собран</span></div><div class="demo-package">${icon('box')}<span>Отправление<br><strong>Готово к передаче</strong></span></div><div class="demo-checks"><span>${icon('check')} Товары собраны</span><span>${icon('check')} Данные получателя готовы</span></div></div>
  <div class="demo-panel" data-demo-panel="1" hidden><div class="demo-waybill"><div class="waybill-heading"><strong>DPD</strong>${icon('document')}</div><p>Накладная создана</p><div class="waybill-route"><span>Отправитель</span>${icon('arrow')}<span>Получатель</span></div><div class="demo-barcode" aria-hidden="true"></div><span class="waybill-caption">Образец документа · ваш договор DPD</span></div></div>
  <div class="demo-panel" data-demo-panel="2" hidden><div class="demo-return"><strong>DPD</strong><span>${icon('arrow')}</span><strong>OZON</strong></div><div class="demo-tracking">${icon('check')}<span>Трек-номер<br><strong>прикреплён к заказу</strong></span></div><div class="demo-checks"><span>${icon('check')} Накладная в DPD</span><span>${icon('check')} Статус обновлён в OZON</span></div></div>
 </div>
 <div class="demo-switcher" role="group" aria-label="Демонстрация этапов">${['Заказ','Накладная','Трек'].map((label,i)=>`<button type="button" data-demo-step="${i}" aria-pressed="${i===0}" class="${i===0?'active':''}">${label}</button>`).join('')}</div>
 <div class="receipt-status"><span class="live-dot"></span><span id="demo-status" aria-live="polite">Заказ готов к отгрузке</span>${icon('check')}</div>
</div>`;

export function selectDemo(index,reduced){
 const card=document.querySelector('.order-receipt');
 if(card.dataset.demoState===String(index))return;
 card.dataset.demoState=String(index);
 card.querySelectorAll('[data-demo-panel]').forEach(panel=>{panel.getAnimations().forEach(a=>a.cancel());panel.hidden=panel.dataset.demoPanel!==String(index);if(!panel.hidden&&!reduced)panel.animate([{opacity:.3,transform:'translateY(8px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:240,easing:'cubic-bezier(.23,1,.32,1)'});});
 card.querySelectorAll('[data-demo-step]').forEach(button=>{const active=button.dataset.demoStep===String(index);button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
