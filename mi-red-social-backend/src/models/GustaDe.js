const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GustaDe = sequelize.define('GustaDe', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fecha_like: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'gusta_de',
    timestamps: false
});

module.exports = GustaDe;