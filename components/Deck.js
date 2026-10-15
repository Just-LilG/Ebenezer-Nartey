'use client';
import { useEffect, useRef } from 'react';

// Card-to-card scrolling, done with plain CSS sticky (no scroll handler, so
// scrolling stays on the browser's fast path). JS only runs on resize: it
// tells each card where to stick (tall cards stick by their bottom edge so
// nothing is cut off).
export default function Deck({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll(':scope > .dk'));
    document.documentElement.classList.add('deck-on');
    let t = 0;
    const measure = () => {
      t = 0;
      const vh = window.innerHeight;
      cards.forEach((el, i) => {
        if (i === cards.length - 1) return;
        const v = Math.min(0, vh - el.offsetHeight) + 'px';
        if (el.style.top !== v) el.style.top = v;
      });
    };
    const soon = () => { if (!t) t = window.setTimeout(measure, 120); };
    measure();
    const ro = new ResizeObserver(soon);
    cards.forEach((c) => ro.observe(c));
    window.addEventListener('resize', soon);
    window.addEventListener('load', soon);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', soon);
      window.removeEventListener('load', soon);
      if (t) clearTimeout(t);
      document.documentElement.classList.remove('deck-on');
      cards.forEach((c) => { c.style.top = ''; });
    };
  }, []);
  return <main ref={ref} className="deck">{children}</main>;
}
