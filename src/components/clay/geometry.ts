import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type ClayKind = 'blob' | 'flower' | 'knot';
export const CLAY_COLORS: Record<ClayKind, string> = { blob: '#F4B9C6', flower: '#A9B4F5', knot: '#A8D5BA' };

/** Soft studio matcap painted on a canvas: baked lighting, no lights in the scene. */
let matcap: THREE.Texture | null = null;
export function getMatcap() {
  if (matcap) return matcap;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#5c5a60';
  g.fillRect(0, 0, 256, 256);
  const body = g.createRadialGradient(100, 92, 8, 128, 128, 132);
  body.addColorStop(0, '#ffffff');
  body.addColorStop(0.35, '#eeeaf0');
  body.addColorStop(0.75, '#b9b4bd');
  body.addColorStop(1, '#6f6b74');
  g.fillStyle = body;
  g.beginPath(); g.arc(128, 128, 128, 0, Math.PI * 2); g.fill();
  // warm bounce light from below, like a clay object on a table
  const bounce = g.createRadialGradient(150, 230, 4, 150, 230, 90);
  bounce.addColorStop(0, 'rgba(255,236,224,0.55)');
  bounce.addColorStop(1, 'rgba(255,236,224,0)');
  g.fillStyle = bounce; g.fillRect(0, 0, 256, 256);
  matcap = new THREE.CanvasTexture(c);
  matcap.colorSpace = THREE.SRGBColorSpace;
  return matcap;
}

export function makeGeometry(kind: ClayKind): THREE.BufferGeometry {
  if (kind === 'knot') return new THREE.TorusKnotGeometry(0.62, 0.25, 140, 18, 2, 3);
  if (kind === 'flower') {
    const s = new THREE.Shape();
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const r = 0.62 + 0.36 * Math.pow(Math.abs(Math.cos(3 * t)), 0.7); // six round petals
      const p = [Math.cos(t) * r, Math.sin(t) * r] as const;
      if (i === 0) s.moveTo(...p); else s.lineTo(...p);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.16, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.16, bevelSegments: 6, curveSegments: 12 });
    g.center();
    return g;
  }
  // blob: icosphere pushed out by a few low-frequency sines, smooth normals
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, 4);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 1 + 0.16 * Math.sin(2.1 * v.x + 1.3) * Math.sin(1.7 * v.y + 0.4) + 0.12 * Math.sin(2.6 * v.z + 2.1) * Math.cos(1.4 * v.x) ;
    v.multiplyScalar(n);
    v.y *= 0.82;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}
