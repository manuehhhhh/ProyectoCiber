const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recurso = sequelize.define('Recurso', {
    id_recurso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_recurso: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    id_usuario_comparte: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion_recurso: {
        type: DataTypes.TEXT
    },
    fecha_cargado: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'recurso',
    timestamps: false
});

module.exports = Recurso;