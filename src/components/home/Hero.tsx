'use client';
// 1. HERO — headline, CTAs and 8 floating project cards that each loop a screen recording (HeroCards.tsx). No pin:
// as the hero scrolls away the cards drift outward and fade, the headline dims, the clay lags behind.
import { useRef } from 'react';
import { gsap, useGSAP, useSplitReveal, isReduced, isMobile, isTouch, px, EASE } from '@/lib/motion';
import { AUDIENCES, CONTACT } from '@/content/site';
import { Magnetic } from '@/components/ui/Magnetic';
import { Clay, ClayItem } from '@/components/clay/Clay';
import { useClips } from '@/components/ui/Clip';
import { HeroCards, HeroRow, placeCards } from './HeroCards';

const RINGS = [18, 30, 42, 54, 66];
// Outside the safe zone: knot and flower half off the outer edges beside the headline band (above the side cards), blob
// between the two cards under the CTAs. Negative drift: they lag the scroll (move down relative to the page), away from the CTAs.
const CLAY: ClayItem[] = [
  { kind: 'knot', at: [-0.5, 0.2], size: 0.085, drift: -18, bob: 5, tilt: [0.5, 0.3, 0.2] },
  { kind: 'flower', at: [0.5, 0.12], size: 0.095, drift: -22, bob: 4.4, tilt: [0.35, -0.5, 0.2] },
  { kind: 'blob', at: [0, -0.47], size: 0.075, drift: -14, bob: 5.6 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const progress = useRef(0);

  // Card layout first (layout boxes only, so the intro transforms below never skew it); again once fonts land and on resize.
  useGSAP(() => {
    const hero = root.current!;
    const place = () => { if (!isMobile()) placeCards(hero); };
    place();
    document.fonts?.ready.then(place);
    let t = 0;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(place, 120); };
    addEventListener('resize', onResize);
    return () => removeEventListener('resize', onResize);
  }, { scope: root });

  // Intro: chars rise from a mask, then the cards fade and scale in, 60 ms apart.
  useSplitReveal(h1, { type: 'chars', stagger: 0.03, duration: 1.1, onScroll: false, delay: 0.1 });
  useGSAP(() => {
    if (isReduced()) return;
    gsap.fromTo('.hc-par, .hero-row .hr', { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.06, ease: EASE.reveal, delay: 1.1 });
    gsap.fromTo('.hero-eyebrow, .hero-rings', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: EASE.reveal, delay: 0.4 });
    gsap.fromTo('.hero-centre > *', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: EASE.reveal, delay: 0.5 });
    // Audience ticker: vertical slot roll, 2.2s per word, seamless loop via a duplicated first word.
    const list = root.current!.querySelector<HTMLElement>('.tick-list')!;
    const n = AUDIENCES.length;
    const roll = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= n; i++) roll.to(list, { yPercent: (-100 * i) / (n + 1), duration: 0.6, ease: EASE.move }, '+=1.6');
    roll.set(list, { yPercent: 0 });

    // Mouse parallax: 3 depth layers, at most 12 px (the layout keeps 12 px clear of the safe zone for this).
    if (isMobile() || isTouch()) return;
    const layers = gsap.utils.toArray<HTMLElement>('.hc-par', root.current).map(el => {
      const d = Number(el.dataset.d) * 4;
      return { d, x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }) };
    });
    const onMove = (e: PointerEvent) => {
      const nx = Math.max(-1, Math.min(1, (e.clientX / innerWidth) * 2 - 1)), ny = Math.max(-1, Math.min(1, (e.clientY / innerHeight) * 2 - 1));
      layers.forEach(l => { l.x(-nx * l.d); l.y(-ny * l.d); });
    };
    addEventListener('pointermove', onMove, { passive: true });
    return () => removeEventListener('pointermove', onMove);
  }, { scope: root });

  // Scroll: over the hero's own height (no pin) the cards drift outward and fade, the headline dims, the clay lags.
  useGSAP(() => {
    if (isReduced()) return;
    const k = px();
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6, onUpdate: s => (progress.current = s.progress) },
    });
    tl.to('.hero-head', { opacity: 0.25, duration: 1 }, 0)
      .to('.hc-L', { x: () => -0.12 * innerWidth, y: () => 0.08 * innerHeight, autoAlpha: 0, duration: 1 }, 0)
      .to('.hc-R', { x: () => 0.12 * innerWidth, y: () => 0.08 * innerHeight, autoAlpha: 0, duration: 1 }, 0)
      .to('.hc-B', { x: (i: number) => (i ? 1 : -1) * 0.06 * innerWidth, y: () => 0.18 * innerHeight, autoAlpha: 0, duration: 1 }, 0)
      .to('.hero-row', { autoAlpha: 0, y: () => 0.06 * innerHeight, duration: 1 }, 0);
    CLAY.forEach(c => tl.to(`.clay-png[data-clay="${c.kind}"]`, { y: () => -(c.drift ?? 0) / 100 * innerHeight * k, duration: 1 }, 0));
  }, { scope: root });

  useClips(root);

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
      <HeroRow />
      </div>

      <HeroCards />
      <Clay items={CLAY} progress={progress} className="hero-clay" />
    </section>
  );
}
