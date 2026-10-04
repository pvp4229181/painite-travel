# Painite Rare Journeys

Next.js 16 (App Router, Turbopack) site for Painite Travels.

## Run

```bash
npm install
cp .env.example .env.local   # fill in SMTP + MongoDB (both optional in development)
npm run dev                  # http://localhost:3000
npm run build && npm start
npm run seed                 # optional: load src/data into MongoDB (-- --force to overwrite)
```

## Where things live

- `src/app/` pages and API routes (`/api/contact`, `/api/destinations`, `/api/regions`, `/api/services`, `/api/tours`)
- `src/data/` all site copy: destinations, journeys, experiences, journal, legal, FAQ
- `src/components/ui/Landscape.jsx` + `src/lib/scenes.js` the artwork images and the scene-to-image map
- `models/` Mongoose models (Destination, Region, Service, Tour, Article, Enquiry); `src/utils/db.js` connection
- `src/lib/content.js` what public pages read: MongoDB when populated, otherwise `src/data`
- `src/lib/seo.js` metadata + JSON-LD helpers; `src/app/sitemap.js`, `robots.js`

## Notes

- Without `EMAIL_USER`/`EMAIL_PASSWORD`, the contact API logs enquiries to the console in development and returns an error in production.
- Content API routes read from MongoDB when configured and fall back to `src/data` otherwise.
- Set `NEXT_PUBLIC_FILM_URL` (embed URL or `.mp4`) to replace the "film coming soon" modal.

## Admin panel

`/admin` manages journeys (with the day-by-day itinerary), destinations and their regions, experiences, journal articles, and enquiries from the contact form.

1. Set `MONGODB_ATLAS_URI` (or `MONGODB_URI`) plus `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` (32+ characters) in `.env.local` or your host's environment, then restart.
2. Sign in at `/admin/login` and click **Import starter content** on the Overview page. This copies `src/data` into the database and skips anything already there.
3. From then on the database is the source of truth. Saving in the admin refreshes the public pages straight away.

How it works:

- **Auth.** There is one admin account, configured in the environment. The session is an HMAC-signed, httpOnly cookie that lasts 7 days. It is checked in `src/proxy.js` and again in every admin page and API route. Requests that change data must come from the site's own origin. Login locks an IP out for 15 minutes after 5 failed attempts (in memory, so per server instance). Changing `ADMIN_SESSION_SECRET` signs everyone out.
- **API.** `/api/admin/[resource]` and `/api/admin/[resource]/[id]` handle create, update and delete for every resource. Validation and side effects for each resource live in `src/lib/admin/resources.js`.
- **Enquiries.** When MongoDB is configured, each contact form submission is saved before the email is sent, so it reaches the admin even if email fails.
- **Without a database** the site keeps running on `src/data`, and the admin shows setup instructions instead of the editors.
- **Not covered by the admin.** Images are picked from the artwork in `public/images/ai`; there are no uploads. The FAQ, services, legal pages and site settings are still edited in `src/data`.

