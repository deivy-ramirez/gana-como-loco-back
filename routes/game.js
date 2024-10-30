const express = require('express');
const Code = require('../models/Code');
const generateCodes = require('../utils/codeGenerator');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// ... tus rutas existentes ...

router.post('/generate-codes', adminAuth, async (req, res) => {
  try {
    const result = await generateCodes();
    res.json(result);
  } catch (error) {
    console.error('Error al generar códigos:', error);
    res.status(500).json({ message: 'Error al generar códigos' });
  }
});

router.get('/all-codes', adminAuth, async (req, res) => {
  try {
    const codes = await Code.find();
    res.json(codes);
  } catch (error) {
    console.error('Error al obtener códigos:', error);
    res.status(500).json({ message: 'Error al obtener códigos' });
  }
});

module.exports = router;