import { test, expect } from '@playwright/test';

test.describe('Header - Hero Section Intersection Behavior', () => {
  const whiteColor = 'rgb(255, 255, 255)';
  const anthraciteColor = 'rgb(51, 56, 59)';

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
  });

  test('Header should not have scrolled class when hero section is visible (homepage)', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const hero = page.locator('.hero');

    await expect(hero).toBeVisible();

    const hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
    expect(hasScrolledClass).toBe(false);
  });

  test('Navigation links should be white when hero is visible', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const navLink = page.locator('.header__nav-link').first();
    await expect(navLink).toHaveCSS('color', whiteColor);
  });

  test('Header should add scrolled class when scrolled past hero section', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();

    expect(heroBox).not.toBeNull();

    await page.evaluate((heroHeight) => {
      window.scrollTo(0, heroHeight + 100);
    }, heroBox!.height);

    await page.waitForTimeout(500);

    const hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
    expect(hasScrolledClass).toBe(true);
  });

  test('Navigation links should turn anthracite when scrolled past hero', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const navLink = page.locator('.header__nav-link').first();
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();

    expect(heroBox).not.toBeNull();

    await page.evaluate((heroHeight) => {
      window.scrollTo(0, heroHeight + 100);
    }, heroBox!.height);

    await page.waitForTimeout(500);

    await expect(navLink).toHaveCSS('color', anthraciteColor);
  });

  test('Header should remove scrolled class when scrolling back to hero', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();

    expect(heroBox).not.toBeNull();

    await page.evaluate((heroHeight) => {
      window.scrollTo(0, heroHeight + 100);
    }, heroBox!.height);
    await page.waitForTimeout(500);

    let hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
    expect(hasScrolledClass).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
    expect(hasScrolledClass).toBe(false);
  });

  test('Header should work with .page-hero on internal pages - Piscines', async ({ page }) => {
    await page.goto('http://localhost:3000/piscines.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const pageHero = page.locator('.page-hero');

    const pageHeroExists = await pageHero.count() > 0;

    if (pageHeroExists) {
      await expect(pageHero).toBeVisible();

      let hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(false);

      const pageHeroBox = await pageHero.boundingBox();
      expect(pageHeroBox).not.toBeNull();

      await page.evaluate((heroHeight) => {
        window.scrollTo(0, heroHeight + 100);
      }, pageHeroBox!.height);
      await page.waitForTimeout(500);

      hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(true);
    }
  });

  test('Header should work with .page-hero on internal pages - Amenagements', async ({ page }) => {
    await page.goto('http://localhost:3000/amenagements.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const pageHero = page.locator('.page-hero');

    const pageHeroExists = await pageHero.count() > 0;

    if (pageHeroExists) {
      await expect(pageHero).toBeVisible();

      let hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(false);

      const pageHeroBox = await pageHero.boundingBox();
      expect(pageHeroBox).not.toBeNull();

      await page.evaluate((heroHeight) => {
        window.scrollTo(0, heroHeight + 100);
      }, pageHeroBox!.height);
      await page.waitForTimeout(500);

      hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(true);
    }
  });

  test('Header should work with .page-hero on internal pages - Containers', async ({ page }) => {
    await page.goto('http://localhost:3000/containers.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const pageHero = page.locator('.page-hero');

    const pageHeroExists = await pageHero.count() > 0;

    if (pageHeroExists) {
      await expect(pageHero).toBeVisible();

      let hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(false);

      const pageHeroBox = await pageHero.boundingBox();
      expect(pageHeroBox).not.toBeNull();

      await page.evaluate((heroHeight) => {
        window.scrollTo(0, heroHeight + 100);
      }, pageHeroBox!.height);
      await page.waitForTimeout(500);

      hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(true);
    }
  });

  test('Burger spans should be white when hero is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const burgerSpan = page.locator('.header__burger span').first();
    await expect(burgerSpan).toHaveCSS('background-color', whiteColor);
  });

  test('Burger spans should turn anthracite when scrolled past hero on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    expect(heroBox).not.toBeNull();

    await page.evaluate((heroHeight) => {
      window.scrollTo(0, heroHeight + 100);
    }, heroBox!.height);
    await page.waitForTimeout(500);

    const burgerSpan = page.locator('.header__burger span').first();
    await expect(burgerSpan).toHaveCSS('background-color', anthraciteColor);
  });

  test('Header should use fallback scroll behavior on pages without hero section', async ({ page }) => {
    await page.goto('http://localhost:3000/contact.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const hero = page.locator('.hero, .page-hero');
    const heroExists = await hero.count() > 0;

    if (!heroExists) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      let hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(false);

      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(300);

      hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(true);
    }
  });

  test('IntersectionObserver threshold should trigger at appropriate point', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const header = page.locator('.header');
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();

    expect(heroBox).not.toBeNull();

    const scrollPositions = [
      { pos: 0, expected: false },
      { pos: heroBox!.height * 0.5, expected: false },
      { pos: heroBox!.height * 0.75, expected: true },
      { pos: heroBox!.height + 100, expected: true },
    ];

    for (const { pos, expected } of scrollPositions) {
      await page.evaluate((scrollPos) => {
        window.scrollTo(0, scrollPos);
      }, pos);
      await page.waitForTimeout(400);

      const hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(expected);
    }
  });
});
