const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/subtasks:
 *   post:
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new subtask
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - taskId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
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
 *               TaskId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subtask created successfully
 *   get:
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Get all subtasks
 *     responses:
 *       200:
 *         description: List of all subtasks
 * 
 * /api/subtasks/{id}:
 *   get:
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Get subtask by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Subtask details
 *       404:
 *         description: Subtask not found
 *   patch:
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Update subtask
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
 *                 minimum: 1
 *                 maximum: 3
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
 *         description: Subtask updated successfully
 *       404:
 *         description: Subtask not found
 *   delete:
 *     tags: [Subtasks]
 *     security:
 *       - bearerAuth: []
 *     summary: Delete subtask
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Subtask deleted successfully
 *       404:
 *         description: Subtask not found
 */
router.post('/', auth, subtaskController.create);
router.get('/', auth, subtaskController.getAll);
router.get('/:id', auth, subtaskController.getById);
router.patch('/:id', auth, subtaskController.update);
router.delete('/:id', auth, subtaskController.remove);

module.exports = router;