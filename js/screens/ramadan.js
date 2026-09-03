/* ============================================================
   MİZAN — Ramazan
   Mizan başka bir uygulamaya dönüşmez; tasarım dili aynen korunur,
   yalnızca Ramazan bağlamı öne çıkar.
   ============================================================ */

import { el, $, esc, hhmm, hms, trDate, trDayShort, relativeDays, openSheet, closeSheet, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state, commit, dayKey } from '../core/state.js';
import { subscribeClock, timesFor, invalidate } from '../core/clock.js';
import { toHijri, fromHijri, hijriMonthLength, ramadanState } from '../core/astro.js';
import { back, go } from '../core/router.js';
import { topbar, switchRow, segment } from './_blocks.js';
import { duaCard } from './_blocks.js';
import { duasOf } from '../data/content.js';
import { sharedActions } from './_actions.js';

let unsub = null;
let tab = 'bugun';

export const ramadanScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Ramazan', {
      action: `<button class="icon-btn icon-btn--bare" data-act="settings" aria-label="Ayarlar">${icon('settings', 19)}</button>`
    })}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" data-body></div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      if (act === 'back') { back('/kesfet'); return; }
      if (act === 'settings') { openSettings(root); return; }
      if (act === 'tab') { tab = n.dataset.id; paint(root); return; }
      if (act === 'toggle-fast') {
        const d = n.dataset.d;
        state.tracking.fasts[d] = !state.tracking.fasts[d];
        commit('tracking');
        n.classList.toggle('is-on', !!state.tracking.fasts[d]);
        n.innerHTML = state.tracking.fasts[d] ? icon('check', 14) : '';
        return;
      }
      if (act === 'fitre') { openFitre(); return; }
      if (act === 'zekat') { go('/ibadet/zekat'); return; }
      if (act === 'preview') {
        state.app.ramadanPreview = !state.app.ramadanPreview;
        commit('ramadan');
        document.documentElement.dataset.ramadan = state.app.ramadanPreview ? '1' : '';
        invalidate();
        paint(root);
        toast(state.app.ramadanPreview ? 'Ramazan modu önizleniyor.' : 'Önizleme kapatıldı.');
        return;
      }
      if (sharedActions[act]) sharedActions[act](n);
    });
  },

  onShow(root) {
    paint(root);
    unsub?.();
    unsub = subscribeClock((ctx) => {
      const cd = $('[data-rcount]', root);
      if (cd && ctx.ramadanTargetSec != null) cd.textContent = hms(ctx.ramadanTargetSec);
      const lb = $('[data-rlabel]', root);
      if (lb && ctx.ramadanLabel) lb.textContent = ctx.ramadanLabel.toLocaleUpperCase('tr');
    });
  },

  onHide() { unsub?.(); unsub = null; }
};

/* ------------------------------------------------------------ */
function paint(root) {
  const body = $('[data-body]', root);
  const now = new Date();
  const offset = state.app.hijriOffset;
  const ram = ramadanState(now, offset);
  const preview = state.app.ramadanPreview;

  if (!ram.active && !preview) {
    body.innerHTML = beforeRamadan(now, offset);
    return;
  }

  const day = ram.active ? ram.day : 17;
  const total = ram.active ? ram.total : 30;

  body.innerHTML = `
    ${heroCard(day, total)}
    <div style="margin-top:18px">
      ${segment([
    { id: 'bugun', name: 'Bugün' },
    { id: 'takvim', name: 'Takvim' },
    { id: 'oruc', name: 'Oruç' },
    { id: 'rehber', name: 'Rehber' }
  ], tab, 'tab')}
    </div>
    <div style="margin-top:16px">
      ${tab === 'bugun' ? todayPanel(now)
      : tab === 'takvim' ? calendarPanel(now, offset, total)
        : tab === 'oruc' ? fastPanel(now, offset, total)
          : guidePanel(now, offset)}
    </div>`;
}

