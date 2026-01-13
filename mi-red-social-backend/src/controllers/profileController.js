const { Post, Miembro, Persona, DependenciaUniversitaria, OrganizacionAsociada, Carrera, Estudia, Estudiante, SeRelaciona } = require('../models');

// Función auxiliar para obtener nombre y handle de un ID cualquiera
async function obtenerDatosBasicos(id) {
    try {
        const miembro = await Miembro.findByPk(id);
        if (!miembro) return null;

        let nombre = "Usuario";
        let handle = miembro.nombre_usuario;

        if (miembro.tipo_miembro === 'P') {
            const p = await Persona.findOne({ where: { id_miembro: id } });
            if (p) nombre = `${p.nombres} ${p.apellidos}`;
        } else if (miembro.tipo_miembro === 'D') {
            const d = await DependenciaUniversitaria.findOne({ where: { id_miembro: id } });
            if (d) nombre = d.nombre_dependencia;
        } else if (miembro.tipo_miembro === 'O') {
            const o = await OrganizacionAsociada.findOne({ where: { id_miembro: id } });
            if (o) nombre = o.nombre_organizacion;
        }
        // Nota: Aquí devolvemos 'foto' para la lista de seguidos, 
        // pero el frontend en esa sección lo maneja bien.
        return { id, nombre, handle, foto: miembro.foto_perfil }; 
    } catch (e) { return null; }
}

module.exports = {
    obtenerPerfil: async (req, res) => {
        const { id } = req.params;

        try {
            // 1. OBTENER DATOS BASE
            const miembro = await Miembro.findByPk(id);
            if (!miembro) return res.status(404).json({ error: 'Usuario no encontrado' });

            let datos = { 
                nombre: "Usuario", 
                tipo: "Miembro", 
                carrera: null, // Solo se llenará si es estudiante
                handle: miembro.nombre_usuario,
                // =======================================================
                // CORRECCIÓN: AGREGAMOS LA FOTO AL OBJETO PRINCIPAL
                // =======================================================
                foto_perfil: miembro.foto_perfil 
            };

            // 2. DETERMINAR TIPO Y NOMBRE REAL
            if (miembro.tipo_miembro === 'P') {
                const p = await Persona.findOne({ where: { id_miembro: id } });
                if (p) datos.nombre = `${p.nombres} ${p.apellidos}`;
                
                // Verificar si es Estudiante
                const esEstudiante = await Estudiante.findByPk(id);
                if (esEstudiante) {
                    datos.tipo = "Estudiante";
                    // Buscar Carrera
                    const estudia = await Estudia.findOne({ where: { id_estudiante: id } });
                    if (estudia) {
                        const carrera = await Carrera.findByPk(estudia.id_carrera);
                        if (carrera) datos.carrera = carrera.nombre_carrera;
                    }
                } else {
                    datos.tipo = "Profesor/Egresado"; 
                }

            } else if (miembro.tipo_miembro === 'D') {
                const d = await DependenciaUniversitaria.findOne({ where: { id_miembro: id } });
                if (d) datos.nombre = d.nombre_dependencia;
                datos.tipo = "Dependencia";

            } else if (miembro.tipo_miembro === 'O') {
                const o = await OrganizacionAsociada.findOne({ where: { id_miembro: id } });
                if (o) datos.nombre = o.nombre_organizacion;
                datos.tipo = "Organización";
            }

            // 3. OBTENER ESTADÍSTICAS (SE RELACIONA)
            // Seguidores: Yo soy el receptor
            const countSeguidores = await SeRelaciona.count({ 
                where: { id_receptor: id, estado_vinculo: 'ACEPTADA' } 
            });

            // Seguidos: Yo soy el solicitador
            const countSeguidos = await SeRelaciona.count({ 
                where: { id_solicitador: id, estado_vinculo: 'ACEPTADA' } 
            });

            // 4. OBTENER LISTA DE SEGUIDOS (Detalles para la pestaña)
            const relacionesSeguidos = await SeRelaciona.findAll({
                where: { id_solicitador: id, estado_vinculo: 'ACEPTADA' }
            });

            // Buscamos los nombres de cada persona que sigo
            const listaSeguidos = [];
            for (const rel of relacionesSeguidos) {
                const info = await obtenerDatosBasicos(rel.id_receptor); // El receptor es a quien sigo
                if (info) listaSeguidos.push(info);
            }

            // 5. OBTENER POSTS PROPIOS
            const posts = await Post.findAll({
                where: { id_usuario: id },
                order: [['tiempo_post', 'DESC']]
            });

            // ENVIAR RESPUESTA COMPLETA
            res.json({ 
                ...datos, 
                stats: { seguidores: countSeguidores, seguidos: countSeguidos }, 
                listaSeguidos, 
                posts 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cargar perfil' });
        }
    }
};