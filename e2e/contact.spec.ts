import { test, expect } from '@playwright/test';

test.describe('Contact Page — Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);
  });

  test('has hero section with heading', async ({ page }) => {
    await expect(page.getByText('Contact Kerala Jewellers')).toBeVisible();
  });

  test('form has name, email, and message fields', async ({ page }) => {
    await expect(page.locator('input[name="name"]').first()).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('textarea[name="message"]').first()).toBeVisible();
  });

  test('form has submit button', async ({ page }) => {
    const submit = page.locator('button[type="submit"]').first();
    await expect(submit).toBeVisible();
    await expect(submit).toHaveText(/Submit/);
  });

  test('form validation prevents empty submission', async ({ page }) => {
    const submit = page.locator('button[type="submit"]').first();
    await submit.click();
    await page.waitForTimeout(500);
    const nameInput = page.locator('input[name="name"]').first();
    const isValid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('form can be filled and submitted', async ({ page }) => {
    await page.locator('input[name="name"]').first().fill('Test User');
    await page.locator('input[name="email"], input[type="email"]').first().fill('test@example.com');
    await page.locator('textarea[name="message"]').first().fill('Test inquiry message for E2E testing');
    const submit = page.locator('button[type="submit"]').first();
    await expect(submit).toBeEnabled();
    await submit.click();
    await page.waitForTimeout(3000);
  });
});

test.describe('Contact Page — Branches', () => {
  test('shows all three branches', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await expect(page.getByText('Pondy Bazaar').first()).toBeVisible();
    await expect(page.getByText('Purasawalkam').first()).toBeVisible();
    await expect(page.getByText('Porur').first()).toBeVisible();
  });

  test('branch cards have map iframes', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const iframes = page.locator('iframe');
    expect(await iframes.count()).toBeGreaterThanOrEqual(3);
  });

  test('branch cards have Get Directions links', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const directions = page.locator('a').filter({ hasText: 'Get Directions' });
    expect(await directions.count()).toBeGreaterThanOrEqual(3);
  });

  test('branch cards have phone links', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const phoneLinks = page.locator('a[href^="tel:"]');
    expect(await phoneLinks.count()).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Contact Page — Social & Info', () => {
  test('has social media links', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[aria-label="Instagram"]').first()).toBeVisible();
    await expect(page.locator('a[aria-label="Facebook"]').first()).toBeVisible();
    await expect(page.locator('a[aria-label="YouTube"]').first()).toBeVisible();
  });

  test('Get In Touch section is visible', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Get In Touch')).toBeVisible();
  });
});
