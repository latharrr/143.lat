// 7–9 + FAQ: process, pricing, proof and FAQ blocks (server components with light reveals).
import Link from 'next/link';
import { Reveal, Lines } from '@/components/ui/Reveal';
import { CONTACT, FAQ, PRICING, PROCESS, PROOF, inr } from '@/content/site';
import { CountUp } from '@/components/ui/CountUp';

export function Process() {
  return (
    <Reveal as="section" className="block process" aria-label="Process">
      <p className="eyebrow rv">How it works</p>
      <Lines as="h2" className="block-title" >Five steps. No surprises.</Lines>
      <ol className="process-list">
        {PROCESS.map((p, i) => (
          <li key={p.title} className="rv">
            <span className="rv-line hair" aria-hidden />
            <span className="process-n">0{i + 1}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

export function Pricing() {
  return (
    <Reveal as="section" className="block pricing" aria-label="Pricing" id="pricing">
      <p className="eyebrow rv">Pricing</p>
      <Lines as="h2" className="block-title">Starting from. Fixed once we agree scope.</Lines>
      <div className="price-grid">
        {PRICING.map(p => (
          <article key={p.name} className="price rv">
            <h3>{p.name}</h3>
            <p className="price-n"><small>from</small> {inr(p.from)}<small>{p.unit}</small></p>
            {'alt' in p && <p className="price-alt">{p.alt}</p>}
            <p>{p.note}</p>
          </article>
        ))}
      </div>
      <p className="rv fine">Prices exclude GST and third-party costs such as hosting, Shopify plans, WhatsApp conversation fees and AI usage. <a className="u" href={CONTACT.cal} target="_blank" rel="noopener">Get an exact quote in 48 hours.</a></p>
    </Reveal>
  );
}

export function Proof() {
  return (
    <Reveal as="section" className="block proof" aria-labelledby="pf-title">
      <p className="eyebrow rv" id="pf-title">Proof</p>
      <Link href="/work" className="proof-big rv" data-title="Work"><span><CountUp to={PROOF.shipped} suffix="+" /></span> products shipped <em>See the work →</em></Link>
      {/* Static grid on desktop; on phones the row becomes an infinite marquee (second copy is aria-hidden). */}
      <div className="logo-wall rv">
        {[0, 1].map(copy => (
          <ul key={copy} className="logo-row" aria-label={copy ? undefined : 'Teams and products I have built for'} aria-hidden={copy ? true : undefined}>
            {PROOF.logos.map(l => {
              const ext = l.href.startsWith('http');
              const img = (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.src} alt={l.name} loading="lazy" decoding="async" />
              );
              return (
                <li key={l.name}>
                  {ext
                    ? <a href={l.href} target="_blank" rel="noopener" data-name={l.name} tabIndex={copy ? -1 : undefined}>{img}</a>
                    : <Link href={l.href} data-name={l.name} data-title={l.name} tabIndex={copy ? -1 : undefined}>{img}</Link>}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </Reveal>
  );
}

export function Faq({ items = FAQ, title = 'Questions people ask' }: { items?: { q: string; a: string }[]; title?: string }) {
  return (
    <Reveal as="section" className="block faq" aria-labelledby="faq-title" stagger={0.05}>
      <p className="eyebrow rv">FAQ</p>
      <h2 id="faq-title" className="block-title rv">{title}</h2>
      <div className="faq-list">
        {items.map(f => (
          <details key={f.q} className="rv">
            <summary><h3>{f.q}</h3><span aria-hidden>+</span></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </Reveal>
  );
}

export const faqJsonLd = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
