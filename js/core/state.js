/* ============================================================
   MİZAN — Durum yönetimi
   Tamamı cihazda. Hesap açılmadıkça hiçbir veri dışarı çıkmaz.
   ============================================================ */

const KEY = 'mizan.state.v1';

export const CITIES = [
  { name: 'İstanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { name: 'İzmir', lat: 38.4237, lng: 27.1428 },
  { name: 'Bursa', lat: 40.1826, lng: 29.0665 },
  { name: 'Antalya', lat: 36.8969, lng: 30.7133 },
  { name: 'Adana', lat: 37.0000, lng: 35.3213 },
  { name: 'Konya', lat: 37.8746, lng: 32.4932 },
  { name: 'Gaziantep', lat: 37.0662, lng: 37.3833 },
  { name: 'Kayseri', lat: 38.7312, lng: 35.4787 },
  { name: 'Trabzon', lat: 41.0027, lng: 39.7168 },
  { name: 'Diyarbakır', lat: 37.9144, lng: 40.2306 },
  { name: 'Erzurum', lat: 39.9000, lng: 41.2700 },
  { name: 'Samsun', lat: 41.2867, lng: 36.3300 },
  { name: 'Eskişehir', lat: 39.7767, lng: 30.5206 },
  { name: 'Van', lat: 38.4891, lng: 43.4089 },
  { name: 'Şanlıurfa', lat: 37.1591, lng: 38.7969 },
  { name: 'Rize', lat: 41.0201, lng: 40.5234 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { name: 'Londra', lat: 51.5074, lng: -0.1278 },
  { name: 'Mekke', lat: 21.4225, lng: 39.8262 },
  { name: 'Medine', lat: 24.4686, lng: 39.6142 }
];

const DEFAULTS = {
  user: {
    name: '', city: 'İstanbul', coords: { lat: 41.0082, lng: 28.9784 },
    onboarded: false, autoLocation: false
  },
  app: {
    theme: 'system',            // system | light | dark
    nightReading: false,
    ramadanPreview: false,      // Ramazan modunu elle önizleme
    contentNotify: true,
    hijriOffset: 0,
    // Yakındaki camiler için konum paylaşımı — VARSAYILAN KAPALI.
    // Uygulamadaki tek dış istektir; kullanıcı açıkça izin vermeden yapılmaz.
    mosqueLookup: false
  },
  prayer: {
    method: 'diyanet',
    asrFactor: 1,               // 1 standart · 2 Hanefî
    useTemkin: true,
    adjustments: { imsak: 0, gunes: 0, ogle: 0, ikindi: 0, aksam: 0, yatsi: 0 },
    notify: {                   // ezan | before15 | before30 | silent | off
      imsak: 'ezan', gunes: 'off', ogle: 'ezan',
      ikindi: 'ezan', aksam: 'ezan', yatsi: 'ezan'
    },
    adhanSound: 'mizan-sade'
  },
  quran: {
    lastRead: { surah: 2, ayah: 37 },
    meal: 'diyanet',
    reciter: 'alafasy',
    arabicFont: 'uthmani',
    arabicSize: 26,
    mealSize: 15,
    showMeal: true,
    showTranslit: false,
    bookmarks: [],              // ['2:255', ...]
    saved: [],                  // ['2:255', ...]
    notes: {}                   // { '2:255': 'not metni' }
  },
  khatm: {
    active: { startedAt: '2026-08-04', targetDays: 30, juzDone: 12 },
    history: []
  },
  tasbih: {
    activeZikr: 'subhanallah',
    target: 33,
    count: 0,
    rounds: 0,
    totalAllTime: 4187,
    custom: [],
    haptics: true
  },
  tracking: {
    enabled: true,
    prayers: {},                // { 'YYYY-MM-DD': { ogle: true, ... } }
    fasts: {}                   // { 'YYYY-MM-DD': true }
  },
  ramadan: {
    suhoorAlarm: true, suhoorLead: 45,
    iftarNotify: true, iftarLead: 30,
    imsakNotify: true,
    taraweehReminder: false
  },
  premium: false
};

function deepMerge(base, patch) {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return patch === undefined ? base : patch;
  }
  const out = { ...base };
  for (const k of Object.keys(base)) {
    if (patch && k in patch) out[k] = deepMerge(base[k], patch[k]);
  }
  return out;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    return deepMerge(structuredClone(DEFAULTS), JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export const state = load();

const listeners = new Set();

let saveTimer = null;
export function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* kota dolu */ }
  }, 120);
}

/** Durumu değiştirir, kaydeder ve aboneleri uyarır */
export function commit(reason = 'change') {
  save();
  listeners.forEach((fn) => fn(reason));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetAll() {
  try { localStorage.removeItem(KEY); } catch { /* yok say */ }
  location.reload();
}

/* --------- Kısa yollar --------- */
export const ref = (s, a) => `${s}:${a}`;

export function toggleIn(list, value) {
  const i = list.indexOf(value);
  if (i >= 0) { list.splice(i, 1); return false; }
  list.push(value); return true;
}

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
