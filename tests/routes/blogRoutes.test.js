const request = require('supertest');
const express = require('express');
const blogRoutes = require('../routes/blogRoutes');
const { getBlogs, createBlog, updateBlog, getBlog, deleteBlog } = require('../controllers/blogController');

// Mock the blogController methods (getBlogs, createBlog, etc.) to avoid DB operations
jest.mock('../controllers/blogController', () => ({
  getBlogs: jest.fn(),
  createBlog: jest.fn(),
  updateBlog: jest.fn(),
  getBlog: jest.fn(),
  deleteBlog: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/blogs', blogRoutes);

describe('Blog Routes', () => {
  
  describe('GET /api/blogs', () => {
    it('should fetch all blogs successfully', async () => {
      // Mock the getBlogs function to simulate a successful response
      getBlogs.mockImplementationOnce((req, res) => {
        res.status(200).json({ message: 'Blogs found' });
      });

      const res = await request(app)
        .get('/api/blogs');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Blogs found');
      expect(getBlogs).toHaveBeenCalled();
    });

    it('should return 404 if no blogs are found', async () => {
      // Mock the getBlogs function to simulate a failure (e.g., no blogs found)
      getBlogs.mockImplementationOnce((req, res) => {
        res.status(404).json({ message: 'No blogs found' });
      });

      const res = await request(app)
        .get('/api/blogs');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No blogs found');
      expect(getBlogs).toHaveBeenCalled();
    });
  });

  describe('POST /api/blogs/create', () => {
    it('should create a new blog successfully', async () => {
      // Mock the createBlog function to simulate a successful creation
      createBlog.mockImplementationOnce((req, res) => {
        res.status(201).json({ message: 'Blog created successfully' });
      });

      const res = await request(app)
        .post('/api/blogs/create')
        .send({
          title: 'New Blog Post',
          author: 'John Doe',
          imageFile: { filename: 'image.jpg' },
          content: 'This is a blog content',
          authorId: 'author_id_123',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Blog created successfully');
      expect(createBlog).toHaveBeenCalled();
    });

    it('should return 400 if the request data is invalid', async () => {
      // Mock the createBlog function to simulate a failure
      createBlog.mockImplementationOnce((req, res) => {
        res.status(400).json({ message: 'Bad request' });
      });

      const res = await request(app)
        .post('/api/blogs/create')
        .send({
          // Missing required fields (title, content, etc.)
          author: 'John Doe',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Bad request');
      expect(createBlog).toHaveBeenCalled();
    });
  });

  describe('PUT /api/blogs/:blogId', () => {
    it('should update a blog successfully', async () => {
      // Mock the updateBlog function to simulate a successful update
      updateBlog.mockImplementationOnce((req, res) => {
        res.status(200).json({ message: 'Blog updated successfully' });
      });

      const res = await request(app)
        .put('/api/blogs/123')
        .send({
          title: 'Updated Blog Post',
          author: 'John Doe',
          imageFile: { filename: 'new_image.jpg' },
          content: 'Updated blog content',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Blog updated successfully');
      expect(updateBlog).toHaveBeenCalled();
    });

    it('should return 404 if the blog is not found', async () => {
      // Mock the updateBlog function to simulate a failure (blog not found)
      updateBlog.mockImplementationOnce((req, res) => {
        res.status(404).json({ message: 'Blog not found' });
      });

      const res = await request(app)
        .put('/api/blogs/invalid_blog_id')
        .send({
          title: 'Updated Blog Post',
          author: 'John Doe',
          imageFile: { filename: 'new_image.jpg' },
          content: 'Updated blog content',
        });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Blog not found');
      expect(updateBlog).toHaveBeenCalled();
    });
  });

  describe('GET /api/blogs/:blogId', () => {
    it('should fetch a single blog successfully', async () => {
      // Mock the getBlog function to simulate a successful response
      getBlog.mockImplementationOnce((req, res) => {
        res.status(200).json({ message: 'Blog found' });
      });

      const res = await request(app)
        .get('/api/blogs/123');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Blog found');
      expect(getBlog).toHaveBeenCalled();
    });

    it('should return 404 if the blog is not found', async () => {
      // Mock the getBlog function to simulate a failure (blog not found)
      getBlog.mockImplementationOnce((req, res) => {
        res.status(404).json({ message: 'Blog not found' });
      });

      const res = await request(app)
        .get('/api/blogs/invalid_blog_id');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Blog not found');
      expect(getBlog).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/blogs/:blogId', () => {
    it('should delete a blog successfully', async () => {
      // Mock the deleteBlog function to simulate a successful deletion
      deleteBlog.mockImplementationOnce((req, res) => {
        res.status(200).json({ message: 'Blog deleted successfully' });
      });

      const res = await request(app)
        .delete('/api/blogs/123');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Blog deleted successfully');
      expect(deleteBlog).toHaveBeenCalled();
    });

    it('should return 404 if the blog is not found', async () => {
      // Mock the deleteBlog function to simulate a failure (blog not found)
      deleteBlog.mockImplementationOnce((req, res) => {
        res.status(404).json({ message: 'Blog not found' });
      });

      const res = await request(app)
        .delete('/api/blogs/invalid_blog_id');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Blog not found');
      expect(deleteBlog).toHaveBeenCalled();
    });
  });
});
