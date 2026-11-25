import type { Metadata } from 'next';
import Link from 'next/link';
import { GROUPS, SERVICES } from '@/content/services';
import { CONTACT, PRICING, inr } from '@/content/site';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Services: websites, Shopify, automation and AI agents',
  description: 'Thirteen services from one developer: websites, 3D sites, apps, Shopify, landing pages, WhatsApp and email automation, n8n, AI agents, scraping, SEO, payments and maintenance.',
  alternates: { canonical: '/services' },
};

export default function Services() {
  return (
    <div className="inner paper">
      <header className="inner-head">
        <Title as="p" className="display-word">Services</Title>
        <h1 className="inner-h1">Websites, automation and AI agents for Indian businesses</h1>
        <Lines className="lead">Thirteen services, one developer. Pick one, or tell me what is slowing you down and I will tell you which one fixes it.</Lines>
      </header>
      {GROUPS.map(g => (
        <Reveal as="section" key={g.name} className="svc-group" aria-labelledby={`g-${g.name}`} stagger={0.05}>
          <h2 id={`g-${g.name}`} className="svc-group-h rv">{g.name}</h2>
          <p className="rv muted">{g.line}</p>
          <div className="svc-grid">
            {SERVICES.filter(s => s.group === g.name).map(s => (
              <article key={s.slug} id={s.slug} className="svc rv">
                <span className="rv-line hair" aria-hidden />
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                {s.page
                  ? <Link className="u strong" href={`/services/${s.slug}`} data-title={s.name}>More about {s.name} →</Link>
                  : <a className="u strong" href={CONTACT.whatsapp} target="_blank" rel="noopener">Ask about {s.name} →</a>}
              </article>
            ))}
          </div>
        </Reveal>
      ))}
      <section className="block" aria-label="Starting prices">
        <p className="eyebrow">Starting prices</p>
        <ul className="price-inline">{PRICING.map(p => <li key={p.name}><b>{p.name}</b> from {inr(p.from)}{p.unit}</li>)}</ul>
      </section>
    </div>
  );
}
