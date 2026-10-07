const express = require('express');
const router = express.Router();
const mensajesController = require('../controllers/mensajesController');

router.get('/:emisorId/:receptorId', mensajesController.obtenerChat);
router.post('/', mensajesController.enviarMensaje);

module.exports = router;