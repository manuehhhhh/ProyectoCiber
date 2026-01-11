const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asiste = sequelize.define('Asiste', {
    id_persona: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    tableName: 'asiste',
    timestamps: false
});

module.exports = Asiste;