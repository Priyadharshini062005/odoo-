const multer = require('multer');
const path = require('path');

// Set up multer storage and file filter for uploading images/files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(`Destination path: uploads/ ${file.fieldname}`);
      cb(null, 'uploads/');  // Set the destination folder
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      console.log(`File extension is: ${ext}`);
      cb(null, Date.now() + ext); // Add a timestamp to avoid filename collisions
    }
  });

// File filter (optional, here we filter only images)
const fileFilter = (req, file, cb) => {
    console.log(`File type: ${file.mimetype}`);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/json'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      console.log("Error: File type not allowed")
      cb(new Error('File type not allowed'), false); // Reject the file
    }
  };
  

// Initialize multer middleware
const uploadMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
  });

module.exports = uploadMiddleware;