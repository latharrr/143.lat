// Case studies. Format: Problem -> What I built -> Stack -> Result. Real numbers only.
// Picapool numbers stay out until Picapool approves them (README "Before launch").

export type Mock = 'graph' | 'analyst' | 'telegram' | 'slspl';
export type Work = {
  slug: string;
  title: string;
  word: string; // big display title on the case page
  client: string;
  type: string;
  summary: string;
  problem: string[];
  built: string[];
  stack: string[];
  results: { label: string; value: string }[];
  oneLine: string; // result line under the carousel's centre item
  device: 'laptop' | 'phone';
  image?: string; // shown inside the device in the carousel
  video?: string; // media name of a loop in /public/media (wins over image)
  mock?: Mock; // code-drawn diagram when no screenshot can be shown
  hero?: string;
  strip?: string[];
  link?: { href: string; label: string };
  services: string[]; // related service slugs
};

const PENDING = 'Shared once Picapool signs off';

export const WORK: Work[] = [
  {
    slug: 'picapool-crm-automation',
    title: 'Picapool CRM automation',
    word: 'Pipeline',
    client: 'Picapool',
    type: 'n8n automation · CRM',
    summary: 'An n8n prospect-enrichment pipeline feeding a CRM with role-based access.',
    problem: [
      'Picapool’s growth team was collecting prospects from campaigns, forms and on-ground drives. Each lead had to be looked up, checked and typed into a tracker before anyone could follow it up, and the founders had no single view of who had been contacted.',
    ],
    built: [
      'An n8n pipeline that picks up each new prospect, enriches it from public sources, scores the fit and writes it into the CRM with a suggested next step.',
      'A CRM with role-based access, so interns, managers and founders each see the leads and fields they need, designed with the CTO advising on the database.',
      'Automated daily KPI digests and a WhatsApp Business API dashboard so follow-ups run from one place.',
    ],
    stack: ['n8n', 'PostgreSQL', 'Supabase', 'Next.js', 'WhatsApp Business Platform'],
    oneLine: 'Leads enrich and score themselves on arrival.',
    results: [
      { label: 'Manual lookups per lead', value: 'Removed: enrichment runs on arrival' },
      { label: 'Hours saved per week', value: PENDING },
      { label: 'Leads processed per week', value: PENDING },
    ],
    device: 'laptop',
    mock: 'graph',
    services: ['n8n-automation', 'whatsapp-email-automation'],
  },
  {
    slug: 'picapool-ai-data-analyst',
    title: 'Picapool AI data analyst',
    word: 'Analyst',
    client: 'Picapool',
    type: 'AI agent · internal dashboard',
    summary: 'An internal dashboard with a natural-language query engine over the company database.',
    problem: [
      'Every product or growth question went through whoever knew SQL. Founders waited a day for numbers they needed in a meeting, and ad-hoc queries on the production database were a risk.',
    ],
    built: [
      'A read-only AI data analyst: you ask a question in plain English, an LLM writes the SQL, and the query is validated against guardrails before it is allowed to run.',
      'An internal dashboard for the recurring numbers, plus a Telegram bot with retrieval over the analytics layer for quick questions on the go.',
    ],
    stack: ['Python', 'PostgreSQL', 'LLM SQL generation', 'RAG', 'Telegram Bot API'],
    oneLine: 'Plain-English questions, validated read-only SQL.',
    results: [
      { label: 'Database access', value: 'Read-only, every query validated first' },
      { label: 'Where answers arrive', value: 'Dashboard and Telegram' },
      { label: 'Time to an answer', value: PENDING },
    ],
    device: 'laptop',
    mock: 'analyst',
    services: ['ai-agents', 'apps'],
  },
  {
    slug: 'picapool-acquisition-campaign',
    title: 'Picapool acquisition campaign',
    word: 'Campaign',
    client: 'Picapool',
    type: 'Growth · attribution',
    summary: 'A multi-channel campaign with in-house attribution tracking across on-ground and digital funnels.',
    problem: [
      'Picapool was spending across campus drives, posters, referrals and digital channels, but the only number it could see was app downloads. There was no way to tell which channel brought the people who actually used the product.',
    ],
    built: [
      'Campaign landing pages for each intent, each with its own entry point, wired to a shared lead sheet.',
      'In-house event-fingerprinting attribution that follows a visitor from an on-ground QR code or a digital link to a submitted intent, so spend decisions are made on per-channel results instead of downloads.',
    ],
    stack: ['Next.js', 'Vercel', 'Google Apps Script', 'Google Sheets', 'Event fingerprinting'],
    oneLine: 'Spend judged per channel, not by downloads.',
    results: [
      { label: 'What spend is judged on', value: 'Per-channel results, not downloads' },
      { label: 'Signups by channel', value: PENDING },
      { label: 'Cost per signup', value: PENDING },
    ],
    device: 'phone',
    image: '/media/intent-hero.jpg',
    hero: '/media/intent-hero.jpg',
    strip: ['/media/intent-hero.jpg', '/media/intent-2.jpg', '/media/air-hero.jpg', '/media/air-2.jpg'],
    link: { href: 'https://plan.picapool.tech', label: 'plan.picapool.tech' },
    services: ['landing-pages', 'seo-performance'],
  },
  {
    slug: 'slspl-group',
    title: 'SLSPL Group website',
    word: 'SLSPL',
    client: 'SLSPL Group',
    type: 'Website · professional services',
    summary: 'A high-end website for a document attestation firm.',
    problem: [
      'Document attestation is a trust business. People hand over degrees, birth certificates and company papers, often for a visa or a job abroad. SLSPL Group needed a website that looked as careful as the work it does and explained a confusing process in plain steps.',
    ],
    built: [
      'A premium, fast website that walks visitors through each attestation type, the documents they need and how long it takes, with enquiry and WhatsApp routes on every page.',
    ],
    stack: [], // TODO: confirm SLSPL's stack and live URL; empty hides the block
    oneLine: 'A premium, plain-steps site for a trust business.',
    results: [{ label: 'Delivered', value: 'Live website for the firm' }],
    device: 'laptop',
    video: 'slspl',
    image: '/media/slspl-hero.jpg',
    hero: '/media/slspl-hero.jpg',
    strip: ['/media/slspl-hero.jpg', '/media/slspl-2.jpg'],
    link: { href: 'https://slsplgroup.com', label: 'slsplgroup.com' },
    services: ['websites', 'seo-performance'],
  },
  {
    slug: 'linkedin-autopilot',
    title: 'LinkedIn autopilot',
    word: 'Autopilot',
    client: 'Own product',
    type: 'AI agent · Telegram',
    summary: 'Telegram brief → AI research → 2 drafts + images → approve → auto-post.',
    problem: [
      'Posting on LinkedIn every week takes hours: research, writing, rewriting so it does not sound like AI, making an image and remembering to post. Most AI writers skip the research and invent numbers.',
    ],
    built: [
      'A Telegram bot. You send a brief or a link; it researches the topic across four sources at once and keeps only facts whose numbers appear on the page they cite.',
      'It writes two candidate drafts in your voice from a profile card and story bank, merges them, runs de-AI, number, truth and length checks, and makes a designed cover image.',
      'Nothing is published until you tap approve and pick a time. A dispatcher then posts to LinkedIn and reports back with the link.',
    ],
    stack: ['Python', 'Telegram Bot API', 'Supabase', 'Groq', 'Tavily', 'FLUX', 'LinkedIn API'],
    oneLine: 'Researched posts that only go out after approval.',
    results: [
      { label: 'Research sources per post', value: '4, checked in parallel' },
      { label: 'Drafts before the final post', value: '2' },
      { label: 'Posts without approval', value: '0' },
    ],
    device: 'phone',
    mock: 'telegram',
    services: ['ai-agents', 'n8n-automation'],
  },
  {
    slug: 'proofmart',
    title: 'ProofMart',
    word: 'ProofMart',
    client: 'Own product',
    type: 'Fraud detection API · KYC',
    summary: 'A document-fraud and KYC verification API for PDF bank statements.',
    problem: [
      'Lenders and fintechs in India accept PDF bank statements as proof of income. Edited statements are easy to make and hard to spot by eye, and most checks either rely on a model nobody can explain or on a person reading every row.',
    ],
    built: [
      'A deterministic forensics API. It re-adds every row of a PDF bank statement with fixed rules, with no model in the path, and pins each finding to its page, row and box.',
      'Every statement gets one verdict, FAIL, REVIEW or CLEAR, with signed results, and it is available on the web, over the API, through webhooks and from a CLI, with INR billing.',
    ],
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Ed25519 signing', 'Razorpay'],
    oneLine: 'Six fraud markers, one verdict, zero models.',
    results: [
      { label: 'Fraud markers checked', value: '6' },
      { label: 'Verdicts', value: 'FAIL · REVIEW · CLEAR' },
      { label: 'AI models in the decision path', value: '0' },
    ],
    device: 'laptop',
    video: 'proofmart',
    image: '/media/proofmart-hero.jpg',
    hero: '/media/proofmart-hero.jpg',
    strip: ['/media/proofmart-hero.jpg', '/media/proofmart-2.jpg', '/media/proofmart-3.jpg'],
    link: { href: 'https://proofmart.shop', label: 'proofmart.shop' },
    services: ['apps', 'ai-agents'],
  },
  {
    slug: 'sangsafar',
    title: 'SangSafar',
    word: 'SangSafar',
    client: 'Own product',
    type: 'Web app · matching',
    summary: 'A travel-buddy matching platform for college students.',
    problem: [
      'Students travel home and on trips all the time and would rather share a cab or a train with someone from their own college. Finding that person meant asking around in crowded group chats, with no way to know who was genuine.',
    ],
    built: [
      'Sign-in limited to verified college email, with personal webmail refused and new colleges marked provisional.',
      'Trips with a route and a time window; matches show where your window overlaps with someone else’s, minute by minute.',
      'Requests, chats, shareable trip links, women-only trips and an admin view for moderation.',
    ],
    stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Sentry'],
    oneLine: 'Verified-college matching with women-only trips.',
    results: [
      { label: 'Who can sign in', value: 'Verified college email only' },
      { label: 'Safety options', value: 'Women-only trips, request before chat' },
    ],
    device: 'phone',
    image: '/media/sangsafar-phone.jpg',
    hero: '/media/sangsafar-01-landing.jpg',
    strip: ['/media/sangsafar-01-landing.jpg', '/media/sangsafar-04-discover.jpg', '/media/sangsafar-06-matches.jpg', '/media/sangsafar-10-chat-accepted.jpg'],
    services: ['apps'],
  },
  {
    slug: 'yourprofessionals',
    title: 'YourProfessionals',
    word: 'YourPros',
    client: 'YourProfessionals',
    type: 'Website · SEO · lead generation',
    summary: 'SEO, a blog CMS and lead generation for a CA and CS firm in Delhi.',
    oneLine: 'More organic visibility and inbound client leads.',
    problem: [
      'YourProfessionals, a chartered-accountancy and company-secretary practice in Laxmi Nagar, Delhi, competes for searches like company registration and GST filing against national aggregators with huge ad budgets. The site needed to be found, and the team needed a way to publish without a developer.',
    ],
    built: [
      'An SEO pass across the service pages: structure, metadata, internal links and quote forms that route to WhatsApp.',
      'A blog CMS on Supabase with email-free staff logins, so the team can publish compliance articles themselves.',
      'Lead capture on every page: a quote form, click-to-WhatsApp and a callback request.',
    ],
    stack: ['Next.js', 'Supabase', 'Vercel', 'Technical SEO'],
    results: [
      { label: 'Organic visibility', value: 'Up, with inbound client leads' },
      { label: 'Who publishes the blog', value: 'The firm’s own staff' },
    ],
    device: 'laptop',
    video: 'yp',
    image: '/media/yp-hero.jpg',
    hero: '/media/yp-hero.jpg',
    strip: ['/media/yp-hero.jpg', '/media/yp-2.jpg', '/media/yp-3.jpg'],
    link: { href: 'https://yourprofessionals.in', label: 'yourprofessionals.in' },
    services: ['seo-performance', 'websites'],
  },
];

export const getWork = (slug: string) => WORK.find(w => w.slug === slug);

// Homepage carousel, in order.
export const CAROUSEL = ['picapool-crm-automation', 'picapool-ai-data-analyst', 'slspl-group', 'linkedin-autopilot', 'proofmart', 'sangsafar', 'yourprofessionals'].map(s => getWork(s)!);

// Hero orbit cards: real screen loops of live work.
export const ORBIT_CARDS = [
  { name: 'ProofMart', media: 'proofmart', video: true },
  { name: 'SLSPL Group', media: 'slspl', video: true },
  { name: 'Picapool film', media: 'picapool-film', video: true, tall: true },
  { name: 'LpuTV', media: 'lputv', video: true },
  { name: 'Picapool intents', media: 'intent', video: true },
  { name: 'SangSafar', media: 'sangsafar-phone', video: false, tall: true },
  { name: 'TrustBridgeVerify', media: 'tbv', video: true },
  { name: 'YourProfessionals', media: 'yp', video: true },
  { name: 'Picapool air', media: 'air', video: true },
  { name: 'SangSafar matches', media: 'sangsafar-poster', video: false },
];
