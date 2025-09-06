const request = require('supertest');
const CartModel = require('../../models/cartModel');
const app = require('../../app');
const cartController = require('../../controllers/cartController');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

// Mock the CartModel
jest.mock('../../models/cartModel');

describe('Cart Controller - Cart Operations', () => {

  beforeAll(async () => {
    await connectDB();  // Establish DB connection before all tests
  });

  afterAll(async () => {
    await closeDB();  // Close DB connection after all tests
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  //  Test fetching user's cart
  describe('getCart', () => {
    it('should return the user\'s cart if it exists', async () => {
      const mockCart = {
        userId: 'user1',
        items: [{ productId: 'prod1', quantity: 2, total: 40 }],
        totalQuantity: 2,
        totalPrice: 40,
      };

      CartModel.findOne.mockResolvedValue(mockCart); // Mock CartModel.findOne

      const req = { params: { userId: 'user1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.getCart(req, res);

      expect(CartModel.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });

    it('should return empty cart if cart does not exist', async () => {
      CartModel.findOne.mockResolvedValue(null); // Mock CartModel.findOne to return null

      const req = { params: { userId: 'user1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.getCart(req, res);

      expect(CartModel.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ items: [], totalQuantity: 0, totalPrice: 0 });
    });

    it('should return 500 error if something goes wrong', async () => {
      CartModel.findOne.mockRejectedValue(new Error('Database error')); // Mock error

      const req = { params: { userId: 'user1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.getCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch the cart.' });
    });
  });

  //  Test adding an item to the cart
  describe('addItemToCart', () => {
    it('should add an item to the cart successfully', async () => {
      const newItem = { userId: 'user1', productId: 'prod1', title: 'Product 1', price: 20, quantity: 2, carbonFootprintScore: 5, thumbnail: 'image.jpg' };

      const mockCart = { userId: 'user1', items: [], save: jest.fn() };
      CartModel.findOne.mockResolvedValue(mockCart); // Mock CartModel.findOne

      const req = { body: newItem };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.addItemToCart(req, res);

      expect(CartModel.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(mockCart.items).toHaveLength(1); // Ensure item was added
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item added to cart successfully.', cart: mockCart });
    });

    it('should handle adding an item to an empty cart correctly', async () => {
      const newItem = { userId: 'user1', productId: 'prod1', title: 'Product 1', price: 20, quantity: 2, carbonFootprintScore: 5, thumbnail: 'image.jpg' };
      const mockCart = { userId: 'user1', items: [], save: jest.fn() };
      CartModel.findOne.mockResolvedValue(mockCart);

      const req = { body: newItem };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.addItemToCart(req, res);

      expect(CartModel.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(mockCart.items).toHaveLength(1); // Item is added
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 error if something goes wrong', async () => {
      CartModel.findOne.mockRejectedValue(new Error('Database error'));

      const req = { body: { productId: 'prod1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.addItemToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to add item to the cart.' });
    });
  });

  //  Test updating the cart item quantity
  describe('updateCartItem', () => {
    it('should update the cart item quantity successfully', async () => {
      const updatedItem = { productId: 'prod1', quantity: 3 };
      const mockCart = {
        userId: 'user1',
        items: [{ productId: 'prod1', quantity: 2, price: 20, total: 40 }],
        save: jest.fn(),
      };

      CartModel.findOne.mockResolvedValue(mockCart);

      const req = { params: { userId: 'user1' }, body: updatedItem };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.updateCartItem(req, res);

      expect(CartModel.findOne).toHaveBeenCalledWith({ userId: 'user1' });
      expect(mockCart.items[0].quantity).toBe(3); // Quantity should be updated
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart item updated successfully.', cart: mockCart });
    });

    it('should return 404 if the cart does not exist', async () => {
      CartModel.findOne.mockResolvedValue(null);

      const req = { params: { userId: 'user1' }, body: { productId: 'prod1', quantity: 2 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.updateCartItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found.' });
    });

    it('should return 500 error if something goes wrong', async () => {
      CartModel.findOne.mockRejectedValue(new Error('Database error'));

      const req = { params: { userId: 'user1' }, body: { productId: 'prod1', quantity: 2 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.updateCartItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update cart item.' });
    });
  });

  //  Test removing an item from the cart
  describe('removeCartItem', () => {
    it('should remove an item from the cart successfully', async () => {
      const mockCart = {
        userId: 'user1',
        items: [{ productId: 'prod1', quantity: 2, total: 40 }],
        save: jest.fn(),
      };

      CartModel.findOne.mockResolvedValue(mockCart);

      const req = { params: { userId: 'user1' }, body: { productId: 'prod1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.removeCartItem(req, res);

      expect(mockCart.items).toHaveLength(0); // Item is removed
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item removed from cart successfully.', cart: mockCart });
    });

    it('should return 404 if the cart does not exist', async () => {
      CartModel.findOne.mockResolvedValue(null);

      const req = { params: { userId: 'user1' }, body: { productId: 'prod1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.removeCartItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart not found.' });
    });

    it('should return 500 error if something goes wrong', async () => {
      CartModel.findOne.mockRejectedValue(new Error('Database error'));

      const req = { params: { userId: 'user1' }, body: { productId: 'prod1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.removeCartItem(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to remove item from the cart.' });
    });
  });

  //  Test clearing the cart
  describe('clearCart', () => {
    it('should clear the cart successfully', async () => {
      const mockCart = {
        userId: 'user1',
        items: [{ productId: 'prod1', quantity: 2, total: 40 }],
        totalQuantity: 2,
        totalPrice: 40,
        save: jest.fn(),
      };

      CartModel.findOne.mockResolvedValue(mockCart);

      const req = { body: { userId: 'user1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.clearCart(req, res);

      expect(mockCart.items).toHaveLength(0); // Cart should be cleared
      expect(mockCart.totalQuantity).toBe(0);
      expect(mockCart.totalPrice).toBe(0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart cleared successfully.', cart: mockCart });
    });

    it('should return 404 if the cart does not exist', async () => {
      CartModel.findOne.mockResolvedValue(null);

      const req = { body: { userId: 'user1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cart find cart for this user.' });
    });

    it('should return 500 error if something goes wrong', async () => {
      CartModel.findOne.mockRejectedValue(new Error('Database error'));

      const req = { body: { userId: 'user1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await cartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to clear the cart.' });
    });
  });

});
