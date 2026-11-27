// Hero card clips: real screen recordings of 8 projects, each a ~5.8 s action that ends where it started
// (scroll down, hover + click the main CTA, scroll back), so the loop point is a short crossfade between near-equal frames.
// Usage: node tools/cards.mjs [land|port] [slug ...]   (the LinkedIn chat needs `npm run dev`; BASE, default :3143)
// 1. record: CDP screencast -> .ref/cards/<variant>/<slug>/
// 2. encode: python3 tools/cards-build.py   (30 fps, loop crossfade, AV1 + H.264 + poster into public/cards/)
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const BASE = process.env.BASE ?? 'http://localhost:3143';
const [only0, ...slugs] = process.argv.slice(2);
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const TOTAL = 5800;
// SangSafar is staging-only: its clip scrolls the real staging screenshot in a bare local page.
const SANG = `${process.env.HOME}/Desktop/Sangsafar/docs/screenshots/06-matches-390.png`;
function sangPage() {
  mkdirSync('.ref/cards', { recursive: true });
  const f = `${process.cwd()}/.ref/cards/sangsafar.html`;
  writeFileSync(f, `<!doctype html><meta name=viewport content="width=device-width"><style>html,body{margin:0;background:#fff}img{display:block;width:100%}</style><img src="${pathToFileURL(SANG)}">`);
  return pathToFileURL(f).href;
}

// [variant, slug, url, opts]. land = 1440x912 desktop (600x380 cards; also the 1056x660 carousel cut), port = 390x688 @2x
// phone (340x600 cards), tall = 390x845 @2x phone (9:19.5, the carousel's phone screen). Recreated UIs are desktop-only.
const CLIPS = [
  ['land', 'tulips-oven', 'https://www.tulipsoven.com', { dy: 620 }],
  ['land', 'gapl', 'https://gapl.vercel.app', { dy: 480 }],
  ['land', 'proofmart', 'https://proofmart.shop', { dy: 640 }],
  ['land', 'yourprofessionals', 'https://www.yourprofessionals.in', { dy: 620 }],
  ['land', 'rumour-mill', 'https://clg.143.lat', { dy: 560 }],
  ['land', 'linkedin-autopilot', `${BASE}/capture/linkedin-autopilot`, { chat: true }],
  ['land', 'picapool-crm-automation', `${BASE}/capture/picapool-crm`, { dy: 360, sel: '.crm-main tbody tr' }],
  ['land', 'picapool-ai-data-analyst', `${BASE}/capture/picapool-ai-analyst`, { dy: 300, sel: '.an-side li' }],
  ['port', 'spraykart', 'https://www.spraykart.com', { dy: 760, sel: 'a[href*="/products/"]' }],
  // /trips is one screen of in-page steps (data-act="next" / "back"; nothing is submitted): the clip really taps forward
  // twice and back twice, so it ends on the screen it started on.
  ['port', 'picapool-acquisition-campaign', 'https://plan.picapool.tech/trips', { taps: ['next', 'next', 'back', 'back'] }],
  ['port', 'tulips-oven', 'https://www.tulipsoven.com', { dy: 700 }],
  ['port', 'gapl', 'https://gapl.vercel.app', { dy: 700, sel: 'button' }],
  ['port', 'rumour-mill', 'https://clg.143.lat', { dy: 700 }],
  ['port', 'sangsafar', null, { dy: 900 }],
  ['tall', 'spraykart', 'https://www.spraykart.com', { dy: 760, sel: 'a[href*="/products/"]' }],
  ['tall', 'picapool-acquisition-campaign', 'https://plan.picapool.tech/trips', { taps: ['next', 'next', 'back', 'back'] }],
  ['tall', 'sangsafar', null, { dy: 900 }],
];

