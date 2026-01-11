const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstaEn = sequelize.define('EstaEn', {
    id_recurso: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_idioma: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'esta_en',
    timestamps: false
});

module.exports = EstaEn;