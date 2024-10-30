const adminAuth = (req, res, next) => {
    const adminKey = req.header('x-admin-key');
  
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
  
    next();
  };
  
  module.exports = adminAuth;