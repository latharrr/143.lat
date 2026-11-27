'use client';
// 5. BIG SERVICE LIST — the word nearest the viewport centre darkens (scrubbed per word).
// Desktop hover takes over: the hovered word is the bold one and a preview card (the service's real projects) glides
// to the side of that row. Leaving a word clears both; leaving the list hands the bold back to scroll.
// Phones (no hover): tapping a row that has projects opens its preview inline below it; tapping again closes it.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, isReduced, isTouch, fadeIn } from '@/lib/motion';
import { LIST_ORDER, SERVICE_PROJECTS, getService, serviceHref } from '@/content/services';
import { getProject } from '@/content/work';
import { Clip, useClips } from '@/components/ui/Clip';

// Preview per service: the projects that demonstrate it (cycled while hovered). No project = no preview.
const SHOTS = [...new Set(Object.values(SERVICE_PROJECTS).flat())].map(getProject);

export function ServiceList() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const mq = matchMedia('(max-width: 767px)');
    const on = () => { setPhone(mq.matches); if (!mq.matches) setOpen(null); };
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Previews loop their project's screen recording; a clip plays only while its preview is shown (hidden ones are
  // display:none, closed accordions have no height). Re-scan when the phone accordions render.
  useClips(root, undefined, phone);

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
    // Card anchor (CSS margins: card left = x + 24, vertical centre = y): right of the row's text, else left of it,
    // else tucked inside the right edge when the word spans the whole width.
    let hot: HTMLElement | null = null;
    const place = (instant = false) => {
      if (!hot) return;
      const r = hot.getBoundingClientRect(), cw = c.offsetWidth;
      const right = r.right + 24 + cw <= innerWidth - 16, left = r.left - 24 - cw >= 16;
      const x = right ? r.right : left ? r.left - cw - 48 : innerWidth - cw - 40;
      const y = r.top + r.height / 2;
      if (instant) gsap.set(c, { x, y }); else { xTo(x); yTo(y); }
      rTo(right || !left ? 3 : -3);
    };
    const onScroll = () => place(true);
    let cycle = 0;
    const show = (slug: string) => {
      c.querySelectorAll<HTMLElement>('[data-shot]').forEach(el => (el.hidden = el.dataset.shot !== slug));
      c.querySelector('figcaption')!.textContent = getProject(slug).name;
    };
    // Hide, then drop the image, so a previous preview can never linger on a row without one.
    const clear = () => c.querySelectorAll<HTMLElement>('[data-shot]').forEach(el => (el.hidden = true));
    const leave = (e?: PointerEvent) => { (e?.currentTarget as HTMLElement | undefined)?.classList.remove('is-hot'); hot = null; removeEventListener('scroll', onScroll); clearInterval(cycle); gsap.to(c, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto', onComplete: clear }); };
    const enter = (e: PointerEvent) => {
      const w = e.currentTarget as HTMLElement;
      words.forEach(o => o.classList.toggle('is-hot', o === w));
      listEl.classList.add('is-hover');
      const list = SERVICE_PROJECTS[w.dataset.slug!] ?? [];
      clearInterval(cycle);
      if (!list.length) return leave();
      const fresh = +gsap.getProperty(c, 'opacity') < 0.05; // appearing: jump to the row; moving between rows: glide
      hot = w; place(fresh);
      addEventListener('scroll', onScroll, { passive: true });
      let k = 0;
      show(list[0]);
      if (list.length > 1) cycle = window.setInterval(() => show(list[(k = (k + 1) % list.length)]), 1400);
      gsap.to(c, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
    };
    const listEl = root.current!.querySelector<HTMLElement>('.sl-list')!;
    const out = () => { listEl.classList.remove('is-hover'); words.forEach(o => o.classList.remove('is-hot')); leave(); };
    listEl.addEventListener('pointerleave', out);
    words.forEach(w => { w.addEventListener('pointerenter', enter); w.addEventListener('pointerleave', leave); });
    return () => {
      clearInterval(cycle);
      removeEventListener('scroll', onScroll);
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
          const projects = (SERVICE_PROJECTS[slug] ?? []).map(getProject);
          const acc = phone && projects.length > 0; // phones: the row toggles an inline preview instead of navigating
          const isOpen = acc && open === slug;
          return (
            <li key={slug}>
              <Link className="sl-item" href={serviceHref(s)} data-slug={slug} data-title={s.name}
                aria-expanded={acc ? isOpen : undefined} aria-controls={acc ? `sl-acc-${slug}` : undefined}
                onClick={acc ? e => { e.preventDefault(); setOpen(isOpen ? null : slug); } : undefined}>
                {s.name}
              </Link>
              {acc && (
                <div id={`sl-acc-${slug}`} className="sl-acc" data-open={isOpen || undefined} inert={!isOpen}>
                  <div>
                    <div className="sl-acc-shots">
                      {projects.slice(0, 2).map(p => (
                        <figure key={p.slug} className={p.device === 'phone' ? 'is-phone' : undefined}>
                          <span><Clip kind={p.device === 'phone' ? 'port' : 'land'} slug={p.slug} /></span>
                          <figcaption>{p.name}</figcaption>
                        </figure>
                      ))}
                    </div>
                    <Link href={serviceHref(s)} className="sl-acc-link u strong">More about {s.name} →</Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div ref={card} className="sl-card" aria-hidden>
        {SHOTS.map(p => (
          <div key={p.slug} data-shot={p.slug} className={p.device === 'phone' ? 'is-phone' : undefined} hidden>
            <Clip kind={p.device === 'phone' ? 'port' : 'land'} slug={p.slug} />
          </div>
        ))}
        <figcaption />
      </div>
    </section>
  );
}
