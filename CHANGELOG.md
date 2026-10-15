# CHANGELOG

Every agent logs ALL of their work here under the name they chose in communicate.md.
Newest entry at the TOP.

## Entry format
```
### YYYY-MM-DD — <Agent name>
- What changed (files: path/one.js, path/two.js)
- Why
- Notes for the next agent
```

---

### 2026-10-15 — Ledger (hero only for him)
- Hero is now just the floral frame, dove, birds, portrait, name and dates. Next-service card (Directions) plus RSVP and Share buttons moved to a strip right below the hero. Portrait size restored (80vw, max 340px). Files: app/page.js, app/globals.css

### 2026-10-15 — Ledger (declutter)
- Hero simplified: floral frame + portrait + name + one info line ("Tomorrow · Laying in state · Kpongunor") + single RSVP button. Removed the next-service card, Share button (still in footer), dove and birds from the hero.
- Dove moved to the top of the "Light a candle" section; birds drift across the "His life" section. Files: app/page.js, app/globals.css

### 2026-10-15 — Ledger (hero v2)
- Hero now fits a phone screen: smaller portrait (72vw, max 300px, 5:6 ratio), tighter spacing, hero image loads with high priority. Files: app/page.js, app/globals.css
- Replaced the grey chip with a "next service" card (countdown, day, date, time, venue, Directions button).
- Buttons: RSVP (primary) + Share (WhatsApp) in one row; "Service details" button removed (the card and dock cover it).
- Dove moved to the frame's lower-right corner and kept on screen; birds fly only in the top sky strip, fade in and out, smaller.
- Darker small grey text. No DB changes. Build passes. Not deployed.

### 2026-10-15 — Ledger (bigger portrait)
- Portrait frame enlarged (80vw up to 340px on phones, 500px on desktop). RSVP outline button no longer turns black after a tap on touch screens. File: app/globals.css (bottom block)

### 2026-10-15 — Ledger (name on one line)
- Hero name now sits on a single centered line (left-aligned on desktop). File: app/globals.css (bottom block)

### 2026-10-15 — Ledger (smaller name)
- Hero name reduced (about 34-46px on phones, up to 84px on desktop), smaller dates line, smaller dove and softer dove shadow. File: app/globals.css (bottom block)

### 2026-10-15 — Ledger (art + frame)
- Hero framed with floral corners (top-left and top-right), a dove with olive branch flying in beside the portrait, and a flock of birds drifting across the sky. Files: app/page.js, app/globals.css, public/art/*.webp
- Candle section: candle clusters in both lower corners. Footer: candle and white-flower arrangement above the name.
- RSVP hero button forced to the outlined style. `.arch img` rules renamed to `.pic img` so the dove is not stretched.
- Art was cut out with rembg (u2net); floral stays a white-background image blended with multiply. Not visually tested in a browser. `next build` passes. Not deployed.

### 2026-10-15 — Ledger (landing page upgrade)
- Hero: dot-pulse "next service" chip (links to #service), RSVP button added, soft backdrop glow, slow portrait zoom, breathing ring, scroll cue (desktop). Files: app/page.js, app/globals.css
- Service: "Next" / "Completed" tags, Directions + Add to Google Calendar buttons per event, RSVP call-to-action under the cards. Files: app/page.js
- RSVP: tappable service cards (next service preselected, past ones disabled), +/- headcount stepper, requires at least one service, animated thank-you with calendar links. API and DB unchanged. Files: components/Forms.js
- Dock: scroll progress bar at the top, narrower on small phones. Files: components/Dock.js
- Mobile: tighter section spacing, full-width hero buttons, bigger tap targets. Files: app/globals.css (appended block at the bottom)
- No schema or env changes. `next build` passes. Not deployed yet.

### 2026-10-15 — Ledger
- Added CHANGELOG.md and communicate.md for multi-agent coordination.
- No site code changed.
- Next agents: add your name to the Roster in communicate.md before you begin.
