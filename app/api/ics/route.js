import { sql } from '../../../lib/db';
import { icsText } from '../../../lib/cal';
export const dynamic = 'force-dynamic';

// Read-only: builds a calendar file (.ics) for one service so Apple Calendar and Outlook can add it.
export async function GET(req) {
  const slug = new URL(req.url).searchParams.get('e') || '';
  const [rows, content] = await Promise.all([
    sql`SELECT slug, title, venue, address, start_time, to_char(event_date, 'YYYYMMDD') AS ymd, to_char(event_date + 1, 'YYYYMMDD') AS ymd2 FROM events WHERE slug = ${slug}`,
    sql`SELECT key, value FROM site_content WHERE key = 'full_name'`,
  ]);
  const e = rows[0];
  if (!e) return new Response('Not found', { status: 404 });
  const full = (content[0] && content[0].value) || 'Ebenezer Nartey';
  const body = icsText({
    uid: e.slug + '-' + e.ymd,
    title: e.title + ' - ' + full,
    ymd: e.ymd, ymd2: e.ymd2, time: e.start_time,
    place: [e.venue, e.address].filter(Boolean).join(', '),
    details: (e.start_time ? 'Starts ' + e.start_time + '. ' : '') + 'In loving memory of ' + full + '.',
  });
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'inline; filename="' + e.slug + '.ics"', 'Cache-Control': 'no-store' } });
}
