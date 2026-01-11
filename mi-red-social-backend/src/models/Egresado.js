const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Egresado = sequelize.define('Egresado', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'egresado',
    timestamps: false
});

module.exports = Egresado;