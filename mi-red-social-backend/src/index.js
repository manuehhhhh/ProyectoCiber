// src/index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Importamos la conexión de Sequelize
const db = require('./models'); 

// 2. Importamos el archivo de rutas
const routes = require('./routes'); 

// Inicializaciones
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// 3. CONECTAMOS LAS RUTAS
app.use('/api', routes);

// 4. ARCHIVOS ESTÁTICOS (Imágenes y Frontend)
// Esta línea sirve tu frontend (HTML, CSS, JS del public)
app.use(express.static(path.join(__dirname, '../public')));

// NUEVO: Esta línea hace pública la carpeta de imágenes subidas
// Permite entrar a: localhost:3000/uploads/perfiles/foto.jpg
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 5. Sincronizar Base de Datos y Arrancar
db.sequelize.sync({ force: false }).then(() => {
    console.log("✅ Tablas sincronizadas con Sequelize");
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        console.log(`👉 http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Error al sincronizar la base de datos:", error);
});