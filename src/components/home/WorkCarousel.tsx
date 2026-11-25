'use client';
// 6. WORK CAROUSEL — infinite arc. Scroll (while pinned), wheel-drag and pointer drag feed velocity;
// position lerps to target (friction 0.9) and snaps when idle. Curved text rotates with the offset.
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, useGSAP, useVelocityCarousel, wrapDist, isMobile, isReduced } from '@/lib/motion';
import { WORK } from '@/content/work';
import { MockScreen } from './Mockups';

const N = WORK.length;

export function WorkCarousel() {
  const root = useRef<HTMLElement>(null);
  const items = useRef<HTMLAnchorElement[]>([]);
  const ring = useRef<SVGGElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const centre = useRef(0);

  const car = useVelocityCarousel(N, pos => {
    const m = isMobile();
    const spacing = m ? 62 : 26; // vw between items
    const blur = m ? 2 : 5;
    items.current.forEach((el, i) => {
      if (!el) return;
      const d = wrapDist(i, pos, N);
      const a = Math.min(Math.abs(d), 1);
      gsap.set(el, {
        xPercent: -50, yPercent: -50,
        x: `${d * spacing}vw`,
        y: `${Math.min(d * d, 6) * (m ? 4 : 6)}vh`,
        rotation: gsap.utils.clamp(-24, 24, d * 12),
        scale: 1 - a * 0.3,
        filter: isReduced() ? 'none' : `blur(${(a * blur).toFixed(2)}px)`,
        opacity: Math.abs(d) > 2.6 ? 0 : 1,
        zIndex: 10 - Math.round(Math.abs(d)),
      });
      el.tabIndex = Math.abs(d) < 0.5 ? 0 : -1;
    });
    if (ring.current) gsap.set(ring.current, { rotation: -pos * (360 / N), svgOrigin: '0 0' });
    const c = ((Math.round(pos) % N) + N) % N;
    if (c !== centre.current && label.current) {
      centre.current = c;
      label.current.querySelector('b')!.textContent = WORK[c].title;
      label.current.querySelector('span')!.textContent = WORK[c].type;
    }
  });

  useGSAP(() => {
    const stage = root.current!.querySelector<HTMLElement>('.wc-stage')!;
    // Pinned scroll drives the carousel: one full loop over the pin.
    gsap.matchMedia(root.current ?? undefined).add('(prefers-reduced-motion: no-preference)', () => {
      let last = 0;
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${isMobile() ? 150 : 220}%`, pin: true, scrub: true,
          onUpdate: s => { car.push((s.progress - last) * (N - 1)); last = s.progress; },
        },
      });
    });
    // Drag (pointer) with click suppression after a real drag.
    let down = false, startX = 0, lastX = 0, moved = 0;
    const onDown = (e: PointerEvent) => { down = true; startX = lastX = e.clientX; moved = 0; };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX; lastX = e.clientX; moved = Math.abs(e.clientX - startX);
      car.push(-dx / (innerWidth * (isMobile() ? 0.62 : 0.26)));
    };
    const onUp = () => { down = false; };
    const onClick = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    // Horizontal wheel / trackpad swipes move it too.
    const onWheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); car.push(e.deltaX / 600); } };
    stage.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove);
    addEventListener('pointerup', onUp);
    stage.addEventListener('click', onClick, true);
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      stage.removeEventListener('pointerdown', onDown);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerup', onUp);
      stage.removeEventListener('click', onClick, true);
      stage.removeEventListener('wheel', onWheel);
    };
  }, { scope: root });

  return (
    <section ref={root} className="work light-cream" aria-labelledby="wc-title">
      <h2 id="wc-title" className="wc-title">Selected work</h2>
      <div className="wc-blob" aria-hidden>
        <svg viewBox="-100 -100 200 200">
          <defs><path id="wc-circle" d="M -78 0 A 78 78 0 1 1 78 0 A 78 78 0 1 1 -78 0" /></defs>
          <g ref={ring}>
            <text><textPath href="#wc-circle">WEBSITES · AUTOMATION · AI AGENTS · WEBSITES · AUTOMATION · AI AGENTS ·</textPath></text>
          </g>
        </svg>
      </div>
      <div className="wc-stage" data-cursor="Drag">
        {WORK.map((w, i) => (
          <Link key={w.slug} href={`/work/${w.slug}`} data-title={w.word} data-cursor="View"
            ref={el => { if (el) items.current[i] = el; }}
            className={`wc-item is-${w.device}`} style={{ ['--i' as string]: i }}
            onFocus={() => car.goTo(i)} aria-label={`${w.title}: ${w.summary}`} draggable={false}>
            <span className="wc-device">
              {w.image ? <Image src={w.image} alt="" fill sizes="(max-width: 767px) 60vw, 30vw" draggable={false} /> : <MockScreen mock={w.mock!} />}
            </span>
          </Link>
        ))}
      </div>
      <div ref={label} className="wc-label" aria-live="polite">
        <b>{WORK[0].title}</b><span>{WORK[0].type}</span><em>View case study →</em>
      </div>
      <div className="wc-nav">
        <button onClick={() => car.push(-1)} aria-label="Previous project">←</button>
        <button onClick={() => car.push(1)} aria-label="Next project">→</button>
      </div>
      <p className="wc-hint" aria-hidden>Scroll to discover</p>
      <noscript><style>{`.wc-item{position:relative!important;transform:none!important;display:inline-block}`}</style></noscript>
    </section>
  );
}
