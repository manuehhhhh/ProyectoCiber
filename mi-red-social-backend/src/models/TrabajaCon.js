const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrabajaCon = sequelize.define('TrabajaCon', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_escuela: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fecha_ingreso: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'trabaja_con',
    timestamps: false
});

module.exports = TrabajaCon;