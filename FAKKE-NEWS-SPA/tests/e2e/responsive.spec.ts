import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if header is responsive
    await expect(page.locator('.ny-header')).toBeVisible();
    
    // Check if hamburger menu is visible on mobile
    await expect(page.locator('.hamburger')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check if layout adapts to tablet
    await expect(page.locator('.ny-header')).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Check if layout adapts to desktop
    await expect(page.locator('.ny-header')).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
  });

  test('should handle sidebar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open sidebar
    await page.click('.hamburger');
    await expect(page.locator('.panel')).toBeVisible();
    
    // Close sidebar
    await page.click('.close-btn');
    await expect(page.locator('.panel')).not.toBeVisible();
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test touch scrolling
    await page.evaluate(() => window.scrollTo(0, 100));
    
    // Check if content is scrollable
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should maintain functionality across screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 720, name: 'desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check basic functionality
      await expect(page.locator('.ny-header')).toBeVisible();
      await expect(page.locator('.logo')).toBeVisible();
      
      // Check if search is accessible
      const searchInput = page.locator('input[placeholder="Buscar noticias..."]');
      await expect(searchInput).toBeVisible();
    }
  });
});
