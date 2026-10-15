import crypto from 'crypto';
import { cookies } from 'next/headers';
const sign = (v) => crypto.createHmac('sha256', process.env.SESSION_SECRET || 'x').update(v).digest('hex');
export function makeToken() { const v = String(Date.now() + 7 * 864e5); return v + '.' + sign(v); }
export async function isAdmin() {
  const c = (await cookies()).get('adm')?.value;
  if (!c) return false;
  const [v, s] = c.split('.');
  if (!v || !s) return false;
  const good = sign(v);
  if (s.length !== good.length) return false;
  return crypto.timingSafeEqual(Buffer.from(s), Buffer.from(good)) && Number(v) > Date.now();
}
export function checkPassword(p) {
  const a = Buffer.from(String(p || ''));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || '');
  return b.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}
