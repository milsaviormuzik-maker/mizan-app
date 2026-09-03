/* ============================================================
   MİZAN — Dijital Tesbih
   Sade sayaç. Zikir seçimi, hedef, tur takibi ve titreşim.
   ============================================================ */

import { el, $, $$, esc, openSheet, closeSheet, toast, haptic, trNumber, ringSvg } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state, commit } from '../core/state.js';
import { back } from '../core/router.js';
import { topbar, switchRow } from './_blocks.js';

const ZIKIRS = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', tr: 'Sübhânallah', meaning: 'Allah’ı her türlü eksiklikten tenzih ederim', target: 33 },
  { id: 'elhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Elhamdülillah', meaning: 'Hamd Allah’a mahsustur', target: 33 },
  { id: 'allahuekber', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allahu ekber', meaning: 'Allah en büyüktür', target: 33 },
  { id: 'estagfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ', tr: 'Estağfirullah', meaning: 'Allah’tan bağışlanma dilerim', target: 100 },
  { id: 'lailahe', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', tr: 'Lâ ilâhe illallah', meaning: 'Allah’tan başka ilâh yoktur', target: 100 },
  { id: 'salavat', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', tr: 'Allahümme salli alâ Muhammed', meaning: 'Allah’ım! Muhammed’e salât eyle', target: 100 },
  { id: 'havle', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', tr: 'Lâ havle velâ kuvvete illâ billâh', meaning: 'Güç ve kuvvet ancak Allah’tandır', target: 100 }
];

const zikirById = (id) =>
  ZIKIRS.find((z) => z.id === id) ??
  state.tasbih.custom.find((z) => z.id === id) ??
  ZIKIRS[0];

export const tasbihScreen = {
  render() {
    const t = state.tasbih;
    const z = zikirById(t.activeZikr);

    return el(`
      <div class="screen">
        ${topbar('Tesbih', {
      action: `<button class="icon-btn icon-btn--bare" data-act="settings" aria-label="Ayarlar">${icon('settings', 19)}</button>`
    })}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" style="display:flex;flex-direction:column;height:100%">

            <button class="card card--tap" data-act="pick-zikr" style="text-align:center;flex:none">
              <p class="arabic" style="text-align:center;font-size:28px;line-height:1.9" data-z-ar>${z.ar}</p>
              <p class="t-h3" style="margin-top:6px" data-z-tr>${esc(z.tr)}</p>
              <p class="t-sec" style="margin-top:3px" data-z-mean>${esc(z.meaning)}</p>
              <span class="chip" style="margin-top:14px">${icon('chevron', 14)} Zikri değiştir</span>
            </button>

            <div style="flex:1;display:grid;place-items:center;min-height:280px;padding:20px 0">
              <button data-act="count" aria-label="Say"
                style="position:relative;width:236px;height:236px;border-radius:50%;
                  background:var(--surface);border:1px solid var(--line);box-shadow:var(--shadow-2);
                  display:grid;place-items:center;transition:transform 90ms ease-out">
                <span style="position:absolute;inset:0;display:grid;place-items:center;color:var(--ink-300)" data-ring>
                  ${ringSvg(0, 236, 5)}
                </span>
                <span style="text-align:center;position:relative">
                  <span class="t-count" style="font-size:76px;display:block" data-count>${t.count}</span>
                  <span class="t-cap" style="display:block;margin-top:2px" data-target>/ ${t.target}</span>
                </span>
              </button>
            </div>

            <div class="row-between" style="flex:none;gap:10px">
              <button class="btn btn--secondary grow" data-act="reset">${icon('refresh', 16)} Sıfırla</button>
              <button class="btn btn--secondary grow" data-act="target">${icon('target', 16)} Hedef: <span data-target-b>${t.target}</span></button>
            </div>

            <div class="card card--flush" style="margin-top:14px;flex:none">
              <div class="row-between">
                <span class="t-sec">Bu oturumdaki tur</span>
                <span class="t-num t-sec" style="color:var(--ink-900);font-weight:600" data-rounds>${t.rounds}</span>
              </div>
              <div class="row-between" style="margin-top:8px">
                <span class="t-sec">Toplam çekilen</span>
                <span class="t-num t-sec" style="color:var(--ink-900);font-weight:600" data-total>${trNumber(t.totalAllTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;
      const t = state.tasbih;

      switch (act) {
        case 'back': back('/ibadet'); break;

        case 'count': {
          t.count += 1;
          t.totalAllTime += 1;
          if (t.haptics) haptic(10);
          const btn = n;
          btn.style.transform = 'scale(.975)';
          setTimeout(() => { btn.style.transform = ''; }, 90);

          if (t.count >= t.target) {
            t.rounds += 1;
            t.count = 0;
            if (t.haptics) haptic([14, 60, 14]);
            toast(`${t.target} tamamlandı.`);
          }
          commit('tasbih');
          paint(root);
          break;
        }

        case 'reset':
          t.count = 0; t.rounds = 0; commit('tasbih'); paint(root);
          break;

        case 'target': openTarget(root); break;
        case 'pick-zikr': openZikrPicker(root); break;
        case 'settings': openSettings(root); break;
      }
    });
  },

  onShow(root) { paint(root); }
};

function paint(root) {
  const t = state.tasbih;
  if (!$('[data-count]', root)) return;
  $('[data-count]', root).textContent = t.count;
  $('[data-target]', root).textContent = `/ ${t.target}`;
  const tb = $('[data-target-b]', root); if (tb) tb.textContent = t.target;
  const rd = $('[data-rounds]', root);
  if (rd) rd.textContent = t.rounds;
  $('[data-total]', root).textContent = trNumber(t.totalAllTime);

  const fill = $('[data-ring] .ring__fill', root);
  if (fill) {
    const c = 2 * Math.PI * ((236 - 5) / 2);
    fill.setAttribute('stroke-dashoffset', (c * (1 - t.count / t.target)).toFixed(2));
  }
}

/* ------------------------------------------------------------ */
function openZikrPicker(root) {
  const all = [...ZIKIRS, ...state.tasbih.custom];
  const body = openSheet('Zikir Seç', `
    <div class="list">
      ${all.map((z) => `
        <button class="row-item" data-act="pick" data-id="${esc(z.id)}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(z.tr)}</span>
            <span class="row-item__sub">${esc(z.meaning)}</span>
          </span>
          <span class="arabic" style="font-size:17px;line-height:1;color:var(--ink-700)">${z.ar}</span>
        </button>`).join('')}
    </div>
    <button class="btn btn--secondary btn--block" style="margin-top:16px" data-act="new-zikr">
      ${icon('plus', 17)} Kendi zikrini ekle
    </button>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'pick') {
      const z = zikirById(n.dataset.id);
      state.tasbih.activeZikr = z.id;
      state.tasbih.target = z.target ?? state.tasbih.target;
      state.tasbih.count = 0;
      commit('tasbih');
      $('[data-z-ar]', root).textContent = z.ar;
      $('[data-z-tr]', root).textContent = z.tr;
      $('[data-z-mean]', root).textContent = z.meaning;
      paint(root);
      closeSheet();
    }
    if (n.dataset.act === 'new-zikr') openNewZikr(root);
  });
}

function openNewZikr(root) {
  const body = openSheet('Yeni Zikir', `
    <div class="col gap-16">
      <label class="field">
        <span class="field__label">Zikrin adı</span>
        <input class="field__input" data-name placeholder="Örn. Yâ Latîf" maxlength="60">
      </label>
      <label class="field">
        <span class="field__label">Arapçası (isteğe bağlı)</span>
        <input class="field__input arabic" dir="rtl" data-ar placeholder="يَا لَطِيفُ" style="font-size:22px;height:56px">
      </label>
      <label class="field">
        <span class="field__label">Anlamı (isteğe bağlı)</span>
        <input class="field__input" data-mean placeholder="Ey Latîf olan" maxlength="120">
      </label>
      <label class="field">
        <span class="field__label">Hedef</span>
        <input class="field__input" data-target type="number" inputmode="numeric" value="100" min="1" max="10000">
      </label>
      <button class="btn btn--primary btn--block" data-act="save">Kaydet</button>
    </div>`);

  body.addEventListener('click', (e) => {
    if (!e.target.closest('[data-act="save"]')) return;
    const name = $('[data-name]', body).value.trim();
    if (!name) { toast('Zikrin adını yazman gerekiyor.'); return; }
    const z = {
      id: `c${Date.now()}`,
      tr: name,
      ar: $('[data-ar]', body).value.trim() || name,
      meaning: $('[data-mean]', body).value.trim() || 'Kendi zikrin',
      target: Math.max(1, Math.min(10000, Number($('[data-target]', body).value) || 100))
    };
    state.tasbih.custom.push(z);
    state.tasbih.activeZikr = z.id;
    state.tasbih.target = z.target;
    state.tasbih.count = 0;
    commit('tasbih');
    $('[data-z-ar]', root).textContent = z.ar;
    $('[data-z-tr]', root).textContent = z.tr;
    $('[data-z-mean]', root).textContent = z.meaning;
    paint(root);
    closeSheet();
    toast('Zikir eklendi.');
  });
}

function openTarget(root) {
  const body = openSheet('Hedef', `
    <div class="list">
      ${[33, 99, 100, 500, 1000].map((n) => `
        <button class="row-item" data-act="set" data-n="${n}">
          <span class="row-item__main"><span class="row-item__title">${n}</span></span>
          ${n === state.tasbih.target ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>
    <label class="field" style="margin-top:16px">
      <span class="field__label">Özel hedef</span>
      <div class="field__suffix">
        <input class="field__input grow" type="number" inputmode="numeric" data-custom placeholder="Örn. 313" min="1" max="10000">
        <button class="btn btn--secondary btn--sm" data-act="set-custom">Uygula</button>
      </div>
    </label>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    let value = null;
    if (n.dataset.act === 'set') value = Number(n.dataset.n);
    if (n.dataset.act === 'set-custom') value = Number($('[data-custom]', body).value);
    if (!value || value < 1) { toast('Geçerli bir hedef gir.'); return; }
    state.tasbih.target = Math.min(10000, value);
    state.tasbih.count = 0;
    commit('tasbih'); paint(root); closeSheet();
  });
}

function openSettings(root) {
  const body = openSheet('Tesbih Ayarları', `
    <div class="list">
      ${switchRow({ title: 'Titreşim', sub: 'Her sayımda kısa titreşim', on: state.tasbih.haptics, act: 'sw-haptic' })}
    </div>
    <button class="btn btn--ghost btn--block" style="margin-top:16px" data-act="reset-total">
      Toplam sayacı sıfırla
    </button>
    <p class="t-sec" style="margin-top:14px">
      Mizan tesbihte puan, rozet ya da günlük seri tutmaz. Sayaç yalnızca senin için.
    </p>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'sw-haptic') {
      state.tasbih.haptics = !state.tasbih.haptics;
      n.querySelector('.switch').classList.toggle('is-on', state.tasbih.haptics);
      commit('tasbih');
    }
    if (n.dataset.act === 'reset-total') {
      state.tasbih.totalAllTime = 0; state.tasbih.rounds = 0; state.tasbih.count = 0;
      commit('tasbih'); paint(root); closeSheet(); toast('Sayaç sıfırlandı.');
    }
  });
}
