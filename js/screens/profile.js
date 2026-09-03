/* ============================================================
   MİZAN — PROFİL
   Sade. Hesap zorunlu değildir.
   ============================================================ */

import { el, $, $$, esc, trNumber, trDate, openSheet, closeSheet, toast, applyAtmosphere } from '../core/ui.js';
import { icon, logo, logoMark, logoEmblem } from '../core/icons.js';
import { state, commit, resetAll } from '../core/state.js';
import { invalidate, now as clockNow } from '../core/clock.js';
import { toHijri, METHODS } from '../core/astro.js';
import { go } from '../core/router.js';
import { surahName, MEALS, RECITERS, ARABIC_FONTS } from '../data/quran-surahs.js';
import { listRow, switchRow } from './_blocks.js';
import { openMethodSheet } from './prayer-times.js';
import { openCityPicker } from './today.js';

const THEME_LABEL = { system: 'Sistem', light: 'Açık', dark: 'Koyu' };
const ADHAN_SOUNDS = [
  { id: 'mizan-sade', name: 'Mizan — Sade', sub: 'Kısa, tek tonlu bildirim sesi', free: true },
  { id: 'ezan-tam', name: 'Ezan — Tam', sub: 'Geleneksel ezan okuması', free: true },
  { id: 'ezan-kisa', name: 'Ezan — Kısa', sub: 'İlk iki tekbir', free: true },
  { id: 'sessiz', name: 'Sessiz', sub: 'Yalnızca titreşim', free: true }
];

