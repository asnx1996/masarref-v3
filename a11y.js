/* ============================================================
   طبقة الوصول — لوحة المفاتيح والقارئ الآلي
   ------------------------------------------------------------
   تجي بعد fluid.js لأنها تلبس sheetShow/sheetHide بعد ما يلبسهن
   هو (آخر واحد يلبس هو الي ينفّذ أول)، وقبل boot.js لأن boot
   يفتح الجلسة ويبدّل التبويبات.

   شنو چان ناقص:
   • المودال چان يفتح والتركيز يبقى ورا بالصفحة — تضغط Tab فتمشي
     بعناصر مخفية وراء الغطاء.
   • Escape ما چان يسوّي شي.
   • لمن يسكّر المودال، التركيز يضيع لأول الصفحة بدل ما يرجع للزر
     الي فتحه.
   • aria-pressed / aria-current چانت ثابتة بالـHTML، ما تتحدّث
     لمن يتبدّل التبويب — فالقارئ يگول «مضغوط» على زر مو مضغوط.
   ============================================================ */
(function(){
  'use strict';

  /* ---------- ١. مساعدات ---------- */
  var FOCUSABLE = [
    'a[href]','button:not([disabled])','input:not([disabled])','select:not([disabled])',
    'textarea:not([disabled])','summary','[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusables(root){
    if(!root) return [];
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function(el){
      /* offsetParent يطلع null للمخفي — أرخص من getComputedStyle لكل عنصر */
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  /* الخلفية اللي تنعطّل لمن يفتح المودال. ما نلمس المودالات نفسهن. */
  function backdropNodes(){
    return ['appHeader','appMain','appNav','loginScreen'].map(function(id){
      return document.getElementById(id);
    }).filter(Boolean);
  }

  /* ---------- ٢. إدارة التركيز بالمودال ---------- */
  var openSheets = [];      /* مكدّس — نظرياً وحدة، بس cfModal يگدر يطلع فوك modal */

  function lockBackground(on){
    backdropNodes().forEach(function(n){
      if(on) n.setAttribute('inert',''); else n.removeAttribute('inert');
    });
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  function trapFocus(e){
    if(e.key !== 'Tab') return;
    var top = openSheets[openSheets.length - 1];
    if(!top) return;
    var items = focusables(top.card);
    if(!items.length){ e.preventDefault(); top.card.focus(); return; }
    var first = items[0], last = items[items.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  function onKeydown(e){
    if(e.key === 'Escape'){
      if(openSheets.length){
        e.preventDefault();
        var top = openSheets[openSheets.length - 1];
        /* نسكّره بنفس طريق زر الإلغاء حتى أي تنظيف بالتطبيق ينفّذ */
        try{ window.sheetHide(top.el); }catch(_){}
        return;
      }
      /* ماكو مودال — Escape يشيل رسالة الخطأ الواقفة */
      var t = document.getElementById('toast');
      if(t && t.classList.contains('err') && t.classList.contains('show')){
        e.preventDefault();
        try{ window.toastHide(); }catch(_){}
        return;
      }
    }
    trapFocus(e);
  }
  document.addEventListener('keydown', onKeydown, true);

  /* أول عنصر يستاهل التركيز جوّا الشيت: مُدخل قبل زر — المستخدم
     غالباً جاي يكتب مبلغ، مو يضغط «إلغاء». */
  function firstTarget(card){
    var input = card.querySelector('input:not([type=hidden]):not([disabled]),select,textarea');
    if(input) return input;
    var items = focusables(card);
    return items[0] || card;
  }

  var _show = window.sheetShow, _hide = window.sheetHide;

  window.sheetShow = function(el){
    var ret = _show.apply(this, arguments);
    if(!el) return ret;
    var card = el.querySelector('.modal-card') || el;
    /* app.js يعبّي innerHTML قبل ما ينادي sheetShow، فالعناصر جاهزة */
    if(!openSheets.some(function(s){ return s.el === el; })){
      openSheets.push({ el: el, card: card, returnTo: document.activeElement });
    }
    lockBackground(true);
    /* تأخير بسيط: fluid.js يبدي نابض الدخول، والتركيز وسط الحركة
       يخلّي المتصفح يمرّر الصفحة لمحل غلط */
    setTimeout(function(){
      if(!el.classList.contains('show')) return;
      try{ firstTarget(card).focus({ preventScroll:true }); }catch(_){}
    }, 90);
    return ret;
  };

  window.sheetHide = function(el, then){
    var idx = -1;
    openSheets.forEach(function(s, i){ if(s.el === el) idx = i; });
    var rec = idx >= 0 ? openSheets.splice(idx, 1)[0] : null;
    if(!openSheets.length) lockBackground(false);
    var ret = _hide.call(this, el, then);
    /* التركيز يرجع للزر الي فتح المودال — بدونه المستخدم يرجع لأول
       الصفحة ولازم يعيد كل التنقّل من جديد */
    if(rec && rec.returnTo && document.contains(rec.returnTo)){
      setTimeout(function(){ try{ rec.returnTo.focus({ preventScroll:true }); }catch(_){} }, 60);
    }
    return ret;
  };

  /* ---------- ٣. مزامنة حالة الأزرار للقارئ الآلي ----------
     التطبيق يبدّل كلاس .active بأماكن كثيرة (app.js, fluid.js).
     بدل ما نلحگ كل نداء، نراقب تغيّر الكلاس ونحدّث الـARIA وياه. */
  function syncNav(){
    var nav = document.getElementById('appNav');
    if(!nav) return;
    Array.prototype.forEach.call(nav.querySelectorAll('button'), function(b){
      var on = b.classList.contains('active');
      /* aria-current="page" هي الصح لشريط تنقّل، مو aria-selected
         (هذيچ للـtablist وتحتاج نمط أسهم كامل) */
      if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
    });
  }
  function syncSegs(){
    Array.prototype.forEach.call(document.querySelectorAll('.seg-bar .seg-btn'), function(b){
      b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
    });
  }
  function syncAll(){ syncNav(); syncSegs(); }

  /* ملاحظة: بلا requestAnimationFrame هنا عمداً.
     رد نداء MutationObserver أصلاً يجمّع كل التغييرات بمهمة صغرى وحدة،
     فالـrAF ما يزيد شي — وبنفس الوقت يكسر الشي: التبويب لو چان
     بالخلفية، rAF ما ينفّذ أبداً، فحالة ARIA تبقى متجمّدة على آخر
     تبويب چان مفتوح قبل ما يروح المستخدم. */
  function watch(){
    var nav = document.getElementById('appNav');
    var obs = new MutationObserver(syncAll);
    if(nav) obs.observe(nav, { attributes:true, attributeFilter:['class'], subtree:true });
    Array.prototype.forEach.call(document.querySelectorAll('.seg-bar'), function(bar){
      obs.observe(bar, { attributes:true, attributeFilter:['class'], subtree:true });
    });
    syncAll();
  }

  /* ---------- ٣.٥ تشغيل «الأزرار المزيّفة» بلوحة المفاتيح ----------
     بالتطبيق ١٣ عنصر يشتغلون بالضغط بس مو <button>: صف المصروف،
     ظرف التصنيف، الأزرار السريعة، الباليتة، صفوف اللوحة والفواتير،
     وأعمدة الرسم. app.js يعطيهن tabindex="0" و role="button" حتى
     Tab يوصلهن — بس onclick على <div> ما ينطلق بـEnter ولا Space،
     فالتفويض هنا هو اللي يكمّل نص الشغلة.

     ملاحظة على التداخل: صف المصروف والزر السريع بداخلهن زر حذف.
     الحالة هذي (صف يتضغط كله وبيه زر ثانوي) ما إلها حل نظيف بالـARIA
     بلا ما نعيد بناء الترميز؛ اخترنا وصول فعلي على نقاء نظري.
     الحذف نفسه سالم: هو <button> حقيقي وعنده stopPropagation،
     فالتفويض يتخطّاه ويشتغل بسلوكه الأصلي. */
  function isTypingTarget(el){
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ||
                  el.tagName === 'SELECT' || el.isContentEditable);
  }
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var t = e.target;
    if(!t || !t.getAttribute) return;
    if(isTypingTarget(t)) return;
    /* الأزرار والروابط الحقيقية عدها سلوكها من المتصفح */
    if(t.tagName === 'BUTTON' || t.tagName === 'A') return;
    if(t.getAttribute('role') !== 'button') return;
    e.preventDefault();          /* Space ما يمرّر الصفحة */
    if(typeof t.click === 'function') t.click();
    else t.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true }));
  });

  /* ---------- ٤. الروابط الي تشتغل كأزرار ---------- */
  function buttonLinks(){
    ['lnkSignup','lnkLogin'].forEach(function(id){
      var a = document.getElementById(id);
      if(!a) return;
      a.addEventListener('click', function(e){ e.preventDefault(); });
      a.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); a.click(); }
      });
    });
  }

  /* ---------- ٥. التوست: نصّ جديد لازم ينقرا حتى لو نفس النص ----------
     منطقة aria-live ما تعلن لو النص ما تغيّر. نفضّيها إطار قبل
     ما نملّيها حتى كل رسالة تنقرا ولو انعادت. */
  var _toast = window.toast;
  if(typeof _toast === 'function'){
    window.toast = function(msg, isErr){
      var t = document.getElementById('toast');
      if(t){
        t.setAttribute('aria-live', isErr ? 'assertive' : 'polite');
        /* منطقة aria-live ما تعلن لو النص ما تغيّر — نفضّيها حتى
           نفس الرسالة تنقرا لو انعادت */
        if(t.textContent === String(msg)) t.textContent = '';
      }
      return _toast.apply(this, arguments);
    };
  }

  /* الضغط على رسالة الخطأ يشيلها (وهي الوحيدة الي تستنّى) */
  function toastDismiss(){
    var t = document.getElementById('toast');
    if(!t) return;
    t.addEventListener('click', function(){
      if(t.classList.contains('err')){ try{ window.toastHide(); }catch(_){} }
    });
    t.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); try{ window.toastHide(); }catch(_){} }
    });
  }

  /* ---------- التشغيل ---------- */
  function init(){ watch(); buttonLinks(); toastDismiss(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
