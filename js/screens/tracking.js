/* ============================================================
   MİZAN — Kaza ve Takip
   Opsiyoneldir, kapatılabilir. Dil nötrdür:
   "kaçırdın", "borcun var", "seriyi bozdun" gibi ifadeler KULLANILMAZ.
   ============================================================ */

import { el, $, esc, trMonthName, trDayShort, toast, openSheet, closeSheet } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state, commit, dayKey } from '../core/state.js';
import { SALAH_KEYS, SALAH_NAMES, ramadanState } from '../core/astro.js';
import { back } from '../core/router.js';
import { topbar, switchRow, segment } from './_blocks.js';

let view = 'namaz';
let monthOffset = 0;

export const trackingScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Kaza ve Takip', {
      action: `<button class="icon-btn icon-btn--bare" data-act="settings" aria-label="Ayarlar">${icon('settings', 19)}</button>`
    })}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" data-body></div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      if (act === 'back') { back('/ibadet'); return; }
      if (act === 'settings') { openSettings(root); return; }
      if (act === 'view') {
        view = n.dataset.id;
        paint(root);
        return;
      }
      if (act === 'enable') { state.tracking.enabled = true; commit('tracking'); paint(root); return; }
      if (act === 'month-prev') { monthOffset -= 1; paint(root); return; }
      if (act === 'month-next') { if (monthOffset < 0) monthOffset += 1; paint(root); return; }

      if (act === 'toggle-prayer') {
        const { d, k } = n.dataset;
        const day = (state.tracking.prayers[d] ??= {});
        day[k] = !day[k];
        commit('tracking');
        n.classList.toggle('is-on', !!day[k]);
        n.innerHTML = day[k] ? icon('check', 14) : '';
        updateSummary(root);
        return;
      }
      if (act === 'toggle-fast') {
        const d = n.dataset.d;
        state.tracking.fasts[d] = !state.tracking.fasts[d];
        commit('tracking');
        n.classList.toggle('is-on', !!state.tracking.fasts[d]);
        n.innerHTML = state.tracking.fasts[d] ? icon('check', 14) : '';
        updateSummary(root);
      }
    });
  },

  onShow(root) { paint(root); }
};

/* ------------------------------------------------------------ */
function paint(root) {
  const body = $('[data-body]', root);

  if (!state.tracking.enabled) {
    body.innerHTML = `
      <div class="empty" style="padding-top:70px">
        <p class="empty__text">
          Takip kapalı. İstersen namaz ve oruç kaydını burada tutabilirsin.<br><br>
          Mizan bu kayıtları hiçbir yerde puana çevirmez ve kaçırılan bir ibadet için
          seni uyarmaz. Kayıt yalnızca senin görebildiğin bir not defteridir.
        </p>
        <button class="btn btn--primary btn--sm" data-act="enable">Takibi Aç</button>
      </div>`;
    return;
  }

  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const isCurrentMonth = monthOffset === 0;
  const maxDay = isCurrentMonth ? now.getDate() : lastDay;

  body.innerHTML = `
    ${segment([{ id: 'namaz', name: 'Namaz' }, { id: 'oruc', name: 'Oruç' }], view, 'view')}

    <div class="row-between" style="margin-top:18px">
      <button class="icon-btn" data-act="month-prev" aria-label="Önceki ay">${icon('back', 17)}</button>
      <p class="t-h3">${trMonthName(first.getMonth())} ${first.getFullYear()}</p>
      <button class="icon-btn" data-act="month-next" aria-label="Sonraki ay"
        ${monthOffset >= 0 ? 'style="opacity:.3;pointer-events:none"' : ''}>${icon('chevron', 17)}</button>
    </div>

    <section class="card card--flush" style="margin-top:14px" data-summary></section>

    ${view === 'namaz' ? prayerGrid(first, maxDay) : fastGrid(first, maxDay)}

    <section class="card card--flush" style="margin-top:20px">
      <p class="t-sec">
        Bir gün işaretlenmemişse bu bir eksik değil, yalnızca kaydedilmemiş demektir.
        Dilediğin zaman geri dönüp işaretleyebilirsin.
      </p>
    </section>`;

  updateSummary(root);
}

