import type { Metadata } from 'next';
import Image from 'next/image';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';
import { Diamond } from '@/components/inner/Inner';
import { CONTACT } from '@/content/site';

export const metadata: Metadata = {
  title: 'About Deepanshu Lathar',
  description: 'Deepanshu Lathar is a computer science student and startup operator in Delhi who builds websites, automations and AI agents for founders and small businesses.',
  alternates: { canonical: '/about' },
};

const TOOLS: [string, string][] = [
  ['Build', 'Next.js, React, TypeScript, Shopify, Three.js, GSAP'],
  ['Automate', 'n8n, Python, WhatsApp Business Platform, Telegram bots, Google Apps Script'],
  ['AI', 'Claude, OpenAI and open models, RAG pipelines, LLM-to-SQL with guardrails'],
  ['Data', 'PostgreSQL, Supabase, SQL, GA4, event tracking'],
  ['Ship', 'Vercel, Docker, Razorpay, Cal.com, Sentry'],
];
const CERTS: [string, string][] = [
  ['Oracle AI Database Certified Foundations Associate', 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=0D7B3B90DE37E70EA1ADF9C3EDAA25D8D4E70522E3368FC6B6399A422DDE8984'],
  ['Oracle Cloud Infrastructure Certified AI Foundations Associate', 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=3A6783DF414E35514459D60DA800CA0F5552D1D4565B9DA6C445D9878331FB51'],
  ['Oracle Cloud Infrastructure Certified Foundations Associate', 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=8752A790C5E7BF40799E594372C6BC6421F324AA0E2F2216CCCBCA212A379BF7'],
  ['Oracle Agentic AI Certified Foundations Associate', 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=C7538A44CEE4178C57000E9F8E615769280306EF7CCC3F17AB0D8B908C9C1A44'],
];

export default function About() {
  return (
    <div className="inner paper">
      <header className="inner-head about-head">
        <Title as="p" className="display-word">About</Title>
        <h1 className="inner-h1">A student and startup operator who builds</h1>
      </header>
      <div className="about-grid">
        <figure className="about-photo">
          <Image src="/media/deepanshu.jpg" alt="Deepanshu Lathar" width={640} height={800} sizes="(max-width: 767px) 100vw, 32vw" priority />
        </figure>
        <article className="prose">
          <h2>The short story</h2>
          <Lines>I study computer science, and for the last year I have worked inside early-stage startups, mostly in founder’s offices, where the job is whatever moves the company forward that week.</Lines>
          <Lines>That meant building the systems founders kept asking for: a CRM that fills itself from an n8n pipeline, a dashboard you can ask questions in plain English, campaign tracking that shows which channel actually brought users, and bots that draft, post and reply on their own. I also ship my own products, like ProofMart and SangSafar.</Lines>
          <Lines>Now I build the same things for other businesses: startups, D2C brands, local businesses and agencies.</Lines>
          <Diamond />
          <h2>How I work</h2>
          <Reveal as="ul" className="ticks">
            <li className="rv">One person from the first call to launch. You talk to the person who writes the code.</li>
            <li className="rv">Fixed scope and price in writing within 48 hours of our call.</li>
            <li className="rv">A working demo every week on a live link.</li>
            <li className="rv">You own the code, the domain and every account.</li>
            <li className="rv">Honest numbers only. If something will not pay for itself, I will say so.</li>
          </Reveal>
          <Diamond />
          <h2>Tools I use</h2>
          <Reveal as="dl" className="tools">
            {TOOLS.map(([k, v]) => <div key={k} className="rv"><dt>{k}</dt><dd>{v}</dd></div>)}
          </Reveal>
          <Diamond />
          <h2>Certifications</h2>
          <Reveal as="ul" className="certs">
            {CERTS.map(([n, href]) => <li key={n} className="rv">{n} · Oracle, 2026 · <a className="u" href={href} target="_blank" rel="noopener">Verify</a></li>)}
          </Reveal>
          <p className="btn-row">
            <a className="btn btn-dark" href={CONTACT.cal} target="_blank" rel="noopener">Book a free call</a>
            <a className="btn btn-line" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp me</a>
          </p>
        </article>
      </div>
    </div>
  );
}
