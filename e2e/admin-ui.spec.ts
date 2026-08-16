import { test } from '@playwright/test';

test('capture all site settings tabs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  
  // Login
  await page.goto('/kj-portal-0d7cfad1/login');
  await page.fill('input#identifier', 'cekiboi46@gmail.com');
  await page.fill('input#password', 'Password123!');
  await page.click('button:has-text("Continue"), button[type="submit"]');
  
  await page.waitForSelector('input#otp');
  await page.fill('input#otp', '123456');
  await page.click('button:has-text("Verify"), button[type="submit"]');
  
  await page.waitForURL('**/kj-portal-0d7cfad1', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Go to site settings
  await page.goto('/kj-portal-0d7cfad1/globals/site-settings');
  await page.waitForTimeout(2500);

  // Tab 1: Homepage
  await page.screenshot({ path: 'tmp-admin-ui/settings-tab-1-homepage.png', fullPage: false });

  // Tab 2: Content
  const contentTab = page.locator('.tabs-field__tab:has-text("Content"), button:has-text("Content")').first();
  if (await contentTab.isVisible()) {
    await contentTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp-admin-ui/settings-tab-2-content.png', fullPage: false });
  }

  // Tab 3: Footer & Contact Details
  const footerTab = page.locator('.tabs-field__tab:has-text("Footer"), button:has-text("Footer")').first();
  if (await footerTab.isVisible()) {
    await footerTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp-admin-ui/settings-tab-3-footer.png', fullPage: false });
  }

  // Tab 4: Metal Rates
  const ratesTab = page.locator('.tabs-field__tab:has-text("Metal Rates"), button:has-text("Metal Rates")').first();
  if (await ratesTab.isVisible()) {
    await ratesTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp-admin-ui/settings-tab-4-rates.png', fullPage: false });
  }

  // Tab 5: Pages
  const pagesTab = page.locator('.tabs-field__tab:has-text("Pages"), button:has-text("Pages")').first();
  if (await pagesTab.isVisible()) {
    await pagesTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp-admin-ui/settings-tab-5-pages.png', fullPage: false });
  }
});
