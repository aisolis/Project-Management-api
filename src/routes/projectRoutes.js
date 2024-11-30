const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Crear un nuevo proyecto
router.post('/', projectController.createProject);

// Obtener todos los proyectos
router.get('/', projectController.getAllProjects);

// Obtener un proyecto por ID
router.get('/:projectId', projectController.getProjectById);

// Actualizar un proyecto
router.put('/:projectId', projectController.updateProject);

// Eliminar un proyecto
router.delete('/:projectId', projectController.deleteProject);

// Obtener todas las épicas de un proyecto
router.get('/:projectId/epics', projectController.getEpicsByProjectId);

// Obtener todas las tareas de un proyecto
router.get('/:projectId/tasks', projectController.getTasksByProjectId);

module.exports = router;
