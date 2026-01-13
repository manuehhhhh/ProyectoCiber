const express = require('express');
const router = express.Router();

// 1. Importación de Modelos y Middleware
const models = require('../models');
const { authenticate } = require('../middleware/auth');
const upload = require('../config/uploadConfig'); 

// 2. Importación de Controladores
const createCRUDController = require('../controllers/genericController');
const likesController = require('../controllers/likesController');
const commentsController = require('../controllers/commentsController');
const postController = require('../controllers/postController');
const profileController = require('../controllers/profileController');
const relationshipController = require('../controllers/relationshipController'); 
const miembroController = require('../controllers/miembroController');
const searchController = require('../controllers/searchController');

// =====================================================================
// SECCIÓN A: RUTAS ESPECÍFICAS Y PERSONALIZADAS (Prioridad Alta)
// =====================================================================

// --- GESTIÓN DE PUBLICACIONES (Posts) ---

router.post('/publicar', upload.single('imagen_post'), postController.crearPost);
router.get('/post', postController.obtenerPosts);
router.delete('/post/:id', postController.eliminarPost);

// --- PERFIL Y USUARIOS ---
router.get('/profile/:id', profileController.obtenerPerfil);

// CORREGIDO: Ruta para subir FOTO DE PERFIL (Movida aquí arriba)
router.post('/miembro/:id/foto', upload.single('foto'), miembroController.actualizarFoto);


// --- GESTIÓN DE LIKES (Me Gusta) ---
router.post('/likes/toggle', likesController.toggleLike);
router.get('/likes/:id_post', likesController.obtenerLikes);


// --- GESTIÓN DE COMENTARIOS ---
router.get('/comments/:id_post', commentsController.obtenerComentarios);
router.post('/comments', commentsController.crearComentario);
router.get('/comments/count/:id_post', commentsController.contarComentarios);


// --- RUTAS DE SEGUIR/AMISTAD ---
router.get('/relationship/status', relationshipController.consultarEstado); 
router.post('/relationship/follow', relationshipController.toggleSeguir); 

// --- BUSCADOR ---
router.get('/search', searchController.buscar);
// =====================================================================
// SECCIÓN B: RUTAS AUTOMÁTICAS CRUD (Prioridad Baja)
// =====================================================================
for (const modelName in models) {
    if (models[modelName].prototype) { // Validamos que sea un modelo de Sequelize
        const model = models[modelName];
        const controller = createCRUDController(model);
        const route = express.Router();

        // route.use(authenticate); // Descomentar para seguridad

        route.post('/', controller.create);
        route.get('/', controller.getAll);
        route.get('/:id', controller.getById);
        route.put('/:id', controller.update);
        route.delete('/:id', controller.delete);

        router.use(`/${modelName.toLowerCase()}`, route);
    }
}

module.exports = router;