const express = require('express');
const Code = require('../models/Code');
const verifyCode = require('../controllers/codeController');
const router = express.Router();

/*router.post('/generate-codes', async (req, res) => {
  try {
    const result = await generateCodes();
    res.json(result);
  } catch (error) {
    console.error('Error al generar códigos:', error);
    res.status(500).json({ message: 'Error al generar códigos' });
  }
});*/

module.exports = router;