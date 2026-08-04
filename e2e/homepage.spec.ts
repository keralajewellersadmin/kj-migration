import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  });

  test('loads with correct title and meta', async ({ page }) => {
    await expect(page).toHaveTitle(/Kerala Jewellers/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.+/);
  });

  test('hero section renders with slides', async ({ page }) => {
    const hero = page.locator('section, div').filter({ hasText: /Celebrate Every Precious Moment|Ethnic Excellence|Gleaming Gold|What A BrideWants/ }).first();
    await expect(hero).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      test.skip();
      return;
    }
    await expect(page.locator('a[href="/products"]').first()).toBeVisible();
    await expect(page.locator('a[href="/about"]').first()).toBeVisible();
    await expect(page.locator('a[href="/contact"]').first()).toBeVisible();
  });

  test('bestsellers section renders', async ({ page }) => {
    await expect(page.getByText('Our Bestsellers')).toBeVisible();
  });

  test('latest section renders', async ({ page }) => {
    await expect(page.getByText('Our Latest')).toBeVisible();
  });

  test('reviews section renders', async ({ page }) => {
    await expect(page.getByText('Customer Reviews')).toBeVisible();
  });

  test('blog section renders', async ({ page }) => {
    await expect(page.getByText(/Blog/i).first()).toBeVisible();
  });

  test('footer renders with branches', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Pondy Bazaar' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Purasawalkam' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Porur' })).toBeVisible();
  });

  test('footer has social links', async ({ page }) => {
    await expect(page.locator('a[href*="instagram.com"]').first()).toBeVisible();
    await expect(page.locator('a[href*="facebook.com"]').first()).toBeVisible();
    await expect(page.locator('a[href*="youtube.com"]').first()).toBeVisible();
  });

  test('no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForTimeout(2000);
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
    expect(critical).toHaveLength(0);
  });

  test('images load without broken Cloudinary URLs', async ({ page }) => {
    const brokenImages: string[] = [];
    page.on('response', res => {
      const url = res.url();
      if (url.includes('cloudinary.com') && !url.includes('/upload/w_') && !url.includes('/upload/q_') && res.status() >= 400) {
        brokenImages.push(url);
      }
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(brokenImages).toHaveLength(0);
  });
});
