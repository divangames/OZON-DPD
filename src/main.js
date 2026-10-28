// Сборка презентационной страницы и подключение доступных интерактивных элементов.
import './styles/main.css';
import {icon} from './components/icons';
import {cabinet, requirements, steps, faqs} from './components/content';

const logo = `<img src="./images/logo.svg" width="190" height="33" alt="OZON × DPD" />`;
const connect = `${cabinet}/registration`;
document.querySelector('#app').innerHTML = `
<header class="header wrap">
  <a class="logo" href="#" aria-label="OZON × DPD — главная">${logo}</a>
  <nav class="desktop-nav" aria-label="Главное меню"><a href="#how">Как это работает</a><a href="#features">Возможности</a><a href="#pricing">Тарифы</a><a href="#faq">Вопросы</a></nav>
  <a class="login" href="${cabinet}/login" target="_blank" rel="noopener">Личный кабинет ${icon('arrow')}</a>
  <button class="menu-toggle" aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Мобильное меню" hidden><a href="#how">Как это работает</a><a href="#features">Возможности</a><a href="#pricing">Тарифы</a><a href="#faq">Вопросы</a><a href="${cabinet}/login">Личный кабинет</a></nav>
<main id="main">
 <section class="hero wrap" aria-labelledby="hero-title">
  <div class="hero-copy"><h1 id="hero-title">Доставка <br><span>без рутины.</span></h1><p class="lead">Заказы из OZON. Накладные DPD. <br>Одна интеграция — и всё работает вместе.</p><p class="hero-description">Автоматическое создание накладных по вашему договору. Без ручного ввода и переключения между сервисами.</p>
   <div class="hero-actions"><a class="button" href="${connect}" target="_blank" rel="noopener">Подключить интеграцию ${icon('arrow')}</a><a class="text-link" href="#how">Как это работает ${icon('arrow')}</a></div>
   <div class="hero-proof">${icon('shield')} Работаем через официальные API</div>
  </div>
  <div class="hero-visual" aria-label="Интерактивная демонстрация обработки заказа">
   <div class="visual-top"><span>OZON × DPD</span><span class="connection"><i></i> API-связь</span></div>
   <div class="brand-flow"><span class="ozon-word">OZON</span><span class="flow-track"><i></i><i></i><i></i></span><span class="dpd-word">${icon('box')} dpd</span></div>
   <div class="shipment" data-ui><div class="shipment-top">${icon('box')}<span>Путь вашего заказа</span><span class="demo-label">Пример</span></div><div class="shipment-main"><span class="order-name">Заказ готов. <br>Дальше — автоматически.</span><div class="shipment-icon">${icon('document')}</div></div><div class="shipment-status"><span class="status-dot"></span><span id="demo-status">Заказ готов к отгрузке</span>${icon('check')}</div></div>
   <div class="flow-controls" role="group" aria-label="Этапы обработки">${steps.map((s,i)=>`<button class="flow-button ${i===0?'active':''}" data-step="${i}" aria-pressed="${i===0}"><span>${i+1}</span>${['Заказ','Накладная','Трек-номер'][i]}</button>`).join('')}</div>
   <div class="visual-bottom"><span>Меньше действий. Больше отправлений.</span>${icon('arrow')}</div>
  </div>
 </section>
 <div class="benefit-strip wrap"><div>${icon('link')} <span>OZON + DPD <br><strong>в одной интеграции</strong></span></div><div>${icon('document')} <span>Накладные <br><strong>по вашему договору</strong></span></div><div>${icon('check')} <span>Трек-номера <br><strong>сразу в заказах OZON</strong></span></div></div>
 <section class="audience wrap section" id="about"><div class="section-intro"><h2>Вы продаёте. <br>Мы связываем.</h2><p>Для продавцов, которые хотят заниматься бизнесом, а не переносить данные из одного кабинета в другой.</p></div><div class="requirements">${requirements.map(([h,p])=>`<article class="requirement">${icon('check')}<div><h3>${h}</h3><p>${p}</p></div></article>`).join('')}</div></section>
 <section class="how section" id="how"><div class="wrap"><div class="section-heading"><h2>От заказа до накладной.</h2><p>Вы собираете заказ. <br>Интеграция берёт на себя следующий шаг.</p></div><div class="process-grid">${steps.map(([h,p,status],i)=>`<article class="process-step"><span class="step-no">${i+1}</span><div class="process-document" data-ui><span class="status-dot"></span><span>${status}</span><span class="mini-brand ${i===1?'red':''}">${i===1?'DPD':'OZON'}</span></div><h3>${h}</h3><p>${p}</p></article>`).join('')}</div><p class="process-note">${icon('shield')} Данные передаются через официальные API OZON и DPD.</p></div></section>
 <section class="features wrap section" id="features"><div class="section-heading"><h2>Всё под контролем.</h2><p>Одна связка вместо ежедневных <br>повторяющихся действий.</p></div><div class="feature-board"><article class="feature-main"><div><h3>Два кабинета. <br>Один рабочий процесс.</h3><p>Настройте связь между магазином OZON и DPD. Сервис передаст данные для создания накладной и вернёт трек-номер в заказ.</p><a class="text-link" href="${cabinet}" target="_blank" rel="noopener">Открыть личный кабинет ${icon('arrow')}</a></div><div class="connection-art"><span>OZON</span><div class="connector-line"><i></i>${icon('link')}<i></i></div><span>${icon('box')} dpd</span></div></article><article class="feature-side"><div class="feature-symbol">${icon('document')}</div><h3>Ваш договор. <br>Ваши отправления.</h3><p>Работайте с DPD по своему договору. Интеграция автоматизирует обмен данными между сервисами.</p><span class="feature-signature">OZON <span>×</span> DPD</span></article></div></section>
 <section class="cabinet-section section wrap" id="cabinet"><div class="cabinet-copy"><h2>Начните <br>с подключения.</h2><p>В личном кабинете настройте API-доступы и связь способов доставки. Сохранённые настройки станут основой автоматической обработки заказов.</p><ul class="plain-list"><li>${icon('check')} Доступ к интеграции в браузере</li><li>${icon('check')} Подключение API OZON и DPD</li><li>${icon('check')} Единая точка управления</li></ul><a class="button" href="${cabinet}/login" target="_blank" rel="noopener">Перейти в кабинет ${icon('arrow')}</a></div><div class="cabinet-image"><div class="browser-chrome"><span><i></i><i></i><i></i></span><span>space.dpd-ozon.ru</span>${icon('shield')}</div><img src="./images/cabinet-login.webp" width="1440" height="1000" loading="lazy" alt="Реальный экран входа в личный кабинет OZON × DPD: почта, пароль и регистрация"/><p>Личный кабинет OZON × DPD</p></div></section>
 <section class="pricing section" id="pricing"><div class="wrap"><div class="section-heading"><h2>Под ваш объём.</h2><p>Выберите количество отправлений. <br>Мы поможем с подключением.</p></div><div class="pricing-trial">${icon('box')}<strong>Начните с теста</strong><span>20 успешно обработанных заказов — тестовый период по условиям сайта-образца.</span></div><div class="pricing-grid">${[[300,'3 800'],[500,'4 800'],[1000,'5 800']].map(([n,p],i)=>`<article class="price-plan ${i===1?'recommended':''}"><div class="plan-title"><h3>До ${n.toLocaleString('ru-RU')} <br>отправлений</h3></div><div class="price">${p}<span> ₽</span></div><ul><li>${icon('check')} Автоматическое создание накладных</li><li>${icon('check')} Передача трек-номеров в OZON</li><li>${icon('check')} Ваш договор с DPD</li></ul><a class="button ${i===1?'white':'secondary'}" href="${connect}" target="_blank" rel="noopener" aria-label="Подключить тариф до ${n} отправлений">Выбрать тариф ${icon('arrow')}</a></article>`).join('')}</div><div class="extra-shop"><div><strong>Несколько магазинов?</strong><p>Сумма отправлений считается по всем магазинам.</p></div><span>+ 1 500 ₽ <small>за дополнительный магазин</small></span></div><p class="pricing-disclaimer">Цены и тестовый период перенесены с <a href="https://cdek-ozon.ru/" target="_blank" rel="noopener">сайта-образца</a>. Актуальные тарифы и условия OZON × DPD уточняйте при подключении. Стоимость доставки DPD оплачивается отдельно.</p></div></section>
 <section class="faq wrap section" id="faq"><div class="faq-title"><h2>Есть вопросы? <br>Уже отвечаем.</h2><p>Всё, что нужно знать <br>перед подключением.</p><a class="text-link" href="${cabinet}" target="_blank" rel="noopener">Перейти в сервис ${icon('arrow')}</a></div><div class="faq-items">${faqs.map(([q,a],i)=>`<details ${i===0?'open':''}><summary>${q}${icon('plus')}</summary><p>${a}</p></details>`).join('')}</div></section>
 <section class="cta wrap"><div><h2>Доставляйте. <br>Без лишних действий.</h2><p>Соедините OZON и DPD. <br>И освободите время для своего бизнеса.</p><a class="button white" href="${connect}" target="_blank" rel="noopener">Подключить интеграцию ${icon('arrow')}</a></div><div class="cta-mark" aria-hidden="true">${icon('link')}</div><span class="cta-bottom">OZON × DPD <span>Связь, которая работает.</span></span></section>
</main>
<footer class="footer wrap"><div class="footer-top"><a class="logo" href="#" aria-label="На главную">${logo}</a><p>Интеграция для тех, <br>кто ценит своё время.</p><nav aria-label="Меню в подвале"><a href="#how">Как это работает</a><a href="#pricing">Тарифы</a><a href="#faq">Вопросы</a></nav><a class="text-link" href="${cabinet}/login" target="_blank" rel="noopener">Личный кабинет ${icon('arrow')}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} OZON × DPD</span><p>Сайт носит информационный характер и не является публичной офертой. <br>Товарные знаки OZON и DPD принадлежат их правообладателям.</p><a href="#main">Наверх ↑</a></div></footer>`;

