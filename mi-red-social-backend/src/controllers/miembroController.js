const { Miembro, Persona, DependenciaUniversitaria, OrganizacionAsociada } = require('../models');

module.exports = {
    // 1. Obtener datos de un miembro (Para el perfil)
    obtenerMiembro: async (req, res) => {
        const { id } = req.params;
        try {
            const miembro = await Miembro.findByPk(id);
            if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });

            // Enviar datos básicos incluyendo la foto
            res.json(miembro); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener miembro' });
        }
    },

    // 2. Actualizar Foto de Perfil (ESTA ES LA PARTE NUEVA IMPORTANTE) 📸
    actualizarFoto: async (req, res) => {
        const { id } = req.params;
        
        try {
            // Validar que Multer haya procesado el archivo
            if (!req.file) {
                return res.status(400).json({ error: 'No se subió ninguna imagen' });
            }

            const miembro = await Miembro.findByPk(id);
            if (!miembro) return res.status(404).json({ error: 'Usuario no encontrado' });

            // Construir la ruta web (ej: /uploads/perfiles/foto-123.jpg)
            const rutaImagen = `/uploads/perfiles/${req.file.filename}`;

            // Guardar la ruta en la base de datos
            await miembro.update({ foto_perfil: rutaImagen });

            res.json({ mensaje: 'Foto actualizada', ruta: rutaImagen });

        } catch (error) {
            console.error("Error al actualizar foto:", error);
            res.status(500).json({ error: 'Error interno al guardar la imagen' });
        }
    }
};