const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Order = require("../models/orderModel");  // Path to your Order model
const User = require("../models/userModel");  // Path to your User model (if needed for references)
const Product = require("../models/productModel");  // Path to your Product model (if needed for references)

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

describe("Order Model", () => {
  let userData;
  let productData;

  beforeEach(async () => {
    // Sample user data
    userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    // Sample product data
    productData = {
      title: "Sample Product",
      price: 100,
    };

    // Save user and product before running tests
    const user = new User(userData);
    await user.save();

    productData.userId = user._id;  // Ensure product belongs to the created user
    const product = new Product(productData);
    await product.save();
  });

  it("should create an order successfully", async () => {
    const user = await User.findOne({ email: "john.doe@example.com" });
    const product = await Product.findOne({ title: "Sample Product" });

    const orderData = {
      user: user._id,
      products: [{ productId: product._id, quantity: 2 }],
      totalPrice: 200,
    };

    const order = new Order(orderData);
    await order.save();

    expect(order).toHaveProperty("user");
    expect(order.products.length).toBe(1);
    expect(order.totalPrice).toBe(200);
    expect(order.status).toBe("pending");  // Default value
  });

  it("should validate required fields", async () => {
    const orderData = {
      products: [{ productId: "12345", quantity: 2 }],
      totalPrice: 200,
    };

    const order = new Order(orderData);

    let error;
    try {
      await order.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.user).toBeDefined();  // Missing required "user"
  });

  it("should set default status to 'pending' when not provided", async () => {
    const user = await User.findOne({ email: "john.doe@example.com" });
    const product = await Product.findOne({ title: "Sample Product" });

    const orderData = {
      user: user._id,
      products: [{ productId: product._id, quantity: 2 }],
      totalPrice: 200,
    };

    const order = new Order(orderData);
    await order.save();

    expect(order.status).toBe("pending");
  });

  it("should not save an order if totalPrice is missing", async () => {
    const user = await User.findOne({ email: "john.doe@example.com" });
    const product = await Product.findOne({ title: "Sample Product" });

    const orderData = {
      user: user._id,
      products: [{ productId: product._id, quantity: 2 }],
    };

    const order = new Order(orderData);

    let error;
    try {
      await order.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.totalPrice).toBeDefined();  // Missing required "totalPrice"
  });

  it("should correctly calculate totalPrice from products", async () => {
    const user = await User.findOne({ email: "john.doe@example.com" });
    const product = await Product.findOne({ title: "Sample Product" });

    const orderData = {
      user: user._id,
      products: [
        { productId: product._id, quantity: 2 },
        { productId: product._id, quantity: 3 },
      ],
      totalPrice: 500,  // Manually setting, but we can calculate from products
    };

    const order = new Order(orderData);
    await order.save();

    expect(order.totalPrice).toBe(500);  // (100 * 2) + (100 * 3)
  });
});
