
-- 1. CATÁLOGOS
-- =====================================================================================
INSERT INTO Idioma (id_idioma, nombre_idioma) VALUES
    (1, 'Español'), (2, 'Inglés'), (3, 'Francés'), (4, 'Alemán'), (5, 'Portugués');

INSERT INTO Carrera (id_carrera, nombre_carrera, tipo_carrera) VALUES
    (1, 'Doctorado en Comunicaciones', 'POSGRADO'), (2, 'Doctorado en Ciencias Económicas', 'POSGRADO'),
    (3, 'Doctorado en Derecho', 'POSGRADO'), (4, 'Doctorado en Educación', 'POSGRADO'),
    (5, 'Doctorado en Filosofía', 'POSGRADO'), (6, 'Doctorado en Historia', 'POSGRADO'),
    (7, 'Doctorado en Ingeniería', 'POSGRADO'), (8, 'Doctorado en Psicología', 'POSGRADO'),
    (9, 'Especialización en Ciencias Penales', 'POSGRADO'), (10, 'Especialización en Comunicación Política', 'POSGRADO'),
    (11, 'Especialización en Derecho Administrativo', 'POSGRADO'), (12, 'Especialización en Derecho de Familia', 'POSGRADO'),
    (13, 'Especialización en Derecho del Trabajo', 'POSGRADO'), (14, 'Especialización en Derecho Económico', 'POSGRADO'),
    (15, 'Especialización en Derecho Financiero', 'POSGRADO'), (16, 'Especialización en Derecho Mercantil', 'POSGRADO'),
    (17, 'Especialización en Derecho Procesal', 'POSGRADO'), (18, 'Especialización en Desarrollo Organizacional', 'POSGRADO'),
    (19, 'Especialización en Economía Empresarial', 'POSGRADO'), (20, 'Especialización en Educación', 'POSGRADO'),
    (21, 'Especialización en Gerencia de Proyectos', 'POSGRADO'), (22, 'Especialización en Gerencia del Talento Humano', 'POSGRADO'),
    (23, 'Especialización en Gerencia Pública', 'POSGRADO'), (24, 'Especialización en Telecomunicaciones', 'POSGRADO'),
    (25, 'Especialización en Ingeniería Estructural', 'POSGRADO'), (26, 'Especialización en Instituciones Financieras', 'POSGRADO'),
    (27, 'Especialización en Psicología Clínica', 'POSGRADO'), (28, 'Especialización en Publicidad', 'POSGRADO'),
    (29, 'Especialización en Servicios de Salud', 'POSGRADO'), (30, 'Especialización en Teología', 'POSGRADO'),
    (31, 'Maestría en Administración de Empresas', 'POSGRADO'), (32, 'Maestría en Ciencias Económicas', 'POSGRADO'),
    (33, 'Maestría en Derecho Constitucional', 'POSGRADO'), (34, 'Maestría en Economía Aplicada', 'POSGRADO'),
    (35, 'Maestría en Educación: Gerencia', 'POSGRADO'), (36, 'Maestría en Educación: Aprendizaje', 'POSGRADO'),
    (37, 'Maestría en Filosofía', 'POSGRADO'), (38, 'Maestría en Gerencia de Proyectos', 'POSGRADO'),
    (39, 'Maestría en Ingeniería Ambiental', 'POSGRADO'), (40, 'Maestría en Instituciones Financieras', 'POSGRADO'),
    (41, 'Maestría en Periodismo', 'POSGRADO'), (42, 'Maestría en Sistemas de Información', 'POSGRADO'),
    (43, 'Maestría en Sistemas de la Calidad', 'POSGRADO'), (44, 'Maestría en Teología Bíblica', 'POSGRADO'),
    (45, 'Maestría en Teología Espiritual', 'POSGRADO'), (46, 'Maestría en Teología Fundamental', 'POSGRADO'),
    (47, 'Maestría en Teología Pastoral', 'POSGRADO'), (48, 'Postdoctorado en Ciencias de la Salud', 'POSGRADO'),
    (49, 'Postdoctorado en Educación', 'POSGRADO'), (50, 'Programa de Ampliación Administrativa', 'POSGRADO');


-- 2. TABLA MAESTRA DE MIEMBROS (IDs 1-60)
-- =====================================================================================

