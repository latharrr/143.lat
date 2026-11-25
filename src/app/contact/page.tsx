import type { Metadata } from 'next';
import { Title, Lines, Reveal } from '@/components/ui/Reveal';
import { CONTACT } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact: book a free call or WhatsApp',
  description: 'Book a free 30-minute call on Cal.com, message on WhatsApp or email Deepanshu Lathar about a website, automation or AI agent project.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  const ways = [
    { k: 'Book a free call', v: '30 minutes on Cal.com. Pick any slot that suits you.', href: CONTACT.cal, cta: 'Open Cal.com' },
    { k: 'WhatsApp', v: `${CONTACT.whatsappDisplay}. Fastest way to reach me; I reply the same day.`, href: CONTACT.whatsapp, cta: 'Message me' },
    { k: 'Email', v: CONTACT.email, href: `mailto:${CONTACT.email}`, cta: 'Write an email' },
  ];
  return (
    <div className="inner paper">
      <header className="inner-head">
        <Title as="p" className="display-word">Contact</Title>
        <h1 className="inner-h1">Tell me what is eating your time</h1>
        <Lines className="lead">A short call is the fastest way to find out if I can help. You get a written proposal with a fixed price within 48 hours.</Lines>
      </header>
      <Reveal as="div" className="contact-grid">
        {ways.map(w => (
          <a key={w.k} className="contact-card rv" href={w.href} target={w.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
            <span className="rv-line hair" aria-hidden />
            <h2>{w.k}</h2>
            <p>{w.v}</p>
            <span className="u strong">{w.cta} →</span>
          </a>
        ))}
      </Reveal>
      <p className="contact-also">Also on <a className="u" href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a> and <a className="u" href={CONTACT.github} target="_blank" rel="noopener">GitHub</a>. Based in Delhi, working with clients across India and abroad.</p>
    </div>
  );
}
