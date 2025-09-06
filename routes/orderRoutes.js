// routes/orderRoutes.js
const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/orderController');
const { auth } = require('../middlewares/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order placed
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, createOrder);

/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
router.get('/user', auth, getUserOrders);

module.exports = router;
