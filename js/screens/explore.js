/* ============================================================
   MİZAN — KEŞFET
   İçerik kütüphanesi: Mizan Sor · Dualar · Hadisler · Dini Bilgiler
   Hac & Umre · Kur'an Öğren · Ramazan
   ============================================================ */

import { el, $, $$, esc, openSheet, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state } from '../core/state.js';
import { now as clockNow } from '../core/clock.js';
import { go, back } from '../core/router.js';
import {
  DUA_CATEGORIES, DUAS, duasOf, duaById,
  HADITH_CATEGORIES, HADITHS, hadithsOf,
  INFO_CATEGORIES, INFO_ARTICLES, infoOf, infoById,
  HAJJ_STEPS
} from '../data/content.js';
import { topbar, segment, duaCard, hadithCard, empty } from './_blocks.js';
import { girihPanel } from '../core/motifs.js';
import { sharedActions, shareDua, listenDua, shareHadith } from './_actions.js';

/* ============================================================
   KÖK EKRAN
   ============================================================ */
export const exploreScreen = {
  render() {
    const ram = clockNow().ramadan;
    return el(`
      <div class="screen">
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar stagger" style="padding-top:58px">
            <h1 class="t-h1">Keşfet</h1>

            <section class="card card--tap card--dark" style="margin-top:18px;background:var(--navy)"
              data-act="go" data-path="/kesfet/sor">
              <span class="girih-panel">${girihPanel()}</span>
              <div class="row-between" style="position:relative">
                <div class="grow">
                  <span class="card__label" style="color:var(--gold)">Mizan Sor</span>
                  <p class="t-h2" style="margin-top:9px;color:var(--on-navy)">Dini bir sorun mu var?</p>
                  <p style="font-size:13.5px;color:var(--on-navy-dim);margin-top:4px">
                    Kaynaklarıyla birlikte cevap alırsın. Fetva verilmez.
                  </p>
                </div>
                <span class="icon-btn" style="background:rgba(255,255,255,.12);color:var(--on-navy)">${icon('message', 18)}</span>
              </div>
            </section>

            ${ram.active ? `
              <section class="card card--tap" style="margin-top:14px;border-color:var(--gold-line)"
                data-act="go" data-path="/kesfet/ramazan">
                <div class="row-between">
                  <div>
                    <span class="card__label" style="color:var(--gold-text)">Ramazan</span>
                    <p class="t-h3" style="margin-top:8px">Ramazan Rehberi</p>
                    <p class="t-sec" style="margin-top:2px">${ram.day}. gün · oruç takibi, fitre, teravih</p>
                  </div>
                  <span class="row-item__chev">${icon('chevron', 16)}</span>
                </div>
              </section>` : ''}

            <p class="section-title">Kütüphane</p>
            <div class="list">
              ${[
        ['/kesfet/dualar', 'save', 'Dualar', `${DUAS.length} dua · ${DUA_CATEGORIES.length} kategori`, 'gul'],
        ['/kesfet/esma', 'sparkle', 'Esmâ-i Hüsnâ', '99 isim · anlamlarıyla', 'amber'],
        ['/kesfet/hadisler', 'book', 'Hadisler', `${HADITHS.length} hadis · kaynaklarıyla`, 'yesim'],
        ['/kesfet/bilgiler', 'info', 'Dini Bilgiler', `${INFO_ARTICLES.length} konu · abdest, namaz, oruç, zekât`, 'lacivert'],
        ['/kesfet/hac', 'kaaba', 'Hac ve Umre Rehberi', 'İhramdan veda tavafına 7 adım', 'firuze'],
        ['/kesfet/ruya', 'moon', 'Rüya', 'Hadislerde rüya · tabir yok', 'mor'],
        ['/kesfet/ogren', 'text', 'Kur’an Öğren', 'Elif-Bâ ve tecvid', 'amber']
      ].map(([path, ic, name, sub, ton]) => `
                <button class="row-item" data-act="go" data-path="${path}">
                  <span class="satir-ikon" data-ton="${ton}">${icon(ic, 19)}</span>
                  <span class="row-item__main">
                    <span class="row-item__title" style="display:block">${name}</span>
                    <span class="row-item__sub">${sub}</span>
                  </span>
                  <span class="row-item__chev">${icon('chevron', 16)}</span>
                </button>`).join('')}
            </div>

            <p class="section-title">Sık Kullanılan</p>
            <div class="cat-grid">
              ${[['sabah','amber'], ['aksam','mor'], ['uyku','lacivert'], ['sikinti','gul'], ['bereket','yesim'], ['korunma','firuze']].map(([id, ton]) => {
        const c = DUA_CATEGORIES.find((x) => x.id === id);
        return `<button class="cat" data-ton="${ton}" data-act="go" data-path="/kesfet/dualar/${id}">
                  <span class="cat__name">${esc(c.name)}</span>
                  <span class="cat__count">${duasOf(id).length} dua</span>
                </button>`;
      }).join('')}
            </div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act="go"]');
      if (n) go(n.dataset.path);
    });
  }
};

/* ============================================================
   DUALAR — kategori listesi
   ============================================================ */
export const duaCatsScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Dualar')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">
            <div class="search" style="margin-top:4px">
              ${icon('search', 16)}
              <input type="text" placeholder="Dua ara" data-q aria-label="Dua ara">
            </div>
            <div data-panel></div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    const input = $('[data-q]', root);
    const panel = $('[data-panel]', root);

    const paint = () => {
      const q = input.value.trim().toLocaleLowerCase('tr');
      if (q.length >= 2) {
        const hits = DUAS.filter((d) =>
          `${d.title} ${d.tr} ${d.tl}`.toLocaleLowerCase('tr').includes(q));
        panel.innerHTML = hits.length ? `
          <p class="section-title">${hits.length} sonuç</p>
          <div class="list">
            ${hits.map((d) => rowDua(d)).join('')}
          </div>` : empty('Aramanla eşleşen dua bulunamadı.');
        return;
      }
      panel.innerHTML = `
        <p class="section-title">Kategoriler</p>
        <div class="list">
          ${DUA_CATEGORIES.map((c) => `
            <button class="row-item" data-act="cat" data-id="${c.id}">
              <span class="row-item__main">
                <span class="row-item__title" style="display:block">${esc(c.name)}</span>
                <span class="row-item__sub">${esc(c.desc)}</span>
              </span>
              <span class="row-item__value">${duasOf(c.id).length}</span>
              <span class="row-item__chev">${icon('chevron', 16)}</span>
            </button>`).join('')}
        </div>`;
    };

    input.addEventListener('input', paint);
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') back('/kesfet');
      if (n.dataset.act === 'cat') go(`/kesfet/dualar/${n.dataset.id}`);
      if (n.dataset.act === 'dua') openDua(n.dataset.id);
    });
    paint();
  }
};

function rowDua(d) {
  const cat = DUA_CATEGORIES.find((c) => c.id === d.cat);
  return `
    <button class="row-item" data-act="dua" data-id="${d.id}">
      <span class="row-item__main">
        <span class="row-item__title" style="display:block">${esc(d.title)}</span>
        <span class="row-item__sub">${esc(cat?.name ?? '')}</span>
      </span>
      <span class="row-item__chev">${icon('chevron', 16)}</span>
    </button>`;
}

/* ============================================================
   DUALAR — kategori içi
   ============================================================ */
export const duaListScreen = {
  render(params) {
    const cat = DUA_CATEGORIES.find((c) => c.id === params.cat) ?? DUA_CATEGORIES[0];
    const list = duasOf(cat.id);
    return el(`
      <div class="screen">
        ${topbar(cat.name)}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar stack" style="padding-top:6px">
            <p class="t-sec" style="margin-bottom:2px">${esc(cat.desc)} · ${list.length} dua</p>
            ${list.length ? list.map((d) => duaCard(d, { label: d.title })).join('')
        : empty('Bu kategoriye henüz dua eklenmedi.')}
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') { back('/kesfet/dualar'); return; }
      if (sharedActions[n.dataset.act]) sharedActions[n.dataset.act](n);
    });
  }
};

