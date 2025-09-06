const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cartRoutes = require('../routes/cartRoutes');
const Cart = require('../models/cartModel'); // Assuming you have a Cart model

// Create an Express app for testing
const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api/cart', cartRoutes);

jest.mock('../models/cartModel'); // Mock the Cart model

describe('Cart Routes', () => {
  let mockCart;
  let mockUserId = 'user123';
  let mockProductId = 'product123';

  beforeEach(() => {
    // Reset mock before each test
    mockCart = {
      userId: mockUserId,
      items: [{
        productId: mockProductId,
        title: 'Product 1',
        price: 100,
        quantity: 1,
        total: 100,
      }],
      totalQuantity: 1,
      totalPrice: 100,
    };
  });

  afterAll(() => {
    mongoose.connection.close(); // Close MongoDB connection after tests are done
  });

  describe('GET /api/cart/:userId', () => {
    it('should return the cart for the user', async () => {
      // Mock the Cart.findOne() method to return the mockCart
      Cart.findOne = jest.fn().mockResolvedValue(mockCart);

      const response = await request(app).get(`/api/cart/${mockUserId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCart); // Response should return the mockCart
    });

    it('should return 404 if cart is not found', async () => {
      Cart.findOne = jest.fn().mockResolvedValue(null); // No cart found for the user

      const response = await request(app).get(`/api/cart/${mockUserId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Cart not found');
    });
  });

  describe('POST /api/cart/add', () => {
    it('should add an item to the cart', async () => {
      const newItem = {
        productId: mockProductId,
        userId: mockUserId,
        title: 'Product 1',
        price: 100,
        quantity: 2,
      };

      Cart.findOneAndUpdate = jest.fn().mockResolvedValue(mockCart); // Mocking Cart update

      const response = await request(app).post('/api/cart/add').send(newItem);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Item added to cart successfully');
    });

    it('should return 400 if the request is malformed', async () => {
      const invalidItem = { quantity: -1 }; // Missing necessary fields

      const response = await request(app).post('/api/cart/add').send(invalidItem);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bad request');
    });
  });

  describe('PUT /api/cart/:userId', () => {
    it('should update the quantity of a cart item', async () => {
      const updatedItem = { quantity: 3 };

      Cart.findOneAndUpdate = jest.fn().mockResolvedValue(mockCart);

      const response = await request(app).put(`/api/cart/${mockUserId}`).send(updatedItem);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Cart item updated successfully');
    });

    it('should return 400 if quantity is invalid', async () => {
      const invalidQuantity = { quantity: -1 }; // Invalid quantity

      const response = await request(app).put(`/api/cart/${mockUserId}`).send(invalidQuantity);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bad request');
    });
  });

  describe('DELETE /api/cart/:userId', () => {
    it('should remove an item from the cart', async () => {
      Cart.findOneAndUpdate = jest.fn().mockResolvedValue(mockCart);

      const response = await request(app).delete(`/api/cart/${mockUserId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item removed from cart successfully');
    });

    it('should return 404 if item is not found in cart', async () => {
      Cart.findOneAndUpdate = jest.fn().mockResolvedValue(null); // Cart not found

      const response = await request(app).delete(`/api/cart/${mockUserId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Item not found in cart');
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear the cart', async () => {
      Cart.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const response = await request(app).delete('/api/cart').send({ userId: mockUserId });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Cart cleared');
    });

    it('should return 400 if the userId is missing', async () => {
      const response = await request(app).delete('/api/cart').send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bad request');
    });
  });
});
