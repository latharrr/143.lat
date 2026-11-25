'use client';
import { useEffect, useState } from 'react';

/** Current year, read on the client after mount so the prerendered page never goes stale. */
export function Year() {
  const [year, setYear] = useState<number>();
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span>{year}</span>;
}
