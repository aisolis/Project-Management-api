const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db');

const State = sequelize.define('State', {
  state_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  state_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  state_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'task_states',
  timestamps: false,
});


module.exports = State;
