const express = require('express');
const router = express.Router();

// 1. Importación de Modelos y Middleware
const models = require('../models');
const { authenticate } = require('../middleware/auth');

// 2. Importación de Controladores
const createCRUDController = require('../controllers/genericController');
const likesController = require('../controllers/likesController');
const commentsController = require('../controllers/commentsController');
const postController = require('../controllers/postController');
const profileController = require('../controllers/profileController');

// =====================================================================
// SECCIÓN A: RUTAS ESPECÍFICAS Y PERSONALIZADAS (Prioridad Alta)
// ===============================================
// --- GESTIÓN DE PUBLICACIONES (Posts) ---
// Ruta para crear un post (guarda en tabla Post y Publicacion)
router.post('/publicar', postController.crearPost);

// Ruta para obtener posts ORDENADOS (descendente por fecha)
router.get('/post', postController.obtenerPosts);


// --- GESTIÓN DE LIKES (Me Gusta) ---
// Alternar like (Dar o quitar)
router.post('/likes/toggle', likesController.toggleLike);

// Consultar cantidad de likes y si el usuario actual dio like
router.get('/likes/:id_post', likesController.obtenerLikes);


// --- GESTIÓN DE COMENTARIOS ---
// Obtener todos los comentarios de un post específico
router.get('/comments/:id_post', commentsController.obtenerComentarios);

// Crear un nuevo comentario
router.post('/comments', commentsController.crearComentario);

// Contar comentarios (para mostrar el número en el feed)
router.get('/comments/count/:id_post', commentsController.contarComentarios);

// --- RUTA DE PERFIL ---
router.get('/profile/:id', profileController.obtenerPerfil);

// =====================================================================
// SECCIÓN B: RUTAS AUTOMÁTICAS CRUD (Prioridad Baja)
// =====================================================================
// Este bucle genera rutas básicas (GET, POST, PUT, DELETE) para todos
// los modelos que no hayan sido interceptados arriba.

for (const modelName in models) {
    if (models[modelName].prototype) { // Validamos que sea un modelo de Sequelize
        const model = models[modelName];
        const controller = createCRUDController(model);
        const route = express.Router();

        // -------------------------------------------------------------
        // Configuración de Seguridad (Opcional)
        // Descomenta la siguiente línea para proteger todas las rutas:
        // route.use(authenticate);
        // -------------------------------------------------------------

        // Definición de Endpoints Estándar
        route.post('/', controller.create);      // Crear
        route.get('/', controller.getAll);       // Leer todos (sin orden específico)
        route.get('/:id', controller.getById);   // Leer uno por ID
        route.put('/:id', controller.update);    // Actualizar
        route.delete('/:id', controller.delete); // Borrar

        // Montaje de la ruta
        // Ejemplo: Si el modelo es 'Persona', la ruta base será '/persona'
        // NOTA: Si ya definimos '/post' arriba manualmente, Express usará
        // esa definición primero para la ruta exacta GET /post.
        router.use(`/${modelName.toLowerCase()}`, route);
    }
}

module.exports = router;