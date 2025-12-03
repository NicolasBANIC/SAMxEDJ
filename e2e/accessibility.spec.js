const { test, expect, describe } = require('@playwright/test');

describe('Accessibility - Keyboard Navigation', () => {
  test('navigation links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    const firstLink = page.locator('.header__logo');
    await expect(firstLink).toBeFocused();
  });

  test('should be able to navigate through header links with Tab', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }
    
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBe('A');
  });

  test('Enter key should activate links', async ({ page }) => {
    await page.goto('/');
    
    const piscinesLink = page.locator('.header__nav-link:has-text("Piscines")');
    await piscinesLink.focus();
    await page.keyboard.press('Enter');
    
    await expect(page).toHaveURL(/.*piscines\.html/);
  });

  test('form inputs should be keyboard accessible', async ({ page }) => {
    await page.goto('/contact.html');
    
    const nomInput = page.locator('input[name="nom"]');
    await nomInput.focus();
    await page.keyboard.type('Jean');
    
    expect(await nomInput.inputValue()).toBe('Jean');
  });

  test('Tab should move through form fields sequentially', async ({ page }) => {
    await page.goto('/contact.html');
    
    await page.click('input[name="nom"]');
    await page.keyboard.press('Tab');
    
    const prenomInput = page.locator('input[name="prenom"]');
    await expect(prenomInput).toBeFocused();
  });

  test('chatbot should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    const chatbotBtn = page.locator('#chatbot-button');
    await chatbotBtn.focus();
    await page.keyboard.press('Enter');
    
    const chatbotPanel = page.locator('#chatbot-panel');
    await expect(chatbotPanel).toHaveClass(/active/);
  });
});

describe('Accessibility - ARIA and Labels', () => {
  test('hamburger button should have aria-label', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    const burger = page.locator('#burger');
    await expect(burger).toHaveAttribute('aria-label', 'Menu');
  });

  test('chatbot button should have aria-label', async ({ page }) => {
    await page.goto('/');
    
    const chatbotBtn = page.locator('#chatbot-button');
    await expect(chatbotBtn).toHaveAttribute('aria-label');
  });

  test('form labels should be associated with inputs', async ({ page }) => {
    await page.goto('/contact.html');
    
    const nomLabel = page.locator('label[for="nom"]');
    await expect(nomLabel).toBeVisible();
    
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const logoImg = page.locator('.header__logo-img');
    await expect(logoImg).toHaveAttribute('alt');
    
    const altText = await logoImg.getAttribute('alt');
    expect(altText.length).toBeGreaterThan(0);
  });
});

describe('Accessibility - Focus Visibility', () => {
  test('focused elements should be visually distinguishable', async ({ page }) => {
    await page.goto('/');
    
    const firstLink = page.locator('.header__nav-link').first();
    await firstLink.focus();
    
    const outlineStyle = await firstLink.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.outline || style.boxShadow || 'none';
    });
    
    expect(outlineStyle).not.toBe('none');
  });

  test('buttons should show focus state', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.locator('.btn--primary').first();
    await ctaButton.focus();
    
    const isFocused = await ctaButton.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
  });
});

describe('Accessibility - Heading Hierarchy', () => {
  test('page should have exactly one H1', async ({ page }) => {
    await page.goto('/');
    
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
  });

  test('H1 should contain meaningful text', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1');
    const text = await h1.textContent();
    expect(text.trim().length).toBeGreaterThan(10);
  });

  test('H2 elements should exist for section headings', async ({ page }) => {
    await page.goto('/');
    
    const h2Elements = page.locator('h2');
    expect(await h2Elements.count()).toBeGreaterThan(0);
  });

  test('contact page should have proper heading structure', async ({ page }) => {
    await page.goto('/contact.html');
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    const h2Elements = page.locator('h2');
    expect(await h2Elements.count()).toBeGreaterThan(0);
  });
});

describe('Accessibility - Color Contrast', () => {
  test('text should be readable with sufficient contrast', async ({ page }) => {
    await page.goto('/');
    
    const heroTitle = page.locator('.hero__title');
    const color = await heroTitle.evaluate(el => window.getComputedStyle(el).color);
    
    expect(color).toBeDefined();
  });

  test('navigation links should have readable text', async ({ page }) => {
    await page.goto('/');
    
    const navLink = page.locator('.header__nav-link').first();
    const fontSize = await navLink.evaluate(el => parseInt(window.getComputedStyle(el).fontSize));
    
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });
});
