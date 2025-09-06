const request = require('supertest');
const app = require('../../app');
const Product = require('../../models/productModel');
const fs = require('fs');
const path = require('path');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

// Mocking the Product model
jest.mock('../../models/productModel');
jest.mock('fs');

// Setup file upload mock
const mockFile = {
  filename: 'products.json',
  path: path.join(process.cwd(), 'uploads', 'products.json'),
};

describe('Product Controller - Product Operations', () => {

  beforeAll(async () => {
    await connectDB(); // Establish DB connection before all tests
  });

  afterAll(async () => {
    await closeDB(); // Close DB connection after all tests
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  //  Test getProducts
  describe('getProducts', () => {
    it('should return a list of all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 150 },
      ];

      Product.find = jest.fn().mockResolvedValue(mockProducts);

      const res = await request(app)
        .get('/api/products') // Assuming your route for getProducts is '/api/products'
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a list of products
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
      expect(Product.find).toHaveBeenCalled();
    });
  });

  //  Test getProductById
  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 100 };

      Product.findOne = jest.fn().mockResolvedValue(mockProduct);

      const res = await request(app)
        .get('/api/products/1') // Assuming your route for getProductById is '/api/products/:id'
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is the correct product
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProduct);
      expect(Product.findOne).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return a 404 if product not found', async () => {
      Product.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .get('/api/products/1') // Assuming your route for getProductById is '/api/products/:id'
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response status is 404 for product not found
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });
  });

  //  Test createProduct
  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const reqBody = { name: 'New Product', price: 250, description: 'A new product' };

      const mockProduct = {
        id: '1',
        name: reqBody.name,
        price: reqBody.price,
        description: reqBody.description,
      };

      Product.prototype.save = jest.fn().mockResolvedValue(mockProduct);

      const res = await request(app)
        .post('/api/products') // Assuming your route for createProduct is '/api/products'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the product was created successfully
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Product created');
      expect(res.body.product).toHaveProperty('id');
      expect(res.body.product.name).toBe(reqBody.name);
      expect(Product.prototype.save).toHaveBeenCalledTimes(1);
    });
  });

  //  Test addProductsInBatch
  describe('addProductsInBatch', () => {
    it('should successfully upload products in batch', async () => {
      const mockFileData = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 150 },
      ];

      // Mock fs.readFileSync to simulate reading the file
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(mockFileData));

      // Mock Product.insertMany to simulate inserting products into the database
      Product.insertMany = jest.fn().mockResolvedValue(mockFileData);

      const res = await request(app)
        .post('/api/products/batch') // Assuming your route for addProductsInBatch is '/api/products/batch'
        .attach('file', mockFile.path) // Simulate file upload
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response returns success and product data
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Products uploaded successfuly.');
      expect(res.body.insertedCount).toBe(mockFileData.length);
      expect(Product.insertMany).toHaveBeenCalledWith(mockFileData);
    });

    it('should return a 400 error if no file is uploaded', async () => {
      const res = await request(app)
        .post('/api/products/batch') // Assuming your route for addProductsInBatch is '/api/products/batch'
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a 400 error for missing file
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cannot upload products.');
    });

    it('should return an error if the file content is invalid', async () => {
      fs.readFileSync = jest.fn().mockReturnValue("invalid content");

      const res = await request(app)
        .post('/api/products/batch') // Assuming your route for addProductsInBatch is '/api/products/batch'
        .attach('file', mockFile.path) // Simulate file upload
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a 500 error
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to process file');
    });
  });

});
