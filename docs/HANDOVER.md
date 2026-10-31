# Choorakkodi website: handover

Next.js 16 · Payload CMS 3 (SQLite) · GSAP · Lenis · Tailwind 4

The full handover and production audit is the shared document from the outgoing developer.
This file keeps what you need inside the repo.

## Commands

```bash
npm ci
npm run typecheck && npm run lint
npm run build
npm start
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Canonical URLs, Open Graph, sitemap. Defaults to `https://www.choorakkodi.com`. |
| `PAYLOAD_SECRET` | For the CMS | Empty means the site runs from `src/data` with the CMS off. |
| `DATABASE_URI` | For the CMS | SQLite path, on persistent disk. |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | No | Login created by `npm run seed`. Leave empty on a real deployment. |
| `NEXT_PUBLIC_SHOW_PENDING` | No | `1` shows content-owner notes in place. Previews only. |

## Two content sources

- With `PAYLOAD_SECRET` the site reads `data/choorakkodi.db`. Without it the site reads `src/data`.
- The two have drifted: the homepage shows 4 chapter photos from the database and 6 from `src/data`.
- `.vercelignore` excludes `.env` and `data/`, so a Vercel deployment serves `src/data` and has no CMS.
  `/admin` and `/api` return 404 there.
- Vercel has no persistent disk. Running the CMS in production needs a server with one, or a hosted
  database and file storage.

`npm run seed:reset` replaces all CMS content with `src/data`. Back up `data/` and `media/` first.

## Assets

- `public/` holds only what the site serves.
- `docs/brand` and `docs/client` hold supplied documents.
- `docs/source-images` holds originals.

`src/data` and the database are the two places a content change may need to be made.
`CONTENT_TODO.md` lists what the academy still has to supply.
