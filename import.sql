CREATE TABLE Usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL
);

CREATE TABLE ImgPerfil(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    imagen MEDIUMBLOB,
    mimetype VARCHAR(20),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios (id)
);

CREATE TABLE Cuidadores(
    id INT PRIMARY KEY,
    rol VARCHAR(10),
    FOREIGN KEY (id) REFERENCES Usuarios(id)
);

CREATE TABLE Tarjetas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    orden INT,
    categoria VARCHAR(100),
    activa BOOLEAN DEFAULT 1,
    texto text,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE Pictos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    idArasaac INT,
    enlace VARCHAR(200) NOT NULL,
    id_tarjeta INT NOT NULL,
    FOREIGN KEY (id_tarjeta) REFERENCES Tarjetas(id)
);

CREATE TABLE Imagenes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagen MEDIUMBLOB,
    mimetype VARCHAR(255),
    id_tarjeta INT NOT NULL,
    FOREIGN KEY (id_tarjeta) REFERENCES Tarjetas(id)
);

CREATE TABLE Config(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    texto BOOLEAN DEFAULT 0,
    picto_texto BOOLEAN DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE Entradas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    autor INT NOT NULL,
    cuerpo TEXT DEFAULT NULL,
    fecha_registro TIMESTAMP NULL DEFAULT NULL,
    emocion VARCHAR(200) DEFAULT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

CREATE TABLE Rutinas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    autor INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_portada INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
    FOREIGN KEY (id_portada) REFERENCES Tarjetas(id)
);

CREATE TABLE Rutinas_tarjeta(
    id_rutina INT NOT NULL,
    id_tarjeta INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY(id_rutina, id_tarjeta, orden),
    FOREIGN KEY (id_rutina) REFERENCES Rutinas(id),
    FOREIGN KEY (id_tarjeta) REFERENCES Tarjetas(id)
);

CREATE TABLE Entradas_tarjeta(
    id_entrada INT NOT NULL,
    id_tarjeta INT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (id_entrada, id_tarjeta, orden),
    FOREIGN KEY (id_entrada) REFERENCES Entradas(id),
    FOREIGN KEY (id_tarjeta) REFERENCES Tarjetas(id)
);

CREATE TABLE Cuidadores_Usu(
    id_cuidador INT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_cuidador, id_usuario),
    FOREIGN KEY (id_cuidador) REFERENCES Cuidadores(id),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
);

INSERT INTO Usuarios (id, nombre, usuario, contraseña) 
VALUES ('1', 'Pedro', 'pedro08', '$2b$10$JOQIdcGPaYHsjKf6Ks4Hge88z4YFKD8Yb/NYkFqJKpmklgfFc3VrC'); 
-- CONTRASEÑA: test
INSERT INTO Config(id, id_usuario, texto, picto_texto) 
VALUES ('1', '1', '0', '0');

INSERT INTO Usuarios(id, nombre, usuario, contraseña)
VALUES ('2', 'Lorena', 'lorena_gutierrez','$2b$10$XlExLG/5iWZ033toxDlSXeUMDU8/HnJkUviYsK/cLczoD3B.7VIdO'); -- CONTRASEÑA: test123

INSERT INTO Usuarios (id, nombre, usuario, contraseña) 
VALUES ('3', 'Marta', 'msanchez', '$2b$10$JOQIdcGPaYHsjKf6Ks4Hge88z4YFKD8Yb/NYkFqJKpmklgfFc3VrC'); 
-- CONTRASEÑA: test
INSERT INTO Config(id, id_usuario, texto, picto_texto) 
VALUES ('2', '3', '1', '0');

INSERT INTO Cuidadores (id, rol) 
VALUES ('2', 'Profesora');

INSERT INTO Cuidadores_Usu(id_cuidador, id_usuario)
VALUES ('2', '1');

INSERT INTO Cuidadores_Usu(id_cuidador, id_usuario)
VALUES ('2', '3');

INSERT INTO Tarjetas (id, id_usuario, orden, categoria, activa, texto) VALUES 
('1','1','1','Emocion',1,'Aburrimiento'),
('2','1','2','Emocion',1, 'Feliz'),
('3','1','3','Emocion',1, 'Sorpresa'),
('4','1','4','Objeto',1,'Casa');

INSERT INTO Pictos(id, idArasaac, enlace, id_tarjeta) VALUES 
('1','2245','https://api.arasaac.org/v1/pictograms/2245','1'),
('2','3250','https://api.arasaac.org/v1/pictograms/3250','2'),
('3', '2261', 'https://api.arasaac.org/v1/pictograms/2261', '3'),
('4', '6964', 'https://api.arasaac.org/v1/pictograms/6964', '4');


INSERT INTO Entradas (id, id_usuario, autor, cuerpo, fecha_registro, tipo) VALUES
('1','1', '1', NULL, '2025-03-01 11:30:00', "Picto"),
('2', '1', '2', 'Progresa adecuadamente', '2025-03-01 10:10:00', "Picto"),
('3', '3', '3', 'Hoy me he aburrido mucho en clase, y Laura me ha dado un trozo de su bocadillo', '2025-03-11 10:10:00', "Texto");



INSERT INTO Entradas_tarjeta (id_entrada, id_tarjeta, orden) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3);

INSERT INTO rutinas (id, id_usuario, nombre, autor, fecha_creacion) VALUES
(1, 1, 'Colegio', 2, '2025-03-01 23:00:00'),
(2, 1, 'Casa', 2, '2025-03-01 23:00:00'),
(3, 1, 'Aseo', 2, '2025-03-01 23:00:00');

INSERT INTO rutinas_tarjeta (id_rutina, id_tarjeta, orden) VALUES
(1, 1, 2),
(1, 3, 1);