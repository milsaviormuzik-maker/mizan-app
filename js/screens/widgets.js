/* ============================================================
   MİZAN — Widget Galerisi
   Ana ekran ve kilit ekranı widget tasarımları.
   Veriler canlıdır; gerçek vakitlerden beslenir.
   ============================================================ */

import { el, $, esc, hhmm, hms, humanLeft, trDate, ringSvg } from '../core/ui.js';
import { icon, logo } from '../core/icons.js';
import { state } from '../core/state.js';
import { subscribeClock } from '../core/clock.js';
import { PRAYER_KEYS, PRAYER_NAMES, SALAH_NAMES } from '../core/astro.js';
import { verseOfDay } from '../data/daily.js';
import { surahName } from '../data/quran-surahs.js';
import { back } from '../core/router.js';
import { topbar } from './_blocks.js';

let unsub = null;

export const widgetScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Widget’lar')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" data-body>
            <p class="t-sec" style="margin-top:4px">
              Ana ekran ve kilit ekranı için hazırlanan tasarımlar. Veriler canlıdır.
            </p>
            <div data-widgets></div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-act="back"]')) back('/profil');
    });
  },

  onShow(root) {
    unsub?.();
    unsub = subscribeClock((ctx) => paint(root, ctx));
  },

  onHide() { unsub?.(); unsub = null; }
};

