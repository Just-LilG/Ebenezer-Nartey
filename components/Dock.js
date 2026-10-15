'use client';
import { useEffect, useRef, useState } from 'react';
import Share from './Share';

const LINKS = [['service', 'Service'], ['photos', 'Photos'], ['guestbook', 'Guestbook'], ['rsvp', 'RSVP']];

// After the hero scrolls away: a slim top bar (name + share), a reading-progress line,
// and a bottom quick-links pill that highlights the section you are in.
export default function Dock({ name, share }) {
  const [on, setOn] = useState(false);
  const [active, setActive] = useState('');
  const bar = useRef(null);

  useEffect(() => {
    const f = () => {
      const y = window.scrollY;
      setOn(y > 420);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    };
    f();
    window.addEventListener('scroll', f, { passive: true });
    window.addEventListener('resize', f);
    return () => { window.removeEventListener('scroll', f); window.removeEventListener('resize', f); };
  }, []);

  useEffect(() => {
    const els = LINKS.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!('IntersectionObserver' in window) || !els.length) return;
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best = '', max = 0;
      seen.forEach((r, id) => { if (r > max) { max = r; best = id; } });
      setActive(best);
    }, { rootMargin: '-30% 0px -30% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className={'topbar' + (on ? ' on' : '')}>
        <a className="tb-name" href="#top" aria-label={'Back to the top, ' + name}>{name}</a>
        <Share title={share.title} text={share.text} url={share.url} label="Share" className="tb-share" />
        <div className="prog" aria-hidden="true"><i ref={bar} /></div>
      </div>
      <nav className={'dock' + (on ? ' on' : '')} aria-label="Quick links">
        {LINKS.map(([id, label]) => <a key={id} href={'#' + id} aria-current={active === id ? 'true' : undefined}>{label}</a>)}
      </nav>
    </>
  );
}
