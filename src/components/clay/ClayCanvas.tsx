'use client';
// Loaded lazily by <Clay>; never part of the first paint.
import { useEffect, useMemo, useRef, useState, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ClayKind, CLAY_COLORS, getMatcap, makeGeometry } from './geometry';

export type ClayItem = {
  kind: ClayKind;
  at: [number, number]; // position as a fraction of the viewport, centre = [0, 0]
  size: number; // fraction of viewport height
  drift?: number; // vh to drift up over the scrubbed progress
  bob?: number; // seconds per float cycle (4-6)
  tilt?: [number, number, number];
};

type Props = {
  items: ClayItem[];
  progress: MutableRefObject<number>; // 0..1 from the section's ScrollTrigger
  spinWithProgress?: boolean; // knot on the services stage: 360deg over the pin
  parallax?: boolean;
};

function ClayMesh({ item, progress, spinWithProgress, mouse }: { item: ClayItem; progress: Props['progress']; spinWithProgress?: boolean; mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => makeGeometry(item.kind), [item.kind]);
  const mat = useMemo(() => new THREE.MeshMatcapMaterial({ matcap: getMatcap(), color: CLAY_COLORS[item.kind] }), [item.kind]);
  const { viewport, size } = useThree();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const unit = viewport.height / size.height; // world units per CSS px
    const vh = viewport.height / 100;
    const bob = Math.sin((t / (item.bob ?? 5)) * Math.PI * 2 + phase) * 6 * unit;
    m.position.set(
      item.at[0] * viewport.width + mouse.x * unit,
      item.at[1] * viewport.height + bob + (item.drift ?? 0) * vh * progress.current - mouse.y * unit,
      0,
    );
    const s = item.size * viewport.height;
    m.scale.setScalar(s);
    const [tx, ty, tz] = item.tilt ?? [0.4, 0.2, 0];
    if (spinWithProgress) {
      m.rotation.set(tx + 0.3, ty + progress.current * Math.PI * 2, tz);
    } else {
      m.rotation.set(tx + Math.sin(t * 0.2 + phase) * 0.25, ty + t * 0.18, tz + Math.cos(t * 0.15) * 0.1);
    }
  });
  return <mesh ref={ref} geometry={geo} material={mat} />;
}

export default function ClayCanvas({ items, progress, spinWithProgress, parallax = true }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const mouse = useMemo(() => ({ x: 0, y: 0 }), []);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    if (!parallax) return () => io.disconnect();
    // 15px toward the cursor, eased over 0.6s
    const xTo = gsap.quickTo(mouse, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(mouse, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => { xTo((e.clientX / innerWidth - 0.5) * 30); yTo((e.clientY / innerHeight - 0.5) * 30); };
    addEventListener('pointermove', move);
    return () => { io.disconnect(); removeEventListener('pointermove', move); };
  }, [mouse, parallax]);
  return (
    <div ref={wrap} className="clay-canvas">
      <Canvas
        frameloop={visible ? 'always' : 'demand'}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 35, position: [0, 0, 10] }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {items.map((it, i) => <ClayMesh key={i} item={it} progress={progress} spinWithProgress={spinWithProgress} mouse={mouse} />)}
      </Canvas>
    </div>
  );
}
