import { test, expect } from '@playwright/test';

test.describe('Error States — 404 Pages', () => {
  test('non-existent route returns 404', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'domcontentloaded' });
    expect(res!.status()).toBe(404);
  });

  test('non-existent product slug returns 404', async ({ page }) => {
    const res = await page.goto('/product/this-product-does-not-exist', { waitUntil: 'domcontentloaded' });
    expect(res!.status()).toBe(404);
  });

  test('non-existent blog slug returns 404', async ({ page }) => {
    const res = await page.goto('/blog/this-post-does-not-exist', { waitUntil: 'domcontentloaded' });
    expect(res!.status()).toBe(404);
  });

  test('invalid metal returns 404', async ({ page }) => {
    const res = await page.goto('/products/copper', { waitUntil: 'domcontentloaded' });
    expect(res!.status()).toBe(404);
  });
});

test.describe('Error States — API', () => {
  test('invalid API route returns error', async ({ page }) => {
    const res = await page.request.get('/api/nonexistent-endpoint');
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
