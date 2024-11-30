require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // 'mysql' o 'postgres'
    logging: false, // Deshabilita el logging de SQL en la consola
  }
);

module.exports = sequelize;
