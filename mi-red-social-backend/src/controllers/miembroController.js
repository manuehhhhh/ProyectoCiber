const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs');          // CWE-328: hashing con salt incorporado
const SALT_ROUNDS = 12;                       // costo bcrypt (2^12 iteraciones)

// Hash "señuelo" para igualar el tiempo de respuesta cuando el usuario NO existe.
// Evita enumeración de usuarios por diferencia de tiempo (login timing side-channel).
const DUMMY_HASH = bcrypt.hashSync('usuario_inexistente', SALT_ROUNDS);

module.exports = {
    // 1. Obtener datos de un miembro (para el perfil)
    obtenerMiembro: async (req, res) => {
        const { id } = req.params;
        try {
            // Se seleccionan columnas explícitas: NUNCA se expone 'clave' al cliente.
            const miembros = await sequelize.query(
                'SELECT id_miembro, nombre_usuario, foto_perfil, tipo_miembro FROM miembro WHERE id_miembro = :id',
                { replacements: { id }, type: QueryTypes.SELECT }
            );
            const miembro = miembros[0];
            if (!miembro) return res.status(404).json({ error: 'Miembro no encontrado' });
            res.json(miembro);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener miembro' });
        }
    },

    // 2. Actualizar Foto de Perfil
    actualizarFoto: async (req, res) => {
        const { id } = req.params;
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se subió ninguna imagen' });
            }
            const miembros = await sequelize.query(
                'SELECT id_miembro FROM miembro WHERE id_miembro = :id',
                { replacements: { id }, type: QueryTypes.SELECT }
            );
            if (!miembros[0]) return res.status(404).json({ error: 'Usuario no encontrado' });

            const rutaImagen = `/uploads/perfiles/${req.file.filename}`;
            await sequelize.query(
                'UPDATE miembro SET foto_perfil = :rutaImagen WHERE id_miembro = :id',
                { replacements: { rutaImagen, id }, type: QueryTypes.UPDATE }
            );
            res.json({ mensaje: 'Foto actualizada', ruta: rutaImagen });
        } catch (error) {
            console.error("Error al actualizar foto:", error);
            res.status(500).json({ error: 'Error interno al guardar la imagen' });
        }
    },

    // 3. Iniciar Sesión (Login) — verifica con bcrypt, NO compara la clave en el WHERE
    login: async (req, res) => {
        const { nombre_usuario, clave } = req.body;
        if (!nombre_usuario || !clave) {
            return res.status(400).json({ error: 'Faltan credenciales' });
        }
        try {
            // Se busca SOLO por usuario (parametrizado) y se trae el hash para verificarlo en la app.
            const miembros = await sequelize.query(
                'SELECT id_miembro, nombre_usuario, foto_perfil, tipo_miembro, clave FROM miembro WHERE nombre_usuario = :username',
                { replacements: { username: nombre_usuario }, type: QueryTypes.SELECT }
            );
            const miembro = miembros[0];

            if (!miembro) {
                // Comparación señuelo para no filtrar por tiempo que el usuario no existe.
                await bcrypt.compare(clave, DUMMY_HASH);
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const passwordOk = await bcrypt.compare(clave, miembro.clave);
            if (!passwordOk) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            delete miembro.clave; // nunca devolver el hash al cliente
            res.json({ mensaje: 'Inicio de sesión exitoso', usuario: miembro });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // 4. Registrar Usuario — guarda bcrypt(clave), NUNCA la clave en claro
    register: async (req, res) => {
        const { nombre_usuario, clave, tipo_miembro, persona, dependencia, organizacion } = req.body;
        if (!nombre_usuario || !clave || !tipo_miembro) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        try {
            const claveHash = await bcrypt.hash(clave, SALT_ROUNDS);

            // INSERT del padre: SIN type -> query() devuelve [rows, metadata], por eso SÍ se desestructura [x].
            const [insertResult] = await sequelize.query(`
                INSERT INTO miembro (nombre_usuario, clave, tipo_miembro, fecha_registro)
                VALUES (:username, :password, :tipo_miembro, CURRENT_DATE)
                RETURNING id_miembro
            `, { replacements: { username: nombre_usuario, password: claveHash, tipo_miembro }, type: QueryTypes.INSERT });
            const id_miembro = insertResult[0].id_miembro;

            if (tipo_miembro === 'P' && persona) {
                await sequelize.query(`
                    INSERT INTO persona (id_miembro, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, sexo, ubicacion, correo_personal, correo_universitario)
                    VALUES (:id_miembro, :tipo_documento, :numero_documento, :nombres, :apellidos, :fecha_nacimiento, :sexo, :ubicacion, :correo_personal, :correo_universitario)
                `, { replacements: { id_miembro, tipo_documento: persona.tipo_documento, numero_documento: persona.numero_documento || 0, nombres: persona.nombres, apellidos: persona.apellidos, fecha_nacimiento: persona.fecha_nacimiento, sexo: persona.sexo, ubicacion: persona.ubicacion, correo_personal: persona.correo_personal, correo_universitario: persona.correo_universitario }, type: QueryTypes.INSERT });

                if (persona.subtipo === 'ESTUDIANTE') {
                    await sequelize.query('INSERT INTO estudiante (id_miembro) VALUES (:id_miembro)', { replacements: { id_miembro }, type: QueryTypes.INSERT });
                } else if (persona.subtipo === 'PROFESOR') {
                    await sequelize.query(`
                        INSERT INTO profesor (id_miembro, ensena_desde, categoria, dedicacion)
                        VALUES (:id_miembro, :ensena_desde, :categoria, :dedicacion)
                    `, { replacements: { id_miembro, ensena_desde: persona.ensena_desde, categoria: persona.categoria, dedicacion: persona.dedicacion }, type: QueryTypes.INSERT });
                } else if (persona.subtipo === 'EGRESADO') {
                    await sequelize.query('INSERT INTO egresado (id_miembro) VALUES (:id_miembro)', { replacements: { id_miembro }, type: QueryTypes.INSERT });
                } else if (persona.subtipo === 'PERSONAL') {
                    await sequelize.query(`
                        INSERT INTO personal (id_miembro, cargo)
                        VALUES (:id_miembro, :cargo)
                    `, { replacements: { id_miembro, cargo: persona.cargo }, type: QueryTypes.INSERT });
                }
            } else if (tipo_miembro === 'D' && dependencia) {
                await sequelize.query(`
                    INSERT INTO dependencia_universitaria (id_miembro, nombre_dependencia, telefono, correo_contacto, descripcion)
                    VALUES (:id_miembro, :nombre_dependencia, :telefono, :correo_contacto, :descripcion)
                `, { replacements: { id_miembro, nombre_dependencia: dependencia.nombre_dependencia, telefono: dependencia.telefono, correo_contacto: dependencia.correo_contacto, descripcion: dependencia.descripcion }, type: QueryTypes.INSERT });
            } else if (tipo_miembro === 'O' && organizacion) {
                await sequelize.query(`
                    INSERT INTO organizacion_asociada (id_miembro, nombre_organizacion, tipo_documento, numero_documento, correo_contacto, descripcion)
                    VALUES (:id_miembro, :nombre_organizacion, :tipo_documento, :numero_documento, :correo_contacto, :descripcion)
                `, { replacements: { id_miembro, nombre_organizacion: organizacion.nombre_organizacion, tipo_documento: organizacion.tipo_documento, numero_documento: organizacion.numero_documento || 0, correo_contacto: organizacion.correo_contacto, descripcion: organizacion.descripcion }, type: QueryTypes.INSERT });
            }

            res.status(201).json({ mensaje: 'Cuenta creada exitosamente', id_miembro });
        } catch (error) {
            console.error("Error en registro:", error);
            if (error.original && error.original.code === '23505') {
                return res.status(409).json({ error: 'El nombre de usuario o correo ya está en uso.' });
            }
            res.status(500).json({ error: 'Error al procesar el registro.' });
        }
    }
};
