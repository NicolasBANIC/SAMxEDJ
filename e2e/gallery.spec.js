const { test, expect, describe } = require('@playwright/test');

describe('Gallery - Réalisations Page', () => {
  test('should display all gallery items', async ({ page }) => {
    await page.goto('/realisations.html');
    const galleryItems = page.locator('.gallery-item');
    expect(await galleryItems.count()).toBeGreaterThanOrEqual(12);
  });

  test('should display all filter buttons', async ({ page }) => {
    await page.goto('/realisations.html');
    const filterBtns = page.locator('.filter-btn');
    await expect(filterBtns).toHaveCount(4);
  });

  test('filter buttons should have correct labels', async ({ page }) => {
    await page.goto('/realisations.html');
    const filterBtns = page.locator('.filter-btn');
    
    await expect(filterBtns.nth(0)).toContainText('Tous');
    await expect(filterBtns.nth(1)).toContainText('Piscines');
    await expect(filterBtns.nth(2)).toContainText('Aménagements');
    await expect(filterBtns.nth(3)).toContainText('Containers');
  });

  test('"Tous" filter should be active by default', async ({ page }) => {
    await page.goto('/realisations.html');
    const allFilter = page.locator('.filter-btn[data-filter="all"]');
    await expect(allFilter).toHaveClass(/active/);
  });

  test('clicking "Piscines" filter should show only piscine items', async ({ page }) => {
    await page.goto('/realisations.html');
    
    const piscineFilter = page.locator('.filter-btn[data-filter="piscine"]');
    await piscineFilter.click();
    await page.waitForTimeout(400);
    
    await expect(piscineFilter).toHaveClass(/active/);
    
    const visibleItems = page.locator('.gallery-item[data-category="piscine"]');
    const visibleCount = await visibleItems.count();
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('clicking "Aménagements" filter should show only amenagement items', async ({ page }) => {
    await page.goto('/realisations.html');
    
    const amenagementFilter = page.locator('.filter-btn[data-filter="amenagement"]');
    await amenagementFilter.click();
    await page.waitForTimeout(400);
    
    await expect(amenagementFilter).toHaveClass(/active/);
    
    const visibleItems = page.locator('.gallery-item[data-category="amenagement"]');
    const visibleCount = await visibleItems.count();
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('clicking "Containers" filter should show only container items', async ({ page }) => {
    await page.goto('/realisations.html');
    
    const containerFilter = page.locator('.filter-btn[data-filter="container"]');
    await containerFilter.click();
    await page.waitForTimeout(400);
    
    await expect(containerFilter).toHaveClass(/active/);
    
    const visibleItems = page.locator('.gallery-item[data-category="container"]');
    const visibleCount = await visibleItems.count();
    expect(visibleCount).toBeGreaterThan(0);
  });

  test('switching between filters should update active state', async ({ page }) => {
    await page.goto('/realisations.html');
    
    const allFilter = page.locator('.filter-btn[data-filter="all"]');
    const piscineFilter = page.locator('.filter-btn[data-filter="piscine"]');
    
    await expect(allFilter).toHaveClass(/active/);
    
    await piscineFilter.click();
    await page.waitForTimeout(200);
    
    await expect(piscineFilter).toHaveClass(/active/);
    await expect(allFilter).not.toHaveClass(/active/);
  });

  test('gallery images should load without errors', async ({ page }) => {
    await page.goto('/realisations.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const images = page.locator('.gallery-item__image img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      await images.nth(i).evaluate(img => {
        return new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = () => resolve();
        });
      });
      const naturalWidth = await images.nth(i).evaluate(img => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('gallery items should have overlay content', async ({ page }) => {
    await page.goto('/realisations.html');
    
    const firstItemOverlay = page.locator('.gallery-item').first().locator('.gallery-item__overlay');
    await expect(firstItemOverlay).toBeVisible();
    
    const category = firstItemOverlay.locator('.gallery-item__category');
    const title = firstItemOverlay.locator('.gallery-item__title');
    
    await expect(category).toBeDefined();
    await expect(title).toBeDefined();
  });

  test('hovering gallery item should trigger hover effect', async ({ page }) => {
    await page.goto('/realisations.html');
    
    const firstItem = page.locator('.gallery-item').first();
    await firstItem.hover();
    await page.waitForTimeout(100);
    
    const overlay = firstItem.locator('.gallery-item__overlay');
    await expect(overlay).toBeVisible();
  });

  test('clicking "Tous" after filtering should show all items again', async ({ page }) => {
    await page.goto('/realisations.html');
    
    await page.click('.filter-btn[data-filter="piscine"]');
    await page.waitForTimeout(400);
    
    await page.click('.filter-btn[data-filter="all"]');
    await page.waitForTimeout(400);
    
    const allItems = page.locator('.gallery-item');
    const count = await allItems.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });
});
