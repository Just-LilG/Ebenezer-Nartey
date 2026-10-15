import { sql } from '../../../lib/db';
import { clean } from '../../../lib/clean';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return Response.json({ ok: true });
  const name = clean(b.name, 80);
  if (!name) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  const phone = clean(b.phone, 30) || null, dietary = clean(b.dietary, 200) || null;
  const evs = (Array.isArray(b.events) ? b.events : []).map((e) => clean(e, 40)).filter(Boolean).slice(0, 5);
  const n = Math.min(50, Math.max(1, parseInt(b.headcount, 10) || 1));
  await sql`INSERT INTO rsvps (name, phone, attending_events, headcount, dietary) VALUES (${name}, ${phone}, ${evs}, ${n}, ${dietary})`;
  return Response.json({ ok: true });
}
