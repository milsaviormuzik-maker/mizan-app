/* ============================================================
   MİZAN — BUGÜN
   Uygulamanın kalbi. Kullanıcı açtığı anda o gün için ihtiyacı
   olan her şeyi tek ekranda görür.
   ============================================================ */

import { el, $, $$, esc, hhmm, hms, trDate, trDayName, relativeDays, openSheet, closeSheet, toast, ringSvg, applyAtmosphere } from '../core/ui.js';
import { icon, logo } from '../core/icons.js';
import { state, commit, CITIES } from '../core/state.js';
import { subscribeClock, invalidate } from '../core/clock.js';
import { PRAYER_KEYS, PRAYER_NAMES, SALAH_NAMES } from '../core/astro.js';
import { go } from '../core/router.js';
import { verseOfDay, hadithOfDay, duaOfDay, minuteCardOfDay, readingSuggestion } from '../data/daily.js';
import { upcomingDays } from '../data/calendar.js';
import { surahName } from '../data/quran-surahs.js';
import { infoById, MINUTE_CARDS } from '../data/content.js';
import { verseCard, hadithCard, duaCard } from './_blocks.js';
import { sharedActions } from './_actions.js';

let unsubscribe = null;
let renderedDay = '';

/* ------------------------------------------------------------
   Başlık — atmosfer bloğu
   ------------------------------------------------------------ */
function headerHtml(ctx) {
  const g = ctx.hijri;
  return `
  <header class="atmos" data-atmos>
    <div class="row-between" style="position:relative">
      <div class="row gap-10">
        <span style="display:grid;place-items:center;opacity:.92">${logo(30, 'currentColor', 'var(--atmos-accent)')}</span>
        <span class="wordmark">Mizan</span>
      </div>
      <button class="row gap-7 pressable" data-act="pick-city"
        style="color:var(--atmos-ink-dim);font-family:var(--font-serif);font-size:16px">
        ${icon('location', 16)}<span>${esc(state.user.city)}</span>
      </button>
    </div>

    <p class="atmos__date" style="position:relative">
      ${trDayName(ctx.now)}<span class="dot">·</span>${trDate(ctx.now)}<span class="dot">·</span>${g.day} ${g.monthName} ${g.year}
    </p>

    <div style="position:relative;margin-top:30px">
      <p class="t-vakit" style="color:var(--atmos-accent)" data-next-name>${esc(SALAH_NAMES[ctx.nextKey] ?? PRAYER_NAMES[ctx.nextKey])}</p>
      <p class="t-count" style="margin-top:10px;color:var(--atmos-ink)" data-countdown>${countdownHtml(ctx.remainingSec)}</p>
      <p style="font-family:var(--font-serif);font-size:16px;color:var(--atmos-ink-dim);margin-top:6px" data-next-label>
        ${esc(SALAH_NAMES[ctx.nextKey] ?? PRAYER_NAMES[ctx.nextKey])} ${ctx.nextKey === 'gunes' ? 'vaktine' : 'namazına'} kalan süre
      </p>
    </div>

    <div class="time-strip" data-strip>${stripHtml(ctx)}</div>
  </header>`;
}

/** Geri sayım — saat:dakika büyük, saniye ayrı bir birim olarak yanında */
function countdownHtml(sec) {
  const t = hms(sec);
  const [h, m, s] = t.split(':');
  return `${h}:${m}<span class="t-count__sec">${s} sn</span>`;
}

function stripHtml(ctx) {
  return PRAYER_KEYS.map((k) => {
    const cls = [
      'time-strip__cell',
      k === ctx.currentKey ? 'is-current' : '',
      k === ctx.nextKey ? 'is-next' : ''
    ].filter(Boolean).join(' ');
    return `<div class="${cls}" data-cell="${k}">
      <span class="time-strip__name">${PRAYER_NAMES[k]}</span>
      <span class="time-strip__time">${hhmm(ctx.today[k])}</span>
    </div>`;
  }).join('');
}

/* ------------------------------------------------------------
   Ramazan kartı
   ------------------------------------------------------------ */