function prayerGrid(first, maxDay) {
  let rows = '';
  for (let day = 1; day <= maxDay; day++) {
    const d = new Date(first.getFullYear(), first.getMonth(), day);
    const key = dayKey(d);
    const rec = state.tracking.prayers[key] ?? {};
    rows += `
      <div class="row-item" style="gap:8px">
        <span class="row-item__main" style="max-width:74px">
          <span class="row-item__title" style="display:block;font-size:14px">${day} ${trMonthName(d.getMonth()).slice(0, 3)}</span>
          <span class="row-item__sub">${trDayShort(d)}</span>
        </span>
        <div class="row gap-6" style="flex:1;justify-content:flex-end">
          ${SALAH_KEYS.map((k) => `
            <button class="track-dot ${rec[k] ? 'is-on' : ''}" data-act="toggle-prayer" data-d="${key}" data-k="${k}"
              title="${SALAH_NAMES[k]}" aria-label="${SALAH_NAMES[k]} ${day} ${trMonthName(d.getMonth())}">
              ${rec[k] ? icon('check', 14) : ''}
            </button>`).join('')}
        </div>
      </div>`;
  }
  return `
    <div class="row-between" style="margin-top:14px;padding:0 18px">
      <span class="t-cap" style="max-width:74px">TARİH</span>
      <div class="row gap-6" style="flex:1;justify-content:flex-end">
        ${SALAH_KEYS.map((k) => `<span class="t-cap" style="width:34px;text-align:center;letter-spacing:0">${SALAH_NAMES[k].slice(0, 3)}</span>`).join('')}
      </div>
    </div>
    <div class="list" style="margin-top:6px">${rows}</div>`;
}

function fastGrid(first, maxDay) {
  let cells = '';
  for (let day = 1; day <= maxDay; day++) {
    const d = new Date(first.getFullYear(), first.getMonth(), day);
    const key = dayKey(d);
    const on = !!state.tracking.fasts[key];
    const ram = ramadanState(d, state.app.hijriOffset);
    cells += `
      <button class="track-cell ${on ? 'is-on' : ''}" data-act="toggle-fast" data-d="${key}"
        aria-label="${day} ${trMonthName(d.getMonth())}">
        <span class="track-cell__day">${day}</span>
        <span class="track-cell__mark">${on ? icon('check', 13) : ''}</span>
        ${ram.active ? '<span class="track-cell__ram"></span>' : ''}
      </button>`;
  }
  return `<div class="track-grid" style="margin-top:14px">${cells}</div>
    <p class="t-cap" style="margin-top:12px">Altın nokta Ramazan günlerini gösterir.</p>`;
}

function updateSummary(root) {
  const box = $('[data-summary]', root);
  if (!box) return;
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const maxDay = monthOffset === 0 ? now.getDate() : lastDay;

  if (view === 'namaz') {
    let done = 0;
    for (let day = 1; day <= maxDay; day++) {
      const rec = state.tracking.prayers[dayKey(new Date(first.getFullYear(), first.getMonth(), day))] ?? {};
      done += SALAH_KEYS.filter((k) => rec[k]).length;
    }
    const total = maxDay * 5;
    box.innerHTML = `
      <div class="row-between">
        <span class="t-sec">Bu ay kaydedilen</span>
        <span class="t-num" style="font-weight:600">${done} / ${total}</span>
      </div>
      <div class="progress" style="margin-top:10px"><div class="progress__fill" style="width:${((done / total) * 100).toFixed(1)}%"></div></div>`;
  } else {
    let done = 0;
    for (let day = 1; day <= maxDay; day++) {
      if (state.tracking.fasts[dayKey(new Date(first.getFullYear(), first.getMonth(), day))]) done++;
    }
    box.innerHTML = `
      <div class="row-between">
        <span class="t-sec">Bu ay tutulan oruç</span>
        <span class="t-num" style="font-weight:600">${done} gün</span>
      </div>`;
  }
}

function openSettings(root) {
  const sheet = openSheet('Takip Ayarları', `
    <div class="list">
      ${switchRow({
    title: 'Takibi kullan', sub: 'Kapatırsan bu ekran gizlenir, kayıtların silinmez',
    on: state.tracking.enabled, act: 'sw-enabled'
  })}
    </div>
    <p class="t-sec" style="margin-top:16px">
      Mizan bu kayıtlardan seri, puan veya rozet üretmez; kaçırılan ibadet için bildirim göndermez.
    </p>
    <button class="btn btn--ghost btn--block" style="margin-top:16px;color:var(--clay)" data-act="clear">
      Tüm kayıtları sil
    </button>`);

  sheet.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'sw-enabled') {
      state.tracking.enabled = !state.tracking.enabled;
      n.querySelector('.switch').classList.toggle('is-on', state.tracking.enabled);
      commit('tracking'); paint(root);
    }
    if (n.dataset.act === 'clear') {
      state.tracking.prayers = {}; state.tracking.fasts = {};
      commit('tracking'); paint(root); closeSheet(); toast('Kayıtlar silindi.');
    }
  });
}
