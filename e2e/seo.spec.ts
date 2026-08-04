import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', titlePattern: /Kerala Jewellers/ },
  { path: '/products', titlePattern: /Products|Jewellery/ },
  { path: '/products/gold', titlePattern: /Gold|Products/ },
  { path: '/products/silver', titlePattern: /Silver|Products/ },
  { path: '/products/diamond', titlePattern: /Diamond|Products/ },
  { path: '/about', titlePattern: /Kerala Jewellers/ },
  { path: '/contact', titlePattern: /Contact/ },
  { path: '/blog', titlePattern: /Blog/ },
  { path: '/privacy-policy', titlePattern: /Privacy/ },
  { path: '/terms-conditions', titlePattern: /Terms/ },
];

test.describe('SEO — lang attribute', () => {
  for (const p of PAGES) {
    test(`${p.path} has lang="en"`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en');
    });
  }
});

test.describe('SEO — Page Titles', () => {
  for (const p of PAGES) {
    test(`${p.path} has correct title pattern`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveTitle(p.titlePattern);
    });
  }
});

test.describe('SEO — Meta Descriptions', () => {
  for (const p of PAGES) {
    test(`${p.path} has meta description`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      const desc = page.locator('meta[name="description"]');
      await expect(desc).toHaveAttribute('content', /.{20,}/);
    });
  }
});

const OG_PAGES = [
  { path: '/', label: '/' },
  { path: '/products', label: '/products' },
  { path: '/products/gold', label: '/products/gold' },
  { path: '/products/silver', label: '/products/silver' },
  { path: '/products/diamond', label: '/products/diamond' },
  { path: '/contact', label: '/contact' },
  { path: '/blog', label: '/blog' },
  { path: '/privacy-policy', label: '/privacy-policy' },
  { path: '/terms-conditions', label: '/terms-conditions' },
];

test.describe('SEO — OpenGraph Tags', () => {
  for (const p of OG_PAGES) {
    test(`${p.label} has og:title`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'domcontentloaded' });
      const ogTitle = page.locator('meta[property="og:title"]');
      const content = await ogTitle.getAttribute('content');
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(5);
    });
  }
});

test.describe('SEO — Product Detail OG Tags', () => {
  test('product page has og:image', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const ogImage = page.locator('meta[property="og:image"]');
    const content = await ogImage.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('product page has og:title', async ({ page }) => {
    await page.goto('/product/bombay-choker', { waitUntil: 'domcontentloaded' });
    const ogTitle = page.locator('meta[property="og:title"]');
    const content = await ogTitle.getAttribute('content');
    expect(content).toContain('BOMBAY CHOKER');
  });
});

test.describe('SEO — Admin Panel Blocking', () => {
  test('admin has noindex/nofollow meta', async ({ page }) => {
    await page.goto('/kj-portal-0d7cfad1', { waitUntil: 'domcontentloaded' });
    const robots = page.locator('meta[name="robots"]');
    const content = await robots.getAttribute('content');
    expect(content).toMatch(/noindex|nofollow/);
  });
});
