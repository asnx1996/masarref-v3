/* ---------- تشغيل ---------- */
if(/Android/i.test(navigator.userAgent)) document.documentElement.classList.add('perf');
// شيل شاشة الافتتاح بعد ما تخلص حركتها (حتى ما تعيق الضغط)
(function(){
  const sp = document.getElementById('splash');
  if(!sp) return;
  const kill = () => sp.classList.add('done');
  const t = document.documentElement.classList.contains('perf') ? 2300 : 2900;
  setTimeout(kill, t);
  setTimeout(kill, 4000);
  window.addEventListener('load', () => setTimeout(kill, t));
})();
loadPalette();
try{ loadFontPref(); }catch(e){}
try{ applyFontScale(fontScale); }catch(e){}
try{ applySkyBlur(skyBlur); }catch(e){}
try{ updateCurrencyLabels(); }catch(e){}
apiReady();
try{ applyLangBoot(); }catch(e){}
try{ applyBillsVisible(); }catch(e){}
try{ applyReconVisible(); }catch(e){}
try{ applyDark(); }catch(e){}
window.addEventListener('beforeprint', () => {
  try{
    const pa = $('printArea');
    if(pa && session){ pa.innerHTML = buildReportHTML(); translateNode(pa); }
  }catch(_){}
});
try{ startDeco(); }catch(e){}
try{ updateSky(); setInterval(updateSky, 5 * 60 * 1000); }catch(e){}
try{ initDepth(); }catch(e){}
try{ initAmbient(); }catch(e){}
try{ initSwipe(); }catch(e){}
(async () => {
  try{
    const { data:{ session: s } } = await sb.auth.getSession();
    if(s && s.user){ await afterLogin(s.user); } else { showLogin(); }
  }catch(_){ showLogin(); }
})();
/* ---------- تسجيل الـ Service Worker (فتح فوري + يشتغل كتطبيق) ---------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
