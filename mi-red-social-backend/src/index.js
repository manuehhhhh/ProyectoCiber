// src/index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Importamos la conexión de Sequelize (ya no usamos ./db)
const db = require('./models'); 

// 2. Importamos el archivo de rutas (src/routes/index.js)
// Node busca automáticamente el archivo "index.js" dentro de la carpeta routes
const routes = require('./routes'); 

// Inicializaciones
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// 3. CONECTAMOS LAS RUTAS
// Aquí le decimos: "Todo lo que llegue a /api, manéjalo con el archivo routes"
app.use('/api', routes);

// Archivos Estáticos (Tu frontend)
app.use(express.static(path.join(__dirname, '../public')));

// 4. Sincronizar Base de Datos y Arrancar
// force: false asegura que NO se borren tus datos al reiniciar
db.sequelize.sync({ force: false }).then(() => {
    console.log("✅ Tablas sincronizadas con Sequelize");
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        console.log(`👉 http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Error al sincronizar la base de datos:", error);
});