import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { path: '/', name: 'index' },
  { path: '/piscines.html', name: 'piscines' },
  { path: '/amenagements.html', name: 'amenagements' },
  { path: '/containers.html', name: 'containers' },
  { path: '/realisations.html', name: 'realisations' },
  { path: '/contact.html', name: 'contact' }
];

test.describe('Header Responsive Redesign', () => {
  
  test.describe('Breakpoint Transitions', () => {
    
    test('burger appears at 1100px and below', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Desktop - burger hidden
      await page.setViewportSize({ width: 1200, height: 800 });
      const burgerDesktop = page.locator('#burger');
      await expect(burgerDesktop).not.toBeVisible();
      
      // Just below breakpoint - burger visible
      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(burgerDesktop).toBeVisible();
      
      // Mobile - burger visible
      await page.setViewportSize({ width: 768, height: 800 });
      await expect(burgerDesktop).toBeVisible();
    });
    
    test('desktop navigation hidden at 1100px and below', async ({ page }) => {
      await page.goto(BASE_URL);
      
      await page.setViewportSize({ width: 1200, height: 800 });
      const desktopActions = page.locator('.header__actions');
      await expect(desktopActions).toBeVisible();
      
      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(desktopActions).not.toBeVisible();
    });
    
    test('no horizontal overflow at intermediate widths', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const widths = [1200, 1100, 1024, 900, 768];
      
      for (const width of widths) {
        await page.setViewportSize({ width, height: 800 });
        
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
        
        expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1);
      }
    });
    
  });
  
  test.describe('Mobile Menu Positioning', () => {
    
    test('mobile menu deploys below header, not overlapping', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const nav = page.locator('#nav');
      const header = page.locator('#header');
      
      // Open menu
      await burger.click();
      await expect(nav).toHaveClass(/active/);
      
      // Check CSS positioning - menu should be positioned at or below header height
      const navTop = await nav.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return parseInt(style.top);
      });
      
      // Menu positioned at 85px from top, which is below typical header height
      expect(navTop).toBeGreaterThanOrEqual(70);
      expect(navTop).toBeLessThanOrEqual(100);
    });
    
    test('logo remains visible when mobile menu is open', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const logo = page.locator('.header__logo');
      const logoText = page.locator('.header__logo-text');
      
      await burger.click();
      
      // Logo and text should be visible
      await expect(logo).toBeVisible();
      await expect(logoText).toBeVisible();
      
      // Logo text should have golden color
      const logoColor = await logoText.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      expect(logoColor).toBe('rgb(179, 136, 62)');
    });
    
    test('mobile menu has fixed positioning with correct z-index', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const nav = page.locator('#nav');
      
      const position = await nav.evaluate((el) => window.getComputedStyle(el).position);
      const zIndex = await nav.evaluate((el) => window.getComputedStyle(el).zIndex);
      
      expect(position).toBe('fixed');
      expect(parseInt(zIndex)).toBe(999);
    });
    
  });
  
  test.describe('Mobile Menu Content', () => {
    
    test('mobile menu contains all navigation links', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      await burger.click();
      
      const nav = page.locator('#nav');
      
      const links = [
        'Accueil',
        'Piscines',
        'Aménagements Extérieurs',
        'Containers Architecturaux',
        'Réalisations',
        'Contact'
      ];
      
      for (const linkText of links) {
        const link = nav.locator('.header__nav-link', { hasText: linkText });
        await expect(link).toBeVisible();
      }
    });
    
    test('mobile menu contains phone number', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      await burger.click();
      
      const phone = page.locator('.header__nav-phone');
      await expect(phone).toBeVisible();
      await expect(phone).toHaveText('06 52 21 10 72');
      
      // Phone should be golden
      const phoneColor = await phone.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      expect(phoneColor).toBe('rgb(179, 136, 62)');
    });
    
    test('mobile menu contains CTA button', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      await burger.click();
      
      const cta = page.locator('.header__nav-cta');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveText('Demander une étude');
      await expect(cta).toHaveAttribute('href', 'contact.html');
    });
    
    test('mobile menu phone number is always on one line', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const widths = [375, 360, 320];
      
      for (const width of widths) {
        await page.setViewportSize({ width, height: 800 });
        
        const burger = page.locator('#burger');
        await burger.click();
        
        const phone = page.locator('.header__nav-phone');
        const phoneBox = await phone.boundingBox();
        
        expect(phoneBox).not.toBeNull();
        if (phoneBox) {
          // Height should be single line (roughly 20-50px)
          expect(phoneBox.height).toBeLessThan(60);
        }
        
        await burger.click(); // Close menu
      }
    });
    
    test('mobile menu actions container has proper separator', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      await burger.click();
      
      const actions = page.locator('.header__nav-actions');
      await expect(actions).toBeVisible();
      
      const borderTop = await actions.evaluate((el) => 
        window.getComputedStyle(el).borderTopWidth
      );
      
      expect(borderTop).not.toBe('0px');
    });
    
  });
  
  test.describe('Glassmorphism Background', () => {
    
    test('mobile menu has backdrop-filter blur effect', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const nav = page.locator('#nav');
      
      const backdropFilter = await nav.evaluate((el) => 
        window.getComputedStyle(el).backdropFilter || window.getComputedStyle(el).webkitBackdropFilter
      );
      
      expect(backdropFilter).toContain('blur');
    });
    
    test('mobile menu has semi-transparent background', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const nav = page.locator('#nav');
      
      const backgroundColor = await nav.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Should be rgba with alpha < 1
      expect(backgroundColor).toMatch(/rgba\(.*,\s*0\.\d+\)/);
    });
    
    test('mobile menu has no unwanted border', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const nav = page.locator('#nav');
      
      const borderBottom = await nav.evaluate((el) => 
        window.getComputedStyle(el).borderBottomWidth
      );
      
      expect(borderBottom).toBe('0px');
    });
    
  });
  
  test.describe('Color Preservation', () => {
    
    test('logo text always golden on mobile', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const logoText = page.locator('.header__logo-text');
      
      // Initial state
      let color = await logoText.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      expect(color).toBe('rgb(179, 136, 62)');
      
      // After scroll
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(400);
      
      color = await logoText.evaluate((el) => 
        window.getComputedStyle(el).color
      );
      expect(color).toBe('rgb(179, 136, 62)');
    });
    
    test('desktop phone always golden on all pages', async ({ page }) => {
      for (const pageInfo of PAGES) {
        await page.goto(`${BASE_URL}${pageInfo.path}`);
        await page.setViewportSize({ width: 1400, height: 800 });
        
        const phone = page.locator('.header__phone');
        
        const color = await phone.evaluate((el) => 
          window.getComputedStyle(el).color
        );
        expect(color).toBe('rgb(179, 136, 62)');
      }
    });
    
    test('mobile menu links are anthracite, not white', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      await burger.click();
      
      // Wait for menu animation
      await page.waitForTimeout(500);
      
      // Check a non-active link (second link: Piscines)
      const nonActiveLink = page.locator('.header__nav-link').nth(1);
      
      const color = await nonActiveLink.evaluate((el) => {
        const computed = window.getComputedStyle(el).color;
        const cssColor = getComputedStyle(el).getPropertyValue('color');
        return computed;
      });
      
      // Should be anthracite (dark gray), not white or light gray
      // Accepting rgb(51, 56, 59) or similar dark values
      const rgb = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
      if (rgb) {
        const r = parseInt(rgb[1]);
        const g = parseInt(rgb[2]);
        const b = parseInt(rgb[3]);
        
        // All values should be dark (< 100 for anthracite)
        expect(r).toBeLessThan(100);
        expect(g).toBeLessThan(100);
        expect(b).toBeLessThan(100);
      }
    });
    
  });
  
  test.describe('Burger Menu Animation', () => {
    
    test('burger transforms to X when active', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const spans = burger.locator('span');
      
      // Before click
      const initialOpacity = await spans.nth(1).evaluate((el) => 
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(initialOpacity)).toBe(1);
      
      // After click
      await burger.click();
      
      // Check burger has active class
      await expect(burger).toHaveClass(/active/);
      
      // Wait for transition
      await page.waitForTimeout(400);
      
      const middleOpacity = await spans.nth(1).evaluate((el) => 
        window.getComputedStyle(el).opacity
      );
      expect(parseFloat(middleOpacity)).toBe(0);
    });
    
    test('burger color changes with scroll state', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burgerSpan = page.locator('#burger span').first();
      
      // Initial - white
      let bgColor = await burgerSpan.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toBe('rgb(255, 255, 255)');
      
      // After scroll - anthracite (dark gray)
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(400);
      
      bgColor = await burgerSpan.evaluate((el) => 
        window.getComputedStyle(el).backgroundColor
      );
      
      // Check it's anthracite-like (dark gray), allowing for slight browser variations
      expect(bgColor).toMatch(/rgb\((5[0-5]|4[8-9]), (5[5-9]|6[0-2]), (5[8-9]|6[0-3])\)/);
    });
    
  });
  
  test.describe('Menu Toggle Functionality', () => {
    
    test('clicking burger opens menu', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const nav = page.locator('#nav');
      
      await expect(nav).not.toHaveClass(/active/);
      
      await burger.click();
      
      await expect(nav).toHaveClass(/active/);
    });
    
    test('clicking burger again closes menu', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const nav = page.locator('#nav');
      
      await burger.click();
      await expect(nav).toHaveClass(/active/);
      
      await burger.click();
      await expect(nav).not.toHaveClass(/active/);
    });
    
    test('clicking outside menu closes it', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const nav = page.locator('#nav');
      
      await burger.click();
      await expect(nav).toHaveClass(/active/);
      
      // Click outside (on hero section)
      await page.locator('.hero').click({ position: { x: 100, y: 300 } });
      
      await expect(nav).not.toHaveClass(/active/);
    });
    
  });
  
  test.describe('Responsive Behavior Across Widths', () => {
    
    test('no overflow at extreme small widths', async ({ page }) => {
      await page.goto(BASE_URL);
      
      await page.setViewportSize({ width: 320, height: 568 });
      
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1);
      
      // Logo should still be visible
      const logo = page.locator('.header__logo');
      await expect(logo).toBeVisible();
    });
    
    test('no overflow at extreme large widths', async ({ page }) => {
      await page.goto(BASE_URL);
      
      await page.setViewportSize({ width: 2560, height: 1440 });
      
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1);
    });
    
    test('header elements properly sized on small mobile', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 375, height: 667 });
      
      const logoText = page.locator('.header__logo-text');
      const logoImg = page.locator('.header__logo-img');
      
      await expect(logoText).toBeVisible();
      await expect(logoImg).toBeVisible();
      
      const logoBox = await logoImg.boundingBox();
      expect(logoBox).not.toBeNull();
    });
    
  });
  
  test.describe('All Pages Consistency', () => {
    
    test('mobile menu structure identical on all pages', async ({ page }) => {
      for (const pageInfo of PAGES) {
        await page.goto(`${BASE_URL}${pageInfo.path}`);
        await page.setViewportSize({ width: 768, height: 800 });
        
        const burger = page.locator('#burger');
        await burger.click();
        
        // Check all elements present
        await expect(page.locator('.header__nav-actions')).toBeVisible();
        await expect(page.locator('.header__nav-phone')).toBeVisible();
        await expect(page.locator('.header__nav-cta')).toBeVisible();
        
        const navLinks = page.locator('.header__nav-link');
        expect(await navLinks.count()).toBe(6);
        
        await burger.click(); // Close for next iteration
      }
    });
    
    test('glassmorphism applied on all pages', async ({ page }) => {
      for (const pageInfo of PAGES) {
        await page.goto(`${BASE_URL}${pageInfo.path}`);
        await page.setViewportSize({ width: 768, height: 800 });
        
        const nav = page.locator('#nav');
        
        const backdropFilter = await nav.evaluate((el) => 
          window.getComputedStyle(el).backdropFilter || window.getComputedStyle(el).webkitBackdropFilter
        );
        
        expect(backdropFilter).toContain('blur');
      }
    });
    
  });
  
});
