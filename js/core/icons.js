/* ============================================================
   MİZAN — İkon seti
   Tek çizgi kalınlığı (1.6), yuvarlak uç, 24×24. Dolgu yok.
   Süs ikonu yoktur; her ikon bir işleve karşılık gelir.
   ============================================================ */

const P = {
  /* --- Sekmeler --- */
  today: '<path d="M12 3.2v1.6M12 19.2v1.6M4.6 12H3M21 12h-1.6M6.4 6.4 5.3 5.3M18.7 18.7l-1.1-1.1M17.6 6.4l1.1-1.1M5.3 18.7l1.1-1.1"/><circle cx="12" cy="12" r="4.2"/>',
  quran: '<path d="M4 5.2A1.7 1.7 0 0 1 5.7 3.5H11a1 1 0 0 1 1 1v14.8a1 1 0 0 0-1-1H5.7A1.7 1.7 0 0 1 4 16.6z"/><path d="M20 5.2a1.7 1.7 0 0 0-1.7-1.7H13a1 1 0 0 0-1 1v14.8a1 1 0 0 1 1-1h5.3a1.7 1.7 0 0 0 1.7-1.7z"/><path d="M12 21.3v-2"/>',
  worship: '<path d="M12 2.8c2.5 2 4 4.2 4 6.5a4 4 0 0 1-8 0c0-2.3 1.5-4.5 4-6.5Z"/><path d="M4.5 21.2v-6.6c0-.7.5-1.2 1.2-1.2M19.5 21.2v-6.6c0-.7-.5-1.2-1.2-1.2"/><path d="M3.4 21.2h17.2"/><path d="M9 21.2v-3.4a3 3 0 0 1 6 0v3.4"/>',
  explore: '<circle cx="12" cy="12" r="9"/><path d="m14.9 9.1-1.6 4.2-4.2 1.6 1.6-4.2z"/>',
  profile: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.4a7.4 7.4 0 0 1 14.4 0"/>',

  /* --- Navigasyon --- */
  back: '<path d="M14.5 5 7.8 12l6.7 7"/>',
  chevron: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  chevronDown: '<path d="m5.5 9 6.5 6.5L18.5 9"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="6.4"/><path d="m16 16 4.2 4.2"/>',
  more: '<circle cx="12" cy="5.6" r="1.1"/><circle cx="12" cy="12" r="1.1"/><circle cx="12" cy="18.4" r="1.1"/>',
  external: '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',

  /* --- Eylemler --- */
  play: '<path d="M8 5.4 19 12 8 18.6z"/>',
  pause: '<path d="M9 5.5v13M15 5.5v13"/>',
  next: '<path d="M6 5.4 15 12 6 18.6zM18.4 5.4v13.2"/>',
  prev: '<path d="M18 5.4 9 12l9 6.6zM5.6 5.4v13.2"/>',
  repeat: '<path d="M4 9.5A3.5 3.5 0 0 1 7.5 6h11M18.5 3.2 21 6l-2.5 2.8"/><path d="M20 14.5a3.5 3.5 0 0 1-3.5 3.5h-11M5.5 20.8 3 18l2.5-2.8"/>',
  timer: '<circle cx="12" cy="13.2" r="7.4"/><path d="M12 9.4v4l2.4 1.6M9.4 2.6h5.2"/>',
  volume: '<path d="M11 5.5 6.6 9.2H3.6v5.6h3l4.4 3.7z"/><path d="M15.2 9.4a3.6 3.6 0 0 1 0 5.2M18 6.6a7.4 7.4 0 0 1 0 10.8"/>',
  headphones: '<path d="M4 15v-2.6a8 8 0 0 1 16 0V15"/><path d="M4 14.5h2a1 1 0 0 1 1 1v3.4a1 1 0 0 1-1 1H5.4A1.4 1.4 0 0 1 4 18.5zM20 14.5h-2a1 1 0 0 0-1 1v3.4a1 1 0 0 0 1 1h.6a1.4 1.4 0 0 0 1.4-1.4z"/>',
  bookmark: '<path d="M6.5 4.6h11a1 1 0 0 1 1 1v14.1l-6.5-4-6.5 4V5.6a1 1 0 0 1 1-1Z"/>',
  save: '<path d="M12 20.2s-7.6-4.6-7.6-9.6a4.2 4.2 0 0 1 7.6-2.5 4.2 4.2 0 0 1 7.6 2.5c0 5-7.6 9.6-7.6 9.6Z"/>',
  share: '<circle cx="17.6" cy="5.8" r="2.6"/><circle cx="6.4" cy="12" r="2.6"/><circle cx="17.6" cy="18.2" r="2.6"/><path d="m8.7 10.7 6.6-3.6M8.7 13.3l6.6 3.6"/>',
  copy: '<rect x="8.4" y="8.4" width="11.2" height="11.2" rx="2"/><path d="M15.6 5.6a2 2 0 0 0-2-2H6.4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 2 2"/>',
  check: '<path d="m5 12.6 4.6 4.4L19 7"/>',
  plus: '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
  minus: '<path d="M5.4 12h13.2"/>',
  refresh: '<path d="M20.2 12a8.2 8.2 0 1 1-2.6-6"/><path d="M20.4 4v4.4H16"/>',
  text: '<path d="M4.6 19 10 5.4h1.4L17 19M7 14.4h7.2"/><path d="M18.4 19 21 12.6M19.7 15.8h2.6" opacity=".55"/>',

  /* --- İçerik --- */
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5z"/>',
  calendar: '<rect x="3.6" y="5.4" width="16.8" height="15" rx="2.4"/><path d="M3.6 10.2h16.8M8.4 3.4v3.6M15.6 3.4v3.6"/>',
  calculator: '<rect x="4.6" y="3.4" width="14.8" height="17.2" rx="2.4"/><path d="M8 8h8M8.4 12.6h.01M12 12.6h.01M15.6 12.6h.01M8.4 16.6h.01M12 16.6h.01M15.6 16.6h7"/>',
  beads: '<circle cx="12" cy="4.8" r="1.9"/><circle cx="17.9" cy="7.6" r="1.9"/><circle cx="19.8" cy="13.8" r="1.9"/><circle cx="15.9" cy="18.8" r="1.9"/><circle cx="8.1" cy="18.8" r="1.9"/><circle cx="4.2" cy="13.8" r="1.9"/><circle cx="6.1" cy="7.6" r="1.9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 2.2"/>',
  chart: '<path d="M4 20.2h16"/><path d="M7 20.2v-6M12 20.2V7.4M17 20.2v-9.4"/>',
  book: '<path d="M4.4 4.6A1.6 1.6 0 0 1 6 3h13a1 1 0 0 1 1 1v13.4a1 1 0 0 1-1 1H6.6a2.2 2.2 0 0 0-2.2 2.2z"/><path d="M4.4 18.4A2.2 2.2 0 0 1 6.6 16.2H20"/>',
  moon: '<path d="M20.2 14.4A8.6 8.6 0 0 1 9.6 3.8a8.6 8.6 0 1 0 10.6 10.6Z"/>',
  sparkle: '<path d="M12 3.4 13.7 9l5.6 1.7-5.6 1.7L12 18l-1.7-5.6L4.7 10.7 10.3 9z"/><path d="M18.6 3.2v3M17.1 4.7h3" opacity=".6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.4M12 7.8h.01"/>',
  shield: '<path d="M12 3.2 4.8 6.1v5.5c0 4.3 2.9 8.1 7.2 9.2 4.3-1.1 7.2-4.9 7.2-9.2V6.1Z"/>',
  bell: '<path d="M18 9.6a6 6 0 1 0-12 0c0 4.6-1.8 6-1.8 6h15.6S18 14.2 18 9.6Z"/><path d="M13.7 19.4a2 2 0 0 1-3.4 0"/>',
  message: '<path d="M20.4 12.6a7.6 7.6 0 0 1-8.2 7.6 8.6 8.6 0 0 1-2.6-.4L4.2 21l1.4-4.6a7.4 7.4 0 0 1-1.2-4A7.6 7.6 0 0 1 12 4.8a7.6 7.6 0 0 1 8.4 7.8Z"/>',
  kaaba: '<path d="M12 3.2 4.6 6.6v10.8L12 20.8l7.4-3.4V6.6z"/><path d="M4.6 6.6 12 10l7.4-3.4M12 10v10.8"/><path d="M4.6 12.4 12 15.8l7.4-3.4" opacity=".5"/>',
  location: '<path d="M12 21.2s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10.2" r="2.6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3.2 12h17.6"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
  sunrise: '<path d="M12 4v5M8.8 7.2 12 4l3.2 3.2"/><path d="M3.4 17.4h3.2M17.4 17.4h3.2M6.4 13.6l-1.6-1.6M19.2 12l-1.6 1.6"/><path d="M7.8 17.4a4.2 4.2 0 0 1 8.4 0"/><path d="M2.6 20.6h18.8"/>',
  sunset: '<path d="M12 9V4M8.8 5.8 12 9l3.2-3.2"/><path d="M3.4 17.4h3.2M17.4 17.4h3.2M6.4 13.6l-1.6-1.6M19.2 12l-1.6 1.6"/><path d="M7.8 17.4a4.2 4.2 0 0 1 8.4 0"/><path d="M2.6 20.6h18.8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.2 14.4a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-2.6 1.1v.3a1.8 1.8 0 1 1-3.6 0v-.2a1.5 1.5 0 0 0-2.7-1.1l-.1.1A1.8 1.8 0 1 1 5.3 16.3l.1-.1a1.5 1.5 0 0 0-1.1-2.6h-.3a1.8 1.8 0 1 1 0-3.6h.2a1.5 1.5 0 0 0 1.1-2.7l-.1-.1a1.8 1.8 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 2.6-1.1v-.3a1.8 1.8 0 1 1 3.6 0v.2a1.5 1.5 0 0 0 2.6 1.1l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0 1.1 2.6h.3a1.8 1.8 0 1 1 0 3.6h-.2a1.5 1.5 0 0 0-1.4 1"/>',
  widget: '<rect x="3.4" y="3.4" width="7.4" height="7.4" rx="2"/><rect x="13.2" y="3.4" width="7.4" height="7.4" rx="2"/><rect x="3.4" y="13.2" width="7.4" height="7.4" rx="2"/><rect x="13.2" y="13.2" width="7.4" height="7.4" rx="2"/>',
  crown: '<path d="M3.6 7.6 7 12l5-6.6L17 12l3.4-4.4v9.6a1.4 1.4 0 0 1-1.4 1.4H5a1.4 1.4 0 0 1-1.4-1.4z"/>',
  fire: '<path d="M12 3.2s.9 3-1.4 5.4C8.3 11 7 12.6 7 14.8a5 5 0 0 0 10 0c0-2.6-1.6-4-2.8-5.6"/>',
  droplet: '<path d="M12 3.4c3 3.6 5.4 6.3 5.4 9.2a5.4 5.4 0 0 1-10.8 0c0-2.9 2.4-5.6 5.4-9.2Z"/>',
  target: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1"/>'
};

