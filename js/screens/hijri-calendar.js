/* ============================================================
   MİZAN — Dini Takvim
   Hicri / Miladi birlikte. Kandil ve bayramlar hicri aydan hesaplanır.
   ============================================================ */

import { el, $, esc, trMonthName, trDate, relativeDays, openSheet } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state } from '../core/state.js';
import { toHijri, HIJRI_MONTHS } from '../core/astro.js';
import { upcomingDays, daysInGregorianYear, dayInfoFor, KIND_LABEL } from '../data/calendar.js';
import { back } from '../core/router.js';
import { topbar, segment } from './_blocks.js';

let view = 'aylik';
let offset = 0;

export const calendarScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Dini Takvim')}
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
      if (act === 'back') back('/ibadet');
      if (act === 'view') { view = n.dataset.id; offset = 0; paint(root); }
      if (act === 'prev') { offset -= 1; paint(root); }
      if (act === 'next') { offset += 1; paint(root); }
      if (act === 'day') openDay(new Date(Number(n.dataset.t)));
    });
  },

  onShow(root) { paint(root); }
};

function paint(root) {
  const body = $('[data-body]', root);
  const now = new Date();
  const h = toHijri(now, state.app.hijriOffset);

  body.innerHTML = `
    <section class="card" style="margin-top:4px">
      <div class="row-between">
        <div>
          <span class="card__label">Bugün</span>
          <p class="t-h2" style="margin-top:8px">${h.day} ${h.monthName} ${h.year}</p>
          <p class="t-sec" style="margin-top:2px">${trDate(now)}</p>
        </div>
        <span class="badge badge--gold">Hicri</span>
      </div>
    </section>

    <div style="margin-top:18px">
      ${segment([{ id: 'aylik', name: 'Ay Görünümü' }, { id: 'gunler', name: 'Dini Günler' }], view, 'view')}
    </div>

    ${view === 'aylik' ? monthView(now) : daysView(now)}`;
}

