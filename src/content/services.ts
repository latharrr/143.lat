export type Group = 'Build' | 'Automate' | 'AI' | 'Grow';

export type ServicePage = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[]; // the problem
  deliverables: string[];
  sections: { h2: string; body: string[] }[];
  caseStudy: { work?: string; title: string; body: string };
  process: string[];
  priceKey: string; // matches PRICING name
  faq: { q: string; a: string }[];
};

export type Service = {
  slug: string;
  name: string; // used in the big list
  group: Group;
  short: string;
  priceKey?: string; // short services: PRICING name for the starting price (none = quoted on call)
  page?: ServicePage; // full page; others get the short page
};

export const GROUPS: { name: Group; line: string }[] = [
  { name: 'Build', line: 'Websites, 3D sites, apps, Shopify and landing pages.' },
  { name: 'Automate', line: 'WhatsApp and email, n8n, scraping and workflow fixes.' },
  { name: 'AI', line: 'Agents and AI features that work on your own data, with a human approval step.' },
  { name: 'Grow', line: 'SEO, speed, payments, booking and a monthly retainer that keeps it all running.' },
];

export const SERVICES: Service[] = [
  {
    slug: 'shopify',
    name: 'Shopify Stores',
    group: 'Build',
    short: 'Stores set up to sell from day one: catalogue, payments, shipping and the apps you actually need.',
    page: {
      h1: 'Shopify Store Development for D2C Brands in India',
      metaTitle: 'Shopify Store Development in India | Deepanshu Lathar',
      metaDescription:
        'Shopify stores for Indian D2C brands: theme set-up, catalogue, Razorpay or Shopify Payments, shipping, COD rules, WhatsApp updates and a launch checklist. From ₹30,000.',
      intro: [
        'Most Indian D2C brands do not need a custom website. They need a Shopify store that is set up properly: products that are easy to find, a checkout that works on a ₹10,000 phone over patchy 4G, and the boring parts (GST, shipping zones, COD limits, return rules) configured before the first order lands.',
        'What usually goes wrong is the gap between “the theme looks nice” and “the store runs itself”. Variants are entered by hand, every courier update becomes a WhatsApp message someone types, abandoned carts are never followed up, and the store gets slower with each app. I close that gap.',
      ],
      deliverables: [
        'Theme set-up and customisation on Online Store 2.0, matched to your brand',
        'Catalogue import: products, variants, collections, tags and SEO fields',
        'Payments: Shopify Payments or Razorpay, COD rules and prepaid incentives',
        'Shipping zones, rates and a courier integration such as Shiprocket',
        'Order, shipping and abandoned-cart messages on WhatsApp and email',
        'GA4 and Meta pixel events, checked against real test orders',
        'Speed pass: image compression, app audit, Core Web Vitals report',
        'A recorded walkthrough so your team can add products and run sales',
      ],
      sections: [
        {
          h2: 'Built for how India buys',
          body: [
            'Indian shoppers expect COD, UPI, WhatsApp updates and honest delivery dates. I set the store up around those habits: COD limits by pin code, a small prepaid discount to push UPI, delivery estimates on the product page and order updates that arrive on WhatsApp instead of an inbox nobody opens.',
            'Checkout is where the money is. I test every flow on a mid-range Android phone before launch, because that is the phone most of your customers use.',
          ],
        },
        {
          h2: 'Fewer apps, faster store',
          body: [
            'Every Shopify app adds scripts, and every script slows the store. Before installing anything I check whether the theme or a small automation can do the job. When an app is worth it, I install it and measure the speed cost. You get a short report with your Core Web Vitals before and after.',
          ],
        },
        {
          h2: 'Automations that save your team hours',
          body: [
            'Once the store is live, the repetitive work starts: confirming COD orders, chasing abandoned carts, updating stock across channels, sending review requests. I connect Shopify to n8n and the WhatsApp Business Platform so those steps happen on their own, with a log you can check.',
          ],
        },
      ],
      caseStudy: {
        title: 'Spraykart LLP storefront',
        body: 'I launched and ran the Shopify storefront for Spraykart LLP: store set-up, catalogue configuration and keeping orders flowing without interruptions while the business grew.',
      },
      process: [
        'Discovery call to map products, payments and shipping',
        'Proposal with fixed scope and launch date within 48 hours',
        'Store build with a live preview link and weekly demos',
        'Test orders on real phones, then launch',
        'Two weeks of fixes, then an optional retainer',
      ],
      priceKey: 'Shopify store',
      faq: [
        { q: 'Do I need Shopify Plus?', a: 'Almost never at the start. The Basic or Shopify plan covers most Indian D2C brands until they are doing serious monthly volume.' },
        { q: 'Can you move my store from WooCommerce?', a: 'Yes. Products, customers and order history can be migrated, and old URLs are redirected so you keep your Google rankings.' },
        { q: 'Which payment gateway should I use?', a: 'Shopify Payments if it is available for your business, otherwise Razorpay. Both support UPI, cards and netbanking. I set up whichever has the better fees for your order size.' },
        { q: 'Will I be able to manage it myself?', a: 'Yes. You get a recorded walkthrough and a one-page guide for adding products, running discounts and handling returns.' },
      ],
    },
  },
  {
    slug: 'ai-agents',
    name: 'AI Agents',
    group: 'AI',
    short: 'Agents that research, draft, answer and act inside your tools, with a human approval step.',
    page: {
      h1: 'Custom AI Agents for Businesses in India',
      metaTitle: 'Custom AI Agent Development in India | Deepanshu Lathar',
      metaDescription:
        'Custom AI agents that research, write, answer questions over your data and act in your tools, with guardrails, human approval and logs. Built on Claude, OpenAI and open models. From ₹40,000.',
      intro: [
        'Most “AI agents” sold to small businesses are a chatbot with a prompt. They sound clever in a demo and then invent a refund policy in front of a customer. A useful agent is smaller and stricter than that: it has a narrow job, real tools, rules it cannot break, and a person who approves anything that matters.',
        'I build agents like that. They read from your actual data, they check their own output before showing it, and they log every step so you can see why they did what they did.',
      ],
      deliverables: [
        'A written job description for the agent: inputs, tools, limits and the approval step',
        'Connections to your data: database, Google Sheets, Notion, CRM or website',
        'Tool use: search, browse, query, draft, send, schedule',
        'Guardrails: read-only access where possible, validated queries, fact and number checks',
        'Human approval in Telegram, WhatsApp, Slack or a small dashboard',
        'Logs of every run with cost per run',
        'A test set of real examples so quality can be measured, not guessed',
        'Hosting and a handover document',
      ],
      sections: [
        {
          h2: 'What an agent can take off your plate',
          body: [
            'Good first agents do work that is repetitive, text-heavy and easy to check: turning a brief into researched drafts, answering staff questions over your own numbers, qualifying inbound leads, summarising calls, preparing daily reports, or triaging a support inbox.',
            'If a task needs judgement every time, I will tell you on the discovery call that an agent is the wrong tool, and suggest an automation or a better form instead.',
          ],
        },
        {
          h2: 'Guardrails first',
          body: [
            'Every agent I ship has hard limits. Database access is read-only and every generated query is validated before it runs. Writing agents keep only the facts whose numbers appear in the sources they cite. Anything that goes out to a customer or a public channel waits for a human tap.',
            'That makes the agent slower in the demo and far safer in production, which is the trade-off you want.',
          ],
        },
        {
          h2: 'Models and stack',
          body: [
            'I pick the model per task: Claude or GPT-class models for writing and reasoning, small fast models for classification, and open models where cost or privacy matters. The orchestration is plain Python or TypeScript, and n8n where your team wants to see and edit the flow. No lock-in to a single provider.',
          ],
        },
      ],
      caseStudy: {
        work: 'linkedin-autopilot',
        title: 'LinkedIn autopilot',
        body: 'A Telegram brief went in. The agent researched the topic across four sources, kept only facts it could verify, wrote two drafts, merged them in my voice, made a cover image and posted to LinkedIn only after I approved it. The bot was stopped on 13 November 2026.',
      },
      process: [
        'Discovery call to pick one job worth automating',
        'Proposal with the agent’s job description and success test',
        'Build with a weekly demo on real examples',
        'Launch with approval steps and logs switched on',
        'Monthly review of quality and cost',
      ],
      priceKey: 'AI agent',
      faq: [
        { q: 'Will the agent make things up?', a: 'Models can, so the agent is built not to rely on trust. Answers come from your data, numbers are checked against sources, and anything public waits for human approval.' },
        { q: 'Is my data used to train the model?', a: 'No. I use API plans whose terms exclude training on your data, and sensitive fields can be masked before they reach a model.' },
        { q: 'What does it cost to run?', a: 'Usually a few rupees per run. You see the cost of every run in the logs, and I size the model to the task to keep it low.' },
        { q: 'Can it work on WhatsApp?', a: 'Yes, through the official WhatsApp Business Platform, with opt-in and approved templates for anything you start.' },
      ],
    },
  },
  {
    slug: 'n8n-automation',
    name: 'n8n Automation',
    group: 'Automate',
    short: 'Workflows that move data between your tools, enrich leads and send reports on their own.',
    page: {
      h1: 'n8n Automation Services for Startups and Small Businesses',
      metaTitle: 'n8n Automation Expert in India | Deepanshu Lathar',
      metaDescription:
        'n8n workflows that connect your CRM, Sheets, WhatsApp, email and database: lead enrichment, daily KPI digests, onboarding and reporting. Self-hosted or cloud. From ₹20,000.',
      intro: [
        'In most small teams, somebody spends hours a week copying data from one tool to another: leads from a form into a sheet, the sheet into a CRM, the CRM into a WhatsApp message, and a weekly report that someone builds by hand every Monday.',
        'n8n can do that work for you. It is an open-source automation tool, like Zapier, that you can self-host, so you are not paying per task as you grow. I design, build and document n8n workflows that run quietly in the background and tell you when something needs a human.',
      ],
      deliverables: [
        'A map of the current process and where time is lost',
        'n8n set-up: self-hosted on your server or n8n Cloud',
        'Workflows with error handling, retries and alerts',
        'Connections to Sheets, Airtable, HubSpot, Zoho, Supabase, Postgres, Slack, WhatsApp and email',
        'Lead enrichment and scoring, with sources logged',
        'Scheduled digests: daily KPIs, weekly summaries, alerts on thresholds',
        'Credentials stored safely, never in the workflow itself',
        'A one-page runbook per workflow',
      ],
      sections: [
        {
          h2: 'Why n8n over Zapier or Make',
          body: [
            'Zapier and Make charge per task, so cost grows with your success. Self-hosted n8n runs on a small server for a fixed monthly cost, keeps your data on infrastructure you control, and lets me drop into code when a visual node is not enough.',
            'If you are already on Zapier and it works, I will say so. Switching only makes sense when the bill or the limits hurt.',
          ],
        },
        {
          h2: 'Workflows I build most',
          body: [
            'Prospect enrichment: a new lead arrives, the workflow looks up the company, scores the fit and writes it into the CRM with a suggested next step. Daily KPI digests from your database to WhatsApp or Slack. Onboarding flows that create accounts, send welcome messages and remind people who stall. Invoice and payment follow-ups.',
          ],
        },
        {
          h2: 'Built not to break silently',
          body: [
            'The worst automation is the one that stops on a Tuesday and nobody notices for a month. Every workflow I ship has error branches, retries and an alert to a real person, plus a run log you can open and read.',
          ],
        },
      ],
      caseStudy: {
        work: 'picapool-crm-automation',
        title: 'Picapool CRM automation',
        body: 'An n8n pipeline that enriches new prospects, scores them and writes them into the CRM with role-based access, alongside automated daily KPI digests for the team.',
      },
      process: [
        'Discovery call and a walk through your current process',
        'Proposal with the workflows, triggers and alerts listed',
        'Build and test on copies of real data, demoed weekly',
        'Switch on, monitor the first week of runs',
        'Optional retainer for new workflows and changes',
      ],
      priceKey: 'Automation setup',
      faq: [
        { q: 'Self-hosted or n8n Cloud?', a: 'Self-hosted is cheaper at volume and keeps data with you; n8n Cloud is easier if you have no server. I set up either.' },
        { q: 'Can my team edit the workflows?', a: 'Yes. n8n is visual, and each workflow comes with notes and a runbook so someone non-technical can follow it.' },
        { q: 'What if an API changes?', a: 'The workflow alerts you when a step fails. Fixes are covered for two weeks after launch and then under the retainer.' },
        { q: 'Can n8n send WhatsApp messages?', a: 'Yes, through the official WhatsApp Business Platform with approved templates and opted-in contacts.' },
      ],
    },
  },
  {
    slug: 'whatsapp-email-automation',
    name: 'WhatsApp & Email',
    group: 'Automate',
    short: 'Official WhatsApp Business Platform and email flows: confirmations, reminders, follow-ups and broadcasts.',
    page: {
      h1: 'WhatsApp Automation for Businesses in India',
      metaTitle: 'WhatsApp Business API Automation in India | Deepanshu Lathar',
      metaDescription:
        'WhatsApp Business API and email automation for Indian businesses: order updates, reminders, lead follow-ups, broadcasts to opted-in customers and a shared inbox. Official API only. From ₹20,000.',
      intro: [
        'In India your customers live on WhatsApp. They ignore email, they miss calls, but they read WhatsApp within minutes. Most businesses still run it from one phone: a person typing the same order update, appointment reminder or price list fifty times a day, and leads going cold because nobody replied on Sunday.',
        'I set up WhatsApp and email automation on the official WhatsApp Business Platform, so messages go out on their own, replies land in a shared inbox, and your number is never at risk of a ban.',
      ],
      deliverables: [
        'WhatsApp Business Platform set-up: Meta business, number, display name and verification help',
        'Message templates written and submitted for approval',
        'Automated flows: confirmations, reminders, follow-ups, payment links, review requests',
        'Opt-in capture on your website, forms and checkout, with opt-out handling',
        'Broadcasts to opted-in segments with delivery and read reporting',
        'Matching email flows for people who prefer email',
        'A shared inbox or CRM view so your team can take over any chat',
        'Cost estimate per conversation so there are no surprises',
      ],
      sections: [
        {
          h2: 'Official API, no ban risk',
          body: [
            'Bulk-sender apps and browser extensions that blast messages from a normal WhatsApp number break WhatsApp’s terms, and the number gets banned, usually right when a campaign is working. I only build on the official WhatsApp Business Platform: verified sender, approved templates, opted-in contacts.',
            'You pay Meta per conversation at published rates, and I show you the expected monthly cost before we start.',
          ],
        },
        {
          h2: 'Flows that pay for themselves',
          body: [
            'The highest-return flows are boring: an appointment reminder the day before, an order confirmation with a tracking link, a payment reminder with a UPI link, a follow-up to a lead who asked for a price and went quiet. Each one replaces a message someone used to type by hand.',
          ],
        },
        {
          h2: 'Email where it still wins',
          body: [
            'Invoices, receipts, long updates and B2B follow-ups still belong in email. I set up domain authentication (SPF, DKIM, DMARC) so your emails land in the inbox, and keep WhatsApp and email in step so a customer never gets the same message twice.',
          ],
        },
      ],
      caseStudy: {
        work: 'picapool-crm-automation',
        title: 'Picapool CRM and WhatsApp dashboard',
        body: 'For Picapool I built the CRM, the n8n workflows behind it and a WhatsApp Business API dashboard, so campaign leads were followed up on WhatsApp from one place.',
      },
      process: [
        'Discovery call to list the messages you send by hand today',
        'Proposal with flows, templates and monthly cost estimate',
        'Meta set-up and template approval, flows built and demoed weekly',
        'Launch on a small segment first, then everyone opted in',
        'Monthly report and retainer for new flows',
      ],
      priceKey: 'Automation setup',
      faq: [
        { q: 'Can I keep using WhatsApp on my phone?', a: 'A number on the API cannot also run in the normal WhatsApp app, so most businesses use a new number for automation or move their main number to a shared inbox.' },
        { q: 'How long does template approval take?', a: 'Usually minutes to a day. I write templates to Meta’s rules so they pass the first time.' },
        { q: 'Can I message my old customer list?', a: 'Only people who agreed to hear from you on WhatsApp. I can add an opt-in step to your next email or SMS to rebuild that list properly.' },
        { q: 'Does this work with Shopify?', a: 'Yes. Order, shipping, COD confirmation and abandoned-cart messages are the most common set-up.' },
      ],
    },
  },
  {
    slug: '3d-websites',
    name: '3D Websites',
    group: 'Build',
    short: 'Scroll-driven, interactive websites with real-time 3D that still load fast and rank.',
    page: {
      h1: '3D Website Development: Interactive Sites That Still Load Fast',
      metaTitle: '3D Website Development in India | Deepanshu Lathar',
      metaDescription:
        'Interactive 3D and scroll-animated websites built with Three.js, React Three Fiber and GSAP, kept under a 2.5 s LCP, crawlable by Google and smooth on mid-range phones. From ₹35,000.',
      intro: [
        'A 3D website can make a launch feel expensive and memorable. It can also make a page take eight seconds to load, drain a phone battery and hide every word from Google. Most of the 3D sites you see on award galleries are built for a high-end laptop on fast Wi-Fi.',
        'I build 3D and scroll-animated websites for real visitors: the text is real HTML that search engines read, the 3D loads after the page is usable, and phones get a lighter version that still looks intentional. This site is an example: scroll back to the top and watch it.',
      ],
      deliverables: [
        'Art direction: references, motion principles and a clickable draft before the full build',
        'Real-time 3D with Three.js and React Three Fiber, low-poly with baked lighting',
        'Scroll-driven animation with GSAP and ScrollTrigger, smooth scrolling with Lenis',
        'A lighter mobile version and a reduced-motion version',
        'SEO-safe build: server-rendered text, metadata, schema and sitemap',
        'Performance budget: LCP under 2.5 s, CLS under 0.05, 60 fps target',
        'A CMS or content file so you can edit copy without touching the 3D',
        'Hosting on Vercel with your domain',
      ],
      sections: [
        {
          h2: 'Motion that explains, not decorates',
          body: [
            'Every animation on a good 3D site answers a question: what does this product do, what changes when I use it, why should I care. I start from your story and pick two or three moments worth animating, rather than moving everything on the page.',
          ],
        },
        {
          h2: 'Fast on a ₹15,000 phone',
          body: [
            'The 3D models stay small, lighting is baked into the material so the phone does less work, and the canvas pauses whenever it is off-screen. Phones get still images in place of live 3D where the frame rate would suffer, and anyone who has asked their device for less motion gets calm fades instead.',
          ],
        },
        {
          h2: 'Google still reads every word',
          body: [
            'Animations only move and fade elements that are already in the HTML; they never create the text. Search engines and AI assistants see the same content a visitor does, with proper headings, metadata and structured data.',
          ],
        },
      ],
      caseStudy: {
        title: 'This website, 143.lat',
        body: 'The site you are on uses an orbit-stage hero with clay 3D objects, a pinned services stage, a curtain transition and a velocity carousel. All text is server-rendered, 3D loads after first paint, and phones get a lighter version.',
      },
      process: [
        'Discovery call and reference review',
        'Proposal with a motion plan and performance budget',
        'Clickable draft of the hero, then the full build with weekly demos',
        'Testing on desktop, tablet, a mid-range Android and reduced motion',
        'Launch and two weeks of fixes',
      ],
      priceKey: 'Business website',
      faq: [
        { q: 'Will a 3D website hurt my SEO?', a: 'Not when it is built this way. The text is server-rendered HTML and the 3D loads after the page is usable, so Google indexes everything.' },
        { q: 'Do I need 3D models made?', a: 'Simple shapes and product stand-ins are built in code. For your actual product, I work from your CAD files or a 3D artist’s models.' },
        { q: 'Can you use Spline?', a: 'Yes, for simple scenes. For anything with tight performance needs I build directly in Three.js.' },
        { q: 'How long does it take?', a: 'Three to five weeks for a full site, depending on how many scenes it has.' },
      ],
    },
  },
  // Services without their own page yet: they link to /services#slug.
  { slug: 'websites', name: 'Business Websites', group: 'Build', short: 'Fast, clear websites with a CMS, SEO set-up and WhatsApp and booking built in.', priceKey: 'Business website' },
  { slug: 'landing-pages', name: 'Landing Pages', group: 'Build', short: 'One page, one offer, one action. Built to turn ad and outreach traffic into calls.', priceKey: 'Landing page' },
  { slug: 'apps', name: 'Web Apps', group: 'Build', short: 'Dashboards, portals and internal tools on Next.js and Supabase.' },
  { slug: 'scraping', name: 'Scraping', group: 'Automate', short: 'Lead lists, price tracking and market data pulled on a schedule, cleaned and delivered to a sheet.', priceKey: 'Automation setup' },
  { slug: 'workflow-optimisation', name: 'Workflow Optimisation', group: 'Automate', short: 'A review of how work moves through your team, and the two or three changes that save the most hours.', priceKey: 'Automation setup' },
  { slug: 'seo-performance', name: 'SEO & Performance', group: 'Grow', short: 'Technical SEO, Core Web Vitals, schema and content structure that gets you found.' },
  { slug: 'payments-booking', name: 'Payments & Booking', group: 'Grow', short: 'Razorpay, UPI links, Cal.com and booking flows that confirm themselves on WhatsApp.' },
  { slug: 'maintenance', name: 'Maintenance', group: 'Grow', short: 'A monthly retainer for updates, monitoring, backups and small features.', priceKey: 'Monthly retainer' },
];

