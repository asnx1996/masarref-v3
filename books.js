/* ============================================================
   books.js — الدفاتر: «دفتر الأستاذ» و«مدقق الأرصدة»
   ------------------------------------------------------------
   الملفان اللي فوق (app.js) يحسبون الأرقام النهائية ويعرضونها.
   هنا نسوّي الشغلة المعاكسة: نفكّ كل رقم لحركاته الأصلية، ونتأكد
   إن مجموع الحركات يطلع نفس الرقم المعروض. لذلك الملفان بنفس
   المكان — دفتر الأستاذ هو «شنو صار»، والمدقق هو «هل يطلع صح».

   ما يحتاج أي ترحيل SQL: كل شي ينبني من نفس البيانات اللي
   يجيبها load_month (للفترة الحالية) وexport_all (لكل الفترات).
   ============================================================ */

/* ============================================================
   الأساس المشترك — قراءة الفترة كحسابات وحركات
   ------------------------------------------------------------
   «الحساب» عندنا ثلاثة أنواع، وكل نوع إله معنى مختلف للدائن والمدين:

     remain  الباقي للصرف — فلوس فعلية بإيدك.
             دائن = دخل داخل، مدين = فلوس طالعة.
     cat     تصنيف مصروف — سقف خطة، مو فلوس.
             دائن = مخصص/مرحّل/تمويل، مدين = صرف عليه.
     fund    صندوق ادخار — فلوس محجوزة.
             دائن = ادخار/إيداع/إرجاع، مدين = سحب/قرض.

   وهذا الفرق بالضبط هو أصل الالتباس اللي يلگاه المدقق: تصنيف
   عنده «باقي ١٥٠» ما يعني إن بإيدك ١٥٠ — يعني خطتك تسمحلك تصرف
   ١٥٠ على هذا الباب. لو فلوسك الفعلية خلصت، الصرف يخلي «الباقي
   للصرف» سالب حتى لو التصنيف بعده أخضر.
   ============================================================ */

/* أسماء الصناديق بالفترة الحالية */
function bkSaveNames(){
  return new Set(((state.budget && state.budget.categories) || [])
    .filter(c => c.type === 'save').map(c => c.name));
}

/* كل الحسابات القابلة للفتح بدفتر الأستاذ — بترتيب معنوي:
   الفلوس الفعلية أولاً، بعدين أبواب الصرف، بعدين الصناديق */
function bkAccounts(){
  const cats = (state.budget && state.budget.categories) || [];
  const list = [{ key:'remain', kind:'remain', name:'الباقي للصرف', icon:'💵' }];
  cats.filter(c => c.type !== 'save').forEach(c =>
    list.push({ key:'cat:' + c.name, kind:'cat', name:c.name, icon:'🗂️', cat:c }));
  cats.filter(c => c.type === 'save').forEach(c =>
    list.push({ key:'fund:' + c.name, kind:'fund', name:c.name, icon:'🏦', cat:c }));
  /* تصنيفات انصرف عليها بلا ما تكون بالميزانية — لازم تنشاف بالدفتر،
     لأنها بالضبط نوع الشي اللي يضيع بالحسابات ويطلع فرق آخر الشهر */
  const known = new Set(cats.map(c => c.name));
  const saveNames = bkSaveNames();
  const seen = new Set();
  (state.expenses || []).forEach(e => {
    const k = e.category || '';
    if(!k || known.has(k) || saveNames.has(k) || seen.has(k)) return;
    seen.add(k);
    list.push({ key:'cat:' + k, kind:'cat', name:k, icon:'⚠️', cat:null, orphan:true });
  });
  return list;
}

function bkFindAccount(key){
  return bkAccounts().find(a => a.key === key) || null;
}

/* تاريخ افتتاح الفترة — للأسطر الافتتاحية (المرحّل/المخصص/الرواتب) */
function bkOpenDate(){
  const p = state.budget || {};
  return (p.startDate) ? p.startDate : (state.month + '-01');
}

/* ------------------------------------------------------------
   bkLedger(acc) — يبني الدفتر لحساب واحد
   يرجّع: { rows, opening, credit, debit, closing }
     rows: [{ date, label, sub, cr, dr, tag, id, open }]
       cr = دائن (يزيد الرصيد)، dr = مدين (ينقصه) — وحدة منهن بس
   ------------------------------------------------------------ */
