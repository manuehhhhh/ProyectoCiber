const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudia = sequelize.define('Estudia', {
    id_estudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'estudia',
    timestamps: false
});

module.exports = Estudia;