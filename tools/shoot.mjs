// Usage: node tools/shoot.mjs <url> <outPrefix> <width> <height> [scrollSteps=6] [reducedMotion=0]
import { chromium } from 'playwright-core';
const [url, out, w = 1440, h = 900, steps = 6, rm = 0] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, reducedMotion: +rm ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => m.type() === 'error' && errors.push(m.text()));
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => errors.push('goto ' + e.message));
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let i = 0; i < +steps; i++) {
  const y = Math.round((total - +h) * i / Math.max(1, +steps - 1));
  await page.mouse.wheel(0, i === 0 ? 0 : y - (await page.evaluate(() => scrollY)));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${out}-${String(i).padStart(2, '0')}.png` });
}
console.log(JSON.stringify({ total, errors: errors.slice(0, 10) }));
await browser.close();
