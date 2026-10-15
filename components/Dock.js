'use client';
import { useEffect, useRef, useState } from 'react';
export default function Dock() {
  const [on, setOn] = useState(false);
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
  return (
    <>
      <div className="prog" aria-hidden="true"><i ref={bar} /></div>
      <nav className={'dock' + (on ? ' on' : '')} aria-label="Quick links">
        <a href="#service">Service</a><a href="#photos">Photos</a><a href="#guestbook">Guestbook</a><a href="#rsvp">RSVP</a>
      </nav>
    </>
  );
}
