# IEEE Babcock University Student Branch — Official Website

Built from the brief in `IEEE_Babcock_SB_Website_Brief.md`: a Next.js site with a dark IEEE-blue
theme, smooth Framer Motion animations, and a built-in admin dashboard for editing content
without touching code.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) — the brief suggested Next 14; the current stable major was used instead since the App Router API is unchanged |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Content | JSON files in `/content`, edited via `/admin` (no external CMS/DB required) |
| Forms | Built-in API routes (`/api/contact`, `/api/newsletter`) — swap for Formspree/EmailJS later if preferred |
| Hosting | Vercel (recommended) or any Node host |

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the values, see below
npm run dev
```

Visit `http://localhost:3000`. The admin dashboard is at `/admin`.

### Environment variables

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for `/admin` sign-in. **Change this before deploying.** |
| `ADMIN_SESSION_SECRET` | Random secret used to sign the admin session cookie. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `CONTACT_WEBHOOK_URL` | Optional. If set, contact form submissions are also POSTed here (e.g. a Slack incoming webhook or Zapier catch hook). |
| `NEXT_PUBLIC_SITE_URL` | Used in metadata, `sitemap.xml`, and `robots.txt`. Set to the real production domain before launch. |

A `.env.local` with working development defaults is already included; **do not reuse those
values in production**.

## Admin dashboard

Go to `/admin`, sign in with `ADMIN_PASSWORD`, and you can edit every content-driven section of
the site:

- Site Settings, Key Stats, Focus Areas, Events, Team, Projects, Partners & Sponsors, News/Blog,
  AXIS Congress page content, and the About page.
- Contact form submissions and newsletter signups are viewable (read-only) under **Inbox**.

Saving writes directly to the JSON files in `/content` and revalidates the live site, so changes
appear immediately — no redeploy needed on a persistent host.

**Important limitation:** this admin writes to the local filesystem. That works great on a
traditional Node host (a VPS, Docker, IEEE-hosted server) or `next start`. On **Vercel's
serverless functions**, the filesystem is read-only/ephemeral in production, so admin edits won't
persist between deployments there. If you deploy to Vercel and want persistent in-browser editing,
either:
- swap `src/lib/content.ts` for a real datastore (Vercel KV/Postgres, Supabase, etc.), or
- use the admin locally / on a persistent host to edit `/content`, then commit and redeploy.

For a `git`-committed site where content rarely changes, editing the JSON files directly and
redeploying is also perfectly fine — the admin UI is a convenience layer on top of the same files.

## Content model

All editable content lives in `/content/*.json`, typed in `src/lib/types.ts` and read via
`src/lib/content.ts`. `content/submissions.json` and `content/newsletter.json` are runtime data
(gitignored) — everything else is seed content meant to be replaced with real branch content.

## Assets still needed from the branch (see brief §6)

The site currently ships with generated placeholder SVGs (clearly labeled "replace") so every
page renders correctly out of the box. Before launch, replace these via the admin dashboard or by
editing `/content/*.json` directly:

- [ ] Official IEEE Babcock SB logo (SVG + PNG, light & dark) → replace `public/images/logo-ieee-babcock.png`
- [ ] Executive headshots (800×800px+) → Team section in admin, or `content/team.json`
- [ ] Event photo gallery (AXIS, Tethered, etc.) → Events / AXIS Congress sections in admin
- [ ] Partner/sponsor logos → Partners & Sponsors section in admin
- [ ] Final brand colors, if different from IEEE Blue → `src/app/globals.css` (`:root` variables)
- [ ] Branch bio copy (history, mission, vision) → About Page section in admin
- [ ] Social media handles → Site Settings section in admin
- [ ] IEEE vTools event links → Events section in admin
- [ ] Official IEEE membership join link → Site Settings section in admin
- [ ] Official `sb-babcock@ieee.org` alias (site currently uses this as the default) → Site Settings

## Deployment (Vercel)

```bash
npm run build   # sanity check locally first
```

1. Push this repo to GitHub.
2. Import it in Vercel, set the environment variables above in the Vercel project settings.
3. Deploy. SSL is automatic.

See the note above about the filesystem-writes limitation if you plan to use `/admin` after
deploying to Vercel.

## Project structure

```
content/                 JSON content (the "database")
src/app/(site)/          Public pages — home, about, team, events, axis-congress, projects, blog, contact
src/app/admin/           Admin dashboard (login + protected content editors)
src/app/api/             Contact form, newsletter, and admin content API routes
src/components/          Navbar, Footer, page sections, shared UI, admin editor UI
src/lib/                 Content read/write, auth, types, utils
```
