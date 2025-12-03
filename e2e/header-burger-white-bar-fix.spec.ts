import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

const MOBILE_WIDTHS = [1100, 1024, 768, 480, 390, 360];

test.describe('Header Burger Mode - White Bar Fix', () => {
  
  test.describe('Border Removal Verification', () => {
    
    for (const width of MOBILE_WIDTHS) {
      test(`Width ${width}px - No white border-bottom on header`, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.setViewportSize({ width, height: 800 });
        
        await page.evaluate(() => window.scrollTo(0, 150));
        await page.waitForTimeout(500);
        
        const header = page.locator('.header');
        const hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
        expect(hasScrolledClass).toBe(true);
        
        const headerStyles = await header.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            borderBottom: computed.borderBottom,
            borderBottomWidth: computed.borderBottomWidth,
            borderBottomStyle: computed.borderBottomStyle,
            boxShadow: computed.boxShadow
          };
        });
        
        expect(headerStyles.borderBottomWidth).toBe('0px');
        expect(headerStyles.borderBottomStyle).toBe('none');
        
        expect(headerStyles.boxShadow).not.toBe('none');
      });
    }
    
  });
  
  test.describe('Mobile Menu Border Verification', () => {
    
    for (const width of MOBILE_WIDTHS) {
      test(`Width ${width}px - No unwanted border on nav panel`, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.setViewportSize({ width, height: 800 });
        
        const burger = page.locator('#burger');
        await expect(burger).toBeVisible();
        
        await burger.click();
        await page.waitForTimeout(400);
        
        const nav = page.locator('#nav');
        const hasActiveClass = await nav.evaluate(el => el.classList.contains('active'));
        expect(hasActiveClass).toBe(true);
        
        const navStyles = await nav.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            borderBottom: computed.borderBottom,
            borderBottomWidth: computed.borderBottomWidth,
            borderBottomStyle: computed.borderBottomStyle,
            boxShadow: computed.boxShadow
          };
        });
        
        const hasBorderBottom = navStyles.borderBottomWidth !== '0px' && navStyles.borderBottomStyle !== 'none';
        expect(hasBorderBottom).toBe(false);
        
        expect(navStyles.boxShadow).not.toBe('none');
      });
    }
    
  });
  
  test.describe('Visual Stability - No Artifacts', () => {
    
    test('768px - Menu toggle without visual artifacts', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(500);
      
      const burger = page.locator('#burger');
      const nav = page.locator('#nav');
      
      await burger.click();
      await page.waitForTimeout(400);
      
      let navVisible = await nav.evaluate(el => el.classList.contains('active'));
      expect(navVisible).toBe(true);
      
      const headerRect = await page.locator('.header').boundingBox();
      const navRect = await nav.boundingBox();
      
      expect(navRect).not.toBeNull();
      expect(headerRect).not.toBeNull();
      
      if (headerRect && navRect) {
        expect(navRect.y).toBeGreaterThanOrEqual(headerRect.y + headerRect.height - 15);
      }
      
      await burger.click();
      await page.waitForTimeout(400);
      
      navVisible = await nav.evaluate(el => el.classList.contains('active'));
      expect(navVisible).toBe(false);
    });
    
    test('480px - Scroll state does not create border', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 480, height: 800 });
      
      const header = page.locator('.header');
      
      const initialStyles = await header.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.borderBottomWidth;
      });
      
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(200);
      
      const scrolledStyles = await header.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.borderBottomWidth;
      });
      
      expect(scrolledStyles).toBe('0px');
      expect(initialStyles).toBe('0px');
    });
    
  });
  
  test.describe('Premium Effect Preservation', () => {
    
    test('768px - Glassmorphism and shadow intact after scroll', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(500);
      
      const header = page.locator('.header');
      const hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(true);
      
      const headerStyles = await header.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
          boxShadow: computed.boxShadow,
          background: computed.background
        };
      });
      
      expect(headerStyles.backdropFilter).toContain('blur');
      expect(headerStyles.boxShadow).not.toBe('none');
      expect(headerStyles.boxShadow).toContain('rgba');
      
      const burger = page.locator('#burger');
      await burger.click();
      await page.waitForTimeout(400);
      
      const navStyles = await page.locator('#nav').evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backdropFilter: computed.backdropFilter || computed.webkitBackdropFilter,
          boxShadow: computed.boxShadow,
          background: computed.background
        };
      });
      
      expect(navStyles.backdropFilter).toContain('blur');
      expect(navStyles.boxShadow).not.toBe('none');
      expect(navStyles.background).toContain('rgba');
    });
    
    test('390px - Shadow quality on mobile after scroll', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 390, height: 800 });
      
      await page.evaluate(() => window.scrollTo(0, 150));
      await page.waitForTimeout(500);
      
      const header = page.locator('.header');
      const hasScrolledClass = await header.evaluate(el => el.classList.contains('scrolled'));
      expect(hasScrolledClass).toBe(true);
      
      const headerShadow = await header.evaluate(el => {
        return window.getComputedStyle(el).boxShadow;
      });
      
      expect(headerShadow).not.toBe('none');
      
      const shadowValues = headerShadow.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      expect(shadowValues).not.toBeNull();
      
      if (shadowValues) {
        const alpha = parseFloat(shadowValues[4]);
        expect(alpha).toBeGreaterThan(0);
        expect(alpha).toBeLessThanOrEqual(0.12);
      }
    });
    
  });
  
  test.describe('Functional Integrity', () => {
    
    test('Menu functionality preserved after fix', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 768, height: 800 });
      
      const burger = page.locator('#burger');
      const nav = page.locator('#nav');
      const phone = page.locator('.header__nav-phone');
      const cta = page.locator('.header__nav-cta');
      
      await burger.click();
      await page.waitForTimeout(400);
      
      await expect(nav).toHaveClass(/active/);
      await expect(phone).toBeVisible();
      await expect(cta).toBeVisible();
      
      await expect(phone).toHaveText('06 52 21 10 72');
      await expect(cta).toHaveText('Demander une étude');
      
      const navLinks = page.locator('.header__nav-link');
      const linkCount = await navLinks.count();
      expect(linkCount).toBe(6);
      
      for (let i = 0; i < linkCount; i++) {
        await expect(navLinks.nth(i)).toBeVisible();
      }
    });
    
  });
  
});
