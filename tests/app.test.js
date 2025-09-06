const request = require('supertest'); // Supertest for API testing
const app = require('../app'); // Import the main Express app
const mongoose = require('mongoose');
const { closeDB } = require('../config/db');
const connectDB = require('../config/db');

describe('Green Market Place - Integration Tests', () => {

    // In your Jest setup
    beforeAll(async () => {
      await connectDB();
    });
    
    afterAll(async () => {
      await closeDB();
    });

  // Test if the server is running
  it('should return 200 OK for the home route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to Express');
  });

  // Test invalid route handling (404 error)
  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});
