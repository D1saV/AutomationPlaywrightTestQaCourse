import { Page, Locator, expect } from '@playwright/test';

export class RegistrationModalPage {
  readonly page: Page;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('.modal-content').filter({ has: page.locator('.modal-title', { hasText: 'Registration' }) });
    this.modalTitle = this.modal.locator('.modal-title');
    this.nameInput = this.modal.locator('#signupName');
    this.lastNameInput = this.modal.locator('#signupLastName');
    this.emailInput = this.modal.locator('#signupEmail');
    this.passwordInput = this.modal.locator('#signupPassword');
    this.repeatPasswordInput = this.modal.locator('#signupRepeatPassword');
    this.registerButton = this.modal.locator('.btn.btn-primary', { hasText: 'Register' });
  }

  async expectVisible() {
    await expect(this.modal).toBeVisible();
    await expect(this.modalTitle).toContainText('Registration');
  }

  async fillForm(data: {
    name: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.repeatPasswordInput.fill(data.password);
  }
}