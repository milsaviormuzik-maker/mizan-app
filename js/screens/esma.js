/* ============================================================
   MİZAN — Esmâ-i Hüsnâ
   ------------------------------------------------------------
   Liste bir sayım değil, yaygın kabul görmüş bir derlemedir.
   Bu, ekranın en üstünde kullanıcıya da söylenir: "doksan dokuz"
   sayısı isimleri sınırlamaz, sıralama râvi derlemesidir.
   ============================================================ */

import { el, $, $$, esc, openSheet, toast } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { back } from '../core/router.js';
import { topbar, empty } from './_blocks.js';
import { ESMA, ISM_I_ZAT, ESMA_KAYNAK, ESMA_AYETLER, searchEsma, esmaByNo } from '../data/esma.js';
import { semse } from '../core/motifs.js';

let arama = '';

export const esmaScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Esmâ-i Hüsnâ')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">

            <section class="card" style="border-color:var(--gold-line);overflow:hidden">
              <span class="semse-arka">${semse(260, { donen: true })}</span>
              <span class="card__label" style="color:var(--gold-text);position:relative">İsm-i Zât</span>
              <p class="arabic arabic--feature" dir="rtl" lang="ar"
                style="font-size:40px;margin-top:14px">${ISM_I_ZAT.ar}</p>
              <p class="t-h2 t-center" style="margin-top:10px">${esc(ISM_I_ZAT.tr)}</p>
              <p class="t-body t-center" style="margin-top:8px;color:var(--ink-700)">${esc(ISM_I_ZAT.mean)}</p>
              <p class="rivayet-not">${esc(ISM_I_ZAT.not)}</p>
            </section>

            <div class="search" style="margin-top:18px">
              ${icon('search', 17)}
              <input type="search" placeholder="İsim veya anlam ara" data-search
                autocomplete="off" spellcheck="false">
            </div>

            <p class="section-title" style="margin-top:22px">
              <span data-count>99 İsim</span>
            </p>
            <div class="esma-grid" data-grid></div>

            <div class="not-kutusu" style="margin-top:24px">
              <p class="not-kutusu__baslik">Liste hakkında</p>
              <p class="not-kutusu__metin">
                Kur’an, Allah’ın en güzel isimleri olduğunu bildirir
                (${ESMA_AYETLER.map(esc).join(', ')}) ama isimleri tek tek saymaz.
                Buradaki sıralama Tirmizî ve İbn Mâce rivayetinden gelir.
              </p>
              <p class="not-kutusu__metin">
                Âlimlerin çoğunluğuna göre <strong>“doksan dokuz” sayısı isimleri
                sınırlamaz</strong>; sıralama da râvilerin derlemesidir. Farklı
                rivayetlerde birkaç isim değişir.
              </p>
              <p class="source" style="margin-top:12px">${esc(ESMA_KAYNAK)}</p>
            </div>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    const ciz = () => {
      const liste = arama.length >= 2 ? searchEsma(arama) : ESMA;
      $('[data-count]', root).textContent =
        arama.length >= 2 ? `${liste.length} sonuç` : '99 İsim';
      $('[data-grid]', root).innerHTML = liste.length
        ? liste.map((x) => `
          <button class="esma" data-act="detay" data-no="${x.no}">
            <span class="esma__no">${x.no}</span>
            <span class="esma__ar arabic" dir="rtl" lang="ar">${x.ar}</span>
            <span class="esma__tr">${esc(x.tr)}</span>
          </button>`).join('')
        : empty('Bu aramaya uyan isim bulunamadı.');
    };

    $('[data-search]', root).addEventListener('input', (e) => {
      arama = e.target.value;
      ciz();
    });

    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') { back('/kesfet'); return; }
      if (n.dataset.act === 'detay') { acDetay(Number(n.dataset.no)); return; }
      if (n.dataset.act === 'esma-share') {
        const x = esmaByNo(Number(n.dataset.no));
        const metin = `${x.ar}\n${x.tr} — ${x.mean}\n\n${ESMA_KAYNAK}\nMizan`;
        if (navigator.share) navigator.share({ text: metin }).catch(() => {});
        else { navigator.clipboard?.writeText(metin); toast('Kopyalandı.'); }
      }
    });

    ciz();
  }
};

function acDetay(no) {
  const x = esmaByNo(no);
  if (!x) return;
  const onceki = esmaByNo(no - 1);
  const sonraki = esmaByNo(no + 1);
  openSheet(`${no}. İsim`, `
    <div style="position:relative;display:grid;place-items:center;min-height:158px">
      <span class="semse-arka">${semse(200, { donen: true })}</span>
      <p class="arabic arabic--feature" dir="rtl" lang="ar" style="font-size:44px;position:relative">${x.ar}</p>
    </div>
    <div class="ornament" aria-hidden="true"><span class="ornament__mark"></span></div>
    <p class="t-h2 t-center">${esc(x.tr)}</p>
    <p class="t-body t-center" style="margin-top:10px;color:var(--ink-700)">${esc(x.mean)}</p>
    <p class="source" style="margin-top:16px;text-align:center">${esc(ESMA_KAYNAK)}</p>
    <div class="row gap-8" style="margin-top:20px;justify-content:center">
      <button class="chip" data-act="esma-share" data-no="${no}">${icon('share', 15)} Paylaş</button>
    </div>
    <div class="row-between" style="margin-top:20px">
      ${onceki ? `<button class="btn btn--ghost" data-act="detay" data-no="${onceki.no}">
        ${icon('back', 15)} ${esc(onceki.tr)}</button>` : '<span></span>'}
      ${sonraki ? `<button class="btn btn--ghost" data-act="detay" data-no="${sonraki.no}">
        ${esc(sonraki.tr)} ${icon('chevron', 15)}</button>` : '<span></span>'}
    </div>`);
}
