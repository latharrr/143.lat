'use client';
// Hero project cards: looping screen recordings (tools/cards.mjs + tools/cards-build.py, public/cards/).
// Desktop: 8 hand-placed cards, 3 per side + 2 below the CTAs. The composition is fixed (base units below); `place()`
// scales it as one piece (--k) to the largest size at which no card, at its rotated size plus 12px parallax and the
// 1.04 hover, enters the safe zone (eyebrow, headline, subline, CTAs + 32px) or touches another card.
// Phones: a swipeable row of 4 portrait cards under the CTAs that pans by itself and pauses on touch.
// Video: <Clip> + useClips (components/ui/Clip.tsx), called from Hero.tsx.
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { getProject, projectLink } from '@/content/work';
import { Clip } from '@/components/ui/Clip';

type Kind = 'land' | 'port';
// x, y: top-left in base px (landscape 300x190, portrait 170x300) inside its group; side groups are measured from the
// outer viewport edge (negative x = bleed past it: ~10% at rest, under 15% at full parallax), the bottom pair from the
// centre line. d = parallax depth 1..3 (4 / 8 / 12 px); the edge cards sit on the slowest layer.
type Card = { slug: string; name: string; tag: string; kind: Kind; group: 'L' | 'R' | 'B'; x: number; y: number; rot: number; d: 1 | 2 | 3 };
export const CARDS: Card[] = [
  { slug: 'spraykart', name: 'Spraykart', tag: 'Shopify', kind: 'port', group: 'L', x: -9, y: 34, rot: -4, d: 1 },
  { slug: 'tulips-oven', name: 'Tulip’s Oven', tag: 'Website', kind: 'land', group: 'L', x: 192, y: 0, rot: 3, d: 2 },
  { slug: 'proofmart', name: 'ProofMart', tag: 'API', kind: 'land', group: 'L', x: 208, y: 222, rot: -2, d: 3 },
  { slug: 'picapool-acquisition-campaign', name: 'Picapool campaign', tag: 'Growth', kind: 'port', group: 'R', x: -9, y: 22, rot: 4, d: 1 },
  { slug: 'gapl', name: 'Gapl', tag: 'SaaS', kind: 'land', group: 'R', x: 194, y: 6, rot: -3, d: 2 },
  { slug: 'yourprofessionals', name: 'YourProfessionals', tag: 'SEO', kind: 'land', group: 'R', x: 208, y: 230, rot: 2, d: 3 },
  { slug: 'linkedin-autopilot', name: 'LinkedIn autopilot', tag: 'AI Agent', kind: 'land', group: 'B', x: -322, y: 0, rot: 3, d: 2 },
  { slug: 'rumour-mill', name: 'Beyond the Rumour Mill', tag: 'Web App', kind: 'land', group: 'B', x: 22, y: 8, rot: -3, d: 2 },
];
const ROW = ['tulips-oven', 'gapl', 'spraykart', 'rumour-mill'];
const SIZE = { land: [300, 190], port: [170, 300] } as const;
const NAME = Object.fromEntries(CARDS.map(c => [c.slug, c]));

const PAD = 32, PARALLAX = 12, HOVER = 1.04, GAP = 16, BLEED = 0.15;

function CardLink({ slug, className, style, children }: { slug: string; className: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const p = getProject(slug), l = projectLink(p), c = NAME[slug];
  const props = { className, style, 'aria-label': `${c.name} (${c.tag}): ${l.label}`, 'data-cursor': 'View' };
  return l.external
    ? <a href={l.href} target="_blank" rel="noopener" {...props}>{children}</a>
    : <Link href={l.href} {...props}>{children}</Link>;
}

const Face = ({ c, kind }: { c: Card; kind: Kind }) => (
  <span className={`hc-card is-${kind}`}>
    <Clip kind={kind} slug={c.slug} />
    <span className="hc-tag">{c.tag}</span>
    <span className="hc-name">{c.name}</span>
  </span>
);

export function HeroCards() {
  return (
    <div className="hero-cards" aria-label="Selected projects">
      {CARDS.map((c, i) => (
        <CardLink key={c.slug} slug={c.slug} className={`hc hc-${c.group}`} style={{ ['--r' as string]: `${c.rot}deg`, ['--i' as string]: i }}>
          <span className="hc-par" data-d={c.d}><Face c={c} kind={c.kind} /></span>
        </CardLink>
      ))}
    </div>
  );
}

export function HeroRow() {
  const row = useRef<HTMLDivElement>(null);
  // Auto-pan: drifts to the end and back (no duplicated cards, so no duplicate videos). Touch pauses it; it resumes
  // 2.5 s after the last touch from wherever the finger left it.
  useEffect(() => {
    const el = row.current!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, dir = 1, hold = 0, last = 0, on = false, pos = 0;
    const step = (t: number) => {
      const dt = last ? Math.min(50, t - last) : 16; last = t;
      const max = el.scrollWidth - el.clientWidth;
      if (on && t > hold && max > 0) {
        pos += dir * dt * 0.025; // 25 px/s
        if (pos >= max) { pos = max; dir = -1; hold = t + 1200; } else if (pos <= 0) { pos = 0; dir = 1; hold = t + 1200; }
        el.scrollLeft = pos;
      } else pos = el.scrollLeft;
      raf = requestAnimationFrame(step);
    };
    const pause = () => { hold = Infinity; };
    const resume = () => { hold = performance.now() + 2500; };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; });
    io.observe(el);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);
    el.addEventListener('touchcancel', resume);
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', resume);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener('touchstart', pause); el.removeEventListener('touchend', resume); el.removeEventListener('touchcancel', resume);
      el.removeEventListener('pointerdown', pause); el.removeEventListener('pointerup', resume);
    };
  }, []);
  return (
    <div ref={row} className="hero-row" aria-label="Selected projects">
      {ROW.map(s => (
        <CardLink key={s} slug={s} className="hr"><Face c={NAME[s]} kind="port" /></CardLink>
      ))}
    </div>
  );
}

