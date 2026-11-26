'use client';
// 2. MANIFESTO — words fill 25% -> 100% as you scroll (start "top 75%", end "bottom 40%").
import { useRef } from 'react';
import Image from 'next/image';
import { useScrubFill } from '@/lib/motion';
import { MANIFESTO } from '@/content/site';

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  useScrubFill(ref, 'top 75%', 'bottom 40%');
  return (
    <section ref={ref} className="manifesto dark" aria-label="About me">
      <p className="eyebrow">So, who builds this?</p>
      <p className="manifesto-text">
        <span data-fill>{MANIFESTO.before}</span>{' '}
        <span className="avatar-pill" aria-hidden>
          <Image src="/media/deepanshu-cutout.webp" alt="" width={737} height={560} sizes="(max-width: 767px) 74px, 95px" />
        </span>
        <span data-fill>. {MANIFESTO.after}</span>{' '}
        <span className="is-key" data-fill>{MANIFESTO.key}</span>
      </p>
    </section>
  );
}
