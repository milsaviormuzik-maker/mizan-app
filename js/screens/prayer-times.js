/* ============================================================
   MİZAN — Namaz Vakitleri
   Günlük · Haftalık · Aylık · vakit başına bildirim · hesap yöntemi
   ============================================================ */

import { el, $, $$, esc, hhmm, hms, trDate, trDayShort, trMonthName, openSheet, closeSheet, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state, commit } from '../core/state.js';
import { subscribeClock, invalidate, timesRange, timesFor } from '../core/clock.js';
import { PRAYER_KEYS, PRAYER_NAMES, SALAH_NAMES, METHODS } from '../core/astro.js';
import { back } from '../core/router.js';
import { topbar, segment, switchRow } from './_blocks.js';
import { openCityPicker } from './today.js';

let unsub = null;
let view = 'gunluk';
let monthOffset = 0;

const NOTIFY_LABEL = {
  ezan: 'Ezan', before15: '15 dk önce', before30: '30 dk önce',
  silent: 'Sadece bildirim', off: 'Kapalı'
};

export const prayerTimesScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Namaz Vakitleri', {
      action: `<button class="icon-btn icon-btn--bare" data-act="settings" aria-label="Ayarlar">${icon('settings', 19)}</button>`
    })}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">
            <button class="row gap-6 pressable" data-act="city"
              style="color:var(--ink-500);font-size:13.5px;margin-bottom:14px">
              ${icon('location', 15)}<span data-city>${esc(state.user.city)}</span>
              <span style="color:var(--ink-300)">${icon('chevron', 13)}</span>
            </button>
            ${segment([
      { id: 'gunluk', name: 'Günlük' }, { id: 'haftalik', name: 'Haftalık' }, { id: 'aylik', name: 'Aylık' }
    ], view, 'view')}
            <div data-panel></div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;
      if (act === 'back') back('/ibadet');
      if (act === 'city') openCityPicker();
      if (act === 'settings') openMethodSheet(root);
      if (act === 'view') {
        view = n.dataset.id; monthOffset = 0;
        $$('.segment__item', root).forEach((b) => b.classList.toggle('is-on', b.dataset.id === view));
        paint(root);
      }
      if (act === 'notify') openNotifySheet(n.dataset.k, root);
      if (act === 'month-prev') { monthOffset -= 1; paint(root); }
      if (act === 'month-next') { monthOffset += 1; paint(root); }
    });
  },

  onShow(root) {
    unsub?.();
    unsub = subscribeClock((ctx) => {
      if (!root.isConnected) return;
      const city = $('[data-city]', root);
      if (city) city.textContent = state.user.city;
      if (view === 'gunluk') {
        const cd = $('[data-cd]', root);
        if (cd) cd.textContent = hms(ctx.remainingSec);
        else paint(root, ctx);
        $$('[data-cell]', root).forEach((c) => {
          c.classList.toggle('is-current', c.dataset.cell === ctx.currentKey);
          c.classList.toggle('is-next', c.dataset.cell === ctx.nextKey);
        });
      }
    });
    paint(root);
  },

  onHide() { unsub?.(); unsub = null; }
};

/* ------------------------------------------------------------ */
function paint(root) {
  const panel = $('[data-panel]', root);
  panel.innerHTML = view === 'gunluk' ? dailyHtml() : view === 'haftalik' ? weeklyHtml() : monthlyHtml();
}

/* ---------------- Günlük ---------------- */
function dailyHtml() {
  const now = new Date();
  const t = timesFor(now);
  return `
    <section class="card" style="margin-top:18px">
      <div class="row-between">
        <span class="card__label">Bugün</span>
        <span class="badge">${trDate(now)}</span>
      </div>
      <p class="t-count" style="margin-top:14px;font-size:40px" data-cd>--:--:--</p>
      <p class="t-sec" style="margin-top:2px">sıradaki vakte kalan süre</p>
    </section>

    <div class="list" style="margin-top:14px">
      ${PRAYER_KEYS.map((k) => {
    const mode = state.prayer.notify[k];
    return `
      <div class="row-item" data-cell="${k}">
        <span class="row-item__main">
          <span class="row-item__title" style="display:block">${PRAYER_NAMES[k]}</span>
          <span class="row-item__sub">${k === 'gunes' ? 'Sabah namazının çıkış vakti' : `${SALAH_NAMES[k]} namazı`}</span>
        </span>
        <span class="t-display t-num" style="font-size:19px;font-weight:550">${hhmm(t[k])}</span>
        <button class="chip ${mode !== 'off' ? 'is-on' : ''}" data-act="notify" data-k="${k}"
          style="margin-left:10px">${icon('bell', 14)} ${NOTIFY_LABEL[mode]}</button>
      </div>`;
  }).join('')}
    </div>

    <section class="card card--flush" style="margin-top:14px">
      <div class="row-between">
        <span class="t-sec">Şer’î gece yarısı</span>
        <span class="t-num t-sec" style="color:var(--ink-900);font-weight:600">${hhmm(t.geceYarisi)}</span>
      </div>
      <div class="row-between" style="margin-top:8px">
        <span class="t-sec">Hesaplama yöntemi</span>
        <span class="t-sec" style="color:var(--ink-900)">${esc(METHODS[state.prayer.method].short)}</span>
      </div>
    </section>`;
}

