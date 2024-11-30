const sequelize = require('../../database/db');
const User = require('./User');
const Project = require('./Projects');
const Epic = require('./Epic');
const Task = require('./Task');
const State = require('./State');
const TaskAssignment = require('./TaskAssignment');

// Relaciones entre User y Project
User.hasMany(Project, {
  foreignKey: 'created_by',
  sourceKey: 'user_id',
  as: 'createdProjects',
});

Project.belongsTo(User, {
  foreignKey: {
    name: 'created_by',
    allowNull: true,
  },
  targetKey: 'user_id',
  as: 'createdBy',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

// Relaciones entre User y Epic
User.hasMany(Epic, {
  foreignKey: 'created_by',
  sourceKey: 'user_id',
  as: 'createdEpics',
});

Epic.belongsTo(User, {
  foreignKey: {
    name: 'created_by',
    allowNull: false,
  },
  targetKey: 'user_id',
  as: 'createdBy',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Relaciones entre Project y Epic
Project.hasMany(Epic, {
  foreignKey: 'project_id',
  sourceKey: 'project_id',
  as: 'epics',
});

Epic.belongsTo(Project, {
  foreignKey: {
    name: 'project_id',
    allowNull: false,
  },
  targetKey: 'project_id',
  as: 'project',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Relaciones entre Epic y Task
Epic.hasMany(Task, {
  foreignKey: 'epic_id',
  sourceKey: 'epic_id',
  as: 'tasks',
});

Task.belongsTo(Epic, {
  foreignKey: 'epic_id',
  targetKey: 'epic_id',
  as: 'epic',
});

// Relaciones entre Project y Task
Project.hasMany(Task, {
  foreignKey: 'project_id',
  sourceKey: 'project_id',
  as: 'tasks',
});

Task.belongsTo(Project, {
  foreignKey: 'project_id',
  targetKey: 'project_id',
  as: 'project',
});

// Relaciones entre User y TaskAssignment
User.hasMany(TaskAssignment, {
  foreignKey: 'user_id',
  sourceKey: 'user_id',
  as: 'taskAssignments',
});

TaskAssignment.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'user_id',
  as: 'user',
});

// Relaciones entre Task y TaskAssignment
Task.hasMany(TaskAssignment, {
  foreignKey: 'task_id',
  sourceKey: 'task_id',
  as: 'taskAssignments',
});

TaskAssignment.belongsTo(Task, {
  foreignKey: 'task_id',
  targetKey: 'task_id',
  as: 'task',
});

// Relaciones entre User y Task (creador de la tarea)
User.hasMany(Task, {
  foreignKey: 'created_by',
  sourceKey: 'user_id',
  as: 'createdTasks',
});

Task.belongsTo(User, {
  foreignKey: 'created_by',
  targetKey: 'user_id',
  as: 'createdBy',
});

// Relaciones entre Task y User (asignaciones)
Task.belongsToMany(User, {
  through: 'TaskAssignment',
  as: 'assignedUsers',
  foreignKey: 'task_id',
  otherKey: 'user_id',
});

User.belongsToMany(Task, {
  through: 'TaskAssignment',
  as: 'assignedTasks',
  foreignKey: 'user_id',
  otherKey: 'task_id',
});

// Relaciones entre Task y State
State.hasMany(Task, {
  foreignKey: 'state_id',
  sourceKey: 'state_id',
  as: 'tasks',
});

Task.belongsTo(State, {
  foreignKey: 'state_id',
  targetKey: 'state_id',
  as: 'state',
});

// Exportamos los modelos con las relaciones establecidas
module.exports = {
  sequelize,
  User,
  Project,
  Epic,
  Task,
  State,
  TaskAssignment,
};