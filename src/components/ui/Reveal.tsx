'use client';
import { ElementType, ReactNode, useRef } from 'react';
import { gsap, useGSAP, useSplitReveal, isReduced, fadeIn, EASE } from '@/lib/motion';

/** Children marked .rv fade up with a stagger when the block is 80% into view; hairlines (.rv-line) draw left to right. */
export function Reveal({ as: Tag = 'div', className, children, stagger = 0.08, ...rest }: { as?: ElementType; className?: string; children: ReactNode; stagger?: number; id?: string; 'aria-labelledby'?: string; 'aria-label'?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    const items = el.querySelectorAll('.rv');
    const lines = el.querySelectorAll('.rv-line');
    if (isReduced()) return void fadeIn([...items, ...lines], el);
    const st = { trigger: el, start: 'top 80%', once: true };
    if (items.length) gsap.from(items, { y: 40, opacity: 0, duration: 1, stagger, ease: EASE.reveal, scrollTrigger: st });
    if (lines.length) gsap.from(lines, { scaleX: 0, transformOrigin: '0 50%', duration: 1.2, stagger, ease: EASE.reveal, scrollTrigger: st });
  }, { scope: ref });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}

/** Paragraph / heading revealed line by line from a mask (yPercent 100 -> 0, stagger 0.08). */
export function Lines({ as: Tag = 'p', className, children, rotate }: { as?: ElementType; className?: string; children: ReactNode; rotate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useSplitReveal(ref, { type: 'lines', stagger: 0.08, start: 'top 80%', rotate });
  return <Tag ref={ref} className={`intro-hide ${className ?? ''}`}>{children}</Tag>;
}

/** Display title: letters rise from a mask with a small random rotation that settles to 0. */
export function Title({ as: Tag = 'h1', className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useSplitReveal(ref, { type: 'chars', stagger: 0.04, duration: 1.2, onScroll: false, rotate: true, delay: 0.2 });
  return <Tag ref={ref} className={`intro-hide ${className ?? ''}`}>{children}</Tag>;
}
