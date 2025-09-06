const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/userModel');
const app = require('../../app'); // Import main Express app
const authController = require('../../controllers/authController');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

jest.mock('../../models/userModel'); // Mock User model
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - User Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });
    
  // In your Jest setup
  beforeAll(async () => {
    await connectDB();
  });
  
  afterAll(async () => {
    await closeDB();
  });
  

  // Test user registration success
  describe('register', () => {
    it('should register a user successfully', async () => {
      const mockUserData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890',
        address: '123 Green St',
        agreeToTerms: true,
        avatar: 'avatar.png',
      };

      // Mock password hashing
      bcrypt.hash.mockResolvedValue('hashedpassword123');

      // Mock user save
      User.prototype.save = jest.fn().mockResolvedValue({ _id: 'user123' });

      const req = { body: mockUserData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    //  Test duplicate email error
    it('should return 409 error if email already exists', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error('duplicate key error'));

      const req = {
        body: {
          name: 'John Doe',
          email: 'existing@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists.' });
    });

    //  Test server error handling
    it('should return 500 error on registration failure', async () => {
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const req = { body: { email: 'error@example.com', password: 'password' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to register user.' });
    });
  });

  //  Test user login
  describe('login', () => {
    it('should log in a valid user and return JWT token', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword123',
        email_verified: false,
        phone: '1234567890',
        address: '123 Green St',
        avatar: 'avatar.png',
      };

      // Mock database query
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked_jwt_token');

      const req = { body: { email: 'johndoe@example.com', password: 'password123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'johndoe@example.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: 'mocked_jwt_token' })
      );
    });

    //  Test login with invalid credentials
    it('should return 401 error for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null); // No user found

      const req = { body: { email: 'invalid@example.com', password: 'wrongpass' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'invalid@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    //  Test login with incorrect password
    it('should return 401 error for incorrect password', async () => {
      const mockUser = { email: 'johndoe@example.com', password: 'hashedpassword123' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Password mismatch

      const req = { body: { email: 'johndoe@example.com', password: 'wrongpass' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await authController.login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpass', 'hashedpassword123');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });
});
