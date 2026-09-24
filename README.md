# Kerala Jewellers

Public website rebuild for Kerala Jewellers — Next.js App Router + Payload CMS.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- CSS Modules with design tokens in `styles/tokens.css`
- Payload CMS 3
- Postgres (Neon) in production; SQLite for local development
- Cloudinary for media

## Local development

```bash
npm install
npm run dev
```

Dev server: `http://localhost:4000`

Admin panel: `http://localhost:4000/kj-portal-0d7cfad1`

## Environment

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required for production:

| Variable | Purpose |
| --- | --- |
| `PAYLOAD_SECRET` | Payload session secret |
| `DATABASE_URL` | Postgres connection string |
| `CLOUDINARY_*` | Image uploads |
| `GMAIL_OTP_SENDER_EMAIL` / `GMAIL_OTP_SENDER_APP_PASSWORD` | Admin OTP + password-reset email |
| `NEXT_PUBLIC_SITE_URL` | Absolute site URL |

Secrets belong only in local `.env*` files and the Vercel project environment — never in git.

## Project structure

```text
app/(public)          Public website routes
app/(payload)         Payload admin + admin API
app/api/inquiry       Public enquiry form
app/api/auth/*        Login, OTP, password reset
components            UI components
lib/data              CMS data access
lib/auth              Auth + email helpers
payload.config.ts     Collections and globals
public/assets         Static assets
scripts/              One-time DB bootstrap / seed tooling
```

## CMS model

Collections: `media`, `products`, `categories`, `blog-posts`, `inquiries`, `admin-users`

Global: `site-settings` — metal rates, homepage sections, reviews, banners, branches, footer, typography.

## Commands

```bash
npm run dev        # dev server (port 4000)
npm run build      # migrate (best-effort) + production build
npm run start      # start production server
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

## Fresh database (optional)

```bash
npx tsx scripts/bootstrap-db.mts   # schema + migration records
node scripts/reseed.mjs            # categories / media / products
npx tsx scripts/setup-prod-admin.mts  # admin accounts (SEED_*_PASSWORD env)
```