/** İkonu SVG dizesi olarak döndürür */
export function icon(name, size = 22, extra = '') {
  const body = P[name];
  if (!body) return '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none"
    stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" ${extra}>${body}</svg>`;
}

/* ------------------------------------------------------------
   MİZAN LOGOSU
   Marka işaretinin çizgi karşılığı: hilal · sivri kemer ·
   dört köşeli yıldız · iki kefe ve kaide.
   Küçük boyutlarda okunması için tek çizgi kalınlığında çizilir;
   altın detaylar `accent` ile ayrılır.
   Tam kilitleme (işaret + kelime markası) için `logoMark()` kullanılır.
   ------------------------------------------------------------ */
export function logo(size = 26, color = 'currentColor', accent = null) {
  const gold = accent ?? color;
  return `<svg viewBox="0 0 32 32" width="${size}" height="${size}" fill="none"
    stroke="${color}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"
    aria-hidden="true">
    <path d="M17.6 0.4a2.4 2.4 0 1 0 .1 4.7 1.9 1.9 0 1 1-.1-4.7z" fill="${gold}" stroke="none"/>
    <path d="M5.7 28.4V18C5.7 12.4 9.7 8.2 16 4.4c6.3 3.8 10.3 8 10.3 13.6v10.4"/>
    <path d="M10 28.4v-9.3c0-4 2.2-6.9 6-9.6 3.8 2.7 6 5.6 6 9.6v9.3" opacity=".42"/>
    <path d="M16 11.2l1.05 2.35L19.4 14.6l-2.35 1.05L16 18l-1.05-2.35L12.6 14.6l2.35-1.05z"
      fill="${gold}" stroke="none"/>
    <path d="M16 24.6c-1.9-2.1-4.6-3.2-7.5-3.2 1.4 2 4.1 3.2 7.5 3.2" stroke="${gold}"/>
    <path d="M16 24.6c1.9-2.1 4.6-3.2 7.5-3.2-1.4 2-4.1 3.2-7.5 3.2" stroke="${gold}"/>
    <path d="M12.5 25.3h7a3.5 3.5 0 0 1-7 0z" stroke="${gold}"/>
  </svg>`;
}

