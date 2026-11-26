'use client';
// Shared motion layer: plugin registration, Lenis, and the reusable hooks every section uses.
// Timings live in the call sites; defaults are here. See README "Animations".
import { RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 1 });

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const EASE = { reveal: 'expo.out', scrub: 'none', move: 'power3.inOut' } as const;
export const MQ = {
  reduced: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767px)',
  full: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
  lite: '(prefers-reduced-motion: no-preference) and (max-width: 767px)',
} as const;

const match = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches;
export const isReduced = () => match(MQ.reduced);
export const isMobile = () => match(MQ.mobile);
export const isTouch = () => match('(hover: none)');
/** Parallax / drift multiplier: x0.4 on phones. */
export const px = () => (isMobile() ? 0.4 : 1);

// ---------- Lenis ----------
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Mount once (in the root layout). Smooth scroll synced to GSAP's ticker. Off under reduced motion. */
export function useLenis() {
  useEffect(() => {
    if (isReduced()) return;
    lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 1, syncTouch: false, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => lenis?.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // Refresh trigger positions once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener('load', refresh);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToTarget(target: string | number | HTMLElement, offset = 0, immediate = false) {
  if (lenis) lenis.scrollTo(target, { offset, immediate, duration: 1.2 });
  else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    const y = typeof el === 'number' ? el : el ? el.getBoundingClientRect().top + scrollY : 0;
    window.scrollTo({ top: y + offset, behavior: immediate || isReduced() ? 'auto' : 'smooth' });
  }
}

/** Reduced-motion fallback used by every hook: a plain 0.4s fade when the element enters. */
export function fadeIn(targets: gsap.TweenTarget, trigger?: Element | null) {
  return gsap.from(targets, {
    opacity: 0, duration: 0.4, ease: 'none',
    scrollTrigger: trigger ? { trigger, start: 'top 90%', once: true } : undefined,
  });
}

// ---------- useSplitReveal ----------
type SplitOpts = {
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  rotate?: boolean; // random -4..4deg that settles to 0 (inner-page titles)
  onScroll?: boolean; // false = play on mount (hero intro)
  start?: string;
  onDone?: () => void;
};
/** Masked rise of chars / words / lines (yPercent 110 -> 0). Text stays in the server HTML; SplitText only wraps it. */
export function useSplitReveal(ref: RefObject<HTMLElement | null>, o: SplitOpts = {}) {
  const { type = 'lines', stagger = type === 'chars' ? 0.03 : 0.08, duration = 1.1, delay = 0, rotate = false, onScroll = true, start = 'top 80%', onDone } = o;
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (isReduced()) {
      gsap.set(el, { visibility: 'visible' });
      fadeIn(el, onScroll ? el : null).eventCallback('onComplete', onDone ?? null);
      return;
    }
    SplitText.create(el, {
      type: type === 'chars' ? 'words,chars' : type,
      mask: type,
      aria: 'auto',
      autoSplit: type === 'lines',
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        const parts = self[type];
        return gsap.from(parts, {
          yPercent: 110,
          rotate: rotate ? () => gsap.utils.random(-4, 4) : 0,
          duration, stagger, delay, ease: EASE.reveal,
          onComplete: onDone,
          scrollTrigger: onScroll ? { trigger: el, start, once: true } : undefined,
        });
      },
    });
  }, { scope: ref });
}

// ---------- useScrubFill ----------
/** Words fill 25% -> 100% opacity one by one as the paragraph scrolls. `.is-key` words start full. */
export function useScrubFill(ref: RefObject<HTMLElement | null>, start = 'top 75%', end = 'bottom 40%') {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (isReduced()) return void fadeIn(el, el);
    const split = SplitText.create(el.querySelectorAll('[data-fill]'), { type: 'words', aria: 'auto' });
    const words = split.words.filter(w => !w.closest('.is-key'));
    gsap.fromTo(words, { opacity: 0.25 }, {
      opacity: 1, ease: EASE.scrub, stagger: 0.1,
      scrollTrigger: { trigger: el, start, end, scrub: true },
    });
  }, { scope: ref });
}

// ---------- usePinScenes ----------
/**
 * Pins `ref` for scenes x 100vh (capped at 150vh on phones) and hands you a scrubbed timeline
 * whose duration is `scenes - 1` (one unit per scene change). Returns nothing under reduced motion.
 */
export function usePinScenes(
  ref: RefObject<HTMLElement | null>,
  scenes: number,
  build: (tl: gsap.core.Timeline, mobile: boolean) => void,
  // sticky: the element is CSS-sticky inside a parent that already holds the scroll distance; no GSAP pin, so the DOM
  // is never re-parented (no layout shift, no late LCP candidates). The parent's height must match the pin length.
  opts: { vhPerScene?: number; scrub?: number | boolean; onUpdate?: (p: number) => void; when?: string; sticky?: boolean } = {},
) {
  const { vhPerScene = 100, scrub = 1, onUpdate, when = '(prefers-reduced-motion: no-preference)', sticky = false } = opts;
  useGSAP(() => {
    const mm = gsap.matchMedia(ref.current ?? undefined);
    mm.add(when, () => {
      const mobile = isMobile();
      const vh = Math.min(scenes * vhPerScene, mobile ? 150 : Infinity);
      const tl = gsap.timeline({
        defaults: { ease: EASE.scrub },
        scrollTrigger: {
          ...(sticky
            ? { trigger: ref.current!.parentElement, start: 'top top', end: 'bottom bottom' }
            : { trigger: ref.current, start: 'top top', end: `+=${vh}%`, pin: true, anticipatePin: 1 }),
          scrub, onUpdate: onUpdate ? s => onUpdate(s.progress) : undefined,
        },
      });
      build(tl, mobile);
    });
  }, { scope: ref });
}

// ---------- useMagnetic ----------
/** Element drifts toward the pointer while hovered (strength x offset from centre). Mouse only. */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isReduced() || isTouch()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [strength]);
  return ref;
}

// ---------- useVelocityCarousel ----------
/**
 * Infinite carousel position driven by wheel / drag / scroll velocity.
 * pos lerps toward target (friction 0.9), and snaps to the nearest item after 160ms idle.
 * `render(pos)` is called on every tick the position changes; `push(delta)` adds input in item units.
 */
export function useVelocityCarousel(count: number, render: (pos: number) => void, friction = 0.9) {
  const state = useRef({ pos: 0, target: 0, last: NaN, idle: 0 });
  const renderRef = useRef(render);
  useEffect(() => { renderRef.current = render; });
  useEffect(() => {
    const s = state.current;
    const tick = () => {
      if (performance.now() - s.idle > 160) s.target = Math.round(s.target);
      s.pos += (s.target - s.pos) * (1 - friction);
      if (Math.abs(s.target - s.pos) < 0.0005) s.pos = s.target;
      if (s.pos !== s.last) { s.last = s.pos; renderRef.current(s.pos); }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [count, friction]);
  return {
    state,
    push(delta: number) { state.current.target += delta; state.current.idle = performance.now(); },
    goTo(index: number) { const s = state.current; s.target = s.target + gsap.utils.wrap(-count / 2, count / 2, index - s.target); s.idle = 0; },
  };
}

/** Wrapped distance of item i from position pos, in (-count/2, count/2]. */
export const wrapDist = (i: number, pos: number, count: number) => gsap.utils.wrap(-count / 2, count / 2, i - pos);
