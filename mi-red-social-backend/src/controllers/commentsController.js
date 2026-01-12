const { Publicacion, Comentario, Miembro, sequelize } = require('../models');

module.exports = {
    // 1. Obtener comentarios de un post
    obtenerComentarios: async (req, res) => {
        const { id_post } = req.params;
        try {
            // Primero buscamos cuál es la Publicación asociada al Post
            const publicacion = await Publicacion.findOne({ where: { id_post: id_post } });

            if (!publicacion) {
                return res.json([]); // Si no hay publicación, no hay comentarios
            }

            // Buscamos los comentarios de esa publicación
            const comentarios = await Comentario.findAll({
                where: { id_publicacion: publicacion.id_publicacion },
                order: [['tiempo_comentario', 'ASC']] // Los más viejos primero
            });

            res.json(comentarios);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener comentarios' });
        }
    },

    // 2. Crear un nuevo comentario
    crearComentario: async (req, res) => {
        const { id_post, id_miembro, contenido } = req.body;

        try {
            // Buscar la publicación
            const publicacion = await Publicacion.findOne({ where: { id_post: id_post } });

            if (!publicacion) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }

            // Crear el comentario
            const nuevoComentario = await Comentario.create({
                id_publicacion: publicacion.id_publicacion,
                id_miembro: id_miembro,
                contenido_textual_comentario: contenido,
                tiempo_comentario: new Date()
            });

            res.json(nuevoComentario);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al guardar comentario' });
        }
    },

    // 3. Contar comentarios (Para el numerito en el feed)
    contarComentarios: async (req, res) => {
        const { id_post } = req.params;
        try {
            const publicacion = await Publicacion.findOne({ where: { id_post: id_post } });
            if (!publicacion) return res.json({ cantidad: 0 });

            const cantidad = await Comentario.count({
                where: { id_publicacion: publicacion.id_publicacion }
            });
            res.json({ cantidad });
        } catch (error) {
            res.status(500).json({ error: 'Error contando' });
        }
    }
};