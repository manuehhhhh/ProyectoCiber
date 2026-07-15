const sequelize = require('../config/database');
const { QueryTypes } = require('sequelize');

// Obtener lista de grupos (todos los campos necesarios)
exports.obtenerGrupos = async (req, res, next) => {
  try {
    const grupos = await sequelize.query('SELECT id_grupo, descripcion_grupo, tipo_grupo, cantidad_miembro FROM grupo', { type: QueryTypes.SELECT });
    return res.status(200).json(grupos);
  } catch (error) {
    next(error);
  }
};
