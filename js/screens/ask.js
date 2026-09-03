/* ============================================================
   MİZAN SOR
   ------------------------------------------------------------
   Kurallar (arayüz sözleşmesi):
   1. Kesin hüküm dili kullanılmaz.
   2. Cevap yapısı sabittir: Kısa Cevap → Detay → Farklı Görüşler → Kaynaklar
   3. KAYNAKSIZ HİÇBİR DİNİ BİLGİ ÜRETİLMEZ. Kaynak yoksa cevap verilmez.
   4. Her cevabın altında kalıcı uyarı satırı bulunur.

   NOT (üretim): Cevaplar burada denetlenmiş bir bilgi tabanından gelir.
   Uygulama sürümünde de model serbest üretim yapmaz; yalnızca Diyanet
   ilmihali, Din İşleri Yüksek Kurulu kararları ve hadis külliyatından
   oluşan doğrulanmış bir korpus üzerinde alıntıya dayalı cevap kurar.
   ============================================================ */

import { el, $, esc, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { back } from '../core/router.js';
import { topbar } from './_blocks.js';
import { ASK_ANSWERS, ASK_SUGGESTIONS, ASK_DISCLAIMER, INFO_ARTICLES } from '../data/content.js';

const thread = [];

export const askScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Mizan Sor', {
      action: `<button class="icon-btn icon-btn--bare" data-act="info" aria-label="Nasıl çalışır">${icon('info', 19)}</button>`
    })}
        <div class="scroll" data-scroll>
          <div class="screen__body" style="padding-bottom:150px">
            <div class="ask-thread" data-thread></div>
          </div>
        </div>
        <div class="ask-composer">
          <textarea data-input rows="1" placeholder="Dini bir soru sor…" aria-label="Soru"></textarea>
          <button class="ask-send" data-act="send" disabled aria-label="Gönder">${icon('chevron', 18)}</button>
        </div>
      </div>`);
  },

  onMount(root) {
    const input = $('[data-input]', root);
    const send = $('[data-act="send"]', root);

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(108, input.scrollHeight)}px`;
      send.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(root); }
    });

    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      const act = n.dataset.act;
      if (act === 'back') back('/kesfet');
      if (act === 'send') submit(root);
      if (act === 'info') openHow();
      if (act === 'suggest') { input.value = n.dataset.q; send.disabled = false; submit(root); }
      if (act === 'open-article') {
        import('./explore.js').then((m) => m.openArticle(n.dataset.id));
      }
    });

    paint(root);
  },

  onShow(root) { paint(root); }
};

/* ------------------------------------------------------------ */
function paint(root) {
  const box = $('[data-thread]', root);
  if (!thread.length) {
    box.innerHTML = `
      <div style="padding:26px 0 8px">
        <div class="row gap-10" style="align-items:flex-start">
          <span class="icon-btn" style="background:var(--navy);color:var(--gold);flex:none">${icon('message', 18)}</span>
          <div class="grow">
            <p class="t-h3">Mizan Sor</p>
            <p class="t-sec" style="margin-top:5px">
              Sorularını yanıtlarken yalnızca doğrulanmış kaynaklardan alıntı yapar,
              kendi başına hüküm üretmez. Bulamadığı konuda cevap vermez.
            </p>
          </div>
        </div>

        <p class="section-title">Örnek Sorular</p>
        <div class="col gap-8">
          ${ASK_SUGGESTIONS.map((q) => `
            <button class="row-item" data-act="suggest" data-q="${esc(q)}"
              style="border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface)">
              <span class="row-item__main"><span class="row-item__title" style="font-size:14.5px">${esc(q)}</span></span>
              <span class="row-item__chev">${icon('chevron', 15)}</span>
            </button>`).join('')}
        </div>

        <div class="ask-note" style="margin-top:24px">${esc(ASK_DISCLAIMER)}</div>
      </div>`;
    return;
  }

  box.innerHTML = thread.map((m) =>
    m.role === 'me'
      ? `<div class="bubble bubble--me">${esc(m.text)}</div>`
      : `<div class="bubble bubble--ai">${m.html}</div>`
  ).join('');

  const scroll = $('[data-scroll]', root);
  requestAnimationFrame(() => scroll.scrollTo({ top: scroll.scrollHeight, behavior: 'smooth' }));
}

/* ------------------------------------------------------------ */
function submit(root) {
  const input = $('[data-input]', root);
  const q = input.value.trim();
  if (!q) return;

  thread.push({ role: 'me', text: q });
  input.value = '';
  input.style.height = 'auto';
  $('[data-act="send"]', root).disabled = true;

  thread.push({ role: 'ai', html: thinkingHtml() });
  paint(root);

  setTimeout(() => {
    thread[thread.length - 1] = { role: 'ai', html: answerHtml(q) };
    paint(root);
  }, 700);
}

