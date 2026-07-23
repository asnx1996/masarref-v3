/* ============================================================
   holmes.js — شيرلوك هولمز 🕵️ شخصية اللوحة المتحركة
   يتمشى بأسفل اللوحة، يحقق، يفكر بالبايب، ينام بالليل،
   وينطي حكم ونصايح + ملاحظات تحقيقية من بياناتك (state._insights).
   رسم SVG أصلي (شيرلوك ملك عام من ٢٠٢٣) + حركة CSS خالصة — صفر مكتبات.
   ينطفي من الإعدادات، ويحترم «تقليل الحركة» بالجهاز.
   ============================================================ */

let HOLMES_ON = localStorage.getItem('mas_holmes') !== 'off';
const HOLMES_REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- الرسم ---------- */
function holmesSVG(){
  return `
  <svg viewBox="0 0 62 92" width="62" height="92" role="img" aria-label="شيرلوك هولمز">
    <g class="hl-in">
      <g class="hl-l1" style="transform-origin:26px 68px"><rect x="24" y="66" width="5" height="16" rx="2.5" fill="#2C2C2A"/></g>
      <g class="hl-l2" style="transform-origin:36px 68px"><rect x="34" y="66" width="5" height="16" rx="2.5" fill="#2C2C2A"/></g>
      <path d="M18 40 L44 40 L48 70 L14 70 Z" fill="#5F5E5A"/>
      <path d="M14 40 L48 40 L52 54 L44 50 L18 50 L10 54 Z" fill="#444441"/>
      <g class="hl-mag" style="transform-origin:49px 50px">
        <rect x="47" y="48" width="4" height="14" rx="2" fill="#5F5E5A"/>
        <line x1="49" y1="62" x2="53" y2="72" stroke="#854F0B" stroke-width="3" stroke-linecap="round"/>
        <circle cx="55" cy="77" r="6.5" fill="#B5D4F4" fill-opacity=".8" stroke="#854F0B" stroke-width="2.5"/>
      </g>
      <circle cx="31" cy="26" r="13" fill="#F5C4B3"/>
      <g class="hl-eyes" style="transform-origin:31px 24px">
        <circle cx="26.5" cy="24" r="2" fill="#2C2C2A"/>
        <circle cx="35.5" cy="24" r="2" fill="#2C2C2A"/>
      </g>
      <g class="hl-lids">
        <path d="M24.5 24 h4" stroke="#2C2C2A" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M33.5 24 h4" stroke="#2C2C2A" stroke-width="1.6" stroke-linecap="round"/>
      </g>
      <path class="hl-mouth" d="M26 32 q5 3.5 10 0" stroke="#993C1D" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M17 22 a14 12 0 0 1 28 0 Z" fill="#444441"/>
      <path d="M15 22 h32 l4 4 h-40 Z" fill="#2C2C2A"/>
      <path d="M28 10 q3 -5 6 0 Z" fill="#2C2C2A"/>
      <rect x="43" y="30" width="9" height="2.5" rx="1.2" fill="#712B13" transform="rotate(24 43 30)"/>
      <circle cx="52" cy="35.5" r="2.6" fill="#712B13"/>
      <g class="hl-puffs">
        <circle class="hl-puff" cx="56" cy="30" r="2.4" fill="#B4B2A9" style="animation-delay:0s"/>
        <circle class="hl-puff" cx="55" cy="31" r="1.8" fill="#B4B2A9" style="animation-delay:1.1s"/>
      </g>
      <text class="hl-zzz" x="42" y="10" font-size="9">💤</text>
    </g>
  </svg>`;
}

/* ---------- البناء ---------- */
function holmesInit(){
  if($('holmesStrip')) return;
  const strip = document.createElement('div');
  strip.id = 'holmesStrip';
  strip.setAttribute('aria-hidden', 'true');
  strip.innerHTML = `<div id="holmesChar"><div class="hl-bubble" id="holmesBubble"></div><div class="hl-body">${holmesSVG()}</div></div>`;
  document.body.appendChild(strip);
  /* ضغطة على شيرلوك = حكمة أو ملاحظة */
  $('holmesChar').addEventListener('click', () => { holmesSay(); });
}

/* ---------- الحالة ---------- */
let hlX = 24, hlTimer = null, hlBubbleTimer = null;

function holmesActive(){
  const dash = document.getElementById('tab-dash');
  return HOLMES_ON && !HOLMES_REDUCED &&
         typeof session !== 'undefined' && !!session &&
         !!dash && dash.classList.contains('active');
}
function holmesRefresh(){
  document.body.classList.toggle('holmes-on', HOLMES_ON);   // يخفي حكمة الساعة (هولمز يقولها)
  const show = holmesActive();
  document.body.classList.toggle('holmes-show', show);
  if(show && !hlTimer){ hlTimer = setTimeout(holmesLoop, 700); }
  if(!show && hlTimer){ clearTimeout(hlTimer); hlTimer = null; }
}
function holmesSet(cls){
  const ch = $('holmesChar');
  if(!ch) return;
  ch.classList.remove('walk','inspect','think','sleep','celebrate');
  if(cls) ch.classList.add(cls);
}

