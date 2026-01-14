const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
    id_post: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tiempo_post: {
        type: DataTypes.DATE
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    contenido_textual_post: {
        type: DataTypes.STRING(255)
    },
    contenido_multimedia_post: {
    type: DataTypes.STRING(255), 
    allowNull: true
}
}, {
    tableName: 'post',
    timestamps: false
});

module.exports = Post;