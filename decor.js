/* ============================================================
   بطاقة الساعة والحكمة (كمبيوتر)
   ============================================================ */
const QUOTES = [
  { ar:'القرش الأبيض ينفع باليوم الأسود.', en:'Save your white penny for a black day.' },
  { ar:'اللي يحسب فلوسه، فلوسه تحسبله مستقبله.', en:'Count your money, and it will count for your future.' },
  { ar:'الغنى مو بكثرة المال، الغنى بحسن التدبير.', en:'Wealth is not having much — it is managing well.' },
  { ar:'مصروف صغير كل يوم، جبل بآخر السنة.', en:'A small daily expense becomes a mountain by year\'s end.' },
  { ar:'دينار تدّخره اليوم، يفزعلك باچر.', en:'The dinar you save today will rescue you tomorrow.' },
  { ar:'لا تشتري بحاجتك للفرح، اشتري بحاجتك للشي.', en:'Buy because you need the thing, not because you need the joy.' },
  { ar:'الميزانية مو قيد — الميزانية حرية بخطة.', en:'A budget is not a cage — it is freedom with a plan.' },
  { ar:'اعرف وين تروح فلوسك، قبل ما تسأل وين راحت.', en:'Know where your money goes before asking where it went.' },
  { ar:'القناعة كنز لا يفنى.', en:'Contentment is a treasure that never runs out.' },
  { ar:'اللي ما يملك قوت يومه، يملكه ديْنه.', en:'Whoever does not own his daily bread is owned by his debt.' },
  { ar:'خطط لفلوسك، لا تخلي فلوسك تخطط إلك.', en:'Plan your money, or your money will plan you.' },
  { ar:'الادخار عادة، مو مبلغ.', en:'Saving is a habit, not an amount.' }
];
let quoteIdx = Math.floor(Math.random() * QUOTES.length);
/* ============================================================
   ساعة جدارية تناظرية بأشكال عالمية (كمبيوتر)
   ============================================================ */
