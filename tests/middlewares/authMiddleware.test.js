const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

jest.mock('jsonwebtoken'); // Mocking the jwt module for token verification

describe('Auth Middleware', () => {

  beforeAll(async () => {
    await connectDB(); // Connect to DB before running the tests
  });

  afterAll(async () => {
    await closeDB(); // Close DB connection after tests
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  //  Test valid token
  it('should allow access with a valid token', async () => {
    // Mock jwt.verify to simulate a valid token verification
    const mockDecoded = { userId: '12345' };
    jwt.verify.mockReturnValue(mockDecoded);

    const res = await request(app)
      .get('/api/protected-route') // Assuming there's a protected route
      .set('Authorization', 'Bearer valid-token'); // Passing valid token

    expect(res.status).toBe(200); // Expect success
    expect(res.body.message).toBe('Access granted'); // Assuming success message on a protected route
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  //  Test no token provided
  it('should return 404 if no token is provided', async () => {
    const res = await request(app)
      .get('/api/protected-route') // Assuming there's a protected route
      .set('Authorization', ''); // No token provided

    expect(res.status).toBe(404); // Expect access denied
    expect(res.body.message).toBe('Access denied');
  });

  //  Test invalid token
  it('should return 404 for an invalid token', async () => {
    // Mock jwt.verify to simulate an invalid token
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const res = await request(app)
      .get('/api/protected-route') // Assuming there's a protected route
      .set('Authorization', 'Bearer invalid-token'); // Passing invalid token

    expect(res.status).toBe(404); // Expect invalid token error
    expect(res.body.message).toBe('Invalid token');
  });
});
