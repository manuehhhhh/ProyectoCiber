const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrera = sequelize.define('Carrera', {
    id_carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_carrera: {
        type: DataTypes.STRING(100)
    },
    tipo_carrera: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: [['PREGRADO', 'POSGRADO']]
        }
    }
}, {
    tableName: 'carrera',
    timestamps: false
});

module.exports = Carrera;