const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initializeDatabase() {
    const database = process.env.DB_NAME || 'red_social_db';
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    console.log(`🔧 Preparando la base de datos ${database}...`);

    try {
        await connection.query('CREATE DATABASE IF NOT EXISTS ??', [database]);
        await connection.query('USE ??', [database]);

        // --- CREACIÓN DE TABLAS ---
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                contrasena VARCHAR(255) NOT NULL,
                biografia TEXT,
                ciudad VARCHAR(100) DEFAULT 'Medellín',
                fecha_nacimiento DATE DEFAULT NULL,
                genero ENUM('Hombre', 'Mujer', 'Otro') DEFAULT NULL,
                avatar VARCHAR(255) DEFAULT 'https://www.w3schools.com/w3images/avatar2.png',
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS publicaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT,
                texto TEXT NOT NULL,
                imagen_url VARCHAR(255),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                publicacion_id INT,
                usuario_id INT,
                FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                UNIQUE KEY unique_like (publicacion_id, usuario_id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS comentarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                publicacion_id INT,
                usuario_id INT,
                contenido TEXT NOT NULL,
                fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS grupos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                imagen_url VARCHAR(255)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS miembros_grupos (
                grupo_id INT NOT NULL,
                usuario_id INT NOT NULL,
                fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (grupo_id, usuario_id),
                FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS mensajes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                remitente_id INT,
                destinatario_id INT,
                contenido TEXT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (remitente_id) REFERENCES usuarios(id),
                FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
            )
        `);

        const [[{ totalUsuarios }]] = await connection.query(
            'SELECT COUNT(*) AS totalUsuarios FROM usuarios',
        );
        if (totalUsuarios > 0) {
            console.log("✅ La base de datos ya contiene usuarios; se conservaron los datos existentes.");
            return;
        }

        // --- INSERCIÓN DE DATOS (DATA SEEDING) ---
        console.log("📝 Poblando todas las tablas con datos de prueba...");

        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash('123456', salt);

        // 1. Usuarios
        await connection.query(`
            INSERT INTO usuarios (nombre, email, contrasena, biografia, ciudad) VALUES
            ('Jossy Tello', 'jossy@cesde.edu.co', ?, 'Instructor CESDE - Beat Plus Leader', 'Medellín'),
            ('Jane Doe', 'jane@mail.com', ?, 'Diseñadora UI/UX y amante del café', 'Bello'),
            ('John Doe', 'john@mail.com', ?, 'Desarrollador Junior buscando retos', 'Itagüí')
        `, [passHash, passHash, passHash]);

        // 2. Grupos
        await connection.query(`
            INSERT INTO grupos (nombre, descripcion, imagen_url) VALUES
            ('Diseñadores UI/UX', 'Comunidad para compartir tendencias visuales.', 'https://www.w3schools.com/w3images/avatar2.png'),
            ('Beat Plus Sport', 'Torneos de fútbol profesional y tecnología.', 'https://www.w3schools.com/w3images/avatar5.png'),
            ('Node.js Masters', 'Backend developers compartiendo conocimiento.', 'https://www.w3schools.com/w3images/avatar6.png')
        `);

        // 3. Publicaciones (Muro)
        await connection.query(`
            INSERT INTO publicaciones (usuario_id, texto, imagen_url) VALUES
            (1, '¡Bienvenidos al taller de Node.js! Hoy conectamos Frontend con la API.', 'https://www.w3schools.com/w3images/forest.jpg'),
            (2, 'Acabo de terminar el diseño del módulo de chat, ¿qué les parece?', 'https://www.w3schools.com/w3images/nature.jpg'),
            (3, 'Buscando equipo para el próximo torneo de Beat Plus Sport. ⚽', 'https://www.w3schools.com/w3images/lights.jpg')
        `);

        // 4. Interacciones (Likes)
        await connection.query(`
            INSERT INTO likes (publicacion_id, usuario_id) VALUES
            (1, 2), (1, 3), -- Likes al post de Jossy
            (2, 1),         -- Like de Jossy al post de Jane
            (3, 1), (3, 2)  -- Likes al post de John
        `);

        // 5. Comentarios
        await connection.query(`
            INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES
            (1, 2, '¡Excelente iniciativa, profe!'),
            (1, 3, 'Listo para aprender a usar Morgan y Cors.'),
            (2, 1, 'Los colores combinan perfecto con el tema dark.')
        `);

        // 6. Mensajes (Chat)
        await connection.query(`
            INSERT INTO mensajes (remitente_id, destinatario_id, contenido) VALUES
            (1, 2, 'Hola Jane, ¿viste los ajustes que le hice al controlador de publicaciones?'),
            (2, 1, 'Sí, Jossy. Quedó mucho más limpio usando el LEFT JOIN para contar likes.'),
            (3, 1, 'Profe, ¿me puede ayudar con la configuración del .env?')
        `);

        console.log("🚀 ¡Base de datos inicializada y poblada al 100%!");

    } catch (error) {
        console.error("❌ Error crítico durante la inicialización:", error);
        process.exitCode = 1;
    } finally {
        await connection.end();
    }
}

initializeDatabase();