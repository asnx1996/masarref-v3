/* ============================================================
   إعدادات Supabase — رابط المشروع + المفتاح العلني (Publishable)
   ============================================================ */
const SUPABASE_URL = "https://rcpwavfgxrqzgxclqwss.supabase.co";
const SUPABASE_KEY = "sb_publishable_d6EVDwJ4-neRBjtXathxxA_yXqpKUMD";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   الباليتات (الثيمات) — كل باليت يجمع: لون الموقع + سماء منسّقة معه
   لمّا يختار المستخدم باليت من الإعدادات، يتغيّر لون الواجهة وتتصبغ
   كل السماء (نهار/غروب/ليل + الفصول) بنفس العائلة اللونية.
   (هذا كله ألوان/بيانات عرض — ما يمسّ أي حساب أو استدعاء بيانات)
   ============================================================ */
const DEFAULT_PAL = 'ocean';
// ألوان الرسم البياني (الدونات) — تُضبط حسب الباليت الفعّال
let PALETTE = ['#2C8FB0','#E0A24E','#2FA98A','#5E8AC0','#4EA5C0','#8A6AB0','#5EB0A0','#C08A5E','#5B9AB8','#3F9E9E'];

const PALETTES = {
  sand: {
    name:'دفء رملي 🏜️', primary:'#C0603F', amber:'#DE9A3A', green:'#3F9E7A',
    chart:['#C0603F','#DE9A3A','#6E8B5B','#3F9E7A','#C99A5B','#A56A55','#7D9A88','#D98C6A','#8E7B63','#B5793A'],
    mtnDay:['#C79A72','#A9784F','#835A3B','#5E3E28'], mtnNight:['#4A3550','#3A283F','#2A1B2E','#1C1220'],
    phases:[
      'linear-gradient(160deg,#FCE7C8 0%,#F6C9A8 45%,#E9A6A0 100%)',
      'linear-gradient(160deg,#F5DCB8 0%,#FBEAD2 55%,#FEF6EA 100%)',
      'linear-gradient(160deg,#F3C889 0%,#F9E0B0 55%,#FEF3DC 100%)',
      'linear-gradient(160deg,#EEB878 0%,#F2D2A0 55%,#F7E6CB 100%)',
      'linear-gradient(160deg,#7A5E86 0%,#C57B6B 52%,#F0A968 100%)',
      'linear-gradient(170deg,#241528 0%,#3A2438 55%,#4A3048 100%)'
    ],
    seasons:{
      spring:'linear-gradient(160deg,#F5DCC6 0%,#FBEADD 55%,#FCEFEA 100%)',
      summer:'linear-gradient(160deg,#F3C57D 0%,#F9DFA6 50%,#FEF3CE 100%)',
      autumn:'linear-gradient(160deg,#F4CE93 0%,#E9A96B 50%,#C87E55 100%)',
      winter:'linear-gradient(160deg,#DFCDBE 0%,#EFE2D5 55%,#FAF3EB 100%)',
      night:'linear-gradient(160deg,#241528 0%,#3A2438 55%,#4A3048 100%)',
      sunset:'linear-gradient(160deg,#F7B267 0%,#F0855C 48%,#B56B8E 100%)',
      sea:'linear-gradient(160deg,#5FB6C0 0%,#9FD6CE 45%,#EEE0CC 100%)'
    }
  },
  indigo: {
    name:'هدوء بنفسجي 🌌', primary:'#5B6CE0', amber:'#E0A54E', green:'#35A79A',
    chart:['#5B6CE0','#8A79F0','#35A79A','#E0A54E','#7C8AE8','#A56AC0','#5FA8D0','#9A8CF0','#6E7BC8','#C08AD0'],
    mtnDay:['#8A93C8','#6A73A8','#4E5684','#363C60'], mtnNight:['#2E3560','#232848','#191E38','#12152A'],
    phases:[
      'linear-gradient(160deg,#D9D2F0 0%,#E9CAD6 45%,#F0C2C0 100%)',
      'linear-gradient(160deg,#CFD6F5 0%,#E2E6FA 55%,#F4F1FC 100%)',
      'linear-gradient(160deg,#9FB2F0 0%,#C6D2F8 55%,#EAEFFE 100%)',
      'linear-gradient(160deg,#A9AEE8 0%,#CFC9EC 55%,#EDE6F5 100%)',
      'linear-gradient(160deg,#5B4E8E 0%,#9E6FA0 52%,#E7A6A6 100%)',
      'linear-gradient(170deg,#12163A 0%,#1E2450 55%,#2E2F60 100%)'
    ],
    seasons:{
      spring:'linear-gradient(160deg,#DCD6F2 0%,#E9DCEE 55%,#F5E4EC 100%)',
      summer:'linear-gradient(160deg,#8FB6F0 0%,#BBD3F8 50%,#EAF0FE 100%)',
      autumn:'linear-gradient(160deg,#C6A8D8 0%,#B98BB0 50%,#9E6E96 100%)',
      winter:'linear-gradient(160deg,#C6D2E8 0%,#DFE6F4 55%,#F5F8FD 100%)',
      night:'linear-gradient(160deg,#12163A 0%,#1E2450 55%,#2E2F60 100%)',
      sunset:'linear-gradient(160deg,#6E5A9E 0%,#A66FA0 48%,#E7A6A6 100%)',
      sea:'linear-gradient(160deg,#5B8FD8 0%,#8FB6E8 45%,#D8E4F5 100%)'
    }
  },
  forest: {
    name:'غابة هادئة 🌿', primary:'#4F8A6B', amber:'#CE9A4E', green:'#6FB047',
    chart:['#4F8A6B','#CE9A4E','#6FB047','#3F9E9E','#8AAE6A','#A5894E','#5E9E7A','#B0A24E','#7B9A5B','#4E8A8A'],
    mtnDay:['#8FAE7A','#6C8E5A','#4E6E40','#36502E'], mtnNight:['#2E4A3E','#233A30','#193028','#12201A'],
    phases:[
      'linear-gradient(160deg,#E7E3C4 0%,#DCD0A8 45%,#CDBE92 100%)',
      'linear-gradient(160deg,#D9E4C6 0%,#EAF0D8 55%,#F6F9EC 100%)',
      'linear-gradient(160deg,#AECF9E 0%,#D0E4BE 55%,#EDF5DE 100%)',
      'linear-gradient(160deg,#A8C892 0%,#CDD9A8 55%,#EBEAC8 100%)',
      'linear-gradient(160deg,#3E6E72 0%,#7FA47F 52%,#E4D3A0 100%)',
      'linear-gradient(170deg,#132420 0%,#1E3830 55%,#2A463A 100%)'
    ],
    seasons:{
      spring:'linear-gradient(160deg,#DCEFC6 0%,#EAF3DA 55%,#F1F6E4 100%)',
      summer:'linear-gradient(160deg,#8FCF9E 0%,#C6E4B6 50%,#EEF6CE 100%)',
      autumn:'linear-gradient(160deg,#C9C079 0%,#A99A44 50%,#7E7A2E 100%)',
      winter:'linear-gradient(160deg,#CDD9C6 0%,#E2ECD9 55%,#F4F8EE 100%)',
      night:'linear-gradient(160deg,#132420 0%,#1E3830 55%,#2A463A 100%)',
      sunset:'linear-gradient(160deg,#3E6E72 0%,#7FA47F 48%,#D9C88A 100%)',
      sea:'linear-gradient(160deg,#4FA5A0 0%,#8FCEC0 45%,#DFF0DC 100%)'
    }
  },
  ocean: {
    name:'بحر هادئ 🌊', primary:'#2C8FB0', amber:'#E0A24E', green:'#2FA98A',
    chart:['#2C8FB0','#E0A24E','#2FA98A','#5E8AC0','#4EA5C0','#8A6AB0','#5EB0A0','#C08A5E','#5B9AB8','#3F9E9E'],
    mtnDay:['#6EA3B8','#4E8098','#365F76','#254656'], mtnNight:['#25455E','#1B3548','#132838','#0C1C28'],
    phases:[
      'linear-gradient(160deg,#CFE6EC 0%,#E6D6D0 45%,#EEC6B8 100%)',
      'linear-gradient(160deg,#C2E2F0 0%,#DEF0F8 55%,#F0FAFD 100%)',
      'linear-gradient(160deg,#7FC8E8 0%,#B6E2F4 55%,#E6F6FE 100%)',
      'linear-gradient(160deg,#8FC8DE 0%,#C2E0E4 55%,#EAF2E8 100%)',
      'linear-gradient(160deg,#3E5E86 0%,#5E8AA8 50%,#E0A878 100%)',
      'linear-gradient(170deg,#0E1E32 0%,#173048 55%,#22475E 100%)'
    ],
    seasons:{
      spring:'linear-gradient(160deg,#CFEAE6 0%,#E2F0EC 55%,#F0F8F4 100%)',
      summer:'linear-gradient(160deg,#5FC8E8 0%,#A6E2F4 50%,#E6F8FE 100%)',
      autumn:'linear-gradient(160deg,#6EA8B0 0%,#9C9E88 50%,#C88E5E 100%)',
      winter:'linear-gradient(160deg,#C6DCE8 0%,#DFEEF6 55%,#F4FBFD 100%)',
      night:'linear-gradient(160deg,#0E1E32 0%,#173048 55%,#22475E 100%)',
      sunset:'linear-gradient(160deg,#3E5E86 0%,#6E8AA8 48%,#E0A878 100%)',
      sea:'linear-gradient(160deg,#2C9FC0 0%,#7FCEDE 45%,#D8F0F0 100%)'
    }
  },
  charcoal: {
    name:'رصاصي مودرن ⬛', primary:'#3E4247', amber:'#B8946A', green:'#5F8A6E',
    chart:['#3E4247','#B8946A','#6E7378','#5F8A6E','#8A8F96','#A98F6E','#767B82','#9AA0A6','#5E6369','#C0A57E'],
    mtnDay:['#9A9EA4','#7E838A','#62676E','#484D54'], mtnNight:['#2E3238','#24282E','#1A1E24','#12151A'],
    phases:[
      'linear-gradient(160deg,#D2D0CC 0%,#C8BFB6 45%,#B8ACA0 100%)',
      'linear-gradient(160deg,#CDD1D6 0%,#E2E4E7 55%,#F2F3F5 100%)',
      'linear-gradient(160deg,#C7CBD0 0%,#DDE0E4 55%,#EEF0F2 100%)',
      'linear-gradient(160deg,#B8BCC2 0%,#D0D3D7 55%,#E6E4E0 100%)',
      'linear-gradient(160deg,#6E7378 0%,#9BA0A6 52%,#C9AD8E 100%)',
      'linear-gradient(170deg,#16181C 0%,#24272C 55%,#33373D 100%)'
    ],
    seasons:{
      spring:'linear-gradient(160deg,#D6D4D0 0%,#E4E2DE 55%,#F2F1EE 100%)',
      summer:'linear-gradient(160deg,#C7CBD0 0%,#DDE0E4 55%,#F0F1F3 100%)',
      autumn:'linear-gradient(160deg,#B8ADA0 0%,#A69684 50%,#8C7C68 100%)',
      winter:'linear-gradient(160deg,#CDD2D8 0%,#E4E7EB 55%,#F6F8FA 100%)',
      night:'linear-gradient(160deg,#16181C 0%,#24272C 55%,#33373D 100%)',
      sunset:'linear-gradient(160deg,#5A5E64 0%,#8A8F96 48%,#C9AD8E 100%)',
      sea:'linear-gradient(160deg,#8FA0A6 0%,#B8C2C6 45%,#DCE2E2 100%)'
    }
  },
  requiem: {
    name:'ريكويم 🧟', primary:'#9E1B1B', amber:'#A8822E', green:'#5C7A32',
    chart:['#9E1B1B','#A8822E','#5C7A32','#7A2E2A','#C0453E','#6E3A38','#8A6A2E','#B0562E','#5E4A46','#8E2E2A'],
    mtnDay:['#5A4340','#43302E','#2E1F1E','#1C1212'], mtnNight:['#2A1416','#1C0E10','#120809','#0A0506'],
    phases:[
      'linear-gradient(160deg,#3A2422 0%,#5E2E28 45%,#7E4438 100%)',
      'linear-gradient(160deg,#5A4A46 0%,#75605A 55%,#907870 100%)',
      'linear-gradient(160deg,#6B5C56 0%,#8A6E60 55%,#A88C78 100%)',
      'linear-gradient(160deg,#4E3A36 0%,#6E524A 55%,#8E6C5E 100%)',
      'linear-gradient(160deg,#2A1416 0%,#6E1F1C 52%,#A84428 100%)',
      'linear-gradient(170deg,#0A0708 0%,#1C0E10 55%,#331416 100%)'
    ],
    seasons:{
      spring:'linear-gradient(160deg,#4A2E2C 0%,#6E3A32 55%,#8E5648 100%)',
      summer:'linear-gradient(160deg,#5A4A46 0%,#7A5E52 55%,#9E7A64 100%)',
      autumn:'linear-gradient(160deg,#4E2A24 0%,#7A3A28 50%,#A0562E 100%)',
      winter:'linear-gradient(160deg,#3A3236 0%,#544A4E 55%,#726468 100%)',
      night:'linear-gradient(160deg,#0A0708 0%,#1C0E10 55%,#331416 100%)',
      sunset:'linear-gradient(160deg,#2A1416 0%,#6E1F1C 52%,#A84428 100%)',
      sea:'linear-gradient(160deg,#26343A 0%,#40524E 45%,#6E5A48 100%)'
    }
  }
};
const PALETTE_ORDER = ['ocean','indigo','sand','forest','charcoal','requiem'];

// هندسة الأوقات (مواقع الشمس/القمر) — مشتركة، الألوان تجي من الباليت
const PHASE_GEOM = [
  { h:[5,7],   sun:true,  x:14, y:70 },
  { h:[7,11],  sun:true,  x:30, y:34 },
  { h:[11,15], sun:true,  x:50, y:14 },
  { h:[15,18], sun:true,  x:72, y:32 },
  { h:[18,20], sun:true,  x:86, y:72 },
  { h:[20,5],  sun:false, x:64, y:20 }
];
// هندسة الفصول (شمس/قمر + الموقع + الذرات) — مشتركة، التدرّج من الباليت
const SEASON_META = {
  spring: { body:'sun',  x:38, y:20, particles:'petal' },
  summer: { body:'sun',  x:52, y:11, particles:null },
  autumn: { body:'sun',  x:72, y:40, particles:'leaf' },
  winter: { body:'sun',  x:64, y:26, particles:'snow' },
  night:  { body:'moon', x:70, y:15, particles:null },
  sunset: { body:'sun',  x:50, y:44, particles:null },
  sea:    { body:'sun',  x:30, y:14, particles:null }
};
const SEASON_NAMES = {
  auto:'تلقائي (حسب الوقت) ☀️🌙', spring:'ربيع 🌸', summer:'صيف ☀️', autumn:'خريف 🍂',
  winter:'شتاء ❄️', night:'ليل ونجوم 🌌', sunset:'غروب 🌇', sea:'بحر 🌊'
};
let activePal = PALETTES[DEFAULT_PAL];

let state = { month:'', budget:null, expenses:[], debts:[], locked:false };
let session = null;

/* ---------- الثيم / الألوان ---------- */
// يطلّع نسخة فاتحة من اللون الأساسي للخلفيات الناعمة
function softTint(hex){
  const c = hex.replace('#','');
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16);
  const mix = (x)=> Math.round(x + (255 - x) * 0.86);
  return 'rgb(' + mix(r) + ',' + mix(g) + ',' + mix(b) + ')';
}
function applyTheme(primary){
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--primary-soft', softTint(primary));
}
function loadTheme(){
  let p = '';
  try{ p = localStorage.getItem('mas_theme') || ''; }catch(_){}
  if(p) applyTheme(p);
}
function saveTheme(primary){
  try{ localStorage.setItem('mas_theme', primary); }catch(_){}
  applyTheme(primary);
}

/* ---------- الباليت (لون الموقع + السماء المنسّقة) ---------- */
function applyPalette(id, save){
  const p = PALETTES[id] || PALETTES[DEFAULT_PAL];
  activePal = p;
  const R = document.documentElement.style;
  R.setProperty('--primary', p.primary);
  R.setProperty('--primary-soft', softTint(p.primary));
  R.setProperty('--amber', p.amber);
  R.setProperty('--green', p.green);
  PALETTE = p.chart;
  if(save !== false){ try{ localStorage.setItem('mas_palette', id); }catch(_){} }
  try{ updateSky(); }catch(_){}
  try{ applyDark(); }catch(_){}          // يزامن لون شريط المتصفح (theme-color)
  try{ if(session) render(); }catch(_){} // يعيد تلوين الدونات/المفتاح بألوان الباليت
}
function curPaletteId(){
  let id = ''; try{ id = localStorage.getItem('mas_palette') || ''; }catch(_){}
  return PALETTES[id] ? id : DEFAULT_PAL;
}
function loadPalette(){ applyPalette(curPaletteId(), false); }
window.pickPalette = (id) => {
  applyPalette(id);
  try{ renderSettings(); }catch(_){}
  toast('انتغيّر الثيم ✓ 🎨');
};

/* ---------- العملة (نص عرض فقط) ---------- */
function updateCurrencyLabels(){
  const c = CURRENCIES[CURRENCY] || CURRENCIES.iqd;
  const lbl = $('amtCurLabel');
  if(lbl) lbl.textContent = 'المبلغ (' + c.sym + ')';
}
function refreshMoney(){
  try{ if(session) render(); }catch(_){}
  try{ updateAlloc(); }catch(_){}
  try{ if($('tab-bills') && $('tab-bills').classList.contains('active')) renderBills(); }catch(_){}
  try{ if($('tab-recon') && $('tab-recon').classList.contains('active')){ renderReconSystem(); renderRecons(); } }catch(_){}
}
function setCurrency(id){
  CURRENCY = CURRENCIES[id] ? id : 'iqd';
  try{ localStorage.setItem('mas_cur', CURRENCY); }catch(_){}
  updateCurrencyLabels();
  refreshMoney();
}

/* ---------- نوع الخط ----------
   الخطوط تتحمّل من Google Fonts عند اختيارها فقط (كسول) حتى ما تثقّل
   الإقلاع. «روبيك» محمّل أصلاً بالرأس. الاختيار ينحفظ بالجهاز. */
