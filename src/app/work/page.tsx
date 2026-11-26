import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, projectLink } from '@/content/work';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Work: case studies in automation, AI agents and websites',
  description: 'Eleven projects: Tulip’s Oven, Gapl, ProofMart, YourProfessionals, Picapool’s acquisition campaign, CRM automation and AI data analyst, Beyond the Rumour Mill, a LinkedIn autopilot, SangSafar and Spraykart.',
  alternates: { canonical: '/work' },
};

export default function WorkIndex() {
  return (
    <div className="inner paper">
      <header className="inner-head">
        <Title as="p" className="display-word">Work</Title>
        <h1 className="inner-h1">Selected work</h1>
        <Lines className="lead">Case studies follow the same shape: the problem, what I built, the stack and what changed. Numbers appear only where they are real and cleared to share.</Lines>
      </header>
      <Reveal as="ul" className="work-grid" stagger={0.06}>
        {PROJECTS.map(p => {
          const l = projectLink(p);
          const body = (
            <>
              <span className="work-thumb">
                <Image src={p.desktop} alt="" fill sizes="(max-width: 767px) 100vw, 45vw" />
                {p.recreated && <span className="tag-recreated">Recreated UI</span>}
              </span>
              <span className="work-type">{p.tag}{p.note ? ` · ${p.note}` : ''}</span>
              <h2>{p.name}</h2>
              <p>{p.oneLine}</p>
              <span className="u strong">{l.label} {l.external ? '↗' : '→'}</span>
            </>
          );
          return (
            <li key={p.slug} className="rv">
              {l.external
                ? <a href={l.href} target="_blank" rel="noopener" className="work-card" data-cursor="View">{body}</a>
                : <Link href={l.href} className="work-card" data-title={p.name} data-cursor="View">{body}</Link>}
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
