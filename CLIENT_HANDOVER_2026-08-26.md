# CLIENT HANDOVER — Kerala Jewellers
**Date:** 2026-08-26
**Project:** keralajewellers.in rebuild — Next.js + Payload CMS
**Live URL:** https://kj-migration.vercel.app (will be pointed to https://keralajewellers.in via DNS)
**Admin URL:** https://kj-migration.vercel.app/kj-portal-0d7cfad1

> **Credentials shared via secure channel only (1Password / Signal). Do not commit to git or email in plain text.**

| Role | Username / Email | Password | OTP |
|------|------------------|----------|-----|
| Super-admin | keralajewellersadmin@gmail.com | SuperAdmin@12345 | via email |
| Admin | admin (username) | AdminMgr@12345 | via email |
| Enquiry Manager | enquiry (username) | EnquiryMgr@12345 | via email |

---

## 1. Daily Usage Guide

### Update Metal Rates (Daily)
1. Login → **Dashboard** → **Today's Rates** card → **Update Rates**
2. Enter `Gold 22K`, `Gold 18K`, `Silver`, `Platinum` per gram, and `Updated At` date
3. Save → rates appear instantly in Navbar ticker (`Today's Rate — ...`) on all pages

### Reply to Inquiries
1. **Daily Tasks → Inquiries** — filter by `New`, `Contacted`, etc., or search by name/email
2. Click an inquiry → change `Status` to `Contacted`/`In-progress`/`Resolved`, add internal notes
3. Source pills show `Contact` (from /contact) vs `Enquiry` (from /enquiry or product page)

### Add a Product
1. **Content → Products → Create New**
2. Fill `Title`, `Metal` (gold/silver/diamond/platinum), `Category` (select existing 12), `Weight`, `Purity`, `Description`
3. **Image:** Use **Browse Media** or **Upload New** → crop to recommended ratio (shown in picker) → **Crop & Upload** — image goes to Cloudinary `kerala-jewellers/products/<slug>-<hash>.webp` and appears immediately on `/products` and `/product/[slug]`
4. Save → check `/products/[metal]` and `/product/[slug]` — image should match exactly what you uploaded (traceable via Cloudinary public_id containing slug)

### Add a Blog Post
1. **Content → Blog Posts → Create New** — `Title`, `Slug` (auto), `Excerpt`, `Thumbnail` (upload), `Body` blocks (`h2`, `p`, `ul`)
2. Publish → appears on `/blog` and `/blog/[slug]`

### Edit a Page Banner / Text (Pages)
1. **Pages** (in Admin sidebar) → select **Home**, **Gold/Silver/Diamond Products**, **About**, **Swarnavarsha**, **Thanga Mazhai**
2. Each field shows its purpose (e.g., `Hero Slides` on Home, `Golden Occasions` on About). **Image fields** show recommended size and let you crop.
3. For **Home → Hero Slides**: you can now add image-only slides (Heading optional) — just upload an image and leave text blank, it will show as a full-bleed banner (`bannerOnly` mode).
4. Save → revalidate is automatic (`revalidatePath("/")` etc.), changes appear within 5 minutes or on next hard-refresh.

### Add a New Admin User
1. As **Super-admin**: **Site Settings → Admin** (or **Admin Users** collection) → **Create New** → set `Name`, `Email` or `Username`, `Role` (`admin` or `enquiry-manager` — super-admin only can create `super-admin`), `isActive: true`
2. Max 3 accounts system-wide (enforced). The new user will receive a **Setup** email with a 7-day link to set their password.

---

## 2. Known Limitations / Deferred Items

- **Platinum:** Still `Coming Soon` at `/coming-soon` (via `productsPage.platinumHero` CMS). When you have platinum inventory, change Navbar `Platinum` link from `/coming-soon` to `/products/platinum` in `components/layout/Navbar.tsx:327` and ensure products with `metal: platinum` exist.
- **Font licensing:** `Com 4 DL` / `Mulish` / `Montserrat` via Google Fonts — confirm licensing for commercial web use if you self-host.
- **Timeline multi-image:** Each `aboutPage.timeline` year currently supports **1 image** (`payload.config.ts:1424`). Reference shows 1-2 images per entry — if you need 2, we can migrate to `images: hasMany` (additive, non-breaking).
- **Rate limiting:** OTP (5/hour/IP), inquiry IP (5/15min) + email (3/hour) — deliberately strict for abuse protection.

---

## 3. Support

- **Contact:** Random Stacks — via Slack / email (as per SOW)
- **Response:** Best-effort within 1 business day for critical (site down, login broken, checkout/inquiry failure); 2-3 days for content/style tweaks.
- **Monitoring:** UptimeRobot (or Kuma) should be pointed at `https://kj-migration.vercel.app` + `https://kj-migration.vercel.app/kj-portal-0d7cfad1` + `https://kj-migration.vercel.app/api/products` — alerts to your email/Slack. **Action needed:** Confirm monitoring is active in your UptimeRobot dashboard (not in repo).

---

## 4. Infrastructure Checklist (for your records)

- **Neon Postgres:** Pooled (`pooler` host), `ssl:{rejectUnauthorized:false}`, `POSTGRES_POOL_MAX=1` for serverless — confirmed `SELECT 1` OK.
- **Cloudinary:** `CLOUDINARY_CLOUD_NAME=htl6k8cd` + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` + `API_KEY/SECRET` in Vercel env (production) and `.env.local` (local, gitignored). Folder `kerala-jewellers/products/<slug>-<hash>.webp` traceable.
- **Resend (Gmail SMTP via Resend):** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `INQUIRY_NOTIFICATION_EMAIL` in Vercel — OTP + welcome/setup emails tested via `Invoke-RestMethod` to `/api/inquiry`.
- **Vercel env:** Ensure `.env.example` placeholders match Vercel dashboard (see `FINAL_AUDIT_REPORT_2026-08-26.md: Phase 6`).

---

## 5. Audit

Full 7-phase audit with proof at `E:\Kerala-Jewellers\FINAL_AUDIT_REPORT_2026-08-26.md:1` (updated after fixes). **Final status after fixes: PRODUCTION READY** — 127 products verified, 0 orphans, 0 %25, 3 admin accounts correct, `tsc` 0, `eslint --max-warnings 0` 0, `next build` 20 routes, HSTS `max-age=63072000`, `noindex` on admin, `/admin` 404 via `middleware.ts:1`.

---

## 6. What Changed in This Handover

- Product data fully re-imported from `E:\Kerala-Jewellers-final` (127 correctly paired, traceable Cloudinary names, 138 orphans removed)
- Heritage seeded with `Rectangle 343-p-2000` (2000×1875) as requested
- About page rebuilt pixel-perfect to `about.html` (vertical timeline, not marquee — per true reference)
- Blog/About heroes CMS-managed and seeded
- All 5 blocking audit items resolved
