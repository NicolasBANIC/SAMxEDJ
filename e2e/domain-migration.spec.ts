const pages = [
  { name: 'Home', url: '/index.html' },
  { name: 'Piscines', url: '/piscines.html' },
  { name: 'Amenagements', url: '/amenagements.html' },
  { name: 'Containers', url: '/containers.html' },
  { name: 'Realisations', url: '/realisations.html' },
  { name: 'Contact', url: '/contact.html' },
  { name: '404', url: '/404.html' },
  { name: 'Mentions Legales', url: '/mentions-legales.html' },
  { name: 'Politique', url: '/politique-confidentialite.html' }
];

test.describe('Domain Migration - eclatdejardin.fr → eclatsdejardin.fr', () => {
  
  test.describe('No Old Domain References', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} page has no "eclatdejardin.fr" references`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('eclatdejardin.fr');
      });
    }
  });

  test.describe('Email Validation - Footer Contact', () => {
    for (const pageInfo of pages) {
      test(`${pageInfo.name} footer displays new email contact@eclatsdejardin.fr`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const footerContact = page.locator('.footer__contact');
        await expect(footerContact).toBeVisible();
        
        const emailLink = footerContact.locator('a[href="mailto:contact@eclatsdejardin.fr"]');
        await expect(emailLink).toBeVisible();
        await expect(emailLink).toHaveText('contact@eclatsdejardin.fr');
      });
    }
  });

  test.describe('Contact Page Email Validation', () => {
    test('Contact page info section displays new email', async ({ page }) => {
      await page.goto('/contact.html');
      
      const emailInfoItem = page.locator('.info-item').filter({ hasText: 'Email' });
      await expect(emailInfoItem).toBeVisible();
      
      const emailLink = emailInfoItem.locator('a[href="mailto:contact@eclatsdejardin.fr"]');
      await expect(emailLink).toBeVisible();
      await expect(emailLink).toHaveText('contact@eclatsdejardin.fr');
    });
  });

  test.describe('Legal Pages Domain Validation', () => {
    test('Mentions légales displays www.eclatsdejardin.fr', async ({ page }) => {
      await page.goto('/mentions-legales.html');
      
      const content = await page.textContent('.legal-content, main');
      expect(content).toContain('www.eclatsdejardin.fr');
      expect(content).not.toContain('www.eclatdejardin.fr');
      
      const emailLinks = page.locator('a[href="mailto:contact@eclatsdejardin.fr"]');
      expect(await emailLinks.count()).toBeGreaterThan(0);
    });

    test('Politique de confidentialité displays new email multiple times', async ({ page }) => {
      await page.goto('/politique-confidentialite.html');
      
      const emailLinks = page.locator('a[href="mailto:contact@eclatsdejardin.fr"]');
      const count = await emailLinks.count();
      expect(count).toBeGreaterThanOrEqual(3);
      
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('eclatdejardin.fr');
    });
  });

  test.describe('SEO Files Validation', () => {
    test('robots.txt references new domain sitemap', async ({ page }) => {
      const response = await page.goto('/robots.txt');
      expect(response?.status()).toBe(200);
      
      const content = await page.textContent('body');
      expect(content).toContain('Sitemap: https://www.eclatsdejardin.fr/sitemap.xml');
      expect(content).not.toContain('eclatdejardin.fr');
    });

    test('sitemap.xml contains only new domain URLs', async ({ page }) => {
      const response = await page.goto('/sitemap.xml');
      expect(response?.status()).toBe(200);
      
      const content = await page.textContent('body');
      
      expect(content).toContain('https://www.eclatsdejardin.fr/index.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/piscines.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/amenagements.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/containers.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/realisations.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/contact.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/mentions-legales.html');
      expect(content).toContain('https://www.eclatsdejardin.fr/politique-confidentialite.html');
      
      expect(content).not.toContain('eclatdejardin.fr');
    });

    test('sitemap.xml uses HTTPS protocol for all URLs', async ({ page }) => {
      await page.goto('/sitemap.xml');
      
      const content = await page.textContent('body');
      const locTags = content?.match(/<loc>.*?<\/loc>/g) || [];
      
      expect(locTags.length).toBeGreaterThan(0);
      
      for (const locTag of locTags) {
        expect(locTag).toContain('https://');
        expect(locTag).not.toContain('http://www');
      }
    });
  });

  test.describe('Complete Domain Coverage', () => {
    test('All pages combined have correct domain usage', async ({ page }) => {
      let totalOldDomainReferences = 0;
      let totalNewDomainReferences = 0;

      for (const pageInfo of pages) {
        await page.goto(pageInfo.url);
        const bodyText = await page.textContent('body');
        
        const oldMatches = bodyText?.match(/eclatdejardin\.fr/g);
        const newMatches = bodyText?.match(/eclatsdejardin\.fr/g);
        
        if (oldMatches) totalOldDomainReferences += oldMatches.length;
        if (newMatches) totalNewDomainReferences += newMatches.length;
      }

      expect(totalOldDomainReferences).toBe(0);
      expect(totalNewDomainReferences).toBeGreaterThan(0);
    });
  });
});
