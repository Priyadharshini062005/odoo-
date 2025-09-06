// tests/userRoutes.test.js
const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/userRoutes"); // Path to userRoutes.js

const app = express();

// Apply user routes to the app
app.use(express.json());
app.use("/users", userRoutes);

describe("User Routes", () => {

  // Test the GET /users route
  it("should fetch all users", async () => {
    const response = await request(app).get("/users");
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0); // Ensure at least one user is returned
  });

  // Test the POST /users route for successful user registration
  it("should register a new user successfully", async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/users")
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User registered successfully.");
  });

  // Test the POST /users route for failed registration (missing data)
  it("should fail to register a user due to missing data", async () => {
    const invalidUser = {
      name: "Jane Doe", // Missing email and password
    };

    const response = await request(app)
      .post("/users")
      .send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid input data.");
  });

});
