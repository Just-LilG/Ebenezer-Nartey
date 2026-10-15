import { sql } from '../../lib/db';
import { isAdmin } from '../../lib/auth';
import { Uploader } from '../../components/Forms';
import { login, logout, moderate, saveEvent, saveContent } from './actions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Family admin', robots: 'noindex' };

function Mod({ t, id }) {
  return (
    <form action={moderate} className="row">
      <input type="hidden" name="t" value={t} /><input type="hidden" name="id" value={id} />
      <button name="s" value="approved">Approve</button><button name="s" value="rejected" className="bad">Reject</button>
    </form>
  );
}

export default async function Admin({ searchParams }) {
  const sp = await searchParams;
  if (!(await isAdmin())) {
    return (
      <div className="adm"><h2>Family sign in</h2>
        <form action={login}>
          <div><label htmlFor="pw">Password</label><input id="pw" name="password" type="password" required autoComplete="current-password" /></div>
          {sp?.e && <p className="err" role="alert">That password was not right.</p>}
          <button>Sign in</button>
        </form>
      </div>
    );
  }
  const [pg, pm, rs, ev, ct] = await Promise.all([
    sql`SELECT id, name, message FROM guestbook WHERE status = 'pending' ORDER BY created_at`,
    sql`SELECT id, name, story, media_url FROM memories WHERE status = 'pending' ORDER BY created_at`,
    sql`SELECT name, phone, attending_events, headcount, dietary FROM rsvps ORDER BY created_at DESC`,
    sql`SELECT * FROM events ORDER BY sort_order`,
    sql`SELECT key, value FROM site_content`,
  ]);
  const c = Object.fromEntries(ct.map((r) => [r.key, r.value]));
  const total = rs.reduce((a, r) => a + r.headcount, 0);
  return (
    <div className="adm">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}><h1 style={{ fontSize: 30 }}>Family admin</h1><form action={logout}><button>Sign out</button></form></div>
      <p><a href="/">View the public site</a></p>

      <h2>Waiting for approval ({pg.length + pm.length})</h2>
      {pg.length + pm.length === 0 && <p className="note">Nothing waiting.</p>}
      {pg.map((m) => <div className="card" key={'g' + m.id}><strong>{m.name}</strong><p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p><Mod t="g" id={m.id} /></div>)}
      {pm.map((m) => <div className="card" key={'m' + m.id}><strong>{m.name}</strong>{m.media_url && <p><img src={m.media_url} alt="" style={{ maxWidth: 240, width: '100%' }} /></p>}{m.story && <p>{m.story}</p>}<Mod t="m" id={m.id} /></div>)}

      <h2>Photos</h2>
      <div className="card"><Uploader /></div>

      <h2>Story and details</h2>
      <form action={saveContent} className="card">
        <div><label htmlFor="c1">Date of passing (as shown)</label><input id="c1" name="passed" defaultValue={c.passed} /></div>
        <div><label htmlFor="c2">Contact for guests (name and phone or email)</label><input id="c2" name="contact" defaultValue={c.contact} /></div>
        <div><label htmlFor="c3">Favorite quote or saying</label><input id="c3" name="quote" defaultValue={c.quote} /></div>
        <div><label htmlFor="c4">Life story (leave a blank line between paragraphs)</label><textarea id="c4" name="life_story" style={{ minHeight: 220 }} defaultValue={c.life_story} /></div>
        <button>Save</button>
      </form>

      <h2>Service details</h2>
      {ev.map((e) => (
        <form action={saveEvent} className="card" key={e.id}>
          <strong>{e.title}</strong><input type="hidden" name="id" value={e.id} />
          <div><label>Time (for example 10:00 AM)</label><input name="start_time" defaultValue={e.start_time || ''} /></div>
          <div><label>Venue</label><input name="venue" defaultValue={e.venue || ''} /></div>
          <div><label>Address</label><input name="address" defaultValue={e.address || ''} /></div>
          <div><label>Map link (Google Maps)</label><input name="map_url" defaultValue={e.map_url || ''} /></div>
          <div><label>Notes (dress code, parking)</label><input name="notes" defaultValue={e.notes || ''} /></div>
          <button>Save</button>
        </form>
      ))}

      <h2>RSVPs ({rs.length} replies, {total} people)</h2>
      {rs.length === 0 ? <p className="note">No replies yet.</p> : (
        <div style={{ overflowX: 'auto' }}><table><thead><tr><th>Name</th><th>Phone</th><th>Events</th><th>People</th><th>Diet</th></tr></thead><tbody>
          {rs.map((r, i) => <tr key={i}><td>{r.name}</td><td>{r.phone}</td><td>{(r.attending_events || []).join(', ')}</td><td>{r.headcount}</td><td>{r.dietary}</td></tr>)}
        </tbody></table></div>
      )}
    </div>
  );
}
