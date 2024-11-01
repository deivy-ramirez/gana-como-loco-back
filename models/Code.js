const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  premio: { type: Number, required: true },
  usado: { type: Boolean, default: false },
  usadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaUso: { type: Date }
});

module.exports = mongoose.model('Code', codeSchema);