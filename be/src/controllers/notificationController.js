const Notification = require('../models/notification');
const { validationResult } = require('express-validator');
const { NotificationService, NotificationType } = require('../services/notificationService');

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error updating notifications' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const result = await Notification.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

// Create notification (internal use)
exports.createNotification = async (data) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Test Routes for different notification types
exports.testTaskAssigned = async (req, res) => {
  try {
    const notification = await NotificationService.notifyTaskAssigned({
      taskId: req.body.taskId || 1,
      assignedUserId: req.user.id,
      assignerName: 'Test User',
      taskTitle: req.body.taskTitle || 'Test Task'
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testCommentAdded = async (req, res) => {
  try {
    const notification = await NotificationService.notifyCommentAdded({
      taskId: req.body.taskId || 1,
      commenterId: req.user.id,
      commenterName: 'Test User',
      taskTitle: req.body.taskTitle || 'Test Task'
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testDocumentShared = async (req, res) => {
  try {
    const notification = await NotificationService.notifyDocumentShared({
      documentId: req.body.documentId || 1,
      sharedWithUserId: req.user.id,
      sharerName: 'Test User',
      documentName: req.body.documentName || 'Test Document'
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testWorkspaceInvitation = async (req, res) => {
  try {
    const notification = await NotificationService.notifyWorkspaceInvitation({
      workspaceId: req.body.workspaceId || 1,
      invitedUserId: req.user.id,
      inviterName: 'Test User',
      workspaceName: req.body.workspaceName || 'Test Workspace'
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testDeadlineApproaching = async (req, res) => {
  try {
    const notification = await NotificationService.notifyDeadlineApproaching({
      taskId: req.body.taskId || 1,
      userId: req.user.id,
      taskTitle: req.body.taskTitle || 'Test Task',
      dueDate: req.body.dueDate || new Date().toISOString()
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.testSubtaskCompleted = async (req, res) => {
  try {
    const notification = await NotificationService.notifySubtaskCompleted({
      taskId: req.body.taskId || 1,
      userId: req.user.id,
      subtaskTitle: req.body.subtaskTitle || 'Test Subtask',
      completerName: 'Test User'
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a custom notification (for testing)
exports.createCustomNotification = async (req, res) => {
  try {
    const { type, message, relatedId, relatedType } = req.body;
    const notification = await NotificationService.createNotification({
      type: type || 'CUSTOM',
      userId: req.user.id,
      message: message || 'Custom notification',
      relatedId,
      relatedType
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
