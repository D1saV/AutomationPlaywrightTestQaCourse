import { test, expect } from '../../fixtures/userGaragePage';


test.describe('Cars API test', () => {

  test('success create', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: { carBrandId: 1, carModelId: 1, mileage: 122 },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.data).toHaveProperty('id');
    expect(body.data.mileage).toBe(122);
    expect(body.data.brand).toBeDefined();
    expect(body.data.model).toBeDefined();
    expect(body.data.updatedMileageAt).toBeDefined();
  });

  test('bad request', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: { carBrandId: 'wrong', mileage: -10 }, 
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('Invalid car brand type');
    expect(body.data).toBeUndefined();
  });
  
  test('check response fields', async ({ request }) => {
    const response = await request.post('/api/cars', {
      data: { carBrandId: 1, carModelId: 1, mileage: 5000 },
    });

    const body = await response.json();
    expect(body.data).toHaveProperty('id');
    expect(body.data.initialMileage).toBe(5000);
    expect(body.data.updatedMileageAt).toMatch(/\d{4}-\d{2}-\d{2}T/); 
  });

  test('route not found', async ({ request }) => {
    const response = await request.post('/api/nonexistent', {
      data: { carBrandId: 1, carModelId: 1, mileage: 100 },
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.status).toBe('error');
    expect(body.message).toBe('Not found');
  });

});
