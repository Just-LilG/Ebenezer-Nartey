import { sql } from '../lib/db';
import { googleUrl } from '../lib/cal';
import { GuestForm, MemoryForm, Rsvp } from '../components/Forms';
import Candle from '../components/Candle';
import Reveal from '../components/Reveal';
import Gallery from '../components/Gallery';
import Dock from '../components/Dock';
import Share from '../components/Share';
import Countdown from '../components/Countdown';
import GuestWall from '../components/GuestWall';
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

// Link preview for WhatsApp, Facebook and others: his portrait, name and a short line.
export async function generateMetadata() {
  try {
    const rows = await sql`SELECT key, value FROM site_content WHERE key IN ('hero_media', 'full_name')`;
    const c = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const full = c.full_name || 'Ebenezer Nartey';
    const title = 'In Loving Memory of ' + full;
    const description = 'Funeral arrangements, tributes and memories. Join the family to celebrate his life.';
    const images = c.hero_media ? [{ url: SITE + '/api/media/' + c.hero_media, alt: full }] : [];
    return {
      openGraph: { title, description, url: SITE, siteName: title, type: 'website', locale: 'en_GB', images },
      twitter: { card: images.length ? 'summary_large_image' : 'summary', title, description, images: images.map((i) => i.url) },
    };
  } catch {
    return {};
  }
}

function Head({ k, t, lead }) {
  return (
    <Reveal className="head">
      <p className="eyebrow"><span>{k}</span></p>
      <h2>{t}</h2>
      <i className="orn" aria-hidden="true" />
      {lead ? <p className="lead">{lead}</p> : null}
    </Reveal>
  );
}

function Pin() {
  return <svg className="pin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
}

// "Late Bernicesa Nartey" -> italic "Late"; "Father: Henry Agyake" -> small role above the name.
function Name({ n }) {
  const m = n.match(/^([^:]{2,20}):\s*(.+)$/);
  if (m) return <><small>{m[1]}</small>{m[2]}</>;
  if (/^Late\s/.test(n)) return <><em>Late</em> {n.slice(5)}</>;
  return <>{n}</>;
}