const CLOCK_SKINS = [
  { id:'classic', name:'كلاسيكية', face:'#fff', ring:'#0D3B33', tick:'#0D3B33', num:'#0D3B33', hour:'#111', min:'#111', sec:'#C0392B', center:'#0D3B33', numerals:'arabic' },
  { id:'roman',   name:'رومانية فخمة', face:'#FBF7EC', ring:'#8A6D1D', tick:'#8A6D1D', num:'#6B531A', hour:'#3A2E0E', min:'#3A2E0E', sec:'#B8860B', center:'#8A6D1D', numerals:'roman' },
  { id:'minimal', name:'بسيطة عصرية', face:'#fff', ring:'#E5E7EB', tick:'#9CA3AF', num:'#111', hour:'#111', min:'#111', sec:'#10B981', center:'#111', numerals:'minimal' },
  { id:'dark',    name:'ليلية سوداء', face:'#1C1C22', ring:'#3A3A44', tick:'#6B7280', num:'#E5E7EB', hour:'#fff', min:'#fff', sec:'#F59E0B', center:'#fff', numerals:'latin' },
  { id:'london',  name:'بيغ بن (لندن)', face:'#F4ECD8', ring:'#2B2B2B', tick:'#2B2B2B', num:'#1A1A1A', hour:'#1A1A1A', min:'#1A1A1A', sec:'#7A1F1F', center:'#2B2B2B', numerals:'roman' },
  { id:'gold',    name:'ذهبية ملكية', face:'#12100B', ring:'#D4AF37', tick:'#D4AF37', num:'#D4AF37', hour:'#F5E6A8', min:'#F5E6A8', sec:'#fff', center:'#D4AF37', numerals:'roman' },
  // ---- أشكال عصرية وراقية جديدة ----
  { id:'swiss',    name:'سويسري نظيف', face:'#FFFFFF', ring:'#111111', tick:'#111111', num:'#111', hour:'#111111', min:'#111111', sec:'#E4002B', center:'#111111', numerals:'minimal', markers:'ticks', secDot:true },
  { id:'bauhaus',  name:'باوهاوس', face:'#F7F3E8', ring:'#1A1A1A', tick:'#1A1A1A', num:'#1A1A1A', hour:'#1A63C6', min:'#111111', sec:'#E4002B', center:'#E4002B', numerals:'latin', markers:'dots' },
  { id:'neon',     name:'نيون أورورا', face:'#0E1220', ring:'#37E0C8', tick:'#37E0C8', num:'#8FF0E4', hour:'#EAFDFB', min:'#EAFDFB', sec:'#37E0C8', center:'#37E0C8', numerals:'minimal', markers:'dots', glow:true, ringW:2.5 },
  { id:'emerald',  name:'زمردي فاخر', face:'#0E2A22', ring:'#D4AF37', tick:'#D4AF37', num:'#E8CF8A', hour:'#F5E6A8', min:'#F5E6A8', sec:'#FFFFFF', center:'#D4AF37', numerals:'roman', markers:'ticks' },
  { id:'pearl',    name:'لؤلؤي ناعم', face:'#ECECF2', ring:'#DDDDE6', tick:'#A9A9B8', num:'#5A5A66', hour:'#3A3A44', min:'#3A3A44', sec:'#2C8FB0', center:'#3A3A44', numerals:'minimal', markers:'four', soft:true },
  { id:'midnight', name:'منتصف الليل', face:'#141A33', ring:'#5A6488', tick:'#9AA4C8', num:'#C6CEEC', hour:'#EEF1FB', min:'#EEF1FB', sec:'#7CC4F0', center:'#C6CEEC', numerals:'minimal', markers:'dots' }
];
let clockIdx = parseInt(localStorage.getItem('mas_clock') || '0', 10) || 0;
function romanFor(n){ return ['','I','II','III','IIII','V','VI','VII','VIII','IX','X','XI','XII'][n]; }
// معرّف SVG للتوهّج (نيون) والوجه الناعم (نيومورفيزم) — نضيفه مرة حسب الشكل
function clockDefs(sk){
  let d = '';
  if(sk.soft) d += `<radialGradient id="clkSoft" cx="38%" cy="34%" r="82%"><stop offset="0%" stop-color="#FBFBFF"/><stop offset="100%" stop-color="#DFDFEA"/></radialGradient>`;
  if(sk.glow) d += `<filter id="clkGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  return d ? `<defs>${d}</defs>` : '';
}
function buildClockFace(sk){
  const cx=100, cy=100, R=94;
  const mk = sk.markers || 'ticks';
  const gf = sk.glow ? ' filter="url(#clkGlow)"' : '';
  let ticks='', nums='';
  if(mk === 'dots'){
    for(let i=0;i<12;i++){
      const a=(i/12)*2*Math.PI - Math.PI/2, r=82;
      ticks += `<circle cx="${(cx+r*Math.cos(a)).toFixed(1)}" cy="${(cy+r*Math.sin(a)).toFixed(1)}" r="${i%3===0?3.2:2}" fill="${sk.tick}"${gf}/>`;
    }
  } else if(mk === 'four'){
    for(let i=0;i<12;i++){
      const a=(i/12)*2*Math.PI - Math.PI/2, big=i%3===0, r1=big?76:84, r2=90;
      ticks += `<line x1="${(cx+r1*Math.cos(a)).toFixed(1)}" y1="${(cy+r1*Math.sin(a)).toFixed(1)}" x2="${(cx+r2*Math.cos(a)).toFixed(1)}" y2="${(cy+r2*Math.sin(a)).toFixed(1)}" stroke="${sk.tick}" stroke-width="${big?3:1.4}" opacity="${big?1:.5}" stroke-linecap="round"/>`;
    }
  } else {
    for(let i=0;i<60;i++){
      const a = (i/60)*2*Math.PI - Math.PI/2, big = i%5===0, r1 = big?80:85, r2=90;
      ticks += `<line x1="${cx+r1*Math.cos(a)}" y1="${cy+r1*Math.sin(a)}" x2="${cx+r2*Math.cos(a)}" y2="${cy+r2*Math.sin(a)}" stroke="${sk.tick}" stroke-width="${big?2.2:1}" opacity="${big?1:.5}"/>`;
    }
  }
  if(sk.numerals!=='minimal'){
    for(let h=1;h<=12;h++){
      const a=(h/12)*2*Math.PI - Math.PI/2, r=68;
      let label = h;
      if(sk.numerals==='roman') label=romanFor(h);
      else if(sk.numerals==='arabic') label=['','١','٢','٣','٤','٥','٦','٧','٨','٩','١٠','١١','١٢'][h];
      nums += `<text x="${cx+r*Math.cos(a)}" y="${cy+r*Math.sin(a)}" fill="${sk.num}" font-size="${sk.numerals==='roman'?13:15}" font-weight="700" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif">${label}</text>`;
    }
  }
  const faceFill = sk.soft ? 'url(#clkSoft)' : sk.face;
  return `${clockDefs(sk)}<circle cx="${cx}" cy="${cy}" r="${R}" fill="${faceFill}" stroke="${sk.ring}" stroke-width="${sk.ringW||5}"/>${ticks}${nums}`;
}
function renderClock(){
  const sk = CLOCK_SKINS[clockIdx % CLOCK_SKINS.length];
  const box = $('clockSkin');
  if(!box) return;
  const gf = sk.glow ? ' filter="url(#clkGlow)"' : '';
  box.innerHTML = `
    <svg viewBox="0 0 200 200" width="200" height="200">
      ${buildClockFace(sk)}
      <g id="clkH"><line x1="100" y1="100" x2="100" y2="55" stroke="${sk.hour}" stroke-width="5" stroke-linecap="round"${gf}/></g>
      <g id="clkM"><line x1="100" y1="100" x2="100" y2="35" stroke="${sk.min}" stroke-width="3.4" stroke-linecap="round"${gf}/></g>
      <g id="clkS"><line x1="100" y1="112" x2="100" y2="28" stroke="${sk.sec}" stroke-width="1.5" stroke-linecap="round"${gf}/>${sk.secDot?`<circle cx="100" cy="32" r="4.6" fill="${sk.sec}"/>`:''}</g>
      <circle cx="100" cy="100" r="4.5" fill="${sk.center}"/>
    </svg>`;
}
function tickClock(){
  const d = new Date();
  const s = d.getSeconds(), m = d.getMinutes(), h = d.getHours()%12;
  const sa = s*6, ma = m*6 + s*0.1, ha = h*30 + m*0.5;
  const H=$('clkH'), M=$('clkM'), S=$('clkS');
  if(H) H.setAttribute('transform', `rotate(${ha} 100 100)`);
  if(M) M.setAttribute('transform', `rotate(${ma} 100 100)`);
  if(S) S.setAttribute('transform', `rotate(${sa} 100 100)`);
}
function startDeco(){
  if(!$('clockSkin')) return;
  renderClock();
  tickClock();
  setInterval(tickClock, 1000);
  /* الساعة صارت دائرة صغيرة بالهيدر — التاريخ والحكمة انشالوا
     (الحكم صار يگولها شيرلوك 🕵️، وتغيير شكل الساعة من الإعدادات).
     ضغطة على الساعة نفسها هم تبدّل شكلها */
  $('clockSkin').addEventListener('click', () => {
    clockIdx = (clockIdx + 1) % CLOCK_SKINS.length;
    localStorage.setItem('mas_clock', clockIdx);
    renderClock(); tickClock();
    toast('شكل الساعة: ' + CLOCK_SKINS[clockIdx].name + ' 🕰');
  });
}

