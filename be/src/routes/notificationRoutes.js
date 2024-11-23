const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the notification
 *         type:
 *           type: string
 *           description: The type of notification (e.g., TASK_ASSIGNED, COMMENT_ADDED)
 *         message:
 *           type: string
 *           description: The notification message
 *         isRead:
 *           type: boolean
 *           description: Whether the notification has been read
 *         userId:
 *           type: integer
 *           description: The ID of the user this notification belongs to
 *         relatedId:
 *           type: integer
 *           description: ID of the related item (task, comment, etc.)
 *         relatedType:
 *           type: string
 *           description: Type of the related item (Task, Comment, etc.)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was last updated
 */

// Main notification routes
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/', auth, notificationController.getUserNotifications);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.patch('/:id/read', auth, notificationController.markAsRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.patch('/read-all', auth, notificationController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, notificationController.deleteNotification);

// Test routes for different notification types
/**
 * @swagger
 * /api/notifications/test:
 *   post:
 *     summary: Create a custom test notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Notification type
 *               message:
 *                 type: string
 *                 description: Notification message
 *               relatedId:
 *                 type: integer
 *                 description: ID of related item
 *               relatedType:
 *                 type: string
 *                 description: Type of related item
 */
router.post('/test', auth, notificationController.createCustomNotification);

/**
 * @swagger
 * /api/notifications/test/task-assigned:
 *   post:
 *     summary: Test task assigned notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *               taskTitle:
 *                 type: string
 */
router.post('/test/task-assigned', auth, notificationController.testTaskAssigned);

/**
 * @swagger
 * /api/notifications/test/comment-added:
 *   post:
 *     summary: Test comment added notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 */
router.post('/test/comment-added', auth, notificationController.testCommentAdded);

/**
 * @swagger
 * /api/notifications/test/document-shared:
 *   post:
 *     summary: Test document shared notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 */
router.post('/test/document-shared', auth, notificationController.testDocumentShared);

/**
 * @swagger
 * /api/notifications/test/workspace-invitation:
 *   post:
 *     summary: Test workspace invitation notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 */
router.post('/test/workspace-invitation', auth, notificationController.testWorkspaceInvitation);

/**
 * @swagger
 * /api/notifications/test/deadline-approaching:
 *   post:
 *     summary: Test deadline approaching notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 */
router.post('/test/deadline-approaching', auth, notificationController.testDeadlineApproaching);

/**
 * @swagger
 * /api/notifications/test/subtask-completed:
 *   post:
 *     summary: Test subtask completed notification
 *     tags: [Notifications - Test]
 *     security:
 *       - bearerAuth: []
 */
router.post('/test/subtask-completed', auth, notificationController.testSubtaskCompleted);

module.exports = router;
