'use client';
// 1. HERO — headline, CTAs and the project showreel below them. Sticky 200vh (150vh on phones), scrubbed: the headline
// dims and lifts while the showreel rises, un-tilts and grows to fill the stage. Clay shapes drift around it.
import { useRef } from 'react';
import { gsap, useGSAP, useSplitReveal, usePinScenes, isReduced, isMobile, px, EASE } from '@/lib/motion';
import { AUDIENCES, CONTACT } from '@/content/site';
import { Magnetic } from '@/components/ui/Magnetic';
import { Clay, ClayItem } from '@/components/clay/Clay';
import { Showreel } from './Showreel';

const RINGS = [18, 30, 42, 54, 66];
const CLAY: ClayItem[] = [
  { kind: 'knot', at: [-0.4, 0.3], size: 0.085, drift: 45, bob: 5, tilt: [0.5, 0.3, 0.2] },
  { kind: 'flower', at: [0.43, -0.12], size: 0.095, drift: 60, bob: 4.4, tilt: [0.35, -0.5, 0.2] },
  { kind: 'blob', at: [-0.42, -0.3], size: 0.075, drift: 30, bob: 5.6 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const progress = useRef(0);

  // Intro: chars rise from a mask, then cards pop in.
  useSplitReveal(h1, { type: 'chars', stagger: 0.03, duration: 1.1, onScroll: false, delay: 0.1 });
  useGSAP(() => {
    if (isReduced()) return;
    gsap.from('.reel-frame', { y: 60, duration: 1.2, ease: EASE.reveal, delay: 0.6 }); // transform only: on phones the poster is the LCP
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
    // Showreel: rises from under the CTAs to the middle of the stage, flattens its tilt and grows a little.
    tl.fromTo('.reel-tilt', { rotationX: 14, scale: 0.94, transformPerspective: 1400 }, { rotationX: 0, scale: () => (isMobile() ? 1.08 : 1), duration: 1 }, 0)
      .to('.reel', { y: () => -(isMobile() ? 0.16 : 0.6) * innerHeight, duration: 1 }, 0);
    CLAY.forEach(c => tl.to(`.clay-png[data-clay="${c.kind}"]`, { y: () => -(c.drift ?? 0) / 100 * innerHeight * k, duration: 1 }, 0));
  }, { vhPerScene: 100, onUpdate: p => (progress.current = p), sticky: true }); // .hero-pin (CSS) holds the 200vh / 150vh

  return (
    <div className="hero-pin">
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
      <Showreel />
      </div>

      <Clay items={CLAY} progress={progress} className="hero-clay" />
    </section>
    </div>
  );
}
