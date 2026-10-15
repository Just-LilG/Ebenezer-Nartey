import { sql } from '../lib/db';
import { GuestForm, MemoryForm, Rsvp } from '../components/Forms';
import Candle from '../components/Candle';
import Reveal from '../components/Reveal';
import Gallery from '../components/Gallery';
import Dock from '../components/Dock';
export const dynamic = 'force-dynamic';

const SITE = 'https://ebenezer-memorial.vercel.app';
const FAMILY = [
  ['Widow', ['Regina Nartey']],
  ['Children', ['Late Bernicesa Nartey', 'Godbless Nartey', 'Christable Nartey', 'Davis Luck Nartey']],
  ['Parents', ['Father: Henry Agyake', 'Mother: Rita Dede Agah']],
  ['Chief mourners', ['Asafostse Aga Kwabena II', 'Nene Aga Tetteh', 'Waku Maste Emanuel']],
  ['Brothers and sisters', ['Agah Rachel', 'Bryan Yiadom']],
  ['Cousins', ['Happy Agah', 'Elizabeth Agah', 'Princess Agah', 'Prince Agah', 'Abraham Agah', 'Daniel Agah', 'Eunice Agah', 'Bendicta Agah', 'Joyce Agah', 'Larry Agah', 'Gloria Agah', 'Marty Agah']],
];

