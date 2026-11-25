'use client';
// 7. CASE STUDY / INNER PAGE PATTERNS
import { ReactNode, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, ScrollTrigger, useVelocityCarousel, wrapDist, isReduced, isMobile, scrollToTarget } from '@/lib/motion';

/** Hero image: starts inset (2%, radius 12) and expands to full bleed; overlay 0 -> 25%; inner image parallax. */
export function ExpandHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia(ref.current ?? undefined).add('(prefers-reduced-motion: no-preference)', () => {
      const st = { trigger: ref.current, start: 'top 85%', end: 'top 5%', scrub: true };
      gsap.fromTo(ref.current, { clipPath: 'inset(2% 2% 2% 2% round 12px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st });
      gsap.fromTo('.xh-shade', { opacity: 0 }, { opacity: 0.25, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.xh-media', { scale: 1.15, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }, { scope: ref });
  return (
    <figure ref={ref} className="xhero" aria-hidden>
      <div className="xh-media">{children}</div>
      <div className="xh-shade" />
    </figure>
  );
}

export const Diamond = () => <p className="diamond" aria-hidden>◆</p>;

/** Sticky bottom pill: scroll-spy over the section ids; click scrolls there with Lenis. */
export function PillSwitcher({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0].id);
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    items.forEach(({ id }) => ScrollTrigger.create({
      trigger: `#${id}`, start: 'top 55%', end: 'bottom 55%',
      onToggle: s => s.isActive && setActive(id),
    }));
    gsap.from(ref.current, { yPercent: 160, duration: isReduced() ? 0 : 0.8, ease: 'expo.out', delay: 0.8 });
  });
  return (
    <nav ref={ref} className="pills" aria-label="Case study sections">
      {items.map(i => (
        <a key={i.id} href={`#${i.id}`} aria-current={active === i.id || undefined}
          onClick={e => { e.preventDefault(); e.stopPropagation(); scrollToTarget(`#${i.id}`, -96); setActive(i.id); }}>
          {i.label}
        </a>
      ))}
    </nav>
  );
}

/** Horizontal strip: centre image wide, neighbours peek at the edges; drag, eases to snap. */
export function ImageStrip({ images, alt }: { images: string[]; alt: string }) {
  const root = useRef<HTMLDivElement>(null);
  const els = useRef<HTMLDivElement[]>([]);
  const n = images.length;
  const car = useVelocityCarousel(n, pos => {
    const w = isMobile() ? 84 : 64; // vw per slide
    els.current.forEach((el, i) => {
      const d = wrapDist(i, pos, n);
      gsap.set(el, { xPercent: -50, x: `${d * (w + 2)}vw`, scale: 1 - Math.min(Math.abs(d), 1) * 0.08, opacity: Math.abs(d) > 1.6 ? 0 : 1 });
    });
  });
  useGSAP(() => {
    const el = root.current!;
    let down = false, last = 0, moved = 0;
    const d = (e: PointerEvent) => { down = true; last = e.clientX; moved = 0; el.setPointerCapture(e.pointerId); };
    const m = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - last; last = e.clientX; moved += Math.abs(dx); car.push(-dx / (innerWidth * 0.64)); };
    const u = () => { down = false; };
    el.addEventListener('pointerdown', d); el.addEventListener('pointermove', m); el.addEventListener('pointerup', u); el.addEventListener('pointercancel', u);
    return () => { el.removeEventListener('pointerdown', d); el.removeEventListener('pointermove', m); el.removeEventListener('pointerup', u); el.removeEventListener('pointercancel', u); };
  }, { scope: root });
  return (
    <div className="strip-wrap">
      <div ref={root} className="strip" data-cursor="Drag" role="group" aria-label={`${alt} screenshots`}>
        {images.map((src, i) => (
          <div key={src} className="strip-item" ref={el => { if (el) els.current[i] = el; }}>
            <Image src={src} alt={`${alt}, screen ${i + 1}`} fill sizes="(max-width: 767px) 84vw, 64vw" draggable={false} />
          </div>
        ))}
      </div>
      <div className="strip-nav">
        <button onClick={() => car.push(-1)} aria-label="Previous screenshot">←</button>
        <button onClick={() => car.push(1)} aria-label="Next screenshot">→</button>
      </div>
    </div>
  );
}

