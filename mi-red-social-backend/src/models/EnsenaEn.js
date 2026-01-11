const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EnsenaEn = sequelize.define('EnsenaEn', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'ensena_en',
    timestamps: false
});

module.exports = EnsenaEn;