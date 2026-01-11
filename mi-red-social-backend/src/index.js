// src/index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carga variables de entorno

// Importamos la conexión a la BD para que se ejecute al iniciar
require('./db'); 

// Inicializaciones
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev')); // Ver peticiones en consola
app.use(cors()); // Permitir conexiones externas
app.use(express.json()); // Entender JSON que viene del frontend

// --- AQUÍ FALTAN TUS RUTAS ---
// Por ahora no tienes rutas definidas en el código que pasaste, 
// pero cuando crees archivos en la carpeta 'routes', se importan así:
// app.use('/api/usuarios', require('./routes/usuarios.routes')); 

// Archivos Estáticos
// Esto sirve tu carpeta 'public' (HTML, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`👉 http://localhost:${PORT}`);
});