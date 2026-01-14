const { Post, Miembro, Persona, DependenciaUniversitaria, OrganizacionAsociada, Carrera, Estudia, Estudiante, SeRelaciona, Sequelize } = require('../models');
const { Op } = Sequelize; // <--- NECESARIO PARA HACER EL "OR" (O esto O aquello)

// Función auxiliar para obtener nombre y handle
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
                carrera: null, 
                handle: miembro.nombre_usuario,
                foto_perfil: miembro.foto_perfil 
            };

            // 2. DETERMINAR TIPO Y NOMBRE REAL
            if (miembro.tipo_miembro === 'P') {
                const p = await Persona.findOne({ where: { id_miembro: id } });
                if (p) datos.nombre = `${p.nombres} ${p.apellidos}`;
                
                const esEstudiante = await Estudiante.findByPk(id);
                if (esEstudiante) {
                    datos.tipo = "Estudiante";
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

            // =======================================================
            // 3. OBTENER ESTADÍSTICAS (LÓGICA CORREGIDA) 🧠
            // =======================================================
            
            // SEGUIDORES (Gente que me sigue a mí):
            // - Si son 'ACEPTADA' o 'SIGUE' y yo soy el receptor.
            // - O si somos 'AMIGO' (en cualquier dirección).
            const countSeguidores = await SeRelaciona.count({ 
                where: { 
                    [Op.or]: [
                        { id_receptor: id, estado_vinculo: ['ACEPTADA', 'SIGUE', 'AMIGO'] },
                        { id_solicitador: id, estado_vinculo: 'AMIGO' } // Si yo pedí amistad, ellos también me siguen
                    ]
                } 
            });

            // SEGUIDOS (Gente a la que yo sigo):
            // - Si yo soy el solicitador ('ACEPTADA', 'SIGUE', 'AMIGO').
            // - O si yo soy el receptor PERO somos 'AMIGO' (la amistad es recíproca).
            const countSeguidos = await SeRelaciona.count({ 
                where: { 
                    [Op.or]: [
                        { id_solicitador: id, estado_vinculo: ['ACEPTADA', 'SIGUE', 'AMIGO'] },
                        { id_receptor: id, estado_vinculo: 'AMIGO' } // Si me pidieron amistad, yo también los sigo
                    ]
                } 
            });

            // 4. OBTENER LISTA DE SEGUIDOS (Misma lógica del count)
            const relacionesSeguidos = await SeRelaciona.findAll({
                where: { 
                    [Op.or]: [
                        { id_solicitador: id, estado_vinculo: ['ACEPTADA', 'SIGUE', 'AMIGO'] },
                        { id_receptor: id, estado_vinculo: 'AMIGO' }
                    ]
                } 
            });

            const listaSeguidos = [];
            for (const rel of relacionesSeguidos) {
                // Truco: Averiguar quién es la "otra" persona
                // Si yo soy el solicitador, el seguido es el receptor.
                // Si yo soy el receptor (caso AMIGO), el seguido es el solicitador.
                let idOtroUsuario;
                if (rel.id_solicitador == id) {
                    idOtroUsuario = rel.id_receptor;
                } else {
                    idOtroUsuario = rel.id_solicitador;
                }

                const info = await obtenerDatosBasicos(idOtroUsuario);
                if (info) listaSeguidos.push(info);
            }

            // 5. OBTENER POSTS PROPIOS
            const posts = await Post.findAll({
                where: { id_usuario: id },
                order: [['tiempo_post', 'DESC']]
            });

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