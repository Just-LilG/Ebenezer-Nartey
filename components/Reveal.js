'use client';
import { useEffect, useRef, useState } from 'react';
export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={'rv ' + (on ? 'in ' : '') + className} style={delay ? { transitionDelay: delay + 'ms' } : undefined}>{children}</div>;
}
