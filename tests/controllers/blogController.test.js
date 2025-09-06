const request = require('supertest');
const Blog = require('../../models/BlogModel');
const app = require('../../app');
const blogController = require('../../controllers/blogController');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

// Mock the Blog model
jest.mock('../../models/BlogModel');

describe('Blog Controller - Blog CRUD Operations', () => {

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

  // Test fetching all blogs
  describe('getBlogs', () => {
    it('should return all blogs', async () => {
      // Mock data
      const mockBlogs = [
        { _id: '1', title: 'Blog 1', author: 'Author 1', content: 'Content 1', imageFile: 'image1.jpg', publishedDate: '1625231234000', updatedDate: '1625231234000', authorId: 'user1' },
        { _id: '2', title: 'Blog 2', author: 'Author 2', content: 'Content 2', imageFile: 'image2.jpg', publishedDate: '1625231234000', updatedDate: '1625231234000', authorId: 'user2' },
      ];
      
      Blog.find.mockResolvedValue(mockBlogs); // Mock Blog.find

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.getBlogs(req, res);

      expect(Blog.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            title: 'Blog 1',
            content: expect.any(String),
          }),
        ])
      );
    });

    it('should return 500 error if something goes wrong', async () => {
      Blog.find.mockRejectedValue(new Error('Database error')); // Mock error

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.getBlogs(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get blogs' });
    });
  });

  // Test fetching a single blog
  describe('getBlog', () => {
    it('should return a single blog by id', async () => {
      const mockBlog = { _id: '1', title: 'Blog 1', author: 'Author 1', content: 'Content 1', imageFile: 'image1.jpg', publishedDate: '1625231234000', updatedDate: '1625231234000', authorId: 'user1' };

      Blog.findById.mockResolvedValue(mockBlog); // Mock Blog.findById

      const req = { params: { blogId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.getBlog(req, res);

      expect(Blog.findById).toHaveBeenCalledWith({ _id: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          title: 'Blog 1',
          content: 'Content 1',
        })
      );
    });

    it('should return 500 error if something goes wrong', async () => {
      Blog.findById.mockRejectedValue(new Error('Database error'));

      const req = { params: { blogId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.getBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get blog.' });
    });
  });

  // Test creating a new blog
  describe('createBlog', () => {
    it('should create a new blog successfully', async () => {
      const mockBlogData = {
        title: 'New Blog',
        author: 'Author 1',
        imageFile: 'image1.jpg',
        content: 'This is a new blog post.',
        userId: 'user1',
      };

      const mockBlog = {
        _id: '1',
        title: 'New Blog',
        author: 'Author 1',
        imageFile: 'image1.jpg',
        content: 'This is a new blog post.',
        publishedDate: Date.now(),
        updatedDate: '',
        authorId: 'user1',
      };

      Blog.prototype.save = jest.fn().mockResolvedValue(mockBlog); // Mock blog save

      const req = { body: mockBlogData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.createBlog(req, res);

      expect(Blog.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBlog);
    });

    it('should return 500 error if something goes wrong', async () => {
      Blog.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = { body: { title: 'Invalid Blog' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.createBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create blog.' });
    });
  });

  // Test updating an existing blog
  describe('updateBlog', () => {
    it('should update an existing blog successfully', async () => {
      const uDate = Date.now();
      const updatedData = { title: 'Updated Blog', author: 'Author 1', content: 'Updated content', imageFile: 'updated.jpg', updatedDate: uDate };
      const mockBlog = { ...updatedData, _id: '1', updatedDate: uDate };

      Blog.findByIdAndUpdate.mockResolvedValue(mockBlog); // Mock Blog update

      const req = { params: { blogId: '1' }, body: updatedData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.updateBlog(req, res);

      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith({ "_id": '1' }, { "$set": updatedData });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBlog);
    });

    it('should return 500 error if something goes wrong', async () => {
      Blog.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      const req = { params: { blogId: '1' }, body: { title: 'Failed Update' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.updateBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update blog.' });
    });
  });

  // Test deleting a blog
  describe('deleteBlog', () => {
    it('should delete a blog successfully', async () => {
      const mockBlog = { _id: '1', title: 'Blog to delete' };

      Blog.findByIdAndDelete.mockResolvedValue(mockBlog); // Mock Blog deletion

      const req = { params: { blogId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.deleteBlog(req, res);

      expect(Blog.findByIdAndDelete).toHaveBeenCalledWith({ _id: '1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Blog deleted successfully', blog: mockBlog });
    });

    it('should return 500 error if something goes wrong', async () => {
      Blog.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      const req = { params: { blogId: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await blogController.deleteBlog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete blog.' });
    });
  });
});
