import { test, expect } from '@playwright/test';

test.describe('Navbar — Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('logo links to home', async ({ page }) => {
    const viewport = page.viewportSize();
    const logos = page.locator('a[aria-label="Kerala Jewellers Home"]');
    const logo = viewport && viewport.width < 768 ? logos.last() : logos.first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('rate strip exists in DOM', async ({ page }) => {
    const rateStrip = page.locator('[data-kj-ratestrip]').first();
    await expect(rateStrip).toBeAttached();
  });

  test('Gold dropdown shows categories on hover', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    const goldDropdown = page.locator('[data-kj-megamenu="gold"]');
    await goldDropdown.locator('..').hover();
    await expect(goldDropdown).toBeVisible();
    await expect(goldDropdown.getByText('Bangles')).toBeVisible();
    await expect(goldDropdown.getByText('Necklace')).toBeVisible();
    await expect(goldDropdown.getByText('Rings', { exact: true })).toBeVisible();
    await expect(goldDropdown.getByText('Earrings')).toBeVisible();
  });

  test('Silver dropdown shows categories on hover', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    const silverDropdown = page.locator('[data-kj-megamenu="silver"]');
    await silverDropdown.locator('..').hover();
    await expect(silverDropdown).toBeVisible();
    await expect(silverDropdown.getByText('Bracelets')).toBeVisible();
    await expect(silverDropdown.getByText('Idols')).toBeVisible();
  });

  test('Diamond dropdown shows categories on hover', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    const diamondDropdown = page.locator('[data-kj-megamenu="diamond"]');
    await diamondDropdown.locator('..').hover();
    await expect(diamondDropdown).toBeVisible();
    await expect(diamondDropdown.getByText('Necklace')).toBeVisible();
    await expect(diamondDropdown.getByText('Rings', { exact: true })).toBeVisible();
  });

  test('navigates to /products via Gold link', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    const goldDropdown = page.locator('[data-kj-megamenu="gold"]');
    await goldDropdown.locator('..').locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('navigates to /about', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    await page.locator('a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('navigates to /contact', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) { test.skip(); return; }
    await page.locator('a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

test.describe('Navbar — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile logo links to home', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const logos = page.locator('a[aria-label="Kerala Jewellers Home"]');
    await expect(logos.last()).toBeVisible();
    await expect(logos.last()).toHaveAttribute('href', '/');
  });

  test('mobile menu toggle button exists with aria-expanded=false', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const toggle = page.locator('button[aria-label="Toggle navigation menu"]').first();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
