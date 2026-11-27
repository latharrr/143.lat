// Asserts the hero card rules at one viewport: no card (its rotated on-screen box) inside the safe zone (eyebrow,
// headline, subline, CTAs + 32 px), no card on another card, no duplicate tags, no card cropped beyond a 15% edge
// bleed, no horizontal page scroll. Checked at rest and with the mouse in two opposite corners (max parallax), and
// after a hover. node tools/check-hero.mjs <w> <h> [url] [--shot file.png]
import { chromium } from 'playwright-core';
const args = process.argv.slice(2);
const shot = args.includes('--shot') ? args[args.indexOf('--shot') + 1] : null;
const [w, h, url = 'http://localhost:3000'] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--shot');
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(3400); // intro done
const measure = () => p.evaluate(() => {
  const box = r => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
  // Headline: its line boxes (line-height 0.9) hold the cap glyphs; the text range would add the font's empty descender area.
  const pad = (x, d) => ({ l: x.l - d, t: x.t - d, r: x.r + d, b: x.b + d });
  const hit = (a, c) => a.l < c.r && a.r > c.l && a.t < c.b && a.b > c.t;
  const text = el => { const g = document.createRange(); g.selectNodeContents(el); const rs = [...g.getClientRects()].filter(r => r.width); return { l: Math.min(...rs.map(r => r.left)), t: Math.min(...rs.map(r => r.top)), r: Math.max(...rs.map(r => r.right)), b: Math.max(...rs.map(r => r.bottom)) }; };
  const safe = { eyebrow: box(document.querySelector('.hero-eyebrow').getBoundingClientRect()), headline: box(document.querySelector('.hero-title').getBoundingClientRect()), subline: text(document.querySelector('.hero-lead')), ctas: box(document.querySelector('.btn-row').getBoundingClientRect()) };
  const cards = [...document.querySelectorAll('.hc, .hr')].filter(a => a.offsetParent).map(a => ({ name: a.querySelector('.hc-name').textContent, tag: a.querySelector('.hc-tag').textContent, row: a.classList.contains('hr'), ...box(a.querySelector('.hc-card').getBoundingClientRect()) }));
  const bad = [];
  for (const c of cards) {
    for (const [k, s] of Object.entries(safe)) {
      if (hit(c, s)) bad.push(`${c.name} overlaps ${k}`);
      else if (!c.row && hit(c, pad(s, 32))) bad.push(`${c.name} inside ${k} + 32px`);
    }
    if (!c.row) {
      const bw = (c.r - c.l) * 0.15, bh = (c.b - c.t) * 0.15;
      if (c.l < -bw - 0.5 || c.r > innerWidth + bw + 0.5 || c.b > innerHeight + bh + 0.5 || c.t < 0) bad.push(`${c.name} cropped beyond 15%`);
    }
  }
  const flat = cards.filter(c => !c.row);
  flat.forEach((a, i) => flat.slice(i + 1).forEach(c => hit(a, c) && bad.push(`${a.name} overlaps ${c.name}`)));
  const tags = cards.filter(c => !c.row).map(c => c.tag);
  const dup = tags.filter((t, i) => tags.indexOf(t) !== i);
  if (dup.length) bad.push('duplicate tags ' + dup.join(', '));
  if (document.documentElement.scrollWidth > innerWidth) bad.push('horizontal scroll ' + document.documentElement.scrollWidth);
  return { k: getComputedStyle(document.querySelector('.hero-cards')).getPropertyValue('--k'), cards: cards.length, tags, bad };
});
const out = { rest: await measure() };
if (+w >= 768) {
  for (const [n, x, y] of [['tl', 2, 2], ['br', +w - 2, +h - 2]]) { await p.mouse.move(x, y, { steps: 4 }); await p.waitForTimeout(1300); out[n] = (await measure()).bad; }
  const first = p.locator('.hc').first(); await first.hover({ force: true }); await p.waitForTimeout(700); out.hover = (await measure()).bad;
  await p.mouse.move(+w / 2, +h - 2); await p.waitForTimeout(900);
}
if (shot) await p.screenshot({ path: shot });
const bad = [...out.rest.bad, ...(out.tl ?? []), ...(out.br ?? []), ...(out.hover ?? [])];
console.log(`${w}x${h}`, JSON.stringify({ k: out.rest.k, cards: out.rest.cards, tags: out.rest.tags.join('/'), bad: [...new Set(bad)] }));
await b.close();
process.exitCode = bad.length ? 1 : 0;
