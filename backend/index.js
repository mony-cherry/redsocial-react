const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Registro de peticiones
require('dotenv').config();

// Importar rutas
const usuariosRoutes = require('./src/routes/usuarios');
const publicacionesRoutes = require('./src/routes/publicaciones');
const gruposRoutes = require('./src/routes/grupos');
const mensajesRoutes = require('./src/routes/mensajes');
const authRoutes = require('./src/routes/auth');
const busquedaRoutes = require('./src/routes/busqueda');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // Permite que el Frontend se conecte
app.use(morgan('dev')); // Imprime en consola: GET /api/publicaciones 200 5ms
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/busqueda', busquedaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/mensajes', mensajesRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ msg: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor  RedSocial listo en http://localhost:${PORT}`);
  console.log(`📝 Modo de desarrollo activo con Morgan y Nodemon`);
});

// Al final de index.js
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Algo salió mal en el servidor de RedSocial!' });
});