/* ============================================================
   MİZAN SOR — eşleştirme çekirdeği
   ------------------------------------------------------------
   Saf mantık: DOM'a dokunmaz. Hem arayüz hem de yayın öncesi
   kaynak denetçisi (dogrula-kaynaklar.mjs) AYNI kodu kullanır ki
   denetimin ölçtüğü şey ile kullanıcının gördüğü şey ayrışmasın.

   Sözleşme: kaynağı bulunamayan soruya cevap ÜRETİLMEZ, null döner.
   ============================================================ */

import { ASK_ANSWERS, INFO_ARTICLES } from '../data/content.js';

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

/**
 * Soruya kaynaklı bir karşılık bul.
 * @returns {{tur:'hazir'|'madde', kaynaklar:string[], kayit:object}|null}
 */
export function findAnswer(question) {
  const qt = terms(question);
  if (qt.length === 0) return null;

  let best = null;
  for (const [k, v] of Object.entries(ASK_ANSWERS)) {
    const score = coverage(qt, terms(k));
    if (score >= MIN_COVERAGE && (!best || score > best.score)) best = { score, answer: v };
  }
  if (best) return { tur: 'hazir', kaynaklar: best.answer.sources, kayit: best.answer };

  let article = null;
  for (const a of INFO_ARTICLES) {
    const titleBag = terms(a.title);
    const fullBag = [...titleBag, ...terms(a.summary)];
    const cov = Math.max(coverage(qt, titleBag), coverage(qt, fullBag) * 0.9);
    const distinctive = hasDistinctiveHit(qt, a) && coverage(qt, fullBag) >= 0.4;
    const score = distinctive ? Math.max(cov, 0.75) : cov;
    if (score >= MIN_COVERAGE && (!article || score > article.score)) article = { score, a };
  }
  if (article) return { tur: 'madde', kaynaklar: article.a.sources, kayit: article.a };

  return null;
}
