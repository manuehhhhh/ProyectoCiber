const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'estudiante',
    timestamps: false
});

module.exports = Estudiante;