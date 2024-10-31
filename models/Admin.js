// models/Admin.js
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);