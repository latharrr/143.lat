// Decorative mockups for the services stage and work carousel. Screens are real work;
// charts, chats and graphs are labelled samples. All aria-hidden by their parents.
import Image from 'next/image';
import type { Mock } from '@/content/work';

export function Browser({ src, url, className = '' }: { src: string; url: string; className?: string }) {
  return (
    <div className={`mk mk-browser ${className}`}>
      <div className="mk-bar"><i /><i /><i /><span>{url}</span></div>
      <div className="mk-screen"><Image src={src} alt="" fill sizes="(max-width: 767px) 80vw, 40vw" /></div>
    </div>
  );
}

export function Phone({ src, className = '', children }: { src?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`mk mk-phone ${className}`}>
      <div className="mk-notch" />
      <div className="mk-screen">{src ? <Image src={src} alt="" fill sizes="240px" /> : children}</div>
    </div>
  );
}

export function Chat({ className = '' }: { className?: string }) {
  return (
    <div className={`mk mk-chat ${className}`}>
      <p className="mk-tag">Sample flow</p>
      <p className="bub in">Hi! Is the 2 BHK deep-clean slot free on Saturday?</p>
      <p className="bub out">Yes, 11 am or 3 pm are open. Tap one to book 👇</p>
      <p className="bub out btns"><span>11 am</span><span>3 pm</span></p>
      <p className="bub in">3 pm</p>
      <p className="bub out">Booked ✓ You’ll get a reminder on Friday evening.</p>
    </div>
  );
}

const NODES = [
  { x: 14, y: 50, t: 'Webhook', s: 'New lead' },
  { x: 38, y: 26, t: 'Enrich', s: 'Company data' },
  { x: 38, y: 74, t: 'Score', s: 'Fit 0–100' },
  { x: 64, y: 50, t: 'CRM', s: 'Create deal' },
  { x: 88, y: 30, t: 'WhatsApp', s: 'Template' },
  { x: 88, y: 70, t: 'Slack', s: 'Alert team' },
];
const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]];
export function NodeGraph({ className = '' }: { className?: string }) {
  return (
    <div className={`mk mk-graph ${className}`}>
      <p className="mk-tag">Sample workflow</p>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mk-edges">
        {EDGES.map(([a, b], i) => {
          const A = NODES[a], B = NODES[b];
          const mx = (A.x + B.x) / 2;
          return <path key={i} d={`M${A.x} ${A.y} C${mx} ${A.y} ${mx} ${B.y} ${B.x} ${B.y}`} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {NODES.map(n => (
        <div key={n.t} className="mk-node" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <b>{n.t}</b><span>{n.s}</span>
        </div>
      ))}
    </div>
  );
}

export function Agent({ className = '' }: { className?: string }) {
  return (
    <div className={`mk mk-agent ${className}`}>
      <p className="mk-tag">Sample approval</p>
      <p className="mk-agent-h">Draft ready · 2 sources checked</p>
      <p className="mk-agent-b">“Your follow-ups shouldn’t depend on someone remembering them…”</p>
      <div className="mk-agent-row"><span className="ok">✓ Post this</span><span>Edit</span><span>Skip</span></div>
    </div>
  );
}

export function Dashboard({ className = '' }: { className?: string }) {
  const bars = [32, 44, 38, 56, 62, 58, 74, 70, 86, 92];
  return (
    <div className={`mk mk-dash ${className}`}>
      <p className="mk-tag">Sample data</p>
      <p className="mk-dash-h">Organic sessions</p>
      <div className="mk-bars">{bars.map((h, i) => <i key={i} style={{ transform: `scaleY(${h / 100})` }} />)}</div>
    </div>
  );
}

export function Serp({ className = '' }: { className?: string }) {
  return (
    <div className={`mk mk-serp ${className}`}>
      <p className="mk-serp-url">143.lat › services › whatsapp</p>
      <p className="mk-serp-t">WhatsApp Automation for Businesses in India</p>
      <p className="mk-serp-d">Official WhatsApp Business Platform flows: confirmations, reminders and follow-ups…</p>
    </div>
  );
}

export function Payment({ className = '' }: { className?: string }) {
  return (
    <div className={`mk mk-pay ${className}`}>
      <p className="mk-tag">Sample</p>
      <span className="mk-pay-tick">✓</span>
      <p className="mk-pay-h">Booking confirmed</p>
      <p className="mk-pay-d">Sat · 3:00 pm · paid via UPI</p>
    </div>
  );
}

export function Changelog({ className = '' }: { className?: string }) {
  const rows = ['Fixed checkout on iOS 18', 'Added Hindi FAQ page', 'Renewed SSL + backups', 'New WhatsApp template'];
  return (
    <div className={`mk mk-log ${className}`}>
      <p className="mk-tag">Sample month</p>
      <p className="mk-dash-h">Retainer log</p>
      {rows.map(r => <p key={r} className="mk-log-row"><i />{r}</p>)}
    </div>
  );
}

export function Uptime({ className = '' }: { className?: string }) {
  return (
    <div className={`mk mk-uptime ${className}`}>
      <p className="mk-tag">Sample</p>
      <p className="mk-dash-h">Monitoring · 30 days</p>
      <div className="mk-ticks">{Array.from({ length: 30 }, (_, i) => <i key={i} />)}</div>
    </div>
  );
}

/** Code-drawn screens for case studies whose real screens are private. */
export function MockScreen({ mock }: { mock: Mock }) {
  if (mock === 'graph') return <NodeGraph className="is-screen" />;
  if (mock === 'analyst') return (
    <div className="mk-screen-draw analyst">
      <p className="mk-tag">Illustration</p>
      <p className="q">“How many new users came from campus drives last week?”</p>
      <pre>SELECT channel, count(*) … — validated ✓ read-only</pre>
      <div className="mk-bars small">{[40, 70, 55, 90, 35].map((h, i) => <i key={i} style={{ transform: `scaleY(${h / 100})` }} />)}</div>
    </div>
  );
  if (mock === 'telegram') return (
    <div className="mk-screen-draw tg">
      <p className="mk-tag">Illustration</p>
      <p className="bub out">Brief: why small teams should automate follow-ups</p>
      <p className="bub in">Researching 4 sources… ✓ 2 drafts ready</p>
      <p className="bub in card">Final post + cover image</p>
      <p className="bub in btns"><span>✅ Post this</span><span>Edit</span></p>
    </div>
  );
  return (
    <div className="mk-screen-draw slspl">
      <p className="mk-tag">Illustration</p>
      <p className="slspl-word">SLSPL</p>
      <p className="slspl-sub">Document attestation</p>
    </div>
  );
}
