-- =============================================
-- 1. CATÁLOGOS Y TABLAS INDEPENDIENTES
-- =============================================

CREATE TABLE Idioma (
    id_idioma SERIAL PRIMARY KEY,
    nombre_idioma VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Carrera(
    id_carrera  SERIAL  PRIMARY KEY,
    nombre_carrera  varchar(100),
    tipo_carrera    varchar(50),
    CONSTRAINT descripcion_carrera
        CHECK(tipo_carrera IN ('PREGRADO' , 'POSGRADO'))
);

-- =============================================
-- 2. MIEMBROS Y HERENCIA
-- =============================================

CREATE TABLE Miembro (
    id_miembro SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    foto_perfil BYTEA,
    tipo_miembro CHAR(1) CHECK (tipo_miembro IN ('P', 'D', 'O')) NOT NULL,
    fecha_registro DATE
);

-- A. PERSONA
CREATE TABLE Persona (
    id_miembro INT PRIMARY KEY,
    tipo_documento CHAR(1) CHECK (tipo_documento IN ('V','E','J','P')),
    numero_documento INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL CHECK (fecha_nacimiento <= CURRENT_DATE),
    sexo CHAR(1) CHECK (sexo IN ('F','M')),
    ubicacion VARCHAR(100),
    correo_personal VARCHAR(100),
    correo_universitario VARCHAR(100) UNIQUE NOT NULL,
    
    CONSTRAINT fk_persona_miembro 
        FOREIGN KEY (id_miembro) REFERENCES Miembro(id_miembro) ON DELETE CASCADE,
    CONSTRAINT uq_persona_documento UNIQUE (tipo_documento, numero_documento)
);

-- B. DEPENDENCIA
CREATE TABLE Dependencia_universitaria (
    id_miembro INT PRIMARY KEY,
    nombre_dependencia VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    correo_contacto VARCHAR(50) NOT NULL,
    descripcion TEXT,

    CONSTRAINT fk_dependencia_miembro 
        FOREIGN KEY (id_miembro) REFERENCES Miembro(id_miembro) ON DELETE CASCADE
);

-- C. ORGANIZACION
CREATE TABLE Organizacion_asociada (
    id_miembro INT PRIMARY KEY,
    nombre_organizacion VARCHAR(100) UNIQUE NOT NULL,
    tipo_documento CHAR(20) NOT NULL, 
    numero_documento INT NOT NULL,
    correo_contacto VARCHAR(50) NOT NULL,
    descripcion TEXT,

    CONSTRAINT fk_organizacion_miembro 
        FOREIGN KEY (id_miembro) REFERENCES Miembro(id_miembro) ON DELETE CASCADE,
    CONSTRAINT uq_organizacion_documento UNIQUE (tipo_documento, numero_documento)
);

-- =============================================
-- 3. SUBTIPOS DE PERSONA
-- =============================================

CREATE TABLE Estudiante (
    id_miembro INT PRIMARY KEY, 
    CONSTRAINT fk_estudiante_persona 
        FOREIGN KEY (id_miembro) REFERENCES Persona(id_miembro) ON DELETE CASCADE
);

CREATE TABLE Profesor (
    id_miembro INT PRIMARY KEY,
    ensena_desde DATE NOT NULL,
    categoria VARCHAR(20) CHECK (categoria IN ('Ordinario','Contratado')),
    dedicacion VARCHAR(50) CHECK (dedicacion IN ('Tiempo completo','Medio tiempo')),

    CONSTRAINT fk_profesor_persona 
        FOREIGN KEY (id_miembro) REFERENCES Persona(id_miembro) ON DELETE CASCADE
);

CREATE TABLE Egresado (
    id_miembro INT PRIMARY KEY,
    CONSTRAINT fk_egresado_persona 
        FOREIGN KEY (id_miembro) REFERENCES Persona(id_miembro) ON DELETE CASCADE
);

CREATE TABLE Personal (
    id_miembro INT PRIMARY KEY,
    cargo VARCHAR(50),
    CONSTRAINT fk_personal_persona 
        FOREIGN KEY (id_miembro) REFERENCES Persona(id_miembro) ON DELETE CASCADE
);

-- =============================================
-- 4. ESTRUCTURA ACADÉMICA
-- =============================================

CREATE TABLE Facultad (
    id_facultad Serial PRIMARY KEY,
    id_dependencia INT NOT NULL UNIQUE,
    
    CONSTRAINT fk_facultad_dependencia 
    FOREIGN KEY (id_dependencia) REFERENCES Dependencia_universitaria (id_miembro) ON DELETE CASCADE
);

CREATE TABLE Escuela (
    id_escuela Serial PRIMARY KEY, 
    id_facultad Int NOT NULL,

    CONSTRAINT fk_escuela_facultad
    FOREIGN KEY (id_facultad) REFERENCES Facultad (id_facultad) ON DELETE CASCADE
);

CREATE TABLE Departamento (
    id_departamento Serial PRIMARY KEY,
    id_facultad Int NOT NULL,

    -- CORREGIDO: Nombre del constraint único
    CONSTRAINT fk_departamento_facultad
    FOREIGN KEY (id_facultad) REFERENCES Facultad (id_facultad) ON DELETE CASCADE
);

-- =============================================
-- 5. RELACIONES ACADÉMICAS Y LABORALES
-- =============================================

CREATE TABLE Estudia (
    id_estudiante INT,
    id_carrera INT,
    fecha_inicio DATE DEFAULT CURRENT_DATE,

    PRIMARY KEY (id_estudiante, id_carrera),
    CONSTRAINT fk_estudia_estudiante 
        FOREIGN KEY (id_estudiante) REFERENCES Estudiante(id_miembro) ON DELETE CASCADE,
    CONSTRAINT fk_estudia_carrera 
        FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera) ON DELETE CASCADE
);

