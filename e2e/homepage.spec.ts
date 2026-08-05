import { test, expect } from '@playwright/test';

test.describe('Homepage — Hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('loads with correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Kerala Jewellers/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.+/);
  });

  test('hero section renders with active slide', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    const activeSlide = page.locator('[class*="slide"][class*="active"]').first();
    await expect(activeSlide).toBeVisible();
  });

  test('hero has heading text', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text!.length).toBeGreaterThan(5);
  });

  test('hero CTA links to products', async ({ page }) => {
    const cta = page.locator('a[class*="cta"]').first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/products/);
  });
});

test.describe('Homepage — Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('navigation links are present', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;
    if (isMobile) {
      await page.locator('button[aria-label="Toggle navigation menu"]').first().click();
      await page.locator('#mobileMenu').waitFor({ state: 'visible', timeout: 5000 });
      await expect(page.locator('#mobileMenu a[href="/about"]').first()).toBeVisible();
      await expect(page.locator('#mobileMenu a[href="/contact"]').first()).toBeVisible();
    } else {
      await expect(page.locator('a[href="/products"]').first()).toBeVisible();
      await expect(page.locator('a[href="/about"]').first()).toBeVisible();
      await expect(page.locator('a[href="/contact"]').first()).toBeVisible();
    }
  });

  test('categories section renders with collection links', async ({ page }) => {
    const viewCollectionLinks = page.locator('a').filter({ hasText: 'View Collection' });
    const count = await viewCollectionLinks.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('bestsellers section renders with product cards', async ({ page }) => {
    await expect(page.getByText('Our Bestsellers')).toBeVisible();
    const viewBtns = page.locator('a[href^="/product/"]');
    expect(await viewBtns.count()).toBeGreaterThan(0);
  });

  test('latest section renders', async ({ page }) => {
    await expect(page.getByText('Our Latest')).toBeVisible();
  });

  test('reviews section renders with Swiper carousel', async ({ page }) => {
    await expect(page.getByText('Customer Reviews')).toBeVisible();
    const dots = page.locator('button[aria-label^="Go to review"]');
    expect(await dots.count()).toBeGreaterThanOrEqual(1);
  });

  test('footer renders with branches, social links, and support links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    await expect(footer.getByRole('heading', { name: 'Pondy Bazaar' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Purasawalkam' })).toBeVisible();
    await expect(footer.getByRole('heading', { name: 'Porur' })).toBeVisible();

    await expect(footer.locator('a[aria-label*="Instagram"]').first()).toBeVisible();
    await expect(footer.locator('a[aria-label*="Facebook"]').first()).toBeVisible();
    await expect(footer.locator('a[aria-label*="YouTube"]').first()).toBeVisible();

    await expect(footer.locator('a[href="/contact"]').first()).toBeVisible();
    await expect(footer.locator('a[href="/privacy-policy"]').first()).toBeVisible();
    await expect(footer.locator('a[href="/blog"]').first()).toBeVisible();
    await expect(footer.locator('a[href="/terms-conditions"]').first()).toBeVisible();
  });

  test('footer has copyright text', async ({ page }) => {
    await expect(page.locator('footer').getByText(/Kerala Jewellers.*All Rights Reserved/)).toBeVisible();
  });

  test('no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
    expect(critical).toHaveLength(0);
  });

  test('images load without broken Cloudinary URLs', async ({ page }) => {
    const brokenImages: string[] = [];
    page.on('response', res => {
      const url = res.url();
      if (url.includes('cloudinary.com') && !url.includes('/upload/w_') && !url.includes('/upload/q_') && !url.includes('66a9d') && res.status() >= 400) {
        brokenImages.push(url);
      }
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(brokenImages).toHaveLength(0);
  });
});