/* ---------------- Ay görünümü ---------------- */
function monthView(now) {
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;     // Pazartesi başlangıç

  const hStart = toHijri(first, state.app.hijriOffset);
  const hEnd = toHijri(new Date(first.getFullYear(), first.getMonth(), daysInMonth), state.app.hijriOffset);
  const hLabel = hStart.month === hEnd.month
    ? `${hStart.monthName} ${hStart.year}`
    : `${hStart.monthName} – ${hEnd.monthName} ${hEnd.year}`;

  const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span class="cal-day cal-day--pad"></span>';

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(first.getFullYear(), first.getMonth(), d);
    const hj = toHijri(date, state.app.hijriOffset);
    const ev = dayInfoFor(date);
    const isToday = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` === todayKey;
    cells += `
      <button class="cal-day ${isToday ? 'is-today' : ''} ${ev ? 'has-event' : ''} ${date.getDay() === 5 ? 'is-friday' : ''}"
        data-act="day" data-t="${date.getTime()}" aria-label="${d} ${trMonthName(date.getMonth())}">
        <span class="cal-day__g">${d}</span>
        <span class="cal-day__h">${hj.day}</span>
      </button>`;
  }

  const monthEvents = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(first.getFullYear(), first.getMonth(), d);
    const ev = dayInfoFor(date);
    if (ev) monthEvents.push(ev);
  }

  return `
    <div class="row-between" style="margin-top:18px">
      <button class="icon-btn" data-act="prev" aria-label="Önceki ay">${icon('back', 17)}</button>
      <div class="t-center">
        <p class="t-h3">${trMonthName(first.getMonth())} ${first.getFullYear()}</p>
        <p class="t-cap" style="margin-top:1px">${esc(hLabel)}</p>
      </div>
      <button class="icon-btn" data-act="next" aria-label="Sonraki ay">${icon('chevron', 17)}</button>
    </div>

    <div class="card" style="margin-top:14px">
      <div class="cal-head">
        ${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => `<span>${d}</span>`).join('')}
      </div>
      <div class="cal-grid">${cells}</div>
    </div>

    ${monthEvents.length ? `
      <p class="section-title">Bu Ay</p>
      <div class="list">
        ${monthEvents.map((ev) => `
          <button class="row-item" data-act="day" data-t="${ev.date.getTime()}">
            <span class="row-item__main">
              <span class="row-item__title" style="display:block">${esc(ev.name)}</span>
              <span class="row-item__sub">${trDate(ev.date)} · ${ev.hijri.day} ${ev.hijri.monthName}</span>
            </span>
            <span class="badge badge--gold">${KIND_LABEL[ev.kind]}</span>
          </button>`).join('')}
      </div>` : `
      <p class="t-sec t-center" style="margin-top:22px">Bu ayda özel bir dini gün bulunmuyor.</p>`}`;
}

/* ---------------- Dini günler listesi ---------------- */
function daysView(now) {
  const year = now.getFullYear() + offset;
  const list = daysInGregorianYear(year);
  return `
    <div class="row-between" style="margin-top:18px">
      <button class="icon-btn" data-act="prev" aria-label="Önceki yıl">${icon('back', 17)}</button>
      <p class="t-h3">${year}</p>
      <button class="icon-btn" data-act="next" aria-label="Sonraki yıl">${icon('chevron', 17)}</button>
    </div>
    <div class="list" style="margin-top:14px">
      ${list.map((ev) => `
        <button class="row-item" data-act="day" data-t="${ev.date.getTime()}">
          <span class="row-item__num" style="width:44px">
            <span style="display:block;text-align:center;line-height:1.15">
              <span style="font-size:14px;font-weight:650">${ev.date.getDate()}</span>
              <span style="display:block;font-size:9.5px;font-weight:500;color:var(--ink-500)">${trMonthName(ev.date.getMonth()).slice(0, 3)}</span>
            </span>
          </span>
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(ev.name)}</span>
            <span class="row-item__sub">${ev.hijri.day} ${ev.hijri.monthName} ${ev.hijri.year} · ${relativeDays(ev.date, now)}</span>
          </span>
          <span class="badge ${ev.kind === 'kandil' || ev.kind === 'bayram' ? 'badge--gold' : ''}">${KIND_LABEL[ev.kind]}</span>
        </button>`).join('')}
    </div>`;
}

/* ---------------- Gün detayı ---------------- */
function openDay(date) {
  const h = toHijri(date, state.app.hijriOffset);
  const ev = dayInfoFor(date);
  const next = upcomingDays(date, 1)[0];

  openSheet(trDate(date), `
    <div class="card card--flush">
      <div class="row-between">
        <span class="t-sec">Hicri</span>
        <span class="t-sec" style="color:var(--ink-900);font-weight:600">${h.day} ${h.monthName} ${h.year}</span>
      </div>
      <div class="row-between" style="margin-top:8px">
        <span class="t-sec">Gün</span>
        <span class="t-sec" style="color:var(--ink-900);font-weight:600">${['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][date.getDay()]}</span>
      </div>
    </div>

    ${ev ? `
      <section class="card" style="margin-top:14px;border-color:var(--gold-line)">
        <div class="row-between">
          <span class="card__label">${KIND_LABEL[ev.kind]}</span>
          <span class="badge badge--gold">${relativeDays(ev.date)}</span>
        </div>
        <p class="t-h3" style="margin-top:10px">${esc(ev.name)}</p>
        ${ev.desc ? `<p class="t-body" style="margin-top:7px;color:var(--ink-700)">${esc(ev.desc)}</p>` : ''}
        ${ev.src ? `<p class="source" style="margin-top:10px">${esc(ev.src)}</p>` : ''}
        ${ev.eve ? `<p class="rivayet-not">
          ${esc(ev.geceNotu)} Yani <strong>${esc(trDate(ev.eve))}</strong> akşamı.
        </p>` : ''}
      </section>` : `
      <p class="t-sec" style="margin-top:18px">Bu güne ait özel bir dini gün kaydı yok.</p>
      ${next ? `<p class="t-sec" style="margin-top:8px">
        Sıradaki: <strong>${esc(next.name)}</strong> · ${trDate(next.date)}</p>` : ''}`}

    <p class="t-cap" style="margin-top:22px;text-transform:none;letter-spacing:0;line-height:1.5">
      Hicri tarihler Diyanet’in ilan ettiği ay başlarına göre kalibre edilmiştir.
      Gözleme dayalı takvimlerde bir günlük fark görülebilir; Profil › İbadet
      bölümünden düzeltme yapabilirsin.
    </p>`);
}
