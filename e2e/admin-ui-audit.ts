import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const BASE = 'http://localhost:4000'
const ADMIN = '/kj-portal-0d7cfad1'
const OUT = join(__dirname, 'admin-ui-audit')

async function login(page: import('playwright').Page): Promise<string> {
  // Navigate to a page first so fetch works
  await page.goto(`${BASE}${ADMIN}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(1000)

  // Step 1: Request OTP
  const loginRes = await page.evaluate(async (base) => {
    const r = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'superadmin@keralajewellers.in', password: 'SuperAdmin@12345' }),
    })
    return r.json()
  }, BASE)

  if (!loginRes.devOtp) throw new Error('No devOtp returned: ' + JSON.stringify(loginRes))

  // Step 2: Verify OTP
  const otpRes = await page.evaluate(async ({ base, userId, code }) => {
    const r = await fetch(`${base}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code }),
    })
    return r.json()
  }, { base: BASE, userId: loginRes.userId, code: loginRes.devOtp })

  if (!otpRes.token) throw new Error('No token returned: ' + JSON.stringify(otpRes))

  // Step 3: Set cookie
  await page.context().addCookies([{
    name: 'payload-token',
    value: otpRes.token,
    domain: 'localhost',
    path: '/',
  }])

  return otpRes.token
}

interface PageResult {
  slug: string
  url: string
  screenshot: string
  consoleErrors: string[]
  brokenImages: string[]
  invisibleButtons: { selector: string; text: string; box: string }[]
  overflowIssues: string[]
}

async function auditPage(
  page: import('playwright').Page,
  slug: string,
  url: string,
): Promise<PageResult> {
  const result: PageResult = {
    slug,
    url,
    screenshot: '',
    consoleErrors: [],
    brokenImages: [],
    invisibleButtons: [],
    overflowIssues: [],
  }

  // Capture console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') result.consoleErrors.push(msg.text())
  })

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  } catch {
    // Try without networkidle
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
    } catch (e) {
      result.consoleErrors.push(`Navigation failed: ${e}`)
      return result
    }
  }

  // Wait for content to settle
  await page.waitForTimeout(1500)

  // Full-page screenshot
  const ssName = slug.replace(/[^a-zA-Z0-9-]/g, '_') + '.png'
  await page.screenshot({ path: join(OUT, ssName), fullPage: true })
  result.screenshot = ssName

  // Check broken images
  const images = await page.$$eval('img', (imgs) =>
    imgs.map((img) => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      alt: img.alt,
      visible: img.offsetParent !== null,
    })),
  )
  for (const img of images) {
    if (img.src && img.naturalWidth === 0 && !img.src.startsWith('data:')) {
      result.brokenImages.push(img.src)
    }
  }

  // Check invisible buttons (visible in DOM but not visually rendered)
  const buttons = await page.$$eval('button, a.btn, .btn, [role="button"]', (els) =>
    els.map((el) => {
      const rect = el.getBoundingClientRect()
      const style = getComputedStyle(el)
      // Check if any ancestor is a collapsed accordion panel (height 0 = collapsed)
      let inCollapsedPanel = false
      let parent = el.parentElement
      while (parent && parent !== document.body) {
        const cs = getComputedStyle(parent)
        if (
          parent.classList.contains('rah-static--collapsed') ||
          (parent.classList.contains('rah-static') && cs.height === '0px') ||
          cs.display === 'none'
        ) {
          inCollapsedPanel = true
          break
        }
        parent = parent.parentElement
      }
      return {
        text: (el.textContent || '').trim().substring(0, 60),
        tag: el.tagName,
        classes: el.className.substring(0, 120),
        width: rect.width,
        height: rect.height,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        color: style.color,
        backgroundColor: style.backgroundColor,
        overflow: style.overflow,
        inCollapsedPanel,
      }
    }),
  )

  for (const btn of buttons) {
    // Button has zero dimensions — only flag if parent is NOT a collapsed accordion
    if (
      btn.text &&
      (btn.width === 0 || btn.height === 0) &&
      btn.display !== 'none' &&
      btn.visibility !== 'hidden'
    ) {
      // Skip buttons inside collapsed panels, hidden mobile toggles, and utility buttons
      const skipTexts = ['Paste Field', '5', '10', '25', '50', '100', 'Add Filter']
      if (!skipTexts.includes(btn.text) && !btn.inCollapsedPanel) {
        result.invisibleButtons.push({
          selector: `${btn.tag} "${btn.text}"`,
          text: btn.text,
          box: `${btn.width}x${btn.height}`,
        })
      }
    }

    // Button with text same color as background (contrast issue)
    if (btn.text && btn.backgroundColor !== 'rgba(0, 0, 0, 0)' && btn.backgroundColor !== 'transparent') {
      const parseRGB = (c: string) => {
        const m = c.match(/\d+/g)
        return m ? m.map(Number) : null
      }
      const fg = parseRGB(btn.color)
      const bg = parseRGB(btn.backgroundColor)
      if (fg && bg) {
        // Calculate relative luminance
        const luminance = (r: number, g: number, b: number) => {
          const [rs, gs, bs] = [r, g, b].map((c) => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
          })
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
        }
        const l1 = luminance(fg[0], fg[1], fg[2])
        const l2 = luminance(bg[0], bg[1], bg[2])
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
        if (ratio < 2.0 && btn.text.length > 0) {
          result.invisibleButtons.push({
            selector: `${btn.tag} "${btn.text}"`,
            text: btn.text,
            box: `contrast ${ratio.toFixed(1)}:1 (fg: ${btn.color}, bg: ${btn.backgroundColor})`,
          })
        }
      }
    }
  }

  // Check for horizontal overflow (broken layout)
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth
  })
  if (hasOverflow) {
    result.overflowIssues.push('Page has horizontal scroll')
  }

  // Check for elements clipped by overflow:hidden
  const clipped = await page.$$eval('[class*="btn"], [class*="controls"], [class*="header"]', (els) =>
    els.filter((el) => {
      const style = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      if (style.overflow === 'hidden' && (rect.width > 0 || rect.height > 0)) {
        // Check if any child buttons are clipped
        const childBtns = el.querySelectorAll('button, .btn, a.btn')
        for (const btn of childBtns) {
          const btnRect = btn.getBoundingClientRect()
          if (
            btnRect.right > rect.right + 2 ||
            btnRect.bottom > rect.bottom + 2 ||
            btnRect.left < rect.left - 2 ||
            btnRect.top < rect.top - 2
          ) {
            return true
          }
        }
      }
      return false
    }).map((el) => el.className.substring(0, 80)),
  )
  result.overflowIssues.push(...clipped.map((c) => `Clipped content in: ${c}`))

  return result
}

