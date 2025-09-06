const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../app');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

// Mocking fs and path
jest.mock('fs');
jest.mock('path');

describe('File Controller - File Operations', () => {

  beforeAll(async () => {
    await connectDB();  // Establish DB connection before all tests
  });

  afterAll(async () => {
    await closeDB();  // Close DB connection after all tests
  });

  beforeEach(() => {
    jest.clearAllMocks();  // Reset mocks before each test
  });

  //  Test file upload
  describe('fileUpload', () => {
    it('should upload a file successfully', async () => {
      const mockFile = { filename: 'testfile.txt', path: '/uploads/testfile.txt' };
      const req = { file: mockFile };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await require('../../controllers/fileController').fileUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'File uploaded successfully', file: mockFile });
    });

    it('should return 400 if no file is uploaded', async () => {
      const req = { file: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await require('../../controllers/fileController').fileUpload(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: 'No file uploaded' });
    });
  });

  //  Test file retrieval
  describe('getFile', () => {
    it('should return the file if it exists', async () => {
      const mockFilePath = '/uploads/testfile.txt';
      const req = { params: { filename: 'testfile.txt' } };
      const res = {
        sendFile: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      fs.existsSync.mockReturnValue(true); // Mock file existence
      path.join.mockReturnValue(mockFilePath); // Mock path.join to return the file path

      await require('../../controllers/fileController').getFile(req, res);

      expect(path.join).toHaveBeenCalledWith(process.cwd(), 'uploads', 'testfile.txt');
      expect(res.sendFile).toHaveBeenCalledWith(mockFilePath);
    });

    it('should return 404 if the file does not exist', async () => {
      const req = { params: { filename: 'nonexistentfile.txt' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      fs.existsSync.mockReturnValue(false); // Mock file does not exist
      path.join.mockReturnValue('/uploads/nonexistentfile.txt');

      await require('../../controllers/fileController').getFile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('File not found');
    });
  });

  //  Test file deletion
  describe('deleteFile', () => {
    it('should delete the file successfully', async () => {
      const mockFilePath = '/uploads/testfile.txt';
      const req = { params: { filename: 'testfile.txt' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      fs.existsSync.mockReturnValue(true); // Mock file existence
      fs.unlink.mockImplementation((path, cb) => cb(null)); // Mock successful file deletion
      path.join.mockReturnValue(mockFilePath);

      await require('../../controllers/fileController').deleteFile(req, res);

      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlink).toHaveBeenCalledWith(mockFilePath, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'File deleted successfully' });
    });

    it('should return 404 if the file does not exist', async () => {
      const req = { params: { filename: 'nonexistentfile.txt' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      fs.existsSync.mockReturnValue(false); // Mock file does not exist
      path.join.mockReturnValue('/uploads/nonexistentfile.txt');

      await require('../../controllers/fileController').deleteFile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('File not found');
    });

    it('should return 500 error if there is an issue deleting the file', async () => {
      const mockFilePath = '/uploads/testfile.txt';
      const req = { params: { filename: 'testfile.txt' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      fs.existsSync.mockReturnValue(true); // Mock file existence
      fs.unlink.mockImplementation((path, cb) => cb(new Error('Deletion failed'))); // Mock deletion failure
      path.join.mockReturnValue(mockFilePath);

      await require('../../controllers/fileController').deleteFile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error deleting file');
    });
  });

});