INSERT INTO Miembro (id_miembro, nombre_usuario, clave, tipo_miembro, fecha_registro) VALUES
    -- [1-10] ESTUDIANTES
    (1, 'avmendoza.23', 'avmendoza.23_pass', 'P', '2023-09-15'),
    (2, 'carodriguez.23', 'carodriguez.23_pass', 'P', '2023-09-15'),
    (3, 'vsfernandez.22', 'vsfernandez.22_pass', 'P', '2022-09-10'),
    (4, 'jdgonzalez.24', 'jdgonzalez.24_pass', 'P', '2024-01-12'),
    (5, 'milopez.21', 'milopez.21_pass', 'P', '2021-09-18'),
    (6, 'raperez.23', 'raperez.23_pass', 'P', '2023-02-20'),
    (7, 'sicastillo.22', 'sicastillo.22_pass', 'P', '2022-10-05'),
    (8, 'matorres.24', 'matorres.24_pass', 'P', '2024-03-01'),
    (9, 'dfruiz.21', 'dfruiz.21_pass', 'P', '2021-11-15'),
    (10, 'gesanchez.23', 'gesanchez.23_pass', 'P', '2023-05-22'),

    -- [11-20] PROFESORES
    (11, 'jamartinez.10', 'jamartinez.10_pass', 'P', '2010-01-15'),
    (12, 'aphernandez.15', 'aphernandez.15_pass', 'P', '2015-03-20'),
    (13, 'leblanco.08', 'leblanco.08_pass', 'P', '2008-09-01'),
    (14, 'emgomez.18', 'emgomez.18_pass', 'P', '2018-02-15'),
    (15, 'fjsilva.12', 'fjsilva.12_pass', 'P', '2012-11-30'),
    (16, 'padiaz.20', 'padiaz.20_pass', 'P', '2020-05-10'),
    (17, 'ramorales.05', 'ramorales.05_pass', 'P', '2005-08-25'),
    (18, 'clortiz.16', 'clortiz.16_pass', 'P', '2016-01-22'),
    (19, 'haramirez.19', 'haramirez.19_pass', 'P', '2019-09-12'),
    (20, 'tmvargas.14', 'tmvargas.14_pass', 'P', '2014-04-05'),

    -- [21-30] EGRESADOS
    (21, 'pjalvarado.10', 'pjalvarado.10_pass', 'P', '2015-11-20'),
    (22, 'lfmendez.13', 'lfmendez.13_pass', 'P', '2018-07-15'),
    (23, 'jiromero.07', 'jiromero.07_pass', 'P', '2012-05-30'),
    (24, 'pagil.15', 'pagil.15_pass', 'P', '2020-11-10'),
    (25, 'afsuarez.11', 'afsuarez.11_pass', 'P', '2016-12-05'),
    (26, 'cpvega.14', 'cpvega.14_pass', 'P', '2019-06-25'),
    (27, 'merios.09', 'merios.09_pass', 'P', '2014-09-18'),
    (28, 'icparedes.12', 'icparedes.12_pass', 'P', '2017-03-12'),
    (29, 'dafarias.16', 'dafarias.16_pass', 'P', '2021-11-30'),
    (30, 'nvleon.08', 'nvleon.08_pass', 'P', '2013-02-28'),

    -- [31-40] PERSONAL
    (31, 'ajguzman.10', 'ajguzman.10_pass', 'P', '2010-05-15'),
    (32, 'besalas.12', 'besalas.12_pass', 'P', '2012-08-20'),
    (33, 'camjia.08', 'camjia.08_pass', 'P', '2008-11-10'),
    (34, 'dvquintero.15', 'dvquintero.15_pass', 'P', '2015-02-25'),
    (35, 'erlara.19', 'erlara.19_pass', 'P', '2019-06-30'),
    (36, 'fdnavarro.14', 'fdnavarro.14_pass', 'P', '2014-10-05'),
    (37, 'gapacheco.17', 'gapacheco.17_pass', 'P', '2017-01-15'),
    (38, 'hmserrano.11', 'hmserrano.11_pass', 'P', '2011-04-22'),
    (39, 'ilrosales.16', 'ilrosales.16_pass', 'P', '2016-09-08'),
    (40, 'jkzambrano.13', 'jkzambrano.13_pass', 'P', '2013-12-01'),

    -- [41-50] DEPENDENCIAS (10 Entidades)
    (41, 'escuela.informatica', 'escuela.informatica_pass', 'D', '2000-01-15'),
    (42, 'direccion.egresados', 'direccion.egresados_pass', 'D', '2005-03-20'),
    (43, 'centro.estudiantes', 'centro.estudiantes_pass', 'D', '2010-09-01'),
    (44, 'direccion.cultura', 'direccion.cultura_pass', 'D', '1998-11-15'),
    (45, 'escuela.psicologia', 'escuela.psicologia_pass', 'D', '2002-05-10'),
    (46, 'secretaria.general', 'secretaria.general_pass', 'D', '1999-01-10'),
    (47, 'deportes.ucab', 'deportes.ucab_pass', 'D', '2005-06-20'),
    (48, 'cic.ucab', 'cic.ucab_pass', 'D', '2010-04-15'),
    (49, 'biblioteca.central', 'biblioteca.central_pass', 'D', '1998-05-30'),
    (50, 'escuela.derecho', 'escuela.derecho_pass', 'D', '2001-09-12'),

    -- [51-60] ORGANIZACIONES (10 Entidades)
    (51, 'empresas.polar', 'empresas.polar_pass', 'O', '2015-05-20'),
    (52, 'fundacion.telefonica', 'fundacion.telefonica_pass', 'O', '2018-08-15'),
    (53, 'banco.mercantil', 'banco.mercantil_pass', 'O', '2016-02-10'),
    (54, 'nestle.venezuela', 'nestle.venezuela_pass', 'O', '2019-11-05'),
    (55, 'pwc.venezuela', 'pwc.venezuela_pass', 'O', '2020-01-30'),
    (56, 'chevron.venezuela', 'chevron.venezuela_pass', 'O', '2025-02-10'),
    (57, 'farmatodo.sa', 'farmatodo.sa_pass', 'O', '2025-03-15'),
    (58, 'cruz.roja', 'cruz.roja_pass', 'O', '2025-04-20'),
    (59, 'unicef.venezuela', 'unicef.venezuela_pass', 'O', '2025-05-25'),
    (60, 'proyectos.maizina', 'proyectos.maizina_pass', 'O', '2025-06-30');


