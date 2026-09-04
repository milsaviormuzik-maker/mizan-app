/* ============================================================
   MİZAN — UI çekirdeği: biçimlendirme, alt sayfa, bildirim, atmosfer
   ============================================================ */

import { PRAYER_NAMES, SALAH_NAMES } from './astro.js';
import { state } from './state.js';

/* ------------------------------------------------------------
   DOM
   ------------------------------------------------------------ */
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** Güvenli metin — kullanıcı verisi HTML'e girmeden önce */
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/** Delegasyonlu tıklama — [data-act] üzerinden */
export function onAct(root, handlers) {
  root.addEventListener('click', (e) => {
    const node = e.target.closest('[data-act]');
    if (!node || !root.contains(node)) return;
    const fn = handlers[node.dataset.act];
    if (fn) { e.preventDefault(); fn(node, e); }
  });
}

/* ------------------------------------------------------------
   Biçimlendirme
   ------------------------------------------------------------ */
const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const TR_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const TR_DAYS_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export const trDate = (d) => `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
export const trDateShort = (d) => `${d.getDate()} ${TR_MONTHS[d.getMonth()].slice(0, 3)}`;
export const trDayName = (d) => TR_DAYS[d.getDay()];
export const trDayShort = (d) => TR_DAYS_SHORT[d.getDay()];
export const trMonthName = (i) => TR_MONTHS[i];

/** Dakika (gece yarısından) → "19:42" */
export function hhmm(minutes) {
  if (minutes == null || !isFinite(minutes)) return '--:--';
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** Saniye → "01:42:18" */
export function hms(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/** Saniye → "1 sa 21 dk" */
export function humanLeft(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} sa ${m} dk`;
  if (m > 0) return `${m} dk`;
  return `${s} sn`;
}

/** Gün farkı → "3 gün sonra" / "Bugün" / "Yarın" */
export function relativeDays(target, from = new Date()) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const n = Math.round((b - a) / 86400000);
  if (n === 0) return 'Bugün';
  if (n === 1) return 'Yarın';
  if (n === -1) return 'Dün';
  return n > 0 ? `${n} gün sonra` : `${-n} gün önce`;
}

export const trNumber = (n, digits = 0) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
export const trMoney = (n) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);

export const prayerName = (k) => PRAYER_NAMES[k] || k;
export const salahName = (k) => SALAH_NAMES[k] || PRAYER_NAMES[k] || k;

/* ------------------------------------------------------------
   ALT SAYFA (sheet)
   ------------------------------------------------------------ */
let sheetEl, scrimEl, sheetTitleEl, sheetBodyEl, sheetCloseCb = null;

export function initSheet(root) {
  scrimEl = el('<div class="sheet-scrim" role="presentation"></div>');
  sheetEl = el(`
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="sheet__grip"></div>
      <div class="sheet__head">
        <h2 class="sheet__title" id="sheet-title"></h2>
        <button class="icon-btn" data-sheet-close aria-label="Kapat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
            stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="sheet__body scroll"></div>
    </div>`);
  sheetTitleEl = $('.sheet__title', sheetEl);
  sheetBodyEl = $('.sheet__body', sheetEl);
  root.append(scrimEl, sheetEl);

  scrimEl.addEventListener('click', closeSheet);
  sheetEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-sheet-close]')) closeSheet();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
}

export function openSheet(title, html, opts = {}) {
  sheetTitleEl.textContent = title;

  // Gövde her açılışta tazelenir: önceki alt sayfanın olay dinleyicileri
  // aynı düğümde birikip bayat ekranlara erişmesin.
  const fresh = sheetBodyEl.cloneNode(false);
  sheetBodyEl.replaceWith(fresh);
  sheetBodyEl = fresh;

  sheetBodyEl.innerHTML = html;
  sheetBodyEl.scrollTop = 0;
  scrimEl.classList.add('is-open');
  sheetEl.classList.add('is-open');
  sheetCloseCb = opts.onClose || null;
  if (opts.onMount) opts.onMount(sheetBodyEl);
  return sheetBodyEl;
}

export function closeSheet() {
  if (!sheetEl?.classList.contains('is-open')) return;
  scrimEl.classList.remove('is-open');
  sheetEl.classList.remove('is-open');
  const cb = sheetCloseCb; sheetCloseCb = null;
  if (cb) cb();
}

