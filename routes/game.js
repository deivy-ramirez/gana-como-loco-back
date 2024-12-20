const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// Ruta para verificar códigos
router.post('/verify-code', codeController.verifyCode);

// Ruta para generar códigos (mantener comentada en producción)
/*
router.post('/generate-codes', async (req, res) => {
  try {
    const result = await generateCodes();
    res.json(result);
  } catch (error) {
    console.error('Error al generar códigos:', error);
    res.status(500).json({ message: 'Error al generar códigos' });
  }
});
*/

module.exports = router;