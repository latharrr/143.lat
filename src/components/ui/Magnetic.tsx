'use client';
import { cloneElement, ReactElement, Ref } from 'react';
import { useMagnetic } from '@/lib/motion';

/** Wraps one child element and makes it magnetic on hover (strength 0.3). */
export function Magnetic({ children, strength = 0.3 }: { children: ReactElement<{ ref?: Ref<HTMLElement> }>; strength?: number }) {
  const ref = useMagnetic<HTMLElement>(strength);
  return cloneElement(children, { ref });
}
