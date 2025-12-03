const { test, expect, describe } = require('@playwright/test');

describe('Contact Form Validation', () => {
  test('form should be visible on contact page', async ({ page }) => {
    await page.goto('/contact.html');
    const form = page.locator('#contact-form');
    await expect(form).toBeVisible();
  });

  test('form should have all required fields', async ({ page }) => {
    await page.goto('/contact.html');
    
    await expect(page.locator('input[name="nom"]')).toBeVisible();
    await expect(page.locator('input[name="prenom"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="telephone"]')).toBeVisible();
    await expect(page.locator('input[name="adresse"]')).toBeVisible();
    await expect(page.locator('select[name="projet"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('submit button should be visible', async ({ page }) => {
    await page.goto('/contact.html');
    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Envoyer');
  });

  test('required fields should have required attribute', async ({ page }) => {
    await page.goto('/contact.html');
    
    await expect(page.locator('input[name="nom"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="telephone"]')).toHaveAttribute('required', '');
  });

  test('email field should have type email', async ({ page }) => {
    await page.goto('/contact.html');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
  });

  test('email field should accept valid email', async ({ page }) => {
    await page.goto('/contact.html');
    const emailInput = page.locator('input[name="email"]');
    
    await emailInput.fill('test@example.com');
    const value = await emailInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  test('projet select should have multiple options', async ({ page }) => {
    await page.goto('/contact.html');
    const selectOptions = page.locator('select[name="projet"] option');
    expect(await selectOptions.count()).toBeGreaterThan(5);
  });

  test('projet select should include piscine options', async ({ page }) => {
    await page.goto('/contact.html');
    const selectOptions = page.locator('select[name="projet"] option');
    const optionsText = await selectOptions.allTextContents();
    const hasPiscineOption = optionsText.some(text => text.toLowerCase().includes('piscine'));
    expect(hasPiscineOption).toBe(true);
  });

  test('labels should be associated with inputs', async ({ page }) => {
    await page.goto('/contact.html');
    
    const nomLabel = page.locator('label[for="nom"]');
    await expect(nomLabel).toBeVisible();
    
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
  });

  test('clicking label should focus input', async ({ page }) => {
    await page.goto('/contact.html');
    
    await page.click('label[for="nom"]');
    const nomInput = page.locator('input[name="nom"]');
    await expect(nomInput).toBeFocused();
  });

  test('textarea should be resizable', async ({ page }) => {
    await page.goto('/contact.html');
    const textarea = page.locator('textarea[name="message"]');
    await expect(textarea).toBeVisible();
    
    const minHeight = await textarea.evaluate(el => parseInt(window.getComputedStyle(el).minHeight));
    expect(minHeight).toBeGreaterThan(100);
  });

  test('form fields should be editable', async ({ page }) => {
    await page.goto('/contact.html');
    
    await page.fill('input[name="nom"]', 'Dupont');
    await page.fill('input[name="prenom"]', 'Jean');
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="telephone"]', '0612345678');
    await page.fill('input[name="adresse"]', '1 Rue Test, Strasbourg');
    await page.selectOption('select[name="projet"]', 'piscine-coque');
    await page.fill('textarea[name="message"]', 'Je souhaite un devis pour une piscine.');
    
    expect(await page.locator('input[name="nom"]').inputValue()).toBe('Dupont');
    expect(await page.locator('input[name="prenom"]').inputValue()).toBe('Jean');
    expect(await page.locator('input[name="email"]').inputValue()).toBe('jean.dupont@example.com');
  });
});
