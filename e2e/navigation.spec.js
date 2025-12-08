const { test, expect, describe } = require('@playwright/test');

describe('Navigation - Desktop', () => {
  test('should display all 6 navigation links', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('.header__nav-link');
    await expect(navLinks).toHaveCount(6);
  });

  test('should navigate to Piscines page', async ({ page }) => {
    await page.goto('/');
    await page.click('.header__nav-link:has-text("Piscines")');
    await expect(page).toHaveURL(/.*piscines\.html/);
    await expect(page.locator('h1')).toContainText('Piscines');
  });

  test('should navigate to Aménagements page', async ({ page }) => {
    await page.goto('/');
    await page.click('.header__nav-link:has-text("Aménagements")');
    await expect(page).toHaveURL(/.*amenagements\.html/);
    await expect(page.locator('h1')).toContainText('Aménagements');
  });

  test('should navigate to Containers page', async ({ page }) => {
    await page.goto('/');
    await page.click('.header__nav-link:has-text("Containers")');
    await expect(page).toHaveURL(/.*containers\.html/);
    await expect(page.locator('h1')).toContainText('Containers');
  });

  test('should navigate to Réalisations page', async ({ page }) => {
    await page.goto('/');
    await page.click('.header__nav-link:has-text("Réalisations")');
    await expect(page).toHaveURL(/.*realisations\.html/);
    await expect(page.locator('h1')).toContainText('Réalisations');
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('.header__nav-link:has-text("Contact")');
    await expect(page).toHaveURL(/.*contact\.html/);
    await expect(page.locator('h1')).toContainText('Échangeons sur votre projet');
  });

  test('should return to homepage when clicking logo', async ({ page }) => {
    await page.goto('/piscines.html');
    await page.click('.header__logo');
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('should add scrolled class to header after 100px scroll', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('#header');
    await expect(header).not.toHaveClass(/scrolled/);
    
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    const scrollAmount = heroBox ? heroBox.height + 100 : 150;
    
    await page.evaluate((amount) => window.scrollTo(0, amount), scrollAmount);
    await page.waitForTimeout(100);
    await expect(header).toHaveClass(/scrolled/);
  });

  test('should remove scrolled class when scrolling back to top', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('#header');
    
    const hero = page.locator('.hero');
    const heroBox = await hero.boundingBox();
    const scrollAmount = heroBox ? heroBox.height + 100 : 150;
    
    await page.evaluate((amount) => window.scrollTo(0, amount), scrollAmount);
    await page.waitForTimeout(100);
    await expect(header).toHaveClass(/scrolled/);
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await expect(header).not.toHaveClass(/scrolled/);
  });

  test('should highlight active page in navigation', async ({ page }) => {
    await page.goto('/');
    const activeLink = page.locator('.header__nav-link.active');
    await expect(activeLink).toHaveText('Accueil');
  });
});

describe('Navigation - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    await expect(burger).toBeVisible();
  });

  test('should open mobile menu when clicking hamburger', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    const nav = page.locator('#nav');
    
    await expect(nav).not.toHaveClass(/active/);
    await burger.click();
    await expect(nav).toHaveClass(/active/);
    await expect(burger).toHaveClass(/active/);
  });

  test('should close mobile menu when clicking hamburger again', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    const nav = page.locator('#nav');
    
    await burger.click();
    await expect(nav).toHaveClass(/active/);
    
    await burger.click();
    await expect(nav).not.toHaveClass(/active/);
    await expect(burger).not.toHaveClass(/active/);
  });

  test('should close mobile menu when clicking outside', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    const nav = page.locator('#nav');
    
    await burger.click();
    await expect(nav).toHaveClass(/active/);
    
    await page.click('body', { position: { x: 10, y: 300 } });
    await page.waitForTimeout(100);
    await expect(nav).not.toHaveClass(/active/);
  });

  test('should navigate from mobile menu', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('#burger');
    
    await burger.click();
    await page.click('.header__nav-link:has-text("Piscines")');
    await expect(page).toHaveURL(/.*piscines\.html/);
  });
});
