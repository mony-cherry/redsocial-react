-- ==========================================================
-- ESTRUCTURA Y DATOS PARA RED SOCIAL API
-- Proyecto: Red Social Profesional - CESDE 2026
-- Instructor: Jossy Tello
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS red_social_db;
USE red_social_db;

-- 2. TABLA DE USUARIOS (Con soporte para contraseñas encriptadas)
CREATE TABLE IF NOT EXISTS usuarios (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  contrasena varchar(255) NOT NULL, -- Aquí se guardan los hashes de bcrypt
  biografia text DEFAULT NULL,
  ciudad varchar(100) DEFAULT 'Medellín',
  fecha_nacimiento date DEFAULT NULL,
  genero enum('Hombre','Mujer','Otro') DEFAULT NULL,
  avatar varchar(255) DEFAULT 'https://www.w3schools.com/w3images/avatar2.png',
  rol enum('admin','usuario') DEFAULT 'usuario',
  fecha_registro timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABLA DE PUBLICACIONES (El Muro)
CREATE TABLE IF NOT EXISTS publicaciones (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id int(11) NOT NULL,
  texto text NOT NULL,
  imagen_url varchar(255) DEFAULT NULL,
  fecha_creacion timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  CONSTRAINT fk_pub_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABLA DE LIKES (Relación N:M)
CREATE TABLE IF NOT EXISTS likes (
  id int(11) NOT NULL AUTO_INCREMENT,
  publicacion_id int(11) NOT NULL,
  usuario_id int(11) NOT NULL,
  fecha timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_like (publicacion_id, usuario_id), -- Evita likes duplicados
  CONSTRAINT fk_like_pub FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE,
  CONSTRAINT fk_like_usu FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABLA DE COMENTARIOS
CREATE TABLE IF NOT EXISTS comentarios (
  id int(11) NOT NULL AUTO_INCREMENT,
  publicacion_id int(11) NOT NULL,
  usuario_id int(11) NOT NULL,
  contenido text NOT NULL,
  fecha_comentario timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  CONSTRAINT fk_com_pub FOREIGN KEY (publicacion_id) REFERENCES publicaciones (id) ON DELETE CASCADE,
  CONSTRAINT fk_com_usu FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABLA DE GRUPOS
CREATE TABLE IF NOT EXISTS grupos (
  id int(11) NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  descripcion text DEFAULT NULL,
  imagen_url varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABLA DE MIEMBROS DE GRUPOS
CREATE TABLE IF NOT EXISTS miembros_grupos (
  grupo_id int(11) NOT NULL,
  usuario_id int(11) NOT NULL,
  fecha_union timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (grupo_id, usuario_id),
  CONSTRAINT fk_miembro_grupo FOREIGN KEY (grupo_id) REFERENCES grupos (id) ON DELETE CASCADE,
  CONSTRAINT fk_miembro_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABLA DE MENSAJES (Chat)
CREATE TABLE IF NOT EXISTS mensajes (
  id int(11) NOT NULL AUTO_INCREMENT,
  remitente_id int(11) NOT NULL,
  destinatario_id int(11) NOT NULL,
  contenido text NOT NULL,
  fecha timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  CONSTRAINT fk_msg_remitente FOREIGN KEY (remitente_id) REFERENCES usuarios (id),
  CONSTRAINT fk_msg_destinatario FOREIGN KEY (destinatario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- INSERCIÓN DE DATOS INICIALES (SEMILLAS)
-- ==========================================================

-- Usuarios de prueba (Las contraseñas son hashes de '123456')
INSERT INTO usuarios (nombre, email, contrasena, biografia, ciudad, genero) VALUES
('Jossy Tello', 'jossy@cesde.edu.co', '$2a$10$7R.xMc1Mh.uYV1j/tWpSHeFm5VpCj2vW/pCg6n.N.v6y7S1S/W2XW', 'Instructor de Software y apasionado por el deporte.', 'Medellín', 'Hombre'),
('Jane Doe', 'jane@mail.com', '$2a$10$7R.xMc1Mh.uYV1j/tWpSHeFm5VpCj2vW/pCg6n.N.v6y7S1S/W2XW', 'Diseñadora UI/UX y amante del café.', 'Bello', 'Mujer'),
('John Doe', 'john@mail.com', '$2a$10$7R.xMc1Mh.uYV1j/tWpSHeFm5VpCj2vW/pCg6n.N.v6y7S1S/W2XW', 'Desarrollador FullStack en formación.', 'Itagüí', 'Hombre');

-- Publicaciones iniciales
INSERT INTO publicaciones (usuario_id, texto, imagen_url) VALUES
(1, '¡Bienvenidos al taller de Node.js! Hoy conectamos Frontend con Backend.', 'https://www.w3schools.com/w3images/forest.jpg'),
(2, '¿Qué opinan de este nuevo diseño para la red social?', 'https://www.w3schools.com/w3images/nature.jpg');

-- Likes
INSERT INTO likes (publicacion_id, usuario_id) VALUES (1, 2), (1, 3), (2, 1);

-- Comentarios
INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES
(1, 2, '¡Excelente iniciativa, profe!'),
(2, 3, 'Me encantan los colores que usaste.');

-- Grupos
INSERT INTO grupos (nombre, descripcion, imagen_url) VALUES
('Diseñadores UI/UX', 'Espacio para compartir tendencias de diseño.', 'https://www.w3schools.com/w3images/avatar2.png'),
('Desarrollo Web 2026', 'Grupo oficial de estudiantes de último semestre.', 'https://www.w3schools.com/w3images/avatar5.png');

-- Mensajes de Chat
INSERT INTO mensajes (remitente_id, destinatario_id, contenido) VALUES
(1, 2, 'Hola Jane, ¿viste los ajustes que le hice al controlador de publicaciones?'),
(2, 1, 'Sí, Jossy. Quedó mucho más limpio el código.');

COMMIT;