function openDua(id) {
  const d = duaById(id);
  if (!d) return;
  const body = openSheet(d.title, `
    <p class="arabic" dir="rtl" lang="ar">${d.ar}</p>
    <p class="translit" style="margin-top:14px">${esc(d.tl)}</p>
    <hr class="divider" style="margin:14px 0">
    <p class="t-body">${esc(d.tr)}</p>
    <p class="source" style="margin-top:12px">${esc(d.src)}</p>
    <div class="row gap-8" style="margin-top:20px">
      ${d.ayah ? `<button class="chip" data-act="listen">${icon('volume', 15)} Sesli Dinle</button>` : ''}
      <button class="chip" data-act="share">${icon('share', 15)} Paylaş</button>
    </div>`);
  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'listen') listenDua(id);
    if (n.dataset.act === 'share') shareDua(id);
  });
}

/* ============================================================
   HADİSLER
   ============================================================ */
let hadithCat = 'hepsi';

export const hadithScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Hadisler')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">
            ${segment([{ id: 'hepsi', name: 'Tümü' }, ...HADITH_CATEGORIES], hadithCat, 'cat')}
            <div class="stack" data-panel style="margin-top:16px"></div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    const paint = () => {
      const list = hadithCat === 'hepsi' ? HADITHS : hadithsOf(hadithCat);
      $('[data-panel]', root).innerHTML = list.length
        ? list.map((h) => hadithCard(h, { label: HADITH_CATEGORIES.find((c) => c.id === h.cat)?.name ?? 'Hadis' })).join('')
        : empty('Bu kategoride hadis bulunmuyor.');
    };

    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') { back('/kesfet'); return; }
      if (n.dataset.act === 'cat') {
        hadithCat = n.dataset.id;
        $$('.segment__item', root).forEach((b) => b.classList.toggle('is-on', b.dataset.id === hadithCat));
        paint();
        return;
      }
      if (sharedActions[n.dataset.act]) sharedActions[n.dataset.act](n);
    });
    paint();
  }
};