const FONTS = {
  rubik:   { name:'روبيك (الافتراضي)',   stack:"'Rubik','Alexandria'",     url:'' },
  cairo:   { name:'القاهرة',             stack:"'Cairo'",                  url:'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap' },
  tajawal: { name:'تجوّل',               stack:"'Tajawal'",                url:'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap' },
  almarai: { name:'المراعي',             stack:"'Almarai'",                url:'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap' },
  ibm:     { name:'IBM بلكس عربي',       stack:"'IBM Plex Sans Arabic'",   url:'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap' },
  amiri:   { name:'أميري (نسخ كلاسيكي)', stack:"'Amiri'",                  url:'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap' },
  reem:    { name:'ريم كوفي',            stack:"'Reem Kufi'",              url:'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;500;600;700&display=swap' }
};
const FONT_FALLBACK = ",-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif";
const _fontLinks = {};
function loadFont(id){
  const f = FONTS[id];
  if(!f || !f.url || _fontLinks[id]) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = f.url;
  document.head.appendChild(l);
  _fontLinks[id] = true;
}
function applyFont(id, save){
  const f = FONTS[id] || FONTS.rubik;
  if(id !== 'rubik') loadFont(id);
  document.body.style.fontFamily = f.stack + FONT_FALLBACK;
  if(save !== false){ try{ localStorage.setItem('mas_font', id); }catch(_){} }
}
function curFontId(){
  let id = ''; try{ id = localStorage.getItem('mas_font') || ''; }catch(_){}
  return FONTS[id] ? id : 'rubik';
}
function loadFontPref(){ applyFont(curFontId(), false); }
function setFont(id){ applyFont(FONTS[id] ? id : 'rubik'); }

/* ---------- حجم الخط (تكبير/تصغير كل النصوص) ----------
   نغيّر حجم خط الجذر (html) — أغلب أحجام النصوص بالتطبيق بوحدة rem
   فتتكبّر/تتصغّر كلها بتناسب. القيمة نسبة مئوية (100 = الأساس). */
let fontScale = 110;
try{ const _fs = parseInt(localStorage.getItem('mas_fontscale'), 10); if(!isNaN(_fs)) fontScale = _fs; }catch(_){}
function applyFontScale(pct){
  const v = Math.max(80, Math.min(140, Number(pct) || 100));
  document.documentElement.style.fontSize = v + '%';
}
function setFontScale(pct){
  fontScale = Math.max(80, Math.min(140, parseInt(pct, 10) || 100));
  try{ localStorage.setItem('mas_fontscale', String(fontScale)); }catch(_){}
  applyFontScale(fontScale);
}

/* ---------- تغويش خلفية السماء (0-100) ---------- */
let skyBlur = 0;
try{ skyBlur = parseInt(localStorage.getItem('mas_skyblur') || '0', 10) || 0; }catch(_){}
function applySkyBlur(v){
  const pct = Math.max(0, Math.min(100, Number(v) || 0));
  const px = (pct / 100 * 18).toFixed(1);   // أقصى تغويش ~18px
  document.documentElement.style.setProperty('--sky-blur', px + 'px');
}
function setSkyBlur(v){
  skyBlur = Math.max(0, Math.min(100, parseInt(v, 10) || 0));
  try{ localStorage.setItem('mas_skyblur', String(skyBlur)); }catch(_){}
  applySkyBlur(skyBlur);
}

/* ---------- المودال ---------- */
function modalOpen(html){ $('modalCard').innerHTML = '<div class="grabber"></div>' + html; $('modal').classList.add('show'); }
window.modalClose = () => $('modal').classList.remove('show');
$('modal').addEventListener('click', e => { if(e.target === $('modal')) modalClose(); });

/* ---------- الجلسة (Supabase Auth يديرها ويجدّدها تلقائياً) ---------- */
async function fetchProfile(userId){
  const { data, error } = await sb.from('profiles').select('display_name, household_id, is_admin').eq('id', userId).single();
  if(error || !data) return null;
  return { name: data.display_name, hh: data.household_id, admin: !!data.is_admin };
}

function showLogin(){
  $('loginScreen').classList.add('show');
  $('appHeader').style.display='none';
  $('appMain').style.display='none';
  $('appNav').style.display='none';
}
function showApp(){
  $('loginScreen').classList.remove('show');
  $('appHeader').style.display='';
  $('appMain').style.display='';
  $('appNav').style.display='';
  $('userName').textContent = 'مرحباً ' + (session && session.name ? session.name : '');
}
function doLogout(){ clearTimeout(idleTimer); stopRealtime(); sb.auth.signOut().catch(()=>{}); session = null; showLogin(); }

/* ---------- التبديل بين الدخول والتسجيل ---------- */
function toggleAuth(signup){
  $('loginBox').style.display  = signup ? 'none' : '';
  $('signupBox').style.display = signup ? '' : 'none';
  $('liErr').textContent = ''; $('suErr').textContent = '';
}

/* ---------- إنشاء حساب جديد ---------- */
async function doSignup(){
  if(!apiReady()){ $('suErr').textContent = 'الموقع غير مربوط بقاعدة البيانات بعد'; return; }
  const name = $('suName').value.trim();
  const email = $('suEmail').value.trim();
  const pass = $('suPass').value;
  const code = $('suCode').value.trim();
  const err = $('suErr');
  err.textContent = '';
  if(!name || !email || !pass){ err.textContent = 'املأ الاسم والإيميل والباسورد'; return; }
  if(pass.length < 6){ err.textContent = 'الباسورد لازم يكون ٦ خانات على الأقل'; return; }
  loading(true);
  try{
    if(code){
      const { data: famName, error: e0 } = await sb.rpc('check_family_code', { p_code: code });
      if(e0 || !famName){ err.textContent = 'كود العائلة غلط — دقق عليه أو خليه فارغ'; return; }
      if(!confirm('راح تنضم لعائلة «' + famName + '» وتشوفون نفس البيانات سوا. تمام؟')) return;
    }
    const { data, error } = await sb.auth.signUp({
      email, password: pass,
      options: { data: { name, family_code: code } }
    });
    if(error){
      err.textContent = /already|registered/i.test(error.message) ? 'هذا الإيميل مسجّل أصلاً — سجّل دخول بيه' : ('ما كدرت أسوي الحساب: ' + error.message);
      return;
    }
    if(data.session && data.user){
      toast('أهلاً بيك بمصاريفنا 🎉');
      await afterLogin(data.user);
    }else{
      toggleAuth(false);
      $('liErr').textContent = 'افتح إيميلك وأكّد الحساب، بعدين سجّل دخول من هنا';
    }
  }catch(_){ err.textContent = 'ما كدرت أوصل للخادم'; }
  finally{ loading(false); }
}

/* ---------- المزامنة اللحظية (Realtime) ---------- */
let rtChannel = null, rtTimer = null, inFlight = false;
function startRealtime(){
  stopRealtime();
  if(!session || !session.hh) return;
  try{
    rtChannel = sb.channel('hh-' + session.hh);
    ['expenses','budgets','categories','budget_incomes','debts','quick_buttons','bills','reconciliations'].forEach(tbl => {
      rtChannel.on('postgres_changes',
        { event:'*', schema:'public', table:tbl, filter:'household_id=eq.' + session.hh },
        onRemoteChange);
    });
    rtChannel.subscribe();
  }catch(_){ /* المزامنة كمالية — الموقع يشتغل بدونها */ }
}
function stopRealtime(){
  if(rtChannel){ try{ sb.removeChannel(rtChannel); }catch(_){} rtChannel = null; }
  clearTimeout(rtTimer);
}
function onRemoteChange(){
  clearTimeout(rtTimer);
  rtTimer = setTimeout(async () => {
    if(inFlight || !session) return;
    try{
      const res = await apiGet(state.month);
      if(res.ok){
        state.budget = res.budget;
        state.expenses = res.expenses;
        state.debts = res.debts || [];
        render();
        loadQuick();
        const bt = $('tab-bills');
        if(bt && bt.classList.contains('active')) loadBills();
        const rt = $('tab-recon');
        if(rt && rt.classList.contains('active')) loadRecons();
      }
    }catch(_){}
  }, 450);
}

/* ---------- API (Supabase RPC) ---------- */
function apiReady(){
  const ok = SUPABASE_URL.startsWith('https://') && SUPABASE_URL.includes('.supabase.co') && SUPABASE_KEY.length > 20;
  const sw = $('setupWarn'); if(sw) sw.style.display = ok ? 'none' : 'block';
  const lw = $('liSetupWarn'); if(lw) lw.style.display = ok ? 'none' : 'block';
  return ok;
}
// يحوّل خطأ Supabase لنفس شكل ردود النسخة القديمة { ok, error, authFail }
function rpcFail(error){
  const msg = (error && error.message) || 'خطأ بالخادم';
  const authFail = (error && (error.code === 'PGRST301' || /JWT|jwt/.test(msg))) || msg.indexOf('الدخول مطلوب') !== -1;
  return { ok:false, error: msg, authFail };
}
async function apiGet(month){
  // نجيب الشهر + الديون الكاملة (بالنوع وموعد الإرجاع) سوية
  const [r1, r2] = await Promise.all([
    sb.rpc('load_month', { p_month: month }),
    sb.rpc('list_open_debts')
  ]);
  if(r1.error) return rpcFail(r1.error);
  const debts = (!r2.error && Array.isArray(r2.data)) ? r2.data : (r1.data.debts || []);
  return { ok:true, budget: r1.data.budget, expenses: r1.data.expenses || [], debts };
}
async function apiPost(p){
  let call;
  switch(p.action){
    case 'saveBudget':
      call = sb.rpc('save_budget', { p_month:p.month, p_salaries:p.salaries, p_categories:p.categories, p_incomes:p.incomes });
      break;
    case 'addExpense':
      call = sb.rpc('add_expense', { p_month:p.month, p_date:p.date, p_amount:p.amount, p_descr:p.desc||'', p_category:p.category||'', p_debt_account:p.debtAccount||'' });
      break;
    case 'editExpense':
      call = sb.rpc('edit_expense', { p_id:p.id, p_date:p.date, p_amount:p.amount, p_descr:p.desc||'', p_category:p.category||'' });
      break;
    case 'deleteExpense':
      call = sb.rpc('delete_expense', { p_id:p.id });
      break;
    case 'closeMonth':
      call = sb.rpc('close_month', { p_month:p.month });
      break;
    case 'clearMonth':
      call = sb.rpc('clear_month', { p_month:p.month });
      break;
    case 'returnDebt':
      call = sb.rpc('return_debt', { p_id:p.id, p_date:p.date||'' });
      break;
    case 'addDeposit':
      call = sb.rpc('add_deposit', { p_fund:p.fund, p_amount:p.amount, p_date:p.date||'', p_descr:p.desc||'', p_from_category:p.fromCategory||'' });
      break;
    case 'withdrawFund':
      call = sb.rpc('withdraw_fund', { p_month:p.month, p_date:p.date, p_amount:p.amount, p_descr:p.desc||'', p_fund:p.fund, p_debt_account:p.debtAccount||'', p_to_category:p.toCategory||'' });
      break;
    case 'addLoan':
      call = sb.rpc('add_loan', { p_month:p.month, p_date:p.date, p_amount:p.amount, p_fund:p.fund, p_account:p.account, p_due_date:p.dueDate||'', p_descr:p.desc||'', p_to_category:p.toCategory||'' });
      break;
    case 'editWithdraw':
      call = sb.rpc('edit_withdrawal', { p_id:p.id, p_amount:p.amount, p_date:p.date, p_descr:p.desc||'' });
      break;
    case 'deleteWithdraw':
      call = sb.rpc('delete_withdrawal', { p_id:p.id });
      break;
    case 'cancelDebt':
      call = sb.rpc('cancel_debt', { p_id:p.id });
      break;
    case 'transferCategory':
      call = sb.rpc('transfer_category', { p_month:p.month, p_from:p.from, p_to:p.to, p_amount:p.amount });
      break;
    case 'deleteFund':
      call = sb.rpc('delete_fund', { p_name:p.name });
      break;
    case 'unlockMonth':
      call = sb.rpc('unlock_month', { p_month:p.month });
      break;
    case 'closeMonthCarry':
      call = sb.rpc('close_month_carry', { p_month:p.month });
      break;
    default:
      return { ok:false, error:'إجراء غير معروف' };
  }
  const { data, error } = await call;
  if(error) return rpcFail(error);
  return { ok:true, data };
}
function guardAuth(res){
  if(res && res.authFail){ doLogout(); toast('انتهت الجلسة، سجّل دخول من جديد', true); return true; }
  return false;
}

/* ---------- الدخول ---------- */
async function afterLogin(user){
  const prof = await fetchProfile(user.id);
  session = prof || { name: '' };
  showApp();
  $('expDate').value = todayISO();
  startRealtime();
  resetIdle();
  loadQuick();
  await loadMonth(thisMonth());
  flushOffline();   // نرفع أي مصاريف انسجلت بلا نت
}
async function doLogin(){
  if(!apiReady()){ $('liErr').textContent = 'الموقع غير مربوط بقاعدة البيانات بعد'; return; }
  const email = $('liUser').value.trim();
  const password = $('liPass').value;
  if(!email || !password){ $('liErr').textContent = 'دخّل الإيميل والباسورد'; return; }
  $('liErr').textContent = '';
  loading(true);
  try{
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if(error){ $('liErr').textContent = 'الإيميل أو الباسورد غلط'; return; }
    $('liPass').value = '';
    await afterLogin(data.user);
  }catch(err){ $('liErr').textContent = 'ما كدرت أوصل للخادم'; }
  finally{ loading(false); }
}

/* ---------- تحميل الشهر ---------- */
function showSkeleton(){
  const sc = $('summaryCard'), en = $('envList'), ex = $('expList');
  if(sc) sc.innerHTML = '<div class="card sk sk-card"></div>';
  if(en) en.innerHTML = '<div class="sk sk-row"></div><div class="sk sk-row"></div><div class="sk sk-row"></div>';
  if(ex) ex.innerHTML = '<div class="sk sk-row"></div><div class="sk sk-row"></div>';
}
async function loadMonth(month){
  state.month = month;
  $('monthPick').value = month;
  if(!apiReady()){ render(); return; }
  inFlight = true;
  showSkeleton();
  loading(true);
  try{
    const res = await apiGet(month);
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ بالخادم');
    state.budget = res.budget;
    state.expenses = res.expenses;
    state.debts = res.debts || [];
    render();
    // الفواتير والمطابقة تعتمد على «الباقي للصرف» فنحدّثها بعد الرسم
    const bt = $('tab-bills');
    if(bt && bt.classList.contains('active')) loadBills();
    const rt = $('tab-recon');
    if(rt && rt.classList.contains('active')) loadRecons();
  }catch(err){
    toast('ما كدرت أوصل للبيانات: ' + err.message, true);
  }finally{
    inFlight = false;
    loading(false);
  }
}

/* ---------- الرسم الدائري ---------- */
// رسم القطع بنعومة ومتتابعة (unfurl) — بصري بحت
function animateDonut(){
  const svg = document.querySelector('#summaryCard .donut svg');
  if(!svg) return;
  const c = 2 * Math.PI * 52;                 // محيط الدائرة (r=52)
  const segs = svg.querySelectorAll('.dseg');
  segs.forEach((sg, i) => {
    const finalDa = sg.getAttribute('stroke-dasharray');   // "len rest"
    sg.style.transition = 'none';
    sg.setAttribute('stroke-dasharray', '0 ' + c.toFixed(2));
    requestAnimationFrame(() => {
      sg.style.transition = 'stroke-dasharray .8s cubic-bezier(.22,.61,.36,1)';
      sg.style.transitionDelay = (i * 0.07).toFixed(2) + 's';
      requestAnimationFrame(() => { sg.setAttribute('stroke-dasharray', finalDa); });
    });
  });
}
function donutSVG(parts){
  const total = parts.reduce((s,p)=> s + p.value, 0);
  if(total <= 0) return '<div class="empty" style="padding:14px">ماكو مصاريف</div>';
  const r = 52, c = 2*Math.PI*r, cx = 64, cy = 64;
  let off = 0, segs = '';
  parts.forEach((p,i) => {
    const len = (p.value/total) * c;
    segs += `<circle class="dseg" data-cat="${esc(p.label)}" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PALETTE[i%PALETTE.length]}" stroke-width="18" stroke-dasharray="${len.toFixed(2)} ${(c-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"><title>${esc(p.label)} — ${p.value.toLocaleString('en-US')}</title></circle>`;
    off += len;
  });
  return `<svg viewBox="0 0 128 128" width="100%" height="100%">${segs}`+
    `<text x="64" y="61" text-anchor="middle" font-size="9" fill="var(--muted)">صرفت</text>`+
    `<text x="64" y="76" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">${(total).toLocaleString('en-US')}</text></svg>`;
}

