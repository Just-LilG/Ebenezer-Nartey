'use client';
import { useState, useEffect } from 'react';

const CSS = `
.cdl{display:flex;flex-direction:column;align-items:center}
.cdl .stage{position:relative;width:min(290px,68vw);margin:0 auto}
.cdl .csvg{width:100%;height:auto;display:block;overflow:visible;position:relative}
.cdl .amb{position:absolute;left:50%;top:32%;width:min(1000px,190vw);aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,170,70,.30) 0,rgba(255,130,30,.11) 30%,rgba(0,0,0,0) 62%);opacity:0;transition:opacity 2.6s ease;pointer-events:none}
.cdl.lit .amb{opacity:1;animation:cflick 3.7s infinite}
.cdl .fg{transform-origin:100px 179px;transform:scale(0);opacity:0;transition:transform 1.8s cubic-bezier(.2,.8,.2,1),opacity 1.2s}
.cdl.lit .fg{transform:scale(1);opacity:1}
.cdl .fl{transform-origin:100px 179px}
.cdl.lit .fl{animation:cfl 3.1s ease-in-out infinite}
.cdl .gl,.cdl .pool,.cdl .wl,.cdl .ember{opacity:0;transition:opacity 2.2s}
.cdl.lit .gl{opacity:1;animation:cflick 2.9s infinite}
.cdl.lit .pool,.cdl.lit .wl,.cdl.lit .ember{opacity:1}
.cdl .sm{opacity:0}
.cdl.lit .sm{animation:csmoke 5s ease-out 1}
.cdl .num{font-family:Fraunces,Georgia,serif;font-size:clamp(64px,14vw,120px);line-height:1;margin-top:26px}
.cdl p{color:#bbb;margin:6px 0 24px;text-align:center}
@keyframes cfl{0%{transform:scale(1,1) rotate(0)}12%{transform:scale(.97,1.05) rotate(-1.6deg)}27%{transform:scale(1.03,.96) rotate(1.2deg)}41%{transform:scale(.98,1.08) rotate(-.8deg)}58%{transform:scale(1.02,.98) rotate(1.8deg)}73%{transform:scale(.96,1.04) rotate(-1.4deg)}88%{transform:scale(1.02,1.02) rotate(.6deg)}100%{transform:scale(1,1) rotate(0)}}
@keyframes cflick{0%,100%{opacity:1}8%{opacity:.82}16%{opacity:.96}31%{opacity:.78}44%{opacity:1}59%{opacity:.86}74%{opacity:.97}88%{opacity:.8}}
@keyframes csmoke{0%{opacity:0;transform:translateY(0)}15%{opacity:.5}100%{opacity:0;transform:translateY(-34px)}}
`;

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Something went wrong.');
  return j;
}

const FLAME = 'M100 104 C107 126 121 146 118 162 C116 173 109 179 100 179 C91 179 84 173 82 162 C79 146 93 126 100 104Z';
const BODY = 'M62 190 V400 A38 7 0 0 0 138 400 V190 Z';

