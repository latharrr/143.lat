'use client';
import dynamic from 'next/dynamic';
import { MutableRefObject, useEffect, useState } from 'react';
import type { ClayItem } from './ClayCanvas';

const ClayCanvas = dynamic(() => import('./ClayCanvas'), { ssr: false });

/**
 * Static PNG renders first (and forever on phones / reduced motion); the live R3F canvas
 * is mounted after the page has loaded and gone idle, then the PNGs fade out.
 */
export function Clay({ items, progress, spinWithProgress, parallax, className = '', eager }: {
  items: ClayItem[]; progress: MutableRefObject<number>; spinWithProgress?: boolean; parallax?: boolean; className?: string; eager?: boolean; // eager: above the fold
}) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)').matches) return;
    const go = () => ('requestIdleCallback' in window ? requestIdleCallback(() => setLive(true), { timeout: 2000 }) : setTimeout(() => setLive(true), 300));
    if (document.readyState === 'complete') go();
    else addEventListener('load', go, { once: true });
  }, []);
  return (
    <div className={`clay ${className}`} data-live={live || undefined} aria-hidden>
      {items.map((it, i) => (
        // Fallback image placed where the mesh sits; size matches the mesh's viewport-height scale.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} className="clay-png" data-clay={it.kind} src={`/clay/${it.kind}.webp`} alt="" width={256} height={256} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async"
          style={{ left: `${(it.at[0] + 0.5) * 100}%`, top: `${(0.5 - it.at[1]) * 100}%`, ['--s' as string]: it.size * 2.6 }} />
      ))}
      {live && <ClayCanvas items={items} progress={progress} spinWithProgress={spinWithProgress} parallax={parallax} />}
    </div>
  );
}
export type { ClayItem };