const thinkingHtml = () => `
  <div class="row gap-8" style="color:var(--ink-500)">
    <span style="width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 1.1s infinite"></span>
    <span class="t-sec">Kaynaklar taranıyor…</span>
  </div>
  <style>@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}</style>`;

/* ------------------------------------------------------------
   Cevap kurulumu — yalnızca doğrulanmış korpustan
   ------------------------------------------------------------
   Eşleşme kasten KATIDIR. Sorunun anlam taşıyan kelimelerinin
   çoğu bir maddeyle örtüşmüyorsa cevap üretilmez; "nasıl", "nedir",
   "kılınır" gibi genel kalıplar tek başına eşleşme sayılmaz.
   Yanlış maddeyi kaynak göstererek sunmak, cevap vermemekten kötüdür.
   ------------------------------------------------------------ */

/** Soru kalıbı kelimeleri — tek başlarına konu belirtmezler */
const STOPWORDS = new Set([
  'nasil', 'nedir', 'ne', 'neden', 'nicin', 'kac', 'kadar', 'hangi', 'kim', 'kimler',
  'mi', 'mi̇', 'mu', 'mu̇', 'midir', 'mudur', 'mıdır', 'var', 'yok', 'olur', 'olarak',
  'yapilir', 'kilinir', 'verilir', 'tutulur', 'edilir', 'alinir', 'gerekir', 'gerekli',
  'ile', 've', 'veya', 'bir', 'bu', 'su', 'o', 'icin', 'ise', 'ama', 'fakat',
  'arasindaki', 'arasinda', 'hakkinda', 'sonra', 'once', 'zaman', 'vakit', 'gun', 'gunu',
  'ben', 'sen', 'biz', 'siz', 'onlar', 'benim', 'bana', 'bize', 'lutfen', 'acaba',
  'anlat', 'anlatir', 'soyle', 'sorusu', 'soru', 'cevap', 'bilgi'
]);

