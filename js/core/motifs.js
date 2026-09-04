/* ============================================================
   MİZAN — Motif kütüphanesi
   ------------------------------------------------------------
   Motif burada SÜS DEĞİL YAPIDIR. Üstüne serpilmez; içeriği
   çerçeveler, köşeyi tutar, başlığı taşır.

   Geometri gerçekten kuruluyor — yaklaşık çizim değil. Yıldız
   poligonları {n/adım} formülüyle üretiliyor:
     · {8/3}  → rub'u'l-hizb yıldızı (mushafta cüz işareti)
     · {10/3} → girih gülü
     · {12/5} → geniş panel dokusu

   Hepsi tek çizgi kalınlığında, `currentColor` ile çizilir; rengi
   kullanıldığı yer belirler. Ölçekten bağımsız nettir.
   ============================================================ */

const TAU = Math.PI * 2;

/** {n/adım} yıldız poligonunun köşe noktaları */
function starPoints(cx, cy, r, n, step, rot = 0) {
  const p = [];
  const gorulen = new Set();
  let i = 0;
  do {
    gorulen.add(i);
    const a = rot + (i * TAU) / n;
    p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    i = (i + step) % n;
  } while (!gorulen.has(i));
  return p;
}

const yol = (pts) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('') + 'Z';

/** Düzgün çokgen */
function polygon(cx, cy, r, n, rot = 0) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i * TAU) / n;
    p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return p;
}

/* ------------------------------------------------------------
   RUB'U'L-HİZB — ۞
   Mushafta cüzün sekizde birini işaretleyen sekiz köşeli yıldız.
   İki kare üst üste: biri 45° döndürülmüş. Ortada küçük bir
   sekizgen boşluk kalır.
   ------------------------------------------------------------ */
export function rubElHizb(size = 26, opts = {}) {
  const c = 50, r = 44;
  const kare1 = yol(polygon(c, c, r, 4, -Math.PI / 4));
  const kare2 = yol(polygon(c, c, r, 4, 0));
  const ic = yol(polygon(c, c, 15, 8, Math.PI / 8));
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="${opts.kalinlik ?? 3}" stroke-linejoin="round"
    aria-hidden="true" class="${opts.sinif ?? ''}">
    <path d="${kare1}"/><path d="${kare2}"/><path d="${ic}" opacity=".55"/>
  </svg>`;
}

/* ------------------------------------------------------------
   ŞEMSE — güneş madalyonu
   İç içe yıldız poligonları. Katmanlar zıt yönde döndürülebilir;
   `donen` verilirse dış halka yavaşça döner.
   ------------------------------------------------------------ */
export function semse(size = 200, opts = {}) {
  const c = 100;
  const k = opts.kalinlik ?? 1.4;
  const dis = yol(starPoints(c, c, 92, 12, 5));
  const orta = yol(starPoints(c, c, 68, 10, 3));
  const ic = yol(starPoints(c, c, 44, 8, 3));
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="${k}" stroke-linejoin="round"
    aria-hidden="true" class="motif ${opts.sinif ?? ''}">
    <g class="${opts.donen ? 'motif__don' : ''}">
      <circle cx="${c}" cy="${c}" r="94" opacity=".28"/>
      <path d="${dis}" opacity=".5"/>
    </g>
    <g class="${opts.donen ? 'motif__don-ters' : ''}">
      <path d="${orta}" opacity=".75"/>
    </g>
    <path d="${ic}"/>
    <circle cx="${c}" cy="${c}" r="16" opacity=".45"/>
  </svg>`;
}

/* ------------------------------------------------------------
   KÖŞEBENT — kartın köşesini tutan üçgen tezhip
   Köşeden içeri doğru açılan yay demeti + küçük yıldız.
   ------------------------------------------------------------ */
export function kosebent(size = 62, opts = {}) {
  const yaylar = [16, 26, 36, 46]
    .map((r, i) => `<path d="M0 ${r} A${r} ${r} 0 0 0 ${r} 0" opacity="${(0.7 - i * 0.13).toFixed(2)}"/>`)
    .join('');
  const yildiz = yol(starPoints(13, 13, 8, 8, 3));
  return `<svg viewBox="0 0 62 62" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="${opts.kalinlik ?? 1.1}" stroke-linejoin="round"
    aria-hidden="true" class="motif ${opts.sinif ?? ''}">
    ${yaylar}
    <path d="${yildiz}" opacity=".85"/>
  </svg>`;
}

/* ------------------------------------------------------------
   ZENCEREK — örgü şerit
   Bölüm başlıklarının yanındaki düz çizginin yerini alır.
   İki sinüs dalgasının birbirinin içinden geçmesiyle kurulur.
   ------------------------------------------------------------ */
