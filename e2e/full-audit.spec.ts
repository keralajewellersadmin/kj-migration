import { test } from '@playwright/test';

test('Desktop Audit (1440x900)', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Login
  await page.goto('/kj-portal-0d7cfad1/login');
  await page.fill('input#identifier', process.env.TEST_EMAIL || '');
  await page.fill('input#password', process.env.TEST_PASSWORD || '');
  await page.click('button:has-text("Continue"), button[type="submit"]');

  await page.waitForSelector('input#otp');
  await page.fill('input#otp', '123456');
  await page.click('button:has-text("Verify"), button[type="submit"]');

  await page.waitForURL('**/kj-portal-0d7cfad1', { timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-1-dashboard.png' });

  // 2. Products List
  await page.goto('/kj-portal-0d7cfad1/collections/products');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-2-products.png' });

  // 3. Categories List
  await page.goto('/kj-portal-0d7cfad1/collections/categories');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-3-categories.png' });

  // 4. Inquiries List
  await page.goto('/kj-portal-0d7cfad1/collections/inquiries');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-4-inquiries.png' });

  // 5. Media List
  await page.goto('/kj-portal-0d7cfad1/collections/media');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-5-media.png' });

  // 6. Site Settings (Homepage)
  await page.goto('/kj-portal-0d7cfad1/globals/site-settings');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-6-settings-home.png' });

  // 7. Site Settings (Footer)
  const footerTab = page.locator('button.tabs-field__tab-button:has-text("Footer")').first();
  if (await footerTab.isVisible()) {
    await footerTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-7-settings-footer.png' });
  }

  // 8. Site Settings (Rates)
  const ratesTab = page.locator('button.tabs-field__tab-button:has-text("Metal Rates")').first();
  if (await ratesTab.isVisible()) {
    await ratesTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp-admin-ui/audit-desktop-8-settings-rates.png' });
  }
});

test('Mobile Audit (500x800)', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 500, height: 800 });

  // Login
  await page.goto('/kj-portal-0d7cfad1/login');
  await page.fill('input#identifier', process.env.TEST_EMAIL || '');
  await page.fill('input#password', process.env.TEST_PASSWORD || '');
  await page.click('button:has-text("Continue"), button[type="submit"]');

  await page.waitForSelector('input#otp');
  await page.fill('input#otp', '123456');
  await page.click('button:has-text("Verify"), button[type="submit"]');

  await page.waitForURL('**/kj-portal-0d7cfad1', { timeout: 20000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-mobile-1-dashboard.png' });

  // Test mobile sidebar toggle
  const toggle = page.locator('button[aria-label="Toggle menu"]');
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'tmp-admin-ui/audit-mobile-2-sidebar-open.png' });
    
    // close by clicking overlay
    const overlay = page.locator('div[class*="overlay"]');
    if (await overlay.isVisible()) {
      await overlay.click({ force: true });
      await page.waitForTimeout(600);
    }
  }

  // Products on mobile
  await page.goto('/kj-portal-0d7cfad1/collections/products');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-mobile-3-products.png' });

  // Site settings on mobile
  await page.goto('/kj-portal-0d7cfad1/globals/site-settings');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'tmp-admin-ui/audit-mobile-4-settings.png' });
});
