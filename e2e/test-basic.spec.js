const { test, expect, describe } = require('@playwright/test');

describe('Homepage Tests', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = page.locator('.hero__title');
    await expect(title).toBeVisible();
  });
});
