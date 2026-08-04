import { test, expect } from '@playwright/test';

test.describe('Enquiry Page — Form Structure', () => {
  test('loads with correct heading', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Let us help you choose the right jewel.')).toBeVisible();
  });

  test('has all form fields', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="customerName"]')).toBeVisible();
    await expect(page.locator('input[name="mobile"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="city"]')).toBeVisible();
    await expect(page.locator('select[name="preferredTime"]')).toBeVisible();
    await expect(page.locator('input[name="productName"]')).toBeVisible();
    await expect(page.locator('input[name="productId"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('product name and ID fields are read-only', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    const productName = page.locator('input[name="productName"]');
    const productId = page.locator('input[name="productId"]');
    await expect(productName).toHaveAttribute('readonly', '');
    await expect(productId).toHaveAttribute('readonly', '');
  });

  test('required fields enforce validation', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    const submit = page.locator('button[type="submit"]').first();
    await submit.click();
    await page.waitForTimeout(500);
    const nameInput = page.locator('input[name="customerName"]');
    const isValid = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('preferred time dropdown exists', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
  });
});

test.describe('Enquiry Page — URL Prefill', () => {
  test('prefills product name from URL param', async ({ page }) => {
    await page.goto('/enquiry?product=BOMBAY%20CHOKER&id=KJG033', { waitUntil: 'domcontentloaded' });
    const productName = page.locator('input[name="productName"]');
    await expect(productName).toHaveValue('BOMBAY CHOKER');
  });

  test('prefills product ID from URL param', async ({ page }) => {
    await page.goto('/enquiry?product=BOMBAY%20CHOKER&id=KJG033', { waitUntil: 'domcontentloaded' });
    const productId = page.locator('input[name="productId"]');
    await expect(productId).toHaveValue('KJG033');
  });
});

test.describe('Enquiry Page — Actions', () => {
  test('WhatsApp button exists', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    const whatsapp = page.locator('button').filter({ hasText: 'WhatsApp Enquiry' });
    await expect(whatsapp).toBeVisible();
  });

  test('phone link for urgent support', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    const phone = page.locator('a[href^="tel:"]').first();
    await expect(phone).toBeVisible();
  });

  test('logo links back to home', async ({ page }) => {
    await page.goto('/enquiry', { waitUntil: 'domcontentloaded' });
    const logo = page.locator('a[aria-label*="home"], a[aria-label*="Home"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
  });
});
