const Code = require('../models/Code');
const CodeUsage = require('../models/CodeUsage');

exports.verifyCode = async (req, res, next) => {
  try {
    const { codigo, userId } = req.body;
    
    // Agregamos logs para debuggear
    console.log('Datos recibidos:', { codigo, userId });

    // Verificar el código primero
    const code = await Code.findOne({ codigo, usado: false });
    
    if (!code) {
      return res.status(400).json({ message: 'Código inválido o ya usado' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'Debes iniciar sesión para canjear el código' });
    }

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
    
    res.json({ 
      message: 'Código válido', 
      premio: code.premio 
    });

  } catch (error) {
    console.error('Error al verificar código:', error);
    next(error);
  }
};