/* ---------------- Haftalık ---------------- */
function weeklyHtml() {
  const start = new Date();
  const rows = timesRange(start, 7);
  return `
    <div class="card card--pad0" style="margin-top:18px;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12.5px">
        <thead>
          <tr>
            <th style="text-align:left;padding:14px 12px;font-weight:600;color:var(--ink-500);font-size:11px;letter-spacing:.06em">GÜN</th>
            ${PRAYER_KEYS.map((k) => `<th style="padding:14px 6px;font-weight:600;color:var(--ink-500);font-size:11px;letter-spacing:.04em">${PRAYER_NAMES[k].toLocaleUpperCase('tr')}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr style="border-top:1px solid var(--line);${i === 0 ? 'background:var(--surface-2)' : ''}">
              <td style="padding:13px 12px;font-weight:${i === 0 ? 650 : 500}">
                ${i === 0 ? 'Bugün' : trDayShort(r.date)}
                <span style="display:block;color:var(--ink-500);font-weight:400;font-size:11px">${r.date.getDate()} ${trMonthName(r.date.getMonth()).slice(0, 3)}</span>
              </td>
              ${PRAYER_KEYS.map((k) => `<td style="padding:13px 6px;text-align:center;font-variant-numeric:tabular-nums;${i === 0 ? 'font-weight:600' : ''}">${hhmm(r.times[k])}</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ---------------- Aylık ---------------- */
function monthlyHtml() {
  const base = new Date();
  const first = new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const rows = timesRange(first, days);
  const todayKey = `${base.getFullYear()}-${base.getMonth()}-${base.getDate()}`;

  return `
    <div class="row-between" style="margin-top:18px">
      <button class="icon-btn" data-act="month-prev" aria-label="Önceki ay">${icon('back', 17)}</button>
      <p class="t-h3">${trMonthName(first.getMonth())} ${first.getFullYear()}</p>
      <button class="icon-btn" data-act="month-next" aria-label="Sonraki ay">${icon('chevron', 17)}</button>
    </div>
    <div class="card card--pad0" style="margin-top:14px;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr>
            <th style="text-align:left;padding:12px 10px;font-weight:600;color:var(--ink-500);font-size:10.5px">GÜN</th>
            ${PRAYER_KEYS.map((k) => `<th style="padding:12px 4px;font-weight:600;color:var(--ink-500);font-size:10.5px">${PRAYER_NAMES[k].slice(0, 3).toLocaleUpperCase('tr')}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map((r) => {
    const isToday = `${r.date.getFullYear()}-${r.date.getMonth()}-${r.date.getDate()}` === todayKey;
    return `
      <tr style="border-top:1px solid var(--line);${isToday ? 'background:var(--gold-soft)' : ''}">
        <td style="padding:11px 10px;font-weight:${isToday ? 650 : 500};white-space:nowrap">
          ${r.date.getDate()} <span style="color:var(--ink-500);font-weight:400">${trDayShort(r.date)}</span>
        </td>
        ${PRAYER_KEYS.map((k) => `<td style="padding:11px 4px;text-align:center;font-variant-numeric:tabular-nums">${hhmm(r.times[k])}</td>`).join('')}
      </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ------------------------------------------------------------
   Bildirim seçimi (vakit başına)
   ------------------------------------------------------------ */
function openNotifySheet(key, root) {
  const opts = [
    ['ezan', 'Ezan sesi', 'Vakit girdiğinde ezan okunur'],
    ['before15', '15 dakika önce', 'Hazırlanmak için erken haber'],
    ['before30', '30 dakika önce', 'Daha geniş zaman'],
    ['silent', 'Sadece bildirim', 'Sessiz bildirim, ses yok'],
    ['off', 'Kapalı', 'Bu vakit için bildirim gönderilmez']
  ];
  const cur = state.prayer.notify[key];
  const body = openSheet(`${PRAYER_NAMES[key]} Bildirimi`, `
    <div class="list">
      ${opts.map(([id, title, sub]) => `
        <button class="row-item" data-act="pick" data-id="${id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${title}</span>
            <span class="row-item__sub">${sub}</span>
          </span>
          ${id === cur ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>
    <p class="t-sec" style="margin-top:16px">
      Mizan günde en fazla altı vakit bildirimi gönderir. Kaçırılan ibadet için
      hatırlatma veya seri uyarısı göndermez.
    </p>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="pick"]');
    if (!n) return;
    state.prayer.notify[key] = n.dataset.id;
    commit('notify');
    closeSheet();
    paint(root);
    toast(`${PRAYER_NAMES[key]}: ${NOTIFY_LABEL[n.dataset.id]}`);
  });
}

/* ------------------------------------------------------------
   Hesaplama yöntemi ve düzeltmeler
   ------------------------------------------------------------ */
export function openMethodSheet(root) {
  const p = state.prayer;
  const body = openSheet('Hesaplama Ayarları', `
    <p class="section-title" style="margin-top:6px">Yöntem</p>
    <div class="list">
      ${Object.values(METHODS).map((m) => `
        <button class="row-item" data-act="method" data-id="${m.id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(m.name)}</span>
            <span class="row-item__sub">${esc(m.note)}</span>
          </span>
          ${m.id === p.method ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>

    <p class="section-title">İkindi Hesabı</p>
    <div class="list">
      <button class="row-item" data-act="asr" data-f="1">
        <span class="row-item__main">
          <span class="row-item__title" style="display:block">Standart</span>
          <span class="row-item__sub">Gölge boyu bir kat · Şâfiî, Mâlikî, Hanbelî</span>
        </span>
        ${p.asrFactor === 1 ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
      </button>
      <button class="row-item" data-act="asr" data-f="2">
        <span class="row-item__main">
          <span class="row-item__title" style="display:block">Hanefî</span>
          <span class="row-item__sub">Gölge boyu iki kat</span>
        </span>
        ${p.asrFactor === 2 ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
      </button>
    </div>

    <p class="section-title">Dakika Düzeltmesi</p>
    <p class="t-sec" style="margin-bottom:10px">
      Vakitleri bulunduğun yerdeki uygulamaya göre ince ayar yapabilirsin.
    </p>
    <div class="list">
      ${PRAYER_KEYS.map((k) => `
        <div class="row-item">
          <span class="row-item__main"><span class="row-item__title">${PRAYER_NAMES[k]}</span></span>
          <div class="row gap-8">
            <button class="icon-btn" data-act="adj-" data-k="${k}" aria-label="Azalt">${icon('minus', 15)}</button>
            <span class="t-num" style="min-width:42px;text-align:center" data-adj="${k}">${fmtAdj(p.adjustments[k])}</span>
            <button class="icon-btn" data-act="adj+" data-k="${k}" aria-label="Artır">${icon('plus', 15)}</button>
          </div>
        </div>`).join('')}
    </div>

    <div class="list" style="margin-top:14px">
      ${switchRow({
      title: 'Temkin payı', sub: 'Diyanet takvimindeki ihtiyat dakikaları',
      on: p.useTemkin, act: 'sw-temkin'
    })}
    </div>

    <button class="btn btn--ghost btn--block" style="margin-top:16px" data-act="reset-adj">
      ${icon('refresh', 16)} Düzeltmeleri sıfırla
    </button>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    const act = n.dataset.act;
    const p = state.prayer;

    if (act === 'method') {
      p.method = n.dataset.id;
      p.asrFactor = METHODS[p.method].asr ?? 1;
      commit('method'); invalidate(); closeSheet(); paint(root);
      toast(`${METHODS[p.method].short} yöntemi seçildi.`);
      return;
    }
    if (act === 'asr') {
      p.asrFactor = Number(n.dataset.f);
      commit('asr'); invalidate(); closeSheet(); paint(root);
      toast(p.asrFactor === 2 ? 'İkindi Hanefî hesabıyla.' : 'İkindi standart hesapla.');
      return;
    }
    if (act === 'adj+' || act === 'adj-') {
      const k = n.dataset.k;
      p.adjustments[k] = Math.max(-30, Math.min(30, p.adjustments[k] + (act === 'adj+' ? 1 : -1)));
      $(`[data-adj="${k}"]`, body).textContent = fmtAdj(p.adjustments[k]);
      commit('adj'); invalidate(); paint(root);
      return;
    }
    if (act === 'sw-temkin') {
      p.useTemkin = !p.useTemkin;
      n.querySelector('.switch').classList.toggle('is-on', p.useTemkin);
      commit('temkin'); invalidate(); paint(root);
      return;
    }
    if (act === 'reset-adj') {
      PRAYER_KEYS.forEach((k) => { p.adjustments[k] = 0; $(`[data-adj="${k}"]`, body).textContent = '0 dk'; });
      commit('adj'); invalidate(); paint(root);
      toast('Düzeltmeler sıfırlandı.');
    }
  });
}

const fmtAdj = (v) => `${v > 0 ? '+' : ''}${v} dk`;
