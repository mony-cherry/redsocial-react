const db = require('../config/db');

exports.obtenerPerfil = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ msg: "Usuario no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.actualizarConfiguracion = async (req, res) => {
    const { id } = req.params;
    const { biografia, ciudad, genero } = req.body;
    try {
        await db.query('UPDATE usuarios SET biografia = ?, ciudad = ?, genero = ? WHERE id = ?',
        [biografia, ciudad, genero, id]);
        res.json({ msg: "Configuración actualizada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};