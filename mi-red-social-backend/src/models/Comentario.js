const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define('Comentario', {
    id_comentario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tiempo_comentario: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_miembro: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contenido_textual_comentario: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'comentario',
    timestamps: false,
    uniqueKeys: {
        unique_comentario: {
            fields: ['id_publicacion', 'id_miembro', 'tiempo_comentario']
        }
    }
});

module.exports = Comentario;