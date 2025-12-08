import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', url: '/index.html', title: 'ÉCLATS DE JARDIN — Piscines & Aménagements Premium' },
  { name: 'Piscines', url: '/piscines.html', title: 'Piscines Premium — Coques, Maçonnées, Containers | ÉCLATS DE JARDIN' },
  { name: 'Amenagements', url: '/amenagements.html', title: 'Aménagements Extérieurs Premium — Terrasses, Pavages, Escaliers | ÉCLATS DE JARDIN' },
  { name: 'Containers', url: '/containers.html', title: 'Containers Architecturaux — Pool House, Atelier, Bureau | ÉCLATS DE JARDIN' },
  { name: 'Realisations', url: '/realisations.html', title: 'Nos Réalisations Premium — Projets Piscines & Aménagements | ÉCLATS DE JARDIN' },
  { name: 'Contact', url: '/contact.html', title: 'Contact & Devis Gratuit — ÉCLATS DE JARDIN | Strasbourg' },
  { name: '404', url: '/404.html', title: 'Page non trouvée | Éclats de Jardin' },
  { name: 'Mentions Legales', url: '/mentions-legales.html', title: 'Mentions légales | Éclats de Jardin' },
  { name: 'Politique', url: '/politique-confidentialite.html', title: 'Politique de confidentialité | Éclats de Jardin' }
];

test.describe('Brand Name Update - ÉCLATS DE JARDIN', () => {
  
  test.describe('Page Titles Verification', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} page title contains "ÉCLATS DE JARDIN"`, async ({ page }) => {
        await page.goto(pageInfo.url);
        await expect(page).toHaveTitle(new RegExp('ÉCLATS DE JARDIN|Éclats de Jardin'));
      });
    }
  });

  test.describe('Header Logo Text Verification', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} page header displays "ÉCLATS DE JARDIN"`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const logoText = page.locator('.header__logo-text');
        await expect(logoText).toBeVisible();
        await expect(logoText).toHaveText('ÉCLATS DE JARDIN');
        
        const logoImg = page.locator('.header__logo-img');
        await expect(logoImg).toHaveAttribute('alt', 'ÉCLATS DE JARDIN');
      });
    }
  });

  test.describe('Footer Verification', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} page footer contains "Éclats de Jardin"`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const footer = page.locator('footer.footer');
        await expect(footer).toBeVisible();
        
        const footerLogo = footer.locator('.footer__logo');
        await expect(footerLogo).toHaveAttribute('alt', 'ÉCLATS DE JARDIN');
        
        const footerBottom = footer.locator('.footer__bottom');
        await expect(footerBottom).toContainText('2025 Éclats de Jardin');
        
        const footerContact = footer.locator('.footer__contact strong');
        if (await footerContact.count() > 0) {
          await expect(footerContact).toContainText('ÉCLATS DE JARDIN');
        }
      });
    }
  });

  test.describe('Meta Description Verification', () => {
    const pagesWithDescription = [
      { url: '/index.html', shouldContain: 'Éclats de Jardin' },
      { url: '/contact.html', shouldContain: 'Éclats de Jardin' },
      { url: '/mentions-legales.html', shouldContain: 'Éclats de Jardin' },
      { url: '/politique-confidentialite.html', shouldContain: 'Éclats de Jardin' }
    ];

    for (const pageInfo of pagesWithDescription) {
      test(`${pageInfo.url} meta description contains "Éclats de Jardin"`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const metaDescription = page.locator('meta[name="description"]');
        const content = await metaDescription.getAttribute('content');
        expect(content).toContain(pageInfo.shouldContain);
      });
    }
  });

  test('Chatbot welcome message displays "Éclats de Jardin"', async ({ page }) => {
    await page.goto('/index.html');
    
    const chatbotButton = page.locator('#chatbot-button');
    await expect(chatbotButton).toBeVisible();
    await chatbotButton.click();
    
    const chatbotPanel = page.locator('#chatbot-panel');
    await expect(chatbotPanel).toHaveClass(/active/);
    
    const chatbotHeader = page.locator('.chatbot__header h3');
    await expect(chatbotHeader).toContainText('Assistant Éclats de Jardin');
    
    const welcomeMessage = page.locator('.chatbot__message--bot').first();
    await expect(welcomeMessage).toContainText('Éclats de Jardin');
  });

  test('Chatbot "bonjour" response contains "Éclats de Jardin"', async ({ page }) => {
    await page.goto('/index.html');
    
    await page.locator('#chatbot-button').click();
    await page.waitForSelector('#chatbot-panel.active');
    
    await page.locator('#chatbot-input').fill('bonjour');
    await page.locator('#chatbot-form').evaluate(form => (form as HTMLFormElement).requestSubmit());
    
    await page.waitForTimeout(800);
    
    const lastBotMessage = page.locator('.chatbot__message--bot').last();
    await expect(lastBotMessage).toContainText('Éclats de Jardin');
  });

  test('Legal page "Mentions légales" content uses "Éclats de Jardin"', async ({ page }) => {
    await page.goto('/mentions-legales.html');
    
    const legalContent = page.locator('.legal-content');
    await expect(legalContent).toBeVisible();
    
    await expect(page.locator('h1')).toContainText('Mentions légales');
    
    const contentText = await legalContent.textContent();
    expect(contentText).toContain('Éclats de Jardin');
    expect(contentText).not.toContain('ÉCLAT DE JARDIN');
  });

  test('Legal page "Politique de confidentialité" content uses "Éclats de Jardin"', async ({ page }) => {
    await page.goto('/politique-confidentialite.html');
    
    const legalContent = page.locator('.legal-content');
    await expect(legalContent).toBeVisible();
    
    await expect(page.locator('h1')).toContainText('Politique de confidentialité');
    
    const contentText = await legalContent.textContent();
    expect(contentText).toContain('Éclats de Jardin');
    expect(contentText).not.toContain('ÉCLAT DE JARDIN');
  });

  test('Homepage intro section uses "Éclats de Jardin"', async ({ page }) => {
    await page.goto('/index.html');
    
    const introLabel = page.locator('.intro__label');
    await expect(introLabel).toContainText('Éclats de Jardin');
    
    const introText = page.locator('.intro__text p').first();
    const text = await introText.textContent();
    expect(text).toContain('Éclats de Jardin');
  });

  test('No old brand name "ÉCLAT DE JARDIN" appears on homepage', async ({ page }) => {
    await page.goto('/index.html');
    
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).not.toMatch(/ÉCLAT DE JARDIN(?!S)/);
  });

  test('All chatbot pages use updated brand name', async ({ page }) => {
    const chatbotPages = ['/index.html', '/piscines.html', '/contact.html'];
    
    for (const url of chatbotPages) {
      await page.goto(url);
      
      await page.locator('#chatbot-button').click();
      await page.waitForSelector('#chatbot-panel.active');
      
      const header = page.locator('.chatbot__header h3');
      await expect(header).toContainText('Assistant Éclats de Jardin');
      
      const welcomeMsg = page.locator('.chatbot__message--bot').first();
      await expect(welcomeMsg).toContainText('Éclats de Jardin');
      
      // Close chatbot by clicking button again instead of close button
      await page.locator('#chatbot-button').click();
      await page.waitForTimeout(300);
    }
  });
});
