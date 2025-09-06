const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/orderRoutes');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const { auth } = require('../middlewares/authMiddleware');

// Create an Express app for testing
const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api/orders', orderRoutes);

// Mock the controller and middleware
jest.mock('../controllers/orderController');
jest.mock('../middlewares/authMiddleware');

describe('Order Routes', () => {
  let mockOrderData;

  beforeEach(() => {
    mockOrderData = {
      products: [
        { productId: 'product123', quantity: 2 },
        { productId: 'product456', quantity: 1 },
      ],
      totalPrice: 150,
    };
  });

  describe('POST /api/orders', () => {
    it('should successfully create a new order', async () => {
      // Mock the auth middleware to bypass authentication
      auth.mockImplementation((req, res, next) => next());

      // Mock the createOrder function to simulate order creation
      createOrder.mockImplementation((req, res) => {
        res.status(201).json({ message: 'Order placed' });
      });

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer mockToken') // Mock Authorization header
        .send(mockOrderData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Order placed');
    });

    it('should return 401 if unauthorized', async () => {
      // Mock the auth middleware to simulate unauthorized access
      auth.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer mockToken') // Mock Authorization header
        .send(mockOrderData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /api/orders/user', () => {
    it('should return a list of user orders', async () => {
      // Mock the auth middleware to bypass authentication
      auth.mockImplementation((req, res, next) => next());

      // Mock the getUserOrders function to simulate fetching user orders
      getUserOrders.mockImplementation((req, res) => {
        res.status(200).json([{ orderId: 'order123', totalPrice: 150 }]);
      });

      const response = await request(app)
        .get('/api/orders/user')
        .set('Authorization', 'Bearer mockToken'); // Mock Authorization header

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ orderId: 'order123', totalPrice: 150 }]);
    });

    it('should return 401 if unauthorized', async () => {
      // Mock the auth middleware to simulate unauthorized access
      auth.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Unauthorized' });
      });

      const response = await request(app)
        .get('/api/orders/user')
        .set('Authorization', 'Bearer mockToken'); // Mock Authorization header

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });
});
