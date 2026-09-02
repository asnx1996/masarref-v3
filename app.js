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
// ألوان الرسم البياني (الدونات) — تُضبط حسب الباليت الفعّال.
// قِطَع الدونات لازم تتميّز عن بعضها قبل ما تتناسق ويّا الثيم: القوس اللوني
// واسع (٣٠٠°) والإضاءة تتناوب، فأي قطعتين متجاورتين تفرقان بمحورين مو بواحد.
let PALETTE = ['#2C8FB0','#748CF7','#6053BC','#CD7FC2','#A1367B','#E66A53','#A0491A','#BE9A07','#706900','#4EAC6C'];

const PALETTES = {
  sand: {
    name:'دفء رملي 🏜️', primary:'#C0603F', amber:'#DE9A3A', green:'#3F9E7A', red:'#BF4257',
    chart:['#C0603F','#BA8E06','#756600','#64B46C','#027A4D','#06A8B8','#02728A','#7199FF','#5656BE','#BE77BF'],
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
    name:'هدوء بنفسجي 🌌', primary:'#5B6CE0', amber:'#E0A54E', green:'#35A79A', red:'#C0453E',
    chart:['#5B6CE0','#C071D1','#993A8C','#E47B7C','#AF371E','#C18A03','#7A6401','#62B651','#017B40','#00AAB1'],
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
    name:'غابة هادئة 🌿', primary:'#4F8A6B', amber:'#CE9A4E', green:'#6FB047', red:'#C0453E',
    chart:['#4F8A6B','#06A8B8','#03728A','#799BEF','#5756BE','#C76EC8','#95447E','#F27167','#AD3A02','#B88F1B'],
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
    name:'بحر هادئ 🌊', primary:'#2C8FB0', amber:'#E0A24E', green:'#2FA98A', red:'#C0453E',
    chart:['#2C8FB0','#748CF7','#6053BC','#CD7FC2','#A1367B','#E66A53','#A0491A','#BE9A07','#706900','#4EAC6C'],
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
    name:'رصاصي مودرن ⬛', primary:'#3E4247', amber:'#B8946A', green:'#5F8A6E', red:'#C0453E',
    chart:['#5F6469','#A77AE7','#8643A5','#DF7A9A','#AE324A','#D87A00','#8A5B00','#90AC1C','#407701','#06AD99'],
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
    name:'ريكويم 🧟', primary:'#9E1B1B', amber:'#A8822E', green:'#5C7A32', red:'#BB426D',
    chart:['#AE2D29','#C88600','#806101','#7CB059','#007C2A','#04ABAA','#007480','#50A0FF','#3D5DC0','#B27CCD'],
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

/* ============================================================
   اشتقاق ألوان الثيم — OKLCH
   ------------------------------------------------------------
   اللون الواحد ما ينفع لكل الأدوار: نفس الأزرق اللي يصير خلفية زر
   يصير غير مقروء لمن يصير نصّاً على بطاقة بيضاء، وينطفي تماماً على
   بطاقة داكنة. فبدل ما نلوّن بالتخمين، نشتق كل دور من نفس اللون:
   نثبّت الصبغة (hue) ونحرّك الإضاءة (lightness) — لأن الإضاءة هي
   المحور اللي يستجيب له التباين، والصبغة هي اللي تحفظ هوية الثيم.
   والتشبّع ينقص بس بقدر ما يحتاج حتى يبقى اللون قابل للعرض (gamut).
   ============================================================ */
const _sl = (v)=>{ v/=255; return v<=0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
const _ls = (v)=>{ v = v<=0.0031308 ? 12.92*v : 1.055*Math.pow(v,1/2.4)-0.055;
                   return Math.max(0, Math.min(255, Math.round(v*255))); };
function _toOklab(hex){
  const c = hex.replace('#','');
  const r = _sl(parseInt(c.slice(0,2),16)), g = _sl(parseInt(c.slice(2,4),16)), b = _sl(parseInt(c.slice(4,6),16));
  const l = Math.cbrt(0.4122214708*r + 0.5363325363*g + 0.0514459929*b);
  const m = Math.cbrt(0.2119034982*r + 0.6806995451*g + 0.1073969566*b);
  const s = Math.cbrt(0.0883024619*r + 0.2817188376*g + 0.6299787005*b);
  return [0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
          1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
          0.0259040371*l + 0.7827717662*m - 0.8086757660*s];
}
function _fromOklab(L,a,b,raw){
  const l = Math.pow(L + 0.3963377774*a + 0.2158037573*b, 3);
  const m = Math.pow(L - 0.1055613458*a - 0.0638541728*b, 3);
  const s = Math.pow(L - 0.0894841775*a - 1.2914855480*b, 3);
  const rgb = [ 4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
               -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
               -0.0041960863*l - 0.7034186147*m + 1.7076147010*s];
  if(raw) return rgb;
  return '#' + rgb.map(v => _ls(v).toString(16).padStart(2,'0')).join('').toUpperCase();
}
function _oklch(hex){
  const [L,a,b] = _toOklab(hex);
  return [L, Math.hypot(a,b), Math.atan2(b,a)];
}
// يبني لوناً بإضاءة مطلوبة، وينقص التشبّع بس إذا طلع برّا المدى القابل للعرض
function _lch(L, C, h){
  while(C > 0){
    const rgb = _fromOklab(L, C*Math.cos(h), C*Math.sin(h), true);
    if(rgb.every(v => v >= -0.001 && v <= 1.001)) break;
    C -= 0.002;
  }
  return _fromOklab(L, C*Math.cos(h), C*Math.sin(h));
}
// يحصر الإضاءة بسقف أو أرضية مع تثبيت الصبغة — أساس كل الاشتقاقات تحت
function shiftL(hex, { max, min }){
  let [L, C, h] = _oklch(hex);
  if(max != null) L = Math.min(L, max);
  if(min != null) L = Math.max(L, min);
  return _lch(L, C, h);
}

/* أدوار كل لون — الأرقام مقاسة مو مقدّرة (راجع الملاحظات بأعلى styles.css):
   ٠٫٥٦ سقف التعبئة  → النص الأبيض فوقها يمرّ APCA Lc 75 بكل الباليتات
   ٠٫٥٣ سقف نص فاتح  → يمرّ Lc 60 على الأبيض وعلى الخلفية الناعمة
   ٠٫٨٤ أرضية نص داكن → يمرّ Lc 60 على البطاقة الداكنة وعلى ناعمها      */
const ROLE_FILL_MAX = 0.56, ROLE_TEXT_LIGHT_MAX = 0.53, ROLE_TEXT_DARK_MIN = 0.84;
// الأصفر والأخضر ما يحملون نصّاً أبيض بأي مكان — يستعملون كحافة أو صبغة
// بس. فسقف ٠٫٥٦ يغمّقهم بلا فايدة (الكهرماني يصير بنّي زيتوني). يكفيهم
// ٠٫٧٠: يبقون كهرماني وأخضر، والحافة تعدّي Lc 30 المطلوبة لعنصر واجهة.
const FILL_MAX = { primary: 0.56, red: 0.56, amber: 0.70, green: 0.70 };
// خلفية ناعمة: نمزج نحو أبيض/أسود بالفضاء الإدراكي حتى كل الصبغات تاخذ
// نفس *النسبة من طاقتها*، مو نفس الرقم الخام (اللي يطلع أفتح بالأصفر وأغمق بالأزرق)
function _tint(hex, amount, toward){
  const A = _toOklab(hex), B = _toOklab(toward);
  return _fromOklab(A[0]+(B[0]-A[0])*amount, A[1]+(B[1]-A[1])*amount, A[2]+(B[2]-A[2])*amount);
}
function setRole(name, base){
  const R = document.documentElement.style;
  // الأحمر ياخذ صبغة أقوى من الباقي: شارة «احذف» وشارة «ارجع» تنحط
  // جنب بعض، ولو الاثنتان بنفس درجة الشحوب ما تنفرقان بالنظرة السريعة.
  // ولأن سطحه أغمق، نصّه لازم ينزل معه حتى يبقى فوقه Lc 60
  const soft = name === 'red' ? [0.74, 0.66] : [0.88, 0.80];
  const txtMax = name === 'red' ? 0.48 : ROLE_TEXT_LIGHT_MAX;
  const txtMin = name === 'red' ? 0.90 : ROLE_TEXT_DARK_MIN;
  R.setProperty('--' + name,            shiftL(base, { max: FILL_MAX[name] || ROLE_FILL_MAX }));
  R.setProperty('--' + name + '-text-l', shiftL(base, { max: txtMax }));
  R.setProperty('--' + name + '-text-d', shiftL(base, { min: txtMin }));
  R.setProperty('--' + name + '-soft-l', _tint(base, soft[0], '#FFFFFF'));
  R.setProperty('--' + name + '-soft-d', _tint(base, soft[1], '#221A13'));
}
/* لون الخطر لازم ينفرق عن لون الموقع بالنظرة السريعة. بعض الثيمات لونها
   الأساسي أحمر أصلاً (ريكويم) أو برتقالي قريب منه (رملي)، فزر «احذف» وزر
   «احفظ» يطلعون بنفس اللون. هنا ندوّر صبغة الأحمر بعيداً لحد ما تنفصل
   ٢٥° على الأقل — يبقى أحمر، بس أحمر ما ينلخبط ويّا الأساسي. */
const RED_MIN_SEP = 32 * Math.PI / 180;
function harmonizeRed(redBase, primary){
  const [L, C, hr] = _oklch(redBase), hp = _oklch(primary)[2];
  const gap = (a,b)=>{ const d = Math.abs(a-b) % (2*Math.PI); return Math.min(d, 2*Math.PI-d); };
  if(gap(hr, hp) >= RED_MIN_SEP) return redBase;
  let h = hr;
  for(let i = 0; i < 90 && gap(h, hp) < RED_MIN_SEP; i++) h -= Math.PI/180;  // نحو القرمزي
  return _lch(L, C, h);
}
/* ============================================================
   توليد الباليتات والسماء من لون واحد
   ------------------------------------------------------------
   الباليتات الست الأولى مكتوبة بالإيد: ٦ أوقات + ٧ فصول = ١٣
   تدرّجاً لكل وحدة. هذا يشتغل ما دام عددهن قليل، بس أي باليت
   جديد صار يكلّف ١٣ سطراً مكتوبة يدوي — وأي خلفية جديدة تكلّف
   سطراً بكل باليت موجود. فالكلفة تضرب بعضها.

   الحل نفس فلسفة ألوان الواجهة فوق: ما نلوّن بالتخمين — نشتق.
   كل تدرّج ينوصف مرة وحدة بمحطات مستقلة عن أي لون (شوف الوصف
   التحت)، وبعدين ينتطبّق على صبغة أي باليت. النتيجة: باليت جديد
   = سطر واحد، وخلفية جديدة = وصف واحد يشتغل بكل الباليتات.

   الإضاءة والتشبّع منّهن اعتباطيين: التدرّج ينمشي من غامق فوق
   لفاتح تحت (نفس اتجاه الضوء الحقيقي)، والتشبّع ينزل مع الارتفاع
   بالإضاءة حتى يبقى داخل المدى القابل للعرض (_lch يضبطه).
   ============================================================ */
const D2R = Math.PI / 180;
/* ------------------------------------------------------------
   محطة تدرّج = [إضاءة، تشبّع، صبغة السماء بالدرجات، نسبة السحب للباليت]

   الصبغة **مطلقة** مو إزاحة عن لون الباليت — وهذا الفرق جوهري.
   السماء إلها صبغات حقيقية ثابتة: قمّة النهار زرقاء (٢٥٠°)، الأفق
   وقت الغروب برتقالي (٤٠°)، والشفق أخضر (١٥٠°). لو خليناها إزاحات
   نسبية، «فجر» بثيم أزرق يطلع أخضر و«شفق» يطلع أحمر — لأن نفس
   الإزاحة تنزل بمكان مختلف حسب صبغة الباليت.

   فالسماء تحتفظ بصبغتها، والباليت **يسحبها** نحوه بنسبة (mix): صفر
   = سماء صافية بلا تأثر، واحد = صبغة الباليت كاملة. النسب هنا بين
   ٠٫٢ و٠٫٤٥: تكفي حتى تحسّها من نفس عائلة الثيم، وما تكفي حتى
   تخلّي السماء تنكر شنو هي.
   ------------------------------------------------------------ */
function hueMix(absDeg, palH, mix){
  const a = absDeg * D2R;
  let d = palH - a;                       /* أقصر قوس بين الصبغتين */
  while(d >  Math.PI) d -= 2 * Math.PI;
  while(d < -Math.PI) d += 2 * Math.PI;
  return a + d * mix;
}
function skyFrom(primary, spec){
  const palH = _oklch(primary)[2];
  const n = spec.stops.length - 1;
  return 'linear-gradient(' + spec.angle + 'deg,' + spec.stops.map((st, i) =>
    _lch(st[0], st[1], hueMix(st[2], palH, st[3])) + ' ' + Math.round(i / n * 100) + '%'
  ).join(',') + ')';
}
/* أوقات اليوم الستة — بنفس ترتيب PHASE_GEOM */
const SKY_PHASES = [
  { angle:160, stops:[[0.72,0.075,285,.35],[0.82,0.070, 20,.30],[0.88,0.062, 55,.25]] },  /* فجر */
  { angle:160, stops:[[0.83,0.055,250,.45],[0.92,0.032,235,.40],[0.97,0.014,220,.40]] },  /* صباح */
  { angle:160, stops:[[0.76,0.075,250,.45],[0.88,0.045,240,.40],[0.96,0.020,225,.40]] },  /* ظهر */
  { angle:160, stops:[[0.78,0.060,248,.42],[0.88,0.042,210,.35],[0.94,0.030, 70,.30]] },  /* عصر */
  { angle:160, stops:[[0.46,0.080,290,.35],[0.66,0.090, 30,.30],[0.80,0.092, 62,.25]] },  /* غروب */
  { angle:170, stops:[[0.18,0.045,265,.45],[0.27,0.055,262,.42],[0.35,0.058,258,.40]] }   /* ليل */
];
/* الفصول/الخلفيات — الثلاثة الأخيرة جديدة وتنضاف لكل الباليتات */
const SKY_SEASONS = {
  spring: { angle:160, stops:[[0.86,0.050,245,.42],[0.93,0.030,350,.35],[0.97,0.018, 40,.30]] },
  summer: { angle:160, stops:[[0.78,0.085,245,.45],[0.89,0.052,235,.40],[0.97,0.022,220,.40]] },
  autumn: { angle:160, stops:[[0.80,0.070, 75,.35],[0.72,0.088, 55,.32],[0.63,0.090, 40,.30]] },
  winter: { angle:160, stops:[[0.85,0.028,250,.45],[0.92,0.016,240,.42],[0.98,0.008,230,.40]] },
  night:  { angle:170, stops:[[0.16,0.045,265,.45],[0.26,0.055,262,.42],[0.34,0.058,258,.40]] },
  sunset: { angle:160, stops:[[0.48,0.080,290,.35],[0.68,0.090, 30,.30],[0.81,0.092, 62,.25]] },
  sea:    { angle:160, stops:[[0.68,0.085,210,.42],[0.82,0.058,195,.38],[0.93,0.030, 85,.28]] },
  /* --- خلفيات جديدة --- */
  /* فجر: بنفسجي عالي، وردي بالوسط، وكريم دافي عند الأفق */
  dawn:   { angle:165, stops:[[0.50,0.085,292,.35],[0.76,0.080, 15,.22],[0.93,0.046, 62,.25]] },
  /* مطر: رمادي مزرق بتشبّع واطي — الجو مغيّم فالألوان تنطفي */
  rain:   { angle:172, stops:[[0.58,0.030,250,.45],[0.71,0.026,245,.42],[0.84,0.018,240,.40]] },
  /* شفق: كحلي شبه أسود يتحول لأخضر الشفق وبعدين تركوازي.
     نسبة السحب هنا واطية جداً (٠٫١) — ألوان الشفق فيزيائية، ولمن
     جرّبناها بـ٠٫٢٢ الثيمات الدافئة (رملي/وردي) سحبت الأخضر للزيتوني.
     لو سحبناها للثيم
     تنكسر ويصير المشهد ملوّن اعتباطاً بدل ما يبقى شفقاً. */
  aurora: { angle:172, stops:[[0.12,0.040,268,.30],[0.26,0.080,152,.10],[0.38,0.085,185,.10]] }
};
/* جبال بأربع طبقات — الإضاءة تنزل مع القرب حتى يبين العمق */
function mtnFrom(primary, ls, C){
  const h = _oklch(primary)[2];
  return ls.map(L => _lch(L, C, h));
}
/* ألوان الدونات: قوس ٣٠٠° بإضاءة متناوبة — أي قطعتين متجاورتين
   تفرقان بمحورين (صبغة وإضاءة) مو بمحور واحد */
function chartFrom(primary){
  const [, C, h] = _oklch(primary);
  const out = [];
  for(let i = 0; i < 10; i++){
    out.push(_lch(i % 2 === 0 ? 0.60 : 0.46, Math.max(0.11, Math.min(0.14, C)), h + (i / 9) * 300 * D2R));
  }
  return out;
}
/* باليت كامل من لون واحد + ألوان الأدوار */
function makePal(name, primary, amber, green, red){
  const seasons = {};
  Object.keys(SKY_SEASONS).forEach(k => { seasons[k] = skyFrom(primary, SKY_SEASONS[k]); });
  return {
    name, primary, amber, green, red,
    chart: chartFrom(primary),
    mtnDay:   mtnFrom(primary, [0.70, 0.60, 0.50, 0.40], 0.035),
    mtnNight: mtnFrom(primary, [0.33, 0.27, 0.21, 0.15], 0.045),
    phases: SKY_PHASES.map(sp => skyFrom(primary, sp)),
    seasons
  };
}

/* الباليتات الجديدة — صبغات ما چانت موجودة: أرجواني، نعناعي،
   وردي، وزيتوني. كل وحدة سطر واحد لأن الباقي ينشتق. */
PALETTES.berry = makePal('عنب بري 🍇',   '#933E86', '#C08A2E', '#3E9E7A', '#C0453E');
PALETTES.mint  = makePal('نعناع بارد 🧊', '#0E9280', '#C8942E', '#4EA84E', '#C0453E');
PALETTES.rose  = makePal('ورد شتوي 🌹',   '#C2456B', '#C8912E', '#3E9E7A', '#B8383C');
PALETTES.olive = makePal('زيتون ذهبي 🫒', '#7E8A1E', '#C87A2E', '#3E9E7A', '#C0453E');
PALETTE_ORDER.push('berry', 'mint', 'rose', 'olive');

/* والخلفيات الثلاث الجديدة تنضاف للباليتات المكتوبة بالإيد هم —
   ما ننسخهن يدوي، نشتقهن من لون كل باليت بنفس الوصف */
['dawn', 'rain', 'aurora'].forEach(k => {
  Object.keys(PALETTES).forEach(id => {
    const p = PALETTES[id];
    if(!p.seasons[k]) p.seasons[k] = skyFrom(p.primary, SKY_SEASONS[k]);
  });
});
/* هندسة الخلفيات الجديدة + أسماؤها */
SEASON_META.dawn   = { body:'sun',  x:16, y:70, particles:null };
SEASON_META.rain   = { body:'sun',  x:62, y:26, particles:'rain' };
SEASON_META.aurora = { body:'moon', x:76, y:16, particles:null, aurora:true };
SEASON_NAMES.dawn   = 'فجر 🌅';
SEASON_NAMES.rain   = 'مطر 🌧️';
SEASON_NAMES.aurora = 'شفق قطبي 🌠';
/* الخلفيات المعتمة تاخذ جبال الليل */
const DARK_SEASONS = new Set(['night', 'aurora', 'dawn']);

function applyTheme(primary){
  setRole('primary', primary);
  setRole('red', harmonizeRed((activePal && activePal.red) || '#C0453E', primary));
}
function loadTheme(){
  let p = '';
  try{ p = LS.get('mas_theme') || ''; }catch(_){}
  if(p) applyTheme(p);
}
function saveTheme(primary){
  try{ LS.set('mas_theme', primary); }catch(_){}
  applyTheme(primary);
}

/* ---------- الباليت (لون الموقع + السماء المنسّقة) ---------- */
function applyPalette(id, save){
  const p = PALETTES[id] || PALETTES[DEFAULT_PAL];
  activePal = p;
  setRole('primary', p.primary);
  setRole('amber',   p.amber);
  setRole('green',   p.green);
  setRole('red',     harmonizeRed(p.red || '#C0453E', p.primary));
  PALETTE = p.chart;
  if(save !== false){ try{ LS.set('mas_palette', id); }catch(_){} }
  /* بناء السماء (٤٠ نجمة + ٢٦ شجرة + ذرات، كلهن بأنميشن لانهائي) ثقيل.
     أول نداء يجي من loadPalette() بلحظة الافتتاح — بالضبط لمن اللوجو
     يتحرك — فچان يقطّع الحركة. هسه يتأجّل لما تخلص. وبعد الافتتاح
     afterSplash تنفّذه بوقت فراغ الخيط، فضغطة تغيير الثيم تبقى فورية. */
  try{ (window.afterSplash || (f => f()))(() => { try{ updateSky(); }catch(_){} }); }catch(_){}
  try{ applyDark(); }catch(_){}          // يزامن لون شريط المتصفح (theme-color)
  try{ if(session) render(); }catch(_){} // يعيد تلوين الدونات/المفتاح بألوان الباليت
}
function curPaletteId(){
  let id = ''; try{ id = LS.get('mas_palette') || ''; }catch(_){}
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
  try{ LS.set('mas_cur', CURRENCY); }catch(_){}
  updateCurrencyLabels();
  refreshMoney();
}

/* ---------- نوع الخط ----------
   الخطوط كلها مستضافة عدنا بمجلد fonts/ — ماكو أي طلب لجوجل.
   قبل چانت تنجاب من fonts.googleapis.com، وبعد ما انسكّر الـCSP
   (style-src 'self') صارت تنحجب بصمت: التطبيق يضبط font-family
   على خط ما وصل، فالجهاز يرجع لخط النظام — وهذا سبب «الخط انتغيّر
   وصار ثخين». هسه كل خط إله ملف CSS محلي ينتحمّل عند اختياره بس
   (كسول)، والـservice worker يخزّنه فيصير يشتغل حتى بلا نت.
   «روبيك» محمّل أصلاً بالرأس. الاختيار ينحفظ بالجهاز. */
const FONTS = {
  rubik:   { name:'روبيك (الافتراضي)',   stack:"'Rubik','Alexandria'",     url:'' },
  cairo:   { name:'القاهرة',             stack:"'Cairo'",                  url:'fonts/cairo.css' },
  tajawal: { name:'تجوّل',               stack:"'Tajawal'",                url:'fonts/tajawal.css' },
  almarai: { name:'المراعي',             stack:"'Almarai'",                url:'fonts/almarai.css' },
  ibm:     { name:'IBM بلكس عربي',       stack:"'IBM Plex Sans Arabic'",   url:'fonts/ibm.css' },
  amiri:   { name:'أميري (نسخ كلاسيكي)', stack:"'Amiri'",                  url:'fonts/amiri.css' },
  reem:    { name:'ريم كوفي',            stack:"'Reem Kufi'",              url:'fonts/reem.css' }
};
const FONT_FALLBACK = ",-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif";
const _fontLinks = {};
/* يرجّع وعد ينحل لما ينتحمّل ملف الخط — نستنّاه قبل ما نبدّل
   font-family حتى ما تلمع الصفحة بخط النظام بالوسط */
function loadFont(id){
  const f = FONTS[id];
  if(!f || !f.url) return Promise.resolve();
  if(_fontLinks[id]) return _fontLinks[id];
  _fontLinks[id] = new Promise((ok, no) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = f.url;
    l.onload = ok;
    l.onerror = () => { delete _fontLinks[id]; l.remove(); no(new Error(f.url)); };
    document.head.appendChild(l);
  });
  return _fontLinks[id];
}
function applyFont(id, save){
  const f = FONTS[id] || FONTS.rubik;
  if(save !== false){ try{ LS.set('mas_font', id); }catch(_){} }
  const use = st => { document.body.style.fontFamily = st + FONT_FALLBACK; };
  if(!f.url){ use(f.stack); return; }
  /* لو ما وصل الملف نبقى على روبيك — أحسن من الطيحة على خط النظام
     اللي يطلع ثخين ومختلف بلا ما يفهم المستخدم شصار */
  loadFont(id).then(() => use(f.stack)).catch(() => {
    use(FONTS.rubik.stack);
    if(typeof toast === 'function') toast('ما كدرت أحمّل خط «' + f.name + '» — رجعناك لروبيك', true);
  });
}
function curFontId(){
  let id = ''; try{ id = LS.get('mas_font') || ''; }catch(_){}
  return FONTS[id] ? id : 'rubik';
}
function loadFontPref(){ applyFont(curFontId(), false); }
function setFont(id){ applyFont(FONTS[id] ? id : 'rubik'); }

/* ---------- حجم الخط (تكبير/تصغير كل النصوص) ----------
   نغيّر حجم خط الجذر (html) — أغلب أحجام النصوص بالتطبيق بوحدة rem
   فتتكبّر/تتصغّر كلها بتناسب. القيمة نسبة مئوية (100 = الأساس). */
let fontScale = 110;
try{ const _fs = parseInt(LS.get('mas_fontscale'), 10); if(!isNaN(_fs)) fontScale = _fs; }catch(_){}
function applyFontScale(pct){
  const v = Math.max(80, Math.min(140, Number(pct) || 100));
  document.documentElement.style.fontSize = v + '%';
}
function setFontScale(pct){
  fontScale = Math.max(80, Math.min(140, parseInt(pct, 10) || 100));
  try{ LS.set('mas_fontscale', String(fontScale)); }catch(_){}
  applyFontScale(fontScale);
}

/* ---------- تغويش خلفية السماء (0-100) ---------- */
let skyBlur = 0;
try{ skyBlur = parseInt(LS.get('mas_skyblur') || '0', 10) || 0; }catch(_){}
function applySkyBlur(v){
  const pct = Math.max(0, Math.min(100, Number(v) || 0));
  const px = (pct / 100 * 18).toFixed(1);   // أقصى تغويش ~18px
  document.documentElement.style.setProperty('--sky-blur', px + 'px');
}
function setSkyBlur(v){
  skyBlur = Math.max(0, Math.min(100, parseInt(v, 10) || 0));
  try{ LS.set('mas_skyblur', String(skyBlur)); }catch(_){}
  applySkyBlur(skyBlur);
}

/* ---------- المودال ---------- */
function modalOpen(html){ $('modalCard').innerHTML = '<div class="grabber"></div>' + html; sheetShow($('modal')); }
window.modalClose = () => sheetHide($('modal'));
$('modal').addEventListener('click', e => { if(e.target === $('modal')) modalClose(); });

/* ---------- تأكيد الحذف الموحّد — بدل confirm() المتصفح ----------
   نافذة تحذير واضحة: زر «لا، رجعني» هو الافتراضي، والحذف يحتاج ضغطة مقصودة.
   ترجع Promise<boolean> حتى تنستعمل: if(!(await confirmDel(...))) return; */
function confirmDel(title, sub, okLabel){
  return new Promise(res => {
    const m = $('cfModal'), c = $('cfCard');
    if(!m || !c){ res(confirm(title + (sub ? '\n' + sub : ''))); return; }
    c.innerHTML = `
      <div class="grabber"></div>
      <div class="cf-ico">🗑</div>
      <div class="cf-title">${esc(title)}</div>
      ${sub ? `<div class="cf-sub">${esc(sub)}</div>` : ''}
      <div class="cf-actions">
        <button class="btn" id="cfNo" type="button">لا، رجعني</button>
        <button class="btn cf-danger" id="cfYes" type="button">${esc(okLabel || 'احذف')}</button>
      </div>`;
    sheetShow(m);
    /* السحب لتحت = إلغاء، نفس ضغطة «لا، رجعني» — نفس المخرج بنفس الطريق */
    const onDrag = () => done(false);
    m.addEventListener('sheet-dismiss', onDrag);
    const done = v => {
      m.removeEventListener('sheet-dismiss', onDrag);
      m.onclick = null;
      sheetHide(m);
      res(v);                 /* الجواب فوراً — الحركة تكمل بالخلفية */
    };
    $('cfNo').onclick  = () => done(false);
    $('cfYes').onclick = () => done(true);
    m.onclick = e => { if(e.target === m) done(false); };
    setTimeout(() => { try{ $('cfNo').focus(); }catch(_){} }, 80);
  });
}

/* ---------- الجلسة (Supabase Auth يديرها ويجدّدها تلقائياً) ---------- */
async function fetchProfile(userId){
  const { data, error } = await sb.from('profiles').select('display_name, household_id, is_admin').eq('id', userId).single();
  if(error || !data) return null;
  return { name: data.display_name, hh: data.household_id, admin: !!data.is_admin };
}

/* أول ما تنعرض شاشة حقيقية (دخول أو تطبيق) نشير لشاشة الافتتاح تنشال —
   ما ننتظر تحميل بيانات الشهر، لأن loadMonth يعرض هيكل تحميل (skeleton)
   أصلاً. splashReady آمنة للنداء أكثر من مرة وقبل ما تنعرّف. */
function splashDone(){ try{ window.splashReady && window.splashReady(); }catch(_){} }

function showLogin(){
  $('loginScreen').classList.add('show');
  $('appHeader').style.display='none';
  $('appMain').style.display='none';
  $('appNav').style.display='none';
  splashDone();
}
function showApp(){
  $('loginScreen').classList.remove('show');
  $('appHeader').style.display='';
  $('appMain').style.display='';
  $('appNav').style.display='';
  $('userName').textContent = 'مرحباً ' + (session && session.name ? session.name : '');
  splashDone();
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
/* ============================================================
   توقيع البيانات — يمنع إعادة الرسم على صدى كتابتنا إحنا
   ------------------------------------------------------------
   أي تعديل محلي يسوّي: loadMonth() (جلب كامل + render كامل)، وبعدها
   بـ450ms الـrealtime يسمع نفس التغيير — تغييرنا إحنا — فيسوّي جلب
   ثاني ورسم ثاني. يعني كل مصروف تضيفه = رسمتين كاملتين لكل التبويبات.
   الحل: نقارن توقيع البيانات الجاية بالتوقيع الحالي؛ لو نفسه (وهو
   نفسه بالضبط بحالة الصدى) نوقف قبل render.
   آمن ١٠٠٪: ما نرمي أي تغيير حقيقي — أي اختلاف فعلي يغيّر التوقيع.
   ============================================================ */
let lastDataSig = '';
function dataSigOf(res){
  try{ return JSON.stringify([res.budget, res.expenses, res.debts]); }
  catch(_){ return String(Math.random()); }   // ما نكدر نوقّع → اعتبرها مختلفة
}

let rtDirty = false;
function onRemoteChange(){
  rtDirty = true;
  clearTimeout(rtTimer);
  rtTimer = setTimeout(pumpRemote, 450);
}
async function pumpRemote(){
  if(!session || !rtDirty) return;
  /* أكو جلب شغّال — نأجّل، ما نرمي الحدث.
     (قبل چان `if(inFlight) return` — يعني أي تغيير من الطرف الثاني
      يوصل أثناء تحميل الشهر چان يضيع بلا رجعة) */
  if(inFlight){ rtTimer = setTimeout(pumpRemote, 300); return; }
  rtDirty = false;
  try{
    const res = await apiGet(state.month);
    if(!res.ok) return;
    const sig = dataSigOf(res);
    if(sig === lastDataSig) return;   // صدى كتابتنا — ماكو جديد، ماكو رسم
    lastDataSig = sig;
    bumpData();
    state.budget = res.budget;
    state.expenses = res.expenses;
    state.debts = res.debts || [];
    render();
    loadQuick();
    const bt = $('tab-bills');
    if(bt && bt.classList.contains('active')) loadBills();
    const rt = $('tab-recon');
    if(rt && rt.classList.contains('active')) loadRecons();
  }catch(_){}
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
      call = sb.rpc('return_debt', { p_id:p.id, p_date:p.date||'', p_month:p.month||'', p_mode:p.mode||'repay' });
      break;
    case 'addDeposit':
      call = sb.rpc('add_deposit', { p_fund:p.fund, p_amount:p.amount, p_date:p.date||'', p_descr:p.desc||'', p_from_category:p.fromCategory||'', p_month:p.month||'' });
      break;
    case 'setPeriod':
      call = sb.rpc('set_period', { p_month:p.month, p_title:p.title||'', p_start:p.start||'', p_end:p.end||'' });
      break;
    case 'withdrawFund':
      call = sb.rpc('withdraw_fund', { p_month:p.month, p_date:p.date, p_amount:p.amount, p_descr:p.desc||'', p_fund:p.fund, p_debt_account:p.debtAccount||'', p_to_category:p.toCategory||'' });
      break;
    case 'addLoan':
      call = sb.rpc('add_loan', { p_month:p.month, p_date:p.date, p_amount:p.amount, p_fund:p.fund, p_account:p.account, p_due_date:p.dueDate||'', p_descr:p.desc||'', p_to_category:p.toCategory||'' });
      break;
    case 'editWithdraw':
      call = sb.rpc('edit_withdrawal', { p_id:p.id, p_amount:p.amount, p_date:p.date, p_descr:p.desc||'', p_fund:p.fund||'' });
      break;
    case 'transferFund':
      call = sb.rpc('transfer_fund', { p_month:p.month, p_from:p.from, p_to:p.to, p_amount:p.amount, p_date:p.date||'', p_descr:p.desc||'' });
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
  /* تبويب التدقيق يعتمد على صلاحية المشرف — وما تنعرف إلا بعد الدخول */
  try{ applyAuditVisible(); }catch(_){}
  $('expDate').value = todayISO();
  startRealtime();
  resetIdle();
  loadQuick();
  await loadMonth(thisMonth());
  /* لو شهر اليوم مقفل (مثلاً استلمت راتب الشهر الجاي وقفلته من وقتها)
     ننتقل تلقائياً لأول شهر مفتوح بعده */
  let guard = 0;
  while(state.locked && guard++ < 12){
    await loadMonth(nextMonthStr(state.month));
  }
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
  state._envOpen = null;   // ظرف مفتوح من شهر ثاني ما إله معنى هنا
  $('monthPick').value = month;
  if(!apiReady()){ render(); return; }
  inFlight = true;
  showSkeleton();
  loading(true);
  try{
    const res = await apiGet(month);
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ بالخادم');
    lastDataSig = dataSigOf(res);   // حتى صدى الـrealtime يعرف إن عدنا نفس البيانات
    bumpData();                     // بيانات جديدة → التبويبات المخفية صارت قديمة
    state.budget = res.budget;
    state.expenses = res.expenses;
    state.debts = res.debts || [];
    /* تاريخ فورم الإضافة: اليوم إذا داخل الفترة، وإلا أقرب طرف منها */
    const ed = $('expDate');
    if(ed) ed.value = periodDefaultDate(state.budget, month);
    /* دخول متدرّج للبطاقات — بس عند تحميل شهر (مو بكل إعادة رسم صغيرة) */
    const am = $('appMain');
    if(am){ am.classList.add('fresh'); clearTimeout(am._ft); am._ft = setTimeout(() => am.classList.remove('fresh'), 1400); }
    render();
    // الفواتير والمطابقة تعتمد على «الباقي للصرف» فنحدّثها بعد الرسم
    const bt = $('tab-bills');
    if(bt && bt.classList.contains('active')) loadBills();
    const rt = $('tab-recon');
    if(rt && rt.classList.contains('active')) loadRecons();
    const lt = $('tab-ledger');
    if(lt && lt.classList.contains('active')){ try{ renderLedger(); }catch(_){} }
    const at = $('tab-audit');
    if(at && at.classList.contains('active')){ try{ renderAudit(); }catch(_){} }
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

/* ============================================================
   النظرة العامة باللوحة — تبويبات: مصاريف / ادخار / فواتير / قروض
   كل تبويب يعرض تفاصيله برسم مختلف داخل نفس البطاقة
   ============================================================ */
let dashView = 'ov';   // 'ov' = نظرة عامة (بلا اختيار) — مقارنة بسيطة
try{ dashView = ['ov','exp','save','bills','loans'].includes(LS.get('mas_dashview')) ? LS.get('mas_dashview') : 'ov'; }catch(_){}
let _billsSeen = '';   // حتى ما نعيد جلب الفواتير بكل رسمة

window.setDashView = (v) => {
  /* ضغطة ثانية على نفس التبويب = إلغاء الاختيار → نظرة عامة */
  dashView = (v === dashView) ? 'ov' : v;
  try{ LS.set('mas_dashview', dashView); }catch(_){}
  renderDashView();
};
document.querySelectorAll('#ovSeg .seg-btn').forEach(b => { b.onclick = () => setDashView(b.dataset.ov); });

function renderDashView(){
  const el = $('summaryCard');
  if(!el) return;
  document.querySelectorAll('#ovSeg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.ov === dashView));

  /* التبويب يفلتر كل اللوحة: ظروف التصنيفات تظهر بس بتبويب المصاريف،
     والادخار والقروض تفاصيلهم كلها داخل البطاقة نفسها (بلا تكرار) */
  const envEl = $('envList');  if(envEl) envEl.style.display  = dashView === 'exp' ? '' : 'none';

  /* الفواتير محتاجينها بالنظرة العامة وتبويب الفواتير */
  if((dashView === 'ov' || dashView === 'bills') && session && _billsSeen !== state.month){
    _billsSeen = state.month;
    loadBills().then(renderDashView).catch(()=>{});
  }

  const d = state._dash || { donutParts:[], dailyAvg:0, canDaily:0, prog:{left:0}, realSpending:0, totalAvail:0 };

  /* ===== 👁️ النظرة العامة: مقارنة بسيطة (مصاريف / أهداف / فواتير) ===== */
  if(dashView === 'ov'){
    el.onclick = null;
    const spentPct = d.totalAvail > 0 ? Math.min(100, Math.round(d.realSpending / d.totalAvail * 100)) : 0;
    const gFunds = (state._dashFunds || []).filter(f => f.goal > 0);
    const goalSum = gFunds.reduce((s,f)=> s + f.goal, 0);
    const goalBal = gFunds.reduce((s,f)=> s + Math.min(Math.max(0, f.bal), f.goal), 0);
    const goalPct = goalSum > 0 ? Math.round(goalBal / goalSum * 100) : 0;
    const bTotal = billsItems.reduce((a,b)=> a + (Number(b.amount)||0), 0);
    const bPaid  = billsItems.filter(b=>b.paid).reduce((a,b)=> a + (Number(b.amount)||0), 0);
    const bPct = bTotal > 0 ? Math.round(bPaid / bTotal * 100) : 0;
    el.innerHTML = `
      <div class="card sum-card depth">
        <div class="ov-top">👁️ نظرة سريعة على شهرك — اضغط تبويب (أو سطر) للتفاصيل، وضغطة ثانية ترجعك هنا</div>
        <div class="ov-row" onclick="setDashView('exp')" style="cursor:pointer" tabindex="0" role="button" aria-label="عرض تفاصيل المصاريف">
          <div class="ov-line"><span>🧾 المصاريف</span><b>${fmt(d.realSpending)}</b></div>
          <div class="bar" style="height:12px"><i style="width:${spentPct}%;background:${PALETTE[0]}"></i></div>
          <div class="ov-sub"><span>صرفت ${spentPct}٪ من المتاح</span><span>المتاح ${fmt(d.totalAvail)}</span></div>
        </div>
        <div class="ov-row" onclick="setDashView('save')" style="cursor:pointer" tabindex="0" role="button" aria-label="عرض تفاصيل أهداف الادخار">
          <div class="ov-line"><span>🎯 أهداف الادخار</span><b>${goalSum > 0 ? goalPct + '٪' : '—'}</b></div>
          <div class="bar" style="height:12px"><i style="width:${goalPct}%;background:${PALETTE[2]}"></i></div>
          <div class="ov-sub"><span>${goalSum > 0 ? 'وصلت ' + fmt(goalBal) : 'ماكو أهداف محددة بعد'}</span><span>${goalSum > 0 ? 'الهدف ' + fmt(goalSum) : 'حددها من الميزانية 🎯'}</span></div>
        </div>
        <div class="ov-row" onclick="setDashView('bills')" style="cursor:pointer" tabindex="0" role="button" aria-label="عرض تفاصيل الفواتير">
          <div class="ov-line"><span>📄 الفواتير</span><b>${bTotal > 0 ? fmt(bTotal - bPaid) + ' باقي' : '—'}</b></div>
          <div class="bar" style="height:12px"><i style="width:${bPct}%;background:${PALETTE[1]}"></i></div>
          <div class="ov-sub"><span>${bTotal > 0 ? 'دفعت ' + bPct + '٪' : 'ماكو فواتير هالشهر'}</span><span>${bTotal > 0 ? 'الإجمالي ' + fmt(bTotal) : ''}</span></div>
        </div>
      </div>`;
    return;
  }

  /* ===== 🧾 المصاريف: الدونات + أعلى تصنيف ===== */
  if(dashView === 'exp'){
    const activeCat = ($('fltCat') && $('fltCat').value) || '';
    const parts = d.donutParts;
    const legend = parts.map((p,i)=>`<span class="lg-item${activeCat===p.label?' on':''}" data-cat="${esc(p.label)}"><span class="lg-dot" style="background:${PALETTE[i%PALETTE.length]}"></span><b>${esc(p.label)}</b>${fmt(p.value)}</span>`).join('');
    const top = parts.reduce((a,b)=> (b.value > (a?a.value:0) ? b : a), null);
    const total = parts.reduce((s,p)=> s + p.value, 0);
    el.innerHTML = `
      <div class="card sum-card depth">
        <div class="sum-top">
          <div class="donut${activeCat?' has-filter':''}" ${activeCat?`data-active="${esc(activeCat)}"`:''}>${donutSVG(parts)}</div>
          <div class="sum-stats">
            <div class="ss"><span>المعدل اليومي</span><b>${fmt(d.dailyAvg)}</b></div>
            <div class="ss"><span>باقي بالشهر</span><b>${d.prog.left} يوم</b></div>
            <div class="ss"><span>تقدر تصرف باليوم</span><b>${fmt(d.canDaily)}</b></div>
          </div>
        </div>
        ${top ? `<div class="ov-top">🏆 أعلى مصرف: <b>«${esc(top.label)}»</b> — ${fmt(top.value)} (${Math.round(top.value/total*100)}٪ من صرفك)</div>` : ''}
        ${legend ? `<div class="legend">${legend}</div>` : ''}
        ${activeCat ? `<button class="lg-clear" onclick="filterByCat('')">✕ إلغاء الفلتر «${esc(activeCat)}»</button>` : ''}
      </div>`;
    el.onclick = (ev) => {
      const t = ev.target.closest('[data-cat]');
      if(t) filterByCat(t.dataset.cat);
    };
    const dn = el.querySelector('.donut.has-filter');
    if(dn) dn.querySelectorAll('.dseg').forEach(sg => { if(sg.dataset.cat !== dn.dataset.active) sg.style.opacity = '.25'; });
    animateDonut();
    return;
  }
  el.onclick = null;

  /* ===== 🏦 الادخار: كل الصناديق + منو قريب على هدفه (بلا تكرار بمكان ثاني) ===== */
  if(dashView === 'save'){
    const funds = (state._dashFunds || []).slice();
    if(!funds.length){ el.innerHTML = `<div class="card sum-card"><div class="empty" style="padding:18px"><span class="emo">🏦</span><b>ماكو صناديق ادخار بعد</b>أضف صندوق من تبويب «الميزانية».</div></div>`; return; }
    const withGoal = funds.filter(f => f.goal > 0).sort((a,b)=> (b.bal/b.goal) - (a.bal/a.goal));
    const noGoal = funds.filter(f => !(f.goal > 0));
    const best = withGoal[0];
    el.innerHTML = `
      <div class="card sum-card depth">
        <div class="ov-top" style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
          <span>${best ? `🎯 الأقرب لهدفه: <b>«${esc(best.name)}»</b> — ${Math.min(100, Math.round(best.bal/best.goal*100))}٪${best.bal>=best.goal?' ✓ تحقق!':''}` : '💡 حدد هدف 🎯 لصناديقك من الميزانية حتى نتابع تقدمك هنا'}</span>
          <b>الإجمالي: ${fmt(state._fundTotal || 0)}</b>
        </div>
        ${withGoal.map((f,i) => {
          const pct = Math.max(0, Math.min(100, Math.round(f.bal / f.goal * 100)));
          return `
          <div class="ov-row" onclick="gotoFunds()" style="cursor:pointer" tabindex="0" role="button" aria-label="روح لقسم الصناديق" title="السحب والإيداع والقرض من مصروف ← الصناديق">
            <div class="ov-line"><span>${f.closed?'🔒':'🏦'} ${esc(f.name)}</span><span><b>${fmt(f.bal)}</b> <small style="color:var(--muted)">من ${fmt(f.goal)}</small></span></div>
            <div class="bar"><i class="${f.bal>=f.goal?'':'goalbar'}" style="width:${pct}%;background:${PALETTE[i%PALETTE.length]}"></i></div>
            <div class="ov-sub"><span>${pct}٪</span><span>${f.bal>=f.goal?'🎉 تحقق الهدف!':'باقي ' + fmt(f.goal - f.bal)}</span></div>
          </div>`;
        }).join('')}
        ${noGoal.length ? noGoal.map(f => `<div class="ov-line" onclick="gotoFunds()" style="padding:8px 2px;border-top:1px solid var(--line);cursor:pointer" tabindex="0" role="button" aria-label="روح لصندوق ${esc(f.name)}"><span>${f.closed?'🔒':'🏦'} ${esc(f.name)} <small style="color:var(--muted)">(بلا هدف)</small></span><b>${fmt(f.bal)}</b></div>`).join('') : ''}
        <div class="hint" style="margin:8px 2px 0">اضغط أي صندوق للسحب/الإيداع/القرض (مصروف ← الصناديق).</div>
      </div>`;
    return;
  }

  /* ===== 📄 الفواتير: شنو انفدع وشنو باقي ===== */
  if(dashView === 'bills'){
    if(!billsItems.length){
      el.innerHTML = `<div class="card sum-card"><div class="empty" style="padding:18px"><span class="emo">📄</span><b>ماكو فواتير مسجلة هالشهر</b>أضفها من تبويب «فواتيري» — وتنتسخ تلقائياً كل شهر.</div></div>`;
      return;
    }
    const total  = billsItems.reduce((a,b)=> a + (Number(b.amount)||0), 0);
    const paid   = billsItems.filter(b=>b.paid).reduce((a,b)=> a + (Number(b.amount)||0), 0);
    const unpaid = total - paid;
    const avail  = state._surplus || 0;
    const pctPaid = total > 0 ? Math.round(paid / total * 100) : 0;
    el.innerHTML = `
      <div class="card sum-card depth">
        <div class="ov-top">${unpaid <= 0 ? '🎉 كل فواتير الشهر مدفوعة — عاشت إيدك!' : (avail >= unpaid ? `✅ الباقي عندك (${fmt(avail)}) يغطي الفواتير الباقية (${fmt(unpaid)})` : `⚠️ ناقصك ${fmt(unpaid - avail)} للفواتير الباقية`)}</div>
        <div class="ov-line"><span>المدفوع ${fmt(paid)}</span><span>الباقي ${fmt(unpaid)}</span></div>
        <div class="bar" style="height:12px"><i style="width:${pctPaid}%;background:var(--green)"></i></div>
        <div class="ov-sub"><span>${pctPaid}٪ مدفوع</span><span>الإجمالي ${fmt(total)}</span></div>
        ${billsItems.map(b => `
          <div class="ov-line" style="padding:8px 2px;border-top:1px solid var(--line)">
            <span>${b.paid?'✅':'⏳'} ${esc(b.name)}${b.dueDay?` <small style="color:var(--muted)">· يوم ${b.dueDay} من كل شهر</small>`:''}</span>
            <b style="${b.paid?'':'color:var(--amber)'}">${fmt(b.amount)}</b>
          </div>`).join('')}
        <div class="hint" style="margin:8px 2px 0">الدفع والتعديل من تبويب «فواتيري».</div>
      </div>`;
    return;
  }

  /* ===== 🤝 القروض: منو مديون وشوكت يرجّع ===== */
  if(dashView === 'loans'){
    const loans = state._dashDebts || [];
    if(!loans.length){
      el.innerHTML = `<div class="card sum-card"><div class="empty" style="padding:18px"><span class="emo">🤝</span><b>ماكو قروض مفتوحة</b>كل الفلوس براحتها بالصناديق 😌</div></div>`;
      return;
    }
    const total = loans.reduce((s,d)=> s + (d.amount||0), 0);
    const mx = Math.max(...loans.map(d=>d.amount||0), 1);
    el.innerHTML = `
      <div class="card sum-card depth">
        <div class="ov-top">🤝 ${loans.length} ${loans.length === 1 ? 'قرض مفتوح' : 'قروض مفتوحة'} — الإجمالي <b>${fmt(total)}</b></div>
        ${loans.map((dd,i) => {
          let due = '', cls = '';
          if(dd.dueDate){
            const days = Math.floor((new Date(dd.dueDate) - new Date(todayISO())) / 86400000);
            if(days < 0){ due = '⏰ فات موعده!'; cls = 'color:var(--red);font-weight:700'; }
            else if(days === 0){ due = '⏰ يستحق اليوم'; cls = 'color:var(--red);font-weight:700'; }
            else due = '⏰ باقي ' + days + ' يوم';
          }
          return `
          <div class="ov-row" onclick="gotoFunds()" style="cursor:pointer" tabindex="0" role="button" aria-label="روح لقسم الصناديق" title="الإرجاع والشطب من مصروف ← الصناديق">
            <div class="ov-line"><span>${dd.toCategory?'🗂️':'👤'} <b>${esc(dd.account)}</b> <small style="color:var(--muted)">← «${esc(dd.fund)}»</small></span><b>${fmt(dd.amount)}</b></div>
            <div class="bar"><i style="width:${Math.max(6, Math.round(dd.amount/mx*100))}%;background:${PALETTE[i%PALETTE.length]}"></i></div>
            ${due ? `<div class="ov-sub"><span style="${cls}">${due}</span><span>${esc(dd.date)}</span></div>` : `<div class="ov-sub"><span></span><span>${esc(dd.date)}</span></div>`}
          </div>`;
        }).join('')}
        <div class="hint" style="margin:8px 2px 0">اضغط أي قرض للإرجاع أو الشطب (مصروف ← الصناديق).</div>
      </div>`;
    return;
  }
}

/* ---------- بطاقة الذكاء (تدوير الملاحظات) ---------- */
let insTimer = null, insIdx = 0;
function renderInsightCard(){
  const el = $('insightCard');
  if(!el) return;
  const list = state._insights || [];
  clearInterval(insTimer);
  if(!list.length){ el.innerHTML = ''; return; }
  el.innerHTML = `<div class="card insight"><span class="in-ico">🔍</span><span class="in-txt" id="insightTxt">${esc(list[0])}</span></div>`;
  insIdx = 0;
  if(list.length > 1){
    insTimer = setInterval(() => {
      const t = $('insightTxt');
      if(!t){ clearInterval(insTimer); return; }
      insIdx = (insIdx + 1) % list.length;
      t.style.opacity = 0;
      setTimeout(() => { t.textContent = (state._insights||list)[insIdx] || ''; t.style.opacity = 1; }, 350);
    }, 6000);
  }
}

/* ---------- العرض ---------- */
/* ============================================================
   حالة فتح/طي مجموعات ديون الصناديق
   ------------------------------------------------------------
   ثلاث حالات مو اثنتين: «فتحها المستخدم»، «طواها المستخدم»، و«ما
   لمسها» — والأخيرة تاخذ الافتراضي الذكي (مجموعة وحدة أو بيها قرض
   متأخر = مفتوحة). بدون التمييز هذا، أي إعادة رسم (وهي تصير بكل
   تحديث لحظي من العائلة) چانت تلغي فتح المستخدم أو تعيد فتح اللي طواه.
   ============================================================ */
const debtOpened = new Set(), debtShut = new Set();
function debtGroupOpen(fund, auto){
  if(debtOpened.has(fund)) return true;
  if(debtShut.has(fund))   return false;
  return !!auto;
}
/* الطي/الفتح ما يعيد الرسم — يبدّل كلاس بس، حتى الحركة تبقى ناعمة
   وما تنقطع بإعادة بناء الـDOM (والارتفاع ينحرك بـgrid-template-rows) */
window.toggleDebtGroup = (gi) => {
  const g = (state._debtGroups || [])[gi];
  if(!g) return;
  const el = document.querySelector('#debtList .dgrp[data-fund="' + gi + '"]');
  if(!el) return;
  const nowOpen = !el.classList.contains('open');
  el.classList.toggle('open', nowOpen);
  const btn = el.querySelector('.dgrp-head');
  if(btn) btn.setAttribute('aria-expanded', nowOpen ? 'true' : 'false');
  if(nowOpen){ debtOpened.add(g.fund); debtShut.delete(g.fund); }
  else       { debtShut.add(g.fund);   debtOpened.delete(g.fund); }
};

/* ============================================================
   رسم كسول للتبويبات — التبويب المخفي ما ينبني DOM إله
   ------------------------------------------------------------
   .tab{display:none} يعني ثمن تبويبات ساكنة بالـDOM ووحدة بس تنشاف،
   و render() چان يكتب innerHTML للثمانية كلهن بكل نداء — بضمنهن
   تبويبات محد فاتحها. وينندى بكل حرف تكتبه بفلتر البحث.
   هسه: الحساب يظل كامل (رخيص، وأرقام الهيدر والملخص تعتمد عليه،
   ونفس اللفّات تجمع state._dashFunds/_dashDebts للوحة)، بس الكتابة
   على الـDOM — وهي الغالية: تحليل HTML + حساب أنماط + تخطيط —
   تتأجّل للتبويب النشط، وتنعمل بـgotoTab أول ما المستخدم يفتحه.

   وحتى تبديل التبويبات ما يصير هو نفسه ثقيل، نستعمل «نسخة البيانات»:
   كل ما تتبدّل بيانات الشهر يزيد الرقم، وكل تبويب ينخزن عند أي نسخة
   انبنى. فلو بدّلت تبويب وماكو جديد، ما ينعاد بناؤه أبداً — التبديل
   يبقى مجاني مثل ما چان.
   ============================================================ */
let dataVersion = 0;
const tabBuiltAt = Object.create(null);
function bumpData(){ dataVersion++; }
function tabShown(id){
  const el = document.getElementById(id);
  if(!(el && el.classList.contains('active'))) return false;
  tabBuiltAt[id] = dataVersion;
  return true;
}
function tabIsStale(id){ return tabBuiltAt[id] !== dataVersion; }
/* التبويبات اللي render() مسؤول عن بنائها — الباقي إله دواله الخاصة */
const LAZY_TABS = new Set(['tab-dash', 'tab-add', 'tab-budget']);

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

  /* خيارات الفلتر تنبني بكل رسمة — مو بس لما يكون تبويب «المصروف» مفتوح.
     قبل چانت تنبني جوّا tabShown('tab-add') بس، فالضغط على الدونات أو الليجند
     من اللوحة يلقى القائمة فارغة ويطلّع «ماكو مصاريف بهذا التصنيف». */
  buildFilterOptions();

  /* المصروف حسب التصنيف (الإرجاعات السالبة تنطرح تلقائياً)
     + نفرز حركات القروض/التمويل الداخلة من الصناديق (سالبة) وسدادها (موجب)
     حتى نعرض «صرفت» = الصرف الفعلي، والقرض بسطر واضح لحاله */
  /* ------------------------------------------------------------
     التصنيف حسب e.kind — مو حسب نص الوصف (شوف kindOf بـcore.js)
     spentByCat  = اللي ينخصم من متاح التصنيف
     fundInByCat = تمويل داخل من الصناديق بالنظام القديم (v1) — يزيد المتاح
     repayByCat  = سداد التمويل القديم — يرجّعه
     loanChgByCat= القرض المحمّل مباشرة (v2) — منخصم أصلاً بـspentByCat،
                   نحتفظ بيه للعرض («منها قرض لازم يرجع»)
     ------------------------------------------------------------ */
  const spentByCat = {}, fundInByCat = {}, repayByCat = {}, loanChgByCat = {};
  /* fundInByCat يجمع السحب والقرض سوة، وهذني تفرزهن: السحب إله حساب
     غير القرض — السحب يغطّي جزء من المخصص، والقرض يزيد فوكه */
  const fundWdByCat = {}, fundLoanByCat = {};
  let spendingSpent = 0, fundDeposits = 0;
  state.expenses.forEach(e => {
    const kd = kindOf(e, saveNames);
    const a  = Number(e.amount) || 0;
    const k  = e.category || '— بلا تصنيف —';
    if(isFundKind(kd)){
      /* حركة على صندوق — رصيد الصندوق ينحسب من spentByCat بعد،
         لأن الصناديق تنقرا بنفس الخريطة تحت */
      spentByCat[k] = (spentByCat[k]||0) + a;
      if(kd === 'fund_dep') fundDeposits += -a;   /* إيداع من الفائض ينقص «الباقي» */
      return;
    }
    if(hitsCat(kd))    spentByCat[k] = (spentByCat[k]||0) + a;
    if(hitsRemain(kd)) spendingSpent += a;
    if(kd === 'cat_fund' || kd === 'cat_loan_v1') fundInByCat[k] = (fundInByCat[k]||0) - a;
    if(kd === 'cat_fund')    fundWdByCat[k]   = (fundWdByCat[k]||0) - a;
    if(kd === 'cat_loan_v1') fundLoanByCat[k] = (fundLoanByCat[k]||0) - a;
    if(kd === 'cat_pay_v1') repayByCat[k] = (repayByCat[k]||0) + a;
    if(kd === 'cat_loan') loanChgByCat[k] = (loanChgByCat[k]||0) + a;
    if(kd === 'cat_fix')  loanChgByCat[k] = (loanChgByCat[k]||0) + a;   /* سالب — يقلّل المحمّل */
  });

  const totalSalary = (b.salaries && b.salaries.length)
    ? b.salaries.reduce((s,x)=> s + (Number(x.amount)||0), 0)
    : (b.salary1||0) + (b.salary2||0);
  const extraIncome = ((b.incomes)||[]).reduce((s,x)=> s + (Number(x.amount)||0), 0);
  const totalIncome = totalSalary + extraIncome;
  const remain = totalIncome + spendCarried - saveContrib - spendingSpent - fundDeposits;
  state._surplus = Math.max(0, remain);
  state._remainRaw = remain;   // للمطابقة — بدون تصفير السالب

  /* «المصروف» المعروض = الصرف الفعلي — نطلّع منه القروض/التمويل الداخل
     من الصناديق (سالب) وسدادها (موجب). الحسابات (الباقي للصرف) تظل عالصافي. */
  let fundInTotal = 0, repayTotal = 0, loanChgTotal = 0;
  Object.keys(fundInByCat).forEach(k => { fundInTotal += fundInByCat[k]; });
  Object.keys(repayByCat).forEach(k => { repayTotal += repayByCat[k]; });
  /* القرض المحمّل (v2) مطلوع من spendingSpent عمداً — بس هو صرف فعلي
     (الفلوس طلعت من الصندوق)، فيرجع هنا بالعرض بس */
  Object.keys(loanChgByCat).forEach(k => { loanChgTotal += loanChgByCat[k]; });
  const realSpending = spendingSpent + fundInTotal - repayTotal + loanChgTotal;

  $('hSalary') && setStat($('hSalary'), totalIncome);
  setStat($('hSpent'), realSpending);
  setStat($('hRemain'), remain);
  $('hRemain').className = 'val' + (remain < 0 ? ' neg' : '');

  /* ===== ملخص + رسم ===== */
  const donutParts = [];
  const known = new Set(cats.map(c=>c.name));
  // الدونات تعرض الصرف الفعلي (بدون حركات القرض/التمويل الداخلة من الصناديق)
  cats.filter(c=>c.type!=='save').forEach(c => {
    const v = (spentByCat[c.name]||0) + (fundInByCat[c.name]||0) - (repayByCat[c.name]||0);
    if(v>0) donutParts.push({label:c.name, value:v});
  });
  let other = 0;
  Object.keys(spentByCat).forEach(k => { if(!known.has(k) && !saveNames.has(k) && spentByCat[k]>0) other += spentByCat[k]; });
  if(other > 0) donutParts.push({ label:'أخرى', value:other });

  const prog = monthProgress(state.month, state.budget);
  const dailyAvg = prog.elapsed > 0 ? Math.round(realSpending / prog.elapsed) : 0;
  const canDaily = prog.left > 0 ? Math.max(0, Math.round(remain / prog.left)) : 0;

  /* ===== بطاقة الذكاء — ملاحظات تحقيقية محسوبة من بياناتك ===== */
  const insights = [];
  (state.debts||[]).filter(d => d.kind === 'قرض' && d.dueDate).forEach(d => {
    const days = Math.floor((new Date(d.dueDate) - new Date(todayISO())) / 86400000);
    if(days < 0) insights.push('⏰ قضية متأخرة: قرض «' + d.account + '» (' + fmt(d.amount) + ') فات موعد إرجاعه!');
    else if(days <= 3) insights.push('⏰ قرض «' + d.account + '» موعد إرجاعه ' + (days === 0 ? 'اليوم' : 'بعد ' + days + ' يوم') + ' (' + fmt(d.amount) + ')');
  });
  cats.filter(c=>c.type!=='save').forEach(c => {
    const fi = fundInByCat[c.name]||0, rp = repayByCat[c.name]||0;
    const eff = (Number(c.amount)||0) + (Number(c.carried)||0) + fi - rp;
    const sp = (spentByCat[c.name]||0) + fi - rp;
    if(eff > 0 && sp > eff) insights.push('🚨 تحذير: «' + c.name + '» تجاوز ميزانيته بـ' + fmt(sp - eff));
    else if(eff > 0 && sp / eff >= .85) insights.push('⚠️ «' + c.name + '» وصل ' + Math.round(sp / eff * 100) + '% من ميزانيته — انتبه للباقي');
  });
  if(prog.elapsed >= 14){
    /* مقارنة آخر ٧ أيام بالـ٧ اللي قبلها (مصاريف صافية بس) */
    let w1 = 0, w2 = 0;
    const todayD = new Date(todayISO());
    state.expenses.forEach(e => {
      if(isFundMove(e, saveNames)) return;
      const dd = Math.floor((todayD - new Date(e.date)) / 86400000);
      if(dd >= 0 && dd < 7) w1 += e.amount;
      else if(dd >= 7 && dd < 14) w2 += e.amount;
    });
    if(w2 > 0 && w1 >= 0){
      const pc = Math.round((w1 - w2) / w2 * 100);
      if(pc <= -5) insights.push('📉 صرفك آخر ٧ أيام أقل من الأسبوع اللي قبله بـ' + (-pc) + '% — أحسنت!');
      else if(pc >= 5) insights.push('📈 صرفك آخر ٧ أيام أكثر من الأسبوع اللي قبله بـ' + pc + '%');
    }
  }
  cats.filter(c=>c.type==='save').forEach(c => {
    const goal = Number(c.goal)||0;
    if(goal <= 0) return;
    const bal = (Number(c.carried)||0) + (Number(c.amount)||0) - (spentByCat[c.name]||0);
    if(bal >= goal) insights.push('🎉 القضية انحلت: صندوق «' + c.name + '» حقق هدفه!');
    else if(bal / goal >= .8) insights.push('🎯 صندوق «' + c.name + '» وصل ' + Math.round(bal / goal * 100) + '% من هدفه — قربت!');
  });
  if(fundDeposits > 0) insights.push('🏦 ودّعت ' + fmt(fundDeposits) + ' بالصناديق هالشهر — عاشت إيدك');
  if(prog.left > 0 && remain > 0) insights.push('💡 باقي ' + prog.left + ' يوم بالشهر وتكدر تصرف ' + fmt(canDaily) + ' باليوم');
  if(!insights.length) insights.push('😌 كلشي تحت السيطرة — التحقيق ما لگه شي مريب');
  state._insights = insights;
  if(tabShown('tab-dash')) renderInsightCard();

  /* بيانات النظرة العامة — تنخزن وتنرسم حسب التبويب المختار (renderDashView) */
  state._dash = {
    donutParts, dailyAvg, canDaily, prog,
    realSpending,
    totalAvail: spendAlloc + spendCarried + fundInTotal - repayTotal
  };

  /* ===== ظروف المصاريف =====
     الضغط على الظرف يفتح قائمته بمكانها (مصاريف الفترة + السحوبات/القروض
     الداخلة من الصناديق) — ما ينقلك لتبويب ثاني. والفلتر (من الدونات أو
     الليجند) يخفي باقي الظروف ويخلي المختار بروحه مفتوح. */
  const envFilter = ($('fltCat') && $('fltCat').value) || '';
  let envHtml = '';
  if(envFilter){
    envHtml += `
      <div class="env-filter" onclick="filterByCat('')" tabindex="0" role="button" aria-label="إلغاء الفلتر">
        <span>🔎 مفلتر على «${esc(envFilter)}» — باقي الظروف مخفية</span>
        <span class="env-filter-x">✕ إلغاء</span>
      </div>`;
  }
  cats.forEach((c, ci) => {
    if(c.type === 'save') return;
    if(envFilter && c.name !== envFilter){ delete spentByCat[c.name]; return; }
    const carried = Number(c.carried)||0;
    const fundIn = fundInByCat[c.name] || 0;       // قروض/تمويل داخل من الصناديق
    const repay  = repayByCat[c.name] || 0;        // سداد قروض راجعة للصناديق
    /* السحب چان محسوب ضمن سطر «قرض من الصناديق» — وهو مو قرض. هسه
       انفصل: السحب يزيد متاح التصنيف وخلص، بلا سطر هنا؛ تفصيله (شكد
       سحب) يبين بملاحظة صف التصنيف بتبويب «الميزانية». واللي يبقى
       باللوحة بس القرض، لأنه الوحيد اللي لازم يرجع. */
    const fundWd   = fundWdByCat[c.name] || 0;              // سحب من صندوق وصل لهذا التصنيف
    const loanOut  = (fundLoanByCat[c.name] || 0) - repay;   // قرض قديم (v1) لسه ما انسدّ
    const loanChg = loanChgByCat[c.name] || 0;     // قرض محمّل مباشرة (v2) — منخصم أصلاً
    const netSpent = spentByCat[c.name] || 0;      // الصافي (مثل قبل — أساس الحسابات)
    const realSpent = netSpent + fundIn - repay;   // الصرف الفعلي للعرض
    const effective = carried + catAllocPool(Number(c.amount)||0, fundWd) + loanOut;
    const left = effective - realSpent;            // نفس قيمة (المخصص+المرحّل−الصافي)
    const pct = effective > 0 ? Math.min(100, Math.round(realSpent / effective * 100)) : (realSpent>0?100:0);
    const cls = pct >= 100 ? 'over' : (pct >= 80 ? 'warn' : '');
    const isOpen = state._envOpen === c.name;
    /* الرأس هو الزر (وبيه كل الأرقام)، والقائمة أخته — مو جوّاه.
       لو خلّينا القائمة داخل عنصر role="button" چان صار عدنا أزرار
       حذف/تعديل جوّا زر، وهذا يخرب قراءة الشاشة الناطقة. */
    envHtml += `
      <div class="env${isOpen?' open':''}">
        <div class="env-head clickable" onclick="toggleEnv(${ci})" tabindex="0" role="button" aria-expanded="${isOpen}" aria-label="${isOpen?'سكّر':'افتح'} حركات تصنيف ${esc(c.name)}" title="اضغط حتى تشوف مصاريف وسحوبات هذا التصنيف">
          <div class="env-top">
            <span class="env-name">${esc(c.name)} <span class="env-caret">${isOpen?'▲':'▼'}</span></span>
            <span class="env-left ${left<0?'over':''}">${left<0 ? 'تجاوز ' + fmt(-left) : 'باقي ' + fmt(left)}</span>
          </div>
          <div class="bar"><i class="${cls}" style="width:${pct}%"></i></div>
          <div class="env-sub"><span>صرفت ${fmt(realSpent)}</span><span>المتاح ${fmt(effective)}</span></div>
          ${carried ? `<div class="env-carry">${carried < 0 ? '⚠️ منها تجاوز مرحّل من الفترة الماضية: ' + fmt(-carried) : '↩ منها مرحّل من الشهر الماضي: ' + fmt(carried)}</div>` : ''}
          ${loanOut > 0 ? `<div class="env-carry">🤝 منها قرض من الصناديق (لازم يرجع): ${fmt(loanOut)}</div>` : ''}
          ${loanChg > 0 ? `<div class="env-carry">🤝 منها مصروف بقرض من الصناديق (لازم يرجع): ${fmt(loanChg)}</div>` : ''}
        </div>
        ${isOpen ? envMovesHtml(c.name, saveNames) : ''}
      </div>`;
    delete spentByCat[c.name];
  });

  /* ===== صناديق الادخار (البطاقات الكاملة بقسم «الصناديق» بتبويب المصروف) ===== */
  let saveHtml = '';
  state._fundTotal = 0;   // للمطابقة
  const fundView = [];    // بيانات مختصرة لملخص اللوحة (عرض فقط)
  const saveList = cats.map((c,i)=>({c,i})).filter(x=>x.c.type==='save');
  if(saveList.length){
    let totalBal = 0, rows = '';
    saveList.forEach(({c,i}) => {
      const carried = Number(c.carried)||0;
      const contrib = Number(c.amount)||0;
      const wd = spentByCat[c.name] || 0;   // صافي السحب (السحب موجب، الإرجاع سالب)
      const bal = carried + contrib - wd;
      const goal = Number(c.goal)||0;
      const isClosed = !!c.closed;   // مغلق: يظل ظاهر للشهر الحالي وما يترحّل
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
      /* خمس أزرار بكل بطاقة چانوا يغرقون الشاشة ويخلون البطاقة كلها
         تنقرا كشريط أزرار مو كرصيد. هسه البطاقة كلها زر واحد يفتح
         قائمة الخيارات — الرقم يبقى هو البطل، والخيارات تجي لمن
         تطلبها. */
      rows += `
        <div class="fund${isClosed?' closed':''} clickable" onclick="openFundMenu(${i})" tabindex="0" role="button" aria-label="خيارات صندوق ${esc(c.name)}" title="اضغط للخيارات: سحب، إيداع، قرض، نقل، السجل">
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
          ${isClosed ? `<div class="env-carry">🔒 مغلق — من ينقفل الشهر ما راح يترحّل للشهر الجاي</div>` : ''}
          <div class="fund-more">اضغط للخيارات ⌄</div>
        </div>`;
      fundView.push({ name:c.name, bal, goal, closed:isClosed });
      delete spentByCat[c.name];
    });
    saveHtml = `<div class="save-head">صناديق الادخار 🏦 <span>الإجمالي: ${fmt(totalBal)}</span></div>` + rows;
    state._fundTotal = totalBal;
  }
  state._dashFunds = fundView;   /* اللوحة تحتاجها حتى لو تبويب المصروف مخفي */
  if(tabShown('tab-add')) $('saveList').innerHTML = saveHtml;

  /* ============================================================
     ديون الصناديق — مجمّعة على مستوى الصندوق
     ------------------------------------------------------------
     قبل: كل قرض بطاقة مستقلة، فصندوق بيه ٥ قروض يعطي ٥ بطاقات
     متشابهة تملأ الشاشة وما تنطي أي جواب سريع («شكد مطلوب لهذا
     الصندوق؟»). هسه: مجموعة وحدة لكل صندوق تحمل الجواب — المجموع
     وعدد القروض وأخطرها — والتفاصيل تنفتح بضغطة (إفصاح متدرّج).
     ============================================================ */
  let debtHtml = '';
  // نعرض بس القروض هنا — السحب والإيداع ما يظهرون كبطاقة دين (حسب طلب المستخدم).
  // القرض بس هو اللي يبقى «مطلوب» يترجّع أو ينشطب.
  const open = (state.debts || []).filter(d => d.kind === 'قرض');
  state._debtGroups = [];
  if(open.length){
    const totalDebt = open.reduce((s,d)=> s + (d.amount||0), 0);
    /* رصيد كل صندوق — حتى نعرض الدين مقابل الرصيد بشريط واحد */
    const balOf = {};
    fundView.forEach(f => { balOf[f.name] = f.bal; });

    /* تجميع حسب الصندوق، والمجموعات تترتب بالأثقل ديناً */
    const byFund = new Map();
    open.forEach(d => {
      const f = d.fund || '—';
      if(!byFund.has(f)) byFund.set(f, []);
      byFund.get(f).push(d);
    });
    const groups = Array.from(byFund.entries()).map(([fund, items]) => ({
      fund, items, total: items.reduce((s,d)=> s + (d.amount||0), 0)
    })).sort((a,b) => b.total - a.total);
    state._debtGroups = groups;

    const today = todayISO();
    const daysTo = iso => Math.floor((new Date(iso) - new Date(today)) / 86400000);

    let html = '';
    groups.forEach((g, gi) => {
      /* أخطر قرض بالمجموعة يحدد نبرة العنوان: متأخر > قريب > عادي */
      let overdue = 0, soon = 0;
      g.items.forEach(d => {
        if(!d.dueDate) return;
        const dd = daysTo(d.dueDate);
        if(dd < 0) overdue++; else if(dd <= 3) soon++;
      });
      const tone = overdue ? 'overdue' : (soon ? 'soon' : '');
      const bal = Number(balOf[g.fund] || 0);
      /* نسبة الدين من (الرصيد + الدين) = شكد من فلوس الصندوق برّا إيده */
      const pool = bal + g.total;
      const pct = pool > 0 ? Math.max(4, Math.min(100, Math.round(g.total / pool * 100))) : 100;
      const cnt = g.items.length;
      const cntTxt = arCount(cnt, 'قرض واحد', 'قرضين', 'قروض', 'قرض');
      const flag = overdue ? `<span class="dgrp-flag overdue">⏰ ${arCount(overdue, 'متأخر', 'متأخرين', 'متأخرة', 'متأخر')}</span>`
                 : soon    ? `<span class="dgrp-flag soon">⏰ ${arCount(soon, 'قرب موعده', 'قربوا موعدهم', 'قربوا', 'قرب موعده')}</span>`
                 : '';
      /* الافتراضي: مفتوحة لو مجموعة وحدة أو بيها متأخر — وإلا مطوية */
      const auto = (groups.length === 1) || !!overdue;
      const isOpen = debtGroupOpen(g.fund, auto);

      let rows = '';
      g.items.forEach(d => {
        const isCatLoan = !!d.toCategory;
        let dueHtml = '';
        if(d.dueDate){
          const days = daysTo(d.dueDate);
          const cls = days < 0 ? 'overdue' : (days <= 3 ? 'soon' : '');
          const txt = days < 0 ? ('⏰ فات موعد الإرجاع (' + esc(d.dueDate) + ')')
                    : days === 0 ? '⏰ موعد الإرجاع اليوم!'
                    : ('⏰ موعد الإرجاع: ' + esc(d.dueDate) + ' (باقي ' + days + ' يوم)');
          dueHtml = `<div class="debt-due ${cls}">${txt}</div>`;
        }
        rows += `
          <div class="debt loan">
            <div class="debt-top">
              <span class="debt-acc">${isCatLoan?'🗂️ ':''}${esc(d.account)}<span class="debt-kind">${isCatLoan?'🤝 قرض تصنيف':'🤝 قرض'}</span></span>
              <span class="debt-amt">${fmt(d.amount)}</span>
            </div>
            <div class="debt-sub">${isCatLoan?'قرض على تصنيف':'انعطى'} ${esc(d.date)}</div>
            ${dueHtml}
            <div class="debt-actions">
              <button class="db-return" onclick="returnDebt('${d.id}')">↩ رجّعه للصندوق</button>
              <button class="db-cancel" onclick="cancelDebt('${d.id}')">شطب (احذفه)</button>
            </div>
          </div>`;
      });

      html += `
        <div class="dgrp ${tone}${isOpen?' open':''}" data-fund="${gi}">
          <button type="button" class="dgrp-head" onclick="toggleDebtGroup(${gi})" aria-expanded="${isOpen?'true':'false'}">
            <span class="dgrp-ico">🏦</span>
            <span class="dgrp-main">
              <span class="dgrp-name">${esc(g.fund)}</span>
              <span class="dgrp-meta">${cntTxt}${bal ? ' · رصيد الصندوق ' + fmt(bal) : ''}</span>
              <span class="dgrp-bar"><i style="width:${pct}%"></i></span>
            </span>
            <span class="dgrp-side">
              <span class="dgrp-amt">${fmt(g.total)}</span>
              ${flag}
            </span>
            <span class="dgrp-chev" aria-hidden="true">›</span>
          </button>
          <div class="dgrp-body"><div class="dgrp-inner">${rows}</div></div>
        </div>`;
    });
    debtHtml = `<div class="save-head">ديون الصناديق ⏳ <span>الإجمالي: ${fmt(totalDebt)}</span></div>` + html;
  }
  state._dashDebts = open;       /* نفس السبب — الحساب دائماً، الرسم حسب التبويب */
  if(tabShown('tab-add')) $('debtList').innerHTML = debtHtml;

  /* مصاريف على تصنيفات غير موجودة بالميزانية */
  Object.keys(spentByCat).forEach(k => {
    if(spentByCat[k] <= 0) return;
    if(envFilter && k !== envFilter) return;
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
  /* الفتح/الفلتر إعادة رسم بضغطة المستخدم — أنميشن الدخول المتتابع يصير
     رفّة مزعجة بيها، فنسكّته لهاي الرسمة بس */
  /* ===== اللوحة: الظروف + النظرة العامة ===== */
  if(tabShown('tab-dash')){
    const envEl2 = $('envList');
    envEl2.classList.toggle('no-anim', !!state._envQuiet);
    state._envQuiet = false;
    envEl2.innerHTML = envHtml || '<div class="empty"><span class="emo">🗂️</span><b>ماكو ميزانية لهذا الشهر بعد</b>روح لتبويب «الميزانية» وحدد الرواتب والتصنيفات.</div>';
    renderDashView();
  }

  /* ===== تبويب المصروف: الفلتر + القوائم + تصنيفات الفورم ===== */
  if(tabShown('tab-add')){
    renderExpenseList();
    buildFundMoveFilters();
    renderFundMoves();

    /* قائمة تصنيفات فورم الإضافة (بدون صناديق الادخار) */
    const sel = $('expCat');
    const cur = sel.value;
    sel.innerHTML = '<option value="">— بلا تصنيف —</option>' +
      cats.filter(c=>c.type!=='save').map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
    sel.value = cur;
  }

  /* ===== فورم الميزانية =====
     ⚠️ readSalaries()/readCats() يقرون من الصفوف هذي، فلازم تكون مبنية
     قبل أي حفظ. آمن: أزرار الحفظ كلها ساكنة جوّا tab-budget، فالمستخدم
     ما يوصلهن إلا بعد ما gotoTab يبني التبويب. */
  if(tabShown('tab-budget')){
    $('salaryRows').innerHTML = '';
    $('catRows').innerHTML = '';
    $('saveRows').innerHTML = '';
    $('incomeRows').innerHTML = '';
    ((b.salaries && b.salaries.length) ? b.salaries : [{person:'راتبي', amount:b.salary1||0},{person:'راتب زوجتي', amount:b.salary2||0}]).forEach(s => addSalaryRow(s.person, s.amount));
    if(!document.querySelector('#salaryRows .cat-row')) addSalaryRow('', '');
    cats.forEach(c => addRow(c.type === 'save' ? 'save' : 'spend', c.name, c.amount, c.carried, c.goal));
    (b.incomes || []).forEach(x => addIncomeRow(x.desc, x.amount));
    if(!document.querySelector('#catRows .cat-row')) addRow('spend','','',0);
    updateAlloc();
  }

  /* شريط الفترة */
  renderPeriodBar();

  /* حالة القفل */
  $('btnCloseMonth').textContent = state.locked ? '🔒 الفترة مقفلة' : 'إقفال الفترة وترحيل الباقي ✓';
  applyLock(state.locked);
}

/* ---------- شريط الفترة بالهيدر ---------- */
function renderPeriodBar(){
  const bar = $('periodBar');
  if(!bar) return;
  const p = state.budget || {};
  $('pbName').textContent = (state.locked ? '🔒 ' : '') + periodLabel(p, state.month);
  if(hasPeriodDates(p)){
    const pr = monthProgress(state.month, p);
    const left = pr.left > 0 ? ' · باقي ' + pr.left + ' يوم' : ' · انتهت';
    $('pbRange').textContent = p.startDate + ' ← ' + p.endDate + left;
  }else{
    $('pbRange').textContent = 'بلا تواريخ — اضغط لتحديدها';
  }
}

/* ---------- خيارات الفلتر ---------- */
function buildFilterOptions(){
  const saveNames = new Set(((state.budget&&state.budget.categories)||[]).filter(c=>c.type==='save').map(c=>c.name));
  const pure = state.expenses.filter(e => !isFundMove(e, saveNames));   // مصاريف صافية بس
  const fc = $('fltCat'), fb = $('fltBy');
  if(!fc || !fb) return;
  const curC = fc.value, curB = fb.value;
  const catNames = Array.from(new Set(pure.map(e=>e.category).filter(Boolean)));
  fc.innerHTML = '<option value="">كل التصنيفات</option>' + catNames.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
  fc.value = curC;
  const people = Array.from(new Set(pure.map(e=>e.by).filter(Boolean)));
  fb.innerHTML = '<option value="">الكل</option>' + people.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
  fb.value = curB;
  const bar = $('filterBar');
  if(bar) bar.style.display = pure.length ? 'flex' : 'none';
}

/* ---------- فلترة من الرسم الدائري / ظروف اللوحة ---------- */
/* الفلتر يشتغل بمكانه: يخفي باقي الظروف، يخلي المختار بروحه، ويفتح قائمته.
   قبل چان ينقلك لتبويب «المصروف» — نقلة تضيّع مكانك وتخليك تدور رجعة. */
window.filterByCat = (name) => {
  const fc = $('fltCat');
  if(!fc) return;
  if(name === 'أخرى'){ toast('«أخرى» تجمع كذا تصنيف — اختار التصنيف من قائمة الفلتر', true); return; }
  if(name && fc.value === name) name = '';   // دوس مرة ثانية = إلغاء
  if(name && ![...fc.options].some(o => o.value === name)){
    toast('ماكو مصاريف بهذا التصنيف حتى تنفلتر', true); return;
  }
  fc.value = name || '';
  state._envOpen = name || null;   // المفلتر ينفتح تلقائياً
  state._envQuiet = true;
  if(name && dashView !== 'exp') setDashView('exp');
  render();   // يعيد رسم اللوحة + القائمة مع تظليل التصنيف المختار
  if(name){
    toast('مفلتر على «' + name + '» 🔎');
    const el = $('envList');
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }else{
    toast('انلغى الفلتر ✓');
  }
};
/* فتح/سكّ قائمة حركات الظرف بمكانها — بلا انتقال لأي تبويب */
window.toggleEnv = (i) => {
  const c = ((state.budget && state.budget.categories) || [])[i];
  if(!c) return;
  state._envOpen = (state._envOpen === c.name) ? null : c.name;
  state._envQuiet = true;
  render();
};

/* ---------- حركات تصنيف واحد — تنعرض جوّا الظرف ---------- */
function envMovesHtml(name, saveNames){
  const moves = (state.expenses || []).filter(e => e.category === name);
  if(!moves.length){
    return `<div class="env-moves">
      <div class="env-none">ماكو أي حركة على «${esc(name)}» بهاي الفترة.</div></div>`;
  }
  /* الأحدث أول — والسحوبات/القروض الداخلة من الصناديق تبين وياها بنفس القائمة */
  const rows = moves.slice().sort((a,b) => String(b.date||'').localeCompare(String(a.date||'')));
  let spent = 0, came = 0;
  rows.forEach(e => { const a = Number(e.amount)||0; if(a < 0) came += -a; else spent += a; });
  return `
    <div class="env-moves">
      <div class="env-moves-head">
        <span>☰ ${arCount(rows.length, 'حركة وحدة', 'حركتين', 'حركات', 'حركة')} بهاي الفترة</span>
        <span>${came > 0 ? 'داخل ' + fmt(came) + ' · ' : ''}صرف ${fmt(spent)}</span>
      </div>
      ${rows.map(e => expRowHtml(e, saveNames)).join('')}
    </div>`;
}

/* ---------- قائمة المصاريف (مع الفلتر — بدون حركات الصناديق) ---------- */
function renderExpenseList(){
  const saveNames = new Set(((state.budget&&state.budget.categories)||[]).filter(c=>c.type==='save').map(c=>c.name));
  const txt = ($('fltText').value||'').trim().toLowerCase();
  const fc = $('fltCat').value, fb = $('fltBy').value;

  const list = state.expenses.filter(e => {
    if(isFundMove(e, saveNames)) return false;   // حركات الصناديق إلها قسمها
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
  list.forEach(e => { expHtml += expRowHtml(e, saveNames); });
  $('expList').innerHTML = (pendHtml + expHtml) || '<div class="empty"><span class="emo">' + (state.expenses.length ? '🔍' : '🧾') + '</span><b>' + (state.expenses.length ? 'ماكو نتائج للفلتر.' : 'ماكو مصاريف مسجلة بهذا الشهر.') + '</b>' + (state.expenses.length ? 'جرّب تغيّر كلمة البحث أو الفلتر.' : 'سجّل أول مصروف من تبويب «الإضافة».') + '</div>';
}

/* ---------- صف حركة (مشترك بين قائمة المصاريف وحركات الصناديق) ---------- */
/* أيقونة/وسم كل نوع حركة — مصدر واحد بدل سلسلة شروط متداخلة */
const KIND_UI = {
  fund_wd:      { icon:'🏦', tag:' · سحب' },
  fund_loan:    { icon:'🤝', tag:' · قرض' },
  fund_dep:     { icon:'💰', tag:' · إيداع' },
  fund_dep_cat: { icon:'💰', tag:' · إيداع' },
  fund_ret:     { icon:'↩',  tag:' · إرجاع' },
  cat_fund:     { icon:'💸', tag:' · تمويل' },
  cat_loan_v1:  { icon:'💸', tag:' · تمويل بقرض' },
  cat_pay_v1:   { icon:'↩',  tag:' · سداد' },
  cat_dep:      { icon:'🏦', tag:' · لصندوق' },
  cat_loan:     { icon:'🤝', tag:' · مصروف بقرض' },
  cat_pay:      { icon:'↩',  tag:' · تسديد قرض' },
  cat_fix:      { icon:'✚',  tag:' · إعدام قرض' },
  /* نقل بين صندوقين — طرفين مربوطين، ما يمسّون الدخل ولا الباقي */
  fund_xfer_out:{ icon:'⇄', tag:' · نقل طالع' },
  fund_xfer_in: { icon:'⇄', tag:' · نقل داخل' }
};
function expRowHtml(e, saveNames){
  const k = kindOf(e, saveNames);
  const isRet = e.amount < 0;
  const ui = KIND_UI[k];
  const dotCls = isRet ? 'ret' : (isFundKind(k) ? 'wd' : '');
  const icon = ui ? ui.icon : esc((e.category||'؟').charAt(0));
  const label = e.desc || (ui ? ui.tag.replace(' · ', '') : 'بدون تفاصيل');
  const tag = ui ? ui.tag : '';
  return `
    <div class="exp" data-id="${e.id}" onclick="openEdit('${e.id}')" tabindex="0" role="button" aria-label="تعديل: ${esc(label)}">
      <div class="cat-dot ${dotCls}">${icon}</div>
      <div class="mid">
        <div class="desc">${esc(label)}</div>
        <div class="meta">${esc(e.date)}${e.category ? ' · ' + esc(e.category) : ''}${e.by ? ' · ' + esc(e.by) : ''}${tag}</div>
      </div>
      <div class="amt ${isRet?'ret':''}">${isRet?'+':''}${fmt(Math.abs(e.amount))}</div>
      ${state.locked ? '' : `<button class="del" onclick="event.stopPropagation();delExpense('${e.id}')" aria-label="حذف">✕</button>`}
    </div>`;
}

/* ---------- حركة صندوق؟ (سحب/إيداع/قرض/إرجاع/تمويل/سداد) ---------- */
function isFundMove(e, saveNames){
  return isFundMoveKind(kindOf(e, saveNames));
}

/* ---------- قائمة حركات الصناديق (قسم «الصناديق» بتبويب المصروف) ---------- */
function fundMoveKind(e, saveNames){
  const k = kindOf(e, saveNames);
  if(k === 'fund_xfer_out' || k === 'fund_xfer_in') return 'xfer';
  if(k === 'fund_dep' || k === 'fund_dep_cat') return 'dep';
  if(k === 'fund_ret') return 'ret';
  if(k === 'fund_loan') return 'loan';
  if(k === 'fund_wd') return 'wd';
  if(k === 'cat_pay' || k === 'cat_pay_v1') return 'ret';
  if(k === 'cat_fix') return 'fix';
  if(k === 'cat_loan') return 'loan';
  return 'fund';   // cat_fund / cat_loan_v1 / cat_dep — تمويل داخل لتصنيف
}
function buildFundMoveFilters(){
  const ff = $('fmFund');
  if(!ff) return;
  const cur = ff.value;
  const funds = ((state.budget && state.budget.categories) || []).filter(c => c.type === 'save');
  ff.innerHTML = '<option value="">كل الصناديق</option>' + funds.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
  ff.value = cur;
}
function renderFundMoves(){
  const el = $('fundMovList');
  if(!el) return;
  const saveNames = new Set(((state.budget&&state.budget.categories)||[]).filter(c=>c.type==='save').map(c=>c.name));
  const moves = state.expenses.filter(e => isFundMove(e, saveNames));
  const ff = ($('fmFund') && $('fmFund').value) || '';
  const fk = ($('fmKind') && $('fmKind').value) || '';
  const list = moves.filter(e => {
    if(ff){
      /* حركة تخص الصندوق المختار: عليه مباشرة، أو تمويل/سداد يذكره بالوصف */
      const onFund = e.category === ff || String(e.desc||'').indexOf('«' + ff + '»') !== -1;
      if(!onFund) return false;
    }
    if(fk && fundMoveKind(e, saveNames) !== fk) return false;
    return true;
  });
  let html = '';
  list.forEach(e => { html += expRowHtml(e, saveNames); });
  el.innerHTML = html || '<div class="empty"><span class="emo">🏦</span><b>' + (moves.length ? 'ماكو نتائج للفلتر.' : 'ماكو حركات صناديق بهذا الشهر.') + '</b>' + (moves.length ? 'جرّب تبدّل الصندوق أو النوع.' : 'اسحب أو ودّع أو سجّل قرض من البطاقات فوق.') + '</div>';
  const fb = $('fmFilterBar');
  if(fb) fb.style.display = moves.length ? 'flex' : 'none';
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
/* ============================================================
   ملاحظة صغيرة تحت صف التصنيف بالميزانية: من وين طلع «المتاح»
   ------------------------------------------------------------
   خانة المبلغ تكتب المخصص بس. لو التصنيف واصله سحب أو قرض من
   صندوق، المتاح الحقيقي أكبر من المكتوب — والفرق چان مخفي، فيصير
   المستخدم يشوف رقمين ما يطابقون وما يعرف السبب. الملاحظة هنا
   تفكّ الرقم لأجزائه: مخصص + مرحّل + سحب + قرض = المتاح.
   ============================================================ */
function catFundParts(name){
  const cats = (state.budget && state.budget.categories) || [];
  const saveNames = new Set(cats.filter(c => c.type === 'save').map(c => c.name));
  /* wd سحب داخل · loan قرض قديم (v1) داخل · repay سداده ·
     chg قرض محمّل مباشرة (v2) · out طالع من الصندوق · back راجع له */
  const p = { wd:0, loan:0, repay:0, chg:0, out:0, back:0, dep:0, xout:0, xin:0 };
  if(!name) return p;
  (state.expenses || []).forEach(e => {
    if(e.category !== name) return;
    const a = Number(e.amount) || 0;
    switch(kindOf(e, saveNames)){
      /* صندوق: الحركة عليه مباشرة — الموجب يطلع منه */
      case 'fund_wd':      p.out  += a;  break;
      case 'fund_loan':    p.loan += a;  break;
      case 'fund_xfer_out': p.xout += a;  break;
      case 'fund_xfer_in':  p.xin  += -a; break;
      case 'fund_ret':     p.back += -a; break;
      case 'fund_dep':
      case 'fund_dep_cat': p.dep  += -a; break;
      /* تصنيف مصروف: الفلوس الداخلة له تنسجل سالبة */
      case 'cat_fund':     p.wd    += -a; break;
      case 'cat_loan_v1':  p.loan  += -a; break;
      case 'cat_pay_v1':   p.repay += a;  break;
      case 'cat_loan':
      case 'cat_fix':      p.chg   += a;  break;   /* cat_fix سالب — إعدام قرض */
      default: break;
    }
  });
  return p;
}
/* سطر الملاحظة الجاهز — فارغ يعني ماكو شي يستاهل الذكر */
function catRowNote(name, amount, carried, isSave){
  const p = catFundParts(name);
  const alloc = Number(amount) || 0;
  carried = Number(carried) || 0;
  if(isSave){
    const bits = [];
    if(carried)      bits.push('🏦 رصيد مرحّل: ' + fmt(carried) + ' · محمي من الحذف — يتقفل من بطاقته باللوحة');
    if(p.out > 0)    bits.push('🏦 انسحب منه: ' + fmt(p.out));
    if(p.loan > 0)   bits.push('🤝 مقروض منه: ' + fmt(p.loan));
    if(p.back > 0)   bits.push('↩ رجع له: ' + fmt(p.back));
    if(p.dep > 0)    bits.push('💰 انودع بيه: ' + fmt(p.dep));
    if(p.xout > 0)   bits.push('⇄ انتقل منه لصناديق ثانية: ' + fmt(p.xout));
    if(p.xin > 0)    bits.push('⇄ اجه من صناديق ثانية: ' + fmt(p.xin));
    return bits.join(' · ');
  }
  const loanNet = p.loan - p.repay;                              // قرض قديم لسه ما انسدّ
  const avail = carried + catAllocPool(alloc, p.wd) + loanNet;   // نفس حساب اللوحة بالضبط
  const extras = [];
  if(carried)      extras.push((carried < 0 ? '⚠️ تجاوز مرحّل ' : '↩ مرحّل ') + fmt(carried));
  if(p.wd > alloc) extras.push('🏦 سحب من الصناديق ' + fmt(p.wd) + ' (أكثر من المخصص)');
  if(loanNet > 0)  extras.push('🤝 قرض من الصناديق ' + fmt(loanNet));
  if(!extras.length && p.wd <= 0 && p.chg <= 0) return '';
  let note = extras.length
    ? ('المتاح ' + fmt(avail) + ' = خصّصت ' + fmt(alloc) + ' · ' + extras.join(' · '))
    : (p.wd > 0 ? 'المتاح ' + fmt(avail) : '');
  /* بيت القصيد: شكد ينستقطع من الراتب فعلاً.
     المخصص هو المجموع، والسحب من الصناديق يغطّي جزء منه — فالباقي
     بس هو اللي يطلع من راتبك هالشهر. */
  if(p.wd > 0){
    /* لو السحب أكثر من المخصص، سطر «مغطّى» يطلع صفر وما يفيد —
       سطر «أكثر من المخصص» فوك يكول القصة كاملة */
    if(Math.min(alloc, p.wd) > 0) note += '\n🏦 منها مغطّى بسحب من الصناديق: ' + fmt(Math.min(alloc, p.wd));
    note += '\n💵 صافي من راتبك: ' + fmt(catFromSalary(alloc, p.wd));
  }
  if(p.chg > 0) note += (note ? '\n' : '') + '🤝 منها مصروف بقرض من الصناديق: ' + fmt(p.chg) + ' (لازم يرجع — منخصم أصلاً)';
  return note;
}

function addRow(section, name, amount, carried, goal){
  carried = Number(carried)||0;
  goal = Number(goal)||0;
  const isSave = section === 'save';
  /* صندوق مرحّل من شهر سابق (بيه رصيد) — محمي: لا ينحذف ولا ينسمى من جديد.
     إغلاقه يصير من بطاقة الصندوق باللوحة بعد ما يتصفّر رصيده */
  const lockedFund = isSave && carried !== 0;
  const container = isSave ? $('saveRows') : $('catRows');
  const ph = isSave ? 'مثلاً: ادخار بيت' : 'مثلاً: أكل البيت';
  const phAmt = isSave ? 'شهرياً' : 'المبلغ';
  const wrap = document.createElement('div');
  const div = document.createElement('div');
  div.className = 'cat-row';
  div.innerHTML = `
    <input type="text" class="cname" placeholder="${ph}" value="${esc(name||'')}" ${lockedFund?'readonly style="opacity:.75"':''}>
    <input type="tel" class="camt" placeholder="${phAmt}" inputmode="numeric" value="${amount ? Number(amount).toLocaleString('en-US') : ''}">
    ${isSave ? '' : '<span class="cat-slot"></span>'}
    ${lockedFund ? '<span class="rm" style="border:none;background:none" title="صندوق مرحّل — محمي">🔒</span>' : `<button class="rm" aria-label="حذف ${esc(name||'التصنيف')}">✕</button>`}`;
  const rm = div.querySelector('button.rm');
  if(rm) rm.onclick = () => { wrap.remove(); updateAlloc(); };
  const amt = div.querySelector('.camt');
  liveFormat(amt);
  amt.addEventListener('input', updateAlloc);
  wrap.appendChild(div);
  /* زر النقل بين التصنيفات — انتقل من اللوحة للميزانية (اللوحة صارت عرض فقط).
     يظهر بس للتصنيفات المحفوظة أصلاً بالشهر وغير المقفل.
     صار أيقونة داخل الصف بدل شريط كامل تحته — كان يضاعف طول العمود */
  if(!isSave && name && !state.locked &&
     ((state.budget && state.budget.categories) || []).some(c => c.name === name && c.type !== 'save')){
    const tr = document.createElement('button');
    tr.type = 'button';
    tr.className = 'cat-xfer';
    tr.textContent = '⇄';
    tr.title = 'نقل من هذا التصنيف لغيره';
    tr.setAttribute('aria-label', 'نقل مبلغ من تصنيف ' + name + ' لتصنيف ثاني');
    tr.addEventListener('click', () => openTransferByName(name));
    div.querySelector('.cat-slot').appendChild(tr);
  }
  if(isSave){
    const goalRow = document.createElement('div');
    goalRow.className = 'goal-row';
    goalRow.innerHTML = `<span class="goal-lbl">🎯 الهدف (اختياري)</span>
      <input type="tel" class="cgoal" inputmode="numeric" placeholder="مثلاً: 5,000,000" value="${goal ? goal.toLocaleString('en-US') : ''}">`;
    liveFormat(goalRow.querySelector('.cgoal'));
    wrap.appendChild(goalRow);
  }
  const rowNote = catRowNote(name, amount, carried, isSave);
  if(rowNote){
    const note = document.createElement('div');
    note.className = 'cat-carry';
    note.textContent = rowNote;
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
  /* جزء من توزيع المصاريف مغطّى بسحوبات من الصناديق — هذا الجزء
     ما يطلع من الراتب، فلازم يرجع للباقي وإلا يبين وكأنك موزّع
     أكثر من دخلك. (نفس منطق «صافي من راتبك» بس على مستوى الشهر) */
  let covered = 0;
  document.querySelectorAll('#catRows .cat-row').forEach(r => {
    const nm = r.querySelector('.cname').value.trim();
    if(!nm) return;
    covered += Math.min(num(r.querySelector('.camt').value), catFundParts(nm).wd);
  });
  const wl = $('aWdLine');
  if(wl){
    wl.style.display = covered > 0 ? '' : 'none';
    $('aWd').textContent = fmt(covered);
  }
  const left = (salary + income) - spend - save + covered;
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
window.openTransferByName = (name) => {
  const cats = (state.budget && state.budget.categories) || [];
  const idx = cats.findIndex(c => c.name === name && c.type !== 'save');
  if(idx < 0) return toast('احفظ الميزانية أول، بعدين انقل', true);
  openTransfer(idx, Math.max(0, catAvailable(name)));
};
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

/* ---------- إغلاق / فتح صندوق ادخار ----------
   الإغلاق (برصيد صفر بس): الصندوق يظل ظاهر لنهاية الشهر،
   ومن ينقفل الشهر ما يترحّل للشهر الجاي. */
window.closeFund = (idx) => {
  if(state.locked) return;
  const c = ((state.budget && state.budget.categories) || [])[idx];
  if(!c) return;
  if(!confirm('إغلاق صندوق «' + c.name + '»؟\n\nيظل ظاهر لنهاية هذا الشهر، ومن تقفل الشهر ما يترحّل للشهر الجاي.\n(تكدر تفتحه من جديد بأي وقت قبل إقفال الشهر)')) return;
  (async () => {
    loading(true);
    try{
      const { error } = await sb.rpc('set_fund_closed', { p_month: state.month, p_name: c.name, p_closed: true });
      if(error) throw new Error(error.message);
      toast('انغلق الصندوق ✓ 🔒 ما راح يترحّل للشهر الجاي');
      await loadMonth(state.month);
    }catch(err){ toast('ما انغلق: ' + err.message, true); }
    finally{ loading(false); }
  })();
};
window.reopenFund = (idx) => {
  if(state.locked) return;
  const c = ((state.budget && state.budget.categories) || [])[idx];
  if(!c) return;
  (async () => {
    loading(true);
    try{
      const { error } = await sb.rpc('set_fund_closed', { p_month: state.month, p_name: c.name, p_closed: false });
      if(error) throw new Error(error.message);
      toast('انفتح الصندوق من جديد ✓ 🔓');
      await loadMonth(state.month);
    }catch(err){ toast('ما انفتح: ' + err.message, true); }
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
    <div class="hint" style="margin:0 0 8px">السحب ينقص رصيد الصندوق ويزيد ميزانية التصنيف اللي تختاره (إذا اخترت وحدة). لو سجّلته على حساب، يبقى مطلوب للصندوق لين ترجعه أو تشطبه.</div>
    <div class="row">
      <div><label>المبلغ</label><input type="tel" id="wdAmount" inputmode="numeric" placeholder="0"></div>
      <div><label>التاريخ</label><input type="date" id="wdDate" value="${periodDefaultDate(state.budget, state.month)}"></div>
    </div>
    <label>💸 أضف المبلغ لتصنيف مصروف (اختياري)</label>
    <select id="wdTo">${catOpts}</select>
    <div class="hint" id="wdToHint" style="margin:6px 0 0"></div>
    <label style="margin-top:10px">على حساب منو؟ (اختياري — للسحب كدين)</label>
    <input type="text" id="wdAcc" placeholder="مثلاً: سلفة لأخوي / حساب الراتب">
    <label>السبب (اختياري)</label><input type="text" id="wdDesc" placeholder="شنو الغرض؟">
    <button class="btn" id="wdSave">سحب</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('wdAmount'));
  setTimeout(() => { try{ $('wdAmount').focus(); }catch(_){} }, 260);
  /* شكد راح يصير متاح التصنيف بعد السحب — الجواب لازم يبين قبل ما تسحب،
     مو بعدها من ترجع للوحة تدور على الرقم */
  const wdRefresh = () => {
    const to = $('wdTo').value, v = num($('wdAmount').value);
    const h = $('wdToHint');
    if(!to){
      h.innerHTML = 'ما اخترت تصنيف — الفلوس تطلع من الصندوق بس، وما تزيد متاح أي مصروف.';
      return;
    }
    const now = catAvailable(to);
    h.innerHTML = v > 0
      ? `متاح «${esc(to)}» هسه <b>${fmt(now)}</b> ← بعد السحب <b style="color:var(--primary)">${fmt(now + v)}</b>`
      : `متاح «${esc(to)}» هسه <b>${fmt(now)}</b> — المبلغ راح ينضاف عليه.`;
  };
  wdRefresh();
  $('wdTo').addEventListener('change', wdRefresh);
  $('wdAmount').addEventListener('input', wdRefresh);
  $('wdSave').onclick = async () => {
    const amount = num($('wdAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    /* السحب ينسجل بالفترة المعروضة — والتاريخ حر (فترة ٢٠ تموز ← ٢٠ آب
       تحتوي تاريخين من شهرين تقويميين مختلفين) */
    const date = $('wdDate').value || periodDefaultDate(state.budget, state.month);
    const reason = $('wdDesc').value.trim();
    const acc = $('wdAcc').value.trim();
    const toCat = $('wdTo').value;
    loading(true);
    try{
      const res = await apiPost({
        action:'withdrawFund', month: state.month, date, amount,
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
      <div><label>التاريخ</label><input type="date" id="lnDate" value="${periodDefaultDate(state.budget, state.month)}"></div>
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
           <div class="hint" style="margin:4px 0 0">🔑 المبلغ ينخصم <b>مرة وحدة من الاثنين</b>: رصيد الصندوق ومتاح التصنيف — يعني ما تحتاج تسجّل المصروف بعده. لو التصنيف ما يتحمّله ينزل بالسالب، والسالب يترحّل للفترة الجاية. و«الباقي للصرف» ما ينتأثر لأن الفلوس طلعت من الصندوق مو من الدخل.</div>`
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
    /* القرض ينسجل بالفترة المعروضة — والتاريخ حر */
    const date = $('lnDate').value || periodDefaultDate(state.budget, state.month);
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
        action:'addLoan', month: state.month, date, amount,
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

/* ============================================================
   حوض المخصص: شكد فلوس عند التصنيف قبل المرحّل والقروض
   ------------------------------------------------------------
   المخصص هو مجموع المصروف — والسحب من الصناديق يغطّي جزء منه،
   ما يزيد فوكه. يعني تخصص ٦٥٠ وتسحب ١٣٥، يبقى المصروف ٦٥٠
   و«اللي ينستقطع من راتبك» ٥١٥.
   والسحب اللي أكثر من المخصص ما يضيع: الزيادة تنضاف للحوض،
   لأن الفلوس طالعة فعلاً من الصندوق وموجودة بإيدك.
   ============================================================ */
function catAllocPool(alloc, wd){
  return Math.max(Number(alloc)||0, Number(wd)||0);
}
/* اللي يجي من الراتب فعلاً = المخصص ناقص السحب (ما ينزل تحت صفر) */
function catFromSalary(alloc, wd){
  return Math.max(0, (Number(alloc)||0) - (Number(wd)||0));
}

/* ---------- المتاح بتصنيف مصروف (حوض المخصص + المرحّل + القرض − المصروف) ---------- */
function catAvailable(name){
  const cats = (state.budget && state.budget.categories) || [];
  const c = cats.find(x => x.name === name && x.type !== 'save');
  if(!c) return 0;
  const saveNames = new Set(cats.filter(x=>x.type==='save').map(x=>x.name));
  /* حركات التسديد (cat_pay) مطلوعة — التصنيف انخصم أصلاً يوم القرض */
  const spent = (state.expenses||[])
    .filter(e => e.category === name && hitsCat(kindOf(e, saveNames)))
    .reduce((a,e) => a + (Number(e.amount)||0), 0);
  const alloc = Number(c.amount)||0;
  const wd = catFundParts(name).wd;
  /* الحساب القديم چان يجمع المخصص والسحب سوة (spent يحمل السحب بالسالب).
     هسه السحب يغطّي المخصص، فننزل الجزء المشترك — والنتيجة نفس
     (المرحّل + max(المخصص، السحب) + القرض − الصرف الفعلي). */
  return alloc + (Number(c.carried)||0) - spent - Math.min(alloc, wd);
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
      <div><label>التاريخ</label><input type="date" id="dpDate" value="${periodDefaultDate(state.budget, state.month)}"></div>
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
    /* الإيداع ينسجل بالفترة المعروضة — الفائض محسوب عليها أصلاً — والتاريخ حر */
    const dpDate = $('dpDate').value || periodDefaultDate(state.budget, state.month);
    loading(true);
    try{
      const res = await apiPost({ action:'addDeposit', month: state.month, fund:c.name, amount, date: dpDate, desc: $('dpDesc').value.trim(), fromCategory: from });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast(from ? ('انتقل من «'+from+'» للصندوق ✓ 💰') : 'انضاف للرصيد ✓ 💰');
      sndHappy();
      try{ holmesReact('celebrate'); }catch(_){}
      await loadMonth(state.month);
    }catch(err){ toast('ما انضاف: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- قائمة خيارات الصندوق ----------
   بدل شريط أزرار دائم بكل بطاقة: ضغطة على البطاقة تفتح الخيارات
   بأسماء كاملة وشرح سطر لكل واحد — أوضح من أيقونة مضغوطة، وأخف
   على الشاشة لأنها ما تظهر إلا لمن تطلبها. */
window.openFundMenu = (idx) => {
  const cats = (state.budget && state.budget.categories) || [];
  const c = cats[idx];
  if(!c || c.type !== 'save') return;
  const bal = fundBalance(c.name);
  const isClosed = !!c.closed;
  const funds = cats.filter(x => x.type === 'save');
  const others = funds.filter(x => x.name !== c.name && !x.closed);
  const frozen = state.locked || isClosed;

  const act = (fn, ico, title, sub, off) => `
    <button class="btn ghost fm-opt" ${off ? 'disabled' : `onclick="${fn}"`}>
      <b>${ico} ${title}</b><span>${sub}</span>
    </button>`;

  const goal = Number(c.goal)||0;
  const goalLine = goal > 0
    ? (bal >= goal ? '🎉 حقق هدفه (' + fmt(goal) + ')' : '🎯 الهدف ' + fmt(goal) + ' — باقي ' + fmt(goal - bal))
    : '';

  modalOpen(`
    <h2>🏦 ${esc(c.name)}</h2>
    <div class="fm-bal">${fmt(bal)}<span>الرصيد الحالي</span></div>
    ${goalLine ? `<div class="hint" style="margin:0 0 10px;text-align:center">${goalLine}</div>` : ''}
    ${state.locked ? '<div class="hint" style="margin:0 0 10px">🔒 هذه الفترة مقفلة — العرض بس.</div>' : ''}
    ${(!state.locked && isClosed) ? '<div class="hint" style="margin:0 0 10px">🔒 الصندوق مغلق — افتحه أول حتى تتحرك فلوسه.</div>' : ''}
    ${act('openWithdraw(' + idx + ')', '🏦', 'سحب', 'تطلع فلوس للصرف — وتكدر تضيفها لتصنيف مصروف', frozen)}
    ${act('openDeposit(' + idx + ')', '💰', 'إيداع', 'تزيد رصيده من الفائض أو من ميزانية تصنيف', frozen)}
    ${act('openLoan(' + idx + ')', '🤝', 'قرض', 'فلوس تطلع ويبقى مسجّل لين ترجّعها', frozen)}
    ${act('openFundTransfer(' + idx + ')', '⇄', 'نقل لصندوق ثاني',
          others.length ? 'تنقل بين صندوقين — ادخارك ما ينقص، بس ينتوزّع غير' : 'ماكو صندوق ثاني مفتوح',
          frozen || !others.length)}
    ${act('openFundLog(' + idx + ')', '☰', 'سجل الحركات', 'كل سحب وإيداع وقرض ونقل على هذا الصندوق', false)}
    ${(!state.locked && !isClosed && bal === 0) ? act('modalClose();closeFund(' + idx + ')', '🔒', 'إغلاق الصندوق', 'يظل ظاهر لنهاية الفترة وما يترحّل للجاية', false) : ''}
    ${(!state.locked && isClosed) ? act('modalClose();reopenFund(' + idx + ')', '🔓', 'فتح الصندوق', 'يرجع شغّال ويترحّل عادي', false) : ''}
    <button class="btn ghost" onclick="modalClose()" style="margin-top:6px">إغلاق</button>
  `);
};

/* ---------- نقل بين صندوقين ----------
   مو سحب + إيداع: النقل ما يمسّ لا الدخل ولا «الباقي للصرف» —
   مجموع الادخار يبقى مثل ما هو، بس توزيعه بين الصناديق يتغيّر. */
window.openFundTransfer = (idx) => {
  if(state.locked) return;
  const cats = (state.budget && state.budget.categories) || [];
  const from = cats[idx];
  if(!from || from.type !== 'save') return;
  const bal = fundBalance(from.name);
  const others = cats.filter(c => c.type === 'save' && c.name !== from.name && !c.closed);
  if(!others.length) return toast('ماكو صندوق ثاني مفتوح تنقل له', true);
  const opts = others.map(c => `<option value="${esc(c.name)}">${esc(c.name)} (${fmt(fundBalance(c.name))})</option>`).join('');
  modalOpen(`
    <h2>⇄ نقل من «${esc(from.name)}»</h2>
    <div class="hint" style="margin:0 0 8px">تنقل فلوس لصندوق ادخار ثاني. رصيد «${esc(from.name)}» الحالي: <b style="color:var(--primary)">${fmt(bal)}</b>.<br>النقل ما يمسّ راتبك ولا «الباقي للصرف» — مجموع ادخارك يبقى نفسه، بس ينتوزّع غير.</div>
    <label>إلى صندوق</label>
    <select id="xfTo">${opts}</select>
    <div class="row" style="margin-top:10px">
      <div><label>المبلغ</label><input type="tel" id="xfAmount" inputmode="numeric" placeholder="0"></div>
      <div><label>التاريخ</label><input type="date" id="xfDate" value="${periodDefaultDate(state.budget, state.month)}"></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
      <button class="btn ghost" id="xfMax" style="margin:0;width:auto;padding:8px 14px;font-size:.75rem">كل الرصيد</button>
      <span class="hint" id="xfLeft" style="margin:0"></span>
    </div>
    <label>السبب (اختياري)</label>
    <input type="text" id="xfDesc" placeholder="مثلاً: غيّرت رأيي بالهدف">
    <button class="btn" id="xfSave">نقل ⇄</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('xfAmount'));
  setTimeout(() => { try{ $('xfAmount').focus(); }catch(_){} }, 260);
  const xfRefresh = () => {
    const v = num($('xfAmount').value);
    const el = $('xfLeft');
    el.textContent = v > bal ? '⚠ أكثر من الرصيد' : (v > 0 ? 'يتبقى بـ«' + from.name + '» ' + fmt(bal - v) : '');
    el.style.color = v > bal ? 'var(--red)' : 'var(--muted)';
  };
  xfRefresh();
  $('xfAmount').addEventListener('input', xfRefresh);
  $('xfMax').onclick = () => { $('xfAmount').value = Math.max(0, bal).toLocaleString('en-US'); xfRefresh(); };
  $('xfSave').onclick = async () => {
    const amount = num($('xfAmount').value);
    const to = $('xfTo').value;
    if(amount <= 0) return toast('دخّل المبلغ', true);
    if(amount > bal) return toast('المبلغ أكثر من رصيد الصندوق (' + fmt(bal) + ')', true);
    loading(true);
    try{
      const res = await apiPost({
        action:'transferFund', month: state.month, from: from.name, to, amount,
        date: $('xfDate').value || periodDefaultDate(state.budget, state.month),
        desc: $('xfDesc').value.trim()
      });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast('انتقل لـ«' + to + '» ✓ ⇄');
      await loadMonth(state.month);
    }catch(err){ toast('ما انتقل: ' + err.message, true); }
    finally{ loading(false); }
  };
};

/* ---------- رصيد صندوق ادخار (المرحّل + مساهمة الشهر − صافي حركاته) ---------- */
function fundBalance(name){
  const c = ((state.budget && state.budget.categories) || []).find(x => x.name === name && x.type === 'save');
  if(!c) return 0;
  const moved = (state.expenses || [])
    .filter(e => e.category === name)
    .reduce((a, e) => a + (Number(e.amount) || 0), 0);
  return (Number(c.carried)||0) + (Number(c.amount)||0) - moved;
}

/* ---------- سجل حركات الصندوق ---------- */
window.openFundLog = (idx) => {
  const c = (state.budget.categories||[])[idx];
  if(!c) return;
  const saveNames = new Set(((state.budget&&state.budget.categories)||[]).filter(x=>x.type==='save').map(x=>x.name));
  /* الاسم ينجاب من e.kind — قبل چان ينشتق من نص الوصف، فحركة النقل
     الداخلة (سالبة) چانت تنقرا «إرجاع دين» وهي مو دين أصلاً */
  const FLOG_NAME = {
    fund_wd:'سحب', fund_loan:'قرض', fund_dep:'إيداع', fund_dep_cat:'إيداع',
    fund_ret:'إرجاع دين', fund_xfer_out:'نقل لصندوق', fund_xfer_in:'نقل من صندوق'
  };
  const moves = state.expenses.filter(e => e.category === c.name);
  let rows = '';
  moves.forEach(e => {
    const sign = e.amount < 0 ? '+' : '−';
    const cls = e.amount < 0 ? 'plus' : 'minus';
    const kind = FLOG_NAME[kindOf(e, saveNames)] || (e.amount < 0 ? 'إيداع' : 'سحب');
    const canEdit = e.amount > 0 && !state.locked;   // الطرف الطالع بس — الداخل ينضبط وياه
    rows += `
      <div class="flog">
        <div>
          <div>${esc(e.desc || kind)}</div>
          <div class="fl-meta">${esc(e.date)} · ${kind}${e.by ? ' · ' + esc(e.by) : ''}</div>
        </div>
        <div style="display:flex;align-items:center;gap:7px">
          ${canEdit ? `<button class="fl-edit" onclick="openEditWithdraw('${e.id}', ${idx})" title="تعديل" aria-label="تعديل الحركة">✎</button>
          <button class="fl-del" onclick="deleteWithdraw('${e.id}', ${idx})" title="حذف" aria-label="حذف الحركة">🗑</button>` : ''}
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
  const cats = (state.budget && state.budget.categories) || [];
  const saveNames = new Set(cats.filter(c => c.type === 'save').map(c => c.name));
  const kd = kindOf(e, saveNames);
  const isLoan = kd === 'fund_loan' || String(e.desc||'').indexOf('قرض') === 0;
  const isXfer = kd === 'fund_xfer_out';
  const title  = isXfer ? 'النقل' : (isLoan ? 'القرض' : 'السحب');
  /* الطرف الثاني للنقل — ما ينفع يصير هو نفسه صندوق المصدر */
  const otherSide = (state.expenses||[]).find(x => x.linkId === id);
  const blocked = new Set([e.category]);
  if(isXfer && otherSide) blocked.add(otherSide.category);
  /* نقل الحركة لصندوق ثاني: الصندوق الغلط چان يعني احذف وسجّل من جديد،
     وهذا يضيّع الدين المرتبط وتاريخ الحركة. هسه ينتقل وكلشي مربوط بيه وياه. */
  const fundOpts = cats.filter(c => c.type === 'save' && (c.name === e.category || (!c.closed && !blocked.has(c.name))))
    .map(c => `<option value="${esc(c.name)}"${c.name === e.category ? ' selected' : ''}>${esc(c.name)}</option>`).join('');
  const backBtn = (fundIdx == null)
    ? `<button class="btn ghost" onclick="modalClose()">إلغاء</button>`
    : `<button class="btn ghost" onclick="openFundLog(${fundIdx})">رجوع</button>`;
  modalOpen(`
    <h2>تعديل ${title} ✎</h2>
    <div class="hint" style="margin:0 0 8px">أي تغيير هنا ينضبط تلقائياً على: رصيد الصندوق، والدين/القرض المرتبط، وتمويل التصنيف إذا موجود.</div>
    <div class="row">
      <div><label>المبلغ</label><input type="tel" id="ewAmount" inputmode="numeric" value="${Math.abs(e.amount).toLocaleString('en-US')}"></div>
      <div><label>التاريخ</label><input type="date" id="ewDate" value="${esc(e.date)}"></div>
    </div>
    <label>🏦 الصندوق</label>
    <select id="ewFund">${fundOpts}</select>
    <div class="hint" id="ewFundHint" style="margin:6px 0 0"></div>
    <label style="margin-top:10px">التفاصيل</label><input type="text" id="ewDesc" value="${esc(e.desc||'')}">
    <button class="btn" id="ewSave">حفظ التعديل</button>
    ${backBtn}
  `);
  liveFormat($('ewAmount'));
  setTimeout(() => { try{ $('ewAmount').focus(); }catch(_){} }, 260);
  const ewRefresh = () => {
    const f = $('ewFund').value;
    $('ewFundHint').innerHTML = f === e.category
      ? `رصيد «${esc(f)}» هسه <b>${fmt(fundBalance(f))}</b>.`
      : `راح تنقل الحركة من «${esc(e.category)}» لـ«${esc(f)}» — المبلغ يرجع للأول وينخصم من الثاني، والدين المرتبط ينتقل وياها.`;
  };
  ewRefresh();
  $('ewFund').addEventListener('change', ewRefresh);
  $('ewSave').onclick = async () => {
    const amount = num($('ewAmount').value);
    if(amount <= 0) return toast('دخّل المبلغ', true);
    const date = $('ewDate').value || e.date;   /* التاريخ حر — الفترة ما تتغيّر */
    const fund = $('ewFund').value;
    loading(true);
    try{
      const res = await apiPost({ action:'editWithdraw', id, amount, date, desc: $('ewDesc').value.trim(), fund });
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
  if(!(await confirmDel('تحذف ' + (isLoan?'القرض':'السحب') + ' (' + fmt(e.amount) + ')؟', 'ينحذف وياه الدين المرتبط وتمويل التصنيف إذا موجود، ويرجع المبلغ لرصيد الصندوق.'))) return;
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
  /* الإرجاع ينسجل بالفترة المعروضة (المفتوحة) — والتاريخ حر */
  if(state.locked) return toast('هذه الفترة مقفلة — روح للفترة المفتوحة وسوي الإرجاع منها', true);
  const retDate = periodDefaultDate(state.budget, state.month);
  const cat = (d.toCategory || '').trim();
  const isV2 = (d.model || 'v1') === 'v2';

  /* قرض لشخص — ماكو تصنيف يتأثر، فطريق وحيد */
  if(!cat){
    if(!confirm('ترجيع ' + fmt(d.amount) + ' لصندوق «' + d.fund + '»؟\nراح يرجع المبلغ لرصيد الصندوق ويتسجّل بتاريخ ' + retDate + ' ضمن «' + periodLabel(state.budget, state.month) + '».')) return;
    return doReturnDebt(id, 'repay', retDate);
  }

  /* قرض على تصنيف — الخيارات تفرق حسب نسخة القرض.
     v1 (قبل ترحيل loan-charge-model.sql): التصنيف عنده «تمويل» زائد
     لازم ينشال عند الإرجاع، فـ«الكل يرجع لحالته» ما إلها معنى منفصل. */
  const opt = (mode, ico, title, sub) => `
    <button class="btn ghost rd-opt" data-mode="${mode}" style="text-align:start;margin:0 0 8px;width:100%;padding:12px 14px;line-height:1.5">
      <b style="display:block;font-size:.86rem">${ico} ${title}</b>
      <span style="color:var(--muted);font-size:.72rem;font-weight:400">${sub}</span>
    </button>`;

  modalOpen(`
    <h2>إغلاق قرض «${esc(d.account)}» 🤝</h2>
    <div class="hint" style="margin:0 0 12px">قرض ${fmt(d.amount)} من صندوق «${esc(d.fund)}» على تصنيف «${esc(cat)}». اختار شلون تريد تغلقه — ينسجّل بتاريخ ${esc(retDate)} ضمن «${esc(periodLabel(state.budget, state.month))}».</div>
    ${opt('repay', '↩', 'رجّع القرض للصندوق',
      isV2 ? 'الصندوق يسترجع مبلغه، والتصنيف يبقى محمّل بالقرض (يظل سالب).'
           : 'الصندوق يسترجع مبلغه، والتمويل ينشال من التصنيف.')}
    ${isV2 ? opt('full', '✓', 'رجّع القرض وصحّح التصنيف',
      'الصندوق يسترجع مبلغه، والتصنيف يرجع لحالته الطبيعية قبل القرض.') : ''}
    ${opt('void', '🚫', 'إعدام القرض',
      isV2 ? 'الصندوق ما يسترجع شي، والتصنيف يرجع موجب — كأن القرض انهدى له.'
           : 'الصندوق ما يسترجع شي، والتمويل يبقى بالتصنيف بلا مقابل.')}
    <button class="btn ghost" onclick="modalClose()" style="margin-top:6px">إلغاء</button>
  `);
  document.querySelectorAll('.rd-opt').forEach(b => {
    b.onclick = () => { modalClose(); doReturnDebt(id, b.dataset.mode, retDate); };
  });
};

async function doReturnDebt(id, mode, retDate){
  loading(true);
  try{
    const res = await apiPost({ action:'returnDebt', id, date: retDate, month: state.month, mode });
    if(guardAuth(res)) return;
    if(!res.ok) throw new Error(res.error || 'خطأ');
    toast(mode === 'void' ? 'انعدم القرض ✓ 🚫'
        : mode === 'full' ? 'انرجّع القرض وانصحّح التصنيف ✓'
        : 'انرجّع للصندوق ✓');
    await loadMonth(state.month);
  }catch(err){ toast('ما انرجّع: ' + err.message, true); }
  finally{ loading(false); }
}

window.cancelDebt = async (id) => {
  const d = (state.debts||[]).find(x=>x.id===id);
  if(!d) return;
  if(!(await confirmDel('تشطب الدين «' + d.account + '» (' + fmt(d.amount) + ')؟', 'المبلغ يبقى مسحوب من الصندوق وما راح يرجع.', 'اشطب'))) return;
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

/* ============================================================
   أسماء قديمة غير مرتبطة
   المصاريف صارت تنخزن بهوية صاحبها (expenses.user_id)، فتغيير
   الاسم يمشي على كل التاريخ. بس السجلات اللي انكتبت قبل هالتغيير
   ما عندها هوية — بس اسم نصي. هنا نربطها بصاحبها مرة وحدة.
   ============================================================ */
/* آخر قائمة أسماء يتيمة — نمرر فهرسها للزر بدل الاسم نفسه.
   ليش؟ لأن تمرير النص داخل onclick يعني إن اسم فيه رموز HTML
   ينفك ترميزه قبل ما ينقرا كجافاسكربت — وهاي ثغرة حقن. نفس
   الأسلوب المستعمل بـopenTransfer/adminDelete. */
let _orphans = [];
async function loadOrphanNames(){
  const box = $('orphanBox');
  if(!box) return;
  box.innerHTML = '';
  _orphans = [];
  let d;
  try{
    const { data, error } = await sb.rpc('list_authors');
    if(error) return;
    d = data;
  }catch(_){ return; }
  const orphans = (d && d.orphans) || [];
  const members = (d && d.members) || [];
  if(!orphans.length || !members.length) return;
  _orphans = orphans;

  const opts = members.map(m => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
  box.innerHTML = `
    <div class="orph-wrap">
      <div class="orph-head">🔗 أسماء قديمة غير مرتبطة (${orphans.length})</div>
      <div class="hint" style="margin:0 0 10px">هذي أسماء انسجّلت بمصاريف قديمة قبل ما نربط المصروف بصاحبه. اختر منو صاحبها حتى تندمج ويّاه بفلتر «منو صرف».</div>
      ${orphans.map((o, i) => `
        <div class="orph">
          <div class="orph-name">«${esc(o.name || 'بلا اسم')}» <span class="orph-n">${o.count} مصروف</span></div>
          <div class="orph-row">
            <select id="orphSel${i}">${opts}</select>
            <button class="orph-go" onclick="mergeAuthor(${i})">اربطه</button>
          </div>
        </div>`).join('')}
    </div>`;
}

window.mergeAuthor = async (i) => {
  const o = _orphans[i];
  if(!o) return;
  const oldName = o.name || '';
  const sel = $('orphSel' + i);
  if(!sel) return;
  const userId = sel.value;
  const who = sel.options[sel.selectedIndex].textContent;
  if(!(await confirmDel('تربط «' + oldName + '» بـ«' + who + '»؟', 'كل مصاريف هذا الاسم راح تنحسب على ' + who + ' وتندمج ويّا مصاريفه.', 'اربطه'))) return;
  loading(true);
  try{
    const { data, error } = await sb.rpc('merge_author', { p_old_name: oldName, p_user_id: userId });
    if(error) throw new Error(error.message);
    toast('انربط ' + (data || 0) + ' مصروف بـ«' + who + '» ✓ 🔗');
    await loadOrphanNames();
    await loadMonth(state.month);
  }catch(err){ toast('ما انربط: ' + err.message, true); }
  finally{ loading(false); }
};

/* ============================================================
   إدارة أعضاء العائلة — للمشرف بس
   تمر عبر Edge Function اسمها household-admin، لأن تغيير باسورد
   يوزر ثاني يحتاج مفتاح service_role — وهذا المفتاح ممنوع يوصل
   للمتصفح أبداً (يتجاوز كل حماية RLS). الدالة بالسيرفر تتأكد إن
   اللي يطلب أدمن نفس العائلة قبل ما تسوي أي شي.
   ============================================================ */
async function callAdminFn(payload){
  const { data, error } = await sb.functions.invoke('household-admin', { body: payload });
  if(error){
    /* رسالة الخطأ الحقيقية تجي بجسم الرد — نحاول نقراها */
    let msg = error.message || 'خطأ بالخادم';
    try{ const j = await error.context.json(); if(j && j.error) msg = j.error; }catch(_){}
    return { ok:false, error: msg };
  }
  if(data && data.error) return { ok:false, error: data.error };
  return { ok:true, ...(data||{}) };
}

/* يرسم بطاقات الأعضاء داخل #memList — نفس الشكل بالإعدادات وبلوحة المشرف.
   hhId يمرر بس لمن نكون بلوحة المشرف (حتى إعادة التحميل ترجع لنفس العائلة) */
function renderMemberCards(list, hhId){
  const box = $('memList');
  if(!box) return;
  const arg = hhId ? `,'${hhId}'` : '';
  box.innerHTML = list.map(m => `
    <div class="mem">
      <div class="mem-top">
        <span class="mem-name">${esc(m.name || 'بلا اسم')}${m.admin ? '<span class="mem-tag">🛡 مشرف</span>' : ''}${m.self ? '<span class="mem-tag you">إنت</span>' : ''}</span>
      </div>
      <div class="mem-mail" dir="ltr">${esc(m.email || '—')}</div>
      <div class="mem-actions">
        <button class="mem-pw" onclick="memSetPassword('${m.id}'${arg})">🔑 غيّر الباسورد</button>
        ${(m.self || m.admin) ? '' : `<button class="mem-rm" onclick="memRemove('${m.id}'${arg})">✕ شيله من العائلة</button>`}
      </div>
    </div>`).join('');
}

async function loadMembers(hhId){
  const box = $('memList');
  if(!box) return;
  box.innerHTML = '<div class="hint">دا أجيب الأعضاء…</div>';
  const res = await callAdminFn(hhId ? { action:'list', householdId:hhId } : { action:'list' });
  if(!res.ok){ box.innerHTML = '<div class="hint" style="color:var(--red)">ما كدرت أجيب الأعضاء: ' + esc(res.error) + '</div>'; return; }
  const list = res.members || [];
  if(!list.length){ box.innerHTML = '<div class="hint">ماكو أعضاء</div>'; return; }
  renderMemberCards(list, hhId);
}

window.memSetPassword = (id, hhId) => {
  modalOpen(`
    <h2>🔑 تغيير باسورد عضو</h2>
    <div class="hint" style="margin:0 0 12px">راح ينتغيّر فوراً بلا ما نسأل عن باسورده القديم. انطيه الباسورد الجديد وخله يغيّره بنفسه بعدين من الإعدادات.</div>
    <label>الباسورد الجديد</label>
    <input type="password" id="mpNew" autocomplete="new-password" placeholder="٦ خانات على الأقل">
    <label>تأكيد الباسورد</label>
    <input type="password" id="mpNew2" autocomplete="new-password" placeholder="أعد كتابته">
    <button class="btn" id="mpSave">غيّر الباسورد ✓</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  setTimeout(() => { try{ $('mpNew').focus(); }catch(_){} }, 260);
  $('mpSave').onclick = async () => {
    const np = $('mpNew').value, np2 = $('mpNew2').value;
    if(np.length < 6) return toast('الباسورد قصير — ٦ خانات على الأقل', true);
    if(np !== np2) return toast('التأكيد ما يطابق', true);
    loading(true);
    try{
      const res = await callAdminFn({ action:'setPassword', userId:id, password:np });
      if(!res.ok) throw new Error(res.error);
      modalClose();
      toast('انتغيّر باسورد «' + (res.name || 'العضو') + '» ✓ 🔑');
      /* لو جينا من لوحة المشرف، نرجّع قائمة نفس العائلة */
      if(hhId) setTimeout(() => adminMembers(hhId), 200);
    }catch(err){ toast('ما انتغيّر: ' + err.message, true); }
    finally{ loading(false); }
  };
};

window.memRemove = async (id, hhId) => {
  if(!(await confirmDel('تشيل هذا العضو من العائلة؟', 'حسابه يبقى موجود بس ما يعود يشوف بيانات العائلة. تكدر ترجّعه بكود العائلة.', 'شيله'))) return;
  loading(true);
  try{
    const res = await callAdminFn({ action:'remove', userId:id });
    if(!res.ok) throw new Error(res.error);
    toast('انشال «' + (res.name || 'العضو') + '» من العائلة ✓');
    loadMembers(hhId);
  }catch(err){ toast('ما انشال: ' + err.message, true); }
  finally{ loading(false); }
};

/* ============================================================
   الفترة — اسم وتاريخ بداية ونهاية
   الفترة مو شهر تقويمي: تبدي وقت ما يوصل الراتب وتنتهي وقت ما
   تحدده إنت. المفتاح 'YYYY-MM' بقى داخلي بس.
   ============================================================ */

/* اقتراحات فترة جديدة، مبنية على الفترة اللي قبلها */
async function suggestPeriod(month){
  let prev = null;
  try{
    const r = await sb.rpc('load_month', { p_month: prevMonthStr(month) });
    if(!r.error && r.data) prev = r.data.budget;
  }catch(_){}
  const start = (prev && prev.endDate) ? addDays(prev.endDate, 1) : todayISO();
  return {
    title: suggestPeriodTitle(prev && prev.title, month),
    start,
    end: addDays(start, PERIOD_DAYS - 1)
  };
}

/* p_isNew = شاشة «بداية فترة جديدة» بعد الإقفال */
window.openPeriodSetup = async (month, isNew) => {
  month = month || state.month;
  const cur = (month === state.month) ? (state.budget || {}) : {};
  let vals = { title: cur.title || '', start: cur.startDate || '', end: cur.endDate || '' };
  if(!vals.title || !vals.start || !vals.end){
    loading(true);
    try{
      const s = await suggestPeriod(month);
      vals = { title: vals.title || s.title, start: vals.start || s.start, end: vals.end || s.end };
    }finally{ loading(false); }
  }
  modalOpen(`
    <h2>${isNew ? '🎉 بداية فترة جديدة' : '✎ تعديل الفترة'}</h2>
    <div class="hint" style="margin:0 0 12px">${isNew
      ? 'انقفلت الفترة السابقة وانرحّل باقيها. سمّي الفترة الجديدة وحدد مداها — مو لازم تطابق الشهر التقويمي.'
      : 'الاسم والتواريخ للعرض والحساب بس — ما يمسّون أي مبلغ مسجّل.'}</div>
    <label>اسم الفترة</label>
    <input type="text" id="pdTitle" placeholder="مثلاً: مصاريف شهر ٨" value="${esc(vals.title)}">
    <div class="row" style="margin-top:10px">
      <div><label>تبدي من</label><input type="date" id="pdStart" value="${esc(vals.start)}"></div>
      <div><label>تنتهي بـ</label><input type="date" id="pdEnd" value="${esc(vals.end)}"></div>
    </div>
    <div class="hint" id="pdLen" style="margin:6px 0 0"></div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button type="button" class="btn ghost pd-quick" data-days="30" style="flex:1;margin:0;font-size:.74rem">٣٠ يوم</button>
      <button type="button" class="btn ghost pd-quick" data-days="35" style="flex:1;margin:0;font-size:.74rem">٣٥ يوم</button>
      <button type="button" class="btn ghost pd-quick" data-days="40" style="flex:1;margin:0;font-size:.74rem">٤٠ يوم</button>
    </div>
    <button class="btn" id="pdSave" style="margin-top:14px">${isNew ? 'يلا نبدي 🚀' : 'حفظ ✓'}</button>
    ${isNew ? '' : '<button class="btn ghost" onclick="modalClose()">إلغاء</button>'}
  `);
  const refreshLen = () => {
    const s = $('pdStart').value, e = $('pdEnd').value;
    if(!s || !e){ $('pdLen').textContent = 'حدد التاريخين حتى نحسب المدة'; return; }
    if(e < s){ $('pdLen').innerHTML = '<b style="color:var(--red)">⚠ النهاية قبل البداية</b>'; return; }
    $('pdLen').innerHTML = 'مدة الفترة: <b style="color:var(--primary)">' + daysBetween(s, e) + ' يوم</b>';
  };
  refreshLen();
  $('pdStart').addEventListener('change', refreshLen);
  $('pdEnd').addEventListener('change', refreshLen);
  document.querySelectorAll('.pd-quick').forEach(b => {
    b.onclick = () => {
      const s = $('pdStart').value || todayISO();
      $('pdStart').value = s;
      $('pdEnd').value = addDays(s, Number(b.dataset.days) - 1);
      refreshLen();
    };
  });
  $('pdSave').onclick = async () => {
    const title = $('pdTitle').value.trim();
    const start = $('pdStart').value, end = $('pdEnd').value;
    if(!title) return toast('اكتب اسم الفترة', true);
    if(start && end && end < start) return toast('تاريخ النهاية لازم يكون بعد البداية', true);
    loading(true);
    try{
      const res = await apiPost({ action:'setPeriod', month, title, start, end });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      modalClose();
      toast(isNew ? ('بدت «' + title + '» ✓ 🚀') : 'انحفظت الفترة ✓');
      if(month === state.month) await loadMonth(state.month);
    }catch(err){ toast('ما انحفظت: ' + err.message, true); }
    finally{ loading(false); }
  };
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
  if(!(await confirmDel('تفرّغ ميزانية شهر ' + state.month + '؟', 'تنمسح الرواتب والتصنيفات (المصاريف المسجلة والصناديق المرحّلة برصيدها تبقى محفوظة).', 'فرّغ'))) return;
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
    return `<div class="pal ${id===curPal?'sel':''}" onclick="pickPalette('${id}')" tabindex="0" role="button" aria-pressed="${id===curPal}" aria-label="ثيم ${p.name}" title="${p.name}">
      <span class="pal-sky" style="background:${p.seasons.sunset}"></span>
      <span class="pal-info"><span class="pal-name">${p.name}</span>
      <span class="pal-dots"><i style="background:${p.primary}"></i><i style="background:${p.amber}"></i><i style="background:${p.green}"></i></span></span></div>`;
  }).join('');
  const clockName = CLOCK_SKINS[clockIdx % CLOCK_SKINS.length].name;

  /* أقسام مطوية — نحفظ اللي كان مفتوح قبل إعادة الرسم */
  const wasOpen = new Set([...document.querySelectorAll('#settingsBody details[open]')].map(d => d.dataset.g));
  const openAttr = g => (wasOpen.size ? (wasOpen.has(g) ? 'open' : '') : (g === 'acc' ? 'open' : ''));

  $('settingsBody').innerHTML = `
    <details class="card set-acc" data-g="acc" ${openAttr('acc')}>
      <summary><span class="sa-ico">👤</span>الحساب والعائلة<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <div class="hint" style="margin:0">كود عائلتك — انطيه لزوجك/زوجتك يدخّله وقت التسجيل حتى تصيرون بنفس المساحة وتشوفون نفس البيانات:</div>
      <div class="famcode"><b dir="ltr" id="famCode">…</b><button id="btnCopyCode">نسخ</button></div>
      <label style="margin-top:12px">اسمك المعروض</label>
      <div style="display:flex;gap:8px">
        <input type="text" id="nmNew" value="${esc(session && session.name ? session.name : '')}" style="flex:1" placeholder="اسمك">
        <button class="btn" id="btnSaveName" style="margin:0;width:auto;padding:0 18px">حفظ</button>
      </div>
      <div class="hint" style="margin-top:4px">تغيير الاسم يمشي على كل مصاريفك القديمة تلقائياً — ما يصير «شخص جديد».</div>
      <div id="orphanBox"></div>
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
    </details>

    <details class="card set-acc" data-g="look" ${openAttr('look')}>
      <summary><span class="sa-ico">🎨</span>المظهر<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <div class="set-toggle" style="margin-top:0">
        <span class="st-lbl">🌙 الوضع الداكن (دارك مود)</span>
        <label class="switch"><input type="checkbox" id="darkToggle" ${DARK_ON?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">🕵️ شيرلوك هولمز باللوحة (يمشي ويحقق وينصح)</span>
        <label class="switch"><input type="checkbox" id="holmesToggle" ${(typeof HOLMES_ON !== 'undefined' && HOLMES_ON)?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <label>🎭 شخصية شيرلوك</label>
      <select id="holmesMood">
        <option value="funny">فكاهية وغبية — عراقي يحشش 😂</option>
        <option value="normal">اعتيادية ومرحة 🙂</option>
        <option value="serious">جدية وقلقة 🧐</option>
        <option value="mean">متنمّرة — يعايرك بفلوسك 😈</option>
      </select>
      <div class="hint" style="margin-top:4px">تحدد شلون يحچي ويّاك: نكت وسوالف، لو تحقيق مرح، لو محقق قلقان على فلوسك، لو متنمّر ما يرحم.</div>
      <label>🎨 ثيم الألوان</label>
      <div class="pal-grid">${palCards}</div>
      <div class="hint" style="margin-top:2px">كل ثيم يصبغ لون الموقع + السماء (نهار/غروب/ليل والفصول) بنفس العائلة — يتطبّق فوراً وينحفظ بجهازك.</div>
      <label style="margin-top:12px">🌤 ثيم الخلفية (الفصول)</label>
      <select id="seasonSel">
        ${Object.keys(SEASON_NAMES).map(k => `<option value="${k}">${SEASON_NAMES[k]}</option>`).join('')}
      </select>
      <div class="hint" style="margin-top:4px">«تلقائي» يغيّر السماء مع ساعة اليوم (شمس وقمر ونجوم). باقي الثيمات ثابتة بمزاج الفصل.</div>
      <label style="margin-top:12px">🌫️ تغويش الخلفية (${skyBlur}٪)</label>
      <div class="blur-row"><input type="range" id="skyBlurRange" min="0" max="100" step="1" value="${skyBlur}"><span class="blur-val" id="skyBlurVal">${skyBlur}</span></div>
      <div class="hint" style="margin-top:4px">يغوّش السماء والخلفية فقط — البطاقات تبقى واضحة.</div>
      <label style="margin-top:12px">🔤 نوع الخط</label>
      <select id="fontSel">
        ${Object.keys(FONTS).map(k => `<option value="${k}" style="font-family:${FONTS[k].stack}${FONT_FALLBACK}">${FONTS[k].name}</option>`).join('')}
      </select>
      <div class="hint" style="margin-top:4px">يتطبّق على كل التطبيق فوراً وينحفظ بجهازك. بعض الخطوط تنزل من النت أول مرة تختارها.</div>
      <label style="margin-top:12px">🔠 حجم الخط (${fontScale}٪)</label>
      <div class="blur-row"><input type="range" id="fontScaleRange" min="80" max="140" step="5" value="${fontScale}"><span class="blur-val" id="fontScaleVal">${fontScale}</span></div>
      <div class="hint" style="margin-top:4px">يكبّر أو يصغّر كل نصوص التطبيق سوا — جرّب لين يريّح عينك.</div>
      <div class="set-toggle">
        <span class="st-lbl">🕰 شكل الساعة (بالكمبيوتر) — ${clockName}</span>
        <button class="btn ghost" id="btnClockS" style="margin:0;width:auto;padding:8px 16px">غيّر الشكل</button>
      </div>
      </div>
    </details>

    <details class="card set-acc" data-g="snd" ${openAttr('snd')}>
      <summary><span class="sa-ico">🔔</span>الأصوات والموسيقى<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <div class="set-toggle" style="margin-top:0">
        <span class="st-lbl">🔔 أصوات العمليات (إضافة / صرف / حذف)</span>
        <label class="switch"><input type="checkbox" id="sndToggle" ${SND.on?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <button class="btn ghost" id="btnMusicS" style="margin-top:8px">🎵 موسيقى الخلفية</button>
      </div>
    </details>

    <details class="card set-acc" data-g="tabs" ${openAttr('tabs')}>
      <summary><span class="sa-ico">🧩</span>التبويبات واللغة والعملة<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <div class="set-toggle" style="margin-top:0">
        <span class="st-lbl">🧾 أظهر تبويب «فواتيري»</span>
        <label class="switch"><input type="checkbox" id="billsToggle" ${BILLS_ON?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">🧮 أظهر تبويب «المطابقة»</span>
        <label class="switch"><input type="checkbox" id="reconToggle" ${RECON_ON?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">📖 أظهر تبويب «دفتر الأستاذ»</span>
        <label class="switch"><input type="checkbox" id="ledgerToggle" ${(typeof LEDGER_ON!=='undefined'&&LEDGER_ON)?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <div class="set-toggle">
        <span class="st-lbl">🌐 اللغة — ${LANG.cur==='en'?'English':'العربية'}</span>
        <button class="btn ghost" id="btnLangS" style="margin:0;width:auto;padding:8px 16px">${LANG.cur==='en'?'حوّل للعربية':'Switch to English'}</button>
      </div>
      <label style="margin-top:12px">💵 العملة</label>
      <select id="curSel">
        ${Object.keys(CURRENCIES).map(k => `<option value="${k}">${CURRENCIES[k].name}</option>`).join('')}
      </select>
      <div class="hint" style="margin-top:4px">تتطبّق على كل المبالغ بالتطبيق فوراً.</div>
      </div>
    </details>

    <details class="card set-acc" data-g="rep" ${openAttr('rep')}>
      <summary><span class="sa-ico">📊</span>التقارير والنسخ الاحتياطي<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <button class="btn ghost" id="btnChartS" style="margin-top:0">📊 مقارنة الأشهر</button>
      <button class="btn ghost" id="btnPdf">🖨 طباعة / حفظ PDF — شهر ${esc(state.month)}</button>
      <button class="btn ghost" id="btnXlsMonth">📊 تصدير إكسل — شهر ${esc(state.month)}</button>
      <button class="btn ghost" id="btnXlsAll">🗂 تصدير إكسل — كل الأشهر</button>
      <button class="btn ghost" id="btnBackup">💾 نسخة احتياطية كاملة (ملف)</button>
      </div>
    </details>

    ${session && session.admin ? `
    <details class="card set-acc" data-g="mem" ${openAttr('mem')}>
      <summary><span class="sa-ico">👥</span>أعضاء العائلة<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <div class="hint" style="margin:0 0 10px">تكدر تغيّر باسورد أي عضو بعائلتك (لو نسى باسورده) أو تشيله منها. <b>ملاحظة:</b> لو إنت نسيت باسوردك، غيّره من لوحة Supabase ← Authentication ← Users.</div>
      <div id="memList"><div class="hint">…</div></div>
      <button class="btn ghost" id="btnReloadMembers">↻ تحديث القائمة</button>
      </div>
    </details>

    <details class="card set-acc" data-g="adm" ${openAttr('adm')}>
      <summary><span class="sa-ico">🛡</span>المشرف<span class="sa-chev">›</span></summary>
      <div class="sa-body">
      <button class="btn ghost" id="btnAdmin" style="margin-top:0">🛡 لوحة المشرف</button>
      <div class="set-toggle">
        <span class="st-lbl">🔎 شغّل تبويب «مدقق الأرصدة»</span>
        <label class="switch"><input type="checkbox" id="auditToggle" ${(typeof AUDIT_ON!=='undefined'&&AUDIT_ON)?'checked':''}><span class="track"></span><span class="knob"></span></label>
      </div>
      <div class="hint" style="margin-top:6px">أداة أعطال: تفكّ كل رصيد لحركاته وتگلك وين الخلل. تظهر للمشرف بس، ومطفية افتراضياً — شغّلها وكت المشكلة بس، لأنها تبويب زايد بالشريط.</div>
      </div>
    </details>` : ''}
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
  /* أعضاء العائلة (للمشرف بس) */
  if($('memList')){
    loadMembers();
    $('btnReloadMembers').onclick = () => loadMembers();
  }
  /* أسماء قديمة غير مرتبطة بأي عضو */
  if($('orphanBox')) loadOrphanNames();
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
    LS.set('mas_bills', BILLS_ON ? 'on' : 'off');
    applyBillsVisible();
    toast(BILLS_ON ? 'ظهر تبويب فواتيري ✓' : 'انخفى تبويب فواتيري');
  };
  if($('reconToggle')) $('reconToggle').onchange = (e) => {
    RECON_ON = e.target.checked;
    LS.set('mas_recon', RECON_ON ? 'on' : 'off');
    applyReconVisible();
    toast(RECON_ON ? 'ظهر تبويب المطابقة ✓' : 'انخفى تبويب المطابقة');
  };
  /* مفتاحا الدفتر والمدقق يختلفون عن الفواتير والمطابقة بشي واحد:
     دوالهم (applyLedgerVisible / applyAuditVisible) ساكنة بـbooks.js
     مو بـapp.js. يعني لو books.js ما وصل — نسخة قديمة بالكاش، أو
     الملف طاح — الدالة تصير مفقودة.

     شنو چان يصير وقتها: السطر الأول يخزّن الحالة الجديدة بالذاكرة،
     والسطر الثالث يطيح بـReferenceError، والرابع (التوست) ما يوصله
     أبداً. النتيجة اللي يشوفها المستخدم: المفتاح ينقلب، التبويب
     يبقى مكانه، وماكو ولا رسالة تگله شصار — بينما الذاكرة تگول
     «مخفي». الحالة المخزّنة والمعروضة انفكّوا عن بعض بصمت.

     الترتيب هسه معكوس: نطبّق أول، ونخزّن بعد ما ينجح التطبيق.
     ولو فشل، نرجّع المفتاح لمحله ونگول للمستخدم شنو صار. */
  const bindTabToggle = (id, label, getFn, setFlag, lsKey, onMsg, offMsg) => {
    const el = $(id);
    if(!el) return;
    el.onchange = (e) => {
      const want = e.target.checked;
      const fn = getFn();
      if(typeof fn !== 'function'){
        e.target.checked = !want;   /* رجّع المفتاح — ما انطبّق شي */
        toast('ما كدر يشتغل مفتاح «' + label + '» — حدّث الصفحة (Ctrl+Shift+R)', true);
        return;
      }
      try{
        setFlag(want);
        fn();
        LS.set(lsKey, want ? 'on' : 'off');   /* نخزّن بعد النجاح بس */
        toast(want ? onMsg : offMsg);
      }catch(err){
        /* الإرجاع نفسه ممكن يطيح (لو المتغيّر بـTDZ)، فما نخلّي
           فشل الإرجاع يبلع رسالة الفشل الأصلية */
        try{ setFlag(!want); }catch(_){}
        e.target.checked = !want;
        toast('ما كدر يشتغل مفتاح «' + label + '»: ' + err.message, true);
      }
    };
  };

  bindTabToggle('ledgerToggle', 'دفتر الأستاذ',
    () => (typeof applyLedgerVisible === 'function' ? applyLedgerVisible : null),
    v => { LEDGER_ON = v; }, 'mas_ledger',
    'ظهر تبويب دفتر الأستاذ ✓ 📖', 'انخفى تبويب دفتر الأستاذ');

  bindTabToggle('auditToggle', 'مدقق الأرصدة',
    () => (typeof applyAuditVisible === 'function' ? applyAuditVisible : null),
    v => { AUDIT_ON = v; }, 'mas_audit',
    'ظهر تبويب مدقق الأرصدة ✓ 🔎', 'انخفى تبويب المدقق');
  if($('holmesToggle')) $('holmesToggle').onchange = (e) => {
    try{ setHolmes(e.target.checked); }catch(_){}
  };
  if($('holmesMood')){
    try{ $('holmesMood').value = (typeof HOLMES_MOOD !== 'undefined') ? HOLMES_MOOD : 'funny'; }catch(_){}
    $('holmesMood').onchange = (e) => { try{ setHolmesMood(e.target.value); }catch(_){} };
  }
  if($('darkToggle')) $('darkToggle').onchange = (e) => {
    DARK_ON = e.target.checked;
    LS.set('mas_dark', DARK_ON ? 'on' : 'off');
    applyDark();
    toast(DARK_ON ? 'الوضع الداكن 🌙 — عيونك ترتاح' : 'رجعنا للوضع الفاتح ☀️');
  };
  $('btnClockS').onclick = () => {
    clockIdx = (clockIdx + 1) % CLOCK_SKINS.length;
    LS.set('mas_clock', clockIdx);
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
    LS.set('mas_snd', SND.on ? 'on' : 'off');
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
          <div class="af-btns">
            <button class="af-mem" onclick="adminMembers('${h.id}')">👥 الأعضاء</button>
            ${mine ? '' : `<button class="af-del" onclick="adminDelete('${h.id}')">حذف</button>`}
          </div>
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
/* أعضاء أي عائلة — من لوحة المشرف */
window.adminMembers = async (hhId) => {
  loading(true);
  let res;
  try{ res = await callAdminFn({ action:'list', householdId: hhId }); }
  finally{ loading(false); }
  if(!res.ok) return toast('ما كدرت أجيب الأعضاء: ' + res.error, true);
  const list = res.members || [];
  modalOpen(`
    <h2>👥 أعضاء «${esc(res.householdName || 'عائلة')}»</h2>
    <div class="hint" style="margin:0 0 12px">تكدر تغيّر باسورد أي عضو أو تشيله من عائلته. الشطب ما يحذف حسابه — بس يفكّه عن العائلة.</div>
    <div id="memList">${list.length ? '' : '<div class="empty">ماكو أعضاء بهذه العائلة</div>'}</div>
    <button class="btn ghost" onclick="modalClose();setTimeout(showAdmin,150)" style="margin-top:14px">رجوع للوحة</button>
  `);
  if(list.length) renderMemberCards(list, hhId);
};

window.adminDelete = async (id) => {
  const h = adminHH.find(x => x.id === id);
  const name = (h && h.name) || 'عائلة';
  if(!(await confirmDel('تحذف عائلة «' + name + '» نهائياً؟', 'تنمسح كل بياناتها: المصاريف والميزانيات والصناديق والمستخدمين — وما ترجع أبداً.', 'احذف نهائياً'))) return;
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

  const spentByCat = {}, fundInByCat = {}, repayByCat = {};
  state.expenses.forEach(e => {
    const k=e.category||'بلا تصنيف';
    spentByCat[k]=(spentByCat[k]||0)+e.amount;
    const d = String(e.desc||'');
    if(e.amount < 0 && /^(قرض|تمويل) من صندوق/.test(d)) fundInByCat[k]=(fundInByCat[k]||0)-e.amount;
    else if(e.amount > 0 && d.indexOf('سداد قرض لصندوق') === 0) repayByCat[k]=(repayByCat[k]||0)+e.amount;
  });
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
  /* الصرف الفعلي للعرض بالتقرير (مثل اللوحة) */
  let fundInTotal=0, repayTotal=0;
  Object.keys(fundInByCat).forEach(k => { fundInTotal += fundInByCat[k]; });
  Object.keys(repayByCat).forEach(k => { repayTotal += repayByCat[k]; });
  const realSpending = spendingSpent + fundInTotal - repayTotal;

  let catRows = '';
  cats.filter(c=>c.type!=='save').forEach(c=>{
    const fundIn = fundInByCat[c.name]||0, repay = repayByCat[c.name]||0;
    const eff = (c.amount||0)+(c.carried||0)+(fundIn-repay);
    const sp = (spentByCat[c.name]||0)+fundIn-repay;
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
    <div class="p-row"><span>إجمالي المصروف</span><b>${fmt(realSpending)}</b></div>
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
      bars += `<g style="cursor:pointer" onclick="gotoMonth('${m.month}')" tabindex="0" role="button" aria-label="روح لشهر ${m.month}">
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
function gotoTab(id){
  document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  const nb = document.querySelector('nav button[data-tab="'+id+'"]');
  if(nb) nb.classList.add('active');
  const t = $(id); if(t) t.classList.add('active');
  /* التبويبات الثلاثة هذي بس اللي render() يبنيها. لو انبنت آخر مرة
     على نسخة بيانات أقدم من الحالية نبنيها هسه، وإلا ما نلمسها.
     لازم بعد ما ينضاف .active لأن render() يقرا التبويب النشط.
     (الباقي — الإعدادات/الفواتير/المطابقة/الدفتر/التدقيق — إلها
      دوالها الخاصة بالأسطر الجاية، فما تمر من هنا) */
  if(LAZY_TABS.has(id) && tabIsStale(id)) try{ render(); }catch(_){}
  if(id === 'tab-settings') renderSettings();
  if(id === 'tab-bills') loadBills();
  if(id === 'tab-recon') loadRecons();
  /* الدفاتر (books.js) — تنرسم عند الفتح بس، لأنها تقرا نفس بيانات
     الفترة المحمّلة وما تحتاج أي استدعاء إضافي */
  if(id === 'tab-ledger'){ try{ renderLedger(); }catch(_){} }
  if(id === 'tab-audit'){ try{ renderAudit(); }catch(_){} }
  /* رجعة فورية لفوق — مو smooth. المحتوى كله تغيّر، فتمرير ناعم
     يتصارع ويّا حركة دخول التبويب وتحسّه تأخير. */
  window.scrollTo(0, 0);
}
document.querySelectorAll('nav button').forEach(btn => {
  btn.onclick = () => gotoTab(btn.dataset.tab);
});

/* ---------- سلايدر تبويب المصروف (مصاريف / صناديق) ---------- */
window.setSeg = (id) => {
  document.querySelectorAll('#opSeg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.seg === id));
  const se = $('seg-exp'), sf = $('seg-funds');
  if(se) se.style.display = (id === 'seg-exp') ? '' : 'none';
  if(sf) sf.style.display = (id === 'seg-funds') ? '' : 'none';
};
document.querySelectorAll('#opSeg .seg-btn').forEach(b => { b.onclick = () => setSeg(b.dataset.seg); });
window.gotoFunds = () => { gotoTab('tab-add'); setSeg('seg-funds'); };

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
$('periodBar').onclick = () => openPeriodSetup(state.month, false);

/* فلتر المصاريف */
$('fltText').addEventListener('input', renderExpenseList);
/* اختيار تصنيف من القائمة = نفس فلتر الظروف — والمختار ينفتح وياه */
$('fltCat').addEventListener('change', () => {
  state._envOpen = $('fltCat').value || null;
  state._envQuiet = true;
  render();   // يحدّث القائمة + الظروف + تظليل الرسم
});
$('fltBy').addEventListener('change', renderExpenseList);
if($('fmFund')) $('fmFund').addEventListener('change', renderFundMoves);
if($('fmKind')) $('fmKind').addEventListener('change', renderFundMoves);

/* ---------- الأزرار السريعة ---------- */
let quickItems = [], quickEditing = false;
/* ============================================================
   فواتيري — فواتير الشهر ومتابعة الدفع
   ============================================================ */
let billsItems = [];
let BILLS_ON = LS.get('mas_bills') !== 'off';   // ظاهر افتراضياً
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
    /* الفواتير متكررة شهرياً: شهر جديد بلا فواتير → ننسخ فواتير الشهر
       الماضي تلقائياً (غير مدفوعة) — ما تحتاج تضيفها كل شهر من جديد */
    if(!billsItems.length && state.month >= thisMonth() && !state.locked){
      const { data: copied } = await sb.rpc('copy_bills', { p_from: prevMonthStr(state.month), p_to: state.month });
      if(copied){
        const r2 = await sb.rpc('list_bills', { p_month: state.month });
        billsItems = (r2 && r2.data) || [];
        if(billsItems.length) toast('انتسخت فواتيرك الشهرية تلقائياً ✓ 🧾');
      }
    }
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
      /* الاستحقاق = يوم X من الشهر المعروض (متكرر كل شهر) — مو من شهر الإضافة.
         نقصّه على آخر يوم بالشهر: يوم ٣١ بشباط چان ينطي '2026-02-31' وهذا
         تاريخ غير صالح → NaN → الفاتورة أبداً ما تنعلّم «متأخرة» ولا «تستحق اليوم» */
      const dueISO = billDueISO(state.month, b.dueDay);
      const left = Math.floor((new Date(dueISO) - new Date(todayISO())) / 86400000);
      if(!b.paid && left < 0){ cls += ' overdue'; meta = 'فات موعدها (يوم ' + b.dueDay + ' من كل شهر)'; }
      else if(!b.paid && left <= 3){ cls += ' due-soon'; meta = left === 0 ? 'تستحق اليوم!' : 'باقي ' + left + ' يوم (يوم ' + b.dueDay + ')'; }
      else meta = 'يوم ' + b.dueDay + ' من كل شهر';
    }
    return `
      <div class="bill ${cls}">
        <button class="bl-chk" onclick="toggleBill('${b.id}', ${!b.paid})">${b.paid ? '✓' : ''}</button>
        <div class="bl-main" onclick="editBill('${b.id}')" style="cursor:pointer" tabindex="0" role="button" aria-label="تعديل فاتورة ${esc(b.name)}" title="اضغط للتعديل">
          <div class="bl-name">${esc(b.name)} <span style="font-size:.62rem;color:var(--muted)">✎</span></div>
          ${meta ? `<div class="bl-meta">${esc(meta)}</div>` : ''}
        </div>
        <div class="bl-amt">${fmt(b.amount)}</div>
        <button class="bl-del" onclick="deleteBill('${b.id}')" aria-label="حذف">✕</button>
      </div>`;
  }).join('');
}

/* ---------- تعديل فاتورة (بدون حذف وإعادة إضافة) ---------- */
window.editBill = (id) => {
  const b = billsItems.find(x => x.id === id);
  if(!b) return;
  modalOpen(`
    <h2>تعديل فاتورة «${esc(b.name)}» ✎</h2>
    <label>اسم الفاتورة</label>
    <input type="text" id="ebName" value="${esc(b.name)}">
    <div class="row" style="margin-top:10px">
      <div><label>المبلغ</label><input type="tel" id="ebAmount" inputmode="numeric" value="${(Number(b.amount)||0) ? Number(b.amount).toLocaleString('en-US') : ''}"></div>
      <div><label>يوم الاستحقاق (من كل شهر)</label><input type="number" id="ebDay" min="1" max="31" value="${b.dueDay || ''}" placeholder="مثلاً: 5"></div>
    </div>
    <button class="btn" id="ebSave">حفظ التعديل</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  liveFormat($('ebAmount'));
  $('ebSave').onclick = async () => {
    const name = $('ebName').value.trim();
    if(!name) return toast('دخّل اسم الفاتورة', true);
    const amount = num($('ebAmount').value);
    const day = parseInt($('ebDay').value, 10) || null;
    loading(true);
    try{
      const { error } = await sb.rpc('edit_bill', { p_id: id, p_name: name, p_amount: amount, p_due_day: day });
      if(error){
        if(/could not find|function/i.test(error.message)) throw new Error('ارفع ملف sql/edit-bill.sql على Supabase أول');
        throw new Error(error.message);
      }
      b.name = name; b.amount = amount; b.dueDay = day;
      modalClose();
      renderBills();
      renderDashView();
      toast('انعدّلت الفاتورة ✓ ✎');
    }catch(err){ toast('ما انعدّلت: ' + err.message, true); }
    finally{ loading(false); }
  };
};
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
  if(!(await confirmDel('تحذف فاتورة «' + name + '»؟', 'تنحذف من قائمة هذا الشهر.'))) return;
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
let RECON_ON = LS.get('mas_recon') !== 'off';   // ظاهر افتراضياً
let DARK_ON = LS.get('mas_dark') === 'on';      // فاتح افتراضياً
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
  if(!(await confirmDel('تحذف هذه المطابقة من السجل؟', 'الجردة تنشال من السجل نهائياً.'))) return;
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
    <div class="qbtn ${quickEditing?'editing':''}" onclick="useQuick('${q.id}')" tabindex="0" role="button" aria-label="زر سريع: ${esc(q.label)}">
      <button class="qb-del" onclick="event.stopPropagation();removeQuick('${q.id}')" aria-label="حذف">✕</button>
      <span class="qb-label">${esc(q.label)}</span>
      <span class="qb-sub">${q.amount>0 ? fmt(q.amount) : 'بلا مبلغ'}${q.category ? ' · ' + esc(q.category) : ''}</span>
    </div>`).join('') +
    `<div class="qbtn" style="justify-content:center;align-items:center;color:var(--muted)" onclick="toggleQuickEdit()" tabindex="0" role="button">${quickEditing ? '✓ تم' : '✎ تعديل'}</div>` +
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
      const res = await apiPost({ action:'addExpense', month: state.month, date, amount: q.amount, desc: q.label, category: q.category });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      toast('انسجّل «' + q.label + '» ✓ ⚡');
      sndSad();
      await loadMonth(state.month);
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
  if(!q) return;
  if(!(await confirmDel('تحذف زر «' + q.label + '»؟', 'الزر السريع ينشال عندك وعند العائلة.'))) return;
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
  /* 🔑 المصروف يروح للفترة المعروضة (المفتوحة) — مو لشهر تاريخه.
     هيچي تكدر تسجّل مصروف تاريخه ٢٥ تموز ضمن فترة «شهر ٨» اللي
     بدت يوم ٢٠ تموز، بدون ما يوصل للفترة المقفلة. */
  const month = state.month;
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
    try{ holmesReact('expense'); }catch(_){}
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
window.removeOffline = async (qid) => {
  if(!(await confirmDel('تحذف هذا المصروف المعلّق؟', 'بعده ما انرفع للسيرفر — ينحذف من جهازك بس.'))) return;
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
  if(!(await confirmDel('تحذف هذا المصروف' + (e ? ' («' + (e.desc||'بلا تفاصيل') + '» — ' + fmt(Math.abs(e.amount)) + ')' : '') + '؟', 'ينحذف نهائياً وما يرجع.'))) return;
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
  /* شرط الإقفال: «الباقي للصرف» لازم يكون صفر بالضبط —
     الفائض ينودّع بصندوق (إيداع +)، والعجز ينغطّى بسحب من صندوق */
  const remain = state._remainRaw || 0;
  if(remain > 0) return toast('باقي عندك ' + fmt(remain) + ' للصرف — ادّخره بصندوق (زر «إيداع +») حتى يصير صفر، بعدين اقفل 🏦', true);
  if(remain < 0) return toast('صرفك زايد بـ' + fmt(-remain) + ' — اسحب من صندوق لتصنيف حتى يتصفّر الباقي، بعدين اقفل', true);
  modalOpen(`
    <h2>إقفال «${esc(periodLabel(state.budget, state.month))}»</h2>
    <div class="hint" style="margin:0 0 12px">راح تنقفل الفترة للعرض فقط (تكدر تفتحها بعدين)، ويترحّل باقي كل تصنيف وصندوق للفترة الجاية، وبعدها نسألك عن اسم الفترة الجديدة ومداها.</div>
    <button class="btn" id="doClose">إقفال الفترة ✓</button>
    <button class="btn ghost" onclick="modalClose()">إلغاء</button>
  `);
  $('doClose').onclick = async () => {
    const closed = state.month;
    const closedName = periodLabel(state.budget, closed);
    modalClose();
    loading(true);
    let ok = false;
    try{
      const res = await apiPost({ action:'closeMonth', month: closed });
      if(guardAuth(res)) return;
      if(!res.ok) throw new Error(res.error || 'خطأ');
      toast('انقفلت «' + closedName + '» ✓ 🎉');
      confetti();
      // ننتقل مباشرة للفترة الجاية — راتب الفترة الجديدة وصل 💵
      await loadMonth(nextMonthStr(closed));
      ok = true;
    }catch(err){ toast('ما انقفلت: ' + err.message, true); }
    finally{ loading(false); }
    /* شاشة «بداية فترة جديدة» — اسم مقترح + بداية ونهاية */
    if(ok) openPeriodSetup(state.month, true);
  };
};

