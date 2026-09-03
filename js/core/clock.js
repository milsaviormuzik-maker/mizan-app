/* ============================================================
   MİZAN — Zaman bağlamı
   Tek bir hesap noktası: vakitler, sonraki vakit, geri sayım,
   hicri tarih, Ramazan durumu ve atmosfer dilimi.
   Saniyede bir abone uyandırır; ekranlar kendi hesabını yapmaz.
   ============================================================ */

import {
  computePrayerTimes, resolveCurrentPrayer, toHijri, ramadanState, PRAYER_KEYS
} from './astro.js';
import { state } from './state.js';
import { atmosPhaseFor } from './ui.js';

const listeners = new Set();
let ctx = null;
let lastDayKey = '';
let timer = null;

const keyOf = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function prayerOpts() {
  return {
    method: state.prayer.method,
    asrFactor: state.prayer.asrFactor,
    useTemkin: state.prayer.useTemkin,
    adjustments: state.prayer.adjustments
  };
}

/** Belirli bir gün için vakitleri hesapla */
export function timesFor(date, coords = state.user.coords) {
  return computePrayerTimes(date, coords, prayerOpts());
}

/** Tam bağlamı yeniden kur */
export function rebuild(now = new Date()) {
  const coords = state.user.coords;
  const offset = state.app.hijriOffset;

  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const today = timesFor(now, coords);
  const next = timesFor(tomorrow, coords);
  const prev = timesFor(yesterday, coords);

  const cur = resolveCurrentPrayer(now, today, next);
  const hijri = toHijri(now, offset);
  const ram = ramadanState(now, offset);
  if (state.app.ramadanPreview) { ram.active = true; if (!ram.day) { ram.day = 17; ram.total = 30; } }

  const phase = atmosPhaseFor(cur.currentKey, cur.progress);

  // Ramazan geri sayımı: imsak öncesi sahura, gündüz iftara
  const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  let ramTarget = null, ramLabel = '';
  if (ram.active) {
    if (mins < today.imsak) {
      ramTarget = today.imsak; ramLabel = 'İmsağa kalan';
    } else if (mins < today.aksam) {
      ramTarget = today.aksam; ramLabel = 'İftara kalan';
    } else {
      ramTarget = 1440 + next.imsak; ramLabel = 'İmsağa kalan';
    }
  }

  ctx = {
    now, coords, today, tomorrow: next, yesterday: prev,
    hijri, ramadan: ram, phase,
    ...cur,
    ramadanTargetSec: ramTarget != null ? Math.max(0, Math.round((ramTarget - mins) * 60)) : null,
    ramadanLabel: ramLabel,
    dayKey: keyOf(now)
  };
  lastDayKey = ctx.dayKey;
  return ctx;
}

export const now = () => ctx ?? rebuild();

export function subscribeClock(fn) {
  listeners.add(fn);
  if (ctx) fn(ctx);
  return () => listeners.delete(fn);
}

/** Ayar değişince (şehir, yöntem, düzeltme) bağlamı tazele */
export function invalidate() {
  rebuild(new Date());
  listeners.forEach((fn) => fn(ctx));
}

export function startClock() {
  rebuild(new Date());
  listeners.forEach((fn) => fn(ctx));
  clearInterval(timer);
  timer = setInterval(() => {
    const n = new Date();
    // Gün değiştiyse ya da vakit geçtiyse tam yeniden hesap
    const passed = ctx && (n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60) >= (ctx.nextAt ?? 1e9);
    if (!ctx || keyOf(n) !== lastDayKey || passed) rebuild(n);
    else {
      const mins = n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60;
      ctx.now = n;
      ctx.remainingSec = Math.max(0, Math.round((ctx.nextAt - mins) * 60));
      const span = ctx.nextAt - ctx.currentAt;
      ctx.progress = span > 0 ? Math.min(1, Math.max(0, (mins - ctx.currentAt) / span)) : 0;
      if (ctx.ramadanTargetSec != null) ctx.ramadanTargetSec = Math.max(0, ctx.ramadanTargetSec - 1);
    }
    listeners.forEach((fn) => fn(ctx));
  }, 1000);
}

/** Haftalık / aylık tablo için toplu hesap */
export function timesRange(startDate, days, coords = state.user.coords) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    out.push({ date: d, times: timesFor(d, coords) });
  }
  return out;
}

export { PRAYER_KEYS };
