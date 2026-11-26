// Single source for contact links, pricing, process, FAQ and proof.
// Anything marked DRAFT needs Deepanshu's sign-off before launch (see README "Before launch").

export const SITE = {
  url: 'https://143.lat',
  name: 'Deepanshu Lathar',
  title: 'Websites, automations and AI agents | Deepanshu Lathar',
  description:
    'Freelance developer in Delhi building websites, Shopify stores, WhatsApp and n8n automations and AI agents for startups, D2C brands, local businesses and agencies across India.',
  location: 'Delhi, India',
};

const waText = encodeURIComponent('Hi Deepanshu, I found your site and want to talk about a project.');
export const CONTACT = {
  // DRAFT: confirm the Cal.com username
  cal: 'https://cal.com/deepanshulathar/intro',
  whatsapp: `https://wa.me/918221016809?text=${waText}`,
  whatsappDisplay: '+91 82210 16809',
  email: 'hello@deepanshulathar.com',
  linkedin: 'https://www.linkedin.com/in/deepanshulathar',
  github: 'https://github.com/latharrr',
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const AUDIENCES = ['Startups', 'D2C brands', 'Local businesses', 'Agencies'];

export const MANIFESTO = {
  before: "Hi, I'm Deepanshu",
  after:
    "I've spent the last year inside startups building the systems founders wish they had: CRMs that fill themselves, dashboards that answer questions, bots that post and reply on their own.",
  key: 'Now I build them for you.',
};

export const PROCESS = [
  { title: 'Discovery call', body: '30 minutes on what is slowing you down, what a win looks like and what it is worth to you.' },
  { title: 'Proposal in 48h', body: 'Fixed scope, fixed price, a timeline in weeks and the exact deliverables. No hourly meter.' },
  { title: 'Build with weekly demos', body: 'You see working software every week on a live preview link, not a status report.' },
  { title: 'Launch', body: 'Domain, hosting, analytics and handover docs. You own the code and every account.' },
  { title: 'Support', body: 'Two weeks of free fixes after launch, then an optional monthly retainer.' },
];

export const PRICING = [
  { name: 'Landing page', from: 15000, unit: '', note: 'One page, copy help, analytics, live in about a week.' },
  { name: 'Business website', from: 50000, unit: '', note: 'Up to 8 pages, CMS or blog, SEO set-up, contact and WhatsApp.' },
  { name: 'Shopify store', from: 45000, unit: '', note: 'Theme set-up, catalogue, payments, shipping and launch checklist.' },
  { name: 'Automation setup', from: 30000, unit: '', note: 'One n8n, WhatsApp or email workflow, end to end, documented.' },
  { name: 'AI agent', from: 40000, unit: ' one-time', note: 'One agent with tools, guardrails, human approval and logs.', alt: 'or a monthly plan, quoted on call' },
  { name: 'Monthly retainer', from: 10000, unit: '/month', note: 'Updates, monitoring, small features and a same-week response.' },
];

export type Logo = { name: string; src: string; href: string };

export const PROOF = {
  shipped: 50, // shown as "50+"
  // SVG marks only. `href` is the case study or the live site.
  logos: [
    { name: 'Picapool', src: '/logos/picapool.svg', href: '/work/picapool-acquisition-campaign' },
    { name: 'YourProfessionals', src: '/logos/yourprofessionals.svg', href: '/work/yourprofessionals' },
    { name: 'Spraykart', src: '/logos/spraykart.svg', href: 'https://www.spraykart.com' },
    { name: 'Tulip’s Oven', src: '/logos/tulips-oven.svg', href: 'https://tulipsoven.com' },
    { name: 'Gapl', src: '/logos/gapl.svg', href: 'https://gapl.vercel.app' },
    { name: 'ProofMart', src: '/logos/proofmart.svg', href: '/work/proofmart' },
  ] as Logo[],
};

export const FAQ = [
  {
    q: 'How long does a project take?',
    a: 'A landing page takes about a week. A business website or Shopify store takes two to three weeks. A single automation takes one to two weeks, and an AI agent two to four. You get a dated timeline in the proposal, and weekly demos keep it honest.',
  },
  {
    q: 'What are your payment terms?',
    a: 'Fixed price, split 50% to start and 50% before launch. Retainers are billed monthly in advance. I invoice in INR with GST details on request, and accept UPI, bank transfer or a payment link.',
  },
  {
    q: 'Is bulk WhatsApp messaging legal?',
    a: 'Yes, if it goes through the official WhatsApp Business Platform. People have to opt in to hear from you, every marketing message uses a template Meta has approved, and opt-outs must be honoured. Unofficial bulk-sender tools break WhatsApp’s terms and get numbers banned. I only build on the official API, and consent is collected and stored in line with India’s DPDP Act.',
  },
  {
    q: 'Do you work outside Delhi?',
    a: 'Yes. Most projects run remotely over calls, WhatsApp and a shared preview link, so I work with clients anywhere in India and abroad. In Delhi NCR I can meet in person for the kickoff.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do. The code lives in your GitHub, the domain and hosting are in your name, and every account I set up is handed over at launch. Nothing is locked to me, so you can move to another developer at any time.',
  },
];

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
