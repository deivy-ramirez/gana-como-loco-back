const Code = require('../models/Code');
const CodeUsage = require('../models/CodeUsage');

exports.verifyCode = async (req, res, next) => {
  try {
    const { codigo, userId } = req.body;
    const code = await Code.findOne({ codigo, usado: false });
    if (code) {
      code.usado = true;
      code.fechaUso = new Date();
      await code.save();
      await CodeUsage.create({ codeId: code._id, userId });
      res.json({ message: 'Código válido', premio: code.premio });
    } else {
      res.status(400).json({ message: 'Código inválido o ya usado' });
    }
  } catch (error) {
    next(error);
  }
};