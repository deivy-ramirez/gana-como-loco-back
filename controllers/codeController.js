const Code = require('../models/Code');

const verifyCode = async (req, res, next) => {
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

exports.verifyCode = verifyCode;