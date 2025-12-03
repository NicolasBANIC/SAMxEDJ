import { test, expect } from '@playwright/test';

test.describe('Hero Section Visibility Bug Fix', () => {
  test('hero title should be visible immediately after page load', async ({ page }) => {
    await page.goto('/');
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Architectes de votre');
    await expect(heroTitle).toContainText('univers extérieur');
  });

  test('hero CTA buttons should be visible immediately after page load', async ({ page }) => {
    await page.goto('/');
    
    const primaryCTA = page.locator('.hero__cta .btn--primary');
    const secondaryCTA = page.locator('.hero__cta .btn--secondary');
    
    await expect(primaryCTA).toBeVisible();
    await expect(secondaryCTA).toBeVisible();
  });

  test('hero elements should remain visible after GSAP animations complete', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    const heroSubtitle = page.locator('.hero__subtitle');
    const primaryCTA = page.locator('.hero__cta .btn--primary');
    const secondaryCTA = page.locator('.hero__cta .btn--secondary');
    
    await expect(heroTitle).toBeVisible();
    await expect(heroSubtitle).toBeVisible();
    await expect(primaryCTA).toBeVisible();
    await expect(secondaryCTA).toBeVisible();
  });

  test('hero title should have full opacity after animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    
    const opacity = await heroTitle.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity);
    });
    
    expect(opacity).toBeGreaterThanOrEqual(0.9);
  });

  test('hero CTA buttons should have full opacity after animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const ctaSection = page.locator('.hero__cta');
    
    const opacity = await ctaSection.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return parseFloat(computed.opacity);
    });
    
    expect(opacity).toBeGreaterThanOrEqual(0.9);
  });

  test('hero elements should not have display:none after animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    const heroSubtitle = page.locator('.hero__subtitle');
    const heroCtaSection = page.locator('.hero__cta');
    
    const titleDisplay = await heroTitle.evaluate(el => window.getComputedStyle(el).display);
    const subtitleDisplay = await heroSubtitle.evaluate(el => window.getComputedStyle(el).display);
    const ctaDisplay = await heroCtaSection.evaluate(el => window.getComputedStyle(el).display);
    
    expect(titleDisplay).not.toBe('none');
    expect(subtitleDisplay).not.toBe('none');
    expect(ctaDisplay).not.toBe('none');
  });

  test('hero elements should not have visibility:hidden after animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    const heroSubtitle = page.locator('.hero__subtitle');
    const heroCtaSection = page.locator('.hero__cta');
    
    const titleVisibility = await heroTitle.evaluate(el => window.getComputedStyle(el).visibility);
    const subtitleVisibility = await heroSubtitle.evaluate(el => window.getComputedStyle(el).visibility);
    const ctaVisibility = await heroCtaSection.evaluate(el => window.getComputedStyle(el).visibility);
    
    expect(titleVisibility).toBe('visible');
    expect(subtitleVisibility).toBe('visible');
    expect(ctaVisibility).toBe('visible');
  });

  test('hero elements remain visible after page reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    const primaryCTA = page.locator('.hero__cta .btn--primary');
    const secondaryCTA = page.locator('.hero__cta .btn--secondary');
    
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Architectes de votre');
    await expect(heroTitle).toContainText('univers extérieur');
    await expect(primaryCTA).toBeVisible();
    await expect(secondaryCTA).toBeVisible();
  });

  test('hero elements remain visible after multiple reloads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const heroTitle = page.locator('.hero__title');
      const heroSubtitle = page.locator('.hero__subtitle');
      const primaryCTA = page.locator('.hero__cta .btn--primary');
      
      await expect(heroTitle).toBeVisible();
      await expect(heroSubtitle).toBeVisible();
      await expect(primaryCTA).toBeVisible();
    }
  });

  test('hero CTA buttons are clickable after animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const primaryCTA = page.locator('.hero__cta .btn--primary');
    const secondaryCTA = page.locator('.hero__cta .btn--secondary');
    
    await expect(primaryCTA).toBeEnabled();
    await expect(secondaryCTA).toBeEnabled();
    
    const primaryPointerEvents = await primaryCTA.evaluate(el => window.getComputedStyle(el).pointerEvents);
    const secondaryPointerEvents = await secondaryCTA.evaluate(el => window.getComputedStyle(el).pointerEvents);
    
    expect(primaryPointerEvents).not.toBe('none');
    expect(secondaryPointerEvents).not.toBe('none');
  });

  test('hero content remains stable during scroll interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(500);
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    const heroTitle = page.locator('.hero__title');
    const primaryCTA = page.locator('.hero__cta .btn--primary');
    
    await expect(heroTitle).toBeVisible();
    await expect(primaryCTA).toBeVisible();
  });
});
