const sequelize = require('../config/database');

const models = {
    Idioma: require('./Idioma'),
    Carrera: require('./Carrera'),
    Miembro: require('./Miembro'),
    Persona: require('./Persona'),
    DependenciaUniversitaria: require('./DependenciaUniversitaria'),
    OrganizacionAsociada: require('./OrganizacionAsociada'),
    Estudiante: require('./Estudiante'),
    Profesor: require('./Profesor'),
    Egresado: require('./Egresado'),
    Personal: require('./Personal'),
    Facultad: require('./Facultad'),
    Escuela: require('./Escuela'),
    Departamento: require('./Departamento'),
    Estudia: require('./Estudia'),
    EnsenaEn: require('./EnsenaEn'),
    SeGraduoDe: require('./SeGraduoDe'),
    TrabajaPara: require('./TrabajaPara'),
    TrabajaCon: require('./TrabajaCon'),
    Post: require('./Post'),
    Publicacion: require('./Publicacion'),
    SolicitudDeAyuda: require('./SolicitudDeAyuda'),
    Comentario: require('./Comentario'),
    RespondeA: require('./RespondeA'),
    GustaDe: require('./GustaDe'),
    Evento: require('./Evento'),
    Asiste: require('./Asiste'),
    Grupo: require('./Grupo'),
    Pertenece: require('./Pertenece'),
    Crea: require('./Crea'),
    Mensaje: require('./Mensaje'),
    Recurso: require('./Recurso'),
    EstaEn: require('./EstaEn'),
    UtilizadoPor: require('./UtilizadoPor'),
    Comparte: require('./Comparte'),
    SeRelaciona: require('./SeRelaciona'),
};

// Associations

