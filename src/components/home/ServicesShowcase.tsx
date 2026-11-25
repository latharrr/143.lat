'use client';
// 3. SERVICES SHOWCASE — sticky stage, pinned scenes x 100vh.
// 4. CURTAIN — the stage stays pinned one more segment while the light section slides over it.
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, usePinScenes, fadeIn, MQ, EASE } from '@/lib/motion';
import { GROUPS, SERVICES, serviceHref } from '@/content/services';
import { Clay, ClayItem } from '@/components/clay/Clay';
import { Magnetic } from '@/components/ui/Magnetic';
import { Browser, Phone, Chat, NodeGraph, Agent, Dashboard, Serp, Payment, Changelog, Uptime, Monitor } from './Mockups';

const KNOT: ClayItem[] = [{ kind: 'knot', at: [0, 0], size: 0.34, tilt: [0.6, 0, 0.3] }];

const SCENES = [
  <>
    <Browser className="m1" src="/media/proofmart-hero.jpg" url="proofmart.shop" />
    <Phone className="m2" src="/media/sangsafar-phone.jpg" />
    <Browser className="m3" src="/media/yp-hero.jpg" url="yourprofessionals.in" />
  </>,
  <>
    <NodeGraph className="m1" />
    <Chat className="m2" />
    <Agent className="m3" />
  </>,
  <>
    <Dashboard className="m1" />
    <Serp className="m2" />
    <Payment className="m3" />
  </>,
  <>
    <Changelog className="m1" />
    <Uptime className="m2" />
    <Monitor className="m3" />
  </>,
];

export function ServicesShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const n = GROUPS.length;

  // Pin = n scene segments + 1 curtain segment, during which the light section (pulled up by -100vh
  // in CSS) slides over the still-pinned stage while it scales to 0.95 and dims to 60%.
  usePinScenes(root, n + 1, tl => {
    const scenes = gsap.utils.toArray<HTMLElement>('.sc-scene', root.current);
    const bgs = gsap.utils.toArray<HTMLElement>('.sc-bg', root.current);
    gsap.set(scenes.slice(1), { autoAlpha: 0 });
    gsap.set(bgs.slice(1), { opacity: 0 });
    // Scene k owns [k, k+1). Around each boundary b: mockups blur (max 4px) only in the outgoing and
    // incoming 20%, copy crossfades within 15%, background crossfades within 20%. So every scene is
    // fully sharp for the middle 60% of its segment.
    for (let i = 0; i < n - 1; i++) {
      const b = i + 1;
      const [cur, next] = [scenes[i], scenes[i + 1]];
      tl.set(next, { autoAlpha: 1 }, b - 0.2)
        .to(cur.querySelectorAll('.mk'), { scale: 1.2, filter: 'blur(4px)', opacity: 0, duration: 0.2 }, b - 0.2)
        .to(cur.querySelector('.sc-copy'), { opacity: 0, y: -20, duration: 0.075 }, b - 0.075)
        .fromTo(bgs[b], { opacity: 0 }, { opacity: 1, duration: 0.2 }, b - 0.1)
        .fromTo(next.querySelector('.sc-copy'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.075 }, b)
        .fromTo(next.querySelectorAll('.mk'), { scale: 0.85, filter: 'blur(4px)', opacity: 0 }, { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.2 }, b)
        .set(cur, { autoAlpha: 0 }, b + 0.2);
    }
    tl.to('.sc-inner', { scale: 0.95, duration: 1 }, n).to('.sc-dim', { opacity: 0.4, duration: 1 }, n);
  }, { vhPerScene: 100, onUpdate: p => (progress.current = p), when: MQ.full });

  // Phones / reduced motion: scenes stack; each one just fades up as it arrives.
  useGSAP(() => {
    gsap.matchMedia(root.current ?? undefined).add(MQ.lite, () => {
      gsap.utils.toArray<HTMLElement>('.sc-scene', root.current).forEach(s =>
        gsap.from(s.querySelectorAll('.mk, .sc-copy'), { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: EASE.reveal, scrollTrigger: { trigger: s, start: 'top 80%', once: true } }));
    });
    gsap.matchMedia(root.current ?? undefined).add(MQ.reduced, () => {
      gsap.utils.toArray<HTMLElement>('.sc-scene', root.current).forEach(s => fadeIn(s, s));
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
            {GROUPS.map(g => <div key={g.name} className={`sc-bg sc-bg-${g.name.toLowerCase()}`} aria-hidden />)}
            {GROUPS.map((g, i) => (
              <div key={g.name} className={`sc-scene sc-scene-${g.name.toLowerCase()}`}>
                <div className="sc-copy">
                  <p className="sc-num">0{i + 1} / 0{n}</p>
                  <h3>{g.name}</h3>
                  <ul>
                    {SERVICES.filter(s => s.group === g.name).map(s => (
                      <li key={s.slug}><Link href={serviceHref(s)} className="u" data-title={s.name}>{s.name}</Link></li>
                    ))}
                  </ul>
                </div>
                <div className="sc-mocks" aria-hidden>{SCENES[i]}</div>
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
