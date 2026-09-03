/* ============================================================
   MİZAN — Uygulama başlangıcı
   Tema · atmosfer · sekme çubuğu · yönlendirme · saat
   ============================================================ */

import { $, initSheet, initToast, applyAtmosphere, closeSheet } from './core/ui.js';
import { icon, girihDataUri, girihStarUri } from './core/icons.js';
import { state, subscribe } from './core/state.js';
import { startClock, subscribeClock, now as clockNow } from './core/clock.js';
import { defineRoute, initRouter, go, scrollTop, currentTab } from './core/router.js';
import { ARABIC_FONTS } from './data/quran-surahs.js';

import { todayScreen } from './screens/today.js';
import { quranScreen } from './screens/quran.js';
import { readerScreen } from './screens/reader.js';
import { worshipScreen } from './screens/worship.js';
import { prayerTimesScreen } from './screens/prayer-times.js';
import { qiblaScreen } from './screens/qibla.js';
import { tasbihScreen } from './screens/tasbih.js';
import { zakatScreen } from './screens/zakat.js';
import { trackingScreen } from './screens/tracking.js';
import { calendarScreen } from './screens/hijri-calendar.js';
import {
  exploreScreen, duaCatsScreen, duaListScreen, hadithScreen,
  infoScreen, hajjScreen, learnScreen
} from './screens/explore.js';
import { askScreen } from './screens/ask.js';
import { ramadanScreen } from './screens/ramadan.js';
import { profileScreen, applyTheme } from './screens/profile.js';
import { widgetScreen } from './screens/widgets.js';
import { mountOnboarding } from './screens/onboarding.js';

/* ------------------------------------------------------------
   1 · Görsel tercihler
   ------------------------------------------------------------ */
function applyPrefs() {
  applyTheme();
  document.documentElement.dataset.night = state.app.nightReading ? '1' : '';
  document.documentElement.dataset.ramadan =
    (state.app.ramadanPreview || clockNow()?.ramadan?.active) ? '1' : '';
  const f = ARABIC_FONTS.find((x) => x.id === state.quran.arabicFont);
  if (f) document.documentElement.style.setProperty('--font-arabic', f.stack);
}

