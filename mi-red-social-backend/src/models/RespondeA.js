const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RespondeA = sequelize.define('RespondeA', {
    id_respondido: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_responde: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'responde_a',
    timestamps: false
});

module.exports = RespondeA;