// Injected into every page: cursor (desktop), click ripple, eased scroll, CTA finder.
const HELPERS = () => {
  const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const tween = (ms, f) => new Promise(res => { const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / ms); f(ease(k)); if (k < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  // Instant per-frame scroll: CSS scroll-behavior: smooth (Spraykart) would restart a smooth scroll every frame.
  document.documentElement.style.scrollBehavior = document.body.style.scrollBehavior = 'auto';
  window.__scroll = (dy, ms) => { const y0 = scrollY; return tween(ms, e => scrollTo({ top: y0 + dy * e, behavior: 'instant' })); };
  window.__scrollTo = (y, ms) => window.__scroll(y - scrollY, ms);
  const cur = document.createElement('div');
  // DOM calls, not innerHTML: Tulip's Oven enforces Trusted Types.
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
  Object.entries({ width: 40, height: 40, viewBox: '0 0 24 24' }).forEach(([k, v]) => svg.setAttribute(k, v));
  Object.entries({ d: 'M4 2l15 9.5-6.6 1.3 4 7.6-3 1.6-4-7.7L4 19z', fill: '#111', stroke: '#fff', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }).forEach(([k, v]) => path.setAttribute(k, v));
  svg.appendChild(path); cur.appendChild(svg);
  Object.assign(cur.style, { position: 'fixed', left: '0', top: '0', zIndex: 2147483647, pointerEvents: 'none', transform: 'translate(-100px,-100px)', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.35))' });
  document.documentElement.appendChild(cur);
  window.__cursor = { show: v => (cur.style.display = v ? 'block' : 'none') };
  addEventListener('mousemove', e => { cur.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`; }, true);
  window.__ripple = (x, y, s = innerWidth > 800 ? 72 : 44) => {
    const r = document.createElement('div');
    Object.assign(r.style, { position: 'fixed', left: `${x - s / 2}px`, top: `${y - s / 2}px`, width: `${s}px`, height: `${s}px`, borderRadius: '50%', border: '3px solid rgba(217,95,59,.95)', background: 'rgba(217,95,59,.18)', zIndex: 2147483646, pointerEvents: 'none', transition: 'transform .5s ease-out, opacity .5s ease-out', transform: 'scale(.3)', opacity: '1' });
    document.documentElement.appendChild(r);
    requestAnimationFrame(() => { r.style.transform = 'scale(1.5)'; r.style.opacity = '0'; });
    setTimeout(() => r.remove(), 650);
  };
  // Main CTA: biggest fully visible link/button with short text, or the biggest visible match of a per-site selector.
  window.__cta = sel => {
    const els = [...document.querySelectorAll(sel || 'a, button')].map(el => ({ el, r: el.getBoundingClientRect(), t: (el.textContent || '').trim() }))
      .filter(o => o.r.width > 50 && o.r.height > 24 && o.r.top > 60 && o.r.bottom < innerHeight - (sel ? 4 : 40) && o.r.left >= 0 && o.r.right <= innerWidth && (sel || (o.t.length > 2 && o.t.length < 40)) && getComputedStyle(o.el).visibility !== 'hidden');
    els.sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
    const o = els[0];
    return o ? { x: o.r.left + o.r.width / 2, y: o.r.top + o.r.height / 2, t: o.t } : null;
  };
};

// The autopilot chat (recreated Telegram UI, /capture/linkedin-autopilot): replays today's thread live. The brief is
// typed, bubbles arrive one by one, the cursor taps "Post this". __chatReset() returns it to the empty state.
const CHAT = () => {
  // Bottom-anchored thread at 1.5x (the card shows the 1440 frame at ~0.4x); drop the capture page's fixed min-height.
  Object.assign(document.querySelector('.cap').style, { minHeight: '0', zoom: '1.5' });
  Object.assign(document.querySelector('.tg-main').style, { minHeight: 'calc(100vh / 1.5)' });
  Object.assign(document.querySelector('.tg-side').style, { height: 'calc(100vh / 1.5)' });
  Object.assign(document.querySelector('.tg-thread').style, { flex: '1', justifyContent: 'flex-end' });
  const thread = document.querySelector('.tg-thread'), input = document.querySelector('.tg-input');
  const kids = [...thread.children];
  const today = kids.findIndex(k => k.textContent === 'Today');
  const later = kids.slice(today + 1).filter(k => !k.classList.contains('cover'));
  kids.slice(today + 1).forEach(k => k.classList.contains('cover') && k.remove());
  later.forEach(k => Object.assign(k.style, { transition: 'opacity .25s, transform .25s' }));
  const scrollEnd = () => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  window.__chatReset = () => { later.forEach(k => { k.style.display = 'none'; }); input.textContent = 'Write a brief…'; input.style.color = ''; scrollEnd(); };
  window.__chatShow = i => { const k = later[i]; k.style.display = ''; k.style.opacity = '0'; k.style.transform = 'translateY(8px)'; scrollEnd(); requestAnimationFrame(() => { k.style.opacity = '1'; k.style.transform = 'none'; }); };
  window.__chatType = (s, ms) => new Promise(res => { input.style.color = '#111'; let i = 0; const t = setInterval(() => { input.textContent = s.slice(0, ++i); if (i >= s.length) { clearInterval(t); res(); } }, ms / s.length); });
  window.__chatClear = () => { input.textContent = 'Write a brief…'; input.style.color = ''; };
  window.__chatCount = later.length;
  window.__chatGo = () => { const b = document.querySelectorAll('.tg-thread .btns .go'); const r = b[b.length - 1].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  window.__chatReset();
};

async function dismiss(page) {
  const btn = page.locator('button, a, [role=button]').filter({ hasText: /^\s*(accept( all)?( cookies)?|allow( all)?|agree|i agree|got it|ok(ay)?|close|no thanks|×|✕)\s*$/i });
  for (const b of await btn.all()) if (await b.isVisible().catch(() => false)) { await b.click({ timeout: 1500 }).catch(() => {}); await page.waitForTimeout(400); }
  await page.keyboard.press('Escape').catch(() => {});
}

async function glide(page, from, to, ms) {
  const steps = Math.max(8, Math.round(ms / 16));
  for (let i = 1; i <= steps; i++) {
    const k = i / steps, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    await page.mouse.move(from.x + (to.x - from.x) * e, from.y + (to.y - from.y) * e);
    await page.waitForTimeout(ms / steps);
  }
}
const wait = (page, ms) => page.waitForTimeout(ms);

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--hide-scrollbars'] });
for (const [variant, slug, url0, o] of CLIPS) {
  if (only0 && only0 !== variant) continue;
  if (slugs.length && !slugs.includes(slug)) continue;
  const url = url0 ?? sangPage();
  const P = variant !== 'land';
  const vp = P ? { width: 390, height: variant === 'tall' ? 845 : 688, dpr: 2 } : { width: 1440, height: 912, dpr: 1 };
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, ...(P ? { isMobile: true, hasTouch: true, userAgent: IPHONE } : {}) });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 90000 }).catch(e => console.log('goto', slug, e.message));
  await wait(page, 5000);
  await dismiss(page);
  await page.evaluate(HELPERS);
  if (o.chat) await page.evaluate(CHAT);
  if (P) await page.evaluate(() => window.__cursor.show(false));
  const start = { x: vp.width * 0.64, y: vp.height * 0.8 };
  if (!P) await page.mouse.move(start.x, start.y);
  await wait(page, 600);
  const dir = `.ref/cards/${variant}/${slug}`;
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, data });
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  const W = vp.width * vp.dpr, H = vp.height * vp.dpr;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  await wait(page, 120);
  const t0 = Date.now();
  if (o.taps) {
    for (const act of o.taps) {
      await wait(page, 700);
      const r = await page.evaluate(a => { const e = [...document.querySelectorAll(`[data-act="${a}"]`)].find(x => x.getBoundingClientRect().width > 0); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, act);
      await page.evaluate(({ x, y }) => window.__ripple(x, y), r);
      await page.mouse.click(r.x, r.y);
    }
    console.log(slug, variant, 'taps', o.taps.join(' '));
  } else if (o.chat) {
    // ~5.4 s: type the brief, send, bot replies arrive, cursor taps "Post this", the reply posts, then reset.
    await page.evaluate(() => window.__chatType('Brief: why small teams should automate follow-ups', 900));
    await wait(page, 150);
    await page.evaluate(() => { window.__chatClear(); window.__chatShow(0); });
    const n = await page.evaluate(() => window.__chatCount);
    for (let i = 1; i < n - 2; i++) { await wait(page, 430); await page.evaluate(k => window.__chatShow(k), i); }
    await wait(page, 300);
    const go = await page.evaluate(() => window.__chatGo());
    await glide(page, start, go, 500);
    await page.evaluate(({ x, y }) => window.__ripple(x, y), go);
    await wait(page, 220);
    await page.evaluate(k => window.__chatShow(k), n - 2);
    await wait(page, 380);
    await page.evaluate(k => window.__chatShow(k), n - 1);
    const left = TOTAL - 500 - (Date.now() - t0);
    await glide(page, go, start, Math.max(300, left));
    await page.evaluate(() => window.__chatReset());
  } else {
    // Scroll down, hover + click the main CTA there, scroll back to the top while the cursor returns.
    if (o.dy) await page.evaluate(([dy, ms]) => window.__scroll(dy, ms), [o.dy, 1700]);
    else await wait(page, 600);
    const cta = await page.evaluate(sel => window.__cta(sel), o.sel);
    if (cta) {
      if (P) await wait(page, 500); else await glide(page, start, cta, 650);
      await wait(page, 250); // hover state shows
      await page.evaluate(({ x, y }) => window.__ripple(x, y), cta);
      if (o.click) await page.mouse.click(cta.x, cta.y);
      await wait(page, 450);
    } else await wait(page, 1300);
    console.log(slug, variant, 'cta', cta?.t ?? '(none)');
    const back = Math.max(900, TOTAL - 900 - (Date.now() - t0));
    await Promise.all([
      o.dy ? page.evaluate(ms => window.__scrollTo(0, ms), back) : wait(page, back),
      !P && cta ? glide(page, cta, start, back) : Promise.resolve(),
    ]);
  }
  const left = TOTAL + 300 - (Date.now() - t0);
  if (left > 0) await wait(page, left);
  await cdp.send('Page.stopScreencast');
  frames.forEach((f, i) => writeFileSync(`${dir}/${String(i).padStart(4, '0')}.jpg`, Buffer.from(f.data, 'base64')));
  writeFileSync(`${dir}/times.json`, JSON.stringify({ w: W, h: H, times: frames.map(f => f.t) }));
  console.log(slug, variant, frames.length, 'frames', W + 'x' + H, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  await ctx.close();
}
await browser.close();
