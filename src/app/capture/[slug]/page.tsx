// Dev-only: recreated UI screens for internal projects, captured by tools/shots.mjs into public/work/<slug>/.
// Real structure, anonymised values. Not linked, noindex, not in the sitemap, 404 in production.
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SCREENS } from './Screens';
import './capture.css';

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const generateStaticParams = () => Object.keys(SCREENS).map(slug => ({ slug }));

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound();
  const Screen = SCREENS[(await params).slug as keyof typeof SCREENS];
  if (!Screen) notFound();
  return <Screen />;
}
