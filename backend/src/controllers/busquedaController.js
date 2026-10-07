const db = require('../config/db');

exports.buscar = async (req, res) => {
    const termino = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (termino.length < 2 || termino.length > 100) {
        return res.status(400).json({
            msg: "La búsqueda debe tener entre 2 y 100 caracteres",
        });
    }

    const terminoEscapado = termino.replace(/[\\%_]/g, '\\$&');
    const coincidencia = `%${terminoEscapado}%`;

    try {
        const [[usuarios], [publicaciones], [grupos]] = await Promise.all([
            db.query(
                `SELECT id, nombre, avatar
                 FROM usuarios
                 WHERE nombre LIKE ? OR email LIKE ?
                 ORDER BY nombre
                 LIMIT 8`,
                [coincidencia, coincidencia],
            ),
            db.query(
                `SELECT p.id, p.texto, u.nombre AS autor
                 FROM publicaciones p
                 JOIN usuarios u ON p.usuario_id = u.id
                 WHERE p.texto LIKE ?
                 ORDER BY p.fecha_creacion DESC
                 LIMIT 8`,
                [coincidencia],
            ),
            db.query(
                `SELECT id, nombre, descripcion
                 FROM grupos
                 WHERE nombre LIKE ? OR descripcion LIKE ?
                 ORDER BY nombre
                 LIMIT 8`,
                [coincidencia, coincidencia],
            ),
        ]);

        res.json({ usuarios, publicaciones, grupos });
    } catch (err) {
        console.error('Error al buscar contenido:', err);
        res.status(500).json({ msg: "No se pudo completar la búsqueda" });
    }
};