export default function Candle({ initial }) {
  const [n, setN] = useState(initial);
  const [lit, setLit] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { try { if (localStorage.getItem('candle')) setLit(true); } catch {} }, []);
  async function light() {
    if (lit || busy) return;
    setBusy(true);
    try { const j = await post('/api/candle', {}); setN(j.count); setLit(true); try { localStorage.setItem('candle', '1'); } catch {} } catch {}
    setBusy(false);
  }
  return (
    <div className={'cdl' + (lit ? ' lit' : '')}>
      <style>{CSS}</style>
      <div className="stage">
        <div className="amb" aria-hidden="true" />
        <svg className="csvg" viewBox="0 0 200 420" role="img" aria-label={lit ? 'A lit candle' : 'An unlit candle'}>
          <defs>
            <linearGradient id="cw" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#cfc9bb" /><stop offset=".2" stopColor="#f7f4ed" /><stop offset=".5" stopColor="#ece8de" /><stop offset=".82" stopColor="#bdb7a8" /><stop offset="1" stopColor="#7d7769" /></linearGradient>
            <linearGradient id="cv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset=".6" stopColor="#000" stopOpacity=".1" /><stop offset="1" stopColor="#000" stopOpacity=".55" /></linearGradient>
            <linearGradient id="cl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffb866" stopOpacity=".6" /><stop offset=".5" stopColor="#ffb866" stopOpacity=".14" /><stop offset="1" stopColor="#ffb866" stopOpacity="0" /></linearGradient>
            <radialGradient id="cg" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#ffb347" stopOpacity=".6" /><stop offset=".45" stopColor="#ff8a1f" stopOpacity=".18" /><stop offset="1" stopColor="#ff8a1f" stopOpacity="0" /></radialGradient>
            <linearGradient id="cf1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff7a00" stopOpacity="0" /><stop offset=".35" stopColor="#ff8f1f" stopOpacity=".78" /><stop offset="1" stopColor="#ffb347" stopOpacity=".95" /></linearGradient>
            <linearGradient id="cf2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffd35a" stopOpacity=".25" /><stop offset="1" stopColor="#ffbe3a" stopOpacity="1" /></linearGradient>
            <linearGradient id="cf3" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fffbe8" stopOpacity=".5" /><stop offset="1" stopColor="#fff3c4" stopOpacity="1" /></linearGradient>
            <filter id="cwob" x="-50%" y="-30%" width="200%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02 0.07" numOctaves="2" seed="4" result="n"><animate attributeName="baseFrequency" dur="5s" values="0.02 0.07;0.035 0.1;0.02 0.07" repeatCount="indefinite" /></feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
              <feGaussianBlur stdDeviation="1.4" />
            </filter>
            <filter id="cb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8" /></filter>
            <filter id="cs" x="-100%" y="-20%" width="300%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>

          <circle className="gl" cx="100" cy="150" r="120" fill="url(#cg)" />
          <ellipse cx="100" cy="408" rx="72" ry="10" fill="#1c1c1c" />
          <ellipse cx="100" cy="406" rx="72" ry="10" fill="none" stroke="#3a3a3a" strokeWidth="1" />

          <path d={BODY} fill="url(#cw)" />
          <path d={BODY} fill="url(#cv)" />
          <path className="wl" d={BODY} fill="url(#cl)" />

          <rect x="63" y="190" width="9" height="46" rx="4.5" fill="#f1ede4" opacity=".95" />
          <rect x="63" y="190" width="3" height="44" rx="1.5" fill="#fff" opacity=".6" />
          <rect x="117" y="190" width="7" height="26" rx="3.5" fill="#e3dfd4" opacity=".95" />
          <rect x="96" y="190" width="6" height="14" rx="3" fill="#f4f1e9" opacity=".9" />

          <ellipse cx="100" cy="190" rx="38" ry="9" fill="#f3efe6" />
          <ellipse cx="100" cy="190" rx="38" ry="9" fill="none" stroke="#bdb7a8" strokeWidth=".8" />
          <ellipse cx="100" cy="190.5" rx="30" ry="6.5" fill="#e3dccb" />
          <ellipse className="pool" cx="100" cy="190.8" rx="24" ry="5" fill="#ffcf8a" />

          <path d="M100 192 C100 186 100.5 180 102 174" stroke="#1a1a1a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle className="ember" cx="102" cy="174.5" r="2" fill="#ff8c1a" />

          <path className="sm" d="M101 100 C96 88 106 80 100 68 C95 58 104 50 100 38" stroke="#cfcfcf" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#cs)" />

          <g className="fg">
            <g className="fl">
              <g filter="url(#cwob)"><path d={FLAME} fill="url(#cf1)" /></g>
              <path d={FLAME} fill="url(#cf2)" transform="translate(100 179) scale(.7) translate(-100 -179)" filter="url(#cb)" />
              <path d={FLAME} fill="url(#cf3)" transform="translate(100 179) scale(.38) translate(-100 -179)" filter="url(#cb)" />
              <ellipse cx="100" cy="172" rx="6" ry="8" fill="#5b8cff" opacity=".5" filter="url(#cb)" />
            </g>
          </g>
        </svg>
      </div>
      <div className="num" aria-live="polite">{n}</div>
      <p>{n === 1 ? 'candle has' : 'candles have'} been lit in his memory</p>
      <button className="btn light" onClick={light} disabled={lit || busy}>{lit ? 'Your candle is lit' : 'Light a candle'}</button>
    </div>
  );
}