-- 3. DETALLE DE PERSONAS (IDs 1-40)
-- =====================================================================================
INSERT INTO Persona (id_miembro, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, sexo, correo_universitario) VALUES
    -- ESTUDIANTES
    (1, 'V', 30111222, 'Andrea', 'Mendoza', '2004-05-15', 'F', 'avmendoza.23@est.edu.ucab.ve'),
    (2, 'V', 30222333, 'Carlos', 'Rodriguez', '2003-08-20', 'M', 'carodriguez.23@est.edu.ucab.ve'),
    (3, 'V', 29888777, 'Valeria', 'Fernandez', '2002-12-10', 'F', 'vsfernandez.22@est.edu.ucab.ve'),
    (4, 'E', 85556662, 'Jesus', 'Gonzalez', '2005-01-30', 'M', 'jdgonzalez.24@est.edu.ucab.ve'),
    (5, 'V', 29111000, 'Mariana', 'Lopez', '2001-07-25', 'F', 'milopez.21@est.edu.ucab.ve'),
    (6, 'V', 30444555, 'Roberto', 'Perez', '2004-03-14', 'M', 'raperez.23@est.edu.ucab.ve'),
    (7, 'V', 30999888, 'Sofia', 'Castillo', '2003-11-02', 'F', 'sicastillo.22@est.edu.ucab.ve'),
    (8, 'V', 31000111, 'Miguel', 'Torres', '2005-09-09', 'M', 'matorres.24@est.edu.ucab.ve'),
    (9, 'V', 29555444, 'Daniela', 'Ruiz', '2002-04-18', 'F', 'dfruiz.21@est.edu.ucab.ve'),
    (10, 'V', 30222111, 'Gabriel', 'Sanchez', '2003-06-30', 'M', 'gesanchez.23@est.edu.ucab.ve'),
    
    -- PROFESORES
    (11, 'V', 12345678, 'Jose', 'Martinez', '1975-02-15', 'M', 'jamartinez.10@edu.ucab.ve'),
    (12, 'V', 13456789, 'Ana', 'Hernandez', '1980-06-20', 'F', 'aphernandez.15@edu.ucab.ve'),
    (13, 'V', 10111222, 'Luis', 'Blanco', '1968-11-05', 'M', 'leblanco.08@edu.ucab.ve'),
    (14, 'E', 55566677, 'Elena', 'Gomez', '1985-03-12', 'F', 'emgomez.18@edu.ucab.ve'),
    (15, 'V', 15666777, 'Fernando', 'Silva', '1979-09-28', 'M', 'fjsilva.12@edu.ucab.ve'),
    (16, 'V', 18999000, 'Patricia', 'Diaz', '1988-12-01', 'F', 'padiaz.20@edu.ucab.ve'),
    (17, 'V', 9888777, 'Ricardo', 'Morales', '1965-07-14', 'M', 'ramorales.05@edu.ucab.ve'),
    (18, 'V', 16555444, 'Carmen', 'Ortiz', '1982-04-22', 'F', 'clortiz.16@edu.ucab.ve'),
    (19, 'V', 17222333, 'Hugo', 'Ramirez', '1983-10-30', 'M', 'haramirez.19@edu.ucab.ve'),
    (20, 'V', 14111222, 'Teresa', 'Vargas', '1977-01-18', 'F', 'tmvargas.14@edu.ucab.ve'),
    
    -- EGRESADOS
    (21, 'V', 20111222, 'Pedro', 'Alvarado', '1990-05-10', 'M', 'pjalvarado.10@ucab.ve'),
    (22, 'V', 22333444, 'Lucia', 'Mendez', '1993-08-15', 'F', 'lfmendez.13@ucab.ve'),
    (23, 'V', 18555666, 'Javier', 'Romero', '1988-12-20', 'M', 'jiromero.07@ucab.ve'),
    (24, 'V', 24888999, 'Paola', 'Gil', '1995-02-25', 'F', 'pagil.15@ucab.ve'),
    (25, 'V', 21444555, 'Andres', 'Suarez', '1991-06-30', 'M', 'afsuarez.11@ucab.ve'),
    (26, 'V', 23777888, 'Camila', 'Vega', '1994-10-05', 'F', 'cpvega.14@ucab.ve'),
    (27, 'V', 19222333, 'Manuel', 'Rios', '1989-03-14', 'M', 'merios.09@ucab.ve'),
    (28, 'V', 22000111, 'Isabel', 'Paredes', '1992-07-22', 'F', 'icparedes.12@ucab.ve'),
    (29, 'V', 25666777, 'Diego', 'Farias', '1996-11-18', 'M', 'dafarias.16@ucab.ve'),
    (30, 'V', 18111222, 'Natalia', 'Leon', '1987-01-28', 'F', 'nvleon.08@ucab.ve'),
    
    -- PERSONAL
    (31, 'V', 14555666, 'Alberto', 'Guzman', '1978-03-10', 'M', 'ajguzman.10@ucab.ve'),
    (32, 'V', 16222333, 'Beatriz', 'Salas', '1981-07-15', 'F', 'besalas.12@ucab.ve'),
    (33, 'V', 11888999, 'Cesar', 'Mejia', '1970-12-20', 'M', 'camjia.08@ucab.ve'),
    (34, 'V', 19444555, 'Diana', 'Quintero', '1986-05-05', 'F', 'dvquintero.15@ucab.ve'),
    (35, 'V', 22777888, 'Eduardo', 'Lara', '1992-09-25', 'M', 'erlara.19@ucab.ve'),
    (36, 'V', 17999000, 'Fabiola', 'Navarro', '1984-02-14', 'F', 'fdnavarro.14@ucab.ve'),
    (37, 'V', 20333444, 'Gustavo', 'Pacheco', '1989-06-18', 'M', 'gapacheco.17@ucab.ve'),
    (38, 'V', 15111222, 'Hilda', 'Serrano', '1979-10-30', 'F', 'hmserrano.11@ucab.ve'),
    (39, 'V', 21666777, 'Ignacio', 'Rosales', '1990-01-22', 'M', 'ilrosales.16@ucab.ve'),
    (40, 'V', 18444333, 'Julia', 'Zambrano', '1985-11-12', 'F', 'jkzambrano.13@ucab.ve');


-- 4. DETALLE DE DEPENDENCIAS Y ORGANIZACIONES (IDs 41-60)
-- =====================================================================================

INSERT INTO Dependencia_universitaria (id_miembro, nombre_dependencia, telefono, correo_contacto, descripcion) VALUES
    (41, 'Escuela de Ingeniería Informática', '0212-407-4400', 'ingenieria@ucab.edu.ve', 'Academia.'),
    (42, 'Dirección de Egresados UCAB', '0212-407-4100', 'egresados@ucab.edu.ve', 'Enlace.'),
    (43, 'Centro de Estudiantes Ingeniería', '0212-407-4401', 'ceing@ucab.edu.ve', 'Estudiantil.'),
    (44, 'Dirección de Cultura', '0212-407-4500', 'cultura@ucab.edu.ve', 'Cultura.'),
    (45, 'Escuela de Psicología', '0212-407-4200', 'psicologia@ucab.edu.ve', 'Academia.'),
    (46, 'Secretaría General', '0212-407-3300', 'secretaria@ucab.edu.ve', 'Administrativo.'),
    (47, 'Dirección de Deportes', '0212-407-5500', 'deportes@ucab.edu.ve', 'Deportes.'),
    (48, 'Centro de Investigaciones', '0212-407-6600', 'cic@ucab.edu.ve', 'Investigación.'),
    (49, 'Biblioteca Central', '0212-407-7700', 'biblioteca@ucab.edu.ve', 'Servicios.'),
    (50, 'Escuela de Derecho', '0212-407-8800', 'derecho@ucab.edu.ve', 'Academia.');

INSERT INTO Organizacion_asociada (id_miembro, nombre_organizacion, tipo_documento, numero_documento, correo_contacto, descripcion) VALUES
    (51, 'Empresas Polar', 'J', 1234, 'talento@polar.com', 'Alimentos.'),
    (52, 'Fundación Telefónica', 'J', 5678, 'educacion@telefonica.com', 'Tecnología.'),
    (53, 'Banco Mercantil', 'J', 9012, 'reclutamiento@mercantil.com', 'Banca.'),
    (54, 'Nestlé Venezuela', 'J', 3456, 'rrhh@nestle.com', 'Alimentos.'),
    (55, 'PwC Venezuela', 'J', 7890, 'careers@pwc.com', 'Consultoría.'),
    (56, 'Chevron Venezuela', 'J', 1111, 'rrhh@chevron.com', 'Energía.'),
    (57, 'Farmatodo S.A.', 'J', 2222, 'empleos@farmatodo.com', 'Salud.'),
    (58, 'Cruz Roja Venezolana', 'J', 3333, 'voluntariado@cruzroja.org', 'Salud.'),
    (59, 'UNICEF Venezuela', 'J', 4444, 'caracas@unicef.org', 'ONG.'),
    (60, 'Proyectos Maizina', 'J', 5555, 'contacto@maizina.com', 'RSE.');


