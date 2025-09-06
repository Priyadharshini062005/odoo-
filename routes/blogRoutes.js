// routes/authRoutes.js
const express = require('express');
const { getBlogs, createBlog, updateBlog, getBlog, deleteBlog } = require('../controllers/blogController');

const router = express.Router();
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blog
 *     tags: [Blogs]
 *     description: Fetch all blogs.
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
router.get('/', getBlogs);

/**
 * @swagger
 * /api/blogs/create:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               imageFile:
 *                 type: object
 *               content:
 *                 type: string
 *               authorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', createBlog);

/**
 * @swagger
 * /api/blogs/{blogId}:
 *   put:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     parameters:
 *       - name: blogId
 *         in: path
 *         required: true
 *         description: This is id of an individual blog
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               imageFile:
 *                 type: object
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.put('/:blogId', updateBlog);

/**
 * @swagger
 * /api/blogs/{blogId}:
 *   get:
 *     summary: Get a blog by id
 *     tags: [Blogs]
 *     description: Fetch blog by id.
 *     parameters:
 *       - name: blogId
 *         in: path
 *         required: true
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
router.get('/:blogId', getBlog);

/**
 * @swagger
 * /api/blogs/{blogId}:
 *   delete:
 *     summary: Get a blog by id
 *     tags: [Blogs]
 *     description: Fetch blog by id.
 *     parameters:
 *       - name: blogId
 *         in: path
 *         required: true
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
router.delete('/:blogId', deleteBlog);

module.exports = router;