/* Marka görsellerinin TEK kaynağı. Paketleyici bu değerleri data URI ile
   değiştirir; tek dosya derlemesinde görseller bir kez gömülür. */
export const LOGO_SRC = 'assets/logo.png';
export const DESEN_SRC = 'assets/desen.png';

/** Tam marka kilitlemesi — yalnızca yer olan yerlerde (açılış, hakkımızda) */
export function logoMark(width = 180, alt = 'Mizan') {
  return `<img class="brand-mark" src="${LOGO_SRC}" alt="${alt}"
    style="width:${width}px" width="${width}">`;
}

/**
 * Marka amblemi — kelime markası olmadan, yalnızca işaret.
 * Ayrı dosya üretmeden aynı PNG'den CSS ile kırpılır; 40 px ve üstünde nettir.
 * Daha küçük boyutlarda `logo()` çizgi işareti kullanılmalıdır.
 */
export function logoEmblem(size = 52, alt = '') {
  return `<span class="brand-emblem" style="width:${size}px;height:${size}px"
    ${alt ? `role="img" aria-label="${alt}"` : 'aria-hidden="true"'}>
    <img src="${LOGO_SRC}" alt="">
  </span>`;
}

/* ------------------------------------------------------------
   Girih yıldızı — TEK motif, ızgara çizgisi yok.
   Karo döşemesi köşede kırpıldığında rastgele parça gibi okunuyordu;
   tek büyük yıldız kasıtlı bir süsleme gibi durur.
   ------------------------------------------------------------ */