-- 5. ASIGNACIÓN DE ROLES
-- =====================================================================================

INSERT INTO Estudiante (id_miembro) VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);

INSERT INTO Profesor (id_miembro, ensena_desde, categoria, dedicacion) VALUES 
    (11, '2010-09-01', 'Ordinario', 'Tiempo completo'), 
    (12, '2015-03-25', 'Contratado', 'Medio tiempo'),
    (13, '2008-09-15', 'Ordinario', 'Tiempo completo'), 
    (14, '2018-02-20', 'Contratado', 'Tiempo completo'),
    (15, '2012-11-01', 'Ordinario', 'Medio tiempo'), 
    (16, '2020-05-15', 'Contratado', 'Medio tiempo'),
    (17, '2005-10-01', 'Ordinario', 'Tiempo completo'), 
    (18, '2016-02-01', 'Contratado', 'Tiempo completo'),
    (19, '2019-09-20', 'Ordinario', 'Medio tiempo'), 
    (20, '2014-04-10', 'Contratado', 'Medio tiempo');
INSERT INTO Egresado (id_miembro) VALUES (21), (22), (23), (24), (25), (26), (27), (28), (29), (30);

INSERT INTO Personal (id_miembro, cargo) VALUES 
    (31, 'Secretaria'), (32, 'Analista'), (33, 'Coordinador'), (34, 'Asistente'),
    (35, 'Técnico'), (36, 'Bibliotecaria'), (37, 'Soporte'), (38, 'Director'),
    (39, 'Vigilante'), (40, 'Contable');

	
--=====================================================================================
-- 1. JERARQUÍA UNIVERSITARIA (Facultades, Escuelas, Departamentos)
-- =====================================================================================

-- Vinculación de Facultades con su Dependencia principal
INSERT INTO Facultad (id_facultad, id_dependencia) VALUES
    (1, 41), -- Facultad de Ingeniería (Vinculada a Escuela de Ing. Informática)
    (2, 45); -- Facultad de Psicología (Vinculada a Escuela de Psicología)

-- Vinculación de Escuelas a Facultades
INSERT INTO Escuela (id_escuela, id_facultad) VALUES
    (1, 1), -- Escuela de Informática -> Pertenece a Facultad de Ingeniería
    (2, 2); -- Escuela de Psicología -> Pertenece a Facultad de Psicología

-- Creación de Departamentos dentro de las Facultades
INSERT INTO Departamento (id_departamento, id_facultad) VALUES
    -- Ingeniería (Facultad 1)
    (1, 1), -- Depto. Sistemas Operativos
    (2, 1), -- Depto. Ingeniería de Software
    (3, 1), -- Depto. Redes y Telecomunicaciones
    -- Psicología (Facultad 2)
    (4, 2), -- Depto. Psicología Clínica
    (5, 2); -- Depto. Psicología Organizacional


-- =====================================================================================
-- SCRIPT MAESTRO PARTE 2: VINCULACIONES ACADÉMICAS Y LABORALES
-- =====================================================================================

-- 1. RELACIÓN ESTUDIANTES -> CARRERAS (Tabla 'Estudia')
-- =====================================================================================
INSERT INTO Estudia (id_estudiante, id_carrera, fecha_inicio) VALUES
    (1, 7, '2023-09-15'),   -- Andrea -> Doctorado Ingeniería
    (2, 42, '2023-09-15'),  -- Carlos -> Maestría Sistemas
    (3, 24, '2022-09-10'),  -- Valeria -> Telecomunicaciones
    (4, 7, '2024-01-12'),   -- Jesus -> Doctorado Ingeniería
    (5, 25, '2021-09-18'),  -- Mariana -> Ing. Estructural
    (6, 8, '2023-02-20'),   -- Roberto -> Doctorado Psicología
    (7, 27, '2022-10-05'),  -- Sofia -> Psicología Clínica
    (8, 28, '2024-03-01'),  -- Miguel -> Publicidad
    (9, 4, '2021-11-15'),   -- Daniela -> Doctorado Educación
    (10, 43, '2023-05-22'); -- Gabriel -> Sistemas Calidad


-- 2. RELACIÓN PROFESORES -> ESCUELAS Y CARRERAS
-- =====================================================================================
-- A. Trabaja_con (Profesor -> Escuela)
INSERT INTO Trabaja_con (id_profesor, id_escuela, fecha_ingreso) VALUES
    -- Ingeniería (Escuela 1)
    (11, 1, '2010-09-01'), (12, 1, '2015-03-25'), (13, 1, '2008-09-15'),
    (14, 1, '2018-02-20'), (15, 1, '2012-11-01'),
    -- Psicología (Escuela 2)
    (16, 2, '2020-05-15'), (17, 2, '2005-10-01'), (18, 2, '2016-02-01'),
    (19, 2, '2019-09-20'), (20, 2, '2014-04-10');

-- B. Ensena_en (Profesor -> Carrera)
INSERT INTO Ensena_en (id_profesor, id_carrera) VALUES
    (11, 7), (12, 24), (13, 25), (14, 39), (15, 42), -- Profesores Ingeniería
    (16, 8), (17, 27), (18, 18), (19, 8), (20, 27);  -- Profesores Psicología


-- 3. RELACIÓN EGRESADOS -> CARRERAS (Se_graduo_de)
-- =====================================================================================
INSERT INTO Se_graduo_de (id_egresado, id_carrera, fecha_graduacion) VALUES
    (21, 7, '2015-11-20'),  -- Alvarado -> Dr. Ingeniería
    (22, 11, '2018-07-15'), -- Mendez -> Derecho Admin
    (23, 42, '2012-05-30'), -- Romero -> Sistemas
    (24, 27, '2020-11-10'), -- Gil -> Clínica
    (25, 31, '2016-12-05'), -- Suarez -> MBA
    (26, 41, '2019-06-25'), -- Vega -> Periodismo
    (27, 25, '2014-09-18'), -- Rios -> Estructural
    (28, 8, '2017-03-12'),  -- Paredes -> Dr. Psicología
    (29, 24, '2021-11-30'), -- Farias -> Telecom
    (30, 22, '2013-02-28'); -- Leon -> Talento Humano


