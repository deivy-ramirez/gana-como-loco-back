const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true }
});

module.exports = mongoose.model('User', userSchema);