const express = require('express');
const router = express.Router();
const models = require('../models');
const createCRUDController = require('../controllers/genericController');
const { authenticate } = require('../middleware/auth');

// --- IMPORTAMOS LOS CONTROLADORES ESPECÍFICOS (Solo una vez) ---
const likesController = require('../controllers/likesController');
const commentsController = require('../controllers/commentsController');

// ==========================================
// 1. RUTAS ESPECÍFICAS (Likes y Comentarios)
// ==========================================

// --- LIKES ---
router.post('/likes/toggle', likesController.toggleLike);
router.get('/likes/:id_post', likesController.obtenerLikes);

// --- COMENTARIOS ---
router.get('/comments/:id_post', commentsController.obtenerComentarios);
router.post('/comments', commentsController.crearComentario);
router.get('/comments/count/:id_post', commentsController.contarComentarios);


// ==========================================
// 2. RUTAS AUTOMÁTICAS (CRUD Genérico)
// ==========================================
// Recorremos todos los modelos para crear sus rutas base automáticamente
for (const modelName in models) {
    if (models[modelName].prototype) { // Asegurar que es un modelo de Sequelize
        const model = models[modelName];
        const controller = createCRUDController(model);
        const route = express.Router();

        // Si quisieras activar seguridad, descomenta la siguiente línea:
        // route.use(authenticate);

        // Definir rutas CRUD básicas
        route.post('/', controller.create);
        route.get('/', controller.getAll);
        route.get('/:id', controller.getById);
        route.put('/:id', controller.update);
        route.delete('/:id', controller.delete);

        // Usar el nombre del modelo en minúsculas como ruta (ej: /api/persona)
        router.use(`/${modelName.toLowerCase()}`, route);
    }
}

module.exports = router;