// Bakes public/clay/{blob,flower,knot}.webp from the dev server: node tools/clay-png.mjs [base=http://localhost:3000]
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const base = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
for (const k of ['blob', 'flower', 'knot']) {
  await page.goto(`${base}/clay-render?k=${k}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html,body{background:transparent!important} body>*:not(main),.hdr,.foot,.cursor{display:none!important}' });
  await page.waitForTimeout(1500);
  await sharp(await page.locator('#clay-render canvas').screenshot({ omitBackground: true })).webp({ quality: 86, alphaQuality: 90, effort: 6 }).toFile(`public/clay/${k}.webp`);
  console.log(k);
}
await browser.close();