async function main() {
  mkdirSync(OUT, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  console.log('Logging in...')
  await login(page)
  console.log('Logged in.\n')

  // Pages to audit
  const pages: [string, string][] = [
    ['dashboard', `${BASE}${ADMIN}`],
    ['admin-users-list', `${BASE}${ADMIN}/collections/admin-users`],
    ['admin-users-create', `${BASE}${ADMIN}/collections/admin-users/create`],
    ['media-list', `${BASE}${ADMIN}/collections/media`],
    ['media-create', `${BASE}${ADMIN}/collections/media/create`],
    ['products-list', `${BASE}${ADMIN}/collections/products`],
    ['products-create', `${BASE}${ADMIN}/collections/products/create`],
    ['categories-list', `${BASE}${ADMIN}/collections/categories`],
    ['categories-create', `${BASE}${ADMIN}/collections/categories/create`],
    ['blog-posts-list', `${BASE}${ADMIN}/collections/blog-posts`],
    ['blog-posts-create', `${BASE}${ADMIN}/collections/blog-posts/create`],
    ['legal-pages-list', `${BASE}${ADMIN}/collections/legal-pages`],
    ['legal-pages-create', `${BASE}${ADMIN}/collections/legal-pages/create`],
    ['inquiries-list', `${BASE}${ADMIN}/collections/inquiries`],
    ['audit-logs-list', `${BASE}${ADMIN}/collections/audit-logs`],
    ['site-settings', `${BASE}${ADMIN}/globals/site-settings`],
  ]

  // Also audit first product edit page
  // First, get the first product ID from the products list
  let firstProductUrl = ''
  try {
    await page.goto(`${BASE}${ADMIN}/collections/products`, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(2000)
    // Find first edit link
    const editLink = await page.$('a[href*="/collections/products/"]')
    if (editLink) {
      const href = await editLink.getAttribute('href')
      if (href) {
        firstProductUrl = href.startsWith('http') ? href : `${BASE}${href}`
        pages.push(['products-edit-first', firstProductUrl])
      }
    }
  } catch (e) {
    console.log('Could not find first product:', e)
  }

  // Also audit first admin-user edit
  let firstUserUrl = ''
  try {
    await page.goto(`${BASE}${ADMIN}/collections/admin-users`, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(2000)
    const editLink = await page.$('a[href*="/collections/admin-users/"]')
    if (editLink) {
      const href = await editLink.getAttribute('href')
      if (href && !href.endsWith('/create')) {
        firstUserUrl = href.startsWith('http') ? href : `${BASE}${href}`
        pages.push(['admin-users-edit-first', firstUserUrl])
      }
    }
  } catch (e) {
    console.log('Could not find first admin user:', e)
  }

  const results: PageResult[] = []
  for (const [slug, url] of pages) {
    console.log(`Auditing: ${slug} → ${url}`)
    const result = await auditPage(page, slug, url)
    results.push(result)
    if (result.consoleErrors.length) console.log(`  ⚠ Console errors: ${result.consoleErrors.length}`)
    if (result.brokenImages.length) console.log(`  ⚠ Broken images: ${result.brokenImages.length}`)
    if (result.invisibleButtons.length) console.log(`  ⚠ Invisible/low-contrast buttons: ${result.invisibleButtons.length}`)
    if (result.overflowIssues.length) console.log(`  ⚠ Overflow issues: ${result.overflowIssues.length}`)
  }

  // Also test modals/drawers: open delete modal on a product
  console.log('\nTesting modals...')
  if (firstProductUrl) {
    await page.goto(firstProductUrl, { waitUntil: 'networkidle', timeout: 20000 })
    await page.waitForTimeout(2000)
    
    // Find and click delete button
    const deleteBtn = await page.$('button:has-text("Delete"), .btn--style-danger, [class*="delete"]')
    if (deleteBtn) {
      await deleteBtn.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: join(OUT, 'modal-delete-product.png'), fullPage: false })
      
      // Check modal buttons
      const modalBtns = await page.$$eval('.modal button, .popup button, .drawer button', (els) =>
        els.map((el) => {
          const rect = el.getBoundingClientRect()
          const style = getComputedStyle(el)
          return {
            text: el.textContent?.trim(),
            width: rect.width,
            height: rect.height,
            color: style.color,
            bg: style.backgroundColor,
            opacity: style.opacity,
          }
        }),
      )
      console.log('  Modal buttons:', JSON.stringify(modalBtns, null, 2))
      
      // Close modal
      const closeBtn = await page.$('.modal button:has-text("Cancel"), .popup__close, [aria-label="Close"]')
      if (closeBtn) await closeBtn.click()
      await page.waitForTimeout(500)
    } else {
      console.log('  No delete button found on product edit page')
    }
  }

  // Test site-settings global form
  console.log('\nTesting site-settings tabs...')
  await page.goto(`${BASE}${ADMIN}/globals/site-settings`, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(OUT, 'site-settings-default-tab.png'), fullPage: false })

  // Click through tabs
  const tabs = await page.$$('.tabs-field__tab, [role="tab"]')
  console.log(`  Found ${tabs.length} tabs`)
  for (let i = 0; i < tabs.length; i++) {
    try {
      await tabs[i].click()
      await page.waitForTimeout(500)
      const tabText = await tabs[i].textContent()
      await page.screenshot({ path: join(OUT, `site-settings-tab-${i}-${(tabText || '').replace(/[^a-zA-Z0-9]/g, '_')}.png`), fullPage: false })
    } catch {}
  }

  // Write report
  const report = results.map((r) => ({
    slug: r.slug,
    url: r.url,
    screenshot: r.screenshot,
    issues: [
      ...r.consoleErrors.map((e) => `CONSOLE ERROR: ${e}`),
      ...r.brokenImages.map((i) => `BROKEN IMAGE: ${i}`),
      ...r.invisibleButtons.map((b) => `INVISIBLE BUTTON: ${b.selector} — ${b.box}`),
      ...r.overflowIssues.map((o) => `OVERFLOW: ${o}`),
    ],
  }))

  writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2))

  // Summary
  const totalIssues = report.reduce((sum, r) => sum + r.issues.length, 0)
  console.log(`\n=== AUDIT COMPLETE ===`)
  console.log(`Pages tested: ${results.length}`)
  console.log(`Total issues found: ${totalIssues}`)
  for (const r of report) {
    if (r.issues.length) {
      console.log(`\n--- ${r.slug} (${r.issues.length} issues) ---`)
      for (const issue of r.issues) {
        console.log(`  ${issue}`)
      }
    }
  }

  await browser.close()
}

main().catch((e) => {
  console.error('Audit failed:', e)
  process.exit(1)
})
