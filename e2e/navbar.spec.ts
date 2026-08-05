import { test, expect } from '@playwright/test';

async function openMobileMenu(page: import('@playwright/test').Page) {
  await page.locator('button[aria-label="Toggle navigation menu"]').first().click();
  await page.locator('#mobileMenu').waitFor({ state: 'visible', timeout: 10000 });
}

test.describe('Navbar — Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('a[aria-label="Kerala Jewellers Home"]').first().waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(1000);
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
    if (viewport && viewport.width < 768) {
      await openMobileMenu(page);
      await page.locator('#mobileMenu button').filter({ hasText: 'Gold' }).click();
      await page.waitForTimeout(500);
      const goldContent = page.locator('#mobileMenu .mobileAccordionLink, #mobileMenu a[class*="AccordionLink"]');
      await expect(goldContent.filter({ hasText: 'Bangles' }).first()).toBeVisible();
      await expect(goldContent.filter({ hasText: 'Necklace' }).first()).toBeVisible();
      return;
    }
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
    if (viewport && viewport.width < 768) {
      await openMobileMenu(page);
      await page.locator('#mobileMenu button').filter({ hasText: 'Silver' }).click();
      await page.waitForTimeout(500);
      const silverContent = page.locator('#mobileMenu .mobileAccordionLink, #mobileMenu a[class*="AccordionLink"]');
      await expect(silverContent.filter({ hasText: 'Bracelets' }).first()).toBeVisible();
      await expect(silverContent.filter({ hasText: 'Idols' }).first()).toBeVisible();
      return;
    }
    const silverDropdown = page.locator('[data-kj-megamenu="silver"]');
    await silverDropdown.locator('..').hover();
    await expect(silverDropdown).toBeVisible();
    await expect(silverDropdown.getByText('Bracelets')).toBeVisible();
    await expect(silverDropdown.getByText('Idols')).toBeVisible();
  });

  test('Diamond dropdown shows categories on hover', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await openMobileMenu(page);
      await page.locator('#mobileMenu button').filter({ hasText: 'Diamond' }).click();
      await page.waitForTimeout(500);
      const diamondContent = page.locator('#mobileMenu .mobileAccordionLink, #mobileMenu a[class*="AccordionLink"]');
      await expect(diamondContent.filter({ hasText: 'Necklace' }).first()).toBeVisible();
      await expect(diamondContent.filter({ hasText: 'Rings' }).first()).toBeVisible();
      return;
    }
    const diamondDropdown = page.locator('[data-kj-megamenu="diamond"]');
    await diamondDropdown.locator('..').hover();
    await expect(diamondDropdown).toBeVisible();
    await expect(diamondDropdown.getByText('Necklace')).toBeVisible();
    await expect(diamondDropdown.getByText('Rings', { exact: true })).toBeVisible();
  });

  test('navigates to /products via Gold link', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await openMobileMenu(page);
      await page.locator('#mobileMenu button').filter({ hasText: 'Gold' }).click();
      await page.waitForTimeout(500);
      await page.locator('#mobileMenu a[class*="AccordionViewAll"]').filter({ hasText: 'View All Gold' }).click({ force: true });
      await expect(page).toHaveURL(/\/products/);
      return;
    }
    await page.locator('a[href="/products"]').first().click({ force: true });
    await expect(page).toHaveURL(/\/products/);
  });

  test('navigates to /about', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await openMobileMenu(page);
      await page.locator('#mobileMenu a[href="/about"]').click();
      await expect(page).toHaveURL(/\/about/);
      return;
    }
    await page.locator('a[href="/about"]').first().click();
    await expect(page).toHaveURL(/\/about/, { timeout: 15000 });
  });

  test('navigates to /contact', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await openMobileMenu(page);
      await page.locator('#mobileMenu a[href="/contact"]').click();
      await expect(page).toHaveURL(/\/contact/, { timeout: 15000 });
      return;
    }
    await page.locator('a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/, { timeout: 15000 });
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
