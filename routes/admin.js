// routes/admin.js
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

// Ruta para crear un nuevo administrador
router.post('/create-admin', AdminController.createAdmin);

module.exports = router;