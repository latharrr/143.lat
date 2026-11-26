// Recreated screens. Every name, number and message here is anonymised.

function Analyst() {
  // shortcut: bar heights are layout only, never real values.
  const rows = [['Channel A', 90], ['Channel B', 64], ['Channel C', 46], ['Channel D', 30], ['Channel E', 18]] as const;
  const qa = [
    { q: 'How many new users came from each channel last week?', sql: 'SELECT channel, COUNT(*) AS users\nFROM signups\nWHERE created_at >= now() - interval \'7 days\'\nGROUP BY channel\nORDER BY users DESC;', tables: 'signups' },
    { q: 'Which campuses had the most first bookings this month?', sql: 'SELECT c.name, COUNT(b.id) AS first_bookings\nFROM bookings b JOIN users u ON u.id = b.user_id\nJOIN campuses c ON c.id = u.campus_id\nWHERE b.is_first AND b.created_at >= date_trunc(\'month\', now())\nGROUP BY c.name ORDER BY first_bookings DESC LIMIT 5;', tables: 'bookings, users, campuses' },
  ];
  return (
    <div className="cap cap-analyst">
      <aside className="an-side">
        <p className="an-logo">Analyst</p>
        <p className="an-h">Today</p>
        <ul>{['New users by channel', 'First bookings by campus', 'Weekly retention', 'Refunds over 7 days'].map((t, i) => <li key={t} className={i === 0 ? 'on' : ''}>{t}</li>)}</ul>
        <p className="an-h">Schema</p>
        <p className="an-schema"><b>79</b> tables · read-only role</p>
        <div className="an-tg"><i />Telegram bot connected</div>
      </aside>
      <main className="an-main">
        {qa.map((x, k) => (
          <section key={k} className="an-turn">
            <p className="an-q">{x.q}</p>
            <div className="an-card">
              <div className="an-card-h"><span>Generated SQL</span><span className="an-ok">✓ Read-only check passed</span></div>
              <pre>{x.sql}</pre>
              <div className="an-checks">
                <span>Parsed: 1 statement</span><span>Type: SELECT</span><span>Tables: {x.tables}</span><span>No writes, no DDL</span>
              </div>
            </div>
            <div className="an-grid">
              <ul className="an-table">{rows.map(([a]) => <li key={a}>{k ? a.replace('Channel', 'Campus') : a}</li>)}</ul>
              <div className="an-chart">
                {rows.map(([a, h]) => <div key={a} className="an-bar"><i style={{ height: `${h}%` }} /></div>)}
              </div>
            </div>
            <p className="an-sent">Sent to the team on Telegram · 09:{k ? '42' : '14'}</p>
          </section>
        ))}
        <div className="an-input">Ask a question about your data…<span>Enter</span></div>
      </main>
    </div>
  );
}

function Autopilot() {
  return (
    <div className="cap cap-tg">
      <aside className="tg-side">
        <p className="tg-h">Chats</p>
        {[['Post autopilot', 'Draft 2 is ready for review', true], ['Story bank', 'Your own stories, cited per post', false], ['Scheduler', 'Stopped 13 Nov 2026', false]].map(([n, s, on]) => (
          <div key={n as string} className={`tg-chat ${on ? 'on' : ''}`}><i>{(n as string)[0]}</i><div><b>{n}</b><span>{s}</span></div></div>
        ))}
      </aside>
      <main className="tg-main">
        <header className="tg-top"><b>Post autopilot</b><span>bot</span></header>
        <div className="tg-thread">
          <p className="tg-day">Monday</p>
          <p className="b out">Brief: what a read-only AI analyst can and cannot do</p>
          <p className="b in">Matched 2 stories from your bank:<br />· The query that was blocked before it ran<br />· Answers sent to the team chat each morning</p>
          <div className="b in card">
            <p className="tg-k">Draft A · 164 words</p>
            <p>The most useful thing our analyst ever did was refuse to run a query. It only gets a read-only role, and every SQL statement is parsed before it runs…</p>
          </div>
          <div className="b in card"><p className="tg-k">Grounding check</p><ul className="tg-checks"><li className="ok">✓ “read-only role” matches story #31</li><li className="ok">✓ No invented numbers</li></ul></div>
          <p className="b in btns"><span className="go">✓ Post this</span><span>Edit</span><span>Draft B</span><span>Skip</span></p>
          <p className="b out">Post this</p>
          <p className="b in">Posted. Link saved to the story bank.</p>
          <p className="tg-day">Today</p>
          <p className="b out">Brief: why small teams should automate follow-ups</p>
          <p className="b in">Matched 3 stories from your bank:<br />· Lead replies that waited two days<br />· The weekly report nobody opened<br />· Moving a team off a shared spreadsheet</p>
          <p className="b in">Writing two drafts in your voice…</p>
          <div className="b in card">
            <p className="tg-k">Draft A · 182 words</p>
            <p>A lead once waited two days for a reply. Nobody was lazy. The follow-up just lived in someone’s head. We moved it into a workflow: every new enquiry gets a reply in minutes and a reminder after a day…</p>
          </div>
          <div className="b in card">
            <p className="tg-k">Grounding check</p>
            <ul className="tg-checks">
              <li className="ok">✓ “two days for a reply” matches story #12</li>
              <li className="ok">✓ “reply in minutes” matches story #12</li>
              <li className="ok">✓ No invented numbers</li>
              <li className="no">✕ Removed: “doubled our revenue” (no source)</li>
            </ul>
          </div>
          <div className="b in card cover"><div className="tg-cover"><span>Follow-ups shouldn’t depend on memory.</span></div><p className="tg-k">Cover image · 1200 × 1200</p></div>
          <p className="b in btns"><span className="go">✓ Post this</span><span>Edit</span><span>Draft B</span><span>Skip</span></p>
          <p className="b out">Post this</p>
          <p className="b in">Scheduled. I’ll send the link once it is posted.</p>
        </div>
        <div className="tg-input">Write a brief…</div>
      </main>
    </div>
  );
}

