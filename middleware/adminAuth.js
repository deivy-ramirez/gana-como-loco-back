// middleware/adminAuth.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const adminAuth = async (req, res, next) => {
  try {
    const { username, password } = req.headers;
    if (!username || !password) {
      return res.status(401).json({ message: 'Credenciales no proporcionadas' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Error de autenticación' });
  }
};

module.exports = adminAuth;