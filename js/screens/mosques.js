/* ============================================================
   MİZAN — Yakındaki Camiler
   ------------------------------------------------------------
   Uygulamadaki TEK dış istek burasıdır. Geri kalan her şey
   cihazda hesaplanır; bu ekran ise yakındaki camileri bulmak
   için konumu bir sunucuya sormak zorundadır.

   Bu yüzden:
   · Varsayılan KAPALIDIR (state.app.mosqueLookup).
   · Kullanıcı ne olduğunu okumadan istek atılmaz.
   · Konum, gönderilmeden önce ~1 km'ye YUVARLANIR. Cami aramak
     için bu çözünürlük yeterli; tam koordinat göndermek gereksiz.
   · Sorgu OpenStreetMap'in açık Overpass servisine gider; hesap,
     çerez ya da kimlik bilgisi taşımaz.
   ============================================================ */

import { el, $, esc, toast, openSheet, closeSheet } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { back } from '../core/router.js';
import { state, commit } from '../core/state.js';
import { topbar, switchRow, empty } from './_blocks.js';

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const YARICAP_M = 3000;

/* Konum çözünürlüğünü kasıtlı düşür: 2 ondalık ≈ 1,1 km.
   Yakındaki camiyi bulmaya yeter, kişiyi bulmaya yetmez. */
const kabaKonum = (c) => ({
  lat: Math.round(c.lat * 100) / 100,
  lng: Math.round(c.lng * 100) / 100
});

