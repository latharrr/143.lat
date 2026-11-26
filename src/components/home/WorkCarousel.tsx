'use client';
// 6. SELECTED WORK — infinite arc over a grain-textured maroon→terracotta orb. Scroll (while pinned), drag (with
// release inertia), horizontal wheel and ←/→ feed velocity; position lerps to target (friction 0.9) and snaps
// when idle. The centred card lifts with a shadow over a soft glow; side cards blur slightly. Ring text turns at half speed.
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, useGSAP, ScrollTrigger, useVelocityCarousel, wrapDist, isMobile, isReduced, EASE } from '@/lib/motion';
import { PROJECTS, projectLink, type Project } from '@/content/work';
import { getService } from '@/content/services';

const N = PROJECTS.length;

function ItemLink({ p, i, onFocus, setRef }: { p: Project; i: number; onFocus: () => void; setRef: (el: HTMLAnchorElement | null) => void }) {
  const l = projectLink(p);
  const props = {
    ref: setRef, className: `wc-item is-${p.device}`, style: { ['--i' as string]: i }, onFocus, draggable: false,
    'data-cursor': 'View', 'aria-label': `${p.name}: ${l.label}`,
  };
  const body = (
    <>
      <span className="wc-shadow" aria-hidden />
      <span className="wc-device">
        {p.device === 'laptop' && <span className="wc-bar" aria-hidden><i /><i /><i /></span>}
        <span className="wc-screen">
          <Image src={p.device === 'phone' ? p.mobile! : p.desktop} alt="" fill draggable={false}
            sizes={p.device === 'phone' ? '(max-width: 767px) 40vw, 240px' : '(max-width: 767px) 80vw, 520px'} />
        </span>
      </span>
    </>
  );
  return l.external
    ? <a href={l.href} target="_blank" rel="noopener" {...props}>{body}</a>
    : <Link href={l.href} data-title={p.name} {...props}>{body}</Link>;
}

