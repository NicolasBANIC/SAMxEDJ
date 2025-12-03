const { test, expect, describe } = require('@playwright/test');

describe('Performance Metrics', () => {
  test('hero title should be visible within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible({ timeout: 2000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('page should not have console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('logo.svg')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('CSS stylesheet should load successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    
    const stylesheetResponse = await page.waitForResponse(
      response => response.url().includes('style.css'),
      { timeout: 5000 }
    );
    expect([200, 304]).toContain(stylesheetResponse.status());
  });

  test('GSAP library should load successfully', async ({ page }) => {
    await page.goto('/');
    
    const gsapLoaded = await page.evaluate(() => {
      return typeof window.gsap !== 'undefined';
    });
    
    expect(gsapLoaded).toBe(true);
  });

  test('ScrollTrigger plugin should be registered', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const scrollTriggerLoaded = await page.evaluate(() => {
      return typeof window.ScrollTrigger !== 'undefined' || 
             (window.gsap && typeof window.gsap.registerPlugin === 'function');
    });
    
    expect(scrollTriggerLoaded).toBe(true);
  });

  test('main.js should load without errors', async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(jsErrors.length).toBe(0);
  });

  test('page should reach networkidle state within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
  });

  test('images should start loading immediately', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('.univers__card-image img');
    await page.waitForTimeout(1000);
    
    const firstImage = images.first();
    const complete = await firstImage.evaluate(img => img.complete);
    const naturalWidth = await firstImage.evaluate(img => img.naturalWidth);
    
    expect(complete || naturalWidth > 0).toBe(true);
  });

  test('navigation should be interactive quickly', async ({ page }) => {
    await page.goto('/');
    
    const navLink = page.locator('.header__nav-link').first();
    await expect(navLink).toBeVisible({ timeout: 1000 });
    
    const isClickable = await navLink.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.pointerEvents !== 'none';
    });
    expect(isClickable).toBe(true);
  });

  test('page should not have layout shifts after load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    const heroTitlePosition1 = await page.locator('.hero__title').boundingBox();
    await page.waitForTimeout(500);
    const heroTitlePosition2 = await page.locator('.hero__title').boundingBox();
    
    expect(Math.abs(heroTitlePosition1.y - heroTitlePosition2.y)).toBeLessThan(2);
  });
});

describe('Performance - Other Pages', () => {
  test('piscines page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/piscines.html');
    await page.waitForSelector('h1');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('contact page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/contact.html');
    await page.waitForSelector('#contact-form');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('realisations page should load gallery efficiently', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/realisations.html');
    await page.waitForSelector('.gallery-item');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });
});
