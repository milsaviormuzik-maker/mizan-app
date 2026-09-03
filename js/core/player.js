/* ============================================================
   MİZAN — Kur'an ses oynatıcısı
   ------------------------------------------------------------
   Gerçek tilavet sesi çalar. Ses, âyet bazlı arşivden seçilen
   hafıza göre akıtılır; sıra, tekrar, uyku zamanlayıcısı, hız ve
   âyet vurgusu <audio> öğesinin kendi olaylarından sürülür.

   Sessiz "sahte oynatma" YOKTUR: ses yüklenemezse oynatıcı bunu
   açıkça bildirir. Kullanıcının çaldığını sanıp hiçbir şey duymaması,
   hata mesajı görmesinden kötüdür.

   NOT (üretim): Premium'da bu dosyalar cihaza indirilip çevrimdışı
   çalınır; `srcFor()` o zaman yerel dosyayı döndürür, gerisi aynı kalır.
   ============================================================ */

import { state } from './state.js';
import { RECITERS, ayahAudioSources } from '../data/quran-surahs.js';

const listeners = new Set();

const S = {
  playing: false,
  loading: false,
  error: null,        // null · 'offline' · 'unavailable' · 'gesture'
  surah: null,
  ayah: null,
  queue: [],          // [{ surah, ayah }]
  index: 0,
  elapsed: 0,
  duration: 0,
  speed: 1,
  repeat: 1,          // 1 · 3 · 5 · Infinity
  repeatLeft: 1,
  sleepAt: null,
  sleepTimer: null
};

/* ------------------------------------------------------------
   <audio> öğesi — tek örnek, tembel kurulur
   ------------------------------------------------------------ */
let audio = null;
let preloader = null;
let sourceIndex = 0;      // mevcut âyet için denenen kaynak sırası

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = 'auto';

  audio.addEventListener('loadedmetadata', () => {
    S.duration = isFinite(audio.duration) ? audio.duration : 0;
    S.loading = false;
    S.error = null;
    emit();
  });
  audio.addEventListener('timeupdate', () => {
    S.elapsed = audio.currentTime;
    emit();
  });
  audio.addEventListener('waiting', () => { S.loading = true; emit(); });
  audio.addEventListener('playing', () => { S.loading = false; S.playing = true; S.error = null; emit(); });
  audio.addEventListener('pause', () => { S.playing = false; emit(); });
  audio.addEventListener('ended', onEnded);
  // Bir kaynak düşerse diğerini dene; hepsi tükenince durumu bildir
  audio.addEventListener('error', () => {
    const urls = currentSources();
    if (sourceIndex < urls.length - 1) {
      sourceIndex += 1;
      const wasPlaying = S.playing;
      audio.src = urls[sourceIndex];
      audio.load();
      if (wasPlaying) start();
      return;
    }
    S.loading = false;
    S.playing = false;
    S.error = navigator.onLine === false ? 'offline' : 'unavailable';
    emit();
  });

  // Sekme kapanınca ses arkada kalmasın
  addEventListener('pagehide', () => { try { audio.pause(); } catch { /* yok say */ } });
  return audio;
}

const sourcesOf = (q) => ayahAudioSources(q.surah, q.ayah, state.quran.reciter);
const currentSources = () => {
  const q = S.queue[S.index];
  return q ? sourcesOf(q) : [];
};

/* ------------------------------------------------------------
   Kuyruk
   ------------------------------------------------------------ */
export function buildQueue(verses, surah, fromAyah) {
  S.queue = verses.map((v) => ({ surah, ayah: v.n }));
  S.index = Math.max(0, S.queue.findIndex((q) => q.ayah === fromAyah));
  if (S.index < 0) S.index = 0;
  loadCurrent();
}

function loadCurrent(autoplay = false) {
  const q = S.queue[S.index];
  if (!q) return;
  const a = ensureAudio();

  S.surah = q.surah;
  S.ayah = q.ayah;
  S.elapsed = 0;
  S.duration = 0;
  S.repeatLeft = S.repeat;
  S.loading = true;
  S.error = null;
  sourceIndex = 0;

  const urls = sourcesOf(q);
  if (!urls.length) { S.loading = false; S.error = 'unavailable'; emit(); return; }

  a.src = urls[0];
  a.playbackRate = S.speed;
  a.load();
  preloadNext();
  emit();

  if (autoplay) start();
}

/** Sonraki âyeti sessizce ön belleğe al — âyet geçişi takılmasın */
function preloadNext() {
  const nx = S.queue[S.index + 1];
  if (!nx) return;
  const url = sourcesOf(nx)[0];
  if (!url) return;
  if (!preloader) { preloader = new Audio(); preloader.preload = 'auto'; }
  if (preloader.src !== url) { preloader.src = url; preloader.load(); }
}

/* ------------------------------------------------------------
   Aktarım
   ------------------------------------------------------------ */
