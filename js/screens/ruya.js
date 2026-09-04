/* ============================================================
   MİZAN — Rüya
   ------------------------------------------------------------
   Bu ekran rüyanın İslam'daki yerini anlatır. Rüya YORUMLAMAZ.

   Gerekçe ekranın kendisinde de yazılıdır: Kur'an ve sünnette
   rüyanın kaynakları ve görülünce ne yapılacağı bildirilir, ama
   bir sembol sözlüğü verilmez. Uygulamanın kuralı gereği
   (kaynaksız dinî bilgi verilmez) sembol yorumu yapılamaz.
   ============================================================ */

import { el, $, esc } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { back, go } from '../core/router.js';
import { topbar } from './_blocks.js';
import { infoOf, infoById } from '../data/content.js';

/** Ekranda öne çıkan sıra — "neden yorumlamıyoruz" en sonda, kapanış olarak */
const SIRA = ['ruya-cesitleri', 'ruya-guzel', 'ruya-kotu'];

export const ruyaScreen = {
  render() {
    const maddeler = SIRA.map(infoById).filter(Boolean);
    const neden = infoById('ruya-tabir');

    return el(`
      <div class="screen">
        ${topbar('Rüya')}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">

            <section class="card card--flush" style="margin-top:4px">
              <p class="t-body" style="color:var(--ink-700)">
                Rüyanın İslam’daki yeri, görülünce ne yapılacağı ve hangi ölçüde
                anlam taşıdığı hadislerde anlatılır. Bu bölüm yalnızca o kısmı aktarır.
              </p>
            </section>

            ${maddeler.map((m) => `
              <section class="card" style="margin-top:14px">
                <span class="card__label">${esc(m.title)}</span>
                <p class="t-body" style="margin-top:10px;color:var(--ink-700)">${esc(m.summary)}</p>
                <ul class="step__points" style="margin-top:12px">
                  ${m.body.map((satir) => `<li>${esc(satir)}</li>`).join('')}
                </ul>
                <p class="source" style="margin-top:12px">${m.sources.map(esc).join(' · ')}</p>
              </section>`).join('')}

            <div class="not-kutusu" style="margin-top:22px">
              <p class="not-kutusu__baslik">${esc(neden.title)}</p>
              ${neden.body.map((satir) => `<p class="not-kutusu__metin">${esc(satir)}</p>`).join('')}
              <p class="source" style="margin-top:12px">${neden.sources.map(esc).join(' · ')}</p>
            </div>

            <button class="btn btn--secondary btn--block" style="margin-top:18px" data-act="sor">
              ${icon('message', 16)} Mizan Sor’a sor
            </button>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') back('/kesfet');
      if (n.dataset.act === 'sor') go('/kesfet/sor');
    });
  }
};
