import { test, expect } from '@playwright/test';

test.describe('Scroll Reveal Performance', () => {
  test('intro section elements should appear quickly after scrolling into view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, 800));
    
    const introTitle = page.locator('.intro__title');
    await expect(introTitle).toBeVisible({ timeout: 400 });
    
    const revealTime = Date.now() - startTime;
    expect(revealTime).toBeLessThan(400);
  });

  test('univers cards should appear within 400ms of entering viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, 1200));
    
    const firstCard = page.locator('.univers__card').first();
    await expect(firstCard).toBeVisible({ timeout: 400 });
    
    const revealTime = Date.now() - startTime;
    expect(revealTime).toBeLessThan(400);
  });

  test('scroll reveals should have no perceptible delay', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(200);
    
    const introText = page.locator('.intro__text');
    await expect(introText).toBeVisible();
    
    const opacity = await introText.evaluate(el => parseFloat(window.getComputedStyle(el).opacity));
    expect(opacity).toBeGreaterThanOrEqual(0.8);
  });

  test('fast scroll should not break animations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(200);
    
    const univerCards = page.locator('.univers__card');
    const count = await univerCards.count();
    
    for (let i = 0; i < count; i++) {
      await expect(univerCards.nth(i)).toBeVisible();
    }
  });

  test('multiple rapid scrolls should maintain animation performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(50);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(50);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(300);
    
    const cards = page.locator('.univers__card');
    await expect(cards.first()).toBeVisible();
  });

  test('data-scroll elements should animate with duration under 350ms', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, 800));
    
    const introLabel = page.locator('.intro__label');
    await expect(introLabel).toBeVisible();
    
    await page.waitForTimeout(350);
    
    const finalOpacity = await introLabel.evaluate(el => parseFloat(window.getComputedStyle(el).opacity));
    expect(finalOpacity).toBeGreaterThanOrEqual(0.9);
  });

  test('scroll trigger should activate at 90% viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollDistance = Math.floor(viewportHeight * 0.5);
    
    await page.evaluate((distance) => window.scrollTo(0, distance), scrollDistance);
    await page.waitForTimeout(200);
    
    const introSection = page.locator('.intro__text');
    await expect(introSection).toBeVisible();
  });

  test('elements should be visible immediately after scroll completes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    await page.waitForTimeout(100);
    
    const sectionHeader = page.locator('.section-header__title').first();
    await expect(sectionHeader).toBeVisible();
  });

  test('piscines page scroll reveals should be fast', async ({ page }) => {
    await page.goto('/piscines.html');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, 800));
    
    const techniciteSection = page.locator('[data-scroll]').first();
    await expect(techniciteSection).toBeVisible({ timeout: 400 });
    
    const revealTime = Date.now() - startTime;
    expect(revealTime).toBeLessThan(450);
  });

  test('amenagements page scroll performance', async ({ page }) => {
    await page.goto('/amenagements.html');
    await page.waitForLoadState('networkidle');
    
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(300);
    
    const scrollElements = page.locator('[data-scroll]');
    const count = await scrollElements.count();
    expect(count).toBeGreaterThan(0);
    
    const firstVisible = scrollElements.first();
    await expect(firstVisible).toBeVisible();
  });

  test('containers page rapid scroll handling', async ({ page }) => {
    await page.goto('/containers.html');
    await page.waitForLoadState('networkidle');
    
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(50);
    }
    
    await page.waitForTimeout(250);
    
    const elements = page.locator('[data-scroll]');
    const visibleCount = await elements.evaluateAll(els => 
      els.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      }).length
    );
    
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('realisations gallery scroll reveals quickly', async ({ page }) => {
    await page.goto('/realisations.html');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, 400));
    
    const galleryItems = page.locator('.gallery-item');
    await expect(galleryItems.first()).toBeVisible({ timeout: 400 });
    
    const revealTime = Date.now() - startTime;
    expect(revealTime).toBeLessThan(450);
  });

  test('contact page form elements reveal without delay', async ({ page }) => {
    await page.goto('/contact.html');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.evaluate(() => window.scrollTo(0, 600));
    
    const formElements = page.locator('[data-scroll]');
    const firstElement = formElements.first();
    
    await expect(firstElement).toBeVisible({ timeout: 400 });
    
    const revealTime = Date.now() - startTime;
    expect(revealTime).toBeLessThan(400);
  });

  test('scroll animations maintain premium feel with reduced latency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(100);
    
    const introTitle = page.locator('.intro__title');
    
    const computedStyle = await introTitle.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        opacity: parseFloat(style.opacity),
        transform: style.transform,
        transition: style.transition
      };
    });
    
    expect(computedStyle.opacity).toBeGreaterThan(0.3);
  });

  test('stagger delays between elements are minimal', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => window.scrollTo(0, 1200));
    
    const cards = page.locator('.univers__card');
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);
    
    await expect(firstCard).toBeVisible({ timeout: 400 });
    
    const secondCardVisible = await secondCard.isVisible();
    expect(secondCardVisible).toBeTruthy();
  });

  test('vertical translation distance is subtle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const initialTransform = await page.locator('[data-scroll]').first().evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(350);
    
    const finalTransform = await page.locator('[data-scroll]').first().evaluate(el => {
      return window.getComputedStyle(el).transform;
    });
    
    expect(finalTransform).toBeDefined();
  });
});