CREATE TABLE Ensena_en (
    id_profesor INT,
    id_carrera INT,

    PRIMARY KEY (id_profesor, id_carrera),
    CONSTRAINT fk_ensena_profesor 
        FOREIGN KEY (id_profesor) REFERENCES Profesor(id_miembro) ON DELETE CASCADE,
    CONSTRAINT fk_ensena_carrera 
        FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera) ON DELETE CASCADE
);

CREATE TABLE Se_graduo_de (
    id_egresado INT,
    id_carrera INT,
    fecha_graduacion DATE,
    
    PRIMARY KEY (id_egresado, id_carrera),
    CONSTRAINT fk_graduo_egresado 
        FOREIGN KEY (id_egresado) REFERENCES Egresado(id_miembro) ON DELETE CASCADE,
    CONSTRAINT fk_graduo_carrera 
        FOREIGN KEY (id_carrera) REFERENCES Carrera(id_carrera) ON DELETE CASCADE
);

CREATE TABLE Trabaja_para (
    id_personal INT,
    id_dependencia INT,
    fecha_ingreso DATE,

    PRIMARY KEY (id_personal, id_dependencia),
    CONSTRAINT fk_trabaja_personal 
        FOREIGN KEY (id_personal) REFERENCES Personal(id_miembro) ON DELETE CASCADE,
    CONSTRAINT fk_trabaja_dependencia 
        FOREIGN KEY (id_dependencia) REFERENCES Dependencia_universitaria(id_miembro) ON DELETE CASCADE
);

CREATE TABLE Trabaja_con (
    id_profesor INT,
    id_escuela INT, 
    fecha_ingreso DATE,

    PRIMARY KEY (id_profesor, id_escuela),
    CONSTRAINT fk_trabaja_profesor
        FOREIGN KEY (id_profesor) REFERENCES Profesor(id_miembro) ON DELETE CASCADE,
    CONSTRAINT fk_trabaja_escuela
        FOREIGN KEY (id_escuela) REFERENCES Escuela(id_escuela) ON DELETE CASCADE
);

-- =============================================
-- 6. PUBLICACIONES Y CONTENIDO
-- =============================================

CREATE TABLE Post(
    id_post SERIAL PRIMARY KEY,
    tiempo_post    timestamp, -- CORREGIDO: Quitado UNIQUE
    id_usuario  INT, 
    contenido_textual_post  varchar(255), 
    contenido_multimedia_post   bytea,
    FOREIGN KEY (id_usuario) REFERENCES Miembro(id_miembro) ON DELETE CASCADE
);

CREATE TABLE Publicacion(
    id_publicacion  SERIAL PRIMARY KEY,
    id_post  INT NOT NULL   UNIQUE,
    FOREIGN KEY ( id_post) REFERENCES Post(id_post) ON DELETE CASCADE
);

CREATE TABLE Solicitud_de_ayuda(
    id_solicitud  SERIAL PRIMARY KEY,
    id_post  INT NOT NULL   UNIQUE,
    FOREIGN KEY ( id_post) REFERENCES Post(id_post) ON DELETE CASCADE
);

