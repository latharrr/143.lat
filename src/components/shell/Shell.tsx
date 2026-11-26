'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger, useGSAP, useLenis, getLenis, isReduced, isTouch, scrollToTarget, EASE, useMagnetic } from '@/lib/motion';
import { CONTACT, NAV } from '@/content/site';

/** Global chrome: Lenis, header, full-screen menu, cursor and page transitions. */
export function Shell() {
  useLenis();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      <Header open={open} onMenu={() => setOpen(o => !o)} />
      <Menu open={open} onClose={() => setOpen(false)} />
      <Cursor />
      <PageTransition />
    </>
  );
}

// ---------- Header: hides on scroll down, shows on scroll up ----------
function Header({ open, onMenu }: { open: boolean; onMenu: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const cta = useMagnetic<HTMLAnchorElement>(0.3);
  useGSAP(() => {
    const show = gsap.quickTo(ref.current, 'yPercent', { duration: 0.4, ease: EASE.move });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: s => show(s.direction === 1 && s.scroll() > 120 ? -150 : 0),
    });
  });
  return (
    <header ref={ref} className="hdr" data-open={open || undefined}>
      <Link href="/" className="hdr-logo" data-title="Home" aria-label="Deepanshu Lathar, home">
        <span aria-hidden>DL</span>
      </Link>
      <button className="hdr-menu" onClick={onMenu} aria-expanded={open} aria-controls="menu">
        <span className="hdr-burger" aria-hidden><i /><i /></span>
        {open ? 'Close' : 'Menu'}
      </button>
      <a ref={cta} className="hdr-cta" href={CONTACT.cal} target="_blank" rel="noopener">Book a call</a>
    </header>
  );
}

// ---------- Menu: panel wipes down (clip-path), links rise with stagger ----------
function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  useGSAP(() => {
    const rm = isReduced();
    tl.current = gsap.timeline({ paused: true })
      .set(ref.current, { visibility: 'visible' })
      .fromTo(ref.current, rm ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' },
        rm ? { opacity: 1, duration: 0.4 } : { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: EASE.move })
      .from('.menu-link > span', rm ? { opacity: 0, duration: 0.3 } : { yPercent: 110, stagger: 0.06, duration: 0.9, ease: EASE.reveal }, rm ? 0 : 0.3)
      .from('.menu-foot', { opacity: 0, duration: 0.4 }, '<0.2');
  }, { scope: ref });
  useEffect(() => {
    if (!tl.current) return;
    const lenis = getLenis();
    if (open) { tl.current.timeScale(1).play(); lenis?.stop(); }
    else { tl.current.timeScale(1.6).reverse(); lenis?.start(); }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);
  return (
    <div ref={ref} id="menu" className="menu" aria-hidden={!open} inert={!open}>
      <nav aria-label="Main">
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className="menu-link" data-title={n.label}><span>{n.label}</span></Link>
        ))}
      </nav>
      <div className="menu-foot">
        <a href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
        <a href={`mailto:${CONTACT.email}`}>Email</a>
        <a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        <a href={CONTACT.github} target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  );
}

// ---------- Cursor: small dot that grows into a "View" label over [data-cursor] ----------
function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch() || isReduced()) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    let label = '';
    const move = (e: PointerEvent) => {
      x(e.clientX); y(e.clientY);
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      const next = t?.dataset.cursor ?? '';
      if (next !== label) {
        label = next;
        el.dataset.label = next;
        gsap.to(el, { scale: next ? 1 : 0.18, duration: 0.4, ease: EASE.reveal });
      }
      el.style.opacity = '1';
    };
    gsap.set(el, { scale: 0.18 });
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div ref={ref} className="cursor" aria-hidden />;
}

// ---------- Page transitions: curtain (0.6s power3.inOut) showing the next page's title ----------
function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<string | null>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest('a');
      // aria-expanded links are disclosure toggles (phone service-list rows): their own handler decides.
      if (!a || a.target || a.hasAttribute('download') || a.hasAttribute('aria-expanded')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      if (url.pathname === location.pathname) {
        // Same page: smooth scroll to the hash, or to the top.
        if (url.hash) { scrollToTarget(url.hash, -80); history.replaceState(null, '', url.hash); }
        else scrollToTarget(0);
        return;
      }
      const href = url.pathname + url.search + url.hash;
      pending.current = href;
      if (isReduced()) return router.push(href);
      if (title.current) title.current.textContent = a.dataset.title || a.textContent?.trim().slice(0, 40) || '';
      gsap.timeline()
        .set(ref.current, { visibility: 'visible', yPercent: 100 })
        .to(ref.current, { yPercent: 0, duration: 0.6, ease: EASE.move })
        .fromTo(title.current, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: EASE.reveal }, 0.25)
        .add(() => router.push(href));
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [router]);

  useEffect(() => {
    if (pending.current === null) return;
    const hash = pending.current.split('#')[1];
    pending.current = null;
    // New page has rendered: jump to top (or hash) and lift the curtain.
    getLenis()?.resize();
    scrollToTarget(hash ? `#${hash}` : 0, hash ? -80 : 0, true);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    if (isReduced()) return;
    gsap.timeline({ delay: 0.15 })
      .to(title.current, { yPercent: -110, duration: 0.4, ease: EASE.move })
      .to(ref.current, { yPercent: -100, duration: 0.6, ease: EASE.move }, 0.1)
      .set(ref.current, { visibility: 'hidden' });
  }, [pathname]);

  return (
    <div ref={ref} className="curtain-overlay" aria-hidden>
      <span className="curtain-title-mask"><span ref={title} className="curtain-title" /></span>
    </div>
  );
}
