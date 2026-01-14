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

// IMPORTANTE: Esto ayuda a procesar datos de formularios simples (no multipart)
app.use(express.urlencoded({ extended: true })); 

// 3. CONECTAMOS LAS RUTAS DE LA API
app.use('/api', routes);

// =======================================================================
// 4. ARCHIVOS ESTÁTICOS (CORREGIDO) 🔧
// =======================================================================
// Esta única línea es suficiente. Le dice a Express:
// "Todo lo que esté dentro de la carpeta 'public', sírvelo tal cual".
// Como tu carpeta 'uploads' está DENTRO de 'public', esto funciona automáticamente.
app.use(express.static(path.join(__dirname, '../public')));

// (He eliminado la línea extra de '/uploads' para evitar conflictos de rutas)
// =======================================================================

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