// controllers/adminController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createAdmin = async (req, res) => {
  const { nombre, cedula, correo, fechaNacimiento, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser  = await User.findOne({ correo });
    if (existingUser ) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo administrador
    const newAdmin = new User({
      nombre,
      cedula,
      correo,
      fechaNacimiento,
      password: hashedPassword,
      isAdmin: true // Marcar este usuario como administrador
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Administrador creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el administrador', error });
  }
};