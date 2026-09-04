/* ============================================================
   MİZAN — Kur'an okuyucusu (tam ekran)
   Ayet akışı · tipografi paneli · ses oynatıcı · yer imi
   ============================================================ */

import { el, $, $$, esc, openSheet, closeSheet, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { state, commit } from '../core/state.js';
import { back } from '../core/router.js';
import { SURAHS, surahByNo, juzOf, MEALS, RECITERS, ARABIC_FONTS, ayahAudioSources } from '../data/quran-surahs.js';
import { VERSES } from '../data/quran-verses.js';
import { openVerseMenu, openNote, intent } from './_actions.js';
import { sureBasligi } from '../core/motifs.js';
import * as player from '../core/player.js';
import { empty, switchRow } from './_blocks.js';

let unsubPlayer = null;
let current = { surah: 1, ayah: 1 };

/* ------------------------------------------------------------
   Ayet bloğu
   ------------------------------------------------------------ */
function ayahHtml(surah, v) {
  const ref = `${surah}:${v.n}`;
  const q = state.quran;
  const saved = q.saved.includes(ref);
  const marked = q.bookmarks.includes(ref);
  const notu = q.notes[ref];
  return `
  <article class="ayah" id="ayah-${v.n}" data-ayah="${v.n}" data-ref="${ref}">
    <div class="ayah__head">
      <span class="ayah__no">${surah}:${v.n}</span>
      <div class="ayah__tools">
        <button class="ayah__tool" data-act="a-play" data-ayah="${v.n}" aria-label="Bu âyetten dinle">${icon('play', 16)}</button>
        <button class="ayah__tool ${marked ? 'is-on' : ''}" data-act="a-bookmark" data-ref="${ref}" aria-label="Yer imi">${icon('bookmark', 16)}</button>
        <button class="ayah__tool ${notu ? 'is-on' : ''}" data-act="a-note" data-ref="${ref}" aria-label="Not">${icon('edit', 16)}</button>
        <button class="ayah__tool ${saved ? 'is-on' : ''}" data-act="a-save" data-ref="${ref}" aria-label="Kaydet">${icon('save', 16)}</button>
        <button class="ayah__tool" data-act="a-menu" data-ref="${ref}" aria-label="Seçenekler">${icon('more', 16)}</button>
      </div>
    </div>
    <p class="arabic" dir="rtl" lang="ar" style="font-size:${q.arabicSize}px">${v.ar}</p>
    ${q.showTranslit && v.tl ? `<p class="translit ayah__translit">${esc(v.tl)}</p>` : ''}
    ${q.showMeal ? `<p class="ayah__meal" style="font-size:${q.mealSize}px">${esc(v.tr)}</p>` : ''}
  </article>`;
}

/* ------------------------------------------------------------
   Besmele başlığı
   ------------------------------------------------------------ */
function surahHead(s) {
  const showBasmala = s.no !== 1 && s.no !== 9;
  return `
  <div style="text-align:center;padding:22px 0 8px">
    <div class="sure-bant">
      ${sureBasligi()}
      <span class="sure-bant__ad arabic" dir="rtl" lang="ar">${s.ar}</span>
    </div>
    <p class="t-cap">${esc(s.meaning.toLocaleUpperCase('tr'))} · ${s.ayahs} ÂYET · ${esc(s.type.toLocaleUpperCase('tr'))}</p>
    ${showBasmala ? `
      <div class="ornament" aria-hidden="true"><span class="ornament__mark"></span></div>
      <p class="arabic" style="text-align:center;font-size:24px;line-height:1.9">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>` : ''}
  </div>`;
}

/* ------------------------------------------------------------
   Oynatıcı
   ------------------------------------------------------------ */
function playerHtml() {
  return `
  <div class="player" data-player>
    <div class="player__meta">
      <p style="font-size:13.5px;font-weight:600" data-p-title>—</p>
      <p class="t-sec" style="font-size:12px" data-p-sub>—</p>
    </div>
    <div class="player__row">
      <button class="player__btn" data-act="p-prev" aria-label="Önceki âyet">${icon('prev', 19)}</button>
      <button class="player__btn player__play" data-act="p-toggle" aria-label="Oynat">${icon('play', 20)}</button>
      <button class="player__btn" data-act="p-next" aria-label="Sonraki âyet">${icon('next', 19)}</button>
      <span class="grow"></span>
      <button class="player__btn" data-act="p-repeat" aria-label="Tekrar">${icon('repeat', 18)}</button>
      <button class="player__btn" data-act="p-sleep" aria-label="Uyku zamanlayıcısı">${icon('timer', 18)}</button>
      <button class="player__btn" data-act="p-close" aria-label="Kapat">${icon('close', 18)}</button>
    </div>
    <button class="player__seekhit" data-act="p-seek" aria-label="Konum değiştir">
      <span class="progress player__seek"><span class="progress__fill" data-p-seek style="width:0%"></span></span>
    </button>
  </div>`;
}

/* ============================================================
   Ekran
   ============================================================ */
export const readerScreen = {
  render(params) {
    const surah = Math.min(114, Math.max(1, Number(params.surah) || 1));
    const ayah = Math.max(1, Number(params.ayah) || 1);
    current = { surah, ayah };

    const s = surahByNo(surah);
    const data = VERSES[surah];
    const verses = data?.list ?? [];

    const body = verses.length
      ? verses.map((v) => ayahHtml(surah, v)).join('')
      : `<div class="empty" style="padding-top:60px">
          <p class="empty__text">
            <strong>${esc(s.tr)}</strong> sûresinin metni bu sürüme dahil edilmedi.<br><br>
            Uygulama sürümünde 6236 âyetin tamamı çevrimdışı olarak cihaza indirilir.
            Bu önizlemede Fâtiha, Bakara (seçili bölümler), Âl-i İmrân, Yâsîn, Rahmân,
            Haşr, Mülk ve Amme cüzünün kısa sûreleri okunabilir.
          </p>
          <button class="btn btn--secondary btn--sm" data-act="go-fatiha">Fâtiha’yı Aç</button>
        </div>`;

    const partial = data && !data.complete
      ? `<div class="card card--flush" style="margin:0 var(--gutter) 4px">
           <p class="t-sec">Bu önizlemede ${esc(s.tr)} sûresinin seçili bölümleri yer alıyor.</p>
         </div>` : '';

    return el(`
      <div class="screen reader">
        <header class="topbar">
          <div class="topbar__side">
            <button class="icon-btn icon-btn--bare" data-act="back" aria-label="Geri">${icon('back', 20)}</button>
          </div>
          <button class="topbar__title" data-act="jump" style="text-align:center">
            ${esc(s.tr)}
            <span style="display:block;font-size:11px;font-weight:500;color:var(--ink-500);letter-spacing:.04em">
              ${juzOf(surah, ayah)}. cüz · ${s.ayahs} âyet
            </span>
          </button>
          <div class="topbar__side topbar__side--end" style="width:88px;gap:4px">
            <button class="icon-btn icon-btn--bare" data-act="typo" aria-label="Yazı ayarları">${icon('text', 19)}</button>
            <button class="icon-btn icon-btn--bare" data-act="audio" aria-label="Ses">${icon('headphones', 19)}</button>
          </div>
        </header>
        <div class="scroll" data-scroll>
          <div class="screen__body pad-safe" style="padding-bottom:120px">
            ${surahHead(s)}
            ${partial}
            ${body}
            ${verses.length ? navFooter(surah) : ''}
          </div>
        </div>
        ${playerHtml()}
      </div>`);
  },

  onMount(root, params) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      switch (act) {
        case 'back': player.pause(); back('/kuran'); break;
        case 'typo': openTypography(root); break;
        case 'audio': openAudio(root); break;
        case 'jump': openJump(); break;
        case 'go-fatiha': location.hash = '#/kuran/oku/1/1'; break;
        case 'go-surah': location.hash = `#/kuran/oku/${n.dataset.no}/1`; break;

        case 'a-save': {
          const ref = n.dataset.ref;
          const i = state.quran.saved.indexOf(ref);
          if (i >= 0) state.quran.saved.splice(i, 1); else state.quran.saved.push(ref);
          commit('save');
          n.classList.toggle('is-on', i < 0);
          toast(i < 0 ? 'Âyet kaydedildi.' : 'Kayıt kaldırıldı.');
          break;
        }
        case 'a-bookmark': {
          const ref = n.dataset.ref;
          const i = state.quran.bookmarks.indexOf(ref);
          if (i >= 0) state.quran.bookmarks.splice(i, 1); else state.quran.bookmarks.push(ref);
          commit('bookmark');
          n.classList.toggle('is-on', i < 0);
          toast(i < 0 ? 'Yer imi eklendi.' : 'Yer imi kaldırıldı.');
          break;
        }
        case 'a-note': {
          openNote(n.dataset.ref, () => { refreshMarks(root); paintNotes(root); });
          break;
        }
        case 'a-menu':
          openVerseMenu(n.dataset.ref, {
            onChange: () => refreshMarks(root),
            onListen: (a) => startPlayback(root, a)
          });
          break;
        case 'a-play': startPlayback(root, Number(n.dataset.ayah)); break;

        case 'p-toggle': player.toggle(); break;
        case 'p-seek': {
          const r = n.getBoundingClientRect();
          player.seekRatio((e.clientX - r.left) / r.width);
          break;
        }
        case 'p-next': player.next(); break;
        case 'p-prev': player.prev(); break;
        case 'p-repeat': openRepeat(); break;
        case 'p-sleep': openSleep(); break;
        case 'p-close': player.stop(); $('[data-player]', root).classList.remove('is-open'); break;
      }
    });

    // Kaydırdıkça "son kaldığın yer" güncellensin + üst bar çizgisi
    const scroll = $('[data-scroll]', root);
    const topbar = $('.topbar', root);
    let raf = null;
    scroll.addEventListener('scroll', () => {
      topbar.classList.toggle('is-stuck', scroll.scrollTop > 8);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const marks = $$('.ayah', root);
        for (const m of marks) {
          const r = m.getBoundingClientRect();
          if (r.bottom > 140) {
            const a = Number(m.dataset.ayah);
            if (state.quran.lastRead.surah !== current.surah || state.quran.lastRead.ayah !== a) {
              state.quran.lastRead = { surah: current.surah, ayah: a };
              commit('lastRead');
            }
            break;
          }
        }
      });
    }, { passive: true });
  },

  onShow(root, params) {
    paintNotes(root);          // notlar her dönüşte tazelensin
    const ayah = Math.max(1, Number(params?.ayah) || 1);
    state.quran.lastRead = { surah: current.surah, ayah };
    commit('lastRead');

    // 1. âyette sûre başlığı görünsün; sonrasında istenen âyete konumlan
    if (ayah > 1) {
      requestAnimationFrame(() => {
        const target = $(`#ayah-${ayah}`, root);
        const scroll = $('[data-scroll]', root);
        if (target && scroll) {
          const delta = target.getBoundingClientRect().top - scroll.getBoundingClientRect().top;
          scroll.scrollTop += delta - 12;
        }
      });
    }

    unsubPlayer?.();
    unsubPlayer = player.subscribePlayer((s) => paintPlayer(root, s));

    if (intent.autoPlay) { intent.autoPlay = false; startPlayback(root, ayah); }
  },

  onHide() { unsubPlayer?.(); unsubPlayer = null; player.pause(); }
};