/* ---------- العرض ---------- */
function render(){
  const b = state.budget || { salary1:0, salary2:0, categories:[], locked:false };
  state.locked = !!b.locked;
  const cats = b.categories || [];

  /* تقسيم الأنواع */
  let spendAlloc=0, spendCarried=0, saveContrib=0, saveCarried=0;
  cats.forEach(c => {
    if(c.type === 'save'){ saveContrib += (c.amount||0); saveCarried += (c.carried||0); }
    else { spendAlloc += (c.amount||0); spendCarried += (c.carried||0); }
  });
  const saveNames = new Set(cats.filter(c=>c.type==='save').map(c=>c.name));

  /* المصروف حسب التصنيف (الإرجاعات السالبة تنطرح تلقائياً) */
  const spentByCat = {};
  state.expenses.forEach(e => {
    const k = e.category || '— بلا تصنيف —';
    spentByCat[k] = (spentByCat[k]||0) + e.amount;
  });

  /* صرف المصاريف فقط (نتجاهل حركات الصناديق سحب/إرجاع) — والإيداعات تنحسب لأنها تنحجز من الفائض */
  let spendingSpent=0, fundDeposits=0;
  state.expenses.forEach(e => {
    if(!saveNames.has(e.category)) spendingSpent += e.amount;
    else if(e.amount < 0 && String(e.desc||'').indexOf('إيداع:') === 0) fundDeposits += -e.amount;
  });

  const totalSalary = (b.salaries && b.salaries.length)
    ? b.salaries.reduce((s,x)=> s + (Number(x.amount)||0), 0)
    : (b.salary1||0) + (b.salary2||0);
  const extraIncome = ((b.incomes)||[]).reduce((s,x)=> s + (Number(x.amount)||0), 0);
  const totalIncome = totalSalary + extraIncome;
  const remain = totalIncome + spendCarried - saveContrib - spendingSpent - fundDeposits;
  state._surplus = Math.max(0, remain);
  state._remainRaw = remain;   // للمطابقة — بدون تصفير السالب

  $('hSalary') && setStat($('hSalary'), totalIncome);
  setStat($('hSpent'), spendingSpent);
  setStat($('hRemain'), remain);
  $('hRemain').className = 'val' + (remain < 0 ? ' neg' : '');

  /* ===== ملخص + رسم ===== */
  const donutParts = [];
  const known = new Set(cats.map(c=>c.name));
  cats.filter(c=>c.type!=='save').forEach(c => { const v = spentByCat[c.name]||0; if(v>0) donutParts.push({label:c.name, value:v}); });
  let other = 0;
  Object.keys(spentByCat).forEach(k => { if(!known.has(k) && !saveNames.has(k) && spentByCat[k]>0) other += spentByCat[k]; });
  if(other > 0) donutParts.push({ label:'أخرى', value:other });

  const prog = monthProgress(state.month);
  const dailyAvg = prog.elapsed > 0 ? Math.round(spendingSpent / prog.elapsed) : 0;
  const canDaily = prog.left > 0 ? Math.max(0, Math.round(remain / prog.left)) : 0;
  const activeCat = ($('fltCat') && $('fltCat').value) || '';
  const legend = donutParts.map((p,i)=>`<span class="lg-item${activeCat===p.label?' on':''}" data-cat="${esc(p.label)}"><span class="lg-dot" style="background:${PALETTE[i%PALETTE.length]}"></span><b>${esc(p.label)}</b>${fmt(p.value)}</span>`).join('');

  $('summaryCard').innerHTML = `
    <div class="card sum-card depth">
      <div class="sum-top">
        <div class="donut${activeCat?' has-filter':''}" ${activeCat?`data-active="${esc(activeCat)}"`:''}>${donutSVG(donutParts)}</div>
        <div class="sum-stats">
          <div class="ss"><span>المعدل اليومي</span><b>${fmt(dailyAvg)}</b></div>
          <div class="ss"><span>باقي بالشهر</span><b>${prog.left} يوم</b></div>
          <div class="ss"><span>تقدر تصرف باليوم</span><b>${fmt(canDaily)}</b></div>
        </div>
      </div>
      ${legend ? `<div class="legend">${legend}</div>` : ''}
      ${activeCat ? `<button class="lg-clear" onclick="filterByCat('')">✕ إلغاء الفلتر «${esc(activeCat)}»</button>` : ''}
    </div>`;
  // الرسم تفاعلي — دوس على قطعة أو اسم بالمفتاح حتى تنفلتر المصاريف
  $('summaryCard').onclick = (ev) => {
    const t = ev.target.closest('[data-cat]');
    if(!t) return;
    filterByCat(t.dataset.cat);
  };
  const dn = document.querySelector('.donut.has-filter');
  if(dn){
    dn.querySelectorAll('.dseg').forEach(sg => {
      if(sg.dataset.cat !== dn.dataset.active) sg.style.opacity = '.25';
    });
  }
  animateDonut();

  /* ===== ظروف المصاريف ===== */
  let envHtml = '';
  cats.forEach((c, ci) => {
    if(c.type === 'save') return;
    const carried = Number(c.carried)||0;
    const effective = (Number(c.amount)||0) + carried;
    const spent = spentByCat[c.name] || 0;
    const left = effective - spent;
    const pct = effective > 0 ? Math.min(100, Math.round(spent / effective * 100)) : (spent>0?100:0);
    const cls = pct >= 100 ? 'over' : (pct >= 80 ? 'warn' : '');
    envHtml += `
      <div class="env">
        <div class="env-top">
          <span class="env-name">${esc(c.name)}</span>
          <span class="env-left ${left<0?'over':''}">${left<0 ? 'تجاوز ' + fmt(-left) : 'باقي ' + fmt(left)}</span>
        </div>
        <div class="bar"><i class="${cls}" style="width:${pct}%"></i></div>
        <div class="env-sub"><span>صرفت ${fmt(spent)}</span><span>المتاح ${fmt(effective)}</span></div>
        ${carried ? `<div class="env-carry">↩ منها مرحّل من الشهر الماضي: ${fmt(carried)}</div>` : ''}
        ${(!state.locked && left>0) ? `<button class="env-transfer" onclick="openTransfer(${ci}, ${left})">⇄ نقل من هذا التصنيف</button>` : ''}
      </div>`;
    delete spentByCat[c.name];
  });

  /* ===== صناديق الادخار ===== */
  let saveHtml = '';
  state._fundTotal = 0;   // للمطابقة
  const saveList = cats.map((c,i)=>({c,i})).filter(x=>x.c.type==='save');
  if(saveList.length){
    let totalBal = 0, rows = '';
    saveList.forEach(({c,i}) => {
      const carried = Number(c.carried)||0;
      const contrib = Number(c.amount)||0;
      const wd = spentByCat[c.name] || 0;   // صافي السحب (السحب موجب، الإرجاع سالب)
      const bal = carried + contrib - wd;
      const goal = Number(c.goal)||0;
      totalBal += bal;
      let goalHtml = '';
      if(goal > 0){
        const pct = Math.max(0, Math.min(100, Math.round(bal / goal * 100)));
        const done = bal >= goal;
        goalHtml = `
          <div class="goal-wrap">
            <div class="goal-line">
              <span>🎯 الهدف: ${fmt(goal)}</span>
              <span class="goal-pct ${done?'done':''}">${done ? '✓ تحقق!' : pct + '%'}</span>
            </div>
            <div class="bar"><i class="${done?'':'goalbar'}" style="width:${pct}%"></i></div>
            ${done ? '' : `<div class="goal-rem">باقي ${fmt(goal - bal)} حتى توصله</div>`}
          </div>`;
      }
      rows += `
        <div class="fund">
          <div class="fund-top">
            <span class="fund-name">🏦 ${esc(c.name)}</span>
            <span class="fund-bal">${fmt(bal)}</span>
          </div>
          <div class="fund-sub">
            <span>مرحّل: ${fmt(carried)}</span>
            <span>+ هذا الشهر: ${fmt(contrib)}</span>
            ${wd ? `<span>${wd>=0?'− صافي السحب':'+ صافي الإيداع'}: ${fmt(Math.abs(wd))}</span>` : ''}
          </div>
          ${goalHtml}
          <div class="fund-actions">
            <button class="fa-wd" onclick="openWithdraw(${i})" ${state.locked?'disabled':''}>سحب −</button>
            <button class="fa-dep" onclick="openDeposit(${i})" ${state.locked?'disabled':''}>إيداع +</button>
            <button class="fa-loan" onclick="openLoan(${i})" ${state.locked?'disabled':''}>قرض 🤝</button>
            <button class="fa-log" onclick="openFundLog(${i})" title="سجل الحركات">☰</button>
            ${(!state.locked && bal===0) ? `<button class="fa-del2" onclick="deleteFund(${i})" title="إلغاء الصندوق">🗑</button>` : ''}
          </div>
        </div>`;
      delete spentByCat[c.name];
    });
    saveHtml = `<div class="save-head">صناديق الادخار 🏦 <span>الإجمالي: ${fmt(totalBal)}</span></div>` + rows;
    state._fundTotal = totalBal;
  }
  $('saveList').innerHTML = saveHtml;

  /* ===== ديون الصناديق ===== */
  // نعرض بس القروض هنا — السحب والإيداع ما يظهرون كبطاقة دين (حسب طلب المستخدم).
  // القرض بس هو اللي يبقى «مطلوب» يترجّع أو ينشطب.
  let debtHtml = '';
  const open = (state.debts || []).filter(d => d.kind === 'قرض');
  if(open.length){
    const totalDebt = open.reduce((s,d)=> s + (d.amount||0), 0);
    let rows = '';
    open.forEach(d => {
      const isLoan = d.kind === 'قرض';
      const isCatLoan = isLoan && !!d.toCategory;
      let dueHtml = '';
      if(isLoan && d.dueDate){
        const days = Math.floor((new Date(d.dueDate) - new Date(todayISO())) / 86400000);
        const cls = days < 0 ? 'overdue' : (days <= 3 ? 'soon' : '');
        const txt = days < 0 ? ('⏰ فات موعد الإرجاع (' + esc(d.dueDate) + ')')
                  : days === 0 ? '⏰ موعد الإرجاع اليوم!'
                  : ('⏰ موعد الإرجاع: ' + esc(d.dueDate) + ' (باقي ' + days + ' يوم)');
        dueHtml = `<div class="debt-due ${cls}">${txt}</div>`;
      }
      rows += `
        <div class="debt ${isLoan?'loan':''}">
          <div class="debt-top">
            <span class="debt-acc">${isCatLoan?'🗂️ ':''}${esc(d.account)}${isLoan?`<span class="debt-kind">${isCatLoan?'🤝 قرض تصنيف':'🤝 قرض'}</span>`:''}</span>
            <span class="debt-amt">${fmt(d.amount)}</span>
          </div>
          <div class="debt-sub">مطلوب لصندوق «${esc(d.fund)}» · ${isCatLoan?'قرض على تصنيف':(isLoan?'انعطى':'سُحب')} ${esc(d.date)}</div>
          ${dueHtml}
          <div class="debt-actions">
            <button class="db-return" onclick="returnDebt('${d.id}')">↩ رجّعه للصندوق</button>
            <button class="db-cancel" onclick="cancelDebt('${d.id}')">شطب (احذفه)</button>
          </div>
        </div>`;
    });
    debtHtml = `<div class="save-head">ديون الصناديق ⏳ <span>الإجمالي: ${fmt(totalDebt)}</span></div>` + rows;
  }
  $('debtList').innerHTML = debtHtml;

  /* مصاريف على تصنيفات غير موجودة بالميزانية */
  Object.keys(spentByCat).forEach(k => {
    if(spentByCat[k] <= 0) return;
    envHtml += `
      <div class="env">
        <div class="env-top">
          <span class="env-name">${esc(k)}</span>
          <span class="env-left over">بلا مخصص</span>
        </div>
        <div class="bar"><i class="over" style="width:100%"></i></div>
        <div class="env-sub"><span>صرفت ${fmt(spentByCat[k])}</span><span>المتاح 0 د.ع</span></div>
      </div>`;
  });
  $('envList').innerHTML = envHtml || '<div class="empty"><span class="emo">🗂️</span><b>ماكو ميزانية لهذا الشهر بعد</b>روح لتبويب «الميزانية» وحدد الرواتب والتصنيفات.</div>';

  /* ===== فلتر + قائمة المصاريف ===== */
  buildFilterOptions();
  renderExpenseList();

  /* ===== قائمة تصنيفات فورم الإضافة (بدون صناديق الادخار) ===== */
  const sel = $('expCat');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— بلا تصنيف —</option>' +
    cats.filter(c=>c.type!=='save').map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
  sel.value = cur;

  /* ===== فورم الميزانية ===== */
  $('salaryRows').innerHTML = '';
  $('catRows').innerHTML = '';
  $('saveRows').innerHTML = '';
  $('incomeRows').innerHTML = '';
  ((b.salaries && b.salaries.length) ? b.salaries : [{person:'راتبي', amount:b.salary1||0},{person:'راتب زوجتي', amount:b.salary2||0}]).forEach(s => addSalaryRow(s.person, s.amount));
  if(!document.querySelector('#salaryRows .cat-row')) addSalaryRow('', '');
  cats.forEach(c => addRow(c.type === 'save' ? 'save' : 'spend', c.name, c.amount, c.carried, c.goal));
  (b.incomes || []).forEach(x => addIncomeRow(x.desc, x.amount));
  if(!document.querySelector('#catRows .cat-row')) addRow('spend','','',0);
  $('allocCarry').textContent = fmt(spendCarried + saveCarried);
  updateAlloc();

  /* حالة القفل */
  $('btnCloseMonth').textContent = state.locked ? '🔒 الشهر مقفل' : 'إقفال الشهر وترحيل الباقي ✓';
  applyLock(state.locked);
}

/* ---------- خيارات الفلتر ---------- */
function buildFilterOptions(){
  const cats = (state.budget && state.budget.categories) || [];
  const fc = $('fltCat'), fb = $('fltBy');
  const curC = fc.value, curB = fb.value;
  const catNames = Array.from(new Set(state.expenses.map(e=>e.category).filter(Boolean)));
  fc.innerHTML = '<option value="">كل التصنيفات</option>' + catNames.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
  fc.value = curC;
  const people = Array.from(new Set(state.expenses.map(e=>e.by).filter(Boolean)));
  fb.innerHTML = '<option value="">الكل</option>' + people.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
  fb.value = curB;
  $('filterBar').style.display = state.expenses.length ? 'flex' : 'none';
}

/* ---------- فلترة من الرسم الدائري ---------- */
window.filterByCat = (name) => {
  const fc = $('fltCat');
  if(!fc) return;
  if(name === 'أخرى'){ toast('«أخرى» تجمع كذا تصنيف — اختار التصنيف من قائمة الفلتر', true); return; }
  if(name && fc.value === name) name = '';   // دوس مرة ثانية = إلغاء
  if(name && ![...fc.options].some(o => o.value === name)){
    toast('ماكو مصاريف بهذا التصنيف حتى تنفلتر', true); return;
  }
  fc.value = name || '';
  render();   // يعيد رسم اللوحة + القائمة مع تظليل التصنيف المختار
  if(name){
    toast('مفلتر على «' + name + '» 🔎');
    const el = $('expList');
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }else{
    toast('انلغى الفلتر ✓');
  }
};

/* ---------- قائمة المصاريف (مع الفلتر) ---------- */
function renderExpenseList(){
  const saveNames = new Set(((state.budget&&state.budget.categories)||[]).filter(c=>c.type==='save').map(c=>c.name));
  const txt = ($('fltText').value||'').trim().toLowerCase();
  const fc = $('fltCat').value, fb = $('fltBy').value;

  const list = state.expenses.filter(e => {
    if(fc && e.category !== fc) return false;
    if(fb && e.by !== fb) return false;
    if(txt){
      const hay = (e.desc + ' ' + e.category + ' ' + e.by).toLowerCase();
      if(hay.indexOf(txt) === -1) return false;
    }
    return true;
  });

  /* المصاريف المعلّقة (انسجلت بلا نت) — تظهر فوك القائمة لحد ما تنرفع */
  let pendHtml = '';
  offlineList().filter(q => q.month === state.month).forEach(q => {
    pendHtml += `
      <div class="exp pending">
        <div class="cat-dot">⏳</div>
        <div class="mid">
          <div class="desc">${esc(q.desc || 'بدون تفاصيل')}</div>
          <div class="meta">${esc(q.date)}${q.category ? ' · ' + esc(q.category) : ''} · ⏳ بانتظار النت</div>
        </div>
        <div class="amt">${fmt(q.amount)}</div>
        <button class="del" onclick="event.stopPropagation();removeOffline('${q.qid}')" aria-label="حذف">✕</button>
      </div>`;
  });

  let expHtml = '';
  list.forEach(e => {
    const isWd  = saveNames.has(e.category);
    const isRet = e.amount < 0;
    const isDep = isRet && String(e.desc||'').indexOf('إيداع') === 0;
    const isFund = isRet && !isWd && String(e.desc||'').indexOf('تمويل من صندوق') === 0;
    const isToFund = !isRet && !isWd && String(e.desc||'').indexOf('إيداع لصندوق') === 0;
    const dotCls = isRet ? 'ret' : (isWd ? 'wd' : '');
    const icon = isFund ? '💸' : (isToFund ? '🏦' : (isDep ? '💰' : (isRet ? '↩' : (isWd ? '🏦' : esc((e.category||'؟').charAt(0))))));
    const label = e.desc || (isDep ? 'إيداع' : (isRet ? 'إرجاع' : (isWd ? 'سحب' : 'بدون تفاصيل')));
    const tag = isFund ? ' · تمويل' : (isToFund ? ' · لصندوق' : (isDep ? ' · إيداع' : (isRet ? ' · إرجاع' : (isWd ? ' · سحب' : ''))));
    expHtml += `
      <div class="exp" data-id="${e.id}" onclick="openEdit('${e.id}')">
        <div class="cat-dot ${dotCls}">${icon}</div>
        <div class="mid">
          <div class="desc">${esc(label)}</div>
          <div class="meta">${esc(e.date)}${e.category ? ' · ' + esc(e.category) : ''}${e.by ? ' · ' + esc(e.by) : ''}${tag}</div>
        </div>
        <div class="amt ${isRet?'ret':''}">${isRet?'+':''}${fmt(Math.abs(e.amount))}</div>
        ${state.locked ? '' : `<button class="del" onclick="event.stopPropagation();delExpense('${e.id}')" aria-label="حذف">✕</button>`}
      </div>`;
  });
  $('expList').innerHTML = (pendHtml + expHtml) || '<div class="empty"><span class="emo">' + (state.expenses.length ? '🔍' : '🧾') + '</span><b>' + (state.expenses.length ? 'ماكو نتائج للفلتر.' : 'ماكو مصاريف مسجلة بهذا الشهر.') + '</b>' + (state.expenses.length ? 'جرّب تغيّر كلمة البحث أو الفلتر.' : 'سجّل أول مصروف من تبويب «الإضافة».') + '</div>';
}

/* ---------- القفل ---------- */
function applyLock(locked){
  const lb = $('lockBanner');
  lb.style.display = locked ? 'block' : 'none';
  if(locked){
    lb.innerHTML = '🔒 شهر ' + esc(state.month) + ' مقفل — للعرض فقط. <button id="btnUnlock" style="margin-inline-start:8px;border:none;background:var(--primary);color:#fff;border-radius:8px;padding:5px 12px;font-family:inherit;font-weight:700;font-size:.72rem;cursor:pointer">🔓 فك القفل</button>';
    const ub = $('btnUnlock');
    if(ub) ub.onclick = async () => {
      if(!confirm('فك قفل شهر ' + state.month + '؟\n\nراح تكدر تعدّله من جديد، ويتلغى ترحيل باقيه للشهر الجاي.')) return;
      loading(true);
      try{
        const res = await apiPost({ action:'unlockMonth', month: state.month });
        if(guardAuth(res)) return;
        if(!res.ok) throw new Error(res.error || 'خطأ');
        toast('انفك القفل ✓ 🔓');
        await loadMonth(state.month);
      }catch(err){ toast('ما انفك: ' + err.message, true); }
      finally{ loading(false); }
    };
  }
  ['btnAddExp','btnSaveBudget','btnAddCat','btnAddSave','btnAddIncome','btnAddSalary','btnCopyLast','btnCloseMonth','btnClearMonth','expAmount','expDesc','expDate','expCat']
    .forEach(id => { const el = $(id); if(el) el.disabled = locked; });
  document.querySelectorAll('#salaryRows input, #salaryRows .rm, #catRows input, #catRows .rm, #saveRows input, #saveRows .rm, #saveRows .cgoal, #incomeRows input, #incomeRows .rm').forEach(el => el.disabled = locked);
}

