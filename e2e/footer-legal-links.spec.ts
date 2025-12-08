import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', url: '/index.html' },
  { name: 'Piscines', url: '/piscines.html' },
  { name: 'Aménagements', url: '/amenagements.html' },
  { name: 'Containers', url: '/containers.html' },
  { name: 'Réalisations', url: '/realisations.html' },
  { name: 'Contact', url: '/contact.html' },
  { name: '404', url: '/404.html' },
  { name: 'Mentions Légales', url: '/mentions-legales.html' },
  { name: 'Politique', url: '/politique-confidentialite.html' }
];

test.describe('Footer Legal Links on All Pages', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} page has footer with legal links`, async ({ page }) => {
      await page.goto(pageInfo.url);
      
      const footer = page.locator('footer.footer');
      await expect(footer).toBeVisible();
      
      const footerBottom = footer.locator('.footer__bottom');
      await expect(footerBottom).toBeVisible();
      
      const mentionsLink = footerBottom.locator('a[href="mentions-legales.html"]');
      await expect(mentionsLink).toBeVisible();
      await expect(mentionsLink).toContainText('Mentions légales');
      
      const politiqueLink = footerBottom.locator('a[href="politique-confidentialite.html"]');
      await expect(politiqueLink).toBeVisible();
      await expect(politiqueLink).toContainText('Politique de confidentialité');
      
      await expect(footerBottom).toContainText('2025 Éclats de Jardin');
    });
  }

  test('Footer legal links are clickable and navigate correctly from index', async ({ page }) => {
    await page.goto('/index.html');
    
    await page.locator('a[href="mentions-legales.html"]').first().click();
    await expect(page).toHaveURL(/mentions-legales\.html/);
    await expect(page.locator('h1')).toContainText('Mentions légales');
    
    await page.goto('/index.html');
    
    await page.locator('a[href="politique-confidentialite.html"]').first().click();
    await expect(page).toHaveURL(/politique-confidentialite\.html/);
    await expect(page.locator('h1')).toContainText('Politique de confidentialité');
  });

  test('Footer legal links are clickable from contact page', async ({ page }) => {
    await page.goto('/contact.html');
    
    const mentionsLink = page.locator('footer a[href="mentions-legales.html"]');
    await mentionsLink.click();
    await expect(page).toHaveURL(/mentions-legales\.html/);
    
    await page.goBack();
    
    const politiqueLink = page.locator('footer a[href="politique-confidentialite.html"]');
    await politiqueLink.click();
    await expect(page).toHaveURL(/politique-confidentialite\.html/);
  });

  test('Footer structure remains consistent across pages', async ({ page }) => {
    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      
      const footerCols = page.locator('.footer__col');
      await expect(footerCols).toHaveCount(4);
      
      await expect(page.locator('.footer__logo')).toBeVisible();
      await expect(page.locator('.footer__bottom')).toBeVisible();
    }
  });
});
