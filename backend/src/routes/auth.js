const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// /api/auth/register
router.post('/register', authController.registrar);

// /api/auth/login
router.post('/login', authController.login);

module.exports = router;