// routes/admin.js
const express = require('express');
const router = express.Router();
//const AdminController = require('../controllers/adminController');

// Ruta para crear un nuevo administrador
//router.post('/create-admin', AdminController.createAdmin);

// En tu archivo de rutas del backend
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
        console.log('Admin existente:', existingAdmin); // Para debugging
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
      console.log('Nuevo admin creado:', newAdmin); // Para debugging
  
      res.status(201).json({ 
        message: 'Administrador registrado exitosamente',
        admin: {
          username: newAdmin.username,
          nombre: newAdmin.nombre,
          correo: newAdmin.correo
        }
      });
    } catch (error) {
      console.error('Error en registro:', error); // Para debugging
      res.status(500).json({ 
        message: 'Error al registrar administrador',
        error: error.message 
      });
    }
  });

module.exports = router;