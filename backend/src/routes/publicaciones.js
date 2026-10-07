const express = require('express');
const router = express.Router();
const publicacionesController = require('../controllers/publicacionesController');

// Obtener todos los posts para el muro
router.get('/', publicacionesController.listarPosts);

// Crear un nuevo post desde el cuadro de texto "Status"
router.post('/', publicacionesController.crearPost);

// Eliminar un post propio
router.delete('/:id', publicacionesController.eliminarPost);

// Likes
router.post('/:id/like', publicacionesController.darLike);
router.get('/:id/likes', publicacionesController.contarLikes);

// Comentarios
router.post('/:id/comentarios', publicacionesController.comentar);
router.get('/:id/comentarios', publicacionesController.listarComentarios);

module.exports = router;