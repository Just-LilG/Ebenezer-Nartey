import { sql } from '../../../lib/db';
export async function POST() {
  await sql`INSERT INTO candles DEFAULT VALUES`;
  const r = await sql`SELECT count(*)::int AS n FROM candles`;
  return Response.json({ count: r[0].n });
}