/* ============================================================
   DİNİ BİLGİLER
   ============================================================ */
export const infoScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Dini Bilgiler')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">
            ${INFO_CATEGORIES.map((c) => {
      const list = infoOf(c.id);
      if (!list.length) return '';
      return `
        <p class="section-title">${esc(c.name)}</p>
        <div class="list">
          ${list.map((a) => `
            <button class="row-item" data-act="open" data-id="${a.id}">
              <span class="row-item__main">
                <span class="row-item__title" style="display:block">${esc(a.title)}</span>
                <span class="row-item__sub">${esc(a.summary)}</span>
              </span>
              <span class="row-item__chev">${icon('chevron', 16)}</span>
            </button>`).join('')}
        </div>`;
    }).join('')}
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') back('/kesfet');
      if (n.dataset.act === 'open') openArticle(n.dataset.id);
    });
  }
};

export function openArticle(id) {
  const a = infoById(id);
  if (!a) return;
  openSheet(a.title, `
    <p class="t-sec">${esc(a.summary)}</p>
    <ul style="margin-top:16px">
      ${a.body.map((line) => {
    const isFarz = line.includes('— FARZ');
    const isBozan = line.startsWith('BOZAN') || line.startsWith('BOZMAZ') ||
      line.startsWith('ZEKÂT') || line.startsWith('SADAKA');
    const clean = line.replace(' — FARZ', '');
    return `
      <li class="t-body" style="padding:9px 0 9px 17px;position:relative;color:var(--ink-700);
        ${isBozan ? 'font-weight:550;color:var(--ink-900)' : ''}">
        <span style="position:absolute;left:0;top:16px;width:5px;height:5px;border-radius:50%;
          background:${isFarz ? 'var(--gold)' : 'var(--ink-300)'}"></span>
        ${esc(clean)}
        ${isFarz ? '<span class="badge badge--gold" style="margin-left:7px">Farz</span>' : ''}
      </li>`;
  }).join('')}
    </ul>
    <p class="card__label" style="margin-top:22px">Kaynaklar</p>
    <ul style="margin-top:6px">
      ${a.sources.map((s) => `<li class="source" style="padding:4px 0">${esc(s)}</li>`).join('')}
    </ul>`);
}

/* ============================================================
   HAC & UMRE REHBERİ
   ============================================================ */
