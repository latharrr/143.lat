'use client';
// Looping project clip (tools/cards.mjs + tools/cards-build.py, public/cards/): a lazy poster image under a muted video
// that loads nothing until useClips plays it. AV1 first, H.264 fallback.
import { useEffect, useRef, type RefObject } from 'react';

// land / port: hero cards and the service-list preview; lg / tall: the Selected work carousel (laptop / phone screen).
export type ClipKind = 'land' | 'port' | 'lg' | 'tall';
const DIM: Record<ClipKind, [number, number]> = { land: [600, 380], port: [340, 600], lg: [1056, 660], tall: [400, 866] };

export function Clip({ kind, slug }: { kind: ClipKind; slug: string }) {
  const f = `/cards/${kind}-${slug}`;
  const [w, h] = DIM[kind];
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="clip-poster" src={`${f}.webp`} alt="" width={w} height={h} loading="lazy" decoding="async" draggable={false} />
      <video className="clip-video" muted loop playsInline preload="none" aria-hidden tabIndex={-1}>
        <source src={`${f}-av1.mp4`} type='video/mp4; codecs="av01.0.05M.08"' />
        <source src={`${f}-h264.mp4`} type='video/mp4; codecs="avc1.64001f"' />
      </video>
    </>
  );
}

/**
 * Plays every clip under `root` while it is on screen (after window load) and pauses it off-screen or when the tab is
 * hidden. `active` can veto a clip (the carousel plays only its centred project); it is re-checked after every render.
 * Clips start at staggered points of their loop. Reduced motion: posters only, no video requests.
 * `rescan`: change it when clips are added or removed (e.g. markup that only renders on phones).
 */
export function useClips(root: RefObject<HTMLElement | null>, active?: (v: HTMLVideoElement) => boolean, rescan?: unknown) {
  const sync = useRef<() => void>(() => {});
  const ok = useRef(active);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const vids = [...root.current!.querySelectorAll<HTMLVideoElement>('video.clip-video')];
    const seen = new Map<HTMLVideoElement, boolean>();
    let ready = false, timer = 0;
    const one = (v: HTMLVideoElement) => {
      if (ready && seen.get(v) && !document.hidden && (ok.current?.(v) ?? true)) v.play().catch(() => {});
      else v.pause();
    };
    sync.current = () => vids.forEach(one);
    vids.forEach((v, i) => {
      v.addEventListener('loadedmetadata', () => { v.currentTime = (i * 0.83) % (v.duration || 5); }, { once: true });
      v.addEventListener('playing', () => v.classList.add('is-on'), { once: true });
    });
    const io = new IntersectionObserver(es => es.forEach(e => { seen.set(e.target as HTMLVideoElement, e.isIntersecting); one(e.target as HTMLVideoElement); }));
    vids.forEach(v => io.observe(v));
    const go = () => { timer = window.setTimeout(() => { ready = true; sync.current(); }, 400); };
    if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
    const vis = () => sync.current();
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect(); clearTimeout(timer); removeEventListener('load', go); document.removeEventListener('visibilitychange', vis);
      vids.forEach(v => v.pause()); sync.current = () => {};
    };
  }, [root, rescan]);
  useEffect(() => { ok.current = active; sync.current(); });
}
