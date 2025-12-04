const { test, expect } = require('@playwright/test');

test.describe('Réalisations - Tests de Visibilité Complète', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/realisations.html');
        await page.waitForLoadState('networkidle');
    });

    test('au moins 3 cartes doivent être visibles dans le viewport initial', async ({ page }) => {
        await page.waitForTimeout(500);
        
        const visibleCards = await page.locator('.gallery-item').evaluateAll(items => {
            return items.filter(item => {
                const rect = item.getBoundingClientRect();
                return rect.top >= 0 && rect.left >= 0 && 
                       rect.bottom <= window.innerHeight * 2 &&
                       rect.width > 0 && rect.height > 0;
            }).length;
        });
        
        expect(visibleCards).toBeGreaterThan(2);
    });

    test('les cartes ne doivent pas avoir opacity:0 ou visibility:hidden', async ({ page }) => {
        const items = page.locator('.gallery-item');
        const count = await items.count();
        
        for (let i = 0; i < Math.min(count, 5); i++) {
            const item = items.nth(i);
            
            const styles = await item.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    opacity: computed.opacity,
                    visibility: computed.visibility,
                    display: computed.display
                };
            });
            
            expect(parseFloat(styles.opacity)).toBeGreaterThan(0);
            expect(styles.visibility).not.toBe('hidden');
            expect(styles.display).not.toBe('none');
        }
    });

    test('toutes les images des cartes doivent avoir un src valide', async ({ page }) => {
        const images = page.locator('.gallery-item img');
        const count = await images.count();
        
        expect(count).toBeGreaterThan(0);
        
        for (let i = 0; i < Math.min(count, 10); i++) {
            const src = await images.nth(i).getAttribute('src');
            expect(src).toBeTruthy();
            expect(src).toContain('assets/medias-realisations');
        }
    });

    test('les cartes doivent avoir un effet hover fonctionnel', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await expect(firstItem).toBeVisible();
        
        const initialTransform = await firstItem.evaluate(el => 
            window.getComputedStyle(el).transform
        );
        
        await firstItem.hover();
        await page.waitForTimeout(400);
        
        const hoverTransform = await firstItem.evaluate(el => 
            window.getComputedStyle(el).transform
        );
        
        expect(hoverTransform).not.toBe(initialTransform);
    });

    test('la grille doit être responsive et s\'adapter au mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        
        const galleryGrid = page.locator('.gallery-grid');
        const gridStyles = await galleryGrid.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
                display: computed.display,
                gridTemplateColumns: computed.gridTemplateColumns
            };
        });
        
        expect(gridStyles.display).toBe('grid');
        
        const firstItem = page.locator('.gallery-item').first();
        await expect(firstItem).toBeVisible();
        
        const box = await firstItem.boundingBox();
        expect(box.width).toBeGreaterThan(0);
        expect(box.width).toBeLessThanOrEqual(375);
    });

    test('les overlay des cartes doivent apparaître au hover', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        const overlay = firstItem.locator('.gallery-item__overlay');
        
        const initialOpacity = await overlay.evaluate(el => 
            window.getComputedStyle(el).opacity
        );
        
        expect(parseFloat(initialOpacity)).toBe(0);
        
        await firstItem.hover();
        await page.waitForTimeout(400);
        
        const hoverOpacity = await overlay.evaluate(el => 
            window.getComputedStyle(el).opacity
        );
        
        expect(parseFloat(hoverOpacity)).toBeGreaterThan(0.9);
    });

    test('le titre et la ville doivent être visibles dans l\'overlay au hover', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.hover();
        await page.waitForTimeout(400);
        
        const title = firstItem.locator('.gallery-item__title');
        const location = firstItem.locator('.gallery-item__location');
        
        await expect(title).toBeVisible();
        await expect(location).toBeVisible();
        
        const titleText = await title.textContent();
        const locationText = await location.textContent();
        
        expect(titleText.length).toBeGreaterThan(0);
        expect(locationText.length).toBeGreaterThan(0);
    });

    test('les cartes visibles ne doivent pas être hors de l\'écran horizontalement', async ({ page }) => {
        const items = page.locator('.gallery-item');
        const count = await items.count();
        
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        
        for (let i = 0; i < Math.min(count, 5); i++) {
            const box = await items.nth(i).boundingBox();
            if (box) {
                expect(box.left).toBeGreaterThanOrEqual(-10);
                expect(box.right).toBeLessThanOrEqual(viewportWidth + 10);
            }
        }
    });

    test('le scroll doit révéler plus de cartes', async ({ page }) => {
        const initialVisibleCount = await page.locator('.gallery-item').evaluateAll(items => {
            return items.filter(item => {
                const rect = item.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            }).length;
        });
        
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(500);
        
        const afterScrollVisibleCount = await page.locator('.gallery-item').evaluateAll(items => {
            return items.filter(item => {
                const rect = item.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            }).length;
        });
        
        expect(afterScrollVisibleCount).toBeGreaterThanOrEqual(initialVisibleCount);
    });

    test('au moins 50% des images doivent charger correctement', async ({ page }) => {
        const imageErrors = [];
        const imageSuccess = [];
        
        page.on('response', response => {
            if (response.url().includes('assets/medias-realisations')) {
                if (response.ok()) {
                    imageSuccess.push(response.url());
                } else {
                    imageErrors.push(response.url());
                }
            }
        });
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const totalImages = imageErrors.length + imageSuccess.length;
        const successRate = imageSuccess.length / totalImages;
        
        expect(successRate).toBeGreaterThan(0.5);
    });
});
