import { test, expect } from '../fixtures/userGaragePage';

test('change user profile name in response', async ({ userGaragePage }) => {

  await userGaragePage.page.route('**/api/users/profile', async route => {
    const changedProfileResponse = {
      "status": "ok",
      "data": {
        "userId": 282130,
        "photoFilename": "default-user.png",
        "name": "Імʼя Змінено", 
        "lastName": "Успішно"
      }
    };

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(changedProfileResponse),
    });
  });

  const profileBtn = userGaragePage.page.locator('a.btn-sidebar.-profile');
  await profileBtn.click();

  await userGaragePage.page.waitForTimeout(5000);

  await expect(userGaragePage.page.locator('p.profile_name.display-4')).toHaveText("Імʼя Змінено Успішно");

});
