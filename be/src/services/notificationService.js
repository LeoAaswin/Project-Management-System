const Notification = require('../models/notification');

// Notification types
const NotificationType = {
    TASK_ASSIGNED: 'TASK_ASSIGNED',
    TASK_UPDATED: 'TASK_UPDATED',
    TASK_COMPLETED: 'TASK_COMPLETED',
    COMMENT_ADDED: 'COMMENT_ADDED',
    DOCUMENT_SHARED: 'DOCUMENT_SHARED',
    WORKSPACE_INVITATION: 'WORKSPACE_INVITATION',
    DEADLINE_APPROACHING: 'DEADLINE_APPROACHING',
    SUBTASK_COMPLETED: 'SUBTASK_COMPLETED'
};

class NotificationService {
    static async createNotification({ type, userId, message, relatedId = null, relatedType = null }) {
        try {
            return await Notification.create({
                type,
                userId,
                message,
                relatedId,
                relatedType,
                isRead: false
            });
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Helper methods for common notifications
    static async notifyTaskAssigned({ taskId, assignedUserId, assignerName, taskTitle }) {
        return this.createNotification({
            type: NotificationType.TASK_ASSIGNED,
            userId: assignedUserId,
            message: `${assignerName} assigned you a task: ${taskTitle}`,
            relatedId: taskId,
            relatedType: 'Task'
        });
    }

    static async notifyCommentAdded({ taskId, commenterId, commenterName, taskTitle }) {
        return this.createNotification({
            type: NotificationType.COMMENT_ADDED,
            userId: taskId,
            message: `${commenterName} commented on task: ${taskTitle}`,
            relatedId: taskId,
            relatedType: 'Comment'
        });
    }

    static async notifyDocumentShared({ documentId, sharedWithUserId, sharerName, documentName }) {
        return this.createNotification({
            type: NotificationType.DOCUMENT_SHARED,
            userId: sharedWithUserId,
            message: `${sharerName} shared a document with you: ${documentName}`,
            relatedId: documentId,
            relatedType: 'Document'
        });
    }

    static async notifyWorkspaceInvitation({ workspaceId, invitedUserId, inviterName, workspaceName }) {
        return this.createNotification({
            type: NotificationType.WORKSPACE_INVITATION,
            userId: invitedUserId,
            message: `${inviterName} invited you to workspace: ${workspaceName}`,
            relatedId: workspaceId,
            relatedType: 'Workspace'
        });
    }

    static async notifyDeadlineApproaching({ taskId, userId, taskTitle, dueDate }) {
        return this.createNotification({
            type: NotificationType.DEADLINE_APPROACHING,
            userId,
            message: `Task deadline approaching: ${taskTitle} (Due: ${dueDate})`,
            relatedId: taskId,
            relatedType: 'Task'
        });
    }

    static async notifySubtaskCompleted({ taskId, userId, subtaskTitle, completerName }) {
        return this.createNotification({
            type: NotificationType.SUBTASK_COMPLETED,
            userId,
            message: `${completerName} completed subtask: ${subtaskTitle}`,
            relatedId: taskId,
            relatedType: 'Subtask'
        });
    }
}

module.exports = {
    NotificationService,
    NotificationType
};
