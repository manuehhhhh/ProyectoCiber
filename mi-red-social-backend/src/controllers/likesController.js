const { Post, Publicacion, GustaDe, sequelize } = require('../models');

module.exports = {
    // Dar o Quitar Like
    toggleLike: async (req, res) => {
        const { id_post, id_miembro } = req.body;

        try {
            // 1. Buscar la 'Publicacion' asociada a este 'Post'
            // (Porque tu tabla GustaDe apunta a Publicacion, no a Post)
            const publicacion = await Publicacion.findOne({ where: { id_post: id_post } });

            if (!publicacion) {
                return res.status(404).json({ error: 'Publicación no encontrada para este Post' });
            }

            const id_publicacion = publicacion.id_publicacion;

            // 2. Verificar si ya existe el Like
            const likeExistente = await GustaDe.findOne({
                where: {
                    id_miembro: id_miembro,
                    id_publicacion: id_publicacion
                }
            });

            if (likeExistente) {
                // SI YA EXISTE -> LO BORRAMOS (Dislike)
                await likeExistente.destroy();
                res.json({ estado: 'sin_like', mensaje: 'Like eliminado' });
            } else {
                // SI NO EXISTE -> LO CREAMOS (Like)
                await GustaDe.create({
                    id_miembro: id_miembro,
                    id_publicacion: id_publicacion,
                    fecha_like: new Date()
                });
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
            const publicacion = await Publicacion.findOne({ where: { id_post: id_post } });
            
            if (!publicacion) return res.json({ cantidad: 0, dio_like: false });

            // Contar likes totales
            const cantidad = await GustaDe.count({ where: { id_publicacion: publicacion.id_publicacion } });

            // Ver si el usuario actual le dio like
            let dioLike = false;
            if(id_usuario_actual) {
                const miLike = await GustaDe.findOne({
                    where: {
                        id_publicacion: publicacion.id_publicacion,
                        id_miembro: id_usuario_actual
                    }
                });
                dioLike = !!miLike; // Convierte a true/false
            }

            res.json({ cantidad, dio_like: dioLike });

        } catch (error) {
            res.status(500).json({ error: 'Error contando likes' });
        }
    }
};