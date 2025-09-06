const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../models/productModel'); // Path to your Product model

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product Model', () => {

  it('should create a product successfully', async () => {
    const productData = {
      id: 1,
      title: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 100,
      stock: 10,
      tags: ['tag1', 'tag2'],
      brand: 'Brand',
      sku: 'SKU123',
      weight: 1.2,
      dimensions: {
        width: 10,
        height: 20,
        depth: 5,
      },
      warrantyInformation: '1 Year',
      shippingInformation: 'Standard Shipping',
      availabilityStatus: 'In Stock',
      returnPolicy: '30 Days Return',
      minimumOrderQuantity: 1,
      meta: {
        createdAt: new Date(),
        updatedAt: new Date(),
        barcode: '1234567890',
        qrCode: 'QR1234',
      },
      images: ['image1.jpg', 'image2.jpg'],
      thumbnail: 'thumbnail.jpg',
      sustainability: {
        shortDescription: 'Eco-friendly product',
        certifications: ['ISO9001'],
        keywords: ['eco', 'green', 'sustainable'],
        carbonFootprintScore: 20,
      }
    };

    const product = new Product(productData);
    await product.save();

    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('price');
    expect(product.title).toBe('Test Product');
    expect(product.price).toBe(100);
    expect(product.sustainability.shortDescription).toBe('Eco-friendly product');
    expect(product.images.length).toBe(2);
  });

  it('should require title and price', async () => {
    const productData = {
      description: 'Test Description',
      category: 'Test Category',
      stock: 10,
    };

    const product = new Product(productData);

    let error;
    try {
      await product.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.price).toBeDefined();
  });

  it('should set default meta.createdAt and meta.updatedAt to current date', async () => {
    const productData = {
      title: 'Test Product',
      price: 100,
      stock: 10,
    };

    const product = new Product(productData);
    await product.save();

    expect(product.meta.createdAt).toBeDefined();
    expect(product.meta.updatedAt).toBeDefined();
    expect(new Date(product.meta.createdAt)).toBeInstanceOf(Date);
    expect(new Date(product.meta.updatedAt)).toBeInstanceOf(Date);
  });

  it('should calculate the carbonFootprintScore correctly', async () => {
    const productData = {
      title: 'Test Product',
      price: 100,
      stock: 10,
      sustainability: {
        carbonFootprintScore: 20,
      },
    };

    const product = new Product(productData);
    await product.save();

    expect(product.sustainability.carbonFootprintScore).toBe(20);
  });

  it('should not save if invalid data is passed in an array (tags)', async () => {
    const productData = {
      title: 'Test Product',
      price: 100,
      stock: 10,
      tags: 'notAnArray', // Invalid data type for tags
    };

    const product = new Product(productData);

    let error;
    try {
      await product.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.tags).toBeDefined();
  });

  it('should correctly handle reviews array', async () => {
    const productData = {
      title: 'Test Product',
      price: 100,
      stock: 10,
      reviews: [
        {
          rating: 5,
          comment: 'Excellent product',
          date: new Date(),
          reviewerName: 'John Doe',
          reviewerEmail: 'john@example.com',
        },
      ],
    };

    const product = new Product(productData);
    await product.save();

    expect(product.reviews.length).toBe(1);
    expect(product.reviews[0].rating).toBe(5);
    expect(product.reviews[0].comment).toBe('Excellent product');
  });

});

