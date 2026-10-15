import { sql } from '../../../../lib/db';
export async function GET(req, { params }) {
  const { id } = await params;
  const rows = await sql`SELECT content_type, encode(data, 'base64') AS b FROM media WHERE id = ${Number(id) || 0}`;
  if (!rows[0]) return new Response('Not found', { status: 404 });
  return new Response(Buffer.from(rows[0].b, 'base64'), { headers: { 'Content-Type': rows[0].content_type, 'Cache-Control': 'public, max-age=86400, immutable' } });
}