function ramadanCardHtml(ctx) {
  const r = ctx.ramadan;
  if (!r.active) return '';
  const pct = Math.round((r.day / r.total) * 100);
  return `
  <section class="card card--tap card--dark" data-act="open-ramadan" style="background:linear-gradient(150deg, var(--navy) 0%, #0E1728 100%);overflow:hidden">
    <div class="girih-layer"></div>
    <div class="row-between" style="position:relative">
      <span class="card__label" style="color:var(--gold)">Ramazan</span>
      <span class="badge" style="background:rgba(255,255,255,.12);color:var(--on-navy)">${r.day} / ${r.total}. gün</span>
    </div>
    <div style="position:relative;margin-top:16px">
      <p class="t-cap" style="color:rgba(246,242,233,.6);letter-spacing:.14em">${esc(ctx.ramadanLabel.toLocaleUpperCase('tr'))}</p>
      <p class="t-count" style="margin-top:4px;color:var(--on-navy)" data-ramadan-count>${hms(ctx.ramadanTargetSec ?? 0)}</p>
    </div>
    <div class="row-between" style="position:relative;margin-top:20px;gap:10px">
      <div class="grow" style="padding:11px 14px;background:rgba(255,255,255,.08);border-radius:var(--r-md)">
        <p class="t-cap" style="color:rgba(246,242,233,.6)">İMSAK</p>
        <p class="t-num" style="font-size:17px;font-weight:600;margin-top:2px">${hhmm(ctx.today.imsak)}</p>
      </div>
      <div class="grow" style="padding:11px 14px;background:rgba(255,255,255,.08);border-radius:var(--r-md)">
        <p class="t-cap" style="color:rgba(246,242,233,.6)">İFTAR</p>
        <p class="t-num" style="font-size:17px;font-weight:600;margin-top:2px">${hhmm(ctx.today.aksam)}</p>
      </div>
    </div>
    <div class="progress" style="margin-top:18px;position:relative;background:rgba(255,255,255,.14)">
      <div class="progress__fill" style="width:${pct}%"></div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------
   Kur'an devam kartı
   ------------------------------------------------------------ */
function quranCardHtml() {
  const { surah, ayah } = state.quran.lastRead;
  const s = readingSuggestion(new Date(), state.app.hijriOffset);
  return `
  <section class="card card--tap" data-act="continue-quran">
    <div class="row-between">
      <div class="grow">
        <span class="card__label">${esc(s.title)}</span>
        <p class="t-h3" style="margin-top:9px">${esc(surahName(surah))} sûresi · ${ayah}. âyet</p>
        <p class="t-sec" style="margin-top:3px">${esc(s.text)}</p>
      </div>
      <span class="icon-btn" style="border-color:var(--gold-line);color:var(--gold)">${icon('play', 16)}</span>
    </div>
  </section>`;
}

/* ------------------------------------------------------------
   1 Dakikada Öğren
   ------------------------------------------------------------ */
function minuteCardHtml(card) {
  return `
  <section class="card card--tap" data-act="open-minute" data-id="${card.id}">
    <div class="card__head">
      <span class="card__label">1 Dakikada Öğren</span>
      <span class="row-item__chev">${icon('chevron', 16)}</span>
    </div>
    <p class="t-h3">${esc(card.q)}</p>
    <p class="t-sec" style="margin-top:7px;color:var(--ink-700)">${esc(card.a)}</p>
  </section>`;
}

/* ------------------------------------------------------------
   Yaklaşan dini gün
   ------------------------------------------------------------ */
function upcomingHtml(ctx) {
  const next = upcomingDays(ctx.now, 1)[0];
  if (!next) return '';
  return `
  <section class="card card--tap" data-act="open-calendar">
    <div class="row-between">
      <div class="grow">
        <span class="card__label">Yaklaşan</span>
        <p class="t-h3" style="margin-top:9px">${esc(next.name)}</p>
        <p class="t-sec" style="margin-top:3px">${trDate(next.date)} · ${relativeDays(next.date, ctx.now)}</p>
      </div>
      <span class="badge badge--gold">${next.kind === 'kandil' ? 'Kandil' : next.kind === 'bayram' ? 'Bayram' : 'Özel Gün'}</span>
    </div>
  </section>`;
}

/* ============================================================
   Ekran
   ============================================================ */
export const todayScreen = {
  render() {
    const root = el(`<div class="screen"><div class="scroll" data-scroll></div></div>`);
    return root;
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      if (sharedActions[act] && !['back'].includes(act)) { sharedActions[act](n); return; }

      switch (act) {
        case 'pick-city': openCityPicker(); break;
        case 'continue-quran': {
          const { surah, ayah } = state.quran.lastRead;
          go(`/kuran/oku/${surah}/${ayah}`);
          break;
        }
        case 'open-ramadan': go('/kesfet/ramazan'); break;
        case 'open-calendar': go('/ibadet/takvim'); break;
        case 'open-times': go('/ibadet/vakitler'); break;
        case 'open-minute': openMinute(n.dataset.id); break;
      }
    });

    // Vakit şeridine dokununca vakitler ekranı
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-strip]') || e.target.closest('[data-countdown]')) go('/ibadet/vakitler');
    });
  },

  onShow(root) {
    unsubscribe?.();
    unsubscribe = subscribeClock((ctx) => paint(root, ctx));
  },

  onHide() { unsubscribe?.(); unsubscribe = null; }
};

/* ------------------------------------------------------------
   Boyama — tam çizim günde bir, sonra sadece sayaç güncellenir
   ------------------------------------------------------------ */
function paint(root, ctx) {
  const scroll = $('[data-scroll]', root);
  const key = `${ctx.dayKey}|${ctx.nextKey}|${ctx.ramadan.active}|${state.user.city}`;

  if (key !== renderedDay) {
    renderedDay = key;
    const verse = verseOfDay(ctx.now, state.app.hijriOffset);
    const hadith = hadithOfDay(ctx.now);
    const dua = duaOfDay(ctx.now, state.app.hijriOffset);
    const minute = minuteCardOfDay(ctx.now);
    const top = scroll.scrollTop;

    scroll.innerHTML = `
      ${headerHtml(ctx)}
      <div class="screen__body pad-tabbar stack stagger" style="padding-top:14px">
        ${ramadanCardHtml(ctx)}
        ${verseCard(verse)}
        ${quranCardHtml()}
        ${hadithCard(hadith)}
        ${duaCard(dua)}
        ${minuteCardHtml(minute)}
        ${upcomingHtml(ctx)}
        <p class="t-cap t-center" style="margin-top:14px;color:var(--ink-300)">
          Vakitler ${esc(state.user.city)} için hesaplandı
        </p>
      </div>`;
    scroll.scrollTop = top;
  }

  applyAtmosphere(ctx.phase);

  const cd = $('[data-countdown]', scroll);
  if (cd) cd.innerHTML = countdownHtml(ctx.remainingSec);

  const rc = $('[data-ramadan-count]', scroll);
  if (rc && ctx.ramadanTargetSec != null) rc.textContent = hms(ctx.ramadanTargetSec);

  const ring = $('[data-ring] .ring__fill', scroll);
  if (ring) {
    const c = 2 * Math.PI * ((66 - 2.5) / 2);
    ring.setAttribute('stroke-dashoffset', (c * (1 - ctx.progress)).toFixed(2));
  }
}

/* ------------------------------------------------------------
   Şehir seçici
   ------------------------------------------------------------ */
export function openCityPicker() {
  const body = openSheet('Konum', `
    <div class="search" style="margin-bottom:14px">
      ${icon('search', 16)}
      <input type="text" placeholder="Şehir ara" data-city-search aria-label="Şehir ara">
    </div>
    <button class="btn btn--secondary btn--block" data-act="use-gps" style="margin-bottom:16px">
      ${icon('location', 17)} Konumumu Kullan
    </button>
    <div class="list" data-city-list>
      ${CITIES.map((c) => `
        <button class="row-item" data-act="set-city" data-city="${esc(c.name)}">
          <span class="row-item__main"><span class="row-item__title">${esc(c.name)}</span></span>
          ${c.name === state.user.city ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>`);

  const input = $('[data-city-search]', body);
  input?.addEventListener('input', () => {
    const q = input.value.trim().toLocaleLowerCase('tr');
    $$('[data-city-list] .row-item', body).forEach((r) => {
      r.style.display = r.dataset.city.toLocaleLowerCase('tr').includes(q) ? '' : 'none';
    });
  });

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'set-city') {
      const c = CITIES.find((x) => x.name === n.dataset.city);
      if (c) {
        state.user.city = c.name;
        state.user.coords = { lat: c.lat, lng: c.lng };
        state.user.autoLocation = false;
        commit('city');
        invalidate();
        renderedDay = '';
        toast(`Konum ${c.name} olarak ayarlandı.`);
        closeSheet();
      }
    }
    if (n.dataset.act === 'use-gps') {
      if (!navigator.geolocation) { toast('Bu cihazda konum servisi yok.'); return; }
      toast('Konum alınıyor…');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.user.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const near = nearestCity(state.user.coords);
          state.user.city = near ? near.name : 'Konumum';
          state.user.autoLocation = true;
          commit('city'); invalidate(); renderedDay = '';
          toast(`Konum güncellendi: ${state.user.city}`);
          closeSheet();
        },
        () => toast('Konum izni verilmedi. Şehri elle seçebilirsin.')
      );
    }
  });
}

