const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.registrar = async (req, res) => {
    const nombre = typeof req.body?.nombre === 'string'
        ? req.body.nombre.trim().replace(/\s+/g, ' ')
        : '';
    const email = typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const contrasena = req.body?.contrasena;

    if (nombre.length < 2 || nombre.length > 100) {
        return res.status(400).json({ msg: "Escribe un nombre de entre 2 y 100 caracteres" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ msg: "Escribe un correo electrónico válido" });
    }
    if (typeof contrasena !== 'string' || contrasena.length < 8) {
        return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(contrasena, salt);
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
            [nombre, email, passwordHash],
        );

        res.status(201).json({
            msg: "Usuario registrado con éxito",
            usuario: { id: result.insertId, nombre, email },
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: "El correo ya está registrado" });
        }
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ msg: "No se pudo registrar el usuario" });
    }
};

exports.login = async (req, res) => {
    const email = typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';
    const contrasena = req.body?.contrasena;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        || typeof contrasena !== 'string'
        || !contrasena) {
        return res.status(400).json({ msg: "Correo o contraseña incorrectos" });
    }

    try {
        const [rows] = await db.query(
            'SELECT id, nombre, email, contrasena FROM usuarios WHERE email = ?',
            [email],
        );
        if (rows.length === 0) {
            return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
        }

        const usuario = rows[0];
        const esCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esCorrecta) {
            return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
        }

        res.json({
            msg: "Inicio de sesión exitoso",
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
        });
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).json({ msg: "No se pudo iniciar sesión" });
    }
};