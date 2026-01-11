const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grupo = sequelize.define('Grupo', {
    id_grupo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad_miembro: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    descripcion_grupo: {
        type: DataTypes.TEXT
    },
    tipo_grupo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['Publico', 'Privado', 'Secreto']]
        }
    }
}, {
    tableName: 'grupo',
    timestamps: false
});

module.exports = Grupo;