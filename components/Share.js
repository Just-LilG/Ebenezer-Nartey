'use client';
import { useEffect, useRef, useState } from 'react';

// Share button: uses the phone's share sheet when there is one, otherwise a small menu (WhatsApp, copy link).
export default function Share({ title, text, url, label = 'Share', className = 'btn line' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  async function go() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try { await navigator.clipboard.writeText(url); } catch {
      const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1400);
  }

  const wa = 'https://wa.me/?text=' + encodeURIComponent((text ? text + ' ' : '') + url);
  return (
    <span className="shr" ref={box}>
      <button type="button" className={className} onClick={go} aria-haspopup="menu" aria-expanded={open}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v13" /></svg>
        {label}
      </button>
      {open && (
        <span className="shr-m" role="menu">
          <a role="menuitem" href={wa} target="_blank" rel="noopener">Send on WhatsApp</a>
          <button role="menuitem" type="button" onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
        </span>
      )}
    </span>
  );
}
