/* ============================================================
   MİZAN — Onboarding
   4 ekran, ~25 saniye. Hesap istenmez, her adım atlanabilir.
   ============================================================ */

import { el, $, $$, esc, toast } from '../core/ui.js';
import { icon, lockup } from '../core/icons.js';
import { state, commit, CITIES } from '../core/state.js';
import { invalidate } from '../core/clock.js';
import { PRAYER_KEYS, PRAYER_NAMES } from '../core/astro.js';
import { MEALS } from '../data/quran-surahs.js';

let step = 0;
let onDone = null;

export function mountOnboarding(host, done) {
  onDone = done;
  step = 0;

  const node = el(`
    <div class="onb">
      <div class="onb__slide is-on" data-slide="0">
        <div class="onb__brand">
          <div class="onb__medallion" aria-hidden="true"></div>
          <div class="onb__lockup">
            <span class="onb__logo">${lockup(232, { zemin: 'koyu' })}</span>
            <span class="onb__rule" aria-hidden="true"></span>
            <p class="onb__tag">Günün, ibadetin, dengen.</p>
          </div>
          <div class="onb__cta">
            <button class="btn btn--gold btn--block" data-act="next">Başla</button>
          </div>
        </div>
      </div>

      <div class="onb__slide" data-slide="1">
        <div class="onb__hero">
          <span style="color:var(--gold)">${icon('location', 34)}</span>
          <h2 class="t-h1" style="margin-top:20px">Konum</h2>
          <p class="t-body" style="margin-top:10px;color:var(--ink-700);max-width:300px">
            Doğru namaz vakitlerini ve kıble yönünü gösterebilmemiz için konumuna ihtiyacımız var.
            Konumun cihazından dışarı çıkmaz.
          </p>
        </div>
        <div class="col gap-8">
          <button class="btn btn--primary btn--block" data-act="gps">${icon('location', 17)} Konumumu Kullan</button>
          <button class="btn btn--secondary btn--block" data-act="manual">Şehri Manuel Seç</button>
        </div>
        <div data-cities style="margin-top:14px;display:none;max-height:240px;overflow-y:auto" class="list scroll"></div>
      </div>

      <div class="onb__slide" data-slide="2">
        <div class="onb__hero" style="min-height:150px">
          <span style="color:var(--gold)">${icon('bell', 34)}</span>
          <h2 class="t-h1" style="margin-top:20px">Hatırlatma</h2>
          <p class="t-body" style="margin-top:10px;color:var(--ink-700)">
            Hangi vakitlerde hatırlatmamızı istersin? Sonradan her vakti ayrı ayrı ayarlayabilirsin.
          </p>
        </div>
        <div class="list" data-notify>
          ${PRAYER_KEYS.map((k) => `
            <button class="row-item" data-act="toggle-notify" data-k="${k}">
              <span class="row-item__main"><span class="row-item__title">${PRAYER_NAMES[k]}</span></span>
              <span class="switch ${state.prayer.notify[k] !== 'off' ? 'is-on' : ''}"></span>
            </button>`).join('')}
        </div>
        <div class="col gap-8" style="margin-top:16px">
          <button class="btn btn--primary btn--block" data-act="next">Devam</button>
          <button class="btn btn--ghost btn--block" data-act="skip-notify">Şimdi Değil</button>
        </div>
      </div>

      <div class="onb__slide" data-slide="3">
        <div class="onb__hero" style="min-height:130px">
          <span style="color:var(--gold)">${icon('book', 34)}</span>
          <h2 class="t-h1" style="margin-top:20px">Kur’an</h2>
          <p class="t-body" style="margin-top:10px;color:var(--ink-700)">
            Hangi meali okumak istersin?
          </p>
        </div>
        <div class="list" data-meals>
          ${MEALS.filter((m) => m.free).map((m) => `
            <button class="row-item" data-act="meal" data-id="${m.id}">
              <span class="row-item__main">
                <span class="row-item__title" style="display:block">${esc(m.name)}</span>
                <span class="row-item__sub">${esc(m.sub)}</span>
              </span>
              <span data-check>${m.id === state.quran.meal ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}</span>
            </button>`).join('')}
        </div>
        <button class="btn btn--primary btn--block" style="margin-top:20px" data-act="finish">
          Mizan’a Başla
        </button>
      </div>

      <div class="onb__dots">
        ${[0, 1, 2, 3].map((i) => `<span class="onb__dot ${i === 0 ? 'is-on' : ''}" data-dot="${i}"></span>`).join('')}
      </div>
    </div>`);

  host.append(node);

  node.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    const act = n.dataset.act;

    if (act === 'next') { goStep(node, step + 1); return; }
    if (act === 'skip-notify') {
      PRAYER_KEYS.forEach((k) => { state.prayer.notify[k] = 'off'; });
      commit('notify'); goStep(node, 3); return;
    }
    if (act === 'gps') {
      if (!navigator.geolocation) { toast('Konum servisi yok. Şehri elle seçebilirsin.'); showCities(node); return; }
      toast('Konum alınıyor…');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.user.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          let best = CITIES[0], bd = Infinity;
          for (const c of CITIES) {
            const d = (c.lat - state.user.coords.lat) ** 2 + (c.lng - state.user.coords.lng) ** 2;
            if (d < bd) { bd = d; best = c; }
          }
          state.user.city = bd < 4 ? best.name : 'Konumum';
          state.user.autoLocation = true;
          commit('city'); invalidate();
          toast(`Konum: ${state.user.city}`);
          goStep(node, 2);
        },
        () => { toast('Konum izni verilmedi. Şehri elle seçebilirsin.'); showCities(node); }
      );
      return;
    }
    if (act === 'manual') { showCities(node); return; }
    if (act === 'city') {
      const c = CITIES.find((x) => x.name === n.dataset.city);
      state.user.city = c.name;
      state.user.coords = { lat: c.lat, lng: c.lng };
      commit('city'); invalidate();
      // Tik önce görünür, sonra geçilir: dokunuşun karşılık verdiği anlaşılsın
      $$('[data-act="city"] [data-check]', node).forEach((x) => { x.innerHTML = ''; });
      n.querySelector('[data-check]').innerHTML =
        `<span style="color:var(--gold-text)">${icon('check', 18)}</span>`;
      setTimeout(() => goStep(node, 2), 260);
      return;
    }
    if (act === 'toggle-notify') {
      const k = n.dataset.k;
      state.prayer.notify[k] = state.prayer.notify[k] === 'off' ? (k === 'gunes' ? 'silent' : 'ezan') : 'off';
      n.querySelector('.switch').classList.toggle('is-on', state.prayer.notify[k] !== 'off');
      commit('notify');
      return;
    }
    if (act === 'meal') {
      state.quran.meal = n.dataset.id;
      commit('meal');
      $$('[data-act="meal"] [data-check]', node).forEach((c) => { c.innerHTML = ''; });
      n.querySelector('[data-check]').innerHTML = `<span style="color:var(--gold-text)">${icon('check', 18)}</span>`;
      return;
    }
    if (act === 'finish') {
      state.user.onboarded = true;
      commit('onboarded');
      node.style.transition = 'opacity 320ms ease';
      node.style.opacity = '0';
      setTimeout(() => { node.remove(); onDone?.(); }, 320);
    }
  });

  return node;
}

function goStep(node, i) {
  step = Math.max(0, Math.min(3, i));
  $$('.onb__slide', node).forEach((s) => s.classList.toggle('is-on', Number(s.dataset.slide) === step));
  $$('.onb__dot', node).forEach((d) => d.classList.toggle('is-on', Number(d.dataset.dot) === step));
}

function showCities(node) {
  const box = $('[data-cities]', node);
  box.style.display = 'block';
  // Hiçbir şehir önceden işaretlenmez. İstanbul varsayılan olduğu için tikli
  // görünüyor, kullanıcı da seçim yapmadan devam etmeye çalışıyordu.
  box.innerHTML = CITIES.map((c) => `
    <button class="row-item" data-act="city" data-city="${esc(c.name)}">
      <span class="row-item__main"><span class="row-item__title">${esc(c.name)}</span></span>
      <span data-check></span>
    </button>`).join('');
}