function bkLedger(acc){
  const saveNames = bkSaveNames();
  const od = bkOpenDate();
  const rows = [];
  /* flag: 'open' = رصيد افتتاحي (مو حركة — ما يدخل بالمجاميع)
           'head' = حركة أول الفترة (راتب/مخصص/حجز ادخار) — تدخل
                    بالمجاميع، بس تنعرض بسطر مظلّل لأنها مو عملية
                    صارت بيوم معيّن.
     الفرق مهم: راتب الشهر دائن حقيقي بهذه الفترة، مو رصيد جاي من
     الفترة الماضية. لو حسبناه افتتاحياً، يطلع «مجموع الدائن = ٠»
     بدفتر كل شهر — وهذا يفرّغ العمود من معناه. */
  const add = (date, label, sub, cr, dr, tag, id, flag) => {
    if(!cr && !dr) return;
    rows.push({ date, label, sub: sub || '', cr: cr || 0, dr: dr || 0, tag: tag || '', id: id || '',
                open: flag === 'open', head: flag === 'head' });
  };

  if(acc.kind === 'remain'){
    const b = state.budget || {};
    const cats = b.categories || [];
    /* المرحّل من التصنيفات — فلوس فعلية فاضلة من الفترة الماضية */
    let spendCarried = 0, saveContrib = 0;
    cats.forEach(c => {
      if(c.type === 'save') saveContrib += (Number(c.amount) || 0);
      else spendCarried += (Number(c.carried) || 0);
    });
    if(spendCarried) add(od, 'مرحّل من الفترة الماضية', 'باقي التصنيفات المرحّل', spendCarried > 0 ? spendCarried : 0, spendCarried < 0 ? -spendCarried : 0, 'مرحّل', '', 'open');

    const sList = (b.salaries && b.salaries.length)
      ? b.salaries
      : [{ person:'راتب ١', amount:b.salary1 || 0 }, { person:'راتب ٢', amount:b.salary2 || 0 }];
    sList.forEach(s => add(od, s.person || 'راتب', 'راتب الفترة', Number(s.amount) || 0, 0, 'دخل', '', 'head'));
    (b.incomes || []).forEach(x => add(od, x.desc || 'دخل إضافي', 'إيراد إضافي', Number(x.amount) || 0, 0, 'دخل', '', 'head'));
    if(saveContrib) add(od, 'محجوز للادخار', 'ينحجز لصناديق الادخار أول الفترة', 0, saveContrib, 'ادخار', '', 'head');

    (state.expenses || []).forEach(e => {
      const kd = kindOf(e, saveNames);
      const a = Number(e.amount) || 0;
      if(kd === 'fund_dep'){
        /* إيداع بصندوق من الفائض — فلوس طلعت من إيدك للصندوق */
        add(e.date, e.desc || 'إيداع بصندوق', (e.category || '') + (e.by ? ' · ' + e.by : ''), 0, -a, 'إيداع', e.id);
        return;
      }
      if(isFundKind(kd) || !hitsRemain(kd)) return;
      add(e.date, e.desc || 'مصروف', (e.category || 'بلا تصنيف') + (e.by ? ' · ' + e.by : ''), a < 0 ? -a : 0, a > 0 ? a : 0, (KIND_UI[kd] ? KIND_UI[kd].tag.replace(' · ','') : 'صرف'), e.id);
    });

  }else if(acc.kind === 'cat'){
    const c = acc.cat;
    if(c){
      const carried = Number(c.carried) || 0;
      if(carried) add(od, 'مرحّل من الفترة الماضية', carried < 0 ? 'تجاوز مرحّل' : 'باقي مرحّل', carried > 0 ? carried : 0, carried < 0 ? -carried : 0, 'مرحّل', '', 'open');
      const alloc = Number(c.amount) || 0;
      if(alloc) add(od, 'المخصص لهذه الفترة', 'من توزيع الميزانية', alloc, 0, 'مخصص', '', 'head');
    }
    (state.expenses || []).forEach(e => {
      if(e.category !== acc.name) return;
      const kd = kindOf(e, saveNames);
      if(!hitsCat(kd)) return;               /* تسديد القرض ما يمسّ التصنيف */
      const a = Number(e.amount) || 0;
      add(e.date, e.desc || 'مصروف', (e.by ? e.by : ''), a < 0 ? -a : 0, a > 0 ? a : 0, (KIND_UI[kd] ? KIND_UI[kd].tag.replace(' · ','') : 'صرف'), e.id);
    });

  }else{ /* fund */
    const c = acc.cat;
    if(c){
      const carried = Number(c.carried) || 0;
      if(carried) add(od, 'رصيد مرحّل', 'من الفترة الماضية', carried > 0 ? carried : 0, carried < 0 ? -carried : 0, 'مرحّل', '', 'open');
      const contrib = Number(c.amount) || 0;
      if(contrib) add(od, 'ادخار هذه الفترة', 'المبلغ المحجوز شهرياً', contrib, 0, 'ادخار', '', 'head');
    }
    (state.expenses || []).forEach(e => {
      if(e.category !== acc.name) return;
      const kd = kindOf(e, saveNames);
      if(!isFundKind(kd)) return;
      const a = Number(e.amount) || 0;
      add(e.date, e.desc || 'حركة', (e.by ? e.by : ''), a < 0 ? -a : 0, a > 0 ? a : 0, (KIND_UI[kd] ? KIND_UI[kd].tag.replace(' · ','') : ''), e.id);
    });
  }

  /* الترتيب: الأسطر الافتتاحية أولاً مهما چان تاريخها، بعدين حسب
     تاريخ العملية. الترتيب مستقر — حركتين بنفس اليوم يبقن بترتيب
     إدخالهن، مو ينقلبن بكل إعادة رسم. */
  rows.forEach((r, i) => { r._i = i; });
  const rank = r => r.open ? 0 : (r.head ? 1 : 2);
  rows.sort((a, b) => (rank(a) !== rank(b)) ? rank(a) - rank(b)
                    : (a.date < b.date ? -1 : a.date > b.date ? 1 : a._i - b._i));

  let bal = 0, credit = 0, debit = 0, opening = 0;
  rows.forEach(r => {
    bal += r.cr - r.dr;
    r.bal = bal;
    if(r.open) opening = bal; else { credit += r.cr; debit += r.dr; }
  });
  return { rows, opening, credit, debit, closing: bal };
}

/* ============================================================
   دفتر الأستاذ — الواجهة
   ============================================================ */
let LEDGER_ON = LS.get('mas_ledger') !== 'off';   /* ظاهر افتراضياً */
let ledgerKey = LS.get('mas_ledger_acc') || 'remain';

function applyLedgerVisible(){
  const nb = $('navLedger');
  if(nb) nb.style.display = LEDGER_ON ? '' : 'none';
  if(!LEDGER_ON) bkLeaveTab('tab-ledger');
}
/* لو التبويب المطفي هو المفتوح، رجّع المستخدم للوحة — بلا ما نتركه
   بصفحة مختفية من الشريط */
