import { test, expect } from '@playwright/test';

test('News18 homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/News18/i);
});
