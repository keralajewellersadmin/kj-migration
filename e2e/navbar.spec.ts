import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
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

  test('Gold dropdown shows categories', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    const goldDropdown = page.locator('[data-kj-megamenu="gold"]');
    const navItem = goldDropdown.locator('..');
    await navItem.hover();
    await expect(goldDropdown).toBeVisible();
    await expect(goldDropdown.getByText('Bangles')).toBeVisible();
    await expect(goldDropdown.getByText('Necklace')).toBeVisible();
    await expect(goldDropdown.getByText('Rings', { exact: true })).toBeVisible();
    await expect(goldDropdown.getByText('Earrings')).toBeVisible();
  });

  test('Silver dropdown shows categories', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    const silverDropdown = page.locator('[data-kj-megamenu="silver"]');
    const navItem = silverDropdown.locator('..');
    await navItem.hover();
    await expect(silverDropdown).toBeVisible();
    await expect(silverDropdown.getByText('Bracelets')).toBeVisible();
    await expect(silverDropdown.getByText('Idols')).toBeVisible();
  });

  test('Diamond dropdown shows categories', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    const diamondDropdown = page.locator('[data-kj-megamenu="diamond"]');
    const navItem = diamondDropdown.locator('..');
    await navItem.hover();
    await expect(diamondDropdown).toBeVisible();
    await expect(diamondDropdown.getByText('Necklace')).toBeVisible();
    await expect(diamondDropdown.getByText('Rings', { exact: true })).toBeVisible();
  });

  test('navigates to /products via Gold link', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    const goldDropdown = page.locator('[data-kj-megamenu="gold"]');
    const navItem = goldDropdown.locator('..');
    await navItem.locator('a[href="/products"]').first().click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('navigates to /about', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    await page.locator('a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('navigates to /contact', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    await page.locator('a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('mobile menu toggle button exists', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      test.skip();
      return;
    }
    const toggle = page.locator('button[aria-label="Toggle navigation menu"]').first();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
