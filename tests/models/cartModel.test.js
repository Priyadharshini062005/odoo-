const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Cart = require("../models/Cart");  // Path to your Cart model

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

describe("Cart Model", () => {
  let cartData;

  beforeEach(() => {
    // Sample data for cart
    cartData = {
      userId: "12345",
      items: [
        {
          productId: 1,
          title: "Product 1",
          price: 100,
          quantity: 2,
          carbonFootprintScore: 30,
          thumbnail: "image1.jpg",
        },
        {
          productId: 2,
          title: "Product 2",
          price: 150,
          quantity: 3,
          carbonFootprintScore: 40,
          thumbnail: "image2.jpg",
        },
      ],
    };
  });

  it("should create a cart successfully", async () => {
    const cart = new Cart(cartData);
    await cart.save();

    expect(cart).toHaveProperty("userId", "12345");
    expect(cart.items.length).toBe(2);
    expect(cart.totalQuantity).toBe(5);  // 2 + 3
    expect(cart.totalPrice).toBe(650);  // (100*2) + (150*3)
  });

  it("should validate the quantity to be at least 1", async () => {
    const invalidCartData = {
      userId: "12345",
      items: [
        {
          productId: 1,
          title: "Product 1",
          price: 100,
          quantity: 0,  // Invalid quantity
          carbonFootprintScore: 30,
          thumbnail: "image1.jpg",
        },
      ],
    };

    const cart = new Cart(invalidCartData);
    let error;
    try {
      await cart.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.items).toBeDefined();
    expect(error.errors.items.message).toBe("Quantity must be at least 1");
  });

  it("should calculate total price and total quantity correctly using middleware", async () => {
    const cart = new Cart(cartData);
    await cart.save();

    expect(cart.totalQuantity).toBe(5);  // Sum of quantities
    expect(cart.totalPrice).toBe(650);  // Sum of total prices
  });

  it("should calculate the total of each cart item correctly", async () => {
    const cart = new Cart(cartData);
    await cart.save();

    expect(cart.items[0].total).toBe(200);  // 100 * 2
    expect(cart.items[1].total).toBe(450);  // 150 * 3
  });

  it("should not save the cart if required fields are missing", async () => {
    const invalidCart = new Cart({
      userId: "12345",
      items: [
        {
          productId: 1,
          title: "Product 1",
          price: 100,
          quantity: 2,
          carbonFootprintScore: 30,
        },
      ],
    });

    let error;
    try {
      await invalidCart.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.totalPrice).toBeDefined();  // Missing totalPrice
  });
});
