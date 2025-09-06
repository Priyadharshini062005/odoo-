const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Blog = require('../../models/BlogModel');  // Adjust the import path accordingly

let mongoServer;

beforeAll(async () => {
  // Set up MongoDB Memory Server before tests
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Clean up after tests
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Blog Model Tests', () => {

  // Test for successful blog creation
  it('should create and save a blog successfully', async () => {
    const blogData = {
      title: 'Test Blog',
      author: 'John Doe',
      publishedDate: '2025-03-09',
      content: 'This is a test blog content.',
      authorId: 'user123'
    };
    
    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    expect(savedBlog._id).toBeDefined();
    expect(savedBlog.title).toBe('Test Blog');
    expect(savedBlog.author).toBe('John Doe');
    expect(savedBlog.content).toBe('This is a test blog content.');
    expect(savedBlog.publishedDate).toBe('2025-03-09');
  });

  // Test for validation when required fields are missing
  it('should throw validation error if required fields are missing', async () => {
    const blogData = {
      title: 'Test Blog Without Author',
      content: 'This blog has no author.',
      publishedDate: '2025-03-09',
      authorId: 'user123'
    };

    const blog = new Blog(blogData);
    let err;
    try {
      await blog.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.author).toBeDefined();
  });

  // Test for unique constraint on title field
  it('should throw a unique constraint error for duplicate title', async () => {
    const blogData = {
      title: 'Unique Title',
      author: 'John Doe',
      publishedDate: '2025-03-09',
      content: 'This blog content should be unique.',
      authorId: 'user123'
    };

    const blog1 = new Blog(blogData);
    await blog1.save();

    const blog2 = new Blog(blogData);
    let err;
    try {
      await blog2.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000);  // Duplicate key error
  });

  // Test for empty required fields
  it('should fail if title is missing', async () => {
    const blogData = {
      author: 'Jane Doe',
      publishedDate: '2025-03-09',
      content: 'Blog without title.',
      authorId: 'user123'
    };

    const blog = new Blog(blogData);
    let err;
    try {
      await blog.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  // Test for saving blog with missing authorId (required field)
  it('should fail if authorId is missing', async () => {
    const blogData = {
      title: 'Blog Without Author ID',
      author: 'Sam Smith',
      publishedDate: '2025-03-09',
      content: 'Missing authorId.',
    };

    const blog = new Blog(blogData);
    let err;
    try {
      await blog.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.authorId).toBeDefined();
  });
});

