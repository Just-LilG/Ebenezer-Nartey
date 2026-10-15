// Calendar helpers. Service times are Ghana time, which is GMT (UTC+0) all year.
// Pure functions only: safe to import from server and client code.

export function parseTime(s) {
  if (!s) return null;
  const m = String(s).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?/i) || String(s).trim().match(/^(\d{1,2}):(\d{2})()/);
  if (!m) return null;
  let h = +m[1];
  const mi = +(m[2] || 0);
  const ap = (m[3] || '').toLowerCase();
  if (ap === 'p' && h < 12) h += 12;
  if (ap === 'a' && h === 12) h = 0;
  if (h > 23 || mi > 59) return null;
  return { h, mi };
}

const p2 = (n) => String(n).padStart(2, '0');

export function startDate(ymd, time) {
  const t = parseTime(time);
  if (!t || !/^\d{8}$/.test(ymd || '')) return null;
  return new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8), t.h, t.mi));
}

const stamp = (d) => d.getUTCFullYear() + p2(d.getUTCMonth() + 1) + p2(d.getUTCDate()) + 'T' + p2(d.getUTCHours()) + p2(d.getUTCMinutes()) + '00Z';

// Timed events last 3 hours by default; events without a time become all-day.
export function span(ymd, ymd2, time, hours = 3) {
  const s = startDate(ymd, time);
  if (!s) return { allDay: true, start: ymd, end: ymd2 };
  return { allDay: false, start: stamp(s), end: stamp(new Date(s.getTime() + hours * 3600e3)) };
}

export function googleUrl({ title, ymd, ymd2, time, place, details }) {
  const sp = span(ymd, ymd2, time);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title)
    + '&dates=' + sp.start + '/' + sp.end
    + '&location=' + encodeURIComponent(place || '')
    + '&details=' + encodeURIComponent(details || '');
}

const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

export function icsText({ uid, title, ymd, ymd2, time, place, details }) {
  const sp = span(ymd, ymd2, time);
  const now = stamp(new Date());
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ebenezer Nartey memorial//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', 'UID:' + uid + '@ebenezer-memorial', 'DTSTAMP:' + now,
    sp.allDay ? 'DTSTART;VALUE=DATE:' + sp.start : 'DTSTART:' + sp.start,
    sp.allDay ? 'DTEND;VALUE=DATE:' + sp.end : 'DTEND:' + sp.end,
    'SUMMARY:' + esc(title), 'LOCATION:' + esc(place), 'DESCRIPTION:' + esc(details),
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}
