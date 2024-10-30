const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Auth = require('../models/Auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nombre, cedula, correo, password, fechaNacimiento } = req.body;
    
    // Crear entrada de autenticación
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = new Auth({ correo, password: hashedPassword });
    await auth.save();

    // Crear usuario
    const user = new User({ 
      nombre, 
      cedula, 
      fechaNacimiento, 
      authId: auth._id 
    });
    await user.save();

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
    if (auth && await bcrypt.compare(password, auth.password)) {
      const user = await User.findOne({ authId: auth._id });
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