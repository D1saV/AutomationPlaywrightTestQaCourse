import { Page, Locator, expect } from '@playwright/test';

export class GaragePage {
    readonly page: Page;
    
    readonly addCarButton: Locator;
    readonly modalContent: Locator;
    readonly modalTitle: Locator;
    readonly closeButton: Locator;
    readonly carList: Locator;
    readonly carItems: Locator;
    readonly firstCarItem: Locator;
    readonly brandSelect: Locator;
    readonly modelSelect: Locator;
    readonly mileageInput: Locator;
    readonly addButton: Locator;
    readonly cancelButton: Locator;
    readonly inputGroupText: Locator;
    readonly carLogo: Locator;
    readonly carName: Locator;
    readonly carActions: Locator;
    readonly carBody: Locator;
    readonly editButton: Locator;
    readonly addFuelExpenseButton: Locator;
    readonly updateMileageForm: Locator;
    readonly updateMileageIcon: Locator;
    readonly updateMileageInput: Locator;
    readonly updateMileageSubmit: Locator;
    readonly updateMileageDate: Locator;
    readonly editModalHeader: Locator;
    readonly editModalFooter: Locator;
    readonly removeCarButton: Locator;
    readonly saveButton: Locator;
    readonly carCreationDateInput: Locator;
    readonly datePickerIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.addCarButton = page.getByRole('button', { name: 'Add car' });
        this.modalContent = page.locator('.modal-content');
        this.modalTitle = this.modalContent.locator('.modal-title');
        this.closeButton = page.locator('button.close');
        this.carList = page.locator('.car-list');
        this.carItems = page.locator('.car-item').first();
        this.firstCarItem = this.carItems.first();
        this.brandSelect = page.locator('#addCarBrand');
        this.modelSelect = page.locator('#addCarModel');
        this.mileageInput = page.locator('#addCarMileage');
        this.addButton = this.modalContent.locator('button', { hasText: 'Add' });
        this.cancelButton = page.locator('button', { hasText: 'Cancel' });
        this.inputGroupText = page.locator('.input-group-text');
        this.carLogo = page.locator('.car-item .car-logo').first();
        this.carName = page.locator('.car-item .car-name').first();
        this.carActions = page.locator('.car-item .car_actions').first();
        this.carBody = page.locator('.car-item .car-body').first();
        this.editButton = page.locator('.car-item .car_edit').first();
        this.addFuelExpenseButton = page.locator('button', { hasText: 'Add fuel expense' }).first();
        this.updateMileageForm = page.locator('form.update-mileage-form').first();
        this.updateMileageIcon = page.locator('.update-mileage-form_icon').first();
        this.updateMileageInput = page.locator('input[name="miles"]').first();
        this.updateMileageSubmit = page.locator('button.update-mileage-form_submit').first();
        this.updateMileageDate = page.locator('.car_update-mileage').first();
        this.editModalHeader = page.locator('.modal-header');
        this.editModalFooter = page.locator('.modal-footer');
        this.removeCarButton = page.locator('button', { hasText: 'Remove car' });
        this.saveButton = page.locator('button', { hasText: 'Save' });
        this.carCreationDateInput = page.locator('#carCreationDate');
        this.datePickerIcon = page.locator('.icon-calendar');
    }

    async open() {
        await this.page.goto('/panel/garage');
    }

    async openAddCarModal() {
        await this.addCarButton.click();
        await expect(this.modalContent).toBeVisible();
    }

    async closeModal() {
        await this.closeButton.click();
        await expect(this.modalContent).not.toBeVisible();
    }

    async verifyAddCarModal() {
        await expect(this.modalTitle).toContainText('Add a car');
        await expect(this.closeButton).toBeVisible();
        await expect(this.modalContent.locator('label[for="addCarBrand"]')).toContainText('Brand');
        await expect(this.modalContent.locator('label[for="addCarModel"]')).toContainText('Model');
        await expect(this.modalContent.locator('label[for="addCarMileage"]')).toContainText('Mileage');
        await expect(this.brandSelect).toBeVisible();
        await expect(this.modelSelect).toBeVisible();
        await expect(this.mileageInput).toBeVisible();
        await expect(this.mileageInput).toHaveAttribute('type', 'number');
        await expect(this.inputGroupText).toContainText('km');
        await expect(this.cancelButton).toBeVisible();
        await expect(this.addButton).toBeVisible();
        await expect(this.addButton).toBeDisabled();
    }

    async addCar(brand: string, model: string, mileage: string) {
        await this.openAddCarModal();
        await this.selectBrand(brand);
        await this.selectModel(model);
        await this.enterMileage(mileage);
        await expect(this.addButton).toBeEnabled();
        await this.addButton.click();
        const carItem = this.findCarByBrandModel(brand, model);
        await expect(carItem).toBeVisible({ timeout: 10000 });
    }

    async selectBrand(brand: string) {
        await this.brandSelect.selectOption(brand);
    }

    async selectModel(model: string) {
        await this.modelSelect.selectOption(model);
    }

    async enterMileage(mileage: string) {
        await this.mileageInput.fill(mileage);
    }

    async openEditModal() {
        await this.editButton.click();
        await expect(this.modalContent).toBeVisible();
    }

    async verifyEditCarModal() {
        await expect(this.modalTitle).toContainText('Edit a car');
        await expect(this.brandSelect).toBeVisible();
        await expect(this.modelSelect).toBeVisible();
        await expect(this.mileageInput).toBeVisible();
        await expect(this.removeCarButton).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
        await expect(this.saveButton).toBeVisible();
    }

    async updateCarMileage(newMileage: string) {
        await this.updateMileageInput.clear();
        await this.updateMileageInput.fill(newMileage);
        await this.page.waitForTimeout(5000);
        await expect(this.updateMileageSubmit).toBeEnabled();
        await this.updateMileageSubmit.click();
        
    }

    async verifyCarDetails(brand: string, model: string) {
        const carItem = this.findCarByBrandModel(brand, model);
        await expect(carItem).toBeVisible();
        await expect(carItem).toContainText(`${brand} ${model}`);
        await expect(this.carActions).toBeVisible();
        await expect(this.carBody).toBeVisible();
    }

    async verifyCarMileage(expectedMileage: string) {
        await expect(this.updateMileageInput).toHaveValue(expectedMileage);
    }

    async verifyUpdateMileageForm() {
        await expect(this.carBody).toBeVisible();
        await expect(this.updateMileageInput).toBeVisible();
        await expect(this.updateMileageSubmit).toBeVisible();
    }

    async removeCar(brand: string, model: string) {
        await this.openEditModal();
        await this.removeCarButton.click();
        const confirmButton = this.page.locator('.btn-danger', { hasText: 'Remove' });
        await confirmButton.click();
        const carItem = this.findCarByBrandModel(brand, model);
        await expect(carItem).not.toBeVisible();
    }

    findCarByBrandModel(brand: string, model: string): Locator {
        return this.page.locator('.car-item').filter({ 
            hasText: new RegExp(`${brand} ${model}`) 
        }).first();
    }

    async getCarMileageValue(): Promise<string> {
        return await this.updateMileageInput.inputValue();
    }

    async getCarItemText(): Promise<string> {
        return await this.firstCarItem.textContent() || '';
    }
}