export function WorkCarousel() {
  const root = useRef<HTMLElement>(null);
  const items = useRef<HTMLAnchorElement[]>([]);
  const ring = useRef<SVGGElement>(null);
  const [centre, setCentre] = useState(0);
  const centreRef = useRef(0);

  const car = useVelocityCarousel(N, pos => {
    const m = isMobile();
    const spacing = m ? 62 : 26; // vw between items
    const blur = m ? 1.5 : 3;
    items.current.forEach((el, i) => {
      if (!el) return;
      const d = wrapDist(i, pos, N);
      const a = Math.min(Math.abs(d), 1);
      gsap.set(el, {
        xPercent: -50, yPercent: -50,
        x: `${d * spacing}vw`,
        y: `${Math.min(d * d, 6) * (m ? 4 : 6) - (1 - a) * 2}vh`, // centre card lifts 2vh
        rotation: gsap.utils.clamp(-24, 24, d * 12),
        scale: 1 - a * 0.25,
        filter: isReduced() || a < 0.02 ? 'none' : `blur(${(a * blur).toFixed(2)}px)`,
        opacity: Math.abs(d) > 2.6 ? 0 : 1,
        zIndex: 10 - Math.round(Math.abs(d)),
      });
      (el.firstElementChild as HTMLElement).style.opacity = String(1 - a); // lift shadow
      el.tabIndex = Math.abs(d) < 0.5 ? 0 : -1;
    });
    if (ring.current) gsap.set(ring.current, { rotation: -pos * (180 / N), svgOrigin: '0 0' }); // half speed
    const c = ((Math.round(pos) % N) + N) % N;
    if (c !== centreRef.current) { centreRef.current = c; setCentre(c); }
  });

  // Info card + glow react to the new centre.
  useGSAP(() => {
    if (isReduced()) return;
    gsap.fromTo('.wc-info > *', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: EASE.reveal });
    gsap.fromTo('.wc-glow', { opacity: 0.55, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9, ease: EASE.reveal });
  }, { scope: root, dependencies: [centre] });

  useGSAP(() => {
    const sec = root.current!;
    const stage = sec.querySelector<HTMLElement>('.wc-stage')!;
    // Pinned scroll drives the carousel: one full loop over the pin.
    gsap.matchMedia(sec).add('(prefers-reduced-motion: no-preference)', () => {
      let last = 0;
      ScrollTrigger.create({
        trigger: sec, start: 'top top', end: () => `+=${isMobile() ? 150 : 220}%`, pin: true,
        onUpdate: s => { car.push((s.progress - last) * (N - 1)); last = s.progress; },
      });
    });
    // ←/→ while the section is on screen (and focus isn't in a form field).
    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] });
    io.observe(sec);
    const onKey = (e: KeyboardEvent) => {
      if (!inView || e.altKey || e.metaKey || e.ctrlKey || (e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') { car.push(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { car.push(-1); e.preventDefault(); }
    };
    // Drag with release inertia (velocity of the last ~100 ms), and click suppression after a real drag.
    let down = false, startX = 0, lastX = 0, lastT = 0, vel = 0, moved = 0;
    const unit = () => innerWidth * (isMobile() ? 0.62 : 0.26);
    const onDown = (e: PointerEvent) => { down = true; startX = lastX = e.clientX; lastT = performance.now(); vel = 0; moved = 0; };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const now = performance.now(), dx = e.clientX - lastX;
      vel = 0.8 * (dx / Math.max(1, now - lastT)) + 0.2 * vel; // px per ms, smoothed
      lastX = e.clientX; lastT = now; moved = Math.abs(e.clientX - startX);
      car.push(-dx / unit());
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (performance.now() - lastT < 100) car.push(gsap.utils.clamp(-2.5, 2.5, (-vel * 260) / unit())); // fling
    };
    const onClick = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); car.push(e.deltaX / 600); } };
    addEventListener('keydown', onKey);
    stage.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    stage.addEventListener('click', onClick, true);
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      io.disconnect();
      removeEventListener('keydown', onKey);
      stage.removeEventListener('pointerdown', onDown);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      stage.removeEventListener('click', onClick, true);
      stage.removeEventListener('wheel', onWheel);
    };
  }, { scope: root });

  const p = PROJECTS[centre];
  const l = projectLink(p);
  return (
    <section ref={root} className="work light-cream" aria-labelledby="wc-title">
      <h2 id="wc-title" className="wc-title">Selected work</h2>
      <div className="wc-blob" aria-hidden>
        <svg viewBox="-100 -100 200 200">
          <defs><path id="wc-circle" d="M -84 0 A 84 84 0 1 1 84 0 A 84 84 0 1 1 -84 0" /></defs>
          <g ref={ring}>
            <text><textPath href="#wc-circle" textLength="524">WEBSITES · AUTOMATION · AI AGENTS · WEBSITES · AUTOMATION · AI AGENTS ·</textPath></text>
          </g>
        </svg>
      </div>
      <div className="wc-glow" aria-hidden />
      <div className="wc-stage" data-cursor="Drag">
        {PROJECTS.map((w, i) => (
          <ItemLink key={w.slug} p={w} i={i} onFocus={() => car.goTo(i)} setRef={el => { if (el) items.current[i] = el; }} />
        ))}
      </div>
      <div className="wc-info" aria-live="polite">
        <p className="wi-name">{p.name}{p.recreated && <span className="tag-recreated">Recreated UI</span>}</p>
        <p className="wi-result">{p.oneLine}</p>
        {p.note && <p className="wi-note">{p.note}</p>}
        <ul className="wi-tags">{p.services.map(s => <li key={s}>{getService(s)!.name}</li>)}</ul>
        {l.external
          ? <a className="wi-link u strong" href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>
          : <Link className="wi-link u strong" href={l.href} data-title={p.name}>{l.label} →</Link>}
      </div>
      <div className="wc-nav">
        <button onClick={() => car.push(-1)} aria-label="Previous project">←</button>
        <p className="wc-hint" aria-hidden>Drag or scroll</p>
        <button onClick={() => car.push(1)} aria-label="Next project">→</button>
      </div>
    </section>
  );
}
