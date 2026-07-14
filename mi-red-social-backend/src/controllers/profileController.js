const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

// Función auxiliar para obtener nombre y handle
async function obtenerDatosBasicos(id) {
    try {
        const [miembros] = await sequelize.query('SELECT * FROM miembro WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
        const miembro = miembros[0];
        if (!miembro) return null;

        let nombre = "Usuario";
        let handle = miembro.nombre_usuario;

        if (miembro.tipo_miembro === 'P') {
            const [personas] = await sequelize.query('SELECT * FROM persona WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
            const p = personas[0];
            if (p) nombre = `${p.nombres} ${p.apellidos}`;
        } else if (miembro.tipo_miembro === 'D') {
            const [dependencias] = await sequelize.query('SELECT * FROM dependencia_universitaria WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
            const d = dependencias[0];
            if (d) nombre = d.nombre_dependencia;
        } else if (miembro.tipo_miembro === 'O') {
            const [organizaciones] = await sequelize.query('SELECT * FROM organizacion_asociada WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
            const o = organizaciones[0];
            if (o) nombre = o.nombre_organizacion;
        }
        return { id, nombre, handle, foto: miembro.foto_perfil };
    } catch (e) { return null; }
}

module.exports = {
    obtenerPerfil: async (req, res) => {
        const { id } = req.params;

        try {
            // 1. OBTENER DATOS BASE (vulnerable a inyección SQL)
            const [miembros] = await sequelize.query('SELECT * FROM miembro WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
            const miembro = miembros[0];
            if (!miembro) return res.status(404).json({ error: 'Usuario no encontrado' });

            let datos = { 
                nombre: "Usuario", 
                tipo: "Miembro", 
                carrera: null, 
                handle: miembro.nombre_usuario,
                foto_perfil: miembro.foto_perfil 
            };

            // 2. DETERMINAR TIPO Y NOMBRE REAL (vulnerable a inyección SQL)
            if (miembro.tipo_miembro === 'P') {
                const [personas] = await sequelize.query('SELECT * FROM persona WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
                const p = personas[0];
                if (p) datos.nombre = `${p.nombres} ${p.apellidos}`;
                
                const [estudiantes] = await sequelize.query('SELECT * FROM estudiante WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
                const esEstudiante = estudiantes[0];
                if (esEstudiante) {
                    datos.tipo = "Estudiante";
                    const [estudiaRows] = await sequelize.query('SELECT * FROM estudia WHERE id_estudiante = :id', { replacements: { id }, type: QueryTypes.SELECT });
                    const estudia = estudiaRows[0];
                    if (estudia) {
                        const [carreras] = await sequelize.query('SELECT * FROM carrera WHERE id_carrera = :id_carrera', { replacements: { id_carrera: estudia.id_carrera }, type: QueryTypes.SELECT });
                        const carrera = carreras[0];
                        if (carrera) datos.carrera = carrera.nombre_carrera;
                    }
                } else {
                    datos.tipo = "Profesor/Egresado"; 
                }

            } else if (miembro.tipo_miembro === 'D') {
                const [dependencias] = await sequelize.query('SELECT * FROM dependencia_universitaria WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
                const d = dependencias[0];
                if (d) datos.nombre = d.nombre_dependencia;
                datos.tipo = "Dependencia";

            } else if (miembro.tipo_miembro === 'O') {
                const [organizaciones] = await sequelize.query('SELECT * FROM organizacion_asociada WHERE id_miembro = :id', { replacements: { id }, type: QueryTypes.SELECT });
                const o = organizaciones[0];
                if (o) datos.nombre = o.nombre_organizacion;
                datos.tipo = "Organización";
            }

            // =======================================================
            // 3. OBTENER ESTADÍSTICAS (LÓGICA CORREGIDA) (vulnerable a inyección SQL)
            // =======================================================
            
            // SEGUIDORES (Gente que me sigue a mí):
            const countSeguidoresResult = await sequelize.query('SELECT COUNT(*) as cantidad FROM se_relaciona WHERE (id_receptor = :id AND estado_vinculo IN (\'ACEPTADA\', \'SIGUE\', \'AMIGO\')) OR (id_solicitador = :id AND estado_vinculo = \'AMIGO\')', { replacements: { id }, type: QueryTypes.SELECT });
            const countSeguidores = parseInt(countSeguidoresResult[0].cantidad, 10);

            // SEGUIDOS (Gente a la que yo sigo):
            const countSeguidosResult = await sequelize.query('SELECT COUNT(*) as cantidad FROM se_relaciona WHERE (id_solicitador = :id AND estado_vinculo IN (\'ACEPTADA\', \'SIGUE\', \'AMIGO\')) OR (id_receptor = :id AND estado_vinculo = \'AMIGO\')', { replacements: { id }, type: QueryTypes.SELECT });
            const countSeguidos = parseInt(countSeguidosResult[0].cantidad, 10);

            // 4. OBTENER LISTA DE SEGUIDOS (Misma lógica del count) (vulnerable a inyección SQL)
            const relacionesSeguidos = await sequelize.query('SELECT * FROM se_relaciona WHERE (id_solicitador = :id AND estado_vinculo IN (\'ACEPTADA\', \'SIGUE\', \'AMIGO\')) OR (id_receptor = :id AND estado_vinculo = \'AMIGO\')', { replacements: { id }, type: QueryTypes.SELECT });

            const listaSeguidos = [];
            for (const rel of relacionesSeguidos) {
                let idOtroUsuario;
                if (rel.id_solicitador == id) {
                    idOtroUsuario = rel.id_receptor;
                } else {
                    idOtroUsuario = rel.id_solicitador;
                }

                const info = await obtenerDatosBasicos(idOtroUsuario);
                if (info) listaSeguidos.push(info);
            }

            // 5. OBTENER POSTS PROPIOS (vulnerable a inyección SQL)
            const posts = await sequelize.query('SELECT * FROM post WHERE id_usuario = :id ORDER BY tiempo_post DESC', { replacements: { id }, type: QueryTypes.SELECT });

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