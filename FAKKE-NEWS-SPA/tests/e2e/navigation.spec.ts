import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to home page', async ({ page }) => {
    await expect(page).toHaveTitle(/FAKKE NEWS/);
    await expect(page.locator('.ny-header')).toBeVisible();
  });

  test('should open and close sidebar menu', async ({ page }) => {
    // Open sidebar
    await page.click('.hamburger');
    await expect(page.locator('.panel')).toBeVisible();
    
    // Close sidebar
    await page.click('.close-btn');
    await expect(page.locator('.panel')).not.toBeVisible();
  });

  test('should navigate to categories from sidebar', async ({ page }) => {
    await page.click('.hamburger');
    await page.click('text=Categorías');
    await expect(page.locator('.panel-section')).toBeVisible();
  });

  test('should navigate to countries from sidebar', async ({ page }) => {
    await page.click('.hamburger');
    await page.click('text=Países');
    await expect(page.locator('.panel-section')).toBeVisible();
  });

  test('should use search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Buscar noticias..."]');
    await searchInput.fill('tecnología');
    await searchInput.press('Enter');
    
    // Should navigate to search results
    await expect(page).toHaveURL(/\/search/);
  });

  test('should use category dropdown', async ({ page }) => {
    const categoryDropdown = page.locator('select').first();
    await categoryDropdown.selectOption({ index: 1 });
    
    // Should navigate to category page
    await expect(page).toHaveURL(/\/category/);
  });

  test('should use country dropdown', async ({ page }) => {
    const countryDropdown = page.locator('select').nth(1);
    await countryDropdown.selectOption({ index: 1 });
    
    // Should navigate to country page
    await expect(page).toHaveURL(/\/country/);
  });
});