/* ============================================================
   خلفية السماء — تتدرّج مع ساعة اليوم (فجر/نهار/غروب/ليل)
   ============================================================ */
// أوقات اليوم للباليت الفعّال (الهندسة مشتركة، التدرّج يجي من الباليت)
function curPhases(){
  return PHASE_GEOM.map((g,i)=>({ h:g.h, sun:g.sun, x:g.x, y:g.y, grad:activePal.phases[i] }));
}
function skyPhaseFor(hr){
  const phases = curPhases();
  for(const p of phases){
    const [a,b] = p.h;
    if(a < b){ if(hr >= a && hr < b) return p; }
    else { if(hr >= a || hr < b) return p; } // يمر عبر منتصف الليل
  }
  return phases[phases.length-1];
}
let skyStarsBuilt = false, treesBuilt = false;
function buildTrees(){
  if(treesBuilt) return;
  const g = document.querySelector('#skyScene .trees');
  if(!g) return;
  // شجرة صنوبر واحدة نكررها بأحجام ومواقع مختلفة على طول الأفق
  const tree = (x, s, baseY) => {
    const p = (dx,dy)=>`${(x+dx*s).toFixed(1)},${(baseY+dy*s).toFixed(1)}`;
    return `<path d="M${p(0,0)} L${p(3.5,0)} L${p(3,-0.75)} L${p(3.3,-0.75)} L${p(2.7,-1.6)} L${p(3,-1.6)} L${p(2.4,-2.5)} L${p(2,-2.5)} L${p(1.4,-1.6)} L${p(1.7,-1.6)} L${p(1.1,-0.75)} L${p(1.4,-0.75)} L${p(0.9,0)} Z"/>`;
  };
  let html = '';
  for(let i=0;i<26;i++){
    const x = 10 + i*56 + (Math.random()*20-10);
    const s = 7 + Math.random()*6;
    const y = 472 + Math.random()*4;
    html += tree(x, s, y);
  }
  g.innerHTML = html;
  treesBuilt = true;
}
function buildStars(){
  if(skyStarsBuilt) return;
  const box = $('skyStars');
  if(!box) return;
  let html = '';
  for(let i=0;i<40;i++){
    const x = Math.random()*100, y = Math.random()*62, d = (Math.random()*3).toFixed(1), s = (1+Math.random()*1.6).toFixed(1);
    html += `<span class="star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;animation-delay:${d}s"></span>`;
  }
  box.innerHTML = html;
  skyStarsBuilt = true;
}
/* ============================================================
   ثيمات الفصول — «تلقائي» يتبع ساعة اليوم، وباقي الثيمات ثابتة.
   التدرّجات والجبال تجي من الباليت الفعّال (activePal) حتى تنسجم.
   ============================================================ */
