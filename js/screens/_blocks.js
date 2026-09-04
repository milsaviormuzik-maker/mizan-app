/* ============================================================
   MİZAN — Paylaşılan kart blokları
   Aynı içerik türü uygulamanın her yerinde AYNI görünür.
   ============================================================ */

import { icon } from '../core/icons.js';
import { esc } from '../core/ui.js';
import { state } from '../core/state.js';
import { surahName } from '../data/quran-surahs.js';

const isSaved = (ref) => state.quran.saved.includes(ref);

/** Kartın dört köşesine markanın deseni — silik, yavaşça dönen.
 *  Kartın `card--desenli` sınıfını alması gerekir (taşmayı kırpar). */
export function desenKoseleri() {
  return ['su', 'sa', 'au', 'aa']
    .map((k) => `<span class="desen-kose desen-kose--${k}" aria-hidden="true"></span>`)
    .join('');
}

/* ---------------- Günün Ayeti ---------------- */
export function verseCard(verse, opts = {}) {
  const ref = `${verse.surah}:${verse.ayah}`;
  return `
  <section class="card card--verse card--desenli" data-verse="${ref}">
    ${desenKoseleri()}
    <div class="card__head">
      <span class="card__label">${opts.label ?? 'Günün Âyeti'}</span>
      <span class="card__ref">${esc(surahName(verse.surah))} · ${verse.ayah}</span>
    </div>
    <p class="arabic arabic--feature" dir="rtl" lang="ar">${verse.ar}</p>
    <div class="ornament" aria-hidden="true"><span class="ornament__mark"></span></div>
    <p class="t-body t-center">${esc(verse.tr)}</p>
    ${verse.tl ? `<p class="translit t-center" style="margin-top:10px">${esc(verse.tl)}</p>` : ''}
    <div class="card__actions">
      <button class="chip" data-act="verse-listen" data-ref="${ref}">${icon('play', 16)} Dinle</button>
      <button class="chip" data-act="verse-tafsir" data-ref="${ref}">${icon('book', 16)} Tefsir</button>
      <button class="chip ${isSaved(ref) ? 'is-on' : ''}" data-act="verse-save" data-ref="${ref}">
        ${icon('bookmark', 16)} ${isSaved(ref) ? 'Kayıtlı' : 'Kaydet'}
      </button>
      <button class="chip chip--icon" data-act="verse-share" data-ref="${ref}"
        aria-label="Paylaş" title="Paylaş">${icon('share', 16)}</button>
    </div>
  </section>`;
}

/* ---------------- Günün Hadisi ---------------- */
export function hadithCard(hadith, opts = {}) {
  return `
  <section class="card">
    <div class="card__head">
      <span class="card__label">${opts.label ?? 'Günün Hadisi'}</span>
    </div>
    <p class="t-body" style="font-size:16px;line-height:1.62">“${esc(hadith.text)}”</p>
    <p class="source" style="margin-top:10px">${esc(hadith.src)}</p>
    ${hadith.derece ? `<p class="rivayet-not">${esc(hadith.derece)}</p>` : ''}
    ${hadith.note ? `
      <div class="card--flush" style="margin-top:14px;padding:13px 14px;border-radius:var(--r-md)">
        <p class="t-sec">${esc(hadith.note)}</p>
      </div>` : ''}
    <div class="card__actions">
      <button class="chip" data-act="hadith-save" data-id="${hadith.id}">${icon('save', 15)} Kaydet</button>
      <button class="chip" data-act="hadith-share" data-id="${hadith.id}">${icon('share', 15)} Paylaş</button>
    </div>
  </section>`;
}

/* ---------------- Günün Duası ---------------- */
export function duaCard(dua, opts = {}) {
  return `
  <section class="card">
    <div class="card__head">
      <span class="card__label">${esc(opts.label ?? 'Günün Duası')}</span>
      ${opts.label ? '' : `<span class="badge">${esc(dua.title)}</span>`}
    </div>
    <p class="arabic" dir="rtl" lang="ar" style="font-size:24px">${dua.ar}</p>
    <p class="translit" style="margin-top:14px">${esc(dua.tl)}</p>
    <hr class="divider" style="margin:14px 0">
    <p class="t-body">${esc(dua.tr)}</p>
    <p class="source" style="margin-top:10px">${esc(dua.src)}</p>
    ${dua.derece ? `<p class="rivayet-not">${esc(dua.derece)}</p>` : ''}
    <div class="card__actions">
      ${dua.ayah ? `<button class="chip" data-act="dua-listen" data-id="${dua.id}">${icon('volume', 15)} Sesli Dinle</button>` : ''}
      <button class="chip" data-act="dua-share" data-id="${dua.id}">${icon('share', 15)} Paylaş</button>
    </div>
  </section>`;
}

/* ---------------- Liste satırı ---------------- */
export function listRow({ title, sub, value, badge, act, data = {}, num, chevron = true }) {
  const attrs = Object.entries(data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ');
  return `
  <button class="row-item" ${act ? `data-act="${act}"` : ''} ${attrs}>
    ${num != null ? `<span class="row-item__num">${num}</span>` : ''}
    <span class="row-item__main">
      <span class="row-item__title" style="display:block">${esc(title)}</span>
      ${sub ? `<span class="row-item__sub" style="display:block">${esc(sub)}</span>` : ''}
    </span>
    ${badge ? `<span class="badge">${esc(badge)}</span>` : ''}
    ${value ? `<span class="row-item__value">${esc(value)}</span>` : ''}
    ${chevron ? `<span class="row-item__chev">${icon('chevron', 16)}</span>` : ''}
  </button>`;
}

/* ---------------- Üst bar ---------------- */
export function topbar(title, opts = {}) {
  return `
  <header class="topbar">
    <div class="topbar__side">
      ${opts.noBack ? '' : `<button class="icon-btn icon-btn--bare" data-act="back" aria-label="Geri">${icon('back', 20)}</button>`}
    </div>
    <h1 class="topbar__title">${esc(title)}</h1>
    <div class="topbar__side topbar__side--end">
      ${opts.action ?? ''}
    </div>
  </header>`;
}

/* ---------------- Anahtar satırı ---------------- */
export function switchRow({ title, sub, on, act, data = {} }) {
  const attrs = Object.entries(data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ');
  return `
  <button class="row-item" data-act="${act}" ${attrs}>
    <span class="row-item__main">
      <span class="row-item__title" style="display:block">${esc(title)}</span>
      ${sub ? `<span class="row-item__sub" style="display:block">${esc(sub)}</span>` : ''}
    </span>
    <span class="switch ${on ? 'is-on' : ''}" role="switch" aria-checked="${on}"></span>
  </button>`;
}

/* ---------------- Segment ---------------- */
export function segment(items, activeId, act) {
  // Kısa listeler taşmaz; kenar sönümlemesi yalnızca kaydırma gerektiğinde
  const fit = items.length <= 3 ? ' segment--fit' : '';
  return `<div class="segment${fit}" role="tablist">
    ${items.map((it) => `
      <button class="segment__item ${it.id === activeId ? 'is-on' : ''}"
        role="tab" aria-selected="${it.id === activeId}"
        data-act="${act}" data-id="${esc(it.id)}">${esc(it.name)}</button>`).join('')}
  </div>`;
}

/* ---------------- Boş durum ---------------- */
export function empty(text, actionLabel, act) {
  return `<div class="empty">
    <p class="empty__text">${esc(text)}</p>
    ${actionLabel ? `<button class="btn btn--secondary btn--sm" data-act="${act}">${esc(actionLabel)}</button>` : ''}
  </div>`;
}