function paint(root, ctx) {
  const box = $('[data-widgets]', root);
  if (!box) return;
  const verse = verseOfDay(ctx.now, state.app.hijriOffset);
  const nextName = SALAH_NAMES[ctx.nextKey] ?? PRAYER_NAMES[ctx.nextKey];
  const nextTime = hhmm(ctx.today[ctx.nextKey] ?? ctx.tomorrow[ctx.nextKey]);

  box.innerHTML = `
    <p class="section-title">Ana Ekran</p>

    <div style="display:flex;gap:14px;align-items:flex-start">
      <div>
        <div class="wg__frame wg__frame--dark wg__frame--sm" style="width:168px">
          <div class="girih-layer girih-layer--sm"></div>
          <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between">
            <div class="row-between">
              <span style="opacity:.85">${logo(15, '#F6F2E9', '#D9BA6E')}</span>
              <span style="position:relative;color:#F6F2E9">
                ${ringSvg(ctx.progress, 26, 2.5)}
              </span>
            </div>
            <div>
              <p style="font-size:11px;font-weight:600;letter-spacing:.16em;color:#D9BA6E">${esc(nextName.toLocaleUpperCase('tr'))}</p>
              <p style="font-family:var(--font-display);font-size:30px;font-weight:300;font-variant-numeric:tabular-nums;margin-top:2px">${nextTime}</p>
              <p style="font-size:11.5px;color:rgba(246,242,233,.62);margin-top:2px">${humanLeft(ctx.remainingSec)}</p>
            </div>
          </div>
        </div>
        <p class="wg__label">Sonraki Vakit · Küçük</p>
      </div>

      <div style="flex:1">
        <div class="wg__frame" style="min-height:168px;display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <p class="t-cap" style="color:var(--gold-text)">GÜNÜN ÂYETİ</p>
            <p class="arabic" dir="rtl" style="font-size:18px;line-height:1.9;margin-top:8px;
              display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${verse.ar}</p>
          </div>
          <div>
            <p style="font-size:12.5px;line-height:1.5;color:var(--ink-700);
              display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(verse.tr)}</p>
            <p class="t-cap" style="margin-top:6px">${esc(surahName(verse.surah))} ${verse.ayah}</p>
          </div>
        </div>
        <p class="wg__label">Günün Âyeti · Orta</p>
      </div>
    </div>

    <div style="margin-top:16px">
      <div class="wg__frame">
        <div class="row-between" style="margin-bottom:14px">
          <div class="row gap-6">
            <span style="color:var(--navy)">${logo(15, 'currentColor')}</span>
            <span style="font-size:12px;font-weight:600">${esc(state.user.city)}</span>
          </div>
          <span class="t-cap">${ctx.hijri.day} ${ctx.hijri.monthName.toLocaleUpperCase('tr')}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">
          ${PRAYER_KEYS.map((k) => {
    const cur = k === ctx.currentKey, nx = k === ctx.nextKey;
    return `<div style="text-align:center;padding:9px 2px;border-radius:12px;
              ${cur ? 'background:var(--navy);color:var(--on-navy)' : nx ? 'border:1px solid var(--gold-line)' : ''}">
              <p style="font-size:9.5px;font-weight:600;letter-spacing:.04em;
                color:${cur ? 'rgba(246,242,233,.72)' : 'var(--ink-500)'}">${PRAYER_NAMES[k].toLocaleUpperCase('tr')}</p>
              <p style="font-size:12.5px;font-weight:${cur || nx ? 650 : 500};font-variant-numeric:tabular-nums;margin-top:2px;
                color:${cur ? 'var(--on-navy)' : nx ? 'var(--gold-text)' : 'var(--ink-900)'}">${hhmm(ctx.today[k])}</p>
            </div>`;
  }).join('')}
        </div>
      </div>
      <p class="wg__label">Günlük Vakitler · Orta</p>
    </div>

    ${ctx.ramadan.active ? `
      <div style="margin-top:16px">
        <div class="wg__frame wg__frame--dark">
          <div class="girih-layer girih-layer--sm"></div>
          <div class="row-between" style="position:relative">
            <div>
              <p style="font-size:11px;font-weight:600;letter-spacing:.16em;color:#D9BA6E">
                ${esc((ctx.ramadanLabel || 'İftara kalan').toLocaleUpperCase('tr'))}
              </p>
              <p style="font-family:var(--font-display);font-size:34px;font-weight:300;font-variant-numeric:tabular-nums;margin-top:4px">
                ${hms(ctx.ramadanTargetSec ?? 0)}
              </p>
              <p style="font-size:12px;color:rgba(246,242,233,.62);margin-top:4px">
                Ramazan ${ctx.ramadan.day} / ${ctx.ramadan.total}
              </p>
            </div>
            <div style="text-align:right">
              <p style="font-size:10.5px;color:rgba(246,242,233,.62)">İMSAK</p>
              <p style="font-size:15px;font-weight:600;font-variant-numeric:tabular-nums">${hhmm(ctx.today.imsak)}</p>
              <p style="font-size:10.5px;color:rgba(246,242,233,.62);margin-top:8px">İFTAR</p>
              <p style="font-size:15px;font-weight:600;font-variant-numeric:tabular-nums;color:#D9BA6E">${hhmm(ctx.today.aksam)}</p>
            </div>
          </div>
        </div>
        <p class="wg__label">İftar Sayacı · Orta (Ramazan)</p>
      </div>` : ''}

    <p class="section-title">Kilit Ekranı</p>
    <div class="wg__lock">
      <p style="font-size:12px;color:rgba(246,242,233,.6)">${trDate(ctx.now)}</p>
      <p style="font-family:var(--font-display);font-size:52px;font-weight:250;letter-spacing:-.02em;
        font-variant-numeric:tabular-nums;line-height:1.05;margin-top:2px">
        ${String(ctx.now.getHours()).padStart(2, '0')}:${String(ctx.now.getMinutes()).padStart(2, '0')}
      </p>
      <div class="row gap-12" style="margin-top:18px;align-items:center">
        <span style="position:relative;color:#F6F2E9;flex:none">
          ${ringSvg(ctx.progress, 42, 3)}
          <span style="position:absolute;inset:0;display:grid;place-items:center;color:#D9BA6E">${logo(15, 'currentColor')}</span>
        </span>
        <div class="grow" style="padding:9px 12px;background:rgba(255,255,255,.1);border-radius:14px">
          <p style="font-size:10.5px;font-weight:600;letter-spacing:.12em;color:#D9BA6E">${esc(nextName.toLocaleUpperCase('tr'))}</p>
          <p style="font-size:14px;font-weight:600;font-variant-numeric:tabular-nums">${nextTime} · ${humanLeft(ctx.remainingSec)}</p>
        </div>
      </div>
      <p style="font-size:11px;color:rgba(246,242,233,.45);margin-top:14px">
        Dairesel · satır içi · dikdörtgen kilit ekranı biçimleri desteklenir.
      </p>
    </div>
    <p class="wg__label">Kilit Ekranı · Dairesel + Dikdörtgen</p>

    <section class="card card--flush" style="margin-top:24px">
      <p class="t-sec">
        Widget’lar cihazda arka planda hesaplanır; internet bağlantısı gerektirmez.
        Premium temalar widget renk paletini de değiştirir.
      </p>
    </section>`;
}
