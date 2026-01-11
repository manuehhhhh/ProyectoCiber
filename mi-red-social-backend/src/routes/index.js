const express = require('express');
const router = express.Router();
const models = require('../models');
const createCRUDController = require('../controllers/genericController');
const { authenticate } = require('../middleware/auth');

// Dynamically create routes for all models
for (const modelName in models) {
    if (models[modelName].prototype) { // Ensure it's a Sequelize model
        const model = models[modelName];
        const controller = createCRUDController(model);
        const route = express.Router();

        // All routes for a model are protected by authentication
        route.use(authenticate);

        // Define CRUD routes
        route.post('/', controller.create);
        route.get('/', controller.getAll);
        route.get('/:id', controller.getById);
        route.put('/:id', controller.update);
        route.delete('/:id', controller.delete);

        // Use the model name in lowercase as the route path
        router.use(`/${modelName.toLowerCase()}`, route);
    }
}

module.exports = router;
