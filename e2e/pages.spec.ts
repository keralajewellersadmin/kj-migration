import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('loads with hero heading', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1').first()).toContainText('About Us');
  });

  test('shows Golden Occasions section', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const heading = page.getByText(/Golden Occasions|Heritage|Origins/i);
    await expect(heading.first()).toBeVisible();
  });

  test('shows timeline with years', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const timeline = page.locator('section').filter({ hasText: /1959|1960|1970|1980|1990|2000|timeline/i });
    await expect(timeline.first()).toBeVisible();
  });

  test('shows Our Ventures section', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Ventures|Aishwarya/i).first()).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test('loads with heading', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Blog/);
  });

  test('shows Wedding Season hero', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Wedding Season is here')).toBeVisible();
  });

  test('shows Our Blog heading', async ({ page }) => {
    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Our Blog' })).toBeVisible();
  });
});

test.describe('Swarnavarsha (Scheme) Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/swarnavarsha', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/swarnavarsha/);
  });

  test('has content about the scheme', async ({ page }) => {
    await page.goto('/swarnavarsha', { waitUntil: 'domcontentloaded' });
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(100);
  });
});

test.describe('Thanga Mazhai (Scheme) Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/thanga-mazhai', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/thanga-mazhai/);
  });
});

test.describe('Coming Soon Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/coming-soon', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/coming-soon/);
  });
});

test.describe('Privacy Policy Page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/privacy-policy', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/privacy-policy/);
    await expect(page).toHaveTitle(/Privacy/);
  });

  test('has legal content', async ({ page }) => {
    await page.goto('/privacy-policy', { waitUntil: 'domcontentloaded' });
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(200);
  });
});

test.describe('Terms & Conditions Page', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/terms-conditions', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/terms-conditions/);
    await expect(page).toHaveTitle(/Terms/);
  });

  test('has legal content', async ({ page }) => {
    await page.goto('/terms-conditions', { waitUntil: 'domcontentloaded' });
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(200);
  });
});
