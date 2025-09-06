const request = require('supertest');
const app = require('../../app');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

jest.mock('../../models/userModel'); // Mock the User model
jest.mock('../../schemas/userSchemas'); // Mock the userSchemas if used in validation

describe('User Controller - User Operations', () => {

  beforeAll(async () => {
    await connectDB(); // Establish DB connection before all tests
  });

  afterAll(async () => {
    await closeDB(); // Close DB connection after all tests
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  //  Test getUsers
  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const res = await request(app)
        .get('/api/users') // Assuming the route for getUsers is '/api/users'
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a list of users
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ user: 'User 1' }, { user: 'User 2' }]);
    });
  });

  //  Test registerUser
  describe('registerUser', () => {
    it('should register a user successfully with valid data', async () => {
      const reqBody = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/users/register') // Assuming your route for registerUser is '/api/users/register'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response returns success message
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User registered successfully.');
    });

    it('should return a 400 error when data is missing', async () => {
      const reqBody = { name: 'John Doe', email: 'john.doe@example.com' }; // Missing password

      const res = await request(app)
        .post('/api/users/register') // Assuming your route for registerUser is '/api/users/register'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a 400 error
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input data.');
    });

    it('should return a 400 error when name is missing', async () => {
      const reqBody = { email: 'john.doe@example.com', password: 'password123' }; // Missing name

      const res = await request(app)
        .post('/api/users/register') // Assuming your route for registerUser is '/api/users/register'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a 400 error
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input data.');
    });

    it('should return a 400 error when email is missing', async () => {
      const reqBody = { name: 'John Doe', password: 'password123' }; // Missing email

      const res = await request(app)
        .post('/api/users/register') // Assuming your route for registerUser is '/api/users/register'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a 400 error
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input data.');
    });

    it('should return a 400 error when password is missing', async () => {
      const reqBody = { name: 'John Doe', email: 'john.doe@example.com' }; // Missing password

      const res = await request(app)
        .post('/api/users/register') // Assuming your route for registerUser is '/api/users/register'
        .send(reqBody)
        .set('Authorization', `Bearer valid-token`);

      // Asserting that the response is a 400 error
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid input data.');
    });
  });

});
