import { test, expect } from '@playwright/test';

test.describe('Contact Form RGPD and Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
  });

  test('RGPD checkbox is present and required', async ({ page }) => {
    const rgpdCheckbox = page.locator('#rgpd_consent');
    await expect(rgpdCheckbox).toBeVisible();
    await expect(rgpdCheckbox).toHaveAttribute('required', '');
    await expect(rgpdCheckbox).toHaveAttribute('type', 'checkbox');
    
    const rgpdLabel = page.locator('.rgpd-consent');
    await expect(rgpdLabel).toBeVisible();
    await expect(rgpdLabel).toContainText('J\'accepte que mes données soient utilisées');
    await expect(rgpdLabel).toContainText('Politique de confidentialité');
  });

  test('RGPD consent has link to privacy policy', async ({ page }) => {
    const privacyLink = page.locator('.rgpd-consent a[href="politique-confidentialite.html"]');
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute('target', '_blank');
    await expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('Form messages container exists', async ({ page }) => {
    const messagesContainer = page.locator('#form-messages');
    await expect(messagesContainer).toBeAttached();
    await expect(messagesContainer).toHaveAttribute('aria-live', 'polite');
  });

  test('Empty form submission shows error message', async ({ page }) => {
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    const messages = page.locator('#form-messages');
    await expect(messages).toHaveClass(/show/);
    await expect(messages).toHaveClass(/error/);
    await expect(messages).toContainText('Merci de remplir tous les champs obligatoires');
  });

  test('Form with all fields but no RGPD consent shows error', async ({ page }) => {
    await page.fill('#nom', 'Dupont');
    await page.fill('#prenom', 'Jean');
    await page.fill('#email', 'jean.dupont@example.com');
    await page.fill('#telephone', '0612345678');
    await page.fill('#adresse', '123 Rue Test, Strasbourg');
    await page.selectOption('#projet', 'piscine-coque');
    await page.fill('#message', 'Je souhaite un devis pour une piscine');
    
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    const messages = page.locator('#form-messages');
    await expect(messages).toHaveClass(/show/);
    await expect(messages).toHaveClass(/error/);
    await expect(messages).toContainText('politique de confidentialité');
  });

  test('Partially filled form shows error message', async ({ page }) => {
    await page.fill('#nom', 'Dupont');
    await page.fill('#prenom', 'Jean');
    await page.check('#rgpd_consent');
    
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    const messages = page.locator('#form-messages');
    await expect(messages).toHaveClass(/error/);
  });

  test('Fully filled form with RGPD consent shows success message', async ({ page }) => {
    await page.fill('#nom', 'Dupont');
    await page.fill('#prenom', 'Jean');
    await page.fill('#email', 'jean.dupont@example.com');
    await page.fill('#telephone', '0612345678');
    await page.fill('#adresse', '123 Rue Test, 67000 Strasbourg');
    await page.selectOption('#projet', 'piscine-maconnee');
    await page.fill('#message', 'Je souhaite construire une piscine maçonnée de 10x5m avec plage.');
    await page.check('#rgpd_consent');
    
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    const messages = page.locator('#form-messages');
    await expect(messages).toHaveClass(/show/);
    await expect(messages).toHaveClass(/success/);
    await expect(messages).toContainText('Merci, votre demande a bien été envoyée');
    await expect(messages).toContainText('recontacterons');
  });

  test('Form is reset after successful submission', async ({ page }) => {
    await page.fill('#nom', 'Dupont');
    await page.fill('#prenom', 'Jean');
    await page.fill('#email', 'jean.dupont@example.com');
    await page.fill('#telephone', '0612345678');
    await page.fill('#adresse', '123 Rue Test, Strasbourg');
    await page.selectOption('#projet', 'terrasse');
    await page.fill('#message', 'Devis terrasse bois');
    await page.check('#rgpd_consent');
    
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    await expect(page.locator('#form-messages')).toHaveClass(/success/);
    
    await expect(page.locator('#nom')).toHaveValue('');
    await expect(page.locator('#prenom')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#message')).toHaveValue('');
    await expect(page.locator('#rgpd_consent')).not.toBeChecked();
  });

  test('Error message clears when resubmitting with valid data', async ({ page }) => {
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    await expect(page.locator('#form-messages')).toHaveClass(/error/);
    
    await page.fill('#nom', 'Martin');
    await page.fill('#prenom', 'Sophie');
    await page.fill('#email', 'sophie.martin@example.com');
    await page.fill('#telephone', '0698765432');
    await page.fill('#adresse', '45 Avenue de la Paix, Strasbourg');
    await page.selectOption('#projet', 'container-poolhouse');
    await page.fill('#message', 'Projet de pool house container');
    await page.check('#rgpd_consent');
    
    await submitButton.click();
    
    const messages = page.locator('#form-messages');
    await expect(messages).not.toHaveClass(/error/);
    await expect(messages).toHaveClass(/success/);
  });

  test('All required fields are marked with asterisk', async ({ page }) => {
    const requiredLabels = page.locator('label:has-text("*")');
    await expect(requiredLabels).toHaveCount(7);
    
    await expect(page.locator('label[for="nom"]')).toContainText('*');
    await expect(page.locator('label[for="prenom"]')).toContainText('*');
    await expect(page.locator('label[for="email"]')).toContainText('*');
    await expect(page.locator('label[for="telephone"]')).toContainText('*');
    await expect(page.locator('label[for="adresse"]')).toContainText('*');
    await expect(page.locator('label[for="projet"]')).toContainText('*');
    await expect(page.locator('label[for="message"]')).toContainText('*');
  });

  test('RGPD link opens in new tab', async ({ page, context }) => {
    const privacyLink = page.locator('.rgpd-consent a[href="politique-confidentialite.html"]');
    
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      privacyLink.click()
    ]);
    
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/politique-confidentialite\.html/);
    await expect(newPage.locator('h1')).toContainText('Politique de confidentialité');
  });

  test('Form styling for success and error messages', async ({ page }) => {
    const submitButton = page.locator('#contact-form button[type="submit"]');
    await submitButton.click();
    
    const messages = page.locator('#form-messages');
    await expect(messages).toHaveCSS('display', 'block');
    
    const errorColor = await messages.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(errorColor).toBeTruthy();
    
    await page.fill('#nom', 'Test');
    await page.fill('#prenom', 'User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#telephone', '0600000000');
    await page.fill('#adresse', 'Test Address');
    await page.selectOption('#projet', 'autre');
    await page.fill('#message', 'Test message');
    await page.check('#rgpd_consent');
    await submitButton.click();
    
    await expect(messages).toHaveClass(/success/);
    const successColor = await messages.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    expect(successColor).toBeTruthy();
    expect(successColor).not.toBe(errorColor);
  });
});
