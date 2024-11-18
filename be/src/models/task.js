const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  priority: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 3
    }
  },
  progress: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'In Review', 'Completed'),
    defaultValue: 'To Do'
  },
  due_date: {
    type: DataTypes.DATE
  }
});

module.exports = Task;