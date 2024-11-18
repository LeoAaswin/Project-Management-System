const { Subtask, User } = require('../models');

const create = async (req, res) => {
  try {
    const subtask = await Subtask.create(req.body);
    if (req.body.assignees) {
      await subtask.setAssignees(req.body.assignees);
    }
    res.status(201).json(subtask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const subtasks = await Subtask.findAll({
      include: [
        { model: User, as: 'assignees' }
      ]
    });
    res.json(subtasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const subtask = await Subtask.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignees' }
      ]
    });
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const subtask = await Subtask.findByPk(req.params.id);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    await subtask.update(req.body);
    if (req.body.assignees) {
      await subtask.setAssignees(req.body.assignees);
    }
    res.json(subtask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const subtask = await Subtask.findByPk(req.params.id);
    if (!subtask) {
      return res.status(404).json({ error: 'Subtask not found' });
    }
    await subtask.destroy();
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