export default async function Home() {
  const [events, content, msgs, mems, candles] = await Promise.all([
    sql`SELECT slug, title, venue, address, map_url, notes, start_time, (event_date - current_date)::int AS days, to_char(event_date, 'FMDay, FMDD FMMonth YYYY') AS d, to_char(event_date, 'YYYYMMDD') AS ymd, to_char(event_date + 1, 'YYYYMMDD') AS ymd2, to_char(event_date, 'DD') AS dd, to_char(event_date, 'Mon') AS mon, to_char(event_date, 'FMDay') AS dow FROM events ORDER BY sort_order`,
    sql`SELECT key, value FROM site_content`,
    sql`SELECT name, message, to_char(created_at, 'FMDD FMMon YYYY') AS d FROM guestbook WHERE status = 'approved' ORDER BY created_at DESC LIMIT 100`,
    sql`SELECT name, story, media_url FROM memories WHERE status = 'approved' AND media_url IS NOT NULL ORDER BY created_at DESC LIMIT 60`,
    sql`SELECT count(*)::int AS n FROM candles`,
  ]);
  const c = Object.fromEntries(content.map((r) => [r.key, r.value]));
  const born = new Date(c.born + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const hero = c.hero_media ? '/api/media/' + c.hero_media : null;
  const life = c.life_media ? '/api/media/' + c.life_media : null;
  const paras = (c.life_story || '').split(/\n\s*\n/).filter(Boolean);
  const full = c.full_name || 'Ebenezer Nartey';
  const parts = full.split(' ');
  const last = parts.length > 1 ? parts.pop() : '';
  const first = parts.join(' ');
  const initials = ((first[0] || '') + (last[0] || '')).toUpperCase();
  const wa = 'https://wa.me/?text=' + encodeURIComponent('In loving memory of ' + full + '. Funeral details, tributes and guestbook: ' + SITE);
  const next = events.find((e) => e.days >= 0);
  const when = next ? (next.days === 0 ? 'Today' : next.days === 1 ? 'Tomorrow' : 'In ' + next.days + ' days') : null;

  const place = (e) => [e.venue, e.address].filter(Boolean).join(', ');
  const dir = (e) => e.map_url || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place(e));
  const cal = (e) => 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(e.title + ' - ' + full) + '&dates=' + e.ymd + '/' + e.ymd2 + '&location=' + encodeURIComponent(place(e)) + '&details=' + encodeURIComponent((e.start_time ? 'Starts ' + e.start_time + '. ' : '') + 'In loving memory of ' + full + '. ' + SITE);

  return (
    <>
      <header className="hero">
        <img className="flor f1" src="/art/floral.webp" alt="" aria-hidden="true" />
        <img className="flor f2" src="/art/floral.webp" alt="" aria-hidden="true" />
        <img className="birds" src="/art/birds.webp" alt="" aria-hidden="true" />
                <div className="in">
          <div className="t">
            <p className="k">In loving memory</p>
            <h1><span>{first}</span>{last && <span><em>{last}</em></span>}</h1>
            <p className="dates">{born} &ndash; {c.passed}</p>
            
            
          </div>
          <div className="arch">{hero ? <div className="pic"><img src={hero} alt={full} fetchPriority="high" /></div> : <span className="ini" aria-hidden="true">{initials}</span>}<img className="dove" src="/art/dove.webp" alt="" aria-hidden="true" /></div>
        </div>
        <a className="cue" href="#service" aria-label="Scroll to funeral arrangements"><span /></a>
      </header>

      {next && (
        <div className="nxs"><Reveal>
          <div className="nx"><div><span className="nxw"><i className="dot" aria-hidden="true" />{when}</span><b>{next.title}</b><span className="nxd">{next.dow}, {next.dd} {next.mon}{next.start_time ? ' \u00B7 ' + next.start_time : ''} &middot; {next.venue}</span></div><a className="nxg" href={dir(next)} target="_blank" rel="noopener">Directions</a></div>
          <div className="cta2"><a className="btn" href="#rsvp">RSVP</a><a className="btn line" href={wa}>Share</a></div>
        </Reveal></div>
      )}

      <div className="facts">
        <Reveal><b>{born}</b><span>Born</span></Reveal>
        <Reveal delay={100}><b>{c.passed}</b><span>Passed</span></Reveal>
        <Reveal delay={200}><b>{c.age} years</b><span>A life well lived</span></Reveal>
      </div>

      <section id="service"><div className="wrap">
        <Reveal><p className="eyebrow">Funeral arrangements</p><h2>Join us to say goodbye</h2></Reveal>
        <div className="evs">
          {events.map((e, i) => {
            const st = e.days < 0 ? 'pst' : next && e.slug === next.slug ? 'nx' : '';
            return (
              <Reveal key={e.slug} className={'evc ' + st} delay={i * 120}>
                {st === 'nx' && <span className="tag">{when}</span>}
                {st === 'pst' && <span className="tag dn">Completed</span>}
                <div className="bdg"><b>{e.dd}</b><span>{e.mon}</span></div>
                <div>
                  <div className="dw">{e.dow}{e.start_time ? ' \u00B7 ' + e.start_time : ''}</div>
                  <h3>{e.title}</h3>
                  <p>{e.venue}{e.address ? <><br />{e.address}</> : null}{!e.start_time && <><br />Time to be confirmed</>}{e.notes ? <><br />{e.notes}</> : null}</p>
                  {e.days >= 0 && <div className="acts"><a href={dir(e)} target="_blank" rel="noopener">Directions</a><a href={cal(e)} target="_blank" rel="noopener">Add to calendar</a></div>}
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="svc-cta"><a className="btn" href="#rsvp">Let the family know you are coming</a></Reveal>
        {c.contact ? <p className="note" style={{ marginTop: 24 }}>Questions? {c.contact}</p> : null}
      </div></section>

      <section id="life" className="soft"><div className="wrap">
        <Reveal><p className="eyebrow">His life</p><h2>Remembering {parts[0] || 'him'}</h2></Reveal>
        <div className="story">
          {life && <Reveal><img className="ph" src={life} alt={full} loading="lazy" /></Reveal>}
          <Reveal delay={150}>
            {paras.length ? paras.map((p, i) => <p key={i}>{p}</p>) : <p>{full} was born on {born} and lived {c.age} years. He was a husband, a father, a son, a brother and a cousin, and he is dearly missed by all who knew him.</p>}
            {c.quote ? <blockquote>{c.quote}</blockquote> : null}
            {!paras.length && <div className="tbd">His full story will be added by the family.</div>}
          </Reveal>
        </div>
      </div></section>

      <section id="family"><div className="wrap">
        <Reveal><p className="eyebrow">Left to cherish his memory</p><h2>His family</h2></Reveal>
        <div className="fam">
          {FAMILY.map(([t, names], i) => <Reveal key={t} className="fc" delay={(i % 3) * 100}><h3>{t}</h3><ul>{names.map((n) => <li key={n}>{n}</li>)}</ul></Reveal>)}
        </div>
      </div></section>

      <section id="photos" className="soft"><div className="wrap">
        <Reveal><p className="eyebrow">Memory wall</p><h2>Photos and moments</h2></Reveal>
        {mems.length ? <Gallery items={mems} /> : <p className="note">Photos will appear here.</p>}
        <Reveal className="card"><h3 style={{ fontSize: 30, marginBottom: 18 }}>Share a photo</h3><MemoryForm /></Reveal>
      </div></section>

      <section id="candle" className="blk" style={{ overflow: 'hidden' }}><div className="wrap">
        <img className="cdec l" src="/art/candles.webp" alt="" aria-hidden="true" /><img className="cdec r" src="/art/candles.webp" alt="" aria-hidden="true" />
        <Reveal><p className="eyebrow" style={{ textAlign: 'center' }}>A moment of remembrance</p><h2 style={{ textAlign: 'center' }}>Light a candle</h2><Candle initial={candles[0].n} /></Reveal>
      </div></section>

      <section id="guestbook"><div className="wrap">
        <Reveal><p className="eyebrow">Guestbook</p><h2>Leave a message</h2><p style={{ maxWidth: '56ch', marginTop: -14, marginBottom: 28 }}>Share a memory or a few kind words for the family. Messages appear after the family approves them.</p></Reveal>
        <Reveal><GuestForm /></Reveal>
        {msgs.length > 0 && <div className="msgs">{msgs.map((m, i) => <Reveal key={i} className="msg"><p>{m.message}</p><small>{m.name} &middot; {m.d}</small></Reveal>)}</div>}
      </div></section>

      <section id="rsvp" className="soft"><div className="wrap">
        <Reveal><p className="eyebrow">RSVP</p><h2>Will you attend?</h2><p style={{ maxWidth: '56ch', marginTop: -14, marginBottom: 28 }}>Let the family know so they can plan.</p></Reveal>
        <Reveal><Rsvp events={events.map((e) => ({ slug: e.slug, title: e.title, d: e.d, past: e.days < 0, def: !!next && e.slug === next.slug, cal: cal(e) }))} /></Reveal>
      </div></section>

      <footer>
        <img className="arr" src="/art/arrange.webp" alt="" aria-hidden="true" />
        <h3>{full}</h3>
        <p>{born} &ndash; {c.passed}<br />With love from the Nartey and Agah families</p>
        <a className="btn light" href={wa}>Share on WhatsApp</a>
      </footer>

      <Dock />
    </>
  );
}
