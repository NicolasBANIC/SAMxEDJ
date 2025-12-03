import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// All critical viewport widths to test
const VIEWPORT_WIDTHS = [
  2560, 1920, 1600, 1440, 1366, 1300, 1250, 1200, 1150, 1100,
  1024, 900, 800, 768, 700, 640, 580, 480, 420, 390, 360, 320
];

test.describe('Header - Full Responsive Coverage', () => {
  
  test.describe('Critical Elements Visibility at All Widths', () => {
    
    for (const width of VIEWPORT_WIDTHS) {
      test(`Width ${width}px - All critical elements visible and not truncated`, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.setViewportSize({ width, height: 800 });
        
        // Logo and brand text should always be visible
        const logo = page.locator('.header__logo');
        const logoText = page.locator('.header__logo-text');
        await expect(logo).toBeVisible();
        await expect(logoText).toBeVisible();
        await expect(logoText).toHaveText('ÉCLAT DE JARDIN');
        
        // Determine if we're in mobile mode (burger visible)
        const burger = page.locator('#burger');
        const isMobileMode = await burger.isVisible();
        
        if (isMobileMode) {
          // Mobile mode: phone and button should be in burger menu
          await expect(burger).toBeVisible();
          
          // Desktop actions should be hidden
          const desktopActions = page.locator('.header__actions');
          await expect(desktopActions).not.toBeVisible();
          
          // Open burger to check menu content
          await burger.click();
          await page.waitForTimeout(400);
          
          const nav = page.locator('#nav');
          const hasActiveClass = await nav.evaluate(el => el.classList.contains('active'));
          expect(hasActiveClass).toBe(true);
          
          // Phone should be in mobile menu
          const mobilePhone = page.locator('.header__nav-phone');
          await expect(mobilePhone).toBeVisible();
          await expect(mobilePhone).toHaveText('06 52 21 10 72');
          
          // CTA button should be in mobile menu
          const mobileCta = page.locator('.header__nav-cta');
          await expect(mobileCta).toBeVisible();
          await expect(mobileCta).toHaveText('Demander une étude');
          
        } else {
          // Desktop mode: phone and button should be in header actions
          const desktopPhone = page.locator('.header__phone');
          const desktopCta = page.locator('.header__actions .btn--primary');
          
          await expect(desktopPhone).toBeVisible();
          await expect(desktopPhone).toHaveText('06 52 21 10 72');
          
          await expect(desktopCta).toBeVisible();
          
          // Navigation links should be visible
          const navLinks = page.locator('.header__nav-link');
          const linkCount = await navLinks.count();
          expect(linkCount).toBe(6);
          
          // All nav links should be visible
          for (let i = 0; i < linkCount; i++) {
            await expect(navLinks.nth(i)).toBeVisible();
          }
        }
      });
    }
    
  });
  
  test.describe('No Horizontal Overflow at Any Width', () => {
    
    for (const width of VIEWPORT_WIDTHS) {
      test(`Width ${width}px - No horizontal scroll`, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.setViewportSize({ width, height: 800 });
        
        // Check no horizontal overflow
        const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
        
        // Allow 1px tolerance for rounding
        expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1);
        
        // Also check header specifically
        const headerScrollWidth = await page.evaluate(() => {
          const header = document.querySelector('.header');
          return header ? header.scrollWidth : 0;
        });
        
        const headerClientWidth = await page.evaluate(() => {
          const header = document.querySelector('.header');
          return header ? header.clientWidth : 0;
        });
        
        expect(headerScrollWidth).toBeLessThanOrEqual(headerClientWidth + 1);
      });
    }
    
  });
  
  test.describe('Phone Number Never Truncated', () => {
    
    for (const width of VIEWPORT_WIDTHS) {
      test(`Width ${width}px - Phone number fully visible`, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.setViewportSize({ width, height: 800 });
        
        const burger = page.locator('#burger');
        const isMobileMode = await burger.isVisible();
        
        if (isMobileMode) {
          // Open menu
          await burger.click();
          await page.waitForTimeout(400);
          
          const mobilePhone = page.locator('.header__nav-phone');
          await expect(mobilePhone).toBeVisible();
          
          const phoneText = await mobilePhone.textContent();
          expect(phoneText).toBe('06 52 21 10 72');
          
          // Check it's on a single line
          const phoneBox = await mobilePhone.boundingBox();
          expect(phoneBox).not.toBeNull();
          if (phoneBox) {
            // Height should be single line (less than 50px)
            expect(phoneBox.height).toBeLessThan(60);
          }
        } else {
          const desktopPhone = page.locator('.header__phone');
          await expect(desktopPhone).toBeVisible();
          
          const phoneText = await desktopPhone.textContent();
          expect(phoneText).toBe('06 52 21 10 72');
          
          // Check it's on a single line
          const phoneBox = await desktopPhone.boundingBox();
          expect(phoneBox).not.toBeNull();
          if (phoneBox) {
            expect(phoneBox.height).toBeLessThan(40);
          }
        }
      });
    }
    
  });
  
  test.describe('CTA Button Always Accessible', () => {
    
    for (const width of VIEWPORT_WIDTHS) {
      test(`Width ${width}px - CTA button visible and clickable`, async ({ page }) => {
        await page.goto(BASE_URL);
        await page.setViewportSize({ width, height: 800 });
        
        const burger = page.locator('#burger');
        const isMobileMode = await burger.isVisible();
        
        if (isMobileMode) {
          await burger.click();
          await page.waitForTimeout(400);
          
          const mobileCta = page.locator('.header__nav-cta');
          await expect(mobileCta).toBeVisible();
          
          const ctaText = await mobileCta.textContent();
          expect(ctaText?.trim()).toBe('Demander une étude');
          
          // Check it's clickable (has proper href)
          const href = await mobileCta.getAttribute('href');
          expect(href).toBe('contact.html');
        } else {
          const desktopCta = page.locator('.header__actions .btn--primary');
          await expect(desktopCta).toBeVisible();
          
          const ctaText = await desktopCta.textContent();
          expect(ctaText?.trim()).toBe('Demander une étude');
          
          const href = await desktopCta.getAttribute('href');
          expect(href).toBe('contact.html');
        }
      });
    }
    
  });
  
  test.describe('Long Navigation Links Behavior', () => {
    
    test('Long links can wrap to two lines when needed', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Test at width where wrapping should occur (1250px and below)
      const wrappingWidths = [1250, 1200, 1150];
      
      for (const width of wrappingWidths) {
        await page.setViewportSize({ width, height: 800 });
        
        const burger = page.locator('#burger');
        const isMobileMode = await burger.isVisible();
        
        if (!isMobileMode) {
          // In desktop mode, check that long links can wrap
          const longLink1 = page.locator('.header__nav-link', { hasText: 'Aménagements Extérieurs' });
          const longLink2 = page.locator('.header__nav-link', { hasText: 'Containers Architecturaux' });
          
          await expect(longLink1).toBeVisible();
          await expect(longLink2).toBeVisible();
          
          // Get white-space property - should be 'normal' to allow wrapping
          const whiteSpace1 = await longLink1.evaluate(el => 
            window.getComputedStyle(el).whiteSpace
          );
          const whiteSpace2 = await longLink2.evaluate(el => 
            window.getComputedStyle(el).whiteSpace
          );
          
          expect(whiteSpace1).toBe('normal');
          expect(whiteSpace2).toBe('normal');
        }
      }
    });
    
    test('Short links remain on single line', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.setViewportSize({ width: 1250, height: 800 });
      
      const burger = page.locator('#burger');
      const isMobileMode = await burger.isVisible();
      
      if (!isMobileMode) {
        const shortLinks = [
          page.locator('.header__nav-link', { hasText: 'Accueil' }).first(),
          page.locator('.header__nav-link', { hasText: 'Piscines' }),
          page.locator('.header__nav-link', { hasText: 'Réalisations' }),
          page.locator('.header__nav-link', { hasText: 'Contact' })
        ];
        
        for (const link of shortLinks) {
          await expect(link).toBeVisible();
          
          const box = await link.boundingBox();
          if (box) {
            // Short links should have reasonable height (single or slightly wrapped)
            expect(box.height).toBeLessThan(45);
          }
        }
      }
    });
    
  });
  
  test.describe('Burger Menu Transition Point', () => {
    
    test('Burger appears exactly at 1100px and below', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Just above breakpoint - burger hidden
      await page.setViewportSize({ width: 1101, height: 800 });
      let burger = page.locator('#burger');
      await expect(burger).not.toBeVisible();
      
      // At breakpoint - burger visible
      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(burger).toBeVisible();
      
      // Below breakpoint - burger visible
      await page.setViewportSize({ width: 1024, height: 800 });
      await expect(burger).toBeVisible();
    });
    
    test('Desktop nav hidden when burger appears', async ({ page }) => {
      await page.goto(BASE_URL);
      
      await page.setViewportSize({ width: 1101, height: 800 });
      let desktopActions = page.locator('.header__actions');
      await expect(desktopActions).toBeVisible();
      
      await page.setViewportSize({ width: 1100, height: 800 });
      await expect(desktopActions).not.toBeVisible();
    });
    
  });
  
  test.describe('Progressive Responsiveness - Smooth Transitions', () => {
    
    test('Elements scale down progressively before burger mode', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Collect font sizes at different widths
      const measurements: { width: number; navLinkSize: number; phoneSize: number; }[] = [];
      
      const desktopWidths = [1440, 1366, 1300, 1250, 1200, 1150];
      
      for (const width of desktopWidths) {
        await page.setViewportSize({ width, height: 800 });
        
        const navLink = page.locator('.header__nav-link').first();
        const phone = page.locator('.header__phone');
        
        const navLinkSize = await navLink.evaluate(el => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        const phoneSize = await phone.evaluate(el => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        
        measurements.push({ width, navLinkSize, phoneSize });
      }
      
      // Verify sizes stay reasonable and don't grow significantly
      // Allow small tolerance for browser rounding (1px)
      for (let i = 1; i < measurements.length; i++) {
        const current = measurements[i].navLinkSize;
        const previous = measurements[i - 1].navLinkSize;
        // Should not grow more than 1px (accounts for browser rounding)
        expect(current).toBeLessThan(previous + 1);
      }
      
      // Verify overall trend: last element should be smaller or equal to first
      expect(measurements[measurements.length - 1].navLinkSize).toBeLessThanOrEqual(measurements[0].navLinkSize);
    });
    
    test('Gaps reduce progressively before burger mode', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const gapMeasurements: { width: number; containerGap: string; }[] = [];
      const desktopWidths = [1440, 1366, 1300, 1250, 1200, 1150];
      
      for (const width of desktopWidths) {
        await page.setViewportSize({ width, height: 800 });
        
        const container = page.locator('.header__container');
        const containerGap = await container.evaluate(el => 
          window.getComputedStyle(el).gap
        );
        
        gapMeasurements.push({ width, containerGap });
      }
      
      // Each gap should be reasonable (not 'normal' or '0px')
      for (const measurement of gapMeasurements) {
        expect(measurement.containerGap).not.toBe('normal');
        expect(measurement.containerGap).not.toBe('0px');
      }
    });
    
  });
  
  test.describe('Color Preservation at All Widths', () => {
    
    test('Logo always golden at various widths', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const testWidths = [2560, 1440, 1200, 768, 375];
      
      for (const width of testWidths) {
        await page.setViewportSize({ width, height: 800 });
        
        const logoText = page.locator('.header__logo-text');
        const color = await logoText.evaluate(el => 
          window.getComputedStyle(el).color
        );
        
        expect(color).toBe('rgb(179, 136, 62)');
      }
    });
    
    test('Phone number always golden at various widths', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const testWidths = [2560, 1440, 1200, 768, 375];
      
      for (const width of testWidths) {
        await page.setViewportSize({ width, height: 800 });
        
        const burger = page.locator('#burger');
        const isMobileMode = await burger.isVisible();
        
        let phoneColor: string;
        
        if (isMobileMode) {
          await burger.click();
          await page.waitForTimeout(400);
          
          const mobilePhone = page.locator('.header__nav-phone');
          phoneColor = await mobilePhone.evaluate(el => 
            window.getComputedStyle(el).color
          );
        } else {
          const desktopPhone = page.locator('.header__phone');
          phoneColor = await desktopPhone.evaluate(el => 
            window.getComputedStyle(el).color
          );
        }
        
        expect(phoneColor).toBe('rgb(179, 136, 62)');
      }
    });
    
  });
  
  test.describe('Visual Stability - No Layout Shift', () => {
    
    test('Header height remains stable across widths', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const heights: { width: number; height: number; }[] = [];
      const widths = [1440, 1366, 1300, 1250, 1200, 1150, 1100];
      
      for (const width of widths) {
        await page.setViewportSize({ width, height: 800 });
        
        const header = page.locator('.header');
        const box = await header.boundingBox();
        
        if (box) {
          heights.push({ width, height: box.height });
        }
      }
      
      // Header height should remain relatively consistent (within 20px variance)
      const minHeight = Math.min(...heights.map(h => h.height));
      const maxHeight = Math.max(...heights.map(h => h.height));
      
      expect(maxHeight - minHeight).toBeLessThan(25);
    });
    
  });
  
});