function bkLeaveTab(id){
  const t = $(id);
  if(!t || !t.classList.contains('active')) return;
  document.querySelectorAll('nav button').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  const db = document.querySelector('nav button[data-tab="tab-dash"]');
  if(db) db.classList.add('active');
  const dt = $('tab-dash');
  if(dt) dt.classList.add('active');
}

function renderLedger(){
  const sel = $('ledAcc'), box = $('ledBody');
  if(!sel || !box) return;
  const accounts = bkAccounts();
  if(!accounts.some(a => a.key === ledgerKey)) ledgerKey = 'remain';
  sel.innerHTML = accounts.map(a =>
    `<option value="${esc(a.key)}"${a.key === ledgerKey ? ' selected' : ''}>${a.icon} ${esc(a.name)}${a.orphan ? ' (بلا مخصص)' : ''}</option>`).join('');

  const acc = bkFindAccount(ledgerKey);
  if(!acc){ box.innerHTML = '<div class="empty">اختر حساباً</div>'; return; }
  const L = bkLedger(acc);

  const balCls = L.closing < 0 ? 'neg' : '';
  const meaning = acc.kind === 'remain' ? 'فلوس فعلية بإيدك'
                : acc.kind === 'fund'   ? 'رصيد الصندوق'
                : 'المتاح من خطة هذا الباب';

  let body = '';
  if(!L.rows.length){
    body = '<div class="empty"><span class="emo">📖</span><b>ماكو أي حركة على هذا الحساب بهذه الفترة.</b>الدفتر يعرض المرحّل والمخصص والحركات — وهذا الحساب فارغ.</div>';
  }else{
    let trs = '';
    L.rows.forEach(r => {
      trs += `<tr class="${r.open ? 'led-open' : (r.head ? 'led-head' : '')}">
        <td class="led-d">${esc(r.open ? 'افتتاح' : (r.head ? 'أول الفترة' : r.date))}</td>
        <td class="led-t"><b>${esc(r.label)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ''}${r.tag ? `<span class="led-tag">${esc(r.tag)}</span>` : ''}</td>
        <td class="led-n cr">${r.cr ? fmt(r.cr) : ''}</td>
        <td class="led-n dr">${r.dr ? fmt(r.dr) : ''}</td>
        <td class="led-n bl ${r.bal < 0 ? 'neg' : ''}">${sfmt(r.bal)}</td>
      </tr>`;
    });
    body = `
      <div class="led-scroll">
        <table class="led-tbl">
          <thead><tr>
            <th class="led-d">التاريخ</th><th class="led-t">البيان</th>
            <th class="led-n">دائن +</th><th class="led-n">مدين −</th><th class="led-n">الرصيد</th>
          </tr></thead>
          <tbody>${trs}</tbody>
          <tfoot><tr>
            <td class="led-d"></td><td class="led-t"><b>المجاميع</b></td>
            <td class="led-n cr">${fmt(L.credit)}</td>
            <td class="led-n dr">${fmt(L.debit)}</td>
            <td class="led-n bl ${balCls}">${sfmt(L.closing)}</td>
          </tr></tfoot>
        </table>
      </div>`;
  }

  box.innerHTML = `
    <div class="led-stats">
      <div class="lstat"><div class="ll">رصيد افتتاحي</div><div class="lv ${L.opening < 0 ? 'neg' : ''}">${sfmt(L.opening)}</div></div>
      <div class="lstat cr"><div class="ll">مجموع الدائن +</div><div class="lv">${fmt(L.credit)}</div></div>
      <div class="lstat dr"><div class="ll">مجموع المدين −</div><div class="lv">${fmt(L.debit)}</div></div>
      <div class="lstat main"><div class="ll">الرصيد الختامي</div><div class="lv ${balCls}">${sfmt(L.closing)}</div></div>
    </div>
    <div class="hint" style="margin:10px 2px 14px">${esc(acc.icon + ' ' + acc.name)} — الرصيد الختامي هنا يعني: <b>${esc(meaning)}</b>. الحركات مرتبة بتاريخ العملية، وسطر «افتتاح» هو الرصيد الجاي من الفترة الماضية، وأسطر «أول الفترة» هي الرواتب والمخصصات (حركات حقيقية بس بلا يوم معيّن).</div>
    ${body}`;
}

window.setLedgerAcc = (k) => {
  ledgerKey = k;
  LS.set('mas_ledger_acc', k);
  renderLedger();
};
/* فتح الدفتر على حساب معيّن — من أي مكان بالتطبيق */
window.openLedger = (key) => {
  if(key) { ledgerKey = key; LS.set('mas_ledger_acc', key); }
  gotoTab('tab-ledger');
};

async function exportLedger(){
  const acc = bkFindAccount(ledgerKey);
  if(!acc) return;
  const L = bkLedger(acc);
  if(!L.rows.length) return toast('ماكو حركات تنصدّر', true);
  loading(true);
  try{
    await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', 'sha384-vtjasyidUo0kW94K5MXDXntzOJpQgBKXmE7e2Ga4LG0skTTLeBi97eFAXsqewJjw');
    const wb = XLSX.utils.book_new();
    wb.Workbook = { Views: [{ RTL: true }] };
    const aoa = L.rows.map(r => ({
      'التاريخ': r.open ? 'افتتاح' : (r.head ? 'أول الفترة' : r.date),
      'البيان': r.label,
      'التفاصيل': r.sub,
      'النوع': r.tag,
      'دائن': r.cr || '',
      'مدين': r.dr || '',
      'الرصيد': r.bal
    }));
    aoa.push({ 'التاريخ':'', 'البيان':'المجاميع', 'التفاصيل':'', 'النوع':'', 'دائن':L.credit, 'مدين':L.debit, 'الرصيد':L.closing });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(aoa), 'دفتر الأستاذ');
    XLSX.writeFile(wb, 'دفتر-' + acc.name + '-' + state.month + '.xlsx');
    toast('انصدّر الدفتر ✓ 📖');
  }catch(err){ toast('ما انصدّر: ' + err.message, true); }
  finally{ loading(false); }
}

