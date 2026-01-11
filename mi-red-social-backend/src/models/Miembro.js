const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Miembro = sequelize.define('Miembro', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    foto_perfil: {
        type: DataTypes.BLOB
    },
    tipo_miembro: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        validate: {
            isIn: [['P', 'D', 'O']]
        }
    },
    fecha_registro: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'miembro',
    timestamps: false
});

module.exports = Miembro;