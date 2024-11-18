const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/documents:
 *   post:
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - workspaceId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               WorkspaceId:
 *                 type: integer
 *               contributors:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Document created successfully
 *   get:
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all documents
 *     responses:
 *       200:
 *         description: List of all documents
 * 
 * /api/documents/{id}:
 *   get:
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     summary: Get document by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document details
 *       404:
 *         description: Document not found
 *   patch:
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     summary: Update document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               contributors:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       404:
 *         description: Document not found
 *   delete:
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */
router.post('/', auth, documentController.create);
router.get('/', auth, documentController.getAll);
router.get('/:id', auth, documentController.getById);
router.patch('/:id', auth, documentController.update);
router.delete('/:id', auth, documentController.remove);

module.exports = router;