/* Girih dokusu — temaya göre çizgi rengi */
function applyGirih() {
  const dark = document.documentElement.dataset.theme === 'dark' ||
    (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const r = document.documentElement.style;
  r.setProperty('--girih', girihDataUri(dark ? '%23D9BA6E' : '%23ffffff'));
  // Maske olarak kullanılır; rengi maskede değil, altındaki dolguda belirlenir
  r.setProperty('--girih-star', girihStarUri('%23ffffff'));
}

/* ------------------------------------------------------------
   2 · Rotalar
   ------------------------------------------------------------ */
const TABS = [
  { id: 'bugun', path: '/bugun', label: 'Bugün', ic: 'today' },
  { id: 'kuran', path: '/kuran', label: 'Kur’an', ic: 'quran' },
  { id: 'ibadet', path: '/ibadet', label: 'İbadet', ic: 'worship' },
  { id: 'kesfet', path: '/kesfet', label: 'Keşfet', ic: 'explore' },
  { id: 'profil', path: '/profil', label: 'Profil', ic: 'profile' }
];

function registerRoutes() {
  defineRoute({ path: '/bugun', tab: 'bugun', root: true, mod: todayScreen });

  defineRoute({ path: '/kuran', tab: 'kuran', root: true, mod: quranScreen });
  defineRoute({ path: '/kuran/oku/:surah/:ayah', tab: 'kuran', mod: readerScreen, chrome: 'none' });

  defineRoute({ path: '/ibadet', tab: 'ibadet', root: true, mod: worshipScreen });
  defineRoute({ path: '/ibadet/vakitler', tab: 'ibadet', mod: prayerTimesScreen });
  defineRoute({ path: '/ibadet/kible', tab: 'ibadet', mod: qiblaScreen, chrome: 'none' });
  defineRoute({ path: '/ibadet/tesbih', tab: 'ibadet', mod: tasbihScreen });
  defineRoute({ path: '/ibadet/zekat', tab: 'ibadet', mod: zakatScreen });
  defineRoute({ path: '/ibadet/takip', tab: 'ibadet', mod: trackingScreen });
  defineRoute({ path: '/ibadet/takvim', tab: 'ibadet', mod: calendarScreen });

  defineRoute({ path: '/kesfet', tab: 'kesfet', root: true, mod: exploreScreen });
  defineRoute({ path: '/kesfet/sor', tab: 'kesfet', mod: askScreen });
  defineRoute({ path: '/kesfet/dualar', tab: 'kesfet', mod: duaCatsScreen });
  defineRoute({ path: '/kesfet/dualar/:cat', tab: 'kesfet', mod: duaListScreen });
  defineRoute({ path: '/kesfet/hadisler', tab: 'kesfet', mod: hadithScreen });
  defineRoute({ path: '/kesfet/bilgiler', tab: 'kesfet', mod: infoScreen });
  defineRoute({ path: '/kesfet/hac', tab: 'kesfet', mod: hajjScreen });
  defineRoute({ path: '/kesfet/ogren', tab: 'kesfet', mod: learnScreen });
  defineRoute({ path: '/kesfet/ramazan', tab: 'kesfet', mod: ramadanScreen });

  defineRoute({ path: '/profil', tab: 'profil', root: true, mod: profileScreen });
  defineRoute({ path: '/widget', tab: 'profil', mod: widgetScreen });
}

/* ------------------------------------------------------------
   3 · Sekme çubuğu
   ------------------------------------------------------------ */
function buildTabbar() {
  const bar = $('#tabbar');
  bar.innerHTML = TABS.map((t) => `
    <button class="tab" data-tab="${t.id}" data-path="${t.path}" aria-label="${t.label}">
      ${icon(t.ic, 23)}
      <span class="tab__label">${t.label}</span>
      <span class="tab__dot"></span>
    </button>`).join('');

  bar.addEventListener('click', (e) => {
    const n = e.target.closest('[data-tab]');
    if (!n) return;
    closeSheet();
    if (currentTab() === n.dataset.tab && location.hash === `#${n.dataset.path}`) scrollTop();
    else go(n.dataset.path);
  });
}

let tabbarTimer = null;

function syncTabbar(info) {
  const bar = $('#tabbar');
  bar.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-on', t.dataset.tab === info.tab));

  const hide = info.chrome === 'none';
  bar.classList.toggle('is-hidden', hide);

  // Görünürlüğü geçişin tamamlanmasına bırakmıyoruz: kaydırma animasyonu
  // bittiğinde çubuk düzenden tamamen çıkar, dönüşte hemen geri gelir.
  clearTimeout(tabbarTimer);
  if (hide) {
    tabbarTimer = setTimeout(() => {
      if (bar.classList.contains('is-hidden')) bar.style.visibility = 'hidden';
    }, 300);
  } else {
    bar.style.visibility = '';
  }
}

/* ------------------------------------------------------------
   4 · Başlat
   ------------------------------------------------------------ */
function boot() {
  const screen = $('#screen');
  initSheet(screen);
  initToast(screen);

  applyPrefs();
  applyGirih();
  startClock();
  applyAtmosphere(clockNow().phase);

  registerRoutes();
  buildTabbar();

  if (!location.hash) location.hash = '#/bugun';
  initRouter($('#viewport'), { onChange: syncTabbar });

  if (!state.user.onboarded) {
    $('#tabbar').classList.add('is-hidden');
    mountOnboarding(screen, () => {
      applyPrefs();
      applyAtmosphere(clockNow().phase);
      syncTabbar({ tab: currentTab(), chrome: 'tabbar' });
    });
  }

  // Ramazan durumu değişirse kök öznitelik güncellensin
  subscribeClock((ctx) => {
    const on = state.app.ramadanPreview || ctx.ramadan.active;
    const cur = document.documentElement.dataset.ramadan === '1';
    if (on !== cur) document.documentElement.dataset.ramadan = on ? '1' : '';
  });

  // Sistem teması değişince atmosfer ve doku yeniden hesaplansın
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.app.theme === 'system') { applyGirih(); applyAtmosphere(clockNow().phase); }
  });

  subscribe(() => applyGirih());

  // Klavye ile gezinme (masaüstü önizleme kolaylığı)
  addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    const i = TABS.findIndex((t) => t.id === currentTab());
    if (e.key === 'ArrowRight' && i < TABS.length - 1) go(TABS[i + 1].path);
    if (e.key === 'ArrowLeft' && i > 0) go(TABS[i - 1].path);
  });
}

/* ------------------------------------------------------------
   5 · Çevrimdışı kabuk
   Ana ekrana eklendiğinde uygulama internetsiz de açılsın.
   Yalnızca güvenli bağlamda (https veya localhost) çalışır.
   ------------------------------------------------------------ */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!isSecureContext) return;                 // http://192.168.x.x'te kayıt yapılmaz
  addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* çevrimdışı desteği yok, uygulama yine çalışır */ });
  });
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
else boot();

registerServiceWorker();
