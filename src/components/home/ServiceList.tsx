'use client';
// 5. BIG SERVICE LIST — the word nearest the viewport centre darkens (scrubbed per word);
// hover shows a lagging preview card that tilts with cursor velocity.
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, isReduced, isTouch, fadeIn } from '@/lib/motion';
import { LIST_ORDER, getService, serviceHref } from '@/content/services';
import { LazyVideo } from '@/components/ui/LazyVideo';

// Preview footage per service: real projects, captioned with the project's name.
const PREVIEW: Record<string, [string, string]> = {
  shopify: ['yp', 'YourProfessionals'], 'ai-agents': ['gapl', 'Gapl'], 'n8n-automation': ['intent', 'Picapool intents'],
  'whatsapp-email-automation': ['air', 'Picapool air'], '3d-websites': ['lputv', 'LpuTV'], websites: ['tbv', 'TrustBridgeVerify'],
  'landing-pages': ['intent', 'Picapool intents'], apps: ['proofmart', 'ProofMart'], 'seo-performance': ['yp', 'YourProfessionals'],
  scraping: ['gapl', 'Gapl'], 'workflow-optimisation': ['air', 'Picapool air'], 'payments-booking': ['proofmart', 'ProofMart'],
  maintenance: ['tbv', 'TrustBridgeVerify'],
};
const CLIPS = [...new Set(Object.values(PREVIEW).map(v => v[0]))];

export function ServiceList() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = gsap.utils.toArray<HTMLElement>('.sl-item', root.current);
    if (isReduced()) return void fadeIn(words, root.current);
    // Each word peaks when its centre crosses the viewport centre.
    words.forEach(w => {
      const hot = w.querySelector('.sl-hot'), base = w.querySelector('.sl-base');
      gsap.timeline({ scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } })
        .fromTo(hot, { opacity: 0 }, { opacity: 1, ease: 'power2.in', duration: 1 }, 0.25)
        .fromTo(base, { opacity: 1 }, { opacity: 0, ease: 'power2.in', duration: 1 }, 0.25)
        .to(hot, { opacity: 0, ease: 'power2.out', duration: 1 }, 1.25)
        .to(base, { opacity: 1, ease: 'power2.out', duration: 1 }, 1.25)
        .to({}, { duration: 0.25 });
    });

    if (isTouch()) return;
    const c = card.current!;
    const xTo = gsap.quickTo(c, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3.out' });
    const rTo = gsap.quickTo(c, 'rotation', { duration: 0.5, ease: 'power3.out' });
    let lastX = 0, lastT = 0;
    const move = (e: PointerEvent) => {
      const now = performance.now();
      const v = (e.clientX - lastX) / Math.max(1, now - lastT); // px per ms
      lastX = e.clientX; lastT = now;
      xTo(e.clientX); yTo(e.clientY); rTo(gsap.utils.clamp(-10, 10, v * 12));
    };
    const enter = (e: PointerEvent) => {
      const slug = (e.currentTarget as HTMLElement).dataset.slug!;
      const [clip, name] = PREVIEW[slug];
      c.querySelectorAll<HTMLElement>('[data-clip]').forEach(el => (el.hidden = el.dataset.clip !== clip));
      c.querySelector('figcaption')!.textContent = name;
      c.querySelector<HTMLVideoElement>(`[data-clip="${clip}"] video`)?.play().catch(() => {});
      gsap.to(c, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out' });
    };
    const leave = () => gsap.to(c, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power3.out' });
    const list = root.current!.querySelector<HTMLElement>('.sl-list')!;
    list.addEventListener('pointermove', move);
    list.addEventListener('pointerleave', leave);
    words.forEach(w => w.addEventListener('pointerenter', enter));
    return () => {
      list.removeEventListener('pointermove', move);
      list.removeEventListener('pointerleave', leave);
      words.forEach(w => w.removeEventListener('pointerenter', enter));
    };
  }, { scope: root });

  return (
    <section ref={root} className="slist light" aria-labelledby="sl-title">
      <p className="eyebrow" id="sl-title">Everything I build</p>
      <ul className="sl-list">
        {LIST_ORDER.map(slug => {
          const s = getService(slug)!;
          return (
            <li key={slug}>
              <Link className="sl-item" href={serviceHref(s)} data-slug={slug} data-title={s.name}>
                <span className="sl-base">{s.name}</span>
                <span className="sl-hot" aria-hidden>{s.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div ref={card} className="sl-card" aria-hidden>
        {CLIPS.map(c => <div key={c} data-clip={c} hidden><LazyVideo name={c} /></div>)}
        <figcaption />
      </div>
    </section>
  );
}
