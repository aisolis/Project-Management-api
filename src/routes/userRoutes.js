const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Crear un nuevo usuario (registro)
router.post('/register', userController.registerUser);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener un usuario por ID
router.get('/:userId', userController.getUserById);

// Actualizar un usuario
router.put('/:userId', userController.updateUser);

// Eliminar un usuario
router.delete('/:userId', userController.deleteUser);

// Obtener tareas asignadas al usuario
router.get('/:userId/assigned-tasks', userController.getTasksAssignedToUser);

module.exports = router;
