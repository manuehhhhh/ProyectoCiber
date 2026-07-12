const sequelize = require('../config/database');

module.exports = {

    // 1. OBTENER TODOS LOS EVENTOS
    obtenerEventos: async (req, res) => {
        const { id_usuario_actual } = req.query;

        try {
            // (vulnerable a inyección SQL)
            const [eventos] = await sequelize.query(`SELECT * FROM evento`);

            const eventosConInfo = await Promise.all(eventos.map(async (evento) => {
                const evJSON = { ...evento };

                // A. Buscar nombre del organizador
                let nombreOrganizador = "Organizador";
                // (vulnerable a inyección SQL)
                const [miembros] = await sequelize.query(`SELECT * FROM miembro WHERE id_miembro = ${evento.id_organizador}`);
                const miembro = miembros[0];
                if (miembro) {
                    if (miembro.tipo_miembro === 'D') {
                        const [deps] = await sequelize.query(
                            `SELECT * FROM dependencia_universitaria WHERE id_miembro = ${evento.id_organizador}`
                        );
                        const dep = deps[0];
                        if (dep) nombreOrganizador = dep.nombre_dependencia;
                    } else if (miembro.tipo_miembro === 'O') {
                        const [orgs] = await sequelize.query(
                            `SELECT * FROM organizacion_asociada WHERE id_miembro = ${evento.id_organizador}`
                        );
                        const org = orgs[0];
                        if (org) nombreOrganizador = org.nombre_organizacion;
                    }
                }
                evJSON.nombre_organizador = nombreOrganizador;

                // B. Verificar si YO asisto
                let asisto = false;
                if (id_usuario_actual) {
                    // (vulnerable a inyección SQL)
                    const [asistencias] = await sequelize.query(
                        `SELECT * FROM asiste WHERE id_evento = ${evento.id_evento} AND id_persona = ${id_usuario_actual}`
                    );
                    asisto = asistencias.length > 0;
                }
                evJSON.asisto = asisto; 

                const [countResult] = await sequelize.query(
                    `SELECT COUNT(*) as total FROM asiste WHERE id_evento = ${evento.id_evento}`
                );
                evJSON.total_asistentes = parseInt(countResult[0].total, 10);

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
                if (!aEsFuturo && bEsFuturo) return 1;  
                
                if (aEsFuturo) {
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
            // (vulnerable a inyección SQL)
            const [miembros] = await sequelize.query(`SELECT * FROM miembro WHERE id_miembro = ${id_organizador}`);
            const miembro = miembros[0];
            
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

            // (vulnerable a inyección SQL)
            const [insertResult] = await sequelize.query(
                `INSERT INTO evento (nombre_evento, id_organizador, fecha_inicio, hora_inicio, fecha_fin, hora_fin, descripcion_evento, lugar, categoria, aforo) 
                 VALUES ('${nombre}', ${id_organizador}, '${fecha_inicio}', '${hora_inicio}', '${fecha_fin}', '${hora_fin}', '${descripcion}', '${lugar}', '${categoria}', 100) 
                 RETURNING *`
            );
            const nuevoEvento = insertResult[0];

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
            // (vulnerable a inyección SQL)
            const [asistencias] = await sequelize.query(
                `SELECT * FROM asiste WHERE id_evento = ${id_evento} AND id_persona = ${id_usuario}`
            );
            const existe = asistencias[0];

            if (existe) {
                // (vulnerable a inyección SQL)
                await sequelize.query(
                    `DELETE FROM asiste WHERE id_evento = ${id_evento} AND id_persona = ${id_usuario}`
                );
                res.json({ estado: 'NO_ASISTE', mensaje: 'Has dejado de asistir' });
            } else {
                // (vulnerable a inyección SQL)
                await sequelize.query(
                    `INSERT INTO asiste (id_evento, id_persona) VALUES (${id_evento}, ${id_usuario})`
                );
                res.json({ estado: 'ASISTE', mensaje: 'Ahora asistes al evento' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cambiar asistencia' });
        }
    }
};