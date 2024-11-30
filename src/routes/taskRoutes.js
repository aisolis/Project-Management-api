const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Crear una nueva tarea asociada a un proyecto
router.post('/project/:projectId', taskController.createTask);

// Obtener todas las tareas
router.get('/', taskController.getAllTasks);

// Obtener una tarea por ID
router.get('/:taskId', taskController.getTaskById);

// Actualizar una tarea
router.put('/:taskId', taskController.updateTask);

// Eliminar una tarea
router.delete('/:taskId', taskController.deleteTask);

// Asignar una tarea a un usuario
router.post('/:taskId/assign/:userId', taskController.assignTaskToUser);

// Cambiar el estado de una tarea
router.put('/:taskId/change-state/:stateId', taskController.changeTaskState);

// Obtener usuarios asignados a una tarea
router.get('/:taskId/assigned-users', taskController.getUsersAssignedToTask);

// Obtener tareas por ID de proyecto
router.get('/project/:projectId', taskController.getTasksByProjectId);

// Obtener tareas por ID de épica
router.get('/epic/:epicId', taskController.getTasksByEpicId);

// Obtener tareas por estado
router.get('/state/:stateId', taskController.getTasksByStateId);

router.delete('/:taskId/unassign-all', taskController.unassignAllUsersFromTask);

module.exports = router;
