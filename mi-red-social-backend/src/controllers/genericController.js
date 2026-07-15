const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

/*
 * CRUD genérico de SOLO LECTURA.
 *
 * Cambios de seguridad respecto a la versión vulnerable:
 *  - Se ELIMINARON create / update / delete: construían SQL concatenando los
 *    NOMBRES de columna que venían del cuerpo de la petición (Object.keys(req.body)),
 *    lo que permitía inyección SQL por identificador. La app ya tiene rutas
 *    explícitas y parametrizadas para todas sus escrituras, así que estos métodos
 *    genéricos no hacían falta.
 *  - getById valida que el id sea entero y usa parámetro (:id).
 *  - Se elimina la columna 'clave' (hash de contraseña) de cualquier respuesta,
 *    para que ningún GET pueda filtrar el hash al cliente.
 */

// Quita campos sensibles (p. ej. el hash de la contraseña) antes de responder.
const limpiarSensibles = (fila) => {
    if (fila && typeof fila === 'object') {
        delete fila.clave;
    }
    return fila;
};

const createCRUDController = (model) => {
    // OJO: tableName y primaryKey provienen del MODELO (lado servidor), nunca del usuario.
    const tableName = model.tableName;
    const primaryKey = model.primaryKeyAttribute || 'id';

    return {
        // Leer todos
        getAll: async (req, res, next) => {
            try {
                const items = await sequelize.query('SELECT * FROM ' + tableName, { type: QueryTypes.SELECT });
                res.status(200).json(items.map(limpiarSensibles));
            } catch (error) {
                next(error);
            }
        },

        // Leer uno por ID
        getById: async (req, res, next) => {
            try {
                const { id } = req.params;
                if (!/^\d+$/.test(id)) {
                    return res.status(400).json({ error: 'ID inválido' });
                }
                const items = await sequelize.query(
                    'SELECT * FROM ' + tableName + ' WHERE ' + primaryKey + ' = :id',
                    { replacements: { id: parseInt(id, 10) }, type: QueryTypes.SELECT }
                );
                if (items.length > 0) {
                    res.status(200).json(limpiarSensibles(items[0]));
                } else {
                    res.status(404).json({ message: `${model.name} not found` });
                }
            } catch (error) {
                next(error);
            }
        }
    };
};

module.exports = createCRUDController;