CREATE TABLE Comentario(
    id_comentario serial PRIMARY KEY,
    tiempo_comentario   timestamp   NOT NULL,
    id_miembro  INT NOT NULL, 
    id_publicacion INT NOT NULL,
    contenido_textual_comentario    varchar(255),
    FOREIGN KEY ( id_miembro) REFERENCES Miembro(id_miembro) ON DELETE CASCADE,
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion) ON DELETE CASCADE,
    UNIQUE (id_publicacion, id_miembro, tiempo_comentario)
);

CREATE TABLE Responde_A(
    id_respondido INT,
    id_responde INT,
    FOREIGN KEY ( id_responde) REFERENCES Comentario(id_comentario) ON DELETE CASCADE,
    FOREIGN KEY ( id_respondido) REFERENCES Comentario(id_comentario) ON DELETE CASCADE,
    PRIMARY KEY (id_responde, id_respondido)
);

-- CORREGIDO: Tabla Gusta_de (Likes) ajustada
CREATE TABLE Gusta_de(
    id_miembro INT NOT NULL,
    id_publicacion INT NOT NULL, -- Apunta a Publicacion para ser consistente con Comentario
    fecha_like TIMESTAMP DEFAULT NOW(),
    
    PRIMARY KEY (id_miembro, id_publicacion), -- Un usuario solo da like una vez a una publicación
    
    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion) ON DELETE CASCADE,
    FOREIGN KEY (id_miembro) REFERENCES Miembro(id_miembro) ON DELETE CASCADE
);

-- =============================================
-- 7. EVENTOS
-- =============================================

CREATE TABLE Evento (
    id_evento SERIAL PRIMARY KEY,
    nombre_evento VARCHAR(100) NOT NULL,
    id_organizador INT NOT NULL,
    aforo INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    
    categoria VARCHAR(50) CHECK (categoria IN ('Competencia', 'Conferencia', 'Taller', 'Webinar', 'Acto de grado', 'Encuentro de egresados')),
    
    descripcion_evento VARCHAR(200),
    lugar VARCHAR(100) NOT NULL,
    enlace VARCHAR(100),
    
    CONSTRAINT fk_evento_organizador 
        FOREIGN KEY (id_organizador) REFERENCES Miembro(id_miembro) ON DELETE CASCADE,
        
    CONSTRAINT ck_orden_fechas CHECK (fecha_fin >= fecha_inicio),
    
    CONSTRAINT ck_orden_horas CHECK (
        fecha_fin > fecha_inicio OR 
        (fecha_fin = fecha_inicio AND hora_fin > hora_inicio) 
    )
);

CREATE TABLE Asiste (
    id_persona INT, 
    id_evento INT, 
    
    PRIMARY KEY (id_persona, id_evento),
    
    CONSTRAINT fk_asiste_persona
        FOREIGN KEY (id_persona) REFERENCES Persona(id_miembro) ON DELETE CASCADE,  
    CONSTRAINT fk_asiste_evento
        FOREIGN KEY (id_evento) REFERENCES Evento(id_evento) ON DELETE CASCADE
);

-- =============================================
-- 8. GRUPOS Y COMUNIDAD
-- =============================================

CREATE TABLE Grupo (
    id_grupo Serial PRIMARY KEY,
    cantidad_miembro INT NOT NULL DEFAULT 0,
    descripcion_grupo TEXT,
    tipo_grupo VARCHAR (20) NOT NULL,

    CONSTRAINT chk_tipo_grupo 
    CHECK (tipo_grupo IN ('Publico', 'Privado', 'Secreto'))
);

CREATE TABLE Pertenece (
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL, -- CORREGIDO: Se quitó UNIQUE
    rol VARCHAR (20) NOT NULL,

    PRIMARY KEY (id_grupo, id_usuario),
    CONSTRAINT chk_rol CHECK (rol in ('Administrador', 'Miembro')),
    CONSTRAINT fk_pertenece_grupo FOREIGN KEY (id_grupo) REFERENCES Grupo (id_grupo) ON DELETE CASCADE,
    CONSTRAINT fk_pertenece_miembro FOREIGN KEY (id_usuario) REFERENCES Miembro (id_miembro) ON DELETE CASCADE
);

CREATE TABLE Crea (
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,

    PRIMARY KEY (id_grupo, id_usuario),
    CONSTRAINT fk_crea_grupo FOREIGN KEY (id_grupo) REFERENCES Grupo (id_grupo) ON DELETE CASCADE,
    CONSTRAINT fk_crea_miembro FOREIGN KEY (id_usuario) REFERENCES Miembro (id_miembro) ON DELETE CASCADE
);

