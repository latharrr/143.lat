import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WORK } from '@/content/work';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';
import { MockScreen } from '@/components/home/Mockups';

export const metadata: Metadata = {
  title: 'Work: case studies in automation, AI agents and websites',
  description: 'Case studies: Picapool CRM automation, an AI data analyst, an attribution-tracked acquisition campaign, ProofMart, SangSafar, a LinkedIn autopilot and the SLSPL Group website.',
  alternates: { canonical: '/work' },
};

export default function WorkIndex() {
  return (
    <div className="inner paper">
      <header className="inner-head">
        <Title as="p" className="display-word">Work</Title>
        <h1 className="inner-h1">Selected work</h1>
        <Lines className="lead">Each one follows the same shape: the problem, what I built, the stack and what changed. Numbers appear only where they are real and cleared to share.</Lines>
      </header>
      <Reveal as="ul" className="work-grid" stagger={0.06}>
        {WORK.map(w => (
          <li key={w.slug} className="rv">
            <Link href={`/work/${w.slug}`} className="work-card" data-title={w.word} data-cursor="View">
              <span className="work-thumb">
                {w.hero ? <Image src={w.hero} alt="" fill sizes="(max-width: 767px) 100vw, 45vw" /> : <MockScreen mock={w.mock!} />}
              </span>
              <span className="work-type">{w.type}</span>
              <h2>{w.title}</h2>
              <p>{w.summary}</p>
            </Link>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
