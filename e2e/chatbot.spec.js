const { test, expect, describe } = require('@playwright/test');

describe('Chatbot Functionality', () => {
  test('chatbot button should be visible', async ({ page }) => {
    await page.goto('/');
    const chatbotButton = page.locator('#chatbot-button');
    await expect(chatbotButton).toBeVisible();
  });

  test('chatbot panel should open when clicking button', async ({ page }) => {
    await page.goto('/');
    const chatbotButton = page.locator('#chatbot-button');
    const chatbotPanel = page.locator('#chatbot-panel');
    
    await expect(chatbotPanel).not.toHaveClass(/active/);
    await chatbotButton.click();
    await expect(chatbotPanel).toHaveClass(/active/);
  });

  test('chatbot panel should close when clicking close button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const chatbotButton = page.locator('#chatbot-button');
    const chatbotPanel = page.locator('#chatbot-panel');
    
    await chatbotButton.click();
    await page.waitForTimeout(300);
    await expect(chatbotPanel).toHaveClass(/active/);
    
    const chatbotClose = page.locator('#chatbot-close');
    await chatbotClose.scrollIntoViewIfNeeded();
    await chatbotClose.click({ force: true });
    await page.waitForTimeout(300);
    await expect(chatbotPanel).not.toHaveClass(/active/);
  });

  test('chatbot should display welcome message', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    const welcomeMessage = page.locator('.chatbot__message--bot').first();
    await expect(welcomeMessage).toContainText('Bonjour');
  });

  test('chatbot should respond to "piscine" query', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    
    await page.fill('#chatbot-input', 'piscine');
    await page.click('.chatbot__submit');
    
    await page.waitForTimeout(700);
    
    const messages = page.locator('.chatbot__message--bot');
    const lastMessage = messages.last();
    await expect(lastMessage).toContainText('piscine');
  });

  test('chatbot should respond to "prix piscine" with price info', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    
    await page.fill('#chatbot-input', 'prix piscine');
    await page.click('.chatbot__submit');
    
    await page.waitForTimeout(700);
    
    const messages = page.locator('.chatbot__message--bot');
    const lastMessage = messages.last();
    const text = await lastMessage.textContent();
    expect(text).toMatch(/€|euro|prix|budget|coût/i);
  });

  test('chatbot input should clear after sending message', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    
    await page.fill('#chatbot-input', 'test message');
    await page.click('.chatbot__submit');
    
    const inputValue = await page.locator('#chatbot-input').inputValue();
    expect(inputValue).toBe('');
  });

  test('chatbot messages should scroll to bottom automatically', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    
    await page.fill('#chatbot-input', 'test 1');
    await page.click('.chatbot__submit');
    await page.waitForTimeout(700);
    
    await page.fill('#chatbot-input', 'test 2');
    await page.click('.chatbot__submit');
    await page.waitForTimeout(700);
    
    const messagesContainer = page.locator('#chatbot-messages');
    const scrollTop = await messagesContainer.evaluate(el => el.scrollTop);
    const scrollHeight = await messagesContainer.evaluate(el => el.scrollHeight);
    const clientHeight = await messagesContainer.evaluate(el => el.clientHeight);
    
    expect(scrollTop + clientHeight).toBeCloseTo(scrollHeight, 0);
  });

  test('chatbot should respond to "container" query', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    
    await page.fill('#chatbot-input', 'container');
    await page.click('.chatbot__submit');
    
    await page.waitForTimeout(700);
    
    const messages = page.locator('.chatbot__message--bot');
    const lastMessage = messages.last();
    await expect(lastMessage).toContainText(/container|Container/);
  });

  test('chatbot should handle empty input gracefully', async ({ page }) => {
    await page.goto('/');
    await page.click('#chatbot-button');
    
    const initialMessageCount = await page.locator('.chatbot__message').count();
    
    await page.fill('#chatbot-input', '');
    await page.click('.chatbot__submit');
    await page.waitForTimeout(300);
    
    const finalMessageCount = await page.locator('.chatbot__message').count();
    expect(finalMessageCount).toBe(initialMessageCount);
  });
});
