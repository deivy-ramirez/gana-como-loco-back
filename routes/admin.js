// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Ruta para el inicio de sesión del administrador
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar el admin por username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Enviar respuesta exitosa
    res.json({
      message: 'Inicio de sesión exitoso',
      admin: {
        id: admin._id,
        username: admin.username,
        nombre: admin.nombre,
        correo: admin.correo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
});

module.exports = router;