// يبني ثيم فصل للباليت الفعّال (التدرّج من الباليت، الهندسة مشتركة)
function curSeasonTheme(key){
  const meta = SEASON_META[key];
  if(!meta || !activePal.seasons[key]) return null;
  return {
    grad: activePal.seasons[key],
    body: meta.body, x: meta.x, y: meta.y,
    mtn: (key === 'night') ? activePal.mtnNight : activePal.mtnDay,
    particles: meta.particles
  };
}

let skySeason = localStorage.getItem('mas_season') || 'auto';
let particlesKind = null;
function buildParticles(kind){
  const box = $('skyParticles');
  if(!box) return;
  if(particlesKind === kind) return;   // ما نعيد البناء بلا داعي
  particlesKind = kind;
  if(!kind){ box.innerHTML = ''; return; }
  let html = '';
  for(let i=0;i<26;i++){
    const left = (Math.random()*100).toFixed(1);
    const dur = (7 + Math.random()*9).toFixed(1);
    const delay = (Math.random()*10).toFixed(1);
    const drift = (Math.random()*90 - 45).toFixed(0);
    const sc = (0.6 + Math.random()*0.8).toFixed(2);
    html += `<i class="${kind}" style="left:${left}%;animation-duration:${dur}s;animation-delay:-${delay}s;--drift:${drift}px;scale:${sc}"></i>`;
  }
  box.innerHTML = html;
}
function setSeason(s){
  skySeason = s;
  localStorage.setItem('mas_season', s);
  updateSky();
}
function updateSky(){
  const sky = $('sky'), bodyEl = $('skyBody');
  if(!sky || !bodyEl) return;
  document.body.classList.add('sky-on');
  buildStars();
  buildTrees();

  const th = (skySeason === 'auto') ? null : curSeasonTheme(skySeason);
  let grad, isSun, x, y, mtn, parts;

  if(!th){
    const p = skyPhaseFor(new Date().getHours());
    grad = p.grad; isSun = p.sun; x = p.x; y = p.y;
    mtn = p.sun ? activePal.mtnDay : activePal.mtnNight;
    parts = null;
  }else{
    grad = th.grad; isSun = th.body !== 'moon'; x = th.x; y = th.y;
    mtn = th.mtn; parts = th.particles;
  }

  sky.style.background = grad;
  sky.classList.toggle('is-sun', isSun);
  sky.classList.toggle('is-moon', !isSun);
  bodyEl.style.left = x + '%';
  bodyEl.style.top = y + '%';
  bodyEl.style.transform = 'translateX(-50%)';
  sky.style.setProperty('--mtn1', mtn[0]);
  sky.style.setProperty('--mtn2', mtn[1]);
  sky.style.setProperty('--mtn3', mtn[2]);
  sky.style.setProperty('--mtn4', mtn[3]);
  buildParticles(parts);
}

