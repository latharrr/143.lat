'use client';
// 1. HERO — orbit stage. Pinned 200vh (150vh on phones), scrubbed (scrub 1).
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, useSplitReveal, usePinScenes, isReduced, px, EASE } from '@/lib/motion';
import { AUDIENCES, CONTACT } from '@/content/site';
import { ORBIT_CARDS } from '@/content/work';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { Magnetic } from '@/components/ui/Magnetic';
import { Clay, ClayItem } from '@/components/clay/Clay';

// Ring radii are in vmax; angles in degrees (-90 = straight up from the ring centre).
const RINGS = [18, 30, 42, 54, 66];
const SLOTS: { r: number; a: number; speed: number; tilt: number; dir: 1 | -1 }[] = [
  { r: 54, a: -168, speed: 1.1, tilt: -6, dir: 1 },
  { r: 42, a: -142, speed: 0.8, tilt: 5, dir: -1 },
  { r: 30, a: -120, speed: 1.5, tilt: -4, dir: 1 },
  { r: 54, a: -104, speed: 0.6, tilt: 7, dir: 1 },
  { r: 42, a: -66, speed: 1.3, tilt: -7, dir: -1 },
  { r: 30, a: -52, speed: 0.9, tilt: 4, dir: 1 },
  { r: 54, a: -24, speed: 1.6, tilt: 6, dir: -1 },
  { r: 66, a: -150, speed: 1.2, tilt: -3, dir: -1 },
  { r: 66, a: -38, speed: 0.7, tilt: 3, dir: 1 },
  { r: 42, a: -8, speed: 1.4, tilt: -5, dir: -1 },
];
const PILLS = [
  { label: 'Shopify', r: 36, a: -158, speed: 1.2 },
  { label: 'n8n', r: 24, a: -96, speed: 0.9 },
  { label: 'AI Agent', r: 48, a: -82, speed: 1.4 },
  { label: 'WhatsApp', r: 36, a: -30, speed: 0.7 },
  { label: '3D', r: 60, a: -128, speed: 1.0 },
  { label: 'SEO', r: 60, a: -58, speed: 1.3 },
];
const CLAY: ClayItem[] = [
  { kind: 'knot', at: [-0.4, 0.3], size: 0.085, drift: 45, bob: 5, tilt: [0.5, 0.3, 0.2] },
  { kind: 'flower', at: [0.41, 0.06], size: 0.095, drift: 60, bob: 4.4, tilt: [0.35, -0.5, 0.2] },
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
    gsap.fromTo('.orb-card, .orb-pill', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'back.out(1.6)', delay: 0.7 });
    gsap.fromTo('.hero-eyebrow, .hero-rings', { opacity: 0 }, { opacity: 1, duration: 1.2, ease: EASE.reveal, delay: 0.4 });
    // Audience ticker: vertical slot roll, 2.2s per word, seamless loop via a duplicated first word.
    const list = root.current!.querySelector<HTMLElement>('.tick-list')!;
    const n = AUDIENCES.length;
    const roll = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= n; i++) roll.to(list, { yPercent: (-100 * i) / (n + 1), duration: 0.6, ease: EASE.move }, `+=${i === 1 ? 1.6 : 1.6}`);
    roll.set(list, { yPercent: 0 });
  }, { scope: root });

  usePinScenes(root, 2, (tl, mobile) => {
    const k = px();
    tl.to('.hero-head', { scale: 0.92, opacity: 0.25, y: () => -0.15 * innerHeight, duration: 1 }, 0);
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
    tl.fromTo('.hero-centre', { opacity: 0, y: mobile ? 30 : 60 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.5);
  }, { vhPerScene: 100, onUpdate: p => (progress.current = p) });

  return (
    <section ref={root} className="hero dark" aria-labelledby="hero-title">
      <svg className="hero-rings" viewBox="-100 -100 200 200" aria-hidden>
        {RINGS.map(r => <circle key={r} r={r} />)}
      </svg>

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

      <div className="orbit" aria-hidden>
        {ORBIT_CARDS.map((c, i) => {
          const s = SLOTS[i];
          return (
            <div key={c.name} className={`orb-lift ${i > 5 ? 'orb-desk' : ''}`} data-speed={s.speed}>
              <div className="orb-arm" data-dir={s.dir} style={{ transform: `rotate(${s.a}deg)` }}>
                <div className="orb-pos" style={{ transform: `translateX(${s.r}vmax)` }}>
                  <div className="orb-spin" style={{ transform: `rotate(${-s.a + s.tilt}deg)` }}>
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
            <div className="orb-arm" style={{ transform: `rotate(${p.a}deg)` }}>
              <div className="orb-pos" style={{ transform: `translateX(${p.r}vmax)` }}>
                <div className="orb-spin" style={{ transform: `rotate(${-p.a}deg)` }}>
                  <span className="orb-pill">{p.label}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Clay items={CLAY} progress={progress} className="hero-clay" />

      <div className="hero-centre">
        <p className="hero-lead">Websites, automations and AI agents that save time and bring revenue.</p>
        <div className="btn-row">
          <Magnetic><a className="btn btn-lav" href={CONTACT.cal} target="_blank" rel="noopener">Book a free call</a></Magnetic>
          <Magnetic><a className="btn btn-ghost" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp me</a></Magnetic>
        </div>
      </div>
    </section>
  );
}
