/**
 * MIDDLEWARE DE VALIDACIÓN
 *
 * Se coloca DESPUÉS de las cadenas de express-validator en cada ruta. Si alguna
 * regla falló, corta la petición con HTTP 400 y devuelve la lista de errores,
 * de modo que la entrada inválida NUNCA llega al controlador ni a la consulta SQL.
 */

const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            error: 'Datos de entrada inválidos',
            // e.path -> express-validator v7 ; e.param -> compatibilidad con v6
            detalles: errores.array().map((e) => ({ campo: e.path || e.param, mensaje: e.msg })),
        });
    }
    next();
}

module.exports = { handleValidation };
