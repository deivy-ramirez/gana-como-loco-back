// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');    // Añade esta línea
const Auth = require('../models/Auth');    // Añade esta línea
const Code = require('../models/Code');    // Añade esta línea

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

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    const usersWithAuth = await Promise.all(
      users.map(async (user) => {
        const auth = await Auth.findOne({ userId: user._id });
        return {
          ...user._doc,
          correo: auth ? auth.correo : null
        };
      })
    );
    res.json(usersWithAuth);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Obtener todos los códigos usados con información del usuario
router.get('/codes', async (req, res) => {
  try {
    const codes = await Code.find({ usado: true })
      .populate({
        path: 'usadoPor',
        model: 'User',
        select: 'nombre cedula'
      })
      .sort({ fechaUso: -1 }); // Ordenar por fecha de uso, más reciente primero

    const codesWithUserInfo = codes.map(code => ({
      _id: code._id,
      codigo: code.codigo,
      premio: code.premio,
      fechaUso: code.fechaUso,
      usuario: code.usadoPor ? {
        nombre: code.usadoPor.nombre,
        cedula: code.usadoPor.cedula
      } : null
    }));

    res.json(codesWithUserInfo);
  } catch (error) {
    console.error('Error al obtener códigos:', error);
    res.status(500).json({ message: 'Error al obtener códigos' });
  }
});

// Nueva ruta para estadísticas
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCodes = await Code.countDocuments();
    const usedCodes = await Code.countDocuments({ usado: true });
    const totalPrizeAmount = await Code.aggregate([
      { $match: { usado: true } },
      { $group: { _id: null, total: { $sum: "$premio" } } }
    ]);

    res.json({
      totalUsers,
      totalCodes,
      usedCodes,
      totalPrizeAmount: totalPrizeAmount[0]?.total || 0
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

module.exports = router;