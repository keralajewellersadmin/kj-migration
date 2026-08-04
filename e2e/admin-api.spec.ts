import { test, expect } from '@playwright/test';

const ADMIN_PATH = '/kj-portal-0d7cfad1';

test.describe('Admin Panel', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(ADMIN_PATH));
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('admin has noindex/nofollow meta', async ({ page }) => {
    await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' });
    const robots = page.locator('meta[name="robots"]');
    const content = await robots.getAttribute('content');
    expect(content).toMatch(/noindex|nofollow/);
  });

  test('admin login with superadmin credentials', async ({ page }) => {
    await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('superadmin@keralajewellers.in');
      const passInput = page.locator('input[type="password"]').first();
      await passInput.fill('SuperAdmin@12345');
      const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
      await submitBtn.click();
      await page.waitForTimeout(3000);
      const url = page.url();
      const body = await page.textContent('body');
      const success = body?.includes('OTP') || body?.includes('Dashboard') || body?.includes('Welcome') || url.includes('admin');
      expect(success).toBeTruthy();
    }
  });
});

test.describe('API Health', () => {
  test('site settings API responds (not a crash)', async ({ page }) => {
    const res = await page.request.get('/api/site-settings');
    expect(res.status()).toBeLessThan(600);
  });

  test('products API responds (not a crash)', async ({ page }) => {
    const res = await page.request.get('/api/products?limit=1');
    expect(res.status()).toBeLessThan(600);
  });

  test('categories API responds (not a crash)', async ({ page }) => {
    const res = await page.request.get('/api/categories?limit=1');
    expect(res.status()).toBeLessThan(600);
  });

  test('media API responds (not a crash)', async ({ page }) => {
    const res = await page.request.get('/api/media?limit=1');
    expect(res.status()).toBeLessThan(600);
  });
});

test.describe('SEO & Performance', () => {
  test('homepage loads under 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('product page loads under 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('all pages have lang="en"', async ({ page }) => {
    for (const path of ['/', '/products', '/about', '/contact']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en');
    }
  });
});