/* ---------- دورة الحياة: مشي / تحقيق / تفكير / كلام / نوم ---------- */
function holmesLoop(){
  hlTimer = null;
  if(!holmesActive()){ holmesRefresh(); return; }
  const hour = new Date().getHours();
  const night = (hour >= 23 || hour < 6);
  const r = Math.random();
  let next = 3500 + Math.random() * 3500;

  if(night && r < .6){
    holmesSet('sleep');
    next = 9000;
  }else if(r < .4){
    /* مشوار لنقطة عشوائية بالعرض */
    holmesSet('walk');
    const ch = $('holmesChar');
    const max = Math.max(90, (window.innerWidth || 360) - 95);
    const target = Math.round(12 + Math.random() * (max - 12));
    const dist = Math.abs(target - hlX);
    const dur = Math.max(1.3, dist / 55);   // سرعة ~55 بكسل بالثانية
    ch.classList.toggle('flip', target > hlX);
    ch.style.transitionDuration = dur.toFixed(2) + 's';
    ch.style.left = target + 'px';
    hlX = target;
    next = dur * 1000 + 300;
  }else if(r < .58){
    holmesSet('inspect');
    next = 3000;
  }else if(r < .74){
    holmesSet('think');
    next = 4200;
  }else if(r < .92){
    holmesSet('');
    holmesSay();
  }else{
    holmesSet('');
  }
  hlTimer = setTimeout(holmesLoop, next);
}

/* ---------- الكلام: ملاحظات التحقيق + الحكم + تعليقات ---------- */
const HOLMES_FLAVOR = [
  'همم… ملف مصاريف هذا الشهر مثير للاهتمام 🔍',
  'عزيزي واطسون، الادخار عادة مو صدفة',
  'أراقب كل دينار — ماكو شي يفلت من التحقيق 🕵️',
  'الأدلة الأولية تشير إلى إدارة مالية ذكية',
  'عندما تستبعد الصرف الزائد، فما يتبقى هو الادخار مهما بدا صعباً',
  'القضية البسيطة: اعرف وين تروح فلوسك',
  'لاحظت شيئاً؟ أنا ألاحظ كل شي 👁️'
];
function holmesLines(){
  const tips = (typeof state !== 'undefined' && Array.isArray(state._insights)) ? state._insights : [];
  const quotes = (typeof QUOTES !== 'undefined') ? QUOTES.map(q => q.ar) : [];
  return tips.concat(quotes, HOLMES_FLAVOR);
}
function holmesSay(txt){
  const lines = holmesLines();
  holmesBubble(txt || lines[Math.floor(Math.random() * lines.length)] || '');
}
function holmesBubble(txt){
  const b = $('holmesBubble');
  if(!b || !txt) return;
  b.textContent = txt;
  b.classList.add('show');
  clearTimeout(hlBubbleTimer);
  hlBubbleTimer = setTimeout(() => b.classList.remove('show'), 4800);
}

/* ---------- ردود أفعال من التطبيق (إضافة مصروف / إيداع...) ---------- */
window.holmesReact = (kind) => {
  try{
    if(!holmesActive()) return;
    clearTimeout(hlTimer); hlTimer = null;
    if(kind === 'celebrate'){
      holmesSet('celebrate');
      holmesBubble('أحسنت! القضية تتقدم بالاتجاه الصحيح 🎩');
    }else if(kind === 'expense'){
      holmesSet('inspect');
      holmesBubble('همم… مصروف جديد. مثير للاهتمام 🔍');
    }else if(kind === 'warn'){
      holmesSet('inspect');
      holmesBubble('الأدلة تشير لتجاوز بالميزانية… انتبه ⚠️');
    }
    hlTimer = setTimeout(holmesLoop, 3200);
  }catch(_){}
};

/* ---------- التشغيل/الإيقاف من الإعدادات ---------- */
window.setHolmes = (on) => {
  HOLMES_ON = !!on;
  try{ localStorage.setItem('mas_holmes', on ? 'on' : 'off'); }catch(_){}
  holmesRefresh();
  toast(on ? 'شيرلوك باشر التحقيق 🕵️' : 'شيرلوك راح يرتاح 😴');
};

/* ---------- انطلاق ---------- */
try{
  holmesInit();
  holmesRefresh();
  setInterval(holmesRefresh, 1200);   // يراقب تبديل التبويب/الجلسة بخفة
}catch(_){ /* الديكور كمالي — التطبيق يشتغل بدونه */ }
