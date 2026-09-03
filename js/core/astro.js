/* ============================================================
   MİZAN — Astronomi çekirdeği
   Namaz vakitleri, kıble yönü ve hicri takvim burada HESAPLANIR.
   Hiçbiri sabit tablo değildir; konum ve tarihe göre üretilir.
   ============================================================ */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

const sin = (d) => Math.sin(d * D2R);
const cos = (d) => Math.cos(d * D2R);
const tan = (d) => Math.tan(d * D2R);
const arcsin = (x) => Math.asin(x) * R2D;
const arccos = (x) => Math.acos(x) * R2D;
const arctan2 = (y, x) => Math.atan2(y, x) * R2D;
const arccot = (x) => Math.atan(1 / x) * R2D;

const fix = (a, n) => { a -= n * Math.floor(a / n); return a < 0 ? a + n : a; };
const fixAngle = (a) => fix(a, 360);
const fixHour = (h) => fix(h, 24);

/* ------------------------------------------------------------
   Jülyen günü
   ------------------------------------------------------------ */
export function julianDay(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

/* ------------------------------------------------------------
   Güneşin konumu (Meeus, düşük dereceli fakat vakitler için yeterli)
   → deklinasyon (derece) ve zaman denklemi (saat)
   ------------------------------------------------------------ */
function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);         // ortalama anomali
  const q = fixAngle(280.459 + 0.98564736 * D);         // ortalama boylam
  const L = fixAngle(q + 1.915 * sin(g) + 0.020 * sin(2 * g)); // ekliptik boylam
  const e = 23.439 - 0.00000036 * D;                    // eğiklik
  const RA = fixHour(arctan2(cos(e) * sin(L), cos(L)) / 15);
  const decl = arcsin(sin(e) * sin(L));
  const eqt = q / 15 - RA;                              // zaman denklemi (saat)
  return { decl, eqt };
}

/* ============================================================
   HESAPLAMA YÖNTEMLERİ
   fajr / isha: ufkun altındaki açı (derece)
   isha 'min' ise akşamdan sonraki dakika
   asr: gölge katsayısı (1 = standart, 2 = Hanefî)
   temkin: Diyanet'in yayımladığı takvimlerdeki ihtiyat payı (dakika)
   ============================================================ */
export const METHODS = {
  diyanet: {
    id: 'diyanet', name: 'Diyanet İşleri Başkanlığı', short: 'Diyanet',
    fajr: 18, isha: 17, asr: 1,
    temkin: { imsak: -8, gunes: -7, ogle: 6, ikindi: 5, aksam: 7, yatsi: 3 },
    note: 'Türkiye için varsayılan. Temkin (ihtiyat) payları uygulanır.'
  },
  mwl: {
    id: 'mwl', name: 'Müslüman Dünya Birliği', short: 'MWL',
    fajr: 18, isha: 17, asr: 1, temkin: null,
    note: 'Avrupa, Uzak Doğu ve genel kullanım için yaygın.'
  },
  isna: {
    id: 'isna', name: 'Kuzey Amerika İslam Cemiyeti', short: 'ISNA',
    fajr: 15, isha: 15, asr: 1, temkin: null,
    note: 'Kuzey Amerika kıtası için yaygın.'
  },
  egypt: {
    id: 'egypt', name: 'Mısır Genel Araştırma Kurumu', short: 'Mısır',
    fajr: 19.5, isha: 17.5, asr: 1, temkin: null,
    note: 'Afrika, Suriye ve Lübnan çevresinde kullanılır.'
  },
  makkah: {
    id: 'makkah', name: 'Ümmü’l-Kurâ Üniversitesi', short: 'Ümmü’l-Kurâ',
    fajr: 18.5, ishaMin: 90, isha: null, asr: 1, temkin: null,
    note: 'Arabistan Yarımadası. Yatsı, akşamdan 90 dk sonra.'
  },
  karachi: {
    id: 'karachi', name: 'Karaçi İslami İlimler Ü.', short: 'Karaçi',
    fajr: 18, isha: 18, asr: 2, temkin: null,
    note: 'Pakistan, Hindistan, Bangladeş. İkindi Hanefî hesabıyla.'
  }
};

