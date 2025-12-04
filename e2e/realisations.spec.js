const { test, expect } = require('@playwright/test');

test.describe('Page Réalisations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/realisations.html');
        await page.waitForLoadState('networkidle');
    });

    test('doit charger toutes les réalisations réelles (31 chantiers)', async ({ page }) => {
        const galleryItems = page.locator('.gallery-item');
        await expect(galleryItems).toHaveCount(31);
    });

    test('les cartes doivent être visuellement visibles (opacity > 0)', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await expect(firstItem).toBeVisible();
        
        const opacity = await firstItem.evaluate(el => {
            return window.getComputedStyle(el).opacity;
        });
        
        expect(parseFloat(opacity)).toBeGreaterThan(0);
    });

    test('les cartes doivent avoir des dimensions visibles (width/height > 0)', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        
        const box = await firstItem.boundingBox();
        expect(box).not.toBeNull();
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
    });

    test('les images des cartes doivent être visibles', async ({ page }) => {
        const firstImage = page.locator('.gallery-item img').first();
        await expect(firstImage).toBeVisible();
        
        const naturalWidth = await firstImage.evaluate(img => img.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
    });

    test('la grille doit occuper de l\'espace à l\'écran', async ({ page }) => {
        const gallery = page.locator('.gallery-grid');
        
        const box = await gallery.boundingBox();
        expect(box).not.toBeNull();
        expect(box.height).toBeGreaterThan(100);
    });

    test('ne doit afficher aucune image Unsplash (exemples fictifs)', async ({ page }) => {
        const images = page.locator('.gallery-item img');
        const count = await images.count();
        
        for (let i = 0; i < count; i++) {
            const src = await images.nth(i).getAttribute('src');
            expect(src).not.toContain('unsplash.com');
            expect(src).toContain('assets/medias-realisations');
        }
    });

    test('doit afficher les filtres avec "Tous les projets" actif par défaut', async ({ page }) => {
        const activeFilter = page.locator('.filter-btn.active');
        await expect(activeFilter).toHaveText('Tous les projets');
    });

    test('doit filtrer les réalisations par catégorie Piscines', async ({ page }) => {
        const piscineFilter = page.locator('.filter-btn[data-filter="piscine"]');
        await piscineFilter.click();
        
        await page.waitForTimeout(500);
        
        const visibleItems = page.locator('.gallery-item');
        const count = await visibleItems.count();
        
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThan(33);
        
        await expect(piscineFilter).toHaveClass(/active/);
    });

    test('doit filtrer les réalisations par catégorie Aménagements', async ({ page }) => {
        const amenagementFilter = page.locator('.filter-btn[data-filter="amenagement"]');
        await amenagementFilter.click();
        
        await page.waitForTimeout(500);
        
        const visibleItems = page.locator('.gallery-item');
        const count = await visibleItems.count();
        
        expect(count).toBeGreaterThan(20);
        
        await expect(amenagementFilter).toHaveClass(/active/);
    });

    test('doit ouvrir une modale au clic sur une réalisation', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        await expect(modal).toHaveClass(/active/);
    });

    test('la modale doit afficher le titre, la ville et la description', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const title = modal.locator('.modal-realisation__title');
        const city = modal.locator('.modal-realisation__city');
        const description = modal.locator('.modal-realisation__description');
        
        await expect(title).toBeVisible();
        await expect(city).toBeVisible();
        await expect(description).toBeVisible();
        
        await expect(title).not.toBeEmpty();
        await expect(city).not.toBeEmpty();
        await expect(description).not.toBeEmpty();
    });

    test('le carrousel doit afficher plusieurs images', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const slides = page.locator('.modal-carousel__slide');
        const count = await slides.count();
        
        expect(count).toBeGreaterThan(1);
        
        const activeSlide = page.locator('.modal-carousel__slide.active');
        await expect(activeSlide).toHaveCount(1);
    });

    test('le carrousel doit naviguer avec le bouton suivant', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const counter = page.locator('.modal-carousel__counter .current');
        await expect(counter).toHaveText('1');
        
        const nextBtn = page.locator('.modal-carousel__btn--next');
        await nextBtn.click();
        
        await page.waitForTimeout(300);
        await expect(counter).toHaveText('2');
    });

    test('le carrousel doit naviguer avec le bouton précédent', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const nextBtn = page.locator('.modal-carousel__btn--next');
        await nextBtn.click();
        await page.waitForTimeout(300);
        
        const prevBtn = page.locator('.modal-carousel__btn--prev');
        await prevBtn.click();
        
        await page.waitForTimeout(300);
        
        const counter = page.locator('.modal-carousel__counter .current');
        await expect(counter).toHaveText('1');
    });

    test('le carrousel doit naviguer avec les touches fléchées', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const counter = page.locator('.modal-carousel__counter .current');
        await expect(counter).toHaveText('1');
        
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(300);
        await expect(counter).toHaveText('2');
        
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(300);
        await expect(counter).toHaveText('1');
    });

    test('doit fermer la modale avec le bouton de fermeture', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const closeBtn = page.locator('.modal-realisation__close');
        await closeBtn.click();
        
        await page.waitForTimeout(400);
        await expect(modal).not.toBeVisible();
    });

    test('doit fermer la modale en cliquant sur l\'overlay', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const overlay = page.locator('.modal-realisation__overlay');
        await overlay.click({ position: { x: 5, y: 5 } });
        
        await page.waitForTimeout(500);
        
        const modalExists = await modal.count();
        expect(modalExists).toBe(0);
    });

    test('doit fermer la modale avec la touche Escape', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        await page.keyboard.press('Escape');
        
        await page.waitForTimeout(400);
        await expect(modal).not.toBeVisible();
    });

    test('la modale doit bloquer le scroll de la page', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const bodyOverflow = await page.evaluate(() => {
            return window.getComputedStyle(document.body).overflow;
        });
        
        expect(bodyOverflow).toBe('hidden');
    });

    test('la fermeture de la modale doit restaurer le scroll', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const closeBtn = page.locator('.modal-realisation__close');
        await closeBtn.click();
        
        await page.waitForTimeout(400);
        
        const bodyOverflow = await page.evaluate(() => {
            return window.getComputedStyle(document.body).overflow;
        });
        
        expect(bodyOverflow).not.toBe('hidden');
    });

    test('doit afficher le compteur d\'images correctement', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const total = page.locator('.modal-carousel__counter .total');
        const totalText = await total.textContent();
        const totalNumber = parseInt(totalText);
        
        expect(totalNumber).toBeGreaterThan(1);
    });

    test('les images du carrousel doivent provenir du bon dossier', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const firstSlideImg = page.locator('.modal-carousel__slide.active img');
        const src = await firstSlideImg.getAttribute('src');
        
        expect(src).toContain('assets/medias-realisations');
    });

    test('doit tester une réalisation spécifique (Geispolsheim)', async ({ page }) => {
        const geispolsheimItem = page.locator('.gallery-item').filter({ 
            hasText: 'Geispolsheim' 
        }).first();
        
        await expect(geispolsheimItem).toBeVisible();
        await geispolsheimItem.click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const title = modal.locator('.modal-realisation__title');
        await expect(title).toContainText('Geispolsheim');
    });

    test('doit tester une réalisation de piscine (Gambsheim)', async ({ page }) => {
        const piscineFilter = page.locator('.filter-btn[data-filter="piscine"]');
        await piscineFilter.click();
        await page.waitForTimeout(500);
        
        const gambsheimItem = page.locator('.gallery-item').filter({ 
            hasText: 'Gambsheim' 
        }).first();
        
        if (await gambsheimItem.count() > 0) {
            await gambsheimItem.click();
            
            const modal = page.locator('.modal-realisation');
            await expect(modal).toBeVisible();
            
            const category = modal.locator('.modal-realisation__info');
            await expect(category).toContainText(/piscine/i);
        }
    });

    test('doit vérifier la responsivité mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const galleryItems = page.locator('.gallery-item');
        await expect(galleryItems.first()).toBeVisible();
        
        await galleryItems.first().click();
        
        const modal = page.locator('.modal-realisation');
        await expect(modal).toBeVisible();
        
        const modalContent = page.locator('.modal-realisation__content');
        const width = await modalContent.evaluate(el => el.offsetWidth);
        
        expect(width).toBeLessThanOrEqual(375);
    });

    test('doit vérifier la responsivité tablette', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const galleryItems = page.locator('.gallery-item');
        await expect(galleryItems.first()).toBeVisible();
    });

    test('le carrousel doit boucler (dernière image → première image)', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const total = page.locator('.modal-carousel__counter .total');
        const totalText = await total.textContent();
        const totalNumber = parseInt(totalText);
        
        const nextBtn = page.locator('.modal-carousel__btn--next');
        const counter = page.locator('.modal-carousel__counter .current');
        
        for (let i = 1; i < totalNumber; i++) {
            await nextBtn.click();
            await page.waitForTimeout(200);
        }
        
        await expect(counter).toHaveText(totalNumber.toString());
        
        await nextBtn.click();
        await page.waitForTimeout(300);
        
        await expect(counter).toHaveText('1');
    });

    test('doit vérifier qu\'aucune vidéo n\'est affichée dans le carrousel', async ({ page }) => {
        const firstItem = page.locator('.gallery-item').first();
        await firstItem.click();
        
        const videoElements = page.locator('.modal-carousel__slide video');
        await expect(videoElements).toHaveCount(0);
        
        const imageElements = page.locator('.modal-carousel__slide img');
        await expect(imageElements.first()).toBeVisible();
    });
});
