// 7–9 + FAQ: process, pricing, proof and FAQ blocks (server components with light reveals).
import { Reveal, Lines } from '@/components/ui/Reveal';
import { CONTACT, FAQ, PRICING, PROCESS, PROOF, inr } from '@/content/site';

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
      <p className="proof-big rv"><span>{PROOF.shipped}</span> products shipped</p>
      <ul className="logo-row">
        {PROOF.logos.map(l => <li key={l} className="rv">{l}</li>)}
      </ul>
      {PROOF.testimonials.length > 0 && (
        <div className="quotes">
          {PROOF.testimonials.map(t => (
            <figure key={t.name} className="quote rv">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>{t.name} · {t.role}</figcaption>
            </figure>
          ))}
        </div>
      )}
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
