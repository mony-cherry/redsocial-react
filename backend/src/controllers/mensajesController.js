const db = require('../config/db');

exports.obtenerChat = async (req, res) => {
    const { emisorId, receptorId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM mensajes WHERE (remitente_id = ? AND destinatario_id = ?) OR (remitente_id = ? AND destinatario_id = ?) ORDER BY fecha ASC',
            [emisorId, receptorId, receptorId, emisorId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.enviarMensaje = async (req, res) => {
    const { remitente_id, destinatario_id, contenido } = req.body;
    try {
        await db.query('INSERT INTO mensajes (remitente_id, destinatario_id, contenido) VALUES (?, ?, ?)',
        [remitente_id, destinatario_id, contenido]);
        res.status(201).json({ msg: "Mensaje enviado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};