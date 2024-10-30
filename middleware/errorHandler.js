const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    res.status(500).json({
      message: 'Ha ocurrido un error en el servidor',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  };
  
  module.exports = errorHandler;