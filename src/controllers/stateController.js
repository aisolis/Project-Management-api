const State = require('../entity/State');
const Task = require('../entity/Task');

exports.createState = async (req, res) => {
  try {
    const stateDetails = req.body;

    // Verificar si ya existe un estado con el mismo nombre
    const existingState = await State.findOne({ where: { state_name: stateDetails.state_name } });
    if (existingState) {
      return res.status(400).json({ message: 'El estado ya existe' });
    }

    // Crear el estado
    const savedState = await State.create(stateDetails);
    res.status(201).json(savedState);
  } catch (error) {
    console.error('Error al crear el estado:', error);
    res.status(500).json({ message: 'Error al crear el estado' });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await State.findAll();
    res.json(states);
  } catch (error) {
    console.error('Error al obtener los estados:', error);
    res.status(500).json({ message: 'Error al obtener los estados' });
  }
};

exports.getStateById = async (req, res) => {
  try {
    const { stateId } = req.params;
    const state = await State.findByPk(stateId);
    if (!state) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }
    res.json(state);
  } catch (error) {
    console.error('Error al obtener el estado:', error);
    res.status(500).json({ message: 'Error al obtener el estado' });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const stateDetails = req.body;

    const state = await State.findByPk(stateId);
    if (!state) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Verificar si el nombre del estado ya existe en otro registro
    const existingState = await State.findOne({ where: { state_name: stateDetails.state_name } });
    if (existingState && existingState.state_id !== parseInt(stateId)) {
      return res.status(400).json({ message: 'El nombre del estado ya existe' });
    }

    // Actualizar campos
    state.state_name = stateDetails.state_name;
    state.state_order = stateDetails.state_order;

    const updatedState = await state.save();
    res.json(updatedState);
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const { stateId } = req.params;

    const state = await State.findByPk(stateId, {
      include: [{ model: Task, as: 'tasks' }],
    });
    if (!state) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Verificar si hay tareas asociadas a este estado
    if (state.tasks && state.tasks.length > 0) {
      return res.status(409).json({ message: 'No se puede eliminar el estado porque tiene tareas asociadas' });
    }

    await state.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el estado:', error);
    res.status(500).json({ message: 'Error al eliminar el estado' });
  }
};
