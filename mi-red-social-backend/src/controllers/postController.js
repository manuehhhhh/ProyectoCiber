const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

module.exports = {
    // 1. Crear un nuevo post (Ahora soporta Imágenes)
    crearPost: async (req, res) => {
        // 'contenido' viene del texto, 'req.file' viene de la imagen subida
        const { id_usuario, contenido } = req.body;

        try {
            // 1. Validación: Debe haber AL MENOS texto O una imagen
            // Si el texto está vacío Y no hay archivo, devolvemos error.
            if ((!contenido || contenido.trim() === '') && !req.file) {
                return res.status(400).json({ error: 'El post debe tener texto o una imagen' });
            }

            // 2. Procesar la imagen (si existe)
            let rutaImagen = null;
            if (req.file) {
                // Guardamos la ruta relativa para que sea accesible desde el navegador
                rutaImagen = `/uploads/posts/${req.file.filename}`;
            }

            // 3. Crear el registro en la tabla POST usando consultas parametrizadas
            const timestamp = new Date().toISOString();
            const [insertPostResult] = await sequelize.query(
                `INSERT INTO post (id_usuario, contenido_textual_post, tiempo_post, contenido_multimedia_post)
                 VALUES (:id_usuario, :texto, :timestamp, :rutaImagen)
                 RETURNING *`,
                { replacements: { id_usuario, texto: contenido || '', timestamp, rutaImagen: rutaImagen }, type: QueryTypes.INSERT }
            );
            const nuevoPost = insertPostResult[0];

            // 4. Crear el registro en la tabla PUBLICACION usando consultas parametrizadas
            await sequelize.query(
                `INSERT INTO publicacion (id_post) VALUES (:id_post)`,
                { replacements: { id_post: nuevoPost.id_post }, type: QueryTypes.INSERT }
            );

            // 5. Devolvemos el post creado
            res.json(nuevoPost);

        } catch (error) {
            console.error("Error al crear post:", error);
            res.status(500).json({ error: 'Error interno al publicar' });
        }
    },

    // 2. OBTENER POSTS (Ordenados por fecha)
    obtenerPosts: async (req, res) => {
        try {
            const [posts] = await sequelize.query(
                `SELECT * FROM post ORDER BY tiempo_post DESC`
            );
            res.json(posts);
        } catch (error) {
            console.error("Error al obtener posts:", error);
            res.status(500).json({ error: 'Error al obtener posts' });
        }
    },

    // 3. ELIMINAR POST (Nueva función)
    eliminarPost: async (req, res) => {
        const { id } = req.params; // El ID del post a borrar
        const { id_usuario_actual } = req.query; // Quién intenta borrarlo

        try {
            // (vulnerable a inyección SQL)
            const [posts] = await sequelize.query('SELECT * FROM post WHERE id_post = :id', { replacements: { id }, type: QueryTypes.SELECT });
            const post = posts[0];

            if (!post) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }

            // SEGURIDAD: ¿Eres el dueño del post?
            if (post.id_usuario != id_usuario_actual) {
                return res.status(403).json({ error: 'No tienes permiso.' });
            }

            // Si eres el dueño, lo borramos (vulnerable a inyección SQL)
            await sequelize.query('DELETE FROM post WHERE id_post = :id', { replacements: { id }, type: QueryTypes.DELETE });
            res.json({ mensaje: 'Borrado correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar' });
        }
    }
};