// ---------- layout ----------
type Box = { l: number; t: number; r: number; b: number };
const hit = (a: Box, b: Box) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
/** Layout box relative to `root`: offsets, so transforms (intro, scroll) and scroll position never skew it. */
function layoutBox(el: HTMLElement, root: HTMLElement): Box {
  let l = 0, t = 0, e: HTMLElement | null = el;
  while (e && e !== root) { l += e.offsetLeft; t += e.offsetTop; e = e.offsetParent as HTMLElement | null; }
  return { l, t, r: l + el.offsetWidth, b: t + el.offsetHeight };
}

/** Computes --k and each card's position; returns the boxes it used (for QA). Desktop only. */
export function placeCards(hero: HTMLElement) {
  const wrap = hero.querySelector<HTMLElement>('.hero-cards')!;
  const W = hero.clientWidth, H = hero.clientHeight;
  const pad = (b: Box): Box => ({ l: b.l - PAD, t: b.t - PAD, r: b.r + PAD, b: b.b + PAD });
  const safe = ['.hero-eyebrow', '.hero-title', '.hero-lead', '.btn-row'].map(s => pad(layoutBox(hero.querySelector<HTMLElement>(s)!, hero)));
  const titleB = Math.max(safe[0].b, safe[1].b), ctaB = safe[3].b, cx = W / 2;
  const els = [...wrap.querySelectorAll<HTMLElement>('.hc')];

  const layout = (k: number) => CARDS.map(c => {
    const [w0, h0] = SIZE[c.kind], w = w0 * k, h = h0 * k;
    const a = Math.abs(c.rot * Math.PI / 180), rw = w * Math.cos(a) + h * Math.sin(a), rh = w * Math.sin(a) + h * Math.cos(a);
    const m = PARALLAX + Math.max(rw, rh) * (HOVER - 1) / 2; // parallax travel + hover growth
    const clear = (rh - h) / 2 + m; // rotated corners + m, so the card's outer box starts exactly at the anchor
    let x: number, y: number;
    if (c.group === 'B') { x = cx + c.x * k; y = ctaB + clear + c.y * k; }
    else {
      // Side groups: centred in the band between the safe zone and the bottom edge (top-aligned if it is tight).
      const groupH = Math.max(...CARDS.filter(o => o.group === c.group).map(o => (o.y + SIZE[o.kind][1]) * k));
      const top = titleB + 20 * k, y0 = top + Math.max(0, (H - top - groupH) / 2);
      y = Math.max(titleB + clear, y0 + c.y * k);
      x = c.group === 'L' ? c.x * k : W - c.x * k - w;
    }
    const mx = x + w / 2, my = y + h / 2;
    return { c, x, y, w, h, outer: { l: mx - rw / 2 - m, t: my - rh / 2 - m, r: mx + rw / 2 + m, b: my + rh / 2 + m }, vis: { l: mx - rw / 2, t: my - rh / 2, r: mx + rw / 2, b: my + rh / 2 } };
  });
  const ok = (L: ReturnType<typeof layout>, i: number) => {
    const p = L[i];
    if (safe.some(s => hit(p.outer, s))) return false;
    if (L.some((q, j) => j !== i && q.w && hit({ l: p.vis.l - GAP / 2, t: p.vis.t - GAP / 2, r: p.vis.r + GAP / 2, b: p.vis.b + GAP / 2 }, q.vis))) return false;
    const bw = (p.vis.r - p.vis.l) * BLEED, bh = (p.vis.b - p.vis.t) * BLEED;
    // Edge bleed at most 15%, with the parallax pushing the card outward.
    const t = p.c.d * 4; // this card's parallax travel
    return p.vis.l - t >= -bw && p.vis.r + t <= W + bw && p.vis.b + t <= H + bh && p.vis.t >= 0;
  };
  // Largest k (1 = the 1440x900 design size) at which every card fits. shortcut: below k 0.55 (narrow tablets) the
  // cards that still do not fit are hidden rather than shrunk further; phones use the row instead.
  let k = 1, L = layout(k);
  while (k > 0.55 && !L.every((_, i) => ok(L, i))) { k = +(k - 0.01).toFixed(2); L = layout(k); }
  const hidden = L.map((_, i) => !ok(L, i));
  wrap.style.setProperty('--k', String(k));
  L.forEach((p, i) => {
    const el = els[i];
    el.style.left = `${p.x}px`; el.style.top = `${p.y}px`;
    el.style.display = hidden[i] ? 'none' : '';
  });
  wrap.dataset.placed = '';
  return { k, safe, cards: L.map((p, i) => ({ slug: p.c.slug, ...p.vis, hidden: hidden[i] })) };
}
