// routes/stateRoutes.js

const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');

// Crear un nuevo estado de tarea
router.post('/', stateController.createState);

// Obtener todos los estados de tarea
router.get('/', stateController.getAllStates);

// Obtener un estado de tarea por ID
router.get('/:stateId', stateController.getStateById);

// Actualizar un estado de tarea
router.put('/:stateId', stateController.updateState);

// Eliminar un estado de tarea
router.delete('/:stateId', stateController.deleteState);

module.exports = router;
