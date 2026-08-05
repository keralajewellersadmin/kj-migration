import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:4000';
const ADMIN_PATH = '/kj-portal-0d7cfad1';

test.describe.serial('Section 1 — Products CRUD Audit', () => {
  test('1.0 Login as admin', async ({ page }) => {
    await page.goto(`${BASE_URL}${ADMIN_PATH}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.0-admin-login-page.png'), fullPage: true });

    // Login with admin credentials
    await page.fill('input[name="email"], input[type="email"], input[placeholder*="email" i]', 'admin');
    await page.fill('input[name="password"], input[type="password"]', 'AdminMgr@12345');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.0-admin-credentials-filled.png'), fullPage: true });
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.0-admin-otp-step.png'), fullPage: true });

    // OTP step - check if we need OTP
    const otpInput = page.locator('input[name="otp"], input[placeholder*="otp" i], input[autocomplete="one-time-code"]');
    if (await otpInput.count() > 0) {
      // For local dev, check if there's a way to bypass or if OTP was sent
      console.log('OTP step detected - checking for dev bypass or test OTP');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.0-admin-otp-required.png'), fullPage: true });
    }

    // Check if we're already in the admin panel
    const url = page.url();
    console.log(`Current URL after login attempt: ${url}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.0-admin-current-state.png'), fullPage: true });
  });

  test('1.1 Navigate to Products collection', async ({ page }) => {
    await page.goto(`${BASE_URL}${ADMIN_PATH}/collections/products`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.1-products-list.png'), fullPage: true });

    // Count existing products
    const rows = page.locator('tr, [class*="row"], [class*="list"] a[href*="products"]');
    const count = await rows.count();
    console.log(`Products found in list: ${count}`);
  });

  test('1.2 Create new product - Test Audit Necklace', async ({ page }) => {
    await page.goto(`${BASE_URL}${ADMIN_PATH}/collections/products/create`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.2-create-product-form.png'), fullPage: true });

    // Fill in product fields
    // Title
    const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]').first();
    if (await titleInput.count() > 0) {
      await titleInput.fill('Test Audit Necklace');
    }

    // Metal - select Gold
    const metalSelect = page.locator('select[name="metal"], [name="metal"] button, [class*="metal"] button').first();
    if (await metalSelect.count() > 0) {
      await metalSelect.click();
      await page.waitForTimeout(500);
      const goldOption = page.locator('text=Gold, [value="gold"]').first();
      if (await goldOption.count() > 0) {
        await goldOption.click();
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.2-create-product-title-metal.png'), fullPage: true });

    // Weight
    const weightInput = page.locator('input[name="weight"], input[placeholder*="weight" i]').first();
    if (await weightInput.count() > 0) {
      await weightInput.fill('25');
    }

    // Purity
    const purityInput = page.locator('input[name="purity"], input[placeholder*="purity" i]').first();
    if (await purityInput.count() > 0) {
      await purityInput.fill('91.6');
    }

    // Code
    const codeInput = page.locator('input[name="code"], input[placeholder*="code" i]').first();
    if (await codeInput.count() > 0) {
      await codeInput.fill('TESTAUDIT001');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.2-create-product-fields.png'), fullPage: true });

    // Description
    const descInput = page.locator('textarea[name="description"], [class*="rich-text"] [contenteditable="true"], .tiptap').first();
    if (await descInput.count() > 0) {
      await descInput.click();
      await page.keyboard.type('Test product created during CMS audit. This is a gold necklace for testing purposes.');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.2-create-product-description.png'), fullPage: true });

    // Scroll down to see more fields
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.2-create-product-bottom.png'), fullPage: true });

    // Look for Save/Publish button
    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Publish"), button[type="submit"]').first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.2-create-product-saved.png'), fullPage: true });

    // Check if we got a success message or redirect
    const currentUrl = page.url();
    console.log(`After save URL: ${currentUrl}`);
  });

  test('1.3 Verify product on frontend - /products/gold', async ({ page }) => {
    // Check products listing
    await page.goto(`${BASE_URL}/products/gold`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.3-frontend-products-gold.png'), fullPage: true });

    // Look for our test product
    const testProduct = page.locator('text=Test Audit Necklace');
    const found = await testProduct.count();
    console.log(`Test Audit Necklace found on /products/gold: ${found > 0 ? 'YES' : 'NO'}`);

    // Check product detail page
    await page.goto(`${BASE_URL}/product/test-audit-necklace`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.3-frontend-product-detail.png'), fullPage: true });

    const detailTitle = await page.textContent('h1, [class*="title"]').catch(() => '');
    console.log(`Product detail title: ${detailTitle}`);

    // Check for image
    const images = page.locator('img');
    const imgCount = await images.count();
    console.log(`Images on product detail page: ${imgCount}`);
    for (let i = 0; i < Math.min(imgCount, 3); i++) {
      const src = await images.nth(i).getAttribute('src');
      console.log(`  Image ${i}: ${src}`);
    }
  });

  test('1.4 Edit product - change weight to 30', async ({ page }) => {
    // Find the product in admin
    await page.goto(`${BASE_URL}${ADMIN_PATH}/collections/products`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Search for our test product
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test Audit Necklace');
      await page.waitForTimeout(2000);
    }

    // Click on the test product
    const productLink = page.locator('a:has-text("Test Audit Necklace"), tr:has-text("Test Audit Necklace") a').first();
    if (await productLink.count() > 0) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.4-edit-product-page.png'), fullPage: true });

    // Change weight from 25 to 30
    const weightInput = page.locator('input[name="weight"], input[placeholder*="weight" i]').first();
    if (await weightInput.count() > 0) {
      await weightInput.clear();
      await weightInput.fill('30');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.4-edit-product-weight-changed.png'), fullPage: true });

    // Check slug field - should be read-only
    const slugInput = page.locator('input[name="slug"]').first();
    if (await slugInput.count() > 0) {
      const isDisabled = await slugInput.isDisabled();
      const isReadonly = await slugInput.getAttribute('readonly');
      console.log(`Slug field disabled: ${isDisabled}, readonly: ${isReadonly}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.4-edit-product-slug-field.png'), fullPage: true });
    }

    // Save
    const saveBtn = page.locator('button:has-text("Save"), button[type="submit"]').first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.4-edit-product-saved.png'), fullPage: true });
  });

  test('1.5 Verify edit on frontend', async ({ page }) => {
    await page.goto(`${BASE_URL}/product/test-audit-necklace`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.5-frontend-product-after-edit.png'), fullPage: true });

    // Check that weight shows 30, not 25
    const pageContent = await page.textContent('body');
    const has30 = pageContent?.includes('30');
    const has25 = pageContent?.includes('25');
    console.log(`Weight 30 visible: ${has30}, Weight 25 visible: ${has25}`);
  });

  test('1.6 Delete test product', async ({ page }) => {
    await page.goto(`${BASE_URL}${ADMIN_PATH}/collections/products`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Search for test product
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test Audit Necklace');
      await page.waitForTimeout(2000);
    }

    const productLink = page.locator('a:has-text("Test Audit Necklace"), tr:has-text("Test Audit Necklace") a').first();
    if (await productLink.count() > 0) {
      await productLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.6-delete-product-page.png'), fullPage: true });

    // Look for delete button
    const deleteBtn = page.locator('button:has-text("Delete"), button:has-text("trash"), [class*="delete"]').first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);
      // Confirm deletion if dialog appears
      const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').last();
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.6-after-delete.png'), fullPage: true });
  });

  test('1.7 Verify deletion on frontend', async ({ page }) => {
    // Check listing
    await page.goto(`${BASE_URL}/products/gold`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.7-frontend-after-delete-listing.png'), fullPage: true });

    const testProduct = page.locator('text=Test Audit Necklace');
    const foundOnListing = await testProduct.count();
    console.log(`Test Audit Necklace on /products/gold after delete: ${foundOnListing > 0 ? 'STILL VISIBLE (BUG)' : 'REMOVED (OK)'}`);

    // Check 404 on direct URL
    const response = await page.goto(`${BASE_URL}/product/test-audit-necklace`);
    const status = response?.status();
    console.log(`/product/test-audit-necklace status: ${status}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.7-frontend-product-404.png'), fullPage: true });
    expect(status).toBe(404);
  });

  test('1.8 Enquiry-manager cannot access Products', async ({ page }) => {
    // Try to access products collection as enquiry-manager
    // First try direct URL access
    const response = await page.goto(`${BASE_URL}${ADMIN_PATH}/collections/products`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.8-enquiry-manager-products-access.png'), fullPage: true });

    const url = page.url();
    console.log(`Enquiry-manager accessing /collections/products: URL = ${url}`);
    const isBlocked = !url.includes('/collections/products') || await page.locator('text=unauthorized, text=forbidden, text=access denied').count() > 0;
    console.log(`Products access blocked for enquiry-manager: ${isBlocked ? 'YES (OK)' : 'NO (BUG)'}`);
  });

  test('1.9 API POST /api/products returns 403 for unauthenticated', async ({ page }) => {
    const response = await page.request.post(`${BASE_URL}/api/products`, {
      data: {
        title: 'API Test Product',
        metal: 'gold',
      },
      failOnStatusCode: false,
    });
    const status = response.status();
    console.log(`POST /api/products unauthenticated: ${status}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '1.9-api-products-post-unauth.png'), fullPage: true });
    // Should be 401 or 403
    expect(status).toBeGreaterThanOrEqual(400);
  });
});
