const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facultad = sequelize.define('Facultad', {
    id_facultad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_dependencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'facultad',
    timestamps: false
});

module.exports = Facultad;