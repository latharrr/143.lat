'use client';
// 3. SERVICES SHOWCASE — sticky stage, pinned scenes x 100vh. 4. CURTAIN — the dark coda stays put
// while the light section slides over it (see Curtain below).
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, usePinScenes, fadeIn, MQ, EASE } from '@/lib/motion';
import { GROUPS, SERVICES, serviceHref } from '@/content/services';
import { Clay, ClayItem } from '@/components/clay/Clay';
import { Magnetic } from '@/components/ui/Magnetic';
import { Browser, Phone, Chat, NodeGraph, Agent, Dashboard, Serp, Payment, Changelog, Uptime } from './Mockups';

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
    <Browser className="m3" src="/media/gapl-hero.jpg" url="gapl.143.lat" />
  </>,
];

export function ServicesShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const n = GROUPS.length;

  usePinScenes(root, n, tl => {
    const scenes = gsap.utils.toArray<HTMLElement>('.sc-scene', root.current);
    const bgs = gsap.utils.toArray<HTMLElement>('.sc-bg', root.current);
    gsap.set(scenes.slice(1), { autoAlpha: 0 });
    gsap.set(bgs.slice(1), { opacity: 0 });
    tl.to({}, { duration: 0.25 }); // hold the first scene
    for (let i = 0; i < n - 1; i++) {
      const at = 0.25 + i;
      const out = scenes[i].querySelectorAll('.mk, .sc-copy');
      const inn = scenes[i + 1].querySelectorAll('.mk, .sc-copy');
      tl.to(out, { scale: 1.4, filter: 'blur(8px)', opacity: 0, duration: 0.5, stagger: 0.04 }, at)
        .set(scenes[i], { autoAlpha: 0 }, at + 0.6)
        .to(bgs[i + 1], { opacity: 1, duration: 0.6 }, at)
        .set(scenes[i + 1], { autoAlpha: 1 }, at + 0.15)
        .fromTo(inn, { scale: 0.7, filter: 'blur(8px)', opacity: 0 }, { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.5, stagger: 0.04 }, at + 0.2)
        .to({}, { duration: 0.25 }, at + 0.7);
    }
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
      </div>
    </section>
  );
}

/** Dark coda under the stage. It pins while the light section (next sibling) slides up over it. */
export function CurtainCoda() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.matchMedia(ref.current ?? undefined).add('(prefers-reduced-motion: no-preference)', () => {
      // The light section (next sibling) rises over the pinned coda; underneath it scales to 0.95 and dims to 60%.
      gsap.timeline({
        defaults: { ease: EASE.scrub },
        scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=100%', pin: true, pinSpacing: false, scrub: true },
      })
        .to('.coda-inner', { scale: 0.95, duration: 1 }, 0)
        .to('.coda-dim', { opacity: 0.4, duration: 1 }, 0);
    });
  }, { scope: ref });
  return (
    <div ref={ref} className="coda dark">
      <div className="coda-inner">
        <p className="coda-text">
          One person from first call to launch: design, code, automation and the boring parts like hosting, analytics and handover. You talk to the person who builds it.
        </p>
        <Magnetic><Link href="/work" className="btn btn-lav" data-title="Work">View work</Link></Magnetic>
      </div>
      <div className="coda-dim" aria-hidden />
    </div>
  );
}
