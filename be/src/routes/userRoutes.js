const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/register', upload.single('image'), userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: User profile details
 *   patch:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     summary: Update user profile
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, upload.single('image'), userController.updateProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth, userController.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *   delete:
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.get('/:id', auth, userController.getById);
router.delete('/:id', auth, userController.remove);

module.exports = router;
