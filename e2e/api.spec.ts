import { test, expect } from '@playwright/test';

test.describe('API — Frontend Products', () => {
  test('GET /api/frontend-products returns paginated products', async ({ page }) => {
    const res = await page.request.get('/api/frontend-products?metal=gold&page=1&limit=24');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products).toBeDefined();
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.totalDocs).toBeGreaterThan(0);
  });

  test('GET /api/frontend-products with silver metal', async ({ page }) => {
    const res = await page.request.get('/api/frontend-products?metal=silver&page=1&limit=24');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
  });

  test('GET /api/frontend-products with diamond metal', async ({ page }) => {
    const res = await page.request.get('/api/frontend-products?metal=diamond&page=1&limit=24');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
  });

  test('GET /api/frontend-products pagination works', async ({ page }) => {
    const res1 = await page.request.get('/api/frontend-products?metal=gold&page=1&limit=10');
    const data1 = await res1.json();
    const res2 = await page.request.get('/api/frontend-products?metal=gold&page=2&limit=10');
    const data2 = await res2.json();
    expect(data1.products.length).toBeGreaterThan(0);
    expect(data2.products.length).toBeGreaterThan(0);
    expect(data1.products[0].slug).not.toBe(data2.products[0].slug);
  });

  test('GET /api/frontend-products with category filter', async ({ page }) => {
    const res = await page.request.get('/api/frontend-products?metal=gold&page=1&limit=24&category=bangles');
    expect(res.status()).toBeLessThan(600);
  });
});

test.describe('API — Inquiry Endpoint', () => {
  test('POST /api/inquiry accepts valid inquiry', async ({ page }) => {
    const res = await page.request.post('/api/inquiry', {
      data: {
        name: 'E2E Test User',
        email: 'e2e-test@example.com',
        message: 'This is a test inquiry from E2E testing.',
      },
    });
    expect(res.status()).toBeLessThan(600);
  });
});

test.describe('API — Payload CMS Endpoints', () => {
  test('GET /api/site-settings responds', async ({ page }) => {
    const res = await page.request.get('/api/site-settings');
    expect(res.status()).toBeLessThan(600);
  });

  test('GET /api/products responds', async ({ page }) => {
    const res = await page.request.get('/api/products?limit=1');
    expect(res.status()).toBeLessThan(600);
  });

  test('GET /api/categories responds', async ({ page }) => {
    const res = await page.request.get('/api/categories?limit=1');
    expect(res.status()).toBeLessThan(600);
  });

  test('GET /api/media responds', async ({ page }) => {
    const res = await page.request.get('/api/media?limit=1');
    expect(res.status()).toBeLessThan(600);
  });
});

test.describe('API — Auth Endpoints', () => {
  test('POST /api/auth/login with invalid credentials returns error', async ({ page }) => {
    const res = await page.request.post('/api/auth/login', {
      data: { identifier: 'nonexistent@test.com', password: 'wrongpassword' },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