function Crm() {
  const leads = [
    ['Northfield College', 'Campus partner', 'Enriched', 'Contacted', 'Ops lead'],
    ['Riverside Institute', 'Campus partner', 'Enriched', 'Meeting', 'Ops lead'],
    ['Cafe on 5th', 'Merchant', 'Enriched', 'New', 'Growth'],
    ['Lakeside University', 'Campus partner', 'Pending', 'New', 'Ops lead'],
    ['Metro Travels', 'Merchant', 'Enriched', 'Won', 'Growth'],
    ['Hilltop College', 'Campus partner', 'Enriched', 'Contacted', 'Ops lead'],
    ['Studio Twelve', 'Merchant', 'Failed', 'New', 'Growth'],
    ['Central Polytechnic', 'Campus partner', 'Enriched', 'Meeting', 'Ops lead'],
  ];
  const runs = [['Prospect enrichment', 'CRM rows updated', 'Success', '08:00'], ['Link click tracking', 'Events logged', 'Success', '08:05'], ['Daily KPI digest', 'Sent to the team', 'Success', '09:00'], ['Prospect enrichment', 'One lookup failed', 'Retried', '11:00']];
  return (
    <div className="cap cap-crm">
      <aside className="crm-side">
        <p className="crm-logo">Ops CRM</p>
        {['Pipeline', 'Prospects', 'Campaign links', 'Automations', 'Reports', 'Team & roles'].map((t, i) => <p key={t} className={i === 1 ? 'on' : ''}>{t}</p>)}
        <p className="crm-role">Signed in as <b>Ops lead</b><br />Role: editor</p>
      </aside>
      <main className="crm-main">
        <div className="crm-panel">
          <div className="crm-panel-h"><b>Prospects</b><span className="crm-filter">All owners ▾</span><span className="crm-filter">Stage ▾</span><span className="crm-btn">+ Add prospect</span></div>
          <table className="crm-table">
            <thead><tr><th>Name</th><th>Type</th><th>Enrichment</th><th>Stage</th><th>Owner</th></tr></thead>
            <tbody>{leads.map(r => <tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td><span className={`pill e-${r[2].toLowerCase()}`}>{r[2]}</span></td><td><span className={`pill s-${r[3].toLowerCase()}`}>{r[3]}</span></td><td>{r[4]}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="crm-row">
          <div className="crm-panel">
            <div className="crm-panel-h"><b>Enrichment workflow</b><span className="crm-live">n8n · active</span></div>
            <div className="crm-flow">
              {['New prospect', 'Look up company', 'Find contact', 'Score fit', 'Update CRM', 'Notify owner'].map((n, i) => <div key={n} className="crm-node"><i>{i + 1}</i>{n}</div>)}
            </div>
          </div>
          <div className="crm-panel">
            <div className="crm-panel-h"><b>Daily KPI digest</b><span className="crm-live">09:00</span></div>
            <ul className="crm-digest"><li>New sign-ups <b>✓</b></li><li>Campus links clicked <b>✓</b></li><li>Prospects moved to meeting <b>✓</b></li><li>Enrichment failures <b>retried</b></li></ul>
          </div>
        </div>
        <div className="crm-panel">
          <div className="crm-panel-h"><b>Automation runs</b></div>
          <table className="crm-table">
            <thead><tr><th>Workflow</th><th>Output</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>{runs.map((r, i) => <tr key={i}><td><b>{r[0]}</b></td><td>{r[1]}</td><td><span className={`pill ${r[2] === 'Success' ? 's-won' : 's-contacted'}`}>{r[2]}</span></td><td>{r[3]}</td></tr>)}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export const SCREENS = { 'picapool-ai-analyst': Analyst, 'linkedin-autopilot': Autopilot, 'picapool-crm': Crm };
