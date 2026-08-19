import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Contact Page UI Screenshots', async ({ page }) => {
  const outputDir = path.join(process.cwd(), 'tmp-contact-ui');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4000/contact', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outputDir, 'desktop.png'), fullPage: true });

  // 2. Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(outputDir, 'tablet.png'), fullPage: true });

  // 3. Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: path.join(outputDir, 'mobile.png'), fullPage: true });
});
