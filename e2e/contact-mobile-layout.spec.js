const { test, expect, describe } = require('@playwright/test');

describe('Contact Page - Mobile Layout Consistency', () => {
  
  describe('Mobile 375px - Full Width Behavior', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should have contact-page class on body', async ({ page }) => {
      await page.goto('/contact.html');
      const body = page.locator('body');
      await expect(body).toHaveClass(/contact-page/);
    });

    test('all containers should be full-width with no horizontal padding', async ({ page }) => {
      await page.goto('/contact.html');
      await page.waitForLoadState('networkidle');
      
      const containers = page.locator('body.contact-page .container');
      const count = await containers.count();
      
      for (let i = 0; i < count; i++) {
        const container = containers.nth(i);
        const styles = await container.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            maxWidth: computed.maxWidth,
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight,
            width: el.getBoundingClientRect().width
          };
        });
        
        expect(styles.paddingLeft).toBe('0px');
        expect(styles.paddingRight).toBe('0px');
        expect(styles.width).toBeGreaterThanOrEqual(370);
      }
    });

    test('hero section should span full width', async ({ page }) => {
      await page.goto('/contact.html');
      const hero = page.locator('.page-hero');
      await expect(hero).toBeVisible();
      
      const heroWidth = await hero.evaluate(el => el.getBoundingClientRect().width);
      expect(heroWidth).toBe(375);
    });

    test('contact form section should span full width', async ({ page }) => {
      await page.goto('/contact.html');
      const contactSection = page.locator('.contact-section');
      await expect(contactSection).toBeVisible();
      
      const sectionWidth = await contactSection.evaluate(el => el.getBoundingClientRect().width);
      expect(sectionWidth).toBe(375);
    });

    test('map section should span full width', async ({ page }) => {
      await page.goto('/contact.html');
      const mapSection = page.locator('.map-section');
      await expect(mapSection).toBeVisible();
      
      const mapWidth = await mapSection.evaluate(el => el.getBoundingClientRect().width);
      expect(mapWidth).toBeGreaterThanOrEqual(370);
    });

    test('footer should span full width', async ({ page }) => {
      await page.goto('/contact.html');
      const footer = page.locator('.footer');
      await expect(footer).toBeVisible();
      
      const footerWidth = await footer.evaluate(el => el.getBoundingClientRect().width);
      expect(footerWidth).toBe(375);
    });

    test('no horizontal scrollbar should appear', async ({ page }) => {
      await page.goto('/contact.html');
      await page.waitForLoadState('networkidle');
      
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(375);
    });

    test('all sections should have consistent horizontal alignment', async ({ page }) => {
      await page.goto('/contact.html');
      await page.waitForLoadState('networkidle');
      
      const hero = page.locator('.page-hero');
      const contactSection = page.locator('.contact-section');
      const footer = page.locator('.footer');
      
      const heroLeft = await hero.evaluate(el => el.getBoundingClientRect().left);
      const contactLeft = await contactSection.evaluate(el => el.getBoundingClientRect().left);
      const footerLeft = await footer.evaluate(el => el.getBoundingClientRect().left);
      
      expect(heroLeft).toBe(0);
      expect(contactLeft).toBe(0);
      expect(footerLeft).toBe(0);
    });
  });

  describe('Mobile 768px - Full Width Behavior', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('all containers should be full-width', async ({ page }) => {
      await page.goto('/contact.html');
      await page.waitForLoadState('networkidle');
      
      const containers = page.locator('body.contact-page .container');
      const count = await containers.count();
      
      for (let i = 0; i < count; i++) {
        const container = containers.nth(i);
        const styles = await container.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            paddingLeft: computed.paddingLeft,
            paddingRight: computed.paddingRight
          };
        });
        
        expect(styles.paddingLeft).toBe('0px');
        expect(styles.paddingRight).toBe('0px');
      }
    });

    test('sections should align consistently', async ({ page }) => {
      await page.goto('/contact.html');
      await page.waitForLoadState('networkidle');
      
      const hero = page.locator('.page-hero');
      const contactSection = page.locator('.contact-section');
      const mapSection = page.locator('.map-section');
      const footer = page.locator('.footer');
      
      const heroLeft = await hero.evaluate(el => el.getBoundingClientRect().left);
      const contactLeft = await contactSection.evaluate(el => el.getBoundingClientRect().left);
      const mapLeft = await mapSection.evaluate(el => el.getBoundingClientRect().left);
      const footerLeft = await footer.evaluate(el => el.getBoundingClientRect().left);
      
      expect(heroLeft).toBe(0);
      expect(contactLeft).toBe(0);
      expect(mapLeft).toBeLessThanOrEqual(5);
      expect(footerLeft).toBe(0);
    });
  });

  describe('Desktop 1920px - Normal Container Behavior', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('containers should have normal max-width on desktop', async ({ page }) => {
      await page.goto('/contact.html');
      await page.waitForLoadState('networkidle');
      
      const container = page.locator('.container').first();
      const maxWidth = await container.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return computed.maxWidth;
      });
      
      expect(maxWidth).not.toBe('100%');
    });

    test('containers should be centered on desktop', async ({ page }) => {
      await page.goto('/contact.html');
      const container = page.locator('.footer .container');
      
      const box = await container.boundingBox();
      expect(box.x).toBeGreaterThan(100);
    });
  });

  describe('Isolation - Other Pages Should Not Be Affected', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('index page should NOT have contact-page class', async ({ page }) => {
      await page.goto('/');
      const body = page.locator('body');
      const hasClass = await body.evaluate(el => el.classList.contains('contact-page'));
      expect(hasClass).toBe(false);
    });

    test('index page containers should have normal padding on mobile', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('.footer .container');
      await expect(footer).toBeVisible();
      
      const paddingLeft = await footer.evaluate(el => {
        return window.getComputedStyle(el).paddingLeft;
      });
      
      expect(paddingLeft).not.toBe('0px');
    });

    test('piscines page should NOT have contact-page class', async ({ page }) => {
      await page.goto('/piscines.html');
      const body = page.locator('body');
      const hasClass = await body.evaluate(el => el.classList.contains('contact-page'));
      expect(hasClass).toBe(false);
    });
  });

  describe('Functional - Contact Form Still Works', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('contact form should be visible and functional', async ({ page }) => {
      await page.goto('/contact.html');
      const form = page.locator('#contact-form');
      await expect(form).toBeVisible();
      
      await page.fill('#nom', 'Test');
      await page.fill('#prenom', 'User');
      await page.fill('#email', 'test@example.com');
      await page.fill('#telephone', '0612345678');
      
      const nomValue = await page.inputValue('#nom');
      expect(nomValue).toBe('Test');
    });

    test('form inputs should be tappable on mobile', async ({ page }) => {
      await page.goto('/contact.html');
      
      const inputs = ['#nom', '#prenom', '#email', '#telephone'];
      
      for (const selector of inputs) {
        const input = page.locator(selector);
        await expect(input).toBeVisible();
        const box = await input.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(30);
      }
    });
  });

  describe('Visual Consistency - No Layout Shifts', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('hero content should be properly aligned', async ({ page }) => {
      await page.goto('/contact.html');
      const heroContent = page.locator('.page-hero__content');
      await expect(heroContent).toBeVisible();
      
      const styles = await heroContent.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          paddingLeft: computed.paddingLeft,
          paddingRight: computed.paddingRight,
          maxWidth: computed.maxWidth
        };
      });
      
      expect(styles.paddingLeft).toBe('20px');
      expect(styles.paddingRight).toBe('20px');
    });

    test('contact cards should not have border-radius on mobile', async ({ page }) => {
      await page.goto('/contact.html');
      
      const contactForm = page.locator('.contact-form');
      const infoCard = page.locator('.info-card').first();
      
      const formRadius = await contactForm.evaluate(el => window.getComputedStyle(el).borderRadius);
      const cardRadius = await infoCard.evaluate(el => window.getComputedStyle(el).borderRadius);
      
      expect(formRadius).toBe('0px');
      expect(cardRadius).toBe('0px');
    });
  });
});
