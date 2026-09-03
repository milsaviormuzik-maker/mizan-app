/* ============================================================
   MİZAN — Günün içeriği
   Seçim rastgele değil, tarihe göre DETERMİNİSTİKTİR:
   aynı gün uygulamayı kaç kez açarsan aç aynı içerik gelir.
   Cuma ve Ramazan gibi bağlamlarda seçim önceliklendirilir.
   ============================================================ */

import { VERSES } from './quran-verses.js';
import { HADITHS, DUAS, MINUTE_CARDS } from './content.js';
import { surahName } from './quran-surahs.js';
import { ramadanState } from '../core/astro.js';

/** Gün numarası — 1970'ten bu yana geçen gün (yerel) */
function dayIndex(date) {
  return Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000
  );
}

/** Deterministik seçim */
function pick(list, date, salt = 0) {
  if (!list.length) return null;
  return list[(dayIndex(date) + salt) % list.length];
}

/* ------------------------------------------------------------
   GÜNÜN AYETİ
   Havuz: manevi yoğunluğu yüksek, tek başına anlaşılabilir ayetler
   ------------------------------------------------------------ */
const VERSE_POOL = [
  [55, 7], [55, 8], [55, 9], [2, 186], [2, 152], [2, 153], [2, 155],
  [2, 255], [2, 286], [3, 190], [3, 191], [94, 5], [94, 6], [93, 3],
  [93, 5], [99, 7], [103, 2], [103, 3], [67, 2], [59, 22], [59, 24],
  [36, 12], [1, 5], [1, 6], [112, 1], [2, 37]
];

/** Ramazan'da öne çıkan ayetler */
const RAMADAN_VERSES = [[97, 1], [97, 3], [97, 5], [2, 186], [2, 185]];

export function verseOfDay(date = new Date(), hijriOffset = 0) {
  const ram = ramadanState(date, hijriOffset);
  const pool = ram.active ? [...RAMADAN_VERSES, ...VERSE_POOL] : VERSE_POOL;
  let [s, a] = pick(pool, date) ?? [55, 7];

  let item = VERSES[s]?.list.find((x) => x.n === a);
  if (!item) { s = 55; a = 7; item = VERSES[55].list.find((x) => x.n === 7); }

  return {
    surah: s, ayah: a, ref: `${s}:${a}`,
    label: `${surahName(s)} sûresi, ${a}. âyet`,
    ...item
  };
}

/* ------------------------------------------------------------
   GÜNÜN HADİSİ · DUASI · BİLGİSİ
   ------------------------------------------------------------ */
export function hadithOfDay(date = new Date()) {
  return pick(HADITHS, date, 3);
}

export function duaOfDay(date = new Date(), hijriOffset = 0) {
  const ram = ramadanState(date, hijriOffset);
  if (ram.active) {
    const ramadanDuas = DUAS.filter((x) => x.cat === 'ramazan');
    return pick(ramadanDuas, date, 1) ?? pick(DUAS, date, 1);
  }
  const hour = date.getHours();
  const cat = hour < 11 ? 'sabah' : hour < 19 ? 'bereket' : 'aksam';
  const scoped = DUAS.filter((x) => x.cat === cat);
  return pick(scoped, date, 1) ?? pick(DUAS, date, 1);
}

export function minuteCardOfDay(date = new Date()) {
  return pick(MINUTE_CARDS, date, 5);
}

/* ------------------------------------------------------------
   GÜNÜN OKUMA ÖNERİSİ
   ------------------------------------------------------------ */
export function readingSuggestion(date = new Date(), hijriOffset = 0) {
  const ram = ramadanState(date, hijriOffset);
  if (ram.active) {
    return { title: 'Ramazan okuması', text: 'Bugünün cüzünü tamamlamak için yaklaşık 20 dakikan var.' };
  }
  if (date.getDay() === 5) {
    return { title: 'Bugün Cuma', text: 'Kehf sûresini okumak bugüne ait bir sünnet olarak tavsiye edilmiştir.' };
  }
  return { title: 'Bugün 5 dakika Kur’an oku', text: 'Kaldığın yerden devam et.' };
}
