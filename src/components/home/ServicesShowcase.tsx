'use client';
// 3. SERVICES STACK — pinned stage, 4 cards (Build, Automate, AI, Grow) + 1 curtain segment.
// Card k owns scroll segment [k, k+1). Around each boundary the next card slides up over the current one while
// the current one scales to 0.9 and dims; the counter digit rolls, title + list stagger in. Screenshots parallax
// at their own depth (data-depth) and tilt toward the mouse. Phones / reduced motion: cards in a column.
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, ScrollTrigger, usePinScenes, fadeIn, MQ, EASE } from '@/lib/motion';
import { GROUPS, SERVICES, serviceHref, type Group } from '@/content/services';
import { getProject } from '@/content/work';
import { Clay, ClayItem } from '@/components/clay/Clay';
import { Magnetic } from '@/components/ui/Magnetic';
import { Browser, Phone } from './Mockups';

const KNOT: ClayItem[] = [{ kind: 'knot', at: [0, 0], size: 0.34, tilt: [0.6, 0, 0.3] }];

// Screens per card: [project slug, frame, depth, position class, optional screenshot override].
type Mock = [string, 'browser' | 'phone', number, string, string?];
const MOCKS: Record<Group, Mock[]> = {
  Build: [['tulips-oven', 'browser', 0.8, 'm1'], ['gapl', 'browser', 1.0, 'm4'], ['proofmart', 'browser', 1.3, 'm3'], ['spraykart', 'phone', 1.6, 'm2']],
  Automate: [['picapool-crm-automation', 'browser', 0.7, 'm1'], ['linkedin-autopilot', 'browser', 1.5, 'm3']],
  AI: [['picapool-ai-data-analyst', 'browser', 0.7, 'm1'], ['rumour-mill', 'browser', 1.5, 'm3', '/work/rumour-mill/ask.webp']],
  Grow: [['yourprofessionals', 'browser', 0.7, 'm1'], ['picapool-acquisition-campaign', 'phone', 1.6, 'm2']],
};
const host = (u?: string) => (u ? u.replace(/^https?:\/\/(www\.)?/, '') : 'internal tool');

function Screen({ m }: { m: Mock }) {
  const [slug, frame, depth, cls, img] = m;
  const p = getProject(slug);
  const tag = p.recreated ? <span className="mk-tag">Recreated UI</span> : null;
  return (
    <div className={`sc-mock ${cls}`} data-depth={depth}>
      {frame === 'phone'
        ? <Phone src={p.mobile!} />
        : <Browser src={img ?? p.desktop} url={img ? `${host(p.live)}/ask` : host(p.live)} />}
      <span className="sc-mock-cap">{p.name.replace('Website for ', '')}{img ? ' · AI module' : ''}{tag}</span>
    </div>
  );
}

