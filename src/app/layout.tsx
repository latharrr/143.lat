import type { Metadata, Viewport } from 'next';
import { Poppins, Gloock } from 'next/font/google';
import { Shell } from '@/components/shell/Shell';
import { Footer } from '@/components/shell/Footer';
import { CONTACT, SITE } from '@/content/site';
import { SERVICES } from '@/content/services';
import './globals.css';

const sans = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-sans', display: 'swap' });
const serif = Gloock({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: '%s | Deepanshu Lathar' },
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_IN', url: SITE.url },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#161616', width: 'device-width', initialScale: 1 };

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: SITE.name,
      url: SITE.url,
      image: `${SITE.url}/media/deepanshu.jpg`,
      jobTitle: 'Freelance developer: websites, automation and AI agents',
      email: `mailto:${CONTACT.email}`,
      sameAs: [CONTACT.linkedin, CONTACT.github],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.url}/#business`,
      name: `${SITE.name} — websites, automation and AI agents`,
      url: SITE.url,
      founder: { '@id': `${SITE.url}/#person` },
      areaServed: 'IN',
      address: { '@type': 'PostalAddress', addressLocality: 'Delhi', addressCountry: 'IN' },
      telephone: '+918221016809',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: SERVICES.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, description: s.short } })),
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Hide intro-animated text only when JS + motion are on; CSS failsafe reveals it after 2.5s. */}
        <script dangerouslySetInnerHTML={{ __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Shell />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
