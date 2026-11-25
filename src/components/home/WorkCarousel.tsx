'use client';
// 6. WORK CAROUSEL — infinite arc. Scroll (while pinned), drag, horizontal wheel and ←/→ keys feed
// velocity; position lerps to target (friction 0.9) and snaps when idle. Curved text turns with it.
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, useGSAP, ScrollTrigger, useVelocityCarousel, wrapDist, isMobile, isReduced } from '@/lib/motion';
import { CAROUSEL as WORK } from '@/content/work';
import { getService } from '@/content/services';
import { LazyVideo } from '@/components/ui/LazyVideo';
import { MockScreen } from './Mockups';

const N = WORK.length;
const tags = (slugs: string[]) => slugs.map(s => getService(s)!.name);

export function WorkCarousel() {
  const root = useRef<HTMLElement>(null);
  const items = useRef<HTMLAnchorElement[]>([]);
  const ring = useRef<SVGGElement>(null);
  const info = useRef<HTMLDivElement>(null);
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
    // Info under the centre item follows the nearest project.
    const c = ((Math.round(pos) % N) + N) % N;
    const el = info.current;
    if (c !== centre.current && el) {
      centre.current = c;
      const w = WORK[c];
      el.querySelector('.wi-name')!.textContent = w.title;
      el.querySelector('.wi-result')!.textContent = w.oneLine;
      el.querySelector('.wi-tags')!.innerHTML = tags(w.services).map(t => `<li>${t}</li>`).join('');
      const a = el.querySelector<HTMLAnchorElement>('.wi-link')!;
      a.href = `/work/${w.slug}`;
      a.dataset.title = w.word;
      a.setAttribute('aria-label', `View the ${w.title} case study`);
      gsap.fromTo(el.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'expo.out' });
    }
  });

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

  const first = WORK[0];
  return (
    <section ref={root} className="work light-cream" aria-labelledby="wc-title">
      <h2 id="wc-title" className="wc-title">Selected work</h2>
      <div className="wc-blob" aria-hidden>
        <svg viewBox="-100 -100 200 200">
          <defs><path id="wc-circle" d="M -82 0 A 82 82 0 1 1 82 0 A 82 82 0 1 1 -82 0" /></defs>
          <g ref={ring}>
            <text><textPath href="#wc-circle" textLength="510">WEBSITES · AUTOMATION · AI AGENTS · WEBSITES · AUTOMATION · AI AGENTS ·</textPath></text>
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
              {w.video ? <LazyVideo name={w.video} />
                : w.image ? <Image src={w.image} alt="" fill sizes="(max-width: 767px) 60vw, 30vw" draggable={false} />
                : <MockScreen mock={w.mock!} />}
            </span>
          </Link>
        ))}
      </div>
      <div ref={info} className="wc-info" aria-live="polite">
        <p className="wi-name">{first.title}</p>
        <p className="wi-result">{first.oneLine}</p>
        <ul className="wi-tags">{tags(first.services).map(t => <li key={t}>{t}</li>)}</ul>
        <Link className="wi-link u strong" href={`/work/${first.slug}`} data-title={first.word} aria-label={`View the ${first.title} case study`}>View case study →</Link>
      </div>
      <div className="wc-nav">
        <button onClick={() => car.push(-1)} aria-label="Previous project">←</button>
        <p className="wc-hint" aria-hidden>Drag or scroll</p>
        <button onClick={() => car.push(1)} aria-label="Next project">→</button>
      </div>
    </section>
  );
}
