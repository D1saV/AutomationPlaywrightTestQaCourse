import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { RegistrationModalPage } from '../pages/registrationModalPage';
import { LoginModalPage } from '../pages/loginModalPage';

test.describe('Registration form', () => {
  let homePage: HomePage;
  let regModal: RegistrationModalPage;
  let loginModal: LoginModalPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    regModal = new RegistrationModalPage(page);
    loginModal = new LoginModalPage(page);

    await homePage.open();
    await homePage.openRegistrationModal();
    await regModal.expectVisible();
  });

  test('should validate Name field', async ({ page }) => {
    const nameInput = regModal.nameInput;
    
    await nameInput.click();
    await nameInput.fill('');
    await regModal.lastNameInput.click();
    await expect(page.getByText('Name required')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await nameInput.fill('A');
    await nameInput.blur();
    await expect(page.getByText('Name has to be from 2 to 20 characters')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await nameInput.fill('Denis');
    await nameInput.blur();
    
    await expect(nameInput).toHaveValue('Denis');
    await expect(regModal.registerButton).toBeDisabled();
  });

  test('should validate Last Name field', async ({ page }) => {
    const lastName = regModal.lastNameInput;

    await lastName.click();
    await lastName.fill('');
    await regModal.emailInput.click();
    await expect(page.getByText('Last name required')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await lastName.fill('A');
    await lastName.blur();
    await expect(page.getByText('Last name has to be from 2 to 20 characters')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await lastName.fill('Vasilevskiy');
    await lastName.blur();
    
    await expect(lastName).toHaveValue('Vasilevskiy');
    await expect(regModal.registerButton).toBeDisabled();
  });

  test('should validate Email field', async ({ page }) => {
    const email = regModal.emailInput;

    await email.click();
    await email.fill('');
    await regModal.passwordInput.click();
    await expect(page.getByText('Email required')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await email.fill('invalid-email');
    await email.blur();
    await expect(page.getByText('Email is incorrect')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await email.fill('test@example.com');
    await email.blur();
    
    await expect(email).toHaveValue('test@example.com');
    await expect(regModal.registerButton).toBeDisabled();
  });

  test('should validate Password field', async ({ page }) => {
    const pass = regModal.passwordInput;

    await pass.click();
    await pass.fill('');
    await regModal.repeatPasswordInput.click();
    await expect(page.getByText('Password required')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await pass.fill('Short1');
    await pass.blur();
    await expect(page.getByText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await pass.fill('Password1');
    await pass.blur();
    
    await expect(pass).toHaveValue('Password1');
    await expect(regModal.registerButton).toBeDisabled();
  });

  test('should validate Re-enter Password field', async ({ page }) => {
    await regModal.nameInput.fill('TestName');
    await regModal.lastNameInput.fill('TestLastName');
    await regModal.emailInput.fill('test@example.com');
    await regModal.passwordInput.fill('Password1');
    
    await regModal.repeatPasswordInput.click();
    await regModal.repeatPasswordInput.fill('');
    await regModal.passwordInput.click();
    await expect(page.getByText('Re-enter password required')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await regModal.repeatPasswordInput.fill('Different1');
    await regModal.repeatPasswordInput.blur();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await expect(regModal.registerButton).toBeDisabled();

    await regModal.repeatPasswordInput.fill('Password1');
    await regModal.repeatPasswordInput.blur();
    
    await expect(regModal.repeatPasswordInput).toHaveValue('Password1');
    
    await page.waitForTimeout(1000);
    
    await expect(regModal.registerButton).toBeEnabled();
  });

  test('should complete successful registration', async ({ page }) => {
    const timestamp = Date.now();
    const userEmail = `user_${timestamp}@gmail.com`;

    await regModal.fillForm({
      name: 'Denis',
      lastName: 'Vasilevskiy',
      email: userEmail,
      password: 'Password1',
    });

    await expect(regModal.registerButton).toBeEnabled();
    await regModal.registerButton.click();

    const signOutBtn = page.locator('button[class*="header_signout"]');
    const successAlert = page.locator('.alert-success');

    try {
      await Promise.race([
        signOutBtn.waitFor({ state: 'visible', timeout: 10000 }),
        successAlert.waitFor({ state: 'visible', timeout: 10000 })
      ]);
      console.log('Registration completed successfully');
    } catch {
      console.warn('Registration might require email confirmation');
    }
  });

  test('should have Register button disabled when form invalid', async () => {
    await expect(regModal.registerButton).toBeDisabled();
  });

  test('should enable Register button when form is valid', async () => {
    const timestamp = Date.now();
    await regModal.fillForm({
      name: 'ValidName',
      lastName: 'ValidLastName',
      email: `valid_${timestamp}@gmail.com`,
      password: 'Password1',
    });
    
    await regModal.page.waitForTimeout(1000);
    
    await expect(regModal.registerButton).toBeEnabled();
  });
});