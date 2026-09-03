/* ============================================================
   MİZAN — Ortak eylemler
   Ayet/dua/hadis kartları uygulamanın her yerinde aynı davranır.
   ============================================================ */

import { openSheet, toast, esc, closeSheet } from '../core/ui.js';
import { state, commit, toggleIn } from '../core/state.js';
import { icon } from '../core/icons.js';
import { verseAt, TAFSIR, WORD_BY_WORD } from '../data/quran-verses.js';
import { surahName, ayahAudioSources } from '../data/quran-surahs.js';
import { playOnce, stopOnce, isPlayingOnce } from '../core/player.js';
import { duaById, HADITHS } from '../data/content.js';
import { go } from '../core/router.js';

const parseRef = (ref) => ref.split(':').map(Number);

/* ---------------- Kaydet ---------------- */
export function toggleSaveVerse(ref, node) {
  const added = toggleIn(state.quran.saved, ref);
  commit('save');
  if (node) {
    node.classList.toggle('is-on', added);
    const label = node.querySelector('span');
    node.innerHTML = `${icon('save', 15)} ${added ? 'Kaydedildi' : 'Kaydet'}`;
  }
  toast(added ? 'Âyet kaydedildi.' : 'Kayıt kaldırıldı.');
}

export function toggleBookmark(ref) {
  const added = toggleIn(state.quran.bookmarks, ref);
  commit('bookmark');
  toast(added ? 'Yer imi eklendi.' : 'Yer imi kaldırıldı.');
  return added;
}

/* ---------------- Paylaş ---------------- */
export async function shareText(title, text) {
  const payload = `${text}\n\n— Mizan`;
  if (navigator.share) {
    try { await navigator.share({ title, text: payload }); return; } catch { /* iptal */ }
  }
  try {
    await navigator.clipboard.writeText(payload);
    toast('Panoya kopyalandı.');
  } catch {
    toast('Paylaşım bu ortamda kullanılamıyor.');
  }
}

export function shareVerse(ref) {
  const [s, a] = parseRef(ref);
  const v = verseAt(s, a);
  if (!v) return;
  shareText('Mizan — Âyet', `${v.ar}\n\n${v.tr}\n\n${surahName(s)} sûresi, ${a}. âyet`);
}

export function shareDua(id) {
  const d = duaById(id);
  if (!d) return;
  shareText('Mizan — Dua', `${d.title}\n\n${d.ar}\n\n${d.tl}\n\n${d.tr}\n\n${d.src}`);
}

export function shareHadith(id) {
  const h = HADITHS.find((x) => x.id === id);
  if (!h) return;
  shareText('Mizan — Hadis', `“${h.text}”\n\n${h.src}`);
}

/* ---------------- Tefsir ---------------- */
export function openTafsir(ref) {
  const [s, a] = parseRef(ref);
  const v = verseAt(s, a);
  const t = TAFSIR[ref];
  const title = `${surahName(s)} ${a}`;

  if (!t) {
    openSheet(title, `
      <p class="arabic" dir="rtl" lang="ar" style="font-size:24px">${v?.ar ?? ''}</p>
      <hr class="divider" style="margin:16px 0">
      <p class="t-body">${esc(v?.tr ?? '')}</p>
      <div class="card--flush" style="margin-top:20px;padding:16px;border-radius:var(--r-md)">
        <p class="t-sec">Bu âyet için tefsir özeti bu sürümde bulunmuyor.
        Uygulama sürümünde Diyanet <em>Kur’an Yolu</em> tefsiri âyet bazında görüntülenir.</p>
      </div>`);
    return;
  }

  openSheet(title, `
    <p class="arabic" dir="rtl" lang="ar" style="font-size:24px">${v?.ar ?? ''}</p>
    <hr class="hairline" style="margin:16px 0">
    <p class="t-body">${esc(v?.tr ?? '')}</p>
    <h3 class="t-h3" style="margin-top:24px">${esc(t.title)}</h3>
    <p class="t-body" style="margin-top:8px;color:var(--ink-700)">${esc(t.body)}</p>
    <p class="card__label" style="margin-top:22px">Kaynaklar</p>
    <ul style="margin-top:8px">
      ${t.sources.map((x) => `<li class="source" style="padding:5px 0">${esc(x)}</li>`).join('')}
    </ul>`);
}

/* ---------------- Kelime kelime ---------------- */
export function openWordByWord(ref) {
  const [s, a] = parseRef(ref);
  const words = WORD_BY_WORD[ref];
  const title = `${surahName(s)} ${a} — Kelime Kelime`;

  if (!words) {
    openSheet(title, `<div class="card--flush" style="padding:16px;border-radius:var(--r-md)">
      <p class="t-sec">Bu âyet için kelime kelime meal bu sürüme dahil değil.
      Uygulama sürümünde tüm mushaf için kelime verisi ayrı bir paketten yüklenir.</p></div>`);
    return;
  }

  openSheet(title, `
    <div style="display:flex;flex-wrap:wrap;gap:8px;direction:rtl;justify-content:flex-start">
      ${words.map(([ar, tr]) => `
        <div class="card--flush" style="padding:12px 14px;border-radius:var(--r-md);text-align:center;min-width:78px">
          <div class="arabic" style="font-size:22px;line-height:1.7;text-align:center">${ar}</div>
          <div class="t-cap" style="direction:ltr;margin-top:4px;letter-spacing:0">${esc(tr)}</div>
        </div>`).join('')}
    </div>`);
}

