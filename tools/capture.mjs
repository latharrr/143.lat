// Tall screenshot of a live site for pan loops: node tools/capture.mjs <name> <url> [w=1280] [h=2400]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const [name, url, w = 1280, h = 2400] = process.argv.slice(2);
mkdirSync('.ref/rec', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: +w, height: 800 }, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForTimeout(2500);
await page.screenshot({ path: `.ref/rec/${name}-top.png` });
// scroll through so lazy/reveal content loads, then return
for (let y = 0; y < +h; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(250); }
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800);
await page.setViewportSize({ width: +w, height: +h }); await page.waitForTimeout(1500);
await page.screenshot({ path: `.ref/rec/${name}-tall.png` });
await browser.close(); console.log(name, 'ok');
