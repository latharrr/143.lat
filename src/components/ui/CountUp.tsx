'use client';
import { useRef } from 'react';
import { gsap, useGSAP, isReduced } from '@/lib/motion';

/** Counts 0 → `to` once when it enters the viewport. Server HTML already holds the final value. An invisible copy of the
 *  final value fixes the box width and the count is left-aligned in it, so nothing moves while it counts (no layout shift). */
export function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    if (isReduced()) return;
    const n = { v: 0 };
    el.textContent = `0${suffix}`; // below the fold at mount, so the reset is never seen
    gsap.to(n, {
      v: to, duration: 1.6, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = `${Math.round(n.v)}${suffix}`; },
    });
  }, { scope: root });
  return (
    <span ref={root} className="count-up">
      <span aria-hidden className="cu-size">{to}{suffix}</span>
      <span ref={ref}>{to}{suffix}</span>
    </span>
  );
}