-- 4. RELACIÓN PERSONAL -> DEPENDENCIA (Trabaja_para)
-- =====================================================================================
INSERT INTO Trabaja_para (id_personal, id_dependencia, fecha_ingreso) VALUES
    (31, 41, '2010-05-15'), -- Guzman -> Esc. Informática
    (32, 41, '2012-08-20'), -- Salas -> Esc. Informática
    (33, 42, '2008-11-10'), -- Mejia -> Dir. Egresados
    (34, 43, '2015-02-25'), -- Quintero -> Centro Estudiantes
    (35, 41, '2019-06-30'), -- Lara -> Esc. Informática
    (36, 44, '2014-10-05'), -- Navarro -> Cultura
    (37, 41, '2017-01-15'), -- Pacheco -> Esc. Informática
    (38, 45, '2011-04-22'), -- Serrano -> Esc. Psicología
    (39, 43, '2016-09-08'), -- Rosales -> Centro Estudiantes
    (40, 42, '2013-12-01'); -- Zambrano -> Dir. Egresados

-- 1. GRUPOS Y MEMBRESÍA
-- =====================================================================================
INSERT INTO Grupo (id_grupo, cantidad_miembro, descripcion_grupo, tipo_grupo) VALUES
    (1, 10, 'Red Egresados UCAB', 'Privado'),
    (2, 10, 'Foro Estudiantes', 'Publico'),
    (3, 10, 'Personal Admin', 'Privado'),
    (4, 10, 'Colaboración Docente', 'Privado');

INSERT INTO Crea (id_grupo, id_usuario) VALUES 
    (1, 21), (2, 1), (3, 31), (4, 11);

INSERT INTO Pertenece (id_grupo, id_usuario, rol) VALUES
    -- Grupo 1 (Egresados)
    (1, 21, 'Administrador'), (1, 22, 'Miembro'), (1, 23, 'Miembro'), (1, 24, 'Miembro'), (1, 25, 'Miembro'),
    -- Grupo 2 (Estudiantes)
    (2, 1, 'Administrador'), (2, 2, 'Miembro'), (2, 3, 'Miembro'), (2, 4, 'Miembro'), (2, 5, 'Miembro'),
    -- Grupo 3 (Personal)
    (3, 31, 'Administrador'), (3, 32, 'Miembro'), (3, 33, 'Miembro'), (3, 34, 'Miembro'), (3, 35, 'Miembro'),
    -- Grupo 4 (Profesores)
    (4, 11, 'Administrador'), (4, 12, 'Miembro'), (4, 13, 'Miembro'), (4, 14, 'Miembro'), (4, 15, 'Miembro');

INSERT INTO Mensaje (id_mensaje, tiempo_mensaje, id_grupo, id_usuario, contenido_textual, contenido_multimedia) VALUES
    (1, '2025-11-20 10:00:00', 1, 21, 'Hola a todos los egresados.', NULL),
    (2, '2025-11-20 14:30:00', 2, 2, '¿Alguien tiene apuntes de BD?', NULL),
    (3, '2025-11-21 09:10:00', 3, 31, 'Reunión mañana a las 10.', NULL),
    (4, '2025-11-21 15:45:00', 4, 12, 'Propongo nueva metodología.', NULL);


-- 2. EVENTOS (25 Registros)
-- =====================================================================================
INSERT INTO Evento (id_evento, nombre_evento, id_organizador, aforo, fecha_inicio, fecha_fin, hora_inicio, hora_fin, categoria, lugar) VALUES
    -- [ENERO]
    (1, 'Bienvenida Ing. 2025', 41, 200, '2025-01-15', '2025-01-15', '08:00:00', '12:00:00', 'Conferencia', 'Auditorio'),
    (2, 'Feria de Empleo Nestlé', 49, 300, '2025-01-25', '2025-01-25', '09:00:00', '16:00:00', 'Conferencia', 'Plaza Central'),
    
    -- [FEBRERO]
    (3, 'Networking Profesional', 42, 80, '2025-02-14', '2025-02-14', '18:00:00', '21:00:00', 'Encuentro de egresados', 'Sala Usos Múltiples'),
    (4, 'Taller de Finanzas', 48, 50, '2025-02-20', '2025-02-20', '14:00:00', '17:00:00', 'Taller', 'Aula 101'),

    -- [MARZO]
    (5, 'Simposio Psicología', 45, 150, '2025-03-10', '2025-03-10', '09:00:00', '15:00:00', 'Conferencia', 'Auditorio Cincuentenario'),
    (6, 'Mujeres en Tech', 47, 100, '2025-03-08', '2025-03-08', '10:00:00', '13:00:00', 'Conferencia', 'Biblioteca'),

    -- [ABRIL]
    (7, 'Feria de Ciencias', 41, 200, '2025-04-20', '2025-04-21', '10:00:00', '16:00:00', 'Competencia', 'Plaza Cubierta'),
    (8, 'Datathon Bancario', 48, 60, '2025-04-15', '2025-04-16', '08:00:00', '18:00:00', 'Competencia', 'Labs Informática'),

    -- [MAYO]
    (9, 'Festival de Teatro', 44, 400, '2025-05-15', '2025-05-20', '16:00:00', '20:00:00', 'Conferencia', 'Aula Magna'),
    (10, 'Webinar Consultoría', 50, 500, '2025-05-25', '2025-05-25', '10:00:00', '12:00:00', 'Webinar', 'Online'),

    -- [JUNIO]
    (11, 'Torneo Robótica', 43, 60, '2025-06-01', '2025-06-02', '09:00:00', '16:00:00', 'Competencia', 'Feria UCAB'),
    (12, 'Charla Nutrición', 46, 120, '2025-06-15', '2025-06-15', '11:00:00', '13:00:00', 'Conferencia', 'Auditorio'),

    -- [JULIO]
    (13, 'Bootcamp Python', 47, 40, '2025-07-01', '2025-07-30', '08:00:00', '12:00:00', 'Taller', 'Sala Web'),
    (14, 'Cierre de Semestre', 43, 300, '2025-07-25', '2025-07-25', '12:00:00', '18:00:00', 'Conferencia', 'Jardines'),

    -- [AGOSTO]
    (15, 'Reto Polar 2025', 46, 50, '2025-08-15', '2025-08-15', '08:00:00', '16:00:00', 'Competencia', 'Planta Polar'),
    (16, 'Cursos Verano', 41, 100, '2025-08-01', '2025-08-30', '08:00:00', '12:00:00', 'Taller', 'Módulo 3'),

    -- [SEPTIEMBRE]
    (17, 'Bienvenida Septiembre', 43, 250, '2025-09-20', '2025-09-20', '09:00:00', '14:00:00', 'Conferencia', 'Aula Magna'),
    (18, 'Caso de Estudio PwC', 50, 60, '2025-09-22', '2025-09-24', '08:00:00', '17:00:00', 'Competencia', 'Postgrado'),

    -- [OCTUBRE]
    (19, 'Semana Ingeniería', 41, 500, '2025-10-20', '2025-10-25', '08:00:00', '18:00:00', 'Conferencia', 'Hermano Lanz'),
    (20, 'Taller Ciberseguridad', 41, 40, '2025-10-10', '2025-10-10', '14:00:00', '17:00:00', 'Taller', 'Lab Redes'),

    -- [NOVIEMBRE]
    (21, 'Hackathon 2025', 41, 100, '2025-11-15', '2025-11-16', '08:00:00', '18:00:00', 'Competencia', 'Labs'),
    (22, 'Cine Foro Cultura', 44, 80, '2025-11-05', '2025-11-05', '16:00:00', '19:00:00', 'Conferencia', 'Auditorio'),
    (23, 'Feria de Salud', 49, 200, '2025-11-20', '2025-11-20', '09:00:00', '15:00:00', 'Conferencia', 'Plaza'),

    -- [DICIEMBRE]
    (24, 'Encuentro Egresados', 42, 300, '2025-12-01', '2025-12-01', '19:00:00', '23:00:00', 'Encuentro de egresados', 'Jardines'),
    (25, 'Misa de Navidad', 44, 400, '2025-12-10', '2025-12-10', '11:00:00', '13:00:00', 'Conferencia', 'Parroquia');