function start() {
  const a = ensureAudio();
  const p = a.play();
  if (p && typeof p.catch === 'function') {
    p.catch((err) => {
      S.playing = false;
      S.loading = false;
      // Tarayıcı, kullanıcı hareketi olmadan sesi engelledi
      S.error = err && err.name === 'NotAllowedError' ? 'gesture' : 'unavailable';
      emit();
    });
  }
}

export function play() {
  if (!S.queue.length) return;
  if (!audio || !audio.src) loadCurrent();
  start();
}

export function pause() {
  if (audio) audio.pause();
  S.playing = false;
  emit();
}

export function toggle() { S.playing ? pause() : play(); }

export function stop() {
  if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
  clearTimeout(S.sleepTimer);
  Object.assign(S, {
    playing: false, loading: false, error: null,
    queue: [], index: 0, elapsed: 0, duration: 0,
    surah: null, ayah: null, sleepAt: null, sleepTimer: null
  });
  emit();
}

function onEnded() {
  if (S.repeat === Infinity) { audio.currentTime = 0; start(); return; }
  if (S.repeatLeft > 1) { S.repeatLeft -= 1; audio.currentTime = 0; start(); return; }
  if (S.index < S.queue.length - 1) { S.index += 1; loadCurrent(true); return; }
  S.playing = false;
  emit();
}

export function next() {
  if (S.index < S.queue.length - 1) { S.index += 1; loadCurrent(S.playing); }
  else { pause(); }
}

export function prev() {
  if (audio && audio.currentTime > 2.5) { audio.currentTime = 0; emit(); return; }
  if (S.index > 0) { S.index -= 1; loadCurrent(S.playing); }
  else if (audio) { audio.currentTime = 0; emit(); }
}

export function jumpTo(ayah) {
  const i = S.queue.findIndex((q) => q.ayah === ayah);
  if (i < 0) return;
  S.index = i;
  loadCurrent(true);
}

/** Oynatıcı çubuğundaki şeritten konum değiştir */
export function seekRatio(ratio) {
  if (!audio || !S.duration) return;
  audio.currentTime = Math.max(0, Math.min(S.duration, ratio * S.duration));
  emit();
}

/* ------------------------------------------------------------
   Ayarlar
   ------------------------------------------------------------ */
export function setRepeat(n) { S.repeat = n; S.repeatLeft = n; emit(); }

export function setSpeed(x) {
  S.speed = x;
  if (audio) audio.playbackRate = x;
  emit();
}

export function setSleep(minutes) {
  clearTimeout(S.sleepTimer);
  if (!minutes) { S.sleepAt = null; S.sleepTimer = null; emit(); return; }
  S.sleepAt = Date.now() + minutes * 60000;
  S.sleepTimer = setTimeout(() => { S.sleepAt = null; pause(); }, minutes * 60000);
  emit();
}

/* ------------------------------------------------------------
   Durum
   ------------------------------------------------------------ */
export function status() {
  const r = RECITERS.find((x) => x.id === state.quran.reciter) ?? RECITERS[0];
  return {
    ...S,
    reciter: r,
    progress: S.duration ? Math.min(1, S.elapsed / S.duration) : 0,
    sleepLeftMin: S.sleepAt ? Math.max(0, Math.ceil((S.sleepAt - Date.now()) / 60000)) : 0
  };
}

export function subscribePlayer(fn) {
  listeners.add(fn);
  fn(status());
  return () => listeners.delete(fn);
}

function emit() { const s = status(); listeners.forEach((fn) => fn(s)); }

/* ------------------------------------------------------------
   Tek parça çalma (dua kartları gibi kuyruk gerektirmeyen yerler)
   Kuyruk oynatıcısını bozmaz; ayrı bir öğe kullanır.
   ------------------------------------------------------------ */
let oneShot = null;

/** urls: sırayla denenecek adresler (dizi ya da tek adres) */
export function playOnce(urls) {
  const list = Array.isArray(urls) ? urls.slice() : [urls];
  return new Promise((resolve, reject) => {
    if (!oneShot) oneShot = new Audio();
    oneShot.pause();
    oneShot.playbackRate = 1;

    let i = 0;
    const onError = () => {
      i += 1;
      if (i < list.length) { attach(); return; }
      cleanup();
      reject(new Error('audio'));
    };
    const onEnded = () => { cleanup(); resolve(); };
    const cleanup = () => {
      oneShot.removeEventListener('error', onError);
      oneShot.removeEventListener('ended', onEnded);
    };
    const attach = () => {
      oneShot.src = list[i];
      const p = oneShot.play();
      if (p && typeof p.catch === 'function') p.catch(onError);
    };

    oneShot.addEventListener('error', onError);
    oneShot.addEventListener('ended', onEnded);
    attach();
  });
}

export function stopOnce() { if (oneShot) oneShot.pause(); }
export const isPlayingOnce = () => !!oneShot && !oneShot.paused;
