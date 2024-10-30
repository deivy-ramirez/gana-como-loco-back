const Code = require('../models/Code');

exports.verifyCode = async (req, res, next) => {
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
    next(error);
  }
};

exports.generateCodes = async (req, res, next) => {
  try {
    const totalCodes = 1000;
    const winningCodes = 400;
    const prizes = [
      { amount: 1000000, count: 50 },
      { amount: 200000, count: 150 },
      { amount: 50000, count: 200 }
    ];

    let codes = [];

    // Generar códigos ganadores
    for (let prize of prizes) {
      for (let i = 0; i < prize.count; i++) {
        codes.push({
          codigo: Math.floor(100 + Math.random() * 900).toString(),
          premio: prize.amount
        });
      }
    }

    // Generar códigos no ganadores
    for (let i = 0; i < totalCodes - winningCodes; i++) {
      codes.push({
        codigo: Math.floor(100 + Math.random() * 900).toString(),
        premio: 0
      });
    }

    // Mezclar los códigos
    codes = codes.sort(() => Math.random() - 0.5);

    // Guardar en la base de datos
    await Code.insertMany(codes);
    res.status(201).json({ message: 'Códigos generados y guardados exitosamente' });
  } catch (error) {
    next(error);
  }
};