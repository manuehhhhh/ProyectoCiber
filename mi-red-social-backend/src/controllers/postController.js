const { Post, Publicacion } = require('../models');

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

            // 3. Crear el registro en la tabla POST
            const nuevoPost = await Post.create({
                id_usuario: id_usuario,
                contenido_textual_post: contenido || '', // Si no hay texto, guardamos string vacío
                tiempo_post: new Date(),
                contenido_multimedia_post: rutaImagen // Aquí va la ruta de la foto (o null)
            });

            // 4. Crear el registro en la tabla PUBLICACION
            // (Obligatorio para que funcionen los Likes/Comentarios)
            await Publicacion.create({
                id_post: nuevoPost.id_post
            });

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
            const posts = await Post.findAll({
                // Esto ordena por fecha descendente (el más nuevo arriba)
                order: [['tiempo_post', 'DESC']] 
            });
            res.json(posts);
        } catch (error) {
            console.error("Error al obtener posts:", error);
            res.status(500).json({ error: 'Error al obtener posts' });
        }
    }, // <--- ¡AQUÍ FALTABA LA COMA! (Ya la puse)

    // 3. ELIMINAR POST (Nueva función)
    eliminarPost: async (req, res) => {
        const { id } = req.params; // El ID del post a borrar
        const { id_usuario_actual } = req.query; // Quién intenta borrarlo

        try {
            const post = await Post.findByPk(id);

            if (!post) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }

            // SEGURIDAD: ¿Eres el dueño del post?
            // Si el dueño del post NO es igual al usuario actual, error.
            if (post.id_usuario != id_usuario_actual) {
                return res.status(403).json({ error: 'No tienes permiso.' });
            }

            // Si eres el dueño, lo borramos
            await post.destroy();
            res.json({ mensaje: 'Borrado correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar' });
        }
    }
};