-- 3. ASISTENCIA (Solo IDs 1-40: Estudiantes, Profesores, Egresados, Personal)
-- =====================================================================================
INSERT INTO Asiste (id_persona, id_evento) VALUES
    -- Evento 1 (Bienvenida): Estudiantes (1-10)
    (1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
    
    -- Evento 2 (Feria Empleo): Egresados (21-30) y Estudiantes Finalistas
    (21, 2), (22, 2), (23, 2), (24, 2), (25, 2), (9, 2), (10, 2),
    
    -- Evento 3 (Networking): Egresados
    (26, 3), (27, 3), (28, 3), (29, 3), (30, 3),
    
    -- Evento 5 (Simposio Psicología): Profesores y Estudiantes
    (16, 5), (17, 5), (18, 5), (6, 5), (7, 5),
    
    -- Evento 9 (Teatro): Personal Administrativo (31-40)
    (31, 9), (32, 9), (33, 9), (34, 9), (35, 9), (36, 9),
    
    -- Evento 11 (Robótica): Estudiantes Ingeniería
    (1, 11), (2, 11), (4, 11),
    
    -- Evento 15 (Reto Polar): Mezcla
    (1, 15), (5, 15), (21, 15), (25, 15),
    
    -- Evento 19 (Semana Ingeniería): Todos los estudiantes de Ing y Profesores
    (1, 19), (2, 19), (3, 19), (4, 19), (5, 19), (11, 19), (12, 19), (13, 19),
    
    -- Evento 21 (Hackathon Nov): Estudiantes y Profesores
    (1, 21), (2, 21), (3, 21), (11, 21), (12, 21),
    
    -- Evento 24 (Egresados Dic): Todos los Egresados
    (21, 24), (22, 24), (23, 24), (24, 24), (25, 24), (26, 24), (27, 24), (28, 24), (29, 24), (30, 24),
    
    -- Evento 25 (Navidad): Personal y Profesores
    (31, 25), (32, 25), (38, 25), (11, 25), (12, 25), (20, 25);

	
-- =====================================================================================
-- 1. RELACIONES SOCIALES (Tabla 'Se_relaciona')
-- =====================================================================================
-- Define el grafo social (Amigos, Seguidores, etc.) entre los miembros base.

INSERT INTO Se_relaciona (id_receptor, id_solicitador, tipo_vinculo, naturaleza_del_vinculo, descripcion_del_vinculo, estado_vinculo) VALUES
    -- Bloque 1: AMIGO (SIMETRICA)
    (2, 1, 'SIMETRICA', 'AMIGO', 'Amigos confirmados en la universidad', 'ACEPTADA'),
    (4, 3, 'SIMETRICA', 'AMIGO', 'Solicitud de amistad enviada', 'ENVIO'),
    (6, 5, 'SIMETRICA', 'AMIGO', 'Solicitud pendiente de aceptación', 'PENDIENTE'),
    (8, 7, 'SIMETRICA', 'AMIGO', 'Amistad rechazada por el receptor', 'RECHAZADA'),
    (10, 9, 'SIMETRICA', 'AMIGO', 'Amigos de la infancia', 'ACEPTADA'),
    (1, 11, 'SIMETRICA', 'AMIGO', 'Solicitud enviada a 1', 'ENVIO'),
    (13, 12, 'SIMETRICA', 'AMIGO', 'Amigos con restricción de publicaciones', 'ACEPTADA'),
    (15, 14, 'SIMETRICA', 'AMIGO', 'Solicitud de amistad rechazada (bloqueo)', 'RECHAZADA'),
    (17, 16, 'SIMETRICA', 'AMIGO', 'Amistad pendiente de revisión', 'PENDIENTE'),

    -- Bloque 2: SIGUE (ASIMETRICA)
    (19, 18, 'ASIMETRICA', 'SIGUE', 'Usuario 18 sigue cuenta pública de 19', 'ACEPTADA'),
    (3, 20, 'ASIMETRICA', 'SIGUE', 'Usuario 20 sigue a 3, solicitud enviada', 'ENVIO'),
    (5, 4, 'ASIMETRICA', 'SIGUE', 'Usuario 4 sigue cuenta privada de 5, pendiente', 'PENDIENTE'),
    (7, 6, 'ASIMETRICA', 'SIGUE', 'Solicitud de seguimiento rechazada', 'RECHAZADA'),
    (9, 8, 'ASIMETRICA', 'SIGUE', 'Profesor seguido por estudiante', 'ACEPTADA'),
    (11, 10, 'ASIMETRICA', 'SIGUE', 'Seguimiento por interés académico', 'ACEPTADA'),
    (13, 15, 'ASIMETRICA', 'SIGUE', 'Intento de seguimiento rechazado', 'RECHAZADA'),

    -- Bloque 3: TIPIFICADO (Relaciones laborales/académicas)
    (12, 14, 'SIMETRICA', 'TIPIFICADO', 'Colegas del mismo departamento', 'ACEPTADA'),
    (16, 17, 'SIMETRICA', 'TIPIFICADO', 'Vínculo laboral, pendiente de confirmación', 'PENDIENTE'),
    (18, 19, 'SIMETRICA', 'TIPIFICADO', 'Vínculo rechazado por incompatibilidad', 'RECHAZADA'),
    (20, 1, 'SIMETRICA', 'TIPIFICADO', 'Vínculo de alianza estratégica', 'ACEPTADA'),
    
    (14, 12, 'ASIMETRICA', 'TIPIFICADO', 'Estudiante asignado como tutor de 12', 'ACEPTADA'),
    (1, 2, 'ASIMETRICA', 'TIPIFICADO', 'Relación de subordinación enviada', 'ENVIO'),
    (3, 4, 'ASIMETRICA', 'TIPIFICADO', 'Vínculo de mentoría, pendiente', 'PENDIENTE'),
    (5, 6, 'ASIMETRICA', 'TIPIFICADO', 'Vínculo de proveedor rechazado', 'RECHAZADA'),
    (7, 8, 'ASIMETRICA', 'TIPIFICADO', 'Relación de ex-alumno/profesor', 'ACEPTADA'),
    (9, 10, 'ASIMETRICA', 'TIPIFICADO', 'Relación de supervisor, enviado', 'ENVIO'),
    (11, 2, 'ASIMETRICA', 'TIPIFICADO', 'Vínculo pendiente de definición', 'PENDIENTE'),
    (13, 3, 'ASIMETRICA', 'TIPIFICADO', 'Relación de cliente/servicio, rechazada', 'RECHAZADA'),
    (15, 5, 'ASIMETRICA', 'TIPIFICADO', 'Vínculo de colaborador confirmado', 'ACEPTADA'),
    (17, 7, 'ASIMETRICA', 'TIPIFICADO', 'Solicitud de conexión enviada', 'ENVIO');

-- =====================================================================================
-- 2. RECURSOS (Archivos compartidos)
-- =====================================================================================

INSERT INTO Recurso (id_recurso, nombre_recurso, id_usuario_comparte, descripcion_recurso, fecha_cargado) VALUES
    (1,'Guía Algoritmos I', 1, 'Resumen completo para examen.', '2025-11-01 11:30:00'),
    (2,'Ejercicios Cálculo', 5, 'Integrales resueltas paso a paso.', '2025-11-05 08:45:00'),
    (3,'Paper: IA y Ética', 11, 'Investigación sobre IA generativa.', '2025-10-25 15:00:00'),
    (4,'Slides Base de Datos', 15, 'Clase de normalización y EER.', '2025-11-10 10:20:00'),
    (5,'Informe Mercado IT', 21, 'Análisis de demanda laboral LATAM.', '2025-11-15 13:00:00'),
    (6,'Manual Nómina 2025', 32, 'Procedimientos administrativos.', '2025-11-18 09:00:00'),
    -- Nuevos
    (7, 'Tesis: Redes Neuronales', 1, 'Proyecto final de grado.', '2025-01-20 09:00:00'),
    (8, 'Tutorial Python', 41, 'Intro a programación para ingenieros.', '2025-02-10 14:00:00'),
    (9, 'Ley Orgánica Trabajo', 3, 'PDF actualizado para la clase de Derecho.', '2025-03-05 16:30:00'),
    (10, 'Plantilla IEEE', 13, 'Formato oficial para papers.', '2025-04-12 10:00:00'),
    (11, 'Video: Historia Vzla', 44, 'Documental corto cultura.', '2025-05-20 18:00:00'),
    (12, 'Casos Clínicos Psicología', 16, 'Ejemplos anonimizados para práctica.', '2025-06-15 11:00:00'),
    (13, 'Formulario Inscripción', 46, 'Planilla para nuevos ingresos.', '2025-07-01 08:00:00'),
    (14, 'Reglamento Pasantías', 42, 'Normativa vigente 2025.', '2025-08-10 09:30:00'),
    (15, 'Calendario Académico', 46, 'Fechas importantes del periodo.', '2025-09-01 07:00:00'),
    (16, 'Oferta Pasantía Polar', 46, 'Requisitos para vacantes.', '2025-09-15 15:45:00'),
    (17, 'Becas Fundación', 47, 'Guía de postulación.', '2025-10-05 12:00:00'),
    (18, 'Data Set Bancario', 48, 'Datos de prueba para el Datathon.', '2025-11-01 10:00:00'),
    (19, 'Recetario Nutricional', 49, 'Guía de alimentación saludable.', '2025-11-25 14:00:00'),
    (20, 'Reporte Sostenibilidad', 50, 'Informe anual PwC.', '2025-12-05 16:00:00');

INSERT INTO Esta_en (id_recurso, id_idioma) VALUES
    (1, 1), (2, 1), (3, 2), (4, 1), (5, 2), (6, 1),
    (7, 1), (8, 2), (9, 1), (10, 2), (11, 1), (12, 1),
    (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 2), (19, 1), (20, 2);

INSERT INTO Utilizado_por (id_carrera, id_recurso) VALUES
    (7, 1), (7, 2), (7, 8), (24, 1), 
    (7, 3), (8, 3), (42, 3),         
    (7, 4), (42, 4), (42, 18),       
    (8, 12), (27, 12),               
    (3, 9), (13, 9),                 
    (31, 6), (22, 6);                

INSERT INTO Comparte (id_usuario, id_recurso, fecha_compartido) VALUES
    (1, 1, '2025-11-01 11:30:00'), (5, 2, '2025-11-05 08:45:00'), (11, 3, '2025-10-25 15:00:00'),
    (15, 4, '2025-11-10 10:20:00'), (21, 5, '2025-11-15 13:00:00'), (32, 6, '2025-11-18 09:00:00'),
    (1, 7, '2025-01-20 09:00:00'), (41, 8, '2025-02-10 14:00:00'), (3, 9, '2025-03-05 16:30:00'),
    (13, 10, '2025-04-12 10:00:00'), (44, 11, '2025-05-20 18:00:00'), (16, 12, '2025-06-15 11:00:00'),
    (46, 13, '2025-07-01 08:00:00'), (42, 14, '2025-08-10 09:30:00'), (46, 15, '2025-09-01 07:00:00'),
    (46, 16, '2025-09-15 15:45:00'), (47, 17, '2025-10-05 12:00:00'), (48, 18, '2025-11-01 10:00:00'),
    (49, 19, '2025-11-25 14:00:00'), (50, 20, '2025-12-05 16:00:00');
	
-- 3. PUBLICACIONES 
-- =====================================================================================
INSERT INTO Post (id_post, tiempo_post, id_usuario, contenido_textual_post) VALUES
    (1, '2025-11-01 09:00:00', 41, '¡Bienvenidos al nuevo período académico! #Ingeniería #UCAB'),
    (2, '2025-11-02 10:30:00', 1, 'Buscando equipo para el proyecto de Desarrollo de Software. DM.'),
    (3, '2025-11-05 14:00:00', 11, 'Las notas del parcial de Algoritmos ya están en el sistema.'),
    (4, '2025-11-10 16:20:00', 3, '¿Alguien sabe si la biblioteca abre los sábados?'),
    (5, '2025-11-15 08:00:00', 51, 'Empresas Polar abre su programa de pasantías 2026. ¡Postúlate!'),
    (6, '2025-11-18 11:45:00', 44, 'No se pierdan la obra de teatro este viernes en el Aula Magna.'),
    (7, '2025-11-20 13:15:00', 21, 'Orgulloso de visitar mi alma mater hoy. Todo está cambiado.'),
    (8, '2025-11-22 09:00:00', 45, 'Simposio de Salud Mental: Importancia del descanso en exámenes.'),
    (9, '2025-11-25 15:30:00', 5, 'Viendo clase de Cálculo III... recen por mí.'),
    (10, '2025-11-28 10:00:00', 57, 'Farmatodo busca desarrolladores Junior. Envía tu CV.'),
    (11, '2025-12-01 08:30:00', 46, 'Secretaría: El proceso de retiro de materias finaliza mañana.'),
    (12, '2025-12-02 12:00:00', 2, '¡Al fin terminé la tesis! Gracias totales.'),
    (13, '2025-12-03 14:45:00', 15, 'Comparto material extra sobre Normalización de Bases de Datos.'),
    (14, '2025-12-05 17:00:00', 42, 'Encuentro de Egresados este fin de semana. ¡Los esperamos!'),
    (15, '2025-12-08 09:00:00', 1, 'CONFIRMADO: Hackathon 2025 en alianza con Google. Premios en $$.'),
    (16, '2025-12-09 11:15:00', 8, 'El comedor hoy tiene pasticho, corran.'),
    (17, '2025-12-10 10:00:00', 53, 'Banco Mercantil ofrece charla sobre Finanzas Personales para jóvenes.'),
    (18, '2025-12-11 13:00:00', 6, 'Vendo libro de Física I en buen es2tado.'),
    (19, '2025-12-12 16:00:00', 1, 'Torneo de Fútbol Inter-Escuelas. Inscripciones abiertas.'),
    (20, '2025-12-14 20:00:00', 1, 'Estudiando un domingo por la noche... la vida del estudiante.');

INSERT INTO Publicacion (id_publicacion, id_post) VALUES
	(1,1),
	(2,3),
	(3,4),
	(4,6),
	(5,7),
	(6,8),
	(7,9),
	(8,11),
	(9,12),
	(10,13),
	(11,14),
	(12,16),
	(13,18),
	(14,20);

INSERT INTO Solicitud_de_Ayuda (id_solicitud, id_post) VALUES
	(1,2),
	(2,5),
	(3,10),
	(4,15),
	(5,17),
	(6,19);


-- 4. INTERACCIONES (LIKES Y COMENTARIOS)
-- =====================================================================================
-- Likes Post 10 (Viral)
INSERT INTO Gusta_de (id_miembro, id_publicacion, fecha_like) VALUES
(1, 10, NOW()), (2, 10, NOW()), (3, 10, NOW()), (4, 10, NOW()), (5, 10, NOW()),
(6, 10, NOW()), (7, 10, NOW()), (8, 10, NOW()), (9, 10, NOW()), (10, 10, NOW()),
(11, 10, NOW()), (21, 10, NOW()), (22, 10, NOW()), (31, 10, NOW()), (32, 10, NOW());

-- Likes Post 5 (Popular)
INSERT INTO Gusta_de (id_miembro, id_publicacion, fecha_like) VALUES
(1, 5, NOW()), (2, 5, NOW()), (3, 5, NOW()), (21, 5, NOW()), 
(22, 5, NOW()), (23, 5, NOW()), (41, 5, NOW()), (42, 5, NOW());

-- Likes Varios
INSERT INTO Gusta_de (id_miembro, id_publicacion, fecha_like) VALUES
(3, 2, NOW()), (4, 2, NOW()), (5, 2, NOW()), (6, 2, NOW()),
(1, 12, NOW()), (3, 12, NOW()), (11, 12, NOW()), (15, 12, NOW()), (21, 12, NOW()), (31, 12, NOW()),
(1, 14, NOW()), (2, 14, NOW()), (9, 14, NOW()), (10, 14, NOW()), (35, 14, NOW());

-- Comentarios
INSERT INTO Comentario (id_comentario, tiempo_comentario, id_miembro, id_publicacion, contenido_textual_comentario) VALUES
    (1, '2025-12-08 09:10:00', 2, 14, '¡Brutal! Ya estoy armando mi equipo.'),
    (2, '2025-12-08 09:15:00', 3, 14, '¿Se puede participar si soy de primer semestre?'),
    (3, '2025-12-08 09:30:00', 41, 14, 'Sí, es abierto a todos los niveles.'),
    (4, '2025-12-08 10:00:00', 21, 14, 'Excelente iniciativa, me gustaría ser mentor.'),
    (5, '2025-11-15 08:30:00', 1, 5, '¿Aceptan estudiantes de Ingeniería?'),
    (6, '2025-11-15 09:00:00', 51, 5, 'Sí, buscamos perfiles de Ingeniería.'),
    (7, '2025-11-15 09:15:00', 25, 5, 'Info enviada al DM.'),
    (8, '2025-11-02 11:00:00', 5, 2, 'Yo me anoto, soy bueno en Frontend.'),
    (9, '2025-11-02 11:05:00', 6, 2, 'A mí me falta equipo también.'),
    (10, '2025-12-02 12:10:00', 11, 12, '¡Felicidades Colega! Gran esfuerzo.'),
    (11, '2025-12-02 12:15:00', 1, 12, '¡Qué éxito! A celebrar.'),
    (12, '2025-12-09 11:20:00', 2, 14, 'Voy corriendo.'),
    (13, '2025-11-05 14:10:00', 4, 3, 'Profe, ¿cuándo es la revisión?');

INSERT INTO Responde_A (id_responde, id_respondido) VALUES (3, 2), (6, 5);

-- =====================================================================================
-- SCRIPT DE AJUSTE DE SECUENCIAS (REINICIO DE IDs)
-- =====================================================================================
-- 5. REINICIO DE SECUENCIAS (FINAL)
-- =====================================================================================
SELECT setval('miembro_id_miembro_seq', 100, true);
SELECT setval('post_id_post_seq', 100, true);
SELECT setval('publicacion_id_publicacion_seq', 100, true);
SELECT setval('comentario_id_comentario_seq', 100, true);
SELECT setval('evento_id_evento_seq', 100, true);
SELECT setval('grupo_id_grupo_seq', 100, true);