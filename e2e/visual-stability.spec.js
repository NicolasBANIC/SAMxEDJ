const { test, expect, describe } = require('@playwright/test');

describe('Visual Stability - Homepage', () => {
  test('hero title should be visible immediately', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Architectes');
  });

  test('hero title should have full opacity after animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    const opacity = await heroTitle.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity) || 1;
    });
    expect(opacity).toBeGreaterThanOrEqual(0.5);
  });

  test('hero subtitle should be visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const subtitle = page.locator('.hero__subtitle');
    await expect(subtitle).toBeVisible();
  });

  test('intro section H2 should be visible after scroll', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(800);
    const introTitle = page.locator('.intro__title');
    await expect(introTitle).toBeVisible();
  });

  test('all three univers cards should be visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(1000);
    const cards = page.locator('.univers__card');
    await expect(cards).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test('univers card titles should be readable', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(1000);
    const cardTitles = page.locator('.univers__card-title');
    await expect(cardTitles.nth(0)).toContainText('Piscines');
    await expect(cardTitles.nth(1)).toContainText('Aménagements');
    await expect(cardTitles.nth(2)).toContainText('Containers');
  });

  test('text should persist after multiple scrolls', async ({ page }) => {
    await page.goto('/');
    const heroTitle = page.locator('.hero__title');
    
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
    }
    
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Architectes');
  });

  test('section headers should remain visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    const sectionHeader = page.locator('.section-header__title').first();
    await expect(sectionHeader).toBeVisible();
  });

  test('CTA buttons should be visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    const primaryBtn = page.locator('.hero__cta .btn--primary').first();
    await expect(primaryBtn).toBeVisible();
  });

  test('all images should load properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const images = page.locator('.univers__card-image img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate(img => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

describe('Visual Stability - Other Pages', () => {
  test('piscines page title should be visible', async ({ page }) => {
    await page.goto('/piscines.html');
    await page.waitForTimeout(800);
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('contact page form should be visible', async ({ page }) => {
    await page.goto('/contact.html');
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
  });

  test('realisations gallery should display items', async ({ page }) => {
    await page.goto('/realisations.html');
    const galleryItems = page.locator('.gallery-item');
    expect(await galleryItems.count()).toBeGreaterThan(0);
  });
});
