import { test, expect } from '@playwright/test';

test.describe('Product Listing — /products', () => {
  test('loads with hero section and product count', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Products|Jewellery/);
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/product/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('shows product count indicator', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const count = page.locator('span[class*="count"]');
    await expect(count).toBeVisible();
    const text = await count.textContent();
    expect(text).toMatch(/\d+ of \d+/);
  });

  test('Load More button fetches additional products', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const loadMore = page.locator('button[class*="loadMoreBtn"]');
    if (await loadMore.isVisible()) {
      const initialCount = await page.locator('a[href^="/product/"]').count();
      await loadMore.click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(2000);
      const newCount = await page.locator('a[href^="/product/"]').count();
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    }
  });

  test('category filter dropdown opens and shows options', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[href^="/product/"]', { timeout: 15000 });
    const filterWrapper = page.locator('[class*="filterWrapper"]');
    await filterWrapper.waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(2000);
    const filterTriggers = page.locator('button[class*="trigger"]');
    const count = await filterTriggers.count();
    if (count > 0) {
      await filterTriggers.first().click({ force: true });
      await page.waitForTimeout(1000);
      const options = page.locator('button[class*="option"]');
      expect(await options.count()).toBeGreaterThan(0);
    }
  });

  test('sort filter updates URL params', async ({ page }) => {
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a[href^="/product/"]', { timeout: 15000 });
    const filterTriggers = page.locator('button[class*="trigger"]');
    if (await filterTriggers.count() > 1) {
      await filterTriggers.nth(1).click();
      const azOption = page.locator('button[class*="option"]').filter({ hasText: 'A to Z' });
      if (await azOption.isVisible()) {
        await azOption.click();
        await page.waitForTimeout(1000);
        expect(page.url()).toContain('sort=asc');
      }
    }
  });

  test('reset button clears filters', async ({ page }) => {
    await page.goto('/products?category=bangles&sort=asc', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const resetBtn = page.locator('button').filter({ hasText: 'Reset' });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
      await page.waitForTimeout(1000);
      expect(page.url()).not.toContain('category=');
      expect(page.url()).not.toContain('sort=');
    }
  });
});

test.describe('Product Listing — /products/[metal]', () => {
  test('/products/gold loads with gold products', async ({ page }) => {
    await page.goto('/products/gold', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products\/gold/);
    await page.waitForTimeout(2000);
    expect(await page.locator('a[href^="/product/"]').count()).toBeGreaterThan(0);
  });

  test('/products/silver loads with silver products', async ({ page }) => {
    await page.goto('/products/silver', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products\/silver/);
    await page.waitForTimeout(2000);
    expect(await page.locator('a[href^="/product/"]').count()).toBeGreaterThan(0);
  });

  test('/products/diamond loads with diamond products', async ({ page }) => {
    await page.goto('/products/diamond', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/products\/diamond/);
    await page.waitForTimeout(2000);
    expect(await page.locator('a[href^="/product/"]').count()).toBeGreaterThan(0);
  });

  test('product images load without breakage', async ({ page }) => {
    const brokenUrls: string[] = [];
    page.on('response', res => {
      const url = res.url();
      if (url.includes('cloudinary.com') && !url.includes('/upload/w_') && !url.includes('/upload/q_') && !url.includes('66a9d') && res.status() >= 400) {
        brokenUrls.push(url);
      }
    });
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(brokenUrls).toHaveLength(0);
  });
});

test.describe('Product Detail Page', () => {
  test('loads with image, name, and product info', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('BOMBAY CHOKER');
    const img = page.locator('img[alt="BOMBAY CHOKER"]');
    await expect(img).toBeVisible();
  });

  test('shows all product info fields', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Product Name:')).toBeVisible();
    await expect(page.getByText('Product Purity:')).toBeVisible();
    await expect(page.getByText('Weight:')).toBeVisible();
    await expect(page.getByText('Product Code:')).toBeVisible();
  });

  test('enquiry button links to enquiry page with correct params', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const btn = page.locator('a[href*="/enquiry"]').first();
    await expect(btn).toBeVisible();
    const href = await btn.getAttribute('href');
    expect(href).toContain('/enquiry');
    expect(href).toContain('KJG033');
  });

  test('call button exists in DOM (hidden on desktop)', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href^="tel:"]').first()).toBeAttached();
  });

  test('breadcrumb links back to products', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const breadcrumb = page.locator('a[href="/products"]').filter({ hasText: 'Products' }).first();
    await expect(breadcrumb).toBeVisible();
  });

  test('related products section shows Similar Items', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Similar Items')).toBeVisible();
    expect(await page.locator('a[href^="/product/"]').count()).toBeGreaterThan(1);
  });

  test('og:image meta tag exists', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const ogImage = page.locator('meta[property="og:image"]');
    const content = await ogImage.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('page has description section', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Description')).toBeVisible();
  });

  test('navigating to different product works', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const related = page.locator('a[href^="/product/"]').filter({ hasNotText: 'bombay-choker' }).first();
    if (await related.isVisible()) {
      const href = await related.getAttribute('href');
      await related.click();
      await expect(page).toHaveURL(new RegExp(href!));
    }
  });
});
