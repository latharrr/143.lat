'use client';
// 1. HERO — orbit stage. Pinned 200vh (150vh on phones), scrubbed (scrub 1).
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, useSplitReveal, usePinScenes, isReduced, isMobile, px, EASE } from '@/lib/motion';
import { AUDIENCES, CONTACT } from '@/content/site';
import { ORBIT_CARDS } from '@/content/work';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { Magnetic } from '@/components/ui/Magnetic';
import { Clay, ClayItem } from '@/components/clay/Clay';

const RINGS = [18, 30, 42, 54, 66];
// Polar slots around the ring centre (50%, 80%): r in vmax, a in degrees (-90 = straight up).
// Desktop and phone sets were solved from target positions so nothing covers the headline or CTAs at rest.
type Slot = { r: number; a: number; rm: number; am: number; speed: number; tilt: number; dir: 1 | -1 };
const SLOTS: Slot[] = [
  { r: 48.5, a: -156.4, rm: 31.2, am: -120.9, speed: 1.1, tilt: -6, dir: 1 },
  { r: 48.5, a: -23.6, rm: 31.2, am: -59.1, speed: 0.8, tilt: 5, dir: -1 },
  { r: 34.5, a: -170.7, rm: 24.4, am: -90, speed: 1.5, tilt: -4, dir: 1 },
  { r: 34.5, a: -9.3, rm: 16.5, am: -142, speed: 0.6, tilt: 7, dir: 1 },
  { r: 21.8, a: 163.3, rm: 16.5, am: -38, speed: 1.3, tilt: -7, dir: -1 },
  { r: 21.8, a: 16.7, rm: 4, am: 90, speed: 0.9, tilt: 4, dir: 1 },
  { r: 43.2, a: 168.9, rm: 0, am: 0, speed: 1.6, tilt: 6, dir: -1 },
  { r: 43.2, a: 11.1, rm: 0, am: 0, speed: 1.2, tilt: -3, dir: -1 },
  { r: 9, a: 90, rm: 0, am: 0, speed: 0.7, tilt: 3, dir: 1 },
  { r: 47.5, a: -6.7, rm: 0, am: 0, speed: 1.4, tilt: -5, dir: -1 },
];
const PILLS = [
  { label: 'Shopify', r: 30.4, a: -152.9, rm: 33, am: -103.5, speed: 1.2 },
  { label: 'n8n', r: 31.5, a: -22, rm: 19.7, am: -55.1, speed: 0.9 },
  { label: 'AI Agent', r: 11.5, a: 166, rm: 17.2, am: 178.4, speed: 1.4 },
  { label: 'WhatsApp', r: 11.5, a: 14, rm: 17.2, am: 1.6, speed: 0.7 },
  { label: '3D', r: 41.8, a: -158.6, rm: 33.2, am: -75.5, speed: 1.0 },
  { label: 'SEO', r: 41.8, a: -21.4, rm: 14.9, am: -90, speed: 1.3 },
];
const vars = (r: number, a: number, rm: number, am: number, tilt = 0) => ({
  style: { '--r': `${r}vmax`, '--a': `${a}deg`, '--rm': `${rm}vmax`, '--am': `${am}deg`, '--t': `${tilt}deg` } as React.CSSProperties,
  'data-r': r, 'data-a': a, 'data-rm': rm, 'data-am': am,
});
const CLAY: ClayItem[] = [
  { kind: 'knot', at: [-0.4, 0.3], size: 0.085, drift: 45, bob: 5, tilt: [0.5, 0.3, 0.2] },
  { kind: 'flower', at: [0.43, -0.12], size: 0.095, drift: 60, bob: 4.4, tilt: [0.35, -0.5, 0.2] },
  { kind: 'blob', at: [-0.42, -0.3], size: 0.075, drift: 30, bob: 5.6 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const progress = useRef(0);

  // Rest layout: slots are starting points; push each card/pill outward along its ring until it clears
  // the headline glyph lines and the lead + CTAs. Runs before SplitText so text boxes are untransformed.
  useGSAP(() => {
    const hero = root.current!;
    const solve = () => {
      const mobile = isMobile();
      const vmax = Math.max(innerWidth, innerHeight) / 100;
      const keep: DOMRect[] = [];
      const range = document.createRange();
      const addText = (el: Element | null) => {
        if (!el) return;
        el.childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent!.trim()) { range.selectNodeContents(n); keep.push(...range.getClientRects()); } });
      };
      addText(hero.querySelector('.hero-title'));
      addText(hero.querySelector('.hero-lead'));
      hero.querySelectorAll('.hero-centre .btn, .hero-eyebrow').forEach(b => keep.push(b.getBoundingClientRect()));
      const pad = 12;
      hero.querySelectorAll<HTMLElement>('.orb-arm').forEach(arm => {
        const lift = arm.closest<HTMLElement>('.orb-lift')!;
        if (getComputedStyle(lift).display === 'none') return;
        const base = parseFloat(arm.dataset[mobile ? 'rm' : 'r']!);
        const ang = (parseFloat(arm.dataset[mobile ? 'am' : 'a']!) * Math.PI) / 180;
        const thing = arm.querySelector<HTMLElement>('.orb-card, .orb-pill')!;
        const w = thing.offsetWidth / 2 + pad, h = thing.offsetHeight / 2 + pad;
        const c = arm.querySelector('.orb-pos')!.parentElement!.getBoundingClientRect(); // ring centre
        let r = base;
        for (let i = 0; i < 60; i++) {
          const x = c.left + Math.cos(ang) * r * vmax, y = c.top + Math.sin(ang) * r * vmax;
          if (!keep.some(k => x - w < k.right && x + w > k.left && y - h < k.bottom && y + h > k.top)) break;
          r += 1;
        }
        arm.style.setProperty(mobile ? '--rm' : '--r', `${r}vmax`);
      });
    };
    solve();
    let t = 0;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(solve, 150); };
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, { scope: root });

  // Intro: chars rise from a mask, then cards pop in.
  useSplitReveal(h1, { type: 'chars', stagger: 0.03, duration: 1.1, onScroll: false, delay: 0.1 });
  useGSAP(() => {
    if (isReduced()) return;
    gsap.fromTo('.orb-card, .orb-pill', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'back.out(1.6)', delay: 0.7 });
    gsap.fromTo('.hero-eyebrow, .hero-rings', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: EASE.reveal, delay: 0.4 });
    gsap.fromTo('.hero-centre > *', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: EASE.reveal, delay: 0.5 });
    // Audience ticker: vertical slot roll, 2.2s per word, seamless loop via a duplicated first word.
    const list = root.current!.querySelector<HTMLElement>('.tick-list')!;
    const n = AUDIENCES.length;
    const roll = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= n; i++) roll.to(list, { yPercent: (-100 * i) / (n + 1), duration: 0.6, ease: EASE.move }, `+=${i === 1 ? 1.6 : 1.6}`);
    roll.set(list, { yPercent: 0 });
  }, { scope: root });

  usePinScenes(root, 2, tl => {
    const k = px();
    tl.to('.hero-head', { scale: 0.92, opacity: 0.25, y: () => -0.15 * innerHeight, duration: 1 }, 0)
      .to('.hero-centre', { y: () => -0.15 * innerHeight, duration: 1 }, 0);
    gsap.utils.toArray<HTMLElement>('.orb-lift', root.current).forEach(el => {
      const speed = Number(el.dataset.speed);
      tl.to(el, { y: () => -speed * 0.55 * innerHeight * k, duration: 1 }, 0);
    });
    gsap.utils.toArray<HTMLElement>('.orb-arm', root.current).forEach(el => {
      const dir = Number(el.dataset.dir || 1);
      const card = el.querySelector<HTMLElement>('.orb-spin')!;
      tl.to(el, { rotation: `+=${20 * dir}`, duration: 1 }, 0);
      tl.to(card, { rotation: `+=${-20 * dir + 8 * dir}`, duration: 1 }, 0);
    });
    CLAY.forEach(c => tl.to(`.clay-png[data-clay="${c.kind}"]`, { y: () => -(c.drift ?? 0) / 100 * innerHeight * k, duration: 1 }, 0));
  }, { vhPerScene: 100, onUpdate: p => (progress.current = p) });

  return (
    <section ref={root} className="hero dark" aria-labelledby="hero-title">
      <svg className="hero-rings" viewBox="-100 -100 200 200" aria-hidden>
        {RINGS.map(r => <circle key={r} r={r} />)}
      </svg>

      <div className="hero-top">
      <div className="hero-head">
        <p className="hero-eyebrow" aria-label={`Built for ${AUDIENCES.join(', ')}`}>
          <span aria-hidden>Built for</span>
          <span className="tick" aria-hidden>
            <span className="tick-list">
              {[...AUDIENCES, AUDIENCES[0]].map((w, i) => <span key={i}>{w}</span>)}
            </span>
          </span>
        </p>
        <h1 id="hero-title" ref={h1} className="hero-title intro-hide">
          Websites that<br /> work for you
        </h1>
      </div>

      <div className="hero-centre">
        <p className="hero-lead">Websites, automations and AI agents that save time and bring revenue.</p>
        <div className="btn-row">
          <Magnetic><a className="btn btn-lav" href={CONTACT.cal} target="_blank" rel="noopener">Book a free call</a></Magnetic>
          <Magnetic><a className="btn btn-ghost" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp me</a></Magnetic>
        </div>
      </div>
      </div>

      <div className="orbit" aria-hidden>
        {ORBIT_CARDS.map((c, i) => {
          const s = SLOTS[i];
          return (
            <div key={c.name} className={`orb-lift ${i > 5 ? 'orb-desk' : ''}`} data-speed={s.speed}>
              <div className="orb-arm" data-dir={s.dir} {...vars(s.r, s.a, s.rm, s.am, s.tilt)}>
                <div className="orb-pos">
                  <div className="orb-spin">
                    <figure className={`orb-card ${c.tall ? 'is-tall' : ''}`} data-cursor="View">
                      {c.video ? <LazyVideo name={c.media} /> : (
                        <Image src={`/media/${c.media}.jpg`} alt="" fill sizes="220px" />
                      )}
                      <figcaption>{c.name}</figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {PILLS.map(p => (
          <div key={p.label} className="orb-lift" data-speed={p.speed}>
            <div className="orb-arm" {...vars(p.r, p.a, p.rm, p.am)}>
              <div className="orb-pos">
                <div className="orb-spin">
                  <span className="orb-pill">{p.label}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Clay items={CLAY} progress={progress} className="hero-clay" />
    </section>
  );
}
