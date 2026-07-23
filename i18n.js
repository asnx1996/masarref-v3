/* ============================================================
   اللغة (عربي / English)
   العربي هو الأساس — الإنكليزي ترجمة فوقه، وأي نص ما مترجم يظل عربي
   ============================================================ */
const LANG = { cur: localStorage.getItem('mas_lang') || 'ar' };
const I18N = {
  'مصاريفنا':'Masareef','ميزانية البيت الشهرية':'Monthly home budget','مصاريفنا · ميزانية البيت':'Masareef · Home budget',
  'الباقي للصرف':'Left to spend','الدخل':'Income','المصروف':'Spent','خروج':'Logout',
  'اللوحة':'Dashboard','الميزانية':'Budget','مصروف':'Expense',
  '🧾 المصاريف':'🧾 Expenses','🏦 الصناديق':'🏦 Funds','سجل المصاريف':'Expense log','حركات الصناديق':'Fund movements',
  'كل الصناديق':'All funds','كل الأنواع':'All kinds','سحب −':'Withdraw −','إيداع +':'Deposit +','قرض 🤝':'Loan 🤝','إرجاع / سداد ↩':'Return / repay ↩','تمويل تصنيف 💸':'Category funding 💸',
  'لا، رجعني':'No, take me back','احذف':'Delete','اشطب':'Write off','فرّغ':'Clear it','احذف نهائياً':'Delete forever',
  'سجّل مصروف':'Log an expense','المبلغ':'Amount','المبلغ (د.ع)':'Amount (IQD)','التاريخ':'Date',
  'التفاصيل':'Details','شنو اشتريت؟':'What did you buy?','التصنيف':'Category','— بلا تصنيف —':'— No category —',
  'إضافة المصروف':'Add expense',
  'المصروف ينحفظ فوراً ويظهر لحظياً عند كل أفراد العائلة، ويتسجل وياه منو دخّله. للسحب أو الإيداع بصندوق ادخار استعمل الأزرار باللوحة.':'Saved instantly and synced live to your whole family, with the name of who logged it. For fund withdrawals or deposits use the buttons on the dashboard.',
  '⚡ أزرار سريعة':'⚡ Quick buttons','＋ زر جديد':'＋ New button','⚡ زر سريع جديد':'⚡ New quick button',
  'مصاريفك المتكررة (كهرباء، إيجار، بنزين...) — اضغط الزر ويتعبّى المبلغ والتصنيف، أو ينسجل فوراً. مشتركة بينك وبين العائلة.':'Your recurring expenses (power, rent, fuel...) — tap to pre-fill or log instantly. Shared with your family.',
  'ماكو أزرار بعد — اضغط «＋ زر جديد» وسوّي أزرار لمصاريفك المتكررة.':'No buttons yet — tap “＋ New button” to create shortcuts for recurring expenses.',
  'اسم الزر':'Button name','مثلاً: كهرباء / بنزين / إيجار':'e.g. Power / Fuel / Rent','المبلغ (اختياري)':'Amount (optional)','ثابت أو فارغ':'Fixed or empty','حفظ الزر':'Save button','بلا مبلغ':'No amount','✎ تعديل':'✎ Edit','✓ تم':'✓ Done',
  'لو حطيت مبلغ ثابت، الزر يسجّل المصروف بضغطة. لو خليته فارغ، يعبّي الفورم وتكتب المبلغ كل مرة.':'With a fixed amount, one tap logs the expense. Leave it empty to pre-fill the form and type the amount each time.',
  'آخر المصاريف':'Recent expenses','كل التصنيفات':'All categories','الكل':'Everyone','🔎 دوّر بالتفاصيل...':'🔎 Search details...',
  'ماكو مصاريف مسجلة بهذا الشهر.':'No expenses recorded this month.','ماكو نتائج للفلتر.':'No results for this filter.',
  'رواتب الشهر':'Monthly salaries','راتبي':'My salary','راتب زوجتي':'Spouse salary',
  'إيرادات إضافية 💵':'Extra income 💵','إيرادات إضافية':'Extra income','+ إضافة دخل (سلفة / فلوس خارجية)':'+ Add income (loan / external money)',
  'مثلاً: سلفة من أخوي':'e.g. Loan from my brother',
  'توزيع المصاريف':'Spending allocation','+ إضافة تصنيف مصروف':'+ Add spending category',
  'صناديق الادخار':'Savings funds','صناديق الادخار 🏦':'Savings funds 🏦','+ إضافة صندوق ادخار':'+ Add savings fund',
  '🎯 الهدف (اختياري)':'🎯 Goal (optional)','مثلاً: 5,000,000':'e.g. 5,000,000',
  'حفظ ميزانية الشهر':'Save monthly budget','إقفال الشهر وترحيل الباقي ✓':'Close month & carry over ✓','🔒 الشهر مقفل':'🔒 Month locked',
  '🗑 تفريغ ميزانية هذا الشهر':'🗑 Clear this month\'s budget','⧉ انسخ تصنيفات الشهر الماضي':'⧉ Copy last month\'s categories',
  'مرحّل من الشهر الماضي':'Carried from last month','الباقي بلا توزيع':'Unallocated','بعد ما مسوّي ميزانية لهذا الشهر.':'No budget set for this month yet.',
  'روح لتبويب «الميزانية» وحدد الرواتب والتصنيفات.':'Go to the “Budget” tab and set salaries and categories.',
  'سحب −':'Withdraw −','إيداع +':'Deposit +','سحب':'Withdraw','إيداع':'Deposit','سجل الحركات':'History','مرحّل':'Carried','هذا الشهر':'this month','الرصيد':'Balance','بلا مخصص':'No allocation',
  'ديون الصناديق ⏳':'Fund debts ⏳','ديون الصناديق (مطلوبة)':'Fund debts (owed)','↩ رجّعه للصندوق':'↩ Return to fund','شطب (احذفه)':'Write off (delete)',
  'المعدل اليومي':'Daily average','باقي بالشهر':'Days left','تقدر تصرف باليوم':'Daily allowance',
  'الإيميل':'Email','الباسورد':'Password','دخول':'Log in','سجّل الدخول للمتابعة':'Log in to continue',
  'ما عندك حساب؟':'No account?','سجّل جديد':'Sign up','عندك حساب؟':'Have an account?','سجّل دخول':'Log in',
  'اسمك':'Your name','مثلاً: أحمد':'e.g. Ahmed','كود العائلة (اختياري)':'Family code (optional)','إذا زوجك/زوجتك مسجّل قبلك':'If your spouse signed up first','إنشاء الحساب':'Create account',
  'تلكاه بإعداداته — بدونه تنسويلك مساحة عائلة جديدة خاصة بيك.':'Find it in their settings — without it you get your own new family space.',
  '٦ خانات على الأقل':'At least 6 characters','أعد كتابته':'Repeat it','••••••':'••••••',
  '⚙ الإعدادات':'⚙ Settings','الإعدادات':'Settings','العائلة':'Family','نسخ':'Copy','الحساب':'Account',
  'كود عائلتك — انطيه لزوجك/زوجتك يدخّله وقت التسجيل حتى تصيرون بنفس المساحة وتشوفون نفس البيانات:':'Your family code — give it to your spouse to enter at signup so you share the same space and data:',
  'الباسورد الحالي':'Current password','الباسورد الجديد':'New password','تأكيد الباسورد الجديد':'Confirm new password','تغيير الباسورد':'Change password',
  'التقارير والتصدير':'Reports & export','🖨 طباعة مباشرة (للكمبيوتر)':'🖨 Print (desktop)','إغلاق':'Close','إلغاء':'Cancel','تمام':'OK','حذف':'Delete',
  'المشرف':'Admin','🛡 لوحة المشرف':'🛡 Admin panel','سعة قاعدة البيانات':'Database capacity','تقدر تضيف تقريباً':'You can add roughly','عائلة إضافية':'more families','عائلة':'families','مستخدم':'users','ماكو عوائل':'No families','(عائلتك)':'(your family)',
  'تقدير على أساس متوسط حجم العوائل الحالية. كل ما تكبر البيانات يتغير الرقم.':'Estimate based on the average size of current families. It shifts as data grows.',
  '📊 مقارنة الأشهر':'📊 Months comparison','مقارنة الأشهر':'Months comparison','معدل الصرف الشهري':'Avg monthly spending','أعلى شهر صرف':'Highest spending month',
  'العمود الفاتح = الدخل، والغامق = المصروف (يحمرّ إذا الصرف تجاوز الدخل). اضغط على أي شهر حتى تفتحه.':'Light bar = income, dark = spending (turns red when spending beats income). Tap a month to open it.',
  'تعديل المصروف':'Edit expense','حفظ التعديل':'Save changes','السبب (اختياري)':'Reason (optional)','شنو الغرض؟':'What is it for?','المصدر / السبب (اختياري)':'Source / reason (optional)','مثلاً: من بيع غرض / رجعتلي سلفة':'e.g. Sold something / loan repaid to me',
  'على حساب منو؟ (اختياري — للسحب كدين)':'On whose account? (optional — withdraw as debt)','مثلاً: سلفة لأخوي / حساب الراتب':'e.g. Loan to my brother / salary account',
  'تودّع من فائض فلوسك غير الموزّعة — الحد الأقصى هالشهر:':'Deposit from your unallocated surplus — this month\'s cap:','. المبلغ يزيد رصيد الصندوق وما يأثر على صرفك.':'. It raises the fund balance without touching your spending.',
  'ماكو فائض متاح تودّعه هالشهر 🚫':'No surplus available to deposit this month 🚫','كل فلوسك موزّعة على المصاريف والادخار.':'All your money is allocated to spending and savings.',
  'حتى تودّع، لازم يكون عندك فائض: زيّد دخلك من «الإيرادات الإضافية» بتبويب الميزانية، أو قلّل التوزيع.':'To deposit you need surplus: add income under “Extra income” in the Budget tab, or reduce allocations.',
  'ماكو حركات على هذا الصندوق بهذا الشهر.':'No movements on this fund this month.',
  'الأخضر يزيد الرصيد والأحمر ينقصه.':'Green raises the balance, red lowers it.','إرجاع دين':'Debt return',
  '🎨 لون الواجهة':'🎨 Theme color','الألوان':'Colors','لون مخصص':'Custom color','اختر اللون الي يعجبك — يتطبّق فوراً وينحفظ بجهازك.':'Pick a color you like — applies instantly and is saved on this device.',
  'إجمالي الرواتب':'Total salaries','إجمالي الدخل':'Total income','إجمالي المصروف':'Total spent','محجوز للادخار':'Reserved for savings','مودَع بالصناديق من الفائض':'Deposited to funds from surplus','تفاصيل التصنيفات':'Category details','كل المصاريف':'All expenses','المتاح':'Available','الباقي':'Left','الصندوق':'Fund','المُدخِل':'Logged by',
  'تسجيل الخروج':'Log out','متأكد تريد تسجّل خروج؟':'Are you sure you want to log out?','نعم، خروج':'Yes, log out',
  'انتهت الجلسة، سجّل دخول من جديد':'Session expired — please log in again','سجّلنا خروجك تلقائياً لأنك تركت التطبيق فترة 🔒':'Logged you out automatically after inactivity 🔒',
  'الشهر مقفل':'Month is locked','دخّل المبلغ':'Enter the amount','املأ الحقول':'Fill in the fields','انحفظت الميزانية ✓':'Budget saved ✓','انقفل الشهر وانرحّل الباقي ✓ 🎉':'Month closed & carried over ✓ 🎉','انضاف للرصيد ✓ 💰':'Added to balance ✓ 💰','انحذف ✓':'Deleted ✓','انتسخ الكود ✓':'Code copied ✓','انصدّر الإكسل ✓ 📊':'Excel exported ✓ 📊','انحمّل التقرير ✓ 📄':'Report downloaded ✓ 📄','انتغيّر الباسورد ✓':'Password changed ✓','انضاف الزر ✓ ⚡':'Button added ✓ ⚡','عبّي المبلغ واضغط إضافة':'Enter the amount and tap Add','انضاف ✓':'Added ✓','انحفظ ✓':'Saved ✓','انحذف المصروف ✓':'Expense deleted ✓',
  'الإيميل أو الباسورد غلط':'Wrong email or password','دخّل الإيميل والباسورد':'Enter email and password','املأ الاسم والإيميل والباسورد':'Fill in name, email and password','الباسورد لازم يكون ٦ خانات على الأقل':'Password must be at least 6 characters','كود العائلة غلط — دقق عليه أو خليه فارغ':'Wrong family code — check it or leave empty','هذا الإيميل مسجّل أصلاً — سجّل دخول بيه':'This email is already registered — log in instead','أهلاً بيك بمصاريفنا 🎉':'Welcome to Masareef 🎉','ما كدرت أوصل للخادم':'Could not reach the server',
  '🎵 موسيقى الخلفية':'🎵 Background music','▶ تشغيل':'▶ Play','⏸ إيقاف':'⏸ Pause','اضغط مرة ثانية لتشغيل الموسيقى':'Tap again to start the music',
  'موزارت — كونشيرتو الكمان رقم ٥، الحركة الثانية (Adagio). هادئة تناسب المتابعة.':'Mozart — Violin Concerto No. 5, 2nd mvt (Adagio). Calm, good for focus.',
  'اختيارك ينحفظ بالجهاز. الموسيقى تشتغل بهذا الجهاز بس، ما تنسمع عند غيرك.':'Saved on this device. Plays here only, not for others.',
  'الأصوات':'Sounds','🔔 أصوات العمليات (إضافة / صرف / حذف)':'🔔 Action sounds (add / spend / delete)',
  'رواتب الشهر':'Monthly salaries','＋ شخص':'＋ Person','اسم الشخص':'Person name','الراتب':'Salary',
  'أضف راتب كل شخص بالعائلة — تكدر تضيف أو تحذف حسب عدد أفرادكم.':'Add each family member\'s salary — add or remove as many as you need.',
  'اسمك المعروض':'Your display name','اسمك':'Your name','حفظ':'Save','انتغيّر الاسم ✓':'Name changed ✓','دخّل الاسم':'Enter the name','نفس الاسم الحالي':'Same as current name',
  '🎨 غيّر شكل الساعة':'🎨 Change clock style',
  'فواتيري':'My Bills','🧾 فواتير الشهر':'🧾 This month\'s bills','➕ إضافة فاتورة':'➕ Add a bill','اسم الفاتورة':'Bill name','يوم الاستحقاق (اختياري)':'Due day (optional)','⧉ انسخ الشهر الماضي':'⧉ Copy last month','إضافة':'Add',
  'إجمالي الفواتير':'Total bills','✓ المدفوع':'✓ Paid','⏳ الباقي عليك':'⏳ Still owed','💵 الباقي للصرف عندك':'💵 Your left to spend',
  '🧾 أظهر تبويب «فواتيري»':'🧾 Show the "My Bills" tab','🌤 ثيم الخلفية (الفصول)':'🌤 Background theme (seasons)',
  'المطابقة':'Reconcile','🧮 أظهر تبويب «المطابقة»':'🧮 Show the "Reconcile" tab',
  '✍️ سجّل جردة اليوم':'✍️ Record today\'s count',
  'عدّ فلوسك الفعلية اللي بإيدك وسجّلها هنا — نقارنها ويا رصيد النظام. لو طلع نقص، معناها أكو مصاريف نسيت تسجّلها.':'Count the actual money you have and record it here — we compare it with the system balance. A shortfall means some expenses were never logged.',
  '💵 كاش (بالبيت / بالجيب)':'💵 Cash (home / pocket)','🏦 مصرف / بطاقات':'🏦 Bank / cards','💍 ذهب / أمانات / غيرها (اختياري)':'💍 Gold / deposits / other (optional)',
  'ملاحظة (اختياري)':'Note (optional)','مثلاً: جردة نص الشهر':'e.g. Mid-month count','حفظ المطابقة':'Save reconciliation',
  '🗂 سجل المطابقات':'🗂 Reconciliation history','آخر المطابقات المسجلة — تشوف منها إذا فلوسك ماشية صح.':'Your latest counts — see whether your money is on track.',
  'الديون والقروض المفتوحة مو محسوبة — لأنها فلوس طالعة من إيدك وراجعة للصناديق بعدين.':'Open debts and loans are excluded — that money already left your hands and returns to the funds later.',
  'قرض 🤝':'Loan 🤝','لمن القرض؟':'Who is the loan for?','⏰ موعد الإرجاع المتوقع (اختياري)':'⏰ Expected return date (optional)','سجّل القرض':'Record loan','مثلاً: أخوي أحمد / صديقي':'e.g. My brother / a friend','شنو المناسبة؟':'What\'s it for?',
  'تلقائي (حسب الوقت) ☀️🌙':'Auto (by time of day) ☀️🌙','ربيع 🌸':'Spring 🌸','صيف ☀️':'Summer ☀️','خريف 🍂':'Autumn 🍂','شتاء ❄️':'Winter ❄️',
  'ليل ونجوم 🌌':'Night & stars 🌌','غروب 🌇':'Sunset 🌇','بحر 🌊':'Sea 🌊',
  '🌙 الوضع الداكن (دارك مود)':'🌙 Dark mode',
  'تعديل السحب ✎':'Edit withdrawal ✎','تعديل القرض ✎':'Edit loan ✎','حفظ التعديل':'Save changes','رجوع':'Back',
  'أي تغيير هنا ينضبط تلقائياً على: رصيد الصندوق، والدين/القرض المرتبط، وتمويل التصنيف إذا موجود.':'Any change here automatically syncs the fund balance, the linked debt/loan, and the linked category funding.',
  '💸 أضف المبلغ لتصنيف مصروف (اختياري)':'💸 Add the amount to a spending category (optional)','— بلا (بس اسحب) —':'— None (just withdraw) —',
  'مصدر الفلوس':'Money source','كل المتاح':'All available','انتغيّر الثيم ✓ 🌤':'Theme changed ✓ 🌤',
  '⏱ تسجيل الخروج التلقائي عند الخمول':'⏱ Auto-logout when idle','لا يطلّع أبداً':'Never','بعد دقيقتين':'After 2 minutes','بعد ٥ دقائق':'After 5 minutes','بعد ١٠ دقائق':'After 10 minutes','بعد ٣٠ دقيقة':'After 30 minutes','بعد ساعة':'After 1 hour',
  '💾 نسخة احتياطية كاملة (ملف)':'💾 Full backup (file)','⇄ نقل من هذا التصنيف':'⇄ Transfer from this category','إلى تصنيف':'To category','نقل':'Transfer','🔓 فك القفل':'🔓 Unlock','إقفال الشهر ✓':'Close month ✓'
};
const I18N_RULES = [
  [/^مرحباً\s*(.*)$/, (m)=>'Welcome ' + m[1]],
  [/^([\d,.\-]+)\s*د\.ع$/, (m)=> m[1] + ' IQD'],
  [/^الإجمالي:\s*(.+)$/, (m)=>'Total: ' + m[1]],
  [/^مرحّل:\s*(.+)$/, (m)=>'Carried: ' + m[1]],
  [/^\+ هذا الشهر:\s*(.+)$/, (m)=>'+ This month: ' + m[1]],
  [/^− صافي السحب:\s*(.+)$/, (m)=>'− Net withdrawals: ' + m[1]],
  [/^\+ صافي الإيداع:\s*(.+)$/, (m)=>'+ Net deposits: ' + m[1]],
  [/^🎯 الهدف:\s*(.+)$/, (m)=>'🎯 Goal: ' + m[1]],
  [/^باقي (.+) حتى توصله$/, (m)=> m[1] + ' to go'],
  [/^باقي\s+(.+)$/, (m)=>'Left ' + m[1]],
  [/^صرفت\s+(.+)$/, (m)=>'Spent ' + m[1]],
  [/^المتاح\s+(.+)$/, (m)=>'Available ' + m[1]],
  [/^يتبقى\s+(.+)$/, (m)=>'Remaining ' + m[1]],
  [/^(\d+)\s*يوم$/, (m)=> m[1] + ' days'],
  [/^إيداع بـ «(.+)» 💰$/, (m)=>'Deposit to “' + m[1] + '” 💰'],
  [/^سحب من «(.+)»(.*)$/, (m)=>'Withdraw from “' + m[1] + '”' + m[2]],
  [/^سجل «(.+)» ☰$/, (m)=>'“' + m[1] + '” history ☰'],
  [/^حركات شهر (.+) — بدّل الشهر من فوق حتى تشوف أشهر ثانية\.(.*)$/, (m)=>'Movements for ' + m[1] + ' — switch months above to see more.' + (I18N[m[2].trim()]||m[2])],
  [/^إيداع:\s*(.+)$/, (m)=>'Deposit: ' + m[1]],
  [/^إرجاع دين:\s*(.+)$/, (m)=>'Debt return: ' + m[1]],
  [/^سحب على:\s*(.+)$/, (m)=>'Withdrawn on: ' + m[1]],
  [/^مطلوب لصندوق «(.+)» · سُحب (.+)$/, (m)=>'Owed to fund “' + m[1] + '” · withdrawn ' + m[2]],
  [/^الحساب —\s*(.*)$/, (m)=>'Account — ' + m[1]],
  [/^📄 تحميل تقرير PDF — شهر (.+)$/, (m)=>'📄 Download PDF report — ' + m[1]],
  [/^📊 تصدير إكسل — شهر (.+)$/, (m)=>'📊 Export Excel — ' + m[1]],
  [/^🗂 تصدير إكسل — كل الأشهر$/, ()=>'🗂 Export Excel — all months'],
  [/^🔒 شهر (.+) مقفل — للعرض فقط، ما تكدر تعدّله$/, (m)=>'🔒 ' + m[1] + ' is locked — view only'],
  [/^(\d+)\s*فرد ·\s*(\d+)\s*مصروف ·\s*(\d+)\s*شهر · آخر نشاط (.+)$/, (m)=>`${m[1]} members · ${m[2]} expenses · ${m[3]} months · last active ${m[4]}`],
  [/^مستهلك ([\d.]+) م\.ب$/, (m)=>'Used ' + m[1] + ' MB'],
  [/^من ([\d.]+) م\.ب \((\d+)%\)$/, (m)=>'of ' + m[1] + ' MB (' + m[2] + '%)'],
  [/^مقفل$/, ()=>'Locked']
];
function trString(s){
  if(I18N[s]) return I18N[s];
  for(const r of I18N_RULES){ const m = s.match(r[0]); if(m) return r[1](m); }
  return s;
}
function translateNode(root){
  if(LANG.cur !== 'en' || !root) return;
  if(root.nodeType === 3){
    const s = root.nodeValue.trim();
    if(s && /[\u0600-\u06FF]/.test(s)){ const tr = trString(s); if(tr !== s) root.nodeValue = root.nodeValue.replace(s, tr); }
    return;
  }
  if(root.nodeType !== 1 && root.nodeType !== 11) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while(n = walker.nextNode()){
    const s = n.nodeValue.trim();
    if(!s || !/[\u0600-\u06FF]/.test(s)) continue;
    const tr = trString(s);
    if(tr !== s) n.nodeValue = n.nodeValue.replace(s, tr);
  }
  if(root.querySelectorAll){
    root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => {
      ['placeholder','title','aria-label'].forEach(a => {
        const v = el.getAttribute(a);
        if(v && /[\u0600-\u06FF]/.test(v)){ const tr = trString(v.trim()); if(tr !== v.trim()) el.setAttribute(a, tr); }
      });
    });
  }
}
function applyLangBoot(){
  if(LANG.cur === 'en'){
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    translateNode(document.body);
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(nd => translateNode(nd)));
    }).observe(document.body, { childList: true, subtree: true });
  }
  const bl = $('btnLang');
  if(bl) bl.textContent = LANG.cur === 'en' ? 'ع' : 'EN';
}
function toggleLang(){
  localStorage.setItem('mas_lang', LANG.cur === 'en' ? 'ar' : 'en');
  location.reload();
}

