const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const { register, login } = require('../controllers/authController');

// Mock the authController methods (register and login) to avoid DB operations
jest.mock('../controllers/authController', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a user successfully', async () => {
      // Mock the register function to simulate success
      register.mockImplementationOnce((req, res) => {
        res.status(201).json({ message: 'User registered successfully' });
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123',
          phone: '123-456-7890',
          address: '123 Main St',
          avatar: 'avatar.jpg',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(register).toHaveBeenCalled();
    });

    it('should return 400 for invalid request data', async () => {
      // Mock the register function to simulate failure
      register.mockImplementationOnce((req, res) => {
        res.status(400).json({ message: 'Bad request' });
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
          // Missing name, phone, address
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Bad request');
      expect(register).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      // Mock the login function to simulate success
      login.mockImplementationOnce((req, res) => {
        res.status(200).json({ message: 'User logged in successfully' });
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User logged in successfully');
      expect(login).toHaveBeenCalled();
    });

    it('should return 401 for invalid login credentials', async () => {
      // Mock the login function to simulate failure
      login.mockImplementationOnce((req, res) => {
        res.status(401).json({ message: 'Invalid email or password' });
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'johndoe@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
      expect(login).toHaveBeenCalled();
    });
  });
});
