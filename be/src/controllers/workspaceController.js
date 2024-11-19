const { Workspace, Task, Document, User, Subtask } = require('../models');

const create = async (req, res) => {
  try {
    const workspace = await Workspace.create(req.body);
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const workspaces = await Workspace.findAll({
      include: [
        { model: Task },
        { model: Document }
      ]
    });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id, {
      include: [
        {
          model: Task,
          include: [
            { model: User, as: 'assignees' },
            { model: Subtask,
              include: [
                { model: User, as: 'assignees' }
              ]
             }
          ],
        },
        { model: Document,
          include: [
            { model: User, as: 'author' },
            { model: User, as: 'contributors' }
          ]
         },
      ],
    });
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const update = async (req, res) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    await workspace.update(req.body);
    res.json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    await workspace.destroy();
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