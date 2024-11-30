const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db');

const TaskAssignment = sequelize.define('TaskAssignment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'task_assignments',
  timestamps: false,
});

module.exports = TaskAssignment;
