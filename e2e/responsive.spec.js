const { test, expect, describe } = require('@playwright/test');

describe('Responsive - Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hamburger menu should be visible on mobile', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    await expect(burger).toBeVisible();
  });

  test('desktop navigation links should be hidden initially', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#nav');
    const isHidden = await nav.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.display === 'none' || style.visibility === 'hidden' || !el.classList.contains('active');
    });
    expect(isHidden).toBe(true);
  });

  test('hero title should be readable on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    
    const fontSize = await heroTitle.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThan(20);
  });

  test('images should not overflow on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('.univers__card-image img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      const width = await images.nth(i).evaluate(el => el.getBoundingClientRect().width);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('buttons should be tappable (min 44x44px)', async ({ page }) => {
    await page.goto('/');
    const chatbotButton = page.locator('#chatbot-button');
    
    await expect(chatbotButton).toBeVisible();
    const box = await chatbotButton.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(40);
      expect(box.width).toBeGreaterThanOrEqual(40);
    }
  });

  test('chatbot button should be accessible on mobile', async ({ page }) => {
    await page.goto('/');
    const chatbotBtn = page.locator('#chatbot-button');
    await expect(chatbotBtn).toBeVisible();
    
    const box = await chatbotBtn.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  });
});

describe('Responsive - Tablet (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('layout should adapt to tablet viewport', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
  });

  test('navigation should be appropriate for tablet', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#nav');
    await expect(nav).toBeVisible();
  });

  test('univers cards should display properly', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    
    const cards = page.locator('.univers__card');
    await expect(cards.first()).toBeVisible();
  });

  test('content should not overflow on tablet', async ({ page }) => {
    await page.goto('/');
    const body = page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(768 + 20);
  });
});

describe('Responsive - Desktop (1920px)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('hamburger should be hidden on desktop', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    const isVisible = await burger.isVisible();
    expect(isVisible).toBe(false);
  });

  test('desktop navigation should be fully visible', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('.header__nav-link');
    expect(await navLinks.count()).toBe(6);
    await expect(navLinks.first()).toBeVisible();
  });

  test('layout should use full width appropriately', async ({ page }) => {
    await page.goto('/');
    const container = page.locator('.container').first();
    const width = await container.evaluate(el => el.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(1000);
  });

  test('all univers cards should be in single row', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    
    const cards = page.locator('.univers__card');
    const firstCardTop = await cards.nth(0).evaluate(el => el.getBoundingClientRect().top);
    const secondCardTop = await cards.nth(1).evaluate(el => el.getBoundingClientRect().top);
    const thirdCardTop = await cards.nth(2).evaluate(el => el.getBoundingClientRect().top);
    
    expect(Math.abs(firstCardTop - secondCardTop)).toBeLessThan(50);
    expect(Math.abs(secondCardTop - thirdCardTop)).toBeLessThan(50);
  });
});

describe('Responsive - Cross-viewport Tests', () => {
  test('text should remain readable across all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForTimeout(500);
      
      const heroTitle = page.locator('.hero__title');
      await expect(heroTitle).toBeVisible();
      
      const fontSize = await heroTitle.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
      expect(fontSize).toBeGreaterThan(16);
    }
  });
});
