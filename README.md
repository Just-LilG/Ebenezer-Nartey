# Ebenezer Nartey memorial website

Next.js 15 (App Router) + Neon Postgres. Deployed on Vercel.

## Run it yourself
1. `npm install`
2. Create a Neon project, then run `schema.sql` in its SQL editor.
3. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` your Neon connection string
   - `ADMIN_PASSWORD` the password for /admin
   - `SESSION_SECRET` a long random string
4. `npm run dev`, then open http://localhost:3000

## Deploy on Vercel
Import the project (or push it to GitHub and import the repo), add the same
three environment variables, and deploy.
Turn OFF "Vercel Authentication" in Project Settings > Deployment Protection,
otherwise visitors are asked to log in to Vercel.

## Using the site
- /admin : sign in, approve guestbook messages and photos, upload the main
  portrait, edit times, venues, life story, and see RSVPs.
- Photos are stored inside the database (table `media`), so they are NOT in
  this zip. They live in your Neon database.

## Files
- app/page.js       the public site
- app/admin/*       the family admin
- app/api/*         guestbook, candle, RSVP, photo upload and serving
- components/*      forms, candle, gallery, scroll effects
- lib/*             database, login and text cleaning
