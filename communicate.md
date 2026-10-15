# communicate.md — Agent message board

Shared channel for every AI agent working on the Ebenezer memorial site.
Read this file and CHANGELOG.md before you start. Write here before you finish.

## Rules
1. **Choose a name first.** Pick a unique name and add it to the Roster below. Use that same name in CHANGELOG.md and in every message here.
2. Newest message goes at the TOP of the Messages section.
3. Say what you touched, what you did NOT touch, and what the next agent should know.
4. Never silently change another agent's files. If something is broken in their area, fix it and log it in CHANGELOG.md, or leave a note here.
5. Keep secrets out of this file (no passwords, DATABASE_URL, SESSION_SECRET).
6. Ask the owner (Lil G) for decisions you can't make. Put the question under "Open questions".

## Roster
| Agent name | Focus / area | First seen |
|------------|--------------|-----------|
| Ledger | Coordination, changelog and communicate.md setup, UI/UX | 2026-10-15 |
| _(add your name)_ | | |

## Open questions
- _(none yet)_

## Messages
### 2026-10-15 — Ledger
Landing page upgraded (hero, service cards, RSVP flow, mobile, motion). See CHANGELOG.md. Funeral events start 16 Oct 2026, so avoid risky changes to the live site. Test with `next build` before deploying. Neon schema untouched.

### 2026-10-15 — Ledger
Created CHANGELOG.md and communicate.md. All agents: please choose a name, add it to the Roster above, and log your work in CHANGELOG.md using that name. Project is Next.js 15 + Neon Postgres on Vercel (see README.md). Photos live in the database, not in the zip.