/** Türkçe aksanları sadeleştir, noktalamayı at */
function fold(s) {
  return s
    .toLocaleLowerCase('tr')
    .replace(/[âàá]/g, 'a').replace(/[îíì]/g, 'i').replace(/[ûúù]/g, 'u')
    .replace(/[êéè]/g, 'e').replace(/[ôóò]/g, 'o')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/['’"“”?!.,;:()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Anlam taşıyan kelimeler */
function terms(s) {
  return fold(s).split(' ').filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/** İki kelime aynı kökten sayılır mı? (Türkçe ekleri tolere eder) */
const kin = (a, b) => {
  if (a === b) return true;
  const n = Math.min(a.length, b.length);
  if (n < 4) return false;
  const k = Math.max(4, Math.min(5, n));
  return a.slice(0, k) === b.slice(0, k);
};

const rootOf = (w) => w.slice(0, 4);

/** Yalnızca TEK bir maddenin başlığında geçen ayırt edici terimler */
const DISTINCTIVE = (() => {
  const count = new Map();
  for (const a of INFO_ARTICLES) {
    const seen = new Set();
    for (const t of terms(a.title)) {
      const r = rootOf(t);
      if (!seen.has(r)) { seen.add(r); count.set(r, (count.get(r) ?? 0) + 1); }
    }
  }
  return count;
})();

/** Soru, maddenin başlığındaki ayırt edici bir terimi içeriyor mu? */
function hasDistinctiveHit(queryTerms, article) {
  for (const t of terms(article.title)) {
    if (DISTINCTIVE.get(rootOf(t)) !== 1) continue;
    if (queryTerms.some((q) => q.length >= 4 && kin(q, t))) return true;
  }
  return false;
}

/** Soru kelimelerinin bir metin havuzunda karşılanma oranı */
function coverage(queryTerms, bagTerms) {
  if (!queryTerms.length) return 0;
  const hit = queryTerms.filter((q) => bagTerms.some((b) => kin(q, b))).length;
  return hit / queryTerms.length;
}

const MIN_COVERAGE = 0.6;

function answerHtml(question) {
  const qt = terms(question);
  if (qt.length === 0) return noAnswerHtml();

  // 1) Hazır yapılandırılmış cevaplar
  let best = null;
  for (const [k, v] of Object.entries(ASK_ANSWERS)) {
    const score = coverage(qt, terms(k));
    if (score >= MIN_COVERAGE && (!best || score > best.score)) best = { score, answer: v };
  }
  if (best) return structured(best.answer);

  // 2) İlmihal maddeleri — başlık ağırlıklı + ayırt edici terim kuralı
  let article = null;
  for (const a of INFO_ARTICLES) {
    const titleBag = terms(a.title);
    const fullBag = [...titleBag, ...terms(a.summary)];
    const cov = Math.max(coverage(qt, titleBag), coverage(qt, fullBag) * 0.9);

    // Sorunun terimlerinin çoğu maddeyle örtüşüyorsa VEYA soru yalnızca bu
    // maddeye ait ayırt edici bir terim içeriyorsa eşleşme sayılır.
    const distinctive = hasDistinctiveHit(qt, a) && coverage(qt, fullBag) >= 0.4;
    const score = distinctive ? Math.max(cov, 0.75) : cov;

    if (score >= MIN_COVERAGE && (!article || score > article.score)) article = { score, a };
  }

  if (article) {
    const a = article.a;
    return structured({
      short: a.summary,
      detail: a.body.map((l) => l.replace(' — FARZ', '')),
      views: [],
      sources: a.sources,
      articleId: a.id
    });
  }

  // 3) Kaynak bulunamadı → cevap üretilmez
  return noAnswerHtml();
}

function noAnswerHtml() {
  return `
    <div class="ask-block">
      <p class="ask-block__label">Cevap Verilemedi</p>
      <p class="t-body">
        Bu soruya doğrulanmış kaynaklarımda karşılık bulamadım. Mizan, kaynağı olmayan
        hiçbir dini bilgiyi üretmez; emin olmadığı bir maddeyi de cevap diye sunmaz.
      </p>
    </div>
    <div class="ask-note">
      Bu konuda bir din görevlisine veya uzmanına danışman daha doğru olur.
      Diyanet İşleri Başkanlığı Alo Fetva hattı (Alo 190) da bu tür sorular için kullanılabilir.
    </div>`;
}

function structured(a) {
  return `
    <div class="ask-block">
      <p class="ask-block__label">Kısa Cevap</p>
      <p class="t-body">${esc(a.short)}</p>
    </div>

    ${a.detail?.length ? `
      <div class="ask-block">
        <p class="ask-block__label">Detaylı Açıklama</p>
        <ul>
          ${a.detail.map((d) => `
            <li class="t-body" style="padding:6px 0 6px 16px;position:relative;color:var(--ink-700)">
              <span style="position:absolute;left:0;top:14px;width:4px;height:4px;border-radius:50%;background:var(--ink-300)"></span>
              ${esc(d)}
            </li>`).join('')}
        </ul>
      </div>` : ''}

    ${a.views?.length ? `
      <div class="ask-block">
        <p class="ask-block__label">Farklı Görüşler</p>
        ${a.views.map((v) => `
          <div class="card--flush" style="padding:14px;border-radius:var(--r-md);margin-top:8px">
            <p class="t-h3" style="font-size:14.5px">${esc(v.title)}</p>
            <p class="t-sec" style="margin-top:5px;color:var(--ink-700)">${esc(v.body)}</p>
          </div>`).join('')}
      </div>` : ''}

    <div class="ask-block">
      <p class="ask-block__label">Kaynaklar</p>
      <ul class="ask-sources">
        ${a.sources.map((s) => `<li>${esc(s)}</li>`).join('')}
      </ul>
    </div>

    ${a.articleId ? `
      <button class="chip" style="margin-top:14px" data-act="open-article" data-id="${a.articleId}">
        ${icon('book', 15)} Tam maddeyi aç
      </button>` : ''}

    <div class="ask-note">${esc(ASK_DISCLAIMER)}</div>`;
}

/* ------------------------------------------------------------ */
function openHow() {
  import('../core/ui.js').then(({ openSheet }) => {
    openSheet('Mizan Sor Nasıl Çalışır?', `
      <ul>
        ${[
        'Cevaplar yalnızca doğrulanmış bir kaynak kümesinden kurulur: Diyanet İlmihali, Din İşleri Yüksek Kurulu kararları, Kur’an-ı Kerim ve temel hadis külliyatı.',
        'Kaynağı bulunamayan hiçbir bilgi üretilmez. Böyle bir durumda Mizan cevap vermez ve seni bir uzmana yönlendirir.',
        'Cevaplar kesin hüküm (fetva) değildir. Bilgi aktarımı yapılır.',
        'Bir konuda mezhepler veya âlimler arasında görüş farkı varsa bu ayrı bir başlık altında gösterilir.',
        'Her cevabın altında kullanılan kaynaklar listelenir.'
      ].map((t) => `
          <li class="t-body" style="padding:9px 0 9px 17px;position:relative;color:var(--ink-700)">
            <span style="position:absolute;left:0;top:16px;width:5px;height:5px;border-radius:50%;background:var(--gold)"></span>
            ${esc(t)}
          </li>`).join('')}
      </ul>
      <div class="ask-note" style="margin-top:20px">${esc(ASK_DISCLAIMER)}</div>`);
  });
}
