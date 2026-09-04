/* ============================================================
   MİZAN — Zekât Hesaplayıcı
   Nisap: 80,18 gr altın veya 561 gr gümüş. Oran: %2,5 (kırkta bir).
   Sonuç TAHMİNÎDİR; kesin hüküm için uzmana danışılması önerilir.
   ============================================================ */

import { el, $, $$, esc, trMoney, trNumber, toast, openSheet, closeSheet } from '../core/ui.js';
import { icon } from '../core/icons.js';
import { back } from '../core/router.js';
import { topbar } from './_blocks.js';

const NISAB_GOLD_G = 80.18;
const NISAB_SILVER_G = 561;
const RATE = 0.025;

/* Fiyatlar kullanıcı tarafından güncellenebilir (üretimde canlı kurdan gelir) */
const prices = { gold: 4850, silver: 58 };   // TL / gram

const FIELDS = [
  { id: 'nakit', label: 'Nakit ve banka', hint: 'TL, döviz karşılığı, vadeli hesaplar', unit: '₺' },
  { id: 'altin', label: 'Altın', hint: 'Ziynet ve külçe dahil, gram olarak', unit: 'gr', gram: 'gold' },
  { id: 'gumus', label: 'Gümüş', hint: 'Gram olarak', unit: 'gr', gram: 'silver' },
  { id: 'yatirim', label: 'Yatırım', hint: 'Hisse senedi, yatırım fonu, katılım hesabı', unit: '₺' },
  { id: 'ticari', label: 'Ticari mal', hint: 'Satmak amacıyla elde tutulan mallar', unit: '₺' },
  { id: 'alacak', label: 'Alacaklar', hint: 'Tahsil edilmesi beklenen borçlar', unit: '₺' },
  { id: 'borc', label: 'Borçlar', hint: 'Vadesi gelmiş borçlar — toplamdan düşülür', unit: '₺', negative: true }
];

export const zakatScreen = {
  render() {
    return el(`
      <div class="screen">
        ${topbar('Zekât Hesaplayıcı', {
      action: `<button class="icon-btn icon-btn--bare" data-act="prices" aria-label="Fiyatlar">${icon('settings', 19)}</button>`
    })}
        <div class="scroll" data-scroll>
          <div class="screen__body pad-tabbar">

            <section class="card" style="margin-top:4px">
              <span class="card__label">Zekâta Esas Tutar</span>
              <p class="t-count" style="margin-top:10px" data-base>${trMoney(0)}</p>
              <div class="row-between" style="margin-top:14px">
                <span class="t-sec">Nisap (gümüş esaslı)</span>
                <span class="t-num t-sec" style="color:var(--ink-900);font-weight:600" data-nisab>—</span>
              </div>
              <div class="progress" style="margin-top:12px"><div class="progress__fill" data-prog style="width:0%"></div></div>
              <p class="t-sec" style="margin-top:12px" data-verdict>Varlıklarını girerek başla.</p>
            </section>

            <section class="card" style="margin-top:14px;border-color:var(--gold-line)">
              <div class="row-between">
                <div>
                  <span class="card__label">Tahmini Zekât</span>
                  <p class="t-sec" style="margin-top:2px">Kırkta bir · %2,5</p>
                </div>
                <p class="t-display t-num" style="font-size:30px;font-weight:400;color:var(--gold-text)" data-zakat>${trMoney(0)}</p>
              </div>
            </section>

            <p class="section-title">Varlıklar</p>
            <div class="col gap-12">
              ${FIELDS.map((f) => `
                <label class="field">
                  <span class="field__label">${esc(f.label)}${f.negative ? ' (düşülür)' : ''}</span>
                  <div class="field__suffix">
                    <input class="field__input grow" type="number" inputmode="decimal" min="0"
                      data-f="${f.id}" placeholder="0" aria-label="${esc(f.label)}">
                    <span class="field__unit">${f.unit}</span>
                  </div>
                  <span class="t-cap" style="letter-spacing:0;text-transform:none">
                    ${esc(f.hint)}${f.gram ? ` · ${trMoney(prices[f.gram])}/gr` : ''}
                    <span data-conv="${f.id}"></span>
                  </span>
                </label>`).join('')}
            </div>

            <button class="btn btn--ghost btn--block" style="margin-top:16px" data-act="clear">
              ${icon('refresh', 16)} Alanları temizle
            </button>

            <section class="card card--flush" style="margin-top:20px">
              <p class="t-sec">
                Bu hesaplama <strong>tahminîdir</strong>. Nisap hesabında fakirin lehine olduğu için
                gümüş esas alınmıştır. Altın nisabını esas alan görüşler de vardır.
                Kendi durumunla ilgili kesin bir karar için bir din görevlisine veya uzmana
                danışman daha doğru olur.
              </p>
              <p class="source" style="margin-top:10px">Tevbe 60 · Diyanet İşleri Başkanlığı, İlmihal, I/430–470</p>
            </section>
          </div>
        </div>
      </div>`);
  },

  onMount(root) {
    root.addEventListener('input', (e) => {
      if (e.target.matches('[data-f]')) recalc(root);
    });
    root.addEventListener('click', (e) => {
      const n = e.target.closest('[data-act]');
      if (!n) return;
      if (n.dataset.act === 'back') back('/ibadet');
      if (n.dataset.act === 'clear') {
        $$('[data-f]', root).forEach((i) => { i.value = ''; });
        recalc(root); toast('Alanlar temizlendi.');
      }
      if (n.dataset.act === 'prices') openPrices(root);
    });
    recalc(root);
  },

  onShow(root) { recalc(root); }
};

