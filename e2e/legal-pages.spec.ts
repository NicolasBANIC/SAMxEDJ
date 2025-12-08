import { test, expect } from '@playwright/test';

test.describe('Legal Pages and SEO Files', () => {
  test('404 page displays correctly with proper structure', async ({ page }) => {
    await page.goto('/404.html');
    
    await expect(page).toHaveTitle(/Page non trouvée/);
    await expect(page.locator('h1')).toContainText('Page non trouvée');
    await expect(page.locator('.error-number')).toContainText('404');
    await expect(page.locator('.error-text')).toBeVisible();
    
    const homeLink = page.locator('a.btn.btn--primary').filter({ hasText: 'Retour à l\'accueil' });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', 'index.html');
  });

  test('404 page has consistent header and footer', async ({ page }) => {
    await page.goto('/404.html');
    
    await expect(page.locator('header.header')).toBeVisible();
    await expect(page.locator('.header__logo')).toBeVisible();
    await expect(page.locator('footer.footer')).toBeVisible();
    
    const footerLinks = page.locator('.footer__bottom a');
    await expect(footerLinks.filter({ hasText: 'Mentions légales' })).toBeVisible();
    await expect(footerLinks.filter({ hasText: 'Politique de confidentialité' })).toBeVisible();
  });

  test('Mentions légales page loads with complete content', async ({ page }) => {
    await page.goto('/mentions-legales.html');
    
    await expect(page).toHaveTitle(/Mentions légales/);
    await expect(page.locator('h1')).toContainText('Mentions légales');
    
    await expect(page.locator('h2').filter({ hasText: /Éditeur/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Directeur/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Hébergeur/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Propriété/ })).toBeVisible();
    
    await expect(page.locator('text=Éclats de Jardin')).toBeVisible();
    await expect(page.locator('text=1 Rue Kellermann')).toBeVisible();
    await expect(page.locator('text=67300 Schiltigheim')).toBeVisible();
  });

  test('Politique de confidentialité page loads with RGPD sections', async ({ page }) => {
    await page.goto('/politique-confidentialite.html');
    
    await expect(page).toHaveTitle(/Politique de confidentialité/);
    await expect(page.locator('h1')).toContainText('Politique de confidentialité');
    
    await expect(page.locator('h2').filter({ hasText: /Responsable/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Données/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Finalités/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Base légale/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /conservation/ })).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: /Droits/ })).toBeVisible();
    
    await expect(page.locator('text=RGPD')).toBeVisible();
    await expect(page.locator('text=contact@eclatsdejardin.fr')).toBeVisible();
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Sitemap:');
  });

  test('sitemap.xml is accessible and valid', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toContain('eclatsdejardin.fr');
    expect(content).toContain('index.html');
    expect(content).toContain('piscines.html');
    expect(content).toContain('mentions-legales.html');
    expect(content).toContain('politique-confidentialite.html');
  });

  test('Legal pages have proper header styling (scrolled state)', async ({ page }) => {
    await page.goto('/mentions-legales.html');
    
    const header = page.locator('header.header');
    await expect(header).toHaveClass(/scrolled/);
  });
});
