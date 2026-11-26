'use client';
// Hero showreel: real screen recordings of the 11 projects (tools/reel.mjs + tools/reel-build.py), looping in a browser
// frame on desktop and a phone frame (9:16 cut) on phones. The poster is a <picture> (server-rendered, art-directed) so it
// paints first; the video only gets its sources once the page has loaded and the frame is near the viewport, and it
// pauses off-screen. Reduced motion: poster only. A chip names the project in each shot.
import { useEffect, useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import REEL from '@/content/reel.json';

const SRC = {
  desktop: [['/reel/desktop-av1.mp4', 'video/mp4; codecs="av01.0.08M.08"'], ['/reel/desktop-h264.mp4', 'video/mp4; codecs="avc1.640028"']],
  mobile: [['/reel/mobile-av1.mp4', 'video/mp4; codecs="av01.0.04M.08"'], ['/reel/mobile-h264.mp4', 'video/mp4; codecs="avc1.64001f"']],
} as const;

const chipAt = (t: number) => {
  let c = REEL.chips[0];
  for (const x of REEL.chips) if (x.t <= t) c = x;
  return c.name;
};

export function Showreel() {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [chip, setChip] = useState(REEL.chips[0].name);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current!, el = box.current!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mode = matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
    let loaded = false, visible = false, raf = 0, idle = 0;
    const tick = () => { setChip(chipAt(v.currentTime)); raf = requestAnimationFrame(tick); };
    const load = () => {
      if (loaded) return;
      loaded = true;
      for (const [src, type] of SRC[mode]) {
        const s = document.createElement('source');
        s.src = src; s.type = type;
        v.appendChild(s);
      }
      v.load();
    };
    const sync = () => { if (!loaded) return; if (visible) v.play().catch(() => {}); else v.pause(); };
    // Wait for the page's own load (poster, fonts, LCP) before pulling the video.
    const ready = () => { idle = window.setTimeout(() => { if (visible) { load(); sync(); } }, 300); };
    if (document.readyState === 'complete') ready(); else addEventListener('load', ready, { once: true });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && document.readyState === 'complete') load();
      sync();
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    const onPlay = () => { setPlaying(true); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    const onPause = () => cancelAnimationFrame(raf);
    v.addEventListener('playing', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      io.disconnect(); clearTimeout(idle); cancelAnimationFrame(raf);
      removeEventListener('load', ready);
      v.removeEventListener('playing', onPlay); v.removeEventListener('pause', onPause);
    };
  }, []);

  // Art-directed poster: desktop 16:10 frame, phones 9:16 (screen = frame - 12px bezel). Loaded eagerly: on phones it is
  // the LCP element, so sizes must be exact (a 1.75x phone then takes the 384w file, not 640w).
  const common = { alt: '', fetchPriority: 'high' as const, loading: 'eager' as const };
  const { props: { srcSet: desk } } = getImageProps({ ...common, src: '/reel/desktop-poster.webp', width: 1280, height: 800, sizes: 'min(1000px, 72vw)' });
  const { props: { srcSet: phone, ...img } } = getImageProps({ ...common, src: '/reel/mobile-poster.webp', width: 540, height: 960, sizes: 'calc(min(56vw, 240px) - 12px)' });

  return (
    <div ref={box} className="reel" aria-hidden>
      <div className="reel-tilt">
        <div className="reel-frame">
          <div className="reel-bar"><i /><i /><i /></div>
          <div className="reel-screen">
            <picture>
              <source media="(min-width: 768px)" srcSet={desk} sizes="min(1000px, 72vw)" />
              <source media="(max-width: 767px)" srcSet={phone} sizes="calc(min(56vw, 240px) - 12px)" />
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img {...img} className="reel-poster" />
            </picture>
            <video ref={video} className={playing ? 'is-on' : undefined} autoPlay muted loop playsInline preload="metadata" />
            <span className="reel-chip">{chip}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
