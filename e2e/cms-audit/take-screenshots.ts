import { chromium } from 'playwright';

const BASE = 'https://kj-migration.vercel.app';
const LOCAL = 'http://localhost:4000';
const URL = LOCAL; // Use local for speed

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  
  const shots: [string, string, string?][] = [
    ['e2e/cms-audit/screenshots/01-home-hero.png', '/'],
    ['e2e/cms-audit/screenshots/02-products-list.png', '/products'],
    ['e2e/cms-audit/screenshots/03-product-detail.png', '/products/bombay-choker'],
    ['e2e/cms-audit/screenshots/04-categories.png', '/products?category=bangles'],
    ['e2e/cms-audit/screenshots/05-about.png', '/about'],
    ['e2e/cms-audit/screenshots/06-contact.png', '/contact'],
    ['e2e/cms-audit/screenshots/07-admin-login.png', '/kj-portal-0d7cfad1'],
    ['e2e/cms-audit/screenshots/08-mobile-home.png', '/'],
  ];
  
  for (const [file, path, extra] of shots) {
    if (extra === 'mobile') {
      await page.setViewportSize({ width: 375, height: 812 });
    } else {
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    try {
      await page.goto(`${URL}${path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: file, fullPage: false });
      console.log(`✓ ${file}`);
    } catch (e: any) {
      console.log(`✗ ${file}: ${e.message}`);
    }
  }
  
  // Mobile home
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'e2e/cms-audit/screenshots/08-mobile-home.png', fullPage: false });
  console.log('✓ 08-mobile-home.png');
  
  await browser.close();
})();