CREATE TABLE Mensaje (
    id_mensaje SERIAL PRIMARY KEY,
    tiempo_mensaje TIMESTAMP NOT NULL,
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,
    contenido_textual TEXT,
    contenido_multimedia BYTEA,

    CONSTRAINT fk_mensaje_grupo
    FOREIGN KEY (id_grupo) REFERENCES Grupo (id_grupo) ON DELETE CASCADE,
    CONSTRAINT fk_mensaje_miembro
    FOREIGN KEY (id_usuario) REFERENCES Miembro (id_miembro) ON DELETE CASCADE
);

-- =============================================
-- 9. RECURSOS
-- =============================================

CREATE TABLE Recurso (
    id_recurso SERIAL PRIMARY KEY,
    nombre_recurso VARCHAR(100) NOT NULL UNIQUE, 
    id_usuario_comparte INT NOT NULL,
    descripcion_recurso TEXT,
    fecha_cargado TIMESTAMP NOT NULL DEFAULT NOW (),
    CONSTRAINT fk_recurso_miembro 
    FOREIGN KEY (id_usuario_comparte) REFERENCES Miembro (id_miembro) ON DELETE CASCADE
);

CREATE TABLE Esta_en (
    id_recurso INT NOT NULL,
    id_idioma INT NOT NULL,

    PRIMARY KEY (id_recurso, id_idioma),
    CONSTRAINT fk_estaen_recursos
    FOREIGN KEY (id_recurso) REFERENCES Recurso (id_recurso) ON DELETE CASCADE,
    CONSTRAINT fk_estaen_idioma 
    FOREIGN KEY (id_idioma) REFERENCES Idioma (id_idioma) ON DELETE CASCADE
);

CREATE TABLE Utilizado_por (
    id_carrera INT NOT NULL,
    id_recurso INT NOT NULL,
    
    PRIMARY KEY (id_carrera, id_recurso),
    CONSTRAINT fk_utilizado_carrera
    FOREIGN KEY (id_carrera) REFERENCES Carrera (id_carrera) ON DELETE CASCADE,
    CONSTRAINT fk_utilizado_recurso
    FOREIGN KEY (id_recurso) REFERENCES Recurso (id_recurso) ON DELETE CASCADE
);

CREATE TABLE Comparte (
    id_usuario INT NOT NULL,
    id_recurso INT NOT NULL,
    fecha_compartido TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (id_usuario, id_recurso),
    CONSTRAINT fk_comparte_recurso
    FOREIGN KEY (id_recurso) REFERENCES Recurso (id_recurso) ON DELETE CASCADE,
    CONSTRAINT fk_comparte_usuario
    FOREIGN KEY (id_usuario) REFERENCES Miembro (id_miembro) ON DELETE CASCADE
);

-- =============================================
-- 10. RELACIONES SOCIALES (AMISTAD)
-- =============================================

CREATE TABLE Se_relaciona(
    id_receptor INT, 
    id_solicitador  INT,  
    tipo_vinculo varchar(50),    
    naturaleza_del_vinculo varchar(50),
    descripcion_del_vinculo varchar(50),
    estado_vinculo varchar(50),
    FOREIGN KEY ( id_receptor) REFERENCES Miembro(id_miembro) ON DELETE CASCADE,
    FOREIGN KEY ( id_solicitador) REFERENCES Miembro(id_miembro) ON DELETE CASCADE,
    PRIMARY KEY (id_receptor, id_solicitador),
    CONSTRAINT opciones_naturaleza
        CHECK (naturaleza_del_vinculo IN ('AMIGO', 'SIGUE', 'TIPIFICADO')),
    CONSTRAINT opciones_estado
        CHECK (estado_vinculo IN ('ENVIO', 'PENDIENTE', 'ACEPTADA', 'RECHAZADA')),
    CONSTRAINT opciones_tipo
        CHECK (tipo_vinculo IN ('SIMETRICA', 'ASIMETRICA')),

    CONSTRAINT naturaleza_estado_asimetria
        CHECK ( NOT (naturaleza_del_vinculo = 'ASIMETRICA') OR (estado_vinculo = 'ACEPTADA') ),

    CONSTRAINT sigue_naturaleza_asimetrica
        CHECK ( (naturaleza_del_vinculo = 'ASIMETRICA') OR NOT (tipo_vinculo = 'SIGUE') ),

    CONSTRAINT amigo_naturaleza_simetrica
        CHECK ( (naturaleza_del_vinculo = 'SIMETRICA') OR NOT (tipo_vinculo = 'AMIGO') ),

    CONSTRAINT tipificada_naturaleza_simetrica
        CHECK ( (naturaleza_del_vinculo = 'SIMETRICA') OR NOT (tipo_vinculo = 'TIPIFICADA') )
);