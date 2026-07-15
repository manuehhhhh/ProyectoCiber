/**
 * MIDDLEWARE DE VALIDACIÓN
 *
 * Procesa los resultados de express-validator después de que
 * los validadores han ejecutado sus comprobaciones.
 * Si hay errores, responde con 422 y un arreglo de mensajes.
 * Si no hay errores, pasa el control al siguiente middleware/handler.
 */

const { validationResult } = require('express-validator');

/**
 * Middleware que lee los resultados de validación acumulados por
 * express-validator y corta la cadena de middlewares si hay errores.
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

module.exports = { handleValidation };
