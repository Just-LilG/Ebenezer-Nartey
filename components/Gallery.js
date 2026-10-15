'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// Memory wall with a full-screen viewer: counter, swipe, arrow keys, download, focus handling.
export default function Gallery({ items }) {
  const [i, setI] = useState(null);
  const opener = useRef(null);
  const closeBtn = useRef(null);
  const touch = useRef(null);
  const close = useCallback(() => { setI(null); if (opener.current) opener.current.focus(); }, []);
  const go = useCallback((d) => setI((v) => (v === null ? v : (v + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (i === null) return;
    const k = (e) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    if (closeBtn.current) closeBtn.current.focus();
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [i === null, close, go]);

  // Warm the neighbours so swiping feels instant.
  useEffect(() => {
    if (i === null || items.length < 2) return;
    [1, -1].forEach((d) => { const im = new Image(); im.src = items[(i + d + items.length) % items.length].media_url; });
  }, [i, items]);

  const onStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onEnd = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const cur = i === null ? null : items[i];
  return (
    <>
      <div className="gal">
        {items.map((m, n) => (
          <button key={n} className="gi" onClick={(e) => { opener.current = e.currentTarget; setI(n); }} aria-label={'Open photo ' + (n + 1) + ' of ' + items.length + ', shared by ' + m.name}>
            <img className="ph" src={m.media_url} alt={'Photo shared by ' + m.name} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      {cur && (
        <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close} onTouchStart={onStart} onTouchEnd={onEnd}>
          <div className="lb-top" onClick={(e) => e.stopPropagation()}>
            <span className="lb-n" aria-live="polite">{i + 1} / {items.length}</span>
            <a className="lb-dl" href={cur.media_url} download={'memory-' + (i + 1) + '.jpg'} aria-label="Download this photo">Save</a>
            <button ref={closeBtn} className="lbx" onClick={close} aria-label="Close photo viewer">&times;</button>
          </div>
          {items.length > 1 && <button className="lbn p" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">&lsaquo;</button>}
          <img src={cur.media_url} alt={'Photo shared by ' + cur.name} onClick={(e) => e.stopPropagation()} />
          <p onClick={(e) => e.stopPropagation()}>{cur.story ? <>{cur.story}<br /></> : null}<b>{cur.name}</b></p>
          {items.length > 1 && <button className="lbn n" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">&rsaquo;</button>}
        </div>
      )}
    </>
  );
}
