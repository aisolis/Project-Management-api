const Task = require('../entity/Task');
const Project = require('../entity/Projects');
const Epic = require('../entity/Epic');
const User = require('../entity/User');
const State = require('../entity/State');
const TaskAssignment = require('../entity/TaskAssignment');

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const taskDetails = req.body;

    // Verificar que el proyecto existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ message: 'Proyecto no encontrado' });
    }
    taskDetails.project_id = projectId;

    // Establecer el estado inicial de la tarea (por ejemplo, "Por Hacer")
    const initialState = await State.findOne({ where: { state_name: 'Por Hacer' } });
    if (!initialState) {
      return res.status(400).json({ message: 'Estado inicial no encontrado' });
    }
    taskDetails.state_id = initialState.state_id;

    // Establecer el creador de la tarea (por ejemplo, usuario con ID 1)
    const user = await User.findByPk(1); // Ajusta el ID según tus necesidades
    if (!user) {
      return res.status(400).json({ message: 'Usuario creador no encontrado' });
    }
    taskDetails.created_by = user.user_id;

    // Si la tarea pertenece a una épica
    if (taskDetails.epic_id) {
      const epic = await Epic.findByPk(taskDetails.epic_id);
      if (!epic) {
        return res.status(400).json({ message: 'Épica no encontrada' });
      }
    } else {
      taskDetails.epic_id = null;
    }

    // Crear la tarea
    const savedTask = await Task.create(taskDetails);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error al obtener la tarea:', error);
    res.status(500).json({ message: 'Error al obtener la tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const taskDetails = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Actualizar campos
    task.task_title = taskDetails.task_title;
    task.task_description = taskDetails.task_description;
    task.due_date = taskDetails.due_date;

    // Actualizar la épica si se proporciona
    if (taskDetails.epic_id) {
      const epic = await Epic.findByPk(taskDetails.epic_id);
      if (!epic) {
        return res.status(400).json({ message: 'Épica no encontrada' });
      }
      task.epic_id = taskDetails.epic_id;
    } else {
      task.epic_id = null;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};

exports.assignTaskToUser = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    const task = await Task.findByPk(taskId);
    const user = await User.findByPk(userId);

    if (!task || !user) {
      return res.status(404).json({ message: 'Tarea o usuario no encontrado' });
    }

    // Crear una nueva asignación
    const taskAssignment = await TaskAssignment.create({
      task_id: taskId,
      user_id: userId,
    });

    res.status(201).json(taskAssignment);
  } catch (error) {
    console.error('Error al asignar la tarea al usuario:', error);
    res.status(500).json({ message: 'Error al asignar la tarea al usuario' });
  }
};

exports.changeTaskState = async (req, res) => {
  try {
    const { taskId, stateId } = req.params;

    const task = await Task.findByPk(taskId);
    const state = await State.findByPk(stateId);

    if (!task || !state) {
      return res.status(404).json({ message: 'Tarea o estado no encontrado' });
    }

    task.state_id = stateId;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Error al cambiar el estado de la tarea:', error);
    res.status(500).json({ message: 'Error al cambiar el estado de la tarea' });
  }
};

exports.getUsersAssignedToTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: TaskAssignment,
          as: 'taskAssignments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['user_id', 'username', 'email'],
            },
          ],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const assignedUsers = task.taskAssignments.map((assignment) => assignment.user);

    res.json(assignedUsers);
  } catch (error) {
    console.error('Error al obtener los usuarios asignados a la tarea:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios asignados a la tarea' });
  }
};

exports.getTasksByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.findAll({
      where: { project_id: projectId },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas del proyecto:', error);
    res.status(500).json({ message: 'Error al obtener las tareas del proyecto' });
  }
};

exports.getTasksByEpicId = async (req, res) => {
  try {
    const { epicId } = req.params;

    const tasks = await Task.findAll({
      where: { epic_id: epicId },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas de la épica:', error);
    res.status(500).json({ message: 'Error al obtener las tareas de la épica' });
  }
};

exports.getTasksByStateId = async (req, res) => {
  try {
    const { stateId } = req.params;

    const tasks = await Task.findAll({
      where: { state_id: stateId },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas por estado:', error);
    res.status(500).json({ message: 'Error al obtener las tareas por estado' });
  }
};

exports.unassignAllUsersFromTask = async (req, res) => {
    try {
      const { taskId } = req.params;
  
      // Verificar si la tarea existe
      const task = await Task.findByPk(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
  
      // Eliminar todas las asignaciones de la tarea
      await TaskAssignment.destroy({
        where: {
          task_id: taskId,
        },
      });
  
      res.status(200).json({ message: 'Todos los usuarios han sido desasignados de la tarea' });
    } catch (error) {
      console.error('Error al desasignar los usuarios de la tarea:', error);
      res.status(500).json({ message: 'Error al desasignar los usuarios de la tarea' });
    }
  };
