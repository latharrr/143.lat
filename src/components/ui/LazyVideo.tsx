'use client';
import { useEffect, useRef } from 'react';

/** Muted loop that only downloads and plays while on screen. WebM first, MP4 fallback, poster always. */
export function LazyVideo({ name, className, label }: { name: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // poster only
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { rootMargin: '100px' });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className={className} muted loop playsInline preload="none" poster={`/media/${name}-poster.jpg`} aria-label={label}>
      <source src={`/media/${name}.webm`} type="video/webm" />
      <source src={`/media/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