/* ------------------------------------------------------------
   Alt gezinme (önceki / sonraki sûre)
   ------------------------------------------------------------ */
function navFooter(no) {
  const prev = no > 1 ? SURAHS[no - 2] : null;
  const next = no < 114 ? SURAHS[no] : null;
  return `
  <div class="row-between" style="margin-top:26px;gap:10px">
    ${prev ? `<button class="btn btn--secondary btn--sm grow" data-act="go-surah" data-no="${prev.no}"
      style="justify-content:flex-start">${icon('back', 15)} ${esc(prev.tr)}</button>` : '<span class="grow"></span>'}
    ${next ? `<button class="btn btn--secondary btn--sm grow" data-act="go-surah" data-no="${next.no}"
      style="justify-content:flex-end">${esc(next.tr)} ${icon('chevron', 15)}</button>` : '<span class="grow"></span>'}
  </div>`;
}

function refreshMarks(root) {
  $$('.ayah', root).forEach((a) => {
    const ref = a.dataset.ref;
    $('[data-act="a-save"]', a)?.classList.toggle('is-on', state.quran.saved.includes(ref));
    $('[data-act="a-bookmark"]', a)?.classList.toggle('is-on', state.quran.bookmarks.includes(ref));
    $('[data-act="a-note"]', a)?.classList.toggle('is-on', !!state.quran.notes[ref]);
  });
}