export function ServicesShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const n = GROUPS.length;

  // Pin = n card segments + 1 curtain segment, during which the light section (pulled up by -100vh in CSS)
  // slides over the still-pinned stage while it scales to 0.95 and dims to 60%.
  usePinScenes(root, n + 1, tl => {
    const cards = gsap.utils.toArray<HTMLElement>('.sc-scene', root.current);
    gsap.set(cards.slice(1), { yPercent: 104 });
    cards.forEach((card, k) => {
      // Parallax: every screen drifts upward through its card's whole time on screen, deeper = further.
      card.querySelectorAll<HTMLElement>('.sc-mock').forEach(m => {
        const d = Number(m.dataset.depth);
        tl.fromTo(m, { y: 45 * d }, { y: -45 * d, duration: k ? 1.6 : 1.3 }, k ? k - 0.3 : 0);
      });
      const next = cards[k + 1];
      if (!next) return;
      const b = k + 1; // boundary: next card fully in place
      tl.to(next, { yPercent: 0, duration: 0.45, ease: 'power2.inOut' }, b - 0.45)
        .to(card, { scale: 0.9, duration: 0.45, ease: 'power2.inOut' }, b - 0.45)
        .to(card.querySelector('.sc-shade'), { opacity: 0.55, duration: 0.45 }, b - 0.45)
        .fromTo(next.querySelector('.sc-num-roll span'), { yPercent: 100 }, { yPercent: 0, duration: 0.18, ease: EASE.reveal }, b - 0.15)
        .fromTo(next.querySelector('h3 span'), { yPercent: 105 }, { yPercent: 0, duration: 0.22, ease: EASE.reveal }, b - 0.2)
        .fromTo(next.querySelectorAll('.sc-copy li'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, stagger: 0.035, ease: EASE.reveal }, b - 0.1);
    });
    tl.to('.sc-inner', { scale: 0.95, duration: 1 }, n).to('.sc-dim', { opacity: 0.4, duration: 1 }, n);
  }, { vhPerScene: 100, onUpdate: p => (progress.current = p), when: MQ.full });

  useGSAP(() => {
    const el = root.current!;
    gsap.matchMedia(el).add(MQ.full, () => {
      // First card: list staggers in as the stage arrives (later cards stagger inside the pinned timeline).
      gsap.from(el.querySelectorAll('.sc-scene:first-child .sc-copy li'), { y: 18, opacity: 0, duration: 0.8, stagger: 0.06, ease: EASE.reveal, scrollTrigger: { trigger: el, start: 'top 60%', once: true } });
      // Mouse: screens tilt toward the pointer, deeper screens shift further. Fine pointers only.
      if (!matchMedia('(hover: hover)').matches) return;
      const groups = gsap.utils.toArray<HTMLElement>('.sc-mocks', el).map(g => ({
        rx: gsap.quickTo(g, 'rotationX', { duration: 0.8, ease: 'power3.out' }),
        ry: gsap.quickTo(g, 'rotationY', { duration: 0.8, ease: 'power3.out' }),
      }));
      const shifts = gsap.utils.toArray<HTMLElement>('.sc-mock', el).map(m => ({ d: Number(m.dataset.depth), x: gsap.quickTo(m, 'x', { duration: 0.9, ease: 'power3.out' }) }));
      const move = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        groups.forEach(g => { g.ry(nx * 10); g.rx(-ny * 7); });
        shifts.forEach(s => s.x(nx * 14 * s.d));
      };
      el.addEventListener('pointermove', move);
      return () => el.removeEventListener('pointermove', move);
    });
    // Phones: sticky cards stack (CSS); as the next card slides over, the one beneath scales to 0.92 and dims.
    // Each card's counter rolls and its list staggers in as it arrives. The knot spins with the column's progress.
    gsap.matchMedia(el).add(MQ.lite, () => {
      const cards = gsap.utils.toArray<HTMLElement>('.sc-scene', el);
      cards.forEach((s, k) => {
        gsap.from(s.querySelectorAll('.sc-mock, .sc-copy li'), { y: 32, opacity: 0, stagger: 0.06, duration: 0.9, ease: EASE.reveal, scrollTrigger: { trigger: s, start: 'top 80%', once: true } });
        gsap.from(s.querySelector('.sc-num-roll span'), { yPercent: 100, duration: 0.6, ease: EASE.reveal, scrollTrigger: { trigger: s, start: 'top 80%', once: true } });
        const next = cards[k + 1];
        if (!next) return;
        gsap.timeline({ scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=80', scrub: true } })
          .to(s, { scale: 0.92, ease: 'none' }, 0)
          .to(s.querySelector('.sc-shade'), { opacity: 0.5, ease: 'none' }, 0);
      });
      ScrollTrigger.create({ trigger: el.querySelector('.sc-box'), start: 'top bottom', end: 'bottom top', onUpdate: t => (progress.current = t.progress) });
    });
    gsap.matchMedia(el).add(MQ.reduced, () => {
      gsap.utils.toArray<HTMLElement>('.sc-scene', el).forEach(s => fadeIn(s, s));
    });
  }, { scope: root });

  return (
    <section className="showcase dark" aria-labelledby="sc-title">
      <div ref={root} className="sc-stage">
        <div className="sc-inner">
          <div className="sc-labels">
            <h2 id="sc-title">From idea to launch. In weeks.</h2>
            <p>13 services. One developer.</p>
          </div>
          <div className="sc-frame">
            <Clay items={KNOT} progress={progress} spinWithProgress parallax={false} className="sc-knot" />
            <div className="sc-box">
              {GROUPS.map((g, i) => (
                <div key={g.name} className={`sc-scene sc-scene-${g.name.toLowerCase()}`} style={{ ['--k' as string]: i }}>
                  <div className={`sc-copy ${SERVICES.filter(s => s.group === g.name).length === 1 ? 'is-single' : ''}`}>
                    <p className="sc-num"><span className="sc-num-roll"><span>0{i + 1}</span></span> / 0{n}</p>
                    <h3><span>{g.name}</span></h3>
                    <ul>
                      {SERVICES.filter(s => s.group === g.name).map(s => (
                        <li key={s.slug}><Link href={serviceHref(s)} className="u" data-title={s.name}>{s.name}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div className="sc-mocks" aria-hidden>{MOCKS[g.name].map(m => <Screen key={m[0] + m[3]} m={m} />)}</div>
                  <div className="sc-shade" aria-hidden />
                </div>
              ))}
            </div>
          </div>
          <div className="sc-coda">
            <p>One person from first call to launch. You talk to the person who builds it.</p>
            <Magnetic><Link href="/work" className="btn btn-lav" data-title="Work">View work</Link></Magnetic>
          </div>
        </div>
        <div className="sc-dim" aria-hidden />
      </div>
    </section>
  );
}
