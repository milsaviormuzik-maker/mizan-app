/* ============================================================
   MİZAN — KUR'AN (kök ekran)
   Sureler · Cüzler · Kayıtlı · Yer İmleri · Hatim
   ============================================================ */

import { el, $, $$, esc, trDate, openSheet, closeSheet, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state, commit } from '../core/state.js';
import { go } from '../core/router.js';
import { SURAHS, JUZ, surahName, surahByNo, juzOf, MEALS } from '../data/quran-surahs.js';
import { VERSES, verseAt, searchVerses } from '../data/quran-verses.js';
import { segment, empty } from './_blocks.js';
import { openVerseMenu, sharedActions } from './_actions.js';

const TABS = [
  { id: 'sureler', name: 'Sureler' },
  { id: 'cuzler', name: 'Cüzler' },
  { id: 'kayitli', name: 'Kayıtlı' },
  { id: 'imler', name: 'Yer İmleri' },
  { id: 'hatim', name: 'Hatim' }
];

let activeTab = 'sureler';
let query = '';

/* ------------------------------------------------------------
   Son kaldığın yer
   ------------------------------------------------------------ */
function resumeCard() {
  const { surah, ayah } = state.quran.lastRead;
  const s = surahByNo(surah);
  return `
  <section class="card card--tap card--dark" data-act="resume" style="background:var(--navy)">
    <div class="row-between">
      <div class="grow">
        <span class="card__label" style="color:var(--gold)">Son kaldığın yer</span>
        <p class="t-h2" style="margin-top:10px;color:var(--on-navy)">${esc(s.tr)} Sûresi</p>
        <p style="font-size:14px;color:var(--on-navy-dim);margin-top:2px">
          ${ayah}. âyet · ${juzOf(surah, ayah)}. cüz
        </p>
      </div>
      <span class="arabic" style="font-size:30px;color:var(--gold);opacity:.9;line-height:1">${s.ar}</span>
    </div>
    <button class="btn btn--gold btn--block" style="margin-top:18px;height:46px" data-act="resume">
      Devam Et ${icon('chevron', 16)}
    </button>
  </section>`;
}

/* ------------------------------------------------------------
   Sure listesi
   ------------------------------------------------------------ */
function surahList() {
  const q = query.trim().toLocaleLowerCase('tr');
  const list = q
    ? SURAHS.filter((s) =>
      s.tr.toLocaleLowerCase('tr').includes(q) ||
      s.meaning.toLocaleLowerCase('tr').includes(q) ||
      String(s.no) === q)
    : SURAHS;

  const results = q.length >= 2 ? searchVerses(q, 8) : [];

  return `
    ${results.length ? `
      <p class="section-title" style="margin-top:18px">Âyet Sonuçları</p>
      <div class="list">
        ${results.map((r) => `
          <button class="row-item" data-act="open-ayah" data-s="${r.surah}" data-a="${r.ayah}">
            <span class="row-item__main">
              <span class="row-item__title" style="display:block;font-size:14.5px">${esc(r.tr.slice(0, 92))}${r.tr.length > 92 ? '…' : ''}</span>
              <span class="row-item__sub">${esc(surahName(r.surah))} ${r.ayah}</span>
            </span>
            <span class="row-item__chev">${icon('chevron', 16)}</span>
          </button>`).join('')}
      </div>` : ''}

    <p class="section-title">${q ? 'Sureler' : `114 Sûre`}</p>
    ${list.length ? `<div class="list">
      ${list.map((s) => `
        <button class="row-item" data-act="open-surah" data-no="${s.no}">
          <span class="row-item__num">${s.no}</span>
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(s.tr)}</span>
            <span class="row-item__sub">${esc(s.meaning)} · ${s.ayahs} âyet · ${s.type}</span>
          </span>
          <span class="arabic" style="font-size:19px;line-height:1;color:var(--ink-700)">${s.ar}</span>
        </button>`).join('')}
    </div>` : empty('Aramanla eşleşen sûre bulunamadı.')}`;
}

/* ------------------------------------------------------------
   Cüz listesi
   ------------------------------------------------------------ */
function juzList() {
  return `
    <p class="section-title">30 Cüz</p>
    <div class="list">
      ${JUZ.map((j) => `
        <button class="row-item" data-act="open-ayah" data-s="${j.start.surah}" data-a="${j.start.ayah}">
          <span class="row-item__num">${j.no}</span>
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${j.no}. Cüz</span>
            <span class="row-item__sub">${esc(j.startLabel)} ile başlar</span>
          </span>
          <span class="row-item__chev">${icon('chevron', 16)}</span>
        </button>`).join('')}
    </div>`;
}