/** İki nokta arası mesafe (metre) — haversine */
function mesafe(a, b) {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const mesafeYazi = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`);

let sonuc = null;      // null = henüz aranmadı
let yukleniyor = false;
let hata = null;

export const mosquesScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Yakındaki Camiler')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" data-panel></div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      if (act === 'back') { back('/ibadet'); return; }

      if (act === 'izin-ver') {
        state.app.mosqueLookup = true;
        commit('mosqueLookup');
        ciz(root);
        ara(root);
        return;
      }

      if (act === 'izin-kapat') {
        state.app.mosqueLookup = false;
        sonuc = null; hata = null;
        commit('mosqueLookup');
        ciz(root);
        toast('Konum paylaşımı kapatıldı.');
        return;
      }

      if (act === 'yenile') { ara(root); return; }

      if (act === 'harita') {
        const { lat, lng, ad } = n.dataset;
        // Cihazın kendi harita uygulamasına devrediyoruz; gömülü harita yok.
        const u = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
        window.open(u, '_blank', 'noopener');
        return;
      }

      if (act === 'nasil') { acNasil(); return; }
    });

    ciz(root);
    if (state.app.mosqueLookup && !sonuc) ara(root);
  },

  onShow(root) { ciz(root); }
};

/* ------------------------------------------------------------
   Çizim
   ------------------------------------------------------------ */
function ciz(root) {
  const panel = $('[data-panel]', root);
  if (!panel) return;

  if (!state.app.mosqueLookup) { panel.innerHTML = izinEkrani(); return; }

  panel.innerHTML = `
    ${yukleniyor ? `
      <section class="card" style="margin-top:4px">
        <p class="t-body t-center" style="color:var(--ink-500)">Yakındaki camiler aranıyor…</p>
      </section>` : ''}

    ${hata ? `
      <section class="card" style="margin-top:4px;border-color:var(--gold-line)">
        <p class="t-body">${esc(hata)}</p>
        <button class="btn btn--secondary btn--block" style="margin-top:14px" data-act="yenile">
          ${icon('refresh', 16)} Tekrar dene
        </button>
      </section>` : ''}

    ${(!yukleniyor && !hata && sonuc) ? (sonuc.length ? `
      <p class="section-title" style="margin-top:4px">${sonuc.length} cami · en yakından uzağa</p>
      <div class="list">
        ${sonuc.map((c) => `
          <button class="row-item" data-act="harita"
            data-lat="${c.lat}" data-lng="${c.lng}" data-ad="${esc(c.ad)}">
            <span class="row-item__main">
              <span class="row-item__title" style="display:block">${esc(c.ad)}</span>
              ${c.adres ? `<span class="row-item__sub">${esc(c.adres)}</span>` : ''}
            </span>
            <span class="row-item__value">${esc(mesafeYazi(c.m))}</span>
            <span class="row-item__chev">${icon('chevron', 16)}</span>
          </button>`).join('')}
      </div>
      <button class="btn btn--ghost btn--block" style="margin-top:14px" data-act="yenile">
        ${icon('refresh', 16)} Yenile
      </button>`
    : empty('Bu çevrede kayıtlı cami bulunamadı. Veriler gönüllülerce girildiği için eksik olabilir.', 'Tekrar dene', 'yenile')) : ''}

    <div class="not-kutusu" style="margin-top:22px">
      <p class="not-kutusu__baslik">Bu liste nereden geliyor?</p>
      <p class="not-kutusu__metin">
        Camiler <strong>OpenStreetMap</strong>’ten alınır. Veriler gönüllülerce
        girilir; bu yüzden eksik, güncel olmayan ya da adı yanlış yazılmış
        kayıtlar bulunabilir. Namaz vakitleri için caminin kendi ilanını esas al.
      </p>
      <p class="not-kutusu__metin">
        Konumun sorguya <strong>yaklaşık 1 km’ye yuvarlanarak</strong> gönderilir;
        tam koordinatın dışarı çıkmaz. Sorgu hesap ya da kimlik bilgisi taşımaz.
      </p>
      <button class="btn btn--ghost btn--block" style="margin-top:6px" data-act="nasil">
        ${icon('info', 16)} Ne gönderiliyor?
      </button>
    </div>

    <div class="list" style="margin-top:16px">
      ${switchRow({
    title: 'Konum paylaşımına izin ver',
    sub: 'Kapatırsan bu ekran dışarıya hiçbir istek atmaz',
    on: true, act: 'izin-kapat'
  })}
    </div>`;
}

function izinEkrani() {
  return `
    <section class="card" style="margin-top:4px;border-color:var(--gold-line)">
      <span class="card__label" style="color:var(--gold-text)">İzin Gerekiyor</span>
      <p class="t-h3" style="margin-top:10px">Bu özellik konumunu dışarı gönderir</p>
      <p class="t-body" style="margin-top:10px;color:var(--ink-700)">
        Mizan’ın geri kalanı tamamen cihazında çalışır: namaz vakitleri, kıble ve
        takvim hep burada hesaplanır. Yakındaki camileri bulmak ise bunun tek
        istisnasıdır — yakınında ne olduğunu ancak bir haritaya sorarak öğrenebiliriz.
      </p>
      <ul class="step__points" style="margin-top:14px">
        <li>Konumun <strong>yaklaşık 1 km’ye yuvarlanarak</strong> gönderilir</li>
        <li>Sorgu OpenStreetMap’in açık servisine gider</li>
        <li>Adın, hesabın ya da kimlik bilgin gönderilmez</li>
        <li>İstediğin an kapatabilirsin</li>
      </ul>
      <div class="col gap-8" style="margin-top:20px">
        <button class="btn btn--primary btn--block" data-act="izin-ver">İzin ver ve ara</button>
        <button class="btn btn--ghost btn--block" data-act="nasil">Ne gönderiliyor?</button>
      </div>
    </section>`;
}

function acNasil() {
  const k = kabaKonum(state.user.coords);
  openSheet('Ne gönderiliyor?', `
    <p class="t-body">
      Aşağıdaki istek, olduğu gibi OpenStreetMap’in açık Overpass servisine gönderilir.
      Başka hiçbir şey iletilmez.
    </p>
    <pre class="kod-blok">${esc(sorgu(k))}</pre>
    <p class="t-body" style="margin-top:14px;color:var(--ink-700)">
      <strong>${k.lat}, ${k.lng}</strong> — gerçek konumunun ~1 km’ye yuvarlanmış hâli.
      ${esc(state.user.city)} içindeki bir noktayı gösterir, seni değil.
    </p>
    <p class="source" style="margin-top:14px">
      Veri kaynağı: OpenStreetMap katkıcıları · ODbL lisansı
    </p>`);
}

/* ------------------------------------------------------------
   Sorgu
   ------------------------------------------------------------ */
function sorgu(k) {
  return `[out:json][timeout:20];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${YARICAP_M},${k.lat},${k.lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${YARICAP_M},${k.lat},${k.lng});
);
out center 60;`;
}

async function ara(root) {
  if (yukleniyor) return;
  yukleniyor = true; hata = null; sonuc = null;
  ciz(root);

  const gercek = state.user.coords;
  const k = kabaKonum(gercek);

  try {
    const kontrol = new AbortController();
    const zamanAsimi = setTimeout(() => kontrol.abort(), 20000);
    const cevap = await fetch(OVERPASS, {
      method: 'POST',
      body: sorgu(k),
      signal: kontrol.signal
    });
    clearTimeout(zamanAsimi);
    if (!cevap.ok) throw new Error('servis ' + cevap.status);

    const veri = await cevap.json();
    const liste = (veri.elements ?? [])
      .map((x) => {
        const lat = x.lat ?? x.center?.lat;
        const lng = x.lon ?? x.center?.lon;
        if (lat == null || lng == null) return null;
        const t = x.tags ?? {};
        const ad = t['name:tr'] || t.name || 'Adı girilmemiş cami';
        const adres = [t['addr:street'], t['addr:neighbourhood'] || t['addr:suburb']]
          .filter(Boolean).join(', ');
        // Mesafe GERÇEK konuma göre hesaplanır; bu hesap cihazda kalır.
        return { ad, adres, lat, lng, m: mesafe(gercek, { lat, lng }) };
      })
      .filter(Boolean)
      .sort((a, b) => a.m - b.m)
      .slice(0, 40);

    sonuc = liste;
  } catch (e) {
    sonuc = null;
    hata = e.name === 'AbortError'
      ? 'Arama zaman aşımına uğradı. Bağlantını kontrol edip tekrar deneyebilirsin.'
      : 'Camiler alınamadı. İnternet bağlantın yoksa bu özellik çalışmaz; uygulamanın geri kalanı çevrimdışı çalışmaya devam eder.';
  } finally {
    yukleniyor = false;
    ciz(root);
  }
}
