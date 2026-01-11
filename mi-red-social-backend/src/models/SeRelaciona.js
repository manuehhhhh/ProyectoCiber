const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeRelaciona = sequelize.define('SeRelaciona', {
    id_receptor: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    id_solicitador: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tipo_vinculo: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: [['SIMETRICA', 'ASIMETRICA']]
        }
    },
    naturaleza_del_vinculo: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: [['AMIGO', 'SIGUE', 'TIPIFICADO']]
        }
    },
    descripcion_del_vinculo: {
        type: DataTypes.STRING(50)
    },
    estado_vinculo: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: [['ENVIO', 'PENDIENTE', 'ACEPTADA', 'RECHAZADA']]
        }
    }
}, {
    tableName: 'se_relaciona',
    timestamps: false
});

module.exports = SeRelaciona;