/* ============================================================
   مدقق الأرصدة — للمشرف بس
   ------------------------------------------------------------
   ما يكتفي بعرض الأرقام: يعيد حسابها من الحركات الخام بطريق ثاني،
   ويقارن. أي فرق = مكان المشكلة، وينطلع بسطر يگول شنو وشكد ووين.
   ============================================================ */
let AUDIT_ON = LS.get('mas_audit') === 'on';   /* مطفي افتراضياً — أداة أعطال */
let auditScope = 'month';
let auditAll = null;    /* آخر نسخة سحابية انجابت (export_all) */

function applyAuditVisible(){
  const nb = $('navAudit');
  const on = AUDIT_ON && !!(session && session.admin);
  if(nb) nb.style.display = on ? '' : 'none';
  if(!on) bkLeaveTab('tab-audit');
}

/* درجات الخطورة — الترتيب هو ترتيب العرض */
const AUD_SEV = { err:0, warn:1, info:2 };

function bkAuditMonth(){
  const finds = [];
  const b = state.budget || {};
  const cats = b.categories || [];
  const saveNames = bkSaveNames();
  const accounts = bkAccounts();

  /* ---------- ١) جدول الحسابات: كل حساب من دفتره ---------- */
  const table = accounts.map(a => {
    const L = bkLedger(a);
    return { acc:a, L };
  });

  /* ---------- ٢) التحقق المستقل من «الباقي للصرف» ----------
     نجمع دفتر «الباقي» ونقارنه بالرقم اللي يعرضه الهيدر. لو اختلفوا
     يعني أكو حركة نوعها مو منقرا صح (وهذا خطأ برمجي مو خطأ مستخدم). */
  const remainLed = table.find(t => t.acc.kind === 'remain').L;
  const shownRemain = Number(state._remainRaw || 0);
  if(Math.abs(remainLed.closing - shownRemain) >= 1){
    finds.push({
      sev:'err', code:'remain_mismatch', title:'«الباقي للصرف» ما يطابق دفتره',
      body:'جمعنا كل حركة تمسّ فلوسك الفعلية وطلع ' + sfmt(remainLed.closing) + '، بينما الهيدر يعرض ' + sfmt(shownRemain) + ' — الفرق ' + fmt(Math.abs(remainLed.closing - shownRemain)) + '.',
      fix:'هذا فرق داخلي بالحساب مو بإدخالك. افتح «دفتر الأستاذ ← الباقي للصرف» وشوف آخر سطر قبل ما ينحرف الرصيد.'
    });
  }

  /* ---------- ٣) الخطة مقابل الفلوس — أصل الالتباس ----------
     تصنيف عنده «باقي» ما يعني إن الفلوس موجودة. لو مجموع الباقي
     بكل التصنيفات أكبر من الباقي للصرف، فأي صرف على تصنيف بعده
     أخضر راح ينزّل الباقي للصرف تحت الصفر. */
  let promised = 0;
  const rich = [];
  table.filter(t => t.acc.kind === 'cat').forEach(t => {
    if(t.L.closing > 0){ promised += t.L.closing; rich.push({ name:t.acc.name, left:t.L.closing }); }
  });
  const gap = promised - shownRemain;
  if(promised > 0 && gap >= 1){
    rich.sort((a, b) => b.left - a.left);
    finds.push({
      sev:'warn', code:'over_commit', title:'خطتك تعد بأكثر من فلوسك الفعلية',
      body:'مجموع «الباقي» بكل تصنيفاتك ' + fmt(promised) + '، بس الفلوس الفعلية الباقية ' + sfmt(shownRemain) + ' — يعني ' + fmt(gap) + ' موعودة وما موجودة. أكبر التصنيفات وعداً: ' + rich.slice(0, 3).map(x => '«' + x.name + '» ' + fmt(x.left)).join(' · ') + '.',
      fix:'هذا هو سبب إن تصنيف يگلك «باقي ١٥٠» وبنفس الوقت «الباقي للصرف = ٠»: التصنيف يقيس الخطة، والباقي للصرف يقيس الفلوس. لو صرفت الـ١٥٠ راح يصير الباقي سالب. الحل: نزّل مخصصات التصنيفات بمقدار ' + fmt(gap) + '، أو ضيف الدخل الناقص من «الميزانية ← إيرادات إضافية» إذا أكو فلوس داخلة ما سجلتها.'
    });
  }else if(promised > 0 && gap <= -1){
    finds.push({
      sev:'info', code:'under_commit', title:'عندك فلوس غير موزّعة',
      body:'الفلوس الفعلية الباقية ' + sfmt(shownRemain) + ' وأكبر من مجموع باقي التصنيفات ' + fmt(promised) + ' بـ' + fmt(-gap) + '.',
      fix:'هذا مو خطأ — بس معناها أكو ' + fmt(-gap) + ' بلا باب. وزّعها على تصنيف أو ودّعها بصندوق ادخار.'
    });
  }

  /* ---------- ٤) الباقي للصرف سالب ---------- */
  if(shownRemain < 0){
    finds.push({
      sev:'err', code:'neg_remain', title:'«الباقي للصرف» سالب',
      body:'صرفك تجاوز دخلك بـ' + fmt(-shownRemain) + ' بهذه الفترة.',
      fix:'إما أكو دخل داخل ما سجلته (ضيفه بـ«إيرادات إضافية»)، أو أكو مصروف مسجّل مرتين — دقق قائمة التكرار تحت.'
    });
  }

  /* ---------- ٥) التصنيفات المتجاوزة ---------- */
  table.filter(t => t.acc.kind === 'cat' && !t.acc.orphan && t.L.closing < 0).forEach(t => {
    finds.push({
      sev:'warn', code:'cat_over', title:'تصنيف «' + t.acc.name + '» متجاوز',
      body:'المتاح ' + fmt(t.L.opening + t.L.credit) + ' والمصروف ' + fmt(t.L.debit) + ' — تجاوز بـ' + fmt(-t.L.closing) + '.',
      fix:'زيّد مخصصه من «الميزانية»، أو انقل له من تصنيف عنده فائض.',
      acc: t.acc.key
    });
  });

  /* ---------- ٦) صناديق برصيد سالب ---------- */
  table.filter(t => t.acc.kind === 'fund' && t.L.closing < 0).forEach(t => {
    finds.push({
      sev:'err', code:'neg_fund', title:'صندوق «' + t.acc.name + '» رصيده سالب',
      body:'السحب من الصندوق ' + fmt(t.L.debit) + ' وهو أكبر من المتاح فيه ' + fmt(t.L.opening + t.L.credit) + '.',
      fix:'إما سحب انسجّل مرتين، أو رصيد مرحّل ناقص. افتح دفتر الصندوق وشوف من وين الرصيد نزل تحت الصفر.',
      acc: t.acc.key
    });
  });

  /* ---------- ٧) صرف على تصنيفات مو بالميزانية ---------- */
  table.filter(t => t.acc.orphan).forEach(t => {
    finds.push({
      sev:'warn', code:'orphan_cat', title:'صرف على تصنيف مو بالميزانية: «' + t.acc.name + '»',
      body:'انصرف عليه ' + fmt(t.L.debit) + ' بلا أي مخصص — فما يظهر بأي ظرف، بس ينخصم من الباقي للصرف.',
      fix:'ضيف التصنيف بتبويب «الميزانية» وحدد مخصصه، أو عدّل هذي المصاريف وحطها بتصنيف موجود.',
      acc: t.acc.key
    });
  });

  /* ---------- ٨) حركات صناديق على صندوق مو موجود ---------- */
  const fundNames = new Set(cats.filter(c => c.type === 'save').map(c => c.name));
  const ghostFunds = new Map();
  (state.expenses || []).forEach(e => {
    const kd = kindOf(e, saveNames);
    if(!isFundKind(kd)) return;
    if(fundNames.has(e.category)) return;
    ghostFunds.set(e.category, (ghostFunds.get(e.category) || 0) + Math.abs(Number(e.amount) || 0));
  });
  ghostFunds.forEach((amt, name) => {
    finds.push({
      sev:'err', code:'ghost_fund', title:'حركات على صندوق مختفي: «' + (name || '—') + '»',
      body:'أكو حركات بمجموع ' + fmt(amt) + ' على صندوق مو موجود بميزانية هذه الفترة.',
      fix:'الصندوق انحذف أو انسمّى من جديد بعد ما انسجلت حركاته. رجّعه بنفس الاسم من «الميزانية ← صناديق الادخار».'
    });
  });

  /* ---------- ٩) التوزيع أكبر من الدخل ---------- */
  let spendAlloc = 0, saveContrib = 0, spendCarried = 0;
  cats.forEach(c => {
    if(c.type === 'save') saveContrib += (Number(c.amount) || 0);
    else { spendAlloc += (Number(c.amount) || 0); spendCarried += (Number(c.carried) || 0); }
  });
  const totalSalary = (b.salaries && b.salaries.length)
    ? b.salaries.reduce((s, x) => s + (Number(x.amount) || 0), 0)
    : (b.salary1 || 0) + (b.salary2 || 0);
  const totalIncome = totalSalary + ((b.incomes) || []).reduce((s, x) => s + (Number(x.amount) || 0), 0);
  const pool = totalIncome + spendCarried;
  if(spendAlloc + saveContrib - pool >= 1){
    finds.push({
      sev:'warn', code:'alloc_over_income', title:'التوزيع أكبر من الدخل',
      body:'وزّعت ' + fmt(spendAlloc + saveContrib) + ' (' + fmt(spendAlloc) + ' مصاريف + ' + fmt(saveContrib) + ' ادخار) والمتاح ' + fmt(pool) + ' — زيادة ' + fmt(spendAlloc + saveContrib - pool) + '.',
      fix:'نزّل مخصصات التصنيفات أو مبلغ الادخار الشهري بمقدار الزيادة.'
    });
  }

  /* ---------- ١٠) الديون المفتوحة مقابل حركاتها ----------
     كل قرض مفتوح لازم يكون وراه حركة قرض بنفس المبلغ. لو المجاميع
     ما تطابقت، فأكو قرض انرجع بلا ما ينقفل دينه (أو العكس). */
  const openDebts = (state.debts || []).filter(d => d.kind === 'قرض');
  const debtTotal = openDebts.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  let loanMoves = 0;
  (state.expenses || []).forEach(e => {
    const kd = kindOf(e, saveNames);
    const a = Number(e.amount) || 0;
    if(kd === 'fund_loan' || kd === 'cat_loan_v1' || kd === 'cat_loan') loanMoves += Math.abs(a);
    if(kd === 'fund_ret' || kd === 'cat_pay' || kd === 'cat_pay_v1' || kd === 'cat_fix') loanMoves -= Math.abs(a);
  });
  /* المقارنة تنفع بس إذا كل القروض والإرجاعات صارت بنفس الفترة —
     قرض من فترة ماضية دينه مفتوح بلا حركة بهذه الفترة، وهذا طبيعي */
  if(debtTotal > 0 && loanMoves > 0 && Math.abs(debtTotal - loanMoves) >= 1){
    finds.push({
      sev:'info', code:'debt_moves_gap', title:'فرق بين الديون المفتوحة وحركات القروض',
      body:'الديون المفتوحة ' + fmt(debtTotal) + ' وصافي حركات القروض بهذه الفترة ' + fmt(loanMoves) + ' — فرق ' + fmt(Math.abs(debtTotal - loanMoves)) + '.',
      fix:'أغلب الوقت هذا طبيعي: أكو قروض من فترات ماضية بعدها مفتوحة. صار خطأ بس إذا كل قروضك من هذه الفترة.'
    });
  }

  /* ---------- ١١) مصاريف مكررة (نفس اليوم ونفس المبلغ ونفس النص) ---------- */
  const seenExp = new Map();
  const dups = [];
  (state.expenses || []).forEach(e => {
    const kd = kindOf(e, saveNames);
    if(kd !== 'spend') return;
    const k = e.date + '|' + (Number(e.amount) || 0) + '|' + (e.desc || '') + '|' + (e.category || '');
    if(seenExp.has(k)) dups.push(e); else seenExp.set(k, e);
  });
  if(dups.length){
    finds.push({
      sev:'warn', code:'dup_exp', title: arCount(dups.length, 'مصروف مكرر محتمل', 'مصروفين مكررين محتملين', 'مصاريف مكررة محتملة', 'مصروف مكرر محتمل'),
      body: dups.slice(0, 4).map(e => '«' + (e.desc || 'بلا تفاصيل') + '» ' + fmt(e.amount) + ' بتاريخ ' + e.date).join(' · ') + (dups.length > 4 ? ' … و' + (dups.length - 4) + ' غيرها' : ''),
      fix:'نفس التاريخ ونفس المبلغ ونفس التفاصيل — يمكن انضغط زر الإضافة مرتين. دقق سجل المصاريف واحذف الزايد.'
    });
  }

  /* ---------- ١٢) مصاريف خارج تواريخ الفترة ---------- */
  if(hasPeriodDates(b)){
    const out = (state.expenses || []).filter(e => e.date && (e.date < b.startDate || e.date > b.endDate));
    if(out.length){
      finds.push({
        sev:'info', code:'out_of_period', title: arCount(out.length, 'حركة وحدة خارج تواريخ الفترة', 'حركتين خارج تواريخ الفترة', 'حركات خارج تواريخ الفترة', 'حركة خارج تواريخ الفترة'),
        body:'الفترة من ' + esc(b.startDate) + ' إلى ' + esc(b.endDate) + ', وهذي الحركات تواريخها برّاها — بس محسوبة ضمنها.',
        fix:'طبيعي لو سجّلت مصروف متأخر. لو مو مقصود، عدّل تاريخ الحركة من سجل المصاريف.'
      });
    }
  }

  /* ---------- ١٣) حركات بلا ميزانية ---------- */
  if(!cats.length && (state.expenses || []).length){
    finds.push({
      sev:'warn', code:'no_budget', title:'أكو مصاريف بلا ميزانية',
      body:'انسجل ' + (state.expenses || []).length + ' حركة بهذه الفترة بلا أي تصنيف أو راتب مسجّل.',
      fix:'روح لتبويب «الميزانية» وحدد الرواتب والتصنيفات حتى تنحسب النسب والباقي صح.'
    });
  }

  finds.sort((a, b2) => AUD_SEV[a.sev] - AUD_SEV[b2.sev]);
  return { table, finds, shownRemain, promised, pool, spendAlloc, saveContrib, totalIncome, spendCarried };
}

