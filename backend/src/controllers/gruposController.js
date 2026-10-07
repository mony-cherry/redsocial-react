const db = require('../config/db');

exports.listarGrupos = async (req, res) => {
    try {
        // DQL: Contando miembros por grupo (Agregación)
        const [rows] = await db.query(`
            SELECT g.*, COUNT(m.usuario_id) AS total_miembros
            FROM grupos g
            LEFT JOIN miembros_grupos m ON g.id = m.grupo_id
            GROUP BY g.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unirseAGrupo = async (req, res) => {
    const usuarioId = Number(req.body?.usuario_id);
    const grupoId = Number(req.body?.grupo_id);

    if (!Number.isSafeInteger(usuarioId) || usuarioId < 1
        || !Number.isSafeInteger(grupoId) || grupoId < 1) {
        return res.status(400).json({ msg: "Se requiere un usuario y un grupo válidos" });
    }

    try {
        await db.query(
            'INSERT INTO miembros_grupos (grupo_id, usuario_id) VALUES (?, ?)',
            [grupoId, usuarioId],
        );
        res.status(201).json({ msg: "Te uniste al grupo" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ msg: "Ya perteneces a este grupo" });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ msg: "No se encontró el usuario o el grupo" });
        }
        res.status(500).json({ error: err.message });
    }
};