/* ============================================================
   عمق خفيف بالماوس (Apple-style) — كمبيوتر فقط
   ============================================================ */
function initDepth(){
  if(document.documentElement.classList.contains('perf')) return;
  if(!window.matchMedia || !window.matchMedia('(hover:hover) and (min-width:1000px)').matches) return;
  let raf = null, tx = 0, ty = 0;
  window.addEventListener('pointermove', (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5);
    const cy = (e.clientY / window.innerHeight - 0.5);
    tx = cx; ty = cy;
    if(raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      // الخلفية (الشمس/القمر) تتحرك أبطأ = عمق
      const sb = $('skyBody');
      if(sb) sb.style.transform = `translateX(-50%) translate(${tx*-18}px, ${ty*-12}px)`;
      // طبقات الجبال والأشجار — كل طبقة تتحرك بمقدار مختلف (parallax)
      document.querySelectorAll('#skyScene [data-depth]').forEach(el => {
        const d = parseFloat(el.dataset.depth) || 0;
        el.style.transform = `translate(${tx*d}px, ${ty*d*0.4}px)`;
      });
      // الكروت المعلّمة depth تميل ميلان خفيف جداً (نستثني sum-card — يتكفّل بيها initAmbient بالميلان)
      document.querySelectorAll('.tab.active .depth:not(.sum-card)').forEach((el, i) => {
        const k = 1 + (i % 3) * 0.35;
        el.style.transform = `translate(${tx*6*k}px, ${ty*5*k}px)`;
      });
    });
  }, { passive: true });
}

/* ============================================================
   أنميشن تفاعلي مع الماوس — كمبيوتر فقط (Spotlight + ميلان اللوحة)
   ============================================================ */
