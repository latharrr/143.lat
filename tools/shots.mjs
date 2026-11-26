// Fresh screenshots of every project into public/work/<slug>/{desktop,mobile}.webp (2x DPR, viewport only).
// Usage: node tools/shots.mjs [slug ...]   Recreated UIs need `npm run dev` (BASE, default http://localhost:3143).
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3143';
const LIVE = {
  'tulips-oven': 'https://www.tulipsoven.com',
  gapl: 'https://gapl.vercel.app',
  proofmart: 'https://proofmart.shop',
  yourprofessionals: 'https://www.yourprofessionals.in',
  'picapool-acquisition-campaign': 'https://plan.picapool.tech',
  'rumour-mill': 'https://clg.143.lat',
  spraykart: 'https://www.spraykart.com',
};
const RECREATED = ['picapool-crm-automation', 'picapool-ai-data-analyst', 'linkedin-autopilot'];
const CAPTURE_SLUG = { 'picapool-crm-automation': 'picapool-crm', 'picapool-ai-data-analyst': 'picapool-ai-analyst', 'linkedin-autopilot': 'linkedin-autopilot' };
const only = process.argv.slice(2);
const want = s => !only.length || only.includes(s);

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--hide-scrollbars'] });

async function dismiss(page) {
  const btn = page.locator('button, a, [role=button]').filter({ hasText: /^\s*(accept( all)?( cookies)?|allow( all)?|agree|i agree|got it|ok(ay)?)\s*$/i });
  for (const b of await btn.all()) if (await b.isVisible().catch(() => false)) { await b.click({ timeout: 1500 }).catch(() => {}); await page.waitForTimeout(500); break; }
  // Chat bubbles and promo pop-ups cover content in a still.
  await page.keyboard.press('Escape').catch(() => {});
}

async function shot(url, out, mobile) {
  const ctx = await browser.newContext(mobile
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: IPHONE }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(4000); // intro animations settle
  await dismiss(page);
  await page.waitForTimeout(800);
  const buf = await page.screenshot();
  await ctx.close();
  // Desktop 1920x1200 (16:10, top), mobile 780x1688.
  const img = mobile ? sharp(buf).resize(780, 1688, { fit: 'cover', position: 'top' }) : sharp(buf).resize(1920, 1200, { fit: 'cover', position: 'top' });
  await img.webp({ quality: 84, effort: 6 }).toFile(out);
  console.log('saved', out);
}

for (const [slug, url] of Object.entries(LIVE)) {
  if (!want(slug)) continue;
  mkdirSync(`public/work/${slug}`, { recursive: true });
  await shot(url, `public/work/${slug}/desktop.webp`, false);
  await shot(url, `public/work/${slug}/mobile.webp`, true);
}
for (const slug of RECREATED) {
  if (!want(slug)) continue;
  mkdirSync(`public/work/${slug}`, { recursive: true });
  await shot(`${BASE}/capture/${CAPTURE_SLUG[slug]}`, `public/work/${slug}/desktop.webp`, false);
}
// SangSafar: staging screenshots from its own verification pass (~/Desktop/Sangsafar/docs/screenshots).
if (want('sangsafar')) {
  const src = `${process.env.HOME}/Desktop/Sangsafar/docs/screenshots`;
  mkdirSync('public/work/sangsafar', { recursive: true });
  const d = sharp(`${src}/04-discover-1280.png`), m = sharp(`${src}/04-discover-390.png`);
  const dm = await d.metadata(), mm = await m.metadata();
  console.log('sangsafar sources', dm.width, dm.height, mm.width, mm.height);
  await d.resize(1920, 1200, { fit: 'cover', position: 'top' }).webp({ quality: 84 }).toFile('public/work/sangsafar/desktop.webp');
  await m.resize(780, 1688, { fit: 'cover', position: 'top' }).webp({ quality: 84 }).toFile('public/work/sangsafar/mobile.webp');
}
await browser.close();
