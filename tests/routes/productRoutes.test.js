// tests/productRoutes.test.js
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("../routes/productRoutes"); // path to your productRoutes.js

// Create an instance of express
const app = express();

// Apply product routes to the app
app.use(express.json());
app.use("/api/products", productRoutes);

beforeAll(async () => {
  // Set up a mock MongoDB in-memory database for testing
  const url = "mongodb://127.0.0.1:27017/testdb";
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Clean up and close the connection after all tests
  await mongoose.connection.close();
});

describe("Product Routes", () => {
  
  it("should fetch all products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Ensure the response is an array
  });

  it("should fetch a product by ID", async () => {
    // Create a mock product first (or use a real product ID if applicable)
    const mockProductId = "60c72b2f9b1d8f4b206c53f4"; // Example, update with actual mock data
    const response = await request(app).get(`/api/products/${mockProductId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
  });

  it("should create a new product", async () => {
    const newProduct = {
      name: "Test Product",
      description: "Test description",
      price: 100,
      stock: 50,
      category: "Electronics",
    };

    const response = await request(app)
      .post("/api/products")
      .send(newProduct)
      .set("Authorization", "Bearer your-valid-token"); // Use a mock token if auth middleware is used

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  it("should fail to create a new product without authorization", async () => {
    const newProduct = {
      name: "Unauthorized Product",
      description: "Unauthorized description",
      price: 150,
      stock: 30,
      category: "Apparel",
    };

    const response = await request(app)
      .post("/api/products")
      .send(newProduct); // No Authorization header

    expect(response.status).toBe(401);
  });

  it("should upload a batch of products", async () => {
    const response = await request(app)
      .post("/api/products/batch")
      .attach("file", "path/to/your/test/file.csv"); // Use a valid path to a test file

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("File uploaded successfully");
  });
  
});

