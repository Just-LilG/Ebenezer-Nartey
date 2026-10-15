'use client';
import { useState } from 'react';

const STEP = 6;

// Approved guestbook messages, six at a time, each with an initial in a black circle.
export default function GuestWall({ msgs }) {
  const [n, setN] = useState(STEP);
  if (!msgs.length) return <p className="note c">Be the first to leave a message for the family.</p>;
  return (
    <div className="gw">
      <p className="gw-count">{msgs.length} {msgs.length === 1 ? 'message' : 'messages'} from family and friends</p>
      <div className="msgs">
        {msgs.slice(0, n).map((m, i) => (
          <article key={i} className="msg">
            <span className="av" aria-hidden="true">{(m.name || '?').trim().charAt(0).toUpperCase()}</span>
            <div>
              <p>{m.message}</p>
              <small><b>{m.name}</b> &middot; {m.d}</small>
            </div>
          </article>
        ))}
      </div>
      {n < msgs.length && <div className="gw-more"><button type="button" className="btn line" onClick={() => setN((v) => v + STEP)}>Show more messages ({msgs.length - n})</button></div>}
    </div>
  );
}
