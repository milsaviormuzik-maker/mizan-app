/* ============================================================
   MİZAN — Yönlendirici
   Maks. 3 seviye: Sekme → Ekran → Alt sayfa.
   Sekme kökleri bellekte tutulur (kaydırma konumu korunur),
   alt ekranlar yığına itilir.
   ============================================================ */

import { $, closeSheet } from './ui.js';

const routes = [];
const rootCache = new Map();
let viewport = null;
let stack = [];              // [{ path, tab, el, mod, params }]
let onChange = null;

export function defineRoute(spec) { routes.push(spec); }

function match(path) {
  for (const r of routes) {
    const rp = r.path.split('/').filter(Boolean);
    const pp = path.split('/').filter(Boolean);
    if (rp.length !== pp.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < rp.length; i++) {
      if (rp[i].startsWith(':')) params[rp[i].slice(1)] = decodeURIComponent(pp[i]);
      else if (rp[i] !== pp[i]) { ok = false; break; }
    }
    if (ok) return { route: r, params };
  }
  return null;
}

export function initRouter(viewportEl, opts = {}) {
  viewport = viewportEl;
  onChange = opts.onChange;
  addEventListener('hashchange', handle);
  handle();
}

function currentPath() {
  const h = location.hash.replace(/^#/, '');
  return h || '/bugun';
}

function handle() {
  const path = currentPath();
  const m = match(path);
  if (!m) { location.hash = '#/bugun'; return; }
  closeSheet();
  show(path, m.route, m.params);
}

/** Sekme kökünü hazırla — bellekte tutulur, DOM'dan çıkarılmaz */
function ensureRoot(route) {
  let el = rootCache.get(route.path);
  if (!el) {
    el = route.mod.render({});
    el.classList.add('screen');
    rootCache.set(route.path, el);
    viewport.append(el);
    route.mod.onMount?.(el, {});
  } else if (!el.isConnected) {
    viewport.append(el);
  }
  return el;
}

/** Yığındaki tüm itilmiş (kök olmayan) ekranları kaldır */
function popPushed(keepPath = null) {
  while (stack.length > 1) {
    const top = stack[stack.length - 1];
    if (keepPath && top.path === keepPath) break;
    stack.pop();
    top.mod.onHide?.(top.el);
    top.el.remove();
  }
}

function deactivateAll() {
  for (const c of viewport.children) c.classList.remove('is-active');
}

function show(path, route, params) {
  if (route.root) {
    popPushed();
    // Önceki sekmenin kökü DOM'da kalır; yalnızca dinleyicileri durdurulur
    const prev = stack[0];
    if (prev && prev.path !== route.path) prev.mod.onHide?.(prev.el);

    const el = ensureRoot(route);
    deactivateAll();
    el.classList.add('is-active');
    stack = [{ path, tab: route.tab, el, mod: route.mod, params }];
    route.mod.onShow?.(el, params);
    onChange?.(pathInfo(path, route));
    return;
  }

  // Alt ekran → sekme kökünün üzerine itilir
  const parent = routes.find((r) => r.root && r.tab === route.tab);
  if (!stack.length || stack[0].tab !== route.tab) {
    popPushed();
    const prev = stack[0];
    if (prev) prev.mod.onHide?.(prev.el);
    if (parent) {
      const rootEl = ensureRoot(parent);
      stack = [{ path: parent.path, tab: parent.tab, el: rootEl, mod: parent.mod, params: {} }];
    } else {
      stack = [];
    }
  }

  const top = stack[stack.length - 1];
  if (top && top.path === path && stack.length > 1) {
    onChange?.(pathInfo(path, route));
    return;
  }

  popPushed(path);
  if (stack[stack.length - 1]?.path === path) { onChange?.(pathInfo(path, route)); return; }

  const el = route.mod.render(params);
  el.classList.add('screen', 'is-pushed');
  viewport.append(el);
  deactivateAll();
  el.classList.add('is-active');
  route.mod.onMount?.(el, params);
  route.mod.onShow?.(el, params);
  stack.push({ path, tab: route.tab, el, mod: route.mod, params });
  onChange?.(pathInfo(path, route));
}

function pathInfo(path, route) {
  return { path, tab: route.tab, root: !!route.root, chrome: route.chrome ?? 'tabbar' };
}

export function go(path) {
  if (currentPath() === path) return;
  location.hash = `#${path}`;
}

export function back(fallback = '/bugun') {
  if (stack.length > 1) {
    const parent = stack[stack.length - 2];
    go(parent.path);
  } else {
    go(fallback);
  }
}

/** Aktif sekmenin kökündeki ekranı en üste kaydır */
export function scrollTop() {
  const top = stack[stack.length - 1];
  const sc = top?.el?.querySelector('.scroll');
  sc?.scrollTo({ top: 0, behavior: 'smooth' });
}

export const currentTab = () => stack[stack.length - 1]?.tab ?? 'bugun';
export const stackDepth = () => stack.length;
export const activeScreen = () => stack[stack.length - 1]?.el ?? null;

/** Bir kök ekranı bayatlat (ayar değişimi sonrası yeniden çizilsin) */
export function invalidateRoot(path) {
  const el = rootCache.get(path);
  if (el) { el.remove(); rootCache.delete(path); }
}
export function invalidateAllRoots() {
  for (const [, el] of rootCache) el.remove();
  rootCache.clear();
}
