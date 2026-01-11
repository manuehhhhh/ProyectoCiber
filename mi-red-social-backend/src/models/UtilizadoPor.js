const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UtilizadoPor = sequelize.define('UtilizadoPor', {
    id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_recurso: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'utilizado_por',
    timestamps: false
});

module.exports = UtilizadoPor;