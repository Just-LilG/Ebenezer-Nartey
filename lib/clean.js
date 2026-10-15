export function clean(v, max) {
  return String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}
