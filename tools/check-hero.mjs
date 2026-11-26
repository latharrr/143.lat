// Asserts the hero rest state: no card/pill box overlaps a headline glyph line, and the lead + CTAs
// sit inside the first viewport. node tools/check-hero.mjs <w> <h> [url]
import { chromium } from 'playwright-core';
const [w, h, url = 'http://localhost:3000'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(3200); // intro done
const r = await p.evaluate(() => {
  const box = e => { const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
  const h1 = document.querySelector('.hero-title');
  const range = document.createRange(); range.selectNodeContents(h1);
  // glyph boxes: one rect per split char (SplitText) or per text line
  const chars = [...h1.querySelectorAll('div div, div > span')].filter(e => e.textContent.trim().length === 1);
  const glyphs = (chars.length ? chars.map(box) : [...range.getClientRects()].map(x => ({ l: x.left, t: x.top, r: x.right, b: x.bottom })));
  const hit = (a, c) => a.l < c.r && a.r > c.l && a.t < c.b && a.b > c.t;
  const things = [...document.querySelectorAll('.orb-card')].filter(e => getComputedStyle(e.closest('.orb-lift')).display !== 'none').map(e => ({ name: e.textContent.trim().slice(0, 18) || 'card', ...box(e) }));
  const lead = document.querySelector('.hero-lead'); const lr = document.createRange(); lr.selectNodeContents(lead);
  const centreBoxes = [...lr.getClientRects()].map(x => ({ l: x.left, t: x.top, r: x.right, b: x.bottom })).concat([...document.querySelectorAll('.hero-centre .btn')].map(box));
  const centre = box(document.querySelector('.hero-centre'));
  const overlapsHead = things.filter(t => glyphs.some(g => hit(t, g))).map(t => t.name);
  const overlapsCentre = things.filter(t => centreBoxes.some(c => hit(t, c))).map(t => t.name);
  const btns = [...document.querySelectorAll('.hero-centre .btn')].map(box);
  return { overlapsHead, overlapsCentre, centreBottom: Math.round(centre.b), ctaBottom: Math.round(Math.max(...btns.map(x => x.b))), vh: innerHeight, glyphs: glyphs.length };
});
console.log(w + 'x' + h, JSON.stringify(r));
await b.close();
process.exitCode = r.overlapsHead.length || r.overlapsCentre.length || r.ctaBottom > r.vh ? 1 : 0;
