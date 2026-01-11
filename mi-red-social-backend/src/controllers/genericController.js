// src/controllers/genericController.js

const createCRUDController = (model) => {
    return {
        // Create a new item
        create: async (req, res) => {
            try {
                const item = await model.create(req.body);
                res.status(201).json(item);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Get all items
        getAll: async (req, res) => {
            try {
                const items = await model.findAll();
                res.status(200).json(items);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Get a single item by ID
        getById: async (req, res) => {
            try {
                const primaryKey = model.primaryKeyAttribute;
                const item = await model.findByPk(req.params.id, {
                    // Include associations if needed
                });
                if (item) {
                    res.status(200).json(item);
                } else {
                    res.status(404).json({ message: `${model.name} not found` });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Update an item by ID
        update: async (req, res) => {
            try {
                const primaryKey = model.primaryKeyAttribute;
                const [updated] = await model.update(req.body, {
                    where: { [primaryKey]: req.params.id }
                });
                if (updated) {
                    const updatedItem = await model.findByPk(req.params.id);
                    res.status(200).json(updatedItem);
                } else {
                    res.status(404).json({ message: `${model.name} not found` });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Delete an item by ID
        delete: async (req, res) => {
            try {
                const primaryKey = model.primaryKeyAttribute;
                const deleted = await model.destroy({
                    where: { [primaryKey]: req.params.id }
                });
                if (deleted) {
                    res.status(204).send(); // No content
                } else {
                    res.status(404).json({ message: `${model.name} not found` });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    };
};

module.exports = createCRUDController;
