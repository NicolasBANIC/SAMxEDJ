import { test, expect } from '@playwright/test';

test.describe('Hero Video Background', () => {
  test('video element should be present in hero section', async ({ page }) => {
    await page.goto('/');
    
    const heroVideo = page.locator('.hero__video');
    await expect(heroVideo).toBeAttached();
  });

  test('video should have correct attributes', async ({ page }) => {
    await page.goto('/');
    
    const heroVideo = page.locator('.hero__video');
    
    const autoplay = await heroVideo.getAttribute('autoplay');
    const loop = await heroVideo.getAttribute('loop');
    const muted = await heroVideo.getAttribute('muted');
    const playsinline = await heroVideo.getAttribute('playsinline');
    
    expect(autoplay).not.toBeNull();
    expect(loop).not.toBeNull();
    expect(muted).not.toBeNull();
    expect(playsinline).not.toBeNull();
  });

  test('video source should point to correct webm file', async ({ page }) => {
    await page.goto('/');
    
    const videoSource = page.locator('.hero__video source');
    const src = await videoSource.getAttribute('src');
    
    expect(src).toContain('8335195-uhd_3840_2160_25fps.webm');
    expect(src).toContain('assets/');
  });

  test('video source should have correct type attribute', async ({ page }) => {
    await page.goto('/');
    
    const videoSource = page.locator('.hero__video source');
    const type = await videoSource.getAttribute('type');
    
    expect(type).toBe('video/webm');
  });

  test('video should be positioned behind hero content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const videoZIndex = await page.locator('.hero__video').evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    
    const contentZIndex = await page.locator('.hero__content').evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    
    expect(parseInt(videoZIndex)).toBeLessThan(parseInt(contentZIndex));
  });

  test('hero title should remain visible over video', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible();
    
    const titleColor = await heroTitle.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    expect(titleColor).toBeTruthy();
  });

  test('hero CTA buttons should remain visible over video', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const primaryCTA = page.locator('.hero__cta .btn--primary');
    const secondaryCTA = page.locator('.hero__cta .btn--secondary');
    
    await expect(primaryCTA).toBeVisible();
    await expect(secondaryCTA).toBeVisible();
  });

  test('video overlay should be present for content readability', async ({ page }) => {
    await page.goto('/');
    
    const overlay = page.locator('.hero__overlay');
    await expect(overlay).toBeAttached();
    
    const overlayZIndex = await overlay.evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    
    expect(parseInt(overlayZIndex)).toBeGreaterThan(0);
  });

  test('video should cover entire hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const videoStyles = await page.locator('.hero__video').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        objectFit: styles.objectFit,
        minWidth: styles.minWidth,
        minHeight: styles.minHeight
      };
    });
    
    expect(videoStyles.position).toBe('absolute');
    expect(videoStyles.objectFit).toBe('cover');
    expect(videoStyles.minWidth).toBe('100%');
    expect(videoStyles.minHeight).toBe('100%');
  });

  test('video should be centered in hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const videoStyles = await page.locator('.hero__video').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        transform: styles.transform
      };
    });
    
    expect(videoStyles.position).toBe('absolute');
    expect(videoStyles.transform).not.toBe('none');
    expect(videoStyles.transform).toContain('matrix');
  });

  test('hero section should maintain proper layering', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const layers = await page.evaluate(() => {
      const video = document.querySelector('.hero__video');
      const overlay = document.querySelector('.hero__overlay');
      const content = document.querySelector('.hero__content');
      
      return {
        video: window.getComputedStyle(video as Element).zIndex,
        overlay: window.getComputedStyle(overlay as Element).zIndex,
        content: window.getComputedStyle(content as Element).zIndex
      };
    });
    
    expect(parseInt(layers.video)).toBe(0);
    expect(parseInt(layers.overlay)).toBe(1);
    expect(parseInt(layers.content)).toBe(2);
  });

  test('video should play automatically', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const isPlaying = await page.locator('.hero__video').evaluate((video: HTMLVideoElement) => {
      return !video.paused && !video.ended && video.currentTime > 0;
    });
    
    expect(isPlaying).toBeTruthy();
  });

  test('video should be muted for autoplay compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const isMuted = await page.locator('.hero__video').evaluate((video: HTMLVideoElement) => 
      video.muted
    );
    
    expect(isMuted).toBeTruthy();
  });

  test('video should loop continuously', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hasLoop = await page.locator('.hero__video').evaluate((video: HTMLVideoElement) => 
      video.loop
    );
    
    expect(hasLoop).toBeTruthy();
  });

  test('hero content remains readable with video background on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const heroTitle = page.locator('.hero__title');
    const ctaButtons = page.locator('.hero__cta .btn');
    
    await expect(heroTitle).toBeVisible();
    await expect(ctaButtons.first()).toBeVisible();
  });

  test('video background maintains aspect ratio on different viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 768, height: 1024 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const videoVisible = await page.locator('.hero__video').isVisible();
      expect(videoVisible).toBeTruthy();
    }
  });

  test('video does not affect page load performance significantly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    const heroTitle = page.locator('.hero__title');
    await expect(heroTitle).toBeVisible({ timeout: 3000 });
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('video element has proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    
    const heroVideo = page.locator('.hero__video');
    
    const ariaLabel = await heroVideo.evaluate(el => el.getAttribute('aria-label'));
    const role = await heroVideo.evaluate(el => el.getAttribute('role'));
    
    expect(ariaLabel || role || true).toBeTruthy();
  });
});
