const Epic = require('../entity/Epic');
const Project = require('../entity/Projects');
const User = require('../entity/User');

exports.createEpic = async (req, res) => {
  try {
    const { projectId } = req.params;
    const epicDetails = req.body;

    // Verificar que el proyecto existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ message: 'Proyecto no encontrado' });
    }

    // Establecer el proyecto en los detalles de la épica
    epicDetails.project_id = projectId;

    // Establecer el usuario creador manualmente (por ejemplo, con ID 1)
    const user = await User.findByPk(1); // Puedes ajustar el ID según tus necesidades
    if (!user) {
      return res.status(400).json({ message: 'Usuario creador no encontrado' });
    }
    epicDetails.created_by = user.user_id;

    // Crear la épica
    const savedEpic = await Epic.create(epicDetails);
    res.status(201).json(savedEpic);
  } catch (error) {
    console.error('Error al crear la épica:', error);
    res.status(500).json({ message: 'Error al crear la épica' });
  }
};

exports.getAllEpics = async (req, res) => {
  try {
    const epics = await Epic.findAll();
    res.json(epics);
  } catch (error) {
    console.error('Error al obtener las épicas:', error);
    res.status(500).json({ message: 'Error al obtener las épicas' });
  }
};

exports.getEpicById = async (req, res) => {
  try {
    const { epicId } = req.params;
    const epic = await Epic.findByPk(epicId);
    if (!epic) {
      return res.status(404).json({ message: 'Épica no encontrada' });
    }
    res.json(epic);
  } catch (error) {
    console.error('Error al obtener la épica:', error);
    res.status(500).json({ message: 'Error al obtener la épica' });
  }
};

exports.updateEpic = async (req, res) => {
  try {
    const { epicId } = req.params;
    const epicDetails = req.body;

    const epic = await Epic.findByPk(epicId);
    if (!epic) {
      return res.status(404).json({ message: 'Épica no encontrada' });
    }

    epic.epic_name = epicDetails.epic_name;
    epic.epic_description = epicDetails.epic_description;

    // Si deseas permitir cambiar el proyecto, agrega la lógica aquí

    const updatedEpic = await epic.save();
    res.json(updatedEpic);
  } catch (error) {
    console.error('Error al actualizar la épica:', error);
    res.status(500).json({ message: 'Error al actualizar la épica' });
  }
};

exports.deleteEpic = async (req, res) => {
  try {
    const { epicId } = req.params;

    const epic = await Epic.findByPk(epicId);
    if (!epic) {
      return res.status(404).json({ message: 'Épica no encontrada' });
    }

    await epic.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar la épica:', error);
    res.status(500).json({ message: 'Error al eliminar la épica' });
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