function initAmbient(){
  if(document.documentElement.classList.contains('perf')) return;
  if(!window.matchMedia || !window.matchMedia('(hover:hover) and (min-width:1000px)').matches) return;
  document.body.classList.add('amb-on');
  let raf = null, curCard = null, ex = 0, ey = 0;
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest ? e.target.closest('.card,.sum-card,.env,.fund') : null;
    curCard = card; ex = e.clientX; ey = e.clientY;
    if(raf || !card) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      if(!curCard) return;
      const r = curCard.getBoundingClientRect();
      const px = (ex - r.left) / r.width, py = (ey - r.top) / r.height;
      curCard.style.setProperty('--mx', (px*100).toFixed(1) + '%');
      curCard.style.setProperty('--my', (py*100).toFixed(1) + '%');
      // توقيع اللوحة: ميلان بطاقة الملخص باتجاه المؤشر
      if(curCard.classList.contains('sum-card')){
        const rx = (px - 0.5) * 7, ry = (0.5 - py) * 7;
        curCard.style.transform = `perspective(900px) rotateY(${rx.toFixed(2)}deg) rotateX(${ry.toFixed(2)}deg)`;
      }
    });
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const sc = e.target.closest ? e.target.closest('.sum-card') : null;
    if(sc && (!e.relatedTarget || !sc.contains(e.relatedTarget))) sc.style.transform = '';
  }, { passive: true });
}

/* ============================================================
   سحب صف المصروف أفقياً للحذف (موبايل) — يشغّل نفس تأكيد الحذف
   ============================================================ */
function initSwipe(){
  const list = $('expList');
  if(!list) return;
  let sw = null;
  list.addEventListener('touchstart', (e) => {
    const exp = e.target.closest && e.target.closest('.exp');
    if(!exp || (e.target.closest && e.target.closest('.del')) || state.locked){ sw = null; return; }
    const t = e.touches[0];
    sw = { exp, x:t.clientX, y:t.clientY, dx:0, horiz:false };
  }, { passive:true });
  list.addEventListener('touchmove', (e) => {
    if(!sw) return;
    const t = e.touches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    if(!sw.horiz){
      if(Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) sw.horiz = true;
      else if(Math.abs(dy) > 10){ sw = null; return; }
      else return;
    }
    sw.dx = dx;
    sw.exp.style.transition = 'none';
    sw.exp.style.transform = 'translateX(' + dx.toFixed(0) + 'px)';
    const r = Math.min(1, Math.abs(dx) / 110);
    sw.exp.style.background = 'color-mix(in srgb, var(--red-soft) ' + (r*100).toFixed(0) + '%, var(--card))';
  }, { passive:true });
  const end = () => {
    if(!sw) return;
    const exp = sw.exp, dx = sw.dx, id = exp.dataset.id;
    exp.style.transition = 'transform .25s var(--ease), background .25s';
    exp.style.transform = '';
    exp.style.background = '';
    if(Math.abs(dx) > 100 && id){ setTimeout(() => { try{ delExpense(id); }catch(_){} }, 60); }
    sw = null;
  };
  list.addEventListener('touchend', end, { passive:true });
  list.addEventListener('touchcancel', end, { passive:true });
}

/* ============================================================
   الأصوات — نغمات قصيرة تتولّد بالكود (Web Audio) بلا أي ملفات
   فرح للإضافات المالية، وحزينة خفيفة للصرف
   ============================================================ */
