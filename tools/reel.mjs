// Hero showreel: real screen recordings of the 11 projects, 1.7 s each, soft cuts, seamless loop.
// Usage: node tools/reel.mjs [desktop|mobile] [slug ...]   (recreated UIs need `npm run dev`; BASE, default :3143)
// 1. record: CDP screencast of each page while a scripted scroll / hover / click plays -> .ref/reel/<mode>/<slug>/
// 2. assemble + encode: python3 tools/reel-build.py <mode>  (resample to 30 fps, crossfade, AV1 + H.264 into public/reel/)
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const BASE = process.env.BASE ?? 'http://localhost:3143';
const [mode = 'desktop', ...only] = process.argv.slice(2);
const M = mode === 'mobile';
const SHOT_MS = 1700;
const SANG = `${process.env.HOME}/Desktop/Sangsafar/docs/screenshots`;
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

// SangSafar is staging-only: its shot scrolls through the real staging screenshot in a bare local page.
function sangPage() {
  const img = M ? `${SANG}/04-discover-390.png` : `${SANG}/06-matches-1280.png`;
  const f = `${process.cwd()}/.ref/reel/sangsafar-${mode}.html`;
  writeFileSync(f, `<!doctype html><meta name=viewport content="width=device-width"><style>html,body{margin:0;background:#fff}img{display:block;width:100%}</style><img src="${pathToFileURL(img)}">`);
  return pathToFileURL(f).href;
}

// [slug, url, action]. Actions: scroll = eased scroll by dy; hover = cursor glides to the page's main CTA, clicks
// (visual ripple only, no navigation), then scrolls; ui = cursor sweeps over rows of a recreated UI and clicks one.
const SHOTS = [
  ['tulips-oven', 'https://www.tulipsoven.com', { type: 'scroll', dy: 560 }],
  ['gapl', 'https://gapl.vercel.app', { type: 'hover', dy: 420 }],
  ['proofmart', 'https://proofmart.shop', { type: 'scroll', dy: 640 }],
  ['yourprofessionals', 'https://www.yourprofessionals.in', { type: 'scroll', dy: 620 }],
  // /trips is one screen (no scroll on desktop): the shot is a hover + click on its CTA. The site's root hero is an old visual.
  // Its CTA is an in-page step button (data-act="next"; nothing is submitted), so this shot really clicks it.
  ['picapool-acquisition-campaign', 'https://plan.picapool.tech/trips', { type: 'hover', dy: 500, click: true }],
  ['picapool-crm-automation', `${BASE}/capture/picapool-crm`, { type: 'ui', rows: 'tbody tr, .crm-row, li', dy: 320 }],
  ['picapool-ai-data-analyst', `${BASE}/capture/picapool-ai-analyst`, { type: 'ui', rows: 'aside li, nav li, li', dy: 260 }],
  ['rumour-mill', 'https://clg.143.lat', { type: 'hover', dy: 520 }],
  ['linkedin-autopilot', `${BASE}/capture/linkedin-autopilot`, { type: 'ui', rows: 'li, [class*=chat] > *', dy: 320 }],
  ['sangsafar', null, { type: 'scroll', dy: M ? 900 : 760 }],
  ['spraykart', 'https://www.spraykart.com', { type: 'scroll', dy: 700 }],
];
const RECREATED = new Set(['picapool-crm-automation', 'picapool-ai-data-analyst', 'linkedin-autopilot']);

