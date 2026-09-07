/* Appearance preferences are local to this device, independent of account data. */
const APPEARANCE_THEMES = {
  pearl: { name:'اللؤلؤي', en:'Pearl', note:'عاجي هادئ ولمسة بترولية', noteEn:'Warm ivory, deep teal', background:'glow' },
  midnight: { name:'منتصف الليل', en:'Midnight', note:'كحلي عميق وإضاءة زرقاء', noteEn:'Deep navy, soft blue', background:'glow', dark:true },
  sage: { name:'المريمي', en:'Sage', note:'أخضر ناعم وبطاقات كريمية', noteEn:'Soft sage, warm cream', background:'curves' },
  lavender: { name:'لافندر', en:'Lavender', note:'بنفسجي هادئ وبياض لؤلؤي', noteEn:'Soft violet, pearl white', background:'mesh', accent:'#695195' },
  blush: { name:'ورد بودري', en:'Blush', note:'وردي مطفي ولمسة توتية', noteEn:'Powder pink, berry accents', background:'glow', accent:'#954D69' },
  clay: { name:'طين دافئ', en:'Terracotta', note:'كريمي دافئ وطين محروق', noteEn:'Warm cream, terracotta', background:'linen', accent:'#96553A' },
  lagoon: { name:'فيروز', en:'Lagoon', note:'فيروزي منعش وأبيض بارد', noteEn:'Fresh turquoise, cool white', background:'mesh', accent:'#166878' },
  graphite: { name:'جرافيت', en:'Graphite', note:'فحمي ناعم وفضي هادئ', noteEn:'Soft charcoal, quiet silver', background:'dots', accent:'#586477', dark:true },
  plum: { name:'برقوق ليلي', en:'Plum', note:'بنفسجي عميق ولمسة موف', noteEn:'Deep plum, muted mauve', background:'glow', accent:'#895A9D', dark:true },
  evergreen: { name:'زمرد', en:'Emerald', note:'أخضر غامق ولمسة نعناعية', noteEn:'Forest depths, mint accents', background:'curves', accent:'#287761', dark:true },
  mocha: { name:'موكا', en:'Mocha', note:'قهوة داكنة وكراميل دافئ', noteEn:'Dark coffee, warm caramel', background:'linen', accent:'#926448', dark:true },
  deepsea: { name:'أعماق البحر', en:'Deep sea', note:'بترولي غامق وفيروز مضيء', noteEn:'Deep petrol, luminous teal', background:'mesh', accent:'#267481', dark:true }
};
// Register the extra palettes before boot loads the saved preference.
Object.entries(APPEARANCE_THEMES).forEach(([id,t]) => {
  if(t.accent) PALETTES[id] = makePal(t.name, t.accent, '#B47725', '#287A57', '#B43D40');
});
const isModernAppearance = id => Object.hasOwn(APPEARANCE_THEMES, id);
let appearanceFilter = 'all';
const APPEARANCE_BACKGROUNDS = {
  solid: ['سادة', 'Solid'], glow: ['إضاءة ناعمة', 'Soft glow'],
  curves: ['انحناءات', 'Curves'], mesh: ['تدرّج حريري', 'Silk gradient'],
  dots: ['نقاط ناعمة', 'Soft dots'], linen: ['نسيج خفيف', 'Fine linen'],
  landscape: ['الشمس والجبال', 'Landscape']
};
const appearanceText = (ar, en) => typeof LANG !== 'undefined' && LANG.cur === 'en' ? en : ar;
function currentBackground(){
  const saved = LS.get('mas_background');
  return Object.hasOwn(APPEARANCE_BACKGROUNDS, saved) ? saved
    : (APPEARANCE_THEMES[curPaletteId()]?.background || 'glow');
}
function backgroundStrength(){
  const value = LS.get('mas_background_strength');
  const n = value === null ? 55 : Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 55;
}
let appearanceTransitionTimer;
function pauseAppearanceTransitions(){
  document.documentElement.classList.add('appearance-switching');
  clearTimeout(appearanceTransitionTimer);
  // A timer also releases the guard when a tab is in the background.
  appearanceTransitionTimer = setTimeout(() => {
    void document.body.offsetHeight;
    document.documentElement.classList.remove('appearance-switching');
  }, 80);
}
function syncAppearance(){
  const theme = curPaletteId();
  document.body.dataset.appearance = APPEARANCE_THEMES[theme] ? theme : 'classic';
  document.body.dataset.background = currentBackground();
  document.body.style.setProperty('--background-strength', backgroundStrength() / 100);
  document.body.classList.toggle('sky-on', currentBackground() === 'landscape');
}
function appearanceSettings(){
  const theme = curPaletteId(), background = currentBackground();
  return `<section class="appearance-settings" aria-labelledby="appearanceTitle">
    <div class="appearance-heading"><div><h3 id="appearanceTitle">${appearanceText('خلّيه على ذوقك', 'Make it yours')}</h3>
    <p>${appearanceText('اختار الثيم، وغيّر الخلفية مثل ما تحب.', 'Choose a theme, then make the background your own.')}</p></div>
    <span class="appearance-local">${appearanceText('ينحفظ تلقائياً', 'Saved automatically')}</span></div>
    <div class="theme-toolbar"><div class="theme-filters" role="group" aria-label="${appearanceText('عرض الثيمات','Filter themes')}">
      ${[['all','الكل','All'],['light','فاتحة','Light'],['dark','داكنة','Dark']].map(([id,ar,en]) => `<button type="button" data-theme-filter="${id}" aria-pressed="${appearanceFilter===id}">${appearanceText(ar,en)}</button>`).join('')}
    </div><span class="theme-count">${appearanceText('١٢ ثيم متناسق','12 curated themes')}</span></div>
    <div class="theme-choices" role="group" aria-label="${appearanceText('الثيم', 'Theme')}">
    ${Object.entries(APPEARANCE_THEMES).map(([id,t]) => `<button type="button" class="theme-choice" data-theme-choice="${id}" data-theme-mode="${t.dark?'dark':'light'}" ${appearanceFilter!=='all'&&appearanceFilter!==(t.dark?'dark':'light')?'hidden':''} aria-pressed="${theme===id}">
      <span class="theme-preview preview-${id}" aria-hidden="true"><span class="preview-top"><i></i><i></i></span><span class="preview-balance"><i></i><b>850,000</b></span><span class="preview-rows"><i></i><i></i><i></i></span><span class="preview-action"></span></span>
      <span class="theme-label"><b>${appearanceText(t.name,t.en)}</b><span class="theme-check" aria-hidden="true">✓</span></span>
      <span class="theme-description">${appearanceText(t.note,t.noteEn)}</span></button>`).join('')}
    </div>
    <div class="background-heading"><h4>${appearanceText('الخلفية', 'Background')}</h4><span>${appearanceText('مستقلة عن لون الثيم', 'Independent of theme colors')}</span></div>
    <div class="background-choices" role="group" aria-label="${appearanceText('الخلفية', 'Background')}">
    ${Object.entries(APPEARANCE_BACKGROUNDS).map(([id,n]) => `<button type="button" data-background-choice="${id}" aria-pressed="${background===id}"><span class="background-swatch swatch-${id}" aria-hidden="true"></span><span>${appearanceText(...n)}</span><span class="background-check" aria-hidden="true">✓</span></button>`).join('')}
    </div>
    <div id="backgroundStrengthControl" ${['solid','landscape'].includes(background)?'hidden':''}>
      <label for="backgroundStrength">${appearanceText('وضوح الخلفية', 'Background intensity')}</label>
      <div class="background-slider"><input type="range" id="backgroundStrength" min="0" max="100" step="5" value="${backgroundStrength()}"><output id="backgroundStrengthValue" for="backgroundStrength">${backgroundStrength()}%</output></div>
    </div>
  </section>`;
}
function refreshAppearanceControls(){
  const theme = curPaletteId(), background = currentBackground();
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeChoice === theme));
  document.querySelectorAll('[data-background-choice]').forEach(b => b.setAttribute('aria-pressed', b.dataset.backgroundChoice === background));
  if($('landscapeControls')) $('landscapeControls').hidden = background !== 'landscape';
  if($('backgroundStrengthControl')) $('backgroundStrengthControl').hidden = ['solid','landscape'].includes(background);
  if($('legacyDarkControl')) $('legacyDarkControl').hidden = !!APPEARANCE_THEMES[theme];
  document.querySelectorAll('.pal.sel').forEach(b => { b.classList.remove('sel'); b.setAttribute('aria-pressed','false'); });
}
function bindAppearanceSettings(){
  document.querySelectorAll('[data-theme-filter]').forEach(button => {
    button.onclick = () => {
      appearanceFilter = button.dataset.themeFilter;
      document.querySelectorAll('[data-theme-filter]').forEach(b => b.setAttribute('aria-pressed', b === button));
      document.querySelectorAll('[data-theme-choice]').forEach(b => { b.hidden = appearanceFilter !== 'all' && b.dataset.themeMode !== appearanceFilter; });
    };
  });
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.onclick = () => {
      // Keep the settings DOM and keyboard focus intact when applying colors.
      applyPalette(button.dataset.themeChoice);
      refreshAppearanceControls();
      toast(appearanceText('انحفظ الثيم ✓', 'Theme saved ✓'));
    };
  });
  document.querySelectorAll('[data-background-choice]').forEach(button => {
    button.onclick = () => {
      pauseAppearanceTransitions();
      LS.set('mas_background', button.dataset.backgroundChoice);
      syncAppearance();
      updateSky();
      refreshAppearanceControls();
      toast(appearanceText('انحفظت الخلفية ✓', 'Background saved ✓'));
    };
  });
  const slider = $('backgroundStrength');
  if(slider){
    slider.oninput = () => {
      document.body.style.setProperty('--background-strength', Number(slider.value) / 100);
      $('backgroundStrengthValue').textContent = slider.value + '%';
    };
    slider.onchange = () => LS.set('mas_background_strength', slider.value);
  }
}
