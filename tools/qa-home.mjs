// QA shots of every homepage section this brief touches. Usage: node tools/qa-home.mjs [base] [outDir] [w h] [rm]
// Writes <w>-<tag>-<section>.png and prints console errors + layout shift.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const [base = 'http://localhost:3143', out = '.ref/qa', W = '1440', H = '900', RM = '0'] = process.argv.slice(2);
const w = +W, h = +H, rm = RM === '1';
mkdirSync(out, { recursive: true });
const tag = `${w}${rm ? '-rm' : ''}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--hide-scrollbars'] });
const mobile = w < 768;
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, reducedMotion: rm ? 'reduce' : 'no-preference', isMobile: mobile, hasTouch: mobile });
const errors = [];
page.on('pageerror', e => errors.push(`pageerror ${e.message}`));
page.on('console', m => (m.type() === 'error' || /hydrat/i.test(m.text())) && errors.push(`console ${m.text().slice(0, 240)}`));
await page.addInitScript(() => {
  window.__cls = 0;
  new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) { window.__cls += e.value; if (e.value > 0.01) (window.__big ??= []).push([+e.value.toFixed(3), Math.round(scrollY), ...(e.sources || []).slice(0, 2).map(s => s.node?.className?.toString?.().slice(0, 40) || s.node?.nodeName)]); } }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto(base + '/', { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
await page.waitForTimeout(2500);
const shot = name => page.screenshot({ path: `${out}/${tag}-${name}.png` });
await shot('hero');
const scrollTo = async y => {
  for (let i = 0; i < 60; i++) {
    const cur = await page.evaluate(() => scrollY);
    if (Math.abs(cur - y) < 4) break;
    if (mobile) await page.evaluate(d => scrollBy(0, d), Math.max(-900, Math.min(900, y - cur)));
    else await page.mouse.wheel(0, Math.max(-1200, Math.min(1200, y - cur)));
    await page.waitForTimeout(110);
  }
  await page.waitForTimeout(1300);
};
const top = sel => page.evaluate(s => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().top + scrollY : null; }, sel);
const m = await top('.manifesto'); if (m != null) { await scrollTo(m - h * 0.25); await shot('manifesto'); }
const sc = await top('.showcase');
if (sc != null) {
  if (!mobile && !rm) for (const [k, f] of [[0, 0.1], [1, 0.75], [2, 1.0], [3, 2.0], [4, 3.0]]) { await scrollTo(sc + f * h); await shot(`stack-${k}`); }
  else for (let k = 0; k < 4; k++) { const t = await page.evaluate(i => { const e = document.querySelectorAll('.sc-scene')[i]; return e ? e.getBoundingClientRect().top + scrollY : null; }, k); if (t != null) { await scrollTo(t - 60); await shot(`stack-${k}`); } }
}
const sl = await top('.slist');
if (sl != null) {
  await scrollTo(sl + 0.2 * h); await shot('list');
  if (!mobile) for (const i of [0, 4, 7]) { await page.locator('.sl-item').nth(i).hover().catch(() => {}); await page.waitForTimeout(900); await shot(`list-hover-${i}`); }
}
const wk = await top('.work');
if (wk != null) {
  await scrollTo(wk + 4); await page.waitForTimeout(1500); await shot('work');
  if (!mobile) { await page.locator('.wc-nav button').nth(1).click(); await page.waitForTimeout(1600); await shot('work-next'); }
}
const pr = await top('.pricing'); if (pr != null) { await scrollTo(pr - 20); await shot('pricing'); }
const pf = await top('.proof'); if (pf != null) { await scrollTo(pf - 20); await page.waitForTimeout(1500); await shot('proof'); if (!mobile) { await page.locator('.logo-row a').nth(1).hover(); await page.waitForTimeout(600); await shot('proof-hover'); } }
console.log(JSON.stringify({ tag, cls: await page.evaluate(() => window.__cls), big: await page.evaluate(() => (window.__big || []).slice(0, 12)), errors: errors.slice(0, 8) }));
await browser.close();
