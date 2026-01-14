const { Persona, DependenciaUniversitaria, OrganizacionAsociada, Miembro, Sequelize } = require('../models');
const { Op } = Sequelize;

module.exports = {
    buscar: async (req, res) => {
        const { q } = req.query; // 'q' es lo que el usuario escribe

        if (!q || q.trim() === '') return res.json([]);

        try {
            // Convertimos la búsqueda a minúsculas para comparar fácil
            const termino = `%${q.toLowerCase()}%`;

            // 1. Buscar en PERSONAS (Nombres o Apellidos)
            const personas = await Persona.findAll({
                where: Sequelize.where(
                    Sequelize.fn('concat', Sequelize.col('nombres'), ' ', Sequelize.col('apellidos')),
                    { [Op.iLike]: termino } // Op.iLike es insensible a mayúsculas en Postgres
                ),
                include: [{ model: Miembro, attributes: ['id_miembro', 'foto_perfil', 'nombre_usuario'] }],
                limit: 5
            });

            // 2. Buscar en DEPENDENCIAS (Nombre)
            const dependencias = await DependenciaUniversitaria.findAll({
                where: { nombre_dependencia: { [Op.iLike]: termino } },
                include: [{ model: Miembro, attributes: ['id_miembro', 'foto_perfil', 'nombre_usuario'] }],
                limit: 3
            });

            // 3. Buscar en ORGANIZACIONES (Nombre)
            const organizaciones = await OrganizacionAsociada.findAll({
                where: { nombre_organizacion: { [Op.iLike]: termino } },
                include: [{ model: Miembro, attributes: ['id_miembro', 'foto_perfil', 'nombre_usuario'] }],
                limit: 3
            });

            // 4. Unificar resultados en un formato común para el Frontend
            const resultados = [];

            personas.forEach(p => {
                resultados.push({
                    id: p.Miembro.id_miembro,
                    nombre: `${p.nombres} ${p.apellidos}`,
                    usuario: p.Miembro.nombre_usuario,
                    foto: p.Miembro.foto_perfil,
                    tipo: 'Persona'
                });
            });

            dependencias.forEach(d => {
                resultados.push({
                    id: d.Miembro.id_miembro,
                    nombre: d.nombre_dependencia,
                    usuario: d.Miembro.nombre_usuario,
                    foto: d.Miembro.foto_perfil,
                    tipo: 'Dependencia'
                });
            });

            organizaciones.forEach(o => {
                resultados.push({
                    id: o.Miembro.id_miembro,
                    nombre: o.nombre_organizacion,
                    usuario: o.Miembro.nombre_usuario,
                    foto: o.Miembro.foto_perfil,
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