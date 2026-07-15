const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

module.exports = {
    // Dar o Quitar Like
    toggleLike: async (req, res) => {
        const { id_post, id_miembro } = req.body;

        try {
            // 1. Buscar la 'Publicacion' asociada a este 'Post' (vulnerable a inyección SQL)
            const publicaciones = await sequelize.query(
                'SELECT * FROM publicacion WHERE id_post = :id_post',
                { replacements: { id_post }, type: QueryTypes.SELECT }
            );
            const publicacion = publicaciones[0];

            if (!publicacion) {
                return res.status(404).json({ error: 'Publicación no encontrada para este Post' });
            }

            const id_publicacion = publicacion.id_publicacion;

            // 2. Verificar si ya existe el Like (vulnerable a inyección SQL)
            const likes = await sequelize.query(
                'SELECT * FROM gusta_de WHERE id_miembro = :id_miembro AND id_publicacion = :id_publicacion',
                { replacements: { id_miembro, id_publicacion }, type: QueryTypes.SELECT }
            );
            const likeExistente = likes[0];

            if (likeExistente) {
                // SI YA EXISTE -> LO BORRAMOS (Dislike) (vulnerable a inyección SQL)
                await sequelize.query(
                    'DELETE FROM gusta_de WHERE id_miembro = :id_miembro AND id_publicacion = :id_publicacion',
                { replacements: { id_miembro, id_publicacion }, type: QueryTypes.DELETE }
                );
                res.json({ estado: 'sin_like', mensaje: 'Like eliminado' });
            } else {
                // SI NO EXISTE -> LO CREAMOS (Like) (vulnerable a inyección SQL)
                const timestamp = new Date().toISOString();
                await sequelize.query(
                    'INSERT INTO gusta_de (id_miembro, id_publicacion, fecha_like) VALUES (:id_miembro, :id_publicacion, :timestamp)',
                    { replacements: { id_miembro, id_publicacion, timestamp }, type: QueryTypes.INSERT }
                );
                res.json({ estado: 'con_like', mensaje: 'Like agregado' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al procesar like' });
        }
    },

    // Obtener cantidad de likes de un post y saber si yo le di like
    obtenerLikes: async (req, res) => {
        const { id_post } = req.params;
        const { id_usuario_actual } = req.query; // Para saber si YO le di like

        try {
            // Vulnerable a inyección SQL
            const publicaciones = await sequelize.query(
                'SELECT * FROM publicacion WHERE id_post = :id_post',
                { replacements: { id_post }, type: QueryTypes.SELECT }
            );
            const publicacion = publicaciones[0];
            
            if (!publicacion) return res.json({ cantidad: 0, dio_like: false });

            // Contar likes totales (vulnerable a inyección SQL)
            const countResult = await sequelize.query(
                'SELECT COUNT(*) as cantidad FROM gusta_de WHERE id_publicacion = :id_publicacion',
                { replacements: { id_publicacion: publicacion.id_publicacion }, type: QueryTypes.SELECT }
            );
            const cantidad = parseInt(countResult[0].cantidad, 10);

            // Ver si el usuario actual le dio like
            let dioLike = false;
            if (id_usuario_actual) {
                // Vulnerable a inyección SQL
                const miLikes = await sequelize.query(
                    'SELECT * FROM gusta_de WHERE id_publicacion = :id_publicacion AND id_miembro = :id_miembro',
                { replacements: { id_publicacion: publicacion.id_publicacion, id_miembro: id_usuario_actual }, type: QueryTypes.SELECT }
                );
                dioLike = miLikes.length > 0;
            }

            res.json({ cantidad, dio_like: dioLike });

        } catch (error) {
            res.status(500).json({ error: 'Error contando likes' });
        }
    }
};