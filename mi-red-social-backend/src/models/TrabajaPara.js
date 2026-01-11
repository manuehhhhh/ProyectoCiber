const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrabajaPara = sequelize.define('TrabajaPara', {
    id_personal: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_dependencia: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fecha_ingreso: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'trabaja_para',
    timestamps: false
});

module.exports = TrabajaPara;