// Miembro
models.Persona.belongsTo(models.Miembro, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Miembro.hasOne(models.Persona, { foreignKey: 'id_miembro' });
models.DependenciaUniversitaria.belongsTo(models.Miembro, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Miembro.hasOne(models.DependenciaUniversitaria, { foreignKey: 'id_miembro' });
models.OrganizacionAsociada.belongsTo(models.Miembro, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Miembro.hasOne(models.OrganizacionAsociada, { foreignKey: 'id_miembro' });

// Persona Subtypes
models.Estudiante.belongsTo(models.Persona, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Persona.hasOne(models.Estudiante, { foreignKey: 'id_miembro' });
models.Profesor.belongsTo(models.Persona, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Persona.hasOne(models.Profesor, { foreignKey: 'id_miembro' });
models.Egresado.belongsTo(models.Persona, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Persona.hasOne(models.Egresado, { foreignKey: 'id_miembro' });
models.Personal.belongsTo(models.Persona, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Persona.hasOne(models.Personal, { foreignKey: 'id_miembro' });

// Academic Structure
models.Facultad.belongsTo(models.DependenciaUniversitaria, { foreignKey: 'id_dependencia', onDelete: 'CASCADE' });
models.DependenciaUniversitaria.hasOne(models.Facultad, { foreignKey: 'id_dependencia' });
models.Escuela.belongsTo(models.Facultad, { foreignKey: 'id_facultad', onDelete: 'CASCADE' });
models.Facultad.hasMany(models.Escuela, { foreignKey: 'id_facultad' });
models.Departamento.belongsTo(models.Facultad, { foreignKey: 'id_facultad', onDelete: 'CASCADE' });
models.Facultad.hasMany(models.Departamento, { foreignKey: 'id_facultad' });

// Academic and Work Relations
models.Estudiante.belongsToMany(models.Carrera, { through: models.Estudia, foreignKey: 'id_estudiante' });
models.Carrera.belongsToMany(models.Estudiante, { through: models.Estudia, foreignKey: 'id_carrera' });
models.Profesor.belongsToMany(models.Carrera, { through: models.EnsenaEn, foreignKey: 'id_profesor' });
models.Carrera.belongsToMany(models.Profesor, { through: models.EnsenaEn, foreignKey: 'id_carrera' });
models.Egresado.belongsToMany(models.Carrera, { through: models.SeGraduoDe, foreignKey: 'id_egresado' });
models.Carrera.belongsToMany(models.Egresado, { through: models.SeGraduoDe, foreignKey: 'id_carrera' });
models.Personal.belongsToMany(models.DependenciaUniversitaria, { through: models.TrabajaPara, foreignKey: 'id_personal' });
models.DependenciaUniversitaria.belongsToMany(models.Personal, { through: models.TrabajaPara, foreignKey: 'id_dependencia' });
models.Profesor.belongsToMany(models.Escuela, { through: models.TrabajaCon, foreignKey: 'id_profesor' });
models.Escuela.belongsToMany(models.Profesor, { through: models.TrabajaCon, foreignKey: 'id_escuela' });

// Posts and Content
models.Post.belongsTo(models.Miembro, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
models.Miembro.hasMany(models.Post, { foreignKey: 'id_usuario' });
models.Publicacion.belongsTo(models.Post, { foreignKey: 'id_post', onDelete: 'CASCADE' });
models.Post.hasOne(models.Publicacion, { foreignKey: 'id_post' });
models.SolicitudDeAyuda.belongsTo(models.Post, { foreignKey: 'id_post', onDelete: 'CASCADE' });
models.Post.hasOne(models.SolicitudDeAyuda, { foreignKey: 'id_post' });
models.Comentario.belongsTo(models.Miembro, { foreignKey: 'id_miembro', onDelete: 'CASCADE' });
models.Miembro.hasMany(models.Comentario, { foreignKey: 'id_miembro' });
models.Comentario.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', onDelete: 'CASCADE' });
models.Publicacion.hasMany(models.Comentario, { foreignKey: 'id_publicacion' });
models.Comentario.belongsToMany(models.Comentario, { as: 'Respuestas', through: models.RespondeA, foreignKey: 'id_respondido', otherKey: 'id_responde' });

// Likes
models.Miembro.belongsToMany(models.Publicacion, { through: models.GustaDe, foreignKey: 'id_miembro' });
models.Publicacion.belongsToMany(models.Miembro, { through: models.GustaDe, foreignKey: 'id_publicacion' });

// Events
models.Evento.belongsTo(models.Miembro, { foreignKey: 'id_organizador', onDelete: 'CASCADE' });
models.Miembro.hasMany(models.Evento, { foreignKey: 'id_organizador' });
models.Persona.belongsToMany(models.Evento, { through: models.Asiste, foreignKey: 'id_persona' });
models.Evento.belongsToMany(models.Persona, { through: models.Asiste, foreignKey: 'id_evento' });

// Groups and Community
models.Miembro.belongsToMany(models.Grupo, { through: models.Pertenece, foreignKey: 'id_usuario' });
models.Grupo.belongsToMany(models.Miembro, { through: models.Pertenece, foreignKey: 'id_grupo' });
models.Crea.belongsTo(models.Grupo, { foreignKey: 'id_grupo', onDelete: 'CASCADE' });
models.Grupo.hasMany(models.Crea, { foreignKey: 'id_grupo' });
models.Crea.belongsTo(models.Miembro, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
models.Miembro.hasMany(models.Crea, { foreignKey: 'id_usuario' });
models.Mensaje.belongsTo(models.Grupo, { foreignKey: 'id_grupo', onDelete: 'CASCADE' });
models.Grupo.hasMany(models.Mensaje, { foreignKey: 'id_grupo' });
models.Mensaje.belongsTo(models.Miembro, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });
models.Miembro.hasMany(models.Mensaje, { foreignKey: 'id_usuario' });

// Resources
models.Recurso.belongsTo(models.Miembro, { foreignKey: 'id_usuario_comparte', onDelete: 'CASCADE' });
models.Miembro.hasMany(models.Recurso, { foreignKey: 'id_usuario_comparte' });
models.Recurso.belongsToMany(models.Idioma, { through: models.EstaEn, foreignKey: 'id_recurso' });
models.Idioma.belongsToMany(models.Recurso, { through: models.EstaEn, foreignKey: 'id_idioma' });
models.Carrera.belongsToMany(models.Recurso, { through: models.UtilizadoPor, foreignKey: 'id_carrera' });
models.Recurso.belongsToMany(models.Carrera, { through: models.UtilizadoPor, foreignKey: 'id_recurso' });
models.Miembro.belongsToMany(models.Recurso, { through: models.Comparte, foreignKey: 'id_usuario' });
models.Recurso.belongsToMany(models.Miembro, { through: models.Comparte, foreignKey: 'id_recurso' });

// Social Relations
models.Miembro.belongsToMany(models.Miembro, { as: 'Relaciones', through: models.SeRelaciona, foreignKey: 'id_solicitador', otherKey: 'id_receptor' });

models.sequelize = sequelize;
models.Sequelize = sequelize.Sequelize;

module.exports = models;
