/* ============================================================
   MİZAN — Dini takvim
   Günler sabit tarih olarak tutulmaz; hicri takvimden HESAPLANIR.
   Böylece her yıl kendiliğinden kayar.
   ============================================================ */

import { fromHijri, toHijri, HIJRI_MONTHS } from '../core/astro.js';

/* Kandiller GECEDİR. Hicri gün güneş batınca başladığı için "Recep'in 27.
   gecesi", 26. günün akşamı başlar ve 27. günün sabahına kadar sürer.
   Bu yüzden kandil kayıtlarında hem hicri GÜN tutulur (takvimde o güne
   düşer) hem de gecenin hangi akşam başladığı ayrıca verilir — kullanıcı
   camiye hangi akşam gideceğini tahmin etmek zorunda kalmasın. */
const GECE_NOTU = 'Kandil gecesi, bu tarihten bir önceki akşam güneş battığında başlar.';

/** [hicri ay, gün, ad, tür, açıklama, kaynak] */
const RULES = [
  [1, 1, 'Hicri Yılbaşı', 'gun', 'Muharrem ayının ilk günü; hicri takvimde yeni yılın başlangıcıdır.',
    'Tevbe 36; Diyanet İşleri Başkanlığı, Dinî Günler ve Geceler'],
  [1, 10, 'Aşure Günü', 'gun', 'Muharrem ayının onuncu günü. Bu günde oruç tutmak sünnet olarak tavsiye edilmiştir.',
    'Buhârî, Savm 69; Müslim, Sıyâm 128'],
  [3, 12, 'Mevlid Kandili', 'kandil', 'Hz. Muhammed’in doğum yıl dönümü olarak anılan gece.',
    'İbn Hişâm, es-Sîre, I/158; Diyanet İşleri Başkanlığı, Dinî Günler ve Geceler'],
  [7, 1, 'Üç Aylar Başlangıcı', 'gun', 'Recep, Şaban ve Ramazan aylarından oluşan dönemin başlangıcı.',
    'Tevbe 36; Diyanet İşleri Başkanlığı, Dinî Günler ve Geceler'],
  [7, 27, 'Miraç Kandili', 'kandil', 'İsrâ ve Miraç hadisesinin anıldığı gece.',
    'İsrâ 1; Buhârî, Salât 1; Müslim, Îmân 259'],
  [8, 15, 'Berat Kandili', 'kandil', 'Şaban ayının on beşinci gecesi.',
    'Tirmizî, Savm 39; İbn Mâce, İkâmet 191 — rivayetin sıhhati âlimler arasında tartışılmıştır'],
  [9, 1, 'Ramazan Başlangıcı', 'ramazan', 'Oruç ayının ilk günü.',
    'Bakara 185; Buhârî, Savm 5'],
  [9, 27, 'Kadir Gecesi', 'kandil', 'Kur’an’ın indirilmeye başlandığı, bin aydan hayırlı olduğu bildirilen gece.',
    'Kadr 1–5; Buhârî, Leyletü’l-Kadr 3; Müslim, Sıyâm 205'],
  [10, 1, 'Ramazan Bayramı', 'bayram', 'Bayramın birinci günü. Bayram namazı sabah kılınır.',
    'Buhârî, Îdeyn 8; Müslim, Salâtü’l-Îdeyn 1'],
  [10, 2, 'Ramazan Bayramı 2. Gün', 'bayram', '', 'Buhârî, Îdeyn 8'],
  [10, 3, 'Ramazan Bayramı 3. Gün', 'bayram', '', 'Buhârî, Îdeyn 8'],
  [12, 9, 'Arefe Günü', 'gun', 'Kurban Bayramı’ndan bir önceki gün. Arafat vakfesi bugün yapılır.',
    'Ebû Dâvûd, Menâsik 68; Tirmizî, Hac 57; Müslim, Sıyâm 196'],
  [12, 10, 'Kurban Bayramı', 'bayram', 'Bayramın birinci günü. Kurban kesimi bugün başlar.',
    'Hac 28; Kevser 2; Buhârî, Edâhî 1'],
  [12, 11, 'Kurban Bayramı 2. Gün', 'bayram', '', 'Buhârî, Edâhî 1'],
  [12, 12, 'Kurban Bayramı 3. Gün', 'bayram', '', 'Buhârî, Edâhî 1'],
  [12, 13, 'Kurban Bayramı 4. Gün', 'bayram', '', 'Buhârî, Edâhî 1']
];

/**
 * Regaib Kandili — Recep ayının ilk cuma gecesi.
 * (Perşembeyi cumaya bağlayan gece)
 */
function regaibFor(hijriYear) {
  const start = fromHijri(hijriYear, 7, 1);
  for (let i = 0; i < 8; i++) {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    if (day.getDay() === 5) {                          // ilk cuma
      const eve = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
      // Regaib zaten "gece" olarak bulunuyor: perşembeyi cumaya bağlayan akşam.
      // Alan adları diğer kandillerle aynı olsun diye gün ve akşam ayrı tutulur.
      return {
        date: day, eve, name: 'Regaib Kandili', kind: 'kandil',
        desc: 'Recep ayının ilk cuma gecesi.',
        src: 'Diyanet İşleri Başkanlığı, Dinî Günler ve Geceler — ' +
             'Regaib gecesine mahsus bir ibadet şekli hadislerde yer almaz',
        geceNotu: GECE_NOTU,
        hijri: toHijri(day)
      };
    }
  }
  return null;
}

/** Bir hicri yıl için tüm dini günler */
export function religiousDaysOf(hijriYear) {
  const out = RULES.map(([hm, hd, name, kind, desc, src]) => {
    const date = fromHijri(hijriYear, hm, hd);
    // Gecenin başladığı akşam: hicri gün, bir önceki miladi günün akşamı girer
    const eve = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    return {
      date, name, kind, desc, src,
      ...(kind === 'kandil' ? { eve, geceNotu: GECE_NOTU } : {}),
      hijri: { year: hijriYear, month: hm, day: hd, monthName: HIJRI_MONTHS[hm - 1] }
    };
  });
  const regaib = regaibFor(hijriYear);
  if (regaib) out.push(regaib);
  return out.sort((a, b) => a.date - b.date);
}

/** Bugünden itibaren yaklaşan günler */
export function upcomingDays(from = new Date(), count = 8) {
  const h = toHijri(from);
  const pool = [
    ...religiousDaysOf(h.year - 1),
    ...religiousDaysOf(h.year),
    ...religiousDaysOf(h.year + 1)
  ];
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return pool.filter((x) => x.date >= today).slice(0, count);
}

/** Belirli bir miladi yıla düşen dini günler */
export function daysInGregorianYear(year) {
  const h1 = toHijri(new Date(year, 0, 1));
  const h2 = toHijri(new Date(year, 11, 31));
  const pool = [];
  for (let y = h1.year; y <= h2.year; y++) pool.push(...religiousDaysOf(y));
  return pool.filter((x) => x.date.getFullYear() === year).sort((a, b) => a.date - b.date);
}

/** O gün özel bir dini gün mü? */
export function dayInfoFor(date) {
  const h = toHijri(date);
  const pool = religiousDaysOf(h.year);
  const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  return pool.find((x) => key(x.date) === key(date)) ?? null;
}

export const KIND_LABEL = {
  kandil: 'Kandil', bayram: 'Bayram', ramazan: 'Ramazan', gun: 'Özel Gün'
};
