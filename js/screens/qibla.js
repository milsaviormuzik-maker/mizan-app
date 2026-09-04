/* ============================================================
   MİZAN — Kıble
   Kâbe yönü büyük daire kerterizi ile HESAPLANIR.
   Cihaz pusulası varsa canlı döner; yoksa kuzeye göre sabit gösterir.
   ============================================================ */

import { el, $, esc, toast, trNumber } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state } from '../core/state.js';
import { qiblaBearing, distanceToKaaba } from '../core/astro.js';
import { back } from '../core/router.js';
import { topbar } from './_blocks.js';

let orientationHandler = null;
let heading = null;          // cihaz yönü (derece) · null = pusula yok
let accuracy = null;

const DIRS = [
  [0, 'K'], [45, 'KD'], [90, 'D'], [135, 'GD'],
  [180, 'G'], [225, 'GB'], [270, 'B'], [315, 'KB']
];

export const qiblaScreen = {
  render() {
    const bearing = qiblaBearing(state.user.coords);
    const dist = distanceToKaaba(state.user.coords);

    return el(`
      <div class="screen">
        ${topbar('Kıble')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-safe" style="display:flex;flex-direction:column;align-items:center;padding-top:8px">

            <p class="t-cap">${esc(state.user.city)} · KÂBE'YE ${trNumber(dist)} KM</p>

            <div style="position:relative;width:288px;height:288px;margin-top:26px;overflow:clip" data-compass>
              <!-- Sabit dış halka -->
              <svg viewBox="0 0 288 288" width="288" height="288" style="position:absolute;inset:0">
                <circle cx="144" cy="144" r="139" fill="none" stroke="var(--line)" stroke-width="1"/>
                <circle cx="144" cy="144" r="118" fill="none" stroke="var(--line)" stroke-width="1" opacity=".6"/>
              </svg>

              <!-- Dönen kadran -->
              <div data-dial style="position:absolute;inset:0;transition:transform 220ms ease-out">
                <svg viewBox="0 0 288 288" width="288" height="288">
                  ${ticks()}
                  ${DIRS.map(([deg, label]) => {
      const rad = (deg - 90) * Math.PI / 180;
      const x = 144 + Math.cos(rad) * 100;
      const y = 144 + Math.sin(rad) * 100;
      return `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle"
                      font-size="${deg === 0 ? 15 : 12}" font-weight="${deg === 0 ? 700 : 500}"
                      fill="${deg === 0 ? 'var(--clay)' : 'var(--ink-500)'}"
                      font-family="var(--font-display)">${label}</text>`;
    }).join('')}
                </svg>

                <!-- Kâbe göstergesi (kadranla birlikte döner) -->
                <div data-kaaba style="position:absolute;inset:0;transform:rotate(${bearing}deg)">
                  <div style="position:absolute;left:50%;top:8px;transform:translateX(-50%);
                    display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--gold)">
                    ${icon('kaaba', 26)}
                    <span style="width:2px;height:26px;background:linear-gradient(var(--gold),transparent)"></span>
                  </div>
                </div>
              </div>

              <!-- Merkez -->
              <div style="position:absolute;inset:0;display:grid;place-items:center;pointer-events:none">
                <div style="text-align:center">
                  <p class="t-count" style="font-size:42px" data-deg>${Math.round(bearing)}°</p>
                  <p class="t-cap" style="margin-top:2px">KIBLE YÖNÜ</p>
                </div>
              </div>

              <!-- Üst nişangâh -->
              <div style="position:absolute;left:50%;top:-4px;transform:translateX(-50%);
                width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;
                border-top:11px solid var(--ink-900)"></div>
            </div>

            <div class="card" style="margin-top:30px;width:100%">
              <div class="row-between" style="align-items:flex-start">
                <span class="t-sec" style="flex:none">Durum</span>
                <span class="t-sec" style="color:var(--ink-900);font-weight:550;text-align:right" data-status>Kontrol ediliyor…</span>
              </div>
              <hr class="divider" style="margin:12px 0">
              <div class="row-between">
                <span class="t-sec">Kâbe kerterizi</span>
                <span class="t-num t-sec" style="color:var(--ink-900);font-weight:550">${bearing.toFixed(1)}° (gerçek kuzeye göre)</span>
              </div>
              <div class="row-between" style="margin-top:8px">
                <span class="t-sec">Mesafe</span>
                <span class="t-num t-sec" style="color:var(--ink-900);font-weight:550">${trNumber(dist)} km</span>
              </div>
              <div class="row-between" style="margin-top:8px">
                <span class="t-sec">Koordinat</span>
                <span class="t-num t-sec" style="color:var(--ink-900);font-weight:550">
                  ${state.user.coords.lat.toFixed(4)}, ${state.user.coords.lng.toFixed(4)}
                </span>
              </div>
            </div>

            <button class="btn btn--secondary btn--block" style="margin-top:14px" data-act="calibrate">
              ${icon('refresh', 17)} Pusulayı Kalibre Et
            </button>

            <p class="t-sec t-center" style="margin-top:16px;padding:0 12px">
              Kalibrasyon için telefonu havada sekiz çizer gibi hareket ettir.
              Metal yüzeyler ve elektronik cihazlar pusulayı etkileyebilir.
            </p>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') back('/ibadet');
      if (n.dataset.act === 'calibrate') requestCompass(root, true);
    });
  },

  onShow(root) { requestCompass(root); },

  onHide() {
    if (orientationHandler) {
      removeEventListener('deviceorientationabsolute', orientationHandler);
      removeEventListener('deviceorientation', orientationHandler);
      orientationHandler = null;
    }
  }
};

function ticks() {
  let out = '';
  for (let d = 0; d < 360; d += 5) {
    const major = d % 45 === 0;
    const rad = (d - 90) * Math.PI / 180;
    const r1 = major ? 122 : 130;
    const r2 = 137;
    out += `<line x1="${(144 + Math.cos(rad) * r1).toFixed(1)}" y1="${(144 + Math.sin(rad) * r1).toFixed(1)}"
      x2="${(144 + Math.cos(rad) * r2).toFixed(1)}" y2="${(144 + Math.sin(rad) * r2).toFixed(1)}"
      stroke="${major ? 'var(--ink-500)' : 'var(--ink-300)'}" stroke-width="${major ? 1.6 : 1}" opacity="${major ? 1 : .5}"/>`;
  }
  return out;
}

function setStatus(root, text) {
  const s = $('[data-status]', root);
  if (s) s.textContent = text;
}

async function requestCompass(root, explicit = false) {
  const dial = $('[data-dial]', root);

  // iOS 13+ izin ister
  if (typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function') {
    if (!explicit) { setStatus(root, 'Pusula için dokun'); }
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res !== 'granted') { setStatus(root, 'Pusula izni verilmedi'); return; }
    } catch { setStatus(root, 'Pusula kullanılamıyor'); return; }
  }

  if (!('DeviceOrientationEvent' in window)) {
    setStatus(root, 'Bu cihazda pusula yok — yön gerçek kuzeye göre');
    return;
  }

  if (orientationHandler) {
    removeEventListener('deviceorientationabsolute', orientationHandler);
    removeEventListener('deviceorientation', orientationHandler);
  }

  let got = false;
  orientationHandler = (e) => {
    let h = null;
    if (typeof e.webkitCompassHeading === 'number') {   // iOS
      h = e.webkitCompassHeading;
      accuracy = e.webkitCompassAccuracy;
    } else if (e.absolute && typeof e.alpha === 'number') {
      h = 360 - e.alpha;
    }
    if (h == null || Number.isNaN(h)) return;
    got = true;
    heading = h;
    dial.style.transform = `rotate(${-h}deg)`;
    setStatus(root, accuracy != null && accuracy > 15 ? 'Kalibrasyon gerekli' : 'Pusula hazır');
  };

  addEventListener('deviceorientationabsolute', orientationHandler, true);
  addEventListener('deviceorientation', orientationHandler, true);

  setTimeout(() => {
    if (!got) {
      setStatus(root, 'Pusula yok — telefonun üstünü kuzeye çevir');
      if (explicit) toast('Bu cihazda pusula sensörü bulunamadı.');
    }
  }, 1200);
}
