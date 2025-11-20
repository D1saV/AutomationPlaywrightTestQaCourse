import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { LoginModalPage } from '../../pages/loginModalPage';

test('login and save storage state', async ({ page }) => {
  const home = new HomePage(page);
  const login = new LoginModalPage(page);

  await home.open();
  await home.openLoginModal();
  await login.expectVisible();

  await login.login(process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
  await expect(page.locator('.dropdown-toggle.user-nav_toggle', { hasText: 'My profile' })).toBeVisible();

  await page.context().storageState({ path: 'storageState.json' });
});