/* Notu olan âyetin altına notun kendisi yazılır: kullanıcı ne yazdığını
   görmek için menü açmak zorunda kalmasın. */
function paintNotes(root) {
  $$('.ayah', root).forEach((a) => {
    const metin = state.quran.notes[a.dataset.ref];
    let kutu = $('.ayah__note', a);
    if (!metin) { kutu?.remove(); return; }
    if (!kutu) {
      kutu = document.createElement('p');
      kutu.className = 'ayah__note';
      a.append(kutu);
    }
    kutu.textContent = metin;
  });
}

/* ------------------------------------------------------------
   Oynatma
   ------------------------------------------------------------ */
function startPlayback(root, fromAyah) {
  const verses = VERSES[current.surah]?.list ?? [];
  if (!verses.length) { toast('Bu sûrenin metni bu sürüme dahil değil.'); return; }
  player.buildQueue(verses, current.surah, fromAyah);
  player.play();
  $('[data-player]', root).classList.add('is-open');
}

const PLAYER_ERROR = {
  offline: 'Çevrimdışısın — ses için bağlantı gerekiyor.',
  unavailable: 'Ses kaynağına ulaşılamadı. Önizleme ortamı engelliyor olabilir.',
  gesture: 'Başlatmak için oynat düğmesine dokun.'
};

