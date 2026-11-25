import Link from 'next/link';
import { CONTACT, NAV } from '@/content/site';
import { launched } from '@/content/services';
import { Magnetic } from '@/components/ui/Magnetic';

export function Footer() {
  return (
    <footer className="foot dark" id="contact-cta">
      <p className="eyebrow">Next step</p>
      <h2 className="foot-cta">Got a process eating your time? <em>Let’s automate it.</em></h2>
      <div className="btn-row">
        <Magnetic><a className="btn btn-lav" href={CONTACT.cal} target="_blank" rel="noopener">Book a free call</a></Magnetic>
        <Magnetic><a className="btn btn-ghost" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp me</a></Magnetic>
      </div>
      <div className="foot-grid">
        <div>
          <p className="foot-h">Contact</p>
          <a className="u" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a className="u" href={CONTACT.whatsapp} target="_blank" rel="noopener">WhatsApp {CONTACT.whatsappDisplay}</a>
          <a className="u" href={CONTACT.cal} target="_blank" rel="noopener">Cal.com</a>
          <a className="u" href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a className="u" href={CONTACT.github} target="_blank" rel="noopener">GitHub</a>
        </div>
        <div>
          <p className="foot-h">Services</p>
          {launched.map(s => <Link key={s.slug} className="u" href={`/services/${s.slug}`} data-title={s.name}>{s.name}</Link>)}
        </div>
        <div>
          <p className="foot-h">Site</p>
          {NAV.map(n => <Link key={n.href} className="u" href={n.href} data-title={n.label}>{n.label}</Link>)}
        </div>
      </div>
      <p className="foot-small">© 2026 Deepanshu Lathar · Delhi, India · Websites, automation and AI agents</p>
    </footer>
  );
}
