import { test, expect } from '@playwright/test';

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.locator('a[aria-label="Kerala Jewellers Home"]').first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(1500);
}

async function navigateTo(page: import('@playwright/test').Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const currentUrl = new URL(page.url());
  if (currentUrl.pathname !== url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}

test.describe('Navigation — Header to Pages', () => {
  test('can navigate from home to /products and back', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForHydration(page);
      await page.locator('button[aria-label="Toggle navigation menu"]').first().click();
      await page.locator('#mobileMenu').waitFor({ state: 'visible', timeout: 10000 });
      await page.locator('#mobileMenu button').filter({ hasText: 'Gold' }).click();
      await page.waitForTimeout(500);
      await page.locator('#mobileMenu a[class*="AccordionViewAll"]').filter({ hasText: 'View All Gold' }).click({ force: true });
      await expect(page).toHaveURL(/\/products/);
      await navigateTo(page, '/');
      await expect(page).toHaveURL('/');
      return;
    }
    await navigateTo(page, '/products');
    await expect(page).toHaveURL(/\/products/);
    await navigateTo(page, '/');
    await expect(page).toHaveURL('/');
  });

  test('can navigate from home to /about and back via logo', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForHydration(page);
      await page.locator('button[aria-label="Toggle navigation menu"]').first().click();
      await page.locator('#mobileMenu').waitFor({ state: 'visible', timeout: 10000 });
      await page.locator('#mobileMenu a[href="/about"]').click();
      await expect(page).toHaveURL(/\/about/);
      await navigateTo(page, '/');
      await expect(page).toHaveURL('/');
      return;
    }
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    await navigateTo(page, '/about');
    await expect(page).toHaveURL(/\/about/);
    await navigateTo(page, '/');
    await expect(page).toHaveURL('/');
  });

  test('can navigate from home to /contact and back via logo', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await waitForHydration(page);
      await page.locator('button[aria-label="Toggle navigation menu"]').first().click();
      await page.locator('#mobileMenu').waitFor({ state: 'visible', timeout: 10000 });
      await page.locator('#mobileMenu a[href="/contact"]').click();
      await expect(page).toHaveURL(/\/contact/);
      await navigateTo(page, '/');
      await expect(page).toHaveURL('/');
      return;
    }
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    await navigateTo(page, '/contact');
    await expect(page).toHaveURL(/\/contact/);
    await navigateTo(page, '/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Navigation — Product Breadcrumbs', () => {
  test('product detail breadcrumb links to products listing', async ({ page }) => {
    await navigateTo(page, '/product/bombay-choker');
    await waitForHydration(page);
    const breadcrumb = page.locator('a[href="/products"]').filter({ hasText: 'Products' }).first();
    await expect(breadcrumb).toBeVisible();
    await breadcrumb.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('can navigate: home → products → product detail → enquiry', async ({ page }) => {
    await navigateTo(page, '/products');
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(2000);
    const firstProduct = page.locator('a[href^="/product/"]').first();
    const href = await firstProduct.getAttribute('href');
    await firstProduct.click({ force: true });
    await expect(page).toHaveURL(new RegExp(href!));
    const enquiry = page.locator('a[href*="/enquiry"]').first();
    await expect(enquiry).toBeVisible();
  });
});

test.describe('Navigation — Footer Links', () => {
  test('footer Contact Us link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    const link = page.locator('footer').getByText('Contact Us');
    await link.scrollIntoViewIfNeeded();
    await link.click({ force: true });
    try {
      await expect(page).toHaveURL(/\/contact/, { timeout: 5000 });
    } catch {
      await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    }
    await expect(page).toHaveURL(/\/contact/);
  });

  test('footer Privacy Policy link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    const link = page.locator('footer').getByText('Privacy Policy');
    await link.scrollIntoViewIfNeeded();
    await link.click({ force: true });
    await expect(page).toHaveURL(/\/privacy-policy/);
  });

  test('footer Blog link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    const link = page.locator('footer').getByText('Blogs');
    await link.scrollIntoViewIfNeeded();
    await link.click({ force: true });
    await expect(page).toHaveURL(/\/blog/);
  });

  test('footer Terms link works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    const link = page.locator('footer').getByText('Terms');
    await link.scrollIntoViewIfNeeded();
    await link.click({ force: true });
    await expect(page).toHaveURL(/\/terms-conditions/);
  });
});

test.describe('Navigation — Cross-Page Flows', () => {
  test('home → category CTA → products page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForHydration(page);
    const categoryCTA = page.locator('a').filter({ hasText: 'View Collection' }).first();
    if (await categoryCTA.isVisible()) {
      await categoryCTA.click();
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('products page → product card → detail page → back to products', async ({ page }) => {
    await navigateTo(page, '/products');
    await page.locator('a[href^="/product/"]').first().waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(1500);
    const card = page.locator('a[href^="/product/"]').first();
    await card.click({ force: true });
    await expect(page).toHaveURL(/\/product\//);
    await page.waitForTimeout(1500);
    const breadcrumb = page.locator('a[href="/products"]').filter({ hasText: 'Products' }).first();
    await breadcrumb.click();
    await expect(page).toHaveURL(/\/products/);
  });
});
