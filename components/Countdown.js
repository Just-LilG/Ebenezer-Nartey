'use client';
import { useEffect, useState } from 'react';
import { startDate } from '../lib/cal';

// Live "Starts in 1 day 4 hours" label. Shows the server's label first, then takes over once mounted.
export default function Countdown({ ymd, time, fallback }) {
  const [txt, setTxt] = useState(fallback);
  useEffect(() => {
    const start = startDate(ymd, time);
    if (!start) { setTxt(fallback); return; }
    const tick = () => {
      const ms = start.getTime() - Date.now();
      if (ms <= 0) { setTxt(ms > -6 * 3600e3 ? 'Happening now' : 'Today'); return; }
      const mins = Math.floor(ms / 60000);
      const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
      const u = (n, w) => n + ' ' + w + (n === 1 || w === 'min' ? '' : 's');
      setTxt('Starts in ' + (d ? u(d, 'day') + (h ? ' ' + u(h, 'hr') : '') : h ? u(h, 'hr') + (m ? ' ' + u(m, 'min') : '') : u(m, 'min')));
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [ymd, time, fallback]);
  return <span>{txt}</span>;
}
