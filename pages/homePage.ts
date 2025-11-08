import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly registrationTabButton: Locator;
  readonly loginTabButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('.btn.btn-outline-white.header_signin');
    this.registrationTabButton = page.getByRole('button', { name: 'Registration' });
    this.loginTabButton = page.getByRole('button', { name: 'Log in' });
  }

  async open() {
    await this.page.goto('/');
  }

  async openRegistrationModal() {
    await this.signInButton.click();
    await expect(this.registrationTabButton).toBeVisible();
    await this.registrationTabButton.click();
    await this.page.waitForTimeout(500);
  }

  async openLoginModal() {
    await this.signInButton.click();
    await expect(this.loginTabButton).toBeVisible();
    await this.loginTabButton.click();
    await this.page.waitForTimeout(500);
  }
}