function paintPlayer(root, s) {
  const bar = $('[data-player]', root);
  if (!bar) return;
  if (s.queue.length) bar.classList.add('is-open');

  const title = $('[data-p-title]', bar);
  const sub = $('[data-p-sub]', bar);
  const seek = $('[data-p-seek]', bar);
  const playBtn = $('[data-act="p-toggle"]', bar);

  if (s.ayah != null) {
    title.textContent = `${surahByNo(s.surah).tr} · ${s.ayah}. âyet`;

    // Durum dürüst gösterilir: yükleniyor / hata / çalıyor
    if (s.error) {
      sub.textContent = PLAYER_ERROR[s.error] ?? PLAYER_ERROR.unavailable;
      sub.style.color = 'var(--clay)';
    } else {
      const bits = [s.loading ? 'Yükleniyor…' : s.reciter.name];
      if (s.repeat > 1) bits.push(s.repeat === Infinity ? 'sürekli tekrar' : `${s.repeat}× tekrar`);
      if (s.sleepLeftMin) bits.push(`${s.sleepLeftMin} dk sonra dur`);
      if (s.speed !== 1) bits.push(`${s.speed}×`);
      sub.textContent = bits.join(' · ');
      sub.style.color = '';
    }
  }
  seek.style.width = `${(s.progress * 100).toFixed(1)}%`;
  bar.classList.toggle('is-error', !!s.error);
  playBtn.innerHTML = icon(s.playing ? 'pause' : 'play', 20);
  playBtn.setAttribute('aria-label', s.playing ? 'Duraklat' : 'Oynat');

  $$('.ayah', root).forEach((a) => {
    const on = Number(a.dataset.ayah) === s.ayah && s.surah === current.surah;
    a.classList.toggle('is-playing', on);
    if (on && s.playing) {
      const r = a.getBoundingClientRect();
      if (r.top < 90 || r.bottom > window.innerHeight - 160) {
        a.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  });
}

/* ------------------------------------------------------------
   Tipografi paneli
   ------------------------------------------------------------ */
function openTypography(root) {
  const q = state.quran;
  const body = openSheet('Okuma Ayarları', `
    <div class="card--flush" style="padding:16px;border-radius:var(--r-md)">
      <p class="arabic" dir="rtl" style="text-align:center;font-size:${q.arabicSize}px" data-preview-ar>
        إِنَّ مَعَ الْعُسْرِ يُسْرًا
      </p>
      <p class="t-body t-center" style="font-size:${q.mealSize}px;color:var(--ink-700)" data-preview-tr>
        Gerçekten güçlükle beraber bir kolaylık vardır.
      </p>
    </div>

    <p class="section-title">Arapça</p>
    <div class="list">
      <div class="row-item">
        <span class="row-item__main"><span class="row-item__title">Punto</span></span>
        <div class="row gap-8">
          <button class="icon-btn" data-act="ar-" aria-label="Küçült">${icon('minus', 16)}</button>
          <span class="t-num" style="min-width:34px;text-align:center" data-ar-val>${q.arabicSize}</span>
          <button class="icon-btn" data-act="ar+" aria-label="Büyült">${icon('plus', 16)}</button>
        </div>
      </div>
      ${ARABIC_FONTS.map((f) => `
        <button class="row-item" data-act="font" data-id="${f.id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(f.name)}</span>
            <span class="row-item__sub">${esc(f.sub)}</span>
          </span>
          ${f.id === q.arabicFont ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>

    <p class="section-title">Meal</p>
    <div class="list">
      <div class="row-item">
        <span class="row-item__main"><span class="row-item__title">Punto</span></span>
        <div class="row gap-8">
          <button class="icon-btn" data-act="tr-" aria-label="Küçült">${icon('minus', 16)}</button>
          <span class="t-num" style="min-width:34px;text-align:center" data-tr-val>${q.mealSize}</span>
          <button class="icon-btn" data-act="tr+" aria-label="Büyült">${icon('plus', 16)}</button>
        </div>
      </div>
      ${switchRow({ title: 'Meali göster', on: q.showMeal, act: 'sw-meal' })}
      ${switchRow({ title: 'Okunuşu göster', sub: 'Latin harfleriyle', on: q.showTranslit, act: 'sw-translit' })}
      ${switchRow({ title: 'Gece okuma modu', sub: 'Zemin koyulaşır, altın vurgular kısılır', on: state.app.nightReading, act: 'sw-night' })}
    </div>

    <p class="section-title">Meal Seçimi</p>
    <div class="list">
      ${MEALS.map((m) => `
        <button class="row-item" data-act="meal" data-id="${m.id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(m.name)}</span>
            <span class="row-item__sub">${esc(m.sub)}</span>
          </span>
          ${!m.free ? '<span class="badge badge--premium">Premium</span>' : ''}
          ${m.id === q.meal ? `<span style="color:var(--gold-text);margin-left:6px">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    const act = n.dataset.act;
    const q = state.quran;

    if (act === 'ar+') q.arabicSize = Math.min(44, q.arabicSize + 2);
    if (act === 'ar-') q.arabicSize = Math.max(18, q.arabicSize - 2);
    if (act === 'tr+') q.mealSize = Math.min(24, q.mealSize + 1);
    if (act === 'tr-') q.mealSize = Math.max(12, q.mealSize - 1);
    if (act === 'sw-meal') { q.showMeal = !q.showMeal; n.querySelector('.switch').classList.toggle('is-on', q.showMeal); }
    if (act === 'sw-translit') { q.showTranslit = !q.showTranslit; n.querySelector('.switch').classList.toggle('is-on', q.showTranslit); }
    if (act === 'sw-night') {
      state.app.nightReading = !state.app.nightReading;
      document.documentElement.dataset.night = state.app.nightReading ? '1' : '';
      n.querySelector('.switch').classList.toggle('is-on', state.app.nightReading);
    }
    if (act === 'font') {
      q.arabicFont = n.dataset.id;
      const f = ARABIC_FONTS.find((x) => x.id === q.arabicFont);
      document.documentElement.style.setProperty('--font-arabic', f.stack);
      $$('[data-act="font"]', body).forEach((b) => {
        const on = b.dataset.id === q.arabicFont;
        b.querySelector('span[style*="gold"]')?.remove();
        if (on) b.insertAdjacentHTML('beforeend', `<span style="color:var(--gold-text)">${icon('check', 18)}</span>`);
      });
    }
    if (act === 'meal') {
      q.meal = n.dataset.id;
      const m = MEALS.find((x) => x.id === q.meal);
      if (!m.free && !state.premium) { toast('Bu meal Mizan Premium ile kullanılabilir.'); q.meal = 'diyanet'; return; }
      toast(`${m.name} seçildi.`);
      $$('[data-act="meal"]', body).forEach((b) => {
        b.querySelector('span[style*="gold"]')?.remove();
        if (b.dataset.id === q.meal) b.insertAdjacentHTML('beforeend', `<span style="color:var(--gold-text);margin-left:6px">${icon('check', 18)}</span>`);
      });
    }

    commit('typo');
    $('[data-ar-val]', body).textContent = q.arabicSize;
    $('[data-tr-val]', body).textContent = q.mealSize;
    $('[data-preview-ar]', body).style.fontSize = `${q.arabicSize}px`;
    $('[data-preview-tr]', body).style.fontSize = `${q.mealSize}px`;
    applyReaderPrefs(root);
  });
}

/** Tipografi tercihlerini açık okuyucuya uygula */
export function applyReaderPrefs(root) {
  if (!root) return;
  const q = state.quran;
  $$('.ayah', root).forEach((a) => {
    $('.arabic', a).style.fontSize = `${q.arabicSize}px`;
    const meal = $('.ayah__meal', a);
    if (meal) { meal.style.fontSize = `${q.mealSize}px`; meal.style.display = q.showMeal ? '' : 'none'; }
    const tl = $('.ayah__translit', a);
    if (tl) tl.style.display = q.showTranslit ? '' : 'none';
  });
}

/* ------------------------------------------------------------
   Ses paneli
   ------------------------------------------------------------ */
function openAudio(root) {
  const body = openSheet('Ses', `
    <p class="section-title" style="margin-top:6px">Hafız</p>
    <div class="list">
      ${RECITERS.map((r) => `
        <button class="row-item" data-act="reciter" data-id="${r.id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(r.name)}</span>
            <span class="row-item__sub">${esc(r.sub)}</span>
          </span>
          ${!r.free ? '<span class="badge badge--premium">Premium</span>' : ''}
          ${r.id === state.quran.reciter ? `<span style="color:var(--gold-text);margin-left:6px">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>
    <button class="btn btn--primary btn--block" style="margin-top:20px" data-act="play-here">
      ${icon('play', 17)} Baştan Dinle
    </button>

    <p class="section-title">Ses Tanılama</p>
    <p class="t-sec">Ses çalmıyorsa hangi kaynağa ulaşılabildiğini buradan görebilirsin.</p>
    <button class="btn btn--secondary btn--block" style="margin-top:12px" data-act="audio-test">
      ${icon('refresh', 16)} Kaynakları Sına
    </button>
    <div data-audio-test style="margin-top:12px"></div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'reciter') {
      const r = RECITERS.find((x) => x.id === n.dataset.id);
      if (!r.free && !state.premium) { toast('Bu hafız Mizan Premium ile dinlenebilir.'); return; }
      state.quran.reciter = r.id; commit('reciter');
      toast(`${r.name} seçildi.`);
      $$('[data-act="reciter"]', body).forEach((b) => {
        b.querySelector('span[style*="gold"]')?.remove();
        if (b.dataset.id === r.id) b.insertAdjacentHTML('beforeend', `<span style="color:var(--gold-text);margin-left:6px">${icon('check', 18)}</span>`);
      });
    }
    if (n.dataset.act === 'play-here') { closeSheet(); startPlayback(root, 1); }
    if (n.dataset.act === 'audio-test') runAudioTest(body);
  });
}

/* ------------------------------------------------------------
   Ses tanılama — hangi kaynağa ulaşılabiliyor?
   "Çalmıyor" demek yerine nedenini gösterir.
   ------------------------------------------------------------ */
async function runAudioTest(body) {
  const box = $('[data-audio-test]', body);
  box.innerHTML = '<p class="t-sec">Sınanıyor…</p>';

  const probe = (url) => new Promise((res) => {
    const a = new Audio();
    a.preload = 'metadata';
    a.src = url;
    const t = setTimeout(() => res({ ok: false, why: 'zaman aşımı' }), 8000);
    a.addEventListener('loadedmetadata', () => { clearTimeout(t); res({ ok: true, dur: a.duration }); }, { once: true });
    a.addEventListener('error', () => { clearTimeout(t); res({ ok: false, why: 'ulaşılamadı' }); }, { once: true });
  });

  // Önce cihazın kendisi ses çalabiliyor mu? Ağdan bağımsız, yerel üretilmiş ton.
  const local = await probeLocalAudio();

  const urls = ayahAudioSources(1, 1, state.quran.reciter);
  const rows = [];
  for (const u of urls) {
    const host = new URL(u).hostname;
    const r = await probe(u);
    rows.push({ host, ...r });
  }

  const anyOk = rows.some((r) => r.ok);
  // Sonuç yorumu — kullanıcıya ne yapacağını söyler
  let sonuc;
  if (!local.ok) {
    sonuc = 'Bu tarayıcı hiç ses çalamıyor (yerel test de başarısız). ' +
      'Sessize alınmış olabilir, ses çıkışı kapalı olabilir ya da tarayıcı ses ' +
      'motoru bu oturumda düşmüş olabilir. Sayfayı yenilemeyi veya başka bir ' +
      'tarayıcı denemeyi öner.';
  } else if (anyOk) {
    sonuc = 'Her şey yolunda — ses oynatılabilir.';
  } else if (navigator.onLine === false) {
    sonuc = 'Çevrimdışısın. Tilavet için bağlantı gerekiyor.';
  } else {
    sonuc = 'Cihaz ses çalabiliyor ama kaynaklara ulaşılamıyor. Bu genellikle ' +
      'önizleme ortamının dış medyayı engellemesinden olur; uygulamayı yerelde ' +
      'çalıştırdığında ses çalışır.';
  }

  box.innerHTML = `
    <div class="list">
      <div class="row-item">
        <span class="row-item__main">
          <span class="row-item__title" style="display:block;font-size:13.5px">Cihaz ses çıkışı</span>
          <span class="row-item__sub">Ağ gerektirmeyen yerel test</span>
        </span>
        <span class="badge ${local.ok ? 'badge--sage' : ''}" ${local.ok ? '' : 'style="color:var(--clay)"'}>
          ${local.ok ? 'Çalışıyor' : 'Çalışmıyor'}
        </span>
      </div>
      <div class="row-item">
        <span class="row-item__main"><span class="row-item__title">Bağlantı</span></span>
        <span class="row-item__value">${navigator.onLine === false ? 'Çevrimdışı' : 'Var'}</span>
      </div>
      ${rows.map((r) => `
        <div class="row-item">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block;font-size:13.5px">${esc(r.host)}</span>
            <span class="row-item__sub">${r.ok ? `${r.dur.toFixed(1)} sn okundu` : esc(r.why)}</span>
          </span>
          <span class="badge ${r.ok ? 'badge--sage' : ''}" ${r.ok ? '' : 'style="color:var(--clay)"'}>
            ${r.ok ? 'Erişilebilir' : 'Engelli'}
          </span>
        </div>`).join('')}
    </div>
    <p class="t-sec" style="margin-top:12px">${esc(sonuc)}</p>`;
}

/** Ağdan bağımsız ses testi — yerelde üretilmiş kısa, sessize yakın bir ton */
function probeLocalAudio() {
  const rate = 8000, n = rate / 2;                 // 0,5 sn
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const wr = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  wr(0, 'RIFF'); v.setUint32(4, 36 + n, true); wr(8, 'WAVE'); wr(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true);
  v.setUint16(34, 8, true); wr(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128 + Math.round(6 * Math.sin(i / 8)));

  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);

  return new Promise((res) => {
    const a = new Audio(`data:audio/wav;base64,${btoa(s)}`);
    a.volume = 0.01;
    let settled = false;
    const done = (ok) => {
      if (settled) return;
      settled = true;
      clearTimeout(t);
      try { a.pause(); } catch { /* yok say */ }
      res({ ok });
    };
    const t = setTimeout(() => done(false), 4000);

    // `playing` tek başına yetmez: bazı ortamlarda hemen ardından çözme
    // hatası gelir. Gerçekten ilerlediğini görmek gerekir.
    a.addEventListener('playing', () => {
      setTimeout(() => done(!a.error && a.currentTime > 0), 400);
    }, { once: true });
    a.addEventListener('error', () => done(false), { once: true });
    a.play().catch(() => done(false));
  });
}

/* ------------------------------------------------------------
   Tekrar · Uyku · Sûreye atla
   ------------------------------------------------------------ */
function openRepeat() {
  const body = openSheet('Tekrar', `
    <div class="list">
      ${[[1, 'Tekrar yok'], [3, '3 kez'], [5, '5 kez'], [Infinity, 'Sürekli']]
      .map(([n, label]) => `
        <button class="row-item" data-act="set" data-n="${n === Infinity ? 'inf' : n}">
          <span class="row-item__main"><span class="row-item__title">${label}</span></span>
        </button>`).join('')}
    </div>`);
  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="set"]');
    if (!n) return;
    player.setRepeat(n.dataset.n === 'inf' ? Infinity : Number(n.dataset.n));
    closeSheet();
  });
}

function openSleep() {
  const body = openSheet('Uyku Zamanlayıcısı', `
    <p class="t-sec" style="margin-bottom:14px">Belirlenen süre sonunda okuma sessizce durur.</p>
    <div class="list">
      ${[0, 10, 20, 30, 45, 60].map((m) => `
        <button class="row-item" data-act="set" data-m="${m}">
          <span class="row-item__main"><span class="row-item__title">${m ? `${m} dakika` : 'Kapalı'}</span></span>
        </button>`).join('')}
    </div>`);
  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="set"]');
    if (!n) return;
    const m = Number(n.dataset.m);
    player.setSleep(m);
    toast(m ? `${m} dakika sonra duracak.` : 'Zamanlayıcı kapatıldı.');
    closeSheet();
  });
}

function openJump() {
  const body = openSheet('Sûreye Git', `
    <div class="search" style="margin-bottom:14px">
      ${icon('search', 16)}<input type="text" placeholder="Sûre ara" data-jq aria-label="Sûre ara">
    </div>
    <div class="list" data-jlist>
      ${SURAHS.map((s) => `
        <button class="row-item" data-act="jump-to" data-no="${s.no}" data-name="${esc(s.tr)}">
          <span class="row-item__num">${s.no}</span>
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(s.tr)}</span>
            <span class="row-item__sub">${s.ayahs} âyet · ${esc(s.type)}</span>
          </span>
          ${VERSES[s.no] ? '' : '<span class="badge">metin yok</span>'}
        </button>`).join('')}
    </div>`);

  const input = $('[data-jq]', body);
  input.addEventListener('input', () => {
    const q = input.value.trim().toLocaleLowerCase('tr');
    $$('[data-jlist] .row-item', body).forEach((r) => {
      r.style.display = r.dataset.name.toLocaleLowerCase('tr').includes(q) || r.dataset.no === q ? '' : 'none';
    });
  });

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="jump-to"]');
    if (!n) return;
    closeSheet();
    location.hash = `#/kuran/oku/${n.dataset.no}/1`;
  });
}