/* ---------------- Ayet menüsü (uzun basış / ⋯) ---------------- */
export function openVerseMenu(ref, opts = {}) {
  const [s, a] = parseRef(ref);
  const saved = state.quran.saved.includes(ref);
  const marked = state.quran.bookmarks.includes(ref);

  const item = (act, ic, label, on) => `
    <button class="row-item" data-act="${act}" data-ref="${ref}">
      <span style="width:20px;display:grid;place-items:center;color:${on ? 'var(--gold-text)' : 'var(--ink-500)'}">${icon(ic, 17)}</span>
      <span class="row-item__main"><span class="row-item__title">${label}</span></span>
    </button>`;

  const body = openSheet(`${surahName(s)} ${a}`, `
    <div class="list">
      ${item('menu-listen', 'volume', 'Bu âyetten dinle')}
      ${item('menu-tafsir', 'book', 'Tefsir')}
      ${item('menu-wbw', 'text', 'Kelime kelime meal')}
      ${item('menu-save', 'save', saved ? 'Kayıtlardan çıkar' : 'Kaydet', saved)}
      ${item('menu-bookmark', 'bookmark', marked ? 'Yer imini kaldır' : 'Yer imi ekle', marked)}
      ${item('menu-share', 'share', 'Paylaş')}
      ${item('menu-copy', 'copy', 'Metni kopyala')}
    </div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    const act = n.dataset.act;
    if (act === 'menu-tafsir') { openTafsir(ref); return; }
    if (act === 'menu-wbw') { openWordByWord(ref); return; }
    if (act === 'menu-save') { toggleSaveVerse(ref); closeSheet(); opts.onChange?.(); return; }
    if (act === 'menu-bookmark') { toggleBookmark(ref); closeSheet(); opts.onChange?.(); return; }
    if (act === 'menu-share') { shareVerse(ref); closeSheet(); return; }
    if (act === 'menu-copy') {
      const v = verseAt(s, a);
      navigator.clipboard?.writeText(`${v.ar}\n\n${v.tr}\n\n${surahName(s)} ${a}`);
      toast('Kopyalandı.'); closeSheet(); return;
    }
    if (act === 'menu-listen') { closeSheet(); opts.onListen?.(a); return; }
  });
}

/* ---------------- Dua sesli dinleme ----------------
   Kur'an kaynaklı dualar gerçek tilavetle çalınır. Hadis kaynaklı
   dualar için ses arşivi yok — o durumda sahte oynatma yapılmaz,
   durum açıkça söylenir.
   ------------------------------------------------------------ */
export function listenDua(id, node) {
  const d = duaById(id);
  if (!d) return;

  if (!d.ayah) {
    toast('Bu dua için ses kaydı bu sürümde yok.');
    return;
  }

  if (isPlayingOnce()) { stopOnce(); toast('Durduruldu.'); return; }

  const [s, a] = d.ayah;
  toast(`${surahName(s)} ${a} okunuyor…`);
  playOnce(ayahAudioSources(s, a, state.quran.reciter)).catch(() => toast(
    navigator.onLine === false
      ? 'Çevrimdışısın. Ses için bağlantı gerekiyor.'
      : 'Ses kaynağına ulaşılamadı. Bu önizleme ortamı dış sesi engelliyor olabilir.'
  ));
}

/* ---------------- Ayet dinle (okuyucuya git) ----------------
   Okuyucu açıldığında otomatik oynatma isteği bu bayrakla taşınır.
   ------------------------------------------------------------ */
export const intent = { autoPlay: false };

export function listenVerse(ref) {
  const [s, a] = parseRef(ref);
  intent.autoPlay = true;
  go(`/kuran/oku/${s}/${a}`);
}

/* ---------------- Ortak eylem yönlendirici ----------------
   Ekranlar bu tabloyu kendi kök elemanlarına bağlar.
   ------------------------------------------------------------ */
export const sharedActions = {
  'verse-save': (n) => toggleSaveVerse(n.dataset.ref, n),
  'verse-share': (n) => shareVerse(n.dataset.ref),
  'verse-tafsir': (n) => openTafsir(n.dataset.ref),
  'verse-listen': (n) => listenVerse(n.dataset.ref),
  'dua-listen': (n) => listenDua(n.dataset.id),
  'dua-share': (n) => shareDua(n.dataset.id),
  'hadith-share': (n) => shareHadith(n.dataset.id),
  'hadith-save': () => toast('Hadis kaydedildi.'),
  'back': () => history.back()
};
