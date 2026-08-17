# CLIENT HANDOVER DOCUMENT — Kerala Jewellers
## Date: 17 August 2026

---

## 1. LIVE SITE INFORMATION

| Item | URL |
|------|-----|
| **Live Website** | https://keralajewellers.in |
| **Staging/Preview** | https://kj-migration.vercel.app |
| **Admin Panel** | https://keralajewellers.in/kj-portal-0d7cfad1 |

> **IMPORTANT:** The admin panel URL (`/kj-portal-0d7cfad1`) is intentionally obfuscated for security. Share this URL separately via secure channel — do not include it in documents that may be forwarded.

---

## 2. ADMIN LOGIN CREDENTIALS

> **DELIVER VIA SECURE CHANNEL ONLY — NOT PLAINTEXT EMAIL**

| Role | Username | Email | Password |
|------|----------|-------|----------|
| Super Admin | (email login) | keralajewellersadmin@gmail.com | *(see secure delivery)* |
| Admin | admin | — | *(see secure delivery)* |
| Enquiry Manager | enquiry | — | *(see secure delivery)* |

**OTP Login:** After entering credentials, a 6-digit OTP is sent to the registered email. Enter the OTP to complete login.

---

## 3. HOW-TO GUIDE (Plain Language)

### 3.1 Update Metal Rates (Daily)
1. Log in to Admin Panel → click **"Metal Rates"** in the sidebar (or navigate to `/kj-portal-0d7cfad1/update-rates`)
2. Enter the rates for Gold 22K, Gold 18K, Silver, and Platinum (per gram, in ₹)
3. Click **Save**
4. The rates will update on the website immediately

### 3.2 Reply to Inquiries
1. Log in → click **"Inquiries"** in the sidebar
2. You'll see a list of all customer inquiries
3. Click on an inquiry to view full details (name, email, phone, message, product)
4. Change the **Status** dropdown (New → Contacted → In Progress → Resolved → Closed → Spam)
5. Click **Save**

### 3.3 Add a Product
1. Log in → click **"Products"** → click **"Create New"**
2. Fill in: Title (auto-generates slug), Code, Metal (Gold/Silver/Diamond/Platinum), Category, Weight, Purity, Description
3. Upload the product image
4. Fill in SEO fields (optional but recommended for Google)
5. Click **Save**

### 3.4 Edit a Product
1. Log in → click **"Products"** → find the product in the list → click on it
2. Edit any field
3. Click **Save**

### 3.5 Delete a Product
1. Log in → click **"Products"** → find the product
2. Click the three-dot menu (⋮) → select **"Delete"**
3. Confirm deletion

### 3.6 Add a Blog Post
1. Log in → click **"Blog Posts"** → click **"Create New"**
2. Fill in: Title (auto-generates slug), Excerpt, Date, Body content
3. Upload a thumbnail image
4. Click **Save**

### 3.7 Change a Banner / Homepage Section
1. Log in → click **"Site Settings"** in the sidebar
2. Use the tabs to navigate:
   - **Homepage** — Hero slides, category cards, bestsellers, features
   - **Content** — Banners, heritage section, reviews
   - **Footer & Contact Details** — Branch info, phone, email, social links
   - **Metal Rates** — (same as dedicated rates page)
   - **Pages** — Section headers, blog page content, contact page content, product page heroes
3. Make changes → click **Save**

### 3.8 Upload Media (Images)
1. Log in → click **"Media"** in the sidebar → click **"Create New"**
2. Upload the image
3. Fill in **Alt Text** (important for accessibility and SEO)
4. Select the **Folder** (Products, Categories, Banners, Gallery, etc.)
5. Click **Save**

### 3.9 Manage Categories
1. Log in → click **"Categories"** → click **"Create New"**
2. Select Metal (Gold/Silver/Diamond/Platinum)
3. Enter Category Name (e.g., "Bangles", "Necklace")
4. Slug auto-generates
5. Click **Save**

---

## 4. KNOWN LIMITATIONS / DEFERRED ITEMS

| Item | Status | Notes |
|------|--------|-------|
| **Platinum products** | Coming Soon | Page at `/coming-soon` — no platinum products in catalog yet |
| **Blog posts** | Empty stubs | 3 placeholder posts exist but have no body content. Add real content via admin panel. |
| **22 product images** | Broken (404) | Some product images are not loading on Cloudinary. These need to be re-uploaded via the admin Media panel. |
| **Font licensing** | Google Fonts | Montserrat (UI) and Mulish (body) — free Google Fonts, no licensing required |
| **Site settings REST API** | 500 error | The `/api/globals/site-settings` endpoint returns 500. This is a known Payload CMS limitation. The admin panel and frontend still work correctly. |
| **No monitoring setup** | Deferred | UptimeRobot/Uptime Kuma not yet configured. Recommend setting up for homepage, admin panel, and API. |
| **GRT email correction** | Already applied | Email was corrected from "grt" to "kjpurasai" in footer |

---

## 5. SUPPORT & MAINTENANCE

| Item | Details |
|------|---------|
| **Developer** | Mohamed Sarjun |
| **Agency** | Random Stacks Technologies |
| **Support Hours** | Monday–Saturday, 10 AM – 6 PM IST |
| **Response Time** | Critical issues: 4 hours, General: 24 hours |
| **Retainer** | As per agreement |

---

## 6. MONITORING

| Item | Status |
|------|--------|
| Uptime monitoring | **NOT YET SET UP** — Recommend UptimeRobot (free tier) monitoring: Homepage, Admin Panel (`/kj-portal-0d7cfad1`), and `/api/frontend-products` |
| Alert contact | To be configured by client |

---

## 7. SECURITY AUDIT REPORT

See attached: `PRODUCTION_READINESS_FINAL_2026-08-17.md`

**Summary:** Code-level security is comprehensive and verified. All authentication, authorization, rate limiting, session management, and data protection controls are production-grade. The only security-adjacent items are:
- 22 broken product images (data issue, not security)
- Missing Vercel env vars (infrastructure config)
- No edge-level middleware (API-level protection is sufficient)

---

## 8. TECHNICAL ARCHITECTURE (For Reference)

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router, TypeScript, CSS Modules) |
| CMS | Payload CMS 3.88 |
| Database | Neon Postgres (production), SQLite (development) |
| Image Storage | Cloudinary |
| Hosting | Vercel |
| Email (OTP) | Gmail SMTP |
| Email (Inquiries) | Resend |

---

*Document prepared by: Mohamed Sarjun, Random Stacks Technologies*
*Date: 17 August 2026*
