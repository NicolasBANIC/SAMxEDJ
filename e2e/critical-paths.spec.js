const { test, expect, describe } = require('@playwright/test');

describe('Critical User Paths', () => {
  test('Path 1: Homepage → Piscines → Contact (devis piscine)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero__title')).toBeVisible();
    
    await page.click('.header__nav-link:has-text("Piscines")');
    await expect(page).toHaveURL(/.*piscines\.html/);
    await expect(page.locator('h1')).toBeVisible();
    
    await page.click('.header__nav-link:has-text("Contact")');
    await expect(page).toHaveURL(/.*contact\.html/);
    await expect(page.locator('#contact-form')).toBeVisible();
    
    await page.selectOption('select[name="projet"]', 'piscine-coque');
    const selectedValue = await page.locator('select[name="projet"]').inputValue();
    expect(selectedValue).toBe('piscine-coque');
  });

  test('Path 2: Homepage → Réalisations → Filter Piscines → Contact', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero__title')).toBeVisible();
    
    await page.click('.header__nav-link:has-text("Réalisations")');
    await expect(page).toHaveURL(/.*realisations\.html/);
    await page.waitForTimeout(500);
    
    await page.click('.filter-btn[data-filter="piscine"]');
    await page.waitForTimeout(500);
    await expect(page.locator('.filter-btn[data-filter="piscine"]')).toHaveClass(/active/);
    
    const visiblePiscineItems = page.locator('.gallery-item[data-category="piscine"]');
    expect(await visiblePiscineItems.count()).toBeGreaterThan(0);
    
    await page.click('.header__nav-link:has-text("Contact")');
    await expect(page).toHaveURL(/.*contact\.html/);
  });

  test('Path 3: Homepage → Chatbot "prix piscine" → Contact', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(500);
    
    await page.click('#chatbot-button');
    await page.waitForTimeout(400);
    await expect(page.locator('#chatbot-panel')).toHaveClass(/active/);
    
    await page.fill('#chatbot-input', 'prix piscine');
    await page.click('.chatbot__submit');
    await page.waitForTimeout(800);
    
    const botMessages = page.locator('.chatbot__message--bot');
    const lastMessage = botMessages.last();
    const text = await lastMessage.textContent();
    expect(text).toMatch(/€|euro|prix|budget/i);
    
    const chatbotClose = page.locator('#chatbot-close');
    await chatbotClose.scrollIntoViewIfNeeded();
    await chatbotClose.click({ force: true });
    await page.waitForTimeout(300);
    await expect(page.locator('#chatbot-panel')).not.toHaveClass(/active/);
    
    await page.click('.header__nav-link:has-text("Contact")');
    await expect(page).toHaveURL(/.*contact\.html/);
  });

  test('Path 4: Mobile Menu → Navigation → Close', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.click('#burger');
    await expect(page.locator('#nav')).toHaveClass(/active/);
    
    await page.click('.header__nav-link:has-text("Piscines")');
    await expect(page).toHaveURL(/.*piscines\.html/);
    
    await page.click('#burger');
    await expect(page.locator('#nav')).toHaveClass(/active/);
    
    await page.click('.header__nav-link:has-text("Réalisations")');
    await expect(page).toHaveURL(/.*realisations\.html/);
  });

  test('Path 5: Homepage → Univers Card Click → Service Page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(800);
    
    await page.click('.univers__card:has-text("Piscines")');
    await expect(page).toHaveURL(/.*piscines\.html/);
  });

  test('Path 6: Logo always returns to homepage', async ({ page }) => {
    await page.goto('/piscines.html');
    await page.click('.header__logo');
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);
    
    await page.goto('/contact.html');
    await page.click('.header__logo');
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);
    
    await page.goto('/realisations.html');
    await page.click('.header__logo');
    await expect(page).toHaveURL(/.*index\.html|.*\/$/);
  });

  test('Path 7: Complete contact form flow', async ({ page }) => {
    await page.goto('/contact.html');
    
    await page.fill('input[name="nom"]', 'Dupont');
    await page.fill('input[name="prenom"]', 'Jean');
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="telephone"]', '0612345678');
    await page.fill('input[name="adresse"]', '10 Rue de la Paix, 67000 Strasbourg');
    await page.selectOption('select[name="projet"]', 'piscine-maconnee');
    await page.fill('textarea[name="message"]', 'Je souhaite obtenir un devis pour une piscine maçonnée de 10x5m avec terrasse bois.');
    
    expect(await page.locator('input[name="nom"]').inputValue()).toBe('Dupont');
    expect(await page.locator('input[name="email"]').inputValue()).toBe('jean.dupont@example.com');
    expect(await page.locator('select[name="projet"]').inputValue()).toBe('piscine-maconnee');
  });

  test('Path 8: Browse all main pages in sequence', async ({ page }) => {
    const pages = [
      { url: '/', selector: '.hero__title' },
      { url: '/piscines.html', selector: 'h1' },
      { url: '/amenagements.html', selector: 'h1' },
      { url: '/containers.html', selector: 'h1' },
      { url: '/realisations.html', selector: '.gallery-item', expectFirst: true },
      { url: '/contact.html', selector: '#contact-form' }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('load');
      await page.waitForTimeout(300);
      
      if (pageInfo.expectFirst) {
        await expect(page.locator(pageInfo.selector).first()).toBeVisible();
      } else {
        await expect(page.locator(pageInfo.selector)).toBeVisible();
      }
    }
  });

  test('Path 9: Gallery filter workflow', async ({ page }) => {
    await page.goto('/realisations.html');
    await page.waitForLoadState('load');
    await page.waitForTimeout(500);
    
    const filters = ['all', 'piscine', 'amenagement', 'container', 'all'];
    
    for (const filter of filters) {
      await page.click(`.filter-btn[data-filter="${filter}"]`);
      await page.waitForTimeout(500);
      await expect(page.locator(`.filter-btn[data-filter="${filter}"]`)).toHaveClass(/active/);
    }
  });

  test('Path 10: Chatbot multi-question conversation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(500);
    
    await page.click('#chatbot-button');
    await page.waitForTimeout(400);
    
    const chatbotPanel = page.locator('#chatbot-panel');
    await expect(chatbotPanel).toHaveClass(/active/);
    
    const questions = ['piscine', 'prix'];
    
    for (const question of questions) {
      const chatbotInput = page.locator('#chatbot-input');
      await expect(chatbotInput).toBeVisible();
      await chatbotInput.fill(question);
      await page.click('.chatbot__submit');
      await page.waitForTimeout(800);
    }
    
    const botMessages = page.locator('.chatbot__message--bot');
    expect(await botMessages.count()).toBeGreaterThan(questions.length);
  });

  test('Path 11: Scroll-triggered animations throughout page', async ({ page }) => {
    await page.goto('/');
    
    const scrollPositions = [0, 500, 1000, 1500, 2000, 2500];
    
    for (const position of scrollPositions) {
      await page.evaluate(pos => window.scrollTo(0, pos), position);
      await page.waitForTimeout(300);
    }
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
  });

  test('Path 12: Phone number click-to-call', async ({ page }) => {
    await page.goto('/');
    
    const phoneLink = page.locator('.header__phone');
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', 'tel:+33652211072');
  });

  test('Path 13: Footer navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    
    const footerPiscinesLink = page.locator('.footer__nav a:has-text("Piscines")').first();
    await footerPiscinesLink.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await footerPiscinesLink.click();
    await expect(page).toHaveURL(/.*piscines\.html/);
  });

  test('Path 14: CTA button flow from homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1500);
    
    const ctaButton = page.locator('.hero__cta .btn--primary').first();
    await ctaButton.click();
    
    await page.waitForLoadState('load');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/realisations\.html|contact\.html/);
  });

  test('Path 15: Header sticky behavior during navigation', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('#header');
    await expect(header).not.toHaveClass(/scrolled/);
    
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(200);
    await expect(header).toHaveClass(/scrolled/);
    
    await page.click('.header__nav-link:has-text("Contact")');
    await expect(page).toHaveURL(/.*contact\.html/);
    
    const headerOnNewPage = page.locator('#header');
    await expect(headerOnNewPage).toBeVisible();
  });
});