function nearestCity(coords) {
  let best = null, bestD = Infinity;
  for (const c of CITIES) {
    const d = (c.lat - coords.lat) ** 2 + (c.lng - coords.lng) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return bestD < 4 ? best : null;
}

/* ------------------------------------------------------------
   1 Dakikada Öğren — detay
   ------------------------------------------------------------ */
function openMinute(id) {
  const card = MINUTE_CARDS.find((x) => x.id === id);
  if (!card) return;
  const article = card.link ? infoById(card.link) : null;
  openSheet(card.q, `
    <p class="t-body">${esc(card.a)}</p>
    ${article ? `
      <hr class="hairline" style="margin:20px 0">
      <p class="card__label">Detaylı bilgi</p>
      <ul style="margin-top:10px">
        ${article.body.map((line) => `
          <li class="t-body" style="padding:7px 0 7px 16px;position:relative;color:var(--ink-700)">
            <span style="position:absolute;left:0;top:13px;width:4px;height:4px;border-radius:50%;background:var(--gold)"></span>
            ${esc(line)}
          </li>`).join('')}
      </ul>
      <p class="card__label" style="margin-top:20px">Kaynaklar</p>
      <ul style="margin-top:6px">
        ${article.sources.map((x) => `<li class="source" style="padding:4px 0">${esc(x)}</li>`).join('')}
      </ul>` : ''}
  `);
}
