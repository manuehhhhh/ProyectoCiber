const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Persona = sequelize.define('Persona', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tipo_documento: {
        type: DataTypes.CHAR(1),
        validate: {
            isIn: [['V', 'E', 'J', 'P']]
        }
    },
    numero_documento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    sexo: {
        type: DataTypes.CHAR(1),
        validate: {
            isIn: [['F', 'M']]
        }
    },
    ubicacion: {
        type: DataTypes.STRING(100)
    },
    correo_personal: {
        type: DataTypes.STRING(100)
    },
    correo_universitario: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'persona',
    timestamps: false,
    uniqueKeys: {
        uq_persona_documento: {
            fields: ['tipo_documento', 'numero_documento']
        }
    }
});

module.exports = Persona;