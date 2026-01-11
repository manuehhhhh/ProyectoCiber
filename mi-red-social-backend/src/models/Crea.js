const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Crea = sequelize.define('Crea', {
    id_grupo: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'crea',
    timestamps: false
});

module.exports = Crea;