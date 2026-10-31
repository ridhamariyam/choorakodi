# Choorakkodi Martial Arts Academy

Website and content manager (CMS) for the academy in Kozhikode, Kerala.
Built with Next.js 16 and Payload CMS. Needs Node.js 20.9 or newer.

## Run the website

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Without a `.env` file, the site shows the built-in content from `src/data` and the CMS is off.

## Turn on the CMS

1. Create the settings file:

   ```bash
   cp .env.example .env
   ```

2. Generate a secret, and paste it after `PAYLOAD_SECRET=` in `.env`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Create the `data` folder and fill the database with the site's content:

   ```bash
   mkdir -p data
   npm run seed
   ```

4. Run `npm run dev`, open http://localhost:3000/admin and create your login.

To have the seed create the login for you, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` before step 3. Leave both empty on a live site.

## Manage content

Log in at `/admin`.

| Menu | What you can change |
| --- | --- |
| Content | Events, Journal articles, Testimonials, Gallery |
| Pages | Homepage and the text on each page |
| Library | Photos: upload here, or from any image field |
| Settings | Academy details (phone, WhatsApp, email, hours, social links) and admin users |

- Add another admin under Settings → Admin users.
- Sample events and testimonials, and unreviewed articles, are hidden from Google. Untick the matching box when the record is real.
- Forgot your password? Click "Forgot password" on the login page. No email service is set up, so copy the reset link from the terminal running the site.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Run locally |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Check code style |
| `npm run typecheck` | Check types |
| `npm run seed` | Fill an empty CMS from `src/data` |
| `npm run seed:reset` | **Replace all CMS content** with `src/data`. Back up first. |

## Go live

Set `NEXT_PUBLIC_SITE_URL` to the real domain. Then choose one:

- **Vercel, without the CMS:** the site runs from `src/data`, so content changes are code changes. `/admin` shows a 404.
- **Your own server, with the CMS:** set everything in `.env`, then run `npm ci`, `npm run build` and `npm start`. `data/` and `media/` must be on a permanent disk.

Vercel has no permanent disk, so the CMS can't run there as it is set up now.

## Backups

The CMS stores everything in two folders: `data/` (content and logins) and `media/` (uploaded photos). Back up both together.

Neither folder is in git. Never commit or email `.env` or `data/`.

## More

See `docs/HANDOVER.md` for technical notes. Brand files are in `docs/brand`, client documents in `docs/client` and original images in `docs/source-images`.
