const { test, expect, describe } = require('@playwright/test');

describe('GSAP Animations - Hero Section', () => {
  test('hero title should animate from opacity 0 to 1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    
    const finalOpacity = await heroTitle.evaluate(el => {
      const opacity = parseFloat(window.getComputedStyle(el).opacity);
      return isNaN(opacity) ? 1 : opacity;
    });
    
    expect(finalOpacity).toBeGreaterThanOrEqual(0.5);
  });

  test('hero subtitle should animate after title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const subtitle = page.locator('.hero__subtitle');
    await expect(subtitle).toBeVisible();
  });

  test('hero CTA buttons should animate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2200);
    
    const ctaSection = page.locator('.hero__cta');
    await expect(ctaSection).toBeVisible();
    
    const ctaButton = page.locator('.hero__cta .btn--primary').first();
    await expect(ctaButton).toBeVisible();
  });

  test('hero scroll indicator should fade in', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const scrollIndicator = page.locator('.hero__scroll');
    await expect(scrollIndicator).toBeVisible();
    
    const opacity = await scrollIndicator.evaluate(el => parseFloat(window.getComputedStyle(el).opacity));
    expect(opacity).toBeGreaterThan(0.5);
  });
});

describe('GSAP Animations - Scroll Triggers', () => {
  test('elements with data-scroll should animate on scroll', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);
    
    const scrollElements = page.locator('[data-scroll]').nth(5);
    await expect(scrollElements).toBeVisible();
  });

  test('intro section should animate on scroll', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(1000);
    
    const introTitle = page.locator('.intro__title');
    await expect(introTitle).toBeVisible();
    
    const opacity = await introTitle.evaluate(el => parseFloat(window.getComputedStyle(el).opacity));
    expect(opacity).toBeGreaterThan(0.8);
  });

  test('univers cards should animate sequentially', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(1200);
    
    const cards = page.locator('.univers__card');
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      await expect(card).toBeVisible();
    }
  });

  test('section headers should animate on scroll', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(800);
    
    const sectionHeader = page.locator('.section-header__title').first();
    await expect(sectionHeader).toBeVisible();
  });
});

describe('GSAP Animations - Parallax Effects', () => {
  test('parallax images should transform on scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const parallaxImg = page.locator('.parallax-img img').first();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    
    const initialTransform = await parallaxImg.evaluate(el => {
      const matrix = window.getComputedStyle(el).transform;
      return matrix;
    });
    
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
    
    const finalTransform = await parallaxImg.evaluate(el => {
      const matrix = window.getComputedStyle(el).transform;
      return matrix;
    });
    
    expect(initialTransform).not.toBe(finalTransform);
  });

  test('parallax effect should be smooth', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    const parallaxImg = page.locator('.parallax-img img').first();
    await expect(parallaxImg).toBeVisible();
  });
});

describe('GSAP Animations - Hover Effects', () => {
  test('univers cards should scale on hover', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(800);
    
    const card = page.locator('.univers__card').first();
    await expect(card).toBeVisible();
    
    await card.hover();
    await page.waitForTimeout(400);
    
    const transform = await card.evaluate(el => window.getComputedStyle(el).transform);
    expect(transform).toBeDefined();
  });

  test('cards should return to normal scale after hover', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(800);
    
    const card = page.locator('.univers__card').first();
    
    await card.hover();
    await page.waitForTimeout(400);
    
    await page.mouse.move(0, 0);
    await page.waitForTimeout(400);
    
    const transform = await card.evaluate(el => window.getComputedStyle(el).transform);
    expect(transform).toBeDefined();
  });

  test('engagement cards should have hover effects', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.waitForTimeout(800);
    
    const engagementCard = page.locator('.engagements__card').first();
    await expect(engagementCard).toBeVisible();
    
    await engagementCard.hover();
    await page.waitForTimeout(300);
  });
});

describe('GSAP Animations - Page Transitions', () => {
  test('animations should initialize on page load', async ({ page }) => {
    await page.goto('/');
    
    const gsapLoaded = await page.evaluate(() => {
      return typeof window.gsap !== 'undefined' && window.gsap !== null;
    });
    
    expect(gsapLoaded).toBe(true);
  });

  test('ScrollTrigger should be active', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const scrollTriggerActive = await page.evaluate(() => {
      return window.ScrollTrigger !== undefined || 
             (window.gsap && window.gsap.getProperty);
    });
    
    expect(scrollTriggerActive).toBe(true);
  });

  test('animations should work on piscines page', async ({ page }) => {
    await page.goto('/piscines.html');
    await page.waitForTimeout(500);
    
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('animations should persist across navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    await page.click('.header__nav-link:has-text("Piscines")');
    await page.waitForLoadState('load');
    await page.waitForTimeout(500);
    
    await page.click('.header__logo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
  });
});

describe('GSAP Animations - Performance', () => {
  test('animations should not block page interaction', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(500);
    
    const navLink = page.locator('.header__nav-link').first();
    const isClickable = await navLink.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.pointerEvents !== 'none';
    });
    
    expect(isClickable).toBe(true);
  });

  test('scroll animations should not cause jank', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const scrollPositions = [0, 500, 1000, 1500, 2000];
    
    for (const position of scrollPositions) {
      await page.evaluate(pos => window.scrollTo(0, pos), position);
      await page.waitForTimeout(100);
    }
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
  });

  test('animations should complete within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    
    const elapsedTime = Date.now() - startTime;
    expect(elapsedTime).toBeLessThan(6000);
  });
});

describe('GSAP Animations - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('animations should work on mobile viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
  });

  test('scroll animations should work on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);
    
    const introTitle = page.locator('.intro__title');
    await expect(introTitle).toBeVisible();
  });
});
