import { Page, Locator, expect } from '@playwright/test';

export class LoginModalPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginTabButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('.modal-content').filter({ has: page.locator('.modal-title', { hasText: 'Log in' }) });
    this.modalTitle = this.modal.locator('.modal-title');
    this.emailInput = this.modal.locator('#signinEmail');
    this.passwordInput = this.modal.locator('#signinPassword');
    this.loginTabButton = this.modal.locator('.btn.btn-primary', { hasText: 'Login' });
  }

  async expectVisible() {
    await expect(this.modal).toBeVisible();
    await expect(this.modalTitle).toContainText('Log in');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginTabButton.click();
  }
}