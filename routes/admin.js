// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthController = require('../controllers/adminAuthController');
const adminAuth = require('../middleware/adminAuth');

// Ruta de login para admin (no requiere autenticación)
router.post('/login', adminAuthController.login);

// Ruta para registrar admin (comentar o eliminar después de crear el primer admin)
router.post('/register', adminAuthController.register);

// Aplicar middleware de autenticación a todas las rutas protegidas
router.use(adminAuth);

// Rutas protegidas de administración
router.get('/users', adminController.getUsers);
router.get('/codes', adminController.getUserCodes);
router.get('/stats', adminController.getCodeStats);

module.exports = router;