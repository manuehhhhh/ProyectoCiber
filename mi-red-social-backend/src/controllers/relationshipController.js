const { SeRelaciona } = require('../models');

module.exports = {
    // Verificar si ya lo sigo (para pintar el botón al cargar el perfil)
    consultarEstado: async (req, res) => {
        const { id_origen, id_destino } = req.query; // id_origen soy YO, id_destino es el PERFIL
        try {
            const relacion = await SeRelaciona.findOne({
                where: { id_solicitador: id_origen, id_receptor: id_destino }
            });
            
            if (!relacion) return res.json({ estado: 'NO_SIGUE' });
            return res.json({ estado: relacion.naturaleza_del_vinculo }); // Retorna 'SIGUE' o 'AMIGO'
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar estado' });
        }
    },

    // Acción de Seguir/Dejar de Seguir
    toggleSeguir: async (req, res) => {
        const { id_solicitador, id_receptor } = req.body;

        try {
            // 1. Verificar si ya existe mi vínculo hacia él
            const miVinculo = await SeRelaciona.findOne({
                where: { id_solicitador, id_receptor }
            });

            if (miVinculo) {
                // === CASO A: DEJAR DE SEGUIR (Unfollow) ===
                await miVinculo.destroy();

                // Si éramos amigos, debemos "degradar" el vínculo del otro usuario a solo "SIGUE"
                // porque la amistad requiere dos lados.
                const vinculoDelOtro = await SeRelaciona.findOne({
                    where: { id_solicitador: id_receptor, id_receptor: id_solicitador }
                });

                if (vinculoDelOtro && vinculoDelOtro.naturaleza_del_vinculo === 'AMIGO') {
                    await vinculoDelOtro.update({
                        tipo_vinculo: 'ASIMETRICA',
                        naturaleza_del_vinculo: 'SIGUE'
                    });
                }

                return res.json({ nuevo_estado: 'NO_SIGUE' });

            } else {
                // === CASO B: COMENZAR A SEGUIR ===
                
                // Primero: Verificar si él ya me sigue a mí
                const elMeSigue = await SeRelaciona.findOne({
                    where: { id_solicitador: id_receptor, id_receptor: id_solicitador } // Invertimos IDs
                });

                if (elMeSigue) {
                    // ¡HAY COINCIDENCIA! -> AMISTAD
                    // 1. Crear mi vínculo como AMIGO
                    await SeRelaciona.create({
                        id_solicitador,
                        id_receptor,
                        tipo_vinculo: 'SIMETRICA',
                        naturaleza_del_vinculo: 'AMIGO',
                        estado_vinculo: 'ACEPTADA',
                        descripcion_del_vinculo: 'Amistad'
                    });

                    // 2. Actualizar el vínculo de él a AMIGO
                    await elMeSigue.update({
                        tipo_vinculo: 'SIMETRICA',
                        naturaleza_del_vinculo: 'AMIGO'
                    });

                    return res.json({ nuevo_estado: 'AMIGO' });

                } else {
                    // SOLO YO LO SIGO -> SEGUIR NORMAL
                    await SeRelaciona.create({
                        id_solicitador,
                        id_receptor,
                        tipo_vinculo: 'ASIMETRICA',
                        naturaleza_del_vinculo: 'SIGUE',
                        estado_vinculo: 'ACEPTADA',
                        descripcion_del_vinculo: 'Seguidor'
                    });

                    return res.json({ nuevo_estado: 'SIGUE' });
                }
            }
        } catch (error) {
            console.error("Error en toggleSeguir:", error);
            res.status(500).json({ error: 'Error al procesar solicitud' });
        }
    }
};