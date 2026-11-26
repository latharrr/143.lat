// Crawl every page in the sitemap of a running build, collect every <a href> and <img>/<source> URL, check each returns 200.
// Usage: node tools/links.mjs [base=http://localhost:3144]
const base = process.argv[2] ?? 'http://localhost:3144';
const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130 Safari/537.36' };
const sm = await (await fetch(base + '/sitemap.xml')).text();
const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
const links = new Map(); // url -> first page seen on
for (const p of pages) {
  const html = await (await fetch(base + p)).text();
  for (const [, u] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(u) || u.includes('/_next/')) continue;
    // Canonical/og URLs point at the production domain; check the same path on this build instead.
    const abs = u.startsWith('http') ? u.replace(/^https:\/\/143\.lat/, base) : new URL(u.replace(/&amp;/g, '&'), base).href;
    if (!links.has(abs)) links.set(abs, p);
  }
}
const bad = [], ok = [], blocked = [];
await Promise.all([...links].map(async ([u, from]) => {
  try {
    let r = await fetch(u, { method: 'GET', redirect: 'follow', headers: UA, signal: AbortSignal.timeout(25000) });
    // LinkedIn answers bots with 999 regardless of the URL; report it separately.
    if (r.status === 999 && u.includes('linkedin.com')) blocked.push(`999 ${u} (bot block)`);
    else (r.status === 200 ? ok : bad).push(`${r.status} ${u} (on ${from})`);
  } catch (e) { bad.push(`ERR ${u} (on ${from}) ${e.message}`); }
}));
console.log(`${pages.length} pages, ${links.size} unique URLs, ${ok.length} ok, ${bad.length} bad, ${blocked.length} bot-blocked`);
blocked.forEach(b => console.log('  ' + b));
bad.forEach(b => console.log('  ' + b));
console.log(ok.filter(o => !o.includes(base)).map(o => '  ' + o.split(' (')[0]).sort().join('\n'));