/* ------------------------------------------------------------
   تدقيق سلسلة الترحيل عبر كل الفترات (سحابي — export_all)
   ------------------------------------------------------------
   القاعدة: باقي التصنيف بفترة مقفلة لازم يطلع «مرحّل» بالفترة اللي
   بعدها بنفس الرقم. أي فرق = فترة انعدّلت بعد ما انقفلت، وهو أكثر
   سبب يخلي الأرقام تنحرف بهدوء عبر الأشهر بلا ما ينتبهلها أحد.
   ------------------------------------------------------------ */
async function bkAuditAll(){
  const { data, error } = await sb.rpc('export_all');
  if(error) throw new Error(error.message);
  auditAll = data || {};
  const finds = [];

  const budgets = auditAll.budgets || [];
  const catsAll = auditAll.categories || [];
  const expAll  = auditAll.expenses || [];

  const months = Array.from(new Set(
    budgets.map(x => x.month)
      .concat(catsAll.map(x => x.month))
      .concat(expAll.map(x => x.month))
  )).filter(Boolean).sort();

  const lockedOf = {};
  budgets.forEach(b => { lockedOf[b.month] = !!b.locked; });

  /* تصنيفات كل شهر بخريطة، وأسماء الصناديق لكل شهر */
  const catsOf = {}, saveOf = {};
  months.forEach(m => { catsOf[m] = new Map(); saveOf[m] = new Set(); });
  catsAll.forEach(c => {
    if(!catsOf[c.month]) { catsOf[c.month] = new Map(); saveOf[c.month] = new Set(); }
    catsOf[c.month].set(c.name, c);
    if(c.type === 'save') saveOf[c.month].add(c.name);
  });

  /* صافي الحركة على كل (شهر، اسم) */
  const movedOf = {};
  expAll.forEach(e => {
    const m = e.month;
    if(!movedOf[m]) movedOf[m] = {};
    const sn = saveOf[m] || new Set();
    const kd = kindOf(e, sn);
    const k = e.category || '';
    if(!k) return;
    if(isFundKind(kd) || hitsCat(kd)) movedOf[m][k] = (movedOf[m][k] || 0) + (Number(e.amount) || 0);
  });

  const breaks = [];
  months.forEach((m, i) => {
    const nx = months[i + 1];
    if(!nx || !lockedOf[m]) return;      /* الترحيل يصير عند الإقفال بس */
    const cm = catsOf[m], cn = catsOf[nx];
    if(!cm || !cn) return;
    cm.forEach((c, name) => {
      const next = cn.get(name);
      if(!next) return;                  /* التصنيف انشال بالفترة الجاية — قرار مستخدم */
      if(c.closed) return;               /* صندوق مغلق ما يترحّل عمداً */
      const expected = (Number(c.amount) || 0) + (Number(c.carried) || 0) - ((movedOf[m] || {})[name] || 0);
      const actual = Number(next.carried) || 0;
      if(Math.abs(expected - actual) >= 1)
        breaks.push({ month:m, next:nx, name, type:c.type === 'save' ? 'صندوق' : 'تصنيف', expected, actual });
    });
  });

  if(breaks.length){
    breaks.sort((a, b) => Math.abs(b.expected - b.actual) - Math.abs(a.expected - a.actual));
    finds.push({
      sev:'err', code:'carry_chain', title:'انكسار بسلسلة الترحيل بـ' + arCount(breaks.length, 'موضع واحد', 'موضعين', 'مواضع', 'موضعاً'),
      body: breaks.slice(0, 6).map(x =>
        x.type + ' «' + x.name + '» من ' + x.month + ' لـ' + x.next + ': المفروض يترحّل ' + fmt(x.expected) + ' والمرحّل فعلاً ' + fmt(x.actual) + ' (فرق ' + fmt(Math.abs(x.expected - x.actual)) + ')'
      ).join('<br>') + (breaks.length > 6 ? '<br>… و' + (breaks.length - 6) + ' غيرها' : ''),
      fix:'صار لأن فترة مقفلة انعدّلت بعد الإقفال (انضاف/انحذف مصروف أو انتغيّر مخصص). الحل: افتح الفترة الأقدم بالقائمة، فك قفلها من البانر، وأقفلها من جديد — الترحيل ينحسب من الأول ويصلّح كل اللي بعدها.',
      raw: breaks
    });
  }

  /* حركات بشهر ماكو له ميزانية أبداً */
  const noBudget = {};
  expAll.forEach(e => {
    if(catsOf[e.month] && catsOf[e.month].size) return;
    noBudget[e.month] = (noBudget[e.month] || 0) + 1;
  });
  const nbm = Object.keys(noBudget).sort();
  if(nbm.length){
    finds.push({
      sev:'warn', code:'months_no_budget', title: arCount(nbm.length, 'فترة بيها مصاريف بلا ميزانية', 'فترتين بيهن مصاريف بلا ميزانية', 'فترات بيهن مصاريف بلا ميزانية', 'فترة بيها مصاريف بلا ميزانية'),
      body: nbm.map(m => m + ' (' + noBudget[m] + ' حركة)').join(' · '),
      fix:'افتح كل فترة منهن وحدد رواتبها وتصنيفاتها — بدونها أرقام تلك الفترة كلها بلا مرجع.'
    });
  }

  finds.sort((a, b) => AUD_SEV[a.sev] - AUD_SEV[b.sev]);
  return { finds, months, budgets };
}

