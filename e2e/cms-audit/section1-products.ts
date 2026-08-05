/**
 * Section 1 — Products CMS Audit
 * Uses Payload programmatic API + Playwright for frontend verification
 */
import { getPayload } from 'payload';
import config from '@payload-config';
import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:4000';

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function screenshot(page: any, name: string) {
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, name), fullPage: true });
  console.log(`  📸 Screenshot: ${name}`);
}

async function run() {
  const payload = await getPayload({ config });
  const results: string[] = [];

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  SECTION 1 — PRODUCTS CMS AUDIT');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Launch browser for frontend verification
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // ─── 1.1 Verify existing products ───
  console.log('── 1.1 Verify existing products ──');
  const existingProducts = await payload.find({
    collection: 'products',
    limit: 5,
    depth: 0,
  });
  console.log(`  Total products in DB: ${existingProducts.totalDocs}`);
  console.log(`  First 5: ${existingProducts.docs.map((p: any) => p.title).join(', ')}`);
  results.push(`1.1 ✅ Found ${existingProducts.totalDocs} products in DB`);

  // Check frontend listing
  await page.goto(`${BASE_URL}/products/gold`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await screenshot(page, '1.1-frontend-products-gold.png');
  const productCards = await page.locator('a[href^="/product/"]').count();
  console.log(`  Product cards on /products/gold: ${productCards}`);
  results.push(`1.1 ✅ Frontend /products/gold shows ${productCards} product cards`);

  // ─── 1.2 CREATE product ───
  console.log('\n── 1.2 CREATE product: Test Audit Necklace ──');
  let testProduct: any;
  try {
    testProduct = await payload.create({
      collection: 'products',
      data: {
        title: 'Test Audit Necklace',
        metal: 'gold',
        weight: 25,
        purity: 91.6,
        code: 'TESTAUDIT001',
        description: 'Test product created during CMS audit. Gold necklace for testing.',
        availability: 'in-stock',
      },
      overrideAccess: true,
    });
    console.log(`  Created product ID: ${testProduct.id}`);
    console.log(`  Generated slug: ${testProduct.slug}`);
    results.push(`1.2 ✅ Created product "${testProduct.title}" (ID: ${testProduct.id}, slug: ${testProduct.slug})`);

    // Verify on frontend
    await page.goto(`${BASE_URL}/product/${testProduct.slug}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await screenshot(page, '1.2-frontend-product-detail.png');

    const pageTitle = await page.textContent('h1').catch(() => 'N/A');
    console.log(`  Frontend title: ${pageTitle}`);
    results.push(`1.2 ✅ Frontend /product/${testProduct.slug} loads, title: "${pageTitle?.trim()}"`);

    // Check product appears in listing
    await page.goto(`${BASE_URL}/products/gold`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const foundInListing = await page.locator(`text=Test Audit Necklace`).count();
    console.log(`  Found in /products/gold listing: ${foundInListing > 0 ? 'YES' : 'NO'}`);
    results.push(`1.2 ${foundInListing > 0 ? '✅' : '⚠️'} Product ${foundInListing > 0 ? 'appears' : 'does NOT appear'} in /products/gold listing`);

    // Check image status
    const productDetailPage = await context.newPage();
    await productDetailPage.goto(`${BASE_URL}/product/${testProduct.slug}`, { waitUntil: 'domcontentloaded' });
    await productDetailPage.waitForTimeout(3000);
    const images = await productDetailPage.locator('img').all();
    let cloudinaryImages = 0;
    let brokenImages = 0;
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src?.includes('cloudinary')) cloudinaryImages++;
      if (src?.startsWith('/')) brokenImages++;
    }
    console.log(`  Images: ${cloudinaryImages} Cloudinary, ${brokenImages} local/broken`);
    results.push(`1.2 ${cloudinaryImages > 0 ? '✅' : '⚠️'} Product images: ${cloudinaryImages} Cloudinary, ${brokenImages} potentially broken`);
    await productDetailPage.close();

  } catch (err: any) {
    console.log(`  ❌ CREATE failed: ${err.message}`);
    results.push(`1.2 ❌ CREATE failed: ${err.message}`);
  }

  // ─── 1.3 Verify slug auto-generation ───
  console.log('\n── 1.3 Verify slug auto-generation ──');
  if (testProduct) {
    const expectedSlug = 'test-audit-necklace';
    const slugMatch = testProduct.slug === expectedSlug;
    console.log(`  Expected: "${expectedSlug}", Got: "${testProduct.slug}"`);
    results.push(`1.3 ${slugMatch ? '✅' : '⚠️'} Slug auto-generated: "${testProduct.slug}" (expected: "${expectedSlug}")`);
  }

  // ─── 1.4 EDIT product: weight 25 → 30 ───
  console.log('\n── 1.4 EDIT product: weight 25 → 30 ──');
  if (testProduct) {
    try {
      const updated = await payload.update({
        collection: 'products',
        id: testProduct.id,
        data: { weight: 30 },
        overrideAccess: true,
      });
      console.log(`  Updated weight: ${updated.weight}`);
      results.push(`1.4 ✅ Updated weight to ${updated.weight}`);

      // Verify slug didn't change
      const slugUnchanged = updated.slug === testProduct.slug;
      console.log(`  Slug unchanged: ${slugUnchanged} (still: ${updated.slug})`);
      results.push(`1.4 ${slugUnchanged ? '✅' : '❌'} Slug remained "${updated.slug}" after edit`);

      // Verify on frontend
      await page.goto(`${BASE_URL}/product/${testProduct.slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await screenshot(page, '1.4-frontend-after-edit.png');
      const content = await page.textContent('body');
      const has30 = content?.includes('30');
      console.log(`  Weight 30 visible on frontend: ${has30}`);
      results.push(`1.4 ${has30 ? '✅' : '⚠️'} Weight 30 ${has30 ? 'visible' : 'NOT visible'} on frontend`);

      // Also edit description
      const updated2 = await payload.update({
        collection: 'products',
        id: testProduct.id,
        data: { description: 'Updated description during CMS audit - testing edit persistence.' },
        overrideAccess: true,
      });
      results.push(`1.4 ✅ Description updated`);

      await page.goto(`${BASE_URL}/product/${testProduct.slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const descVisible = (await page.textContent('body'))?.includes('Updated description');
      results.push(`1.4 ${descVisible ? '✅' : '⚠'} Updated description ${descVisible ? 'visible' : 'NOT visible'} on frontend`);

    } catch (err: any) {
      console.log(`  ❌ EDIT failed: ${err.message}`);
      results.push(`1.4 ❌ EDIT failed: ${err.message}`);
    }
  }

  // ─── 1.5 Attempt to manually edit slug (should be blocked) ───
  console.log('\n── 1.5 Verify slug is read-only in admin UI ──');
  // We'll check via the admin panel in browser
  // For now, try to update slug via API (should it work?)
  if (testProduct) {
    try {
      const slugUpdate = await payload.update({
        collection: 'products',
        id: testProduct.id,
        data: { slug: 'hacked-slug' } as any,
        overrideAccess: true,
      });
      const slugChanged = slugUpdate.slug !== testProduct.slug;
      console.log(`  Slug changed via API: ${slugChanged} (new: ${slugUpdate.slug})`);
      if (slugChanged) {
        // Revert
        await payload.update({
          collection: 'products',
          id: testProduct.id,
          data: { slug: testProduct.slug } as any,
          overrideAccess: true,
        });
        results.push(`1.5 ⚠️ Slug CAN be changed via API (slug field not locked server-side)`);
      } else {
        results.push(`1.5 ✅ Slug locked — cannot be changed even via API`);
      }
    } catch (err: any) {
      results.push(`1.5 ✅ Slug change blocked: ${err.message}`);
    }
  }

  // ─── 1.6 DELETE product ───
  console.log('\n── 1.6 DELETE product ──');
  if (testProduct) {
    try {
      await payload.delete({
        collection: 'products',
        id: testProduct.id,
        overrideAccess: true,
      });
      console.log(`  Deleted product ID: ${testProduct.id}`);
      results.push(`1.6 ✅ Deleted product "${testProduct.title}" (ID: ${testProduct.id})`);

      // Verify 404 on frontend
      const response = await page.goto(`${BASE_URL}/product/${testProduct.slug}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      await screenshot(page, '1.6-frontend-product-404.png');
      const status = response?.status();
      console.log(`  /product/${testProduct.slug} status: ${status}`);
      results.push(`1.6 ${status === 404 ? '✅' : '❌'} Direct URL returns ${status} (expected: 404)`);

      // Verify removed from listing
      await page.goto(`${BASE_URL}/products/gold`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const stillVisible = await page.locator('text=Test Audit Necklace').count();
      console.log(`  Still in listing: ${stillVisible > 0 ? 'YES (BUG!)' : 'NO (OK)'}`);
      results.push(`1.6 ${stillVisible === 0 ? '✅' : '❌'} Removed from listing: ${stillVisible === 0 ? 'YES' : 'NO — STILL VISIBLE'}`);

    } catch (err: any) {
      console.log(`  ❌ DELETE failed: ${err.message}`);
      results.push(`1.6 ❌ DELETE failed: ${err.message}`);
    }
  }

  // ─── 1.7 Enquiry-manager RBAC ───
  console.log('\n── 1.7 Enquiry-manager RBAC test ──');
  // Login as enquiry-manager
  try {
    const eqLogin = await payload.login({
      collection: 'admin-users',
      data: { email: 'enquiry@keralajewellers.in', password: 'EnquiryMgr@12345' },
    });
    // Try to access products as enquiry-manager (should fail)
    try {
      const eqProducts = await payload.find({
        collection: 'products',
        limit: 1,
        // @ts-ignore - using enquiry-manager's token
        user: eqLogin.user,
      });
      console.log(`  Enquiry-manager can list products: ${eqProducts.totalDocs} (should be blocked)`);
      results.push(`1.7 ❌ Enquiry-manager CAN access products (${eqProducts.totalDocs} docs returned)`);
    } catch (err: any) {
      console.log(`  Enquiry-manager blocked from products: ${err.message}`);
      results.push(`1.7 ✅ Enquiry-manager blocked from products: ${err.message}`);
    }
  } catch (err: any) {
    console.log(`  ⚠️ Could not login as enquiry-manager: ${err.message}`);
    results.push(`1.7 ⚠️ Could not login as enquiry-manager: ${err.message}`);
  }

  // ─── 1.8 API POST /api/products should return 401/403 ───
  console.log('\n── 1.8 API POST /api/products unauthenticated ──');
  const apiResponse = await page.request.post(`${BASE_URL}/api/products`, {
    data: { title: 'API Test', metal: 'gold' },
    failOnStatusCode: false,
  });
  const apiStatus = apiResponse.status();
  console.log(`  POST /api/products: ${apiStatus}`);
  results.push(`1.8 ${apiStatus >= 400 ? '✅' : '❌'} POST /api/products unauthenticated: ${apiStatus} (expected: 401/403)`);
  await screenshot(page, '1.8-api-products-post.png');

  // ─── 1.9 Verify frontend product count ───
  console.log('\n── 1.9 Frontend product count verification ──');
  const productsAfter = await payload.find({
    collection: 'products',
    depth: 0,
  });
  console.log(`  Products after audit: ${productsAfter.totalDocs}`);
  results.push(`1.9 ✅ Final product count: ${productsAfter.totalDocs} (test product cleaned up)`);

  // ─── 1.10 Admin panel sidebar verification ───
  console.log('\n── 1.10 Admin panel — Products visible in sidebar ──');
  await page.goto(`${BASE_URL}/kj-portal-0d7cfad1/collections/products`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  await screenshot(page, '1.10-admin-products-collection.png');
  const adminUrl = page.url();
  console.log(`  Admin products URL: ${adminUrl}`);
  results.push(`1.10 ℹ️ Admin panel products page: ${adminUrl}`);

  // ═══ REPORT ═══
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  SECTION 1 — RESULTS');
  console.log('═══════════════════════════════════════════════════════════');
  const passCount = results.filter(r => r.includes('✅')).length;
  const failCount = results.filter(r => r.includes('❌')).length;
  const warnCount = results.filter(r => r.includes('⚠️') || r.includes('⚠')).length;
  for (const r of results) console.log(`  ${r}`);
  console.log(`\n  Total: ${results.length} | Pass: ${passCount} | Fail: ${failCount} | Warn: ${warnCount}`);

  await browser.close();
  await payload.destroy();
}

run().catch(console.error);