/* ------------------------------------------------------------
   Kayıtlı âyetler / Yer imleri
   ------------------------------------------------------------ */
function refList(refs, emptyText) {
  if (!refs.length) return empty(emptyText);
  return `<div class="stack" style="margin-top:18px">
    ${refs.map((ref) => {
    const [s, a] = ref.split(':').map(Number);
    const v = verseAt(s, a);
    if (!v) return '';
    return `
      <section class="card card--tap" data-act="open-ayah" data-s="${s}" data-a="${a}">
        <div class="row-between" style="margin-bottom:12px">
          <span class="badge">${esc(surahName(s))} ${a}</span>
          <button class="ayah__tool" data-act="ref-menu" data-ref="${ref}" aria-label="Seçenekler">${icon('more', 16)}</button>
        </div>
        <p class="arabic" dir="rtl" lang="ar" style="font-size:23px">${v.ar}</p>
        <p class="t-body" style="margin-top:12px;color:var(--ink-700)">${esc(v.tr)}</p>
      </section>`;
  }).join('')}
  </div>`;
}

/* ------------------------------------------------------------
   Hatim — puan/rozet yok, sade ilerleme
   ------------------------------------------------------------ */
function khatmPanel() {
  const k = state.khatm.active;
  if (!k) {
    return `${empty('Şu anda aktif bir hatmin yok.', 'Hatim Başlat', 'start-khatm')}`;
  }
  const pct = Math.round((k.juzDone / 30) * 100);
  const started = new Date(k.startedAt);
  const dayCount = Math.max(1, Math.round((Date.now() - started) / 86400000) + 1);
  const perDay = 30 / k.targetDays;
  const expected = Math.min(30, Math.round(perDay * dayCount * 10) / 10);
  const diff = Math.round((k.juzDone - expected) * 10) / 10;

  return `
    <section class="card" style="margin-top:18px">
      <div class="row-between">
        <span class="card__label">Aktif Hatim</span>
        <span class="badge">${k.targetDays} günlük</span>
      </div>
      <div class="row-between" style="margin-top:18px;align-items:flex-end">
        <div>
          <p class="t-count" style="font-size:44px">${k.juzDone}<span style="font-size:22px;color:var(--ink-300)"> / 30</span></p>
          <p class="t-sec" style="margin-top:2px">cüz tamamlandı</p>
        </div>
        <p class="t-display t-num" style="font-size:26px;font-weight:300;color:var(--gold-text)">%${pct}</p>
      </div>
      <div class="progress" style="margin-top:16px"><div class="progress__fill" style="width:${pct}%"></div></div>
      <div class="row-between" style="margin-top:14px">
        <span class="t-sec">Başlangıç: ${trDate(started)}</span>
        <span class="t-sec">${diff >= 0 ? 'Planın önündesin' : `${Math.abs(diff)} cüz geride`}</span>
      </div>
      <div class="card__actions">
        <button class="chip" data-act="khatm-inc">${icon('plus', 15)} Cüz tamamlandı</button>
        <button class="chip" data-act="khatm-dec">${icon('minus', 15)} Geri al</button>
        <button class="chip" data-act="khatm-new">${icon('refresh', 15)} Yeni hatim</button>
      </div>
    </section>

    <section class="card card--flush" style="margin-top:14px">
      <p class="t-sec" style="color:var(--ink-700)">
        Mizan’da hatim takibi bir yarış değildir. Puan, rozet ve seri sayacı yoktur;
        yalnızca nerede olduğunu görürsün.
      </p>
    </section>

    <p class="section-title">Cüzler</p>
    <div class="list">
      ${JUZ.map((j) => {
    const done = j.no <= k.juzDone;
    return `
      <button class="row-item" data-act="open-ayah" data-s="${j.start.surah}" data-a="${j.start.ayah}">
        <span class="row-item__num" style="${done ? 'background:var(--gold-soft);color:#7A6220' : ''}">${j.no}</span>
        <span class="row-item__main">
          <span class="row-item__title" style="display:block">${j.no}. Cüz</span>
          <span class="row-item__sub">${esc(j.startLabel)}</span>
        </span>
        ${done ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : `<span class="row-item__chev">${icon('chevron', 16)}</span>`}
      </button>`;
  }).join('')}
    </div>`;
}

