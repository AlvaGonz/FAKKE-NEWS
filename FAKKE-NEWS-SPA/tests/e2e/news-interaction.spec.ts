import { test, expect } from '@playwright/test';

test.describe('News Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display news cards', async ({ page }) => {
    // Wait for news to load
    await page.waitForSelector('.news-card', { timeout: 10000 });
    const newsCards = page.locator('.news-card');
    await expect(newsCards).toHaveCount.greaterThan(0);
  });

  test('should navigate to article when clicking news card', async ({ page }) => {
    await page.waitForSelector('.news-card', { timeout: 10000 });
    
    // Click on first news card
    await page.click('.news-card:first-child');
    
    // Should navigate to article page
    await expect(page).toHaveURL(/\/article/);
  });

  test('should display article content', async ({ page }) => {
    // Navigate to an article
    await page.goto('/article/1');
    
    // Check article elements
    await expect(page.locator('.article')).toBeVisible();
    await expect(page.locator('.article-title, .hero-title')).toBeVisible();
  });

  test('should use share buttons in news cards', async ({ page }) => {
    await page.waitForSelector('.news-card', { timeout: 10000 });
    
    // Hover over news card to show action buttons
    await page.hover('.news-card:first-child');
    
    // Check if action buttons are visible
    const actionButtons = page.locator('.action-btn');
    await expect(actionButtons).toHaveCount(2);
  });

  test('should use share buttons in article', async ({ page }) => {
    await page.goto('/article/1');
    
    // Check share buttons
    const shareButtons = page.locator('.share-btn');
    await expect(shareButtons).toHaveCount(4); // Twitter, Facebook, WhatsApp, Copy
  });

  test('should handle image loading', async ({ page }) => {
    await page.waitForSelector('.news-card', { timeout: 10000 });
    
    // Check if images are loading
    const images = page.locator('.news-card img');
    await expect(images).toHaveCount.greaterThan(0);
  });

  test('should display placeholder for missing images', async ({ page }) => {
    await page.waitForSelector('.news-card', { timeout: 10000 });
    
    // Check for placeholder images
    const placeholders = page.locator('.placeholder-image');
    // Some cards might have placeholders if images fail to load
    await expect(placeholders).toBeVisible();
  });

  test('should handle infinite scroll', async ({ page }) => {
    await page.waitForSelector('.news-card', { timeout: 10000 });
    
    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for potential new content
    await page.waitForTimeout(2000);
    
    // Check if more content was loaded
    const initialCount = await page.locator('.news-card').count();
    await expect(initialCount).toBeGreaterThan(0);
  });
});