// Переключает этапы демонстрации без имитации реальных отправлений.
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
 const index = Number(button.dataset.step);
 document.querySelectorAll('[data-step]').forEach(item => {const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
 document.querySelector('#demo-status').textContent=steps[index][3];
 document.querySelector('.order-name').innerHTML=['Заказ готов. <br>Дальше — автоматически.','Накладная создана. <br>По вашему договору.','Трек-номер в OZON. <br>Можно отправлять.'][index];
 document.querySelector('.shipment-icon').innerHTML=icon(['box','document','check'][index]);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelector('.shipment').animate([{transform:'translateY(5px)',opacity:.6},{transform:'translateY(0)',opacity:1}],{duration:250});
}));
// Управляет мобильным меню и закрывает его после перехода или Escape.
const menuButton=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('.mobile-nav');
function setMenu(open){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menuButton.innerHTML=icon(open?'close':'menu');mobileMenu.hidden=!open;}
menuButton.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);}});
// Объявляет изменения статуса вспомогательным технологиям.
document.querySelector('#demo-status').setAttribute('aria-live','polite');
// Однократные появления сохраняют содержимое доступным без JavaScript и при reduced motion.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{transform:'translateY(20px)',opacity:.45},{transform:'translateY(0)',opacity:1}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});observer.unobserve(entry.target);}}),{threshold:.12});
 document.querySelectorAll('.section h2,.section-heading>p,.requirement,.process-step,.feature-main,.feature-side,.price-plan,.faq-items,.cabinet-image').forEach(el=>observer.observe(el));
}
