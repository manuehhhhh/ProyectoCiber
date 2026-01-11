const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escuela = sequelize.define('Escuela', {
    id_escuela: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_facultad: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'escuela',
    timestamps: false
});

module.exports = Escuela;