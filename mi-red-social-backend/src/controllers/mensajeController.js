const sequelize = require('../config/database');

// Controlador para crear un mensaje en un grupo usando consulta SQL con bind parameters
exports.crearMensaje = async (req, res) => {
  const { id_grupo, id_usuario, contenido_textual } = req.body;
  if (!id_grupo || !id_usuario || !contenido_textual) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }
  try {
    const timestamp = new Date();
    const [result] = await sequelize.query(
      `INSERT INTO mensaje (id_grupo, id_usuario, contenido_textual, tiempo_mensaje) VALUES ($1, $2, $3, $4) RETURNING *`,
      { bind: [id_grupo, id_usuario, contenido_textual, timestamp] }
    );
    const nuevoMensaje = result[0];
    return res.status(201).json({ mensaje: 'Mensaje creado', data: nuevoMensaje });
  } catch (error) {
    console.error('Error creando mensaje:', error);
    return res.status(500).json({ mensaje: 'Error interno al crear mensaje' });
  }
};