const SND = { on: localStorage.getItem('mas_snd') !== 'off', ctx: null };
function sndCtx(){
  if(!SND.ctx){ try{ SND.ctx = new (window.AudioContext || window.webkitAudioContext)(); }catch(_){ SND.ctx = null; } }
  if(SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume();
  return SND.ctx;
}
function playTones(notes){
  if(!SND.on) return;
  const ctx = sndCtx();
  if(!ctx) return;
  const t0 = ctx.currentTime;
  notes.forEach(n => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = n.type || 'sine';
    o.frequency.value = n.f;
    const st = t0 + n.t, en = st + n.d;
    g.gain.setValueAtTime(0, st);
    g.gain.linearRampToValueAtTime(n.v ?? 0.18, st + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, en);
    o.connect(g); g.connect(ctx.destination);
    o.start(st); o.stop(en + 0.02);
  });
}
function showFace(emoji){
  if(!SND.on) return;
  const el = $('emojiFace');
  if(!el) return;
  el.textContent = emoji;
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
}
// نغمة فرح صاعدة (دو-مي-صول-دو) — للإضافات المالية والإيداع
function sndHappy(){ playTones([
  {f:523.25,t:0,d:0.14},{f:659.25,t:0.10,d:0.14},{f:783.99,t:0.20,d:0.16},{f:1046.5,t:0.32,d:0.28,v:0.2}
]); showFace('🤑'); }
// نغمة هابطة خفيفة (مي-ريب) — للصرف
function sndSad(){ playTones([
  {f:392,t:0,d:0.18,type:'triangle'},{f:311.13,t:0.14,d:0.30,type:'triangle',v:0.16}
]); showFace('😢'); }
// تكة خفيفة للحذف/الإلغاء
function sndTick(){ playTones([{f:180,t:0,d:0.12,type:'square',v:0.09}]); }

/* ============================================================
   موسيقى الخلفية — موزارت (بتحكم صوت، تبدي بأول ضغطة من المستخدم)
   ============================================================ */
const MUSIC = { audio: null, on: false, vol: parseFloat(localStorage.getItem('mas_musicvol') || '0.18'), want: localStorage.getItem('mas_music') === 'on' };
function ensureAudio(){
  if(MUSIC.audio) return MUSIC.audio;
  const a = new Audio('./mozart-bg.mp3');
  a.loop = true;
  a.volume = MUSIC.vol;
  a.preload = 'none';
  MUSIC.audio = a;
  return a;
}
function openMusic(){
  const pct = Math.round(MUSIC.vol * 100);
  modalOpen(`
    <h2>🎵 موسيقى الخلفية</h2>
    <div class="hint" style="margin:0 0 12px">موزارت — كونشيرتو الكمان رقم ٥، الحركة الثانية (Adagio). هادئة تناسب المتابعة.</div>
    <button class="btn" id="mzToggle">${MUSIC.on ? '⏸ إيقاف' : '▶ تشغيل'}</button>
    <label style="margin-top:14px">مستوى الصوت — <span id="mzVal">${pct}%</span></label>
    <input type="range" id="mzVol" min="0" max="100" value="${pct}" style="width:100%">
    <div class="hint" style="margin-top:6px">اختيارك ينحفظ بالجهاز. الموسيقى تشتغل بهذا الجهاز بس، ما تنسمع عند غيرك.</div>
    <button class="btn ghost" onclick="modalClose()" style="margin-top:14px">إغلاق</button>
  `);
  $('mzToggle').onclick = () => { toggleMusic(); $('mzToggle').textContent = MUSIC.on ? '⏸ إيقاف' : '▶ تشغيل'; };
  $('mzVol').oninput = (e) => {
    MUSIC.vol = e.target.value / 100;
    $('mzVal').textContent = e.target.value + '%';
    if(MUSIC.audio) MUSIC.audio.volume = MUSIC.vol;
    localStorage.setItem('mas_musicvol', MUSIC.vol);
  };
}
function toggleMusic(){
  const a = ensureAudio();
  if(MUSIC.on){ a.pause(); MUSIC.on = false; MUSIC.want = false; localStorage.setItem('mas_music','off'); }
  else{ a.play().then(()=>{ MUSIC.on = true; MUSIC.want = true; localStorage.setItem('mas_music','on'); }).catch(()=> toast('اضغط مرة ثانية لتشغيل الموسيقى', true)); }
}
// تشغيل تلقائي بأول لمسة إذا المستخدم مفعّلها من قبل (سياسة المتصفح تمنع بلا لمسة)
function musicFirstTouch(){
  if(MUSIC.want && !MUSIC.on){
    const a = ensureAudio();
    a.play().then(()=>{ MUSIC.on = true; }).catch(()=>{});
  }
}

