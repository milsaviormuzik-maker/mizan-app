/* ============================================================
   MİZAN — İBADET (araç ızgarası)
   ============================================================ */

import { el, $, esc, hhmm } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state } from '../core/state.js';
import { subscribeClock } from '../core/clock.js';
import { PRAYER_NAMES, SALAH_NAMES } from '../core/astro.js';
import { go } from '../core/router.js';
import { upcomingDays } from '../data/calendar.js';
import { relativeDays } from '../core/ui.js';

let unsub = null;

const TOOLS = [
  { path: '/ibadet/vakitler', ic: 'clock', name: 'Namaz Vakitleri', sub: 'Günlük · haftalık · aylık' },
  { path: '/ibadet/kible', ic: 'compass', name: 'Kıble', sub: 'Kâbe yönü ve pusula' },
  { path: '/ibadet/tesbih', ic: 'beads', name: 'Dijital Tesbih', sub: 'Zikir ve sayaç' },
  { path: '/ibadet/zekat', ic: 'calculator', name: 'Zekât Hesaplayıcı', sub: 'Nisap ve tahmini tutar' },
  { path: '/ibadet/takip', ic: 'chart', name: 'Kaza ve Takip', sub: 'İstersen kapatabilirsin' },
  { path: '/ibadet/takvim', ic: 'calendar', name: 'Dini Takvim', sub: 'Hicri takvim ve kandiller' },
  { path: '/ibadet/camiler', ic: 'mosque', name: 'Yakındaki Camiler', sub: 'Konum izniyle çalışır' }
];

export const worshipScreen = {
  render() {
    return el(`
      <div class="screen">
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar stagger" style="padding-top:58px">
            <h1 class="t-h1">İbadet</h1>
            <p class="t-sec" style="margin-top:6px">${esc(state.user.city)} için hesaplanıyor</p>

            <section class="card card--tap" style="margin-top:18px" data-act="times">
              <div class="row-between">
                <div class="grow">
                  <span class="card__label">Sıradaki Vakit</span>
                  <p class="t-h2" style="margin-top:8px" data-next>—</p>
                  <p class="t-sec" style="margin-top:2px" data-left>—</p>
                </div>
                <p class="t-display t-num" style="font-size:30px;font-weight:300" data-time>—</p>
              </div>
              <div class="progress" style="margin-top:16px"><div class="progress__fill" data-prog style="width:0%"></div></div>
            </section>

            <p class="section-title">Araçlar</p>
            <div class="tool-grid">
              ${TOOLS.map((t) => `
                <button class="tool" data-act="go" data-path="${t.path}">
                  <span class="tool__icon">${icon(t.ic, 20)}</span>
                  <span class="tool__name">${esc(t.name)}</span>
                  <span class="tool__sub">${esc(t.sub)}</span>
                </button>`).join('')}
            </div>

            <p class="section-title">Yaklaşan Günler</p>
            <div class="list" data-upcoming></div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'go') go(n.dataset.path);
      if (n.dataset.act === 'times') go('/ibadet/vakitler');
      if (n.dataset.act === 'calendar') go('/ibadet/takvim');
    });
  },

  onShow(root) {
    unsub?.();
    unsub = subscribeClock((ctx) => {
      if (!root.isConnected || !$('[data-next]', root)) return;
      const name = SALAH_NAMES[ctx.nextKey] ?? PRAYER_NAMES[ctx.nextKey];
      $('[data-next]', root).textContent = ctx.nextKey === 'gunes' ? 'Güneş' : `${name} Namazı`;
      $('[data-time]', root).textContent = hhmm(ctx.today[ctx.nextKey] ?? ctx.tomorrow[ctx.nextKey]);
      const h = Math.floor(ctx.remainingSec / 3600);
      const m = Math.floor((ctx.remainingSec % 3600) / 60);
      $('[data-left]', root).textContent = h > 0 ? `${h} saat ${m} dakika kaldı` : `${m} dakika kaldı`;
      $('[data-prog]', root).style.width = `${(ctx.progress * 100).toFixed(1)}%`;
    });

    const up = $('[data-upcoming]', root);
    up.innerHTML = upcomingDays(new Date(), 4).map((d) => `
      <button class="row-item" data-act="calendar">
        <span class="row-item__main">
          <span class="row-item__title" style="display:block">${esc(d.name)}</span>
          <span class="row-item__sub">${d.date.getDate()} ${['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'][d.date.getMonth()]} ${d.date.getFullYear()}</span>
        </span>
        <span class="row-item__value">${esc(relativeDays(d.date))}</span>
      </button>`).join('');
  },

  onHide() { unsub?.(); unsub = null; }
};