function val(root, id) {
  const v = Number($(`[data-f="${id}"]`, root)?.value);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function recalc(root) {
  const nakit = val(root, 'nakit');
  const altinG = val(root, 'altin');
  const gumusG = val(root, 'gumus');
  const yatirim = val(root, 'yatirim');
  const ticari = val(root, 'ticari');
  const alacak = val(root, 'alacak');
  const borc = val(root, 'borc');

  const altinTL = altinG * prices.gold;
  const gumusTL = gumusG * prices.silver;

  const base = Math.max(0, nakit + altinTL + gumusTL + yatirim + ticari + alacak - borc);
  const nisab = NISAB_SILVER_G * prices.silver;
  const zakat = base >= nisab ? base * RATE : 0;

  $('[data-base]', root).textContent = trMoney(base);
  $('[data-nisab]', root).textContent = trMoney(nisab);
  $('[data-zakat]', root).textContent = trMoney(zakat);
  $('[data-prog]', root).style.width = `${Math.min(100, (base / nisab) * 100).toFixed(1)}%`;

  const verdict = $('[data-verdict]', root);
  if (base === 0) verdict.textContent = 'Varlıklarını girerek başla.';
  else if (base >= nisab) {
    verdict.innerHTML = `Toplamın nisabı aşıyor. Üzerinden bir kamerî yıl geçtiyse
      <strong>${trMoney(zakat)}</strong> zekât hesaplanır.`;
  } else {
    verdict.innerHTML = `Toplamın nisabın altında. Aradaki fark
      <strong>${trMoney(nisab - base)}</strong>.`;
  }

  const ca = $('[data-conv="altin"]', root);
  if (ca) ca.textContent = altinG ? ` → ${trMoney(altinTL)}` : '';
  const cg = $('[data-conv="gumus"]', root);
  if (cg) cg.textContent = gumusG ? ` → ${trMoney(gumusTL)}` : '';
}

/* ------------------------------------------------------------ */
function openPrices(root) {
  const body = openSheet('Gram Fiyatları', `
    <p class="t-sec" style="margin-bottom:16px">
      Uygulama sürümünde bu değerler güncel piyasadan otomatik alınır.
      Buradan elle de girebilirsin.
    </p>
    <div class="col gap-12">
      <label class="field">
        <span class="field__label">Altın (TL / gram)</span>
        <input class="field__input" type="number" inputmode="decimal" data-p="gold" value="${prices.gold}">
      </label>
      <label class="field">
        <span class="field__label">Gümüş (TL / gram)</span>
        <input class="field__input" type="number" inputmode="decimal" data-p="silver" value="${prices.silver}">
      </label>
      <button class="btn btn--primary btn--block" data-act="save">Kaydet</button>
    </div>
    <div class="card card--flush" style="margin-top:20px">
      <div class="row-between"><span class="t-sec">Altın nisabı</span>
        <span class="t-sec" style="color:var(--ink-900)">${trNumber(NISAB_GOLD_G, 2)} gr</span></div>
      <div class="row-between" style="margin-top:8px"><span class="t-sec">Gümüş nisabı</span>
        <span class="t-sec" style="color:var(--ink-900)">${trNumber(NISAB_SILVER_G)} gr</span></div>
      <div class="row-between" style="margin-top:8px"><span class="t-sec">Oran</span>
        <span class="t-sec" style="color:var(--ink-900)">%2,5</span></div>
    </div>`);

  body.addEventListener('click', (e) => {
    if (!e.target.closest('[data-act="save"]')) return;
    const g = Number($('[data-p="gold"]', body).value);
    const s = Number($('[data-p="silver"]', body).value);
    if (g > 0) prices.gold = g;
    if (s > 0) prices.silver = s;
    closeSheet();
    recalc(root);
    toast('Fiyatlar güncellendi.');
  });
}