/* ---------- صفوف التصنيفات والصناديق ---------- */
function addRow(section, name, amount, carried, goal){
  carried = Number(carried)||0;
  goal = Number(goal)||0;
  const isSave = section === 'save';
  const container = isSave ? $('saveRows') : $('catRows');
  const ph = isSave ? 'مثلاً: ادخار بيت' : 'مثلاً: أكل البيت';
  const phAmt = isSave ? 'شهرياً' : 'المبلغ';
  const wrap = document.createElement('div');
  const div = document.createElement('div');
  div.className = 'cat-row';
  div.innerHTML = `
    <input type="text" class="cname" placeholder="${ph}" value="${esc(name||'')}">
    <input type="tel" class="camt" placeholder="${phAmt}" inputmode="numeric" value="${amount ? Number(amount).toLocaleString('en-US') : ''}">
    <button class="rm" aria-label="حذف">✕</button>`;
  div.querySelector('.rm').onclick = () => { wrap.remove(); updateAlloc(); };
  const amt = div.querySelector('.camt');
  liveFormat(amt);
  amt.addEventListener('input', updateAlloc);
  wrap.appendChild(div);
  if(isSave){
    const goalRow = document.createElement('div');
    goalRow.className = 'goal-row';
    goalRow.innerHTML = `<span class="goal-lbl">🎯 الهدف (اختياري)</span>
      <input type="tel" class="cgoal" inputmode="numeric" placeholder="مثلاً: 5,000,000" value="${goal ? goal.toLocaleString('en-US') : ''}">`;
    liveFormat(goalRow.querySelector('.cgoal'));
    wrap.appendChild(goalRow);
  }
  if(carried){
    const note = document.createElement('div');
    note.className = 'cat-carry';
    note.textContent = isSave
      ? ('🏦 رصيد مرحّل بالصندوق: ' + fmt(carried))
      : ('↩ مرحّل: ' + fmt(carried) + ' · المتاح: ' + fmt((Number(amount)||0) + carried));
    wrap.appendChild(note);
  }
  container.appendChild(wrap);
}

function readCats(){
  const cats = [];
  document.querySelectorAll('#catRows .cat-row').forEach(r => {
    const name = r.querySelector('.cname').value.trim();
    const amount = num(r.querySelector('.camt').value);
    if(name) cats.push({ name, amount, type:'spend' });
  });
  document.querySelectorAll('#saveRows > div').forEach(wrap => {
    const r = wrap.querySelector('.cat-row');
    if(!r) return;
    const name = r.querySelector('.cname').value.trim();
    const amount = num(r.querySelector('.camt').value);
    const gEl = wrap.querySelector('.cgoal');
    const goal = gEl ? num(gEl.value) : 0;
    if(name) cats.push({ name, amount, type:'save', goal });
  });
  return cats;
}

/* ---------- صفوف الرواتب ---------- */
function addSalaryRow(person, amount){
  const wrap = document.createElement('div');
  const div = document.createElement('div');
  div.className = 'cat-row';
  div.innerHTML = `
    <input type="text" class="sname" placeholder="اسم الشخص" value="${esc(person||'')}">
    <input type="tel" class="samt" placeholder="الراتب" inputmode="numeric" value="${amount ? Number(amount).toLocaleString('en-US') : ''}">
    <button class="rm" aria-label="حذف">✕</button>`;
  div.querySelector('.rm').onclick = () => { wrap.remove(); updateAlloc(); };
  const amt = div.querySelector('.samt');
  liveFormat(amt);
  amt.addEventListener('input', updateAlloc);
  wrap.appendChild(div);
  $('salaryRows').appendChild(wrap);
}
function readSalaries(){
  const out = [];
  document.querySelectorAll('#salaryRows .cat-row').forEach(r => {
    const person = r.querySelector('.sname').value.trim();
    const amount = num(r.querySelector('.samt').value);
    if(amount > 0 || person) out.push({ person, amount });
  });
  return out;
}

/* ---------- صفوف الإيرادات الإضافية ---------- */
function addIncomeRow(desc, amount){
  const wrap = document.createElement('div');
  const div = document.createElement('div');
  div.className = 'cat-row';
  div.innerHTML = `
    <input type="text" class="iname" placeholder="مثلاً: سلفة من أخوي" value="${esc(desc||'')}">
    <input type="tel" class="iamt" placeholder="المبلغ" inputmode="numeric" value="${amount ? Number(amount).toLocaleString('en-US') : ''}">
    <button class="rm" aria-label="حذف">✕</button>`;
  div.querySelector('.rm').onclick = () => { wrap.remove(); updateAlloc(); };
  const amt = div.querySelector('.iamt');
  liveFormat(amt);
  amt.addEventListener('input', updateAlloc);
  wrap.appendChild(div);
  $('incomeRows').appendChild(wrap);
}

function readIncomes(){
  const out = [];
  document.querySelectorAll('#incomeRows .cat-row').forEach(r => {
    const desc = r.querySelector('.iname').value.trim();
    const amount = num(r.querySelector('.iamt').value);
    if(amount > 0 || desc) out.push({ desc, amount });
  });
  return out;
}

function updateAlloc(){
  const salary = readSalaries().reduce((s,x)=> s + (x.amount||0), 0);
  let income = 0;
  document.querySelectorAll('#incomeRows .iamt').forEach(i => income += num(i.value));
  let spend = 0, save = 0;
  document.querySelectorAll('#catRows .camt').forEach(i => spend += num(i.value));
  document.querySelectorAll('#saveRows .camt').forEach(i => save += num(i.value));
  $('aSalary').textContent = fmt(salary);
  $('aIncome').textContent = fmt(income);
  $('aSpend').textContent  = fmt(spend);
  $('aSave').textContent   = fmt(save);
  const left = (salary + income) - spend - save;
  $('allocLeft').textContent = fmt(left);
  $('allocLeft').className = left < 0 ? 'neg' : '';
}

