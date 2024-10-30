const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Auth = require('../models/Auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nombre, cedula, correo, password, fechaNacimiento } = req.body;

    // Crear usuario
    const user = new User({ 
      nombre, 
      cedula, 
      fechaNacimiento
    });
    await user.save();

    // Crear entrada de autenticación
    const hashedPassword = await bcryptjs.hash(password, 10);
    const auth = new Auth({ 
      userId: user._id,
      correo, 
      password: hashedPassword 
    });
    await auth.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    const auth = await Auth.findOne({ correo });
    if (auth && await bcryptjs.compare(password, auth.password)) {
      const user = await User.findById(auth.userId);
      res.json({ 
        message: 'Inicio de sesión exitoso', 
        userId: user._id 
      });
    } else {
      res.status(400).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
});

module.exports = router;