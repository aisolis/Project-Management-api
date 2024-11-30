const User = require('../entity/User');
const Task = require('../entity/Task');
const TaskAssignment = require('../entity/TaskAssignment');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
    const userDetails = req.body;

    // Verificar si el nombre de usuario o correo electrónico ya existen
    const existingUser = await User.findOne({ where: { username: userDetails.username } });
    const existingEmail = await User.findOne({ where: { email: userDetails.email } });

    if (existingUser || existingEmail) {
      return res.status(400).json({ message: 'El nombre de usuario o correo electrónico ya existen' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userDetails.password_hash, 10);
    userDetails.password_hash = hashedPassword;

    // Establecer rol por defecto si no se proporciona
    if (!userDetails.role || userDetails.role.trim() === '') {
      userDetails.role = 'USER';
    }

    // Crear el usuario
    const savedUser = await User.create(userDetails);

    // No devolver la contraseña en la respuesta
    const { password_hash: _, ...userWithoutPassword } = savedUser.toJSON();

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
    });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDetails = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo nombre de usuario o correo electrónico ya existen en otro usuario
    const userByUsername = await User.findOne({ where: { username: userDetails.username } });
    if (userByUsername && userByUsername.user_id !== parseInt(userId)) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    const userByEmail = await User.findOne({ where: { email: userDetails.email } });
    if (userByEmail && userByEmail.user_id !== parseInt(userId)) {
      return res.status(400).json({ message: 'El correo electrónico ya existe' });
    }

    // Actualizar campos
    user.username = userDetails.username;
    user.email = userDetails.email;
    user.name = userDetails.name;
    user.role = userDetails.role;

    // Si se proporciona una nueva contraseña, encriptarla y actualizarla
    if (userDetails.password_hash && userDetails.password_hash.trim() !== '') {
      const hashedPassword = await bcrypt.hash(userDetails.password_hash, 10);
      user.password_hash = hashedPassword;
    }

    const updatedUser = await user.save();

    // No devolver la contraseña en la respuesta
    const { password_hash: _, ...userWithoutPassword } = updatedUser.toJSON();

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

exports.getTasksAssignedToUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const assignments = await TaskAssignment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Task,
          as: 'task',
        },
      ],
    });

    const tasks = assignments.map((assignment) => assignment.task);

    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas asignadas al usuario:', error);
    res.status(500).json({ message: 'Error al obtener las tareas asignadas al usuario' });
  }
};
