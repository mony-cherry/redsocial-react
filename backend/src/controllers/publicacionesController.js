const db = require('../config/db');

exports.listarPosts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.id, p.texto, p.imagen_url, p.fecha_creacion,
                u.nombre AS autor, u.avatar,
                (SELECT COUNT(*) FROM likes l WHERE l.publicacion_id = p.id) AS total_likes,
                (SELECT COUNT(*) FROM comentarios c WHERE c.publicacion_id = p.id) AS total_comentarios
            FROM publicaciones p
            JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.fecha_creacion DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener el muro: " + err.message });
    }
};

exports.crearPost = async (req, res) => {
    const { usuario_id, texto, imagen_url } = req.body;
    try {
        await db.query('INSERT INTO publicaciones (usuario_id, texto, imagen_url) VALUES (?, ?, ?)',
        [usuario_id, texto, imagen_url]);
        res.status(201).json({ msg: "Publicación exitosa" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarPost = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM publicaciones WHERE id = ?', [id]);
        res.json({ msg: "Publicación eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Dar o quitar Like (Toggle)
exports.darLike = async (req, res) => {
    const { id } = req.params; // ID de la publicación
    const { usuario_id } = req.body;
    try {
        // Intentamos insertar, si ya existe el Unique Key, lo capturamos para "quitar" el like
        await db.query('INSERT INTO likes (publicacion_id, usuario_id) VALUES (?, ?)', [id, usuario_id]);
        res.json({ msg: "Like agregado" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            await db.query('DELETE FROM likes WHERE publicacion_id = ? AND usuario_id = ?', [id, usuario_id]);
            return res.json({ msg: "Like eliminado" });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.contarLikes = async (req, res) => {
    const { id } = req.params;
    try {
        const [[resultado]] = await db.query(
            'SELECT COUNT(*) AS total_likes FROM likes WHERE publicacion_id = ?',
            [id],
        );
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listar comentarios con el nombre de quien comentó
exports.listarComentarios = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT c.*, u.nombre AS autor
            FROM comentarios c
            JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.publicacion_id = ?
            ORDER BY c.fecha_comentario ASC`, [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Agregar un comentario
exports.comentar = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, contenido } = req.body;
    try {
        await db.query('INSERT INTO comentarios (publicacion_id, usuario_id, contenido) VALUES (?, ?, ?)',
        [id, usuario_id, contenido]);
        res.status(201).json({ msg: "Comentario publicado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};