const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrganizacionAsociada = sequelize.define('OrganizacionAsociada', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nombre_organizacion: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    tipo_documento: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    numero_documento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    correo_contacto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'organizacion_asociada',
    timestamps: false,
    uniqueKeys: {
        uq_organizacion_documento: {
            fields: ['tipo_documento', 'numero_documento']
        }
    }
});

module.exports = OrganizacionAsociada;