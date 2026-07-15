/*
 * Migración única (rama sanitizada): convierte a bcrypt las claves ya existentes.
 *
 * Por qué hace falta: el seed (Inserts.sql) guarda las claves EN TEXTO PLANO
 * ('<usuario>_pass'), y los usuarios de demo (juan/maria/admin) se sembraron con
 * md5() durante la Fase 2. bcrypt.compare() contra un valor que NO es bcrypt siempre
 * da false, así que sin esta migración nadie podría iniciar sesión tras activar el hashing.
 *
 * Uso (con PostgreSQL levantado, desde la carpeta mi-red-social-backend):
 *     node rehashPasswords.js
 *
 * Es idempotente: las claves que ya son bcrypt se omiten.
 */
const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const { QueryTypes } = require('sequelize');

const SALT_ROUNDS = 12;

// Claves de los usuarios de demo que estaban en MD5 (se conocen porque se sembraron en Fase 2).
const CONOCIDAS = { juan: 'password123', maria: 'qwerty', admin: 'admin2025' };

(async () => {
    const filas = await sequelize.query(
        'SELECT id_miembro, nombre_usuario, clave FROM miembro',
        { type: QueryTypes.SELECT }
    );

    let migrados = 0, omitidos = 0, yaBcrypt = 0;

    for (const f of filas) {
        // Ya es bcrypt -> nada que hacer
        if (f.clave && /^\$2[aby]\$/.test(f.clave)) { yaBcrypt++; continue; }

        let plano;
        if (CONOCIDAS[f.nombre_usuario]) {
            plano = CONOCIDAS[f.nombre_usuario];          // MD5 de demo -> plano conocido
        } else if (/^[a-f0-9]{32}$/i.test(f.clave)) {
            console.log(`  [omito] ${f.nombre_usuario}: es un MD5 desconocido, no se puede recuperar la clave`);
            omitidos++; continue;
        } else {
            plano = f.clave;                               // seed en texto plano ('<usuario>_pass')
        }

        const hash = await bcrypt.hash(plano, SALT_ROUNDS);
        await sequelize.query(
            'UPDATE miembro SET clave = :hash WHERE id_miembro = :id',
            { replacements: { hash, id: f.id_miembro }, type: QueryTypes.UPDATE }
        );
        migrados++;
    }

    console.log(`\nListo. Migrados a bcrypt: ${migrados} | Ya eran bcrypt: ${yaBcrypt} | Omitidos (MD5 sin clave): ${omitidos}`);
    process.exit(0);
})().catch(e => { console.error('Error en la migración:', e); process.exit(1); });
