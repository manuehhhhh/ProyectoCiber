const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comparte = sequelize.define('Comparte', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_recurso: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fecha_compartido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'comparte',
    timestamps: false
});

module.exports = Comparte;