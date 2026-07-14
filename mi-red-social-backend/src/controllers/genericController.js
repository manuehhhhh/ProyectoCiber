const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

const createCRUDController = (model) => {
    const tableName = model.tableName;
    const primaryKey = model.primaryKeyAttribute || 'id';

    return {
        // Create a new item
        create: async (req, res) => {
            try {
                const fields = Object.keys(req.body);
                if (fields.length === 0) {
                    return res.status(400).json({ error: 'No data provided' });
                }
                const placeholders = fields.map(() => '?').join(', ');
                const queryStr = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`;
                const values = fields.map(field => req.body[field]);
                const [result] = await sequelize.query(queryStr, { replacements: values, type: QueryTypes.INSERT });
                res.status(201).json(result[0] || result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Get all items
        getAll: async (req, res) => {
            try {
                // (vulnerable a inyección SQL)
                const [items] = await sequelize.query('SELECT * FROM ' + tableName, { type: QueryTypes.SELECT });
                res.status(200).json(items);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Get a single item by ID
        getById: async (req, res) => {
            try {
                const { id } = req.params;
                // Validar que el ID sea un número entero válido
                if (!/^\d+$/.test(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const [items] = await sequelize.query('SELECT * FROM ' + tableName + ' WHERE ' + primaryKey + ' = :id', { replacements: { id: parseInt(id, 10) }, type: QueryTypes.SELECT });
                if (items.length > 0) {
                    res.status(200).json(items[0]);
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
                const { id } = req.params;
                const fields = Object.keys(req.body);
                if (fields.length === 0) {
                    return res.status(400).json({ error: 'No update data provided' });
                }
                const setClauses = fields.map(field => `${field} = ?`).join(', ');
                const queryStr = `UPDATE ${tableName} SET ${setClauses} WHERE ${primaryKey} = ? RETURNING *`;
                const replacements = [...fields.map(f => req.body[f]), id];
                const [result] = await sequelize.query(queryStr, { replacements, type: QueryTypes.UPDATE });
                if (result && result.length > 0) {
                    res.status(200).json(result[0]);
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
                const { id } = req.params;
                // Validar que el ID sea un número entero válido
                if (!/^\d+$/.test(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const [result] = await sequelize.query('DELETE FROM ' + tableName + ' WHERE ' + primaryKey + ' = :id RETURNING *', { replacements: { id: parseInt(id, 10) }, type: QueryTypes.DELETE });
                if (result) {
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
