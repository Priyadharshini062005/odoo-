// routes/productRoutes.js
const express = require('express');
const uploadMiddleware = require('../middlewares/fileMiddleware');
const { getProducts, getProductById, createProduct, addProductsInBatch } = require('../controllers/productController');
const { auth } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, createProduct);

/**
 * @swagger
 * /api/products/batch:
 *   post:
 *     summary: Upload a file
 *     tags: [Products]
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

router.post('/batch', uploadMiddleware.single('file'), addProductsInBatch);

module.exports = router;
