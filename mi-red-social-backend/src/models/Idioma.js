const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Idioma = sequelize.define('Idioma', {
    id_idioma: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_idioma: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'idioma',
    timestamps: false
});

module.exports = Idioma;