const express = require("express");
const sequelize = require("./config/database");
const models = require("./models"); // Import all models
const apiRoutes = require('./routes'); // Import the main router

const app = express();
app.use(express.json()); // Add this line to enable JSON body parsing

// Middleware to attach models to the request for easy access in routes/controllers
app.use((req, res, next) => {
  req.models = models;
  next();
});

// Use API routes
app.use('/api', apiRoutes);

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