// Order for the big homepage list.
export const LIST_ORDER = [
  'shopify', 'ai-agents', 'n8n-automation', 'whatsapp-email-automation', '3d-websites', 'websites', 'landing-pages',
  'apps', 'seo-performance', 'scraping', 'workflow-optimisation', 'payments-booking', 'maintenance',
];

export const serviceHref = (s: Service) => `/services/${s.slug}`;

// Projects that actually demonstrate each service (slugs in content/work.ts PROJECTS), first = featured.
// An empty list hides the preview: no project, no picture.
export const SERVICE_PROJECTS: Record<string, string[]> = {
  shopify: ['spraykart'],
  'ai-agents': ['linkedin-autopilot', 'picapool-ai-data-analyst'],
  'n8n-automation': ['picapool-crm-automation'],
  'whatsapp-email-automation': ['picapool-crm-automation'],
  '3d-websites': [],
  websites: ['tulips-oven', 'yourprofessionals'],
  'landing-pages': ['picapool-acquisition-campaign'],
  apps: ['gapl', 'sangsafar', 'rumour-mill'],
  'seo-performance': ['yourprofessionals'],
  scraping: ['picapool-crm-automation'],
  'workflow-optimisation': ['picapool-crm-automation'],
  'payments-booking': [],
  maintenance: [],
};
export const getService = (slug: string) => SERVICES.find(s => s.slug === slug);
export const launched = SERVICES.filter(s => s.page);
