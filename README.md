# Red Social Universitaria (SoyUCAB) 🎓

Proyecto final para la cátedra de Base de Datos. Esta aplicación web permite la interacción entre miembros de la comunidad universitaria (Estudiantes, Profesores, Dependencias) mediante publicaciones, comentarios, likes y un módulo completo de gestión de eventos.

## 🛠️ Tecnologías

* **Backend:** Node.js + Express.js
* **Base de Datos:** PostgreSQL
* **ORM:** Sequelize
* **Frontend:** HTML5, CSS3, JavaScript Vanilla

---

## 📋 Guía de Instalación Paso a Paso

Siga estas instrucciones explícitas para desplegar el proyecto localmente.

### 1. Clonar y Preparar Entorno
Descargue el repositorio, abra una terminal en la carpeta raíz del proyecto e instale las dependencias:

npm install

2. Configuración de la Base de Datos (Importante) 🗄️
Para garantizar que las validaciones de fechas (Constraints SQL) y los tipos de datos funcionen correctamente, se debe restaurar la estructura desde el script incluido.

Abra su gestor de base de datos (pgAdmin 4 o DBeaver).

Cree una base de datos vacía llamada: red_social_db.

Ubique el archivo database.sql en la carpeta raíz de este proyecto.

Ejecute el contenido de ese archivo en la herramienta de consultas (Query Tool) sobre la base de datos recién creada.

Esto creará las tablas Miembro, Evento, Asiste, etc., con sus respectivas restricciones CHECK para fechas y horas.

3. Conexión del Proyecto
Edite el archivo de configuración para conectar el backend con su PostgreSQL local.

Archivo: src/config/database.js

Acción: Modifique los parámetros con sus credenciales locales:

JavaScript

// src/config/database.js
const sequelize = new Sequelize(
    'red_social_db',    // Nombre de la base de datos
    'postgres',         // Su usuario de PostgreSQL (ej: postgres)
    '123456',           // Su contraseña de PostgreSQL
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    }
);
4. Iniciar el Servidor
Bash

npm start
El servidor iniciará en: http://localhost:3000
