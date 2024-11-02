// controllers/codeController.js
const CodeUsage = require('../models/CodeUsage');

exports.verifyCode = async (req, res, next) => {
  try {
    const { codigo, userId } = req.body;
    
    // Verificar que el userId existe
    if (!userId) {
      return res.status(400).json({ message: 'Usuario no especificado' });
    }

    const code = await Code.findOne({ codigo, usado: false });
    
    if (code) {
      // Crear un nuevo registro en CodeUsage
      const newCodeUsage = new CodeUsage({
        codeId: code._id,
        userId: userId,
        fechaUso: new Date()
      });
      await newCodeUsage.save();

      // Marcar el código como usado
      code.usado = true;
      await code.save();
      
      res.json({ message: 'Código válido', premio: code.premio });
    } else {
      res.status(400).json({ message: 'Código inválido o ya usado' });
    }
  } catch (error) {
    console.error('Error al verificar código:', error);
    next(error);
  }
};