/* ============================================================
   Ekran
   ============================================================ */
export const quranScreen = {
  render() {
    return el(`
      <div class="screen">
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" style="padding-top:58px">
            <h1 class="t-h1">Kur’an-ı Kerim</h1>
            <div class="search" style="margin-top:16px">
              ${icon('search', 16)}
              <input type="text" placeholder="Sûre veya meal içinde ara" data-q aria-label="Ara">
            </div>
            <div style="margin-top:16px">${resumeCard()}</div>
            <div style="margin-top:18px">${segment(TABS, activeTab, 'tab')}</div>
            <div data-panel></div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    const input = $('[data-q]', root);
    input.addEventListener('input', () => {
      query = input.value;
      if (query && activeTab !== 'sureler') activeTab = 'sureler';
      repaint(root);
    });

    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      switch (act) {
        case 'tab':
          activeTab = n.dataset.id;
          $$('.segment__item', root).forEach((b) => b.classList.toggle('is-on', b.dataset.id === activeTab));
          repaint(root, true);
          break;
        case 'resume': {
          const { surah, ayah } = state.quran.lastRead;
          go(`/kuran/oku/${surah}/${ayah}`);
          break;
        }
        case 'open-surah': go(`/kuran/oku/${n.dataset.no}/1`); break;
        case 'open-ayah': go(`/kuran/oku/${n.dataset.s}/${n.dataset.a}`); break;
        case 'ref-menu':
          e.stopPropagation();
          openVerseMenu(n.dataset.ref, { onChange: () => repaint(root) });
          break;
        case 'start-khatm': startKhatm(root); break;
        case 'khatm-new': startKhatm(root); break;
        case 'khatm-inc':
          if (state.khatm.active.juzDone < 30) {
            state.khatm.active.juzDone += 1; commit('khatm'); repaint(root);
            if (state.khatm.active.juzDone === 30) toast('Hatim tamamlandı.');
          }
          break;
        case 'khatm-dec':
          if (state.khatm.active.juzDone > 0) { state.khatm.active.juzDone -= 1; commit('khatm'); repaint(root); }
          break;
      }
    });

    repaint(root);
  },

  onShow(root) { repaint(root); }
};

function repaint(root, scrollReset = false) {
  const panel = $('[data-panel]', root);
  const resume = $('[data-act="resume"]', root);
  if (resume?.parentElement) resume.parentElement.innerHTML = resumeCard();

  panel.innerHTML =
    activeTab === 'sureler' ? surahList()
      : activeTab === 'cuzler' ? juzList()
        : activeTab === 'kayitli' ? refList(state.quran.saved, 'Henüz âyet kaydetmedin. Okurken bir âyete uzun basarak kaydedebilirsin.')
          : activeTab === 'imler' ? refList(state.quran.bookmarks, 'Yer imin yok. Okurken kaldığın yeri işaretleyebilirsin.')
            : khatmPanel();

  if (scrollReset) $('[data-scroll]', root)?.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ------------------------------------------------------------
   Yeni hatim
   ------------------------------------------------------------ */
function startKhatm(root) {
  const body = openSheet('Yeni Hatim', `
    <p class="t-sec" style="margin-bottom:16px">
      Hatmi kaç günde tamamlamayı düşünüyorsun? Bu yalnızca bir yön göstergesidir;
      geri kalırsan uyarı almazsın.
    </p>
    <div class="list">
      ${[[30, 'Günde 1 cüz'], [60, 'Günde yarım cüz'], [15, 'Günde 2 cüz'], [0, 'Serbest — hedef yok']]
      .map(([days, sub]) => `
        <button class="row-item" data-act="pick" data-days="${days}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${days ? `${days} gün` : 'Serbest'}</span>
            <span class="row-item__sub">${sub}</span>
          </span>
          <span class="row-item__chev">${icon('chevron', 16)}</span>
        </button>`).join('')}
    </div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="pick"]');
    if (!n) return;
    const days = Number(n.dataset.days) || 365;
    state.khatm.history.push({ ...state.khatm.active, endedAt: new Date().toISOString() });
    state.khatm.active = {
      startedAt: new Date().toISOString().slice(0, 10),
      targetDays: days, juzDone: 0
    };
    commit('khatm');
    closeSheet();
    activeTab = 'hatim';
    $$('.segment__item', root).forEach((b) => b.classList.toggle('is-on', b.dataset.id === 'hatim'));
    repaint(root, true);
    toast('Yeni hatim başladı.');
  });
}