export function zencerek(genislik = 120, opts = {}) {
  const h = 14, adim = 14;
  const n = Math.max(2, Math.round(genislik / adim));
  const dalga = (faz) => {
    let d = `M0 ${h / 2}`;
    for (let i = 0; i < n; i++) {
      const x0 = i * adim, x1 = x0 + adim / 2, x2 = x0 + adim;
      const y = faz ? 2 : h - 2;
      d += `Q${x1} ${y} ${x2} ${h / 2}`;
    }
    return d;
  };
  const w = n * adim;
  return `<svg viewBox="0 0 ${w} ${h}" width="${genislik}" height="${h}" fill="none"
    preserveAspectRatio="none" stroke="currentColor" stroke-width="${opts.kalinlik ?? 1}"
    aria-hidden="true" class="motif ${opts.sinif ?? ''}">
    <path d="${dalga(true)}" opacity=".85"/>
    <path d="${dalga(false)}" opacity=".85"/>
  </svg>`;
}

/* ------------------------------------------------------------
   SÛRE BAŞLIĞI — mushaftaki tezhipli bant
   Ortada sûre adı için boşluk bırakan kartuş; iki yanında
   şemse yarımları, üst ve altta örgü hat.
   ------------------------------------------------------------ */
export function sureBasligi(opts = {}) {
  const k = opts.kalinlik ?? 1.1;
  const yildizSol = yol(starPoints(26, 30, 15, 8, 3));
  const yildizSag = yol(starPoints(274, 30, 15, 8, 3));
  return `<svg viewBox="0 0 300 60" width="100%" height="60" fill="none"
    preserveAspectRatio="xMidYMid meet" stroke="currentColor" stroke-width="${k}"
    stroke-linejoin="round" aria-hidden="true" class="motif ${opts.sinif ?? ''}">
    <path class="motif__ciz" d="M8 30 H44" opacity=".5"/>
    <path class="motif__ciz" d="M256 30 H292" opacity=".5"/>
    <path d="${yildizSol}" opacity=".9"/>
    <path d="${yildizSag}" opacity=".9"/>
    <path class="motif__ciz" d="M52 12 H248 M52 48 H248" opacity=".42"/>
    <path class="motif__ciz" d="M52 12 Q44 30 52 48 M248 12 Q256 30 248 48" opacity=".42"/>
  </svg>`;
}

/* ------------------------------------------------------------
   GİRİH PANELİ — kart arkası için gerçek örgü
   Altıgen ızgara üzerine oturan {12/5} yıldızlar; aralarına
   bağlantı çizgileri. Karo değil, tek bir kompozisyon: köşede
   kırpıldığında rastgele parça gibi okunmaz.
   ------------------------------------------------------------ */
export function girihPanel(opts = {}) {
  const k = opts.kalinlik ?? 0.9;
  const merkezler = [
    [60, 46], [180, 46], [300, 46],
    [0, 120], [120, 120], [240, 120], [360, 120],
    [60, 194], [180, 194], [300, 194]
  ];
  const yildizlar = merkezler
    .map(([x, y]) => `<path d="${yol(starPoints(x, y, 40, 12, 5))}"/>`)
    .join('');
  const altigenler = merkezler
    .map(([x, y]) => `<path d="${yol(polygon(x, y, 40, 6, Math.PI / 6))}" opacity=".4"/>`)
    .join('');
  return `<svg viewBox="0 0 360 240" width="100%" height="100%" fill="none"
    preserveAspectRatio="xMidYMid slice" stroke="currentColor" stroke-width="${k}"
    stroke-linejoin="round" aria-hidden="true" class="motif ${opts.sinif ?? ''}">
    ${altigenler}${yildizlar}
  </svg>`;
}

/* ------------------------------------------------------------
   ÂYET KARTUŞU — âyeti çevreleyen tezhipli çerçeve
   Dört köşede köşebent, kenarlarda ince hat. Kartın kendisini
   sarar; içerik çerçevenin İÇİNDE durur.
   ------------------------------------------------------------ */
export function kartus(opts = {}) {
  const kose = kosebent(54, { kalinlik: 1 });
  return `<span class="kartus" aria-hidden="true">
    <span class="kartus__kose kartus__kose--su">${kose}</span>
    <span class="kartus__kose kartus__kose--sa">${kose}</span>
    <span class="kartus__kose kartus__kose--au">${kose}</span>
    <span class="kartus__kose kartus__kose--aa">${kose}</span>
  </span>`;
}
