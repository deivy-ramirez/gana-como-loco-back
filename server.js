const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Importar modelos
const User = require('./models/User');
const Code = require('./models/Code');

// Importar rutas
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Gana como Loco funcionando correctamente');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));