// controllers/projectController.js
const Epic = require('../entity/Epic');
const Project = require('../entity/Projects');
const User = require('../entity/User');
const Task = require('../entity/Task');
const State = require('../entity/State');


exports.createProject = async (req, res) => {
  try {
    const projectDetails = req.body;

    // Establecer el usuario creador manualmente (por ejemplo, con ID 1)
    const user = await User.findByPk(1); // Ajusta el ID según tus necesidades
    if (!user) {
      return res.status(400).json({ message: 'Usuario creador no encontrado' });
    }

    // Establecer el usuario creador en el proyecto
    projectDetails.created_by = user.user_id;

    // Crear el proyecto
    const savedProject = await Project.create(projectDetails);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    res.status(500).json({ message: 'Error al obtener los proyectos' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectDetails = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Actualizar campos
    project.project_name = projectDetails.project_name;
    project.project_description = projectDetails.project_description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar el proyecto' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    await project.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};

exports.getEpicsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const epics = await Epic.findAll({
      where: { project_id: projectId },
    });

    res.json(epics);
  } catch (error) {
    console.error('Error al obtener las épicas del proyecto:', error);
    res.status(500).json({ message: 'Error al obtener las épicas del proyecto' });
  }
};

exports.getTasksByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.findAll({
      where: { project_id: projectId },
      include: [
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['user_id', 'username'],
          through: {
            attributes: [],
          },
        },
        {
          model: State,
          as: 'state',
          attributes: ['state_name'],
        },
        {
          model: Epic,
          as: 'epic',
          attributes: ['epic_id', 'epic_name'],
        },
      ],
    });

    // Formatear la respuesta para que coincida con el formato esperado
    const formattedTasks = tasks.map((task) => {
      return {
        task_id: task.task_id,
        task_title: task.task_title,
        task_description: task.task_description,
        state_name: task.state ? task.state.state_name : null,
        due_date: task.due_date,
        assigned_users: task.assignedUsers.map((user) => user.user_id),
        epic_id: task.epic ? task.epic.epic_id : null,
        epic_name: task.epic ? task.epic.epic_name : null,
      };
    });

    res.json(formattedTasks);
  } catch (error) {
    console.error('Error al obtener las tareas del proyecto:', error);
    res.status(500).json({ message: 'Error al obtener las tareas del proyecto' });
  }
};


