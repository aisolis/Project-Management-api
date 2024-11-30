const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db');

const Epic = sequelize.define('Epic', {
  epic_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  epic_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  epic_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'epics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Epic;