export const hajjScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Hac ve Umre')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">
            <section class="card card--flush" style="margin-top:4px">
              <p class="t-sec">
                Umre yılın her zamanı yapılabilir ve ihram, tavaf, sa’y ile tıraştan oluşur.
                Hac ise Zilhicce ayının belirli günlerinde yapılır; Arafat vakfesi olmadan tamamlanmaz.
              </p>
            </section>

            <p class="section-title">Adımlar</p>
            <div>
              ${HAJJ_STEPS.map((s) => `
                <div class="step">
                  <span class="step__no">${s.no}</span>
                  <p class="step__when">${esc(s.when.toLocaleUpperCase('tr'))}</p>
                  <h3 class="step__name">${esc(s.name)}</h3>
                  <p class="step__desc">${esc(s.desc)}</p>
                  <ul class="step__points">
                    ${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}
                  </ul>
                  <p class="source" style="margin-top:10px">${s.sources.map(esc).join(' · ')}</p>
                  ${s.dua ? `<button class="chip" style="margin-top:12px" data-act="dua" data-id="${s.dua}">
                    ${icon('save', 15)} ${esc(duaById(s.dua)?.title ?? 'Dua')}</button>` : ''}
                </div>`).join('')}
            </div>

            <section class="card card--flush" style="margin-top:20px">
              <p class="t-sec">
                Bu rehber genel bir özettir. Kafile programları ve güncel uygulamalar için
                Diyanet İşleri Başkanlığı Hac ve Umre Hizmetleri rehberini esas alman gerekir.
              </p>
            </section>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') back('/kesfet');
      if (n.dataset.act === 'dua') openDua(n.dataset.id);
    });
  }
};

/* ============================================================
   KUR'AN ÖĞREN — yol haritası
   ============================================================ */
const ALPHABET = [
  ['ا', 'Elif'], ['ب', 'Bâ'], ['ت', 'Tâ'], ['ث', 'Sâ'], ['ج', 'Cîm'], ['ح', 'Hâ'],
  ['خ', 'Hı'], ['د', 'Dâl'], ['ذ', 'Zel'], ['ر', 'Râ'], ['ز', 'Ze'], ['س', 'Sîn'],
  ['ش', 'Şîn'], ['ص', 'Sâd'], ['ض', 'Dâd'], ['ط', 'Tı'], ['ظ', 'Zı'], ['ع', 'Ayn'],
  ['غ', 'Ğayn'], ['ف', 'Fâ'], ['ق', 'Kâf'], ['ك', 'Kef'], ['ل', 'Lâm'], ['م', 'Mîm'],
  ['ن', 'Nûn'], ['و', 'Vâv'], ['ه', 'Hê'], ['ي', 'Yâ']
];

export const learnScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Kur’an Öğren')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">
            <section class="card card--flush" style="margin-top:4px">
              <p class="t-sec">
                Elif-Bâ bölümü sesli alıştırmalarla birlikte hazırlanıyor.
                Aşağıdaki harf tablosu şimdiden kullanılabilir.
              </p>
            </section>

            <p class="section-title">Harfler</p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
              ${ALPHABET.map(([ar, tr]) => `
                <div class="card--flush" style="padding:14px 8px;border-radius:var(--r-md);text-align:center">
                  <p class="arabic" style="text-align:center;font-size:30px;line-height:1.2">${ar}</p>
                  <p class="t-cap" style="margin-top:6px;letter-spacing:0">${tr}</p>
                </div>`).join('')}
            </div>

            <p class="section-title">Yol Haritası</p>
            <div class="list">
              ${[
        ['Harfleri tanıma', 'Hazır', true],
        ['Harekeler ve med', 'Yakında', false],
        ['Kelime birleştirme', 'Yakında', false],
        ['Temel tecvid', 'Yakında', false],
        ['Kısa sûre ezberi', 'Yakında', false]
      ].map(([name, badge, done]) => `
                <div class="row-item">
                  <span class="row-item__main"><span class="row-item__title">${name}</span></span>
                  <span class="badge ${done ? 'badge--sage' : ''}">${badge}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-act="back"]')) back('/kesfet');
    });
  }
};
