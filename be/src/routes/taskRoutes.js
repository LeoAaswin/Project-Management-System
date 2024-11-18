const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new task
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
 *               priority:
 *                 type: integer
 *               progress:
 *                 type: string
 *                 enum: ['To Do', 'In Development', 'Review', 'Completed']
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: integer
 *               WorkspaceId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Task created successfully
 *   get:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of all tasks
 * 
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Get task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *   patch:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Update task
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
 *               priority:
 *                 type: integer
 *               progress:
 *                 type: string
 *                 enum: ['To Do', 'In Development', 'Review', 'Completed']
 *               due_date:
 *                 type: string
 *                 format: date-time
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *   delete:
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.post('/', auth, taskController.create);
router.get('/', auth, taskController.getAll);
router.get('/:id', auth, taskController.getById);
router.patch('/:id', auth, taskController.update);
router.delete('/:id', auth, taskController.remove);

module.exports = router;