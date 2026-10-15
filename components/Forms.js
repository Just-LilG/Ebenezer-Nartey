'use client';
import { useState } from 'react';

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
  return j;
}

async function shrink(file, max = 1600) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Please choose a photo.');
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Could not read that photo.'))), 'image/jpeg', 0.85));
}

function useSubmit(fn) {
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  async function run(e) {
    e.preventDefault();
    const form = e.target;
    setState('busy'); setErr('');
    try { await fn(new FormData(form)); setState('done'); }
    catch (x) { setErr(x.message); setState('idle'); }
  }
  return { state, err, run };
}

export function GuestForm() {
  const { state, err, run } = useSubmit((f) => post('/api/guestbook', { name: f.get('name'), message: f.get('message'), website: f.get('website') }));
  if (state === 'done') return <p className="thanks">Thank you. Your message has been received and will appear once the family has approved it.</p>;
  return (
    <form onSubmit={run}>
      <div><label htmlFor="gn">Your name</label><input id="gn" name="name" required maxLength={80} autoComplete="name" /></div>
      <div><label htmlFor="gm">Your message</label><textarea id="gm" name="message" required maxLength={2000} /></div>
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {err && <p className="err" role="alert">{err}</p>}
      <button disabled={state === 'busy'}>{state === 'busy' ? 'Sending...' : 'Post message'}</button>
    </form>
  );
}

export function MemoryForm() {
  const { state, err, run } = useSubmit(async (f) => {
    const blob = await shrink(f.get('photo'));
    const out = new FormData();
    out.set('name', f.get('name')); out.set('story', f.get('story') || ''); out.set('file', blob, 'memory.jpg');
    const r = await fetch('/api/upload', { method: 'POST', body: out });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Upload failed. Please try again.');
  });
  if (state === 'done') return <p className="thanks">Thank you for sharing this memory. It will appear on the wall once the family has approved it.</p>;
  return (
    <form onSubmit={run}>
      <div><label htmlFor="mn">Your name</label><input id="mn" name="name" required maxLength={80} /></div>
      <div><label htmlFor="mp">Photo</label><input id="mp" name="photo" type="file" accept="image/*" required /></div>
      <div><label htmlFor="ms">Tell us about this moment (optional)</label><textarea id="ms" name="story" maxLength={2000} /></div>
      {err && <p className="err" role="alert">{err}</p>}
      <button disabled={state === 'busy'}>{state === 'busy' ? 'Uploading...' : 'Share this memory'}</button>
    </form>
  );
}

export function Rsvp({ events }) {
  const [n, setN] = useState(1);
  const [picked, setPicked] = useState([]);
  const { state, err, run } = useSubmit(async (f) => {
    const evs = f.getAll('ev');
    if (!evs.length) throw new Error('Please choose at least one service you will attend.');
    await post('/api/rsvp', { name: f.get('name'), phone: f.get('phone'), events: evs, headcount: f.get('headcount'), dietary: f.get('dietary'), website: f.get('website') });
    setPicked(events.filter((e) => evs.includes(e.slug)));
  });
  if (state === 'done') return (
    <div className="ok" role="status">
      <div className="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg></div>
      <h3>Thank you</h3>
      <p>The family has noted your attendance. Your presence means a great deal.</p>
      {picked.length > 0 && <div className="acts c">{picked.map((e) => <a key={e.slug} href={e.cal} target="_blank" rel="noopener">Add {e.title.toLowerCase()} to calendar</a>)}</div>}
    </div>
  );
  return (
    <form onSubmit={run}>
      <div><label htmlFor="rn">Your name</label><input id="rn" name="name" required maxLength={80} autoComplete="name" /></div>
      <div><label htmlFor="rp">Phone (optional)</label><input id="rp" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} /></div>
      <fieldset className="evpick"><legend>I will attend</legend>
        {events.map((e) => (
          <label key={e.slug} className="evopt">
            <input type="checkbox" name="ev" value={e.slug} defaultChecked={e.def} disabled={e.past} />
            <span><em><b>{e.title}</b><small>{e.d}{e.past ? ' (completed)' : ''}</small></em></span>
          </label>
        ))}
      </fieldset>
      <div><label id="rhl">Number of people coming</label>
        <div className="stepper" role="group" aria-labelledby="rhl">
          <button type="button" className="stp" onClick={() => setN((v) => Math.max(1, v - 1))} aria-label="One fewer person">&minus;</button>
          <output aria-live="polite">{n}</output>
          <button type="button" className="stp" onClick={() => setN((v) => Math.min(50, v + 1))} aria-label="One more person">+</button>
        </div>
        <input type="hidden" name="headcount" value={n} />
      </div>
      <div><label htmlFor="rd">Dietary needs (optional)</label><input id="rd" name="dietary" maxLength={200} /></div>
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {err && <p className="err" role="alert">{err}</p>}
      <button disabled={state === 'busy'}>{state === 'busy' ? 'Sending...' : 'Send RSVP'}</button>
    </form>
  );
}

export function Uploader() {
  const { state, err, run } = useSubmit(async (f) => {
    const blob = await shrink(f.get('photo'));
    const out = new FormData();
    out.set('kind', f.get('kind')); out.set('name', 'Family'); out.set('story', f.get('story') || ''); out.set('file', blob, 'photo.jpg');
    const r = await fetch('/api/upload', { method: 'POST', body: out });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Upload failed.');
  });
  return (
    <form onSubmit={run}>
      <div><label htmlFor="uk">Use this photo as</label>
        <select id="uk" name="kind"><option value="hero">Main portrait (top of page)</option><option value="life">His life section photo</option><option value="gallery">Add to photo wall</option></select></div>
      <div><label htmlFor="up">Photo</label><input id="up" name="photo" type="file" accept="image/*" required /></div>
      <div><label htmlFor="us">Caption (photo wall only)</label><input id="us" name="story" maxLength={300} /></div>
      {err && <p className="err" role="alert">{err}</p>}
      {state === 'done' && <p className="thanks">Uploaded. Reload the page to upload another.</p>}
      <button disabled={state === 'busy' || state === 'done'}>{state === 'busy' ? 'Uploading...' : 'Upload'}</button>
    </form>
  );
}