function Contact({ text }) {
  const m = String(text).match(/\+?\d[\d\s-]{7,}\d/);
  if (!m) return <>{text}</>;
  const i = m.index;
  return <>{text.slice(0, i)}<a href={'tel:' + m[0].replace(/[^\d+]/g, '')}>{m[0]}</a>{text.slice(i + m[0].length)}</>;
}

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
  const share = { title: 'In loving memory of ' + full, text: 'In loving memory of ' + full + '. Funeral details, tributes and guestbook:', url: SITE };
  const next = events.find((e) => e.days >= 0);
  const when = next ? (next.days === 0 ? 'Today' : next.days === 1 ? 'Tomorrow' : 'In ' + next.days + ' days') : null;

  const place = (e) => [e.venue, e.address].filter(Boolean).join(', ');
  const dir = (e) => e.map_url || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place(e));
  const cal = (e) => googleUrl({ title: e.title + ' - ' + full, ymd: e.ymd, ymd2: e.ymd2, time: e.start_time, place: place(e), details: (e.start_time ? 'Starts ' + e.start_time + '. ' : '') + 'In loving memory of ' + full + '. ' + SITE });
  const ics = (e) => '/api/ics?e=' + encodeURIComponent(e.slug);

  const feature = FAMILY.slice(0, 2);
  const others = FAMILY.slice(2).filter(([, n]) => n.length <= 6);
  const long = FAMILY.slice(2).filter(([, n]) => n.length > 6);

  return (
    <>
      <a className="skip" href="#service">Skip to funeral arrangements</a>

      <header className="hero">
        <img className="flor f1" src="/art/floral.webp" alt="" aria-hidden="true" />
        <img className="flor f2" src="/art/floral.webp" alt="" aria-hidden="true" />
        <div className="in">
          <div className="t">
            <p className="k"><span>In loving memory</span></p>
            <h1><span>{first}</span>{last && <span><em>{last}</em></span>}</h1>
            <p className="dates"><time>{born}</time><i aria-hidden="true" /><time>{c.passed}</time></p>
            {c.age ? <p className="aged">Aged {c.age} years</p> : null}
          </div>
          <div className="arch">
            {hero ? <div className="pic"><img src={hero} alt={full} fetchPriority="high" /></div> : <span className="ini" aria-hidden="true">{initials}</span>}
            <img className="dove" src="/art/dove.webp" alt="" aria-hidden="true" />
          </div>
        </div>
        <a className="cue" href="#service" aria-label="Scroll to funeral arrangements"><span /></a>
      </header>

      {next && (
        <section className="upnext" aria-label="Next service">
          <div className="un-in">
            <div className="un-t">
              <span className="un-k"><i className="dot" aria-hidden="true" /><Countdown ymd={next.ymd} time={next.start_time} fallback={when} /></span>
              <b>{next.title}</b>
              <span className="un-d">{next.dow}, {next.dd} {next.mon}{next.start_time ? ' · ' + next.start_time : ''} &middot; {next.venue}</span>
            </div>
            <a className="un-go" href={dir(next)} target="_blank" rel="noopener">Directions</a>
          </div>
        </section>
      )}
      <div className="ctas">
        <a className="btn" href="#rsvp">RSVP</a>
        <Share title={share.title} text={share.text} url={share.url} />
      </div>

      <section id="service"><div className="wrap">
        <Head k="Funeral arrangements" t="Join us to say goodbye" lead="The family warmly invites you to be with them. Tap Directions for the map, or add a service to your calendar." />
        <ol className="tl">
          {events.map((e, i) => {
            const st = e.days < 0 ? 'is-past' : next && e.slug === next.slug ? 'is-next' : '';
            return (
              <li key={e.slug} className={'tli ' + st}>
                <div className="dt" aria-hidden="true"><b>{e.dd}</b><span>{e.mon}</span></div>
                <Reveal className="tcard" delay={i * 90}>
                  <div className="tc-h">
                    <span className="dw">{e.dow}{e.start_time ? ' · ' + e.start_time : ''}</span>
                    {st === 'is-next' && <span className="tag">{when}</span>}
                    {st === 'is-past' && <span className="tag dn">Completed</span>}
                  </div>
                  <h3>{e.title}</h3>
                  <p className="loc"><Pin /><span>{e.venue}{e.address ? <><br />{e.address}</> : null}</span></p>
                  {!e.start_time && <p className="tbc">Time to be confirmed</p>}
                  {e.notes ? <p className="pn"><b>Please note</b>{e.notes}</p> : null}
                  {e.days >= 0 && (
                    <div className="acts">
                      <a href={dir(e)} target="_blank" rel="noopener">Directions</a>
                      <details className="cal">
                        <summary>Add to calendar</summary>
                        <div className="cal-m">
                          <a href={cal(e)} target="_blank" rel="noopener">Google Calendar</a>
                          <a href={ics(e)}>Apple or Outlook</a>
                        </div>
                      </details>
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
        <Reveal className="svc-cta"><a className="btn" href="#rsvp">Let the family know you are coming</a></Reveal>
        {c.contact ? <p className="ask">Questions? <Contact text={c.contact} /></p> : null}
      </div></section>

      <section id="life" className="soft"><div className="wrap">
        <Head k="His life" t={'Remembering ' + (parts[0] || 'him')} />
        <div className="story">
          {life && <Reveal className="sp"><div className="pf"><img className="ph" src={life} alt={full} loading="lazy" /></div></Reveal>}
          <Reveal delay={150} className="st">
            {paras.length ? paras.map((p, i) => <p key={i} className={i === 0 ? 'first' : undefined}>{p}</p>) : <p className="first">{full} was born on {born} and lived {c.age} years. He was a husband, a father, a son, a brother and a cousin, and he is dearly missed by all who knew him.</p>}
            {c.quote ? <blockquote>{c.quote}</blockquote> : null}
            {!paras.length && <div className="tbd">His full story will be added by the family.</div>}
          </Reveal>
        </div>
      </div></section>

      <section id="family"><div className="wrap">
        <Head k="Left to cherish his memory" t="His family" />
        <Reveal className="ff">
          {feature.map(([t, names]) => (
            <div key={t} className="ff-g">
              <p className="ff-k">{t}</p>
              <ul className={'ff-l' + (names.length > 1 ? ' multi' : '')}>{names.map((n) => <li key={n}><Name n={n} /></li>)}</ul>
            </div>
          ))}
        </Reveal>
        <div className="fam">
          {others.map(([t, names], i) => <Reveal key={t} className="fc" delay={(i % 3) * 100}><h3>{t}</h3><ul>{names.map((n) => <li key={n}><Name n={n} /></li>)}</ul></Reveal>)}
        </div>
        {long.map(([t, names]) => (
          <Reveal key={t} className="fm">
            <details>
              <summary>{t} <span>({names.length})</span></summary>
              <ul className="chips">{names.map((n) => <li key={n}>{n}</li>)}</ul>
            </details>
          </Reveal>
        ))}
      </div></section>

      <section id="photos" className="soft"><div className="wrap">
        <Head k="Memory wall" t="Photos and moments" lead="Faces, places and days worth keeping. Tap a photo to see it full screen." />
        {mems.length ? <Gallery items={mems} /> : <Reveal className="empty"><p>Photos shared by family and friends will appear here.</p></Reveal>}
        <Reveal className="card sc"><h3>Share a photo</h3><p className="note">Photos appear on the wall once the family has approved them.</p><MemoryForm /></Reveal>
      </div></section>

      <section id="candle" className="blk"><div className="wrap">
        <img className="cdec l" src="/art/candles.webp" alt="" aria-hidden="true" /><img className="cdec r" src="/art/candles.webp" alt="" aria-hidden="true" />
        <Reveal className="head"><p className="eyebrow"><span>A moment of remembrance</span></p><h2>Light a candle</h2><Candle initial={candles[0].n} /></Reveal>
      </div></section>

      <section id="guestbook"><div className="wrap">
        <Head k="Guestbook" t="Leave a message" lead="Share a memory or a few kind words for the family. Messages appear after the family approves them." />
        <Reveal className="card gf"><GuestForm /></Reveal>
        <GuestWall msgs={msgs} />
      </div></section>

      <section id="rsvp" className="soft"><div className="wrap">
        <Head k="RSVP" t="Will you attend?" lead="Let the family know so they can plan." />
        <Reveal className="card gf"><Rsvp share={share} events={events.map((e) => ({ slug: e.slug, title: e.title, d: e.d, past: e.days < 0, def: !!next && e.slug === next.slug, ics: ics(e) }))} /></Reveal>
      </div></section>

      <footer>
        <img className="arr" src="/art/arrange.webp" alt="" aria-hidden="true" />
        <h3>{full}</h3>
        <p className="fd">{born} <i aria-hidden="true" /> {c.passed}</p>
        <p>With love from the Nartey and Agah families</p>
        <div className="fa"><Share title={share.title} text={share.text} url={share.url} label="Share this page" className="btn light" /><a className="btn ghost" href="#top">Back to top</a></div>
      </footer>

      <Dock name={full} share={share} />
    </>
  );
}
