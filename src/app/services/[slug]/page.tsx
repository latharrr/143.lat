import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { SERVICES, SERVICE_PROJECTS, getService, type Service } from '@/content/services';
import { getWork, getProject, projectLink } from '@/content/work';
import { CONTACT, PRICING, SITE, inr } from '@/content/site';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';
import { Diamond } from '@/components/inner/Inner';
import { Faq, faqJsonLd } from '@/components/home/Blocks';
import { Magnetic } from '@/components/ui/Magnetic';

type P = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => SERVICES.map(s => ({ slug: s.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  if (!s.page) return { title: s.name, description: s.short, alternates: { canonical: `/services/${s.slug}` } };
  return {
    title: { absolute: s.page.metaTitle },
    description: s.page.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: s.page.metaTitle, description: s.page.metaDescription, url: `/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: P) {
  const s = getService((await params).slug);
  if (!s) notFound();
  if (!s.page) return <ShortService s={s} />;
  const p = s.page;
  const price = PRICING.find(x => x.name === p.priceKey)!;
  const work = p.caseStudy.work ? getWork(p.caseStudy.work) : undefined;
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'Service', name: p.h1, serviceType: s.name, description: p.metaDescription,
      provider: { '@id': `${SITE.url}/#business` }, areaServed: 'IN', url: `${SITE.url}/services/${s.slug}`,
      offers: { '@type': 'Offer', priceCurrency: 'INR', price: price.from, description: `Starting from ${inr(price.from)}` },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE.url}/services` },
        { '@type': 'ListItem', position: 3, name: s.name, item: `${SITE.url}/services/${s.slug}` },
      ],
    },
    faqJsonLd(p.faq),
  ];
  return (
    <div className="inner paper">
      <header className="inner-head">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/services" data-title="Services">Services</Link> / <span>{s.name}</span></nav>
        <Title as="p" className="display-word">{s.name.split(' ')[0]}</Title>
        <h1 className="inner-h1">{p.h1}</h1>
        <div className="btn-row">
          <Magnetic><a className="btn btn-dark" href={CONTACT.cal} target="_blank" rel="noopener">Book a free call</a></Magnetic>
          <Magnetic><a className="btn btn-line" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp me</a></Magnetic>
        </div>
      </header>

      <article className="prose">
        <section aria-label="The problem">
          {p.intro.map((t, i) => <Lines key={i}>{t}</Lines>)}
        </section>
        <Diamond />
        <Reveal as="section" aria-labelledby="get">
          <h2 id="get" className="rv">What you get</h2>
          <ul className="ticks">{p.deliverables.map(d => <li key={d} className="rv">{d}</li>)}</ul>
        </Reveal>
        {p.sections.map(sec => (
          <section key={sec.h2}>
            <Diamond />
            <h2>{sec.h2}</h2>
            {sec.body.map((t, i) => <Lines key={i}>{t}</Lines>)}
          </section>
        ))}
        <Diamond />
        <section aria-labelledby="case" className="case-card">
          <p className="eyebrow">Case study</p>
          <h2 id="case">{p.caseStudy.title}</h2>
          <Lines>{p.caseStudy.body}</Lines>
          {work && <Link className="u strong" href={`/work/${work.slug}`} data-title={work.word}>Read the {work.title} case study →</Link>}
        </section>
        <Diamond />
        <Reveal as="section" aria-labelledby="how">
          <h2 id="how" className="rv">How we’ll work</h2>
          <ol className="steps">{p.process.map(x => <li key={x} className="rv">{x}</li>)}</ol>
        </Reveal>
        <Diamond />
        <section aria-labelledby="price" className="price-card">
          <h2 id="price">Starting price</h2>
          <p className="price-n"><small>from</small> {inr(price.from)}<small>{price.unit}</small></p>
          <p>{price.note} The exact price is fixed in a written proposal within 48 hours of our call.</p>
        </section>
      </article>
      <Faq items={p.faq} title={`${s.name}: common questions`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}

// Services without a long-form page: what it is, the projects that show it, a starting price and a call to action.
function ShortService({ s }: { s: Service }) {
  const price = PRICING.find(x => x.name === s.priceKey);
  const seen = (SERVICE_PROJECTS[s.slug] ?? []).map(getProject);
  return (
    <div className="inner paper">
      <header className="inner-head">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/services" data-title="Services">Services</Link> / <span>{s.name}</span></nav>
        <Title as="p" className="display-word">{s.name.split(' ')[0]}</Title>
        <h1 className="inner-h1">{s.name}</h1>
        <Lines className="lead">{s.short}</Lines>
        <div className="btn-row">
          <Magnetic><a className="btn btn-dark" href={CONTACT.cal} target="_blank" rel="noopener">Book a free call</a></Magnetic>
          <Magnetic><a className="btn btn-line" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp me</a></Magnetic>
        </div>
      </header>
      <article className="prose">
        {seen.length > 0 && (
          <Reveal as="section" aria-labelledby="seen">
            <h2 id="seen" className="rv">Where you can see it</h2>
            <ul className="work-grid">
              {seen.map(p => {
                const l = projectLink(p);
                return (
                  <li key={p.slug} className="rv">
                    <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})} className="work-card" data-cursor="View">
                      <span className="work-thumb">
                        <Image src={p.desktop} alt="" fill sizes="(max-width: 767px) 100vw, 40vw" />
                        {p.recreated && <span className="tag-recreated">Recreated UI</span>}
                      </span>
                      <h3>{p.name}</h3>
                      <p>{p.oneLine}</p>
                      <span className="u strong">{l.label} {l.external ? '↗' : '→'}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
        <Diamond />
        <section aria-labelledby="price" className="price-card">
          <h2 id="price">Starting price</h2>
          {price
            ? <><p className="price-n"><small>from</small> {inr(price.from)}<small>{price.unit}</small></p><p>{price.note} The exact price is fixed in a written proposal within 48 hours of our call.</p></>
            : <p>Quoted on a call, then fixed in a written proposal within 48 hours.</p>}
        </section>
      </article>
    </div>
  );
}