export const sheetBody = () => sheetBodyEl;
export const isSheetOpen = () => sheetEl?.classList.contains('is-open');

/* ------------------------------------------------------------
   BİLDİRİM (toast) — sakin, tek satır, 2.4 sn
   ------------------------------------------------------------ */
let toastHost;
export function initToast(root) {
  toastHost = el('<div class="toast-host" aria-live="polite"></div>');
  root.append(toastHost);
}
export function toast(message) {
  if (!toastHost) return;
  const t = el(`<div class="toast">${esc(message)}</div>`);
  toastHost.append(t);
  setTimeout(() => {
    t.classList.add('is-out');
    setTimeout(() => t.remove(), 240);
  }, 2400);
}

/* ------------------------------------------------------------
   ATMOSFER — vakte göre kayan başlık zemini
   Doygunluk düşük tutulur; amaç hissettirmek, göstermek değil.
   ------------------------------------------------------------ */
/* Atmosfer artık sayfadan kopuk bir blok değil; zeminin kendisidir.
   Bu yüzden her iki temada da renkler SAYFA AİLESİNDEN seçilir —
   koyuda derin lacivert, açıkta sıcak krem. Vakit değişimi tonu
   kaydırır, kontrastı değil. */
const ATMOS = {
  gece:   { light: ['#E7E0D0', '#F6F1E6'], dark: ['#0E1A2E', '#080E19'] },
  sabah:  { light: ['#E6DFD0', '#F6F1E6'], dark: ['#12203A', '#0A1220'] },
  kusluk: { light: ['#EAE4D6', '#F7F2E9'], dark: ['#152741', '#0B1322'] },
  ogle:   { light: ['#EEE8DB', '#F7F2E9'], dark: ['#16294A', '#0B1322'] },
  ikindi: { light: ['#EFE4CE', '#F7F2E9'], dark: ['#1C2540', '#0A1220'] },
  aksam:  { light: ['#E8DDCC', '#F6F1E6'], dark: ['#181A38', '#090C18'] }
};

/** Şu anki vakit anahtarından atmosfer dilimini seç */
export function atmosPhaseFor(currentKey, progress = 0) {
  switch (currentKey) {
    case 'imsak': return 'sabah';
    case 'gunes': return progress > 0.55 ? 'ogle' : 'kusluk';
    case 'ogle': return 'ogle';
    case 'ikindi': return 'ikindi';
    case 'aksam': return 'aksam';
    default: return 'gece';
  }
}

export function applyAtmosphere(phase) {
  // Kök öznitelik yerine durumdan okunur: tema değiştiğinde abonelerin
  // sırası özniteliği bir adım geride bırakabiliyor.
  const t = state.app.theme;
  const isDark = t === 'dark' ||
    (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  const spec = ATMOS[phase] || ATMOS.gece;
  const [a, b] = isDark ? spec.dark : spec.light;

  // Mürekkep zeminle birlikte gelir: koyuda sıcak fildişi, açıkta lacivert.
  // Altın açık zeminde küçük metin için yeterli kontrast vermez (§9).
  const ink = isDark ? '#EDE3D0' : '#16202F';
  const accent = isDark ? '#C9A961' : '#8A6B22';

  const r = document.documentElement.style;
  r.setProperty('--atmos-a', a);
  r.setProperty('--atmos-b', b);
  r.setProperty('--atmos-ink', ink);
  r.setProperty('--atmos-ink-dim', hexAlpha(ink, isDark ? 0.58 : 0.62));
  r.setProperty('--atmos-accent', accent);
  r.setProperty('--atmos-veil', isDark ? 'rgba(237,227,208,.055)' : 'rgba(22,32,47,.045)');
}

function hexAlpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/* ------------------------------------------------------------
   Halka (kalan süre görselleştirmesi)
   ------------------------------------------------------------ */
export function ringSvg(progress, size = 56, stroke = 4) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(1, Math.max(0, progress)));
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <circle class="ring__track" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
    <circle class="ring__fill" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"
      stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/>
  </svg>`;
}

/* ------------------------------------------------------------
   Titreşim (tesbih) — destekleyen cihazlarda
   ------------------------------------------------------------ */
export function haptic(ms = 12) {
  if (navigator.vibrate) { try { navigator.vibrate(ms); } catch { /* yok say */ } }
}
