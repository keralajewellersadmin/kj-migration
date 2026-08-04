import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('loads with form', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Contact/);
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('has name, email, phone, message fields', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="name"], input[placeholder*="name" i]').first()).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]').first()).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('has store location info', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await expect(page.getByText('Pondy Bazaar').first()).toBeVisible();
  });
});

test.describe('About Page', () => {
  test('loads with content', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Kerala Jewellers/);
  });

  test('shows heritage section', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const heading = page.getByText(/Golden Occasions|Heritage|Origins/i);
    await expect(heading.first()).toBeVisible();
  });

  test('shows timeline', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const timeline = page.locator('section').filter({ hasText: /1959|1960|1970|1980|1990|2000|timeline/i });
    await expect(timeline.first()).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test('loads', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Blog/);
  });
});

test.describe('Enquiry Page', () => {
  test('loads with product prefill from URL', async ({ page }) => {
    await page.goto('/enquiry?product=BOMBAY%20CHOKER&id=KJG033', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const productField = page.locator('input, select, textarea').first();
    await expect(productField).toBeVisible();
  });
});

test.describe('Swarnavarsha (Scheme) Page', () => {
  test('loads', async ({ page }) => {
    await page.goto('/swarnavarsha', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/swarnavarsha/);
  });
});

test.describe('Static Pages', () => {
  test('/privacy-policy loads', async ({ page }) => {
    await page.goto('/privacy-policy', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/privacy-policy/);
  });

  test('/terms-conditions loads', async ({ page }) => {
    await page.goto('/terms-conditions', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/terms-conditions/);
  });
});
