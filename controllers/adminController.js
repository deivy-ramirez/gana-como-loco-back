// controllers/adminController.js
const User = require('../models/User');
const Code = require('../models/Code');
const Auth = require('../models/Auth');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.getUserCodes = async (req, res) => {
  try {
    const codes = await Code.find({ usado: true })
      .populate('usadoPor', 'nombre cedula')
      .select('-__v')
      .sort('-_id');

    const formattedCodes = codes.map(code => ({
      codigo: code.codigo,
      premio: code.premio,
      ganador: code.premio > 0 ? 'Sí' : 'No',
      usuario: code.usadoPor ? code.usadoPor.nombre : 'N/A',
      cedula: code.usadoPor ? code.usadoPor.cedula : 'N/A',
      fechaUso: code._id.getTimestamp()
    }));

    res.json(formattedCodes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener códigos' });
  }
};

exports.getCodeStats = async (req, res) => {
  try {
    const totalCodes = await Code.countDocuments();
    const usedCodes = await Code.countDocuments({ usado: true });
    const winningCodesUsed = await Code.countDocuments({ usado: true, premio: { $gt: 0 } });
    
    const stats = {
      totalCodes,
      usedCodes,
      availableCodes: totalCodes - usedCodes,
      winningCodesUsed
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};