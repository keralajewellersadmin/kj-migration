import { test, expect } from '@playwright/test';

test.describe('Product Listing Pages', () => {
  test('/products loads with hero section', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Products|Jewellery/);
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('/products shows product cards', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/product/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('/products/gold loads', async ({ page }) => {
    await page.goto('/products/gold', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products\/gold/);
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/product/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('/products/silver loads', async ({ page }) => {
    await page.goto('/products/silver', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products\/silver/);
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/product/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('/products/diamond loads', async ({ page }) => {
    await page.goto('/products/diamond', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products\/diamond/);
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/product/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('product images load (no broken)', async ({ page }) => {
    const brokenUrls: string[] = [];
    page.on('response', res => {
      const url = res.url();
      if (url.includes('cloudinary.com') && !url.includes('/upload/w_') && !url.includes('/upload/q_') && res.status() >= 400) {
        brokenUrls.push(url);
      }
    });
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(brokenUrls).toHaveLength(0);
  });
});

test.describe('Product Detail Page', () => {
  test('loads with image and details', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('BOMBAY CHOKER');
    const img = page.locator('img[alt="BOMBAY CHOKER"]');
    await expect(img).toBeVisible();
  });

  test('shows product info (name, purity, weight, code)', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Product Name:')).toBeVisible();
    await expect(page.getByText('Product Purity:')).toBeVisible();
    await expect(page.getByText('Weight:')).toBeVisible();
    await expect(page.getByText('Product Code:')).toBeVisible();
  });

  test('enquiry button links correctly', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const btn = page.locator('a[href*="/enquiry"]').first();
    await expect(btn).toBeVisible();
    const href = await btn.getAttribute('href');
    expect(href).toContain('/enquiry');
    expect(href).toContain('KJG033');
  });

  test('call button exists in DOM (hidden on desktop)', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const btn = page.locator('a[href^="tel:"]').first();
    await expect(btn).toBeAttached();
  });

  test('related products section shows', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const related = page.getByText('Similar Items');
    await expect(related).toBeVisible();
    const cards = page.locator('a[href^="/product/"]');
    expect(await cards.count()).toBeGreaterThan(1);
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const breadcrumb = page.locator('a[href="/products"]').filter({ hasText: 'Products' }).first();
    await expect(breadcrumb).toBeVisible();
  });

  test('og:image meta exists', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const ogImage = page.locator('meta[property="og:image"]');
    const content = await ogImage.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });
});