export function girihStarUri(stroke = '%23ffffff') {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>` +
    `<g fill='none' stroke='${stroke}' stroke-width='1.6'>` +
    `<path d='M100 12 122 56 170 56 136 90 152 138 100 112 48 138 64 90 30 56 78 56z'/>` +
    `<rect x='44' y='44' width='112' height='112'/>` +
    `<rect x='44' y='44' width='112' height='112' transform='rotate(45 100 100)'/>` +
    `<circle cx='100' cy='100' r='56'/>` +
    `<circle cx='100' cy='100' r='79'/>` +
    `</g></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/"/g, "'")}")`;
}

/** Girih (8 köşeli yıldız) dokusu — kart arka planlarında, opacity ≤ .06 */
export function girihDataUri(stroke = '%23ffffff') {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>` +
    `<g fill='none' stroke='${stroke}' stroke-width='1'>` +
    `<path d='M50 4 61 28 89 28 68 46 77 74 50 58 23 74 32 46 11 28 39 28z'/>` +
    `<rect x='22' y='22' width='56' height='56' transform='rotate(45 50 50)'/>` +
    `<rect x='22' y='22' width='56' height='56'/>` +
    `<path d='M0 50h100M50 0v100'/>` +
    `</g></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#/g, '%23').replace(/"/g, "'")}")`;
}
