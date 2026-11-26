import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { WORK, getWork, getProject } from '@/content/work';
import { getService, serviceHref } from '@/content/services';
import { SITE } from '@/content/site';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';
import { ExpandHero, Diamond, PillSwitcher, ImageStrip } from '@/components/inner/Inner';

type P = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => WORK.map(w => ({ slug: w.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const w = getWork((await params).slug);
  if (!w) return {};
  const title = `${w.title} case study`;
  return { title, description: `${w.summary} Problem, what I built, stack and results.`, alternates: { canonical: `/work/${w.slug}` }, openGraph: { title, url: `/work/${w.slug}`, images: [getProject(w.slug).desktop] } };
}

export default async function CaseStudy({ params }: P) {
  const w = getWork((await params).slug);
  if (!w) notFound();
  const next = WORK[(WORK.indexOf(w) + 1) % WORK.length];
  const pr = getProject(w.slug);
  const ld = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: w.title, about: w.summary,
    creator: { '@id': `${SITE.url}/#person` }, url: `${SITE.url}/work/${w.slug}`, keywords: w.stack.join(', '),
  };
  return (
    <div className="inner paper case">
      <header className="inner-head">
        <nav className="crumbs" aria-label="Breadcrumb"><Link href="/work" data-title="Work">Work</Link> / <span>{w.title}</span></nav>
        <Title as="p" className="display-word">{w.word}</Title>
        <h1 className="inner-h1">{w.title}: {w.summary.replace(/\.$/, '')}</h1>
        <dl className="case-meta">
          <div><dt>Client</dt><dd>{w.client}</dd></div>
          <div><dt>Type</dt><dd>{w.type}</dd></div>
          {w.link && <div><dt>{pr.live ? 'Live' : 'Code'}</dt><dd><a className="u" href={w.link.href} target="_blank" rel="noopener">{w.link.label}</a></dd></div>}
          {pr.note && <div><dt>Status</dt><dd>{pr.note}</dd></div>}
          {pr.recreated && <div><dt>Screens</dt><dd><span className="tag-recreated">Recreated UI</span> anonymised values</dd></div>}
        </dl>
      </header>

      <ExpandHero>
        <Image src={pr.desktop} alt={`${w.title}${pr.recreated ? ' (recreated UI)' : ''}`} fill priority sizes="100vw" />
      </ExpandHero>

      <article className="prose">
        <section id="problem" aria-labelledby="h-problem">
          <p className="eyebrow">01 · Problem</p>
          <h2 id="h-problem">The problem</h2>
          {w.problem.map((t, i) => <Lines key={i}>{t}</Lines>)}
        </section>
        <Diamond />
        <section id="build" aria-labelledby="h-build">
          <p className="eyebrow">02 · Build</p>
          <h2 id="h-build">What I built</h2>
          {w.built.map((t, i) => <Lines key={i}>{t}</Lines>)}
          {w.stack.length > 0 && (
            <>
              <h3>Stack</h3>
              <ul className="chips">{w.stack.map(s => <li key={s}>{s}</li>)}</ul>
            </>
          )}
        </section>
        {w.strip && <><Diamond /><ImageStrip images={w.strip} alt={w.title} /></>}
        <Diamond />
        <Reveal as="section" id="result" aria-labelledby="h-result" stagger={0.05}>
          <p className="eyebrow rv">03 · Result</p>
          <h2 id="h-result" className="rv">Result</h2>
          <table className="results">
            <tbody>
              {w.results.map(r => (
                <tr key={r.label} className="rv">
                  <th scope="row">{r.label}<span className="rv-line hair" aria-hidden /></th>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="rv related">Related: {w.services.map((slug, i) => {
            const s = getService(slug)!;
            return <span key={slug}>{i > 0 && ' · '}<Link className="u" href={serviceHref(s)} data-title={s.name}>{s.name}</Link></span>;
          })}</p>
        </Reveal>
      </article>

      <Link href={`/work/${next.slug}`} className="next-case" data-title={next.word} data-cursor="View">
        <span className="eyebrow">Next case study</span>
        <span className="next-word">{next.word}</span>
      </Link>
      <PillSwitcher items={[{ id: 'problem', label: 'Problem' }, { id: 'build', label: 'Build' }, { id: 'result', label: 'Result' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
