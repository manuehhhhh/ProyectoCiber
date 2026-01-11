const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DependenciaUniversitaria = sequelize.define('DependenciaUniversitaria', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nombre_dependencia: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING(20)
    },
    correo_contacto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'dependencia_universitaria',
    timestamps: false
});

module.exports = DependenciaUniversitaria;