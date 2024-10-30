const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://gana-como-loco-front.vercel.app/'
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.send('API de Gana como Loco funcionando correctamente');
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}

module.exports = app;