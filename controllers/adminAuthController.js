// controllers/adminAuthController.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};

// Solo usar esta función una vez para crear el admin inicial
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = new Admin({ username, password });
    await admin.save();
    res.status(201).json({ message: 'Administrador registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro del administrador' });
  }
};