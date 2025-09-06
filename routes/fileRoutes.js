const express = require('express');
const uploadMiddleware = require('../middlewares/fileMiddleware');
const { getFile, fileUpload, deleteFile } = require('../controllers/fileController');
const router = express.Router();

// Route to upload a file
/**
 * @swagger
 * /api/file/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     description: Upload a file to the server
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *                file:
 *                  type: string
 *                  format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file
 */

router.post('/upload', uploadMiddleware.single('file'), fileUpload);

// Route to fetch a file by filename
/**
 * @swagger
 * /api/file/{filename}:
 *   get:
 *     summary: Get a file by filename
 *     tags: [Files]
 *     description: Fetch a file from the server by its filename
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: Filename of the file to fetch
 *         type: string
 *         format: binary
 *     responses:
 *       200:
 *         description: File found
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get('/:filename', getFile);

// Route to delete a file by filename
/**
 * @swagger
 * /api/file/{filename}:
 *   delete:
 *     summary: Delete a file by filename
 *     tags: [Files]
 *     description: Delete a file from the server by its filename
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: Filename of the file to delete
 *         type: string
 *         format: binary
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 */
router.delete('/:filename', deleteFile);

module.exports = router
