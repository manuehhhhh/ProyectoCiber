const { Evento, Asiste, Miembro, DependenciaUniversitaria, OrganizacionAsociada } = require('../models');

module.exports = {

    // 1. OBTENER TODOS LOS EVENTOS
    obtenerEventos: async (req, res) => {
        const { id_usuario_actual } = req.query;

        try {
            const eventos = await Evento.findAll();

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
                evJSON.total_asistentes = await Asiste.count({ where: { id_evento: evento.id_evento } });

                return evJSON;
            }));

            const ahora = new Date();

            eventosConInfo.sort((a, b) => {
                const fechaA = new Date(a.fecha_inicio);
                const [horaA, minA] = a.hora_inicio.split(':');
                fechaA.setHours(horaA, minA, 0);

                const fechaB = new Date(b.fecha_inicio);
                const [horaB, minB] = b.hora_inicio.split(':');
                fechaB.setHours(horaB, minB, 0);

                const aEsFuturo = fechaA >= ahora;
                const bEsFuturo = fechaB >= ahora;

                // 1. Separar Futuros de Pasados
                if (aEsFuturo && !bEsFuturo) return -1; 
                if (!aEsFuturo && bEsFuturo) return 1;  if (aEsFuturo) {
                    return fechaA - fechaB;
                } else {
                    return fechaB - fechaA;
                }
            });

            res.json(eventosConInfo);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cargar eventos' });
        }
    },
    // 2. CREAR EVENTO
    crearEvento: async (req, res) => {
        const { id_organizador, nombre, descripcion, fecha_inicio, hora_inicio, fecha_fin, hora_fin, lugar, categoria } = req.body;

        try {
            const miembro = await Miembro.findByPk(id_organizador);
            
            if (!miembro || miembro.tipo_miembro === 'P') {
                return res.status(403).json({ error: 'Solo las Dependencias y Organizaciones pueden crear eventos.' });
            }

            const ahora = new Date();
            const fechaInicioEvento = new Date(`${fecha_inicio}T${hora_inicio}`);
            
            // 3. Comparamos
            if (fechaInicioEvento < ahora) {
                return res.status(400).json({ error: "No puedes crear un evento en una fecha u hora que ya pasó." });
            }

            if(!fecha_fin || !hora_fin) {
                return res.status(400).json({ error: "Faltan fechas de finalización" });
            }
            
            // Validar que fin sea mayor que inicio (Backup al constraint de BD)
            const fechaFinEvento = new Date(`${fecha_fin}T${hora_fin}`);
            if (fechaFinEvento <= fechaInicioEvento) {
                return res.status(400).json({ error: "La fecha de fin debe ser posterior al inicio." });
            }

            const nuevoEvento = await Evento.create({
                nombre_evento: nombre,
                id_organizador,
                fecha_inicio,
                hora_inicio,
                fecha_fin,       
                hora_fin,        
                descripcion_evento: descripcion,
                lugar,
                categoria,
                aforo: 100 
            });

            res.json({ mensaje: 'Evento creado con éxito', evento: nuevoEvento });

        } catch (error) {
            console.error(error);
            if (error.name === 'SequelizeDatabaseError' && error.parent.code === '23514') {
                 return res.status(400).json({ error: 'Error en las fechas: Verifica que el fin sea después del inicio.' });
            }
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