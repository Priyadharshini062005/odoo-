/**
 * @swagger
 * tags:
 *   name: User
 *   description: These are routes for user management.
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: 'John Doe'
 *         email:
 *           type: string
 *           format: email
 *           example: 'john.doe@example.com'
 *         password:
 *           type: string
 *           format: password
 *           example: 'password123'
 *     UserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'User registered successfully.'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Invalid input data.'
 * 
 * /users:
 *   get:
 *     summary: Returns a list of users.
 *     description: Fetches all registered users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users is returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     type: string
 *                     example: 'User 1'
 *   post:
 *     summary: Registers a new user.
 *     description: Allows the creation of a new user by providing the user's information.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request, validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Example response with a list of users
  res.json([{user: 'User 1'}, {user: 'User 2'}, {user: 'User 3'}]);
});

/* Register new user */
router.post('/', function(req, res, next) {
  const { name, email, password } = req.body;

  // Assuming validation and user registration logic would go here.
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Invalid input data.' });
  }

  // Simulating a successful registration response
  res.json({ message: 'User registered successfully.' });
});

module.exports = router;
