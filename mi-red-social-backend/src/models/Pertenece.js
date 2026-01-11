const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pertenece = sequelize.define('Pertenece', {
    id_grupo: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['Administrador', 'Miembro']]
        }
    }
}, {
    tableName: 'pertenece',
    timestamps: false
});

module.exports = Pertenece;