/* ============================================================
   الخروج التلقائي بعد فترة خمول — يتحكم بيه المستخدم من الإعدادات
   القيمة بالدقائق، و0 معناها ما يطلّع أبداً
   ============================================================ */
let autoLogoutMin = parseInt(localStorage.getItem('mas_idle') ?? '10', 10);
if(isNaN(autoLogoutMin)) autoLogoutMin = 10;
let idleTimer = null;
function resetIdle(){
  if(!session) return;
  clearTimeout(idleTimer);
  if(autoLogoutMin <= 0) return; // معطّل
  idleTimer = setTimeout(() => {
    if(!session) return;
    doLogout();
    toast(trString2('سجّلنا خروجك تلقائياً لأنك تركت التطبيق فترة 🔒'), true);
  }, autoLogoutMin * 60 * 1000);
}
function setAutoLogout(min){
  autoLogoutMin = min;
  localStorage.setItem('mas_idle', String(min));
  resetIdle();
}
function trString2(s){ return LANG.cur === 'en' ? trString(s) : s; }
['click','keydown','touchstart','scroll','pointermove'].forEach(ev =>
  document.addEventListener(ev, () => resetIdle(), { passive: true })
);
// أول لمسة تشغّل الموسيقى تلقائياً إذا كانت مفعّلة سابقاً
['click','touchstart','keydown'].forEach(ev =>
  document.addEventListener(ev, function once(){ musicFirstTouch(); document.removeEventListener(ev, once); }, { passive: true })
);

