'use client';
import { useRef } from 'react';
import ClayCanvas from '@/components/clay/ClayCanvas';
import type { ClayKind } from '@/components/clay/geometry';

const TILT: Record<ClayKind, [number, number, number]> = { blob: [0.4, 0.2, 0], flower: [0.35, -0.5, 0.2], knot: [0.5, 0.3, 0.2] };
export function ClayRender({ kind }: { kind: ClayKind }) {
  const p = useRef(0);
  return (
    <div id="clay-render" style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'transparent' }}>
      <ClayCanvas items={[{ kind, at: [0, 0], size: 0.38, tilt: TILT[kind], bob: 1e9 }]} progress={p} parallax={false} />
    </div>
  );
}
