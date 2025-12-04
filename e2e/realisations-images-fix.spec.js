const { test, expect } = require('@playwright/test');

test.describe('Réalisations - Vérification Images Metz et Eschau', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/realisations.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
    });

    test('les images du chantier Metz doivent se charger correctement', async ({ page }) => {
        const metzCard = page.locator('.gallery-item').filter({ hasText: 'Metz' }).first();
        await expect(metzCard).toBeVisible();
        
        const metzImage = metzCard.locator('img').first();
        await expect(metzImage).toBeVisible();
        
        const naturalWidth = await metzImage.evaluate(img => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
        const src = await metzImage.getAttribute('src');
        expect(src).toContain('medias-realisations');
        expect(src).toContain('Metz');
    });

    test('la modale du chantier Metz doit afficher toutes les images', async ({ page }) => {
        const metzCard = page.locator('.gallery-item').filter({ hasText: 'Metz' }).first();
        await metzCard.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        await page.waitForTimeout(500);
        
        const activeSlide = page.locator('.modal-carousel__slide.active img');
        await expect(activeSlide).toBeVisible();
        
        const naturalWidth = await activeSlide.evaluate(img => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
        const totalSlides = await page.locator('.modal-carousel__slide').count();
        expect(totalSlides).toBeGreaterThan(5);
    });

    test('les images du chantier Eschau (bacs à fleurs) doivent se charger correctement', async ({ page }) => {
        const eschauCard = page.locator('.gallery-item').filter({ hasText: 'bacs à fleurs' }).first();
        await expect(eschauCard).toBeVisible();
        
        const eschauImage = eschauCard.locator('img').first();
        await expect(eschauImage).toBeVisible();
        
        const naturalWidth = await eschauImage.evaluate(img => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
        const src = await eschauImage.getAttribute('src');
        expect(src).toContain('medias-realisations');
        expect(src).toContain('Eschau');
    });

    test('la modale du chantier Eschau doit afficher toutes les images', async ({ page }) => {
        const eschauCard = page.locator('.gallery-item').filter({ hasText: 'bacs à fleurs' }).first();
        await eschauCard.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        await page.waitForTimeout(500);
        
        const activeSlide = page.locator('.modal-carousel__slide.active img');
        await expect(activeSlide).toBeVisible();
        
        const naturalWidth = await activeSlide.evaluate(img => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
        
        const totalSlides = await page.locator('.modal-carousel__slide').count();
        expect(totalSlides).toBe(4);
    });

    test('naviguer dans le carrousel Metz doit charger toutes les images', async ({ page }) => {
        const metzCard = page.locator('.gallery-item').filter({ hasText: 'Metz' }).first();
        await metzCard.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const nextBtn = page.locator('.modal-carousel__btn--next');
        const totalSlides = await page.locator('.modal-carousel__slide').count();
        
        for (let i = 0; i < Math.min(totalSlides, 5); i++) {
            const activeSlide = page.locator('.modal-carousel__slide.active img');
            await expect(activeSlide).toBeVisible();
            
            const naturalWidth = await activeSlide.evaluate(img => img.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
            
            if (i < Math.min(totalSlides, 5) - 1) {
                await nextBtn.click();
                await page.waitForTimeout(300);
            }
        }
    });

    test('naviguer dans le carrousel Eschau doit charger toutes les images', async ({ page }) => {
        const eschauCard = page.locator('.gallery-item').filter({ hasText: 'bacs à fleurs' }).first();
        await eschauCard.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const nextBtn = page.locator('.modal-carousel__btn--next');
        const totalSlides = await page.locator('.modal-carousel__slide').count();
        
        for (let i = 0; i < totalSlides; i++) {
            const activeSlide = page.locator('.modal-carousel__slide.active img');
            await expect(activeSlide).toBeVisible();
            
            const naturalWidth = await activeSlide.evaluate(img => img.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
            
            if (i < totalSlides - 1) {
                await nextBtn.click();
                await page.waitForTimeout(300);
            }
        }
    });

    test('les images de Metz et Eschau se chargent correctement après scroll', async ({ page }) => {
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const metzCard = page.locator('.gallery-item').filter({ hasText: 'Metz' }).first();
        await metzCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        const metzImage = metzCard.locator('img').first();
        const metzWidth = await metzImage.evaluate(img => img.naturalWidth);
        expect(metzWidth).toBeGreaterThan(0);
        
        const eschauCard = page.locator('.gallery-item').filter({ hasText: 'bacs à fleurs' }).first();
        await eschauCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        const eschauImage = eschauCard.locator('img').first();
        const eschauWidth = await eschauImage.evaluate(img => img.naturalWidth);
        expect(eschauWidth).toBeGreaterThan(0);
    });
});
