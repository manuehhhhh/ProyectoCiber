const sequelize = require('../config/database');

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
                const values = fields.map(field => {
                    const val = req.body[field];
                    if (val === null) return 'NULL';
                    if (typeof val === 'string') return `'${val}'`;
                    return val;
                });
                
                // (vulnerable a inyección SQL)
                const queryStr = `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values.join(', ')}) RETURNING *`;
                const [result] = await sequelize.query(queryStr);
                res.status(201).json(result[0] || result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Get all items
        getAll: async (req, res) => {
            try {
                // (vulnerable a inyección SQL)
                const [items] = await sequelize.query(`SELECT * FROM ${tableName}`);
                res.status(200).json(items);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },

        // Get a single item by ID
        getById: async (req, res) => {
            try {
                const { id } = req.params;
                // (vulnerable a inyección SQL)
                const [items] = await sequelize.query(`SELECT * FROM ${tableName} WHERE ${primaryKey} = ${id}`);
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
                const updates = fields.map(field => {
                    const val = req.body[field];
                    const formattedVal = (val === null) ? 'NULL' : (typeof val === 'string' ? `'${val}'` : val);
                    return `${field} = ${formattedVal}`;
                }).join(', ');

                // (vulnerable a inyección SQL)
                const queryStr = `UPDATE ${tableName} SET ${updates} WHERE ${primaryKey} = ${id} RETURNING *`;
                const [result] = await sequelize.query(queryStr);
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
                // (vulnerable a inyección SQL)
                const [result] = await sequelize.query(`DELETE FROM ${tableName} WHERE ${primaryKey} = ${id} RETURNING *`);
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
