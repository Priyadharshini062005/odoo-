const multer = require('multer');
const uploadMiddleware = require('../../middleware/fileMiddleware');
const path = require('path');
const fs = require('fs');
const { closeDB } = require('../../config/db');
const connectDB = require('../../config/db');

jest.mock('multer'); // Mocking multer for testing

describe('File Middleware', () => {
  let mockRequest, mockResponse, next;

  beforeAll(async () => {
    await connectDB(); // Connect to DB before running the tests
  });

  afterAll(async () => {
    await closeDB(); // Close DB connection after tests
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
    mockRequest = {}; // Reset mockRequest before each test
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }; // Mocking the response object
    next = jest.fn(); // Mock the next function
  });

  //  Test valid file upload
  it('should accept a valid file', async () => {
    const mockFile = {
      originalname: 'image.jpg',
      mimetype: 'image/jpeg',
      fieldname: 'file',
      size: 2000000, // Valid file size (less than 5MB)
    };

    const upload = uploadMiddleware.single('file');

    // Call the middleware with mock data
    upload(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled(); // File should pass the middleware
  });

  //  Test invalid file type
  it('should reject invalid file type', async () => {
    const mockFile = {
      originalname: 'document.pdf',
      mimetype: 'application/pdf', // Invalid mimetype
      fieldname: 'file',
      size: 2000000,
    };

    // Simulate file filter rejection
    const upload = uploadMiddleware.single('file');
    const fileFilter = uploadMiddleware.fileFilter;
    
    // Create a mock of the callback to simulate the rejection
    const cb = jest.fn();
    fileFilter(mockRequest, mockFile, cb);
    
    expect(cb).toHaveBeenCalledWith(new Error('File type not allowed'), false); // Expect the file to be rejected
  });

  //  Test file size limit exceeded
  it('should reject file when size exceeds the limit', async () => {
    const mockFile = {
      originalname: 'largeimage.jpg',
      mimetype: 'image/jpeg',
      fieldname: 'file',
      size: 6000000, // Invalid file size (greater than 5MB)
    };

    // Simulate file filter rejection
    const upload = uploadMiddleware.single('file');
    const fileFilter = uploadMiddleware.fileFilter;
    
    // Create a mock of the callback to simulate the rejection
    const cb = jest.fn();
    fileFilter(mockRequest, mockFile, cb);
    
    expect(cb).toHaveBeenCalledWith(new Error('File size too large'), false); // Expect the file to be rejected
  });

  //  Test filename timestamp handling
  it('should rename file with timestamp to avoid collision', async () => {
    const mockFile = {
      originalname: 'image.jpg',
      mimetype: 'image/jpeg',
      fieldname: 'file',
      size: 2000000,
    };

    // Mock the diskStorage to capture file name
    const storageMock = multer.diskStorage((req, file, cb) => {
      const ext = path.extname(file.originalname);
      const timestampedFilename = Date.now() + ext;
      cb(null, timestampedFilename); // Return timestamped file name
    });

    // Create the upload middleware with the mocked storage
    const upload = multer({ storage: storageMock });

    upload.single('file')(mockRequest, mockResponse, next); // Simulate file upload
    
    expect(mockRequest.file.filename).toMatch(/\d+\.jpg/); // Filename should be timestamped with an extension
    expect(next).toHaveBeenCalled(); // File should pass the middleware
  });
});
