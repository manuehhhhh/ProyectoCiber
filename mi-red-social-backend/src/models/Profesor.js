const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('Profesor', {
    id_miembro: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    ensena_desde: {
        type: DataTypes.DATE,
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(20),
        validate: {
            isIn: [['Ordinario', 'Contratado']]
        }
    },
    dedicacion: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: [['Tiempo completo', 'Medio tiempo']]
        }
    }
}, {
    tableName: 'profesor',
    timestamps: false
});

module.exports = Profesor;