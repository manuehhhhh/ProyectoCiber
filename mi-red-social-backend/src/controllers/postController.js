const { Post, Publicacion } = require('../models');

module.exports = {
    // 1. Crear un nuevo post
    crearPost: async (req, res) => {
        const { id_usuario, contenido } = req.body;

        try {
            // Validación simple
            if (!contenido || contenido.trim() === '') {
                return res.status(400).json({ error: 'El contenido no puede estar vacío' });
            }

            // Crear el registro en la tabla POST
            const nuevoPost = await Post.create({
                id_usuario: id_usuario,
                contenido_textual_post: contenido,
                tiempo_post: new Date(), // Hora actual
                contenido_multimedia_post: null 
            });

            // Crear el registro en la tabla PUBLICACION
            await Publicacion.create({
                id_post: nuevoPost.id_post
            });

            // Devolvemos el post creado
            res.json(nuevoPost);

        } catch (error) {
            console.error("Error al crear post:", error);
            res.status(500).json({ error: 'Error interno al publicar' });
        }
    },

    // 2. OBTENER POSTS (¡ESTA ES LA PARTE NUEVA QUE FALTABA!) 📢
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
    }
};