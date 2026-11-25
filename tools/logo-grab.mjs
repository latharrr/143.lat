// Prints the outerHTML of the first header logo (svg or img src) on a page: node tools/logo-grab.mjs <url>
import { chromium } from 'playwright-core';
const url = process.argv[2];
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ ignoreHTTPSErrors: true });
await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('ERR', e.message));
const out = await p.evaluate(() => {
  const root = document.querySelector('header, nav') || document.body;
  const a = root.querySelector('a[href="/"], a[href="./"], a[aria-label*="home" i], [class*="logo" i]') || root;
  const svg = a.querySelector('svg'); const img = a.querySelector('img');
  return { title: document.title, svg: svg ? svg.outerHTML : null, img: img ? img.currentSrc || img.src : null, text: a.textContent.trim().slice(0, 40) };
});
console.log(JSON.stringify(out));
await b.close();