/* ---------- تعديل مصروف ---------- */
window.openEdit = (id) => {
  if(state.locked) return;
  const e = state.expenses.find(x => x.id === id);
  if(!e) return;
  const cats = (state.budget.categories||[]);
  const saveNames = new Set(cats.filter(c=>c.type==='save').map(c=>c.name));
  // سحب أو قرض على صندوق → المحرر المتزامن (يضبط الدين والتمويل)
  if(e.amount > 0 && saveNames.has(e.category)) return openEditWithdraw(e.id);
  // حركة «تمويل من صندوق» → نلكه السحب الأصلي ونفتحه — تعديله يعدّل التمويل تلقائياً
  const fm = e.amount < 0 ? String(e.desc||'').match(/^تمويل من صندوق «(.+)»/) : null;
  if(fm){
    const w = state.expenses.find(x => x.id !== e.id && x.category === fm[1] && x.amount === -e.amount && x.date === e.date);
    if(w) return openEditWithdraw(w.id);
    toast('هاي حركة تمويل مرتبطة بسحب — عدّل السحب نفسه من سجل الصندوق ☰', true);
    return;
  }
  if(e.amount < 0){ toast('حركة صندوق (إيداع/إرجاع) — تكدر تحذفها من زر ✕ بس ما تنعدّل', true); return; }
  const opts = '<option value="">— بلا تصنيف —</option>' +
    cats.map(c => `<option value="${esc(c.name)}" ${c.name===e.category?'selected':''}>${esc(c.name)}${c.type==='save'?' (ادخار)':''}</option>`).join('');
  modalOpen(`
    <h2>تعديل المصروف</h2>
    <div class="hint" style="margin:0 0 8px">دخّله ${esc(e.by||'؟')}</div>
    <div class="row">
      <div><label>المبلغ</label><input type="tel" id="edAmount" inputmode="numeric" value="${(e.amount||0).toLocaleString('en-US')}"></div>
      <div><label>التاريخ</label><input type="date" id="edDate" value="${esc(e.date)}"></div>
    </div>
    <label>التفاصيل</label><input type="text" id="edDesc" value="${esc(e.desc)}">
    <label>التصنيف</label><select id="edCat">${opts}</select>
    <button class="btn" id="edSave">حفظ التعديل</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('edAmount'));
  $('edSave').onclick = async () => {
    const amount = num($('edAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    const date = $('edDate').value || e.date;
    loading(true);
    try{
      const res = await apiPost({ action:'editExpense', id:e.id, amount, date, desc:$('edDesc').value.trim(), category:$('edCat').value });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast('انعدّل ✓');
      await loadMonth(state.month);
    }catch(err){ toast('ما انعدّل: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- نقل مبلغ بين تصنيفات المصاريف ---------- */
window.openTransfer = (idx, available) => {
  if(state.locked) return;
  /* ناخذ الاسم من الـstate بالفهرس — ما نمرر نصوص المستخدم داخل onclick (حماية XSS) */
  const from = ((state.budget && state.budget.categories) || [])[idx];
  if(!from) return;
  const fromName = from.name;
  const others = (state.budget.categories||[]).filter(c => c.type !== 'save' && c.name !== fromName);
  if(!others.length) return toast('ماكو تصنيف ثاني تنقل له', true);
  const opts = others.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
  modalOpen(`
    <h2>⇄ نقل من «${esc(fromName)}»</h2>
    <div class="hint" style="margin:0 0 8px">تنقل مبلغ لتصنيف مصروف ثاني بنفس الشهر. المتاح للنقل: <b style="color:var(--primary)">${fmt(available)}</b></div>
    <label>إلى تصنيف</label>
    <select id="trTo">${opts}</select>
    <label style="margin-top:10px">المبلغ</label>
    <input type="tel" id="trAmount" inputmode="numeric" placeholder="0">
    <button class="btn" id="trSave">نقل</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('trAmount'));
  $('trSave').onclick = async () => {
    const amount = num($('trAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    if(amount > available) return toast('المبلغ أكثر من المتاح (' + fmt(available) + ')', true);
    loading(true);
    try{
      const res = await apiPost({ action:'transferCategory', month:state.month, from:fromName, to:$('trTo').value, amount });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast('انتقل المبلغ ✓ ⇄');
      await loadMonth(state.month);
    }catch(err){ toast('ما انتقل: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- إلغاء صندوق ادخار فاضي ---------- */
window.deleteFund = (idx) => {
  if(state.locked) return;
  const c = ((state.budget && state.budget.categories) || [])[idx];
  if(!c) return;
  const name = c.name;
  if(!confirm('إلغاء صندوق «' + name + '»؟\n\nلازم رصيده يكون صفر. راح ينشال من الميزانية وما يظهر بالأشهر الجاية.')) return;
  (async () => {
    loading(true);
    try{
      const res = await apiPost({ action:'deleteFund', name });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      toast('انلغى الصندوق ✓');
      await loadMonth(state.month);
    }catch(err){ toast('ما انلغى: ' + err.message, true); }
    finally{ loading(false); }
  })();
};

/* ---------- سحب من صندوق ادخار (مع خيار تسجيله كدين) ---------- */
window.openWithdraw = (idx) => {
  if(state.locked) return;
  const c = (state.budget.categories||[])[idx];
  if(!c) return;
  const spendCats = (state.budget.categories||[]).filter(x => x.type !== 'save');
  const catOpts = '<option value="">— بلا (بس اسحب) —</option>' + spendCats.map(x => `<option value="${esc(x.name)}">${esc(x.name)}</option>`).join('');
  modalOpen(`
    <h2>سحب من «${esc(c.name)}»</h2>
    <div class="hint" style="margin:0 0 8px">السحب ينقص رصيد الصندوق. لو سجّلته على حساب، يبقى مطلوب للصندوق لين ترجعه أو تشطبه.</div>
    <div class="row">
      <div><label>المبلغ</label><input type="tel" id="wdAmount" inputmode="numeric" placeholder="0"></div>
      <div><label>التاريخ</label><input type="date" id="wdDate" value="${todayISO()}"></div>
    </div>
    <label>💸 أضف المبلغ لتصنيف مصروف (اختياري)</label>
    <select id="wdTo">${catOpts}</select>
    <div class="hint" style="margin:4px 0 0">لو اخترت تصنيف، المبلغ ينضاف لميزانيته وتصرفه منه وتسجّل وين راح.</div>
    <label style="margin-top:10px">على حساب منو؟ (اختياري — للسحب كدين)</label>
    <input type="text" id="wdAcc" placeholder="مثلاً: سلفة لأخوي / حساب الراتب">
    <label>السبب (اختياري)</label><input type="text" id="wdDesc" placeholder="شنو الغرض؟">
    <button class="btn" id="wdSave">سحب</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('wdAmount'));
  setTimeout(() => { try{ $('wdAmount').focus(); }catch(_){} }, 260);
  $('wdSave').onclick = async () => {
    const amount = num($('wdAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    const date = $('wdDate').value || todayISO();
    const reason = $('wdDesc').value.trim();
    const acc = $('wdAcc').value.trim();
    const toCat = $('wdTo').value;
    loading(true);
    try{
      const res = await apiPost({
        action:'withdrawFund', month:date.slice(0,7), date, amount,
        desc: reason ? ('سحب: '+reason) : (toCat ? ('سحب لـ'+toCat) : (acc ? ('سحب على: '+acc) : 'سحب')),
        fund: c.name,
        debtAccount: acc,
        toCategory: toCat
      });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast(toCat ? ('انسحب وانضاف لـ«'+toCat+'» ✓ 💸') : (acc ? 'انسحب وانسجّل كدين ✓' : 'انسحب ✓'));
      await loadMonth(state.month);
    }catch(err){ toast('ما انسحب: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- قرض من صندوق ادخار ---------- */
window.openLoan = (idx) => {
  if(state.locked) return;
  const c = (state.budget.categories||[])[idx];
  if(!c) return;
  // رصيد الصندوق الحالي (للتوضيح فقط — ما نمنع القرض الأكبر منه)
  const wd = (state.expenses||[]).filter(e => e.category === c.name).reduce((a,e)=> a + e.amount, 0);
  const bal = (Number(c.carried)||0) + (Number(c.amount)||0) - wd;
  const spendCats = (state.budget.categories||[]).filter(x => x.type !== 'save');
  const lnCatOpts = spendCats.map(x => `<option value="${esc(x.name)}">${esc(x.name)}</option>`).join('');
  modalOpen(`
    <h2>قرض من «${esc(c.name)}» 🤝</h2>
    <div class="hint" style="margin:0 0 8px">القرض ينقص رصيد الصندوق (الحالي: <b style="color:var(--primary)">${fmt(bal)}</b>) ويظل مسجّل لين يرجّعه — والترجيع يرجع للصندوق نفسه، مو للفائض.</div>
    <div class="row">
      <div><label>المبلغ</label><input type="tel" id="lnAmount" inputmode="numeric" placeholder="0"></div>
      <div><label>التاريخ</label><input type="date" id="lnDate" value="${todayISO()}"></div>
    </div>
    <label style="margin-top:10px">القرض على منو؟</label>
    <div class="ln-seg" style="display:flex;gap:8px;margin:2px 0 4px">
      <button type="button" class="btn ghost ln-type on" data-lntype="person" style="flex:1;margin:0">👤 شخص</button>
      <button type="button" class="btn ghost ln-type" data-lntype="cat" style="flex:1;margin:0">🗂️ تصنيف مصاريف</button>
    </div>
    <div id="lnPersonWrap">
      <input type="text" id="lnAcc" placeholder="مثلاً: أخوي أحمد / صديقي">
      <label style="margin-top:10px">⏰ موعد الإرجاع المتوقع (اختياري)</label>
      <input type="date" id="lnDue">
    </div>
    <div id="lnCatWrap" style="display:none">
      ${spendCats.length
        ? `<select id="lnCat">${lnCatOpts}</select>
           <div class="hint" style="margin:4px 0 0">راح يزيد «المتاح» لهذا التصنيف كقرض من الصندوق. ولمن ترجّعه، يرجع للصندوق وينقص من التصنيف.</div>`
        : `<div class="hint" style="margin:4px 0 0">ماكو تصنيفات مصاريف بهذا الشهر — أضف تصنيف من تبويب «الميزانية» أول.</div>`}
    </div>
    <label>السبب (اختياري)</label><input type="text" id="lnDesc" placeholder="شنو المناسبة؟">
    <button class="btn" id="lnSave">سجّل القرض</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('lnAmount'));
  setTimeout(() => { try{ $('lnAmount').focus(); }catch(_){} }, 260);
  let lnType = 'person';
  document.querySelectorAll('.ln-type').forEach(btn => {
    btn.onclick = () => {
      lnType = btn.dataset.lntype;
      document.querySelectorAll('.ln-type').forEach(b => b.classList.toggle('on', b === btn));
      $('lnPersonWrap').style.display = lnType === 'person' ? '' : 'none';
      $('lnCatWrap').style.display    = lnType === 'cat'    ? '' : 'none';
    };
  });
  $('lnSave').onclick = async () => {
    const amount = num($('lnAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    const date = $('lnDate').value || todayISO();
    let acc = '', toCat = '', dueDate = '';
    if(lnType === 'cat'){
      toCat = ($('lnCat') && $('lnCat').value) || '';
      if(!toCat) return toast('اختر تصنيف المصاريف', true);
    }else{
      acc = $('lnAcc').value.trim();
      if(!acc) return toast('اكتب اسم اللي أخذ القرض', true);
      dueDate = $('lnDue').value || '';
    }
    if(amount > bal && !confirm('المبلغ أكبر من رصيد الصندوق (' + fmt(bal) + ') — الرصيد راح يصير سالب. تكمل؟')) return;
    loading(true);
    try{
      const res = await apiPost({
        action:'addLoan', month: date.slice(0,7), date, amount,
        fund: c.name, account: acc, toCategory: toCat, dueDate, desc: $('lnDesc').value.trim()
      });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast(toCat ? ('انسجّل القرض على «' + toCat + '» ✓ 🤝') : ('انسجّل القرض لـ«' + acc + '» ✓ 🤝'));
      await loadMonth(state.month);
    }catch(err){ toast('ما انسجّل: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- المتاح بتصنيف مصروف (المخصص + المرحّل − المصروف) ---------- */
function catAvailable(name){
  const c = (state.budget.categories||[]).find(x => x.name === name && x.type !== 'save');
  if(!c) return 0;
  const spent = (state.expenses||[]).filter(e => e.category === name).reduce((a,e) => a + e.amount, 0);
  return (Number(c.amount)||0) + (Number(c.carried)||0) - spent;
}

/* ---------- إيداع بصندوق ادخار — من الفائض أو من تصنيف مصروف ---------- */
window.openDeposit = async (idx) => {
  if(state.locked) return;
  const c = (state.budget.categories||[])[idx];
  if(!c) return;
  loading(true);
  let surplus = 0;
  try{
    const { data, error } = await sb.rpc('month_surplus', { p_month: state.month });
    if(error) throw error;
    surplus = Number(data) || 0;
  }catch(err){ loading(false); return toast('ما كدرت أحسب الفائض: ' + (err.message||''), true); }
  loading(false);

  // التصنيفات اللي عدها متاح موجب
  const srcCats = (state.budget.categories||[])
    .filter(x => x.type !== 'save')
    .map(x => ({ name:x.name, avail: catAvailable(x.name) }))
    .filter(x => x.avail > 0);

  if(surplus <= 0 && !srcCats.length){
    modalOpen(`
      <h2>إيداع بـ «${esc(c.name)}» 💰</h2>
      <div class="empty" style="padding:20px 6px">ماكو فلوس متاحة تودّعها هالشهر 🚫<br>لا فائض ولا باقي بأي تصنيف.<br><br>زيّد دخلك من «الإيرادات الإضافية» بتبويب الميزانية، أو قلّل التوزيع.</div>
      <button class="btn ghost" onclick="modalClose()">تمام</button>
    `);
    return;
  }

  const srcOpts = (surplus > 0 ? `<option value="">الفائض غير الموزّع (${fmt(surplus)})</option>` : '')
    + srcCats.map(x => `<option value="${esc(x.name)}">من «${esc(x.name)}» (${fmt(x.avail)})</option>`).join('');

  modalOpen(`
    <h2>إيداع بـ «${esc(c.name)}» 💰</h2>
    <label>مصدر الفلوس</label>
    <select id="dpSrc">${srcOpts}</select>
    <div class="hint" id="dpHint" style="margin:6px 0 0"></div>
    <div class="row" style="margin-top:10px">
      <div><label>المبلغ</label><input type="tel" id="dpAmount" inputmode="numeric" placeholder="0"></div>
      <div><label>التاريخ</label><input type="date" id="dpDate" value="${todayISO()}"></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
      <button class="btn ghost" id="dpMax" style="margin:0;width:auto;padding:8px 14px;font-size:.75rem">كل المتاح</button>
      <span class="hint" id="dpLeft" style="margin:0"></span>
    </div>
    <label>السبب (اختياري)</label>
    <input type="text" id="dpDesc" placeholder="مثلاً: من بيع غرض / وفّرت من الأكل">
    <button class="btn" id="dpSave">إيداع</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('dpAmount'));
  setTimeout(() => { try{ $('dpAmount').focus(); }catch(_){} }, 260);

  const capNow = () => {
    const s = $('dpSrc').value;
    return s === '' ? surplus : (srcCats.find(x => x.name === s)?.avail || 0);
  };
  const refresh = () => {
    const s = $('dpSrc').value, cap = capNow();
    $('dpHint').innerHTML = s === ''
      ? `تودّع من فلوسك غير الموزّعة — المتاح: <b style="color:var(--primary)">${fmt(cap)}</b>. الصندوق يزيد و«الباقي للصرف» ينقص.`
      : `تودّع من ميزانية «${esc(s)}» — المتاح: <b style="color:var(--primary)">${fmt(cap)}</b>. ميزانية التصنيف تنقص والصندوق يزيد.`;
    const v = num($('dpAmount').value);
    $('dpLeft').textContent = v > cap ? '⚠ أكثر من المتاح' : (v > 0 ? 'يتبقى ' + fmt(cap - v) : '');
    $('dpLeft').style.color = v > cap ? 'var(--red)' : 'var(--muted)';
  };
  refresh();
  $('dpSrc').addEventListener('change', refresh);
  $('dpAmount').addEventListener('input', refresh);
  $('dpMax').onclick = () => { $('dpAmount').value = capNow().toLocaleString('en-US'); refresh(); };
  $('dpSave').onclick = async () => {
    const amount = num($('dpAmount').value);
    const cap = capNow(), from = $('dpSrc').value;
    if(amount <= 0) return toast('دخّل المبلغ', true);
    if(amount > cap) return toast('المبلغ أكثر من المتاح (' + fmt(cap) + ')', true);
    loading(true);
    try{
      const res = await apiPost({ action:'addDeposit', fund:c.name, amount, date: $('dpDate').value || todayISO(), desc: $('dpDesc').value.trim(), fromCategory: from });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast(from ? ('انتقل من «'+from+'» للصندوق ✓ 💰') : 'انضاف للرصيد ✓ 💰');
      sndHappy();
      await loadMonth(state.month);
    }catch(err){ toast('ما انضاف: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- سجل حركات الصندوق ---------- */
window.openFundLog = (idx) => {
  const c = (state.budget.categories||[])[idx];
  if(!c) return;
  const moves = state.expenses.filter(e => e.category === c.name);
  let rows = '';
  moves.forEach(e => {
    const isDep = e.amount < 0 && String(e.desc||'').indexOf('إيداع') === 0;
    const isRet = e.amount < 0 && !isDep;
    const isLoan = e.amount > 0 && String(e.desc||'').indexOf('قرض') === 0;
    const sign = e.amount < 0 ? '+' : '−';
    const cls = e.amount < 0 ? 'plus' : 'minus';
    const kind = isDep ? 'إيداع' : (isRet ? 'إرجاع دين' : (isLoan ? 'قرض' : 'سحب'));
    const canEdit = e.amount > 0 && !state.locked;   // سحب أو قرض
    rows += `
      <div class="flog">
        <div>
          <div>${esc(e.desc || kind)}</div>
          <div class="fl-meta">${esc(e.date)} · ${kind}${e.by ? ' · ' + esc(e.by) : ''}</div>
        </div>
        <div style="display:flex;align-items:center;gap:7px">
          ${canEdit ? `<button class="fl-edit" onclick="openEditWithdraw('${e.id}', ${idx})" title="تعديل">✎</button>
          <button class="fl-del" onclick="deleteWithdraw('${e.id}', ${idx})" title="حذف">🗑</button>` : ''}
          <div class="fl-amt ${cls}">${sign}${fmt(Math.abs(e.amount))}</div>
        </div>
      </div>`;
  });
  modalOpen(`
    <h2>سجل «${esc(c.name)}» ☰</h2>
    <div class="hint" style="margin:0 0 8px">حركات شهر ${esc(state.month)} — بدّل الشهر من فوق حتى تشوف أشهر ثانية. الأخضر يزيد الرصيد والأحمر ينقصه. تكدر تعدّل ✎ أو تحذف 🗑 السحب والقرض — والتعديل يضبط الدين وتمويل التصنيف المرتبطين تلقائياً.</div>
    ${rows || '<div class="empty">ماكو حركات على هذا الصندوق بهذا الشهر.</div>'}
    <button class="btn ghost" onclick="modalClose()" style="margin-top:14px">إغلاق</button>
  `);
};

/* ---------- تعديل / حذف سحب أو قرض (متزامن مع الدين والتمويل) ---------- */
window.openEditWithdraw = (id, fundIdx) => {
  if(state.locked) return;
  const e = (state.expenses||[]).find(x => x.id === id);
  if(!e) return;
  const isLoan = String(e.desc||'').indexOf('قرض') === 0;
  const backBtn = (fundIdx == null)
    ? `<button class="btn ghost" onclick="modalClose()">إلغاء</button>`
    : `<button class="btn ghost" onclick="openFundLog(${fundIdx})">رجوع</button>`;
  modalOpen(`
    <h2>تعديل ${isLoan?'القرض':'السحب'} ✎</h2>
    <div class="hint" style="margin:0 0 8px">أي تغيير هنا ينضبط تلقائياً على: رصيد الصندوق، والدين/القرض المرتبط، وتمويل التصنيف إذا موجود.</div>
    <div class="row">
      <div><label>المبلغ</label><input type="tel" id="ewAmount" inputmode="numeric" value="${Math.abs(e.amount).toLocaleString('en-US')}"></div>
      <div><label>التاريخ</label><input type="date" id="ewDate" value="${esc(e.date)}"></div>
    </div>
    <label>التفاصيل</label><input type="text" id="ewDesc" value="${esc(e.desc||'')}">
    <button class="btn" id="ewSave">حفظ التعديل</button>
    ${backBtn}
  `);
  liveFormat($('ewAmount'));
  setTimeout(() => { try{ $('ewAmount').focus(); }catch(_){} }, 260);
  $('ewSave').onclick = async () => {
    const amount = num($('ewAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    const date = $('ewDate').value || e.date;
    if(date.slice(0,7) !== state.month) return toast('التاريخ لازم يبقى بنفس الشهر', true);
    loading(true);
    try{
      const res = await apiPost({ action:'editWithdraw', id, amount, date, desc: $('ewDesc').value.trim() });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast('انعدّل ويا كلشي مرتبط بيه ✓ ✎');
      await loadMonth(state.month);
    }catch(err){ toast('ما انعدّل: ' + err.message, true); }
    finally{ loading(false); }
  };
};

window.deleteWithdraw = async (id, fundIdx) => {
  if(state.locked) return;
  const e = (state.expenses||[]).find(x => x.id === id);
  if(!e) return;
  const isLoan = String(e.desc||'').indexOf('قرض') === 0;
  if(!confirm('حذف ' + (isLoan?'القرض':'السحب') + ' (' + fmt(e.amount) + ')؟\nراح ينحذف وياه الدين المرتبط وتمويل التصنيف إذا موجود، ويرجع المبلغ لرصيد الصندوق.')) return;
  loading(true);
  try{
    const res = await apiPost({ action:'deleteWithdraw', id });
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    modalClose();
    toast('انحذف ويا كلشي مرتبط بيه ✓');
    await loadMonth(state.month);
  }catch(err){ toast('ما انحذف: ' + err.message, true); }
  finally{ loading(false); }
};

/* ---------- إرجاع / شطب دين صندوق ---------- */
window.returnDebt = async (id) => {
  const d = (state.debts||[]).find(x=>x.id===id);
  if(!d) return;
  if(!confirm('ترجيع ' + fmt(d.amount) + ' لصندوق «' + d.fund + '»؟\nراح يرجع المبلغ لرصيد الصندوق ويتسجّل بتاريخ اليوم.')) return;
  loading(true);
  try{
    const res = await apiPost({ action:'returnDebt', id, date: todayISO() });
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    toast('انرجّع للصندوق ✓');
    await loadMonth(state.month);
  }catch(err){ toast('ما انرجّع: ' + err.message, true); }
  finally{ loading(false); }
};

window.cancelDebt = async (id) => {
  const d = (state.debts||[]).find(x=>x.id===id);
  if(!d) return;
  if(!confirm('شطب الدين «' + d.account + '» (' + fmt(d.amount) + ')؟\nالمبلغ يبقى مسحوب من الصندوق وما راح يرجع. متأكد؟')) return;
  loading(true);
  try{
    const res = await apiPost({ action:'cancelDebt', id });
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    toast('انشطب ✓');
    await loadMonth(state.month);
  }catch(err){ toast('ما انشطب: ' + err.message, true); }
  finally{ loading(false); }
};

/* ---------- نسخ الشهر الماضي ---------- */
$('btnCopyLast').onclick = async () => {
  if(!apiReady()) return toast('اربط الموقع بالـ API أول', true);
  if(state.locked) return;
  const pm = prevMonthStr(state.month);
  loading(true);
  try{
    const res = await apiGet(pm);
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    const pcats = (res.budget.categories||[]);
    if(!pcats.length){ toast('ماكو ميزانية بشهر ' + pm, true); return; }
    if(!confirm('نسخ تصنيفات وصناديق شهر ' + pm + '؟\nراح يستبدل الي مكتوب بالفورم هسه (المبالغ المرحّلة تبقى محفوظة).')) return;
    const carriedByName = {};
    (state.budget.categories||[]).forEach(c => carriedByName[c.name] = c.carried);
    $('catRows').innerHTML = '';
    $('saveRows').innerHTML = '';
    pcats.forEach(c => addRow(c.type==='save'?'save':'spend', c.name, c.amount, carriedByName[c.name]||0, c.goal));
    if(!document.querySelector('#catRows .cat-row')) addRow('spend','','',0);
    updateAlloc();
    toast('انتسخت — عدّل المبالغ واحفظ');
  }catch(err){ toast('ما انتسخت: ' + err.message, true); }
  finally{ loading(false); }
};

/* ---------- تفريغ ميزانية الشهر ---------- */
$('btnClearMonth').onclick = async () => {
  if(!apiReady()) return toast('اربط الموقع بالـ API أول', true);
  if(state.locked) return;
  if(!confirm('تفريغ ميزانية شهر ' + state.month + '؟\n\nراح تنمسح الرواتب وكل التصنيفات والصناديق لهذا الشهر (المصاريف المسجلة والمبالغ المرحّلة تنمسح وياها).\nمتأكد؟')) return;
  loading(true);
  try{
    const res = await apiPost({ action:'clearMonth', month: state.month });
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    toast('انفرّغت الميزانية ✓');
    await loadMonth(state.month);
  }catch(err){ toast('ما انفرّغت: ' + err.message, true); }
  finally{ loading(false); }
};

/* ---------- تطبيق لون (الثيم) ---------- */
window.pickTheme = (primary, keepOpen) => {
  saveTheme(primary);
  document.querySelectorAll('.sw').forEach(s=>{
    const bg = s.style.background;
    s.classList.toggle('sel', !s.classList.contains('sw-custom') && rgbEq(bg, primary));
  });
  toast('انتغيّر اللون ✓');
};
function rgbEq(a,b){
  const norm = x => { const d=document.createElement('div'); d.style.color=x; document.body.appendChild(d); const c=getComputedStyle(d).color; d.remove(); return c; };
  return norm(a) === norm(b);
}

/* ---------- تبويب الإعدادات (كل إعدادات الموقع بمكان واحد) ---------- */
function renderSettings(){
  const curPal = curPaletteId();
  const palCards = PALETTE_ORDER.map(id => {
    const p = PALETTES[id];
    return `<div class="pal ${id===curPal?'sel':''}" onclick="pickPalette('${id}')" title="${p.name}">
      <span class="pal-sky" style="background:${p.seasons.sunset}"></span>
      <span class="pal-info"><span class="pal-name">${p.name}</span>
      <span class="pal-dots"><i style="background:${p.primary}"></i><i style="background:${p.amber}"></i><i style="background:${p.green}"></i></span></span></div>`;
  }).join('');
  const clockName = CLOCK_SKINS[clockIdx % CLOCK_SKINS.length].name;

  $('settingsBody').innerHTML = `
    <div class="card">
      <div class="set-sec" style="margin-top:0">العائلة</div>
      <div class="hint" style="margin:0">كود عائلتك — انطيه لزوجك/زوجتك يدخّله وقت التسجيل حتى تصيرون بنفس المساحة وتشوفون نفس البيانات:</div>
      <div class="famcode"><b dir="ltr" id="famCode">…</b><button id="btnCopyCode">نسخ</button></div>
    </div>

    <div class="card">
      <div class="set-sec" style="margin-top:0">الحساب — ${esc(session && session.name ? session.name : '')}</div>
      <label>اسمك المعروض</label>
      <div style="display:flex;gap:8px">
        <input type="text" id="nmNew" value="${esc(session && session.name ? session.name : '')}" style="flex:1" placeholder="اسمك">
        <button class="btn" id="btnSaveName" style="margin:0;width:auto;padding:0 18px">حفظ</button>
      </div>
      <label style="margin-top:12px">الباسورد الحالي</label>
      <input type="password" id="pwCur" autocomplete="current-password" placeholder="••••••">
      <label>الباسورد الجديد</label>
      <input type="password" id="pwNew" autocomplete="new-password" placeholder="٦ خانات على الأقل">
      <label>تأكيد الباسورد الجديد</label>
      <input type="password" id="pwNew2" autocomplete="new-password" placeholder="أعد كتابته">
      <button class="btn" id="btnSavePw">تغيير الباسورد</button>
      <label style="margin-top:14px">⏱ تسجيل الخروج التلقائي عند الخمول</label>
      <select id="idleSel">
        <option value="0">لا يطلّع أبداً</option>
        <option value="2">بعد دقيقتين</option>
        <option value="5">بعد ٥ دقائق</option>
        <option value="10">بعد ١٠ دقائق</option>
        <option value="30">بعد ٣٠ دقيقة</option>
        <option value="60">بعد ساعة</option>
      </select>
    </div>

    <div class="card">
      <div class="set-sec" style="margin-top:0">المظهر</div>
      <div class="set-toggle" style="margin-top:0">
        <span class="st-lbl">🌙 الوضع الداكن (دارك مود)</span>
        <label class="switch"><input type="checkbox" id="darkToggle" ${DARK_ON?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <label>🎨 ثيم الألوان</label>
      <div class="pal-grid">${palCards}</div>
      <div class="hint" style="margin-top:2px">كل ثيم يصبغ لون الموقع + السماء (نهار/غروب/ليل والفصول) بنفس العائلة — يتطبّق فوراً وينحفظ بجهازك.</div>
      <div class="set-toggle" style="margin-top:10px">
        <span class="st-lbl">🌐 اللغة — ${LANG.cur==='en'?'English':'العربية'}</span>
        <button class="btn ghost" id="btnLangS" style="margin:0;width:auto;padding:8px 16px">${LANG.cur==='en'?'حوّل للعربية':'Switch to English'}</button>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">🕰 شكل الساعة (بالكمبيوتر) — ${clockName}</span>
        <button class="btn ghost" id="btnClockS" style="margin:0;width:auto;padding:8px 16px">غيّر الشكل</button>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">🧾 أظهر تبويب «فواتيري»</span>
        <label class="switch"><input type="checkbox" id="billsToggle" ${BILLS_ON?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">🧮 أظهر تبويب «المطابقة»</span>
        <label class="switch"><input type="checkbox" id="reconToggle" ${RECON_ON?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <label style="margin-top:12px">🌤 ثيم الخلفية (الفصول)</label>
      <select id="seasonSel">
        ${Object.keys(SEASON_NAMES).map(k => `<option value="${k}">${SEASON_NAMES[k]}</option>`).join('')}
      </select>
      <div class="hint" style="margin-top:4px">«تلقائي» يغيّر السماء مع ساعة اليوم (شمس وقمر ونجوم). باقي الثيمات ثابتة بمزاج الفصل.</div>
      <label style="margin-top:12px">🌫️ تغويش الخلفية (${skyBlur}٪)</label>
      <div class="blur-row"><input type="range" id="skyBlurRange" min="0" max="100" step="1" value="${skyBlur}"><span class="blur-val" id="skyBlurVal">${skyBlur}</span></div>
      <div class="hint" style="margin-top:4px">يغوّش السماء والخلفية فقط — البطاقات تبقى واضحة.</div>
      <label style="margin-top:12px">💵 العملة</label>
      <select id="curSel">
        ${Object.keys(CURRENCIES).map(k => `<option value="${k}">${CURRENCIES[k].name}</option>`).join('')}
      </select>
      <div class="hint" style="margin-top:4px">تتطبّق على كل المبالغ بالتطبيق فوراً.</div>
      <label style="margin-top:12px">🔤 نوع الخط</label>
      <select id="fontSel">
        ${Object.keys(FONTS).map(k => `<option value="${k}" style="font-family:${FONTS[k].stack}${FONT_FALLBACK}">${FONTS[k].name}</option>`).join('')}
      </select>
      <div class="hint" style="margin-top:4px">يتطبّق على كل التطبيق فوراً وينحفظ بجهازك. بعض الخطوط تنزل من النت أول مرة تختارها.</div>
      <label style="margin-top:12px">🔠 حجم الخط (${fontScale}٪)</label>
      <div class="blur-row"><input type="range" id="fontScaleRange" min="80" max="140" step="5" value="${fontScale}"><span class="blur-val" id="fontScaleVal">${fontScale}</span></div>
      <div class="hint" style="margin-top:4px">يكبّر أو يصغّر كل نصوص التطبيق سوا — جرّب لين يريّح عينك.</div>
    </div>

    <div class="card">
      <div class="set-sec" style="margin-top:0">الصوت</div>
      <div class="set-toggle">
        <span class="st-lbl">🔔 أصوات العمليات (إضافة / صرف / حذف)</span>
        <label class="switch"><input type="checkbox" id="sndToggle" ${SND.on?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <button class="btn ghost" id="btnMusicS" style="margin-top:8px">🎵 موسيقى الخلفية</button>
    </div>

    <div class="card">
      <div class="set-sec" style="margin-top:0">التقارير والتصدير</div>
      <button class="btn ghost" id="btnChartS" style="margin-top:0">📊 مقارنة الأشهر</button>
      <button class="btn ghost" id="btnPdf">🖨 طباعة / حفظ PDF — شهر ${esc(state.month)}</button>
      <button class="btn ghost" id="btnXlsMonth">📊 تصدير إكسل — شهر ${esc(state.month)}</button>
      <button class="btn ghost" id="btnXlsAll">🗂 تصدير إكسل — كل الأشهر</button>
      <button class="btn ghost" id="btnBackup">💾 نسخة احتياطية كاملة (ملف)</button>
    </div>

    ${session && session.admin ? `<div class="card"><div class="set-sec" style="margin-top:0">المشرف</div><button class="btn ghost" id="btnAdmin" style="margin-top:0">🛡 لوحة المشرف</button></div>` : ''}
  `;

  /* كود العائلة */
  sb.from('households').select('join_code').single().then(({ data }) => {
    $('famCode') && ($('famCode').textContent = (data && data.join_code) || '—');
  }).catch(()=>{});
  $('btnCopyCode').onclick = async () => {
    const code = $('famCode').textContent.trim();
    if(!code || code === '—' || code === '…') return;
    try{ await navigator.clipboard.writeText(code); toast('انتسخ الكود ✓'); }
    catch(_){ toast('ما كدرت أنسخ — اكتبه يدوي: ' + code, true); }
  };
  $('btnSavePw').onclick = async () => {
    const cur = $('pwCur').value, np = $('pwNew').value, np2 = $('pwNew2').value;
    if(!cur || !np) return toast('املأ الحقول', true);
    if(np.length < 6) return toast('الباسورد الجديد قصير — ٦ خانات على الأقل', true);
    if(np !== np2) return toast('التأكيد ما يطابق', true);
    loading(true);
    try{
      const { data:{ user } } = await sb.auth.getUser();
      if(!user){ doLogout(); return toast('انتهت الجلسة، سجّل دخول من جديد', true); }
      const { error: e1 } = await sb.auth.signInWithPassword({ email: user.email, password: cur });
      if(e1) throw new Error('الباسورد الحالي غلط');
      const { error: e2 } = await sb.auth.updateUser({ password: np });
      if(e2) throw new Error(e2.message);
      $('pwCur').value=''; $('pwNew').value=''; $('pwNew2').value='';
      toast('انتغيّر الباسورد ✓');
    }catch(err){ toast('ما انتغيّر: ' + err.message, true); }
    finally{ loading(false); }
  };
  if($('idleSel')){
    $('idleSel').value = String(autoLogoutMin);
    $('idleSel').onchange = (e) => {
      setAutoLogout(parseInt(e.target.value, 10));
      toast('انحفظ ✓');
    };
  }
  $('btnLangS').onclick = toggleLang;
  if($('seasonSel')){
    $('seasonSel').value = skySeason;
    $('seasonSel').onchange = (e) => { setSeason(e.target.value); toast('انتغيّر الثيم ✓ 🌤'); };
  }
  if($('skyBlurRange')){
    $('skyBlurRange').oninput = (e) => {
      const v = e.target.value;
      applySkyBlur(v);
      if($('skyBlurVal')) $('skyBlurVal').textContent = v;
    };
    $('skyBlurRange').onchange = (e) => setSkyBlur(e.target.value);
  }
  if($('curSel')){
    $('curSel').value = CURRENCY;
    $('curSel').onchange = (e) => { setCurrency(e.target.value); toast('انتغيّرت العملة ✓ 💵'); };
  }
  if($('fontSel')){
    $('fontSel').value = curFontId();
    // نحمّل كل الخطوط عند فتح الإعدادات حتى تشوف كل خيار بخطه بالقائمة
    Object.keys(FONTS).forEach(loadFont);
    $('fontSel').onchange = (e) => { setFont(e.target.value); toast('انتغيّر الخط ✓ 🔤'); };
  }
  if($('fontScaleRange')){
    $('fontScaleRange').oninput = (e) => {
      const v = e.target.value;
      applyFontScale(v);
      if($('fontScaleVal')) $('fontScaleVal').textContent = v;
    };
    $('fontScaleRange').onchange = (e) => setFontScale(e.target.value);
  }
  if($('billsToggle')) $('billsToggle').onchange = (e) => {
    BILLS_ON = e.target.checked;
    localStorage.setItem('mas_bills', BILLS_ON ? 'on' : 'off');
    applyBillsVisible();
    toast(BILLS_ON ? 'ظهر تبويب فواتيري ✓' : 'انخفى تبويب فواتيري');
  };
  if($('reconToggle')) $('reconToggle').onchange = (e) => {
    RECON_ON = e.target.checked;
    localStorage.setItem('mas_recon', RECON_ON ? 'on' : 'off');
    applyReconVisible();
    toast(RECON_ON ? 'ظهر تبويب المطابقة ✓' : 'انخفى تبويب المطابقة');
  };
  if($('darkToggle')) $('darkToggle').onchange = (e) => {
    DARK_ON = e.target.checked;
    localStorage.setItem('mas_dark', DARK_ON ? 'on' : 'off');
    applyDark();
    toast(DARK_ON ? 'الوضع الداكن 🌙 — عيونك ترتاح' : 'رجعنا للوضع الفاتح ☀️');
  };
  $('btnClockS').onclick = () => {
    clockIdx = (clockIdx + 1) % CLOCK_SKINS.length;
    localStorage.setItem('mas_clock', clockIdx);
    renderClock(); tickClock();
    renderSettings();
  };
  $('btnMusicS').onclick = openMusic;
  $('btnChartS').onclick = showMonthsChart;
  $('btnPdf').onclick = () => pdfReport();
  $('btnXlsMonth').onclick = () => exportExcel('month');
  $('btnXlsAll').onclick = () => exportExcel('all');
  if($('btnBackup')) $('btnBackup').onclick = downloadBackup;
  if($('btnAdmin')) $('btnAdmin').onclick = () => showAdmin();
  if($('sndToggle')) $('sndToggle').onchange = (e) => {
    SND.on = e.target.checked;
    localStorage.setItem('mas_snd', SND.on ? 'on' : 'off');
    if(SND.on) sndHappy();
  };
  if($('btnSaveName')) $('btnSaveName').onclick = async () => {
    const nm = $('nmNew').value.trim();
    if(!nm) return toast('دخّل الاسم', true);
    if(nm === session.name) return toast('نفس الاسم الحالي');
    loading(true);
    try{
      const { error } = await sb.rpc('change_my_name', { p_name: nm });
      if(error) throw new Error(error.message);
      session.name = nm;
      $('userName').textContent = 'مرحباً ' + nm;
      toast('انتغيّر الاسم ✓');
    }catch(err){ toast('ما انتغيّر: ' + err.message, true); }
    finally{ loading(false); }
  };
}

/* ---------- لوحة المشرف (سوبر أدمن) ---------- */
let adminHH = [];   // آخر قائمة عوائل جابها المشرف — للبحث بالـid
async function showAdmin(){
  loading(true);
  try{
    const { data, error } = await sb.rpc('admin_overview');
    if(error) throw new Error(error.message);

    const usedMB = (data.db_bytes / 1048576);
    const limitMB = (data.db_limit_bytes / 1048576);
    const usePct = Math.min(100, Math.round(usedMB / limitMB * 100));
    const hh = data.households || [];
    adminHH = hh;   // حتى adminDelete تلگه الاسم بالـid (ما نمرر نصوص داخل onclick)
    // تقدير كم عائلة باقية: على أساس متوسط حجم العائلة الحالي
    const avgPerHH = hh.length ? (data.db_bytes / hh.length) : 0;
    const freeBytes = Math.max(0, data.db_limit_bytes - data.db_bytes);
    const canAdd = avgPerHH > 0 ? Math.floor(freeBytes / avgPerHH) : '∞';

    let rows = '';
    hh.forEach(h => {
      const last = h.last_activity ? String(h.last_activity).slice(0,10) : 'ماكو نشاط';
      const mine = h.id === (session && session.hh);
      rows += `
        <div class="admin-fam">
          <div class="af-main">
            <div class="af-name">${esc(h.name || 'عائلة')} ${mine ? '<span style="color:var(--primary);font-size:.65rem">(عائلتك)</span>' : ''}</div>
            <div class="af-meta">${h.members} فرد · ${h.expenses} مصروف · ${h.months} شهر · آخر نشاط ${last}</div>
            <div class="af-meta">👥 ${esc(h.member_names || '—')} · كود: <b dir="ltr">${esc(h.code||'—')}</b></div>
          </div>
          ${mine ? '' : `<button class="af-del" onclick="adminDelete('${h.id}')">حذف</button>`}
        </div>`;
    });

    modalOpen(`
      <h2>🛡 لوحة المشرف</h2>
      <div class="admin-stats">
        <div class="astat"><div class="av">${data.total_households}</div><div class="al">عائلة</div></div>
        <div class="astat"><div class="av">${data.total_users}</div><div class="al">مستخدم</div></div>
        <div class="astat"><div class="av">${data.total_expenses}</div><div class="al">مصروف</div></div>
      </div>

      <div class="set-sec">سعة قاعدة البيانات</div>
      <div class="bar" style="height:12px"><i class="${usePct>=85?'over':(usePct>=60?'warn':'')}" style="width:${usePct}%"></i></div>
      <div class="env-sub" style="margin-top:6px"><span>مستهلك ${usedMB.toFixed(1)} م.ب</span><span>من ${limitMB.toFixed(0)} م.ب (${usePct}%)</span></div>
      <div class="famcode" style="background:var(--primary-soft)">
        <span>تقدر تضيف تقريباً</span><b>${canAdd}</b><span>عائلة إضافية</span>
      </div>
      <div class="hint" style="margin-top:6px">تقدير على أساس متوسط حجم العوائل الحالية. كل ما تكبر البيانات يتغير الرقم.</div>

      <div class="set-sec">العوائل (${hh.length})</div>
      ${rows || '<div class="empty">ماكو عوائل</div>'}

      <button class="btn ghost" onclick="modalClose()" style="margin-top:16px">إغلاق</button>
    `);
  }catch(err){ toast('ما كدرت أفتح اللوحة: ' + err.message, true); }
  finally{ loading(false); }
}
window.adminDelete = async (id) => {
  const h = adminHH.find(x => x.id === id);
  const name = (h && h.name) || 'عائلة';
  if(!confirm('حذف عائلة «' + name + '» نهائياً؟\n\nراح تنمسح كل بياناتها (المصاريف، الميزانيات، الصناديق، المستخدمين) وما ترجع.\nمتأكد ١٠٠٪؟')) return;
  loading(true);
  try{
    const { error } = await sb.rpc('admin_delete_household', { p_id: id });
    if(error) throw new Error(error.message);
    toast('انحذفت العائلة ✓');
    modalClose();
    setTimeout(showAdmin, 200);
  }catch(err){ toast('ما انحذفت: ' + err.message, true); }
  finally{ loading(false); }
};

/* ---------- بناء التقرير (مشترك بين الطباعة والـ PDF) ---------- */
function buildReportHTML(){
  const b = state.budget || { salary1:0, salary2:0, categories:[] };
  const cats = b.categories || [];
  const saveNames = new Set(cats.filter(c=>c.type==='save').map(c=>c.name));

  const spentByCat = {};
  state.expenses.forEach(e => { const k=e.category||'بلا تصنيف'; spentByCat[k]=(spentByCat[k]||0)+e.amount; });
  let spendingSpent=0, saveContrib=0, spendCarried=0, fundDeposits=0;
  cats.forEach(c => { if(c.type==='save') saveContrib+=(c.amount||0); else spendCarried+=(c.carried||0); });
  state.expenses.forEach(e => {
    if(!saveNames.has(e.category)) spendingSpent += e.amount;
    else if(e.amount < 0 && String(e.desc||'').indexOf('إيداع:') === 0) fundDeposits += -e.amount;
  });
  const totalSalary = (b.salaries && b.salaries.length)
    ? b.salaries.reduce((s,x)=> s + (Number(x.amount)||0), 0)
    : (b.salary1||0)+(b.salary2||0);
  const extraIncome = ((b.incomes)||[]).reduce((s,x)=> s + (Number(x.amount)||0), 0);
  const totalIncome = totalSalary + extraIncome;
  const remain = totalIncome + spendCarried - saveContrib - spendingSpent - fundDeposits;

  let catRows = '';
  cats.filter(c=>c.type!=='save').forEach(c=>{
    const eff = (c.amount||0)+(c.carried||0);
    const sp = spentByCat[c.name]||0;
    catRows += `<tr><td>${esc(c.name)}</td><td>${fmt(eff)}</td><td>${fmt(sp)}</td><td>${fmt(eff-sp)}</td></tr>`;
  });

  let fundRows = '';
  cats.filter(c=>c.type==='save').forEach(c=>{
    const bal = (c.carried||0)+(c.amount||0)-(spentByCat[c.name]||0);
    fundRows += `<tr><td>${esc(c.name)}</td><td>${fmt(c.carried||0)}</td><td>${fmt(c.amount||0)}</td><td>${fmt(bal)}</td></tr>`;
  });

  let debtRows = '';
  (state.debts||[]).forEach(d=>{ debtRows += `<tr><td>${esc(d.account)}</td><td>${esc(d.fund)}</td><td>${fmt(d.amount)}</td></tr>`; });

  let expRows = '';
  state.expenses.forEach(e=>{
    expRows += `<tr><td>${esc(e.date)}</td><td>${esc(e.desc||'-')}</td><td>${esc(e.category||'-')}</td><td>${esc(e.by||'-')}</td><td>${(e.amount<0?'+':'')}${fmt(Math.abs(e.amount))}</td></tr>`;
  });

  return `
    <h1>مصاريفنا — تقرير شهر ${esc(state.month)}</h1>
    <div class="p-sub">طُبع في ${todayISO()}</div>
    <div class="p-row"><span>إجمالي الرواتب</span><b>${fmt(totalSalary)}</b></div>
    ${extraIncome ? `<div class="p-row"><span>إيرادات إضافية</span><b>${fmt(extraIncome)}</b></div>
    <div class="p-row"><span>إجمالي الدخل</span><b>${fmt(totalIncome)}</b></div>` : ''}
    <div class="p-row"><span>إجمالي المصروف</span><b>${fmt(spendingSpent)}</b></div>
    <div class="p-row"><span>محجوز للادخار</span><b>${fmt(saveContrib)}</b></div>
    ${fundDeposits ? `<div class="p-row"><span>مودَع بالصناديق من الفائض</span><b>${fmt(fundDeposits)}</b></div>` : ''}
    <div class="p-row"><span>الباقي للصرف</span><b>${fmt(remain)}</b></div>

    <h3>تفاصيل التصنيفات</h3>
    <table><tr><th>التصنيف</th><th>المتاح</th><th>المصروف</th><th>الباقي</th></tr>${catRows||'<tr><td colspan="4">—</td></tr>'}</table>

    ${fundRows ? `<h3>صناديق الادخار</h3><table><tr><th>الصندوق</th><th>مرحّل</th><th>هذا الشهر</th><th>الرصيد</th></tr>${fundRows}</table>` : ''}
    ${debtRows ? `<h3>ديون الصناديق (مطلوبة)</h3><table><tr><th>الحساب</th><th>الصندوق</th><th>المبلغ</th></tr>${debtRows}</table>` : ''}

    <h3>كل المصاريف</h3>
    <table><tr><th>التاريخ</th><th>التفاصيل</th><th>التصنيف</th><th>المُدخِل</th><th>المبلغ</th></tr>${expRows||'<tr><td colspan="5">—</td></tr>'}</table>
  `;
}

/* ---------- الطباعة / حفظ PDF — ورقة نظيفة محايدة (ما تاخذ شكل الثيم)
     نبني التقرير بصفحة مستقلة داخل iframe بألوان طباعة ثابتة، والمتصفح
     يرسم العربي بنفسه (بدون jsPDF) فما يتخربط بالتلفون. لحفظ PDF:
     من نافذة الطباعة اختار «حفظ كـ PDF». ---------- */
const REPORT_CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Tahoma,'Noto Sans Arabic',Arial,sans-serif;color:#1a1a1a;background:#fff;direction:rtl;padding:26px 30px;font-size:13px;line-height:1.7}
  .rp-head{display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px solid #222;padding-bottom:10px;margin-bottom:4px}
  h1{font-size:20px;font-weight:800;color:#111}
  .rp-brand{font-size:12px;color:#555;font-weight:700}
  .p-sub{color:#666;font-size:11px;margin:6px 0 18px}
  h3{font-size:14px;font-weight:800;margin:22px 0 8px;background:#f1f1f1;border-right:4px solid #444;padding:6px 10px;color:#222;page-break-after:avoid}
  table{width:100%;border-collapse:collapse;margin:6px 0 14px;font-size:12px}
  th,td{border:1px solid #aaa;padding:6px 9px;text-align:right;vertical-align:top}
  th{background:#e9e9e9;font-weight:800;color:#222}
  tr:nth-child(even) td{background:#f8f8f8}
  tr{page-break-inside:avoid}
  .p-row{display:flex;justify-content:space-between;padding:5px 2px;border-bottom:1px dashed #ccc;font-size:13px}
  .p-row b{font-weight:800}
  .rp-foot{margin-top:26px;padding-top:10px;border-top:1px solid #bbb;color:#777;font-size:10px;display:flex;justify-content:space-between}
  @page{size:A4;margin:12mm}
  @media print{ body{padding:0} }
`;
let _printFrame = null;
function printReport(){
  // نترجم النص (لو الواجهة إنكليزي) على نسخة مؤقتة بالصفحة الرئيسية
  const stage = document.createElement('div');
  stage.innerHTML = buildReportHTML();
  try{ translateNode(stage); }catch(_){}
  const doc = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
    <title>Pocky — ${esc(state.month)}</title><style>${REPORT_CSS}</style></head>
    <body>
      <div class="rp-head"><h1>تقرير شهر ${esc(state.month)}</h1><span class="rp-brand">Pocky · مصاريفنا</span></div>
      ${stage.innerHTML.replace(/<h1>[\s\S]*?<\/h1>/, '')}
      <div class="rp-foot"><span>Pocky — إدارة مصاريف العائلة</span><span>طُبع ${todayISO()}</span></div>
    </body></html>`;
  if(_printFrame){ try{ _printFrame.remove(); }catch(_){} _printFrame = null; }
  const f = document.createElement('iframe');
  f.style.cssText = 'position:fixed;left:-99999px;top:0;width:900px;height:1200px;border:0;visibility:hidden';
  document.body.appendChild(f);
  _printFrame = f;
  f.onload = () => {
    setTimeout(() => {
      try{ f.contentWindow.focus(); f.contentWindow.print(); }
      catch(err){ toast('ما كدرت أفتح الطباعة: ' + err.message, true); }
    }, 350);
  };
  f.srcdoc = doc;
  toast('من نافذة الطباعة اختار «حفظ كـ PDF» إذا تريده ملف 📄');
}

/* ---------- تحميل مكتبة خارجية عند الحاجة بس (حتى يظل الفتح سريع) ---------- */
const _libs = {};
function loadScript(src, integrity){
  if(_libs[src]) return _libs[src];
  _libs[src] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src;
    if(integrity){ s.integrity = integrity; s.crossOrigin = 'anonymous'; }  // تحقّق سلامة الملف (SRI)
    s.onload = res;
    s.onerror = () => { delete _libs[src]; rej(new Error('ما كدرت أحمّل المكتبة — دقق على النت')); };
    document.head.appendChild(s);
  });
  return _libs[src];
}

/* ---------- تقرير PDF — نفس ورقة الطباعة النظيفة (المتصفح يحفظها PDF) ---------- */
async function pdfReport(){ printReport(); }

/* ---------- تصدير إكسل ---------- */
async function downloadBackup(){
  loading(true);
  try{
    const { data, error } = await sb.rpc('backup_all');
    if(error) throw new Error(error.message);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'مصاريفنا-نسخة-احتياطية-' + todayISO() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('انحملت النسخة الاحتياطية ✓ 💾');
  }catch(err){ toast('ما انحملت: ' + err.message, true); }
  finally{ loading(false); }
}

async function exportExcel(scope){
  loading(true);
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', 'sha384-vtjasyidUo0kW94K5MXDXntzOJpQgBKXmE7e2Ga4LG0skTTLeBi97eFAXsqewJjw');
    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: true }] };
    const money = n => Number(n) || 0;

    if(scope === 'month'){
      const b = state.budget || { salary1:0, salary2:0, categories:[], incomes:[] };
      const cats = b.categories || [];
      const spent = {};
      state.expenses.forEach(e => { const k = e.category || 'بلا تصنيف'; spent[k] = (spent[k]||0) + e.amount; });

      const sum = [['الشهر', state.month]];
      const sList = (b.salaries && b.salaries.length) ? b.salaries : [{person:'راتب 1', amount:b.salary1},{person:'راتب 2', amount:b.salary2}];
      sList.forEach(s => sum.push([s.person || 'راتب', money(s.amount)]));
      (b.incomes||[]).forEach(x => sum.push(['دخل إضافي: ' + (x.desc||''), money(x.amount)]));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sum), 'الملخص');

      const catRows = cats.map(c => ({
        'الاسم': c.name,
        'النوع': c.type === 'save' ? 'صندوق ادخار' : 'مصروف',
        'المخصص': money(c.amount),
        'المرحّل': money(c.carried),
        'الهدف': c.type === 'save' ? money(c.goal) : '',
        'المصروف/صافي السحب': money(spent[c.name]||0),
        'الباقي/الرصيد': money(c.amount) + money(c.carried) - money(spent[c.name]||0)
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(catRows), 'التصنيفات والصناديق');

      const expRows = state.expenses.map(e => ({ 'التاريخ': e.date, 'التفاصيل': e.desc, 'التصنيف': e.category, 'المُدخِل': e.by, 'المبلغ': e.amount }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expRows), 'المصاريف');

      const debtRows = (state.debts||[]).map(d => ({ 'الحساب': d.account, 'الصندوق': d.fund, 'المبلغ': money(d.amount), 'التاريخ': d.date }));
      if(debtRows.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(debtRows), 'الديون المفتوحة');

      XLSX.writeFile(wb, 'مصاريفنا-' + state.month + '.xlsx');
    }else{
      const { data, error } = await sb.rpc('export_all');
      if(error) throw new Error(error.message);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet((data.budgets||[]).map(b => ({ 'الشهر': b.month, 'راتب 1': money(b.salary1), 'راتب 2': money(b.salary2), 'مقفل': b.locked ? 'نعم' : 'لا' }))), 'الميزانيات');
      const inc = (data.incomes||[]).map(i => ({ 'الشهر': i.month, 'الوصف': i.desc, 'المبلغ': money(i.amount) }));
      if(inc.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inc), 'إيرادات إضافية');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet((data.categories||[]).map(c => ({ 'الشهر': c.month, 'الاسم': c.name, 'النوع': c.type === 'save' ? 'صندوق ادخار' : 'مصروف', 'المخصص': money(c.amount), 'المرحّل': money(c.carried) }))), 'التصنيفات');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet((data.expenses||[]).map(e => ({ 'الشهر': e.month, 'التاريخ': e.date, 'التفاصيل': e.desc, 'التصنيف': e.category, 'المُدخِل': e.by, 'المبلغ': money(e.amount) }))), 'المصاريف');
      const dr = (data.debts||[]).map(d => ({ 'الشهر': d.month, 'الحساب': d.account, 'الصندوق': d.fund, 'المبلغ': money(d.amount), 'الحالة': d.status, 'التاريخ': d.date }));
      if(dr.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dr), 'الديون');
      XLSX.writeFile(wb, 'مصاريفنا-كل-الأشهر.xlsx');
    }
    toast('انصدّر الإكسل ✓ 📊');
  }catch(err){ toast('ما انصدّر: ' + err.message, true); }
  finally{ loading(false); }
}

/* ---------- مقارنة الأشهر ---------- */
async function showMonthsChart(){
  loading(true);
  try{
    const { data, error } = await sb.rpc('months_summary');
    if(error) throw new Error(error.message);
    const arr = (data||[]).slice(-12);
    if(!arr.length){ toast('بعد ماكو أشهر للمقارنة', true); return; }

    const max = Math.max(1, ...arr.map(m => Math.max(m.spent||0, m.income||0)));
    const W = Math.max(340, 20 + arr.length * 52), base = 172, H = 212;
    let bars = '';
    arr.forEach((m, i) => {
      const x = 12 + i * 52;
      const hi = Math.max(2, Math.round((m.income||0) / max * 132));
      const hs = Math.max(0, Math.round(Math.max(0, m.spent||0) / max * 132));
      const cur = m.month === state.month;
      bars += `<g style="cursor:pointer" onclick="gotoMonth('${m.month}')">
        <rect x="${x}" y="${base-hi}" width="16" height="${hi}" rx="4" fill="var(--primary-soft)"/>
        <rect x="${x+18}" y="${base-Math.max(hs,2)}" width="16" height="${Math.max(hs,2)}" rx="4" fill="${(m.spent||0) > (m.income||0) ? 'var(--red)' : 'var(--primary)'}"/>
        <text x="${x+17}" y="${base+16}" text-anchor="middle" font-size="9" fill="${cur ? 'var(--primary)' : '#8A8A8E'}" font-weight="${cur ? '800' : '400'}">${m.month.slice(2).replace('-','/')}${m.locked ? ' 🔒' : ''}</text>
      </g>`;
    });
    const avg = Math.round(arr.reduce((s,m)=> s + (m.spent||0), 0) / arr.length);
    const top = arr.reduce((a,b)=> (b.spent||0) > (a.spent||0) ? b : a);
    modalOpen(`
      <h2>📊 مقارنة الأشهر</h2>
      <div class="hint" style="margin:0 0 6px">العمود الفاتح = الدخل، والغامق = المصروف (يحمرّ إذا الصرف تجاوز الدخل). اضغط على أي شهر حتى تفتحه.</div>
      <div style="overflow-x:auto;direction:ltr"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;margin:0 auto">${bars}</svg></div>
      <div class="alloc-line"><span>معدل الصرف الشهري</span><b>${fmt(avg)}</b></div>
      <div class="alloc-line"><span>أعلى شهر صرف</span><b>${esc(top.month)} — ${fmt(top.spent||0)}</b></div>
      <button class="btn ghost" onclick="modalClose()">إغلاق</button>
    `);
  }catch(err){ toast('ما كدرت أجيب المقارنة: ' + err.message, true); }
  finally{ loading(false); }
}
window.gotoMonth = (m) => { modalClose(); loadMonth(m); };

/* ---------- عدّاد متحرك لأرقام الهيدر ---------- */
function setStat(el, value){
  const from = Number(el.dataset.v || 0), to = Number(value) || 0;
  el.dataset.v = to;
  if(from === to){ el.textContent = fmt(to); return; }
  const t0 = performance.now(), dur = 550;
  cancelAnimationFrame(el._raf);
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(Math.round(from + (to - from) * e));
    if(k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}

/* ---------- احتفال بسيط عند إقفال الشهر 🎉 ---------- */
function confetti(){
  try{
    const cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:300';
    cv.width = innerWidth; cv.height = innerHeight;
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const P = Array.from({ length: 110 }, () => ({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .4,
      r: 3 + Math.random() * 5, c: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      vy: 2.2 + Math.random() * 3.4, vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI, vr: -.1 + Math.random() * .2
    }));
    let n = 0;
    (function tick(){
      ctx.clearRect(0, 0, cv.width, cv.height);
      P.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r); ctx.restore();
      });
      if(++n < 150) requestAnimationFrame(tick); else cv.remove();
    })();
  }catch(_){}
}

/* ---------- أحداث ---------- */
document.querySelectorAll('nav button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    $(btn.dataset.tab).classList.add('active');
    if(btn.dataset.tab === 'tab-settings') renderSettings();
    if(btn.dataset.tab === 'tab-bills') loadBills();
    if(btn.dataset.tab === 'tab-recon') loadRecons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

$('btnLogin').onclick = doLogin;
$('liPass').addEventListener('keydown', e => { if(e.key === 'Enter') doLogin(); });
$('btnLogout').onclick = () => {
  modalOpen(`
    <h2>تسجيل الخروج</h2>
    <div class="hint" style="margin:0 0 14px">متأكد تريد تسجّل خروج؟</div>
    <button class="btn" id="lgYes">نعم، خروج</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  $('lgYes').onclick = () => { modalClose(); doLogout(); };
};

$('lnkSignup').onclick = () => toggleAuth(true);
$('lnkLogin').onclick = () => toggleAuth(false);
$('btnSignup').onclick = doSignup;
$('suCode').addEventListener('keydown', e => { if(e.key === 'Enter') doSignup(); });

$('monthPick').onchange = e => loadMonth(e.target.value || thisMonth());

/* فلتر المصاريف */
$('fltText').addEventListener('input', renderExpenseList);
$('fltCat').addEventListener('change', () => render());   // يحدّث القائمة + تظليل الرسم
$('fltBy').addEventListener('change', renderExpenseList);

/* ---------- الأزرار السريعة ---------- */
let quickItems = [], quickEditing = false;
/* ============================================================
   فواتيري — فواتير الشهر ومتابعة الدفع
   ============================================================ */
let billsItems = [];
let BILLS_ON = localStorage.getItem('mas_bills') !== 'off';   // ظاهر افتراضياً
function applyBillsVisible(){
  const nb = $('navBills');
  if(nb) nb.style.display = BILLS_ON ? '' : 'none';
  // لو كان مفتوح وانطفى، رجّعه للوحة
  if(!BILLS_ON){
    const bt = $('tab-bills');
    if(bt && bt.classList.contains('active')){
      document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      const db = document.querySelector('nav button[data-tab="tab-dash"]');
      if(db) db.classList.add('active');
      const dt = $('tab-dash'); if(dt) dt.classList.add('active');
    }
  }
}
async function loadBills(){
  try{
    const { data, error } = await sb.rpc('list_bills', { p_month: state.month });
    if(error) throw error;
    billsItems = data || [];
  }catch(_){ billsItems = []; }
  renderBills();
}
function renderBills(){
  const list = $('billsList'), sum = $('billsSummary');
  if(!list || !sum) return;

  const total  = billsItems.reduce((a,b)=> a + (Number(b.amount)||0), 0);
  const paid   = billsItems.filter(b=>b.paid).reduce((a,b)=> a + (Number(b.amount)||0), 0);
  const unpaid = total - paid;
  const avail  = state._surplus || 0;
  const diff   = avail - unpaid;
  const today  = new Date().getDate();

  sum.innerHTML = `
    <h2 style="margin-top:0">🧾 ملخص فواتير ${esc(state.month)}</h2>
    <div class="bl-stat"><span>إجمالي الفواتير</span><b>${fmt(total)}</b></div>
    <div class="bl-stat"><span>✓ المدفوع</span><b style="color:var(--primary)">${fmt(paid)}</b></div>
    <div class="bl-stat"><span>⏳ الباقي عليك</span><b style="color:${unpaid>0?'var(--red,#c0392b)':'var(--primary)'}">${fmt(unpaid)}</b></div>
    <div class="bl-stat"><span>💵 الباقي للصرف عندك</span><b>${fmt(avail)}</b></div>
    ${billsItems.length ? (unpaid <= 0
      ? `<div class="bl-verdict good">🎉 دفعت كل فواتير الشهر — عاشت إيدك!</div>`
      : (diff >= 0
        ? `<div class="bl-verdict good">✅ فلوسك تكفّي الفواتير الباقية، ويظل عندك ${fmt(diff)}</div>`
        : `<div class="bl-verdict bad">⚠️ الفلوس ما تكفّي — ناقصك ${fmt(-diff)} للفواتير الباقية</div>`)) : ''}
  `;

  if(!billsItems.length){
    list.innerHTML = '<div class="empty" style="padding:14px">ماكو فواتير مسجلة هالشهر — أضف وحدة من تحت، أو انسخ فواتير الشهر الماضي.</div>';
    return;
  }
  list.innerHTML = billsItems.map(b => {
    let cls = b.paid ? 'paid' : '';
    let meta = '';
    if(b.dueDay){
      const left = b.dueDay - today;
      if(!b.paid && left < 0){ cls += ' overdue'; meta = 'فات موعدها (يوم ' + b.dueDay + ')'; }
      else if(!b.paid && left <= 3){ cls += ' due-soon'; meta = left === 0 ? 'تستحق اليوم!' : 'باقي ' + left + ' يوم (يوم ' + b.dueDay + ')'; }
      else meta = 'يوم ' + b.dueDay + ' بالشهر';
    }
    return `
      <div class="bill ${cls}">
        <button class="bl-chk" onclick="toggleBill('${b.id}', ${!b.paid})">${b.paid ? '✓' : ''}</button>
        <div class="bl-main">
          <div class="bl-name">${esc(b.name)}</div>
          ${meta ? `<div class="bl-meta">${esc(meta)}</div>` : ''}
        </div>
        <div class="bl-amt">${fmt(b.amount)}</div>
        <button class="bl-del" onclick="deleteBill('${b.id}')" aria-label="حذف">✕</button>
      </div>`;
  }).join('');
}
window.toggleBill = async (id, paid) => {
  const b = billsItems.find(x=>x.id===id);
  if(b){ b.paid = paid; renderBills(); }   // تحديث فوري بالواجهة
  try{
    const { error } = await sb.rpc('toggle_bill', { p_id:id, p_paid:paid });
    if(error) throw error;
    if(paid) sndHappy();
  }catch(err){ toast('ما انحفظ: ' + err.message, true); loadBills(); }
};
window.deleteBill = async (id) => {
  const b = billsItems.find(x=>x.id===id);
  const name = b ? b.name : '';
  if(!confirm('حذف فاتورة «' + name + '»؟')) return;
  try{
    const { error } = await sb.rpc('delete_bill', { p_id:id });
    if(error) throw error;
    billsItems = billsItems.filter(x=>x.id!==id);
    renderBills();
    toast('انحذفت ✓'); sndTick();
  }catch(err){ toast('ما انحذفت: ' + err.message, true); }
};

/* ============================================================
   المطابقة — جردة الفلوس الفعلية مقابل رصيد النظام
   ============================================================ */
let reconItems = [];
let RECON_ON = localStorage.getItem('mas_recon') !== 'off';   // ظاهر افتراضياً
let DARK_ON = localStorage.getItem('mas_dark') === 'on';      // فاتح افتراضياً
function applyDark(){
  document.body.classList.toggle('dark', DARK_ON);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content = DARK_ON ? '#1C1712' : (getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#C86B4A');
}
function applyReconVisible(){
  const nb = $('navRecon');
  if(nb) nb.style.display = RECON_ON ? '' : 'none';
  if(!RECON_ON){
    const rt = $('tab-recon');
    if(rt && rt.classList.contains('active')){
      document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      const db = document.querySelector('nav button[data-tab="tab-dash"]');
      if(db) db.classList.add('active');
      const dt = $('tab-dash'); if(dt) dt.classList.add('active');
    }
  }
}
function reconSystemTotal(){
  return (state._remainRaw || 0) + (state._fundTotal || 0);
}
function renderReconSystem(){
  const box = $('reconSystem');
  if(!box) return;
  const remain = state._remainRaw || 0;
  const funds  = state._fundTotal || 0;
  const sys    = reconSystemTotal();
  box.innerHTML = `
    <h2 style="margin-top:0">🧮 رصيدك بالنظام — ${esc(state.month)}</h2>
    <div class="bl-stat"><span>💵 الباقي للصرف</span><b style="color:${remain<0?'var(--red,#c0392b)':'var(--ink)'}">${remain<0?'−':''}${fmt(Math.abs(remain))}</b></div>
    <div class="bl-stat"><span>🏦 أرصدة الصناديق</span><b>${fmt(funds)}</b></div>
    <div class="bl-stat" style="border-top:1px solid var(--line);margin-top:4px;padding-top:9px"><span><b>= المفروض بإيدك</b></span><b style="color:var(--primary);font-size:.95rem">${sys<0?'−':''}${fmt(Math.abs(sys))}</b></div>
    <div class="hint" style="margin-top:8px">الديون والقروض المفتوحة مو محسوبة — لأنها فلوس طالعة من إيدك وراجعة للصناديق بعدين.</div>
  `;
}
function reconActual(){
  return num($('rcCash').value) + num($('rcBank').value) + num($('rcOther').value);
}
function reconLive(){
  const live = $('rcLive');
  if(!live) return;
  const actual = reconActual();
  if(actual <= 0){ live.style.display = 'none'; return; }
  const sys = reconSystemTotal();
  const diff = actual - sys;
  live.style.display = '';
  if(Math.abs(diff) < 1){
    live.className = 'rc-diff';
    live.innerHTML = '✅ مطابق تماماً — الفعلي ' + fmt(actual);
  }else if(diff < 0){
    live.className = 'rc-diff bad';
    live.innerHTML = '⚠️ ناقصك <b>' + fmt(-diff) + '</b> — يمكن أكو مصاريف مو مسجلة';
  }else{
    live.className = 'rc-diff warn';
    live.innerHTML = '💡 عندك زيادة <b>' + fmt(diff) + '</b> — يمكن أكو دخل مو مسجّل';
  }
}
async function loadRecons(){
  renderReconSystem();
  reconLive();
  try{
    const { data, error } = await sb.rpc('list_recons', { p_limit: 15 });
    if(error) throw error;
    reconItems = data || [];
  }catch(_){ reconItems = []; }
  renderRecons();
}
function renderRecons(){
  const list = $('reconList');
  if(!list) return;
  if(!reconItems.length){
    list.innerHTML = '<div class="empty" style="padding:14px">بعد ما مسوّي أي مطابقة — عدّ فلوسك وسجّل أول جردة من فوك 👆</div>';
    return;
  }
  list.innerHTML = reconItems.map(r => {
    const actual = (Number(r.cash)||0) + (Number(r.bank)||0) + (Number(r.other)||0);
    const sys = Number(r.systemTotal)||0;
    const diff = actual - sys;
    const badge = Math.abs(diff) < 1
      ? '<span class="rc-badge ok">✓ مطابق</span>'
      : (diff < 0 ? '<span class="rc-badge miss">ناقص ' + fmt(-diff) + '</span>'
                  : '<span class="rc-badge extra">زايد ' + fmt(diff) + '</span>');
    const parts = [];
    if(r.cash > 0)  parts.push('💵 ' + fmt(r.cash));
    if(r.bank > 0)  parts.push('🏦 ' + fmt(r.bank));
    if(r.other > 0) parts.push('💍 ' + fmt(r.other));
    return `
      <div class="rc-item">
        <div class="rc-line">
          <span class="rc-date">${esc(r.date)}</span>
          ${badge}
          <button class="rc-del" onclick="deleteRecon('${r.id}')" aria-label="حذف">✕</button>
        </div>
        <div class="rc-sub">الفعلي ${fmt(actual)} (${parts.join(' · ')}) مقابل النظام ${fmt(sys)}${r.byName ? ' · سجّلها ' + esc(r.byName) : ''}${r.note ? '<br>📝 ' + esc(r.note) : ''}</div>
      </div>`;
  }).join('');
}
window.deleteRecon = async (id) => {
  if(!confirm('حذف هذه المطابقة من السجل؟')) return;
  try{
    const { error } = await sb.rpc('delete_recon', { p_id: id });
    if(error) throw error;
    reconItems = reconItems.filter(x=>x.id!==id);
    renderRecons();
    toast('انحذفت ✓'); sndTick();
  }catch(err){ toast('ما انحذفت: ' + err.message, true); }
};

async function loadQuick(){
  try{
    const { data, error } = await sb.rpc('list_quick');
    if(error) throw error;
    quickItems = data || [];
    renderQuick();
  }catch(_){ quickItems = []; renderQuick(); }
}
function renderQuick(){
  const box = $('quickList');
  if(!box) return;
  if(!quickItems.length){
    box.innerHTML = '<div class="empty" style="padding:14px">ماكو أزرار بعد — اضغط «＋ زر جديد» وسوّي أزرار لمصاريفك المتكررة.</div>';
    return;
  }
  box.innerHTML = '<div class="quick-grid">' + quickItems.map(q => `
    <div class="qbtn ${quickEditing?'editing':''}" onclick="useQuick('${q.id}')">
      <button class="qb-del" onclick="event.stopPropagation();removeQuick('${q.id}')" aria-label="حذف">✕</button>
      <span class="qb-label">${esc(q.label)}</span>
      <span class="qb-sub">${q.amount>0 ? fmt(q.amount) : 'بلا مبلغ'}${q.category ? ' · ' + esc(q.category) : ''}</span>
    </div>`).join('') +
    `<div class="qbtn" style="justify-content:center;align-items:center;color:var(--muted)" onclick="toggleQuickEdit()">${quickEditing ? '✓ تم' : '✎ تعديل'}</div>` +
    '</div>';
}
window.toggleQuickEdit = () => { quickEditing = !quickEditing; renderQuick(); };
window.useQuick = async (id) => {
  if(quickEditing) return;
  const q = quickItems.find(x => x.id === id);
  if(!q) return;
  if(state.locked) return toast('الشهر مقفل', true);
  // إذا الزر إله مبلغ ثابت → سجّل فوراً. إذا لا → عبّي الفورم بس
  if(q.amount > 0){
    const date = $('expDate').value || todayISO();
    loading(true);
    try{
      const res = await apiPost({ action:'addExpense', month: date.slice(0,7), date, amount: q.amount, desc: q.label, category: q.category });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      toast('انسجّل «' + q.label + '» ✓ ⚡');
      sndSad();
      if(date.slice(0,7) === state.month) await loadMonth(state.month);
    }catch(err){ toast('ما انسجّل: ' + err.message, true); }
    finally{ loading(false); }
  }else{
    $('expDesc').value = q.label;
    if(q.category) $('expCat').value = q.category;
    $('expAmount').focus();
    toast('عبّي المبلغ واضغط إضافة');
  }
};
window.removeQuick = async (id) => {
  const q = quickItems.find(x => x.id === id);
  if(!q || !confirm('حذف زر «' + q.label + '»؟')) return;
  try{
    const { error } = await sb.rpc('delete_quick', { p_id: id });
    if(error) throw error;
    quickItems = quickItems.filter(x => x.id !== id);
    renderQuick();
    toast('انحذف ✓');
  }catch(err){ toast('ما انحذف: ' + err.message, true); }
};
function openAddQuick(){
  const cats = ((state.budget && state.budget.categories) || []).filter(c => c.type !== 'save');
  const opts = '<option value="">— بلا تصنيف —</option>' + cats.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
  modalOpen(`
    <h2>⚡ زر سريع جديد</h2>
    <div class="hint" style="margin:0 0 8px">لو حطيت مبلغ ثابت، الزر يسجّل المصروف بضغطة. لو خليته فارغ، يعبّي الفورم وتكتب المبلغ كل مرة.</div>
    <label>اسم الزر</label>
    <input type="text" id="qkLabel" placeholder="مثلاً: كهرباء / بنزين / إيجار">
    <div class="row" style="margin-top:10px">
      <div><label>المبلغ (اختياري)</label><input type="tel" id="qkAmount" inputmode="numeric" placeholder="ثابت أو فارغ"></div>
      <div><label>التصنيف</label><select id="qkCat">${opts}</select></div>
    </div>
    <button class="btn" id="qkSave">حفظ الزر</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('qkAmount'));
  $('qkSave').onclick = async () => {
    const label = $('qkLabel').value.trim();
    if(!label) return toast('دخّل اسم الزر', true);
    loading(true);
    try{
      const { error } = await sb.rpc('add_quick', { p_label: label, p_category: $('qkCat').value, p_amount: num($('qkAmount').value) });
      if(error) throw new Error(error.message);
      modalClose();
      toast('انضاف الزر ✓ ⚡');
      await loadQuick();
    }catch(err){ toast('ما انضاف: ' + err.message, true); }
    finally{ loading(false); }
  };
}

$('btnAddExp').onclick = async () => {
  if(!apiReady()) return toast('اربط الموقع بالـ API أول', true);
  const amount = num($('expAmount').value);
  if(amount <= 0) return toast('دخّل المبلغ', true);
  const date = $('expDate').value || todayISO();
  const month = date.slice(0,7);
  const payload = {
    action:'addExpense', month, date, amount,
    desc: $('expDesc').value.trim(),
    category: $('expCat').value
  };
  loading(true);
  try{
    const res = await apiPost(payload);
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    $('expAmount').value=''; $('expDesc').value='';
    toast('انحفظ المصروف ✓');
    sndSad();
    if(month === state.month){ await loadMonth(state.month); }
  }catch(err){
    if(isNetErr(err.message)){
      /* ماكو نت — نحفظه بطابور الجهاز وينرفع تلقائياً من يرجع الاتصال */
      offlineAdd({ month, date, amount, desc: payload.desc, category: payload.category });
      $('expAmount').value=''; $('expDesc').value='';
      toast('ماكو نت — انحفظ بالجهاز وينرفع من يرجع الاتصال ⏳');
      if(month === state.month) renderExpenseList();
    }else{
      toast('ما انحفظ: ' + err.message, true);
    }
  }
  finally{ loading(false); }
};

/* ---------- رفع طابور الأوفلاين ---------- */
let offlineFlushing = false;
async function flushOffline(){
  if(offlineFlushing || !session) return;
  const list = offlineList();
  if(!list.length) return;
  offlineFlushing = true;
  let sent = 0;
  try{
    for(const q of list){
      const res = await apiPost({ action:'addExpense', month:q.month, date:q.date, amount:q.amount, desc:q.desc||'', category:q.category||'' });
      if(res.ok){ offlineRemove(q.qid); sent++; }
      else if(res.authFail || isNetErr(res.error)) break;          // نوقف ونحاول بعدين
      else { offlineRemove(q.qid); toast('مصروف معلّق انرفض: ' + res.error, true); }  // رفض حقيقي (مثلاً شهر مقفل)
    }
  }catch(_){ /* نحاول بالمرة الجاية */ }
  finally{ offlineFlushing = false; }
  if(sent){
    toast('انرفعت ' + sent + ' مصاريف كانت معلّقة ✓ ☁️');
    try{ await loadMonth(state.month); }catch(_){}
  }
}
window.addEventListener('online', () => { flushOffline(); });
window.removeOffline = (qid) => {
  if(!confirm('حذف هذا المصروف المعلّق؟ (بعده ما انرفع للسيرفر)')) return;
  offlineRemove(qid);
  renderExpenseList();
  toast('انحذف من الطابور ✓');
};

window.delExpense = async (id) => {
  const e = state.expenses.find(x => x.id === id);
  if(e){
    const saveNames = new Set(((state.budget&&state.budget.categories)||[]).filter(c=>c.type==='save').map(c=>c.name));
    // سحب/قرض على صندوق → الحذف المتزامن (يشيل الدين والتمويل وياه)
    if(e.amount > 0 && saveNames.has(e.category)) return deleteWithdraw(e.id);
    // حركة تمويل/قرض مربوطة بسحب صندوق → نحذف السحب الأصلي حتى ما يبقى مبلغ معلّق.
    // الربط الدقيق بالـlink_id من السيرفر (migration: sql/expense-link-id.sql)
    if(e.amount < 0 && e.linkId) return deleteWithdraw(e.linkId);
    // توافق: قواعد قديمة بلا linkId — مطابقة بالوصف والمبلغ والتاريخ (تقريبية)
    const fm = e.amount < 0 ? String(e.desc||'').match(/^تمويل من صندوق «(.+)»/) : null;
    if(fm){
      const w = state.expenses.find(x => x.id !== e.id && x.category === fm[1] && x.amount === -e.amount && x.date === e.date);
      if(w) return deleteWithdraw(w.id);
    }
  }
  if(!confirm('متأكد تريد تحذف هذا المصروف؟')) return;
  loading(true);
  try{
    const res = await apiPost({ action:'deleteExpense', id });
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    toast('انحذف ✓');
    sndTick();
    await loadMonth(state.month);
  }catch(err){ toast('ما انحذف: ' + err.message, true); }
  finally{ loading(false); }
};

$('btnAddCat').onclick = () => addRow('spend','','',0);
$('btnAddQuick').onclick = openAddQuick;
/* المطابقة — الفورم */
['rcCash','rcBank','rcOther'].forEach(id => {
  liveFormat($(id));
  $(id).addEventListener('input', reconLive);
});
$('btnAddRecon').onclick = async () => {
  const cash = num($('rcCash').value), bank = num($('rcBank').value), other = num($('rcOther').value);
  if(cash + bank + other <= 0) return toast('دخّل مبلغ واحد على الأقل', true);
  loading(true);
  try{
    const { error } = await sb.rpc('add_recon', {
      p_month: state.month, p_date: todayISO(),
      p_cash: cash, p_bank: bank, p_other: other,
      p_note: $('rcNote').value.trim(), p_system: reconSystemTotal()
    });
    if(error) throw new Error(error.message);
    $('rcCash').value=''; $('rcBank').value=''; $('rcOther').value=''; $('rcNote').value='';
    reconLive();
    toast('انحفظت المطابقة ✓ 🧮'); sndHappy();
    await loadRecons();
  }catch(err){ toast('ما انحفظت: ' + err.message, true); }
  finally{ loading(false); }
};

liveFormat($('blAmount'));
$('btnAddBill').onclick = async () => {
  const name = $('blName').value.trim();
  const amount = num($('blAmount').value);
  const day = parseInt($('blDay').value, 10) || null;
  if(!name) return toast('دخّل اسم الفاتورة', true);
  loading(true);
  try{
    const { error } = await sb.rpc('add_bill', { p_month: state.month, p_name: name, p_amount: amount, p_due_day: day });
    if(error) throw new Error(error.message);
    $('blName').value=''; $('blAmount').value=''; $('blDay').value='';
    toast('انضافت الفاتورة ✓ 🧾');
    await loadBills();
  }catch(err){ toast('ما انضافت: ' + err.message, true); }
  finally{ loading(false); }
};
$('btnCopyBills').onclick = async () => {
  const [y,m] = state.month.split('-').map(Number);
  const d = new Date(y, m-2, 1);
  const prev = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  loading(true);
  try{
    const { data, error } = await sb.rpc('copy_bills', { p_from: prev, p_to: state.month });
    if(error) throw new Error(error.message);
    toast(data ? ('انتسخت ' + data + ' فاتورة ✓') : 'ماكو فواتير جديدة تنتسخ', !data);
    await loadBills();
  }catch(err){ toast('ما انتسخت: ' + err.message, true); }
  finally{ loading(false); }
};
$('btnAddSave').onclick = () => addRow('save','','',0);
$('btnAddIncome').onclick = () => { addIncomeRow('', 0); updateAlloc(); };
$('btnAddSalary').onclick = () => { addSalaryRow('', ''); updateAlloc(); };
liveFormat($('expAmount'));

$('btnSaveBudget').onclick = async () => {
  if(!apiReady()) return toast('اربط الموقع بالـ API أول', true);
  const payload = {
    action:'saveBudget',
    month: state.month,
    salaries: readSalaries(),
    categories: readCats(),
    incomes: readIncomes()
  };
  loading(true);
  try{
    const res = await apiPost(payload);
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    toast('انحفظت الميزانية ✓');
    await loadMonth(state.month);
  }catch(err){ toast('ما انحفظت: ' + err.message, true); }
  finally{ loading(false); }
};

$('btnCloseMonth').onclick = () => {
  if(!apiReady()) return toast('اربط الموقع بالـ API أول', true);
  if(state.locked) return;
  const surplus = state._surplus || 0;
  modalOpen(`
    <h2>إقفال شهر ${esc(state.month)}</h2>
    <div class="hint" style="margin:0 0 12px">راح ينقفل الشهر للعرض فقط (تكدر تفتحه بعدين)، ويترحّل باقي كل تصنيف وصندوق للشهر الجاي.</div>
    ${surplus > 0 ? `
    <label class="set-toggle" style="cursor:pointer">
      <span class="st-lbl">↪ رحّل الفائض غير الموزّع (${fmt(surplus)}) كرصيد مبدئي للشهر الجاي</span>
      <span class="switch"><input type="checkbox" id="carrySurplus" checked><span class="track"></span><span class="knob"></span></span>
    </label>` : ''}
    <button class="btn" id="doClose">إقفال الشهر ✓</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  $('doClose').onclick = async () => {
    const carry = surplus > 0 && $('carrySurplus') && $('carrySurplus').checked;
    modalClose();
    loading(true);
    try{
      const res = await apiPost({ action: carry ? 'closeMonthCarry' : 'closeMonth', month: state.month });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      toast('انقفل الشهر وانرحّل الباقي ✓ 🎉');
      confetti();
      await loadMonth(state.month);
    }catch(err){ toast('ما انقفل: ' + err.message, true); }
    finally{ loading(false); }
  };
};

