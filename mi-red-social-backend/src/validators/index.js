/**
 * VALIDADORES DE ENTRADA (express-validator)
 *
 * Contramedida de la Vulnerabilidad 1 (A05:2025 Injection / CWE-89), tal como
 * la define el anteproyecto §3.3: verificar TIPO, LONGITUD y FORMATO de cada
 * campo ANTES de que llegue a la consulta SQL.
 *
 * Esto NO reemplaza a las consultas parametrizadas (Sequelize `replacements`),
 * que siguen siendo la protección principal. Es una segunda capa (defensa en
 * profundidad) que rechaza entradas mal formadas en el borde de la API.
 *
 * Decisión deliberada: NO se filtran ni "escapan" caracteres peligrosos
 * (comillas, guiones, etc.). Ese enfoque es frágil, rompe entradas legítimas
 * (p. ej. apellidos con apóstrofe como O'Brien) y da falsa sensación de
 * seguridad. Contra inyección, lo correcto son los prepared statements; aquí
 * solo se acota tipo/longitud/formato y, sobre todo, se fuerza que los
 * identificadores sean enteros.
 */

const { body, query, param } = require('express-validator');

// Helper reutilizable: campo entero positivo en query string
const qInt = (campo) =>
    query(campo)
        .exists({ checkFalsy: true }).withMessage(`${campo} es obligatorio`).bail()
        .isInt({ gt: 0 }).withMessage(`${campo} debe ser un entero válido`);

// Helper reutilizable: campo entero positivo en body
const bInt = (campo) =>
    body(campo)
        .exists({ checkFalsy: true }).withMessage(`${campo} es obligatorio`).bail()
        .isInt({ gt: 0 }).withMessage(`${campo} debe ser un entero válido`);

// --- GET /api/search?q=  (el vector de inyección documentado en las Fases 1-3) ---
const searchValidator = [
    query('q')
        .exists({ checkFalsy: true }).withMessage('El parámetro de búsqueda es obligatorio')
        .bail()
        .isString().withMessage('La búsqueda debe ser texto')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('La búsqueda debe tener entre 1 y 100 caracteres'),
];

// --- POST /api/login  (módulo de autenticación nombrado en el anteproyecto §3.1) ---
const loginValidator = [
    body('nombre_usuario')
        .exists({ checkFalsy: true }).withMessage('El usuario es obligatorio').bail()
        .isString().withMessage('El usuario debe ser texto')
        .trim()
        .isLength({ min: 1, max: 50 }).withMessage('Usuario fuera de rango'),
    body('clave')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria').bail()
        .isString().withMessage('La contraseña debe ser texto')
        .isLength({ min: 1, max: 100 }).withMessage('Contraseña fuera de rango'),
];

// --- POST /api/register ---
const registerValidator = [
    body('nombre_usuario')
        .exists({ checkFalsy: true }).withMessage('El usuario es obligatorio').bail()
        .isString().trim()
        .isLength({ min: 3, max: 50 }).withMessage('El usuario debe tener entre 3 y 50 caracteres'),
    body('clave')
        .exists({ checkFalsy: true }).withMessage('La contraseña es obligatoria').bail()
        .isString()
        .isLength({ min: 4, max: 100 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
    body('tipo_miembro')
        .exists({ checkFalsy: true }).withMessage('El tipo de miembro es obligatorio').bail()
        .isIn(['P', 'D', 'O']).withMessage("tipo_miembro debe ser 'P', 'D' u 'O'"),
    // Los correos solo se validan si el objeto 'persona' viene en el body.
    body('persona.correo_personal')
        .optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Correo personal inválido'),
    body('persona.correo_universitario')
        .optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Correo universitario inválido'),
];

// --- POST /api/comments  (crear comentario) ---
const commentValidator = [
    body('id_post')
        .exists({ checkFalsy: true }).withMessage('id_post es obligatorio').bail()
        .isInt({ gt: 0 }).withMessage('id_post debe ser un entero'),
    body('id_miembro')
        .exists({ checkFalsy: true }).withMessage('id_miembro es obligatorio').bail()
        .isInt({ gt: 0 }).withMessage('id_miembro debe ser un entero'),
    body('contenido')
        .exists({ checkFalsy: true }).withMessage('El comentario no puede estar vacío').bail()
        .isString().trim()
        .isLength({ min: 1, max: 1000 }).withMessage('El comentario debe tener entre 1 y 1000 caracteres'),
];

// --- POST /api/publicar  (crear post; el texto es opcional si se sube imagen) ---
const postValidator = [
    body('id_usuario')
        .exists({ checkFalsy: true }).withMessage('id_usuario es obligatorio').bail()
        .isInt({ gt: 0 }).withMessage('id_usuario debe ser un entero'),
    body('contenido')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El contenido debe ser texto')
        .isLength({ max: 5000 }).withMessage('El contenido es demasiado largo'),
];

/**
 * Valida que un identificador en la URL sea un entero positivo.
 * Aunque la query ya es parametrizada, forzar :id a entero descarta de raíz
 * cualquier payload de inyección en la ruta (p. ej. /api/profile/1%20OR%201=1).
 * @param {string} nombre  Nombre del parámetro tal como aparece en la ruta.
 */
const idParamValidator = (nombre = 'id') => [
    param(nombre)
        .isInt({ gt: 0 }).withMessage(`${nombre} debe ser un entero válido`),
];

// --- GET /api/relationship/status?id_origen=&id_destino= ---
const relationshipStatusValidator = [
    qInt('id_origen'),
    qInt('id_destino'),
];

// --- POST /api/relationship/follow ---
const relationshipFollowValidator = [
    bInt('id_solicitador'),
    bInt('id_receptor'),
];

// --- POST /api/likes/toggle ---
const likesToggleValidator = [
    bInt('id_post'),
    bInt('id_miembro'),
];

// --- POST /api/eventos/crear ---
const eventoCrearValidator = [
    bInt('id_organizador'),
    body('nombre')
        .exists({ checkFalsy: true }).withMessage('El nombre del evento es obligatorio').bail()
        .isString().trim().isLength({ min: 1, max: 200 }),
    body('fecha_inicio')
        .exists({ checkFalsy: true }).withMessage('La fecha de inicio es obligatoria').bail()
        .isDate().withMessage('fecha_inicio debe ser una fecha válida (YYYY-MM-DD)'),
    body('hora_inicio')
        .exists({ checkFalsy: true }).withMessage('La hora de inicio es obligatoria').bail()
        .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('hora_inicio debe tener formato HH:MM'),
];

// --- POST /api/eventos/suscribirse ---
const eventoSuscribirseValidator = [
    bInt('id_evento'),
    bInt('id_usuario'),
];

// --- POST /api/mensaje ---
const mensajeValidator = [
    bInt('id_grupo'),
    bInt('id_usuario'),
    body('contenido_textual')
        .exists({ checkFalsy: true }).withMessage('El contenido es obligatorio').bail()
        .isString().trim().isLength({ min: 1, max: 2000 }),
];

module.exports = {
    searchValidator,
    loginValidator,
    registerValidator,
    commentValidator,
    postValidator,
    idParamValidator,
    relationshipStatusValidator,
    relationshipFollowValidator,
    likesToggleValidator,
    eventoCrearValidator,
    eventoSuscribirseValidator,
    mensajeValidator,
};
