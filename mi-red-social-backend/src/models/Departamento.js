const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Departamento = sequelize.define('Departamento', {
    id_departamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_facultad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'departamento',
    timestamps: false
});

module.exports = Departamento;