/* ---------------- Ramazan öncesi ---------------- */
function beforeRamadan(now, offset) {
  const h = toHijri(now, offset);
  const year = h.month > 9 || (h.month === 9 && h.day > 1) ? h.year + 1 : h.year;
  const start = fromHijri(year, 9, 1, offset);
  const days = Math.round((new Date(start.getFullYear(), start.getMonth(), start.getDate())
    - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);

  return `
    <section class="card card--dark" style="margin-top:4px;background:var(--navy);overflow:hidden">
      <div class="girih-layer"></div>
      <div style="position:relative">
        <span class="card__label" style="color:var(--gold)">Ramazan ${year}</span>
        <p class="t-count" style="margin-top:12px;color:var(--on-navy)">${days}</p>
        <p style="font-size:14px;color:var(--on-navy-dim);margin-top:4px">gün kaldı</p>
        <hr style="border:0;height:1px;background:rgba(255,255,255,.14);margin:18px 0">
        <div class="row-between">
          <span style="font-size:13px;color:var(--on-navy-dim)">Başlangıç</span>
          <span style="font-size:14px;font-weight:600">${trDate(start)}</span>
        </div>
      </div>
    </section>

    <section class="card card--flush" style="margin-top:14px">
      <p class="t-sec">
        Ramazan girdiğinde Mizan kendiliğinden Ramazan moduna geçer:
        ana ekrana iftar ve imsak sayacı gelir, sahur alarmı ve teravih
        hatırlatıcısı kullanılabilir hâle gelir. Uygulamanın geri kalanı değişmez.
      </p>
    </section>

    <div class="list" style="margin-top:14px">
      ${switchRow({
    title: 'Ramazan modunu şimdi önizle',
    sub: 'Nasıl görüneceğini denemek için',
    on: state.app.ramadanPreview, act: 'preview'
  })}
    </div>`;
}

/* ---------------- Kahraman kart ---------------- */
function heroCard(day, total) {
  const pct = Math.round((day / total) * 100);
  return `
  <section class="card card--dark" style="margin-top:4px;background:linear-gradient(150deg,var(--navy) 0%,#0E1728 100%);overflow:hidden">
    <div class="girih-layer"></div>
    <div class="row-between" style="position:relative">
      <span class="card__label" style="color:var(--gold)">Ramazan</span>
      <span class="badge" style="background:rgba(255,255,255,.12);color:var(--on-navy)">${day} / ${total}. gün</span>
    </div>
    <div style="position:relative;margin-top:16px">
      <p class="t-cap" style="color:rgba(246,242,233,.6);letter-spacing:.14em" data-rlabel>İFTARA KALAN</p>
      <p class="t-count" style="margin-top:4px;color:var(--on-navy)" data-rcount>--:--:--</p>
    </div>
    <div class="progress" style="margin-top:20px;position:relative;background:rgba(255,255,255,.14)">
      <div class="progress__fill" style="width:${pct}%"></div>
    </div>
  </section>`;
}

/* ---------------- Bugün ---------------- */
function todayPanel(now) {
  const t = timesFor(now);
  const dua = duasOf('ramazan');
  return `
    <div class="row gap-10">
      <section class="card grow">
        <span class="card__label">İmsak</span>
        <p class="t-display t-num" style="font-size:28px;font-weight:400;margin-top:8px">${hhmm(t.imsak)}</p>
        <p class="t-sec" style="margin-top:2px">Sahur bitişi</p>
      </section>
      <section class="card grow">
        <span class="card__label">İftar</span>
        <p class="t-display t-num" style="font-size:28px;font-weight:400;margin-top:8px;color:var(--gold-text)">${hhmm(t.aksam)}</p>
        <p class="t-sec" style="margin-top:2px">Akşam vakti</p>
      </section>
    </div>

    <section class="card" style="margin-top:14px">
      <div class="row-between">
        <div>
          <span class="card__label">Teravih</span>
          <p class="t-h3" style="margin-top:8px">Yatsıdan sonra</p>
          <p class="t-sec" style="margin-top:2px">Yatsı ${hhmm(t.yatsi)}</p>
        </div>
        <span class="badge ${state.ramadan.taraweehReminder ? 'badge--gold' : ''}">
          ${state.ramadan.taraweehReminder ? 'Hatırlatıcı açık' : 'Hatırlatıcı kapalı'}
        </span>
      </div>
    </section>

    <div class="stack" style="margin-top:14px">
      ${dua.map((d) => duaCard(d, { label: d.title })).join('')}
    </div>`;
}

/* ---------------- Ramazan takvimi ---------------- */
function calendarPanel(now, offset, total) {
  const h = toHijri(now, offset);
  const year = h.month === 9 ? h.year : (h.month > 9 ? h.year + 1 : h.year);
  const rows = [];
  for (let d = 1; d <= total; d++) {
    const date = fromHijri(year, 9, d, offset);
    rows.push({ d, date, times: timesFor(date) });
  }
  const todayKey = dayKey(now);

  return `
    <div class="card card--pad0" style="overflow:hidden">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr>
            <th style="text-align:left;padding:13px 14px;font-size:10.5px;font-weight:600;color:var(--ink-500);letter-spacing:.05em">GÜN</th>
            <th style="text-align:left;padding:13px 6px;font-size:10.5px;font-weight:600;color:var(--ink-500);letter-spacing:.05em">TARİH</th>
            <th style="padding:13px 6px;font-size:10.5px;font-weight:600;color:var(--ink-500);letter-spacing:.05em">İMSAK</th>
            <th style="padding:13px 14px 13px 6px;font-size:10.5px;font-weight:600;color:var(--ink-500);letter-spacing:.05em">İFTAR</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r) => {
    const isToday = dayKey(r.date) === todayKey;
    return `
      <tr style="border-top:1px solid var(--line);${isToday ? 'background:var(--gold-soft)' : ''}">
        <td style="padding:12px 14px;font-weight:${isToday ? 700 : 600};font-variant-numeric:tabular-nums">${r.d}</td>
        <td style="padding:12px 6px;color:var(--ink-500);font-size:12px">${r.date.getDate()}.${String(r.date.getMonth() + 1).padStart(2, '0')} ${trDayShort(r.date)}</td>
        <td style="padding:12px 6px;text-align:center;font-variant-numeric:tabular-nums">${hhmm(r.times.imsak)}</td>
        <td style="padding:12px 14px 12px 6px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600">${hhmm(r.times.aksam)}</td>
      </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
    <p class="t-cap" style="margin-top:12px">Vakitler ${esc(state.user.city)} için hesaplandı.</p>`;
}

/* ---------------- Oruç takibi ---------------- */
function fastPanel(now, offset, total) {
  const h = toHijri(now, offset);
  const year = h.month === 9 ? h.year : (h.month > 9 ? h.year + 1 : h.year);
  let cells = '';
  let kept = 0;
  for (let d = 1; d <= total; d++) {
    const date = fromHijri(year, 9, d, offset);
    const k = dayKey(date);
    const on = !!state.tracking.fasts[k];
    if (on) kept++;
    const future = date > now;
    cells += `
      <button class="track-cell ${on ? 'is-on' : ''}" data-act="toggle-fast" data-d="${k}"
        ${future ? 'style="opacity:.4"' : ''} aria-label="Ramazan ${d}. gün">
        <span class="track-cell__day">${d}</span>
        <span class="track-cell__mark">${on ? icon('check', 13) : ''}</span>
      </button>`;
  }

  return `
    <section class="card card--flush">
      <div class="row-between">
        <span class="t-sec">Bu Ramazan tutulan</span>
        <span class="t-num" style="font-weight:600">${kept} / ${total} gün</span>
      </div>
      <div class="progress" style="margin-top:10px"><div class="progress__fill" style="width:${((kept / total) * 100).toFixed(1)}%"></div></div>
    </section>

    <div class="track-grid" style="margin-top:16px">${cells}</div>

    <section class="card card--flush" style="margin-top:18px">
      <p class="t-sec">
        İşaretlenmemiş bir gün eksik demek değildir; yalnızca kaydedilmemiştir.
        Mizan bu kayıttan seri veya puan üretmez.
      </p>
    </section>`;
}

/* ---------------- Rehber ---------------- */
function guidePanel(now, offset) {
  const h = toHijri(now, offset);
  const year = h.month === 9 ? h.year : (h.month > 9 ? h.year + 1 : h.year);
  const kadir = fromHijri(year, 9, 27, offset);
  const bayram = fromHijri(year, 10, 1, offset);
  const daysToBayram = Math.round((new Date(bayram.getFullYear(), bayram.getMonth(), bayram.getDate())
    - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);

  return `
    <section class="card" style="border-color:var(--gold-line)">
      <div class="row-between">
        <span class="card__label" style="color:var(--gold-text)">Kadir Gecesi</span>
        <span class="badge badge--gold">${relativeDays(kadir, now)}</span>
      </div>
      <p class="t-h3" style="margin-top:10px">${trDate(kadir)} gecesi</p>
      <p class="t-body" style="margin-top:8px;color:var(--ink-700)">
        Ramazan’ın 27. gecesi olarak anılır. Kadir sûresinde bu gecenin bin aydan
        hayırlı olduğu bildirilir. Hz. Peygamber’in Ramazan’ın son on gününde
        Kadir gecesini aramayı tavsiye ettiği rivayet edilmiştir.
      </p>
      <p class="source" style="margin-top:10px">Kadr 1–5 · Buhârî, Leyletü’l-Kadr 3</p>
      <div class="card__actions">
        <button class="chip" data-act="verse-tafsir" data-ref="97:1">${icon('book', 15)} Kadr Sûresi</button>
        <button class="chip" data-act="dua-share" data-id="bagislanma-2">${icon('share', 15)} Kadir Duası</button>
      </div>
    </section>

    <section class="card card--tap" style="margin-top:14px" data-act="fitre">
      <div class="row-between">
        <div>
          <span class="card__label">Fitre</span>
          <p class="t-h3" style="margin-top:8px">Sadaka-i Fıtır</p>
          <p class="t-sec" style="margin-top:2px">Kim verir, ne kadar, ne zaman</p>
        </div>
        <span class="row-item__chev">${icon('chevron', 16)}</span>
      </div>
    </section>

    <section class="card card--tap" style="margin-top:14px" data-act="zekat">
      <div class="row-between">
        <div>
          <span class="card__label">Zekât</span>
          <p class="t-h3" style="margin-top:8px">Zekât Hesaplayıcı</p>
          <p class="t-sec" style="margin-top:2px">Nisap ve tahmini tutar</p>
        </div>
        <span class="row-item__chev">${icon('chevron', 16)}</span>
      </div>
    </section>

    <section class="card" style="margin-top:14px">
      <div class="row-between">
        <div>
          <span class="card__label">Ramazan Bayramı</span>
          <p class="t-h3" style="margin-top:8px">${trDate(bayram)}</p>
          <p class="t-sec" style="margin-top:2px">${daysToBayram > 0 ? `${daysToBayram} gün kaldı` : 'Bugün'}</p>
        </div>
        <span class="badge badge--gold">Bayram</span>
      </div>
    </section>`;
}

/* ---------------- Fitre ---------------- */
function openFitre() {
  openSheet('Fitre (Sadaka-i Fıtır)', `
    <ul>
      ${[
      'Ramazan ayının sonunda, temel ihtiyaçlarının dışında nisap miktarı mala sahip olan müslümanların vermesi gereken sadakadır.',
      'Kişi kendisi ve bakmakla yükümlü olduğu kişiler için verir.',
      'Miktarı bir kişinin bir günlük ortalama yiyecek masrafı esas alınarak belirlenir. Diyanet İşleri Başkanlığı her yıl alt sınırı ilan eder.',
      'Ramazan boyunca verilebilir; en geç bayram namazından önce ödenmesi uygundur.',
      'Zekâttan farkı: zekât belirli malların kırkta biri iken, fitre kişi başına sabit bir miktardır.'
    ].map((t) => `
        <li class="t-body" style="padding:9px 0 9px 17px;position:relative;color:var(--ink-700)">
          <span style="position:absolute;left:0;top:16px;width:5px;height:5px;border-radius:50%;background:var(--gold)"></span>
          ${esc(t)}
        </li>`).join('')}
    </ul>
    <p class="card__label" style="margin-top:20px">Kaynaklar</p>
    <ul style="margin-top:6px">
      <li class="source" style="padding:4px 0">Buhârî, Zekât 70–78</li>
      <li class="source" style="padding:4px 0">Diyanet İşleri Başkanlığı, İlmihal, I/440–448</li>
    </ul>`);
}

/* ---------------- Ayarlar ---------------- */
function openSettings(root) {
  const r = state.ramadan;
  const body = openSheet('Ramazan Ayarları', `
    <div class="list">
      ${switchRow({ title: 'Sahur alarmı', sub: `İmsaktan ${r.suhoorLead} dakika önce`, on: r.suhoorAlarm, act: 'sw-suhoor' })}
      ${switchRow({ title: 'İftar bildirimi', sub: `Akşam vaktinden ${r.iftarLead} dakika önce`, on: r.iftarNotify, act: 'sw-iftar' })}
      ${switchRow({ title: 'İmsak bildirimi', sub: 'İmsak vakti girdiğinde', on: r.imsakNotify, act: 'sw-imsak' })}
      ${switchRow({ title: 'Teravih hatırlatıcısı', sub: 'Yatsıdan sonra', on: r.taraweehReminder, act: 'sw-teravih' })}
    </div>

    <p class="section-title">Sahur alarmı ne kadar önce?</p>
    <div class="segment">
      ${[30, 45, 60, 90].map((m) => `
        <button class="segment__item ${r.suhoorLead === m ? 'is-on' : ''}" data-act="lead" data-m="${m}">${m} dk</button>`).join('')}
    </div>

    <div class="list" style="margin-top:20px">
      ${switchRow({
      title: 'Ramazan modunu önizle',
      sub: 'Ramazan dışında da Ramazan ekranlarını görmek için',
      on: state.app.ramadanPreview, act: 'sw-preview'
    })}
    </div>

    <p class="t-sec" style="margin-top:16px">
      Ramazan modu ay girdiğinde kendiliğinden açılır, bittiğinde sessizce kapanır.
      Hiçbir verin kaybolmaz.
    </p>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    const act = n.dataset.act;
    const r = state.ramadan;
    const flip = (key) => { r[key] = !r[key]; n.querySelector('.switch').classList.toggle('is-on', r[key]); commit('ramadan'); };

    if (act === 'sw-suhoor') flip('suhoorAlarm');
    if (act === 'sw-iftar') flip('iftarNotify');
    if (act === 'sw-imsak') flip('imsakNotify');
    if (act === 'sw-teravih') flip('taraweehReminder');
    if (act === 'lead') {
      r.suhoorLead = Number(n.dataset.m);
      commit('ramadan');
      body.querySelectorAll('[data-act="lead"]').forEach((b) => b.classList.toggle('is-on', Number(b.dataset.m) === r.suhoorLead));
    }
    if (act === 'sw-preview') {
      state.app.ramadanPreview = !state.app.ramadanPreview;
      n.querySelector('.switch').classList.toggle('is-on', state.app.ramadanPreview);
      commit('ramadan');
      document.documentElement.dataset.ramadan = state.app.ramadanPreview ? '1' : '';
      invalidate();
      closeSheet();
      paint(root);
      toast(state.app.ramadanPreview ? 'Ramazan modu önizleniyor.' : 'Önizleme kapatıldı.');
    }
  });
}
