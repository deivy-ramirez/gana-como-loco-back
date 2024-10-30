const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Auth', authSchema);