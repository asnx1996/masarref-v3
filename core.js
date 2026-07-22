/* ============================================================
   core.js — الأدوات الحسابية الصافية (بلا Supabase وبلا رسم)
   منفصلة حتى تنفحص بصفحة الاختبارات tests.html
   ============================================================ */

/* ---------- أدوات ---------- */
const $ = id => document.getElementById(id);
/* العملة — نص العرض فقط (ما يمسّ أي حساب) */
const CURRENCIES = {
  iqd: { sym:'د.ع', pos:'after',  name:'دينار عراقي (د.ع)' },
  usd: { sym:'$',   pos:'before', name:'دولار ($)' }
};
let CURRENCY = 'iqd';
try{ CURRENCY = CURRENCIES[localStorage.getItem('mas_cur')] ? localStorage.getItem('mas_cur') : 'iqd'; }catch(_){}
const fmt = n => {
  const v = (Number(n)||0).toLocaleString('en-US');
  const c = CURRENCIES[CURRENCY] || CURRENCIES.iqd;
  return c.pos === 'before' ? c.sym + v : v + ' ' + c.sym;
};
const num = v => Number(String(v).replace(/[^\d.]/g,'')) || 0;
/* التاريخ حسب توقيت الجهاز (محلي) — مو UTC. لو استخدمنا toISOString()
   يطلع التاريخ ناقص من ١٢ الليل لـ٣ الصبح (بغداد UTC+3)، ومصروف أول
   الشهر الليلي كان يروح للشهر الماضي (وممكن يكون مقفل!) */
const localISO = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const todayISO = () => localISO(new Date());
const thisMonth = () => todayISO().slice(0,7);
const prevMonthStr = m => { let p=m.split('-').map(Number),y=p[0],mm=p[1]-1; if(mm<1){mm=12;y--;} return y+'-'+('0'+mm).slice(-2); };
const nextMonthStr = m => { let p=m.split('-').map(Number),y=p[0],mm=p[1]+1; if(mm>12){mm=1;y++;} return y+'-'+('0'+mm).slice(-2); };
const daysInMonth = m => { const p=m.split('-').map(Number); return new Date(p[0], p[1], 0).getDate(); };
/* تاريخ يقع جوّا الشهر المطلوب: لو اليوم من نفس الشهر ناخذه، وإلا
   أول يوم (لو الشهر جاي) أو آخر يوم (لو فات) — للحركات اللي لازم
   تنسجل بالشهر المعروض مثل إرجاع القرض */
const dateInMonth = m => {
  const t = todayISO();
  if(t.slice(0,7) === m) return t;
  return m + (m < t.slice(0,7) ? '-' + ('0'+daysInMonth(m)).slice(-2) : '-01');
};

function monthProgress(m){
  const total = daysInMonth(m);
  const cur = thisMonth();
  if(m < cur) return { elapsed: total, left: 0, total };
  if(m > cur) return { elapsed: 0, left: total, total };
  const day = new Date().getDate();
  return { elapsed: day, left: Math.max(0, total - day), total };
}

function toast(msg, isErr){
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isErr ? ' err' : '');
  clearTimeout(t._h);
  t._h = setTimeout(()=> t.className='toast', 2600);
}
function loading(on){ $('loader').className = on ? 'show' : ''; }

function liveFormat(input){
  input.addEventListener('input', () => {
    const n = num(input.value);
    input.value = n ? n.toLocaleString('en-US') : '';
  });
}

function esc(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ============================================================
   طابور الأوفلاين — مصاريف انسجلت بلا نت
   تنحفظ بالجهاز (localStorage) وتنرفع تلقائياً من يرجع الاتصال.
   ============================================================ */
const OFFLINE_KEY = 'mas_offline_exp';
function offlineList(){
  try{ const l = JSON.parse(localStorage.getItem(OFFLINE_KEY)); return Array.isArray(l) ? l : []; }
  catch(_){ return []; }
}
function offlineSave(list){ try{ localStorage.setItem(OFFLINE_KEY, JSON.stringify(list)); }catch(_){} }
function offlineAdd(item){
  const l = offlineList();
  item.qid = 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  l.push(item);
  offlineSave(l);
  return item.qid;
}
function offlineRemove(qid){ offlineSave(offlineList().filter(x => x.qid !== qid)); }
/* هل الخطأ سببه انقطاع نت (مو رفض من السيرفر)؟ */
function isNetErr(msg){
  if(typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(String(msg||''));
}
