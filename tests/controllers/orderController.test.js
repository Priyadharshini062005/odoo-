const request = require('supertest');
const app = require('../../app');
const Order = require('../../models/orderModel');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

// Mocking the Order model
jest.mock('../../models/orderModel');

describe('Order Controller - Order Operations', () => {

  beforeAll(async () => {
    await connectDB(); // Establish DB connection before all tests
  });

  afterAll(async () => {
    await closeDB(); // Close DB connection after all tests
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  //  Test createOrder
  describe('createOrder', () => {
    it('should place a new order successfully', async () => {
      // Mocking the request body
      const reqBody = {
        products: [
          { productId: '123', quantity: 2, price: 50 },
          { productId: '456', quantity: 1, price: 100 }
        ],
        totalPrice: 200
      };

      // Mock Order model's save method
      const mockSave = jest.fn().mockResolvedValue({
        user: 'user123',
        products: reqBody.products,
        totalPrice: reqBody.totalPrice,
      });

      Order.prototype.save = mockSave;

      const res = await request(app)
        .post('/api/orders') // Assuming your route for createOrder is '/api/orders'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response status is 201 and the correct message is returned
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Order placed');
      expect(res.body.order).toHaveProperty('user', 'user123');
      expect(res.body.order).toHaveProperty('products', reqBody.products);
      expect(res.body.order).toHaveProperty('totalPrice', reqBody.totalPrice);
      expect(mockSave).toHaveBeenCalledTimes(1); // Ensure save is called once
    });

    it('should return a 400 error if products are not provided', async () => {
      const reqBody = { totalPrice: 100 };

      const res = await request(app)
        .post('/api/orders')
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response status is 400 and the correct error message is returned
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Products are required');
    });
  });

  //  Test getUserOrders
  describe('getUserOrders', () => {
    it('should return a list of orders for the authenticated user', async () => {
      // Mocking the Order model's find method to return an array of orders
      const mockOrders = [
        { user: 'user123', products: [{ productId: '123', quantity: 2 }], totalPrice: 200 },
        { user: 'user123', products: [{ productId: '456', quantity: 1 }], totalPrice: 100 }
      ];
      Order.find = jest.fn().mockResolvedValue(mockOrders);

      const res = await request(app)
        .get('/api/orders') 
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response contains the orders
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrders);
      expect(Order.find).toHaveBeenCalledWith({ user: 'user123' });
    });

    it('should return an empty array if no orders are found', async () => {
      // Mocking the Order model's find method to return an empty array
      Order.find = jest.fn().mockResolvedValue([]);

      const res = await request(app)
        .get('/api/orders') 
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is an empty array
      expect(res.status).toBe(404);
      expect(res.body).toEqual({});
      expect(Order.find).toHaveBeenCalledWith({ user: 'user123' });
    });
  });

});
