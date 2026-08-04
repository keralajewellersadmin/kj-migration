import { test, expect } from '@playwright/test';

test.describe('Navigation — Header to Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('can navigate from home to /products and back', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products/);
    const logo = page.locator('a[aria-label="Kerala Jewellers Home"]').first();
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('can navigate from home to /about and back via logo', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    await page.locator('a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about/);
    await page.locator('a[aria-label="Kerala Jewellers Home"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('can navigate from home to /contact and back via logo', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    await page.locator('a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/);
    await page.locator('a[aria-label="Kerala Jewellers Home"]').first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Navigation — Product Breadcrumbs', () => {
  test('product detail breadcrumb links to products listing', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const breadcrumb = page.locator('a[href="/products"]').filter({ hasText: 'Products' }).first();
    await expect(breadcrumb).toBeVisible();
    await breadcrumb.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('can navigate: home → products → product detail → enquiry', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const firstProduct = page.locator('a[href^="/product/"]').first();
    const href = await firstProduct.getAttribute('href');
    await firstProduct.click();
    await expect(page).toHaveURL(new RegExp(href!));
    const enquiry = page.locator('a[href*="/enquiry"]').first();
    await expect(enquiry).toBeVisible();
  });
});

test.describe('Navigation — Footer Links', () => {
  test('footer Contact Us link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('footer').getByText('Contact Us').click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('footer Privacy Policy link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('footer').getByText('Privacy Policy').click();
    await expect(page).toHaveURL(/\/privacy-policy/);
  });

  test('footer Blog link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('footer').getByText('Blogs').click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('footer Terms link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('footer').getByText('Terms').click();
    await expect(page).toHaveURL(/\/terms-conditions/);
  });
});

test.describe('Navigation — Cross-Page Flows', () => {
  test('home → category CTA → products page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const categoryCTA = page.locator('a').filter({ hasText: 'View Collection' }).first();
    if (await categoryCTA.isVisible()) {
      await categoryCTA.click();
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('products page → product card → detail page → back to products', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const card = page.locator('a[href^="/product/"]').first();
    await card.click();
    await page.waitForTimeout(1000);
    const breadcrumb = page.locator('a[href="/products"]').filter({ hasText: 'Products' }).first();
    await breadcrumb.click();
    await expect(page).toHaveURL(/\/products/);
  });
});
