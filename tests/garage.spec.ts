import { test, expect } from '../fixtures/userGaragePage';

test.describe('Garage tests', () => {
  
  test('should display all UI elements correctly', async ({ userGaragePage }) => {
    await userGaragePage.openAddCarModal();
    await userGaragePage.verifyAddCarModal();
    await userGaragePage.closeModal();
  });

  test('should modal open and close', async ({ userGaragePage }) => {
    await userGaragePage.openAddCarModal();
    await userGaragePage.closeModal();
    await userGaragePage.openAddCarModal();
    await userGaragePage.closeModal();
  });

  test('should add a valid car', async ({ userGaragePage }) => {
    await userGaragePage.addCar('Porsche', '911', '25000');
  });

  test('should show car UI elements after adding car', async ({ userGaragePage }) => {
    await userGaragePage.verifyCarDetails('Porsche', '911');
    await userGaragePage.verifyCarMileage('25000');
    await userGaragePage.verifyUpdateMileageForm();
    await expect(userGaragePage.editButton).toBeVisible();
    await expect(userGaragePage.addFuelExpenseButton).toBeVisible();
  });

  test('should edit car mileage', async ({ userGaragePage }) => {
    await userGaragePage.updateCarMileage('25150');
    await userGaragePage.verifyCarMileage('25150');
  });

  test('should remove car', async ({ userGaragePage }) => {
    await userGaragePage.removeCar('Porsche', '911');
    const removedCar = userGaragePage.findCarByBrandModel('Porsche', '911');
    await expect(removedCar).not.toBeVisible();
  });

  test('should verify car list is visible', async ({ userGaragePage }) => {
    await expect(userGaragePage.carList).toBeVisible();
    await expect(userGaragePage.carItems).toBeVisible();
  });
});