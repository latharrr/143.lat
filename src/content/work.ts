// Case studies. Format: Problem -> What I built -> Stack -> Result. Real numbers only.
// Picapool numbers stay out until Picapool approves them (README "Before launch").

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
  strip?: string[]; // extra screens on the case page
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
    link: { href: 'https://plan.picapool.tech', label: 'plan.picapool.tech' },
    services: ['landing-pages'],
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
      'A Telegram bot. You sent a brief or a link; it researched the topic across four sources at once and kept only facts whose numbers appeared on the page they cited.',
      'It wrote two candidate drafts in your voice from a profile card and story bank, merged them, ran de-AI, number, truth and length checks, and made a designed cover image.',
      'Nothing was published until you tapped approve and picked a time. A dispatcher then posted to LinkedIn and reported back with the link. The bot was stopped on 13 November 2026.',
    ],
    stack: ['Python', 'Telegram Bot API', 'Supabase', 'Groq', 'Tavily', 'FLUX', 'LinkedIn API'],
    oneLine: 'Researched drafts that only went out after approval. Stopped on 13 Nov 2026.',
    results: [
      { label: 'Status', value: 'Stopped on 13 November 2026' },
      { label: 'Research sources per post', value: '4, checked in parallel' },
      { label: 'Drafts before the final post', value: '2' },
      { label: 'Posts without approval', value: '0' },
    ],
    link: { href: 'https://github.com/latharrr/linkedin-bot', label: 'github.com/latharrr/linkedin-bot' },
    services: ['ai-agents'],
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
    link: { href: 'https://proofmart.shop', label: 'proofmart.shop' },
    services: ['apps'],
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
      { label: 'Status', value: 'Staging only, not public yet' },
    ],
    strip: ['/work/sangsafar/desktop.webp', '/work/sangsafar/matches.webp', '/work/sangsafar/chat.webp'],
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
    link: { href: 'https://yourprofessionals.in', label: 'yourprofessionals.in' },
    services: ['seo-performance', 'websites'],
  },
];

export const getWork = (slug: string) => WORK.find(w => w.slug === slug);

// Every project on the site, in display order. Screens are fresh captures (tools/shots.mjs) in public/work/<slug>/.
export type Project = {
  slug: string;
  name: string;
  tag: string; // one hero tag per card
  oneLine: string;
  device: 'laptop' | 'phone'; // which capture the carousel frame shows
  desktop: string;
  mobile?: string;
  recreated?: boolean; // internal tool: drawn UI with anonymised values, labelled "Recreated UI"
  live?: string;
  code?: string;
  note?: string; // credit or status, shown with the project
  services: string[]; // service slugs this project demonstrates (tags)
};
const shots = (slug: string, mobile = true) => ({ desktop: `/work/${slug}/desktop.webp`, ...(mobile ? { mobile: `/work/${slug}/mobile.webp` } : {}) });

export const PROJECTS: Project[] = [
  {
    slug: 'tulips-oven', name: 'Website for Tulip’s Oven', tag: 'Website', device: 'laptop', ...shots('tulips-oven'),
    oneLine: 'A fast static site for a home bakery in New Delhi: menu, gallery and a blog for bakery searches.',
    live: 'https://tulipsoven.com', services: ['websites', 'seo-performance'],
  },
  {
    slug: 'gapl', name: 'Gapl', tag: 'SaaS', device: 'laptop', ...shots('gapl'),
    oneLine: 'An early-stage product that reads a resume the way a recruiter does and shows the line that sank it.',
    live: 'https://gapl.vercel.app', code: 'https://github.com/latharrr/gapl', note: 'Early-stage product', services: ['apps'],
  },
  {
    slug: 'proofmart', name: 'ProofMart', tag: 'API', device: 'laptop', ...shots('proofmart'),
    oneLine: 'A fraud and KYC API for PDF bank statements: six fraud markers, one verdict, no model in the path.',
    live: 'https://proofmart.shop', services: ['apps'],
  },
  {
    slug: 'yourprofessionals', name: 'YourProfessionals', tag: 'SEO', device: 'laptop', ...shots('yourprofessionals'),
    oneLine: 'SEO, a blog CMS and lead capture for a CA and CS firm in Delhi.',
    live: 'https://yourprofessionals.in', services: ['seo-performance', 'websites'],
  },
  {
    slug: 'picapool-acquisition-campaign', name: 'Picapool acquisition campaign', tag: 'Growth', device: 'phone', ...shots('picapool-acquisition-campaign'),
    oneLine: 'Intent landing pages with in-house attribution, so spend is judged per channel.',
    live: 'https://plan.picapool.tech', services: ['landing-pages'],
  },
  {
    slug: 'picapool-crm-automation', name: 'Picapool CRM automation', tag: 'n8n', device: 'laptop', ...shots('picapool-crm-automation', false),
    oneLine: 'An n8n pipeline that enriches and scores each lead on arrival, feeding a role-based CRM.',
    recreated: true, note: 'Internal tool', services: ['n8n-automation', 'whatsapp-email-automation'],
  },
  {
    slug: 'picapool-ai-data-analyst', name: 'Picapool AI data analyst', tag: 'AI Agent', device: 'laptop', ...shots('picapool-ai-data-analyst', false),
    oneLine: 'Plain-English questions turned into validated, read-only SQL.',
    recreated: true, note: 'Internal tool, under NDA', services: ['ai-agents'],
  },
  {
    slug: 'rumour-mill', name: 'Beyond the Rumour Mill', tag: 'Web App', device: 'laptop', ...shots('rumour-mill'),
    oneLine: 'Placement prep from verified senior experiences. I built the backend, auth, experience and AI modules.',
    live: 'https://clg.143.lat', note: 'Team college project with Harsh and Sundram Singh', services: ['apps'],
  },
  {
    slug: 'linkedin-autopilot', name: 'LinkedIn autopilot', tag: 'AI Agent', device: 'laptop', ...shots('linkedin-autopilot', false),
    oneLine: 'A Telegram AI agent that researched and drafted posts, publishing only after approval.',
    recreated: true, code: 'https://github.com/latharrr/linkedin-bot', note: 'Stopped on 13 Nov 2026', services: ['ai-agents'],
  },
  {
    slug: 'sangsafar', name: 'SangSafar', tag: 'Web App', device: 'phone', ...shots('sangsafar'),
    oneLine: 'Travel-buddy matching for college students, limited to verified college email.',
    note: 'Staging only', services: ['apps'],
  },
  {
    slug: 'spraykart', name: 'Spraykart', tag: 'Shopify', device: 'phone', ...shots('spraykart'),
    oneLine: 'A Shopify perfume store. My part: store set-up, catalogue configuration and running it day to day.',
    live: 'https://www.spraykart.com', note: 'Team work with Spraykart LLP', services: ['shopify'],
  },
];
export const getProject = (slug: string) => PROJECTS.find(p => p.slug === slug)!;
/** Case study where one exists, else the live site, else the code. */
export function projectLink(p: Project) {
  if (getWork(p.slug)) return { href: `/work/${p.slug}`, label: 'View case study', external: false };
  if (p.live) return { href: p.live, label: 'Visit site', external: true };
  return { href: p.code!, label: 'View code', external: true };
}
