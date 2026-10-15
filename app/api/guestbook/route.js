import { sql } from '../../../lib/db';
import { clean } from '../../../lib/clean';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return Response.json({ ok: true });
  const name = clean(b.name, 80), message = clean(b.message, 2000);
  if (!name || !message) return Response.json({ error: 'Please enter your name and a message.' }, { status: 400 });
  await sql`INSERT INTO guestbook (name, message) VALUES (${name}, ${message})`;
  return Response.json({ ok: true });
}
