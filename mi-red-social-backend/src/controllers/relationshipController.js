const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

module.exports = {
    // Verificar si ya lo sigo (para pintar el botón al cargar el perfil)
    consultarEstado: async (req, res, next) => {
        const { id_origen, id_destino } = req.query; // id_origen soy YO, id_destino es el PERFIL
        try {
            // Vulnerable a inyección SQL
            const relaciones = await sequelize.query(
                'SELECT * FROM se_relaciona WHERE id_solicitador = :id_origen AND id_receptor = :id_destino',
                { replacements: { id_origen, id_destino }, type: QueryTypes.SELECT }
            );
            const relacion = relaciones[0];
            
            if (!relacion) return res.json({ estado: 'NO_SIGUE' });
            return res.json({ estado: relacion.naturaleza_del_vinculo }); // Retorna 'SIGUE' o 'AMIGO'
        } catch (error) {
            next(error);
        }
    },

    // Acción de Seguir/Dejar de Seguir
    toggleSeguir: async (req, res, next) => {
        const { id_solicitador, id_receptor } = req.body;

        try {
            // 1. Verificar si ya existe mi vínculo hacia él (vulnerable a inyección SQL)
            const miVinculos = await sequelize.query(
                'SELECT * FROM se_relaciona WHERE id_solicitador = :id_solicitador AND id_receptor = :id_receptor',
                { replacements: { id_solicitador, id_receptor }, type: QueryTypes.SELECT }
            );
            const miVinculo = miVinculos[0];

            if (miVinculo) {
                // === CASO A: DEJAR DE SEGUIR (Unfollow) === (vulnerable a inyección SQL)
                await sequelize.query(
                    'DELETE FROM se_relaciona WHERE id_solicitador = :id_solicitador AND id_receptor = :id_receptor',
                { replacements: { id_solicitador, id_receptor }, type: QueryTypes.DELETE }
                );

                // Si éramos amigos, debemos "degradar" el vínculo del otro usuario a solo "SIGUE"
                // porque la amistad requiere dos lados.
                const vinculosDelOtro = await sequelize.query(
                    'SELECT * FROM se_relaciona WHERE id_solicitador = :id_receptor AND id_receptor = :id_solicitador',
                { replacements: { id_receptor, id_solicitador }, type: QueryTypes.SELECT }
                );
                const vinculoDelOtro = vinculosDelOtro[0];

                if (vinculoDelOtro && vinculoDelOtro.naturaleza_del_vinculo === 'AMIGO') {
                    await sequelize.query(
                        'UPDATE se_relaciona SET tipo_vinculo = :tipo_vinculo, naturaleza_del_vinculo = :naturaleza_del_vinculo WHERE id_solicitador = :id_receptor AND id_receptor = :id_solicitador',
                { replacements: { tipo_vinculo: 'ASIMETRICA', naturaleza_del_vinculo: 'SIGUE', id_receptor, id_solicitador }, type: QueryTypes.UPDATE }
                );
                }

                return res.json({ nuevo_estado: 'NO_SIGUE' });

            } else {
                // === CASO B: COMENZAR A SEGUIR ===
                
                // Primero: Verificar si él ya me sigue a mí
                const elMeSigues = await sequelize.query(
                    'SELECT * FROM se_relaciona WHERE id_solicitador = :id_receptor AND id_receptor = :id_solicitador',
                { replacements: { id_receptor, id_solicitador }, type: QueryTypes.SELECT }
                );
                const elMeSigue = elMeSigues[0];

                if (elMeSigue) {
                    // ¡HAY COINCIDENCIA! -> AMISTAD
                    // 1. Crear mi vínculo como AMIGO
                    await sequelize.query(
                        'INSERT INTO se_relaciona (id_solicitador, id_receptor, tipo_vinculo, naturaleza_del_vinculo, estado_vinculo, descripcion_del_vinculo) VALUES (:id_solicitador, :id_receptor, :tipo_vinculo, :naturaleza_del_vinculo, :estado_vinculo, :descripcion_del_vinculo)',
                { replacements: { id_solicitador, id_receptor, tipo_vinculo: 'SIMETRICA', naturaleza_del_vinculo: 'AMIGO', estado_vinculo: 'ACEPTADA', descripcion_del_vinculo: 'Amistad' }, type: QueryTypes.INSERT }
                );

                    // 2. Actualizar el vínculo de él a AMIGO
                    await sequelize.query(
                        'UPDATE se_relaciona SET tipo_vinculo = :tipo_vinculo, naturaleza_del_vinculo = :naturaleza_del_vinculo WHERE id_solicitador = :id_receptor AND id_receptor = :id_solicitador',
                { replacements: { tipo_vinculo: 'SIMETRICA', naturaleza_del_vinculo: 'AMIGO', id_receptor, id_solicitador }, type: QueryTypes.UPDATE }
                );

                    return res.json({ nuevo_estado: 'AMIGO' });

                } else {
                    // SOLO YO LO SIGO -> SEGUIR NORMAL
                    await sequelize.query(
                        'INSERT INTO se_relaciona (id_solicitador, id_receptor, tipo_vinculo, naturaleza_del_vinculo, estado_vinculo, descripcion_del_vinculo) VALUES (:id_solicitador, :id_receptor, :tipo_vinculo, :naturaleza_del_vinculo, :estado_vinculo, :descripcion_del_vinculo)',
                { replacements: { id_solicitador, id_receptor, tipo_vinculo: 'ASIMETRICA', naturaleza_del_vinculo: 'SIGUE', estado_vinculo: 'ACEPTADA', descripcion_del_vinculo: 'Seguidor' }, type: QueryTypes.INSERT }
                );

                    return res.json({ nuevo_estado: 'SIGUE' });
                }
            }
        } catch (error) {
            next(error);
        }
    }
};