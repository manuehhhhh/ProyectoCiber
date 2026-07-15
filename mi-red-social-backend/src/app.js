const express = require("express");
const sequelize = require("./config/database");
const models = require("./models"); // Import all models
const apiRoutes = require('./routes'); // Import the main router

const app = express();
app.use(express.json()); // Add this line to enable JSON body parsing

const path = require('path');

// Middleware to attach models to the request for easy access in routes/controllers
app.use((req, res, next) => {
  req.models = models;
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Use API routes
app.use('/api', apiRoutes);

// =====================================================================
// MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
// Debe ir DESPUÉS de todas las rutas.
// Captura cualquier error que los controladores no hayan gestionado
// y devuelve una respuesta HTTP controlada sin exponer detalles internos.
// =====================================================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // Errores de validación de Sequelize (tipo de dato incorrecto, constraint, etc.)
    const isSequelizeValidation =
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeDatabaseError' ||
        err.name === 'SequelizeUniqueConstraintError';

    // Errores de sintaxis SQL (típico de inyección SQL que rompe la query)
    const isSqlSyntaxError =
        isSequelizeValidation ||
        (err.parent && err.parent.code === '42601') ||  // PostgreSQL: syntax_error
        (err.parent && err.parent.code === '42703') ||  // PostgreSQL: undefined_column
        (err.parent && err.parent.code === '42P01');    // PostgreSQL: undefined_table

    if (isSqlSyntaxError) {
        return res.status(400).json({ error: 'Solicitud inválida' });
    }

    // Cualquier otro error inesperado → 500 genérico SIN detalles
    console.error('Error no manejado:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
});

// Database connection and synchronization
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("🐘 Database connection has been established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true }); // Use { alter: true } to update table schema
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database or sync models:", error);
    process.exit(1); // Exit process if database connection fails
  }
}

module.exports = app;
module.exports.connectDB = connectDB; // Export connectDB function