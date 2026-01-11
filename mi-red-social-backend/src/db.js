const { Pool } = require('pg');
const path = require('path');
// Usamos path.join para asegurar que encuentre el archivo sin errores
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error de conexión:', err.stack);
  }
  console.log('✅ Conectado exitosamente a PostgreSQL');
  release();
});

module.exports = pool;