const express = require('express');
const Code = require('../models/Code');
const router = express.Router();

router.post('/verify-code', async (req, res) => {
  try {
    const { codigo, userId } = req.body;
    const code = await Code.findOne({ codigo, usado: false });
    if (code) {
      code.usado = true;
      code.usadoPor = userId;
      await code.save();
      res.json({ message: 'Código válido', premio: code.premio });
    } else {
      res.status(400).json({ message: 'Código inválido o ya usado' });
    }
  } catch (error) {
    console.error('Error al verificar el código:', error);
    res.status(500).json({ message: 'Error al verificar el código' });
  }
});

module.exports = router;