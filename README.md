# Kerala Jewellers - Payload CMS Rebuild

Kerala Jewellers is a Next.js + Payload CMS rebuild of the public jewellery website.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- CSS Modules with shared tokens in `Frontend/styles/tokens.css`
- Payload CMS 3
- SQLite through `@payloadcms/db-sqlite`

## Local Development

```bash
cd Frontend
npm install
npm run dev
```

The dev server runs on:

```text
http://localhost:4000
```

Payload admin runs inside the same Next.js app:

```text
http://localhost:4000/admin
```

## Environment

Create `Frontend/.env.local` when needed:

```env
PAYLOAD_SECRET=change-this-secret
DATABASE_URI=file:./dev.db
```

If `DATABASE_URI` is omitted, the app uses `file:./dev.db`.

## Project Structure

```text
Frontend/app/(public)        Public website routes
Frontend/app/(payload)       Payload admin and API routes
Frontend/app/api/inquiry     Public inquiry form API
Frontend/app/api/seed        Development seed endpoint
Frontend/components          Shared UI components
Frontend/lib/data/cms.ts     Payload data adapter
Frontend/lib/data/products.ts Seed data only
Frontend/payload.config.ts   Payload collections and globals
Frontend/public/assets       Static website assets
```

## CMS Model

Collections:

- `media`
- `products`
- `categories`
- `blog-posts`
- `inquiries`

Global:

- `site-settings`

`site-settings` controls rates, homepage content, reviews, banners, branches, footer details, bestseller slugs, and typography.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
```

## Notes

The public pages read live data from Payload through `Frontend/lib/data/cms.ts`.
`Frontend/lib/data/products.ts` is seed data only and is not the runtime source of truth.