export const PRAYER_KEYS = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];
export const PRAYER_NAMES = {
  imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle',
  ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı'
};
/* Namaz olan vakitler (Güneş bir namaz vakti değildir) */
export const SALAH_KEYS = ['imsak', 'ogle', 'ikindi', 'aksam', 'yatsi'];
export const SALAH_NAMES = {
  imsak: 'Sabah', ogle: 'Öğle', ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı'
};

/* ------------------------------------------------------------
   Bir gün için vakitleri hesapla
   date: Date · coords {lat, lng} · opts {method, asrFactor, adjustments, tzMinutes}
   → { imsak: 285.4, ... }  (gece yarısından itibaren DAKİKA)
   ------------------------------------------------------------ */
export function computePrayerTimes(date, coords, opts = {}) {
  const method = METHODS[opts.method] || METHODS.diyanet;
  const lat = coords.lat, lng = coords.lng;
  const asrFactor = opts.asrFactor || method.asr || 1;

  // Saat dilimi: verilmediyse tarayıcının o gündeki gerçek ofseti (yaz saati dahil)
  const tz = (opts.tzMinutes != null ? opts.tzMinutes : -date.getTimezoneOffset()) / 60;

  const jd = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);

  const decl = (t) => sunPosition(jd + t).decl;
  const eqt = (t) => sunPosition(jd + t).eqt;
  const noonAt = (t) => fixHour(12 - eqt(t));

  // Belirli bir güneş açısı için saat (ufkun altında `angle` derece)
  const angleTime = (angle, t, ccw) => {
    const d = decl(t);
    const num = -sin(angle) - sin(d) * sin(lat);
    const den = cos(d) * cos(lat);
    const ratio = num / den;
    if (ratio > 1 || ratio < -1) return NaN;      // yüksek enlem: vakit oluşmuyor
    const ha = arccos(ratio) / 15;
    return noonAt(t) + (ccw ? -ha : ha);
  };

  const asrAt = (t) => {
    const d = decl(t);
    const angle = -arccot(asrFactor + tan(Math.abs(lat - d)));
    return angleTime(angle, t, false);
  };

  // İterasyonla yakınsama (vakitler kendi anlarındaki güneş konumuyla hesaplanır)
  let t = { imsak: 5 / 24, gunes: 6 / 24, ogle: 12 / 24, ikindi: 13 / 24, aksam: 18 / 24, yatsi: 18 / 24 };
  for (let i = 0; i < 3; i++) {
    t = {
      imsak: angleTime(method.fajr, t.imsak, true) / 24,
      gunes: angleTime(0.833, t.gunes, true) / 24,
      ogle: noonAt(t.ogle) / 24,
      ikindi: asrAt(t.ikindi) / 24,
      aksam: angleTime(0.833, t.aksam, false) / 24,
      yatsi: (method.isha != null
        ? angleTime(method.isha, t.yatsi, false)
        : angleTime(0.833, t.yatsi, false) + method.ishaMin / 60) / 24
    };
  }

  const out = {};
  const zoneShift = tz - lng / 15;
  const adj = opts.adjustments || {};
  const temkin = (opts.useTemkin !== false && method.temkin) ? method.temkin : null;

  for (const k of PRAYER_KEYS) {
    let hours = t[k] * 24;
    if (!isFinite(hours)) { out[k] = null; continue; }   // yüksek enlem
    hours += zoneShift;
    let minutes = hours * 60;
    if (temkin) minutes += temkin[k] || 0;
    minutes += adj[k] || 0;
    out[k] = fix(minutes, 1440);
  }

  // Şer'î gece yarısı (teheccüd / vitir için) — akşam ile ertesi imsak ortası
  if (out.aksam != null && out.imsak != null) {
    const night = fix(out.imsak - out.aksam, 1440);
    out.geceYarisi = fix(out.aksam + night / 2, 1440);
    out.gecelikSure = night;
  }
  return out;
}

