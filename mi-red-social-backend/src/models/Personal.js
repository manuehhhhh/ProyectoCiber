const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Personal = sequelize.define('Personal', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    cargo: {
        type: DataTypes.STRING(50)
    }
}, {
    tableName: 'personal',
    timestamps: false
});

module.exports = Personal;