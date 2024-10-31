// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); // Asegúrate de que la ruta sea correcta

router.post('/register', async (req, res) => {
  try {
    const { username, nombre, cedula, correo, password, fechaNacimiento } = req.body;

    // Verificar si el administrador ya existe
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { username: username },
        { correo: correo },
        { cedula: cedula }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'El administrador ya existe (username, correo o cédula ya registrados)' 
      });
    }

    // Crear nuevo administrador
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      nombre,
      cedula,
      correo,
      password: hashedPassword,
      fechaNacimiento
    });

    await newAdmin.save();

    res.status(201).json({ 
      message: 'Administrador registrado exitosamente',
      admin: {
        username: newAdmin.username,
        nombre: newAdmin.nombre,
        correo: newAdmin.correo
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error al registrar administrador',
      error: error.message 
    });
  }
});

module.exports = router;