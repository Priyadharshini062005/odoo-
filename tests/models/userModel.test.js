const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/userModel'); // Path to your User model

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

describe('User Model', () => {

  it('should create a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      agreeToTerms: true,
    };

    const user = new User(userData);
    await user.save();

    expect(user).toHaveProperty('name');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@example.com');
    expect(user.password).toBe('password123');
    expect(user.agreeToTerms).toBe(true);
  });

  it('should require name, email, password, and agreeToTerms', async () => {
    const userData = {
      email: 'johndoe@example.com',
      password: 'password123',
      agreeToTerms: true,
    };

    const user = new User(userData);

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
  });

  it('should not create a user if email is not unique', async () => {
    const userData1 = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      agreeToTerms: true,
    };

    const userData2 = {
      name: 'Jane Doe',
      email: 'johndoe@example.com',
      password: 'password456',
      agreeToTerms: true,
    };

    const user1 = new User(userData1);
    await user1.save();

    const user2 = new User(userData2);

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error
  });

  it('should handle optional fields like phone, address, and avatar', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      agreeToTerms: true,
      phone: '123-456-7890',
      address: '123 Main St',
      avatar: { url: 'avatar.jpg', alt: 'John\'s avatar' },
    };

    const user = new User(userData);
    await user.save();

    expect(user.phone).toBe('123-456-7890');
    expect(user.address).toBe('123 Main St');
    expect(user.avatar.url).toBe('avatar.jpg');
  });

  it('should default email_verified to undefined', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      agreeToTerms: true,
    };

    const user = new User(userData);
    await user.save();

    expect(user.email_verified).toBeUndefined();
  });

  it('should require agreeToTerms to be true', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      agreeToTerms: false,
    };

    const user = new User(userData);

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.agreeToTerms).toBeDefined();
  });

  it('should validate email format', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalidemail.com', // Invalid email format
      password: 'password123',
      agreeToTerms: true,
    };

    const user = new User(userData);

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

});

