'use client';
import { useState, useEffect, useCallback } from 'react';
export default function Gallery({ items }) {
  const [i, setI] = useState(null);
  const close = useCallback(() => setI(null), []);
  const go = useCallback((d) => setI((v) => (v === null ? v : (v + d + items.length) % items.length)), [items.length]);
  useEffect(() => {
    if (i === null) return;
    const k = (e) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [i, close, go]);
  const cur = i === null ? null : items[i];
  return (
    <>
      <div className="gal">
        {items.map((m, n) => (
          <button key={n} className="gi" onClick={() => setI(n)} aria-label={'Open photo shared by ' + m.name}>
            <img className="ph" src={m.media_url} alt={'Photo shared by ' + m.name} loading="lazy" />
          </button>
        ))}
      </div>
      {cur && (
        <div className="lb" role="dialog" aria-modal="true" onClick={close}>
          <button className="lbx" onClick={close} aria-label="Close">&times;</button>
          {items.length > 1 && <button className="lbn p" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">&lsaquo;</button>}
          <img src={cur.media_url} alt={'Photo shared by ' + cur.name} onClick={(e) => e.stopPropagation()} />
          <p>{cur.story ? cur.story + ' - ' : ''}{cur.name}</p>
          {items.length > 1 && <button className="lbn n" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">&rsaquo;</button>}
        </div>
      )}
    </>
  );
}
