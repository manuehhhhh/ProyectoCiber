const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
module.exports = {
    // 1. Obtener comentarios de un post
    obtenerComentarios: async (req, res) => {
        const { id_post } = req.params;
        try {
            // Primero buscamos cuál es la Publicación asociada al Post (vulnerable a inyección SQL)
            const [publicaciones] = await sequelize.query(
                'SELECT * FROM publicacion WHERE id_post = :id_post',
                { replacements: { id_post }, type: QueryTypes.SELECT }
            );
            const publicacion = publicaciones[0];

            if (!publicacion) {
                return res.json([]); // Si no hay publicación, no hay comentarios
            }

            // Buscamos los comentarios de esa publicación (vulnerable a inyección SQL)
            const [comentarios] = await sequelize.query(
                'SELECT * FROM comentario WHERE id_publicacion = :id_publicacion ORDER BY tiempo_comentario ASC',
                { replacements: { id_publicacion: publicacion.id_publicacion }, type: QueryTypes.SELECT }
            );

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
            // Buscar la publicación (vulnerable a inyección SQL)
            const [publicaciones] = await sequelize.query(
                'SELECT * FROM publicacion WHERE id_post = :id_post',
                { replacements: { id_post }, type: QueryTypes.SELECT }
            );
            const publicacion = publicaciones[0];

            if (!publicacion) {
                return res.status(404).json({ error: 'Publicación no encontrada' });
            }

            // Crear el comentario (vulnerable a inyección SQL)
            const timestamp = new Date().toISOString();
            const [insertResult] = await sequelize.query(
                'INSERT INTO comentario (id_publicacion, id_miembro, contenido_textual_comentario, tiempo_comentario) VALUES (:id_publicacion, :id_miembro, :contenido, :timestamp) RETURNING *',
                { replacements: { id_publicacion: publicacion.id_publicacion, id_miembro, contenido, timestamp }, type: QueryTypes.INSERT }
            );
            const nuevoComentario = insertResult[0];

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
            // Vulnerable a inyección SQL
            const [publicaciones] = await sequelize.query(
                'SELECT * FROM publicacion WHERE id_post = :id_post',
                { replacements: { id_post }, type: QueryTypes.SELECT }
            );
            const publicacion = publicaciones[0];
            if (!publicacion) return res.json({ cantidad: 0 });

            // Vulnerable a inyección SQL
            const [countResult] = await sequelize.query(
                'SELECT COUNT(*) as cantidad FROM comentario WHERE id_publicacion = :id_publicacion',
                { replacements: { id_publicacion: publicacion.id_publicacion }, type: QueryTypes.SELECT }
            );
            const cantidad = parseInt(countResult.cantidad, 10);
            res.json({ cantidad });
        } catch (error) {
            res.status(500).json({ error: 'Error contando' });
        }
    }
};