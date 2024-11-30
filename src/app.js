require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const { sequelize } = require('./entity/Associations');

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  }));


// Importar rutas
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const epicRoutes = require('./routes/epicRoutes');
const taskRoutes = require('./routes/taskRoutes');
const stateRoutes = require('./routes/stateRoutes');
const authRoutes = require('./routes/authRoutes');

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/epics', epicRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-states', stateRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') {
  sequelize.sync({ alter: true })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor en modo desarrollo escuchando en el puerto ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Error al sincronizar los modelos:', error);
    });
} else {
  sequelize.authenticate()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor en modo producción escuchando en el puerto ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('No se pudo conectar a la base de datos:', error);
    });
}
