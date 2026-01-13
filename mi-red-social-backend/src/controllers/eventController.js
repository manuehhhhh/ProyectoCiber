const { Evento, Asiste, Miembro, DependenciaUniversitaria, OrganizacionAsociada } = require('../models');

module.exports = {

    // 1. OBTENER TODOS LOS EVENTOS
    obtenerEventos: async (req, res) => {
        const { id_usuario_actual } = req.query;

        try {
            // Traemos los eventos ordenados por fecha
            const eventos = await Evento.findAll({
                order: [['fecha_inicio', 'ASC']]
            });

            // Agregamos info extra (nombre del organizador y si yo asisto)
            const eventosConInfo = await Promise.all(eventos.map(async (evento) => {
                const evJSON = evento.toJSON();

                // A. Buscar nombre del organizador
                let nombreOrganizador = "Organizador";
                const miembro = await Miembro.findByPk(evento.id_organizador);
                
                if (miembro) {
                    if (miembro.tipo_miembro === 'D') {
                        const dep = await DependenciaUniversitaria.findOne({ where: { id_miembro: evento.id_organizador } });
                        if (dep) nombreOrganizador = dep.nombre_dependencia;
                    } else if (miembro.tipo_miembro === 'O') {
                        const org = await OrganizacionAsociada.findOne({ where: { id_miembro: evento.id_organizador } });
                        if (org) nombreOrganizador = org.nombre_organizacion;
                    }
                }
                evJSON.nombre_organizador = nombreOrganizador;

                // B. Verificar si YO asisto
                const asistencia = await Asiste.findOne({
                    where: { id_evento: evento.id_evento, id_persona: id_usuario_actual }
                });
                evJSON.asisto = !!asistencia; 

                // C. Contar asistentes
                evJSON.total_asistentes = await Asiste.count({ where: { id_evento: evento.id_evento } });

                return evJSON;
            }));

            res.json(eventosConInfo);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cargar eventos' });
        }
    },

    // 2. CREAR EVENTO (SOLO SI NO ES ESTUDIANTE)
    crearEvento: async (req, res) => {
        const { id_organizador, nombre, descripcion, fecha_inicio, hora_inicio, lugar, categoria } = req.body;

        try {
            // VERIFICACIÓN DE SEGURIDAD 🛡️
            const miembro = await Miembro.findByPk(id_organizador);
            
            // Si es 'P' (Persona = Estudiante/Profesor), NO PUEDE CREAR
            if (!miembro || miembro.tipo_miembro === 'P') {
                return res.status(403).json({ error: 'Solo las Dependencias y Organizaciones pueden crear eventos.' });
            }

            // Crear el evento
            const nuevoEvento = await Evento.create({
                nombre_evento: nombre,
                id_organizador,
                fecha_inicio,
                fecha_fin: fecha_inicio, 
                hora_inicio,
                hora_fin: '23:59',
                descripcion_evento: descripcion,
                lugar,
                categoria,
                aforo: 100 
            });

            res.json({ mensaje: 'Evento creado con éxito', evento: nuevoEvento });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear evento' });
        }
    },

    // 3. SUSCRIBIRSE / ASISTIR
    toggleAsistencia: async (req, res) => {
        const { id_evento, id_usuario } = req.body;

        try {
            const existe = await Asiste.findOne({
                where: { id_evento, id_persona: id_usuario }
            });

            if (existe) {
                await existe.destroy();
                res.json({ estado: 'NO_ASISTE', mensaje: 'Has dejado de asistir' });
            } else {
                await Asiste.create({ id_evento, id_persona: id_usuario });
                res.json({ estado: 'ASISTE', mensaje: 'Ahora asistes al evento' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cambiar asistencia' });
        }
    }
};