'use client';
// 5. BIG SERVICE LIST — the word nearest the viewport centre darkens (scrubbed per word);
// hover takes over: the hovered word is the bold one and shows a lagging preview card (the service's real projects)
// that tilts with cursor velocity. Leaving a word clears both; leaving the list hands the bold back to scroll.
import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, isReduced, isTouch, fadeIn } from '@/lib/motion';
import Image from 'next/image';
import { LIST_ORDER, SERVICE_PROJECTS, getService, serviceHref } from '@/content/services';
import { getProject } from '@/content/work';

// Preview per service: the projects that demonstrate it (cycled while hovered). No project = no preview.
const SHOTS = [...new Set(Object.values(SERVICE_PROJECTS).flat())].map(getProject);

export function ServiceList() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = gsap.utils.toArray<HTMLElement>('.sl-item', root.current);
    if (isReduced()) return void fadeIn(words, root.current);
    // One text layer per word: colour + weight peak as its centre crosses the viewport centre.
    words.forEach(w => {
      gsap.timeline({ scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } })
        .fromTo(w, { color: '#d6d4cf', fontWeight: 500 }, { color: '#1a1a1a', fontWeight: 600, ease: 'power2.in', duration: 1 }, 0.25)
        .to(w, { color: '#d6d4cf', fontWeight: 500, ease: 'power2.out', duration: 1 }, 1.25)
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
    let cycle = 0;
    const show = (slug: string) => {
      c.querySelectorAll<HTMLElement>('[data-shot]').forEach(el => (el.hidden = el.dataset.shot !== slug));
      c.querySelector('figcaption')!.textContent = getProject(slug).name;
    };
    // Hide, then drop the image, so a previous preview can never linger on a row without one.
    const clear = () => c.querySelectorAll<HTMLElement>('[data-shot]').forEach(el => (el.hidden = true));
    const leave = (e?: PointerEvent) => { (e?.currentTarget as HTMLElement | undefined)?.classList.remove('is-hot'); clearInterval(cycle); gsap.to(c, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power3.out', overwrite: true, onComplete: clear }); };
    const enter = (e: PointerEvent) => {
      const w = e.currentTarget as HTMLElement;
      words.forEach(o => o.classList.toggle('is-hot', o === w));
      listEl.classList.add('is-hover');
      const list = SERVICE_PROJECTS[w.dataset.slug!] ?? [];
      clearInterval(cycle);
      if (!list.length) return leave();
      let k = 0;
      show(list[0]);
      if (list.length > 1) cycle = window.setInterval(() => show(list[(k = (k + 1) % list.length)]), 1400);
      gsap.to(c, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out', overwrite: true });
    };
    const listEl = root.current!.querySelector<HTMLElement>('.sl-list')!;
    const out = () => { listEl.classList.remove('is-hover'); words.forEach(o => o.classList.remove('is-hot')); leave(); };
    listEl.addEventListener('pointermove', move);
    listEl.addEventListener('pointerleave', out);
    words.forEach(w => { w.addEventListener('pointerenter', enter); w.addEventListener('pointerleave', leave); });
    return () => {
      clearInterval(cycle);
      listEl.removeEventListener('pointermove', move);
      listEl.removeEventListener('pointerleave', out);
      words.forEach(w => { w.removeEventListener('pointerenter', enter); w.removeEventListener('pointerleave', leave); });
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
                {s.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div ref={card} className="sl-card" aria-hidden>
        {SHOTS.map(p => (
          <div key={p.slug} data-shot={p.slug} className={p.device === 'phone' ? 'is-phone' : undefined} hidden>
            <Image src={p.device === 'phone' ? p.mobile! : p.desktop} alt="" fill sizes="260px" />
          </div>
        ))}
        <figcaption />
      </div>
    </section>
  );
}
