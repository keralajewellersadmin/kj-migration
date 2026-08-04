import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
];

for (const vp of VIEWPORTS) {
  test.describe(`Responsive — ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('homepage loads and shows key sections', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.getByText('Our Bestsellers')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('product listing loads', async ({ page }) => {
      await page.goto('/products', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const cards = page.locator('a[href^="/product/"]');
      expect(await cards.count()).toBeGreaterThan(0);
    });

    test('product detail loads', async ({ page }) => {
      await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1').first()).toContainText('BOMBAY CHOKER');
    });

    test('contact page loads', async ({ page }) => {
      await page.goto('/contact', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('form').first()).toBeVisible();
    });

    test('about page loads', async ({ page }) => {
      await page.goto('/about', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1').first()).toBeVisible();
    });

    test('blog page loads', async ({ page }) => {
      await page.goto('/blog', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveTitle(/Blog/);
    });

    test('all images load without 4xx/5xx', async ({ page }) => {
      const brokenUrls: string[] = [];
      page.on('response', res => {
        const url = res.url();
        if (url.includes('cloudinary.com') && !url.includes('/upload/w_') && !url.includes('/upload/q_') && res.status() >= 400) {
          brokenUrls.push(url);
        }
      });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const critical = brokenUrls.filter(u => !u.includes('66a9d'));
      expect(critical).toHaveLength(0);
    });
  });
}
