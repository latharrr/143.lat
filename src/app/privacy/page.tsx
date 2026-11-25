import type { Metadata } from 'next';
import { CONTACT } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What 143.lat collects (almost nothing), the third-party services you reach from it, and how to contact Deepanshu Lathar about your data.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <div className="inner paper">
      <header className="inner-head">
        <p className="display-word">Privacy</p>
        <h1 className="inner-h1">Privacy policy</h1>
        <p className="lead">Last updated 25 November 2026.</p>
      </header>
      <article className="prose legal">
        <h2>The short version</h2>
        <p>This site sets no cookies, runs no analytics or advertising trackers and has no forms. Fonts, images and videos are served from this site. If you contact me, I use what you send only to reply and to work with you.</p>

        <h2>Who is responsible</h2>
        <p>Deepanshu Lathar, Delhi, India, is responsible for this site and any personal data you send through it. Contact: <a className="u" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>

        <h2>What this site collects</h2>
        <p>Nothing directly. The hosting provider, Vercel, keeps standard server logs, such as IP address, browser type and the pages requested, to run and secure the site. I do not use those logs to identify you.</p>
        <p>The site remembers nothing in your browser between visits.</p>

        <h2>When you contact me</h2>
        <p>The buttons on this site open third-party services: WhatsApp (Meta), Cal.com for booking a call, your email app, LinkedIn and GitHub. Each of those services handles your data under its own privacy policy. When you message, email or book, I receive what you choose to share, such as your name, number, email and project details.</p>
        <p>I use that information only to reply, prepare a proposal and deliver work you have agreed to. I do not sell it, and I do not add you to marketing lists. I only send WhatsApp marketing messages to people who have opted in, and you can opt out at any time.</p>

        <h2>How long I keep it</h2>
        <p>Enquiries that do not turn into a project are deleted within 12 months. Client records are kept for as long as the law requires for invoices and tax, and otherwise for as long as we work together.</p>

        <h2>Your rights</h2>
        <p>Under India’s Digital Personal Data Protection Act, 2023, you can ask what I hold about you, ask me to correct or delete it, and withdraw consent. Email <a className="u" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> and I will respond within 30 days.</p>

        <h2>Changes</h2>
        <p>If this policy changes, the date at the top will change with it.</p>
      </article>
    </div>
  );
}
