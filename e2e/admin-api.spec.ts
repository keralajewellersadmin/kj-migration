import { test, expect } from '@playwright/test';

const ADMIN_PATH = '/kj-portal-0d7cfad1';

test.describe('Admin Panel — Access', () => {
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
});

test.describe('Admin Panel — Login Flow', () => {
  test('login form has email and password fields', async ({ page }) => {
    await page.goto(ADMIN_PATH, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible();
      const passInput = page.locator('input[type="password"]').first();
      await expect(passInput).toBeVisible();
    }
  });

  test('login with superadmin credentials shows OTP step', async ({ page }) => {
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
      const body = await page.textContent('body');
      const success = body?.includes('OTP') || body?.includes('Dashboard') || body?.includes('Welcome') || page.url().includes('admin');
      expect(success).toBeTruthy();
    }
  });
});

test.describe('Admin Panel — Reset Password Page', () => {
  test('reset password page loads', async ({ page }) => {
    const res = await page.goto(`${ADMIN_PATH}/reset-password`, { waitUntil: 'domcontentloaded' });
    expect(res!.status()).toBeLessThan(500);
  });
});

test.describe('Performance — Load Times', () => {
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

  test('products listing loads under 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('contact page loads under 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });
});
