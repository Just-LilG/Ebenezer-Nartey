'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { sql } from '../../lib/db';
import { isAdmin, makeToken, checkPassword } from '../../lib/auth';

async function guard() { if (!(await isAdmin())) throw new Error('Not allowed'); }
const v = (fd, k, n = 500) => String(fd.get(k) ?? '').trim().slice(0, n);

export async function login(fd) {
  await new Promise((r) => setTimeout(r, 700));
  if (!checkPassword(fd.get('password'))) redirect('/admin?e=1');
  (await cookies()).set('adm', makeToken(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 604800 });
  redirect('/admin');
}
export async function logout() { (await cookies()).delete('adm'); redirect('/admin'); }

export async function moderate(fd) {
  await guard();
  const id = Number(fd.get('id')), s = String(fd.get('s')), t = String(fd.get('t'));
  if (!['approved', 'rejected'].includes(s)) return;
  if (t === 'g') await sql`UPDATE guestbook SET status = ${s} WHERE id = ${id}`;
  else await sql`UPDATE memories SET status = ${s} WHERE id = ${id}`;
  revalidatePath('/admin'); revalidatePath('/');
}

export async function saveEvent(fd) {
  await guard();
  const id = Number(fd.get('id'));
  const st = v(fd, 'start_time', 40) || null, ve = v(fd, 'venue', 200) || null, ad = v(fd, 'address', 300) || null, mu = v(fd, 'map_url', 500) || null, no = v(fd, 'notes', 500) || null;
  await sql`UPDATE events SET start_time = ${st}, venue = ${ve}, address = ${ad}, map_url = ${mu}, notes = ${no} WHERE id = ${id}`;
  revalidatePath('/admin'); revalidatePath('/');
}

export async function saveContent(fd) {
  await guard();
  for (const k of ['passed', 'contact', 'quote', 'life_story']) {
    const val = v(fd, k, 8000);
    await sql`INSERT INTO site_content (key, value) VALUES (${k}, ${val}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
  }
  revalidatePath('/admin'); revalidatePath('/');
}