/* ------------------------------------------------------------
   Şu anki ve sıradaki vakti çıkar
   ------------------------------------------------------------ */
export function resolveCurrentPrayer(now, todayTimes, tomorrowTimes) {
  const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const seq = PRAYER_KEYS.filter((k) => todayTimes[k] != null);

  let currentKey = null, nextKey = null, nextAt = null, currentAt = null;

  for (let i = 0; i < seq.length; i++) {
    const k = seq[i];
    if (mins >= todayTimes[k]) { currentKey = k; currentAt = todayTimes[k]; }
  }

  for (let i = 0; i < seq.length; i++) {
    const k = seq[i];
    if (todayTimes[k] > mins) { nextKey = k; nextAt = todayTimes[k]; break; }
  }

  if (!nextKey) {                       // yatsıdan sonra → yarının imsakı
    nextKey = 'imsak';
    nextAt = 1440 + (tomorrowTimes?.imsak ?? todayTimes.imsak);
  }
  if (!currentKey) {                    // imsaktan önce → dünkü yatsı sürüyor
    currentKey = 'yatsi';
    currentAt = todayTimes.yatsi - 1440;
  }

  const remainingSec = Math.max(0, Math.round((nextAt - mins) * 60));
  const spanMin = nextAt - currentAt;
  const progress = spanMin > 0 ? Math.min(1, Math.max(0, (mins - currentAt) / spanMin)) : 0;

  return { currentKey, nextKey, nextAt, currentAt, remainingSec, progress };
}

/* ------------------------------------------------------------
   Kıble — Kâbe'ye büyük daire kerterizi
   ------------------------------------------------------------ */
export const KAABA = { lat: 21.4225, lng: 39.8262 };

export function qiblaBearing(coords) {
  const dLng = KAABA.lng - coords.lng;
  const y = sin(dLng);
  const x = cos(coords.lat) * tan(KAABA.lat) - sin(coords.lat) * cos(dLng);
  return fixAngle(arctan2(y, x));
}

export function distanceToKaaba(coords) {
  const R = 6371;
  const dLat = (KAABA.lat - coords.lat) * D2R;
  const dLng = (KAABA.lng - coords.lng) * D2R;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(coords.lat * D2R) * Math.cos(KAABA.lat * D2R) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ============================================================
   HİCRİ TAKVİM — tablosal (Kuveyt) algoritma + kullanıcı düzeltmesi
   ============================================================ */
export const HIJRI_MONTHS = [
  'Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir',
  'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'
];

function hijriToJD(y, m, d) {
  return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 +
    Math.floor((3 + 11 * y) / 30) + 1948439.5 - 1;
}

/* ------------------------------------------------------------
   ÇAPA TABLOSU — tablosal takvim gözleme dayalı Diyanet takviminden
   yer yer 1–2 gün sapar. Diyanet'in ilan ettiği ay başlarını çapa
   olarak tutup en yakın çapaya göre kaymayı düzeltiyoruz.

   Üretimde bu liste Diyanet'in resmî takviminden yıllık beslenmelidir;
   burada 1447–1448 için ilan edilmiş ay başları yer alıyor.
   ------------------------------------------------------------ */
const HIJRI_ANCHORS = [
  { hy: 1447, hm: 9, g: [2026, 2, 18] },   // Ramazan 1447 başlangıcı
  { hy: 1447, hm: 10, g: [2026, 3, 20] },  // Ramazan Bayramı 1. gün
  { hy: 1447, hm: 12, g: [2026, 5, 18] },  // Zilhicce → Kurban Bayramı 27 Mayıs
  { hy: 1448, hm: 1, g: [2026, 6, 16] },   // Hicri yılbaşı
  { hy: 1448, hm: 3, g: [2026, 8, 14] },   // Rebiülevvel → Mevlid 25 Ağustos
  { hy: 1448, hm: 9, g: [2027, 2, 8] },    // Ramazan 1448 başlangıcı
  { hy: 1448, hm: 10, g: [2027, 3, 10] }   // Ramazan Bayramı 1. gün
].map((a) => {
  const actual = Math.floor(julianDay(a.g[0], a.g[1], a.g[2]) + 0.5);
  const tabular = Math.floor(hijriToJD(a.hy, a.hm, 1) + 0.5);
  return { actual, delta: actual - tabular };
}).sort((x, y) => x.actual - y.actual);

/** Verilen JD için en yakın çapadan türeyen düzeltme (gün) */
function anchorDelta(jd) {
  if (!HIJRI_ANCHORS.length) return 0;
  let best = HIJRI_ANCHORS[0];
  let bestGap = Math.abs(jd - best.actual);
  for (const a of HIJRI_ANCHORS) {
    const gap = Math.abs(jd - a.actual);
    if (gap < bestGap) { best = a; bestGap = gap; }
  }
  // Çapadan 200 günden uzaktaysak kalibrasyona güvenmeyip tablosala düşeriz.
  return bestGap > 200 ? 0 : best.delta;
}

export function toHijri(date, offsetDays = 0) {
  const rawJd = Math.floor(
    julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) + 0.5
  );
  const jd = rawJd + offsetDays - anchorDelta(rawJd);

  let y = Math.floor((30 * (jd - 1948440) + 10646) / 10631);
  let m = Math.min(12, Math.ceil((jd - (29 + hijriToJD(y, 1, 1))) / 29.5) + 1);
  let d = jd - Math.floor(hijriToJD(y, m, 1) + 0.5) + 1;

  if (d < 1) { m -= 1; if (m < 1) { m = 12; y -= 1; } d = jd - Math.floor(hijriToJD(y, m, 1) + 0.5) + 1; }
  return { year: y, month: m, day: d, monthName: HIJRI_MONTHS[m - 1] };
}

