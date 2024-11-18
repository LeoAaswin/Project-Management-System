const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new workspace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *   get:
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all workspaces
 *     responses:
 *       200:
 *         description: List of all workspaces
 * 
 * /api/workspaces/{id}:
 *   get:
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     summary: Get workspace by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workspace details
 *       404:
 *         description: Workspace not found
 *   patch:
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     summary: Update workspace
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *       404:
 *         description: Workspace not found
 *   delete:
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete workspace
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Workspace deleted successfully
 *       404:
 *         description: Workspace not found
 */
router.post('/', auth, workspaceController.create);
router.get('/', auth, workspaceController.getAll);
router.get('/:id', auth, workspaceController.getById);
router.patch('/:id', auth, workspaceController.update);
router.delete('/:id', auth, workspaceController.remove);

module.exports = router;