const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_evento: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_organizador: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    aforo: {
        type: DataTypes.INTEGER
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: [['Competencia', 'Conferencia', 'Taller', 'Webinar', 'Acto de grado', 'Encuentro de egresados']]
        }
    },
    descripcion_evento: {
        type: DataTypes.STRING(200)
    },
    lugar: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    enlace: {
        type: DataTypes.STRING(100)
    }
}, {
    tableName: 'evento',
    timestamps: false
});

module.exports = Evento;