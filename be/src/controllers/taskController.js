const { Task, User, Subtask } = require('../models');
const { NotificationService } = require('../services/notificationService');

const create = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    if (req.body.assignees) {
      await task.setAssignees(req.body.assignees);
      
      // Create notifications for assigned users
      const creator = await User.findByPk(req.user.id);
      for (const assigneeId of req.body.assignees) {
        await NotificationService.notifyTaskAssigned({
          taskId: task.id,
          assignedUserId: assigneeId,
          assignerName: creator.name,
          taskTitle: task.title
        });
      }
    }
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        { model: User, as: 'assignees' },
        { model: Subtask }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignees' },
        { model: Subtask }
      ]
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Store old assignees for comparison
    const oldAssignees = await task.getAssignees();
    const oldAssigneeIds = oldAssignees.map(a => a.id);
    
    // Update task
    await task.update(req.body);
    
    // Handle assignee changes
    if (req.body.assignees) {
      await task.setAssignees(req.body.assignees);
      
      // Create notifications for newly assigned users
      const updater = await User.findByPk(req.user.id);
      const newAssigneeIds = req.body.assignees.filter(id => !oldAssigneeIds.includes(id));
      
      for (const assigneeId of newAssigneeIds) {
        await NotificationService.notifyTaskAssigned({
          taskId: task.id,
          assignedUserId: assigneeId,
          assignerName: updater.name,
          taskTitle: task.title
        });
      }
    }

    // If task is marked as completed
    if (req.body.status === 'completed' && task.status !== 'completed') {
      const assignees = await task.getAssignees();
      const completer = await User.findByPk(req.user.id);
      
      for (const assignee of assignees) {
        if (assignee.id !== req.user.id) {
          await NotificationService.createNotification({
            type: 'TASK_COMPLETED',
            userId: assignee.id,
            message: `${completer.name} marked task "${task.title}" as completed`,
            relatedId: task.id,
            relatedType: 'Task'
          });
        }
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};