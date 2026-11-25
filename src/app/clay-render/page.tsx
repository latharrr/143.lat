// Dev-only: renders one clay object on a transparent canvas so tools/clay-png.mjs can bake the PNG fallbacks.
import { notFound } from 'next/navigation';
import { ClayRender } from './ClayRender';

export default async function Page({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound();
  const k = (await searchParams).k;
  if (k !== 'blob' && k !== 'flower' && k !== 'knot') notFound();
  return <ClayRender kind={k} />;
}
