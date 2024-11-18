const { Document, User } = require('../models');

const create = async (req, res) => {
  try {
    console.log(req.user.id);
    const document = await Document.create({
      ...req.body,
      authorId: req.user.id
    });
    if (req.body.contributors) {
      await document.setContributors(req.body.contributors);
    }
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        { model: User, as: 'author' },
        { model: User, as: 'contributors' }
      ]
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author' },
        { model: User, as: 'contributors' }
      ]
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    await document.update(req.body);
    if (req.body.contributors) {
      await document.setContributors(req.body.contributors);
    }
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    await document.destroy();
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