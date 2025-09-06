const request = require('supertest');
const express = require('express');
const fileRoutes = require('../routes/fileRoutes');
const fileUpload = require('../middlewares/fileMiddleware'); // Mock the fileMiddleware
const { getFile, fileUpload: fileUploadController, deleteFile } = require('../controllers/fileController');

// Create an Express app for testing
const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api/file', fileRoutes);

jest.mock('../controllers/fileController'); // Mock fileController
jest.mock('../middlewares/fileMiddleware'); // Mock the file middleware

describe('File Routes', () => {
  let mockFile;
  let filename = 'testfile.jpg';

  beforeEach(() => {
    mockFile = {
      filename: filename,
      path: `/uploads/${filename}`,
    };
  });

  describe('POST /api/file/upload', () => {
    it('should successfully upload a file', async () => {
      // Mock the fileUpload function to simulate a successful file upload
      fileUploadController.mockImplementation((req, res) => {
        res.status(200).json({ message: 'File uploaded successfully' });
      });

      const response = await request(app)
        .post('/api/file/upload')
        .attach('file', './test/testfile.jpg'); // Simulating file upload with Supertest

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('File uploaded successfully');
    });

    it('should return a 400 error if no file is uploaded', async () => {
      const response = await request(app).post('/api/file/upload');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No file uploaded or invalid file');
    });
  });

  describe('GET /api/file/:filename', () => {
    it('should successfully fetch the file', async () => {
      // Mock the getFile function to simulate file fetching
      getFile.mockImplementation((req, res) => {
        res.status(200).sendFile(mockFile.path);
      });

      const response = await request(app).get(`/api/file/${filename}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/octet-stream');
    });

    it('should return 404 if file is not found', async () => {
      // Simulating file not found
      getFile.mockImplementation((req, res) => {
        res.status(404).json({ message: 'File not found' });
      });

      const response = await request(app).get(`/api/file/nonexistentfile.jpg`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File not found');
    });
  });

  describe('DELETE /api/file/:filename', () => {
    it('should successfully delete the file', async () => {
      // Mock the deleteFile function to simulate file deletion
      deleteFile.mockImplementation((req, res) => {
        res.status(200).json({ message: 'File deleted successfully' });
      });

      const response = await request(app).delete(`/api/file/${filename}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('File deleted successfully');
    });

    it('should return 404 if file to delete is not found', async () => {
      // Simulating file not found for deletion
      deleteFile.mockImplementation((req, res) => {
        res.status(404).json({ message: 'File not found' });
      });

      const response = await request(app).delete(`/api/file/nonexistentfile.jpg`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File not found');
    });
  });
});
