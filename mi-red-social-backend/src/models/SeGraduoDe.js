const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeGraduoDe = sequelize.define('SeGraduoDe', {
    id_egresado: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fecha_graduacion: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'se_graduo_de',
    timestamps: false
});

module.exports = SeGraduoDe;