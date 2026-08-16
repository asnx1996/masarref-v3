/* ============================================================
   fluid.js — طبقة «الحركة السائلة» (Fluid Interfaces)
   ------------------------------------------------------------
   الفكرة الأساسية (من محاضرات تصميم آبل):
   الواجهة تحسّها «حيّة» لمن الحركة تبدأ من القيمة الموجودة على
   الشاشة هالحظة، وتورث سرعة إصبعك، وتتوقّع وين رايح، وتكدر
   تكتّلها وتعكسها بأي لحظة. النوابض (springs) هي الأداة اللي
   تسوّي هذا، لأنها بطبيعتها قابلة للمقاطعة وتحسب السرعة.

   الملف هذا طبقة إضافية (progressive enhancement):
   • يضيف body.fluid — وكل التنسيقات الجديدة معلّقة عليه.
   • إذا هالملف ما اشتغل، التطبيق يرجع لسلوكه القديم بالضبط
     (أنميشن CSS العادي) بلا أي خرابة.

   يتحمّل بعد app.js/decor.js لأنه يلبس (override) بعض دوالهم:
   sheetShow/sheetHide, loading, initSwipe, gotoTab.
   ============================================================ */
(function(){
  'use strict';

  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches:false, addEventListener(){} });
  const REDUCE_Q = mq('(prefers-reduced-motion: reduce)');
  const DESK_Q   = mq('(min-width: 1000px)');
  const REDUCE = () => REDUCE_Q.matches;
  const PERF   = () => document.documentElement.classList.contains('perf');
  const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);

  /* ============================================================
     ١. النابض — بمعاملات آبل: نسبة التخميد + زمن الاستجابة
     ------------------------------------------------------------
     damping (نسبة التخميد): 1.0 = بلا تجاوز، ينزل بسلاسة ويوقف.
                              أقل من 1 = يتجاوز الهدف ويرجع (نبزة).
     response (زمن الاستجابة بالثواني): كل ما قلّ صار أسرع.
       ⚠️ مو «مدة» — النابض ماكو عنده مدة ثابتة، وقت الاستقرار
       يطلع من المعاملات نفسها.

     نحلّه تحليلياً (حل المعادلة، مو تكامل عددي) فيطلع نفس النتيجة
     مهما چان معدل الإطارات.
     ============================================================ */
  const PRESET = {
    move:   { damping: 1.00, response: 0.40 },  /* نقل/إرجاع شي لمكانه */
    firm:   { damping: 1.00, response: 0.32 },  /* الافتراضي للواجهة */
    sheet:  { damping: 0.86, response: 0.32 },  /* الشيت السفلي */
    bounce: { damping: 0.72, response: 0.36 }   /* بعد رمية/سحبة فيها زخم */
  };

  function Spring(o){
    o = o || {};
    this.damping   = o.damping   != null ? o.damping   : 1;
    this.response  = o.response  != null ? o.response  : 0.4;
    this.value     = o.from || 0;
    this.velocity  = 0;
    this.target    = this.value;
    this.restDelta = o.restDelta != null ? o.restDelta : 0.4;
    this.restSpeed = o.restSpeed != null ? o.restSpeed : 2;
    this.onUpdate  = o.onUpdate || function(){};
    this.onRest    = o.onRest   || null;
    this._raf = 0; this._t0 = 0; this._x0 = 0; this._v0 = 0;
  }
  /* إزاحة النابض عن هدفه بعد زمن t — x0 إزاحة البداية، v0 سرعتها */
  Spring.prototype._x = function(t){
    const z = this.damping, w0 = 2 * Math.PI / this.response, x0 = this._x0, v0 = this._v0;
    if(z < 1){                                   /* تحت التخميد — يتجاوز ويتذبذب */
      const wd = w0 * Math.sqrt(1 - z*z);
      const B = (v0 + z*w0*x0) / wd;
      return Math.exp(-z*w0*t) * (x0*Math.cos(wd*t) + B*Math.sin(wd*t));
    }
    if(z === 1) return Math.exp(-w0*t) * (x0 + (v0 + w0*x0)*t);  /* تخميد حرج */
    const s = w0*Math.sqrt(z*z - 1), r1 = -z*w0 + s, r2 = -z*w0 - s;
    const c2 = (v0 - r1*x0) / (r2 - r1);
    return (x0 - c2)*Math.exp(r1*t) + c2*Math.exp(r2*t);         /* فوق التخميد */
  };
  Spring.prototype.stop = function(){
    if(this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
    return this;
  };
  /* قفزة فورية بلا حركة */
  Spring.prototype.set = function(v){
    this.stop();
    this.value = this.target = v; this.velocity = 0;
    this.onUpdate(v, this);
    return this;
  };
  /* هدف جديد — تبدي من القيمة الموجودة على الشاشة وتورث السرعة،
     فما يصير «حيط طوب» لمن المستخدم يعكس الحركة بنص الطريق */
  Spring.prototype.to = function(target, o){
    o = o || {};
    if(o.damping  != null) this.damping  = o.damping;
    if(o.response != null) this.response = o.response;
    if(o.preset){ this.damping = PRESET[o.preset].damping; this.response = PRESET[o.preset].response; }
    const v = o.velocity != null ? o.velocity : this.velocity;
    this.stop();
    this.target = target;
    this._x0 = this.value - target;
    this._v0 = v;
    this.velocity = v;
    if(REDUCE() || Math.abs(this._x0) < this.restDelta && Math.abs(v) < this.restSpeed){
      this.value = target; this.velocity = 0;
      this.onUpdate(target, this);
      if(this.onRest) this.onRest();
      return this;
    }
    const self = this;
    let t0 = 0, last = 0;
    const step = (ts) => {
      if(!t0){ t0 = ts; last = ts; }
      const t = (ts - t0) / 1000;
      const x = self._x(t);
      const prev = self.value;
      self.value = self.target + x;
      /* السرعة بالفرق بين إطارين — دائماً تطابق اللي على الشاشة */
      if(t > 0){
        const dt = Math.max(1/240, (ts - last) / 1000);
        self.velocity = (self.value - prev) / dt;
      }
      last = ts;
      self.onUpdate(self.value, self);
      if(Math.abs(x) < self.restDelta && Math.abs(self.velocity) < self.restSpeed){
        self._raf = 0;
        self.value = self.target; self.velocity = 0;
        self.onUpdate(self.value, self);
        if(self.onRest) self.onRest();
        return;
      }
      self._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
    return this;
  };

  /* ============================================================
     ٢. توقّع الزخم — «وين رايحة الحركة»، مو «وين وقّف الإصبع»
     نفس منحنى تباطؤ التمرير: خذ سرعة الإفلات وحسب نقطة الرقود.
     (هذا اللي يخلّي النقزة الخفيفة ترمي العنصر لآخر الطريق)
     ============================================================ */
  const project = (v, decel) => {
    const d = decel == null ? 0.998 : decel;
    return (v / 1000) * d / (1 - d);
  };
  /* حواف طرية: كل ما تسحب أكثر برّا الحد، العنصر يتبعك أقل.
     الوقفة الحادة تحسّها «مجمّدة»، والمقاومة المتصاعدة تحسّها حيّة. */
  const rubberband = (over, dim, c) => {
    const k = c == null ? 0.55 : c;
    return (over * dim * k) / (dim + k * Math.abs(over));
  };
  /* لمسة اهتزاز — بس بلحظات معنى (تثبيت / تنفيذ / تجاوز حد) */
  const buzz = (ms) => { try{ if(navigator.vibrate) navigator.vibrate(ms); }catch(_){} };

  window.Fluid = { Spring, PRESET, project, rubberband, buzz };

  /* ============================================================
     ٣. الشيت السفلي — سحب للإغلاق، قابل للمقاطعة بأي لحظة
     ------------------------------------------------------------
     p = ١ مفتوح تماماً، ٠ مغلق. كل شي (الإزاحة، عتمة الخلفية،
     التغويش) مربوط بنفس النابض، فالحركة وحدة متماسكة.
     بالموبايل: شيت يطلع من تحت ويرجع لنفس الطريق (تناسق مكاني).
     بالكمبيوتر: نافذة وسط الشاشة تتكبّر من ٠٫٩٤ — الشيت السفلي
     ما إله معنى بماوس وشاشة عريضة.
     ============================================================ */
  const SHEETS = Object.create(null);
  let lastDragEnd = 0;

  function Sheet(modal){
    const card = modal.querySelector('.modal-card');
    if(!card) return null;
    const self = this;
    this.modal = modal; this.card = card;
    this.h = 400;                /* ارتفاع الكارت — ينقاس عند كل فتحة */
    this.open_ = false;
    this.sheetMode = !DESK_Q.matches;

    /* النابض يشتغل على p (٠..١) مو على البكسل، فحدود الاستقرار
       لازم تكون بنفس الوحدة: ٠٫٠٠١ ≈ نص بكسل بشيت ٤٠٠px */
    this.sp = new Spring({
      from: 0, restDelta: 0.0012, restSpeed: 0.01,
      onUpdate: (p) => self.render(p),
      onRest: () => {
        if(self.sp.target === 0 && self.open_ === false) self.hide();
      }
    });
    this.bind();
  }
  Sheet.prototype.render = function(p){
    const m = this.modal, c = this.card;
    m.style.setProperty('--sheet-p', clamp(p, 0, 1).toFixed(3));
    if(this.sheetMode){
      c.style.transform = 'translate3d(0,' + ((1 - p) * this.h).toFixed(2) + 'px,0)';
      c.style.opacity = '';
    }else{
      c.style.transform = 'scale(' + (0.94 + 0.06 * clamp(p, 0, 1)).toFixed(4) + ')';
      c.style.opacity = clamp(p, 0, 1).toFixed(3);
    }
  };
  Sheet.prototype.hide = function(){
    this.modal.classList.remove('show');
    this.card.style.transform = '';
    this.card.style.opacity = '';
    this.modal.style.removeProperty('--sheet-p');
  };
  Sheet.prototype.open = function(){
    const c = this.card;
    this.sheetMode = !DESK_Q.matches;
    this.open_ = true;
    if(!this.modal.classList.contains('show')){
      /* ننزّله برّا الشاشة قبل ما يظهر — حتى ما يبيّن إطار بمكانه النهائي */
      c.style.transform = this.sheetMode ? 'translate3d(0,110%,0)' : 'scale(.94)';
      c.style.opacity = this.sheetMode ? '' : '0';
      this.modal.style.setProperty('--sheet-p', '0');
      this.modal.classList.add('show');
      this.h = Math.max(120, c.offsetHeight);    /* قياس بعد ما صار مرئي */
      this.sp.value = 0; this.sp.velocity = 0;
    }else{
      this.h = Math.max(120, c.offsetHeight);    /* فتحة جوّا فتحة (مقاطعة) */
    }
    /* الكارت يتسحب من أي مكان إذا ماكو تمرير داخله، وإلا من المقبض بس */
    c.classList.toggle('sheet-free', c.scrollHeight <= c.clientHeight + 2);
    this.sp.to(1, this.sheetMode ? { preset:'sheet' } : { preset:'firm' });
    return this;
  };
  /* الإغلاق يمشي نفس الطريق للعكس، ويورث سرعة الإصبع لو انسحب */
  Sheet.prototype.close = function(vy, then){
    if(!this.modal.classList.contains('show')){ if(then) then(); return; }
    /* رايح ينسكّر أصلاً؟ ما نعيد الاستهداف — وإلا نكتّل سرعة الإصبع
       ونبدّلها بصفر (السحب يسكّر، وبعدها يوصل نداء الإلغاء العادي) */
    if(this.open_ === false && this.sp.target === 0){ if(then) then(); return; }
    this.open_ = false;
    /* السرعة بالـpx/s تتحوّل لسرعة p: النزول لتحت = p يقل */
    const vp = vy ? -vy / this.h : 0;
    this.sp.to(0, { preset: vy ? 'move' : 'firm', velocity: vp });
    if(then) then();
    return this;
  };

  Sheet.prototype.bind = function(){
    const self = this, card = this.card;
    let d = null;

    const vel = () => {                          /* سرعة الإفلات من آخر ~٨٠ms */
      if(!d || d.hist.length < 2) return 0;
      const now = d.hist[d.hist.length - 1];
      let old = d.hist[0];
      for(let i = d.hist.length - 1; i >= 0; i--){ old = d.hist[i]; if(now.t - old.t >= 80) break; }
      const dt = (now.t - old.t) / 1000;
      return dt > 0.008 ? (now.y - old.y) / dt : 0;
    };

    card.addEventListener('pointerdown', (e) => {
      if(!self.sheetMode || e.button) return;
      if(e.target.closest('input,select,textarea,a,[contenteditable]')) return;
      const fromGrab = !!e.target.closest('.grabber');
      /* ما نوقّف النابض هنا — الشيت يكمّل طلوعه لحد ما يصير سحب فعلي.
         لو وقّفناه بكل ضغطة، ضغطة عادية بنص الحركة تجمّد الشيت بنصّه. */
      d = {
        id: e.pointerId, y0: e.clientY, p0: self.sp.value, on: false, moved: false,
        fromGrab, scrollable: card.scrollHeight > card.clientHeight + 2,
        hist: [{ t: performance.now(), y: e.clientY }]
      };
    }, { passive:true });

    card.addEventListener('pointermove', (e) => {
      if(!d || e.pointerId !== d.id) return;
      const dy = e.clientY - d.y0;
      d.hist.push({ t: performance.now(), y: e.clientY });
      if(d.hist.length > 8) d.hist.shift();
      if(!d.on){
        /* عتبة ١٠px قبل ما نلتزم باتجاه — حتى الضغطة العادية ما تصير سحب */
        if(Math.abs(dy) < 10) return;
        const canPull = d.fromGrab || !d.scrollable || card.scrollTop <= 0;
        if(dy < 0 || !canPull){ d = null; return; }   /* خلّي التمرير يشتغل */
        /* هسه صار سحب — نكتّل النابض ونكمّل من القيمة اللي على الشاشة */
        self.sp.stop();
        d.on = true; d.moved = true; d.y0 = e.clientY; d.p0 = self.sp.value;
        try{ card.setPointerCapture(e.pointerId); }catch(_){}
        return;
      }
      /* تتبّع ١:١ للنزول، ومقاومة متصاعدة لو شدّ لفوق فوق حدّه */
      let y = (1 - d.p0) * self.h + (e.clientY - d.y0);
      if(y < 0) y = -rubberband(-y, self.h, 0.5);
      const p = 1 - y / self.h;
      self.sp.value = p; self.sp.velocity = 0;
      self.render(p);
      if(!d.buzzed && p < 0.6){ d.buzzed = true; buzz(6); }
    }, { passive:true });

    const end = (e) => {
      if(!d || (e && e.pointerId !== d.id)) return;
      const cur = d, v = vel();
      d = null;
      if(!cur.on) return;
      lastDragEnd = Date.now();
      const y = (1 - self.sp.value) * self.h;
      /* نقرّر على نقطة الرقود المتوقّعة، مو على مكان الإفلات */
      const landing = y + project(v);
      if(landing > self.h * 0.32 || v > 780){
        buzz(9);
        /* الحركة أول (حتى تورث السرعة)، وبعدها نخبّر التطبيق إنه انسكّر */
        self.close(Math.max(v, 260));
        self.modal.dispatchEvent(new CustomEvent('sheet-dismiss'));
      }else{
        self.sp.to(1, { preset:'move', velocity: -v / self.h });
      }
    };
    card.addEventListener('pointerup', end, { passive:true });
    card.addEventListener('pointercancel', end, { passive:true });
    /* بعد سحبة، ما نخلّي الضغطة تفتح شي — الإصبع چان يسحب مو يضغط */
    card.addEventListener('click', (e) => {
      if(Date.now() - lastDragEnd < 320){ e.preventDefault(); e.stopPropagation(); }
    }, true);
  };

  function sheetFor(el){
    if(!el || !el.id) return null;
    if(!SHEETS[el.id]){
      const s = new Sheet(el);
      if(!s || !s.card) return null;
      SHEETS[el.id] = s;
    }
    return SHEETS[el.id];
  }
  /* نلبس دالتَي core.js — وإذا فشل شي نرجع للسلوك القديم */
  window.sheetShow = function(el){
    const s = sheetFor(el);
    if(s) s.open(); else el.classList.add('show');
  };
  window.sheetHide = function(el, then){
    const s = sheetFor(el);
    if(s) s.close(0, then);
    else { el.classList.remove('show'); if(then) then(); }
  };

  /* ============================================================
     ٤. المؤشّر المتحوّل — الحبّة اللي تنزلق ورا التبويب النشط
     ------------------------------------------------------------
     نابض مستقل لكل محور (x, y, w, h). لو خلّيناها نابض واحد على
     المسافة، المحاور تنفكّ عن بعض لمن سرعتها تختلف.
     نراقب تغيّر الكلاس بـMutationObserver، فما نحتاج نلمس منطق
     التبويبات بـapp.js.
     ============================================================ */
  const AXES = ['x', 'y', 'w', 'h'];
  function Morph(container, itemSel, thumbCls){
    if(!container || container.querySelector('.' + thumbCls)) return;
    const thumb = document.createElement('i');
    thumb.className = thumbCls;
    thumb.setAttribute('aria-hidden', 'true');
    container.insertBefore(thumb, container.firstChild);

    const st = { x:0, y:0, w:0, h:0 };
    const paint = () => {
      thumb.style.transform = 'translate3d(' + st.x.toFixed(2) + 'px,' + st.y.toFixed(2) + 'px,0)';
      thumb.style.width  = st.w.toFixed(2) + 'px';
      thumb.style.height = st.h.toFixed(2) + 'px';
    };
    const sp = {};
    AXES.forEach(k => { sp[k] = new Spring(Object.assign({}, PRESET.move, {
      restDelta: 0.25, onUpdate: (v) => { st[k] = v; paint(); }
    })); });

    const measure = () => {
      const el = container.querySelector(itemSel + '.active');
      if(!el) return null;
      const cr = container.getBoundingClientRect(), r = el.getBoundingClientRect();
      if(!r.width) return null;
      return {
        x: r.left - cr.left - container.clientLeft,
        y: r.top  - cr.top  - container.clientTop,
        w: r.width, h: r.height
      };
    };
    /* jump = تغيّر قياس (تدوير الشاشة، ظهور شريط تمرير) → قفزة بلا حركة.
       بس إذا الحبّة بعدها ماشية، نغيّر هدفها بدل ما نقطع الحركة —
       الأنميشن دائماً يكمّل من القيمة اللي على الشاشة، ما يقفز. */
    const moving = () => AXES.some(k => sp[k]._raf);
    const go = (jump) => {
      const t = measure();
      if(!t){ thumb.style.opacity = '0'; return; }
      thumb.style.opacity = '1';
      const snap = !st.w || (jump && !moving());
      AXES.forEach(k => { if(snap) sp[k].set(t[k]); else sp[k].to(t[k]); });
    };

    go(true);
    new MutationObserver(() => go(false))
      .observe(container, { subtree:true, attributes:true, attributeFilter:['class'] });
    if(window.ResizeObserver) new ResizeObserver(() => go(true)).observe(container);
    window.addEventListener('resize', () => go(true));
    DESK_Q.addEventListener('change', () => setTimeout(() => go(true), 60));
    /* الشريط ممكن يكون مخفي عند التحميل (تبويب ثاني) — نقيس لمن يظهر */
    if(window.IntersectionObserver){
      new IntersectionObserver((es) => { es.forEach(x => { if(x.isIntersecting) go(true); }); })
        .observe(container);
    }
    return { refresh: () => go(true) };
  }

  /* ============================================================
     ٥. انتقال التبويبات — يمشي على محور شريط التبويبات
     التبويب الجاي يدخل من الجهة اللي هو فيها بالشريط، فالحركة
     تشير لوين رايح بدل ما تطلع من فراغ.
     ============================================================ */
  function wrapTabs(){
    const order = [].slice.call(document.querySelectorAll('nav button')).map(b => b.dataset.tab);
    const orig = window.gotoTab;
    if(typeof orig !== 'function') return;
    window.gotoTab = function(id){
      const cur = document.querySelector('.tab.active');
      const a = order.indexOf(cur && cur.id), b = order.indexOf(id);
      const t = document.getElementById(id);
      /* rtl: التبويب اللي بعده بالشريط يقع على اليسار، فيدخل من اليسار.
         نضبط الاتجاه قبل ما ينضاف .active — الأنميشن يبدي بعدها */
      if(t && a > -1 && b > -1 && a !== b) t.style.setProperty('--tab-dir', b > a ? -1 : 1);
      orig(id);
    };
  }

  /* ============================================================
     ٦. السبينر — ما يلمع بالعمليات القصيرة
     الوميض ٨٠ms يحسّه المستخدم «تهتهة»، فنأخّر الظهور شوي:
     العملية السريعة تخلص قبل ما يبيّن أبداً.
     ============================================================ */
  function wrapLoader(){
    const el = document.getElementById('loader');
    if(!el) return;
    let h = 0;
    window.loading = function(on){
      clearTimeout(h);
      if(on) h = setTimeout(() => { el.className = 'show'; }, 200);
      else el.className = '';
    };
  }

  /* ============================================================
     ٧. سحب صف المصروف — تتبّع ١:١ + حواف طرية + توقّع زخم
     السحبة ترجع بنابض يورث سرعة إصبعك، والقرار ياخذ نقطة الرقود
     المتوقّعة بالحساب — فالنقزة الخفيفة تكفي، ما تحتاج تسحب كامل.
     ============================================================ */
  const SWIPE_T = 104;                    /* المسافة اللي تعتبر «حذف» */
  window.initSwipe = function(){
    const list = document.getElementById('expList');
    if(!list) return;
    let d = null, swipeEnd = 0;

    const settle = (row, v) => {
      row.classList.remove('fx-drag');
      row.classList.add('fx-anim');
      const sp = new Spring({
        from: row._fx || 0, damping: PRESET.move.damping, response: PRESET.move.response,
        onUpdate: (x) => {
          row._fx = x;
          row.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
          row.style.background = '';      /* الصبغة الحمرة تخبي بـtransition */
        },
        onRest: () => { row.style.transform = ''; row._fx = 0; row.classList.remove('fx-anim'); }
      });
      row._sp = sp;
      sp.to(0, { velocity: v });
    };

    list.addEventListener('pointerdown', (e) => {
      if(e.pointerType === 'mouse' || e.button) return;   /* بالماوس أكو زر حذف */
      const row = e.target.closest && e.target.closest('.exp');
      if(!row || (e.target.closest && e.target.closest('.del'))) return;
      if(window.state && state.locked) return;
      if(row._sp) row._sp.stop();                          /* مقاطعة حركة جارية */
      d = {
        id: e.pointerId, row, x0: e.clientX, y0: e.clientY, on: false,
        base: row._fx || 0, w: row.offsetWidth || 320, buzzed: false,
        hist: [{ t: performance.now(), x: e.clientX }]
      };
    }, { passive:true });

    list.addEventListener('pointermove', (e) => {
      if(!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
      d.hist.push({ t: performance.now(), x: e.clientX });
      if(d.hist.length > 8) d.hist.shift();
      if(!d.on){
        if(Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)){
          d.on = true; d.x0 = e.clientX;
          d.row.classList.remove('fx-anim');
          d.row.classList.add('fx-drag');
          try{ d.row.setPointerCapture(e.pointerId); }catch(_){}
        }else if(Math.abs(dy) > 10){ d = null; }
        return;
      }
      const raw = d.base + (e.clientX - d.x0);
      const sign = raw < 0 ? -1 : 1, a = Math.abs(raw);
      /* ١:١ لحد عتبة الحذف، وبعدها مقاومة — تحسّها «وصلت» */
      const off = a <= SWIPE_T ? a : SWIPE_T + rubberband(a - SWIPE_T, d.w, 0.42);
      d.row._fx = sign * off;
      d.row.style.transform = 'translate3d(' + (sign * off).toFixed(2) + 'px,0,0)';
      const r = Math.min(1, off / SWIPE_T);
      d.row.style.background = 'color-mix(in srgb, var(--red-soft) ' + (r * 100).toFixed(0) + '%, var(--card))';
      if(!d.buzzed && off >= SWIPE_T){ d.buzzed = true; buzz(7); }
      else if(d.buzzed && off < SWIPE_T * 0.85) d.buzzed = false;
    }, { passive:true });

    const end = (e) => {
      if(!d || (e && e.pointerId !== d.id)) return;
      const cur = d; d = null;
      /* ضغطة بلا سحب: إذا الصف چان بنص رجعته وكتّلناه، نكمّل ترجيعه */
      if(!cur.on){ if(cur.row._fx) settle(cur.row, 0); return; }
      swipeEnd = Date.now();
      let v = 0;
      if(cur.hist.length > 1){
        const now = cur.hist[cur.hist.length - 1];
        let old = cur.hist[0];
        for(let i = cur.hist.length - 1; i >= 0; i--){ old = cur.hist[i]; if(now.t - old.t >= 80) break; }
        const dt = (now.t - old.t) / 1000;
        if(dt > 0.008) v = (now.x - old.x) / dt;
      }
      const x = cur.row._fx || 0;
      const landing = x + project(v);
      const commit = Math.abs(landing) >= SWIPE_T && (landing < 0) === (x < 0);
      /* الصف يرجع لمكانه بنابض، وبنفس اللحظة يفتح تأكيد الحذف —
         الصورة والاهتزاز واللمس كلهم بنفس الإطار (تناغم) */
      settle(cur.row, v);
      if(commit && cur.row.dataset.id){
        buzz(11);
        try{ delExpense(cur.row.dataset.id); }catch(_){}
      }
    };
    list.addEventListener('pointerup', end, { passive:true });
    list.addEventListener('pointercancel', end, { passive:true });
    /* السحبة ما تفتح نافذة التعديل */
    list.addEventListener('click', (e) => {
      if(Date.now() - swipeEnd < 320){ e.preventDefault(); e.stopPropagation(); }
    }, true);
  };

  /* ============================================================
     ٨. حافة التمرير — نعرف إذا أكو محتوى تحت الشريط العائم
     ============================================================ */
  function scrollEdge(){
    let raf = 0;
    const upd = () => {
      raf = 0;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.classList.toggle('scrolled', y > 6);
    };
    window.addEventListener('scroll', () => { if(!raf) raf = requestAnimationFrame(upd); }, { passive:true });
    upd();
  }

  /* ---------- التشغيل ---------- */
  function init(){
    document.body.classList.add('fluid');
    wrapTabs();
    wrapLoader();
    scrollEdge();
    /* الشيتات — ننشئها مسبقاً حتى تنربط أحداث السحب من البداية */
    ['modal', 'cfModal'].forEach(id => { const el = document.getElementById(id); if(el) sheetFor(el); });
    /* السحب بالشيت ينهي المودال العام بنفس طريق زر الإلغاء */
    const m = document.getElementById('modal');
    if(m) m.addEventListener('sheet-dismiss', () => { try{ modalClose(); }catch(_){} });
    /* الحبّة المنزلقة: شرايط السلايدر + شريط التبويبات السفلي */
    document.querySelectorAll('.seg-bar').forEach(b => Morph(b, '.seg-btn', 'seg-thumb'));
    const nav = document.getElementById('appNav');
    if(nav) Morph(nav, 'button', 'nav-thumb');
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
