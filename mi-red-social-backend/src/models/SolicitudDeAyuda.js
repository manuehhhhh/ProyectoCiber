const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudDeAyuda = sequelize.define('SolicitudDeAyuda', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_post: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'solicitud_de_ayuda',
    timestamps: false
});

module.exports = SolicitudDeAyuda;