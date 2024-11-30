const express = require('express');
const router = express.Router();
const epicController = require('../controllers/epicController');

// Crear una nueva épica asociada a un proyecto
router.post('/project/:projectId', epicController.createEpic);

// Obtener todas las épicas de un proyecto
router.get('/project/:projectId', epicController.getEpicsByProjectId);

// Obtener todas las épicas
router.get('/', epicController.getAllEpics);

// Obtener una épica por ID
router.get('/:epicId', epicController.getEpicById);

// Actualizar una épica
router.put('/:epicId', epicController.updateEpic);

// Eliminar una épica
router.delete('/:epicId', epicController.deleteEpic);

module.exports = router;