/** Hicri ay başının kalibre edilmiş JD'si */
function hijriMonthStartJD(hy, hm) {
  const tabular = Math.floor(hijriToJD(hy, hm, 1) + 0.5);
  return tabular + anchorDelta(tabular);
}

/** Hicri tarihi Miladi Date'e çevir */
export function fromHijri(hy, hm, hd, offsetDays = 0) {
  return jdToGregorian(hijriMonthStartJD(hy, hm) + (hd - 1) - offsetDays);
}

function jdToGregorian(jd) {
  let z = Math.floor(jd + 0.5);
  const alpha = Math.floor((z - 1867216.25) / 36524.25);
  const a = z + 1 + alpha - Math.floor(alpha / 4);
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const dd = Math.floor(365.25 * c);
  const e = Math.floor((b - dd) / 30.6001);
  const day = b - dd - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return new Date(year, month - 1, day);
}

/** Hicri ayın gün sayısı (kalibrasyon dahil) */
export function hijriMonthLength(hy, hm) {
  const nm = hm === 12 ? 1 : hm + 1;
  const ny = hm === 12 ? hy + 1 : hy;
  return hijriMonthStartJD(ny, nm) - hijriMonthStartJD(hy, hm);
}

/* ------------------------------------------------------------
   Ramazan durumu — sabit tarih yok, hicri aydan türer
   ------------------------------------------------------------ */
export function ramadanState(date, offsetDays = 0) {
  const h = toHijri(date, offsetDays);
  if (h.month === 9) {
    return { active: true, day: h.day, total: hijriMonthLength(h.year, 9), hijri: h };
  }
  return { active: false, day: 0, total: 30, hijri: h };
}

/* ------------------------------------------------------------
   Güneşin o andaki yüksekliği → atmosfer için
   ------------------------------------------------------------ */
export function sunAltitude(date, coords) {
  const jd = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
    + (date.getHours() + date.getMinutes() / 60) / 24
    - (-date.getTimezoneOffset() / 60) / 24;
  const { decl, eqt } = sunPosition(jd);
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
  const ha = (utcHours + eqt - 12) * 15 + coords.lng;
  return arcsin(sin(coords.lat) * sin(decl) + cos(coords.lat) * cos(decl) * cos(ha));
}
