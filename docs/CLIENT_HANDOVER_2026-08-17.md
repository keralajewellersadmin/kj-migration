# Client Handover — Kerala Jewellers Website Rebuild

**Date:** 2026-08-17  
**Project:** Kerala Jewellers Website Rebuild (Next.js + Payload CMS)  
**Live URL:** https://kj-migration.vercel.app  
**Repository:** https://github.com/msarjun46/kj-migration

---

## 1. Live Site & Admin Access

| Item | URL | Notes |
|------|-----|-------|
| Live website | https://kj-migration.vercel.app | Public, no authentication needed |
| Admin panel | https://kj-migration.vercel.app/kj-portal-0d7cfad1 | **Share path securely, not in forwarded documents** |
| Admin login credentials | *(Delivered via secure channel)* | super-admin account |
| Enquiry manager login | *(Delivered via secure channel)* | Read-only inquiry viewer |

**⚠️ SECURITY NOTE:** The admin path `/kj-portal-0d7cfad1` is intentionally obscure. It is blocked in robots.txt and has noindex metadata. Do not share this path in emails, documents, or public channels.

---

## 2. Daily Operations Guide

### Update Metal Rates (Daily Task)
1. Log in to admin panel
2. Click **"Metal Rates"** in the sidebar
3. Enter the 4 rates: Gold 22K, Gold 18K, Silver, Platinum
4. Click **"Update Rates"** — rates update instantly on the website
5. The last updated date is displayed

### Reply to Customer Inquiries
1. Log in to admin panel
2. Click **"Inquiries"** in the sidebar
3. View new inquiries — each shows name, email, phone, message, and source page
4. Reply directly to the customer's email (shown in the inquiry)
5. Update inquiry status as needed

### Add a New Product
1. Log in → **"Products"** → **"Create New"**
2. Fill in: Product Name, Code, Metal (Gold/Silver/Diamond), Category, Weight, Purity
3. Write a description
4. Upload the product image (JPG/PNG/WebP)
5. Fill in SEO fields (title, description) for Google visibility
6. Click **"Save"**

### Add a Blog Post
1. Log in → **"Blog Posts"** → **"Create New"**
2. Enter: Title, Slug (URL-friendly name), Excerpt (short summary)
3. Add body content using the block editor (headings, paragraphs, lists)
4. Upload a thumbnail image
5. Click **"Save"**

### Change Homepage Banners
1. Log in → **"Site Settings"** (global) → **"Hero Slides"**
2. Edit existing slides or add new ones
3. Each slide needs: Heading, Subheading, Background Image, Button Text, Button Link
4. Click **"Save"**

---

## 3. Known Limitations & Deferred Items

| Item | Status | Notes |
|------|--------|-------|
| Platinum products | "Coming Soon" page | No platinum products in catalog yet — the `/coming-soon` page is active |
| Font licensing | Google Fonts (Montserrat, Mulish) | Free for commercial use, no license fees |
| Metal rates accuracy | Manual entry | Rates must be updated daily by staff — no automatic feeds |
| Email notifications | Gmail SMTP for OTP | Production uses Gmail for admin login OTP. Consider dedicated SMTP for scale |
| Inquiry notifications | Resend (if configured) | If `RESEND_API_KEY` is set, new inquiries trigger email notifications to `INQUIRY_NOTIFICATION_EMAIL` |
| Admin account limit | 3 accounts max | Enforced by design: super-admin, admin, enquiry-manager |
| Product images | Cloudinary-hosted | All images served via Cloudinary CDN with auto-optimization |

---

## 4. Support & Maintenance

| Item | Details |
|------|---------|
| Support contact | Mohamed Sarjun — [your preferred contact method] |
| Response time (critical) | Within 4 hours during business hours |
| Response time (non-critical) | Within 24 hours |
| Retainer tier | *(Per your agreement)* |

---

## 5. Monitoring

- **UptimeRobot/Uptime Kuma:** *(Set up and active — confirm monitoring URL with Sarjun)*
- **Monitored endpoints:** Homepage, Admin panel, `/api/frontend-products`
- **Alert contact:** *(Per your setup)*

---

## 6. Technical Architecture (For Reference)

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 16 (App Router, TypeScript, CSS Modules) |
| CMS | Payload CMS 3.88 |
| Database | Neon Postgres (production) / SQLite (development) |
| Image CDN | Cloudinary (auto-optimization, responsive transformations) |
| Hosting | Vercel (serverless) |
| Auth | Custom OTP login + Payload native sessions |
| Security | API middleware (route blocking, rate limiting, CSP headers) |

---

## 7. Security Audit

Full security audit report: `e2e/SECURITY_AUDIT_FINAL_2026-08-17.md`

**Key security measures:**
- All admin routes protected by authentication
- Rate limiting on login (5 attempts/15 min) and inquiry form
- HSTS enabled with preload
- Comprehensive Content Security Policy
- Admin panel hidden path + noindex + robots.txt blocking
- Payload REST API routes blocked from public access

---

## 8. Build & Deploy

The site auto-deploys on push to `master` branch. To deploy changes:

```bash
git push origin master
```

Vercel will build and deploy automatically (~53 seconds).

**Environment variables** are configured in Vercel dashboard. Do NOT commit `.env.local` or `.env.production.local`.

---

*This handover document was prepared as part of the final production readiness audit on 2026-08-17.*
