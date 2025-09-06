// /schemas/userSchemas.js
/**
 * @swagger
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
 */
