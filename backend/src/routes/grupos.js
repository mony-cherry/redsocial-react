const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');

// GET para grupos.html (DQL con agregaciones sugerido en el controlador)
router.get('/', gruposController.listarGrupos);
router.post('/unirse', gruposController.unirseAGrupo);

module.exports = router;