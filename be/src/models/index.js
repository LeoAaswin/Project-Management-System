const User = require('./user');
const Workspace = require('./workspace');
const Task = require('./task');
const Subtask = require('./subtask');
const Document = require('./document');
const Comment = require('./comment');

// Workspace associations
Workspace.hasMany(Task);
Task.belongsTo(Workspace);

Workspace.hasMany(Document);
Document.belongsTo(Workspace);

// Task associations
Task.hasMany(Subtask);
Subtask.belongsTo(Task);

Task.belongsToMany(User, { through: 'TaskAssignees', as: 'assignees' });
User.belongsToMany(Task, { through: 'TaskAssignees', as: 'assignedTasks' });

// Subtask associations
Subtask.belongsToMany(User, { through: 'SubtaskAssignees', as: 'assignees' });
User.belongsToMany(Subtask, { through: 'SubtaskAssignees', as: 'assignedSubtasks' });

// Document associations
Document.belongsTo(User, { as: 'author' });
Document.belongsToMany(User, { through: 'DocumentContributors', as: 'contributors' });
User.belongsToMany(Document, { through: 'DocumentContributors', as: 'contributedDocuments' });

// Comment associations
Task.hasMany(Comment, { foreignKey: 'taskId', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Workspace,
  Task,
  Subtask,
  Document,
  Comment
};