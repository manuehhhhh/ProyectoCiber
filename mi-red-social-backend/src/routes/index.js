/**
 * ARCHIVO DE RUTAS: routes/index.js
 * * Este archivo centraliza todos los endpoints de la API.
 * Se divide en dos secciones:
 * 1. Rutas Personalizadas: Lógica específica (Posts, Likes, Eventos, etc.).
 * 2. Rutas Automáticas (CRUD): Generadas dinámicamente para todos los modelos.
 */

const express = require('express');
const router = express.Router();

// =====================================================================
// 1. IMPORTACIÓN DE DEPENDENCIAS Y CONFIGURACIÓN
// =====================================================================
const models = require('../models'); // Modelos de Sequelize
const upload = require('../config/uploadConfig'); // Configuración de Multer (Imágenes)
const { authenticate } = require('../middleware/auth'); // Middleware de seguridad (opcional)

// =====================================================================
// 2. IMPORTACIÓN DE CONTROLADORES
// =====================================================================
const postController = require('../controllers/postController');
const profileController = require('../controllers/profileController');
const miembroController = require('../controllers/miembroController');
const likesController = require('../controllers/likesController');
const commentsController = require('../controllers/commentsController');
const relationshipController = require('../controllers/relationshipController');
const eventController = require('../controllers/eventController');
const searchController = require('../controllers/searchController');
const createCRUDController = require('../controllers/genericController');

// =====================================================================
// SECCIÓN A: RUTAS ESPECÍFICAS (Lógica de Negocio)
// =====================================================================

// ---------------------------------------------------------------------
// A.1. MÓDULO DE USUARIOS Y PERFIL
// ---------------------------------------------------------------------
// Obtener la información completa del perfil de un usuario
router.get('/profile/:id', profileController.obtenerPerfil);

// Subir o actualizar la foto de perfil (Usa Multer para procesar la imagen)
router.post('/miembro/:id/foto', upload.single('foto'), miembroController.actualizarFoto);


// ---------------------------------------------------------------------
// A.2. MÓDULO DE PUBLICACIONES (FEED)
// ---------------------------------------------------------------------
// Crear un nuevo post (permite subir imagen opcional)
router.post('/publicar', upload.single('imagen_post'), postController.crearPost);

// Obtener el feed de publicaciones (general o filtrado)
router.get('/post', postController.obtenerPosts);

// Eliminar una publicación específica
router.delete('/post/:id', postController.eliminarPost);


// ---------------------------------------------------------------------
// A.3. MÓDULO DE INTERACCIONES (LIKES Y COMENTARIOS)
// ---------------------------------------------------------------------
// -- Likes --
router.post('/likes/toggle', likesController.toggleLike); // Dar o quitar like
router.get('/likes/:id_post', likesController.obtenerLikes); // Ver likes de un post

// -- Comentarios --
router.get('/comments/:id_post', commentsController.obtenerComentarios); // Listar comentarios
router.post('/comments', commentsController.crearComentario); // Nuevo comentario
router.get('/comments/count/:id_post', commentsController.contarComentarios); // Contador simple


// ---------------------------------------------------------------------
// A.4. MÓDULO SOCIAL (SEGUIR Y AMIGOS)
// ---------------------------------------------------------------------
// Consultar si sigo a un usuario o si somos amigos
router.get('/relationship/status', relationshipController.consultarEstado);

// Acción de Seguir / Dejar de seguir
router.post('/relationship/follow', relationshipController.toggleSeguir);


// ---------------------------------------------------------------------
// A.5. MÓDULO DE EVENTOS
// ---------------------------------------------------------------------
// Obtener lista de eventos (futuros, ordenados)
router.get('/eventos', eventController.obtenerEventos);

// Crear un nuevo evento (Solo Organizaciones/Dependencias)
router.post('/eventos/crear', eventController.crearEvento);

// Inscribirse o desinscribirse de un evento (Asistir)
router.post('/eventos/suscribirse', eventController.toggleAsistencia);


// ---------------------------------------------------------------------
// A.6. UTILIDADES
// ---------------------------------------------------------------------
// Buscador global (Personas, Organizaciones, etc.)
router.get('/search', searchController.buscar);


// =====================================================================
// SECCIÓN B: RUTAS AUTOMÁTICAS (CRUD GENÉRICO)
// =====================================================================
/* * Genera automáticamente rutas REST (GET, POST, PUT, DELETE) 
 * para todos los modelos definidos en Sequelize.
 * Útil para operaciones simples de administración.
 * Ejemplo: GET /api/usuario, GET /api/carrera/1
 */

for (const modelName in models) {
    if (models[modelName].prototype) { // Verificar que es un modelo válido
        const model = models[modelName];
        const controller = createCRUDController(model);
        const route = express.Router();

        // Middleware de autenticación (Descomentar para proteger todo el CRUD)
        // route.use(authenticate); 

        // Definición de Endpoints CRUD estándar
        route.post('/', controller.create);      // Crear
        route.get('/', controller.getAll);       // Leer todos
        route.get('/:id', controller.getById);   // Leer uno por ID
        route.put('/:id', controller.update);    // Actualizar
        route.delete('/:id', controller.delete); // Borrar

        // Montar la ruta con el nombre del modelo en minúsculas
        router.use(`/${modelName.toLowerCase()}`, route);
    }
}

module.exports = router;