// Injected into every page: a visible cursor (desktop), a click ripple, and the scroll / glide helpers.
const HELPERS = () => {
  const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const tween = (ms, f) => new Promise(res => { const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / ms); f(ease(k)); if (k < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
  // Instant per-frame scroll: sites with CSS scroll-behavior: smooth (Spraykart) would restart a smooth scroll every frame.
  document.documentElement.style.scrollBehavior = document.body.style.scrollBehavior = 'auto';
  window.__scroll = (dy, ms) => { const y0 = scrollY; return tween(ms, e => scrollTo({ top: y0 + dy * e, behavior: 'instant' })); };
  const cur = document.createElement('div');
  // DOM calls, not innerHTML: some sites (Tulip's Oven) enforce Trusted Types.
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path');
  Object.entries({ width: 22, height: 22, viewBox: '0 0 24 24' }).forEach(([k, v]) => svg.setAttribute(k, v));
  Object.entries({ d: 'M4 2l15 9.5-6.6 1.3 4 7.6-3 1.6-4-7.7L4 19z', fill: '#111', stroke: '#fff', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }).forEach(([k, v]) => path.setAttribute(k, v));
  svg.appendChild(path); cur.appendChild(svg);
  Object.assign(cur.style, { position: 'fixed', left: '0', top: '0', zIndex: 2147483647, pointerEvents: 'none', transform: 'translate(-100px,-100px)', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.35))' });
  document.documentElement.appendChild(cur);
  window.__cursor = { x: -100, y: -100, show: v => (cur.style.display = v ? 'block' : 'none') };
  addEventListener('mousemove', e => { cur.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`; window.__cursor.x = e.clientX; window.__cursor.y = e.clientY; }, true);
  window.__ripple = (x, y) => {
    const r = document.createElement('div');
    Object.assign(r.style, { position: 'fixed', left: `${x - 18}px`, top: `${y - 18}px`, width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(217,95,59,.9)', zIndex: 2147483646, pointerEvents: 'none', transition: 'transform .45s ease-out, opacity .45s ease-out', transform: 'scale(.3)', opacity: '1' });
    document.documentElement.appendChild(r);
    requestAnimationFrame(() => { r.style.transform = 'scale(1.4)'; r.style.opacity = '0'; });
    setTimeout(() => r.remove(), 600);
  };
  // Main CTA: biggest fully visible link/button with short text.
  window.__cta = () => {
    const els = [...document.querySelectorAll('a, button')].map(el => ({ el, r: el.getBoundingClientRect(), t: (el.textContent || '').trim() }))
      .filter(o => o.r.width > 60 && o.r.height > 24 && o.r.top > 60 && o.r.bottom < innerHeight - 8 && o.t.length > 2 && o.t.length < 40 && getComputedStyle(o.el).visibility !== 'hidden');
    els.sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
    const o = els[0];
    return o ? { x: o.r.left + o.r.width / 2, y: o.r.top + o.r.height / 2, t: o.t } : null;
  };
  window.__rows = sel => [...document.querySelectorAll(sel)].map(el => el.getBoundingClientRect())
    .filter(r => r.width > 80 && r.height > 16 && r.top > 40 && r.bottom < innerHeight - 40).slice(0, 8).map(r => ({ x: r.left + Math.min(r.width / 2, 160), y: r.top + r.height / 2 }));
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

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
for (const [slug, url0, act] of SHOTS) {
  if (only.length && !only.includes(slug)) continue;
  const url = url0 ?? sangPage();
  const rec = RECREATED.has(slug);
  // Desktop 1440x900. Phones 390x693 (9:16) at 2x; recreated UIs aren't responsive, so phones get a 900x1600 portrait.
  const vp = !M ? { width: 1440, height: 900, dpr: 1 } : rec ? { width: 900, height: 1600, dpr: 1 } : { width: 390, height: 693, dpr: 2 };
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, ...(M && !rec ? { isMobile: true, hasTouch: true, userAgent: IPHONE } : {}) });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 90000 }).catch(e => console.log('goto', slug, e.message));
  await page.waitForTimeout(5000);
  await dismiss(page);
  await page.evaluate(HELPERS);
  if (M) await page.evaluate(() => window.__cursor.show(false));
  await page.waitForTimeout(600);
  const dir = `.ref/reel/${mode}/${slug}`;
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, data });
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  const W = vp.width * vp.dpr, H = vp.height * vp.dpr;
  // Park the cursor before recording so it glides in from a natural spot.
  const start = { x: vp.width * 0.62, y: vp.height * 0.78 };
  if (!M) await page.mouse.move(start.x, start.y);
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  await page.waitForTimeout(150);
  const t0 = Date.now() / 1000;
  if (act.type === 'scroll') {
    await page.evaluate(([dy, ms]) => window.__scroll(dy, ms), [act.dy, SHOT_MS]);
  } else if (act.type === 'hover') {
    const cta = await page.evaluate(() => window.__cta());
    if (cta) {
      if (M) await page.waitForTimeout(650); else await glide(page, start, cta, 650); // phones: a tap, no cursor
      await page.evaluate(({ x, y }) => window.__ripple(x, y), cta);
      if (act.click) await page.mouse.click(cta.x, cta.y);
      await page.waitForTimeout(200);
      await page.evaluate(([dy, ms]) => window.__scroll(dy, ms), [act.dy, SHOT_MS - 900]);
    } else await page.evaluate(([dy, ms]) => window.__scroll(dy, ms), [act.dy, SHOT_MS]);
    console.log(slug, 'cta', cta?.t ?? '(none)');
  } else if (act.type === 'ui') {
    const rows = await page.evaluate(sel => window.__rows(sel), act.rows);
    if (!M && rows.length) {
      let at = start;
      const pick = rows.slice(0, 3);
      for (const r of pick) { await glide(page, at, r, 380); at = r; }
      await page.evaluate(({ x, y }) => window.__ripple(x, y), at);
      await page.mouse.down(); await page.mouse.up(); // real click (recreated UIs are local, nothing navigates)
      if (act.dy) await page.evaluate(([dy, ms]) => window.__scroll(dy, ms), [act.dy, 450]);
    } else await page.evaluate(([dy, ms]) => window.__scroll(dy, ms), [act.dy ?? 400, SHOT_MS]);
    console.log(slug, 'rows', rows.length);
  }
  const left = SHOT_MS + 250 - (Date.now() / 1000 - t0) * 1000;
  if (left > 0) await page.waitForTimeout(left);
  await cdp.send('Page.stopScreencast');
  frames.forEach((f, i) => writeFileSync(`${dir}/${String(i).padStart(4, '0')}.jpg`, Buffer.from(f.data, 'base64')));
  writeFileSync(`${dir}/times.json`, JSON.stringify({ t0, w: W, h: H, times: frames.map(f => f.t) }));
  console.log(slug, mode, frames.length, 'frames', W + 'x' + H);
  await ctx.close();
}
await browser.close();
