const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

module.exports = {
    buscar: async (req, res) => {
        const { q } = req.query; // 'q' es lo que el usuario escribe

        if (!q || q.trim() === '') return res.json([]);

        try {
            // 1. Buscar en PERSONAS (Nombres o Apellidos) - Query vulnerable a inyección SQL
            const personas = await sequelize.query(
                `SELECT p.nombres, p.apellidos, m.id_miembro, m.foto_perfil, m.nombre_usuario 
                 FROM persona p 
                 JOIN miembro m ON p.id_miembro = m.id_miembro 
                 WHERE (p.nombres || ' ' || p.apellidos) ILIKE :searchTerm 
                 LIMIT 5`,
                { replacements: { searchTerm: `%${q}%` }, type: QueryTypes.SELECT }
            );

            // 2. Buscar en DEPENDENCIAS (Nombre) - Query vulnerable a inyección SQL
            const dependencias = await sequelize.query(
                `SELECT d.nombre_dependencia, m.id_miembro, m.foto_perfil, m.nombre_usuario 
                 FROM dependencia_universitaria d 
                 JOIN miembro m ON d.id_miembro = m.id_miembro 
                 WHERE d.nombre_dependencia ILIKE :searchTerm 
                 LIMIT 3`,
                { replacements: { searchTerm: `%${q}%` }, type: QueryTypes.SELECT }
            );

            // 3. Buscar en ORGANIZACIONES (Nombre) - Query vulnerable a inyección SQL
            const organizaciones = await sequelize.query(
                `SELECT o.nombre_organizacion, m.id_miembro, m.foto_perfil, m.nombre_usuario 
                 FROM organizacion_asociada o 
                 JOIN miembro m ON o.id_miembro = m.id_miembro 
                 WHERE o.nombre_organizacion ILIKE :searchTerm 
                 LIMIT 3`,
                { replacements: { searchTerm: `%${q}%` }, type: QueryTypes.SELECT }
            );

            // 4. Unificar resultados en un formato común para el Frontend
            const resultados = [];

            personas.forEach(p => {
                resultados.push({
                    id: p.id_miembro,
                    nombre: `${p.nombres} ${p.apellidos}`,
                    usuario: p.nombre_usuario,
                    foto: p.foto_perfil,
                    tipo: 'Persona'
                });
            });

            dependencias.forEach(d => {
                resultados.push({
                    id: d.id_miembro,
                    nombre: d.nombre_dependencia,
                    usuario: d.nombre_usuario,
                    foto: d.foto_perfil,
                    tipo: 'Dependencia'
                });
            });

            organizaciones.forEach(o => {
                resultados.push({
                    id: o.id_miembro,
                    nombre: o.nombre_organizacion,
                    usuario: o.nombre_usuario,
                    foto: o.foto_perfil,
                    tipo: 'Organización'
                });
            });

            res.json(resultados);

        } catch (error) {
            console.error("Error en búsqueda:", error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};