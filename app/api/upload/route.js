import { sql } from '../../../lib/db';
import { isAdmin } from '../../../lib/auth';
import { clean } from '../../../lib/clean';
export async function POST(req) {
  const fd = await req.formData().catch(() => null);
  const file = fd && fd.get('file');
  if (!file || typeof file === 'string') return Response.json({ error: 'No photo received.' }, { status: 400 });
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 4000000) return Response.json({ error: 'Please use a JPG, PNG or WebP photo under 4MB.' }, { status: 400 });
  const name = clean(fd.get('name'), 80), story = clean(fd.get('story'), 2000) || null;
  const admin = await isAdmin();
  if (!admin && !name) return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  const kind = admin ? clean(fd.get('kind'), 10) : 'guest';
  const hex = Buffer.from(await file.arrayBuffer()).toString('hex');
  const rows = await sql`INSERT INTO media (content_type, data, kind) VALUES (${file.type}, decode(${hex}, 'hex'), ${kind}) RETURNING id`;
  const id = rows[0].id;
  if (admin && (kind === 'hero' || kind === 'life')) {
    const key = kind + '_media';
    await sql`INSERT INTO site_content (key, value) VALUES (${key}, ${String(id)}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
  } else {
    const status = admin ? 'approved' : 'pending';
    await sql`INSERT INTO memories (name, story, media_url, media_type, status) VALUES (${name || 'Family'}, ${story}, ${'/api/media/' + id}, 'image', ${status})`;
  }
  return Response.json({ ok: true, id });
}