export const profileScreen = {
  render() {
    return el(`
      <div class="screen">
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar" style="padding-top:58px" data-body></div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;

      switch (act) {
        case 'name': openName(root); break;
        case 'city': openCityPicker(); break;
        case 'theme': openTheme(root); break;
        case 'method': openMethodSheet(root); break;
        case 'adhan': openAdhan(root); break;
        case 'meal': openPicker('Meal Seçimi', MEALS, state.quran.meal, (id) => {
          state.quran.meal = id; commit('meal');
        }, root); break;
        case 'reciter': openPicker('Hafız Seçimi', RECITERS, state.quran.reciter, (id) => {
          state.quran.reciter = id; commit('reciter');
        }, root); break;
        case 'font': openPicker('Arapça Font', ARABIC_FONTS, state.quran.arabicFont, (id) => {
          state.quran.arabicFont = id;
          const f = ARABIC_FONTS.find((x) => x.id === id);
          document.documentElement.style.setProperty('--font-arabic', f.stack);
          commit('font');
        }, root); break;
        case 'size': openSize(root); break;
        case 'hijri': openHijri(root); break;
        case 'notifications': openNotifications(root); break;
        case 'widgets': go('/widget'); break;
        case 'premium': openPremium(root); break;
        case 'privacy': openPrivacy(); break;
        case 'about': openAbout(); break;
        case 'account': openAccount(); break;
        case 'saved': go('/kuran'); break;
        case 'resume': {
          const { surah, ayah } = state.quran.lastRead;
          go(`/kuran/oku/${surah}/${ayah}`);
          break;
        }
        case 'reset':
          if (confirm('Tüm ayarların ve kayıtların silinecek. Devam edilsin mi?')) resetAll();
          break;
      }
    });
    paint(root);
  },

  onShow(root) { paint(root); }
};

/* ------------------------------------------------------------ */
function paint(root) {
  const body = $('[data-body]', root);
  const q = state.quran;
  const k = state.khatm.active;
  const h = toHijri(new Date(), state.app.hijriOffset);
  const meal = MEALS.find((m) => m.id === q.meal);
  const reciter = RECITERS.find((r) => r.id === q.reciter);
  const font = ARABIC_FONTS.find((f) => f.id === q.arabicFont);
  const adhan = ADHAN_SOUNDS.find((a) => a.id === state.prayer.adhanSound);

  body.innerHTML = `
    <h1 class="t-h1">Profil</h1>

    <section class="card" style="margin-top:18px">
      <div class="row gap-12">
        ${logoEmblem(52)}
        <div class="grow">
          <p class="t-h3">${esc(state.user.name || 'Misafir')}</p>
          <p class="t-sec">${esc(state.user.city)} · ${h.day} ${h.monthName} ${h.year}</p>
        </div>
        <button class="icon-btn" data-act="name" aria-label="Adı düzenle">${icon('settings', 17)}</button>
      </div>
      <div class="card__actions">
        <button class="chip" data-act="account">${icon('shield', 15)} Mizan Hesabı</button>
        <button class="chip" data-act="premium">${icon('crown', 15)} Premium</button>
      </div>
      <p class="t-cap" style="margin-top:12px;text-transform:none;letter-spacing:0">
        Hesap oluşturmadan kullanmaya devam edebilirsin. Verilerin cihazında kalır.
      </p>
    </section>

    <p class="section-title">Kur’an</p>
    <div class="list">
      ${listRow({ title: 'Son okunan', value: `${surahName(q.lastRead.surah)} ${q.lastRead.ayah}`, act: 'resume' })}
      ${listRow({ title: 'Hatim ilerlemesi', value: k ? `${k.juzDone} / 30 cüz` : 'Yok', act: 'saved' })}
      ${listRow({ title: 'Kaydedilen âyetler', value: String(q.saved.length), act: 'saved' })}
      ${listRow({ title: 'Yer imleri', value: String(q.bookmarks.length), act: 'saved' })}
    </div>

    <p class="section-title">İbadet</p>
    <div class="list">
      ${listRow({ title: 'Konum', value: state.user.city, act: 'city' })}
      ${listRow({ title: 'Hesaplama yöntemi', value: METHODS[state.prayer.method].short, act: 'method' })}
      ${listRow({ title: 'Ezan bildirimleri', value: notifySummary(), act: 'notifications' })}
      ${listRow({ title: 'Ezan sesi', value: adhan?.name ?? '—', act: 'adhan' })}
      ${listRow({ title: 'Hicri tarih düzeltmesi', value: fmtOffset(state.app.hijriOffset), act: 'hijri' })}
    </div>

    <p class="section-title">Tercihler</p>
    <div class="list">
      ${listRow({ title: 'Meal', value: meal?.name ?? '—', act: 'meal' })}
      ${listRow({ title: 'Hafız', value: reciter?.name ?? '—', act: 'reciter' })}
      ${listRow({ title: 'Arapça font', value: font?.name ?? '—', act: 'font' })}
      ${listRow({ title: 'Yazı boyutu', value: `${q.arabicSize} / ${q.mealSize}`, act: 'size' })}
      ${listRow({ title: 'Tema', value: THEME_LABEL[state.app.theme], act: 'theme' })}
    </div>

    <p class="section-title">Uygulama</p>
    <div class="list">
      ${listRow({ title: 'Bildirimler', act: 'notifications' })}
      ${listRow({ title: 'Widget’lar', act: 'widgets' })}
      ${listRow({ title: 'Mizan Premium', badge: state.premium ? 'Aktif' : null, act: 'premium' })}
      ${listRow({ title: 'Gizlilik', act: 'privacy' })}
      ${listRow({ title: 'Hakkımızda', act: 'about' })}
    </div>

    <button class="btn btn--ghost btn--block" style="margin-top:20px;color:var(--clay)" data-act="reset">
      Tüm verileri sıfırla
    </button>

    <p class="t-cap t-center" style="margin-top:22px;color:var(--ink-300)">
      Mizan 1.0 · Günün, ibadetin, dengen.
    </p>`;
}

function notifySummary() {
  const on = Object.entries(state.prayer.notify).filter(([, v]) => v !== 'off').length;
  return `${on} vakit açık`;
}

const fmtOffset = (v) => v === 0 ? 'Yok' : `${v > 0 ? '+' : ''}${v} gün`;

/* ------------------------------------------------------------
   Alt sayfalar
   ------------------------------------------------------------ */
function openName(root) {
  const body = openSheet('Adın', `
    <label class="field">
      <span class="field__label">Uygulamada nasıl görünsün?</span>
      <input class="field__input" data-name maxlength="40" placeholder="Adın (isteğe bağlı)"
        value="${esc(state.user.name)}">
    </label>
    <button class="btn btn--primary btn--block" style="margin-top:16px" data-act="save">Kaydet</button>
    <p class="t-sec" style="margin-top:14px">Bu bilgi yalnızca cihazında saklanır.</p>`);
  body.addEventListener('click', (e) => {
    if (!e.target.closest('[data-act="save"]')) return;
    state.user.name = $('[data-name]', body).value.trim();
    commit('name'); closeSheet(); paint(root);
  });
}

function openTheme(root) {
  const body = openSheet('Tema', `
    <div class="list">
      ${[['system', 'Sistem', 'Cihazın ayarını izler'],
      ['light', 'Açık', 'Sıcak krem zemin'],
      ['dark', 'Koyu', 'Gece laciverti']].map(([id, name, sub]) => `
        <button class="row-item" data-act="pick" data-id="${id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${name}</span>
            <span class="row-item__sub">${sub}</span>
          </span>
          ${id === state.app.theme ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="pick"]');
    if (!n) return;
    state.app.theme = n.dataset.id;
    commit('theme');
    applyTheme();
    applyAtmosphere(clockNow().phase);
    closeSheet(); paint(root);
  });
}

export function applyTheme() {
  const t = state.app.theme;
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}

function openPicker(title, items, activeId, onPick, root) {
  const body = openSheet(title, `
    <div class="list">
      ${items.map((it) => `
        <button class="row-item" data-act="pick" data-id="${it.id}">
          <span class="row-item__main">
            <span class="row-item__title" style="display:block">${esc(it.name)}</span>
            <span class="row-item__sub">${esc(it.sub)}</span>
          </span>
          ${it.free === false ? '<span class="badge badge--premium">Premium</span>' : ''}
          ${it.id === activeId ? `<span style="color:var(--gold-text);margin-left:6px">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="pick"]');
    if (!n) return;
    const item = items.find((x) => x.id === n.dataset.id);
    if (item.free === false && !state.premium) { toast('Bu seçenek Mizan Premium ile kullanılabilir.'); return; }
    onPick(item.id);
    closeSheet(); paint(root);
    toast(`${item.name} seçildi.`);
  });
}

function openSize(root) {
  const q = state.quran;
  const body = openSheet('Yazı Boyutu', `
    <div class="card--flush" style="padding:18px;border-radius:var(--r-md)">
      <p class="arabic" dir="rtl" style="text-align:center;font-size:${q.arabicSize}px" data-pa>إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
      <p class="t-center" style="font-size:${q.mealSize}px;color:var(--ink-700);line-height:1.6" data-pt>
        Gerçekten güçlükle beraber bir kolaylık vardır.
      </p>
    </div>
    <div class="list" style="margin-top:16px">
      <div class="row-item">
        <span class="row-item__main"><span class="row-item__title">Arapça</span></span>
        <div class="row gap-8">
          <button class="icon-btn" data-act="a-">${icon('minus', 16)}</button>
          <span class="t-num" style="min-width:34px;text-align:center" data-av>${q.arabicSize}</span>
          <button class="icon-btn" data-act="a+">${icon('plus', 16)}</button>
        </div>
      </div>
      <div class="row-item">
        <span class="row-item__main"><span class="row-item__title">Meal</span></span>
        <div class="row gap-8">
          <button class="icon-btn" data-act="m-">${icon('minus', 16)}</button>
          <span class="t-num" style="min-width:34px;text-align:center" data-mv>${q.mealSize}</span>
          <button class="icon-btn" data-act="m+">${icon('plus', 16)}</button>
        </div>
      </div>
    </div>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    const q = state.quran;
    if (n.dataset.act === 'a+') q.arabicSize = Math.min(44, q.arabicSize + 2);
    if (n.dataset.act === 'a-') q.arabicSize = Math.max(18, q.arabicSize - 2);
    if (n.dataset.act === 'm+') q.mealSize = Math.min(24, q.mealSize + 1);
    if (n.dataset.act === 'm-') q.mealSize = Math.max(12, q.mealSize - 1);
    commit('size');
    $('[data-av]', body).textContent = q.arabicSize;
    $('[data-mv]', body).textContent = q.mealSize;
    $('[data-pa]', body).style.fontSize = `${q.arabicSize}px`;
    $('[data-pt]', body).style.fontSize = `${q.mealSize}px`;
    paint(root);
  });
}

function openHijri(root) {
  const body = openSheet('Hicri Tarih Düzeltmesi', `
    <p class="t-sec" style="margin-bottom:16px">
      Hicri tarihler Diyanet’in ilan ettiği ay başlarına göre kalibre edilir.
      Gözleme dayalı takvimlerde bir günlük fark görülebilir; buradan düzeltebilirsin.
    </p>
    <div class="list">
      ${[-2, -1, 0, 1, 2].map((v) => `
        <button class="row-item" data-act="pick" data-v="${v}">
          <span class="row-item__main"><span class="row-item__title">${fmtOffset(v)}</span></span>
          ${v === state.app.hijriOffset ? `<span style="color:var(--gold-text)">${icon('check', 18)}</span>` : ''}
        </button>`).join('')}
    </div>
    <p class="t-sec" style="margin-top:16px" data-preview></p>`);

  const preview = $('[data-preview]', body);
  const show = (v) => {
    const h = toHijri(new Date(), v);
    preview.textContent = `Bugün: ${h.day} ${h.monthName} ${h.year}`;
  };
  show(state.app.hijriOffset);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act="pick"]');
    if (!n) return;
    state.app.hijriOffset = Number(n.dataset.v);
    commit('hijri'); invalidate(); show(state.app.hijriOffset);
    $$('[data-act="pick"]', body).forEach((b) => {
      b.querySelector('span[style*="gold"]')?.remove();
      if (Number(b.dataset.v) === state.app.hijriOffset) {
        b.insertAdjacentHTML('beforeend', `<span style="color:var(--gold-text)">${icon('check', 18)}</span>`);
      }
    });
    paint(root);
  });
}

function openAdhan(root) {
  openPicker('Ezan Sesi', ADHAN_SOUNDS, state.prayer.adhanSound, (id) => {
    state.prayer.adhanSound = id; commit('adhan');
  }, root);
}

function openNotifications(root) {
  const body = openSheet('Bildirimler', `
    <p class="t-sec" style="margin-bottom:14px">
      Mizan günde en fazla altı vakit bildirimi ve bir içerik bildirimi gönderir.
      Kaçırılan ibadet için hatırlatma veya seri uyarısı göndermez.
    </p>
    <div class="list">
      ${switchRow({
    title: 'Günlük içerik bildirimi',
    sub: '“Bugünün âyetini okumak ister misin?”',
    on: state.app.contentNotify, act: 'sw-content'
  })}
    </div>
    <p class="section-title">Vakit Bildirimleri</p>
    <div class="list">
      ${Object.entries(state.prayer.notify).map(([k, v]) => `
        <div class="row-item">
          <span class="row-item__main"><span class="row-item__title">${{
      imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle', ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı'
    }[k]}</span></span>
          <span class="row-item__value">${{
      ezan: 'Ezan', before15: '15 dk önce', before30: '30 dk önce', silent: 'Sessiz', off: 'Kapalı'
    }[v]}</span>
        </div>`).join('')}
    </div>
    <button class="btn btn--secondary btn--block" style="margin-top:16px" data-act="to-times">
      Vakit bildirimlerini düzenle
    </button>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'sw-content') {
      state.app.contentNotify = !state.app.contentNotify;
      n.querySelector('.switch').classList.toggle('is-on', state.app.contentNotify);
      commit('notify'); paint(root);
    }
    if (n.dataset.act === 'to-times') { closeSheet(); go('/ibadet/vakitler'); }
  });
}

/* ------------------------------------------------------------ */
function openPremium(root) {
  const body = openSheet('Mizan Premium', `
    <p class="t-sec" style="margin-bottom:18px">
      Namaz vakitleri, Kur’an, temel meal, kıble, dualar, tesbih, Ramazan modu ve
      dini takvim <strong>her zaman ücretsizdir</strong>. Premium yalnızca ek özellikleri açar.
    </p>

    <p class="card__label">Premium ile gelenler</p>
    <ul style="margin-top:10px">
      ${['Altı ek hafız ve çevrimdışı ses paketleri',
      'Ek meal seçenekleri ve çoklu meal karşılaştırma',
      'Kelime kelime meal ve not alma',
      'Premium temalar ve widget tasarımları',
      'Cihazlar arası senkronizasyon',
      'Mizan Sor için yüksek kullanım limiti'].map((t) => `
        <li class="t-body" style="padding:8px 0 8px 17px;position:relative;color:var(--ink-700)">
          <span style="position:absolute;left:0;top:15px;width:5px;height:5px;border-radius:50%;background:var(--gold)"></span>
          ${esc(t)}
        </li>`).join('')}
    </ul>

    <div class="col gap-10" style="margin-top:22px">
      <button class="plan is-on" data-act="plan" data-id="yil">
        <div class="row-between">
          <div>
            <p class="t-h3">Yıllık</p>
            <p class="t-sec" style="margin-top:2px">İlk 7 gün ücretsiz</p>
          </div>
          <div style="text-align:right">
            <p class="t-h3">₺449</p>
            <p class="t-sec">yıllık</p>
          </div>
        </div>
      </button>
      <button class="plan" data-act="plan" data-id="ay">
        <div class="row-between">
          <div><p class="t-h3">Aylık</p><p class="t-sec" style="margin-top:2px">İstediğin zaman iptal</p></div>
          <div style="text-align:right"><p class="t-h3">₺59</p><p class="t-sec">aylık</p></div>
        </div>
      </button>
    </div>

    <button class="btn btn--primary btn--block" style="margin-top:16px" data-act="buy">
      ${state.premium ? 'Premium Aktif' : 'Premium’u Dene'}
    </button>
    <p class="t-cap t-center" style="margin-top:12px;text-transform:none;letter-spacing:0">
      Mizan ibadet ekranlarında reklam göstermez.
    </p>`);

  body.addEventListener('click', (e) => {
    const n = e.target.closest('[data-act]');
    if (!n) return;
    if (n.dataset.act === 'plan') {
      $$('.plan', body).forEach((p) => p.classList.toggle('is-on', p === n));
    }
    if (n.dataset.act === 'buy') {
      state.premium = !state.premium;
      commit('premium'); closeSheet(); paint(root);
      toast(state.premium ? 'Premium etkinleştirildi.' : 'Premium kapatıldı.');
    }
  });
}

function openAccount() {
  openSheet('Mizan Hesabı', `
    <p class="t-body">
      Mizan’ı hesap açmadan tam olarak kullanabilirsin. Verilerin cihazında kalır;
      hiçbir sunucuya gönderilmez.
    </p>
    <p class="t-body" style="margin-top:14px;color:var(--ink-700)">
      Hesap yalnızca cihazlar arasında senkronizasyon istersen gerekir:
      son okuduğun yer, hatim ilerlemen, kaydettiklerin ve ayarların taşınır.
    </p>
    <button class="btn btn--secondary btn--block" style="margin-top:20px">Hesap Oluştur</button>
    <button class="btn btn--ghost btn--block" style="margin-top:8px">Giriş Yap</button>
    <p class="t-cap t-center" style="margin-top:14px;text-transform:none;letter-spacing:0">
      Senkronizasyon Mizan Premium kapsamındadır.
    </p>`);
}

function openPrivacy() {
  openSheet('Gizlilik', `
    <ul>
      ${['Konum yalnızca namaz vakitlerini ve kıble yönünü hesaplamak için kullanılır; cihazdan çıkmaz.',
      'Okuma geçmişin, kayıtların ve ayarların cihazında saklanır.',
      'Hesap açmadığın sürece hiçbir veri sunucuya gönderilmez.',
      'Mizan reklam kimliği toplamaz, üçüncü taraf izleyici kullanmaz.',
      'Mizan Sor’a yazdığın sorular cevabın oluşturulması dışında saklanmaz.'].map((t) => `
        <li class="t-body" style="padding:9px 0 9px 17px;position:relative;color:var(--ink-700)">
          <span style="position:absolute;left:0;top:16px;width:5px;height:5px;border-radius:50%;background:var(--sage)"></span>
          ${esc(t)}
        </li>`).join('')}
    </ul>`);
}

function openAbout() {
  openSheet('Hakkımızda', `
    <div style="text-align:center;padding:4px 0 20px">
      ${logoMark(168)}
      <p class="t-sec" style="margin-top:2px">Günün, ibadetin, dengen.</p>
    </div>
    <p class="t-body" style="color:var(--ink-700)">
      Mizan; denge, ölçü ve düzen demektir. Bu uygulama günlük hayatla ibadet arasında
      sürdürülebilir bir denge kurmayı amaçlar. Bu yüzden Mizan’da puan, rozet, seri
      sayacı ve suçluluk üreten bildirim yoktur.
    </p>
    <p class="section-title">İçerik Kaynakları</p>
    <ul>
      ${['Kur’an-ı Kerim — Osmanî resm-i hat',
      'Meal — Diyanet İşleri Başkanlığı',
      'Hadis — Buhârî, Müslim, Tirmizî, Ebû Dâvûd, İbn Mâce, Nesâî',
      'Fıkıh — Diyanet İşleri Başkanlığı İlmihali, Din İşleri Yüksek Kurulu kararları',
      'Namaz vakitleri — güneş konumu hesabı, Diyanet yöntemi varsayılan'].map((t) => `
        <li class="source" style="padding:6px 0">${esc(t)}</li>`).join('')}
    </ul>
    <p class="t-cap t-center" style="margin-top:24px;color:var(--ink-300)">Sürüm 1.0</p>`);
}
