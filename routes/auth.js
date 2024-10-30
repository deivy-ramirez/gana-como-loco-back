const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { nombre, cedula, correo, password, fechaNacimiento } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nombre, cedula, correo, password: hashedPassword, fechaNacimiento });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { correo, password } = req.body;
    const user = await User.findOne({ correo });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: 'Inicio de sesión exitoso', userId: user._id });
    } else {
      res.status(400).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;