/* ---------- رسم نتيجة التدقيق ----------
   زر «افتح دفتره» ياخذ رقم الملاحظة مو اسم الحساب: أسماء التصنيفات
   يكتبها المستخدم، وأي اسم بيه علامة اقتباس ينكسر (أو ينحقن) لو
   انحط جوّا onclick. الرقم ما ينكسر أبداً. */
let audFinds = [];
function bkFindCard(f, i){
  const ico = f.sev === 'err' ? '🚨' : (f.sev === 'warn' ? '⚠️' : '💡');
  return `
    <div class="aud-find ${f.sev}">
      <div class="af-h"><span class="af-i">${ico}</span><b>${esc(f.title)}</b></div>
      <div class="af-b">${f.body}</div>
      <div class="af-f"><b>الحل:</b> ${esc(f.fix)}</div>
      ${f.acc ? `<button class="af-go" onclick="openLedgerFind(${i})">📖 افتح دفتره</button>` : ''}
    </div>`;
}
function bkFindsHtml(list){
  audFinds = list;
  return list.map((f, i) => bkFindCard(f, i)).join('');
}
window.openLedgerFind = (i) => {
  const f = audFinds[i];
  if(f && f.acc) openLedger(f.acc);
};

function renderAudit(){
  const box = $('auditBody');
  if(!box) return;
  if(!(session && session.admin)){
    box.innerHTML = '<div class="empty"><span class="emo">🔒</span><b>هذي الأداة للمشرف بس.</b></div>';
    return;
  }
  const R = bkAuditMonth();

  /* معادلة الباقي للصرف — سطر سطر، حتى ينشاف من وين طلع الرقم */
  const eq = [
    ['الرواتب + الإيرادات', R.totalIncome, '+'],
    ['مرحّل من الفترة الماضية', R.spendCarried, R.spendCarried < 0 ? '−' : '+'],
    ['محجوز للادخار', R.saveContrib, '−'],
    ['المصروف الفعلي', R.pool - R.saveContrib - R.shownRemain, '−']
  ];
  const eqHtml = eq.map(([l, v, s]) =>
    `<div class="alloc-line"><span>${s === '−' ? '− ' : '+ '}${esc(l)}</span><b>${fmt(Math.abs(v))}</b></div>`).join('');

  /* جدول الحسابات — كل حساب: دخله وطلعه ورصيده */
  let trs = '';
  R.table.forEach(t => {
    const cls = t.L.closing < 0 ? 'bad' : (t.acc.orphan ? 'warn' : '');
    trs += `<tr class="${cls}">
      <td class="aud-a"><b>${t.acc.icon} ${esc(t.acc.name)}</b><small>${t.acc.kind === 'remain' ? 'فلوس فعلية' : (t.acc.kind === 'fund' ? 'صندوق ادخار' : (t.acc.orphan ? 'بلا مخصص' : 'تصنيف مصروف'))}</small></td>
      <td class="led-n">${fmt(t.L.opening)}</td>
      <td class="led-n cr">${fmt(t.L.credit)}</td>
      <td class="led-n dr">${fmt(t.L.debit)}</td>
      <td class="led-n bl ${t.L.closing < 0 ? 'neg' : ''}">${sfmt(t.L.closing)}</td>
      <td class="aud-s">${t.L.closing < 0 ? '<span class="ab bad">✕ سالب</span>' : (t.acc.orphan ? '<span class="ab warn">⚠ يتيم</span>' : '<span class="ab ok">✓</span>')}</td>
    </tr>`;
  });

  const errs = R.finds.filter(f => f.sev === 'err').length;
  const warns = R.finds.filter(f => f.sev === 'warn').length;
  const verdict = errs ? { c:'bad', t:'🚨 لگينا ' + arCount(errs, 'مشكلة وحدة', 'مشكلتين', 'مشاكل', 'مشكلة') + ' تحتاج تصليح' }
                : warns ? { c:'warn', t:'⚠️ لگينا ' + arCount(warns, 'ملاحظة وحدة', 'ملاحظتين', 'ملاحظات', 'ملاحظة') + ' تستاهل نظرة' }
                : { c:'ok', t:'✅ الأرصدة كلها مطابقة — ماكو أي خلل' };

  box.innerHTML = `
    <div class="aud-verdict ${verdict.c}">${verdict.t}</div>

    <div class="card">
      <h2 style="margin-top:0">🧮 من وين طلع «الباقي للصرف»</h2>
      <div class="hint" style="margin:0 0 10px">هذي معادلة الرقم اللي بالهيدر — سطر سطر. أي رقم غريب هنا يوديك للمصدر مباشرة.</div>
      ${eqHtml}
      <div class="alloc-line" style="border-top:1px solid var(--line);margin-top:6px;padding-top:9px">
        <span><b>= الباقي للصرف</b></span>
        <b style="color:${R.shownRemain < 0 ? 'var(--red-text)' : 'var(--primary-text)'}">${sfmt(R.shownRemain)}</b>
      </div>
      <div class="alloc-line"><span>مجموع «الباقي» بكل التصنيفات (وعد الخطة)</span><b>${fmt(R.promised)}</b></div>
    </div>

    <div class="card">
      <h2 style="margin-top:0">📋 ميزان المراجعة — ${esc(state.month)}</h2>
      <div class="hint" style="margin:0 0 10px">كل حساب: شكد دخل له وشكد طلع منه ورصيده الناتج. الأحمر رصيده سالب، والأصفر انصرف عليه بلا مخصص.</div>
      <div class="led-scroll">
        <table class="led-tbl aud-tbl">
          <thead><tr>
            <th class="aud-a">الحساب</th><th class="led-n">افتتاحي</th>
            <th class="led-n">دائن +</th><th class="led-n">مدين −</th>
            <th class="led-n">الرصيد</th><th class="aud-s">الحالة</th>
          </tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-top:0">🔎 نتائج التدقيق — ${arCount(R.finds.length, 'ملاحظة وحدة', 'ملاحظتين', 'ملاحظات', 'ملاحظة')}</h2>
      <div id="audFinds">${R.finds.length ? bkFindsHtml(R.finds) : '<div class="empty"><span class="emo">✅</span><b>ماكو أي ملاحظة على هذه الفترة.</b>كل الأرصدة تطابق حركاتها.</div>'}</div>
    </div>

    <div class="card">
      <h2 style="margin-top:0">☁️ تدقيق كل الفترات</h2>
      <div class="hint" style="margin:0 0 10px">يجيب كل فتراتك من السحابة ويفحص سلسلة الترحيل: باقي كل فترة مقفلة لازم يطلع مرحّلاً بالفترة اللي بعدها بنفس الرقم. هذا الفحص هو اللي يلگي الانحرافات القديمة اللي تتراكم بهدوء.</div>
      <button class="btn ghost" id="btnAuditAll" style="margin-top:0">☁️ شغّل تدقيق كل الفترات</button>
      <div id="audAllBox"></div>
    </div>`;

  const bAll = $('btnAuditAll');
  if(bAll) bAll.onclick = async () => {
    const out = $('audAllBox');
    out.innerHTML = '<div class="sk sk-row"></div><div class="sk sk-row"></div>';
    loading(true);
    try{
      const A = await bkAuditAll();
      out.innerHTML = `
        <div class="aud-verdict ${A.finds.some(f => f.sev === 'err') ? 'bad' : (A.finds.length ? 'warn' : 'ok')}" style="margin-top:12px">
          ${(() => { const mm = arCount(A.months.length, 'فترة وحدة', 'فترتين', 'فترات', 'فترة'); return A.finds.length ? '🔎 فحصنا ' + mm + ' ولگينا ' + arCount(A.finds.length, 'ملاحظة وحدة', 'ملاحظتين', 'ملاحظات', 'ملاحظة') : '✅ فحصنا ' + mm + ' — سلسلة الترحيل سليمة كلها'; })()}
        </div>` + bkFindsHtml(A.finds);
    }catch(err){
      out.innerHTML = '<div class="aud-find err" style="margin-top:12px"><div class="af-h"><span class="af-i">🚨</span><b>ما كدرت أجيب البيانات</b></div><div class="af-b">' + esc(err.message) + '</div></div>';
    }finally{ loading(false); }
  };
}

/* ---------- ربط عناصر التبويبين ---------- */
if($('ledAcc')) $('ledAcc').onchange = (e) => setLedgerAcc(e.target.value);
if($('btnLedXls')) $('btnLedXls').onclick = () => exportLedger();
