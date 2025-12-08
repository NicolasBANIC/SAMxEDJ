import { test, expect } from '@playwright/test';

test.describe('Header - Premium Colors & Layout', () => {
  const goldenColor = 'rgb(179, 136, 62)';
  const whiteColor = 'rgb(255, 255, 255)';
  const anthraciteColor = 'rgb(51, 56, 59)';

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('Logo text "ÉCLATS DE JARDIN" should always be golden', async ({ page }) => {
    const logoText = page.locator('.header__logo-text');
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(logoText).toHaveCSS('color', goldenColor);
  });

  test('Phone number should always be golden', async ({ page }) => {
    const phone = page.locator('.header__phone');
    
    await expect(phone).toHaveCSS('color', goldenColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(phone).toHaveCSS('color', goldenColor);
  });

  test('Navigation links should be white initially, then anthracite after scroll', async ({ page }) => {
    const navLinks = page.locator('.header__nav-link').first();
    
    await expect(navLinks).toHaveCSS('color', whiteColor);
    
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    const scrollAmount = heroBox ? heroBox.height + 100 : 500;
    
    await page.evaluate((amount) => window.scrollTo(0, amount), scrollAmount);
    await page.waitForTimeout(400);
    
    await expect(navLinks).toHaveCSS('color', anthraciteColor);
  });

  test('Burger spans should be white initially, then anthracite after scroll', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const burgerSpan = page.locator('.header__burger span').first();
    
    await expect(burgerSpan).toHaveCSS('background-color', whiteColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(burgerSpan).toHaveCSS('background-color', anthraciteColor);
  });

  test('Phone number should not have line breaks', async ({ page }) => {
    const phone = page.locator('.header__phone');
    
    await expect(phone).toHaveCSS('white-space', 'nowrap');
  });

  test('Header elements should stay on one line on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    
    const headerContainer = page.locator('.header__container');
    const logo = page.locator('.header__logo');
    const nav = page.locator('.header__nav');
    const actions = page.locator('.header__actions');
    
    const containerBox = await headerContainer.boundingBox();
    const logoBox = await logo.boundingBox();
    const navBox = await nav.boundingBox();
    const actionsBox = await actions.boundingBox();
    
    expect(containerBox).not.toBeNull();
    expect(logoBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    expect(actionsBox).not.toBeNull();
    
    const containerHeight = containerBox!.height;
    const maxElementHeight = Math.max(logoBox!.height, navBox!.height, actionsBox!.height);
    
    expect(containerHeight).toBeLessThan(maxElementHeight + 50);
  });

  test('Header container should have flex-wrap: nowrap', async ({ page }) => {
    const headerContainer = page.locator('.header__container');
    
    await expect(headerContainer).toHaveCSS('flex-wrap', 'nowrap');
  });

  test('Colors should be consistent across all pages - Piscines', async ({ page }) => {
    await page.goto('http://localhost:3000/piscines.html');
    await page.waitForLoadState('networkidle');
    
    const logoText = page.locator('.header__logo-text');
    const phone = page.locator('.header__phone');
    const navLink = page.locator('.header__nav-link').first();
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
    await expect(navLink).toHaveCSS('color', whiteColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
    await expect(navLink).toHaveCSS('color', anthraciteColor);
  });

  test('Colors should be consistent across all pages - Amenagements', async ({ page }) => {
    await page.goto('http://localhost:3000/amenagements.html');
    await page.waitForLoadState('networkidle');
    
    const logoText = page.locator('.header__logo-text');
    const phone = page.locator('.header__phone');
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
  });

  test('Colors should be consistent across all pages - Containers', async ({ page }) => {
    await page.goto('http://localhost:3000/containers.html');
    await page.waitForLoadState('networkidle');
    
    const logoText = page.locator('.header__logo-text');
    const phone = page.locator('.header__phone');
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
  });

  test('Colors should be consistent across all pages - Realisations', async ({ page }) => {
    await page.goto('http://localhost:3000/realisations.html');
    await page.waitForLoadState('networkidle');
    
    const logoText = page.locator('.header__logo-text');
    const phone = page.locator('.header__phone');
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
  });

  test('Colors should be consistent across all pages - Contact', async ({ page }) => {
    await page.goto('http://localhost:3000/contact.html');
    await page.waitForLoadState('networkidle');
    
    const logoText = page.locator('.header__logo-text');
    const phone = page.locator('.header__phone');
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(logoText).toHaveCSS('color', goldenColor);
    await expect(phone).toHaveCSS('color', goldenColor);
  });

  test('Logo text and phone should have white-space nowrap', async ({ page }) => {
    const logoText = page.locator('.header__logo-text');
    const phone = page.locator('.header__phone');
    
    await expect(logoText).toHaveCSS('white-space', 'nowrap');
    await expect(phone).toHaveCSS('white-space', 'nowrap');
  });

  test('Navigation links should have white-space nowrap', async ({ page }) => {
    const navLinks = page.locator('.header__nav-link');
    const count = await navLinks.count();
    
    for (let i = 0; i < count; i++) {
      await expect(navLinks.nth(i)).toHaveCSS('white-space', 'nowrap');
    }
  });

  test('Header should have glass effect when scrolled', async ({ page }) => {
    const header = page.locator('.header');
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    let hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
    expect(hasScrolledClass).toBe(false);
    
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    const scrollAmount = heroBox ? heroBox.height + 100 : 500;
    
    await page.evaluate((amount) => window.scrollTo(0, amount), scrollAmount);
    await page.waitForTimeout(500);
    
    hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
    expect(hasScrolledClass).toBe(true);
  });

  test('Burger should be visible on mobile and change colors', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const burger = page.locator('.header__burger');
    const burgerSpan = burger.locator('span').first();
    const header = page.locator('.header');
    
    await expect(burger).toBeVisible();
    await expect(burgerSpan).toHaveCSS('background-color', whiteColor);
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    
    await expect(header).toHaveClass(/scrolled/);
    await expect(burgerSpan).toHaveCSS('background-color', anthraciteColor);
  });

  test('Header container should have proper spacing between elements', async ({ page }) => {
    const headerContainer = page.locator('.header__container');
    
    const gapValue = await headerContainer.evaluate(el => {
      return window.getComputedStyle(el).gap;
    });
    
    expect(gapValue).not.toBe('normal');
    expect(gapValue).not.toBe('0px');
  });

  test('Mobile menu links should be visible on white background', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    
    const burger = page.locator('.header__burger');
    await burger.click();
    await page.waitForTimeout(400);
    
    const nav = page.locator('.header__nav');
    const hasActiveClass = await nav.evaluate(el => el.classList.contains('active'));
    expect(hasActiveClass).toBe(true);
    
    // Check second link (Piscines) which doesn't have active class
    const secondNavLink = page.locator('.header__nav-link').nth(1);
    await expect(secondNavLink).toBeVisible();
    await expect(secondNavLink).toHaveCSS('color', anthraciteColor);
  });

  test('Header should not overflow on intermediate widths', async ({ page }) => {
    await page.setViewportSize({ width: 1050, height: 800 });
    
    const body = page.locator('body');
    const hasHorizontalScroll = await body.evaluate(el => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });

  test('Navigation links spacing should be consistent', async ({ page }) => {
    const nav = page.locator('.header__nav');
    
    const gapValue = await nav.evaluate(el => {
      return window.getComputedStyle(el).gap;
    });
    
    expect(gapValue).not.toBe('normal');
    expect(gapValue).not.toBe('0px');
  });

  test('All header elements should be visible on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const logo = page.locator('.header__logo');
    const nav = page.locator('.header__nav');
    const phone = page.locator('.header__phone');
    const btn = page.locator('.header__actions .btn--primary');
    
    await expect(logo).toBeVisible();
    await expect(nav).toBeVisible();
    await expect(phone).toBeVisible();
    await expect(btn).toBeVisible();
  });
});
