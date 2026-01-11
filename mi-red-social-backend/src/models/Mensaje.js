const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mensaje = sequelize.define('Mensaje', {
    id_mensaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tiempo_mensaje: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contenido_textual: {
        type: DataTypes.TEXT
    },
    contenido_multimedia: {
        type: DataTypes.BLOB
    }
}, {
    tableName: 'mensaje',
    timestamps: false
});

module.exports = Mensaje;